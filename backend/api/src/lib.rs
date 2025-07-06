use std::{
    sync::Arc,
    time::{Duration, Instant},
};

use ::serde::{Deserialize, Serialize};
use rocket::{
    Build, Responder, Rocket, State,
    fs::{FileServer, NamedFile},
    get, post, routes,
    serde::json::Json,
};
use rocket_okapi::{
    okapi::{
        openapi3::{OpenApi, Response, Responses},
        schemars,
    },
    openapi, openapi_get_spec,
    response::OpenApiResponderInner,
};
use rocket_cors::{AllowedOrigins, CorsOptions};
use std::collections::HashSet;
use tokio::sync::RwLock;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use yahoo_finance_api::YahooConnector;

#[derive(Serialize, Deserialize, schemars::JsonSchema, Debug)]
pub struct UserCredentials {
    pub email: String,
    pub password_hash: String,
}

#[openapi(tag = "Landing")]
#[get("/")]
async fn landing() -> Option<NamedFile> {
    if cfg!(debug_assertions) {
        NamedFile::open("../index.html").await.ok()
    } else {
        NamedFile::open("./static/index.html").await.ok()
    }
}

#[openapi(tag = "User")]
#[post("/api/user/login", data = "<creds>")]
// pub async fn login(db: &DB, creds: Json<UserCredentials>) -> &'static str {
pub async fn login(
    db: &State<sled::Db>,
    creds: Json<UserCredentials>,
    // cookies: &CookieJar<'_>,
) -> Result<(), BackendError> {
    let users_tree = db.open_tree("users")?;

    let Some(password) = users_tree.get(&creds.email)? else {
        tracing::info!("User with email {} does not exist", creds.email);
        return Err(BackendError::EmailExists("Username does not exist".into()));
    };

    if password != creds.password_hash.as_bytes() {
        tracing::info!("Incorrect password for email {}", creds.email);
        return Err(BackendError::EmailExists("Incorrect password".into()));
    }

    Ok(())
}

#[openapi(tag = "User")]
#[post("/api/user/signup", data = "<creds>")]
// pub async fn login(db: &DB, creds: Json<UserCredentials>) -> &'static str {
pub async fn signup(
    db: &State<sled::Db>,
    creds: Json<UserCredentials>,
) -> Result<(), BackendError> {
    let users_tree = db.open_tree("users")?;
    if users_tree.contains_key(&creds.email)? {
        tracing::info!("User with email {} already exists", creds.email);
        return Err(BackendError::EmailExists("Email already exists".into()));
    }
    users_tree.insert(creds.email.clone(), creds.password_hash.as_bytes())?;
    Ok(())
}

#[openapi(tag = "User")]
#[post("/api/user/delete")]
pub async fn delete() -> &'static str {
    "Hello, world!"
}

// #[openapi(tag = "Data")]
// #[get("/api/portfolio", data = "<token>")]
// pub async fn get_portfolio(token: Json<String>) -> &'static str {
//     "Hello, world!"
// }
#[derive(Serialize, Deserialize, schemars::JsonSchema, Debug, Clone)]
pub struct MarketOverviewItem {
    pub name: String,
    pub short: String,
    pub sector: String,
    pub current_price: String,
    pub change: f64,
    pub high: f64,
    pub low: f64,
    pub symbol: String,
    pub volume: u64,
    pub news_article: Option<NewsItem>,
    pub quotes: Vec<Quote>,
}

#[derive(Serialize, Deserialize, schemars::JsonSchema, Debug, Clone)]
pub struct Quote {
    close: f64,
    timestamp: i64,
}

#[openapi(tag = "Data")]
#[get("/api/data/market-overview")]
pub async fn get_market_overview() -> Result<Json<Vec<MarketOverviewItem>>, BackendError> {
    lazy_static::lazy_static! {
        static ref CACHE: Arc<RwLock<Option<Vec<MarketOverviewItem>>>> = Arc::new(RwLock::new(None));
        static ref CACHE_EXPIRATION_TIMER: Arc<RwLock<Instant>> = Arc::new(RwLock::new(Instant::now()));
    }

    if let Some(res) = &*CACHE.read().await {
        tracing::trace!("Cache exists");
        //                                                                         ____ Expire every 10 minutes
        if CACHE_EXPIRATION_TIMER.read().await.elapsed() < Duration::from_secs_f64(600.) {
            tracing::info!("Using cached values");
            return Ok(Json(res.clone()));
        }
        tracing::info!("Cache is expired");
    }
    tracing::info!("Fetching data");
    // List of stock tickers
    let tickers = vec!["XMR-USD", "MDB", "GTLB", "CFLT"];

    // Create a YahooFinance client
    let provider = YahooConnector::new()?;

    let mut res = vec![];

    for ticker in tickers {
        // Fetch quote asynchronously
        let quotes = provider.get_latest_quotes(ticker, "1wk").await?;
        let quote = quotes.last_quote()?;
        let metadata = quotes.metadata()?;

        let open_price = quote.open;
        let close_price = quote.close;

        let percent_diff = ((close_price - open_price) / open_price) * 100.0;

        tracing::trace!(
            "Open: ${:.1}, Close: ${:.1}, % Diff: {:.1}%",
            open_price,
            close_price,
            percent_diff
        );

        res.push(MarketOverviewItem {
            symbol: metadata.symbol,
            name: metadata
                .long_name
                .or(metadata.short_name)
                .unwrap_or(metadata.exchange_name),
            sector: metadata.instrument_type,
            short: ticker.to_owned(),
            current_price: format!("${close_price:.1}"),
            change: percent_diff,
            high: quote.high,
            low: quote.low,
            volume: quote.volume,
            quotes: quotes
                .quotes()?
                .into_iter()
                .map(|q| Quote {
                    close: q.close,
                    timestamp: q.timestamp,
                })
                .collect(),
            news_article: get_news(Some(ticker.to_owned()))
                .await?
                .0
                .first()
                .map(|e| (*e).clone()),
        });
    }

    *CACHE_EXPIRATION_TIMER.write().await = Instant::now();
    CACHE.write().await.replace(res.clone());

    Ok(Json(res))
}

#[derive(Serialize, Deserialize, schemars::JsonSchema, Debug, Default, Clone)]
pub struct NewsItem {
    pub id: String,
    pub title: String,
    pub publisher: String,
    pub source: String,
    pub date: String,
}

#[openapi(tag = "Data")]
#[get("/api/data/news?<ticker>")]
pub async fn get_news(ticker: Option<String>) -> Result<Json<Vec<NewsItem>>, BackendError> {
    lazy_static::lazy_static! {
        static ref CACHE: Arc<RwLock<Option<Vec<NewsItem>>>> = Arc::new(RwLock::new(None));
        static ref CACHE_EXPIRATION_TIMER: Arc<RwLock<Instant>> = Arc::new(RwLock::new(Instant::now()));
    }
    if let Some(res) = &*CACHE.read().await {
        tracing::trace!("Cache exists");
        if ticker.is_none() //                                                         ____ Expire every 10 minutes
            && CACHE_EXPIRATION_TIMER.read().await.elapsed() < Duration::from_secs_f64(600.)
        {
            tracing::info!("Using cached values");
            return Ok(Json(res.clone()));
        }
        tracing::info!("Cache has expired");
    }
    tracing::info!("Fetching data");
    // Create a YahooFinance client
    let provider = YahooConnector::new().unwrap();

    let searchres = provider
        .search_ticker(&ticker.clone().unwrap_or("*".to_owned()))
        .await?;

    let news: Vec<NewsItem> = searchres
        .news
        .into_iter()
        .map(|yni| NewsItem {
            id: yni.uuid,
            title: yni.title,
            publisher: yni.publisher,
            source: yni.link,
            date: yni.provider_publish_time.to_string(),
        })
        .collect();

    if ticker.is_none() {
        *CACHE_EXPIRATION_TIMER.write().await = Instant::now();
        CACHE.write().await.replace(news.clone());
    }
    Ok(Json(news))
}

pub fn get_spec() -> OpenApi {
    openapi_get_spec![
        get_news,
        delete,
        signup,
        login,
        get_market_overview,
        // landing,
    ]
}
use tracing_subscriber::filter::EnvFilter;

pub async fn launch() -> Result<Rocket<Build>, rocket_cors::Error> {
    tracing_subscriber::registry()
        .with(tracing_subscriber::fmt::layer())
        .with(EnvFilter::from_default_env())
        .init();

    // Configure CORS
    let cors = CorsOptions::default()
        .allowed_origins(AllowedOrigins::some_exact(&[
            "https://yausma.org",
            "https://www.yausma.org",
            "http://localhost:8080",  // Development web server
            "http://127.0.0.1:8080",  // Development web server
            "http://localhost:3000",  // Common dev server port
            "http://127.0.0.1:3000",  // Common dev server port
            "http://localhost:5000",  // Another common dev port
            "http://127.0.0.1:5000",  // Another common dev port
            "http://localhost:8000",  // Backend port (for direct access)
            "http://127.0.0.1:8000",  // Backend port (for direct access)
        ]))
        .allowed_methods({
            let mut methods = HashSet::new();
            methods.insert("GET".parse().unwrap());
            methods.insert("POST".parse().unwrap());
            methods.insert("PUT".parse().unwrap());
            methods.insert("DELETE".parse().unwrap());
            methods.insert("OPTIONS".parse().unwrap());
            methods
        })
        .allowed_headers(rocket_cors::AllowedHeaders::some(&[
            "Accept",
            "Accept-Language",
            "Content-Type",
            "Content-Language",
            "Authorization",
            "X-Requested-With",
        ]))
        .allow_credentials(true)
        .to_cors()?;

    Ok(rocket::build()
        .attach(cors)
        .mount(
            "/",
            FileServer::from(if cfg!(debug_assertions) {
                "../web"
            } else {
                "./static"
            }),
        )
        .manage(sled::open("/tmp/YAUSMA_DB").expect("open"))
        .mount(
            "/",
            routes![
                get_news,
                delete,
                signup,
                login,
                get_market_overview,
                landing,
                // static_files
            ],
        ))
}

#[derive(Responder)]
pub enum BackendError {
    #[response(status = 404)]
    Unauthorized(String),
    #[response(status = 409)]
    EmailExists(String), // "Email already registered"
    #[response(status = 500)]
    Internal(String),
}

impl From<sled::Error> for BackendError {
    fn from(value: sled::Error) -> Self {
        Self::Internal(value.to_string())
    }
}
impl From<yahoo_finance_api::YahooError> for BackendError {
    fn from(value: yahoo_finance_api::YahooError) -> Self {
        Self::Internal(value.to_string())
    }
}

impl OpenApiResponderInner for BackendError {
    fn responses(
        gn: &mut rocket_okapi::r#gen::OpenApiGenerator,
    ) -> rocket_okapi::Result<rocket_okapi::okapi::openapi3::Responses> {
        let _ = gn;
        let mut responses = Responses::default();
        responses.responses.insert(
            "404".to_string(),
            rocket_okapi::okapi::openapi3::RefOr::Object(Response {
                description: "Unauthorized access".to_string(),
                ..Default::default()
            }),
        );
        responses.responses.insert(
            "500".to_string(),
            rocket_okapi::okapi::openapi3::RefOr::Object(Response {
                description: "Internal server error".to_string(),
                ..Default::default()
            }),
        );
        responses.responses.insert(
            "409".to_string(),
            rocket_okapi::okapi::openapi3::RefOr::Object(Response {
                description: "Email already registered".to_string(),
                ..Default::default()
            }),
        );
        Ok(responses)
    }
}

// impl OpenApiResponderInner for BackendError {
//     fn responses(
//         gn: &mut rocket_okapi::r#gen::OpenApiGenerator,
//     ) -> rocket_okapi::Result<rocket_okapi::okapi::openapi3::Responses> {
//         todo!()
//     }
// }

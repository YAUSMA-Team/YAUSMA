use ::serde::{Deserialize, Serialize};
use rocket::{
    Build, Responder, Rocket, State,
    fs::FileServer,
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
use yahoo_finance_api::YahooConnector;

#[derive(Serialize, Deserialize, schemars::JsonSchema, Debug)]
pub struct UserCredentials {
    pub email: String,
    pub password_hash: String,
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

    dbg!(&creds);
    let Some(password) = users_tree.get(&creds.email)? else {
        dbg!("Does not exist");
        return Err(BackendError::EmailExists("Username does not exist".into()));
    };

    dbg!(&password);
    if password != dbg!(creds.password_hash.as_bytes()) {
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
    // cookies: &CookieJar<'_>,
) -> Result<(), BackendError> {
    let users_tree = db.open_tree("users")?;
    if users_tree.contains_key(&creds.email)? {
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
#[derive(Serialize, Deserialize, schemars::JsonSchema, Debug)]
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
}

#[openapi(tag = "Data")]
#[get("/api/data/market-overview")]
pub async fn get_market_overview() -> Result<Json<Vec<MarketOverviewItem>>, BackendError> {
    // List of stock tickers
    let tickers = vec!["XMR-USD", "MDB", "GTLB", "CFLT"];

    // Create a YahooFinance client
    let provider = YahooConnector::new().unwrap();

    let mut res = vec![];

    for ticker in tickers {
        // Fetch quote asynchronously
        let quotes = provider.get_latest_quotes(ticker, "1d").await?;
        let quote = quotes.last_quote()?;
        let metadata = quotes.metadata()?;

        let open_price = quote.open;
        let close_price = quote.close;

        let percent_diff = ((close_price - open_price) / open_price) * 100.0;

        println!(
            "Open: ${:.2}, Close: ${:.2}, % Diff: {:.2}%",
            open_price, close_price, percent_diff
        );

        res.push(MarketOverviewItem {
            symbol: metadata.symbol,
            name: metadata
                .long_name
                .or(metadata.short_name)
                .unwrap_or(metadata.exchange_name),
            sector: metadata.instrument_type,
            short: ticker.to_owned(),
            current_price: format!("${close_price}"),
            change: percent_diff,
            high: quote.high,
            low: quote.low,
            volume: quote.volume,
            news_article: get_news(Some(ticker.to_owned()))
                .await?
                .0
                .first()
                .map(|e| (*e).clone()),
        });

        // Calculate % difference
        // let percent_diff = ((current_price - prev_close) / prev_close) * 100.0;

        // println!(
        //     "Ticker: {}, Price: ${:.2}, % Diff: {:.2}%",
        //     ticker, current_price, percent_diff
        // );
    }

    // todo!()
    Ok(Json(res))
    // provider.get_latest_quotes(Status::Ok, Json(vec![1, 2, 3]))
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
    // Create a YahooFinance client
    let provider = YahooConnector::new().unwrap();

    let searchres = provider
        .search_ticker(&ticker.unwrap_or("*".to_owned()))
        .await?;
    Ok(Json(
        searchres
            .news
            .into_iter()
            .map(|yni| NewsItem {
                id: yni.uuid,
                title: yni.title,
                publisher: yni.publisher,
                source: yni.link,
                date: yni.provider_publish_time.to_string(),
            })
            .collect(),
    ))
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

pub async fn launch() -> Rocket<Build> {
    rocket::build()
        .mount("/", FileServer::from("../web"))
        .manage(sled::open("/tmp/YAUSMA_DB").expect("open"))
        .mount(
            "/",
            routes![
                get_news,
                delete,
                signup,
                login,
                get_market_overview,
                // static_files
            ],
        )
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
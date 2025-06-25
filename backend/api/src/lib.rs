use ::serde::{Deserialize, Serialize};
use derive_more::Into;
use rocket::{
    Build, Request, Responder, Rocket, State, get,
    http::{Cookie, CookieJar, Status},
    outcome::Outcome,
    post,
    request::{self, FromRequest},
    response::status,
    routes,
    serde::json::Json,
};
use rocket_okapi::{
    okapi::{
        openapi3::{OpenApi, Response, Responses},
        schemars,
    },
    openapi, openapi_get_spec,
    response::{OpenApiResponder, OpenApiResponderInner},
};
type DB = State<sled::Db>;

#[derive(Serialize, Deserialize, schemars::JsonSchema)]
pub struct UserCredentials {
    pub email: String,
    pub password_hash: String,
}

#[openapi(tag = "User")]
#[post("/login", data = "<creds>")]
// pub async fn login(db: &DB, creds: Json<UserCredentials>) -> &'static str {
pub async fn login(
    db: &State<sled::Db>,
    creds: Json<UserCredentials>,
    cookies: &CookieJar<'_>,
) -> Result<(), BackendError> {
    let users_tree = db.open_tree("users")?;
    if users_tree.contains_key(&creds.email)? {
        return Err(BackendError::EmailExists("Email already exists".into()));
    }
    users_tree.insert(creds.email.clone(), creds.password_hash.as_bytes())?;
    Ok(())
}

#[openapi(tag = "User")]
#[post("/signup")]
pub async fn signup() -> &'static str {
    "Hello, world!"
}

#[openapi(tag = "User")]
#[post("/user/delete")]
pub async fn delete() -> &'static str {
    "Hello, world!"
}

#[openapi(tag = "Data")]
#[get("/get/news")]
pub async fn get_news() -> &'static str {
    "Hello, world!"
}

#[openapi(tag = "Data")]
#[get("/api/portfolio", data = "<token>")]
pub async fn get_portfolio(token: Json<String>) -> &'static str {
    "Hello, world!"
}
/// Get prices
#[openapi(tag = "Data")]
#[get("/get/charts")]
pub async fn get_charts() -> (Status, Json<Vec<u32>>) {
    (Status::Ok, Json(vec![1, 2, 3]))
}

pub fn get_spec() -> OpenApi {
    openapi_get_spec![get_charts, get_news, delete, signup, login]
}

pub async fn launch() -> Rocket<Build> {
    rocket::build()
        .manage(sled::open("/tmp/YAUSMA_DB").expect("open"))
        .mount("/", routes![get_charts, get_news, delete, signup, login])
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

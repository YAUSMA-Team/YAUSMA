use ::serde::{Deserialize, Serialize};
use rocket::{
    Build, Rocket, State, get, http::Status, post, response::status, routes, serde::json::Json,
};
use rocket_okapi::{
    okapi::{openapi3::OpenApi, schemars},
    openapi, openapi_get_spec,
};
type DB = State<sled::Db>;

#[derive(Serialize, Deserialize, schemars::JsonSchema)]
pub struct UserCredentials {
    pub username_sha: String,
    pub password_sha: String,
}
#[openapi(tag = "User")]
#[post("/login", data = "<creds>")]
pub async fn login(db: &DB, creds: Json<UserCredentials>) -> Result<(), status::Conflict<String>> {
    // if db.contains_key(creds.username_sha)? {
    //     return Err(status::Conflict("Username is already taken".into()));
    // }
    // creds.username_sha
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
/// Get prices
#[openapi(tag = "Data")]
#[get("/get/prices")]
pub async fn get_prices() -> (Status, Json<Vec<u32>>) {
    (Status::Ok, Json(vec![1, 2, 3]))
}

pub fn get_spec() -> OpenApi {
    openapi_get_spec![get_prices, get_news, delete, signup, login]
}

pub async fn launch() -> Rocket<Build> {
    rocket::build()
        .manage(sled::open("/tmp/YAUSMA_DB").expect("open"))
        .mount("/", routes![get_prices, get_news, delete, signup, login])
}

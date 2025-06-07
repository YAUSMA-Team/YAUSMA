use rocket::{
    Build, Rocket, get,
    http::{ContentType, Status},
    post, routes,
    serde::json::Json,
};
use rocket_okapi::{okapi::openapi3::OpenApi, openapi, openapi_get_spec};

#[openapi(tag = "User")]
#[post("/login")]
pub async fn login() -> &'static str {
    "Hello, world!"
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
    rocket::build().mount("/", routes![get_prices, get_news, delete, signup, login])
}

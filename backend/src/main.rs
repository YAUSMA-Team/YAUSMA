use rocket::launch;

#[launch]
async fn rocket() -> _ {
    api::launch().await.expect("Failed to launch with CORS configuration")
}

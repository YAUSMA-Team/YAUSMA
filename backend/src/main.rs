use rocket::launch;

#[launch]
async fn rocket() -> _ {
    api::launch().await
}

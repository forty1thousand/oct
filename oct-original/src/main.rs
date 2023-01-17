use actix_cors::Cors;
use actix_session::{
    config::PersistentSession, storage::RedisActorSessionStore, SessionMiddleware,
};
use actix_web::{
    cookie::{time::Duration, Key},
    http::header,
    web, App, HttpServer,
};
use dotenv::dotenv;
use oct::endpoints::*;
use std::{env, io};

#[actix_web::main]
async fn main() -> Result<(), io::Error> {
    dotenv().ok();
    let key = Key::generate();
    let server = HttpServer::new(move || {
        App::new()
            .wrap(
                Cors::default()
                    .allowed_origin("http://localhost:3000")
                    .allowed_origin("http://127.0.0.1:3000")
                    .allowed_origin("http://34.130.128.125:3000")
                    .allowed_origin("https://34.130.128.125:3000")
                    .allowed_methods(vec!["POST", "GET", "PUT", "DELETE", "PATCH"])
                    .allowed_headers(vec![
                        header::AUTHORIZATION,
                        header::ACCEPT,
                        header::CONTENT_TYPE,
                    ])
                    .supports_credentials()
                    .max_age(3600),
            )
            .wrap(
                SessionMiddleware::builder(
                    RedisActorSessionStore::new(env::var("REDIS_URL").expect("Set REDIS_URL")),
                    key.clone(),
                )
                .cookie_secure(matches!(
                    env::var("PRODUCTION").expect("Set PRODUCTION").as_str(),
                    "true" | "1"
                ))
                .cookie_name("qid".to_owned())
                //.session_lifecycle(BrowserSession::default().state_ttl(Duration::days(1)))
                .session_lifecycle(PersistentSession::default().session_ttl(Duration::days(10)))
                .build(),
            )
            .service(
                web::resource("/user")
                    .route(web::post().to(create_user))
                    .route(web::put().to(login))
                    .route(web::delete().to(delete_user))
                    .route(web::get().to(get_user))
                    .route(web::patch().to(logout)),
            )
            .service(
                web::resource("/appointment")
                    .route(web::post().to(create_appointment))
                    .route(web::put().to(appointment_status))
                    .route(web::get().to(get_appointment)),
            )
            .service(web::resource("/doctors").route(web::get().to(get_doctors)))
            .service(web::resource("/me").route(web::get().to(logged_in))) 
            .service(web::resource("/test").route(web::get().to(test)))
    });
    println!("Running on 127.0.0.1:8080");
    server.bind("127.0.0.1:8080")?.run().await
}

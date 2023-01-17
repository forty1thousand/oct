use diesel::{PgConnection, prelude::*};
use dotenv::dotenv;
use std::env;


pub fn connect() -> PgConnection {
	dotenv().ok();
	let url = env::var("DATABASE_URL").expect("Set DATABASE_URL");
	PgConnection::establish(&url).expect(&format!("An error occured connecting to {}", url))
}

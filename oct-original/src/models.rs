use crate::{db::connect, schema::*};
use argon2::Config;
use chrono::NaiveDateTime;
use diesel::prelude::*;
use dotenv::dotenv;
use serde_derive::{Deserialize, Serialize};
use std::env;

#[derive(Debug, Queryable, AsChangeset, Serialize, Clone, Identifiable)]
#[diesel(primary_key(username))]
pub struct User {
    pub username: String,
    pub password: String,
    pub is_doctor: bool,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Insertable, Debug)]
#[diesel(table_name = users)]
pub struct NewUser {
    pub username: String,
    pub password: String,
    pub is_doctor: bool,
}

#[derive(Serialize, Deserialize)]
pub struct CreateUserInput {
    pub username: String,
    pub password: String,
    pub is_doctor: bool,
}

#[derive(Serialize, Deserialize)]
pub struct UsernamePasswordInput {
    pub username: String,
    pub password: String,
}

#[derive(Serialize, Deserialize)]
pub struct Username {
    pub username: String,
}

#[derive(Serialize, Deserialize)]
pub struct PublicUserInfo {
    pub username: String,
    pub is_doctor: bool,
    pub appointments: Vec<Appointment>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Debug, Queryable, AsChangeset, Serialize, Deserialize, Clone, Identifiable)]
#[diesel(table_name = appointments)]
pub struct Appointment {
    pub id: i32,
    pub user_id: String,
    pub doctor_id: String,
    pub description: String,
    pub status: String,
    pub appointment_time: NaiveDateTime,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Insertable, Debug)]
#[diesel(table_name = appointments)]
pub struct NewAppointment {
    pub user_id: String,
    pub doctor_id: String,
    pub description: String,
    pub appointment_time: NaiveDateTime,
}

#[derive(Serialize, Deserialize)]
pub struct CreateAppointmentInput {
    pub doctor_id: String,
    pub description: String,
    pub appointment_time: i64,
}

#[derive(Serialize, Deserialize)]
pub struct AppointmentIdStatus {
    pub id: i32,
    pub status: String,
}

#[derive(Serialize, Deserialize)]
pub struct AppointmentId {
    pub id: i32,
}

#[derive(Serialize, Deserialize)]
pub struct Page {
    pub page_number: i64,
}

#[derive(Serialize)]
pub struct Doctors {
    pub doctors: Vec<PublicUserInfo>,
}

#[derive(Serialize)]
pub struct LoginErrors {
    pub username: String,
    pub password: String,
}

pub fn new_appointment(
    user_username: String,
    input_appointment: CreateAppointmentInput,
) -> NewAppointment {
    NewAppointment {
        user_id: user_username,
        doctor_id: input_appointment.doctor_id,
        description: input_appointment.description,
        appointment_time: NaiveDateTime::from_timestamp_opt(
            input_appointment.appointment_time.clone(),
            0,
        )
        .unwrap(),
    }
}

pub fn doctors_to_json(doctors: Vec<User>) -> Doctors {
    Doctors {
        doctors: doctors.iter().map(PublicUserInfo::from).collect(),
    }
}

impl From<User> for PublicUserInfo {
    fn from(user: User) -> Self {
        use crate::schema::appointments::*;
        let user_appointments: Vec<Appointment> = dsl::appointments
            .filter(
                user_id
                    .eq(user.username.clone())
                    .or(doctor_id.eq(user.username.clone())),
            )
            .get_results(&mut connect())
            .unwrap();
        PublicUserInfo {
            username: user.username.clone(),
            is_doctor: user.is_doctor.clone(),
            appointments: user_appointments,
            created_at: user.created_at.clone(),
            updated_at: user.updated_at.clone(),
        }
    }
}

impl From<&User> for PublicUserInfo {
    fn from(user: &User) -> Self {
        use crate::schema::appointments::*;
        let user_appointments: Vec<Appointment> = dsl::appointments
            .filter(
                user_id
                    .eq(user.username.clone())
                    .or(doctor_id.eq(user.username.clone())),
            )
            .get_results(&mut connect())
            .unwrap();
        PublicUserInfo {
            username: user.username.clone(),
            is_doctor: user.is_doctor.clone(),
            appointments: user_appointments,
            created_at: user.created_at.clone(),
            updated_at: user.updated_at.clone(),
        }
    }
}

impl From<CreateUserInput> for NewUser {
    fn from(input_user: CreateUserInput) -> Self {
        dotenv().ok();
        let bytes = input_user.password.as_bytes();
        let conf = Config::default();
        let pass =
            argon2::hash_encoded(bytes, env::var("SALT").expect("Set SALT").as_bytes(), &conf)
                .unwrap();
        NewUser {
            username: input_user.username.clone(),
            password: pass,
            is_doctor: input_user.is_doctor,
        }
    }
}

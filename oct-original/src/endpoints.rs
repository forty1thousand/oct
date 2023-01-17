use crate::db::connect;
use crate::{models::*, schema::appointments::dsl::*, schema::users::dsl::*};
use actix_session::Session;
use actix_web::{web, HttpResponse, Responder, Result as Res};
use diesel::prelude::*;

// only for use inside of endpoint resolvers
macro_rules! get_current_user {
    ($ses:tt) => {
        match $ses.get::<String>("userId")? {
            Some(k) => k,
            _ => return Ok(HttpResponse::Unauthorized().into()),
        }
    };
}

pub async fn create_user(
    input_user: web::Json<CreateUserInput>,
    ses: Session,
) -> Res<impl Responder> {
    let new_user = NewUser::from(input_user.into_inner());
    match diesel::insert_into(users)
        .values(&new_user)
        .get_result::<User>(&mut connect())
    {
        Ok(_) => {
            ses.insert("userId", new_user.username.clone())?;
            Ok::<HttpResponse, _>(HttpResponse::Created().into())
        }
        Err(_) => Ok(HttpResponse::BadRequest().into()),
    }
}

pub async fn delete_user(ses: Session) -> Res<impl Responder> {
    let current_user = get_current_user!(ses);
    match diesel::delete(users.find(current_user)).get_result::<User>(&mut connect()) {
        Ok(_) => {
            ses.purge();
            Ok::<HttpResponse, _>(HttpResponse::Ok().into())
        }
        Err(_) => Ok(HttpResponse::BadRequest().into()),
    }
}

pub async fn logout(ses: Session) -> impl Responder {
    ses.purge();
    HttpResponse::Ok()
}

pub async fn login(
    input_user: web::Json<UsernamePasswordInput>,
    ses: Session,
) -> Res<impl Responder> {
    let other_username = input_user.username.clone();
    match users
        .find(other_username)
        .get_result::<User>(&mut connect())
    {
        Ok(user) => {
            if !argon2::verify_encoded(&user.password, input_user.password.as_str().as_bytes())
                .unwrap_or(false)
            {
                return Ok(HttpResponse::Unauthorized().json(LoginErrors {
                    username: "".to_owned(),
                    password: "Wrong password".to_owned(),
                }));
            }
            ses.insert("userId", input_user.username.clone())?;
            Ok::<HttpResponse, _>(HttpResponse::Ok().into())
        }
        _ => Ok(HttpResponse::BadRequest().json(LoginErrors {
            username: "User does not exist".to_owned(),
            password: "".to_owned(),
        })),
    }
}

pub async fn get_user(user: web::Query<Username>) -> impl Responder {
    match users
        .find(user.username.clone())
        .get_result::<User>(&mut connect())
    {
        Ok(user) => HttpResponse::Ok().json(PublicUserInfo::from(user)),
        _ => HttpResponse::NotFound().into(),
    }
}

pub async fn get_doctors(page: web::Query<Page>) -> impl Responder {
    const LIMIT: i64 = 5;
    match users
        .filter(is_doctor.eq(true))
        .limit(LIMIT)
        .offset(LIMIT * page.page_number)
        .get_results::<User>(&mut connect())
    {
        Ok(doctors) => HttpResponse::Ok().json(doctors_to_json(doctors)),
        _ => HttpResponse::InternalServerError().into(),
    }
}

pub async fn create_appointment(
    input_appointment: web::Json<CreateAppointmentInput>,
    ses: Session,
) -> Res<impl Responder> {
    let current_user = get_current_user!(ses);
    match users
        .find(input_appointment.doctor_id.clone())
        .get_result::<User>(&mut connect())
    {
        Ok::<User, _>(user) => match user.is_doctor {
            true => {
                diesel::insert_into(appointments)
                    .values(&new_appointment(
                        current_user,
                        input_appointment.into_inner(),
                    ))
                    .execute(&mut connect())
                    .unwrap();
                Ok(HttpResponse::Created())
            }
            _ => Ok(HttpResponse::Forbidden()),
        },
        _ => Ok(HttpResponse::NotFound()),
    }
}

pub async fn appointment_status(
    input_appointment: web::Json<AppointmentIdStatus>,
    ses: Session,
) -> Res<impl Responder> {
    let current_user = get_current_user!(ses);
    match appointments
        .find(input_appointment.id.clone())
        .get_result::<Appointment>(&mut connect())
    {
        Ok::<Appointment, _>(appointment) => {
            if appointment.doctor_id != current_user {
                return Ok(HttpResponse::Unauthorized());
            }
            match diesel::update(&appointment)
                .set(status.eq(input_appointment.status.clone()))
                .get_result::<Appointment>(&mut connect())
            {
                Ok(_) => Ok(HttpResponse::Ok()),
                _ => Ok(HttpResponse::BadRequest()),
            }
        }
        _ => Ok(HttpResponse::NotFound()),
    }
}

// returns Ok if user is logged in, otherwise returns Unauthorized
pub async fn logged_in(ses: Session) -> Res<impl Responder> {
    let current_user = get_current_user!(ses);
    Ok(HttpResponse::Ok().json(Username {
        username: current_user,
    }))
}

pub async fn get_appointment(appointment: web::Query<AppointmentId>) -> impl Responder {
    match appointments
        .find(appointment.id.clone())
        .get_result::<Appointment>(&mut connect())
    {
        Ok(appointment) => HttpResponse::Ok().json(appointment),
        _ => HttpResponse::NotFound().into(),
    }
}

#[derive(serde_derive::Serialize)]
pub struct TestStruct {
    pub nest: i32,
}

pub async fn test(ses: Session) -> Res<impl Responder> {
    if let Ok(k) = ses.get::<i32>("ok") {
        if let Some(k) = k {
            ses.insert("ok", k.wrapping_add(1))?;
        } else {
            ses.insert("ok", 0)?;
        };
    };
    let obj = TestStruct {
        nest: ses.get::<i32>("ok").unwrap().unwrap(),
    };
    Ok(web::Json(obj))
}

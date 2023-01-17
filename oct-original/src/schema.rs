// @generated automatically by Diesel CLI.

diesel::table! {
    appointments (id) {
        id -> Int4,
        user_id -> Varchar,
        doctor_id -> Varchar,
        description -> Varchar,
        status -> Varchar,
        appointment_time -> Timestamp,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    posts (id) {
        id -> Int4,
        title -> Varchar,
        body -> Nullable<Text>,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    users (username) {
        username -> Varchar,
        password -> Varchar,
        is_doctor -> Bool,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    appointments,
    posts,
    users,
);

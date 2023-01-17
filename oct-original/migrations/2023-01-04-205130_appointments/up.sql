CREATE TABLE appointments (
    id serial NOT NULL,
    user_id varchar NOT NULL,
    doctor_id varchar NOT NULL,
    description varchar NOT NULL,
    status varchar NOT NULL check (status IN('pending', 'approved', 'denied')) default 'pending',
    appointment_time timestamp NOT NULL,
    created_at timestamp NOT NULL default current_timestamp,
	updated_at timestamp NOT NULL default current_timestamp,
    PRIMARY KEY (id)
);

create table tbl_position
(
    id   BIGSERIAL PRIMARY KEY,
    name VARCHAR
);

create table tbl_candidate
(
    id                 BIGSERIAL PRIMARY KEY,
    full_name          VARCHAR,
    dob                TIMESTAMP,
    phone_number       VARCHAR,
    email              VARCHAR,
    address            VARCHAR,
    cv_attachment      VARCHAR,
    status             VARCHAR,
    year_of_experience BIGINT,
    highest_level      VARCHAR,
    position_id        BIGINT REFERENCES tbl_position (id),
    recruiter_id       BIGINT REFERENCES tbl_account (id)
);

create table tbl_schedule
(
    id             BIGSERIAL PRIMARY KEY,

    schedule_title VARCHAR,
    candidate_name VARCHAR,
    schedule_time  TIMESTAMP,
    time_start     TIMESTAMP,
    time_end       TIMESTAMP,
    result         VARCHAR,
    location       VARCHAR,
    notes          VARCHAR,
    meeting        VARCHAR,
    status         VARCHAR,
    candidate_id   BIGINT REFERENCES tbl_candidate (id),
    recruiter_id    BIGINT REFERENCES tbl_account (id)
);

create table tbl_map_schedule_interviewer
(
    id             BIGSERIAL PRIMARY KEY,
    schedule_id    BIGINT REFERENCES tbl_schedule (id),
    interviewer_id BIGINT REFERENCES tbl_account (id)
);
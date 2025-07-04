CREATE TABLE tbl_offer
(
    id             BIGSERIAL PRIMARY KEY,
    candidate_id   BIGINT,
    position_id    BIGINT,
    approve_id     BIGINT,
    schedule_id    BIGINT,
    level_id       BIGINT,
    interview      VARCHAR,
    interviewers   VARCHAR,
    "start_at"     TIMESTAMP,
    "end_at"       TIMESTAMP,
    interview_note VARCHAR,
    contract_id    BIGINT,
    recruiter_id   BIGINT,
    department_id  BIGINT,
    due_date       TIMESTAMP,
    basic_salary   NUMERIC,
    note           VARCHAR,
    status         VARCHAR,
    created_at     TIMESTAMP,
    updated_at     TIMESTAMP,
    updated_by     BIGINT
);
create table tbl_benefit
(
    id   bigserial primary key,
    name varchar
);

create table tbl_skill
(
    id   bigserial primary key,
    name varchar
);

create table tbl_department
(
    id   bigserial primary key,
    name varchar
);
create table tbl_map_candidate_skill
(
    id           bigserial primary key,
    candidate_id bigint references tbl_candidate (id),
    skill_id     bigint references tbl_skill (id)
);
create table tbl_job
(
    id                bigserial primary key,
    job_title         varchar,
    salary_range_from numeric,
    salary_range_to   numeric,
    working_address   varchar,
    description       varchar,
    status            varchar,
    start_date        timestamp,
    end_date          timestamp,
    created_at        timestamp,
    updated_at        timestamp,
    updated_by        varchar
)
create table tbl_map_job_benefit
(
    id         bigserial primary key,
    job_id     bigint references tbl_job (id),
    benefit_id bigint references tbl_benefit (id)
);
create table tbl_level
(
    id   bigserial primary key,
    name varchar
)
create table tbl_map_job_level
(
    id       bigserial primary key,
    job_id   bigint references tbl_job (id),
    level_id bigint references tbl_level (id)
);
create table tbl_map_job_skill
(
    id       bigserial primary key,
    job_id   bigint references tbl_job (id),
    skill_id bigint references tbl_skill (id)
);

create table tbl_map_candidate_job
(
    id           bigserial primary key,
    candidate_id bigint references tbl_candidate (id),
    job_id       bigint references tbl_job (id),
    status       varchar
)
-- Fondation OCP — Axe Éco-Social platform schema

create table if not exists profiles (
  user_id text primary key,
  role text not null check (role in ('admin', 'cooperative')),
  cooperative_id integer,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists odds (
  id serial primary key,
  code integer not null unique,
  name_fr text not null,
  short_name text not null,
  color text not null
);

create table if not exists cooperatives (
  id serial primary key,
  name text not null,
  description text not null default '',
  address text not null default '',
  city text not null,
  province text not null,
  region text not null,
  country text not null default 'Maroc',
  lat double precision not null,
  lng double precision not null,
  phone text not null default '',
  email text not null default '',
  website text not null default '',
  sector text not null,
  legal_status text not null default 'Coopérative',
  created_date date,
  status text not null default 'active' check (status in ('active', 'pending', 'suspended')),
  logo_initials text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists cooperatives_region_idx on cooperatives (region);
create index if not exists cooperatives_city_idx on cooperatives (city);
create index if not exists cooperatives_sector_idx on cooperatives (sector);
create index if not exists cooperatives_status_idx on cooperatives (status);
create index if not exists cooperatives_name_idx on cooperatives (name);

alter table profiles
  add constraint profiles_cooperative_fk
  foreign key (cooperative_id) references cooperatives (id) on delete set null;

create table if not exists cooperative_odds (
  cooperative_id integer not null references cooperatives (id) on delete cascade,
  odd_id integer not null references odds (id) on delete cascade,
  primary key (cooperative_id, odd_id)
);

create table if not exists beneficiary_stats (
  id serial primary key,
  cooperative_id integer not null references cooperatives (id) on delete cascade,
  year integer not null,
  month integer not null check (month between 1 and 12),
  women integer not null default 0,
  men integer not null default 0,
  youth integer not null default 0,
  adults integer not null default 0,
  children integer not null default 0,
  disabled integer not null default 0,
  indirect integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (cooperative_id, year, month)
);

create index if not exists beneficiary_stats_coop_idx on beneficiary_stats (cooperative_id, year, month);

create table if not exists reports (
  id serial primary key,
  cooperative_id integer not null references cooperatives (id) on delete cascade,
  year integer not null,
  month integer not null check (month between 1 and 12),
  title text not null,
  activity_summary text not null default '',
  achievements text not null default '',
  challenges text not null default '',
  future_actions text not null default '',
  women integer not null default 0,
  men integer not null default 0,
  youth integer not null default 0,
  adults integer not null default 0,
  children integer not null default 0,
  disabled integer not null default 0,
  indirect integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'submitted', 'approved', 'rejected')),
  submitted_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by text,
  review_comment text,
  created_by text,
  created_at timestamptz not null default now()
);

create index if not exists reports_status_idx on reports (status);
create index if not exists reports_coop_idx on reports (cooperative_id);

create table if not exists conventions (
  id serial primary key,
  cooperative_id integer not null references cooperatives (id) on delete cascade,
  title text not null,
  partner text not null,
  start_date date not null,
  end_date date not null,
  amount numeric(14, 2) not null default 0,
  status text not null default 'active' check (status in ('active', 'expiring', 'expired', 'draft')),
  description text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists conventions_coop_idx on conventions (cooperative_id);
create index if not exists conventions_status_idx on conventions (status);

create table if not exists documents (
  id serial primary key,
  cooperative_id integer not null references cooperatives (id) on delete cascade,
  name text not null,
  category text not null,
  mime_type text not null,
  size_bytes integer not null default 0,
  version integer not null default 1,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  owner_user_id text,
  content_base64 text,
  uploaded_at timestamptz not null default now()
);

create index if not exists documents_coop_idx on documents (cooperative_id);

create table if not exists esg_indicators (
  id serial primary key,
  cooperative_id integer not null references cooperatives (id) on delete cascade,
  year integer not null,
  environmental_score numeric(5, 2) not null default 0,
  social_score numeric(5, 2) not null default 0,
  governance_score numeric(5, 2) not null default 0,
  water_saved_m3 integer not null default 0,
  renewable_energy_kwh integer not null default 0,
  jobs_created integer not null default 0,
  training_hours integer not null default 0,
  notes text not null default '',
  unique (cooperative_id, year)
);

create table if not exists notifications (
  id serial primary key,
  user_id text,
  role_target text,
  cooperative_id integer references cooperatives (id) on delete cascade,
  type text not null,
  title text not null,
  body text not null default '',
  href text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_idx on notifications (user_id, read);
create index if not exists notifications_role_idx on notifications (role_target);

create table if not exists audit_logs (
  id serial primary key,
  user_id text,
  action text not null,
  entity_type text not null,
  entity_id text,
  details text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_created_idx on audit_logs (created_at desc);

create table if not exists seed_meta (
  id integer primary key,
  seeded_at timestamptz not null default now()
);

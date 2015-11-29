
-- Table: wall

DROP TABLE wall;

CREATE TABLE wall
(
  "userId" integer,
  text text,
  date timestamp with time zone,
  id serial NOT NULL,
  CONSTRAINT wall_pkey PRIMARY KEY (id),
  CONSTRAINT "FK_users_userId" FOREIGN KEY ("userId")
      REFERENCES users (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

-- Table: users

DROP TABLE users CASCADE;

CREATE TABLE users
(
  id serial NOT NULL,
  username character varying(32),
  salt character varying(256),
  hash character varying(256),
  date timestamp with time zone,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_username_key UNIQUE (username)
);

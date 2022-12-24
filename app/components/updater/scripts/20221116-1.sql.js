module.exports = `
create table if not exists custom.uploads (
  id          uuid primary key,
  post_time   timestamp,
  post_user   varchar(255),
  file_name   varchar(255),
  file_size   integer,
  mimetype    varchar(255),
  md5         varchar(50),
  target_path varchar(255),
  result      text
);`;

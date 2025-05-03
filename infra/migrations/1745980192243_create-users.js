exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    // for reference github limits username to 39 characters
    username: {
      type: "varchar(30)",
      notNull: true,
      unique: true,
    },
    // why 254 in lenght? https://stackoverflow.com/questions/1199190/what-is-the-optimal-length-for-an-email-address-in-a-database/1199238#1199238
    email: {
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },
    // why 60 in lenght? https://www.npmjs.com/package/bcrypt#hash-inf://www.npmjs.com/package/bcrypt#hash-info1
    password: {
      type: "varchar(60)",
      notNull: true,
    },
    // why use timestamp with timezone? https://justatheory.com/2012/04/postgres-use-timestamptz/
    created_at: {
      type: "timestamptz",
      default: pgm.func("timezone('utc', now())"),
      notNull: true,
    },
    updated_at: {
      type: "timestamptz",
      default: pgm.func("timezone('utc', now())"),
      notNull: true,
    },
  });
};

exports.down = false;

import database from "infra/database";
import { ValidationError, NotFoundError } from "infra/errors";
import password from "models/password";

async function findOneByUsername(username) {
  const userFound = await runSelectQuery(username);
  return userFound;
}

async function runSelectQuery(username) {
  const results = await database.query({
    text: `
      SELECT
        *
      FROM
        users
      WHERE
        LOWER(username) = LOWER($1)
      LIMIT
        1
    ;`,
    values: [username],
  });

  if (results.rowCount === 0) {
    throw new NotFoundError({
      message: "Username not found",
      action: "Check if it's not a typo",
    });
  }
  return results.rows[0];
}

async function create(userInputValues) {
  await ensureEmailExists(userInputValues);
  await ensureUsernameExists(userInputValues);
  await ensurePasswordExists(userInputValues);
  await validateUniqueUsername(userInputValues.username);
  await validateUniqueEmail(userInputValues.email);
  await hashPasswordInObject(userInputValues);

  const newUser = await runInserQuery(userInputValues);

  return newUser;

  async function ensurePasswordExists(userInputValues) {
    const error = new ValidationError({
      message: "Password must be filled",
      action: "Please, fill the field password and try again",
    });
    if (!("password" in userInputValues)) throw error;
    if (userInputValues?.password === "") throw error;
    return;
  }

  async function ensureEmailExists(userInputValues) {
    const error = new ValidationError({
      message: "E-mail must be filled",
      action: "Please, fill the field e-mail and try again",
    });

    if (!("email" in userInputValues)) throw error;
    if (userInputValues?.email === "") throw error;
    return;
  }

  async function ensureUsernameExists(userInputValues) {
    const error = new ValidationError({
      message: "Username must be filled",
      action: "Please, fill the field username and try again",
    });

    if (!("username" in userInputValues)) throw error;
    if (userInputValues?.username === "") throw error;

    return;
  }

  async function runInserQuery(userInputValues) {
    const results = await database.query({
      text: `
      INSERT INTO 
        users (username, email, password) 
      VALUES 
        ($1, $2, $3)
      RETURNING
        *
      ;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });

    return results.rows[0];
  }
}

async function update(username, userInputValues) {
  const currentUser = await findOneByUsername(username);
  const shouldValidateUsername = "username" in userInputValues;
  const shouldValidateEmail = "email" in userInputValues;
  const sanitizedInpuUsername =
    shouldValidateUsername && userInputValues.username.toLowerCase();
  const sanitizedInputEmail =
    shouldValidateEmail && userInputValues.email.toLowerCase();
  const sanitizedCurrentEmail = currentUser.email.toLowerCase();

  const sanitizedCurrentUsername = username.toLowerCase();

  const isDeepDiffUser = sanitizedCurrentUsername !== sanitizedInpuUsername;
  const isDeepDiffEmail = sanitizedCurrentEmail !== sanitizedInputEmail;

  if (isDeepDiffUser) {
    await validateUniqueUsername(userInputValues.username);
  }

  if (isDeepDiffEmail) {
    await validateUniqueEmail(userInputValues.email);
  }

  if ("password" in userInputValues) {
    await hashPasswordInObject(userInputValues);
  }

  const userWithNewValues = {
    ...currentUser,
    ...userInputValues,
  };

  const updatedUser = await runUpdateQuery(userWithNewValues);

  return updatedUser;
}

async function runUpdateQuery(userWithNewValues) {
  const results = await database.query({
    text: `
      UPDATE
        users
      SET
        username = $2,
        email = $3,
        password = $4,
        updated_at = timezone('utc', now())
      WHERE
        id = $1
      RETURNING
        *
    ;`,
    values: [
      userWithNewValues.id,
      userWithNewValues.username,
      userWithNewValues.email,
      userWithNewValues.password,
    ],
  });
  return results.rows[0];
}

async function queryResultString(values) {
  return await database.query({
    text: `
      SELECT
        ${values.column}
      FROM
        ${values.table}
      WHERE
        LOWER(${values.column}) = LOWER($1)
      LIMIT
        ${values?.limit || 1}
      ;`,
    values: [values.value],
  });
}

async function validateUniqueUsername(username) {
  const results = await queryResultString({
    column: "username",
    table: "users",
    value: username,
  });

  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "Username already in use",
      action: "Use another username to this operation",
    });
  }
}

async function validateUniqueEmail(email) {
  const results = await queryResultString({
    column: "email",
    table: "users",
    value: email,
  });

  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "E-mail is already in use",
      action: "Use another e-mail to this operation",
    });
  }
}

async function hashPasswordInObject(userInputValues) {
  const hashedPassword = await password.hash(userInputValues.password);
  userInputValues.password = hashedPassword;
}

const user = {
  create,
  findOneByUsername,
  update,
};

export default user;

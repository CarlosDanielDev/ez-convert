import database from "infra/database.js";

async function status(_, response) {
  const result = await database.query("SELECT 1 + 1 as sum;");

  response.status(200).json(result.rows);
}

export default status;

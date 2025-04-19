import { createRouter } from "next-connect";
import database from "infra/database";
import controller from "infra/controller";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const updatedAt = new Date().toISOString();

  const resultVersion = await database.query("SHOW server_version;");
  const [{ server_version }] = resultVersion.rows;

  const databaseName = process.env.POSTGRES_DB;

  const text =
    "SELECT count(*)::int as opened_connections FROM pg_stat_activity WHERE datname = $1;";
  const values = [databaseName];

  const resultActivityStats = await database.query({ text, values });
  const [{ opened_connections }] = resultActivityStats.rows;

  const resultMaxConnections = await database.query("SHOW max_connections;");

  const [{ max_connections }] = resultMaxConnections.rows;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: server_version,
        max_connections: Number(max_connections),
        opened_connections: opened_connections,
      },
    },
  });
}

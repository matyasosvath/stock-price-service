import { Sequelize } from "sequelize";
import { Client } from "pg";

let sequelize: Sequelize;

let connection = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_URL,
  port: 5432
};

console.log(`connection: ${connection}`);

(async () => {
  const client = new Client({
    user: connection.user,
    password: connection.password,
    port: connection.port,
    database: "postgres",
    // database: 'stock',
    host: connection.host,
    logging: false,
  });

  sequelize = new Sequelize(connection.database, connection.user, connection.password, {
    dialect: "postgres",
    host: connection.host,
    port: connection.port,
    logging: false,
  });

  await client.connect(); // Connect to the PostgreSQL server

  // const createDbQuery = `CREATE DATABASE ${database};`;
  // await client.query(createDbQuery);

  console.log(`Database ${connection.database} created or already exists.`);

  await sequelize.sync({ alter: true });

})();

export { sequelize, connection };

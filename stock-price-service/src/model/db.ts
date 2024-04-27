import { Sequelize, Transaction } from "sequelize";
import { Client } from "pg";

let sequelize: Sequelize;

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;
const host = process.env.DB_URL;
const port = 5432;

// console.log(`user: ${user}`);
// console.log(`password: ${password}`);
// console.log(`database: ${database}`);
// console.log(`host: ${host}`);
// console.log(`port: ${port}`);

(async () => {
  const client = new Client({
    user: user,
    password: password,
    port: port,
    database: "postgres",
    // database: 'stock',
    host: host,
    logging: false,
  });

  sequelize = new Sequelize(database, user, password, {
    dialect: "postgres",
    host: host,
    port: port,
    logging: false,
  });

  await client.connect(); // Connect to the PostgreSQL server

  // TODO create the "stock" database if it doesn't exist
  // const createDbQuery = `CREATE DATABASE ${database};`;
  // await client.query(createDbQuery);

  console.log(`Database ${database} created or already exists.`);

  // await client.end();

  await sequelize.sync({ alter: true });

})();

export { sequelize };

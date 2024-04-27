import { Sequelize, Transaction } from "sequelize";
import { Client } from "pg";

let sequelize: Sequelize;

(async () => {
  const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: 5432,
    database: process.env.DB_NAME,
    logging: true,
  });

  sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASSWORD!,
    {
      dialect: "postgres",
      host: process.env.DB_URL,
      port: 5432,
      logging: false,
    }
  );

  console.log("new sequalize()");
  console.log(sequelize);

  // TODO check if db exists

  client.connect();
  console.log("client.connect()");
  console.log(sequelize);

  await sequelize.sync({ alter: true });
  console.log("sequelize.sync");
  console.log(sequelize);

  try {
    await sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();


export { sequelize };

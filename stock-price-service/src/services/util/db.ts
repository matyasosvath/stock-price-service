import { Sequelize, Transaction } from "sequelize";
import {Client} from 'pg';


export let sequelize: Sequelize;

(async () => {
  const client = Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: 5432,
    database: process.env.DB_NAME,
    logging: true
  });

  sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USER!, process.env.DB_PASSWORD!, {
    dialect: 'postgres',
    host: process.env.DB_URL,
    port: 5432,
    logging: false
  });

  // TODO check if db exists

  client.connect();

  await sequelize.sync({alter: true});
})();


export async function createTransaction(): Promise<Transaction> {
  return sequelize.transaction({isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE});
};


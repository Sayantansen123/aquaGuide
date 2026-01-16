import { INTEGER, Sequelize } from "sequelize";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
const database_name = process.env.DATABASE_NAME
const database_username = process.env.DATABASE_USERNAME
const database_password = process.env.DATABASE_PASSWORD
const database_host = process.env.DATABASE_HOST || "localhost"
const database_port = parseInt(process.env.DATABASE_PORT, 10) || 5432

const sequelize = new Sequelize(database_name, database_username, database_password, {
  host: database_host,
  port: database_port,
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export default sequelize;

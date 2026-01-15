import { Sequelize } from "sequelize";

const sequelize = new Sequelize("aqua", "postgres", "password", {
  host: "localhost",
  port: 5433,
  dialect: "postgres",
  logging: false,
});

export default sequelize;

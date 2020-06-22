import { Sequelize } from "sequelize";
import sequelize from "sequelize";

export const database = new Sequelize({
  database: "ProxyProject",
  dialect: "sqlite",
  storage: "./proxy.sqlite"
}); 

export const updateDB = new Sequelize({
  database: "updateDB",
  dialect: "sqlite",
  storage: "./proxy.sqlite"
}); 

// database.authenticate().then(()=>{
//   // console.log('Connection established');
// })
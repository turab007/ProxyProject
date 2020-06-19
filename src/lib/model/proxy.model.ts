import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { database } from "../config/database";

export class Proxy extends Model {
  public id!: number;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Proxy.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      unique: true
    }
  },
  {
    tableName: "ProxyProject",
    sequelize: database // this bit is important
  }
);

Proxy.sync().then(() => console.log("Proxy table createdf"));

export interface ProxyInterface {
  name: string;
}
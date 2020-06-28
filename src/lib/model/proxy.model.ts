import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { database } from "../config/database";

export class Proxy extends Model {
  public ip!: string;
  public port!: number;
  public code!: string;
  public https!: string;
  public provider!: string;
  public basicFunctionality!: boolean;
  public testDate!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Proxy.init(
  {
    ip: {
      type: DataTypes.STRING,
      unique: true,
      primaryKey: true
    },
    port: {
      type:  DataTypes.INTEGER,
      allowNull: false,
    },
    code: {
      type:  DataTypes.STRING,
      allowNull: false
    },
    https: {
      type:  DataTypes.STRING,
      allowNull: false
    },
    provider: {
      type:  DataTypes.STRING,
      allowNull: false
    },
    basicFunctionality: {
      type:  DataTypes.BOOLEAN,
      defaultValue:false,
      allowNull: true
    },
    testDate: {
      type: DataTypes.NUMBER,
      allowNull: true
    }
  },
  {
    tableName: "ProxyProject",
    sequelize: database // this bit is important
  }
);

Proxy.sync().then(() => {
  //  console.log("Proxy table created")
}
);

export interface ProxyInterface {
  ip: string;
  port: number;
  code: string;
  https: string;
  provider: string;
  basicFunctionality: boolean;
  testDate: number | null;
}
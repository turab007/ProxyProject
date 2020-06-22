import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { database } from "../config/database";

export class Proxy extends Model {
  public ip!: string;
  public port!: number;
  public code!: string;
  public https!: string;
  public provider!: string;
  public basicFunctionality!: boolean;
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
      type: new DataTypes.INTEGER,
      allowNull: false,
    },
    code: {
      type: new DataTypes.STRING,
      allowNull: false
    },
    https: {
      type: new DataTypes.STRING,
      allowNull: false
    },
    provider: {
      type: new DataTypes.STRING,
      allowNull: false
    },
    basicFunctionality: {
      type: new DataTypes.BOOLEAN,
      defaultValue:false,
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
  basicFunctionality: boolean
}
import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { updateDB } from "../config/database";

export class UpdateDB extends Model {
  public id!: string;
  public last_updated!: number;
}

UpdateDB.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey: true
    },
    last_updated: {
      type: new DataTypes.NUMBER,
      allowNull: false,
    },
  },
  {
    tableName: "updateDB",
    sequelize: updateDB, // this bit is important,
    timestamps: false
  }
);

UpdateDB.sync().then(() => {
  console.log("UpdateDB table created")
}
);

export interface UpdateDBInterface {
  ip: string;
  last_updated: number;

}
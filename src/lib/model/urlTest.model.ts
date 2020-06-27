import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";
import { urlTestDB } from "../config/database";

export class urlTest extends Model {
    public ip!: string;
    public url!: string;
    public pass!: boolean;
    //   public code!: string;
    //   public https!: string;
    //   public provider!: string;
    //   public basicFunctionality!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

urlTest.init(
    {
        ip: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        pass: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    },
    {
        tableName: "urlTestDB",
        sequelize: urlTestDB // this bit is important
    }
);

urlTest.sync().then(() => {
    console.log('UrlTest table created')
}
);

export interface urlTestInterface {
    ip: string;
    url: string;
    pass: boolean;

}
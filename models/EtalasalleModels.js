import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Etalasalle = db.define(
    "etalasalle",
    {
        name: DataTypes.STRING,
        image: DataTypes.STRING,
        url: DataTypes.STRING,
        description: DataTypes.STRING,
        price: DataTypes.FLOAT,
        type: DataTypes.STRING,
        contactname: DataTypes.STRING,
        contactnumber: DataTypes.STRING,
    },
    {
        freezeTableName: true,
    }
);

export default Etalasalle;

(async() => {
    await db.sync();
})();
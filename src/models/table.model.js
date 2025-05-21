import { DataTypes } from "sequelize"
import db from "../config/db.js"

const Table = db.define(
  "Table",
  {
    id_table: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    location: {
      type: DataTypes.ENUM("window", "terrace", "indoor", "vip room"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("available", "occupied"),
      allowNull: false,
      defaultValue: "available",
    },
  },
  {
    tableName: "tables",
    timestamps: false,
  }
)

export default Table

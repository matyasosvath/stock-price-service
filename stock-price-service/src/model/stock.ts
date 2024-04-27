import { sequelize } from '../services/util/db';
import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

export class StockPrice extends Model<
  InferAttributes<StockPrice>,
  InferCreationAttributes<StockPrice>
> {
  declare symbol: string;
  declare value: number;
  declare dateTime: Date;
}

StockPrice.init(
  {
    symbol: DataTypes.STRING,
    value: DataTypes.NUMBER,
    dateTime: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "stockPrice",
    timestamps: false,
  }
);

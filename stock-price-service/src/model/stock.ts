import {sequelize} from './db';
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

console.log("sequalize");
console.log(sequelize);

StockPrice.init(
  {
    symbol: DataTypes.STRING,
    value: DataTypes.NUMBER,
    dateTime: DataTypes.DATE,
  },
  {
    sequelize: sequelize!,
    modelName: "stockPrice",
    timestamps: false,
  }
);

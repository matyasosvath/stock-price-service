import {sequelize} from './db';
import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";

class StockPrice extends Model<
  InferAttributes<StockPrice>,
  InferCreationAttributes<StockPrice>
> {
  declare id: CreationOptional<number>;
  declare symbol: string;
  declare value: number;
  declare dateTime: Date;
}

StockPrice.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    symbol: DataTypes.STRING,
    value: DataTypes.FLOAT,
    dateTime: DataTypes.DATE,
  },
  {
    sequelize: sequelize!,
    modelName: "stockPrice",
    timestamps: false,
  }
);

export default StockPrice;
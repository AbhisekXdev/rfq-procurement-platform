
import Sequelize from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 4000),

    dialect: "mysql",

    logging:
      process.env.DB_LOGGING === "true"
        ? console.log
        : false,

    dialectOptions: {
      ssl: {
        minVersion: "TLSv1.2",
      },
    },

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },

    retry: {
      max: 3,
    },

    define: {
      timestamps: true,
      underscored: false,
    },
  }
);

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();

    console.log("✅ TiDB Cloud MySQL connected successfully");

    return sequelize;
  } catch (error) {
    console.error("❌ TiDB Cloud connection failed:", error.message);
    throw error;
  }
};

export { sequelize };

export default sequelize;

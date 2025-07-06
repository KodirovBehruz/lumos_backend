import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config({ path: '.env' })

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
})

export default sequelize
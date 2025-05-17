// database.js - project skeleton file
require('dotenv').config();
console.log('▶️ DATABASE_URL:', process.env.DATABASE_URL);
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});
module.exports = { sequelize };
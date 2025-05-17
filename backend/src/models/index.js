// backend/src/models/index.js
const fs        = require('fs');
const path      = require('path');
const Sequelize = require('sequelize');
require('dotenv').config();

const basename = path.basename(__filename);
const db       = {};

console.log('📦 Loading models from:', __dirname);

// Initialize Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
  dialectOptions: process.env.NODE_ENV === 'production'
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {}
});

// 1) Read directory
const files = fs.readdirSync(__dirname);
console.log('🔍 Files found:', files);

// 2) Filter model files
const modelFiles = files.filter(file =>
  file.indexOf('.') !== 0 &&
  file !== basename &&
  file.slice(-3) === '.js'
);
console.log('✅ Model files to import:', modelFiles);

// 3) Import each
modelFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  console.log(`→ importing ${file} from ${fullPath}`);
  const imported = require(fullPath)(sequelize, Sequelize.DataTypes);
  console.log(`   imported value:`, imported && imported.name);
  db[imported.name] = imported;
});

// 4) Associate
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    console.log(`↪️  Running associate() for ${modelName}`);
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

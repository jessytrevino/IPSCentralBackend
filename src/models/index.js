const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  logging: false, 
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

async function test(){
  try {
    await sequelize.authenticate();
    console.log("Success");
  } catch (err) {
    console.error("There was an error", err);
  }
}

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Employee = require("./employee.model.js")(sequelize, Sequelize);
db.Evaluation_Period = require("./evaluation_period.model.js")(sequelize, Sequelize);
db.Employee2 = require("./employee2.model.js")(sequelize, Sequelize);

//db.tutorials = require("./employee.model.js")(sequelize, Sequelize);
module.exports = db;
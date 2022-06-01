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

db.employee = require("./employee.model.js")(sequelize, Sequelize);
db.evaluation_period = require("./evaluation_period.model.js")(sequelize, Sequelize);
db.employee_project = require("./employee_project.model")(sequelize, Sequelize);
db.employee_team = require("./employee_team.model")(sequelize, Sequelize);
db.project = require("./project.model")(sequelize, Sequelize);
db.request = require("./request.model")(sequelize, Sequelize);
db.team = require("./team.model")(sequelize, Sequelize);
db.orphan_team = require("./orphan_team.model")(sequelize, Sequelize);

//db.tutorials = require("./employee.model.js")(sequelize, Sequelize);
module.exports = db;
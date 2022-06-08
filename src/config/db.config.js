module.exports = {
  HOST: "localhost",
  USER: "sa",
  PASSWORD: "Fempower-2022",
  DB: "ipsCentralDB",
  dialect: "mssql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }  
};

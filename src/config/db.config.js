module.exports = {
    HOST: "localhost",
    USER: "sa",
    PASSWORD: "F3mp0w3r!",
    DB: "ipsCentralDB",
    dialect: "mssql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }  
  };
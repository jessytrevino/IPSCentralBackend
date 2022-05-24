const express = require("express");
const router = express.Router();
const cors = require("cors");
const excelController = require("../controllers/excel.controller");
const upload = require("../middleware/upload");

let routes = (app) => {
    router.post("/upload", upload.single("excel"), excelController.upload);
    router.get("/getEmployees", excelController.getEmployees);
    router.get("/getTeams", excelController.getTeams);
    router.get("/getEmpTeams", excelController.getEmpTeams);
    router.get("/getProjects", excelController.getEmpTeams);
    router.get("/getEmpProjects", excelController.getEmpTeams);

    app.use("/api", router);
    
};
module.exports = routes;

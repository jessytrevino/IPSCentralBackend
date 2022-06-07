const express = require("express");
const router = express.Router();
const cors = require("cors");
const excelController = require("../controllers/excel.controller");
const upload = require("../middleware/upload");

let routes = (app) => {
    router.post("/upload", upload.single("excel"), excelController.upload);
    router.get("/getEmployees", excelController.getEmployees);
    router.get("/getTeams", excelController.getTeams);
    router.get("/getEmployeeProjects", excelController.getEmployeeProjects);
    router.get("/getEmployeeTeams", excelController.getEmployeeTeams);
    router.get("/getEvaluationPeriods", excelController.getEvaluationPeriods);
    router.get("/getProjects", excelController.getProjects);
    router.get("/getRequests", excelController.getRequests);
    router.get("/getHasUploaded", excelController.getHasUploaded);
    router.get("/getOrphanEmployees", excelController.getOrphanEmployees);
    router.get("/getOrphanTeams", excelController.getOrphanTeams);

    router.post("/requestAdd", excelController.requestAdd);
    router.post("/removeHR", excelController.removeHR);
    router.post("/approveHR", excelController.approveHR);
    router.post("/requestRemove", excelController.requestRemove);
    router.post("/declineRequest", excelController.declineRequest);
    router.post("/acceptRequest", excelController.acceptRequest);
    router.post("/addHR", excelController.addHR);
    router.post("/removeUnassigned", excelController.removeUnassigned);
    router.post("/addUnassigned", excelController.addUnassigned);

    app.use("/api", router);
    
};



module.exports = routes;

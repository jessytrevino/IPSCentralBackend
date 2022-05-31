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

    router.post("/requestAdd", excelController.AddRequest);

    // router.route('/requestAdd').post((request, response) => {
    //     let add_request = {...request.body}
    //     excelController.AddRequest(add_request).then(result => {
    //     response.json(result[0]);
      
    //     })
      
    //   })

    app.use("/api", router);

   
    
};



module.exports = routes;

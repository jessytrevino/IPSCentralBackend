const db = require("../models");
const readXlsxFile = require("read-excel-file/node");
// const fileSystem = require("browserify-fs");
const { type } = require("express/lib/response");
const { team } = require("../models");
const { QueryTypes } = require("sequelize");
const Employee = db.employee; //TODO: lo mismo con todos los modelos
const Evaluation_Period = db.evaluation_period;
const Employee_Project = db.employee_project;
const Employee_Team = db.employee_team;
const Project = db.project;
const Request = db.request;
const Team = db.team;


class User {
  constructor(clientname, projectname, projectlead, username, billHrs, nonBillHrs, totalHrs) {
      this.clientname = clientname;
      this.projectname = projectname;
      this.projectlead = projectlead;
      this.username = username;
      this.billHrs = billHrs;
      this.nonBillHrs = nonBillHrs;
      this.totalHrs = totalHrs;
      if (this.projectlead == this.username){
          this.role = "Leader";
      } else {
          this.role = "Peer";
      }
  }
}



const upload = async(req, res) => {
  class User {
    constructor(clientname, projectname, projectlead, username, billHrs, nonBillHrs, totalHrs) {
        this.clientname = clientname;
        this.projectname = projectname;
        this.projectlead = projectlead;
        this.username = username;
        this.billHrs = billHrs;
        this.nonBillHrs = nonBillHrs;
        this.totalHrs = totalHrs;
        if (this.projectlead == this.username){
            this.role = "Leader";
        } else {
            if (this.username == "Totals"){
              this.role = "Leader";
            } else {
              this.role = "Peer";
            }
        }
    }
  }

  let userInfo = [];
  let projInfo = []; // lista de nombres de proj con usuarios que participan en proj
  let projNameLeads = []; // lista de nombres de proj con sus líderes
  let teams = [];
  let orphanTeams = [];
  let orphanJson = [];
  let orphans = [];
  let hoursToComplete = 40;

  //let path = '/Users/robertasaldana/Downloads/equipos.xlsx'; //preguntar dsp path del folder de resoures + nombre del arch
  //? Cual es el nombre del archivo?
  let path = '/Users/robertasaldana/Desktop/IPSCentralBackend/src/resources/static/assets/uploads/equipos.xlsx' 
  //let path = '/Users/jessicatrevino/Desktop/itesm/TC3005/reto/IPSCentralBackend/IPSCentralBackend/src/resources/static/assets/uploads/equipos.xlsx';
  //let path = '/Users/robertasaldana/Downloads/Reporte horas-equipos 360 (1).xlsx';
  

readXlsxFile(path).then(async(rows) => {
      //se salta los headers
      rows.shift(); 
      rows.shift();
      rows.shift();


      // leer los datos y agregaros a userInfo
      rows.forEach((col) => {

          let bill = 0;
          let nonbill = 0;
          let totalHr = 0;

          for (let i = 4; i < 10; i++) {
              if (col[i] != '-'){
                  bill = bill + col[i];
              }
              
          }
          for (let i = 10; i < 16; i++) {
              if (col[i] != '-'){
                  nonbill = nonbill + col[i];
              }
          }

          totalHr = bill + nonbill;

          const user = new User(col[0], col[1], col[2], col[3], bill, nonbill, totalHr);

          // agregar a users a la lista de UserInfo
          if (user.username != "Totals"){
              if (userInfo[user.username]){
                  userInfo[user.username].push(user);
              } else {
                  userInfo[user.username] = [user];
              }
          }
          
          // agregar proyectos a la lista de ProjInfo
          if (user.username != "Totals"){
              if (projInfo[user.projectname]) {
                  projInfo[user.projectname].push(user);
              } else {
                  projInfo[user.projectname] = [user];
              }
          }
          
          // agregar proyectos y sus líderes a la lista de ProjNameLeads
          if (!projNameLeads[user.projectname]){
            if(user.username != null) {
              if (user.role == "Leader"){
                projNameLeads[user.projectname] = user.projectlead;
              }
            }
          }
      });

      
      // iteramos todo user info 
        //key = nombre 
        //value = todo el obj de user
      for(const[key, value]of Object.entries(userInfo)){
        // itera por cada objeto (entry) de cada persona
        value.forEach((entry) => {
            // checa si el usuario(key) en cada proj(entry) tuvo mas de 40hrs
            if (entry.totalHrs >= hoursToComplete) {
                // dentro de ese proj(entry) itera por cada usuario
                projInfo[entry.projectname].forEach((userInProj) => { 
                    // checamos si el usuario(key) es diferente al userInProj y si el userInProj SÍ cumplió las 40 hrs
                    if (userInProj.username != key && userInProj.totalHrs >= hoursToComplete) {
                        // si el equipo de usuario(key) todavía no exsite lo creamos y agregamos userInProj
                        if (!teams[key]){ 
                          teams[key] = [userInProj];
                        } 
                        else {
                          // checamos si userInProj ya esta en el equipo con el mismo rol
                          if (teams[key].includes(userInProj.username)){
                            // si rol es igual entonces no se agrega
                            if (teams[key].role != userInProj.role){
                              teams[key].push(userInProj);
                            } 
                          }
                          // si todavía no esta en el equipo lo agregamos
                          else {
                            teams[key].push(userInProj);
                          }
                        }
                    }
                })
            }            
        })
      }

      // agregamos a los usuarios que no tienen equipo a lista de huerfanos
      for(const[key, value]of Object.entries(userInfo)){
        if (!teams[key]){
          if (orphans[key]) {
            orphans[key].push(value);
          } else {
            orphans[key] = [value];
          }
        } else {
          userInfo[key].role = 1;
        }
      }

      // hacemos equipos provicionales de huerfanos
      for(const[key, value]of Object.entries(userInfo)){
        if (orphans[key]){
        // itera por cada objeto (entry) de cada persona
          value.forEach((entry) => {
              console.log(key);
              // dentro de ese proj(entry) itera por cada usuario
                projInfo[entry.projectname].forEach((userInProj) => { 
                  if (projInfo[entry.projectname].length > 1){
                    // checamos si el usuario(key) es diferente al userInProj
                    if (userInProj.username != key) {
                        // si el equipo de usuario(key) todavía no exsite lo creamos y agregamos userInProj
                        if (!orphanTeams[key]){ 
                          orphanTeams[key] = [userInProj];
                        } 
                        else {
                          // checamos si userInProj ya esta en el equipo con el mismo rol
                          if (orphanTeams[key].includes(userInProj.username)){
                            // si rol es igual entonces no se agrega
                            if (orphanTeams[key].role != userInProj.role){
                              orphanTeams[key].push(userInProj);
                            } 
                          }
                          // si todavía no esta en el equipo lo agregamos
                          else {
                            orphanTeams[key].push(userInProj);
                          }
                        }
                    }
                  }
                  // si el huerfano esta solo en su equipo agregar al líder
                  else {
                    if (!orphanTeams[key]){ 
                      orphanTeams[key] = [userInProj.projectlead];
                    } 
                    else {
                      // checamos si userInProj ya esta en el equipo con el mismo rol
                      if (orphanTeams[key].includes(userInProj.username)){
                        // si rol es igual entonces no se agrega
                        if (orphanTeams[key].role != userInProj.role){
                          orphanTeams[key].push(userInProj);
                        } 
                      }
                      // si todavía no esta en el equipo lo agregamos
                      else {
                        orphanTeams[key].push(userInProj);
                      }
                    }
                  }
                }) 
          })
        }
      }
      // console.log(orphans);
      console.log(orphanTeams);

      // variables auxiliares
      let periodSemester = 'SepFeb';
      let evaluationYear = '2021-2022';

      /! Agregar a tablas !/
      
      // Evaluation_Periods
      //TODO: cambiar a que sea loop no nadamas una ves CREO idk
      const tempPer = await Evaluation_Period.create({semester: periodSemester, evaluation_year: evaluationYear, hours_to_complete: hoursToComplete, has_uploaded: false});
      // const period = new EvaluationPeriodClass(periodSemester, evaluationYear, hoursToComplete, tempPer.id, false);
      
      
      // Employees
      let is_orphan;
      for(const[key, value] of Object.entries(userInfo)){
        if (!orphans[key]){
          is_orphan = true;
        } else {
          is_orphan = false;
        }
        
        const tempEmp = await Employee.create({is_assigned: is_orphan, email: '', employee_name: key, is_HR: 0});
        
        // Teams
        const tempTeam = await Team.create({id_employee: tempEmp.id, id_period: tempPer.id, approved_HR: 0, approved_Emp: 0});
      }

      // se necesita crear uno NA por que hay veces donde no hay líder
      const tempEmp = await Employee.create({is_assigned: 0, email: '', employee_name: "NA", is_HR: 0});

      // Projects
      for(const[key, value] of Object.entries(projNameLeads)){
        if(key != null) {
          if (await Employee.findOne({where: {employee_name: value}}) == null){
            const user = new User("NA", key, value, value, 0, 0, 0);
            const tempEmp = await Employee.create({is_assigned: 0, email: '', employee_name: value, is_HR: 0});
          }

          const emp = await Employee.findOne({where: {employee_name: value}});
          const tempProj = await Project.create({project_name: key, id_employee_leader: emp.id, id_period: tempPer.id});
        }
      }

      // Employee_Projects
      let projRole;
      let didComplete;

      for(const[key, value] of Object.entries(projInfo)){
        value.forEach(async(user) => {
          if (user.role == "Leader"){
            projRole = 1;
          } else {
            projRole = 0;
          }
          if (user.totalHrs >= hoursToComplete) {
            didComplete = 1;
          } else {
            didComplete = 0;
          }

          const emp =  await Employee.findOne({where: {employee_name: user.username}});
          const proj =  await Project.findOne({where: {project_name: key}});
        
          const tempEmpProj =  Employee_Project.create({
            did_complete: didComplete, 
            project_role: projRole, 
            id_employee: emp.id, 
            id_project: proj.id, 
            billHrs: user.billHrs, 
            nonBillHrs: user.nonBillHrs
          });
        })
      }
      
      // Employee_Teams
      let status = 0;
      let teamRole;
      for(const[key, value] of Object.entries(teams)){
        const empKey =  await Employee.findOne({where: {employee_name: key}});
        
        value.forEach(async(user) => {

          const empUser =  await Employee.findOne({where: {employee_name: user.username}});
          const teamKey = await Team.findOne({where: {id_employee: empKey.id}});
          
          if (empKey.employee_name == user.projectlead){
            teamRole = 2; // team
          } else if (user.role == 'Leader'){
            teamRole = 0; // leader
          } else if (user.role == 'Peer') {
            teamRole = 1; // peer
          }

          const tempEmpTeam = await Employee_Team.create({role_member: teamRole, status_member: teamRole, id_employee: empUser.id, id_team: teamKey.id}); 
        })
      }

      // Equipos Huerfanos (nombreEq, idEq, nombreEmp, idEmp, rol)
      for(const[key, value] of Object.entries(orphanTeams)) {
        const userTeamName = await Employee.findOne({ where: {employee_name: key}});
        if (orphanTeams[key].length > 1){
          value.forEach(async(user) => {
            const teamEmp = await Employee.findOne({where: {employee_name: user.username}});
          })
        } else {
          const teamEmp = await Employee.findOne({where: {employee_name: value}});
          let arr = {userTeamName: 'test'};
        }
        
      }



    });

    // de jessy
    console.log("inside the file saving part");
    res.status(200).send({message: "upload successful"});

}




// subir archivo
// otra funcion y query que agarre los datos
/*
const postMotive = async(req, res) => {
  // motive, idempmod, status, type, idempreq

  // madar
    // 
}*/

// la usamos en Consultar Equipos
const getEmployees = async (req, res) => {
  const employees = await db.sequelize.query(`select * from Employees`, {type: QueryTypes.SELECT}) // ! query goes here <-
  console.log(employees);
  res.send(employees);
};

const getTeams = async (req, res) => {
  const teams = await db.sequelize.query(`select * from Teams`, {type: QueryTypes.SELECT})
  res.send(teams);
};

const getEmployeeProjects = async (req, res) => {
  const empProj = await db.sequelize.query(`select * from Employee_Projects`, {type: QueryTypes.SELECT})
  res.send(empProj);
};

const getEmployeeTeam = async (req, res) => {
  const empTeams = await db.sequelize.query(`select * from Employee_Teams`, {type: QueryTypes.SELECT})
  res.send(empTeams);
};

const getEvaluationPeriods = async (req, res) => {
  const evalPeridos = await db.sequelize.query(`select * from Evaluation_Periods`, {type: QueryTypes.SELECT})
  res.send(evalPeridos);
};

const getProjects = async (req, res) => {
  const proj = await db.sequelize.query(`select * from Projects`, {type: QueryTypes.SELECT})
  res.send(proj);
};

const getRequest = async (req, res) => {
  const request = await db.sequelize.query(`select * from Requests`, {type: QueryTypes.SELECT})
  res.send(request);
};

const postHasUploaded = async (req, res) => {
  
}




module.exports = {
  upload,
  getEmployees,
  getTeams,
  getEmployeeProjects,
  getEmployeeTeam,
  getEvaluationPeriods,
  getProjects,
  getRequest
};


/* Find all users
      const employees = await Employee.findAll();
      console.log(employees.every(employee => employee instanceof Employee)); // true
      console.log("All users:", JSON.stringify(employees, null, 2));
*/


//const upload = async (req, res) => {
//   try {
//     if (req.file == undefined) {
//       return res.status(400).send("Please upload an excel file!");
//     }
//     let path =
//       __basedir + "/resources/static/assets/uploads/" + req.file.filename;
//     readXlsxFile(path).then((rows) => {
//       // skip header
//       rows.shift();
//       let tutorials = [];
//       rows.forEach((row) => {
//         let tutorial = {
//           id: row[0],
//           title: row[1],
//           description: row[2],
//           published: row[3],
//         };
//         tutorials.push(tutorial);
//       });
//       Tutorial.bulkCreate(tutorials)
//         .then(() => {
//           res.status(200).send({
//             message: "Uploaded the file successfully: " + req.file.originalname,
//           });
//         })
//         .catch((error) => {
//           res.status(500).send({
//             message: "Fail to import data into database!",
//             error: error.message,
//           });
//         });
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       message: "Could not upload the file: " + req.file.originalname,
//     });
//   }
// };
const db = require("../models");
const readXlsxFile = require("read-excel-file/node");
// const fileSystem = require("browserify-fs");
const { type } = require("express/lib/response");
const { team } = require("../models");
const { QueryTypes } = require("sequelize");
const res = require("express/lib/response");
const Employee = db.employee; //TODO: lo mismo con todos los modelos
const Evaluation_Period = db.evaluation_period;
const Employee_Project = db.employee_project;
const Employee_Team = db.employee_team;
const Project = db.project;
const Request = db.request;
const Team = db.team;
const Orphan_Team = db.orphan_team;

class User {
  constructor(clientname, projectname, projectlead, username, billHrs, nonBillHrs, totalHrs) {
    this.clientname = clientname;
    this.projectname = projectname;
    this.projectlead = projectlead;
    this.username = username;
    this.billHrs = billHrs;
    this.nonBillHrs = nonBillHrs;
    this.totalHrs = totalHrs;
    if (this.projectlead == this.username) {
      this.role = "Leader";
    } else {
      this.role = "Peer";
    }
  }
}



const upload = async (req, res) => {
  class User {
    constructor(clientname, projectname, projectlead, username, billHrs, nonBillHrs, totalHrs) {
      this.clientname = clientname;
      this.projectname = projectname;
      this.projectlead = projectlead;
      this.username = username;
      this.billHrs = billHrs;
      this.nonBillHrs = nonBillHrs;
      this.totalHrs = totalHrs;
      if (this.projectlead == this.username) {
        this.role = "Leader";
      } else {
        if (this.username == "Totals") {
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
  let orphans = [];
  let hoursToComplete = 40;

  let path = '/Users/robertasaldana/Desktop/IPSCentralBackend/src/resources/static/assets/uploads/equipos.xlsx'
  //let path = '/Users/jessicatrevino/Desktop/itesm/TC3005/reto/IPSCentralBackend/IPSCentralBackend/src/resources/static/assets/uploads/equipos.xlsx';
  //let path = '/Users/melissa/Documents/tec/back6/IPSCentralBackend/src/resources/static/assets/uploads/equipos.xlsx';

  readXlsxFile(path).then(async (rows) => {
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
        if (col[i] != '-') {
          bill = bill + col[i];
        }

      }
      for (let i = 10; i < 16; i++) {
        if (col[i] != '-') {
          nonbill = nonbill + col[i];
        }
      }

      totalHr = bill + nonbill;

      const user = new User(col[0], col[1], col[2], col[3], bill, nonbill, totalHr);

      // agregar a users a la lista de UserInfo
      if (user.username != "Totals") {
        if (userInfo[user.username]) {
          userInfo[user.username].push(user);
        } else {
          userInfo[user.username] = [user];
        }
      }

      // agregar proyectos a la lista de ProjInfo
      if (user.username != "Totals") {
        if (projInfo[user.projectname]) {
          projInfo[user.projectname].push(user);
        } else {
          projInfo[user.projectname] = [user];
        }
      }

      // agregar proyectos y sus líderes a la lista de ProjNameLeads
      if (!projNameLeads[user.projectname]) {
        if (user.username != null) {
          if (user.role == "Leader") {
            projNameLeads[user.projectname] = user.projectlead;
          }
        }
      }
    });

    /! Equipos !/
    // iteramos todo user info 
    //key = nombre 
    //value = todo el obj de user
    let count = 1;
    for (const [key, value] of Object.entries(userInfo)) {
      // itera por cada objeto (entry) de cada persona
      value.forEach((entry) => {
        // checa si el usuario(key) en cada proj(entry) tuvo mas de 40hrs
        if (entry.totalHrs >= hoursToComplete) {
          // dentro de ese proj(entry) itera por cada usuario
          projInfo[entry.projectname].forEach((userInProj) => {
            // checamos si el usuario(key) es diferente al userInProj y si el userInProj SÍ cumplió las 40 hrs
            if (userInProj.username != key && userInProj.totalHrs >= hoursToComplete) {
              // si el equipo de usuario(key) todavía no exsite lo creamos y agregamos userInProj
              if (!teams[key]) {
                teams[key] = [userInProj];
              }
              else {
                let evaluatee = teams[key].find(e => e.username == userInProj.username);
                if (evaluatee != undefined) {
                  // si rol es igual entonces no se agrega
                  let index = teams[key].findIndex(e => e.username == userInProj.username);
                  if (teams[key][index].role != userInProj.role) {
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
    for (const [key, value] of Object.entries(userInfo)) {
      if (!teams[key]) {
        if (orphans[key]) {
          orphans[key].push(value);
        } else {
          orphans[key] = [value];
        }
      }
      else {
        userInfo[key].role = 1;
      }

    }

    /! Equipos Huerfanos !/
    for (const [key, value] of Object.entries(userInfo)) {
      if (orphans[key]) {
        // itera por cada objeto (entry) de cada persona
        value.forEach((entry) => {
          // dentro de ese proj(entry) itera por cada usuario
          projInfo[entry.projectname].forEach((userInProj) => {
            if (projInfo[entry.projectname].length > 1) {
              // checamos si el usuario(key) es diferente al userInProj
              if (userInProj.username != key) {
                // si el equipo de usuario(key) todavía no exsite lo creamos y agregamos userInProj
                if (!orphanTeams[key]) {
                  orphanTeams[key] = [userInProj];
                }
                else {
                  // checamos si userInProj ya esta en el equipo con el mismo rol
                  if (orphanTeams[key].includes(userInProj.username)) {
                    // si rol es igual entonces no se agrega
                    if (orphanTeams[key].role != userInProj.role) {
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
            // si el huerfano esta SOLO en un equipo agregar al líder
            else {
              if (!orphanTeams[key]) {
                orphanTeams[key] = [userInProj.projectlead];
              }
              else {
                // checamos si userInProj ya esta en el equipo con el mismo rol
                if (orphanTeams[key].includes(userInProj.username)) {
                  // si rol es igual entonces no se agrega
                  if (orphanTeams[key].role != userInProj.role) {
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

    /! Agregar a tablas !/

    // Evaluation_Periods
    const tempPer = await db.sequelize.query(`select top(1) * from Evaluation_Periods order by id desc`, { type: QueryTypes.SELECT })
    
    // Employees
    let assigned;
    for (const [key, value] of Object.entries(userInfo)) {
      if (!orphans[key]) { // if key is not in orphans
        assigned = true;
      } else {
        assigned = false;
      }

      const tempEmp = await Employee.create({ is_assigned: assigned, email: '', employee_name: key, is_HR: 0 });

      // Teams
      const tempTeam = await Team.create({ id_employee: tempEmp.id, id_period: tempPer[0].id, approved_HR: 0, approved_Emp: 0, is_team_orphan: !assigned });
    }

    // se necesita crear uno NA por que hay veces donde no hay líder
    const tempEmp = await Employee.create({ is_assigned: 0, email: '', employee_name: "NA", is_HR: 0 });

    // Projects
    for (const [key, value] of Object.entries(projNameLeads)) {
      if (key != null) {
        // cuando el lider no es empleado Lazaro Salinas tmb lo agregamos a huerfanos
        if (await Employee.findOne({ where: { employee_name: value } }) == null) {
          const user = new User("NA", key, value, value, 0, 0, 0);
          const tempEmp = await Employee.create({ is_assigned: 0, email: '', employee_name: value, is_HR: 0 });
          orphans[value] = [user];
        }

        const emp = await Employee.findOne({ where: { employee_name: value } });
        const tempProj = await Project.create({ project_name: key, id_employee_leader: emp.id, id_period: tempPer[0].id });
      }
    }

    // Employee_Projects
    let projRole;
    let didComplete;

    for (const [key, value] of Object.entries(projInfo)) {
      value.forEach(async (user) => {
        const emp = await Employee.findOne({ where: { employee_name: user.username } });
        const proj = await Project.findOne({ where: { project_name: key } });

        if (user.role == "Leader") {
          projRole = 1;
        } else {
          projRole = 0;
        }

        if (user.totalHrs >= tempPer[0].hours_to_complete) {
          didComplete = 1;
        } else {
          didComplete = 0;
        }

        const tempEmpProj = Employee_Project.create({
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
    for (const [key, value] of Object.entries(teams)) {
      const empKey = await Employee.findOne({ where: { employee_name: key } });

      value.forEach(async (user) => {

        const empUser = await Employee.findOne({ where: { employee_name: user.username } });
        const teamKey = await Team.findOne({ where: { id_employee: empKey.id } });

        if (empKey.employee_name == user.projectlead) {
          teamRole = 2; // team
        } else if (user.role == 'Leader') {
          teamRole = 0; // leader
        } else if (user.role == 'Peer') {
          teamRole = 1; // peer
        }
        //console.log(teamKey.id);
        const tempEmpTeam = await Employee_Team.create({ role_member: teamRole, status_member: 0, id_employee: empUser.id, id_team: teamKey.id });
      })
    }

    // Orphans
    let contOrphanTeam = 0;
    // const answer = await parteDos(orpahanTeams);
    // res.send(answer); 
    for (const [key, value] of Object.entries(orphanTeams)) {
      if (orphanTeams[key].length > 1) {
        value.forEach(async (user) => {
          const keyEmp = await Employee.findOne({ where: { employee_name: key } });
          const keyTeam = await Team.findOne({ where: { id_employee: keyEmp.id } });
          const userEmp = await Employee.findOne({ where: { employee_name: user.username } });

          if (keyEmp.employee_name == user.projectlead) {
            teamRole = 2; // team
          } else if (user.role == 'Leader') {
            teamRole = 0; // leader
          } else if (user.role == 'Peer') {
            teamRole = 1; // peer
          }

          const tempOrphanTeam = await Orphan_Team.create({ role_member: teamRole, status_member: 0, id_employee: userEmp.id, id_team: keyTeam.id });

        })
      }
    }

  });

  // de jessy
  console.log("inside the file saving part");
  res.status(200).send({ message: "upload successful" });

}

// la usamos en Consultar Equipos
const getEmployees = async (req, res) => {
  const employees = await db.sequelize.query(`select * from Employees where is_assigned = 1`, { type: QueryTypes.SELECT })
  res.send(employees);
};

const getTeams = async (req, res) => {
  const teams = await db.sequelize.query(`select * from Teams`, { type: QueryTypes.SELECT })
  res.send(teams);
};

const getEmployeeProjects = async (req, res) => {
  const empProj = await db.sequelize.query(`select * from Employee_Projects`, { type: QueryTypes.SELECT })
  res.send(empProj);
};

const getEmployeeTeams = async (req, res) => {
  const empTeams = await db.sequelize.query(`select * from Employee_Teams`, { type: QueryTypes.SELECT })
  res.send(empTeams);
};

const getEvaluationPeriods = async (req, res) => {
  const evalPeridos = await db.sequelize.query(`select * from Evaluation_Periods`, { type: QueryTypes.SELECT })
  res.send(evalPeridos);
};

const getProjects = async (req, res) => {
  const proj = await db.sequelize.query(`select * from Projects`, { type: QueryTypes.SELECT })
  res.send(proj);
};

const getRequests = async (req, res) => {
  const request = await db.sequelize.query(`select * from Requests where status=1 or status=2`, { type: QueryTypes.SELECT })
  res.send(request);
};

const getHasUploaded = async (req, res) => {
  const hasU = await db.sequelize.query(`select has_uploaded from Evaluation_Periods where evaluation_year='2021-2022' and semester='SepFeb'`, { type: QueryTypes.SELECT });
  res.send(hasU);
};

// regresa los empleados que son huerfanos
const getOrphanEmployees = async (req, res) => {
  const orphans = await db.sequelize.query(`select * from Employees where is_assigned = 0 and employee_name != 'NA'`, { type: QueryTypes.SELECT })
  res.send(orphans);
};

// regresa los equipos provicionales de los huerfanos
const getOrphanTeams = async (req, res) => {
  const orphanTeams = await db.sequelize.query(`select * from Orphan_Teams`, { type: QueryTypes.SELECT })
  res.send(orphanTeams);
};

const requestAdd = async(req, res) => {
	//console.log(req.body);	
  //const resultado = await db.sequelize.query(`EXEC ADDREQUEST :motive, :id_emp_mod, :type, :id_emp_req, :status, :title`, 
  //{replacements: { motive: req.body.motive, id_emp_mod: req.body.id_emp_mod, type: req.body.type, id_emp_req: req.body.id_emp_req, status: req.body.status, title: req.body.title }})
  const resultado = await db.sequelize.query(`EXEC ADDREQUEST :motive, :id_emp_mod, :type, :id_emp_req, :status, :title, :id_team`, 
  {replacements: { motive: req.body.motive, id_emp_mod: req.body.id_emp_mod, type: req.body.type, id_emp_req: req.body.id_emp_req, status: req.body.status, title: req.body.title, id_team: req.body.id_team }})
  res.status(200).send({message: "post request successful"});
}; 

const removeHR = async(req, res) => {
	//console.log(req.body);	
  const resultado = await db.sequelize.query(`EXEC REMOVEHR :id, :idReqBy, :idRemove`, 
  {replacements: { id: req.body.id, idReqBy: req.body.idReqBy, idRemove: req.body.idRemove }})
  res.status(200).send({message: "remove by HR successful"});
};

const approveHR = async(req, res) => {
	//console.log(req.body);	
  const resultado = await db.sequelize.query(`EXEC APPROVEHR :id`, 
  {replacements: { id: req.body.id }})
  res.status(200).send({message: "approve by HR successful"});
};

const requestRemove = async(req, res) => {
	//console.log(req.body);	
  const resultado = await db.sequelize.query(`EXEC REMOVEREQUEST :motive, :id_emp_mod, :type, :id_emp_req, :status, :title, :id_employee_teams`, 
  {replacements: { motive: req.body.motive, id_emp_mod: req.body.id_emp_mod, type: req.body.type, id_emp_req: req.body.id_emp_req, status: req.body.status, title: req.body.title, id_employee_teams: req.body.id_employee_teams }})
  res.status(200).send({message: "post request successful"});
}; 

const declineRequest = async(req, res) => {
	//console.log(req.body);	
  const resultado = await db.sequelize.query(`EXEC DECLINEREQUEST :id_request, :id_employee_teams, :type`, 
  {replacements: { id_request: req.body.id_request, id_employee_teams: req.body.id_employee_teams, type: req.body.type }})
  res.status(200).send({message: "decline request successful"});
}; 

const acceptRequest = async(req, res) => {
	//console.log(req.body);	
  const resultado = await db.sequelize.query(`EXEC ACCEPTREQUEST :id_request, :id_employee_teams, :type`, 
  {replacements: { id_request: req.body.id_request, id_employee_teams: req.body.id_employee_teams, type: req.body.type }})
  res.status(200).send({message: "decline request successful"});
}; 

const addHR = async(req, res) => {
	//console.log(req.body);	
  const resultado = await db.sequelize.query(`EXEC ADDHR :id_emp_mod, :id_team`, 
  {replacements: { id_emp_mod: req.body.id_emp_mod, id_team: req.body.id_team }})
  res.status(200).send({message: "add by HR successful"});
};

const removeUnassigned = async(req, res) => {
	//console.log(req.body);	
  const resultado = await db.sequelize.query(`EXEC REMOVEUNASSIGNED :id`, 
  {replacements: { id: req.body.id }})
  res.status(200).send({message: "remove unassigned successful"});
};





module.exports = {
  upload,
  getEmployees,
  getTeams,
  getEmployeeProjects,
  getEmployeeTeams,
  getEvaluationPeriods,
  getProjects,
  getRequests,
  getHasUploaded,
  getOrphanEmployees,
  getOrphanTeams,
  requestAdd: requestAdd,
  removeHR: removeHR,
  approveHR: approveHR,
  requestRemove: requestRemove,
  declineRequest: declineRequest,
  acceptRequest: acceptRequest,
  addHR: addHR,
  removeUnassigned: removeUnassigned
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
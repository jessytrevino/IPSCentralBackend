const db = require("../models");
const readXlsxFile = require("read-excel-file/node");
const { type } = require("express/lib/response");
const Employee = db.Employee; //TODO: lo mismo con todos los modelos
const Evaluation_Period = db.Evaluation_Period;
const Employee2 = db.Employee2;

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
            this.role = "Peer";
        }
    }
  }

  let userInfo = [];
  let projInfo = [];
  let teams = [];
  let orphans = [];

  //let path = '/Users/robertasaldana/Downloads/equipos.xlsx'; //preguntar dsp path del folder de resoures + nombre del arch
  //? Cual es el nombre del archivo?
  let path = '/Users/robertasaldana/Desktop/IPSCentralBackend/src/resources/static/assets/uploads/equipos.xlsx' 
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

          
      });

      // iteramos todo user info 
        //key = nombre 
        //value = todo el obj de user
      for(const[key, value]of Object.entries(userInfo)){
        // itera por cada objeto (entry) de cada persona
        value.forEach((entry) => {
            // checa si el usuario(key) en cada proj(entry) tuvo mas de 40hrs
            if (entry.totalHrs >= 40) {
                // dentro de ese proj(entry) itera por cada usuario
                projInfo[entry.projectname].forEach((userInProj) => { 
                    // checamos si el usuario(key) es diferente al userInProj y si el userInProj SÍ cumplió las 40 hrs
                    if (userInProj.username != key && userInProj.totalHrs >= 40) {
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
        }
      }

      //console.log(orphans);
      //console.log({id_employee: 40, is_assigned: 1, employee_name: "roberta", is_HR: 0});
      const temp = await Employee2.create({is_assigned: 1, email: 'roberta@gail.com', employee_name: 'roberta', is_HR: 0})
      console.log("ghola");
      console.log(temp);

      // const temp = await Evaluation_Period.create({semester: 'FebSep', evaluation_year: 2022, hours_to_complete: 40});
      // console.log(temp);


      const [results, metadata] = await sequelize.query("SELECT * FROM Employee");
      console.log(results)
      console.log(metadata)

    });


  // console.log(userInfo);
  // userInfo.forEach(user => {
  //     console.log(user);
  //   })



    console.log("inside the file saving part");
    res.status(200).send({message: "upload successful"});


}

const getTables = (req, res) => {
  Tutorial.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

module.exports = {
  upload,
  getTables,
};

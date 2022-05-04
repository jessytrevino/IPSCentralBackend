const db = require("../models");
const Tutorial = db.tutorials; // como le hacemos? db.tutorials es el modelo. como le hariamos con 7 modelos?
const readXlsxFile = require("read-excel-file/node");
const { type } = require("express/lib/response");
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
  let projInfo = {};
  let teams = {};

  let path = '/Users/robertasaldana/Downloads/equipos.xlsx';//preguntar dsp path del folder de resoures + nombre del arch
  //let path = '/Users/robertasaldana/Downloads/Reporte horas-equipos 360 (1).xlsx';

readXlsxFile(path).then((rows) => {
      rows.shift(); //se salta los headers

      rows.forEach((col) => {

          let bill = 0;
          let nonbill = 0;
          let totalHr = 0;

          for (let i = 4; i < 10; i++) {
              if (col[i] != '-'){
                  bill = bill + col[i];
              }
              
          }
          for (let i = 10; i < 15; i++) {
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
      //console.log(projInfo);

      
      //return Promise.all([userInfo, projInfo]);

      /*userInfo.forEach((user) => { // itera por persona
        user.forEach((entry) => { // itera por cada entry de cada persona
            if (entry.totalHrs >= 40) { // checamos si el usuario en ese proj tuvo mas de 40 hrs
                projInfo[entry.projectname].forEach((userInProj) => { // itera por usuario en cada proj    
                    if (userInProj.username != user.username && userInProj.totalHrs >= 40) { // checamos si el usuario que estamos evaluando es diferente al del equipo y 
                        //teams[user.username].forEach((usuario) => { // checamos si usuario ya esta en team
                        if (!teams[user.username]){ // si el equipo todavía no existe lo creamos y agregamos el usuario
                          teams[user.username] = [userInProj];
                        } else {
                          if (team[user.username].include(userInProj.username)){ // 
                            if (teams[user.username].role != userInProj.role){
                              teams[user.username].push(userInProj);
                            } // si rol es igual entonces no se agrega
                          }
                          else {
                            teams[user.username].push(userInProj);
                            //se agrega
                          }
                        }
                    }
                })
            }
            
        })
  
    })*/
    console.log(typeof(userInfo))
    userInfo.forEach(x =>{
      console.log(x);
    })
    console.log(teams)
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

const readXlsxFile = require('read-excel-file/node')


//class
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

let userInfo = {};
let projInfo = {};
let teams = {};

let path = '/Users/robertasaldana/Downloads/equipos.xlsx';
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
    return userInfo;
    return projInfo;
    //console.log(projInfo);
});

console.log(userInfo);



Object.keys(userInfo).forEach((user) => { // itera por persona
    user.forEach((entry) => { // itera por cada entry de cada persona
        if (entry.totalHrs >= 40) { // checamos si el usuario en ese proj tuvo mas de 40 hrs
            projInfo[entry.projectname].forEach((userInProj) => { // itera por usuario en cada proj    
                if (userInProj.username != user.username && userInProj.totalHrs >= 40) { // checamos si el usuario que estamos evaluando es diferente al del equipo y 
                    teams[user.username].forEach((usuario) => { // checamos si usuario ya esta en team
                        if (team[user.username].include(usuario.username)){ // 

                        }
                    })
                }
            })
        }
        
    })

})


/*
funcionamiento del include
    let array1 = {};
    array1[1] = [2];
    array1[1].push(4);
    array1[1].push(5);
    console.log(array1);

    console.log(array1[1].includes(6));
*/




// let array = {};

// array["eduardo"] = ["Hola"];
// array["eduardo"].push("Bye");
// array["roberta"] = ["Hola"];
// array["roberta"].push("Bye");

// console.log(array);

// let cont = 0;
// // array.foreach((dato) => {
// //     dato;
// //     console.log(cont++);
// // });

// for (let i = 0; i<array.length; i++){
//     console.log(i);
// }

// UserInfo = todo los obj de usuarios
// ProjInfo = lista de usuarios y todos los usuarios en ese proj

// for (int key = 0; key < UserInfo.size(); key++ { //itera por persona
//     for UserInfo[key][i] //itera por projecto de persona
//         for ProjInfo[UserInfo[key][i].ProjName] //itera el projecto
//             //checamos si cada usuario cumplió con las horas
//             if (ProjInfo[UserInfo[key][i].ProjName.TotalHours >= 40]) //checamos si user 1 cumplio las horas
//                 if (team[UserInfo[key].username]){ //checa si el equipo de esta persona ya comenzo solo hace push si no crea equipo
//                     team[UserInfo[key].username].push(ProjInfo[UserInfo[key][i].name]) //push objeto que contenga name rol y hr
//                 } else {
//                     team[UserInfo[key].username] = ProjInfo[UserInfo[key][i].name] //crear equipo
//                 }
// }



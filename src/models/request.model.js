const teamModel = require("./team.model");

module.exports = (sequelize, Sequelize) => {
    const Request = sequelize.define("Requests", {
        // id_request: {
        //     type: Sequelize.INTEGER,
        //     allowNull: false
        // },
        motive: {
            type: Sequelize.STRING,
            allowNull: false
        },
        id_emp_mod: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Employee',
                key: 'id_employee'
            },
            allowNull: false
        },
        id_emp_req: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Employee',
                key: 'id_employee'
            },
            allowNull: false
        },
        type: {
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.INTEGER,
        }
    }, {
        timestamps: false
    });
    return Request;
};
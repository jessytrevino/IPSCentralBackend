const teamModel = require("./team.model");

module.exports = (sequelize, Sequelize) => {
    const Request = sequelize.define("Request", {
        id_request: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        motive: {
            type: Sequelize.VARCHAR(255),
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
        status: {
            type: Sequelize.INTEGER,
        }
    });
    return Request;
};
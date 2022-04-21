const { sequelize, Sequelize } = require(".")

module.exports = (sequelize, Sequelize) => {
    const Employee = sequalize.define("Employee", {
        id_employee: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        is_assigned: {
            type: Sequelize.BIT,
            allowNull: false
        },
        email: {
            type: Sequelize.VARCHAR(255),
            allowNull: false
        },
        employee_name: {
            type: Sequelize.VARCHAR(255),
            allowNull: false
        },
        is_HR: {
            type: Sequelize.BIT,
            allowNull: false
        }
    });
    return Employee;
};
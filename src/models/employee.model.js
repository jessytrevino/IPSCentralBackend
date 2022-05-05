module.exports = (sequelize, Sequelize) => {
    const Employee = sequelize.define("Employee", {
        id_employee: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        is_assigned: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            
        },
        employee_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        is_HR: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        }
    });
    return Employee;
};
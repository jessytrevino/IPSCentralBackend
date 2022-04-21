module.exports = (sequelize, Sequelize) => {
    const Employee_Team = sequelize.define("Employee_Team", {
        id_employee_team: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        role_member: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        status_member: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        id_employee: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Employee',
                key: 'id_employee'
            },
            allowNull: false
        },
        id_team: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Team',
                key: 'id_team'
            },
            allowNull: false
        },
    });
    return Employee_Team;
};
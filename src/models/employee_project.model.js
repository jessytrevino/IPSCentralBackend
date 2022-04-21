module.exports = (sequelize, Sequelize) => {
    const Employee_Project = sequelize.define("Employee_Project", {
        id_employye_project: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        completed_hours: {
            type: Sequelize.BIT,
            allowNull: false
        },
        project_role: {
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
        id_project: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Project',
                key: 'id_project'
            }
        }
    });
    return Employee_Project;
};
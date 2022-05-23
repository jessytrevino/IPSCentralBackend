module.exports = (sequelize, Sequelize) => {
    const Employee_Project = sequelize.define("Employee_Projects", {
        // id_employye_project: {
        //     type: Sequelize.INTEGER,
        //     allowNull: false
        // },
        did_complete: {
            type: Sequelize.BOOLEAN,
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
            }
        },
        id_project: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Project',
                key: 'id_project'
            }
        },
        billHrs: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        nonBillHrs: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false
    });
    return Employee_Project;
};
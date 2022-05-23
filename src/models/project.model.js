module.exports = (sequelize, Sequelize) => {
    const Project = sequelize.define("Projects", {
        // id_project: {
        //     type: Sequelize.INTEGER,
        //     allowNull: false
        // },
        project_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        id_employee_leader: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Evaluation_Period',
                key: 'id_period'
            },
            allowNull: false
        },
        id_period: {
            type: Sequelize.INTEGER,
            referebces: {
                model: 'Employee',
                key: 'id_employee'
            },
            allowNull: false
        }
    }, {
        timestamps: false
    });
    return Project;
};
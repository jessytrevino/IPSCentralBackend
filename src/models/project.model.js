module.exports = (sequelize, Sequelize) => {
    const Project = sequelize.define("Project", {
        id_project: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        project_name: {
            type: Sequelize.VARCHAR(255),
            allowNull: false
        },
        id_employye_leader: {
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
    });
    return Project;
};
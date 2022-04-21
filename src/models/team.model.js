module.exports = (sequelize, Sequelize) => {
    const Team = sequelize.define("Team", {
        id_team: {
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
        id_period: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Evaluation_Period',
                key: 'id_period'
            },
            allowNull: false
        },
        approved_HR: {
            type: Sequelize.BIT,
        },
        approved_Emp: {
            type: Sequelize.BIT,
        }
    });
    return Team;
};
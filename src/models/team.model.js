module.exports = (sequelize, Sequelize) => {
    const Team = sequelize.define("Teams", {
        // id_team: {
        //     type: Sequelize.INTEGER,
        //     allowNull: false
        // },
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
            type: Sequelize.BOOLEAN,
        },
        approved_Emp: {
            type: Sequelize.BOOLEAN,
        },
        is_team_orphan: {
            type: Sequelize.BOOLEAN,
        }
    }, {
        timestamps: false
    });
    return Team;
};
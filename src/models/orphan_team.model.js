module.exports = (sequelize, Sequelize) => {
    const Orphan_Team = sequelize.define("Orphan_Teams", {
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
    }, {
        timestamps: false
    });
    return Orphan_Team;
};
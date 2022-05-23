module.exports = (sequelize, Sequelize) => {
    const Evaluation_Period = sequelize.define("Evaluation_Periods", {
        // id_period: {
        //     type: Sequelize.INTEGER,
        //     allowNull: false
        // },
        semester: {
            type: Sequelize.STRING,
            allowNull: false
        },
        evaluation_year: {
            type: Sequelize.STRING,
            allowNull: false
        },
        hours_to_complete: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false
    });
    return Evaluation_Period;
};
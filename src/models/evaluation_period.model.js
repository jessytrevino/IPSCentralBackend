module.exports = (sequelize, Sequelize) => {
    const Evaluation_Period = sequelize.define("Evaluation_Period", {
        // id_period: {
        //     type: Sequelize.INTEGER,
        //     allowNull: false
        // },
        semester: {
            type: Sequelize.STRING,
            allowNull: false
        },
        evaluation_year: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        hours_to_complete: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });
    return Evaluation_Period;
};
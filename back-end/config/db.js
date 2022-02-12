const Sequelize = require('sequelize');

const sequelize = new Sequelize("examen", "root", "", {
    dialect: "mysql",
    host: "localhost",
    define: {
        timestamps: true,
    }
})

module.exports = sequelize;
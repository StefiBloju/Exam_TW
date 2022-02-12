const db = require("../models").db;


const controller = {
    reset: (req, res) => {
        db.sequelize.sync({force: true})
            .then(() => {
                res.status(201).send({
                    message: 'Database reset'
                })
            })
            .catch(() => {
                res.status(500).send({
                    message: 'Reset DB error'
                })
            })
    },

}



module.exports = controller

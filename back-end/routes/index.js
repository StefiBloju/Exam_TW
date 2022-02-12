const express = require('express')
const router = express.Router();
const otherRouter = require('./other')
const movieRouter = require('./movie');
const crewMemberRouter=require('./crewMember');

if(process.env.NODE_ENV !== 'production') {
    router.use('/', otherRouter);
}
router.use('/', movieRouter);
router.use('/',crewMemberRouter);

module.exports = router
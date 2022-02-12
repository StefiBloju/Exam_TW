const express = require("express");
const router = express.Router();
const crewMemberController = require("../controllers/crewMember");

router.post('/crewMember',crewMemberController.addCrewMember);
router.get('/crewMember',crewMemberController.getAllCrewMembers);
router.get('/crewmember/:id',crewMemberController.getCrewmembers);
router.put('/crewMember/:id',crewMemberController.updateCrewMember);
router.delete('/crewMember/:id',crewMemberController.deleteCrewMember);

module.exports = router;


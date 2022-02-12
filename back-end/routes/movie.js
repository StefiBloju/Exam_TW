const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movie");

router.post('/movie',movieController.addMovie);
router.get('/movie',movieController.getAllMovies);
router.put('/movie/:id',movieController.updateMovie);
router.delete('/movie/:id',movieController.deleteMovie);

module.exports = router;


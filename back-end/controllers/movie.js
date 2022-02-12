const MovieDB=require('../models').Movie;

const express = require("express");


const controller = {
    addMovie: async (req,res) => {
        const movie = {
            title:req.body.title,
            category:req.body.category,
            publicationDate:req.body.publicationDate
        }
        let err=false;
        if(movie.title.length<=3) {
            res.status(400).send({message:"Name must be at least 3 characters long"})
            err=true;
        }
        if(movie.category!=="COMEDY" && movie.category!=="ACTION" && movie.category!=="ROMANCE" && movie.category!=="THRILLER") {
            res.status(400).send({message:"category must be from the list"});
            err=true;
        }
        if(!err) {
            try {
                const newMovie=await MovieDB.create(movie);
                res.status(200).send("movie added");
            }
            catch (error) {
                console.log('Error:',error);
                res.status(500).send("Error creating new movie!");
            }
        }
    },
    getAllMovies: async(req,res) => {
        try {
            let movies=await MovieDB.findAll();
            res.status(200).send(movies);
        } catch(err){
            res.status(500).send({
                message: "Error selecting all movies!"
            })
        }
    },

    updateMovie: async(req,res) => {
        let movieId=req.params['id'];
        const movie=await MovieDB.findOne({where:{id:movieId}});
        movie.update({
            title:req.body.title,
            category:req.body.category,
            publicationDate:req.body.publicationDate
        })
            .then(() => {
                res.status(200).send({message:"Edited movie"})
            })
            .catch(() => {
                res.status(500).send({message:"Error"})
            })
    },
    deleteMovie : async(req,res) => {
        try{
            let movieId = req.params['id'];
            const movie = await MovieDB.destroy({
                where: {
                    id: movieId
                }
            })
            res.status(200).send({
                message: "Movie " + movieId + " deleted."
            });
        }catch(error){
            res.status(500).send({
                message: "Error deleting Movie!"
            })
        }
    }
}

module.exports = controller;
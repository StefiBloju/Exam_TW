const CrewMemberDB=require('../models').CrewMember;

const express = require("express");


const controller = {
    addCrewMember: async (req,res) => {
        const crewMember = {
            name: req.body.name,
            role:req.body.role,
            movieId:req.body.movieId
        }
        let err = false;

        if(crewMember.name.length<5) {
            res.status(400).send({message:"Name must be at least 5 characters long"})
            err=true;
        }
        if(crewMember.role!=="DIRECTOR" && crewMember.role!=="WRITER" && crewMember.role!=="DESIGNER" ) {
            res.status(400).send({message:"Role must be from the list"});
            err=true;
        }

        if(!err) {
            try {
                const newCrewMember=await CrewMemberDB.create(crewMember);
                res.status(200).send("crewMember added");
            }
            catch (error) {
                console.log('Error:',error);
                res.status(500).send("Error creating new crewMember!");
            }
        }
    },
    getAllCrewMembers: async(req,res) => {
        try {
            let crewMembers=await CrewMemberDB.findAll();
            res.status(200).send(crewMembers);
        } catch(err){
            res.status(500).send({
                message: "Error selecting all crewMembers!"
            })
        }
    },

    getCrewmembers: async(req, res) => {
        try{
            let crewmemberId = req.params['id'];
            const crewmembers = await CrewMemberDB.findAll({ where : { movieId: crewmemberId }});
            res.status(200).send(crewmembers);
        } catch(err){
            res.status(500).send({
                message: "Error selecting crewmember!"
            })
        }
    },

    updateCrewMember: async(req,res) => {
        let crewMemberId=req.params['id'];
        const spacecraft=await CrewMemberDB.findOne({where:{id:crewMemberId}});
        spacecraft.update({
            name:req.body.name,
            role:req.body.role,
            movieId: req.body.movieId
        })
            .then(() => {
                res.status(200).send({message:"Edited crewMember"})
            })
            .catch(() => {
                res.status(500).send({message:"Error"})
            })
    },
    deleteCrewMember : async(req,res) => {
        try{
            let crewMemberId = req.params['id'];
            const spacecraft = await CrewMemberDB.destroy({
                where: {
                    id: crewMemberId
                }
            })
            res.status(200).send({
                message: "crewMember " + crewMemberId + " deleted."
            });
        }catch(error){
            res.status(500).send({
                message: "Error deleting crewMember!"
            })
        }
    }

}

module.exports = controller;
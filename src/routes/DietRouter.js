const express = require('express')
const DietRouter = express.Router()
const { Diet } = require('../db');

DietRouter.get('/', async (req, res) => {
    try{
        let typesDiet = await Diet.findAll();
        res.status(200).send(typesDiet);
    } catch (error){
        res.status(400).send(error);
    }
})


module.exports = DietRouter;
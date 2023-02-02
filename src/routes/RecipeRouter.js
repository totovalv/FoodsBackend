const { Router } = require('express');
const { getRecipeByName, getRecipeByID,getDbRecipeById,getDBRecipeByName,getAllInfo, getDBInfo } = require('../controllers/controller');
const db = require('../db');
const RecipeRouter = Router();
const { Recipe, Diet} = require('../db');

RecipeRouter.get("/",async(req,res)=>{
    const {name}=req.query
    try {
        if(name){
            const dbResult= await getDBRecipeByName(name)
            const result=await getRecipeByName(name)
            
            const total= await dbResult.concat(result)
            if(total.length===0) {throw new Error("Not Found 404")}else{

                res.status(200).send(total)
            }
           
        }else{
            const allDate = await getAllInfo() 
            res.status(200).send(allDate)
        }
   } catch (error) {
    console.log(error);
        res.status(400).send(error.message)
   }
})



RecipeRouter.get("/:id", async(req,res)=>{
    const {id}= req.params
    try {
      if(id.length>15){
    const result=await getDbRecipeById(id)
       if(result.length===0){
        throw new Error("Not Found By ID")
       }else{
         res.status(200).json(result)}
      }else{
        const response= await getRecipeByID(id)
        res.status(200).json(response)
      }
    } catch (error) {
        res.status(400).send(error.message)
        console.log(error);
    }
})



RecipeRouter.post("/",async(req,res)=>{
    try {
        const {health_score,summary,name,steps,diets,stock}=req.body
        if(!stock||!health_score|| !summary ||!name||!steps ||health_score<0||health_score>100){
            throw new Error("Creation Error")
        } else {
                let dietFind=  await Diet.findAll({where:{name:diets}})
              const newRecipe= await Recipe.create({health_score,summary,name,steps,stock})
              await newRecipe.addDiets(dietFind)
          return res.status(201).send(newRecipe)}
    } catch (error) {
        return res.status(400).send(error.message)
    }
})




module.exports = RecipeRouter;

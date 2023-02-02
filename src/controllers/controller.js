const axios = require("axios");
const db = require("../db");
const { Diet, Recipe } = require("../db");
const {API_KEY}=process.env
const { Op } = require("sequelize");


const getApiInfo = async()=>{
    const recipes = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=10`)
    const { results } = recipes.data ;
   
        
    if (results.length > 0) {

        const posts = await Promise.all(
             results.map(async(result) => {
                return await{
                    name: result.title,
                    img: result.image, 
                    id: result.id, 
                    health_score: await healthScore(result.id),
                    diets: await dietsFunction(result.id) ,
                }        
            })
        )
        return posts 
            
} 
}

const getDbRecipeById= async(id)=>{
    let dataDB= await Recipe.findAll({
        where:{
            id:`${id}`
        },
        include:{
            model:Diet,
            attributes:["name"],
            through: {
                attributes: [],
            }, 
        }
    })
    let response = await dataDB?.map(recipe => {
        return {
            id: recipe.id,
            name: recipe.name,
            summary: recipe.summary,
            health_score: recipe.health_score,
            img: recipe.img,                
            steps: recipe.steps,
            diets: recipe.diets?.map(diet => diet.name),
            stock:recipe.stock
        }
    });
return response;

}
function removeTags(str) {
    if ((str===null) || (str===''))
        return false;
    else
        str = str.toString();
    return str.replace( /(<([^>]+)>)/ig, '');
}


const getRecipeByID= async(id)=>{
    const recipe= await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`)
    const result = recipe.data
    let arr=[]
    let obj={}
     obj={
        name: result.title, 
        img: result.image, 
        id: result.id, 
        health_score: result.healthScore, 
        diets: result.diets?.map(element => element),
        types: result.dishTypes?.map(element => element), 
        summary:removeTags(result.summary), 
        steps: removeTags(result.instructions)
       }
       arr.push(obj)
    return arr
      
}

const stepsFunction= async(id)=>{
    const recipe= await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`)
    const result = recipe.data
    let obj={}
     obj={
        steps: result.analyzedInstructions[0].steps.map(element => element.step)
       }
    return obj.steps     
}


const dietsFunction= async(id)=>{
    const recipe= await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`)
    const result = recipe.data
    let obj={}
     obj={
        diets: result.diets.map(element => element )
       }
    return obj.diets
      
}


const dishTypes= async(id)=>{
    const recipe= await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`)
    const result = recipe.data
    let obj={}
     obj={
        dishTypes: result.dishTypes.map(element => element )
       }
    return obj.dishTypes
      
}
const healthScore= async(id)=>{
    const recipe= await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`)
    const result = recipe.data
    let aux= result.healthScore
   
    return aux
      
}

const getRecipeByName= async(name)=>{
    const recipes = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=100`)
    let {results} = recipes.data
    let recipeFinded=[]
const aux= await Promise.all(
    results.map(async(e)=>{    
        if(e.title.toLowerCase().includes(name.toLowerCase())){
            return recipeFinded.push({
                name:e.title,
                img:e.image,
                health_score:e.healthScore ,
                id:e.id,
                dishTypes: await dishTypes(e.id),
                steps: await stepsFunction(e.id),
                diets:await dietsFunction(e.id)
                
        })
          
        }   
    }))
    return recipeFinded
}

const getDBRecipeByName =async(name)=>{
    const dataDB= await Recipe.findAll({ 
        where:{
            name:{
                [Op.substring]: `${name}`  
            }
        },
        attributes:["name","id","summary","health_score","steps","img"]
        ,include:{
            model:Diet,
            attributes:["name"],
            through:{
                attributes:[]
            }
        }
    })
    let response = await dataDB?.map(recipe => {
        return {
            id: recipe.id,
            name: recipe.name,
            summary: recipe.summary,
            health_score: recipe.health_score,
            img: recipe.img,
            steps: recipe.steps,
            diets: recipe.diets
            ?.map(diet => diet.name),
        }
    });
return response;


}

const getDBInfo = async () => {
    try{
        const dataDB =  await Recipe.findAll({ 
            include:{   
                model: Diet,
                attributes: ['name'],
                through:{
                    attributes: []
                }
            }
        })
        let response = await dataDB?.map(recipe => {
                 return {
                     id: recipe.id,
                     name: recipe.name,
                     summary: recipe.summary,
                     health_score: recipe.health_score,
                     img: recipe.img,
                     steps: recipe.steps,
                     diets: recipe.diets
                     ?.map(diet => diet.name),
                 }
             });
        return response;
    }catch (error) {
      console.error(error);
    }
}


const getAllInfo = async () => {
    
            
            const bdInfo = await getDBInfo();
            const apiInfo = await getApiInfo();
            const all=apiInfo.concat(bdInfo) 
        return all;
 }





 

module.exports = {
    getApiInfo,getRecipeByID,getRecipeByName,getDbRecipeById,getDBRecipeByName,getDBInfo,getAllInfo,
}



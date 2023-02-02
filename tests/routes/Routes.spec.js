/* eslint-disable import/no-extraneous-dependencies */
const chai = require("chai");
const { expect } = chai
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Recipe,conn } = require('../../src/db.js');

const agent = session(app);
const recipe = {
  name: "12312",
  health_score:23,
	summary:"asudhasuhduash",
	steps:"askdjkas",
  diets:["primal,whole 30"],
  dishTypes:"asdas"
  
};
const recipe2 = {
  name: "12312",
  health_score:null,
	summary:"asudhasuhduash",
	steps:"askdjkas",
  diets:["gluten,vegan"]
  
};

describe('Recipes GET/', () => {
  before(() => conn.authenticate()
  .catch((err) => {
    console.error('No se puede conectar a la base de datos:', err.message);
  }));
  beforeEach(() => Recipe.sync({ force: true })
    .then(() => Recipe.create(recipe)));
  describe('GET /recipes', () => {
    it('should get 200', () =>
      agent.get('/recipes').expect(200)
    );
  });
  describe("Recipes POST /", () => {
    it("deberia devolver un estatus 201 en caso de crear la receta correctamente", async () => {
      const response = await agent
        .post("/recipes")
        .send(recipe);
      expect(response.status).to.eql(201);
      
    });
    
  })
  describe("Recipe POST/err", () => {
    it("deberia devolver un error 400 si falta informacion", async () => {
      const response = await agent
        .post("/recipes")
        .send(recipe2);
      expect(response.status).to.eql(400);
      expect(response.text).to.eql("Creation Error");
      
    });
    
  })
 
 
});




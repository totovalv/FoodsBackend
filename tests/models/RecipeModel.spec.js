const { Recipe, conn } = require('../../src/db.js');


const recipe = {
  name: null,
  health_score:23,
	summary:"asudhasuhduash",
	steps:"askdjkas",
  diets:["primal,whole 30"],
  stock:1


  
};

const recipe2 = {
  name: "comida",
  health_score:23,
	summary:"asudhasuhduash",
	steps:"askdjkas",
  diets:["primal,whole 30"],
  stock:1
  
}; 
describe('Recipe model', () => {
  before(() => conn.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    }));
  describe('Validators', () => {
    beforeEach(() => Recipe.sync({ force: true }));
    describe('name', () => {
      it('deberia devolver un error si name es null', (done) => {
        Recipe.create(recipe)
          .then(() => done(new Error('It requires a valid name')))
          .catch(() => done());
      });
      it('deberia crearse correctamente con un nombre valido', (done) => {
        Recipe.create(recipe2)
        .then(()=> done( console.log("Se ha creado correctamente")))
        .catch((err)=>done(console.log(err)))
      });
    });
  });
});


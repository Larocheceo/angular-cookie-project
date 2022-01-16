import {Injectable} from "@angular/core";
import {Recipe} from "./recipe.model";
import {Ingredient} from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import {Subject} from "rxjs";

@Injectable()
export  class RecipeService {
  recipesChanged = new Subject<Recipe>();
  constructor(private shoppingListService: ShoppingListService) {
  }
 /** private recipes: Recipe[]= [
    new Recipe('Crêpes',
      'Decouvrez les meilleures recettes de crêpes faciles à préparer',
      'https://images.pexels.com/photos/8844888/pexels-photo-8844888.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
      [
        new Ingredient('farine', 250 , 'g'),
        new Ingredient('ouefs', 4, ''),
        new Ingredient('lait', 500, 'mL'),
        new Ingredient('sucre', 10, 'g'),
        new Ingredient('beurre', 50, 'g'),
        new Ingredient('sel', 1, 'g')
      ]
      ),
    new Recipe('Pastels de Viande ou Fataya',
     'Voici ma recette de pastels de viande (encore appelé Fataya au Senegal), simple et delicieux',
      'http://www.recettesafricaine.com/wp-content/uploads/2021/02/fin-1024x683.jpg',
      [
        new Ingredient('farine', 250 , 'g'),
        new Ingredient('ouefs', 1, ''),
        new Ingredient('lait', 100, 'mL'),
        new Ingredient('levure boulangère', 50, 'g'),
        new Ingredient('sucre', 5, 'g'),
        new Ingredient('sel', 5, 'g'),
        new Ingredient('beurre', 10, 'g'),
      ]
      ),

    new Recipe('Croquettes à la camerounaise',
      'Ma recette simple et facile pour réaliser des croquettes appetissants.',
      'https://vivelacuisinedecaro.files.wordpress.com/2019/06/img_4334.jpg',
      [
        new Ingredient('farine', 500 , 'g'),
        new Ingredient('ouefs', 2, ''),
        new Ingredient('lait', 50, 'mL'),
        new Ingredient('levure boulangère', 50, 'g'),
        new Ingredient('sucre', 100, 'g'),
        new Ingredient('sucre vanillé', 30, 'g'),
        new Ingredient('sel', 1, 'g'),
        new Ingredient('beurre', 60, 'g'),
        new Ingredient('huile de friture', 300, 'mL')
      ]
    )
  ]; */
 private recipes!: Recipe[];
  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  getRecipeById(id: Number): Recipe {
    // @ts-ignore
    return this.recipes[id];
  }

  setRecipes(recipes: Recipe[]): void {
    this.recipes = recipes;
    // @ts-ignore
    this.recipesChanged.next(this.recipes.slice());
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]): void{
    this.shoppingListService.addIngredients(ingredients);
  }
  addRecipe(recipe: Recipe): void {
    this.recipes.push(recipe);
    // @ts-ignore
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe): void {
    this.recipes[index] = newRecipe;
    // @ts-ignore
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number): void {
    this.recipes.splice(index, 1);
    // @ts-ignore
    this.recipesChanged.next(this.recipes.slice());
  }



}

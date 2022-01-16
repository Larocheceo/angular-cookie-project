import {Ingredient} from "../shared/ingredient.model";

export class Recipe {
  public name: string;
  public description: string;
  public imageURL: string;
  public ingredients: Ingredient[];
  constructor(name:string, description:string, imageURL:string, ingredients:Ingredient[]) {
    this.name = name;
    this.description = description;
    this.imageURL = imageURL;
    this.ingredients = ingredients;
  }
}

import { Component, OnInit} from '@angular/core';
import {Recipe} from "../recipe.model";
import {RecipeService} from "../recipe.service";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  // @ts-ignore
  recipe: Recipe;
  // @ts-ignore
  id: Number;
  constructor(private recipeService: RecipeService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.recipe = this.recipeService.getRecipeById(this.id);
        }
      )
  }

  addIngredientsToList(): void{
  this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onRecipeEdit(): void {
    this.router.navigate(['edit'], {relativeTo: this.activatedRoute});

  }

  onDeleteRecipe(): void {
    // @ts-ignore
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
  }
}

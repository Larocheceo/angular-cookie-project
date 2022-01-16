import {Component, OnDestroy, OnInit} from '@angular/core';
import {Recipe} from "../recipe.model";
import {RecipeService} from "../recipe.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  // @ts-ignore
  recipes: Recipe[];
  subscription!: Subscription;
  constructor(private  recipeService: RecipeService, private router: Router,
              private  activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscription = this.recipeService.recipesChanged
      .subscribe(
        // @ts-ignore
        (recipes: Recipe[]) => this.recipes = recipes
      );
    //this.recipes = this.recipeService.getRecipes();
  }

  onNewRecipe(): void {
    this.router.navigate(['new'], {relativeTo: this.activatedRoute });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {Recipe} from "../recipe.model";
import {RecipeService} from "../recipe.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  // @ts-ignore
  recipes: Recipe[];
  subscription!: Subscription;
  lazyLoader = "hide-recipes";
  loadMoreRecipes = false;
  constructor(private  recipeService: RecipeService,
              private dataStorageService: DataStorageService,
              private router: Router,
              private  activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscription = this.recipeService.recipesChanged
      .subscribe(
        // @ts-ignore
        (recipes: Recipe[]) => this.recipes = recipes
      );
    this.dataStorageService.retrieveRecipes().subscribe();
  }

  onNewRecipe(): void {
    this.router.navigate(['new'], {relativeTo: this.activatedRoute });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showMoreRecepes(): void {
    if(this.loadMoreRecipes) {
      this.loadMoreRecipes = false;
      this.lazyLoader="hide-recipes";
    } else {
      this.loadMoreRecipes = true;
      this.lazyLoader="show-recipes";
    }
  }
}

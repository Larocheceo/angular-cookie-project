import { Component, OnInit } from '@angular/core';
import {Ingredient} from "../shared/ingredient.model";
import {ShoppingListService} from "./shopping-list.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Ingredient[]= [];
  // @ts-ignore
  private ingChangedSubscription: Subscription;
  ingredientAdded = true;
  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.ingredients = this.shoppingListService.getIngredients();
    this.ingChangedSubscription = this.shoppingListService.ingredientsChanged
      .subscribe(
        (ingredients_:Ingredient[]) => this.ingredients = ingredients_
      );
  }
  onEditIngredient(index: number): void {
    this.shoppingListService.startedEditing.next(index);
  }

  ngOnDestroy(): void{
    this.ingChangedSubscription.unsubscribe();
  }


  onIngredientAdded(): void {
    this.ingredientAdded = true;
    console.log(this.ingredientAdded);
  }
}

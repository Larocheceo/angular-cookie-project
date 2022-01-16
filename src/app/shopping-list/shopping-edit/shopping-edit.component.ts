import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from "../../shared/ingredient.model";
import {ShoppingListService} from "../shopping-list.service";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  // @ts-ignore
  @ViewChild('f') shoppingListForm: NgForm;
  // @ts-ignore
  subscription: Subscription;
  // @ts-ignore
  editedIngredientIndex: number;
  // @ts-ignore
  editedIngredient: Ingredient;
  editMode = false;
  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.subscription = this.shoppingListService.startedEditing
      .subscribe(
        // @ts-ignore
        (index: number) => {
          this.editedIngredientIndex = index;
          this.editMode = true;
          this.editedIngredient = this.shoppingListService.getIngredient(index);
          this.shoppingListForm.setValue({
              name: this.editedIngredient.name,
              quantity: this.editedIngredient.quantity,
              unit: this.editedIngredient.unit
          }
          )
        }
      );
  }
  onAddEditIngredient(form: NgForm ): void {
    const value = form.value;
    const ingredient = new Ingredient(value.name, value.quantity, value.unit);
    if(this.editMode) {
      this.shoppingListService.updateIngredient(this.editedIngredientIndex, ingredient);
    } else {
      this.shoppingListService.addIngredient(ingredient);
    }
    this.editMode = false;
    form.reset();

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onReset(): void {
    this.editMode = false;
    this.shoppingListForm.reset();
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.editedIngredientIndex)
    this.onReset();
  }
}

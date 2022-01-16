import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {RecipeService} from "../recipe.service";
import {Recipe} from "../recipe.model";

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  // @ts-ignore
  id: number;
  editMode = false;
  recipeForm!: FormGroup;
  constructor(private activatedRoute: ActivatedRoute, private recipeService: RecipeService, private router: Router) { }

  get controls(): AbstractControl[] {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  ngOnInit(): void {
    this.activatedRoute.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      )
  }

  private initForm(): void {
    let recipeName = '';
    let recipeImageURL = '';
    let recipeDescription = '';
    const recipeIngredients = new FormArray([]);
    if(this.editMode) {
      const recipe = this.recipeService.getRecipeById(this.id);
      recipeName = recipe.name;
      recipeImageURL = recipe.imageURL;
      recipeDescription = recipe.description;
      if(recipe.ingredients) {
        for (const ingredient of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(ingredient.name, Validators.required),
              quantity: new FormControl(ingredient.quantity, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
              ]),
              unit: new FormControl(ingredient.unit)
            })
          )
        }
      }
    }
    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imageURL: new FormControl(recipeImageURL, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients
    });
  }

  onSubmit(): void {
    const newRecipe = new Recipe(
      this.recipeForm.value.name,
      this.recipeForm.value.description,
      this.recipeForm.value.imageURL,
      this.recipeForm.value.ingredients
    )
    if(this.editMode) {
      this.recipeService.updateRecipe(this.id, newRecipe);
      this.onCancel();
    } else {
      this.recipeService.addRecipe(newRecipe);
      this.afterAddingRecipe();
    }
  }

  onAddIngredient(): void {
    (this.recipeForm.get('ingredients') as FormArray).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        quantity: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ]),
        unit: new FormControl()
      })
    );
  }

  onCancel(): void {
    this.router.navigate(['../'], {relativeTo: this.activatedRoute});
  }

  afterAddingRecipe(): void {
    const recipeId = this.recipeService.getNumberOfRecipes() - 1;
    this.router.navigate(['../' + recipeId], {relativeTo: this.activatedRoute});
  }

  onDeleteIngredient(index: number): void {
    (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
  }

  onDeleteAllIngredients(): void {
    (this.recipeForm.get('ingredients') as FormArray).clear();
  }
}

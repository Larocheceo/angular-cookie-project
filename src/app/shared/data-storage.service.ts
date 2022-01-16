import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {RecipeService} from "../recipes/recipe.service";
import {Recipe} from "../recipes/recipe.model";
import {exhaustMap, map, Observable, take, tap} from "rxjs";
import {AuthService} from "../auth/auth.service";

@Injectable({providedIn: 'root'})
export class DataStorageService{
  firebaseURL = 'https://projet-cookie-2fc8b-default-rtdb.firebaseio.com/';
  constructor(private http: HttpClient,
              private recipeService: RecipeService,
              private authService: AuthService) {
  }

  storeRecipes(): void {
    const recipes = this.recipeService.getRecipes();
    this.http.put(this.firebaseURL + 'recipes.json', recipes)
      .subscribe(
        responseData => {
          console.log(responseData);
        }
      )
  }
  retrieveRecipes(): Observable<Recipe[]> {
    return this.http
      .get<Recipe[]>(this.firebaseURL + 'recipes.json')
      .pipe(
        map(
          recipes => {
            return recipes.map(
              recipe => {
                return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
              }
            );
          }
        ),
        tap(
          recipes => {
            this.recipeService.setRecipes(recipes);
          }
        )
      );
  }
}

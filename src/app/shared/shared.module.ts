import {NgModule} from "@angular/core";
import {AlertComponent} from "./alert/alert.component";
import {LoaderComponent} from "./loader/loader.component";
import {PlaceholderDirective} from "./placeholder/placeholder-directive";
import {DropdownDirective} from "../shared/dropdown.directive";
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [
    AlertComponent,
    LoaderComponent,
    PlaceholderDirective,
    DropdownDirective
  ],
  imports: [CommonModule],
  exports: [
    AlertComponent,
    LoaderComponent,
    PlaceholderDirective,
    DropdownDirective,
    CommonModule
  ]
})
export class SharedModule{}

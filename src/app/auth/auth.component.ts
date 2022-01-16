import {Component, ComponentFactoryResolver, OnDestroy, ViewChild} from "@angular/core";
import {NgForm} from "@angular/forms";
import {AuthResponseData, AuthService} from "./auth.service";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {AlertComponent} from "../shared/alert/alert.component";
import {Placeholder} from "@angular/compiler/src/i18n/i18n_ast";
import {PlaceholderDirective} from "../shared/placeholder/placeholder-directive";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'

})
export class AuthComponent implements OnDestroy{
  isLoginMode = true;
  isLoading = false;
  // @ts-ignore
  error: string = null;
  alertSub!: Subscription;
  @ViewChild(PlaceholderDirective, {static : false}) alertMsgHost!: PlaceholderDirective;
  constructor(private authService: AuthService,
              private router: Router,
              private componentFactoryResolver: ComponentFactoryResolver
  ) {
  }
  onToggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm): void {
    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;
    let authObs: Observable<AuthResponseData>
    if(this.isLoginMode) {
      authObs = this.authService.signIn(email, password);
    } else {
      authObs = this.authService.signUp(email, password);
    }
    authObs.subscribe(
      responseData => {
        console.log(responseData)
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      errorResponse => {
        this.error= errorResponse;
        this.showErrorMessage(errorResponse);
        this.isLoading = false;
      }
    )
    form.reset();
  }

  private showErrorMessage(msg: string): void {
    const alertErrorMessageCompFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostContainerRef = this.alertMsgHost.viewContainerRef;
    hostContainerRef.clear();
    const cmpRef = hostContainerRef.createComponent(alertErrorMessageCompFactory);
    cmpRef.instance.message = msg;
    this.alertSub = cmpRef.instance.closeAlert.subscribe(
      () => {
        this.alertSub.unsubscribe();
        hostContainerRef.clear();
      }
    )
  }

  onCloseErrorMessage(): void{
    // @ts-ignore
    this.error = null;
  }

  ngOnDestroy(): void {
    if(this.alertSub){
      this.alertSub.unsubscribe();
    }
  }
}

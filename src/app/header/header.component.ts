import {AfterViewInit, Component, EventEmitter, OnChanges, OnDestroy, OnInit, Output} from "@angular/core";
import {DataStorageService} from "../shared/data-storage.service";
import {AuthService} from "../auth/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'

})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuth = false;
  collapsed = true;
  authUserSub!: Subscription;
  constructor(private dataStorageService: DataStorageService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authUserSub = this.authService.user.subscribe(
      user => {
        this.isAuth = user ? true : false;
      }
    );

  }


  onSaveData(): void {
    this.dataStorageService.storeRecipes();
  }

  onRetrieveData(): void {
    this.dataStorageService.retrieveRecipes().subscribe();
  }

  ngOnDestroy(): void {
    this,this.authUserSub.unsubscribe();
  }

  onSignOut(): void {
    this.authService.signOut();
  }
}

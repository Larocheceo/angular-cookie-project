import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {BehaviorSubject, catchError, Observable, Subject, tap, throwError} from "rxjs";
import {User} from "./user.model";
import {Router} from "@angular/router";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
@Injectable({providedIn: 'root'})
export class AuthService {
  // @ts-ignore
  user = new BehaviorSubject<User>(null);
  firebaseKey = 'AIzaSyAtU6lKHyTTUbZYd2LyRDS175Eq9W-yneM';
  private tokenExpirationTimer: any;
  constructor(private http: HttpClient,
              private router: Router) {
  }

  signUp(inputEmail: String, inputPassword: String, ): Observable<AuthResponseData>{
    return this.http
      .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + this.firebaseKey,
        {
          email: inputEmail,
          password: inputPassword,
          returnSecureToken: true
        }).pipe(
          catchError(this.handleError),
          tap(
            responseData => {
              this.handleAuthTap(
                responseData.email,
                responseData.localId,
                responseData.idToken,
                +responseData.expiresIn)
            }
          ));
  }

  signIn(inputEmail: string, inputPassword: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + this.firebaseKey ,
        {
          email: inputEmail,
          password: inputPassword,
          returnSecureToken: true
        })
      .pipe(catchError(this.handleError),
        tap(
          responseData => {
            this.handleAuthTap(
              responseData.email,
              responseData.localId,
              responseData.idToken,
              +responseData.expiresIn)
          }
        ));
  }
  autoSignIn(): void {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(<string>localStorage.getItem('userData'));
    if(!userData) {
      return;
    }
    const loadedUser = new User(
      userData._token,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    )
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoSignOut(expirationDuration);
    }
  }


  signOut(): void {
    // @ts-ignore
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if(this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoSignOut(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.signOut();
    }, expirationDuration)
  }

  private handleAuthTap(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(
      new Date().getTime() + expiresIn * 1000
    );
    const user = new User(
      email,
      userId,
      token,
      expirationDate
    );
    console.log(expiresIn);
    this.user.next(user);
    this.autoSignOut(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));

  }

  private handleError(errorResponse: HttpErrorResponse): Observable<AuthResponseData> {

    let errorMessage = 'Une erreur s\'est produite';
    if(!errorResponse.error || !errorResponse.error.error) {
      return throwError(() => errorMessage);
    }
    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS': errorMessage = 'Email existant'; break;
      case 'EMAIL_NOT_FOUND':
      case 'INVALID_PASSWORD': errorMessage = 'Problème de connexion'; break;

      default: errorMessage = 'Une erreur s\'est produite' ; break;
    }
    return throwError(() => errorMessage);

  }
}

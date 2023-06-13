import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const uid = route.paramMap.get('uid');

    return this.authService.user.pipe(
      switchMap(user => {
        if (uid === user?.uid) {
          return new Observable<boolean>(observer => {
            observer.next(true);
            observer.complete();
          });
        } else {
          return new Observable<UrlTree>(observer => {
            observer.next(this.router.parseUrl('./error'));
            observer.complete();
          });
        }
      })
    );
  }
}

import { Component } from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Observable} from "rxjs";
import firebase from "firebase/compat";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  isAuth = false;
  isLoad = false;
  constructor(private authService: AuthService) {
    authService.user.subscribe(user => {
      this.isAuth = !!user;
      this.isLoad = true;
    })
  }
}

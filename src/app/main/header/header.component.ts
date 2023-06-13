import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import firebase from "firebase/compat";
import {AuthService} from "../../auth/auth.service";
import {BehaviorSubject, Observable} from "rxjs";
import {ICategory} from "../sections/blogs/models/ICategory";
import {CATEGORIES} from "../sections/blogs/models/mock-categories";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  constructor(private router: Router,
              private authService: AuthService) {
  }

  user!: firebase.User | null;
  categories!: string[];
  currentCategory: string | null = CATEGORIES[0];

  isAuth() {
    return !!this.user;
  }

  login(){
    this.router.navigate(['/login'])
      .catch(err => console.log(err));
  }

  logout(){
    this.authService.logout()
      .then(_ => this.router.navigate(['/']));
  }

  ngOnInit(): void {
    this.authService.user.subscribe({
      next: user => this.user = user,
      error: err => console.log(err)
    });
    this.categories = CATEGORIES;
  }
}

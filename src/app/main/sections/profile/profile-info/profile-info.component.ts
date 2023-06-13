import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../../auth/auth.service";
import firebase from "firebase/compat";
import {ActivatedRoute, Router} from "@angular/router";
import {IUser} from "../../../../auth/IUser";
import {map, Observable} from "rxjs";
import {FormControl} from "@angular/forms";
import {LoadingService} from "../../../../loading.service";

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent implements OnInit{
  constructor(private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private loadingService: LoadingService){
  }

  user!: IUser;
  photoUrl!: string;
  isPressDelete = false;
  passwordControl = new FormControl('');
  isCurrentUser = false;
  isInitial = false;

  ngOnInit(): void {
    this.route.paramMap
      .subscribe(params => this.authService.getUserById(params.get('uid')!)
        .subscribe(user => this.authService.user
          .subscribe(userAuth => {
            if (userAuth){
              if (user.uid == userAuth?.uid){
                this.isCurrentUser = true;
              }
            }
            this.user = user;
            this.photoUrl = user.photoUrl!;
            this.isInitial = true;
          })));
  }

  deleteUser(){
    if (this.isPressDelete){
      this.loadingService.setLoadingStatus(true);
      this.authService.deleteUser(this.user.email!, this.passwordControl.value!)
        .then(_ => {
          this.loadingService.setLoadingStatus(false);
          return this.router.navigate(['/'])
        })
        .catch(err => {this.passwordControl.setErrors({'invalid': true}); console.log(err)});
    }
    else{
      this.isPressDelete = true;
    }
  }
}

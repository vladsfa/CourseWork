import {Component, OnInit, Inject} from '@angular/core';
import {AuthService} from "../auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  returnUrl: string = "/";

  isIncorrect = false;
  hidePassword = true;

  emailControl = new FormControl('', Validators.email);
  passwordControl = new FormControl('');

  login = this.builder.group({
    email: this.emailControl,
    password: this.passwordControl
  });

  constructor (private builder: FormBuilder,
               private auth: AuthService,
               private route: ActivatedRoute,
               private router: Router) {
  }

  getEmailErrorMessage(){
    if (this.emailControl.hasError('email')){
      return 'Недійсна електронна адреса';
    }
    return '';
  }

  getPasswordErrorMessage(){
    if (this.passwordControl.hasError('invalid')){
      return 'Невірні дані';
    }
    return '';
  }

  onSubmit() {
    if(this.login.invalid){
      return;
    }

    this.auth.login(this.login.value.email!, this.login.value.password!)
      .then(_ => this.router.navigate([this.returnUrl]))
      .catch(_ => {
        this.emailControl.setErrors({'invalid': true});
        this.passwordControl.setErrors({'invalid': true});
      });
  }

  createAccount(){
    this.router.navigate(['/register'],
      {
        queryParams: {
          returnUrl: this.returnUrl
        }
      }).catch(err => alert(err));
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const returnUrl = params['returnUrl'];
      if (returnUrl){
        this.returnUrl = returnUrl;
      }
    });
  }
}

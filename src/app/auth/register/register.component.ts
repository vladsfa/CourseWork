import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{
  returnUrl: string = "/";

  hidePassword = true;

  fullNameControl= new FormControl('',
    [Validators.required,
      Validators.minLength(4),
      Validators.pattern('[^0-9]*')]);
  emailControl = new FormControl('',
    [Validators.required, Validators.email]);
  passwordControl = new FormControl('',
    [Validators.required, Validators.minLength(6)]);

  register = this.formBuilder.group({
    fullName: this.fullNameControl,
    email: this.emailControl,
    password: this.passwordControl
  })

  getEmailErrorMessage(){
    if (this.emailControl.hasError('required')){
      return 'Ви повинні ввести значення';
    }
    return this.emailControl.hasError('email') ? 'Недійсна електронна адреса' : '';
  }

  getFullNameErrorMessage(){
    if (this.fullNameControl.hasError('required')){
      return 'Ви повинні ввести значення';
    }
    if (this.fullNameControl.hasError('minlength')){
      return 'Мінімум 4 букви';
    }
    return this.fullNameControl.hasError('pattern') ? 'Цифри недопустимі' : '';
  }

  getPasswordErrorMessage(){
    if (this.passwordControl.hasError('required')){
      return 'Ви повинні ввести значення';
    }
    return this.passwordControl.hasError('minlength')
      ? `Мінімум 6 символів ${this.passwordControl.value}/6`
      : '';
  }

  constructor(private auth : AuthService,
              private route : ActivatedRoute,
              private router : Router,
              private formBuilder : FormBuilder) {
  }

  onSubmit(){
    if (this.register.invalid){
      return;
    }

    this.auth.register(this.emailControl.value!,
      this.passwordControl.value!,
      this.fullNameControl.value!,
      'https://selfmadewebdesigner.com/wp-content/uploads/2019/09/self-made-web-designer-upwork-profile.jpg')
      .then(_ => this.router.navigate([this.returnUrl]))
      .catch(err => alert(err));
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

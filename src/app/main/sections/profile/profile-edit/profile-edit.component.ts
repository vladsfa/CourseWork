import {Component, OnDestroy} from '@angular/core';
import {AuthService} from "../../../../auth/auth.service";
import {Observable} from "rxjs";
import firebase from "firebase/compat";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {LoadingService} from "../../../../loading.service";

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnDestroy{
  uid!: string
  password: string = "";
  photoUrl!: string;
  isSucessTable = false;
  timer!: number | null;
  isLoad = false;
  isFirstControlInitial = false;

  initialFullName!: string;
  initialEmail!: string;

  constructor(private authService: AuthService,
              private storageService: AngularFireStorage,
              private formBuilder: FormBuilder,
              private loadingService: LoadingService) {
    this.authService.user.subscribe(user => {
      if(user){
        this.uid = user.uid;
        this.photoUrl = user.photoURL!;

        this.initialEmail = user.email!;
        this.initialFullName = user.displayName!;

        if (!this.isFirstControlInitial){
          this.fullNameControl.setValue(this.initialFullName);
          this.emailControl.setValue(this.initialEmail);
          this.isLoad = true;
          this.isFirstControlInitial = true;
        }
      }
      else{
        console.log('user not found');
      }
    });
  }

  fullNameControl= new FormControl('',
    [Validators.required,
      Validators.minLength(4),
      Validators.pattern('[^0-9]*')]);
  emailControl = new FormControl('',
    [Validators.required, Validators.email]);
  passwordControl = new FormControl('');

  edit = this.formBuilder.group({
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
    return this.passwordControl.hasError('invalid') ? 'Пароль невірний' : '';
  }

  updateImg(event: Event){
    const input = event.target as HTMLInputElement;
    const file =  input.files?.item(0);
    if(file){
      const path = `users/${this.uid}`;
      this.loadingService.setLoadingStatus(true);
      this.storageService.upload(path, file)
        .then(_  => this.storageService.ref(path).getDownloadURL()
          .subscribe(url => this.authService.updatePhotoUrl(url)
            .then(_ => {
              this.photoUrl = url;
              this.isSucessTable = true;
              this.timer = setTimeout(_ => {this.isSucessTable = false; this.timer = null}, 3000);
              this.loadingService.setLoadingStatus(false);
            })));
    }
    else{
      return;
    }
  }

  onSubmit(){
    const email : string = this.emailControl.value!;
    const fullName : string = this.fullNameControl.value!;
    const password : string = this.passwordControl.value!;

    if(this.edit.invalid || (email == this.initialEmail && fullName == this.initialFullName)){
      return;
    }


    this.loadingService.setLoadingStatus(true);
    if (email != this.initialEmail){
      this.authService.updateEmail(this.initialEmail, email, password)
        .then(_ => {
          if (fullName != this.initialFullName){
            this.authService.updateFullName(fullName)
              .then(_ => {
                this.loadingService.setLoadingStatus(false);
                this.showSucessTable()
              })
          }
          else {
            this.loadingService.setLoadingStatus(false);
            this.showSucessTable();
          }
        })
        .catch(err => this.passwordControl.setErrors({'invalid': true}));
    }
    else{
      this.authService.updateFullName(fullName)
        .then(_ => {
          this.loadingService.setLoadingStatus(false);
          this.showSucessTable()
        });
    }
  }

  showSucessTable(){
    this.isSucessTable = true;
    this.timer = setTimeout(_ => {this.isSucessTable = false; this.timer = null}, 3000);
  }

  ngOnDestroy(): void {
    if(this.timer){
      clearTimeout(this.timer);
      this.isSucessTable = false;
    }
  }
}

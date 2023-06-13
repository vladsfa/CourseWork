import {Component, ElementRef, HostListener, OnDestroy, ViewChild} from '@angular/core';
import {CATEGORIES} from "../../models/mock-categories";
import firebase from "firebase/compat";
import {AuthService} from "../../../../../auth/auth.service";
import {IBlog} from "../../models/IBlog";
import {BlogService} from "../../blog.service";
import {Timestamp} from "firebase/firestore";
import {doc} from "@angular/fire/firestore";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {LoadingService} from "../../../../../loading.service";

@Component({
  selector: 'app-post-add',
  templateUrl: './post-add.component.html',
  styleUrls: ['./post-add.component.scss']
})
export class PostAddComponent implements OnDestroy{

  categories: string[];
  user!: firebase.User;
  tempStoragePath!: string;
  blog!: IBlog;
  defaultImgUrl = "https://echamicrobiology.com/app/uploads/2018/10/1280px-Insert_image_here-.svg_.png";
  isInitial = false;
  isEditText = true;
  isFirstClickImg = false;
  isUploadImg = false;
  isTrySubmit = false;
  isCategoryTouched = false;
  isSend = false;
  imgFile!: File;

  @ViewChild('change') changeRef!: ElementRef;

  imgControl = new FormControl('');
  categoryControl = new FormControl('');
  titleControl = new FormControl('',
    [Validators.required, Validators.minLength(12)]);
  textControl = new FormControl('',
    [Validators.required, Validators.minLength(50)]);
  descriptionControl = new FormControl('',
    [Validators.required, Validators.minLength(12)]);

  blogForm = this.formBuilder.group({
    category: this.categoryControl,
    title: this.titleControl,
    text: this.textControl,
    description: this.descriptionControl,
    img: this.imgControl
  })

  constructor(private authService: AuthService,
              private blogService: BlogService,
              private formBuilder: FormBuilder,
              private router: Router,
              private loadingService: LoadingService) {
    this.categories = CATEGORIES;
    authService.user
      .subscribe(user => {
        if (user){
          const id = blogService.getId();
          this.blog = {
            id: id,
            author: user.uid,
            title: '',
            category: CATEGORIES[0],
            date: Timestamp.fromDate(new Date()),
            description: '',
            text: '',
            imgUrl: this.defaultImgUrl
          }
          this.isInitial = true;
          this.user = user;
          this.tempStoragePath = `temp/add-post/${id}`;
          this.categoryControl.setValue(CATEGORIES[0]);
        }
      });
      document.addEventListener('click', this.onDocumentClick.bind(this));
  }

  updateImg(event: Event){
    const input = event.target as HTMLInputElement;
    const file =  input.files?.item(0);
    if(file){
      this.loadingService.setLoadingStatus(true);
      this.blogService.addImg(file, this.tempStoragePath)
        .then(url => {
          this.blog.imgUrl = url;
          this.isUploadImg = true;
          this.imgFile = file;
          if(this.imgControl.hasError('img')){
            this.imgControl.setErrors(null);
          }
          this.loadingService.setLoadingStatus(false);
        })
        .catch(err => console.log(err));
    }
    else{
      return;
    }
  }

  formattedDate(){
    const date = this.blog.date.toDate();

    const formattedTime = date.toLocaleTimeString(
      [], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = date.toLocaleString(
      'en', { month: 'long', day: 'numeric', year: 'numeric' });

    const months: Record<string, string> = {
      January: "Січня",
      February: "Лютого",
      March: "Березня",
      April: "Квітня",
      May: "Травня",
      June: "Червня",
      July: "Липня",
      August: "Серпня",
      September: "Вересня",
      October: "Жовтня",
      November: "Листопада",
      December: "Грудня"
    };

    const formattedMonth = months[date.toLocaleString('en', { month: 'long' })];

    return `${formattedTime} ${formattedMonth} ${formattedDate}`;
  }


  adjustTextareaHeight(target: EventTarget | null, height: number, isFocus = false){
    if (!target){
      console.log('textarea in null');
    }
    else{
      const textarea = target as HTMLTextAreaElement;
      if (textarea.scrollHeight > height){
        textarea.style.height = 0 + 'px';
        if (textarea.scrollHeight < height){
          textarea.style.height = height + 'px';
        }
        else{
          textarea.style.height = textarea.scrollHeight + 'px';
        }
      }
      if(isFocus){
        setTimeout(_ => textarea.focus(), 5);
      }
    }
  }

  adjustTextareaTitleHeight(target: EventTarget | null, height: number){
    if (!target){
      console.log('textarea is null');
    }
    else{
      const textarea = target as HTMLTextAreaElement;
      if(textarea.scrollHeight > height){
        textarea.style.height = 0 + 'px';
        textarea.style.height = textarea.scrollHeight + 'px';
      }
    }
  }

  onImgClick(img: EventTarget | null){
    if (img){
      if (this.isFirstClickImg){
        this.isFirstClickImg = false;
        (this.changeRef.nativeElement as HTMLInputElement).click();
      }
      else{
        this.isEditText = false;
        this.isFirstClickImg = true;
      }
    }
    else{
      console.log('img is null');
    }
  }

  onDocumentClick(event: MouseEvent){
    const elem = event.target as HTMLImageElement
    if(elem){
      if (!elem.matches('#blogImg')){
        if (this.isFirstClickImg){
          this.isFirstClickImg = false;
        }
      }
    }
  }

  createBlog(){
    this.isTrySubmit = true;

    if(!this.isCategoryTouched){
      this.categoryControl.setErrors({'category': true});
    }
    if(!this.isUploadImg){
      this.imgControl.setErrors({'img': true});
    }

    if (this.blogForm.invalid){
      return;
    }

    this.blog.category = this.categoryControl.value!;
    this.blog.title = this.titleControl.value!;
    this.blog.text = this.textControl.value!;
    this.blog.description = this.descriptionControl.value!;
    this.blogService.removeImg(this.blog.imgUrl)
      .then(_ => {
        this.blogService.add(this.blog, this.imgFile)
          .then(_ => this.authService.user
            .subscribe(user => {
              if (user){
                this.isSend = true;
                this.router.navigate(['/profile', user.uid])
                  .catch(err => console.log(err));
              }
            }, err => console.log(err)))
          .catch(err => console.log(err));
      })
  }

  onCategoryChange(target: EventTarget){
    (target as HTMLSelectElement).blur();
    this.isCategoryTouched = true;
    if (this.categoryControl.hasError('category')){
      this.categoryControl.setErrors(null);
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  handleUnload(event: Event) {
    if(!this.isSend){
      this.blogService.removeImg(this.blog.imgUrl)
        .catch(err => console.log(err));
    }
  }

  ngOnDestroy(): void {
    if(!this.isSend){
      this.blogService.removeImg(this.blog.imgUrl)
        .catch(err => console.log(err));
    }
    document.removeEventListener('click', this.onDocumentClick);
  }
}

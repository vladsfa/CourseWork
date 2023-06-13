import {Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {IComment} from "../IComment";
import {AuthService} from "../../../../auth/auth.service";
import {Observable} from "rxjs";
import firebase from "firebase/compat";
import {IUser} from "../../../../auth/IUser";
import {CommentsService} from "../comments.service";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit, OnChanges{

  @Input() comment!: IComment;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['comment']){
      this.editText = this.comment.text;
    }
  }

  user!: Observable<IUser>;
  authUser!: Observable<firebase.User | null>;
  isEdit = false;
  editText!: string;

  @ViewChild('editTextArea') editRef!: ElementRef;

  constructor(private authService: AuthService,
              private commentService: CommentsService) {
  }

  formatDate(date: Date){
    const options: Intl.DateTimeFormatOptions = {
      month: 'numeric',
      day: 'numeric',
      year: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
      timeZone: 'Europe/Kiev'
    };

    return new Intl.DateTimeFormat('en-us', options).format(date).replace(',','');
  }

  ngOnInit(): void {
    this.user = this.authService.getUserById(this.comment.uid);
    this.authUser = this.authService.user;
  }

  edit(){
    this.isEdit = true;
    setTimeout(_ => (this.editRef.nativeElement as HTMLTextAreaElement).click(), 10);
  }

  delete(){
    this.commentService.deleteComment(this.comment.id)
      .catch(err => console.log(err));
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

  save(){
    this.comment.text = this.editText;
    this.commentService.updateComment(this.comment.id, this.comment.text)
      .then(_ => this.isEdit = false)
      .catch(err =>console.log(err));
  }

  cancel(){
    this.editText = this.comment.text;
    this.isEdit = false;
  }
}

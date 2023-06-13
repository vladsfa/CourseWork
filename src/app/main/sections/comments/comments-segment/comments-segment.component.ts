import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CommentsService} from "../comments.service";
import {Observable} from "rxjs";
import {AuthService} from "../../../../auth/auth.service";
import firebase from "firebase/compat";
import {Router} from "@angular/router";
import {IComment} from "../IComment";

@Component({
  selector: 'app-comments-segment',
  templateUrl: './comments-segment.component.html',
  styleUrls: ['./comments-segment.component.scss']
})
export class CommentsSegmentComponent implements OnInit, OnChanges{
  @Input() bid!: string;
  constructor(private commentsService: CommentsService,
              private authService: AuthService,
              private router: Router) {
  }

  user!: firebase.User | null;
  isExpanded: boolean = false;
  count!: number;
  commentText: string = "";
  comments!: IComment[];

  cancel(){
    this.commentText = "";
    this.isExpanded = false;
  }

  submit(){
    if(!this.user){
      this.router.navigate(['/login'])
        .catch(err => console.log(err));
    }
    else{
      const comment = {
        uid: this.user.uid,
        bid: this.bid,
        text: this.commentText
      };
      this.commentsService.add(comment);
    }
    this.commentText = "";
    this.isExpanded = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const bid = changes['bid'];
    if (bid){
      this.commentsService.getByBlog(bid.currentValue)
        .subscribe(comments => {
          this.count = comments.length;
          this.comments = comments;
        });
    }
  }

  ngOnInit(): void {
    this.authService.user
      .subscribe(user => this.user = user);
  }
}

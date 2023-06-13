import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CommentComponent} from "./comment/comment.component";
import {CommentsSegmentComponent} from "./comments-segment/comments-segment.component";
import {AngularFireStorageModule, GetDownloadURLPipeModule} from "@angular/fire/compat/storage";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {RouterLink} from "@angular/router";

@NgModule({
  declarations: [
    CommentComponent,
    CommentsSegmentComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    GetDownloadURLPipeModule,
    RouterLink
  ],
  exports: [
    CommentsSegmentComponent
  ]
})
export class CommentsModule { }

import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {BlogsRoutingModule} from "./blogs-routing.module";
import {HomeComponent} from "./components/home/Home.component";
import {PostShortComponent} from "./components/post-short/post-short.component";
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import {MatButtonModule} from "@angular/material/button";
import {MatTabsModule} from "@angular/material/tabs";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {CommentsModule} from "../comments/comments.module";
import { PostAddComponent } from './components/post-add/post-add.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    PostShortComponent,
    HomeComponent,
    PostDetailComponent,
    PostAddComponent
  ],
  imports: [
    CommentsModule,
    CommonModule,
    BlogsRoutingModule,
    NgOptimizedImage,
    MatButtonModule,
    MatTabsModule,
    MatMenuModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    HomeComponent,
    PostShortComponent,
  ]
})
export class BlogsModule { }

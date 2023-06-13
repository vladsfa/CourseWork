import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileInfoComponent } from './profile-info/profile-info.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ProfileTabsComponent } from './profile-tabs/profile-tabs/profile-tabs.component';
import { ProfileBlogsComponent } from './profile-tabs/profile-blogs/profile-blogs.component';
import {ProfileComponent} from "./profile/profile.component";
import {ProfileRoutingModule} from "./profile-routing.module";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BlogsModule} from "../blogs/blogs.module";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";



@NgModule({
  declarations: [
    ProfileComponent,
    ProfileInfoComponent,
    ProfileEditComponent,
    ProfileTabsComponent,
    ProfileBlogsComponent,
  ],
  imports: [
    ProfileRoutingModule,
    CommonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    BlogsModule,
    MatButtonModule,
    MatMenuModule
  ]
})
export class ProfileModule { }

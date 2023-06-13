import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProfileComponent} from "./profile/profile.component";
import {ProfileBlogsComponent} from "./profile-tabs/profile-blogs/profile-blogs.component";
import {ProfileEditComponent} from "./profile-edit/profile-edit.component";
import {AuthGuard} from "../../../auth/auth.guard";

const routes: Routes = [
  {
    path: ":uid/edit",
    component: ProfileEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ":uid",
    component: ProfileComponent,
    children: [
      {
        path: '',
        redirectTo: 'blogs',
        pathMatch: "full"
      },
      {
        path: "blogs",
        component: ProfileBlogsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }

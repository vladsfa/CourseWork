import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {HomeComponent} from "./components/home/Home.component";
import {PostDetailComponent} from "./components/post-detail/post-detail.component";
import {PostAddComponent} from "./components/post-add/post-add.component";

const routes: Routes = [
  {
    path: 'blog-add',
    component: PostAddComponent
  },
  {
    path: '',
    redirectTo: 'blogs',
    pathMatch: "full"
  },
  {
    path: 'blogs',
    component: HomeComponent
  },
  {
    path: 'blogs/:category',
    component: HomeComponent
  },
  {
    path: 'blog/:id',
    component: PostDetailComponent
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogsRoutingModule{}

import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BlogService} from "../../../blogs/blog.service";
import {AuthService} from "../../../../../auth/auth.service";
import {IUser} from "../../../../../auth/IUser";
import {mergeMap, Observable} from "rxjs";
import firebase from "firebase/compat";
import {IBlog} from "../../../blogs/models/IBlog";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-profile-main',
  templateUrl: './profile-blogs.component.html',
  styleUrls: ['./profile-blogs.component.scss']
})
export class ProfileBlogsComponent implements OnInit{
  blogs!: Observable<IBlog[]>;
  constructor(private blogService: BlogService,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  toBlogPage(id: string){
    this.router.navigate(['blog', id]).then();
  }

  delete(bid: string){
    this.blogService.delete(bid)
      .catch(err => console.log(err));
  }

  ngOnInit(): void {
    this.route.parent!.params.subscribe(params => {
      const uid = params['uid'];
      console.log(uid);
      if (uid) {
        this.blogs = this.blogService.getUserBlogs(uid);
      } else {
        console.log('uid is null');
      }
    });
  }


}

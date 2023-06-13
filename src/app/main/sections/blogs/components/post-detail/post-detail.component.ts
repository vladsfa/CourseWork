import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Observable} from "rxjs";
import {IBlog} from "../../models/IBlog";
import {ActivatedRoute, Router} from "@angular/router";
import {get} from "@angular/fire/database";
import {BlogService} from "../../blog.service";
import {AuthService} from "../../../../../auth/auth.service";
import {IUser} from "../../../../../auth/IUser";
@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit{
  blog!: IBlog;
  user!: IUser
  isLoad = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private blogService: BlogService,
              private authService: AuthService) {
  }

  getFormatDate(date : Date | undefined){
    if (!date){
      return;
    }
    return date.toLocaleTimeString(
      [], {hour: '2-digit', minute:'2-digit'})
      + ' ' +
      date.toLocaleString(
        'en', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe(params => {
        const blogId = params.get('id');
        if (!blogId){
          this.router.navigate(['/error']).catch(err => console.log(err));
        }
        else{
          this.blogService.get(blogId)
            .subscribe(blog => {
              this.blog = blog
              this.authService.getUserById(this.blog.author)
                .subscribe(user => {
                  this.user = user
                  this.isLoad = true;
                });
            });
        }
      });
  }
}

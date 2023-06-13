import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, switchMap} from "rxjs";
import {IBlog} from "../../models/IBlog";
import { Timestamp } from 'firebase/firestore';
import {BlogService} from "../../blog.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ICategory} from "../../models/ICategory";
import {CATEGORIES} from "../../models/mock-categories";

@Component({
  selector: 'app-home',
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.scss']
})
export class HomeComponent implements OnInit{

  constructor(private blogsService : BlogService,
              private route: ActivatedRoute,
              private router: Router) { }

  blogs: Observable<IBlog[]> = new Observable<IBlog[]>();

  toBlogPage(id: string){
    this.router.navigate(['blog', id]).then();
  }

  ngOnInit(): void {
    this.router.navigate(['/blogs', CATEGORIES[0]])
      .catch(err => console.log(err));
    this.route.paramMap
      .subscribe(params =>{
        const category = params.get('category');
        if (category){
          this.blogs = this.blogsService.getByCategory(category);
        }
        else{
          this.blogs = this.blogsService.getAll();
        }
      });
  }
}

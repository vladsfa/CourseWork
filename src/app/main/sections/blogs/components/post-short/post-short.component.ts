import {AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {IBlog} from "../../models/IBlog";
import firebase from "firebase/compat";
import {AuthService} from "../../../../../auth/auth.service";
import {Observable} from "rxjs";
import {IUser} from "../../../../../auth/IUser";

@Component({
  selector: 'app-post-short',
  templateUrl: './post-short.component.html',
  styleUrls: ['./post-short.component.scss']
})
export class PostShortComponent implements OnChanges, AfterViewInit{
  @Input() blog!: IBlog;
  author!: Observable<IUser>;

  @ViewChild('desc') descRef!: ElementRef;
  @ViewChild('imgContainer') imgContainerRef!: ElementRef;
  @ViewChild('category') categoryRef!: ElementRef;
  @ViewChild('title') titleRef!: ElementRef;
  @ViewChild('authorElem') authorRef!: ElementRef;
  @ViewChild('date') dateRef!: ElementRef;
  @ViewChild('main') mainRef!: ElementRef;
  @ViewChild('container') containerRef!: ElementRef

  constructor(private authService: AuthService) {
  }

  getFormatDate(){
    return this.blog.date
      .toDate()
      .toLocaleTimeString
      ([], {hour: '2-digit', minute:'2-digit'})
      + ' ' +
      this.blog.date
        .toDate()
        .toLocaleString('en', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['blog'] && changes['blog'].currentValue){
      this.author = this.authService.getUserById(this.blog.author);
    }
  }

  ngAfterViewInit(): void {
    const desc = (this.descRef.nativeElement as HTMLParagraphElement);
    const imgContainer = (this.imgContainerRef.nativeElement as HTMLDivElement);
    const main = (this.mainRef.nativeElement as HTMLDivElement);

    const widthMain = parseInt(getComputedStyle(main).width.slice(0, -2));
    (this.categoryRef.nativeElement as HTMLParagraphElement).style.fontSize = (widthMain * 0.0665) + 'px';
    (this.authorRef.nativeElement as HTMLParagraphElement).style.fontSize = (widthMain * 0.0665) + 'px';
    (this.titleRef.nativeElement as HTMLParagraphElement).style.fontSize = (widthMain * 0.1245) + 'px';
    (this.dateRef.nativeElement as HTMLParagraphElement).style.fontSize = (widthMain * 0.0581) + 'px';

    const widthDesc = parseInt(getComputedStyle(this.descRef.nativeElement).width.slice(0, -2));
    (this.descRef.nativeElement as HTMLParagraphElement).style.fontSize = (widthDesc * 0.052) + 'px';

    imgContainer.style.display = 'none';
    desc.style.display = 'none';

    const heightMain = parseInt(getComputedStyle(main).height.slice(0, -2));

    desc.style.maxHeight = heightMain * 2 + 'px';
    imgContainer.style.maxHeight = heightMain * 2 + 'px';

    imgContainer.style.display = '';
    desc.style.display = '';

    const container = this.containerRef.nativeElement as HTMLDivElement;
    const width = parseInt(getComputedStyle(container).width.slice(0, -2));

    container.style.padding = width * 0.024 + 'px';
    main.style.marginRight = width * 0.036 + 'px';
    desc.style.marginRight = width * 0.036 + 'px';
  }
}

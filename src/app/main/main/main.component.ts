import {AfterViewChecked, AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements AfterViewChecked{

  @ViewChild('header') headerRef!: ElementRef;
  @ViewChild('main') mainRef!: ElementRef;
  @ViewChild('footer') footerRef!: ElementRef;

  ngAfterViewChecked(): void {
    const header = (this.headerRef.nativeElement as HTMLDivElement)
    /*const footer = (this.footerRef.nativeElement as HTMLDivElement)*/

    const headerHeight = header.offsetHeight
      + this.getStyle(header, 'marginTop')
      + this.getStyle(header, 'marginBottom');

    /*const footerHeight = footer.offsetHeight
      + this.getStyle(footer, 'marginTop')
      + this.getStyle(footer, 'marginBottom');*/

    const main = this.mainRef.nativeElement as HTMLDivElement;
    main.style.minHeight = (document.documentElement.clientHeight - headerHeight /*- footerHeight*/) + 'px';
  }


  getStyle(element: HTMLElement, name: string){
    // @ts-ignore
    return parseInt(getComputedStyle(element)[name].slice(0, -2));
  }
}

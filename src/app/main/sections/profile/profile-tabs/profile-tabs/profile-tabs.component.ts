import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-profile-tabs',
  templateUrl: './profile-tabs.component.html',
  styleUrls: ['./profile-tabs.component.scss']
})
export class ProfileTabsComponent implements OnInit{

  constructor(private route: ActivatedRoute,
              private router: Router) {

  }


  tabs = ['Блоги'];
  currentTab: string = 'Блоги';

  ngOnInit(): void {
    this.router.navigate(['blogs'], {relativeTo: this.route})
      .catch(err => console.log(err));
  }

}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MainComponent} from "./main/main.component";
import {HeaderComponent} from "./header/header.component";
import {FooterComponent} from "./footer/footer.component";
import {RouterLink, RouterOutlet} from "@angular/router";
import {BlogsModule} from "./sections/blogs/blogs.module";
import {ProfileModule} from "./sections/profile/profile.module";
import {MatTabsModule} from "@angular/material/tabs";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MainRoutingModule} from "./main-routing.module";



@NgModule({
  declarations: [
    MainComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    MainRoutingModule,
    BlogsModule,
    ProfileModule,
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatTabsModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class MainModule { }

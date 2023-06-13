import { NgModule } from '@angular/core';
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app/app.component";
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {AuthModule} from "./auth/auth.module";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../environments/environment";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {NgOptimizedImage} from "@angular/common";
import {MainModule} from "./main/main.module";
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  imports: [
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebase),
    AuthModule,
    MainModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  declarations: [AppComponent, PageNotFoundComponent, LoadingComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

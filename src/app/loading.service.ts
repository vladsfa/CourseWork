import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private isLoading = new BehaviorSubject(false);
  constructor() { }
  getLoadingStatus(){
    return this.isLoading;
  }
  setLoadingStatus(is: boolean){
    this.isLoading.next(is);
  }
}

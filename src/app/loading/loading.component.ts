import { Component } from '@angular/core';
import {LoadingService} from "../loading.service";

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
  isLoading = false;
  constructor(loadingService: LoadingService) {
    loadingService.getLoadingStatus().subscribe(load => this.isLoading = load);
  }
}

import {Injectable} from '@angular/core';
import {Observable} from "rxjs/index";
import {ApiService} from "./api.service";

import {map} from "rxjs/internal/operators";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private apiService: ApiService) {

  }

  get(): Observable<any> {
    return this.apiService.get('/product/');
  }
}

import {Injectable} from '@angular/core';
import {Observable} from "rxjs/index";
import {ApiService} from "./api.service";

import {map} from "rxjs/internal/operators";
import {Transaction} from "../../model/transaction";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private apiService: ApiService) {

  }

  get(): Observable<any> {
    return this.apiService.get('/transaction/');
  }
  findOne(id: string): Observable<any> {
    return this.apiService.get('/transaction/'+id);
  }
  delete(id: string): Observable<any> {
    return this.apiService.delete('/transaction/'+id);
  }

  save(transaction: Transaction): Observable<any> {
    console.log(transaction)
    return this.apiService.post('/transaction/', transaction);
  }
}

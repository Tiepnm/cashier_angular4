import {Component, OnInit} from '@angular/core';
import {TransactionService} from "../core/transaction.service";
import {Transaction} from "../../model/transaction_dto";


@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  private transactions: Transaction[] = [];

  constructor(private readonly transactionService: TransactionService) {
    this.transactionService = transactionService;

  }

  ngOnInit() {
    this.transactionService.get().subscribe(data => {
      console.log(data)
      this.transactions = data;
    });
  }
  delete(id: string): void {

    this.transactionService.delete(id).subscribe(data => {
      this.transactionService.get().subscribe(data2 => {

        this.transactions = data2;
      });
    });
  }

}

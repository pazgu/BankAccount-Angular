import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BankDataService } from '../bank-data.service';
import { BankTransaction } from '../bank-transaction';

@Component({
  selector: 'app-bank-transaction-table',
  templateUrl: './bank-transaction-table.component.html',
  styleUrls: ['./bank-transaction-table.component.css']
})
export class BankTransactionTableComponent {
  bankTransactions: BankTransaction[] = this.data_svc.getTransactions();
  @Input() transactionTypeNames: string[] = ["openAccount", "deposit", "withdraw"];

  constructor(private router_srv: Router, private data_svc: BankDataService) { }

  ngOnInit(): void {
    if (!this.data_svc.userSignedIn())
      this.router_srv.navigateByUrl("/AccountLogin"); 
    else {
      this.data_svc.setMenuVisibility(true);
    }
  }

  getCurrentBalance(): number {
    let balance = this.data_svc.getCurrentBalance();
    return balance;
  }

  goBack() {
    this.router_srv.navigateByUrl("/BankAccount");
  }
}

import { Component, OnInit } from '@angular/core';
import { BankDataService } from '../bank-data.service';
import { BankTransaction, TransactionType } from '../bank-transaction';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  transactionTypeNames: string[] = ["openAccount", "deposit", "withdraw"];
  transaction!: BankTransaction;
  index!: number;
  bankTransactions: BankTransaction[] = this.data_svc.getTransactions();

/* 
  Since I'm passing the transactions from the TransactionTableComponent through the ActivatedRoute service,
  I don't need to use the @Input decorator to pass the data. 
 */


  constructor(private route: ActivatedRoute, private router_srv: Router, private data_svc: BankDataService) { }

  //The ActivatedRoute allows to read the parameters from the URL
  ngOnInit(): void {
    this.data_svc.setMenuVisibility(false);
  if (!this.data_svc.userSignedIn())
    this.router_srv.navigateByUrl("/AccountLogin");
  else {
    this.route.queryParamMap.subscribe(params => {  // subscribe to changes in the query parameters of the route
      const index2 = params.get('index');  // get the value of the 'index' query parameter
      if (index2 !== null) {  
        this.index = +index2;  // convert the value of 'index' to a number
        this.transaction = this.data_svc.getTransactions()[this.index];   
      }
    });
  }
}

  onDeleteTransaction() {
    const confirmation = `Are you sure you want to delete transaction ${this.index + 1} of ${TransactionType[this.transaction.trnTyp]} ${this.transaction.amount} NIS?`;    
    if (confirm(confirmation)) 
    {
      if (this.transactionTypeNames[this.index] === 'openAccount') 
      {
        alert('מתנצלים, אין אפשרות למחוק פעולת פתיחת חשבון');
      } 
      else 
      {
        let balance = this.data_svc.getCurrentBalance();
        //if the current balance minus the amount of the deposit we're trying to delete is greater than -2000
        //p.s, only deletion of deposit transaction will affect negetivly on the balance
        if (balance - this.transaction.amount < -2000) 
        {
          alert('אין אפשרות למחוק את הטרנזקציה הנוכחית, משום שהיתרה תהפוך להיות מתחת ל2000 שח');
        } 
        else {
          this.data_svc.deleteTransaction(this.index);
          this.data_svc.updateBankCredentials();
        }
        this.goBack();
      }
    }
  }
   
  goBack() {
    this.router_srv.navigateByUrl("/BankTransactionTable");
  }
}  

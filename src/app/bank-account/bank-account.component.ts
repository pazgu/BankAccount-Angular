import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BankAccountDetails } from '../bank-account-details';
import { BankDataService } from '../bank-data.service';
import { TransactionType, BankTransaction } from '../bank-transaction';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.css']
})

export class BankAccountComponent implements OnInit {
  currentAmount: number = 0;
  currentBalance: number = 0;
  transaction?: BankTransaction = undefined;
  accountDetails: BankAccountDetails;
  currentTransactionType: number = -1;
  currentTransactionAsmachta: string = "";
  currentTransactionDateS: string = "";
  transactionTypeNames: string[] = [];
  lastActionFail: boolean = false;
  transactions: BankTransaction[] = [];
  comment: string = "";
  transactionCounter: string = "1";

  constructor(private router_srv: Router, private data_svc: BankDataService) 
  {
    this.accountDetails = this.data_svc.BankBranch;

    for (let optn in TransactionType)
    {
      if (isNaN(Number(optn)))
      this.transactionTypeNames.push(optn);
    }
  }

  ngOnInit(): void {
    this.data_svc.setMenuVisibility(true);
    if (!this.data_svc.userSignedIn())
      this.router_srv.navigateByUrl("/AccountLogin");
    else {
      this.transactions = this.data_svc.getTransactions();
    }
  }

  doTransaction(): void 
  {
    this.currentBalance = this.data_svc.getCurrentBalance();
    let withdrawCheck: boolean = false; //checks if withdraw is the first action
    this.lastActionFail = false; //checks if the balance is not negetive
    if (this.currentAmount == null || this.currentAmount < 0) {
      this.data_svc.showErrorFocus("הסכום חייב להיות חיובי", "amount");
      return;
    }
    //if user is trying to insert asmachta number
    if (this.currentTransactionAsmachta != "" && this.currentTransactionAsmachta.length<4) {
      this.data_svc.showErrorFocus("אסמכתא חייבת להיות בעלת לפחות 4 תווים", "asmachta");
      return;
    }
    if (this.currentTransactionDateS == "") {
      this.data_svc.showErrorFocus("תאריך חובה", "currentDate");
      return;
    }

    let today: Date = new Date();
    let typedDt: Date = new Date(this.currentTransactionDateS);
    if (typedDt > today) {
      this.data_svc.showErrorFocus("תאריך מאוחר מהיום אסור", "currentDate");
      return;
    }
    //this check will reset the messege in the comment section after the user tried to withdraw money (without success)
    if (this.currentTransactionType * 1 == 0){
      this.comment="";
    }
    //The first if checks whether the first transaction is not openAccount
    if (this.currentTransactionType * 1 != 0 && this.transactions.length == 0) {
      if (this.currentTransactionType * 1 == 2) {
        this.comment = "אין אפשרות לבצע פעולת משיכה";
        withdrawCheck = true;
      }
      else {
        this.currentTransactionType = 0;
        this.comment = "פעולת ההפקדה שונתה לפתיחת חשבון";
      }
    }
    if (withdrawCheck == false) {
      switch (this.currentTransactionType * 1) {
        case TransactionType.openAccount: 
          this.currentBalance = this.currentAmount;
          break;
        case TransactionType.deposit: 
          this.currentBalance += this.currentAmount;
          this.comment = "";
          break;
        case TransactionType.withdraw:
          if ((this.currentBalance - this.currentAmount) < this.accountDetails.limit) 
          {
            this.lastActionFail = true;
            this.comment = "";
            return;
          }
          this.currentBalance -= this.currentAmount;
          this.comment = "";
          break;
        default: alert('לא בחרת סוג פעולה');
          return;
      }
      this.transactionCounter = "#" + this.data_svc.getNextTransactionCounter();
      if (this.currentTransactionAsmachta == ""){ //if user did not insert asmachta as input
        this.currentTransactionAsmachta = this.transactionCounter; //take the #counter
       }  //else take the valid input the user insert 
      this.transaction = new BankTransaction(this.currentAmount, new Date(this.currentTransactionDateS), this.currentTransactionAsmachta.trim(), this.currentTransactionType, this.currentBalance, this.transactionCounter, this.comment);
      this.data_svc.addTransaction(this.transaction);
    }

    //clear the fields for the next transaction
    this.currentAmount = 0;
    this.currentTransactionAsmachta = "";
    this.currentTransactionDateS = "";
    this.currentTransactionType = -1;

    // focus on amount field 
    doFocus("amount");
  }
}

//This function focus the element (used for the amount)
function doFocus(id: string): void {
  document.getElementById(id)?.focus();
}

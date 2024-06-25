import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AccountOwner } from '../account-owner';
import { BankDataService } from '../bank-data.service';
import { BankAccountDetails } from '../bank-account-details';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private router_srv: Router, private data_svc: BankDataService) { }
  owner: AccountOwner = this.data_svc.getOwner(); //to get the owner details
  currentPage: string =""; //for removing some labels presnted in the menu, from being preseneted in other pages
  BankBranch: BankAccountDetails = this.data_svc.BankBranch; //to get the branch details

  ngOnInit() {
    // to track of the current URL
    this.router_srv.events.subscribe(event => {
      //the NavigationEnd event is emitted by the router when a navigation ends successfully
      if (event instanceof NavigationEnd) {
        this.currentPage = event.url.split('/')[1];
        // Split the URL by '/' and get the second element (the current page)
        // 'http://localhost:4200/AccountOwner' -> ['', 'AccountOwner']
      }
    });
  } //this part of code will be used to hidden some labels

  logOut(): void {
    this.data_svc.userDisconnect();
    this.router_srv.navigateByUrl("/AccountLogin");
  }

  getMenuBarContent(): number {
    if (this.showMenu()) {
      let balance = this.data_svc.getCurrentBalance();
      return balance;
    }
    return 0;
  }

  showMenu(): Boolean {
    return this.data_svc.getMenuVisibility();
  }
  
  getPictureSource(): string {
    return this.owner.hasPicture ? 'assets/images/' + this.owner.tz + '.png' : 'assets/images/noImage.png';
  }

  getAccountOwnerName(): string {
    let ownerName = localStorage.getItem(this.data_svc.decrptString('ownerName'));
    if (ownerName) {
      return ownerName;
    }
    return this.owner.name;
  }

  getLastTransactionDate(): Date | null{
    return this.data_svc.getDate();
  }

  getBankName(): string {
    return this.BankBranch.bankName;
  }

  getBranchName(): string {
    let branchName = localStorage.getItem(this.data_svc.decrptString('branchName'));
    if (branchName) {
      return branchName;
    }
    return this.BankBranch.branchName;
  }

  getBranchNumber(): string {
    let branchNumber = localStorage.getItem(this.data_svc.decrptString('branchNumber'));
    if (branchNumber) {
      return branchNumber;
    }
    return this.BankBranch.branchNumber;
  }

  getAccountNumber(): string {
    let accountNumber = localStorage.getItem(this.data_svc.decrptString('accountNumber'));
    if (accountNumber) {
      return accountNumber;
    }
    return this.BankBranch.accountNumber;
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BankAccountDetails } from '../bank-account-details';
import { BankDataService } from '../bank-data.service';

@Component({
  selector: 'app-bank-branch-details',
  templateUrl: './bank-branch-details.component.html',
  styleUrls: ['./bank-branch-details.component.css'],
})
export class BankBranchDetailsComponent implements OnInit {
  bankAccountDetails: BankAccountDetails;
  initbankAccountDetails: BankAccountDetails; //This is a copy of the object .. is used to revert the changes
  jobDone: boolean = false; //boolean to check the input and redirect to the AccountLogin accordingly
  isEditMode: boolean = false;
  buttonText: string = 'Edit';

  constructor(private data_svc: BankDataService, private router_srv: Router) {
    this.bankAccountDetails = this.data_svc.BankBranch;
    this.initbankAccountDetails = new BankAccountDetails('', '', '');
  }

  ngOnInit(): void {
    if (!this.data_svc.userSignedIn()) {
      this.router_srv.navigateByUrl('/AccountLogin');
    } else {
      this.data_svc.setMenuVisibility(true);
      this.initbankAccountDetails = new BankAccountDetails(
        this.bankAccountDetails.branchName,
        this.bankAccountDetails.branchNumber,
        this.bankAccountDetails.accountNumber
      );
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.buttonText = 'Save updates';
    } else {
      this.buttonText = 'Edit';
    }
  }

  //to get the previous value of the input field (before user started typing)
  revert(): void {
    this.bankAccountDetails.branchName = this.initbankAccountDetails.branchName;
    this.bankAccountDetails.branchNumber = this.initbankAccountDetails.branchNumber;
    this.bankAccountDetails.accountNumber = this.initbankAccountDetails.accountNumber;
  }

  updateBranch(): void {
    if (this.bankAccountDetails.branchName == '') {
      //I didn't use trim method because name value can have spaces (city names)
      this.data_svc.showErrorFocus('שם הסניף אינו יכול להיות ריק','branchName');
      return;
    }
    if (this.bankAccountDetails.branchNumber == '') {
      this.data_svc.showErrorFocus('מספר הסניף אינו יכול להיות ריק','branchNumber');
      return;
    }
    if (this.bankAccountDetails.accountNumber == '') {
      this.data_svc.showErrorFocus('מספר החשבון אינו יכול להיות ריק','accountNumber');
      return;
    }
    this.jobDone = true;

    //This function is called from the Bank Data service and used for updating the input fields
    this.data_svc.changeBranch(
      this.bankAccountDetails.branchName,
      this.bankAccountDetails.branchNumber.trim(),
      this.bankAccountDetails.accountNumber.trim()
    );
  }
}

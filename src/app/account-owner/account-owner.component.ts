import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountOwner } from 'src/app/account-owner';
import { BankDataService } from '../bank-data.service';


@Component({
  selector: 'app-account-owner',
  templateUrl: './account-owner.component.html',
  styleUrls: ['./account-owner.component.css']
})
export class AccountOwnerComponent implements OnInit {
  owner: AccountOwner = this.data_svc.getOwner();
  initOwner: AccountOwner = new AccountOwner();
  jobDone: boolean = false; //boolean to check the input and redirect to the AccountLogin accordingly
  nwOwner = "";
  ktovet = "";
  isEditMode: boolean = false;
  buttonText: string = "Edit";

  constructor(private data_svc: BankDataService, private router_srv: Router) {
  }

  ngOnInit(): void {
    if (!this.data_svc.userSignedIn()) {
      this.router_srv.navigateByUrl("/AccountLogin");
    }
    else {
      this.data_svc.setMenuVisibility(true);
      this.nwOwner = this.owner.name;
      this.ktovet = this.owner.address;
      this.initOwner = new AccountOwner(this.owner.name, this.owner.address, this.owner.tz, this.owner.hasPicture);
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode; //gets the opposite value of the current mode 
    if (this.isEditMode) {
      this.buttonText = 'Save updates';
    }
    else {
      this.buttonText = 'Edit';
    }
  }

  //to get the previous value of the input field (before user started typing)
  revert(): void {
    this.owner.name = this.initOwner.name;
    this.owner.address = this.initOwner.address;
    this.owner.hasPicture = this.initOwner.hasPicture;
  }

  //The function checks the owner name and address inputs
  updateOwnerName(): void {
    if (this.owner.name == "") {
      this.data_svc.showErrorFocus("השם אינו יכול להיות ריק", "shem"); //I didn't use trim method because name value can have spaces
      return;
    }
    if (this.owner.address == "") {
      this.data_svc.showErrorFocus("כתובת מגורים אינה יכולה להיות ריקה", "adrs"); //same for address
      return;
    }
    this.jobDone = true;

    //called from the Bank Data service and used for updating the input fields 
    this.data_svc.changeOwnerName(this.owner.name, this.owner.address);
  }

  // to handle changes for checkbox input
  onHasPictureChange(event: any) {

    // Extract the value of the checkbox from the 'checked' property of the event target
    const hasPicture = event.target.checked;
    this.data_svc.setHasPicture(hasPicture);
  }

}

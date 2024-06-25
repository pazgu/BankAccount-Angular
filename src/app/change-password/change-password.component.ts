import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BankDataService } from '../bank-data.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  crntPwd: string = "";
  nwPwd: string = "";
  reNwPwd: string = "";
  jobDone: boolean = false; //boolean to check the input and redirect to the AccountLogin accordingly
  constructor(private router_srv: Router, private data_svc: BankDataService) { }

  ngOnInit(): void {
    this.data_svc.setMenuVisibility(false);
    if (!this.data_svc.userSignedIn())
    {
      this.router_srv.navigateByUrl("/AccountLogin");  
    }
  }

  //I didn't add the save or cancel changes buttons because I don't want the user to see the password as output.

  updIt(): void {
    if (this.crntPwd.trim() == "" || this.nwPwd.trim() == "" || this.reNwPwd.trim() == "") {
      alert("אחד או יותר משדות הקלט ריקים");
      document.getElementById("crntpwd")?.focus();
      return;
    }
    if (!this.data_svc.isPwdOk(this.crntPwd.trim())) {
      alert("סיסמא נוכחית שגויה");
      document.getElementById("crntpwd")?.focus();
      return;
    }
    if (this.nwPwd.trim() != this.reNwPwd.trim()) {
      alert("סיסמא מבוקשת שונה מוידוא מבוקשת ");
      document.getElementById("nwpwd")?.focus();
      return;
    }
    if (this.nwPwd.trim() == this.crntPwd.trim()) {
      alert("סיסמא מבוקשת חייבת להיות שונה מנוכחית ");
      document.getElementById("crntpwd")?.focus();
      return;
    }
    this.jobDone = true;
    
    //This function is called from the Bank Data service and used for updating the input fields 
    this.data_svc.changePwd(this.nwPwd.trim());
  }
  goBack() {
    this.router_srv.navigateByUrl("/BankAccount");
  }
}

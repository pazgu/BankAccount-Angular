import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BankDataService } from '../bank-data.service';
import { UserCredentials } from '../user-credentials';

@Component({
  selector: 'app-account-login',
  templateUrl: './account-login.component.html',
  styleUrls: ['./account-login.component.css']
})
export class AccountLoginComponent implements OnInit {
  emailaddress:string="";
  password:string="";

  constructor(private data_svc:BankDataService,private router_srv:Router) { }


  ngOnInit(): void {
    this.data_svc.setMenuVisibility(false);

  }
  
  login():void{
    const user=new UserCredentials(this.emailaddress.trim(),this.password.trim());
    if (this.data_svc.isCredentialOk(user))
    {
      this.data_svc.setCurrentUsr(user);
      this.router_srv.navigateByUrl("/BankAccount");
    }
    else
      alert("שם המשתמש או הסיסמא שגוי");
      document.getElementById("uid")?.focus();
  }
}

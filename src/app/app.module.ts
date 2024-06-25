import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { BankAccountComponent } from './bank-account/bank-account.component';
import { AccountOwnerComponent } from './account-owner/account-owner.component';
import { AccountLoginComponent } from './account-login/account-login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MenuComponent } from './menu/menu.component';
import { BankBranchDetailsComponent } from './bank-branch-details/bank-branch-details.component';
import { BankTransactionTableComponent } from './bank-transaction-table/bank-transaction-table.component';
import { MyDetailsComponent } from './my-details/my-details.component';
import { TransactionComponent } from './transaction/transaction.component';


@NgModule({
  declarations: [
    AppComponent,
    AccountOwnerComponent,
    BankAccountComponent,
    AccountLoginComponent,
    ChangePasswordComponent,
    PageNotFoundComponent,
    MenuComponent,
    BankBranchDetailsComponent,
    BankTransactionTableComponent,
    MyDetailsComponent,
    TransactionComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

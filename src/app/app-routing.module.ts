import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountLoginComponent } from './account-login/account-login.component';
import { AccountOwnerComponent } from './account-owner/account-owner.component';
import { BankAccountComponent } from './bank-account/bank-account.component';
import { BankTransactionTableComponent } from './bank-transaction-table/bank-transaction-table.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MyDetailsComponent } from './my-details/my-details.component';
import { TransactionComponent } from './transaction/transaction.component';
import { BankBranchDetailsComponent } from './bank-branch-details/bank-branch-details.component';

const routes: Routes = [
  { path: '', redirectTo: '/MyDetails', pathMatch: 'full' },
  { path: 'MyDetails', component: MyDetailsComponent },
  { path: 'AccountLogin', component: AccountLoginComponent },
  { path: 'BankAccount', component: BankAccountComponent },
  { path: 'ChangePassword', component: ChangePasswordComponent },
  { path: 'AccountOwner', component: AccountOwnerComponent },
  { path: 'BankTransactionTable', component: BankTransactionTableComponent }, // Added page for transaction table
  { path: 'TransactionComponent', component: TransactionComponent }, // Added page for one transaction 
  { path: 'BankBranchDetails', component: BankBranchDetailsComponent }, // Added page for Bank Branch 
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

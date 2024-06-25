import { Injectable } from '@angular/core';
import { UserCredentials } from './user-credentials';
import { BankTransaction, TransactionType } from './bank-transaction';
import * as CryptoJS from 'crypto-js';
import { AccountOwner } from './account-owner';
import { BankAccountDetails } from './bank-account-details';
import { BankCredentials } from './bank-credentials';

const USER_CREDENTIALS_KY: string = 'USER_CREDENTIALS';
const BANK_CREDENTIALS_KY: string = 'BANK_CREDENTIALS'; //holds transactionCounter, transactions array, BankBranch and currentOwner
const SALT: string = 'mko)9Ijn8UhErtb';

@Injectable({
  providedIn: 'root',
})
export class BankDataService {
  private transactions: BankTransaction[] = [];
  private transactionCounter: number = 1;
  currentOwner: AccountOwner = new AccountOwner('Plonit Almonit', 'ta', 129387465);
  BankBranch: BankAccountDetails = new BankAccountDetails('Rimonim Givataim', '762', '113344'); //Rimonim Givataim", "762", "113344"
  BankCredentials: BankCredentials | null = JSON.parse(JSON.stringify(new BankCredentials(
        this.transactionCounter,
        this.transactions,
        this.BankBranch,
        this.currentOwner
      )
    )
  );
  currentUser?: UserCredentials;
  theUserCredential: UserCredentials | null = null; // = new UserCredentials("siteAdmin@bigbank.com", "1234");
  private menuVisible: Boolean = false;
  hasPicture: boolean = false;
  lastTransactionDate: Date = new Date();

  getOwner(): AccountOwner {
    return this.currentOwner;
  }

  public getCurrentBalance(): number {
    let balance = 0;
    for (let transaction of this.transactions) {
      if (TransactionType[transaction.trnTyp] == 'withdraw') {
        balance -= transaction.amount;
      } else {
        balance += transaction.amount;
      }
    }
    this.updateBankCredentials();
    return balance;
  }

  public getDate(): Date | null {
    const lastTransaction = this.transactions[this.transactions.length - 1];

    // Set the last transaction date in the data service
    if (lastTransaction) {
      this.lastTransactionDate = lastTransaction.trnDate;
      return this.lastTransactionDate;
    }
    return null;
  }

  setHasPicture(hasPicture: boolean) {
    this.hasPicture = hasPicture;
  }

  public getTransactions(): BankTransaction[] {
    this.updateBankCredentials();
    return this.transactions;
  }

  getNextTransactionCounter(): number {
    let currentTransactionCounter = this.transactionCounter;
    this.transactionCounter++;
    return currentTransactionCounter;
  }

  public addTransaction(transaction: BankTransaction): void {
    this.transactions.push(transaction);
    this.updateBankCredentials();
  }

  public deleteTransaction(index: number): void {
    // Get the starting balance of the transaction before the deleted transaction
    let startingBalance = this.transactions[index - 1].currentBalance;
    // Remove the transaction from the array
    this.transactions.splice(index, 1);
    for (let i = index; i < this.transactions.length; i++) {
      if (this.transactions[i].trnTyp == 1) {
        this.transactions[i].currentBalance = startingBalance + this.transactions[i].amount;
      } 
      else {
        this.transactions[i].currentBalance = startingBalance - this.transactions[i].amount;
      }
      // Update the starting balance to the current balance of the current transaction 
      startingBalance = this.transactions[i].currentBalance;
    }
    this.updateBankCredentials();
  }

  constructor() {
    this.loadFillUser();
    this.loadBankDetails();
    //to delete the whole stored data clear the local storage from the developer tools or remove this comment:
    //localStorage.removeItem(BANK_CREDENTIALS_KY);
  }

  getMenuVisibility(): Boolean {
    return this.menuVisible;
  }
  setMenuVisibility(nwStat: Boolean): void {
    this.menuVisible = nwStat;
  }

  loadBankDetails(): void {
    // Retrieve encrypted bank details from local storage
    const encrptedString = localStorage.getItem(BANK_CREDENTIALS_KY);
    if (!encrptedString) {
      return;
    } else {
      // Decrypt the bank details
      const decryptedString = CryptoJS.AES.decrypt(
        encrptedString,
        BANK_CREDENTIALS_KY
      );
      // Attempt to parse the decrypted bank details and update the corresponding class properties
      const cleartext = decryptedString.toString(CryptoJS.enc.Utf8);
      try {
        this.BankCredentials = JSON.parse(cleartext) as BankCredentials;
        this.transactions = this.BankCredentials.transactions;
        this.transactionCounter = this.BankCredentials.transactionCounter;
        this.currentOwner = this.BankCredentials.currentOwner;
        this.BankBranch = this.BankCredentials.BankBranch;
        this.BankCredentials = JSON.parse(JSON.stringify(this.BankCredentials));
      } catch {
        alert('בעיה במקור הנתונים, טוען נתוני Mock');
        this.updateBankCredentials();
      }
    }
  }

  public updateBankCredentials(): void {
    try {
      this.BankCredentials = new BankCredentials(
        this.transactionCounter,
        this.transactions,
        this.BankBranch,
        this.currentOwner
      );
      const cleartext = JSON.stringify(this.BankCredentials);
      const encrypted = CryptoJS.AES.encrypt(cleartext, BANK_CREDENTIALS_KY);
      const encryptedString = encrypted.toString();
      localStorage.setItem(BANK_CREDENTIALS_KY, encryptedString);
      this.BankCredentials = JSON.parse(JSON.stringify(this.BankCredentials));
    } catch {
      alert('בעיה בעדכון הנתונים');
    }
  }

  private loadFillUser(): void {
    const parmanentStr: string | null =
      localStorage.getItem(USER_CREDENTIALS_KY); // the preferd syntax
    //same as const parmanentStr=localStorage[this.parmanentKy];
    if (!parmanentStr) {
      //אין אחסון של נתונים בלוקל סטורג
      this.loadInitUserCredentialsData();
    } else
      try {
        //ניסיון לטעון הנתונים מהלוקל סטורג
        this.theUserCredential = JSON.parse(parmanentStr);
      } catch (prblm) {
        //הנתונים בלוקל סטורג לא תקינים
        alert('בעיה במקור הנתונים, טוען נתוני Mock');
        this.loadInitUserCredentialsData();
      }
  }

  isCredentialOk(inVlus: UserCredentials): boolean {
    return (
      inVlus.eml == this.theUserCredential?.eml &&
      this.encrptPwd(inVlus.pwd) == this.theUserCredential.pwd
    );
  }

  encrptString(inStr: string): string {
    return CryptoJS.AES.encrypt(inStr, SALT).toString();
  }

  decrptString(inEncStr: string): string {
    return CryptoJS.AES.decrypt(inEncStr, SALT).toString(CryptoJS.enc.Utf8);
  }

  registerAdmin(uid: string, pwd: string) {
    const hashedPwd = CryptoJS.SHA3(pwd + SALT, {
      outputLength: 512,
    }).toString();
    localStorage.setItem('admin', `{"uid":"${uid}","pwd":"${hashedPwd}"}`);
    this.userSignedIn() == true;
  }

  encrptPwd(pwd: string): string {
    return CryptoJS.SHA3(pwd + SALT, { outputLength: 512 }).toString();
  }

  loadInitUserCredentialsData(): void {
    const t: string = JSON.stringify(
      new UserCredentials('siteAdmin@bigbank.com', this.encrptPwd('1234'))
    );
    this.theUserCredential = JSON.parse(t);
    this.updateUSerStorage();
  }

  updateUSerStorage(): void {
    const savedStr = JSON.stringify(this.theUserCredential);
    try {
      localStorage.setItem(USER_CREDENTIALS_KY, savedStr); // the preferd syntax
      // same as localStorage[this.parmanentKy]=savedStr
    } catch (prblm) {
      alert('שמירת הנתונים נכשלה');
    }
  }

  setCurrentUsr(usr: UserCredentials): void {
    this.currentUser = usr;
  }

  userSignedIn(): boolean {
    return this.currentUser != undefined;
  }

  userDisconnect(): void {
    this.currentUser = undefined;
  }

  isPwdOk(typdPwd: string): boolean {
    return this.theUserCredential?.pwd + '' == this.encrptPwd(typdPwd);
  }

  changePwd(nwPwd: string): void {
    if (this.theUserCredential) {
      this.theUserCredential.pwd = this.encrptPwd(nwPwd);
    }
    this.updateUSerStorage();
  }

  // used for updating the input fields of the owner details
  changeOwnerName(nwOwner: string, ktovet: string): void {
    if (this.currentOwner) {
      this.currentOwner.name = nwOwner;
      this.currentOwner.address = ktovet;
      try {
        localStorage.setItem('ownerName', this.encrptString(nwOwner));
        localStorage.setItem('address', this.encrptString(ktovet));
        this.updateBankCredentials();
      } catch (prblm) {
        alert('שמירת הנתונים נכשלה');
      }
    }
  }

  // used for updating the input fields of the bank details
  changeBranch(
    newName: string,
    newBranchNumber: string,
    newAccountNumber: string
  ): void {
    if (this.BankBranch) {
      this.BankBranch.branchName = newName;
      this.BankBranch.branchNumber = newBranchNumber;
      this.BankBranch.accountNumber = newAccountNumber;
      try {
        localStorage.setItem('branchName', this.encrptString(newName));
        localStorage.setItem('branchNumber', this.encrptString(newBranchNumber));
        localStorage.setItem('accountNumber', this.encrptString(newAccountNumber));
        this.updateBankCredentials();
      } catch (prblm) {
        alert('שמירת הנתונים נכשלה');
      }
    }
  }

  showErrorFocus(msg: string, id: string): void {
    alert(msg);
    document.getElementById(id)?.focus();
  }
}

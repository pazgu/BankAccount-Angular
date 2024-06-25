import { AccountOwner } from "./account-owner";
import { BankAccountDetails } from "./bank-account-details";
import { BankTransaction } from "./bank-transaction";

// this class created in order to use it in the encryption part in the data service

export class BankCredentials {
    constructor(
       public transactionCounter: number,
       public transactions: BankTransaction[],
       public BankBranch: BankAccountDetails,
       public currentOwner: AccountOwner,
    ) {}
  }
  
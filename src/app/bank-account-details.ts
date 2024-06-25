const activeBank: string = 'Big Bank Inc';

export class BankAccountDetails {
  bankName: string = activeBank;
  limit: number = -2000;
  constructor(
    public branchName: string,
    public branchNumber: string,
    public accountNumber: string
  ) {}
}

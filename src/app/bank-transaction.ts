export enum TransactionType {
  openAccount,
  deposit,
  withdraw,
}

export class BankTransaction {
  constructor(
    public amount: number,
    public trnDate: Date = new Date(),
    public asmachta: string,
    public trnTyp: TransactionType,
    public currentBalance: number,
    public transactionCounter: string,
    public comment?: string
  ) {}
  toString(): string {
    return `A ${TransactionType[this.trnTyp]} of ${this.amount} NIS was made`;
  }
}

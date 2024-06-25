import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankTransactionTableComponent } from './bank-transaction-table.component';

describe('BankTransactionTableComponent', () => {
  let component: BankTransactionTableComponent;
  let fixture: ComponentFixture<BankTransactionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankTransactionTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankTransactionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

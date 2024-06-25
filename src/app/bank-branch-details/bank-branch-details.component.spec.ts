import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankBranchDetailsComponent } from './bank-branch-details.component';

describe('BankBranchDetailsComponent', () => {
  let component: BankBranchDetailsComponent;
  let fixture: ComponentFixture<BankBranchDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankBranchDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankBranchDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

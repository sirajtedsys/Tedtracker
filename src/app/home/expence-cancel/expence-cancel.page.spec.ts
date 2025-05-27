import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenceCancelPage } from './expence-cancel.page';

describe('ExpenceCancelPage', () => {
  let component: ExpenceCancelPage;
  let fixture: ComponentFixture<ExpenceCancelPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenceCancelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

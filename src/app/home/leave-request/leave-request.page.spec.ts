import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaveRequestPage } from './leave-request.page';

describe('LeaveRequestPage', () => {
  let component: LeaveRequestPage;
  let fixture: ComponentFixture<LeaveRequestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

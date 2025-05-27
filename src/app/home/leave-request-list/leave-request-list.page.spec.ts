import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaveRequestListPage } from './leave-request-list.page';

describe('LeaveRequestListPage', () => {
  let component: LeaveRequestListPage;
  let fixture: ComponentFixture<LeaveRequestListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveRequestListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

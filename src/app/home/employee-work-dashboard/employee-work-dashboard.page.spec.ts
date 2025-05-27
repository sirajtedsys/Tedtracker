import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeWorkDashboardPage } from './employee-work-dashboard.page';

describe('EmployeeWorkDashboardPage', () => {
  let component: EmployeeWorkDashboardPage;
  let fixture: ComponentFixture<EmployeeWorkDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeWorkDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

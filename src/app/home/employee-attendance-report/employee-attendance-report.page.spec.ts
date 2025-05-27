import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeAttendanceReportPage } from './employee-attendance-report.page';

describe('EmployeeAttendanceReportPage', () => {
  let component: EmployeeAttendanceReportPage;
  let fixture: ComponentFixture<EmployeeAttendanceReportPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAttendanceReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

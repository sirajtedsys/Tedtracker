import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttendenceReportPage } from './attendence-report.page';

describe('AttendenceReportPage', () => {
  let component: AttendenceReportPage;
  let fixture: ComponentFixture<AttendenceReportPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendenceReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

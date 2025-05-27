import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DailyWorkReportPage } from './daily-work-report.page';

describe('DailyWorkReportPage', () => {
  let component: DailyWorkReportPage;
  let fixture: ComponentFixture<DailyWorkReportPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyWorkReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

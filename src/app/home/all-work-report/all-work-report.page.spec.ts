import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllWorkReportPage } from './all-work-report.page';

describe('AllWorkReportPage', () => {
  let component: AllWorkReportPage;
  let fixture: ComponentFixture<AllWorkReportPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AllWorkReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

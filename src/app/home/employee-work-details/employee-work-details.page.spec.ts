import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeWorkDetailsPage } from './employee-work-details.page';

describe('EmployeeWorkDetailsPage', () => {
  let component: EmployeeWorkDetailsPage;
  let fixture: ComponentFixture<EmployeeWorkDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeWorkDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

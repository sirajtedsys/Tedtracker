import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeTaskListPage } from './employee-task-list.page';

describe('EmployeeTaskListPage', () => {
  let component: EmployeeTaskListPage;
  let fixture: ComponentFixture<EmployeeTaskListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeTaskListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectClientListPage } from './project-client-list.page';

describe('ProjectClientListPage', () => {
  let component: ProjectClientListPage;
  let fixture: ComponentFixture<ProjectClientListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectClientListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CallListPage } from './call-list.page';

describe('CallListPage', () => {
  let component: CallListPage;
  let fixture: ComponentFixture<CallListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CallListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

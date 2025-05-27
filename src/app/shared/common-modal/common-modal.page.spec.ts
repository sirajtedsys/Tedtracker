import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModalPage } from './common-modal.page';

describe('CommonModalPage', () => {
  let component: CommonModalPage;
  let fixture: ComponentFixture<CommonModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

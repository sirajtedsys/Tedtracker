import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCallPage } from './add-call.page';

describe('AddCallPage', () => {
  let component: AddCallPage;
  let fixture: ComponentFixture<AddCallPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCallPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

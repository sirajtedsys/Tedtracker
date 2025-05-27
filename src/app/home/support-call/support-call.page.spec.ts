import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupportCallPage } from './support-call.page';

describe('SupportCallPage', () => {
  let component: SupportCallPage;
  let fixture: ComponentFixture<SupportCallPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportCallPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

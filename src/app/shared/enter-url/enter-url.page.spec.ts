import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnterUrlPage } from './enter-url.page';

describe('EnterUrlPage', () => {
  let component: EnterUrlPage;
  let fixture: ComponentFixture<EnterUrlPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterUrlPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

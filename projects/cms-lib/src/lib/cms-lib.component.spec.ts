import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CMSLibComponent } from './cms-lib.component';

describe('CMSLibComponent', () => {
  let component: CMSLibComponent;
  let fixture: ComponentFixture<CMSLibComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CMSLibComponent]
    });
    fixture = TestBed.createComponent(CMSLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

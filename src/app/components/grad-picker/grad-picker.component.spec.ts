import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradPickerComponent } from './grad-picker.component';

describe('GradPickerComponent', () => {
  let component: GradPickerComponent;
  let fixture: ComponentFixture<GradPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradPickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

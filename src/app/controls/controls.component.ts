import {AfterViewInit, Component, EventEmitter, inject, Output} from '@angular/core';
import {FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {GradPickerComponent} from "../components/grad-picker/grad-picker.component";


@Component({
  selector: 'app-controls',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.sass'
})
export class ControlsComponent {
  @Output() onChange = new EventEmitter();
  readonly dialog = inject(MatDialog);
  formGroup = new FormGroup({
    growth: new FormControl(),
    items: new FormControl(),
    stops: new FormArray([]),
    opacityStops: new FormArray([]),
    palette: new FormArray([]),
    drawBBox: new FormControl(),
    drawCenter: new FormControl(),
  })

  constructor() {
    this.formGroup.valueChanges.subscribe(value => {
      console.log(value);
      this.onChange.emit(value);
    });
  }


  openGraphicsPicker() {
    let dialogRef = this.dialog.open(GradPickerComponent, {});
  }
}

const DEFAULT_CONFIG = {

}

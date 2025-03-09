import {AfterViewInit, Component, ElementRef, Inject, inject, ViewChild} from '@angular/core';
import Grapick from 'grapick';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {findIndex} from "lodash";
import {alpha, toObject} from "@wojtekmaj/color-utils";

@Component({
  selector: 'app-grad-picker',
  standalone: true,
  imports: [
    MatButton, FormsModule, ReactiveFormsModule
  ],
  templateUrl: './grad-picker.component.html',
  styleUrl: './grad-picker.component.sass'
})
export class GradPickerComponent implements AfterViewInit {
  @ViewChild('gp') gp: ElementRef;
  readonly dialogRef = inject(MatDialogRef<GradPickerComponent>);
  colorMap;
  grapick: Grapick;
  currentOpacity = 1.0;
  showOpacity = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data)
  }

  ngAfterViewInit() {
    this.grapick = new Grapick({
      el: this.gp.nativeElement,
    });
    this.data.colorMap.forEach((stop, index) => {
      this.grapick.addHandler((stop.position * 100), alpha(stop.color, stop.opacity))
    })
    setTimeout(() => {
      const handler = this.grapick.getSelected()
      if (handler) {
        this.currentOpacity = toObject(handler.color).a;
        this.showOpacity = true;
      }
    }, 0)

    this.grapick.on('handler:select', (gradient: any) => {
      this.currentOpacity = toObject(gradient.color).a;

      console.log(gradient)
    })

    this.grapick.on('handler:add', (gradient: any) => {
      this.currentOpacity = toObject(gradient.color).a;
    })

    this.grapick.on('handler:remove', (gradient: any) => {
      const handler = this.grapick.getSelected()
      if (handler) {
        this.currentOpacity = toObject(handler.color).a;
        this.showOpacity = true;
      } else {
        this.showOpacity = false;
      }
    })
  }

  onOpacityChange() {
    const handler = this.grapick.getSelected()
    handler.setColor(alpha(handler.color, this.currentOpacity))

  };

  apply() {
    this.dialogRef.close(this.grapick.handlers.map((handler: any) => {
      return {
        ...handler,
        opacity: toObject(handler.color).a
      }
    }));
  }

  cancel() {
    this.dialogRef.close();
  }


}

import { NgModule } from '@angular/core';
// import { MAT_DATE_FORMATS } from '@angular/material/core';
// import { MatOptionModule, MatNativeDateModule, MatRippleModule,  } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatTableModule } from '@angular/material/table';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatSelectModule } from '@angular/material/select';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
// import { MomentDateModule } from '@angular/material-moment-adapter';


/**
 * Custom date parse and display
 */
export const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@NgModule({
  exports: [
    // MatOptionModule,
    // MatNativeDateModule,
    // MatRippleModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    // MatTableModule,
    // MatPaginatorModule,
    // MatProgressSpinnerModule,
    // MatProgressBarModule,
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule,
    // MatSelectModule,
    // MatCheckboxModule,
    // MatDatepickerModule,
    MatSidenavModule,
    // MatSlideToggleModule,
    MatListModule,
    MatToolbarModule,
    // MomentDateModule
  ],
  providers: [
    // { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ],
})
export class MaterialModule {}

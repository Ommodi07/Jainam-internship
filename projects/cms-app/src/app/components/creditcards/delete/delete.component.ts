import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil, Subject } from 'rxjs';
import { CreditcardsService } from 'projects/cms-lib/src/services/creditcards.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-delete',
  template: '',
})
export class DeleteComponent {
  creditCardId!: number;
  private destroy$ = new Subject<void>();

  constructor(
    private router: ActivatedRoute,
    private route: Router,
    private snackBar: MatSnackBar,
    private creditcardsService: CreditcardsService,
    private dialog: MatDialog
  ) {
    this.creditCardId = parseInt(this.router.snapshot.paramMap.get('id') || '', 10);
    this.openConfirmDialog();
  }

  openConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this credit card?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteCreditCard();
      } else {
        this.route.navigate(['/creditcards']);
      }
    });
  }

  deleteCreditCard() {
    this.creditcardsService.deleteCreditCard(this.creditCardId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.snackBar.open('Credit Card Deleted Successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
        this.route.navigate(['/creditcards']);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

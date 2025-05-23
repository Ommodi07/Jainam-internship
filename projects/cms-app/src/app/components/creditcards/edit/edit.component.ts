import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CreditCard } from 'projects/cms-lib/src/models/credit-card';
import { CreditcardsService } from 'projects/cms-lib/src/services/creditcards.service';

@Component({
  selector: 'app-credit-card-form',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {

  creditCardForm!: FormGroup;
  isEditMode: boolean = false;
  private destroy$ = new Subject<void>();
  private subscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private creditCardService: CreditcardsService
  ) {
    this.creditCardForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern('^[a-zA-Z ]+$')]],
      description: ['', Validators.required],
      bankName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      maxCredit: ['', [Validators.required, Validators.pattern('^\\d*\\.?\\d+$')]],
      interestRate: ['', [Validators.required, Validators.pattern('^\\d*\\.?\\d+$')]],
      active: [true, Validators.required],
      recommendedScore: ['100-500', Validators.required],
      annualFee: ['', [Validators.required, Validators.pattern('^\\d*\\.?\\d+$')]],
      termsAndConditions: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get("id");

    if (idParam && !isNaN(+idParam)) {
      this.isEditMode = true;
      const id = parseInt(idParam);

      this.creditCardService.getCreditCardById(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          this.creditCardForm.patchValue(data);
          console.log(data);
        });


    } else {
      this.isEditMode = false;
      const now = new Date().toISOString();
      this.creditCardForm.patchValue({
        id: Date.now().toString()
      });
    }
  }

  onSubmit(): void {
    if (this.creditCardForm.invalid) return;

    const formData: CreditCard = {
      ...this.creditCardForm.value
    };
    if (this.isEditMode) {
      this.creditCardService.updateCreditCard(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.snackBar.open('Credit Card Updated successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
        this.router.navigate(['creditcards']);
        });
    } else {
      console.log(formData);
      this.subscription = this.creditCardService.createCreditCard(formData)
        .subscribe(() => {
          this.snackBar.open('Credit Card Added successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
          this.router.navigate(['creditcards']);
        });
    }
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.subscription) this.subscription.unsubscribe();
  }

}

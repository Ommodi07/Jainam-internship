import { Component } from '@angular/core';
import { CreditCard } from 'src/app/models/credit-card';
import { CreditcardsService } from 'src/app/services/creditcards.service';

@Component({
  selector: 'app-searchcard',
  templateUrl: './searchcard.component.html',
  styleUrls: ['./searchcard.component.scss']
})
export class SearchcardComponent {
  searchId : boolean = false;
  msg : string = 'search by ID';
  searchType: 'id' | 'name' = 'id';
  searchTerm: string = '';
  searchResult: CreditCard[] = [];
  errorMessage: string = '';

  constructor(private creditCardService: CreditcardsService) {}
  onSearchTypeChange() {
    this.msg = this.searchType === 'id' ? 'Search by ID' : 'Search by Name';
  }

  searchCard() {
    this.errorMessage = '';
    this.searchResult = [];

    if (this.searchType === 'id') {
      this.msg = 'Search by ID';
      const id = Number(this.searchTerm);
      if (isNaN(id)) {
        this.errorMessage = 'Please enter a valid numeric ID.';
        return;
      }

      this.creditCardService.getCreditCardById(id).subscribe({
        next: (card) => this.searchResult = [card],
        error: () => this.errorMessage = 'No card found with this ID.'
      });

    } else if (this.searchType === 'name') {
      this.msg = 'Search by Name';
      this.creditCardService.searchCreditCardByName(this.searchTerm).subscribe({
        next: (cards) => this.searchResult = cards,
        error: () => this.errorMessage = 'Error fetching cards by name.'
      });
    }
  }
}

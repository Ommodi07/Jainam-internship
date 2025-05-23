import { Component } from '@angular/core';
import { CreditCard } from 'projects/cms-lib/src/models/credit-card';
import { CreditcardsService } from 'projects/cms-lib/src/services/creditcards.service';

@Component({
  selector: 'app-searchcard',
  templateUrl: './searchcard.component.html',
  styleUrls: ['./searchcard.component.scss']
})
export class SearchcardComponent {
  searchId: boolean = false;
  msg: string = 'Search by ID';
  searchType: 'id' | 'name' = 'id';
  searchTerm: string = '';
  searchResult: CreditCard[] = [];
  errorMessage: string = '';

  temp !: CreditCard;

  constructor(private creditCardService: CreditcardsService) { }
  onSearchTypeChange() {
    this.msg = this.searchType === 'id' ? 'Search by ID' : 'Search by Name';
  }

  searchCard() {
    this.errorMessage = '';
    this.searchResult = [];
    if (this.searchType === 'id') {
      this.msg = 'Search by ID';
      const id = Number(this.searchTerm);
      if (isNaN(id) || id == 0) {
        this.errorMessage = 'Please enter a valid numeric ID.';
        return;
      }

      this.creditCardService.getCreditCardById(id).subscribe({
        next: (card) => this.searchResult = [card],
        error: () => this.errorMessage = 'No card found with this ID.'
      });

    } else if (this.searchType === 'name') {
      this.msg = 'Search by Name';
      if (this.searchTerm == '') {
        this.errorMessage = 'Please insert a valid name to search.'
        return;
      }

      this.creditCardService.searchCreditCardByName(this.searchTerm).subscribe({
        next: (cards) => {
          if (cards.length === 0) {
            this.errorMessage = 'No card found with this name.';
          } else {
            this.searchResult = cards;
          }
        },
        error: () => this.errorMessage = 'Error fetching cards by name.'
      });

    }
  }
}

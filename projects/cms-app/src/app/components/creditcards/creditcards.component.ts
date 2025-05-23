import { Component, ViewChild } from '@angular/core';
import { CreditCard } from 'projects/cms-lib/src/models/credit-card';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CreditcardsService } from 'projects/cms-lib/src/services/creditcards.service';

@Component({
  selector: 'app-creditcards',
  templateUrl: './creditcards.component.html',
  styleUrls: ['./creditcards.component.scss']
})
export class CreditcardsComponent {

  creditcards: CreditCard[] = [];

  creditCardMaximumAmount: number = 0;
  creditCardMaximumInterest: number = 0;
  TotalCards: number = 0;
  AnnualFeeFilter: number = 0;

  constructor(private creditCardsService: CreditcardsService) {
    this.creditCardsService.getCreditCards().subscribe((data:CreditCard[]) => {
      this.creditcards = data;
      console.log(this.creditcards);
      this.dataSource = new MatTableDataSource(this.creditcards);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.calculateMetrics();

    })
  }

  dataSource = new MatTableDataSource(this.creditcards);

  displayColumns = ["select", "id", "name", "description", "bankName", "maxCredit", "interestRate", "active", "recommendedScore", "actions"];

  selection = new SelectionModel(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selectHandler(row: CreditCard){
    this.selection.toggle(row as never);
  }

  calculateMetrics(){
    this.creditCardMaximumAmount = this.creditcards.filter(card => card.maxCredit < 3000).length;
    this.creditCardMaximumInterest = this.creditcards.filter(card => card.interestRate < 7).length;
    this.TotalCards = this.creditcards.length;
    this.AnnualFeeFilter = this.creditcards.filter(card => card.annualFee > 500).length;
  }
}

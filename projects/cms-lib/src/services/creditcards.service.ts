import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreditCard } from '../models/credit-card';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreditcardsService {

  private apiUrl = "http://127.0.0.1:8000/cards";

  constructor(private httpClient: HttpClient) { }
  creditCardJson !: string;
  createCreditCard(creditCard: CreditCard): Observable<CreditCard> {
    return this.httpClient.post<CreditCard>(this.apiUrl, creditCard);
  }

  getCreditCards(): Observable<CreditCard[]> {
    return this.httpClient.get<CreditCard[]>(this.apiUrl);
  }

  getCreditCardById(id: Number): Observable<CreditCard> {
    return this.httpClient.get<CreditCard>(`${this.apiUrl}/${id}`);
  }

  updateCreditCard(creditCard: CreditCard): Observable<CreditCard> {
    return this.httpClient.put<CreditCard>(`${this.apiUrl}/${creditCard.id}`, creditCard);
  }

  deleteCreditCard(id: Number): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/${id}`);
  }

  searchCreditCardByName(name: string): Observable<CreditCard[]> {
    const url = `${this.apiUrl}/search/name=${encodeURIComponent(name)}`;
    return this.httpClient.get<CreditCard[]>(url);
  }
}
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditcardsComponent } from './creditcards.component';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';
import { DeleteComponent } from './delete/delete.component';
import { SearchcardComponent } from './searchcard/searchcard.component';

const routes: Routes = [
  { path: '', component : CreditcardsComponent},
  { path: 'add', component: EditComponent},
  { path: 'view/:id', component: ViewComponent},
  { path: 'edit/:id', component: EditComponent},
  { path: 'delete/:id', component: DeleteComponent},
  { path: 'search', component: SearchcardComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditcardsRoutingModule { }

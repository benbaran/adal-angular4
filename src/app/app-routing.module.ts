import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AdalGuard } from './adal/adal.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AdalGuard] },
  { path: '**', component: NotFoundComponent, canActivate: [AdalGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

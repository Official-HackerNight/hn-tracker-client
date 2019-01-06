import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../routes/dashboard/dashboard.component';
import { ExpenseComponent } from '../routes/expense/expense.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { CallbackComponent } from './callback/callback.component';

const routes: Routes = [
  { path: '', component: DashboardComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'callback', component: CallbackComponent},
  {
    path: 'expense',
    component: ExpenseComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: 'expense', loadChildren: '../routes/expense/expense.module#ExpenseModule' },
      // { path: '**', pathMatch: 'full', redirectTo: '/dashboard', canActivate: [AuthGuardService] }
    ]
  }
  // { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

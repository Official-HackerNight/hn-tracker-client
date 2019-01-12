import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../routes/dashboard/dashboard.component';
import { ExpenseComponent } from '../routes/expense/expense.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { CallbackComponent } from './callback/callback.component';
import { ProfileComponent } from '../routes/profile/profile.component';
import { CalendarComponent } from '../routes/calendar/calendar.component';

const routes: Routes = [
  { path: '', component: DashboardComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'callback', component: CallbackComponent},
  { path: 'profile', component: ProfileComponent},
  {
    path: 'expense',
    component: ExpenseComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: 'expense', loadChildren: '../routes/expense/expense.module#ExpenseModule' },
      // { path: '**', pathMatch: 'full', redirectTo: '/dashboard', canActivate: [AuthGuardService] }
    ]
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: 'calendar', loadChildren: '../routes/calendar/calendar.module#CalendarModule' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

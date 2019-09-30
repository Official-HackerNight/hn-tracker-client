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
      { path: 'expense', loadChildren: () => import('../routes/expense/expense.module').then(m => m.ExpenseModule) },
      // { path: '**', pathMatch: 'full', redirectTo: '/dashboard', canActivate: [AuthGuardService] }
    ]
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: 'calendar', loadChildren: () => import('../routes/calendar/calendar.module').then(m => m.CalendarModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

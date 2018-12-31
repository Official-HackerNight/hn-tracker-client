import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExpenseComponent } from './expense.component';
import { LoginComponent } from '../login/login.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'expense', component: ExpenseComponent },
];


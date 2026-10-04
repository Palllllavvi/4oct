import { Routes } from '@angular/router';
import { EquipmentQuoteComponent } from './pages/equipment-quote/equipment-quote.component';
import { IncomeQuoteComponent } from './pages/income-quote/income-quote.component';
import { authGuard } from '../../core/guards/auth.guard';

export const RISK_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'equipment-quote',
        pathMatch: 'full'
      },
      {
        path: 'equipment-quote',
        component: EquipmentQuoteComponent,
        title: 'Equipment Quote | FreelanceShield'
      },
      {
        path: 'income-quote',
        component: IncomeQuoteComponent,
        title: 'Income Quote | FreelanceShield'
      }
    ]
  }
];

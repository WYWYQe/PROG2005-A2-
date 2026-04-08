// wang_Yueqi_24832818

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import page components
import { HomeComponent } from './pages/home/home';
import { InventoryManageComponent } from './pages/inventory-manage/inventory-manage';
import { SearchComponent } from './pages/search/search';
import { PrivacySecurityComponent } from './pages/privacy-security/privacy-security';
import { HelpComponent } from './pages/help/help';

// Route configuration
const routes: Routes = [
  // Redirect to home page by default
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Page routes
  { path: 'home', component: HomeComponent },
  { path: 'inventory', component: InventoryManageComponent },
  { path: 'search', component: SearchComponent },
  { path: 'privacy-security', component: PrivacySecurityComponent },
  { path: 'help', component: HelpComponent },

  // Redirect invalid paths to home page
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  // Register routes
  imports: [RouterModule.forRoot(routes)],
  // Export routing module
  exports: [RouterModule]
})
export class AppRoutingModule { }
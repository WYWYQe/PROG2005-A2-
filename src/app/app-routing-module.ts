import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { InventoryManageComponent } from './pages/inventory-manage/inventory-manage';
import { SearchComponent } from './pages/search/search';
import { PrivacySecurityComponent } from './pages/privacy-security/privacy-security';
import { HelpComponent } from './pages/help/help';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'inventory', component: InventoryManageComponent },
  { path: 'search', component: SearchComponent },
  { path: 'privacy-security', component: PrivacySecurityComponent },
  { path: 'help', component: HelpComponent },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

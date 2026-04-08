// wang_Yueqi_24832818

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app';
import { AppRoutingModule } from './app-routing-module';

// Import page components
import { HomeComponent } from './pages/home/home';
import { InventoryManageComponent } from './pages/inventory-manage/inventory-manage';
import { SearchComponent } from './pages/search/search';
import { PrivacySecurityComponent } from './pages/privacy-security/privacy-security';
import { HelpComponent } from './pages/help/help';

@NgModule({
  // Declare components used in the application
  declarations: [
    AppComponent,
    HomeComponent,
    InventoryManageComponent,
    SearchComponent,
    PrivacySecurityComponent,
    HelpComponent
  ],
  // Import required Angular modules
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule
  ],
  // Register services if needed
  providers: [],
  // Set the root component
  bootstrap: [AppComponent]
})
export class AppModule { }
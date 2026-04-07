import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app';
import { AppRoutingModule } from './app-routing-module';

import { HomeComponent } from './pages/home/home';
import { InventoryManageComponent } from './pages/inventory-manage/inventory-manage';
import { SearchComponent } from './pages/search/search';
import { PrivacySecurityComponent } from './pages/privacy-security/privacy-security';
import { HelpComponent } from './pages/help/help';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    InventoryManageComponent,
    SearchComponent,
    PrivacySecurityComponent,
    HelpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
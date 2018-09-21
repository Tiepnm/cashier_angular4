import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {TransactionComponent} from './transaction/transaction.component';
import {ProductComponent} from './product/product.component';
import {RouterModule, Routes} from "@angular/router";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {HttpTokenInterceptor} from "./core/intercepter/http.token.interceptor";


const appRoutes: Routes = [

  {
    path: 'transaction/:tx_id',
    component: ProductComponent

  },
  {
    path: '',
    component: ProductComponent

  },
  {path: 'transaction', component: TransactionComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    TransactionComponent,
    ProductComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      // {enableTracing: true} // <-- debugging purposes only
    ),
    BrowserModule, FormsModule, HttpClientModule,
    NgbModule.forRoot()
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {
}

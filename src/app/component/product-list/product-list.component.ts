import {Component, OnDestroy, OnInit} from '@angular/core';

import {Product} from "../../model/product";
import {EMPTY, Observable, Subject} from "rxjs";
import {catchError, delay, publishReplay, refCount, retry, takeUntil} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {NgxSpinnerService} from "ngx-spinner";
import {ShoppingService} from "../../shopping.service";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Array<Product>;
  shoppingSvcConnectionFailure = false;
  private unsubscribe$ = new Subject<void>();
  isLoading: boolean;
  private interval: any;

  constructor(
    private shoppingService: ShoppingService,
    private spinnerService: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.shoppingService.getStatus()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        ()=>{},
        (error: HttpErrorResponse) => {
        console.error("Unable to connect to shopping service.");
        this.shoppingSvcConnectionFailure = true;
      });

    this.getProductsFromShoppingSvc();
  }

  private name: Observable<string>;

  observableTest() {
    this.name = new Observable(observer => {
      observer.next("Hello from observer.next()");
      observer.complete();
    });

    let subscribe = this.name.subscribe(
      data => {alert(data);},
      // error => {errorHandler(error)},
      // ()=> {final()}
    );
    subscribe.unsubscribe();

  }

  share(name) {
    window.alert('The product \''+name+'\' has been shared!');
  }

  onNotify(name) {
    window.alert('You will be notified when the product \''+name+'\' goes on sale');
  }

  getProductsFromShoppingSvc() {
    this.isLoading = true;
    this.spinnerService.show();
    this.shoppingService.getProducts()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        response => {
          this.isLoading = false;
          this.products = this.shoppingService.products = response;
        }, ()=> {
          this.isLoading = false;
          console.log("Error occurring during error shoppingService.getProducts() call.");
        });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    clearInterval(this.interval);
  }

  wait = new Promise<string>((res)=> {
    setTimeout(function() {
      res('wait for it...');
    },1000)
  })

  dairy = new Promise<string>((res)=> {
    setTimeout(function() {
      res('dairy');
    },3000)
  })
}




/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/

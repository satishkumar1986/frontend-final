import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/shared/classes/order';
import { OrderService } from 'src/app/shared/services/order.service';
import { ProductsService } from 'src/app/shared/services/products.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {
  orderDetails: Order;

  constructor(private _orderService: OrderService, public productsService: ProductsService) { }

  ngOnInit(): void {
    debugger;
    this.orderDetails = this._orderService.getOrderItems();
  }

}

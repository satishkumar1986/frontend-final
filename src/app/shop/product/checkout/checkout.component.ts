import { Component, OnInit } from '@angular/core';
import { Global } from 'src/app/shared/services/global';
import { Observable } from 'rxjs';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CartService } from 'src/app/shared/services/cart.service';
import { ProductsService } from 'src/app/shared/services/products.service';
import { DataService } from 'src/app/shared/services/data.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { ToastrService } from 'ngx-toastr';
import { CartItem } from 'src/app/shared/classes/cart-item';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  checkoutForm: FormGroup;
  checkOutItems: CartItem[] = [];
  orderDetails: any[] = [];
  amount: number;
  totalAmount: number;
  shippingAmount: number = 40;
  handler: any;

  constructor(public productsService: ProductsService, private _dataService: DataService, private _fb: FormBuilder, private _toastr: ToastrService,
    private cartService: CartService, private orderService: OrderService) { }

  createRegForm() {
    this.checkoutForm = this._fb.group({
      firstname: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      lastname: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.maxLength(50)]],
      country: ['', Validators.required],
      town: ['', Validators.required],
      state: ['', Validators.required],
      postalcode: ['', Validators.required],
      amount: [0]
    });
  }

  ngOnInit(): void {
    this.loadStripe();
    this.createRegForm();
    this.cartService.getItems().subscribe(res => {
      this.checkOutItems = res;
    });

    this.getTotal().subscribe(res => {
      this.amount = res;
      this.totalAmount = res + this.shippingAmount;
    });

  }

  getTotal(): Observable<number> {
    return this.cartService.getTotalAmount();
  }

  onSubmit(formData: any) {
    if (this.checkoutForm.invalid) {
      return;
    }

    let allItems = [];
    for (let i = 0; i < this.checkOutItems.length; i++) {
      allItems[i] = {
        ProductId: this.checkOutItems[i].product.id,
        Quantity: this.checkOutItems[i].quantity,
        Size: '',
        Color: '',
        Price: this.checkOutItems[i].product.price,
        Discount: this.checkOutItems[i].product.discount
      }
    }

    let obj = {
      id: 0,
      firstname: formData.value.firstname,
      lastname: formData.value.lastname,
      phone: formData.value.phone,
      email: formData.value.email,
      address: formData.value.address,
      country: formData.value.country,
      town: formData.value.town,
      state: formData.value.state,
      postalcode: formData.value.postalcode,
      amount: this.amount,
      shippingAmount: 40,
      paymentTypeId: 1,
      items: allItems,
      payment: null
    }

    // this._dataService.post(Global.BASE_API_PATH + "PaymentMaster/Save/", obj).subscribe(objdata => {
    //   if (objdata.isSuccess) {
    //     this._toastr.success("Payment done successfully!", "Payment Master");
    //   } else {
    //     this._toastr.error(objdata.errors[0], "Payment Master");
    //   }
    // });


    let saveData = (obj) => this._dataService.post(Global.BASE_API_PATH + "PaymentMaster/Save/", obj).subscribe(res => {
      if (res.isSuccess) {
        this._toastr.success("Payment done successfully!", "Payment Master");
        debugger;
        this.orderService.createOrder(this.checkOutItems, obj, res.data.orderId, res.data.paymentDate, res.data.expecteddate, this.totalAmount);
        this.cartService.clearAllItemFromCart();
        this.checkoutForm.reset();
      } else {
        this._toastr.error(res.errors[0], "Payment Master");
      }
    });

    // For Payment start here
    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_IMfLDyTjBvG9AK7MNtHntboG00XQFgMOiE', // need to change your Publishable key
      locale: 'auto',
      token: function (token: any) {
        let objPayment = { tokenId: token.id, amount: obj.amount + obj.shippingAmount, description: "Shopping with sahosoft mall" };
        console.log(token);
        obj.payment = objPayment;
        saveData(obj);

      }
    });

    handler.open({
      name: 'Sahosoft Mall',
      description: 'ecommerce',
      country: 'INDIA',
      currency: 'INR',
      amount: this.totalAmount * 100
    });
    // For Payment start end
  }

  loadStripe() {
    if (!window.document.getElementById('stripe-script')) {
      var s = window.document.createElement("script");
      s.id = "stripe-script";
      s.type = "text/javascript";
      s.src = "https://checkout.stripe.com/checkout.js";
      s.onload = () => {
        this.handler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_IMfLDyTjBvG9AK7MNtHntboG00XQFgMOiE', // need to change your Publishable key
          locale: 'auto',
          token: function () {

          }
        });
      }
      window.document.body.appendChild(s);
    }
  }


}

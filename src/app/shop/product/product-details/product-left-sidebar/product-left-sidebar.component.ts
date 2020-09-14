import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/classes/products';
import { ProductsService } from 'src/app/shared/services/products.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { WishlistService } from 'src/app/shared/services/wishlist.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-product-left-sidebar',
  templateUrl: './product-left-sidebar.component.html',
  styleUrls: ['./product-left-sidebar.component.scss']
})
export class ProductLeftSidebarComponent implements OnInit {

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
  };

  slideNavConfig = {
    vertical: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: '.product-slick',
    arrows: false,
    dots: false,
    focusOnSelect: true
  }

  product: Product = {};
  products: Product[] = [];
  counter: number = 1;
  selectedSize: any = '';

  constructor(public productsService: ProductsService, private cartService: CartService, private wishlistService: WishlistService,
    private router: Router, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      let id = params["id"];
      this.productsService.getProduct(parseInt(id)).subscribe(res => {
        this.product = res;
      })
    });
  }

  ngOnInit(): void {
    this.productsService.getProducts().subscribe(res => this.products = res);
  }

  increment() {
    this.counter += 1;
  }
  decrement() {
    if (this.counter > 1) {
      this.counter -= 1;
    }
  }
  changeSizeVarient(variant: any) {
    this.selectedSize = variant;
  }

  mobileSidebar() {
    $(".collection-filter").css("left", "-15px");
  }

  addToCart(product: Product, quantity: number) {
    if (quantity == 0) {
      return false;
    }

    this.cartService.addToCart(product, quantity);
  }

  addToWishlist(product: Product) {
    this.wishlistService.addToWishlist(product);
  }

  buyNow(product: Product, quantity: number) {
    if (quantity > 0) {
      this.cartService.addToCart(product, quantity);
      this.router.navigate(['/home/checkout']);
    }
  }

}

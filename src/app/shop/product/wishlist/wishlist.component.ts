import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/classes/products';
import { WishlistService } from 'src/app/shared/services/wishlist.service';
import { ProductsService } from 'src/app/shared/services/products.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  wishlistItems: Product[] = [];

  constructor(private wishlistService: WishlistService, public productsService: ProductsService,
    private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    this.wishlistService.getProducts().subscribe(res => this.wishlistItems = res);
  }
  addToCart(product: Product, quantity: number = 1) {
    this.cartService.addToCart(product, quantity);
    this.wishlistService.removeFromWistlist(product);
  }
  removeItem(product: Product) {
    this.wishlistService.removeFromWistlist(product);
  }

}

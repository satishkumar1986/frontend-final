import { Component, OnInit, Input } from '@angular/core';
import { CartService } from 'src/app/shared/services/cart.service';
import { WishlistService } from 'src/app/shared/services/wishlist.service';
import { ProductsService } from 'src/app/shared/services/products.service';
import { Product } from 'src/app/shared/classes/products';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @Input('productItem') product: any;
  variantImage: any = '';
  selectedImage: any = '';

  constructor(private _cartService: CartService, private _wishlistService: WishlistService, 
    private _productsService: ProductsService) { }

  ngOnInit(): void {
  }

  changeVariantImage(image: any) {
    this.variantImage = image;
    this.selectedImage = image;
  }

  addToCart(product: Product, quantity: number = 1) {
    this._cartService.addToCart(product, quantity);
  }

  addToWishList(product: Product) {
    this._wishlistService.addToWishlist(product);
  }

  addToCompare(product: Product) {
    this._productsService.addToCompare(product);
  }

}

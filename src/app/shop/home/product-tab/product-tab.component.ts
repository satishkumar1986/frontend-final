import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/shared/classes/products';
import * as $ from 'jquery';

@Component({
  selector: 'app-product-tab',
  templateUrl: './product-tab.component.html',
  styleUrls: ['./product-tab.component.scss']
})
export class ProductTabComponent implements OnInit {
  @Input() products: Product[];

  constructor() { }

  ngOnInit(): void {
    $(".default").css("display", "block");
    $(".tabs li a").on('click', function (event) {
      event.preventDefault();

      $(this).parent().parent().find("li").removeClass("current"); // find all li of ul (parent of anchor tag and remove class)
      $(this).parent().addClass("current"); // add class in current li on which you have cliked

      let current_href = $(this).attr("href"); // get href attr value of current anchor tag
     // $("#"+current_href).css("display", "block");
      $("#"+current_href).show(); 

      $(this).parent().parent().parent().find(".tab-content").not("#"+current_href).hide(); // hide section which is not match with current href attr value
     // $(this).parent().parent().parent().find(".tab-content").not("#"+current_href).css("display","none");
    });
  }

}

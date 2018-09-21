import {Component} from '@angular/core';

import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Item} from "../../model/item_dto";
import {ProductService} from "../core/product.service";
import {TransactionService} from "../core/transaction.service";
import {Transaction} from "../../model/transaction";
import {Product} from "../../model/product";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {

  totalAmountDisplay = '0$';
  items: Item[] = [];
  map: Map<Number, Item[]> = new Map<Number, Item[]>();
  modalReference: any;
  itemId: string;
  itemName: string;
  itemPrice: number;
  itemQuantity: number = 1;
  itemSelected: Array<Item> = new Array<Item>();
  isProductScreen: boolean = true;
  constructor(private activatedRoute: ActivatedRoute, private modalService: NgbModal, private readonly productService: ProductService, private readonly transactionService: TransactionService) {
    this.prepareData();
  }

  prepareData(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      let txId = params['tx_id'];
      if (txId === undefined) {
        this.prepareDataForSell();
      } else {
        this.prepareDataForShowDetail(txId);
      }
    });


  }

  prepareDataForShowDetail(txId: string): void {
    this.isProductScreen = false;
    this.transactionService.findOne(txId).subscribe(data => {
      this.itemSelected = data.product;
      this.caculateTotalAmount();
    });
  }

  prepareDataForSell(): void {
    this.isProductScreen = true;
    this.totalAmountDisplay = '$0';
    this.items = [];
    this.productService.get().subscribe(data => {
      this.items = data;
      let numberOfRow: number = 1;
      if (this.items.length > 5) {
        numberOfRow = (Math.floor(this.items.length / 5)) + 1;
      }
      for (let i = 0; i < numberOfRow; i++) {
        this.map.set(i, this.items.slice(i * 5, i * 5 + 5));
      }
      console.log(this.items);
    });
  }

  getKeys(map) {
    return Array.from(map.keys());
  }

  getValues(key): Item[] {
    return this.map.get(key);
  }

  open(content, value: Item) {
    this.itemQuantity = 1;
    this.itemId = value._id;
    this.itemName = value.name;
    this.itemPrice = value.price;
    this.modalReference = this.modalService.open(content);
  }

  close() {

    let item: Item = new Item();
    item._id = this.itemId;
    item.name = this.itemName;
    item.quantity = this.itemQuantity;
    item.price = this.itemPrice * item.quantity;
    this.updatePriceAndQuantityWhenChooseItem(item);

    this.caculateTotalAmount();
    this.modalReference.close();
  }

  removeItem(item): void {
    const index: number = this.itemSelected.indexOf(item);
    if (index !== -1) {
      this.itemSelected.splice(index, 1);
    }

    this.caculateTotalAmount();

  }

  private caculateTotalAmount(): void {
    let amount: number = 0;
    for (let value of this.itemSelected) {
      amount += value.price;
    }
    this.totalAmountDisplay = '$' + amount;
  }

  private updatePriceAndQuantityWhenChooseItem(item): void {
    if (this.itemSelected.filter((item1: Item) => item1._id === item._id).length === 0) {
      this.itemSelected.push(item);
    }
    else {

      const currentQuantity: number = this.itemSelected.filter((item1: Item) => item1._id === item._id)[0].quantity;
      const currentPrice: number = this.itemSelected.filter((item1: Item) => item1._id === item._id)[0].price;
      this.itemSelected.filter((item1: Item) => item1._id === item._id)[0].quantity = parseFloat(currentQuantity + '') + parseFloat(item.quantity + '');
      this.itemSelected.filter((item1: Item) => item1._id === item._id)[0].price = parseFloat(currentPrice + '') + parseFloat(item.price + '');
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  private save(): void {
    let transaction: Transaction = new Transaction();
    transaction.name = "HIG_" + new Date().getTime();

    for (let item of this.itemSelected) {
      let product: Product = new Product();
      product.name = item.name;
      product.quantity = item.quantity;
      product.price = item.price;
      product.id = item._id;
      transaction.product.push(product);
    }

    this.transactionService.save(transaction).subscribe(data => {
      console.log(data);
    });
    this.reset();
  }

  private reset(): void {
    this.itemSelected = [];
    this.caculateTotalAmount();
  }

}

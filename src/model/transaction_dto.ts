import {Item} from "./item_dto";

export class Transaction {
  _id: string;
  name: string;
  product: Item[] = [];
  create_date: string;
  update_date: string;
  amount: number;
}

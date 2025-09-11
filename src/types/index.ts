
// Type para almuerzos 
export type LunchType = {
  id: string;
  title: string;
  imagen: string;
  price: number;
  tags: string[];
}

// Type para metodos de pago
export type PayMethod = {
  id: string;
  label: string;
  image: string;
}

// Type para estado de pedido
export type OrderState = {
  id: number;
  orderstate: string;
}

// Type para pedidos
export type OrderType = {
  id: string;
  towerNum: string;
  apto: number;
  customer: string;
  phoneNum: number;
  payMethod: PayMethod[];
  lunch: LunchType[];
  details: string;
  time: string;
  date: Date;
  orderState: OrderState[];
}
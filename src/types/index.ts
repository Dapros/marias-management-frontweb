
// Type para almuerzos 
export type LunchType = {
  id: string;
  title: string;
  imagen: string;
  price: number;
  tags: string[];
}

// Item incluido en pedido: almuerzo y cantidad seleccionada
export type OrderItem = LunchType & {
  quantity: number;
}

// Type para metodos de pago
export type PayMethod = {
  id: string;
  label: string;
  image: string;
}

// Type para estado de pedido
export type OrderState = 'pendiente' | 'pagado'

// Type para pedidos
export type OrderType = {
  id: string;
  towerNum: string;
  apto: number;
  customer?: string;
  phoneNum: number;
  payMethod: PayMethod;
  lunch: OrderItem[];
  details?: string;
  time?: string;
  date?: string | Date;
  orderState: OrderState;
  total?: number;
}
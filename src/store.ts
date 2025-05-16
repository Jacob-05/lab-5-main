type Product = {
  id: number;
  name: string;
  price: number;
};

type State = {
  products: Product[];
  cart: Product[];
};

type Action =
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: number };

type Listener = () => void;

class Store {
  private state: State;
  private listeners: Listener[] = [];

  constructor(initialState: State) {
    this.state = initialState;
  }

  getState() {
    return this.state;
  }

  dispatch(action: Action) {
    switch (action.type) {
      case 'ADD_TO_CART':
        this.state = {
          ...this.state,
          cart: [...this.state.cart, action.payload],
        };
        break;
      case 'REMOVE_FROM_CART':
        this.state = {
          ...this.state,
          cart: this.state.cart.filter((item) => item.id !== action.payload),
        };
        break;
    }

    this.listeners.forEach((listener) => listener());
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}

const initialState: State = {
  products: [
    { id: 1, name: 'Mouse inalámbrico', price: 25 },
    { id: 2, name: 'Auriculares Bluetooth', price: 40 },
    { id: 3, name: 'Teclado mecánico', price: 60 },
  ],
  cart: [],
};

export const store = new Store(initialState);

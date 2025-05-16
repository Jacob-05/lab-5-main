type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

type State = {
  products: Product[];
  cart: Product[];
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

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

  async fetchProducts() {
    this.dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      const products = await response.json();
      this.dispatch({ type: 'SET_PRODUCTS', payload: products });
    } catch (error) {
      this.dispatch({ type: 'SET_ERROR', payload: 'Error al cargar los productos' });
    } finally {
      this.dispatch({ type: 'SET_LOADING', payload: false });
    }
  }

  dispatch(action: Action) {
    switch (action.type) {
      case 'SET_PRODUCTS':
        this.state = {
          ...this.state,
          products: action.payload,
          error: null
        };
        break;
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
      case 'SET_LOADING':
        this.state = {
          ...this.state,
          loading: action.payload
        };
        break;
      case 'SET_ERROR':
        this.state = {
          ...this.state,
          error: action.payload
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
  products: [],
  cart: [],
  loading: false,
  error: null
};

export const store = new Store(initialState);

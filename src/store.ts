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
  lastFetch: number | null;
};

type Action =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LAST_FETCH'; payload: number };

type Listener = () => void;

class Store {
  private state: State;
  private listeners: Listener[] = [];
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos

  constructor(initialState: State) {
    this.state = initialState;
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    const savedProducts = localStorage.getItem('products');
    const lastFetch = localStorage.getItem('lastFetch');

    if (savedCart) {
      this.state.cart = JSON.parse(savedCart);
    }
    if (savedProducts) {
      this.state.products = JSON.parse(savedProducts);
    }
    if (lastFetch) {
      this.state.lastFetch = parseInt(lastFetch);
    }
  }

  private saveToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.state.cart));
    localStorage.setItem('products', JSON.stringify(this.state.products));
    if (this.state.lastFetch) {
      localStorage.setItem('lastFetch', this.state.lastFetch.toString());
    }
  }

  getState() {
    return this.state;
  }

  async fetchProducts() {
    if (this.state.products.length > 0) {
      this.dispatch({ type: 'SET_PRODUCTS', payload: this.state.products });
    }

    this.dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      const products = await response.json();
      this.dispatch({ type: 'SET_PRODUCTS', payload: products });
      this.dispatch({ type: 'SET_LAST_FETCH', payload: Date.now() });
      this.saveToLocalStorage();
    } catch (error) {
      this.dispatch({ type: 'SET_ERROR', payload: 'Error al cargar los productos' });
    } finally {
      this.dispatch({ type: 'SET_LOADING', payload: false });
    }
  }

  private shouldUpdateCart() {
    if (!this.state.lastFetch) return true;
    return Date.now() - this.state.lastFetch > this.CACHE_DURATION;
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
        this.saveToLocalStorage();
        break;
      case 'REMOVE_FROM_CART':
        this.state = {
          ...this.state,
          cart: this.state.cart.filter((item) => item.id !== action.payload),
        };
        this.saveToLocalStorage();
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
      case 'SET_LAST_FETCH':
        this.state = {
          ...this.state,
          lastFetch: action.payload
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
  error: null,
  lastFetch: null
};

export const store = new Store(initialState);

import { store } from '../store';

class ProductList extends HTMLElement {
  constructor() {
    super();
    store.subscribe(() => this.render());
  }

  connectedCallback() {
    store.fetchProducts();
    this.render();
  }

  render() {
    const state = store.getState();
    
    if (state.loading) {
      this.innerHTML = '<div class="loading">Cargando productos...</div>';
      return;
    }

    if (state.error) {
      this.innerHTML = `<div class="error">${state.error}</div>`;
      return;
    }

    this.innerHTML = `
      <section class="products-grid">
        <h2>Nuestros Productos</h2>
        <div class="products-container">
          ${state.products.map(product => `
            <div class="product-card">
              <img src="${product.image}" alt="${product.title}">
              <h3>${product.title}</h3>
              <p class="price">$${product.price}</p>
              <p class="rating">⭐ ${product.rating.rate} (${product.rating.count} reviews)</p>
              <button class="add-to-cart">Añadir al carrito</button>
            </div>
          `).join('')}
        </div>
      </section>
    `;

    this.querySelectorAll('.add-to-cart').forEach((button, index) => {
      button.addEventListener('click', () => {
        const product = state.products[index];
        store.dispatch({ type: 'ADD_TO_CART', payload: product });
      });
    });
  }
}

customElements.define('product-list', ProductList);
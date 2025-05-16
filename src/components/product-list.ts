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
    
    if (state.loading && state.products.length === 0) {
      this.innerHTML = '<div class="loading">Cargando productos...</div>';
      return;
    }

    if (state.error) {
      this.innerHTML = `<div class="error">${state.error}</div>`;
      return;
    }

    this.innerHTML = `
      <section class="products-grid">
        <div class="products-header">
          <h2>Lo más top!</h2>
          ${state.loading ? '<span class="updating-indicator">🔄 Actualizando...</span>' : ''}
        </div>
        <div class="products-container">
          ${state.products.map(product => `
            <div class="product-card">
              <img src="${product.image}" alt="${product.title}">
              <h3>${product.title}</h3>
              <p class="price">$${product.price}</p>
              <p class="rating">⭐ ${product.rating.rate} (${product.rating.count} reviews)</p>
              <button class="add-to-cart">Quiero añadirlo</button>
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
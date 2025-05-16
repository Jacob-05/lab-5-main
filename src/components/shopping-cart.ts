import { store } from '../store';

class ShoppingCart extends HTMLElement {
  constructor() {
    super();
    store.subscribe(() => this.render());
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const state = store.getState();
    const total = state.cart.reduce((sum, item) => sum + item.price, 0);

    this.innerHTML = `
      <section class="shopping-cart">
        <h2>Carrito de Compras</h2>
        ${state.cart.length === 0 
          ? '<p class="empty-cart">Tu carrito está vacío</p>'
          : `
            <div class="cart-items">
              ${state.cart.map(item => `
                <div class="cart-item">
                  <img src="${item.image}" alt="${item.title}">
                  <div class="item-details">
                    <h3>${item.title}</h3>
                    <p class="price">$${item.price}</p>
                  </div>
                  <button class="remove-item" data-id="${item.id}">❌</button>
                </div>
              `).join('')}
            </div>
            <div class="cart-summary">
              <p class="total">Total: $${total.toFixed(2)}</p>
              <button class="checkout-button">Proceder al pago</button>
            </div>
          `
        }
      </section>
    `;

    this.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', (e) => {
        const id = Number((e.target as HTMLElement).dataset.id);
        store.dispatch({ type: 'REMOVE_FROM_CART', payload: id });
      });
    });
  }
}

customElements.define('shopping-cart', ShoppingCart);

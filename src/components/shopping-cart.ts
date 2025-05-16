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
    const cart = store.getState().cart;
    this.innerHTML = `
      <section>
        <h3>🛒 Carrito (${cart.length})</h3>
        <ul>
          ${cart
            .map(
              (item: { name: any; price: any; }) => `
            <li>
              <h4>${item.name}</h4>
              <p>${item.price} USD</p>
            </li>
          `
            )
            .join('')}
        </ul>
      </section>
    `;
  }
}

customElements.define('shopping-cart', ShoppingCart);

class ProductList extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section>
        <h2>Productos</h2>
        <ul>
          <li data-id="1" data-name="Mouse Gamer" data-price="25">Mouse Gamer - $25 <button>Añadir</button></li>
          <li data-id="2" data-name="Audífonos" data-price="50">Audífonos - $50 <button>Añadir</button></li>
        </ul>
      </section>
    `;

    this.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const item = (e.target as HTMLElement).closest("li");
        const event = new CustomEvent("add-to-cart", {
          bubbles: true,
          detail: {
            id: item?.getAttribute("data-id"),
            name: item?.getAttribute("data-name"),
            price: Number(item?.getAttribute("data-price"))
          }
        });
        this.dispatchEvent(event);
      });
    });
  }
}
customElements.define('product-list', ProductList);
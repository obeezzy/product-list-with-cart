import { Cart } from "./cart.js";
import { Menu } from "./menu.js";
import { OrderSummary } from "./order-summary.js";

const cart = new Cart();
const menu = new Menu();

menu.element.addEventListener("add-to-cart", e => {
    cart.add(e.detail.key, e.detail.item);
});

menu.element.addEventListener("decrement-quantity", e => {
    cart.decrementQuantity(e.detail.key, e.detail.item);
});

menu.element.addEventListener("increment-quantity", e => {
    cart.incrementQuantity(e.detail.key, e.detail.item);
});

cart.element.addEventListener("quantity-change", e => {
    menu.setQuantity(e.detail.key, e.detail.quantity);
});

cart.element.addEventListener("confirm-order", e => {
    const orderSummary = new OrderSummary(e.detail.items);
    orderSummary.show();

    orderSummary.element.addEventListener("new-order", e => {
        cart.clear();
        orderSummary.hide();
    }, { once: true });
});

import { Price, Quantity } from "./util.js";

class Cart {
    constructor() {
        const confirmOrderButton = this.element.querySelector("#confirm-order-button");
        confirmOrderButton.onclick = e => {
            Ui.dispatchConfirmOrder(this.element);
        };
    }

    add(key, menuItem) {
        Ui.add(this.element, key, menuItem);
    }

    decrementQuantity(key, menuItem) {
        Ui.decrementQuantity(this.element, key, menuItem);
    }

    incrementQuantity(key, menuItem) {
        Ui.incrementQuantity(this.element, key, menuItem);
    }

    clear() {
        Ui.clear(this.element);
    }

    get element() {
        return document.querySelector("#cart");
    }
}

class Ui {
    static add(element, key, menuItem) {
        const menuItemTitle = menuItem.querySelector(".title").textContent;
        const menuItemPrice = new Price(menuItem.querySelector(".price").textContent).value;
        const menuItemThumbnail = menuItem.dataset.thumbnail;
        const menuItemThumbnailAlt = menuItem.dataset.thumbnailAlt;

        const cartContent = element.querySelector("#cart-content");
        let cartItem = cartContent.querySelector(`.item[data-key='${key}']`);

        if (!cartItem) {
            // Add item
            const template = element.querySelector("#cart-item-template");
            const cartItemFragment = template.content.cloneNode(true);
            cartItem = cartItemFragment.querySelector(".item");
            cartItem.dataset.key = key;
            cartItem.dataset.thumbnail = menuItemThumbnail;
            cartItem.dataset.thumbnailAlt = menuItemThumbnailAlt;

            const removeButton = cartItem.querySelector(".remove-from-cart-button");
            removeButton.dataset.key = key;
            removeButton.onclick = e => {
                Ui.remove(element, key);
                Ui.dispatchQuantityChange(element, key, 0);
            };

            const cartItemTitle = cartItem.querySelector(".title");
            cartItemTitle.textContent = menuItemTitle;

            const cartItemQuantity = cartItem.querySelector(".quantity");
            cartItemQuantity.textContent = new Quantity(1).text;

            const cartItemPrice = cartItem.querySelector(".price");
            cartItemPrice.textContent = new Price(menuItemPrice).text;

            const cartItemTotalCost = cartItem.querySelector(".total-cost");
            cartItemTotalCost.textContent = new Price(menuItemPrice).text;

            cartContent.appendChild(cartItem);

            Ui.dispatchQuantityChange(element, key, 1);
        } else {
            // Update item
            const cartItemQuantity = cartItem.querySelector(".quantity");
            cartItemQuantity.textContent = new Quantity(new Quantity(cartItemQuantity.textContent).value + 1).text;

            const cartItemPrice = cartItem.querySelector(".price");
            cartItemPrice.textContent = new Price(menuItemPrice).text;

            const quantity = new Quantity(cartItemQuantity.textContent).value;
            const cartItemTotalCost = cartItem.querySelector(".total-cost");
            cartItemTotalCost.textContent = new Price(menuItemPrice * quantity).text;

            Ui.dispatchQuantityChange(element, key, quantity);
        }

        Ui.updateTotals(element);
    }

    static decrementQuantity(element, key, menuItem) {
        const cartItem = element.querySelector(`#cart-content .item[data-key='${key}']`);
        const cartItemQuantity = cartItem.querySelector(".quantity");
        const quantity = new Quantity(cartItemQuantity.textContent).value;
        const newQuantity = quantity > 0 ? quantity - 1 : quantity;

        if (newQuantity != quantity) {
            cartItemQuantity.textContent = new Quantity(newQuantity).text;

            const menuItemPrice = new Price(menuItem.querySelector(".price").textContent).value;
            const cartItemTotalCost = cartItem.querySelector(".total-cost");
            cartItemTotalCost.textContent = new Price(menuItemPrice * newQuantity).text;

            Ui.updateTotals(element);
            Ui.dispatchQuantityChange(element, key, newQuantity);
        }
        if (newQuantity === 0) {
            Ui.remove(element, key);
            Ui.updateTotals(element);
        }
    }

    static incrementQuantity(element, key, menuItem) {
        const cartItem = element.querySelector(`#cart-content .item[data-key='${key}']`);
        const cartItemQuantity = cartItem.querySelector(".quantity");
        cartItemQuantity.textContent = new Quantity(new Quantity(cartItemQuantity.textContent).value + 1).text;
        const quantity = new Quantity(cartItemQuantity.textContent).value;

        const menuItemPrice = new Price(menuItem.querySelector(".price").textContent).value;
        const cartItemTotalCost = cartItem.querySelector(".total-cost");
        cartItemTotalCost.textContent = new Price(menuItemPrice * quantity).text;

        Ui.updateTotals(element);
        Ui.dispatchQuantityChange(element, key, quantity);
    }

    static remove(element, key) {
        const cartItem = element.querySelector(`#cart-content .item[data-key='${key}']`);
        cartItem.remove();
        Ui.updateTotals(element);
    }

    static clear(element) {
        const items = element.querySelectorAll("#cart-content .item");
        items.forEach(item => {
            const key = item.dataset.key;
            item.remove();
            Ui.dispatchQuantityChange(element, key, 0);
        });

        Ui.updateTotals(element);
    }

    static updateTotals(element) {
        const cartItems = element.querySelectorAll("#cart-content .item");
        let totalCost = 0;
        let totalQuantity = 0;

        cartItems.forEach(item => {
            const itemTotalCost = item.querySelector(".total-cost");
            totalCost += new Price(itemTotalCost.textContent).value;

            const itemQuantity = item.querySelector(".quantity");
            totalQuantity += new Quantity(itemQuantity.textContent).value;
        });

        const orderTotal = element.querySelector("#order-total");
        orderTotal.textContent = new Price(totalCost).text;

        const orderQuantity = element.querySelector("#order-quantity");
        orderQuantity.textContent = totalQuantity;

        if (totalCost > 0) {
            const cartFooter = element.querySelector("#cart-footer");
            cartFooter.classList.remove("hidden")

            const emptyCartSection = element.querySelector("#empty-cart-section");
            emptyCartSection.classList.add("hidden")
        } else {
            const cartFooter = element.querySelector("#cart-footer");
            cartFooter.classList.add("hidden")

            const emptyCartSection = element.querySelector("#empty-cart-section");
            emptyCartSection.classList.remove("hidden")
        }
    }

    static dispatchQuantityChange(element, key, quantity) {
        const quantityChangeEvent = new CustomEvent("quantity-change", {
            detail: {
                key: key,
                quantity: quantity
            }
        });

        element.dispatchEvent(quantityChangeEvent);
    }

    static dispatchConfirmOrder(element) {
        const items = element.querySelectorAll(".item");
        const confirmOrderEvent = new CustomEvent("confirm-order", {
            detail: {
                items: items
            }
        });
        element.dispatchEvent(confirmOrderEvent);
    }
}

export { Cart };

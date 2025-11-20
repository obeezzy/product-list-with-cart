import { Price, Quantity } from "./util.js";

class OrderSummary {
    constructor(items) {
        Ui.clear(this.element);
        Ui.add(this.element, items);

        const startNewOrderButton = this.element.querySelector("#start-new-order-button");
        startNewOrderButton.addEventListener("click", e => {
            Ui.dispatchNewOrder(this.element);
        });
    }

    show() {
        this.element.showModal();
    }

    hide() {
        this.element.close();
    }

    clear() {
    }

    get element() {
        return document.querySelector("#order-summary-dialog");
    }
}

class Ui {
    static add(element, cartItems) {
        let totalCost = 0;
        cartItems.forEach(cartItem => {
            const orderSummaryItems = element.querySelector("#order-summary-items");
            const template = element.querySelector("#order-summary-item-template");
            const orderSummaryItemFragment = template.content.cloneNode(true);
            const newItem = orderSummaryItemFragment.querySelector(".item");
            const newItemThumbnail = orderSummaryItemFragment.querySelector(".thumbnail");
            const newItemTitle = orderSummaryItemFragment.querySelector(".title");
            const newItemQuantity = orderSummaryItemFragment.querySelector(".quantity");
            const newItemPrice = orderSummaryItemFragment.querySelector(".price");
            const newItemTotalCost = orderSummaryItemFragment.querySelector(".total-cost");

            newItem.dataset.key = cartItem.dataset.key;
            newItemThumbnail.src = cartItem.dataset.thumbnail;
            newItemThumbnail.alt = cartItem.dataset.thumbnailAlt;

            const cartItemTitle = cartItem.querySelector(".title");
            newItemTitle.textContent = cartItemTitle.textContent;

            const cartItemQuantity = cartItem.querySelector(".quantity");
            newItemQuantity.textContent = cartItemQuantity.textContent;

            const cartItemPrice = cartItem.querySelector(".price");
            newItemPrice.textContent = cartItemPrice.textContent;

            const cartItemTotalCost = cartItem.querySelector(".total-cost");
            newItemTotalCost.textContent = cartItemTotalCost.textContent;

            const totalCostForItem = new Price(cartItemTotalCost.textContent).value;
            totalCost += totalCostForItem;

            orderSummaryItems.appendChild(newItem);
        });

        const orderSummaryTotal = element.querySelector("#order-summary-total");
        orderSummaryTotal.textContent = new Price(totalCost).text;
    }

    static dispatchNewOrder(element) {
        const newOrderEvent = new CustomEvent("new-order");
        element.dispatchEvent(newOrderEvent);
    }

    static clear(element) {
        const items = element.querySelectorAll("#order-summary-items .item");
        items.forEach(item => item.remove());
    }
}

export { OrderSummary };

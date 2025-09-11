class Menu {
    constructor() {
        const addToCartButtons = this.element.querySelectorAll(".add-to-cart-button");
        addToCartButtons.forEach(button => {
            button.onclick = e => {
                const key = button.dataset.key;
                const item = this.element.querySelector(`.item[data-key='${key}']`);

                const addToCartEvent = new CustomEvent("add-to-cart", {
                    detail: {
                        key: key,
                        item: item
                    }
                });
                this.element.dispatchEvent(addToCartEvent);
                Ui.displayQuantityStepper(this.element, button.dataset.key);
            };
        });

        const decrementQuantityButtons = this.element.querySelectorAll(".decrement-quantity-button");
        decrementQuantityButtons.forEach(button => {
            button.onclick = e => {
                const key = button.parentElement.dataset.key;
                const item = this.element.querySelector(`.item[data-key='${key}']`);
                const decrementQuantityEvent = new CustomEvent("decrement-quantity", {
                    detail: {
                        key: key,
                        item: item
                    }
                });

                this.element.dispatchEvent(decrementQuantityEvent);
            }
        });

        const incrementQuantityButtons = this.element.querySelectorAll(".increment-quantity-button");
        incrementQuantityButtons.forEach(button => {
            button.onclick = e => {
                const key = button.parentElement.dataset.key;
                const item = this.element.querySelector(`.item[data-key='${key}']`);
                const incrementQuantityEvent = new CustomEvent("increment-quantity", {
                    detail: {
                        key: key,
                        item: item
                    }
                });

                this.element.dispatchEvent(incrementQuantityEvent);
            };
        });
    }

    setQuantity(key, quantity) {
        Ui.setQuantity(this.element, key, quantity);

        if (quantity === 0)
            Ui.displayQuantityStepper(this.element, key, false);
    }

    get element() {
        return document.querySelector("#menu");
    }
}

class Ui {
    static displayQuantityStepper(element, key, visible=true) {
        const addToCartButton = element.querySelector(`.add-to-cart-button[data-key='${key}']`);
        const quantityStepper = element.querySelector(`.quantity-stepper[data-key='${key}']`);

        if (visible) {
            quantityStepper.classList.remove("hidden");
            addToCartButton.classList.add("hidden");
        } else {
            addToCartButton.classList.remove("hidden");
            quantityStepper.classList.add("hidden");
        }
    }

    static setQuantity(element, key, quantity) {
        const quantityStepper = element.querySelector(`.quantity-stepper[data-key='${key}']`);
        const quantityNode = quantityStepper.querySelector(".quantity");
        quantityNode.textContent = quantity;
    }
}

export { Menu };

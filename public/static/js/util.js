class Price {
    constructor(price) {
        this._priceText = "";
        this._priceValue = 0;

        if (typeof price === "string") {
            this._priceText = price;
            this._priceValue = parseFloat(price.replace("$", ""));
        }
        else if (typeof price === "number") {
            this._priceText = `$${price.toFixed(2)}`;
            this._priceValue = price;
        }
    }

    get value() {
        return this._priceValue;
    }

    get text() {
        return this._priceText;
    }
}

class Quantity {
    constructor(quantity) {
        this._quantityText = "";
        this._quantityValue = 0;

        if (typeof quantity === "string") {
            this._quantityText = quantity;
            this._quantityValue = parseInt(quantity.replace("x", ""));
        }
        else if (typeof quantity === "number") {
            this._quantityText = `${quantity}x`;
            this._quantityValue = quantity;
        }
    }

    get value() {
        return this._quantityValue;
    }

    get text() {
        return this._quantityText;
    }
}

export { Price, Quantity };

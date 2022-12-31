"use strict";
const basketIconDiv = document.querySelector('.cartIconWrap');
const basketTable = document.querySelector('.basketTable');
const basketCounter = basketIconDiv.querySelector('span');

const basket = {

    /**
     * Generates a lowerCamelCase name for html class from product name.
     * @param {string} productName - the product name
     * @returns {string}
     */
    makeCls(productName) {
        let result = '';
        productName.split(' ').forEach(element => {
            result += element[0].toUpperCase() + element.slice(1).toLowerCase();
        });
        return result[0].toLowerCase() + result.slice(1);
    },

    /**
     * Recalculates the total cost of goods in the basket
     * and corrects the tag in html
     * @param {number} productPrice - the price of product
     */
    recalculateTotal(productPrice) {
        if (this.total) {
            this.total += productPrice;
        } else {
            this.total = productPrice;
        }
        basketTable.querySelector('.totalCost').innerHTML = `${this.total}$`;
    },

    rebuildTable(productName) {
        const cls = this.makeCls(productName);
        const currentRow = document.getElementById(cls);

        currentRow.querySelector('.count').innerHTML = this[productName].count;
        currentRow.querySelector('.costCell')
            .innerHTML = `${this[productName].cost}$`;
    },

    minusOne(productName) {
        this[productName].count--;
        basketCounter.textContent--;
        this.recalculateTotal(-this[productName].price);
        if (this[productName].count === 0) {
            this.deleteRow(productName);
            return;
        }
        this.rebuildTable(productName);
    },

    plusOne(productName) {
        this[productName].count++;
        basketCounter.textContent++;
        this.rebuildTable(productName);
        this.recalculateTotal(this[productName].price);
    },

    deleteRow(productName) {
        const cls = this.makeCls(productName);
        document.getElementById(cls).remove();
        delete this[productName];
    },

    /**
     * Adding a product to a basket.
     * @param {object} element - The element with product information.
     */
    addToCart(element) {
        const productName = element.querySelector('.featuredName').innerText;
        const productPrice = +element.querySelector('.featuredPrice')
            .innerText.slice(1);
        const cls = this.makeCls(productName);

        if (!this[productName]) {
            this[productName] = {
                price: productPrice,
                count: 1,
                get cost() { return this.price * this.count; },
            };
            const row = `<div id="${cls}" class="basketRow">\n
                <div class="basketCell basketProductName">${productName}</div>\n
                <div class="basketCell countCell">
                <i class="fa fa-minus minusButton"></i>  
                <span class="count">${this[productName].count}</span>
                <i class="fa fa-plus plusButton"></i>
                </div >\n
                <div class="basketCell"> ${this[productName].price}$</div >\n
                <div class="basketCell costCell">
                ${this[productName].cost}$</div >\n
                <div class="basketCell deleteCell">
                <img class="trashIcon" src="images/trash.svg" alt="">
                </div>\n
                </div > `;
            basketTable.querySelector('.basketHeader')
                .insertAdjacentHTML('afterEnd', row);
            this.recalculateTotal(this[productName].price);
            basketCounter.textContent++;
        } else {
            this.plusOne(productName);
        }
    },
}


basketIconDiv.addEventListener('click', event => {
    basketTable.classList.toggle('hidden');
});

document.querySelector('.featuredItems').addEventListener('click', event => {
    const tergetEl = event.target;
    const isButton = tergetEl.classList.contains('basketButton') || tergetEl.parentElement.classList.contains('basketButton');
    if (!isButton) {
        return;
    }
    basket.addToCart(event.target.closest('.featuredItem'));
});

basketTable.addEventListener('click', event => {
    const productName = event.target.closest('.basketRow').
        querySelector('.basketProductName').innerHTML;
    if (event.target.classList.contains('minusButton')) {
        basket.minusOne(productName);
    }
    if (event.target.classList.contains('plusButton')) {
        basket.plusOne(productName);
    }
    if (event.target.classList.contains('trashIcon')) {
        basket.recalculateTotal(-basket[productName].cost);
        basketCounter.textContent -= basket[productName].count;
        basket.deleteRow(productName);
    }

});

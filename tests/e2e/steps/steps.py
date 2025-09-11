import subprocess
import os
import time

from behave import given, when, then
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from pathlib import Path

driver = None
TIMEOUT = 10

class Quantity:
    def __init__(self, quantity):
        if isinstance(quantity, int):
            self._quantityValue = quantity
            self._quantityText = f"{quantity}x"
        elif isinstance(quantity, str):
            self._quantityText = quantity
            self._quantityValue = int(quantity.replace("x", ""))
        else:
            raise RuntimeError(f"Invalid quantity: {quantity}")

    @property
    def value(self):
        return self._quantityValue

    @property
    def text(self):
        return self._quantityText

class Price:
    def __init__(self, price):
        if isinstance(price, (int, float)):
            self._priceValue = price
            self._priceText = f"${price:.2f}"
        elif isinstance(price, str):
            self._priceText = price
            self._priceValue = float(price[1:])
        else:
            raise RuntimeError(f"Invalid price: {price}")

    @property
    def value(self):
        return self._priceValue

    @property
    def text(self):
        return self._priceText

@given('I am on the "{page}" page')
def step_impl(context, page):
    global driver
    print("Trying to open browser...")

    if hasattr(context, "chrome_options"):
        driver = webdriver.Chrome(options=context.chrome_options)
    else:
        driver = webdriver.Chrome()

    context.driver = driver
    print("Browser opened.", context.base_url)
    driver.get(context.base_url)

@when('I click the "{button}" button')
def step_impl(context, button):
    if button == "Add to Cart":
        driver.find_element(By.CSS_SELECTOR, "#menu .add-to-cart-button").click()
    elif button == "Remove from Cart":
        driver.find_element(By.CSS_SELECTOR, "#cart .remove-from-cart-button").click()
    elif button == "Increment":
        driver.find_element(By.CSS_SELECTOR, "#menu .increment-quantity-button").click()
    elif button == "Decrement":
        driver.find_element(By.CSS_SELECTOR, "#menu .decrement-quantity-button").click()
    elif button == "Confirm Order":
        driver.find_element(By.CSS_SELECTOR, "#confirm-order-button").click()
    elif button == "Start New Order":
        driver.find_element(By.CSS_SELECTOR, "#start-new-order-button").click()
    else:
        raise RuntimeError(f"Unimplemented button: {button}")

@then('an item should be added to my cart')
def step_impl(context):
    try:
        item_element = WebDriverWait(driver, TIMEOUT).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "#cart .item"))
        )
        assert item_element is not None, "Item was not created"
        assert item_element.is_displayed(), "Item did not appear"
    except TimeoutException:
        print(f"Element not found after {TIMEOUT} seconds.")

@then('the quantity stepper should appear')
def step_impl(context):
    quantity_stepper = driver.find_element(By.CSS_SELECTOR, "#menu .quantity-stepper")
    assert quantity_stepper.is_displayed(), "Quantity stepper was not displayed"

@then('the quantity stepper should display a quantity of "{quantity}"')
def step_impl(context, quantity):
    quantity_element = driver.find_element(By.CSS_SELECTOR, "#menu .quantity-stepper .quantity")
    assert quantity_element.text == quantity, "Quantity mismatch"

@then('the item should be removed from my cart')
def step_impl(context):
    try:
        not_located = WebDriverWait(driver, TIMEOUT).until_not(
            EC.presence_of_element_located((By.CSS_SELECTOR, "#cart .item"))
        )
        assert not_located == True, "Item was not removed"
    except TimeoutException:
        print(f"Element found after {TIMEOUT} seconds.")

@then('the "{button}" button should appear')
def step_impl(context, button):
    add_to_cart_button = driver.find_element(By.CSS_SELECTOR, "#menu .add-to-cart-button")
    assert add_to_cart_button.is_displayed(), '"Add to Cart" button was not displayed'

@then('the "{button}" button should disappear')
def step_impl(context, button):
    add_to_cart_button = driver.find_element(By.CSS_SELECTOR, "#menu .add-to-cart-button")
    assert not add_to_cart_button.is_displayed(), '"Add to Cart" button was displayed'

@then('the quantity stepper should disappear')
def step_impl(context):
    quantity_stepper = driver.find_element(By.CSS_SELECTOR, "#menu .quantity-stepper")
    assert not quantity_stepper.is_displayed(), 'Quantity stepper was displayed'

@then('the quantity of the item in the cart should increase to "{quantity}"')
@then('the quantity of the item in the cart should decrease to "{quantity}"')
def step_impl(context, quantity):
    quantity_element = driver.find_element(By.CSS_SELECTOR, "#cart .quantity")
    assert quantity_element.text == Quantity(int(quantity)).text, "Quantity mismatch"

@then('the order quantity of the item in the cart should be correct')
def step_impl(context):
    elements = driver.find_elements(By.CSS_SELECTOR, "#cart .quantity")
    total_quantity = 0
    for quantity_element in elements:
        total_quantity += Quantity(quantity_element.text).value

    order_quantity_element = driver.find_element(By.CSS_SELECTOR, "#cart #order-quantity")
    assert order_quantity_element.text == str(total_quantity), "Quantity mismatch"

@then('the order total of the item in the cart should be correct')
def step_impl(context):
    elements = driver.find_elements(By.CSS_SELECTOR, "#cart .total-cost")
    total_cost = 0
    for total_cost_element in elements:
        total_cost += Price(total_cost_element.text).value

    order_total_element = driver.find_element(By.CSS_SELECTOR, "#cart #order-total")
    if total_cost == 0:
        assert not order_total_element.is_displayed(), "Order total still showing"
    else:
        assert order_total_element.text == Price(total_cost).text, "Order total mismatch"

@then('the order summary dialog should be displayed')
def step_impl(context):
    try:
        dialog_element = WebDriverWait(driver, TIMEOUT).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "dialog[open]"))
        )
        assert dialog_element is not None, "Dialog was not opened"
        assert dialog_element.is_displayed(), "Item did not appear"
    except TimeoutException:
        print(f"Element not found after {TIMEOUT} seconds.")

@then('the order summary dialog should close')
def step_impl(context):
    try:
        dialog_element = WebDriverWait(driver, TIMEOUT).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "dialog"))
        )
        assert not dialog_element.is_displayed(), "Dialog still opened"
    except TimeoutException:
        print(f"Element not found after {TIMEOUT} seconds.")

@then('my cart should be empty')
def step_impl(context):
    try:
        not_located = WebDriverWait(driver, TIMEOUT).until_not(
            EC.presence_of_element_located((By.CSS_SELECTOR, "#cart .item"))
        )
        assert not_located, "Cart is not empty"
    except TimeoutException:
        print(f"Element not found after {TIMEOUT} seconds.")

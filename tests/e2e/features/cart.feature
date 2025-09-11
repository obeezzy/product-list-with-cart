Feature: Cart

  As a user
  I want to be able to manipulate my cart
  So that I can fill an order

  Scenario: Add to/remove from cart
    Given I am on the "Desserts" page
    When I click the "Add to Cart" button
    Then an item should be added to my cart
    And the "Add to Cart" button should disappear
    And the quantity stepper should appear
    And the quantity stepper should display a quantity of "1"
    When I click the "Remove from Cart" button
    Then the item should be removed from my cart
    And the "Add to Cart" button should appear
    And the quantity stepper should disappear

  Scenario: Increment/decrement quantity in cart
    Given I am on the "Desserts" page
    When I click the "Add to Cart" button
    Then an item should be added to my cart
    And the "Add to Cart" button should disappear
    And the quantity stepper should appear
    And the quantity stepper should display a quantity of "1"
    When I click the "Increment" button
    Then the quantity of the item in the cart should increase to "2"
    And the quantity stepper should display a quantity of "2"
    When I click the "Increment" button
    Then the quantity of the item in the cart should increase to "3"
    And the quantity stepper should display a quantity of "3"
    When I click the "Increment" button
    Then the quantity of the item in the cart should increase to "4"
    And the quantity stepper should display a quantity of "4"
    And the order quantity of the item in the cart should be correct
    And the order total of the item in the cart should be correct
    When I click the "Decrement" button
    Then the quantity of the item in the cart should decrease to "3"
    And the quantity stepper should display a quantity of "3"
    When I click the "Decrement" button
    Then the quantity of the item in the cart should decrease to "2"
    And the quantity stepper should display a quantity of "2"
    When I click the "Decrement" button
    Then the quantity of the item in the cart should decrease to "1"
    And the quantity stepper should display a quantity of "1"
    When I click the "Decrement" button
    Then the "Add to Cart" button should appear
    And the quantity stepper should disappear
    And the order quantity of the item in the cart should be correct
    And the order total of the item in the cart should be correct

  Scenario: Confirm order
    Given I am on the "Desserts" page
    When I click the "Add to Cart" button
    Then an item should be added to my cart
    When I click the "Confirm Order" button
    Then the order summary dialog should be displayed

  Scenario: Start new order
    Given I am on the "Desserts" page
    When I click the "Add to Cart" button
    Then an item should be added to my cart
    When I click the "Confirm Order" button
    Then the order summary dialog should be displayed
    When I click the "Start New Order" button
    Then the order summary dialog should close
    And my cart should be empty

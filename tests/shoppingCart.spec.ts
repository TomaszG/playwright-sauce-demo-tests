import { test, expect } from './fixtures/inventory.fixture'

test('should display added inventory item in the shopping cart in order they were added to the cart', async ({ inventoryPage }) => {
  // given
  const expectedItemsInCart: {
    name: string
    price: string
    description: string
    quantity: number
  }[] = []

  const itemsToAdd = (await inventoryPage.getInventoryItems()).slice(0, 3).reverse()

  for (const item of itemsToAdd) {
    await item.addToCart()

    expectedItemsInCart.push({
      name: await item.inventoryItemName.innerText(),
      price: await item.inventoryItemPrice.innerText(),
      description: await item.inventoryItemDescription.innerText(),
      quantity: 1, // there's no way to change it in the UI
    })
  }

  // when
  const shoppingCartPage = await inventoryPage.goToShoppingCart()

  // then
  await shoppingCartPage.expectToBeVisible()
  await shoppingCartPage.expectNumberOfShoppingCartItemsToBe(itemsToAdd.length)

  const shoppingCartItems = await shoppingCartPage.getShoppingCartItems()
  expect(shoppingCartItems).toHaveLength(itemsToAdd.length)

  for (let i = 0; i < shoppingCartItems.length; i++) {
    await expect(shoppingCartItems[i].itemName).toHaveText(expectedItemsInCart[i].name)
    await expect(shoppingCartItems[i].itemPrice).toHaveText(expectedItemsInCart[i].price)
    await expect(shoppingCartItems[i].itemDescription).toHaveText(expectedItemsInCart[i].description)
    await expect(shoppingCartItems[i].itemQuantity).toHaveText(expectedItemsInCart[i].quantity.toString())
  }
})

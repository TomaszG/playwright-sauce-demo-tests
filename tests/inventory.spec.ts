import { test, expect } from './fixtures/inventory.fixture'
import { SortOption } from './pages/inventory.po'

type NamePriceTuple = { name: string; price: string }

const getSortFunction = (sortOption: SortOption) => {
  switch (sortOption) {
    case SortOption.NameAtoZ:
      return (a: NamePriceTuple, b: NamePriceTuple) =>
        a.name.localeCompare(b.name)
    case SortOption.NameZtoA:
      return (a: NamePriceTuple, b: NamePriceTuple) =>
        b.name.localeCompare(a.name)
    case SortOption.PriceHighToLow:
      return (a: NamePriceTuple, b: NamePriceTuple) =>
        parseFloat(b.price.slice(1)) - parseFloat(a.price.slice(1))
    case SortOption.PriceLowToHigh:
      return (a: NamePriceTuple, b: NamePriceTuple) =>
        parseFloat(a.price.slice(1)) - parseFloat(b.price.slice(1))
    default:
      throw new Error(`Unknown sort option: ${sortOption}`)
  }
}

test('should display inventory items', async ({ inventoryPage }) => {
  // when & then
  const inventoryItems = await inventoryPage.getInventoryItems()
  expect(inventoryItems).toHaveLength(6)
})

test('should display inventory item details', async ({ inventoryPage }) => {
  // given
  const expectedItem = {
    name: 'Sauce Labs Backpack',
    description:
      'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.',
    price: '$29.99',
    addToCartButtonText: 'Add to cart',
  }

  // when
  const item = await inventoryPage.getInventoryItemByName(expectedItem.name)

  // then
  expect(await item.inventoryItemDescription.innerText()).toBe(
    expectedItem.description
  )
  expect(await item.inventoryItemPrice.innerText()).toBe(expectedItem.price)
  expect(await item.inventoryItemAddToCartButton.innerText()).toBe(
    expectedItem.addToCartButtonText
  )
})

Object.keys(SortOption).forEach((sortOptionKey) => {
  test(`should sort inventory items by ${sortOptionKey}`, async ({
    inventoryPage,
  }) => {
    // given
    const sortOption = SortOption[sortOptionKey]

    // when
    await inventoryPage.sortInventoryItemsBy(sortOption)

    // then
    const inventoryItems = await inventoryPage.getInventoryItems()
    const itemNamesAndPrices: NamePriceTuple[] = await Promise.all(
      inventoryItems.map(async (item) => ({
        name: await item.inventoryItemName.innerText(),
        price: await item.inventoryItemPrice.innerText(),
      }))
    )

    expect(itemNamesAndPrices).toEqual(
      itemNamesAndPrices.sort(getSortFunction(sortOption))
    )
  })
})

test('should add inventory item to cart', async ({ inventoryPage }) => {
  // given
  const item = await inventoryPage.getInventoryItemByName('Sauce Labs Backpack')

  // when
  await item.addToCart()

  // then
  await item.expectToBeInCart()
})

test('should remove inventory item from cart', async ({ inventoryPage }) => {
  // given
  const item = await inventoryPage.getInventoryItemByName('Sauce Labs Backpack')
  await item.addToCart()

  // when
  await item.removeFromCart()

  // then
  await item.expectNotToBeInCart()
})

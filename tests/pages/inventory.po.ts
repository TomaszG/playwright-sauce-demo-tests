import { expect, type Locator, type Page } from '@playwright/test'
import { HamburgerMenu } from './hamburgerMenu.po'
import { ShoppingCart } from './shoppingCart.po'

export enum SortOption {
  NameAtoZ = 'az',
  NameZtoA = 'za',
  PriceLowToHigh = 'lohi',
  PriceHighToLow = 'hilo',
}

export class InventoryItem {
  readonly inventoryItem: Locator
  readonly inventoryItemImage: Locator
  readonly inventoryItemName: Locator
  readonly inventoryItemDescription: Locator
  readonly inventoryItemPrice: Locator
  readonly inventoryItemAddToCartButton: Locator
  readonly inventoryItemRemoveButton: Locator

  constructor(locator: Locator) {
    this.inventoryItem = locator
    this.inventoryItemImage = this.inventoryItem.locator('img.inventory_item_img')
    this.inventoryItemName = this.inventoryItem.locator('.inventory_item_name')
    this.inventoryItemDescription = this.inventoryItem.locator('.inventory_item_desc')
    this.inventoryItemPrice = this.inventoryItem.locator('.inventory_item_price')
    this.inventoryItemAddToCartButton = this.inventoryItem.locator('.btn_primary')
    this.inventoryItemRemoveButton = this.inventoryItem.locator('.btn_secondary')
  }

  async addToCart() {
    return this.inventoryItemAddToCartButton.click()
  }

  async removeFromCart() {
    await this.inventoryItemRemoveButton.click()
  }

  async expectToBeInCart() {
    await expect(this.inventoryItemRemoveButton).toHaveCount(1)
    await expect(this.inventoryItemAddToCartButton).toHaveCount(0)
  }

  async expectNotToBeInCart() {
    await expect(this.inventoryItemAddToCartButton).toHaveCount(1)
    await expect(this.inventoryItemRemoveButton).toHaveCount(0)
  }

  async expectToBeVisible() {
    await expect(this.inventoryItem).toBeVisible()
  }
}

export class Inventory {
  readonly page: Page
  readonly inventoryItems: Locator
  readonly sortSelect: Locator
  readonly shoppingCartLink: Locator
  readonly shoppingCartBadge: Locator
  readonly hamburgerMenu: Locator

  constructor(page: Page) {
    this.page = page
    this.inventoryItems = page.locator('.inventory_item')
    this.sortSelect = page.getByTestId('product_sort_container')
    this.shoppingCartLink = page.locator('.shopping_cart_link')
    this.shoppingCartBadge = page.locator('.shopping_cart_badge')
    this.hamburgerMenu = page.locator('.bm-burger-button')
  }

  async getInventoryItems() {
    const inventoryItems = await this.inventoryItems.all()
    return inventoryItems.map((item) => new InventoryItem(item))
  }

  async getInventoryItemByName(name: string) {
    const inventoryItems = await this.getInventoryItems()
    const item = inventoryItems.find(async (item) => (await item.inventoryItemName.innerText()) === name)
    if (!item) {
      throw new Error(`Inventory item with name "${name}" not found`)
    }
    return item
  }

  async sortInventoryItemsBy(option: SortOption) {
    await this.sortSelect.selectOption(option)
  }

  async goToShoppingCart() {
    await this.shoppingCartLink.click()
    return new ShoppingCart(this.page)
  }

  async expectNumberOfShoppingCartItemsToBe(expectedNumberOfItems: number) {
    if (expectedNumberOfItems === 0) {
      await expect(this.shoppingCartBadge).toHaveCount(0)

      return
    }

    await expect(this.shoppingCartBadge).toHaveText(expectedNumberOfItems.toString())
  }

  async openHamburgerMenu() {
    await this.hamburgerMenu.click()
    return new HamburgerMenu(this.page)
  }
}

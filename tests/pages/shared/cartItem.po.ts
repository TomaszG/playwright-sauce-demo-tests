import { Locator, expect } from '@playwright/test'

export class CartItem {
  readonly item: Locator
  readonly itemQuantity: Locator
  readonly itemName: Locator
  readonly itemDescription: Locator
  readonly itemPrice: Locator

  constructor(locator: Locator) {
    this.item = locator
    this.itemQuantity = this.item.locator('.cart_quantity')
    this.itemName = this.item.locator('.inventory_item_name')
    this.itemDescription = this.item.locator('.inventory_item_desc')
    this.itemPrice = this.item.locator('.inventory_item_price')
  }

  async expectToBeVisible() {
    await expect(this.item).toBeVisible()
  }
}

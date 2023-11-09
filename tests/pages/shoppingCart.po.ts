import { Locator, Page, expect } from '@playwright/test'
import { HamburgerMenu } from './hamburgerMenu.po'
import { Inventory } from './inventory.po'
import { CartItem } from './shared/cartItem.po'
import { Checkout } from './checkout.po'

class ShoppingCartItem extends CartItem {
  readonly itemRemoveButton: Locator

  constructor(locator: Locator) {
    super(locator)
    this.itemRemoveButton = this.item.getByTestId('remove-sauce-labs-backpack')
  }

  async removeFromCart() {
    await this.itemRemoveButton.click()
  }
}

export class ShoppingCart {
  readonly page: Page
  readonly hamburgerMenu: Locator
  readonly shoppingCartBadge: Locator
  readonly shoppingCartItems: Locator
  readonly continueShoppingButton: Locator
  readonly checkoutButton: Locator

  constructor(page: Page) {
    this.page = page
    this.hamburgerMenu = page.locator('.bm-burger-button')
    this.shoppingCartBadge = page.locator('.shopping_cart_badge')
    this.shoppingCartItems = page.locator('.cart_item')
    this.continueShoppingButton = page.getByTestId('continue-shopping')
    this.checkoutButton = page.getByTestId('checkout')
  }

  async openHamburgerMenu() {
    await this.hamburgerMenu.click()
    return new HamburgerMenu(this.page)
  }

  async getNumberOfShoppingCartItems() {
    const badgeText = await this.shoppingCartBadge.innerText()
    return parseInt(badgeText)
  }

  async getShoppingCartItems() {
    const shoppingCartItems = await this.shoppingCartItems.all()
    return shoppingCartItems.map((item) => new ShoppingCartItem(item))
  }

  async getShoppingCartItemByName(name: string) {
    const shoppingCartItems = await this.getShoppingCartItems()
    const item = shoppingCartItems.find(
      async (item) => (await item.itemName.innerText()) === name
    )
    if (!item) {
      throw new Error(`Shopping cart item with name "${name}" not found`)
    }
    return item
  }

  async continueShopping() {
    await this.continueShoppingButton.click()
    return new Inventory(this.page)
  }

  async checkout() {
    await this.checkoutButton.click()
    return new Checkout(this.page)
  }
}

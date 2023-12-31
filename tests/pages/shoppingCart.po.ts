import { Locator, Page, expect } from '@playwright/test'
import { HamburgerMenu } from './hamburgerMenu.po'
import { Inventory } from './inventory.po'
import { CartItem } from './shared/cartItem.po'
import { Checkout } from './checkout.po'

export class ShoppingCartItem extends CartItem {
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
  readonly title: Locator
  readonly hamburgerMenu: Locator
  readonly shoppingCartBadge: Locator
  readonly shoppingCartItems: Locator
  readonly continueShoppingButton: Locator
  readonly checkoutButton: Locator

  constructor(page: Page) {
    this.page = page
    this.title = page.locator('.title')
    this.hamburgerMenu = page.locator('.bm-burger-button')
    this.shoppingCartBadge = page.locator('.shopping_cart_badge')
    this.shoppingCartItems = page.locator('.cart_item')
    this.continueShoppingButton = page.getByTestId('continue-shopping')
    this.checkoutButton = page.getByTestId('checkout')
  }

  async expectToBeVisible() {
    await expect(this.page).toHaveURL('/cart.html')
    await expect(this.title).toHaveText('Your Cart')
  }

  async openHamburgerMenu() {
    await this.hamburgerMenu.click()
    return new HamburgerMenu(this.page)
  }

  async expectNumberOfShoppingCartItemsToBe(expectedNumberOfItems: number) {
    if (expectedNumberOfItems === 0) {
      await expect(this.shoppingCartBadge).toHaveCount(0)

      return
    }

    await expect(this.shoppingCartBadge).toHaveText(expectedNumberOfItems.toString())
  }

  async getShoppingCartItems() {
    const shoppingCartItems = await this.shoppingCartItems.all()
    return shoppingCartItems.map((item) => new ShoppingCartItem(item))
  }

  async getShoppingCartItemByName(name: string) {
    const shoppingCartItems = await this.getShoppingCartItems()
    const item = shoppingCartItems.find(async (item) => (await item.itemName.innerText()) === name)
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

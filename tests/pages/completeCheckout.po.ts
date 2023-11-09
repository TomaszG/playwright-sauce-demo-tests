import { Locator, Page, expect } from '@playwright/test'
import { Inventory } from './inventory.po'

export class CompleteCheckout {
  readonly page: Page
  readonly completeHeader: Locator
  readonly completeText: Locator
  readonly completeImage: Locator
  readonly backHomeButton: Locator

  constructor(page: Page) {
    this.page = page
    this.completeImage = page.locator('.pony_express')
    this.completeHeader = page.locator('.complete-header')
    this.completeText = page.locator('.complete-text')
    this.backHomeButton = page.getByTestId('back-to-products')
  }

  async expectToBeVisible() {
    await expect(this.completeImage).toBeVisible()
    await expect(this.completeHeader).toBeVisible()
    await expect(this.completeHeader).toHaveText('Thank you for your order!')
    await expect(this.completeText).toBeVisible()
    await expect(this.completeText).toHaveText(
      'Your order has been dispatched, and will arrive just as fast as the pony can get there!'
    )
    await expect(this.backHomeButton).toBeVisible()
  }

  async backHome() {
    await this.backHomeButton.click()
    return new Inventory(this.page)
  }
}

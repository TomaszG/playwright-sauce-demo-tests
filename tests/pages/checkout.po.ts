import { Locator, Page } from '@playwright/test'
import { ShoppingCart } from './shoppingCart.po'
import { OverviewCheckout } from './overviewCheckout.po'

export class Checkout {
  readonly page: Page
  readonly firstName: Locator
  readonly lastName: Locator
  readonly postalCode: Locator
  readonly continueButton: Locator
  readonly cancelButton: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.firstName = page.getByTestId('firstName')
    this.lastName = page.getByTestId('lastName')
    this.postalCode = page.getByTestId('postalCode')
    this.continueButton = page.getByTestId('continue')
    this.cancelButton = page.getByTestId('cancel')
    this.errorMessage = page.getByTestId('error')
  }

  async fillOutForm(
    firstName?: string,
    lastName?: string,
    postalCode?: string
  ) {
    firstName && (await this.firstName.fill(firstName))
    lastName && (await this.lastName.fill(lastName))
    postalCode && (await this.postalCode.fill(postalCode))
  }

  async continue() {
    await this.continueButton.click()
    return new OverviewCheckout(this.page)
  }

  async cancel() {
    await this.cancelButton.click()
    return new ShoppingCart(this.page)
  }
}

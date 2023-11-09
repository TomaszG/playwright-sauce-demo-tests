import { Locator, Page } from '@playwright/test'
import { CartItem } from './shared/cartItem.po'
import { ShoppingCart } from './shoppingCart.po'
import { CompleteCheckout } from './completeCheckout.po'

export class OverviewCheckout {
  readonly page: Page
  readonly checkoutItems: Locator
  readonly paymentInformation: Locator
  readonly shippingInformation: Locator
  readonly itemTotal: Locator
  readonly tax: Locator
  readonly total: Locator
  readonly cancelButton: Locator
  readonly finishButton: Locator

  constructor(page: Page) {
    this.page = page
    this.checkoutItems = page.locator('.cart_item')
    this.paymentInformation = page.locator(
      `":text('Payment Information') + .summary_value_label"`
    )
    this.shippingInformation = page.locator(
      `":text('Shipping Information') + .summary_value_label"`
    )
    this.itemTotal = page.locator('.summary_subtotal_label')
    this.tax = page.locator('.summary_tax_label')
    this.total = page.locator('.summary_total_label')
    this.cancelButton = page.getByTestId('cancel')
    this.finishButton = page.getByTestId('finish')
  }

  async getCheckoutItems() {
    const checkoutItems = await this.checkoutItems.all()
    return checkoutItems.map((item) => new CartItem(item))
  }

  async getItemTotal() {
    const itemTotalText = await this.itemTotal.innerText()
    return parseFloat(itemTotalText.replace('Item total: $', ''))
  }

  async getTax() {
    const taxText = await this.tax.innerText()
    return parseFloat(taxText.replace('Tax: $', ''))
  }

  async getTotal() {
    const totalText = await this.total.innerText()
    return parseFloat(totalText.replace('Total: $', ''))
  }

  async finishCheckout() {
    await this.finishButton.click()
    return new CompleteCheckout(this.page)
  }

  async cancelCheckout() {
    await this.cancelButton.click()
    return new ShoppingCart(this.page)
  }
}

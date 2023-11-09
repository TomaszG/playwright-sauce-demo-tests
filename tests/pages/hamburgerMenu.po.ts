import { Locator, Page } from '@playwright/test'

export enum HamburgerMenuOption {
  AllItems = 'All Items',
  About = 'About',
  Logout = 'Logout',
  ResetAppState = 'Reset App State',
}

export class HamburgerMenu {
  readonly page: Page
  readonly menu: Locator
  readonly closeMenuButton: Locator

  constructor(page: Page) {
    this.page = page
    this.menu = page.locator('.bm-menu-wrap')
    this.closeMenuButton = page.locator('.bm-cross-button')
  }

  async clickMenuOption(option: HamburgerMenuOption) {
    await this.menu.getByText(option).click()
  }

  async close() {
    await this.closeMenuButton.click()
  }
}

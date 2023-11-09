import { expect, type Locator, type Page } from '@playwright/test'
import { Inventory } from './inventory.po'

export enum UserName {
  standard = 'standard_user',
  nonExisting = 'non_existing_user',
  lockedOut = 'locked_out_user',
  problem = 'problem_user',
  performance = 'performance_glitch_user',
  error = 'error_user',
  visual = 'visual_user',
}

export class Login {
  readonly page: Page
  readonly usernameInput: Locator
  readonly passwordInput: Locator
  readonly loginButton: Locator
  readonly error: Locator
  private readonly password: string

  constructor(page: Page) {
    this.page = page
    this.usernameInput = page.getByTestId('username')
    this.passwordInput = page.getByTestId('password')
    this.loginButton = page.getByTestId('login-button')
    this.error = page.getByTestId('error')
    this.password = 'secret_sauce'
  }

  async goto() {
    await this.page.goto('/')
  }

  async login(username: UserName, password = this.password) {
    await this.usernameInput.fill(username)
    await this.passwordInput.fill(password)
    await this.loginButton.click()
  }

  async expectSuccessfulLogin() {
    await expect(this.page).toHaveURL('/inventory.html')
    await expect(this.page.getByText('Products')).toBeVisible()

    return new Inventory(this.page)
  }

  async expectUnsuccessfulLogin() {
    await expect(this.page).toHaveURL('/')
    await expect(this.error).toBeVisible()
    await expect(this.error).toHaveText(
      'Epic sadface: Username and password do not match any user in this service'
    )
  }

  async expectLockedOutUser() {
    await expect(this.page).toHaveURL('/')
    await expect(this.error).toBeVisible()
    await expect(this.error).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.'
    )
  }
}

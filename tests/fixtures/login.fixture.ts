import { test as base } from '@playwright/test'
import { Login } from '../pages/login.po'

export const test = base.extend<{ loginPage: Login }>({
  loginPage: async ({ page }, use) => {
    const loginPage = new Login(page)
    await loginPage.goto()
    await use(loginPage)
  },
})

export { expect } from '@playwright/test'

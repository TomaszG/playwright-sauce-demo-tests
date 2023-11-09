import { test as base } from './login.fixture'
import { Inventory } from '../pages/inventory.po'
import { UserName } from '../pages/login.po'

export const test = base.extend<{ inventoryPage: Inventory }>({
  inventoryPage: async ({ loginPage }, use) => {
    await loginPage.login(UserName.standard)
    const inventoryPage = await loginPage.expectSuccessfulLogin()
    await use(inventoryPage)
  },
})

export { expect } from '@playwright/test'

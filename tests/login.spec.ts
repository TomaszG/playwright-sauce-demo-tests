import { test } from './fixtures/login.fixture'
import { Login, UserName } from './pages/login.po'

test('should login when correct credentials are provided', async ({
  loginPage,
}) => {
  // when
  await loginPage.login(UserName.standard)

  // then
  await loginPage.expectSuccessfulLogin()
})

const incorrectCredentialsTestCases = [
  { userName: UserName.nonExisting, password: 'secret_sauce' },
  { userName: UserName.standard, password: 'wrong_password' },
]

for (const { userName, password } of incorrectCredentialsTestCases) {
  test(`should not login when incorrect credentials are provided: ${userName}`, async ({
    loginPage,
  }) => {
    // when
    await loginPage.login(userName, password)

    // then
    await loginPage.expectUnsuccessfulLogin()
  })
}

test('should not login when locked out user is provided', async ({
  loginPage,
}) => {
  // when
  await loginPage.login(UserName.lockedOut)

  // then
  await loginPage.expectLockedOutUser()
})

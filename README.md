# Playwright tests for the [SauceDemo](https://www.saucedemo.com/) website.

## Prerequisites
* Node (version is specified in the [.nvmrc](/.nvmrc) file). You may want to use [nvm](https://github.com/nvm-sh/nvm) to manage multiple Node versions.
* [pnpm](https://pnpm.io/) (version is specified in the [package.json](/package.json) file, `engines` field)

## Setup
1. Clone this repository.
2. Run `pnpm install` to install the dependencies.

## Running the tests
1. Run `pnpm run playwright:test` to run all the tests on Chrome, Firefox, and Safari.
2. Run `pnpm run playwright:ui` to open the Playwright in UI mode.
3. Run one of
     * `pnpm run playwright:test:high-priority`
     * `pnpm run playwright:test:medium-priority`
     * `pnpm run playwright:test:low-priority`

    to run only tests with @high or @medium or @low priority annotation.

## Tests structure
* The tests are located in the [tests](/tests) folder.
* Tests are written using the [Page Object Models](https://playwright.dev/docs/pom) (PoM) pattern. PoM classes are located in the [tests/pages](/tests/pages) folder.
* Common steps/fixtures are located in the [tests/fixtures](/tests/fixtures) folder.

## What has been done
So far, I have created a few positive and negative tests for Login, and positive tests for Products/Inventory page and for Shopping Cart page. Also, I have created most of the Page Objects classes for pages in the app.

## Possible improvements
* It's possible to extract base page class with common locators visible in rest of the pages.
* It would be good to include API interaction and API tests, however, SauceDemo doesn't have API (everything is kept in FE state), so I didn't do it.

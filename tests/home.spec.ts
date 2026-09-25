import { expect, test } from '@playwright/test'

for (const [name, path] of [
  ['home', '/'],
  ['about', '/about'],
  ['offerings', '/offerings'],
  ['contact', '/contact-us'],
  ['service-product-design', '/services/product-design'],
  ['service-sre', '/services/site-reliability-engineering'],
  ['service-agentic-ai', '/services/agentic-ai'],
  ['service-iot-ml', '/services/iot-machine-learning'],
]) {
  test(`${name} renders without horizontal overflow or broken images`, async ({
    page,
  }, testInfo) => {
    const failed: string[] = []
    page.on('response', (res) => {
      if (res.status() >= 400) failed.push(`${res.status()} ${res.url()}`)
    })
    await page.goto(path)
    await page.waitForLoadState('networkidle')

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow, 'page must not scroll horizontally').toBeLessThanOrEqual(0)

    const broken = await page.$$eval('img', (imgs) =>
      imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute('src')),
    )
    expect(broken).toEqual([])
    expect(failed).toEqual([])

    await page.screenshot({
      path: `test-results/${name}-${testInfo.project.name}.png`,
      fullPage: true,
    })
  })
}

test('header links navigate between pages', async ({ page }, testInfo) => {
  const mobile = testInfo.project.name === 'mobile'
  const nav = (name: string) =>
    page
      .getByRole('navigation', { name: 'Primary' })
      .getByRole('link', { name, exact: true })
      .locator('visible=true')
  await page.goto('/')
  if (mobile) await page.getByRole('button', { name: 'Open menu' }).click()
  await nav('About Us').click()
  await expect(page).toHaveURL(/\/about$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('each other’s backs')
  if (mobile) await page.getByRole('button', { name: 'Open menu' }).click()
  await nav('Offerings').click()
  await expect(page).toHaveURL(/\/offerings$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Digital')
})

test('team carousel arrow scrolls and moves the indicator', async ({ page }) => {
  await page.goto('/')
  const section = page.locator('section[aria-label="Our People"]')
  const thumb = section.locator('div[aria-hidden] > div.bg-alchemy')
  const before = await thumb.evaluate((el) => el.getBoundingClientRect().left)
  await section.getByRole('button', { name: 'Next team members' }).click()
  await page.waitForTimeout(800)
  const after = await thumb.evaluate((el) => el.getBoundingClientRect().left)
  expect(after).toBeGreaterThan(before)
})

test('mobile header uses a hamburger menu', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'hamburger is mobile-only')
  await page.goto('/')
  const toggle = page.getByRole('button', { name: 'Open menu' })
  await expect(toggle).toBeVisible()
  await expect(page.getByRole('link', { name: 'Offerings', exact: true })).toBeHidden()
  await toggle.click()
  await expect(page.getByRole('link', { name: 'Offerings', exact: true })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('link', { name: 'Offerings', exact: true })).toBeHidden()
})

test('header stays at the top while scrolling', async ({ page }) => {
  await page.goto('/')
  await page.mouse.wheel(0, 3000)
  await page.waitForTimeout(300)
  const top = await page.locator('header').evaluate((el) => el.getBoundingClientRect().top)
  expect(top).toBeGreaterThanOrEqual(0)
  expect(top).toBeLessThanOrEqual(12)
})

test('team card flips to the quote and back on click', async ({ page }) => {
  await page.goto('/')
  const card = page.locator('article[aria-label="Hari Krishna"]')
  const back = card.locator('div:has(> div > blockquote)')
  await expect(back).toHaveAttribute('inert', '')
  await card.getByRole('button', { name: "Show Hari Krishna's quote" }).click()
  await expect(back).not.toHaveAttribute('inert', '')
  await expect(card.getByRole('button', { name: "Show Hari Krishna's photo" })).toBeVisible()
  await card.getByRole('button', { name: "Show Hari Krishna's photo" }).click()
  await expect(back).toHaveAttribute('inert', '')
})

test('brand fonts load', async ({ page }) => {
  await page.goto('/')
  /* Accent italics are registered once an accent nears the viewport (src/lib/accentFonts.ts). */
  await page.locator('[data-accent]').first().scrollIntoViewIfNeeded()
  await page.waitForFunction(
    () => [...document.fonts].filter((f) => f.style === 'italic').length === 3,
  )
  await page.evaluate(() => document.fonts.ready)
  const checks = await page.evaluate(async () => {
    const faces = [
      '300 16px IvyMode',
      'italic 300 16px IvyMode',
      'italic 400 16px IvyMode',
      'italic 100 16px IvyMode',
      '300 16px "Forma DJR Micro"',
      '500 16px "Forma DJR Micro"',
    ]
    return Promise.all(faces.map(async (f) => [f, (await document.fonts.load(f)).length > 0]))
  })
  for (const [face, loaded] of checks) expect(loaded, face as string).toBe(true)
})

test('contact form has every field from the design', async ({ page }, testInfo) => {
  await page.goto('/')
  test.skip(testInfo.project.name === 'mobile', 'phones show a Contact Us button instead')
  const form = page.locator('section[aria-labelledby="contact-heading"] form')
  for (const label of ['Name', 'Email', 'Contact No', 'Attach document', 'Message']) {
    await expect(form.getByLabel(label, { exact: true })).toBeVisible()
  }
  await expect(form.getByRole('button', { name: 'Submit' })).toBeVisible()
})

test('about intro photo sits beside the statement on desktop', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'side-by-side layout is desktop-only')
  await page.goto('/about')
  const intro = page.locator('section[aria-label="About Alvyl"]')
  const card = await intro.locator('h1').boundingBox()
  const photo = await intro.locator('img').boundingBox()
  expect(photo!.y).toBeCloseTo(card!.y, 0)
  expect(photo!.x).toBeGreaterThan(card!.x + card!.width)
  expect(photo!.height).toBeCloseTo(780, 0)
})

test('Schedule a Call opens the contact page with the full form', async ({ page }, testInfo) => {
  await page.goto('/')
  if (testInfo.project.name === 'mobile')
    await page.getByRole('button', { name: 'Open menu' }).click()
  await page.getByRole('link', { name: 'Schedule a Call' }).locator('visible=true').first().click()
  await expect(page).toHaveURL(/\/contact-us$/)
  await expect(page).toHaveTitle('Contact Us')
  for (const label of ['Name', 'Email', 'Contact No', 'Attach document', 'Message']) {
    await expect(page.getByLabel(label, { exact: true })).toBeVisible()
  }
  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible()
})

test('get in touch shows a Contact Us button instead of the form on phones', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'phone-only layout')
  await page.goto('/')
  const section = page.locator('section[aria-labelledby="contact-heading"]')
  await expect(section.locator('form')).toBeHidden()
  await section.getByRole('link', { name: 'Contact Us' }).click()
  await expect(page).toHaveURL(/\/contact-us$/)
})

test('mobile menu closes when tapping outside it', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'hamburger is mobile-only')
  await page.goto('/')
  await page.getByRole('button', { name: 'Open menu' }).click()
  await expect(page.getByRole('link', { name: 'Offerings', exact: true })).toBeVisible()
  await page.mouse.click(40, 600)
  await expect(page.getByRole('link', { name: 'Offerings', exact: true })).toBeHidden()
})

test('each Home service card opens its own service page', async ({ page }) => {
  for (const [title, path] of [
    ['End-to-End Product Design', '/services/product-design'],
    ['Site Reliability Engineering', '/services/site-reliability-engineering'],
    ['Agentic AI', '/services/agentic-ai'],
    ['IoT & Machine Learning', '/services/iot-machine-learning'],
  ]) {
    await page.goto('/')
    await page.getByRole('link', { name: title }).click()
    await expect(page).toHaveURL((url) => url.pathname === path)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(title.split(' ')[0])
  }
})

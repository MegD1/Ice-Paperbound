import { expect, test } from "@playwright/test";

const ids = ["form", "light", "color", "matter", "field", "notes", "index"];

test("all seven books have functioning covers and pages", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/studio");
  await expect(page.locator(".bookshelf-canvas--ready")).toBeVisible();
  await page.waitForTimeout(1500);
  await expect(page).toHaveTitle("Material Library | Book Studies");
  await expect(page.locator("nav button")).toHaveCount(7);
  await page.screenshot({ path: "docs/preview.png" });

  const stage = page.locator(".bookshelf-stage");
  for (const id of ids) {
    const book = page.locator(`button[data-volume="${id}"]`);
    await book.focus();
    await page.keyboard.press("Enter");
    await expect(stage).toHaveAttribute("data-book-view", "cover");
    await expect(stage).toHaveAttribute("data-active-volume", id);
    await page.keyboard.press("Enter");
    await expect(stage).toHaveAttribute("data-book-view", "open");
    await page.keyboard.press("Escape");
    await expect(stage).toHaveAttribute("data-book-view", "shelf");
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.mouse.move(760, 450);
  await page.mouse.click(760, 450);
  await expect(stage).toHaveAttribute("data-active-volume", "matter");
  await expect(stage).toHaveAttribute("data-book-view", "cover");
  await page.mouse.click(740, 440);
  await expect(stage).toHaveAttribute("data-book-view", "open");
  await page.mouse.click(25, 25);
  await expect(stage).toHaveAttribute("data-book-view", "shelf");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.documentElement.scrollHeight <= innerHeight)).toBe(true);
  expect(errors).toEqual([]);
});

test("reduced-motion and WebGL fallback retain the complete collection", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".bookshelf-canvas--ready")).toBeVisible();
  await page.locator('button[data-volume="index"]').focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".bookshelf-stage")).toHaveAttribute("data-book-view", "cover");
  await page.keyboard.press("Escape");
  await expect(page.locator(".bookshelf-stage")).toHaveAttribute("data-book-view", "shelf");
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
      if (type.includes("webgl")) return null;
      return Reflect.apply(getContext, this, [type, ...args]);
    } as typeof getContext;
  });
  await page.reload();
  await expect(page.locator(".bookshelf-canvas--fallback")).toBeVisible();
  await expect(page.locator("nav button")).toHaveCount(7);
  await expect(page.locator("nav")).toContainText("Little Index");
});

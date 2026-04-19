import { expect, test } from "@playwright/test";

test("user can register and access protected builder page", async ({ page }) => {
  const uniqueEmail = `user${Date.now()}@example.com`;

  await page.goto("/register");
  await page.getByLabel("Megjelenitesi nev").fill("E2E User");
  await page.getByLabel("Email").fill(uniqueEmail);
  await page.getByLabel("Jelszo").fill("Strong123!");
  await page.getByRole("button", { name: "Regisztracio" }).click();

  await expect(page).toHaveURL(/\/$/);
  await page.locator(".main-nav").getByRole("link", { name: "Konfigurator", exact: true }).click();
  await expect(page).toHaveURL(/\/builder$/);
  await expect(page.getByRole("heading", { name: "Konfigurator" })).toBeVisible();
});

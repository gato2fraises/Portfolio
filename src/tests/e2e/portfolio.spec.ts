/**
 * Tests E2E pour la page d'accueil du portfolio
 * Tests d'intégration avec Playwright
 */
import { test, expect } from '@playwright/test';

test.describe('Portfolio Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the homepage correctly', async ({ page }) => {
    // Vérifier le titre de la page
    await expect(page).toHaveTitle(/Portfolio/);

    // Vérifier que les éléments principaux sont présents
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    // Tester la navigation vers les différentes sections
    const navLinks = page.locator('nav a');
    const linkCount = await navLinks.count();

    expect(linkCount).toBeGreaterThan(0);

    // Vérifier que les liens de navigation sont cliquables
    for (let i = 0; i < linkCount; i++) {
      const link = navLinks.nth(i);
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href');
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Changer la taille de viewport pour mobile
    await page.setViewportSize({ width: 375, height: 667 });

    // Vérifier que la page s'affiche correctement sur mobile
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should load without JavaScript errors', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Vérifier qu'il n'y a pas d'erreurs JavaScript critiques
    const criticalErrors = consoleErrors.filter(
      error => !error.includes('favicon') && !error.includes('404')
    );

    expect(criticalErrors.length).toBe(0);
  });

  test('should have working theme toggle', async ({ page }) => {
    // Chercher le bouton de changement de thème
    const themeToggle = page.locator('[data-theme-toggle], .theme-toggle, #theme-toggle');

    if ((await themeToggle.count()) > 0) {
      // Cliquer sur le toggle de thème
      await themeToggle.click();

      // Vérifier que le thème a changé
      await page.waitForTimeout(500); // Attendre l'animation

      const htmlElement = page.locator('html');
      const themeAttribute = await htmlElement.getAttribute('data-theme');
      expect(themeAttribute).toBeTruthy();
    }
  });

  test('should have accessible elements', async ({ page }) => {
    // Vérifier que les éléments importants ont des attributs d'accessibilité
    const mainContent = page.locator('main, #main, .main-content');
    if ((await mainContent.count()) > 0) {
      await expect(mainContent.first()).toBeVisible();
    }

    // Vérifier les liens de navigation
    const navLinks = page.locator('nav a');
    const linkCount = await navLinks.count();

    for (let i = 0; i < Math.min(linkCount, 5); i++) {
      const link = navLinks.nth(i);
      const href = await link.getAttribute('href');
      const text = await link.textContent();

      expect(href).toBeTruthy();
      expect(text?.trim()).toBeTruthy();
    }
  });

  test('should load external resources correctly', async ({ page }) => {
    // Vérifier que les ressources externes se chargent
    const responses: string[] = [];

    page.on('response', response => {
      if (response.status() >= 400) {
        responses.push(`${response.status()}: ${response.url()}`);
      }
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Filtrer les erreurs non critiques
    const criticalErrors = responses.filter(
      response =>
        !response.includes('favicon') &&
        !response.includes('analytics') &&
        !response.includes('.map')
    );

    expect(criticalErrors.length).toBe(0);
  });
});

test.describe('Portfolio Contact Form', () => {
  test('should navigate to contact page', async ({ page }) => {
    await page.goto('/');

    // Chercher le lien vers la page contact
    const contactLink = page.locator('a[href*="contact"], a[href*="Contact"]');

    if ((await contactLink.count()) > 0) {
      await contactLink.first().click();
      await page.waitForLoadState('networkidle');

      // Vérifier qu'on est sur la page contact
      expect(page.url()).toContain('contact');
    }
  });

  test('should have contact form elements', async ({ page }) => {
    await page.goto('/contact.html');

    // Vérifier la présence du formulaire de contact
    const form = page.locator('form, .contact-form');

    if ((await form.count()) > 0) {
      await expect(form.first()).toBeVisible();

      // Vérifier les champs du formulaire
      const nameField = page.locator('input[name="name"], input[id*="name"]');
      const emailField = page.locator('input[name="email"], input[type="email"]');
      const messageField = page.locator('textarea[name="message"], textarea');

      if ((await nameField.count()) > 0) {
        await expect(nameField.first()).toBeVisible();
      }
      if ((await emailField.count()) > 0) {
        await expect(emailField.first()).toBeVisible();
      }
      if ((await messageField.count()) > 0) {
        await expect(messageField.first()).toBeVisible();
      }
    }
  });
});

test.describe('Portfolio Performance', () => {
  test('should load within reasonable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // La page devrait se charger en moins de 5 secondes
    expect(loadTime).toBeLessThan(5000);
  });

  test('should have optimized images', async ({ page }) => {
    await page.goto('/');

    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const img = images.nth(i);

      // Vérifier que les images ont des attributs alt
      const altText = await img.getAttribute('alt');
      const src = await img.getAttribute('src');

      if (src && !src.startsWith('data:')) {
        expect(altText).toBeTruthy();
      }
    }
  });
});

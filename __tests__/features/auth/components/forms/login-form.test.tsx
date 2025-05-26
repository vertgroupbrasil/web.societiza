import { API_ENDPOINTS } from '@flowtec/routes/endpoints';
import { test, expect, Page } from '@playwright/test';

const api = API_ENDPOINTS

// Page Object Model para LoginForm
class LoginFormPage {
  constructor(public page: Page) {}

  // Seletores
  get emailInput() {
    return this.page.locator('input[name="email"]');
  }

  get passwordInput() {
    return this.page.locator('input[name="password"]');
  }

  get submitButton() {
    return this.page.locator('button[type="submit"]');
  }

  get emailLabel() {
    return this.page.locator('label', { hasText: 'Email' });
  }

  get passwordLabel() {
    return this.page.locator('label', { hasText: 'Senha' });
  }

  get emailError() {
    return this.page.locator('[role="alert"]').filter({ hasText: /email/i });
  }

  get passwordError() {
    return this.page.locator('[role="alert"]').filter({ hasText: /senha|password/i });
  }

  get globalError() {
    return this.page.locator('p.text-red-500');
  }

  get form() {
    return this.page.locator('form');
  }

  // Ações
  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async fillForm(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
  }

  async submitForm() {
    await this.submitButton.click();
  }

  async submitFormWithData(email: string, password: string) {
    await this.fillForm(email, password);
    await this.submitForm();
  }

  async waitForSubmissionState(isSubmitting: boolean) {
    if (isSubmitting) {
      await expect(this.submitButton).toContainText('Entrando...');
      await expect(this.submitButton).toBeDisabled();
    } else {
      await expect(this.submitButton).toContainText('Entrar');
      await expect(this.submitButton).toBeEnabled();
    }
  }

  async clearForm() {
    await this.emailInput.clear();
    await this.passwordInput.clear();
  }
}

test.describe("Login-Form - E2E Complete test", () => {
  let loginPage: LoginFormPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginFormPage(page);
    

    await page.goto('/login');

    await expect(loginPage.form).toBeVisible();
  });

  test.describe('Layout and structure', () => {
    test('should render all form elements', async () => {
      // Verificar labels
      await expect(loginPage.emailLabel).toBeVisible();
      await expect(loginPage.passwordLabel).toBeVisible();

      // Verificar inputs
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();

      // Verificar placeholders
      await expect(loginPage.emailInput).toHaveAttribute('placeholder', 'seu@email.com');
      await expect(loginPage.passwordInput).toHaveAttribute('placeholder', '********');

      // Verificar tipo do input de senha
      await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');

      // Verificar botão
      await expect(loginPage.submitButton).toBeVisible();
      await expect(loginPage.submitButton).toContainText('Entrar');
      await expect(loginPage.submitButton).toHaveAttribute('type', 'submit');
    });

  });

  test.describe('Basic interation', () => {
    test('should allow to write at e-mail input', async () => {
      const testEmail = 'user@test.com';
      await loginPage.fillEmail(testEmail);
      await expect(loginPage.emailInput).toHaveValue(testEmail);
    });

    test('should allow to write at password input', async () => {
      const testPassword = 'mypassword';
      await loginPage.fillPassword(testPassword);
      await expect(loginPage.passwordInput).toHaveValue(testPassword);
    });

    test('should clear inputs', async () => {
      await loginPage.fillForm('test@test.com', 'password123');
      await loginPage.clearForm();
      
      await expect(loginPage.emailInput).toHaveValue('');
      await expect(loginPage.passwordInput).toHaveValue('');
    });

    test('should focus at the next field while pressing TAB', async () => {
      await loginPage.emailInput.focus();
      await loginPage.emailInput.press('Tab');
      await expect(loginPage.passwordInput).toBeFocused();
      
      await loginPage.passwordInput.press('Tab');
      await expect(loginPage.submitButton).toBeFocused();
    });
  });

  test.describe('Field validations', () => {
    test('should show invalid e-mail error', async () => {
      await loginPage.fillEmail('email-invalido');
      await loginPage.submitForm();

      // Aguardar mensagem de erro aparecer
      await expect(loginPage.emailError).toBeVisible();
      await expect(loginPage.emailError).toContainText(/email/i);
    });

    test('should show empty e-mail field error', async () => {
      await loginPage.fillPassword('senha123');
      await loginPage.submitForm();

      await expect(loginPage.emailError).toBeVisible();
    });

    test('should show empty password field error', async () => {
      await loginPage.fillEmail('user@test.com');
      await loginPage.submitForm();

      await expect(loginPage.passwordError).toBeVisible();
    });


    test('should clear errors when fields are correct', async () => {
      // Gerar erro primeiro
      await loginPage.submitForm();
      await expect(loginPage.emailError).toBeVisible();

      // Corrigir o campo
      await loginPage.fillEmail('user@valid.com');
      
      // Erro deve desaparecer
      await expect(loginPage.emailError).not.toBeVisible();
    });
  });

  test.describe('Submission state', () => {
    test('Should show submission state while APIs being called', async () => {
      // Mock da API para simular delay
      await loginPage.page.route(api.auth.login, async route => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      });

      await loginPage.fillForm('test@gmail.com', '123456789');
      await loginPage.submitForm();

      // Verificar estado de loading
      await loginPage.waitForSubmissionState(true);
    });

    test('should disable button during submission', async () => {
      await loginPage.page.route(api.auth.login, async route => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      });

      await loginPage.fillForm('test@gmail.com', '123456789');
      await loginPage.submitForm();

      await expect(loginPage.submitButton).toBeDisabled();
    });

    test('should reable button after submission', async () => {
      await loginPage.page.route(api.auth.login, async route => {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Credenciais inválidas' })
        });
      });

      await loginPage.fillForm('user@test.com', 'wrongpassword');
      await loginPage.submitForm();

      // Aguardar processo completar e botão voltar ao normal
      await loginPage.waitForSubmissionState(false);
    });
  });

  test.describe('Success scenarios', () => {
    test('should do login with valid credentials', async () => {
      // Mock de sucesso
      await loginPage.page.route(api.auth.login, async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      });

      await loginPage.fillForm('test@gmail.com', '123456789');
      await loginPage.submitForm();

      // Aguardar redirecionamento
      await expect(loginPage.page).toHaveURL('/dashboard');
    });

    test('should show success toast', async () => {
      await loginPage.page.route(api.auth.login, async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      });
      
      await loginPage.fillForm('test@gmail.com', '123456789');
      await loginPage.submitForm();

      // Verificar toast (ajuste o seletor conforme sua implementação de toast)
      const toast = loginPage.page.locator('[data-sonner-toast]');
      await expect(toast).toContainText('Autenticado com sucesso!');
    });
  });

  test.describe('Erros scenarios', () => {
    test('should show global error for invalid credentials', async () => {
      await loginPage.page.route(api.auth.login, async route => {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ 
            error: 'Credenciais inválidas',
            message: 'Email ou senha incorretos'
          })
        });
      });

      await loginPage.fillForm('user@test.com', 'wrongpassword');
      await loginPage.submitForm();

      await expect(loginPage.globalError).toBeVisible();
      await expect(loginPage.globalError).toContainText('Email ou senha incorretos');
    });

    test('should show toast error', async () => {
      await loginPage.page.route(api.auth.login, async route => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Erro interno do servidor' })
        });
      });

      await loginPage.fillForm('user@test.com', 'password123');
      await loginPage.submitForm();

      const errorToast = loginPage.page.locator('[data-sonner-toast]').filter({ hasText: /erro/i });
      await expect(errorToast).toBeVisible();
    });

    test('should clear global error while trying again', async () => {
      // Primeiro: gerar erro
      await loginPage.page.route(api.auth.login, async route => {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Credenciais inválidas' })
        });
      });

      await loginPage.fillForm('user@test.com', 'wrongpassword');
      await loginPage.submitForm();
      await expect(loginPage.globalError).toBeVisible();

      // Segundo: sucesso
      await loginPage.page.route(api.auth.login, async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      });

      await loginPage.fillForm('test@gmail.com', '123456789');
      await loginPage.submitForm();

      await expect(loginPage.globalError).not.toBeVisible();
    });
  });

  test.describe('UX and Accessibility', () => {
    test('should have labels correctly associated to the inputs', async () => {
      const emailId = await loginPage.emailInput.getAttribute('id');
      const passwordId = await loginPage.passwordInput.getAttribute('id');

      await expect(loginPage.emailLabel).toHaveAttribute('for', emailId || '');
      await expect(loginPage.passwordLabel).toHaveAttribute('for', passwordId || '');
    });

    test('shoud allow submission with enter at e-mail', async () => {
      await loginPage.page.route(api.auth.login, async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      });

      await loginPage.fillForm('user@test.com', 'password123');
      await loginPage.emailInput.press('Enter');

      await expect(loginPage.page).toHaveURL('/dashboard');
    });

    test('shoud allow submission with enter at password', async () => {
      await loginPage.page.route(api.auth.login, async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      });

      await loginPage.fillForm('user@test.com', 'password123');
      await loginPage.passwordInput.press('Enter');

      await expect(loginPage.page).toHaveURL('/dashboard');
    });

  });

  test.describe('Extreme cases and Edge Cases', () => {
    test('should handle long e-mails', async () => {
      const longEmail = 'a'.repeat(100) + '@test.com';
      await loginPage.fillEmail(longEmail);
      await expect(loginPage.emailInput).toHaveValue(longEmail);
    });

    test('should handle long passwords', async () => {
      const longPassword = 'a'.repeat(200);
      await loginPage.fillPassword(longPassword);
      await expect(loginPage.passwordInput).toHaveValue(longPassword);
    });

    test('should handle special characters in the password', async () => {
      const specialPassword = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      await loginPage.fillPassword(specialPassword);
      await expect(loginPage.passwordInput).toHaveValue(specialPassword);
    });

    test('should handle network error', async () => {
      await loginPage.page.route(api.auth.login, route => route.abort());

      await loginPage.fillForm('test@gmail.com', '123456789');
      await loginPage.submitForm();

      // Deve mostrar algum tipo de erro
      await expect(loginPage.globalError).toBeVisible();
    });

    test('should handle APIs timeout', async () => {
      await loginPage.page.route(api.auth.login, async route => {
        // Simular timeout muito longo
        await new Promise(resolve => setTimeout(resolve, 10000));
      });

      await loginPage.fillForm('test@gmail.com', '123456789');
      await loginPage.submitForm();

      // Aguardar por timeout configurado (ajuste conforme necessário)
      await expect(loginPage.globalError).toBeVisible({ timeout: 15000 });
    });

    test('should keep form data after error', async () => {
      await loginPage.page.route(api.auth.login, async route => {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Erro' })
        });
      });

      const email = 'test@gmail.com';
      const password = 'wrongpassword';

      await loginPage.fillForm(email, password);
      await loginPage.submitForm();

      // Verificar se dados permanecem no formulário
      await expect(loginPage.emailInput).toHaveValue(email);
      await expect(loginPage.passwordInput).toHaveValue(password);
    });
  });

  test.describe('Perform tests', () => {
    test('should respond fast to digiting', async () => {
      const startTime = Date.now();
      await loginPage.fillEmail('user@test.com');
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(1000);
    });

    test('should validate passwords in-real-time', async () => {
      await loginPage.fillEmail('invalid-email');
      await loginPage.passwordInput.focus(); // Trigger blur no email

      // Erro deve aparecer rapidamente
      await expect(loginPage.emailError).toBeVisible({ timeout: 2000 });
    });
  });
});
// ============================================================
// SpaceExplorer 2.0 — Login / Register Page
// ============================================================

let authMode = 'login';
let selectedRole = 'researcher';

function initLogin() {
  renderAuthForms();
  initAuthToggle();
  initRoleSelector();
  initPasswordToggle();
  initAuthSubmit();
}

function renderAuthForms() {
  // Forms are in HTML; just sync visibility
  document.getElementById('login-form-fields')?.classList.toggle('hidden', authMode !== 'login');
  document.getElementById('register-form-fields')?.classList.toggle('hidden', authMode !== 'register');
}

function initAuthToggle() {
  document.querySelectorAll('.auth-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      authMode = btn.dataset.mode;
      document.querySelectorAll('.auth-toggle-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === authMode));
      renderAuthForms();
    });
  });
}

function initRoleSelector() {
  document.querySelectorAll('.role-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedRole = card.dataset.role;
      const input = document.getElementById('role-input');
      if (input) input.value = selectedRole;
    });
  });
}

function initPasswordToggle() {
  document.querySelectorAll('.pw-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (!input) return;
      const isText = input.type === 'text';
      input.type = isText ? 'password' : 'text';
      btn.textContent = isText ? '👁️' : '🙈';
    });
  });
}

function initAuthSubmit() {
  const loginForm = document.getElementById('login-form');
  const regForm   = document.getElementById('register-form');

  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = loginForm.querySelector('[type="submit"]');
      btn.classList.add('btn-loading');
      btn.textContent = 'Authenticating...';
      setTimeout(() => {
        btn.classList.remove('btn-loading');
        btn.textContent = 'Sign In';
        showToast('Login successful! Welcome back, Commander.', 'success');
        navigateTo('dashboard');
      }, 1500);
    });
  }

  if (regForm) {
    regForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = regForm.querySelector('[type="submit"]');
      const pw  = regForm.querySelector('[name="password"]');
      const cpw = regForm.querySelector('[name="confirmPassword"]');
      if (pw && cpw && pw.value !== cpw.value) {
        cpw.classList.add('error');
        showToast('Passwords do not match', 'error');
        setTimeout(() => cpw.classList.remove('error'), 500);
        return;
      }
      btn.classList.add('btn-loading');
      btn.textContent = 'Creating Account...';
      setTimeout(() => {
        btn.classList.remove('btn-loading');
        btn.textContent = 'Create Account';
        showToast('Account created! Welcome to Mission Control.', 'success');
        navigateTo('dashboard');
      }, 1500);
    });
  }
}

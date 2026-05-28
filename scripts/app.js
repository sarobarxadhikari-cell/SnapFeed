(function () {
  'use strict';

  var loading = false;
  var form = document.getElementById('login-form');
  var email = document.getElementById('email');
  var password = document.getElementById('password');
  var loginBtn = document.getElementById('login-btn');
  var errorMsg = document.getElementById('error-msg');
  var createBtn = document.getElementById('create-btn');
  var modal = document.getElementById('register-modal');
  var closeModal = document.getElementById('close-modal');
  var regForm = document.getElementById('reg-form');
  var registerBtn = document.getElementById('register-btn');

  // Populate DOB selects
  var daySel = document.getElementById('reg-day');
  var monthSel = document.getElementById('reg-month');
  var yearSel = document.getElementById('reg-year');
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  if (daySel) {
    var dOpt = document.createElement('option');
    dOpt.textContent = 'Day';
    dOpt.disabled = true;
    dOpt.selected = true;
    daySel.appendChild(dOpt);
    for (var d = 1; d <= 31; d++) {
      var o = document.createElement('option');
      o.textContent = d;
      daySel.appendChild(o);
    }
  }
  if (monthSel) {
    var mOpt = document.createElement('option');
    mOpt.textContent = 'Month';
    mOpt.disabled = true;
    mOpt.selected = true;
    monthSel.appendChild(mOpt);
    for (var m = 0; m < months.length; m++) {
      var o2 = document.createElement('option');
      o2.textContent = months[m];
      o2.value = m + 1;
      monthSel.appendChild(o2);
    }
  }
  if (yearSel) {
    var yOpt = document.createElement('option');
    yOpt.textContent = 'Year';
    yOpt.disabled = true;
    yOpt.selected = true;
    yearSel.appendChild(yOpt);
    for (var y = new Date().getFullYear(); y >= 1905; y--) {
      var o3 = document.createElement('option');
      o3.textContent = y;
      yearSel.appendChild(o3);
    }
  }

  // Login
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (loading) return;
    loading = true;
    loginBtn.disabled = true;
    loginBtn.classList.add('loading');
    loginBtn.innerHTML = '<span class="spinner"></span>Logging in...';

    setTimeout(function () {
      loading = false;
      loginBtn.disabled = false;
      loginBtn.classList.remove('loading');
      loginBtn.textContent = 'Log in';
      if (!email.value || !password.value) {
        errorMsg.textContent = 'Please enter your email and password.';
        errorMsg.classList.add('show');
        return;
      }
      if (password.value.length < 6) {
        errorMsg.textContent = 'The password that you\'ve entered is incorrect. Forgotten password?';
        errorMsg.classList.add('show');
        return;
      }
      errorMsg.classList.remove('show');
      showDashboard(email.value);
    }, 1500);
  });

  email.addEventListener('input', function () { errorMsg.classList.remove('show'); });
  password.addEventListener('input', function () { errorMsg.classList.remove('show'); });

  // Password toggle
  var togglePw = document.getElementById('toggle-pw');
  if (togglePw) {
    togglePw.addEventListener('click', function () {
      if (password.type === 'password') {
        password.type = 'text';
        togglePw.textContent = 'Hide';
      } else {
        password.type = 'password';
        togglePw.textContent = 'Show';
      }
    });
  }

  // Registration modal
  createBtn.addEventListener('click', function () { modal.classList.add('active'); });
  closeModal.addEventListener('click', function () { modal.classList.remove('active'); });
  modal.addEventListener('click', function (e) {
    if (e.target === modal) modal.classList.remove('active');
  });

  // Register
  regForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (loading) return;
    loading = true;
    registerBtn.disabled = true;
    registerBtn.textContent = 'Creating Account...';
    setTimeout(function () {
      loading = false;
      registerBtn.disabled = false;
      registerBtn.textContent = 'Sign Up';
      modal.classList.remove('active');
    }, 1200);
  });

  // Dashboard
  function showDashboard(usr) {
    document.body.innerHTML =
      '<div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#f0f2f5;font-family:Helvetica,Arial,sans-serif;padding:20px;">' +
        '<h1 style="font-size:28px;color:#1c1e21;margin-bottom:8px;">Welcome to Snapfeed</h1>' +
        '<p style="color:#606770;font-size:15px;margin-bottom:24px;">Logged in as ' + usr.replace(/&/g,'&amp;').replace(/</g,'&lt;') + '</p>' +
        '<button onclick="location.reload()" style="background:#1877f2;color:white;border:none;border-radius:6px;padding:10px 24px;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit;">Log out</button>' +
      '</div>';
  }

  // Theme toggle
  var themeBtn = document.getElementById('theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      document.documentElement.classList.toggle('dark');
      themeBtn.textContent = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';
    });
  }
})();

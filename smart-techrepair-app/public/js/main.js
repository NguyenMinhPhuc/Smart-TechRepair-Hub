// Smart TechRepair Hub — Main JS

function getToken() {
  return localStorage.getItem('token');
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
}

const featureSearchItems = [
  {
    label: 'Dashboard tổng quan',
    path: '/dashboard',
    keywords: ['dashboard', 'tong quan', 'trang chu', 'overview'],
  },
  {
    label: 'Đơn sửa chữa',
    path: '/service-orders',
    keywords: ['don sua chua', 'service order', 'don hang'],
  },
  {
    label: 'Linh kiện',
    path: '/inventory/parts',
    keywords: ['linh kien', 'parts', 'kho', 'inventory'],
  },
  {
    label: 'Danh mục linh kiện',
    path: '/inventory/categories',
    keywords: ['danh muc', 'category', 'phan loai'],
  },
  {
    label: 'Báo cáo',
    path: '/reports',
    keywords: ['bao cao', 'report', 'doanh thu'],
  },
  {
    label: 'Người dùng hệ thống',
    path: '/users',
    keywords: ['nguoi dung', 'user', 'tai khoan', 'admin'],
  },
  {
    label: 'Cấu hình hệ thống',
    path: '/settings',
    keywords: ['cau hinh', 'settings', 'he thong', 'cua hang'],
  },
  {
    label: 'Tra cứu khách hàng',
    path: '/tracking',
    keywords: ['tra cuu', 'tracking', 'khach hang', 'bao gia'],
  },
  {
    label: 'Tài liệu API',
    path: '/api/docs',
    keywords: ['api', 'swagger', 'docs', 'tai lieu'],
  },
];

function normalizeSearchText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function getFeatureSearchMatches(query) {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return featureSearchItems;
  }

  return featureSearchItems.filter((item) => {
    const haystack = [item.label, item.path, ...(item.keywords || [])]
      .map(normalizeSearchText)
      .join(' ');

    return haystack.includes(normalizedQuery);
  });
}

function initFeatureSearch() {
  const input = document.getElementById('featureSearchInput');
  const results = document.getElementById('featureSearchResults');
  const wrapper = document.getElementById('topbarSearch');

  if (!input || !results || !wrapper) {
    return;
  }

  let activeIndex = -1;
  let matches = [];

  const closeResults = () => {
    results.hidden = true;
    results.innerHTML = '';
    activeIndex = -1;
  };

  const navigateToItem = (item) => {
    if (!item) {
      return;
    }

    window.location.href = item.path;
  };

  const renderResults = () => {
    matches = getFeatureSearchMatches(input.value).slice(0, 7);
    results.innerHTML = '';

    if (!input.value.trim()) {
      closeResults();
      return;
    }

    if (!matches.length) {
      const empty = document.createElement('div');
      empty.className = 'topbar-search-empty';
      empty.textContent = 'Không tìm thấy chức năng phù hợp.';
      results.appendChild(empty);
      results.hidden = false;
      activeIndex = -1;
      return;
    }

    matches.forEach((item, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'topbar-search-result';
      if (index === activeIndex) {
        button.classList.add('active');
      }
      button.innerHTML = `
        <span class="topbar-search-result-label">${item.label}</span>
        <span class="topbar-search-result-meta">${item.path}</span>
      `;
      button.addEventListener('click', () => navigateToItem(item));
      results.appendChild(button);
    });

    results.hidden = false;
  };

  input.addEventListener('input', () => {
    activeIndex = -1;
    renderResults();
  });

  input.addEventListener('focus', () => {
    if (input.value.trim()) {
      renderResults();
    }
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!matches.length) {
        renderResults();
      }
      activeIndex = Math.min(activeIndex + 1, matches.length - 1);
      renderResults();
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      renderResults();
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      if (!matches.length) {
        matches = getFeatureSearchMatches(input.value);
      }
      navigateToItem(matches[activeIndex] || matches[0]);
      return;
    }

    if (event.key === 'Escape') {
      closeResults();
    }
  });

  document.addEventListener('click', (event) => {
    if (!wrapper.contains(event.target)) {
      closeResults();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const token = getToken();
  
  if (!token && !window.location.pathname.startsWith('/tracking') && !window.location.pathname.startsWith('/login')) {
    window.location.href = '/login';
    return;
  }
  
  const user = getUser();
  const nameEl = document.getElementById('currentUserName');
  const roleEl = document.getElementById('currentUserRole');
  if (nameEl && user.username) nameEl.textContent = user.username;
  if (roleEl && user.role) roleEl.textContent = user.role;
  
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPath || 
        (currentPath.startsWith(link.getAttribute('href')) && link.getAttribute('href') !== '/')) {
      link.classList.add('active');
    }
  });

  initFeatureSearch();
});

const originalFetch = window.fetch;
window.fetch = function(url, options = {}) {
  const token = getToken();
  if (token && typeof url === 'string' && url.startsWith('/api')) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    };
  }
  return originalFetch(url, options);
};

function logout() {
  if (!confirm('Bạn có muốn đăng xuất không?')) return;
  fetch('/api/auth/logout', { method: 'POST' })
    .finally(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    });
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');

  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '12px';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');

  const bgColors = {
    success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  toast.innerHTML = `<span style="margin-right: 8px;">${icons[type] || '🔔'}</span><span>${message}</span>`;
  toast.style.minWidth = '280px';
  toast.style.maxWidth = '420px';
  toast.style.padding = '14px 18px';
  toast.style.borderRadius = '12px';
  toast.style.color = '#fff';
  toast.style.fontSize = '14px';
  toast.style.fontWeight = '500';
  toast.style.lineHeight = '1.4';
  toast.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.3)';
  toast.style.transform = 'translateX(50px)';
  toast.style.opacity = '0';
  toast.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
  toast.style.background = bgColors[type] || bgColors.success;
  toast.style.display = 'flex';
  toast.style.alignItems = 'center';

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  });

  window.setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';

    window.setTimeout(() => {
      toast.remove();
      if (container && !container.children.length) {
        container.remove();
      }
    }, 300);
  }, 3500);
}

/**
 * Custom Modal MessageBox (Replaces window.alert)
 */
function showMessageBox(titleOrMsg, message = '', type = 'info') {
  let title = 'Thông báo';
  let bodyMsg = titleOrMsg;
  if (message) {
    title = titleOrMsg;
    bodyMsg = message;
  }

  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.display = 'flex';
    overlay.style.zIndex = '10000';

    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };

    overlay.innerHTML = `
      <div class="modal-card" style="max-width: 440px; animation: modalPop 0.25s ease-out;">
        <div class="modal-header">
          <h3 style="display:flex; align-items:center; gap:8px;">
            <span>${icons[type] || '🔔'}</span>
            <span>${title}</span>
          </h3>
        </div>
        <div class="modal-body" style="font-size: 14px; line-height: 1.6; color: var(--text-primary); padding: 16px 0;">
          ${bodyMsg}
        </div>
        <div class="modal-footer" style="justify-content: flex-end;">
          <button class="btn btn-primary btn-msg-ok" style="min-width: 100px;">Đồng ý</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const okBtn = overlay.querySelector('.btn-msg-ok');
    okBtn.focus();

    const close = () => {
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.remove();
        resolve(true);
      }, 150);
    };

    okBtn.addEventListener('click', close);
  });
}

// Override window.alert to automatically use showToast for errors!
window.alert = function (msg) {
  showToast(String(msg), 'error');
};

// ============================================================================
// REAL-TIME WEBSOCKETS SYSTEM (Socket.IO)
// ============================================================================
let socket = null;
if (typeof io !== 'undefined') {
  socket = io();

  socket.on('connect', () => {
    console.log('⚡ Real-time WebSocket connected:', socket.id);

    // Join order room if tracking code present in URL or page
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('code');
    if (!code) {
      const codeEl = document.querySelector('.tracking-header code, .page-header h1');
      if (codeEl && codeEl.textContent.includes('TRK-')) {
        const match = codeEl.textContent.match(/TRK-\d+-\d+/);
        if (match) code = match[0];
      }
    }

    if (code) {
      socket.emit('joinOrder', { trackingCode: code });
    }

    // Join dashboard room for admin pages
    if (getToken()) {
      socket.emit('joinDashboard');
    }
  });

  // 1. Listen for Order Status updates
  socket.on('orderStatusUpdated', (data) => {
    showToast(`⚡ REAL-TIME: Đơn ${data.trackingCode} vừa đổi sang: ${data.newStatusLabel}!`, 'info');

    const urlParams = new URLSearchParams(window.location.search);
    const currentCode = urlParams.get('code');
    if (currentCode === data.trackingCode || window.location.pathname.includes(data.trackingCode) || window.location.pathname.includes('/service-orders')) {
      setTimeout(() => window.location.reload(), 1000);
    }
  });

  // 2. Listen for Quote updates (Customer approve/reject or Technician quote)
  socket.on('quoteUpdated', (data) => {
    showToast(`⚡ REAL-TIME: ${data.message}`, data.quoteStatus === 'Approved' ? 'success' : 'error');

    setTimeout(() => window.location.reload(), 1000);
  });

  // 3. Listen for New Order Creation
  socket.on('newOrderCreated', (data) => {
    showToast(`⚡ ĐƠN HÀNG MỚI: ${data.customerName} (${data.deviceInfo}) - Mã ${data.trackingCode}`, 'success');

    if (window.location.pathname.includes('/dashboard') || window.location.pathname.includes('/service-orders')) {
      setTimeout(() => window.location.reload(), 1200);
    }
  });
}


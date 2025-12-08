import { logout } from "/src/features/auth/api/authApi.js";
import { getUser } from "/src/features/user/api/userApi.js";

    // Initialize all functionality
    fetchLayoutAndInitialize();


async function fetchLayoutAndInitialize() {
    try {
        const response = await fetch('/src/shared/component/layout.html');
        if (!response.ok) throw new Error('Failed to fetch layout.html');
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const headerHtml = doc.getElementById('layout-header')?.innerHTML;
        const footerHtml = doc.getElementById('layout-footer')?.innerHTML;

        injectHtml('header-placeholder', headerHtml);
        injectHtml('footer-placeholder', footerHtml);

        // After HTML is injected, run all dependent initialization logic
        initializeLayoutFunctionality();

    } catch (error) {
        console.error('Failed to load layout:', error);
    }
}

function initializeLayoutFunctionality() {
    // Render any icons that were just injected
    if (window.lucide) {
        lucide.createIcons();
    }

    // Set up all event listeners
    setupEventListeners();

    // Handle UI state based on authentication
    handleAuthUIState();
}

async function handleAuthUIState() {
    const loggedInView = document.getElementById('logged-in-view');
    const loggedOutView = document.getElementById('logged-out-view');
    const currentPath = window.location.pathname;

    if (!loggedInView || !loggedOutView) {
        console.warn('Auth view containers not found.');
        return;
    }

    // Special handling for login/signup pages: always hide right-side nav
    const isLoginPage =
        currentPath === '/login' ||
        currentPath.includes('/auth/pages/login/');

    const isSignupPage =
        currentPath === '/signup' ||
        currentPath.includes('/auth/pages/signup/');

    const isAuthPage = isLoginPage || isSignupPage;

    if (isAuthPage) {
        if (loggedInView) loggedInView.remove();
        if (loggedOutView) loggedOutView.remove();
        return;
    }

    // Normal handling for other pages based on authentication status

    if (window.authStore && window.authStore.isAuthenticated()) {
        loggedInView.style.display = 'flex';
        loggedOutView.style.display = 'none';
        await loadUserProfile();
    } else {
        loggedInView.style.display = 'none';
        loggedOutView.style.display = 'flex';
    }
}

async function loadUserProfile() {
    try {
        let user = window.authStore.getUser();
        if (!user) {
            console.log('Fetching user from server...');
            user = await getUser();
            console.log('User data from server:', user);
            window.authStore.setUser(user);
        }

        const profileImageUrl = window.authStore.getProfileImageUrl();
        const userImageElem = document.getElementById('user-menu-trigger');

        if (userImageElem) {
            if (profileImageUrl) {
                userImageElem.src = profileImageUrl;
                userImageElem.alt = `${user.nickname || 'User'}'s profile`;
            } else {
                userImageElem.src = '/assets/images/user.png';
            }
        }
    } catch (error) {
        console.error('Failed to load user profile:', error);
        if (error.response && error.response.status === 401) {
            console.log('Token expired. Clearing auth and redirecting to login.');
            window.authStore.clearAuth();
            window.location.href = '/login';
        }
    }
}

function setupEventListeners() {
    const userMenuTrigger = document.getElementById('user-menu-trigger');
    const userDropdown = document.getElementById('user-dropdown');
    const backButton = document.getElementById('back-button');

    // Hide back button on main page
    if (backButton && (window.location.pathname === '/' || window.location.pathname === '/index')) {
        backButton.style.display = 'none';
    }

    // Use a single, delegated event listener for clicks on the document
    document.addEventListener('click', (event) => {
        const logoutBtn = event.target.closest('#logout-button');
        if (logoutBtn) {
            event.preventDefault();
            handleLogout();
            return;
        }

        // Handle user dropdown toggle
        if (userMenuTrigger && userDropdown) {
            if (userMenuTrigger.contains(event.target)) {
                userDropdown.classList.toggle('show');
            } else if (!userDropdown.contains(event.target)) {
                userDropdown.classList.remove('show');
            }
        }
    });
}

async function handleLogout() {
    if (window.toast && window.toast.confirm) {
        const confirmed = await window.toast.confirm(
            "로그아웃",
            "정말 로그아웃하시겠습니까?",
            { confirmText: "로그아웃", cancelText: "취소" }
        );

        if (confirmed) {
            logout().catch(error => console.error('Server logout failed:', error));
            window.authStore.clearAuth();
            window.toast.info("로그아웃되었습니다.");
            window.location.href = '/login';
        }
    } else {
        // Fallback to browser confirm if toast system not available
        if (confirm("정말 로그아웃하시겠습니까?")) {
            logout().catch(error => console.error('Server logout failed:', error));
            window.authStore.clearAuth();
            window.location.href = '/login';
        }
    }
}

function injectHtml(id, html) {
    const placeholder = document.getElementById(id);
    if (placeholder && html) {
        placeholder.innerHTML = html;
    }
}
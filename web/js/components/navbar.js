// Navigation component initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeNavbar();
});

function initializeNavbar() {
    const navbar = document.querySelector('nav.navbar');
    if (!navbar) return;

    navbar.innerHTML = `
        <div class="container-fluid">
            <a class="navbar-brand" href="/">YAUSMA</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse" id="navbarContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link" href="/pages/stocks.html">Stocks</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/pages/news.html">News</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" id="portfolio-link" href="/pages/portfolio.html" style="display: none;">Portfolio</a>
                    </li>
                </ul>
                
                <div class="d-flex align-items-center">
                    <button id="theme-toggle" class="btn btn-outline-secondary me-2">
                        <i class="bi bi-moon-fill"></i>
                    </button>
                    
                    <div id="auth-buttons" class="d-flex">
                        <a href="/pages/auth.html" class="btn btn-outline-primary me-2">Sign In</a>
                        <a href="/pages/auth.html?action=register" class="btn btn-primary">Register</a>
                    </div>
                    
                    <div id="user-menu" class="dropdown" style="display: none;">
                        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            <i class="bi bi-person-circle"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item" href="/pages/portfolio.html">My Portfolio</a></li>
                            <li><a class="dropdown-item" href="/pages/pro.html">Upgrade to Pro</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><button class="dropdown-item" onclick="handleLogout()">Sign Out</button></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Initialize theme toggle
    initializeThemeToggle();
    
    // Update auth state
    updateAuthState();
}

function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === CONFIG.THEME.LIGHT ? CONFIG.THEME.DARK : CONFIG.THEME.LIGHT;
        
        // Update theme
        document.body.setAttribute('data-theme', newTheme);
        document.getElementById('theme-stylesheet').href = `css/themes/${newTheme}.css`;
        
        // Update icon
        themeToggle.innerHTML = `<i class="bi bi-${newTheme === CONFIG.THEME.LIGHT ? 'moon' : 'sun'}-fill"></i>`;
        
        // Save preference
        localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, newTheme);
    });
}

function updateAuthState() {
    const token = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_TOKEN);
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    const portfolioLink = document.getElementById('portfolio-link');

    if (token) {
        // User is logged in
        authButtons.style.display = 'none';
        userMenu.style.display = 'block';
        portfolioLink.style.display = 'block';
    } else {
        // User is not logged in
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
        portfolioLink.style.display = 'none';
    }
}

function handleLogout() {
    // Clear authentication token
    localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_TOKEN);
    
    // Update UI
    updateAuthState();
    
    // Redirect to home page
    window.location.href = '/';
} 
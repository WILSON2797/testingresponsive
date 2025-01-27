document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('#hamburger-menu');
    const navbarNav = document.querySelector('.navbar-nav');

    hamburger.addEventListener('click', function(e) {
        navbarNav.classList.toggle('active');
        e.preventDefault();
    });

    // Klik di luar sidebar untuk menghilangkan nav
    document.addEventListener('click', function(e) {
        if(!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
            navbarNav.classList.remove('active');
        }
    });
});

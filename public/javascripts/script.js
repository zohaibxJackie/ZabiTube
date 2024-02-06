const navBtn = document.querySelector('.nav-btn');
const primaryNav = document.querySelector('.primary-nav');
const mainBody = document.getElementById('main');

navBtn.addEventListener('click', function () {
    let visibility = primaryNav.getAttribute('data-visible');
    if (visibility === 'false') {
        primaryNav.setAttribute('data-visible', 'true');
        navBtn.setAttribute('aria-expanded', 'true');
    } else {
        primaryNav.setAttribute('data-visible', 'false');
        navBtn.setAttribute('aria-expanded', 'false');
    }
});
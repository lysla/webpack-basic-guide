import jquery from 'jquery';
window.jQuery = window.$ = jquery;

// Bootstrap Framework
import './scss/index.scss';
import '@popperjs/core';
import 'bootstrap';

import "slick-carousel";
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

//#region bootstrap navbar + hamburger + body scroll lock
var navbarMain = document.getElementById('navbarMain')
navbarMain.addEventListener('show.bs.collapse', function () {
    $('.navbar-toggler .hamburger').addClass('is-active');
    let scrollableNav = document.querySelector('#navbarMain');
    disableBodyScroll(scrollableNav);
});
navbarMain.addEventListener('hidden.bs.collapse', function () {
    $('.navbar-toggler .hamburger').removeClass('is-active');
    let scrollableNav = document.querySelector('#navbarMain');
    enableBodyScroll(scrollableNav);
});
//#endregion
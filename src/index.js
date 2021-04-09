// Bootstrap Framework
import './scss/index.scss';
import 'popper.js';
import 'bootstrap';

// Tailwind CSS Framework
//import './pcss/index.pcss';

import "slick-carousel";
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

//#region bootstrap navbar + hamburger + body scroll lock
$('#navbarMain').on('show.bs.collapse', function (e) {
    $('.navbar-toggler .hamburger').addClass('is-active');
    let scrollableNav = document.querySelector('#navbarMain');
    disableBodyScroll(scrollableNav);
});
$('#navbarMain').on('hidden.bs.collapse', function (e) {
    $('.navbar-toggler .hamburger').removeClass('is-active');
    let scrollableNav = document.querySelector('#navbarMain');
    enableBodyScroll(scrollableNav);
});
//#endregion
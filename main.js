wow = new WOW({
    boxClass: 'wow', // default
    animateClass: 'animated', // default
    offset: 100, // default
    mobile: true, // default
    live: true, // default
    duration: 2,
})
wow.init();

$(document).ready(function () {
    $(window).scrollTop(2);
    $(window).scroll(function () {
        $('.content-wrapper').each(function () {
            var a = $(this).offset().top;
            var b = $(window).scrollTop();
            var c = $(window).height();
            if (b + c > a) {
                $(this).addClass('active');
            } else {
                $(this).removeClass('active');
            }
        });
    });
});

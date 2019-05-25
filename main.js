new WOW().init();

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

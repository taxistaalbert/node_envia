$raiz = '';
if (window.location.href.indexOf("app_dev.php") > -1) {
    $raiz = '/app_dev.php';
}
var MenuServicios = $('.menu_sticky');
if (MenuServicios.length > 0) {
    var MenuTop = MenuServicios.offset().top;
} else {
    var MenuTop = 0;
}

var WTop;


$(function () {
    // fixRegistro();
    // departamentoRegChange();
    // newsletter();
    if (isMobile) {
        var slideout = new Slideout({
            'panel': document.getElementById('panel'),
            'menu': document.getElementById('menu'),
            'padding': 256,
            'tolerance': 70,
            'side': 'right',
            'touch': false
        });
        document.querySelector('.call_menu').addEventListener('click', function () {
            slideout.toggle();
        });
        document.querySelector('.hamburguesa').addEventListener('click', function () {
            slideout.toggle();
        });
        /*$(".tienda").click(function () {
            $(".opcTienda").toggle("slow", function () {
            });
        });

        $(".nosotrosLi").click(function () {
            $(".opcNosotros").toggle("slow", function () {
            });
        });*/

    }

    $(".show_search").click(function () {
        $(".buscador").animate({
            width: "toggle"
        });
    });

    $(".show_desplega_sticky").click(function () {
        $(this).parents().next(".desplega_sticky").animate({
            height: "toggle"
        });

    });

    jQuery('.num_guia').charactersRemaining({
        singleCharacterText: '## character remaining',
        multipleCharacterText: '## characters remaining'
    });


    $('.show_desplega').click(function (e) {
        if(e.target.id == "boton-ingresa"){
            $('#boton-registro').removeClass('show_active');
            $('#registro-header').slideUp();
            if($('#boton-ingresa').hasClass('show_active')){
                $('#boton-ingresa').removeClass('show_active');
                $('#login-header').slideUp();
            }
            else {
                $('#boton-ingresa').addClass('show_active');
                $('#login-header').slideDown();
            }
        }
        else if(e.target.id == "boton-registro"){
            $('#boton-ingresa').removeClass('show_active');
            $('#login-header').slideUp();
            if($('#boton-registro').hasClass('show_active')){
                $('#boton-registro').removeClass('show_active');
                $('#registro-header').slideUp();
            }
            else {
                $('#boton-registro').addClass('show_active');
                $('#registro-header').slideDown();
            }
        }
    });


    if (!isMobile()) {
        var wShowDes = $('.show_desplega:nth-of-type(2)').outerWidth();
        $('.desplega_log_regis:nth-of-type(1)').css('right', wShowDes);
    }


    $(".show_submenu").hover(function () {
        $(this).find('.submenu_desplega').stop().slideToggle('fast');
    });

    $('.show_form').click(function () {
        $('.class_line').removeClass('class_line');
        if ($(this).next('.desplega_form').css('display') == 'none') {
            $(this).addClass('class_line');
        }
        $('.desplega_form').slideUp();
        $('.desplega_categoria').stop().slideUp();
        $(this).next('.desplega_form').stop().slideToggle();
    });

    $('.show_categoria').click(function () {

        var selector = $(this).attr('data-selector');
        $('.desplega_categoria').stop().slideUp();

        if (selector == 1) {
            $('.desplega_docs').stop().slideDown();
        }
        if (selector == 2) {
            $('.desplega_paquetes').stop().slideDown();
        }
        if (selector == 3) {
            $('.desplega_mercancia').stop().slideDown();
        }

        $('.class_active').removeClass('class_active');
        $(this).addClass('class_active');
    });


    $('.delete_show').click(function () {
        // $(this).parents('tr').next('.delete').slideToggle();
        $(this).parents('tr').next('.delete').toggleClass('visible_delete');
    });


    var statusInput = 0;
    $('.editar_item').click(function () {
        var SelectImput = $(this).parent().parent().find('input');
        if (statusInput == 0) {
            SelectImput.attr("readonly", "readonly");
            SelectImput.css('border', '1px solid transparent');
            statusInput = 1;
        } else {
            SelectImput.attr("readonly", false);
            statusInput = 0;
            SelectImput.css('border', '1px solid #878787');
        }
    });


    $('.tooltip').tooltipster({
        animation: 'grow',
        theme: 'tooltipster-noir',
        maxWidth: 300,
        //trigger: 'click',
        trigger: 'custom',
    });

    $('.tooltipH').tooltipster({
        animation: 'grow',
        maxWidth: 300,
        trigger: 'custom',
        triggerOpen: {
            mouseenter: true,
            touchstart: true
        },
        triggerClose: {
            mouseleave: true,
            originClick: true,
            touchleave: true
        }
    });


    $(".scroll").mCustomScrollbar();


    var HmenuServicios = MenuServicios.outerHeight();
    $('.cont_menu_sticky').css('height', HmenuServicios);

  /*  var swiperBannerHome = new Swiper('.cont_rotador', {
        autoplay: 6000,
        speed: 600,
        prevButton: '.swiper-button-next',
        nextButton: '.swiper-button-prev',
        loop:true
    });*/

    var swiperServices = new Swiper('.wrapp_swiper_services', {
        speed: 1500,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.arrow_next',
            prevEl: '.arrow_prev',
        },
        simulateTouch: false
    });


    $('.click_services li a').click(function () {
        $('.click_services li a').removeClass('active');
        $(this).addClass('active');
    });

    $('.click_services li:nth-of-type(1) a').click(function () {
        swiperServices.slideTo(0);
    });
    $('.click_services li:nth-of-type(2) a').click(function () {
        swiperServices.slideTo(1);
    });

    $('.click_services li:nth-of-type(3) a').click(function () {
        swiperServices.slideTo(2);
    });

    $('.cifras').onScreen({
        toggleClass: 'itsOn',
        tolerance: 0,
        doIn: function () {
            AnimateCount();
        }
    });


    $('.content_doot').each(function () {
        $(this).dotdotdot({
            ellipsis: "\u2026 "
        });
    });

    $(".share").each(function () {
        $(".share").jsSocials({
            url: "http://www.enviacolvanes.com.co/",
            shares: ["facebook"],
            text: "text to share",
            label: "comparte",
            showLabel: true,
            shareIn: "popup"
        });
    });

    // console.log('cambie');
    // $('.cate').click(function (e) {
    //     e.preventDefault();
    //     $('.category-tabs a').removeClass('active');
    //     $(this).addClass('active');
    //     $('.cat').hide();
    //     $($(this).data('cat')).show();
    // })
    // var h = 0;
    // $('.product-info').each(function () {
    //     h_temp = parseInt($(this).height());
    //     h = Math.max(h,h_temp);
    // });
    // $('.product-info').not('.price').height(h);
    // likes();
    // $(".share-icons").each(function () {
    //     $(this).jsSocials({
    //         url: $(this).data('url'),
    //         showLabel: false,
    //         showCount: false,
    //         shares: ["twitter", "facebook", "pinterest"]
    //     });
    // });
    
    
    var swiperClientes = new Swiper('.clientes .contain_slider', {
        autoplay: 6000,
        speed: 600,
        slidesPerView: 4,
        prevButton: '.clientes .arrow_prev',
        nextButton: '.clientes .arrow_next',
        loop:true,
        breakpoints: {
            768: {
                slidesPerView: 3
            },
            480: {
                slidesPerView: 2
            },
            420: {
                slidesPerView: 1
            }
        }
    });

    var swiperColaboradores = new Swiper('.colaboradores .contain_slider', {
        centeredSlides: true,
        slidesPerView: '3',
        simulateTouch: false,
        autoplay: 4000,
        speed: 600,
        prevButton: '.colaboradores .arrow_prev',
        nextButton: '.colaboradores .arrow_next',
        breakpoints: {
            768: {
                slidesPerView: 1
            }}

    });

    var swiperColaboradoresDos = new Swiper('.colaboradores', {
        centeredSlides: true,
        simulateTouch: false,
        slidesPerView: '1',
        autoplay: 4000,
        speed: 600,
        prevButton: '.colaboradores .arrow_prev',
        nextButton: '.colaboradores .arrow_next'
    });

    var swiperWork = new Swiper('.work .cols_work', {
        speed: 600,
        spaceBetween: 30,
        slidesPerView: 1,
        prevButton: '.work .arrow_prev',
        nextButton: '.work .arrow_next'
    });

   /* var swiperNoti = new Swiper('.slider_noticia .contain_slider', {
        autoplay: {
            delay: 9000,
            disableOnInteraction: false,
        },
        speed: 600,

        spaceBetween: 30,
        slidesPerView: 1,
        prevButton: '.arrow_prev',
        nextButton: '.arrow_next',
        paginationClickable: true,
        pagination: '.slider_noticia .swiper-pagination'

    });
*/
    var swiperfilterSrvices = new Swiper('.rotate_filter_icons .content_icons', {
        speed: 1000,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        prevButton: '.arrow_prev',
        nextButton: ' .arrow_next',

        slidesPerView: '5',
        breakpoints: {
            1024: {
                slidesPerView: 4
            },
            736: {
                slidesPerView: 3
            },
            499: {
                slidesPerView: 2
            },
            414: {
                slidesPerView: 1
            }
        }
    });

    $(document).ready(function () {
        if(window.location.href.indexOf("quienes_somos") > -1) {
            swiperColaboradores.controller.control = swiperColaboradoresDos;
            swiperColaboradoresDos.controller.control = swiperColaboradores;


        }
    });
    
    var $easyzoom = $('.easyzoom').easyZoom();

    var api = $easyzoom.data('easyZoom');

    encuesta();
    // labelHeight();

    $(".show_select").click(function () {
        $(this).next('.down_select').slideToggle('fast');
    });

    $('.datetimepicker8').datetimepicker({
        format: 'DD/MM/YYYY',
        locale: 'es'
    });

    $(".rateYo").rateYo({
        normalFill: "#9C9CA0",
        starWidth: "18px",
        multiColor: {
            "startColor": "#88888A",
            "endColor": "#565657"
        }
    });

    $('.nav-tabs > li > a').on('click', function (e) {
        e.preventDefault();
    });

    $('.to').on('click', function (event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top
            }, 1000);
        }
    });


    // $('.check_envia').click(function () {
    //     var checkYes = $(this).find("input[type=checkbox]").prop("checked");
    //     if(checkYes){
    //         $(this).find('.check').addClass('check_on');
    //     }else{
    //         $(this).find('.check').removeClass('check_on');
    //     }
    // });

    $(".show_locations").click(function () {
        $('.locations').slideToggle('fast');
    });


    // $('.menu_documentos li').click(function () {
    //     $(this).siblings().slideToggle('fast');
    // });

    TweenMax.to('.rotatepositive', 40, {
        rotation: -360, repeat: -1,
        ease: Power0.easeNone
    });

    TweenMax.to('.rotatenegative', 40, {
        rotation: 360, repeat: -1,
        ease: Power0.easeNone
    });

    // $("input[type='number']").stepper();


    bs_input_file();

    formRastrea();

    hBanner();

});

var hWindow = 0;

function hBanner() {
    hWindow = $(window).height();
    $('.hBanner').css('min-height', hWindow * 0.6);
}

function formRastrea() {
    $('input').keyup(function () {
        console.log("Handler for .keypress() called.");
        if (this.value.length == this.maxLength) {
            //console.log('hay txt');
            console.log($(this).next().next('input:not(.disabled)'));
            var $next = $(this).next().next('input');
            while ($next.hasClass("disabled")) {
                $next = $next.next().next('input');
            }
            $next.focus();
        }
    });
}

$(document).ready(function () {

});


$(window).resize(function () {
    labelHeight();
    if (!isMobile()) {
        var wShowDes = $('.show_desplega:nth-of-type(2)').outerWidth();
        $('.desplega_log_regis:nth-of-type(1)').css('right', wShowDes);

        hBanner();
    }
});


$(window).on("load", function () {

});

$(window).scroll(function () {

    fixed_menu();
});

function fixed_menu() {
    WTop = $(window).scrollTop();

    if (MenuServicios.length > 0) {
        if (WTop >= MenuTop) {
            MenuServicios.addClass('menu_fixed');
        } else {
            MenuServicios.removeClass('menu_fixed');
        }
    }
}


function isMobile() {

    return (/Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}

function isIpad() {
    return navigator.userAgent.match(/iPad/i);
}


function fixRegistro() {
    console.log('fixRegistro');
    $('#fos_user_registration_form_username').val($('#fos_user_registration_form_email').val());
    $('#fos_user_registration_form_email').change(function () {
        console.log('in fixRegistro');
        $('#fos_user_registration_form_username').val($('#fos_user_registration_form_email').val());
    })
}

function departamentoRegChange() {
    if (window.location.href.indexOf("registro") > -1) {
        if ($.isNumeric($('#fos_user_registration_form_ciudad').val())) {
            getCiudadesDeptReg(false);
        }
        $('#fos_user_registration_form_departamento').change(function () {
            getCiudadesDeptReg(true);
        });
    }
}

function getCiudadesDeptReg(loader) {
    if (loader)
        $.LoadingOverlay("show", {zIndex: 9999, image: '/js/jquery-loading-overlay/src/loading.gif'});
    $.ajax({
        url: $raiz + "/ciudades-dept/" + $('#fos_user_registration_form_departamento').val() + "/" + $('#fos_user_registration_form_ciudad').val(),
    })
        .done(function (html) {
            $('#fos_user_registration_form_ciudad').html(html);
        })
        .fail(function () {
        })
        .always(function () {
            $.LoadingOverlay("hide");
        });

}

function likes() {
    $('.like').each(function () {
        id = $(this).data('id');
        st = localStorage.getItem('like_' + id);
        if (st == 1) {
            $(this).addClass('active');
        }
    });
    $('.like').click(function (e) {
        console.log('like');
        e.preventDefault();
        id = $(this).data('id');
        st = localStorage.getItem('like_' + id);
        if (st == 1) {
            st = localStorage.setItem('like_' + id, 0);
            $(this).removeClass('active');
        } else {
            st = localStorage.setItem('like_' + id, 1);
            $(this).addClass('active');
        }
    })

    $('.likeb').each(function () {
        id = $(this).data('id');
        st = localStorage.getItem('likeb_' + id);
        if (st == 1) {
            $(this).addClass('active');
        }
    });
    $('.likeb').click(function (e) {
        console.log('likeb');
        e.preventDefault();
        id = $(this).data('id');
        st = localStorage.getItem('likeb_' + id);
        if (st == 1) {
            st = localStorage.setItem('likeb_' + id, 0);
            $(this).removeClass('active');
        } else {
            st = localStorage.setItem('likeb_' + id, 1);
            $(this).addClass('active');
        }
    })
}

var form_news;

function newsletter() {
    $('#form_newsletter').submit(function (e) {
        e.preventDefault();
        $.LoadingOverlay("show", {zIndex: 9999, image: '/js/jquery-loading-overlay/src/loading.gif'});
        data = $(this).serialize();
        $.ajax({
            url: "/app_dev.php/newsletter/" + $(this).find('input[type="email"]').val()
        }).done(function (data) {
            console.log(data);
            $.LoadingOverlay("hide");
            $('#exitoso').remove();
            if (data.success == 1 || data.success == "1") {
                console.log('entre');
                //$('#form_newsletter').prepend('<p id="exitoso">Inscrito exitosamente</p>');
                $('#form_newsletter').find('input[type="email"]').val('');
                $('#form_newsletter').find('input[type="email"]').parent().before('<p id="exitoso">Inscrito exitosamente</p>');
            } else {
                $('#form_newsletter').find('input[type="email"]').parent().before('<p id="exitoso" class="error">Email inscrito anteriormente</p>');
            }
        });
    });
}

var markers = [], map;

function encuesta() {
    $('#encuesta').submit(function (e) {

        var cont = true;
        $('.opcion_cont').each(function () {
            var cant_check = $(this).find('input:checked').length;
            console.log(cant_check);
            if (cant_check == 0)
                cont = false;
        });
        if (!cont) {
            e.preventDefault();
            alert('Debes marcar todas las respuestas');
        }
    })
}


function AnimateCount() {
    $('.document_num').each(function () {

        var numero_EndNum = parseInt($(this).attr('data-num-max'));
        var comma_separator_number_step = $.animateNumber.numberStepFactories.separator('.');
        if (numero_EndNum) {
            $(this).animateNumber({
                number: numero_EndNum,
                numberStep: comma_separator_number_step
            }, 3000);
        }


    });
}


function labelHeight() {
    var Valorsito = $('.label_alto');
    var h = 0;
    Valorsito.each(function () {
        h_temp = parseInt($(this).height());
        h = Math.max(h, h_temp);
    });
    Valorsito.height(h);
}

function bs_input_file() {
    $(".input-file").before(
        function () {
            if (!$(this).prev().hasClass('input-ghost')) {
                var element = $("<input type='file' class='input-ghost' style='visibility:hidden; height:0'>");
                element.attr("name", $(this).attr("name"));
                element.change(function () {
                    element.next(element).find('input').val((element.val()).split('\\').pop());
                });
                $(this).find("button.btn-choose").click(function () {
                    element.click();
                });
                $(this).find("button.btn-reset").click(function () {
                    element.val(null);
                    $(this).parents(".input-file").find('input').val('');
                });
                $(this).find('input').css("cursor", "pointer");
                $(this).find('input').mousedown(function () {
                    $(this).parents('.input-file').prev().click();
                    return false;
                });
                return element;
            }
        }
    );
}


$("body").click(function(e) {
    // if(e.target.id !== 'login-header' && e.target.id !== 'boton-ingresa' && e.target.id !== 'registro-header' && e.target.id !== 'boton-registro'){
    if(!($('#login-header').has(e.target).length>0)&& e.target.id !== 'login-header' && e.target.id !== 'boton-ingresa' && !($('#registro-header').has(e.target).length>0) && e.target.id !== 'registro-header' && e.target.id !== 'boton-registro'){
        $("#login-header").slideUp();
        $("#boton-ingresa").removeClass('show_active');
        $("#registro-header").slideUp();
        $("#boton-registro").removeClass('show_active');
    }
});


function cambiarUnidadesDoc(obj){
    var num = $('#unidades-doc');
    var value = parseInt(num.value);
    if(obj.id == "down"){
        value--;
    }else{
        value++;
    }
    num.value = value;
}

$('.titulo-seccion').click(function (e) {
    if(e.target.id == "titulo-rastrea"){
        $('#titulo-cotiza').removeClass('active');
        $('#contenido-cotiza').slideUp();
        if($('#titulo-rastrea').hasClass('active')){
            $('#titulo-rastrea').removeClass('active');
            $('#contenido-rastrea').slideUp();
        }
        else {
            $('#titulo-rastrea').addClass('active');
            $('#contenido-rastrea').slideDown();
        }
    }
    else if(e.target.id == "titulo-cotiza"){
        $('#titulo-rastrea').removeClass('active');
        $('#contenido-rastrea').slideUp();
        if($('#titulo-cotiza').hasClass('active')){
            $('#titulo-cotiza').removeClass('active');
            $('#contenido-cotiza').slideUp();
        }
        else {
            $('#titulo-cotiza').addClass('active');
            $('#contenido-cotiza').slideDown();
        }
    }
});

function closeNotif() {
    $('.modal-notif').addClass('escondido');
}

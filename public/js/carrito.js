$(function () {
    listado_productos();
    clickColores();
    agregar();
    departamentoChange();
    //getCiudadesDept();
    getCostoEnvio();
    hideUser();
    activeTalla();
    formEnvio();
    reUseDir();
});
function formEnvio(){
    $('#comprar').click(function (e) {
        e.preventDefault();
        $('#form_envio').submit();
    });
}

function clickColores(){
    $('.colors a').click(function(){
        var check = $(this).find('input');
        if (check.is(':checked')) {
            check.prop('checked', false);
            $(this).removeClass('active');
        }else {
            check.prop('checked', true);
            $(this).addClass('active');
        }
        filtrar();
    });
}

function listado_productos(){
    var inputs = $('.filter input');
    inputs.click(function () {
        filtrar();
    });
}
function filtrar() {
    var arrs = [], arrs_class = [];
    $('.filter ul.grupo').each(function () {
        arrs.push($(this).find('input:checked'));
    });
    $.each( arrs, function( index, value ){
        var arr_temp = $.map( value, function( el ) {
            return ( '.'+$(el).data('class') );
        });
        arrs_class.push(arr_temp);
    });
    var cp = [];
    for(var i = 0; i < arrs_class.length - 1; i++){
        if(i == 0)
            cp = cartesianProductOf(arrs_class[i],arrs_class[i+1]);
        else
            cp = cartesianProductOf(cp,arrs_class[i+1]);
    }
    cp = cp.join( "," );
    $('.list .item').hide();
    if(cp)
        $(cp).show();
    else
        $('.list .item').show();
}

function cartesianProductOf(arr1,arr2) {
    var customerDebtorMatrix = [];
    for (var i = 0; i < arr1.length; i++) {
        for (var l = 0; l < arr2.length; l++) {
            customerDebtorMatrix.push(arr1[i]+arr2[l]);
        }
    }
    if(arr1.length == 0)
        return arr2;
    if(arr2.length == 0)
        return arr1;
    return customerDebtorMatrix;
};

function agregar() {
    $('#cant').change(function () {
        console.log($(this).val());
        $('#btn_add').data('cant',$(this).val());
    })
    $('.eliminar').click(function (e) {
        e.preventDefault();
        $.LoadingOverlay("show",{ zIndex: 9999, image: '/js/jquery-loading-overlay/src/loading.gif'});
        addCarritoTalla($(this).data('id'),$(this).data('cant'),$(this).data('id-talla'));
    });
    $('.add_talla').click(function(e){
        e.preventDefault();
        $.LoadingOverlay("show",{ zIndex: 9999, image: '/js/jquery-loading-overlay/src/loading.gif'});
        addCarritoTalla($(this).data('id'),$(this).data('cant'),$('#select-talla').val());
    })
    $('.select-cant').change(function () {
        $.LoadingOverlay("show",{ zIndex: 9999, image: '/js/jquery-loading-overlay/src/loading.gif'});
        setCarritoTalla($(this).data('id'),$(this).val(),$(this).data('id-talla'));
    });

    $('.eliminar_bono').click(function (e) {
        e.preventDefault();
        removeCarritoBono($(this).data('id'));
    });
}

function addCarrito(id,cant){
    $.ajax({
        url: $raiz+"/add-carrito/"+id+"/"+cant,
    })
    .done(function(data) {
        console.log(data.cantidad);
        $('#cantidad_'+id).html(data.cantidad);
        verGocarrito();
        if(window.location.href.indexOf("datos") > -1) {
            /*
             if(data.cantidad < 1){
             $('#fila_'+id).remove();
             }
             */
            window.location.reload();
        }
    })
    .fail(function() {
    })
    .always(function() {
    });

    function verGocarrito(){
        TweenMax.to($('.go_carrito'), 0.8, { 'opacity': 1 });
    }
}

function addCarritoTalla(id,cant,talla){

    $.ajax({
        url: $raiz+"/add-carrito-talla/"+id+"/"+cant+"/"+talla,
    })
    .done(function(data) {
        console.log(data.cantidad);
        try {
            fbq('trackCustom', 'carrito', {
                producto_id: id,
                talla: talla,
                cantidad: cant
            });

        }catch (e){
            console.log("Fallo FB track "+e.toString());
        }

        if(window.location.href.indexOf("carrito-de-compras") > -1) {
            window.location.reload();
        }
        window.location = $raiz + '/carrito-de-compras';
    })
    .fail(function() {
        $.LoadingOverlay("hide");
    })
    .always(function() {
    });
}

function removeCarritoBono(id){

    $.ajax({
        url: $raiz+"/remove-carrito-bono/"+id,
    })
        .done(function(data) {
            console.log(data.cantidad);
            if(window.location.href.indexOf("carrito-de-compras") > -1) {
                window.location.reload();
            }
            window.location = $raiz + '/carrito-de-compras';
        })
        .fail(function() {
            $.LoadingOverlay("hide");
        })
        .always(function() {
        });
}

function setCarritoTalla(id,cant,talla){

    $.ajax({
        url: $raiz+"/set-carrito-talla/"+id+"/"+cant+"/"+talla,
    })
        .done(function(data) {
            console.log(data.cantidad);
            if(window.location.href.indexOf("carrito-de-compras") > -1) {
                window.location.reload();
            }
            window.location = $raiz + '/carrito-de-compras';
        })
        .fail(function() {
            $.LoadingOverlay("hide");
        })
        .always(function() {
        });
}

/****  Dirección ***/

function departamentoChange(){
    if($.isNumeric($('#envio_ciudad').val())){
        getCiudadesDept(false);
    }
    $('#envio_departamento').change(function () {
        getCiudadesDept(true);
    });
}
function getCiudadesDept(loader){
    if(window.location.href.indexOf("carrito-de-compras") > -1){
        if(loader)
            $.LoadingOverlay("show",{ zIndex: 9999, image: '/js/jquery-loading-overlay/src/loading.gif'});
        $.ajax({
            url: $raiz+"/ciudades-dept/"+$('#envio_departamento').val()+"/"+$('#envio_ciudad').val(),
        })
        .done(function(html) {
            $('#envio_ciudad').html(html);
            costoEnvio();
        })
        .fail(function() {
        })
        .always(function() {
            $.LoadingOverlay("hide");
        });
    }

}
function getCostoEnvio(){
    $('#envio_ciudad').change(function () {
        costoEnvio();
    });
}
function costoEnvio(){
    console.log('costo');
    $('#costo-envio-span').html($('#envio_ciudad').find(':selected').data('costo'));
    $('#costo-envio').val($('#envio_ciudad').find(':selected').data('costo'));
    var result = parseInt($('#total-carrito').val()) + parseInt($('#envio_ciudad').find(':selected').data('costo-noformato'));
    var iva = Math.round(result * 0.19/1.19);
    $('#carrito-iva').html("$" + addCommas( iva ))
    $('#total-resultado').html("$" + addCommas(result));
    console.log(result,iva);

    $('#info_sub').html($('#subtotal').html());
    $("#info_envio").html($('#envio_ciudad').find(':selected').data('costo'));
    $('#info_iva').html($('#carrito-iva').html());
    $('#info_total').html($('#total-resultado').html());

}

function addCommas(nStr)
{
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function hideUser(){
    $('#envio_user').parent().hide();
}

function activeTalla(){
    $('.size a').click(function(){
        var value = $(this).data('value');
        $('#select-talla').val(value);
        $('.size a').removeClass('active');
        $(this).addClass('active');
    });
}

function reUseDir() {
    changeDir();
    $('#direccion').change(function () {
        changeDir();
    })
}
function changeDir() {
    if ($('#direccion').is(":checked"))
    {
        $('#envio_direccion').val($('#envio_direccion').data('dir'));
    }else{
        $('#envio_direccion').val('');
    }
}
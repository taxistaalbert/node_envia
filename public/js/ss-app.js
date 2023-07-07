$(document).ready(function () {
    $('*[data-ss-pos]').each(function (i, input) {
            var $input = $(input);
            $input.keydown(function (e) {

                var pos = $input.data('ssPos');
                if ($input.val().length === 0) {
                    var $prev = $input.prev().prev();
                    if (pos > 0 && [8, 46].indexOf(e.keyCode) >= 0) {
                        while ($prev.hasClass("disabled")) {
                            $prev = $prev.prev().prev();
                        }
                        ////console.log($prev);
                        $prev.focus();
                    }
                }
            });
        }
    );

});

function ajustarCotizador() {
    $.getScript("js/utils.js", function () {

        console.clear();
        var modal_content = $(".modal-content");
        modal_content.css("background", "transparent");
        modal_content.css("border-color", "transparent");
        modal_content.css("box-shadow", "none");
        $("#rastrea-form").remove();
        $("#cotizador-form").css("border-radius", "8px");

        /*var sf = $(".show_form")
        if ($(sf).next('.desplega_form').css('display') == 'none') {
            $(sf).addClass('class_line');
        }
        $('.desplega_form').slideUp();
        $('.desplega_categoria').stop().slideUp();
        $(sf).next('.desplega_form').stop().slideToggle();
        sf.css("pointer-events", "none");*/
        var sf = $("#titulo-cotiza");
        sf.click();
        sf.css("pointer-events", "none");
        sf.closest("ul").show();

        $.LoadingOverlay("hide");
    });
}

var app = angular.module('ss', ['ui.bootstrap', 'ngSanitize', 'selectize', 'ngCookies', 'naif.base64', 'facebook']);

$('body').on('keyup', '.rastrea-num-invalid', function () {
    var $input = $(this);
    if ($input.val().toString().length > 0) {
        $input.removeClass("rastrea-num-invalid");
    }
});

var url = window.location.href
var arr = url.split("/");
url = arr[0] + "//" + arr[2];


app.service('$envia', function ($http, $rootScope, $auth, $uibModal, Facebook) {

    var confJSON;
    $http.get(url + "/lib/conf.json")
        .then(function (res) {
            confJSON = res.data;
            ////console.log(confJSON);
            $rootScope.$broadcast("ssConf", this);
        });

    this.conf = function () {
        return confJSON;
    };

    this.ingresar = function (user, pass) {
        var data = {}
        data = {
            "email_cliente": user,
            "contrasena": pass,
        };

        return new Promise(function (resolve, reject) {

            $http.post(confJSON.ingreso, data).then(
                function (res) {
                    var userData = res.data;
                    userData.EJWT = userData.mitoken;
                    $auth.setUser(userData);
                    $rootScope.$broadcast("userLoggedIn", userData);
                    resolve(userData);
                },
                function (err) {
                    var errorData = err.data
                    ////console.log(err);
                    $rootScope.$broadcast("userLoggedIn", errorData);
                    reject(errorData);
                }
            );
        });

    };

    this.fbLogin = function () {

        return new Promise(function (resolve, reject) {

            // From now on you can use the Facebook service just as Facebook api says
            Facebook.login(function (response) {
                // Do something with response.
                //console.log(response);
                if (response.authResponse && response.authResponse.accessToken) {
                    $http.get(confJSON.fb2jwt + "?access_token=" + response.authResponse.accessToken).then(function (res) {

                        var jwt = res.data.jwt;
                        $auth.setJWT(jwt);
                        $http.get(confJSON.whoami).then(
                            function (e_user) {
                                var userData = e_user.data;
                                userData.EJWT = userData.mitoken;
                                $auth.setUser(userData);
                                //console.log(userData);
                                $rootScope.$broadcast("userLoggedIn", userData);
                                resolve(userData);
                            },
                            function (err) {
                                var errorData = err.data
                                ////console.log(err);
                                $rootScope.$broadcast("userLoggedIn", errorData);
                                reject(errorData);
                            }
                        );
                        ;
                    });
                }
            });

        });

    };

    this.actualizarUsuario = function (cb, eb) {
        $http.get(confJSON.whoami).then(
            function (e_user) {
                var userData = e_user.data;
                userData.EJWT = userData.mitoken;
                $auth.setUser(userData);
                //console.log(userData);
                $rootScope.$broadcast("userLoggedIn", userData);
                cb && cb(userData);
            },
            function (err) {
                var errorData = err.data;
                eb && eb(errorData);
            }
        );
    };

    this.registrar = function (nombre, tipo_documento, num_documento, direccion, ciudad, telefono, correo, celular, contrasena) {

        var data = {}
        data = {
            "nom_cliente": nombre,
            "tipoid_num_cliente": tipo_documento,
            "num_cliente": num_documento,
            "dir_cliente": direccion,
            "ciudad": ciudad,
            "tel_cliente": telefono,
            "email_cliente": correo,
            "tel_celular": celular,
            "contrasena": contrasena
        }

        return new Promise(function (resolve, reject) {
            
            $http.post(confJSON.registrarse, data).then(
                function (res) {
                    var regData = res.data;
                    regData.EJWT = regData.mitoken;
                    $auth.setUser(regData);
                    $rootScope.$broadcast("userLoggedIn", regData);
                    resolve(regData);
                    console.log(regData.mitoken);
                    
                },
                function (err) {
                    console.log(err);
                    reject(err.data);
                }
            );

        });
    };

    this.ContactoLanding = function (tipoIdentificacion, Identificacion, nombre, telefono, e_mail, empresa, url, cod_ciudad, declaracion, envios, direccion) {

        var data = {}
        data = {
            "tipoid": tipoIdentificacion,
            "identificacion": Identificacion,
            "nombre": nombre,
            "telefono": telefono,
            "e_mail": e_mail,
            "empresa": empresa,
            "url": url,
            "cod_ciudad": cod_ciudad,
            "declaracion": declaracion,
            "envios": envios, 
            "direccion": direccion
        }

        return new Promise(function (resolve, reject) {

            $http.post(confJSON.contactenosEcommerce, data).then(
                function (res) {
                    var regData = res.data;
                    regData.EJWT = regData.mitoken;
                    resolve(regData);
                    console.log(regData.respuesta);

                },
                function (err) {
                    console.log(err);
                    reject(err.data);
                }
            );

        });
    };

    this.salir = function () {
        $auth.deletUser();
        $rootScope.$broadcast("userLoggedIn", null);
    };


    this.abrirModalRastrea = function (guia) {
        var modalInstance = $uibModal.open({
            templateUrl: '/modals/rastrear-modal.html',
            controller: 'RastreaModalInstanceCtrl',
            size: 'lg',
            resolve: {
                guia: function () {
                    return guia;
                },
                bandera: function () {
                    return "";
                }
            }
        });
    };

    function cargarRegionales($scope) {

        $http.get(this.conf().regionales).then(
            function (res) {
                $scope.regionales = res.data[0].listado
            },
            function (err) {
                $timeout(function () {
                    cargarRegionales();
                }, 1000)
            }
        );

    };

    this.cargarRegionales = cargarRegionales;

    function cargarCiudades($scope) {
        var data = {
            "cod_regional": 1,
            "cod_servicio": 3
        }

        $http.post(this.conf().cubrimiento, data).then(
            function (res) {
                $scope.ciudades = res.data[0].listado;

            },
            function (err) {
                $timeout(function () {
                    cargarCiudades();
                }, 1000)
            }
        );
    }

    this.cargarCiudades = cargarCiudades;

    function cargarOfertasLaborales($scope) {
        $http.get(this.conf().consultaOfertasLaborales).then(
            function (res) {
                $scope.ofertas = res.data[0].listado;

            },
            function (err) {
                $timeout(function () {
                    cargarOfertasLaborales($scope);
                }, 1000)
            }
        );
    };

    this.cargarOfertasLaborales = cargarOfertasLaborales;

    this.actualizarDatosUsuario = function (data) {

        /* var data = {

             "nom_cliente": $scope.usuario.nom_cliente,
             "tipoid_num_cliente": $scope.usuario.num_cliente,
             "num_cliente": $scope.usuario.tipoid_num_cliente,
             "dir_cliente": $scope.usuario.dir_cliente,
             "tel_cliente": $scope.usuario.tel_cliente,
             "tel_celular": $scope.usuario.tel_celular,
             "ciudad": $scope.usuario.ciudad,
             "email_cliente": $scope.usuario.email_cliente,
             "contrasena": $scope.usuario.contrasena,
             "mca_genero": $scope.usuario.mca_genero,
             "fec_nacimiento": $scope.usuario.fec_nacimiento,
             "mca_independiente": $scope.usuario.mca_independiente,
             "profesion": $scope.usuario.profesion,
             "mca_empleado": $scope.usuario.mca_empleado,
             "nom_empresa": $scope.usuario.nom_empresa,
             "cod_sector": $scope.usuario.cod_sector,
             "cargo_empresa": $scope.usuario.cargo_empresa,
             "mca_estadocivil": $scope.usuario.mca_estadocivil,
             "num_hijos": $scope.usuario.num_hijos

         };*/

        return new Promise(function (resolve, reject) {

            $http.post(confJSON.editar, data).then(
                function (res) {
                    resolve(res.data);
                },
                function (err) {
                    reject(err);
                }
            );
        });

    }

});

app.service('$auth', function ($cookies, $rootScope) {

    var cookieName = "e_user";
    var userData = null;
    var jwt = null;

    function verifyJWTExp(token) {
        ////console.log(token);
        try {
            var claims = JSON.parse(atob(token.split(".")[1]));
            var current_time = new Date().getTime() / 1000;
            ////console.log(claims);
            if (current_time > claims.exp) {
                /* expired */
                return false;
            }
            //TODO Verificar fecha de expiración
            return true;
        }
        catch (e) {
            ////console.log(e)
            return false;
        }
    }

    this.deletUser = function (data) {
        $cookies.remove(cookieName);
        userData = null;
        jwt = null;
        $rootScope.$broadcast("userLoggedOut");

    }

    this.setUser = function (data) {
        userData = data;
        $cookies.putObject(cookieName, data);
        jwt = data.EJWT;
    };

    this.darUsuario = function () {
        if (!userData) {
            userData = $cookies.getObject(cookieName);
        }

        if (userData) {
            if (verifyJWTExp(userData.EJWT)) {

                return userData;

            } else {
                $cookies.remove(cookieName);
            }
        }

    };

    this.verificarDatos = function () {
        var usuario = this.darUsuario();
        return usuario && usuario.num_cliente && usuario.tipoid_num_cliente ? true : false;
    }

    this.setJWT = function (j) {
        jwt = j;
    }

    this.darJWT = function () {
        return jwt;
    };


    this.abrirModalCompletarDatos = function ($uibModal) {

        var modalInstance = $uibModal.open({
            templateUrl: '/modals/modal-completar-datos.html',
            controller: 'CompletarDatosModalInstanceCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false
        });
    };


});

app.factory('httpInterceptor', function ($auth) {
    return {
        request: function (config) {

            var usuario = $auth.darUsuario();

            var url = config.url;
            var token = $auth.darJWT();

            if (token) {
                config.headers['Authorization'] = 'Bearer ' + token;
            }
            else if (usuario) {
                config.headers['Authorization'] = 'Bearer ' + usuario.EJWT;
            }

            return config;
        }
    };
});

app.config(function ($httpProvider, FacebookProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
    FacebookProvider.init('1987313924895677');
});

app.filter('split', function () {
    return function (input, splitChar, splitIndex) {
        // do some bounds checking here to ensure it has that index
        return input ? input.split(splitChar)[splitIndex] : "";
    }
});

app.filter('contains', function () {
    return function (array, needle) {
        return array && needle && array.indexOf(needle) >= 0;
    };
});

app.filter('notin', function () {
    return function (array, needle) {
        return array && needle && array.indexOf(needle) == -1;
    };
});

app.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            var keys = Object.keys(props);

            items.forEach(function (item) {
                var itemMatches = false;

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});

app.filter('slugify', slugify);

function slugify(input) {
    if (!input)
        return;

    // make lower case and trim
    var slug = input.toLowerCase().trim();

    // replace invalid chars with spaces
    slug = slug.replace(/[^a-z0-9\s-]/g, ' ');

    // replace multiple spaces or hyphens with a single hyphen
    slug = slug.replace(/[\s-]+/g, '-');

    return slug;
}


app.controller('cotizador-ctrl', function ($rootScope, $scope, $timeout, $http, $envia, $uibModal) {

    $scope.regionales = [];
    $scope.cubrimiento = [];
    $scope.form = 1;
    $scope.visita = {};

    if ($scope.onInit) {
        $scope.onInit();
        cargarRegionales()
    }


    function actualizarPorHash() {
        var hash = window.location.hash;

        switch (hash) {
            case "":
                //$scope.cotizacion.cod_servicio = 13;
                $scope.form = 1;
                break;
            case "#documentos-express":
                $scope.cotizacion.cod_servicio = 1;
                $scope.form = 1;
                break;
            case "#documentos-masivos":
                $scope.cotizacion.cod_servicio = 8;
                $scope.form = 1;
                break;
            case "#radicacion-de-facturas":
                $scope.cotizacion.cod_servicio = 4;
                $scope.form = 1;
                break;
            case "#documentos-electronicos":
                $scope.cotizacion.cod_servicio = 14;
                $scope.form = 1;
                break;

            case "#paquetes-aereos":
                $scope.cotizacion.cod_servicio = 13;
                $scope.form = 1;
                break;
            case "#paquetes-terrestres":
                $scope.cotizacion.cod_servicio = 12;
                $scope.form = 1;
                break;

            case "#mercancia-terrestre":
                $scope.cotizacion.cod_servicio = 3;
                $scope.form = 1;
                break;
            case "#mercancia-aerea":
                $scope.cotizacion.cod_servicio = 2;
                $scope.form = 1;
                break;
            case "#cadena-de-frio":
                $scope.cotizacion.cod_servicio = 5;
                $scope.form = 1;
                break;
            case "#semimasivos":
                $scope.cotizacion.cod_servicio = 10;
                $scope.form = 1;
                break;

            case "#empresarial":
                $scope.cotizacion.cod_servicio = 11;
                $scope.form = 1;
                break;

            case "#internacional":
                $scope.cotizacion.cod_servicio = 7;
                $scope.form = 1;
                break;
            case "#recepcion-de-pruebas-de-consumo":
                $scope.cotizacion.cod_servicio = 112;
                $scope.form = 1;
                break;
            case "#entrega-de-premios-en-puntos-de-consumo":
                $scope.cotizacion.cod_servicio = 113;
                $scope.form = 1;
                break;
            case "#reparto-con-recaudo":
                $scope.cotizacion.cod_servicio = 114;
                $scope.form = 1;
                break;
        }
    }

    function locationHashChanged() {
        var hash = location.hash;
        ////console.log("Cotizador-ctrl", hash);

        $timeout(function () {
            actualizarPorHash()

        })
        $timeout(function () {
            var cod = $scope.cotizacion.cod_servicio;
            var swcont = document.querySelector('.swiper-container-horizontal');
            if (swcont) {
                var swiper = swcont.swiper;
                //console.log(swiper);

                var slidesPerView = swiper.currentSlidesPerView();
                var liIndex = $(".swiper-slide a.active").parent().index();
                var mod = liIndex % slidesPerView;
                var slideTo = Math.floor(liIndex / slidesPerView) + (mod > 0 ? 1 : 0);
                /* if (liIndex <= slidesPerView) {
                     slideTo = 0;
                 }*/
                swiper.slideTo(slideTo, 500);
            }

            //$(".s" + cod).offset() && $(document).scrollTop($(".s" + cod).offset().top - 50);


            if (["/servicios"].indexOf(window.location.pathname) >= 0) {
                for (var i = 0; i < hash.length; i++) {
                    var caracter = hash.charAt(i);
                    if (caracter == "#") {
                        var body = $("html, body");
                        body.animate({scrollTop: 850}, 0);
                    }
                }
            }
            else {
                var tmp = $(hash).offset();
                if (tmp) {
                    var ot = tmp.top;
                    ////console.log(ot);
                    if (ot >= 100)
                        $(window).scrollTop(ot - 150);

                }
            }
        })
    }

    if (window.location.href.toLowerCase().indexOf(window.location.host + "/gana") < 0) {
        window.addEventListener('load', locationHashChanged);
        window.addEventListener('hashchange', locationHashChanged);
        locationHashChanged();
    }


    $scope.scRegionales = {
        valueField: 'cod_ciudad',
        labelField: 'nom_ciudad',
        placeholder: 'Lugar de origen',
        maxItems: 1,
        searchField: ['nom_ciudad', 'nom_departamento'],
        searchConjunction: 'or',
        render: {
            option: function (item, escape) {
                return '<div class="ss-coti-option">'
                    + escape(item.nom_ciudad) + ' - '
                    + escape(item.nom_departamento)
                    + '</div>';
            },
            item: function (item, escape) {
                return '<div>'
                    + escape(item.nom_ciudad) + ' - '
                    + escape(item.nom_departamento)
                    + '</div>';
            }
        }
    };
    $scope.scCubrimiento = {
        valueField: 'cod_ciudad',
        labelField: 'nom_ciudad',
        placeholder: 'Lugar de destino',
        maxItems: 1,
        searchField: ['nom_ciudad', 'nom_departamento'],
        searchConjunction: 'or',
        render: {
            option: function (item, escape) {
                return '<div class="ss-coti-option">'
                    + escape(item.nom_ciudad) + ' - '
                    + escape(item.nom_departamento)
                    + '</div>';
            },
            item: function (item, escape) {
                return '<div>'
                    + escape(item.nom_ciudad) + ' - '
                    + escape(item.nom_departamento)
                    + '</div>';
            }
        }
    };

    function cargarRegionales() {

        $http.get($envia.conf().regionales).then(
            function (res) {
                $scope.regionales = res.data[0].listado
            },
            function (err) {
                $timeout(function () {
                    cargarRegionales();
                }, 1000)
            }
        );

    }

    function cargarCiudades() {
        var data = {
            "cod_regional": 1,
            "cod_servicio": 3
        }

        $http.post($envia.conf().cubrimiento, data).then(
            function (res) {
                $scope.ciudades = res.data[0].listado;

            },
            function (err) {
                $timeout(function () {
                    cargarCiudades();
                }, 1000)
            }
        );
    }

    $rootScope.$on("ssConf", function (svc) {
        cargarRegionales();
        cargarCiudades();

    });

    $scope.cotizacion = {
        seleccionado: "documentos",
        cod_servicio: null,
        origen: null,
        destino: null,
        documentos: {},
        paquetes: {},
        mercancia: {},
        HabRecoleccion:null,
        info_cubicacion: [{
            cantidad: 1,
            largo: null,
            ancho: null,
            alto: null,
            peso: null,
            declarado: null
        }]
    };

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    $scope.$watch("cotizacion.origen", function (newValue, oldValue) {
        try {
            $(".ss-destino ").tooltipster("close")
        }
        catch (err) {
        }
        if (newValue != oldValue && newValue) {

            $scope.cotizacion.destino = undefined;
            $scope.cotizacion.forma_pago = undefined;
            $scope.cotizacion.total = undefined;
            $scope.cotizacion.cartaporte = undefined;
            $scope.cotizacion.resultado = undefined;
            $scope.cotizacion.error = undefined;
            $scope.cotizacion.declaro = false;
            $scope.cotizacion.info_cubicacion = [{}];
            $scope.cotizacion.documentos.devolucion_radicado = undefined;
            $scope.cotizacion.documentos.declaro = undefined;
            $scope.cotizacion.paquetes.devolucion_radicado = undefined;
            $scope.cotizacion.paquetes.declaro = undefined;
            $scope.cotizacion.mercancia.declaro = undefined;
            $("#ss-cotizador, .ss-cotizador").LoadingOverlay("show")

            var data = {

                "cod_regional": $scope.cotizacion.origen,
                "cod_servicio": $scope.cotizacion.cod_servicio
            }

            //alert(('' + $scope.cotizacion.cod_servicio))
            //alert(parseInt(('' + $scope.cotizacion.cod_servicio)[0]))
            $http.post($envia.conf().cubrimiento, data).then(
                function (res) {
                    $scope.cubrimiento = res.data[0].listado
                    $("#ss-cotizador, .ss-cotizador").LoadingOverlay("hide");
                },
                function (err) {
                    $("#ss-cotizador, .ss-cotizador").LoadingOverlay("hide");
                    $(".ss-destino").tooltipster("open")
                }
            );

        }
    });

    $scope.$watch("cotizacion.cod_servicio", function (newValue, oldValue) {
        if (newValue != oldValue) {
            newValue = parseInt(newValue);
            $scope.seleccionarServicio(newValue);
        }
    });

    $scope.$watch("cotizacion.documentos.devolucion_radicado", function (newValue, oldValue) {
        if (newValue != oldValue) {
            $scope.cotizacion.documentos.unidades = newValue == 'si' ? 1 : 0;
        }
    });

    $scope.$watch("cotizacion.forma_pago", function (newValue, oldValue) {
        if (!oldValue) {
            setTimeout(function () {
                $(".tooltip-cotizador").tooltipster({
                    contentCloning: true
                });
            }, 200);
        }
    });

    $scope.$watch("cotizacion.declaro", function (newValue, oldValue) {
        if ($scope.cotizacion.info_cubicacion.length <= 1) {
            $scope.agregarCubicacion();
        }
    });

    $scope.refrescar = function () {
        $scope.cotizacion.info_cubicacion = [{}];
        $scope.cotizacion.resultado = undefined;
        $scope.cotizacion.error = undefined;
    }

    $scope.seleccionarServicio = function (codigo) {

        $scope.cotizacion.cod_servicio = codigo;
        $scope.cotizacion.forma_pago = null;
        $scope.cotizacion.origen = null;
        $scope.cotizacion.destino = null;
        $scope.cotizacion.declaro = null;
        $scope.cotizacion.cartaporte = undefined;
        $scope.cotizacion.resultado = undefined;
        $scope.cotizacion.total = undefined;
        $scope.cotizacion.error = undefined;
        //$scope.cubrimiento = [];
        $scope.cotizacion.documentos = {};
        $scope.cotizacion.paquetes = {};
        $scope.cotizacion.mercancia = {};
        $scope.cotizacion.info_cubicacion = [{}];
        if ([2, 3, 103].indexOf(codigo) >= 0) {
            $scope.agregarCubicacion();
        }
    };

    $scope.agregarCubicacion = function () {
        var ic = $scope.cotizacion.info_cubicacion;
        //ic[0].edit = false;
        ic.push(ic[0]);
        ic[0] = {
            cantidad: 1,
            largo: null,
            ancho: null,
            alto: null,
            peso: null,
            declarado: null
        };
    };

    $scope.eliminarCubicacion = function (i) {
        $scope.cotizacion.info_cubicacion.splice(i, 1);
    }

    $scope.cotizar = function () {
        $scope.cotizacion.error = undefined;
        $scope.cotizacion.resultado = undefined;


        var modal = $("#ss-cotizador").closest(".modal");
        if (modal.length == 0) {
            $("#ss-cotizador, .ss-cotizador").LoadingOverlay("show");
        }
        else {
            modal.LoadingOverlay("show");
        }
        var data = {
            "ciudad_origen": $scope.cotizacion.origen,
            "ciudad_destino": $scope.cotizacion.destino,
            "cod_formapago": $scope.cotizacion.forma_pago,
            "cod_servicio": $scope.cotizacion.cod_servicio,
            "mca_docinternacional": 0,

            "info_contenido": {
                "num_documentos": "12345-67890"
            }
        };
        if ($scope.cotizacion.cod_servicio == 1 && $scope.cotizacion.documentos.devolucion_radicado == 'si') {
            data.cod_servicio = 4;
            data.cant_fact = $scope.cotizacion.documentos.unidades;
        }
        if ($scope.cotizacion.cartaporte) {
            data.con_cartaporte = $scope.cotizacion.cartaporte
        }


        if ($scope.cotizacion.cod_servicio == 1 || $scope.cotizacion.cod_servicio == 4) {
            data.num_unidades = 1;
            data.mpesoreal_k = 1;
            data.mpesovolumen_k = 1;

            $scope.cotizacion.num_unidades = data.num_unidades;
            $scope.cotizacion.mpesoreal_k = data.mpesoreal_k;
            $scope.cotizacion.mpesovolumen_k = data.mpesovolumen_k;

            data.valor_declarado = $scope.cotizacion.info_cubicacion[0].declarado;
        }
        else {
            data.info_cubicacion = [];
            if ($scope.cotizacion.cod_servicio == 12 || $scope.cotizacion.cod_servicio == 13) {
                $scope.cotizacion.info_cubicacion[1].cantidad = "1";

            }
            angular.copy($scope.cotizacion.info_cubicacion, data.info_cubicacion);
            data.info_cubicacion.splice(0, 1);

            /* if ($scope.cotizacion.cod_servicio == 2 || $scope.cotizacion.cod_servicio == 3) {
                 data.info_cubicacion.splice(0, 1);
             }*/

            $scope.cotizacion.info_cubicacion.forEach(function (value) {
                delete value.edit
            });

            data.info_cubicacion.forEach(function (value) {
                delete value.edit
            });
        }


        //alert(JSON.stringify(data));
        $http.post($envia.conf().cotizaciones, data).then(
            function (res) {
                $scope.cotizacion.resultado = res.data

                $scope.cotizacion.total = $scope.cotizacion.resultado.valor_flete + $scope.cotizacion.resultado.valor_costom

                var data1 = {
                    "es_esporadico": "1",
                    "cod_ciudadR": $scope.cotizacion.origen,
                    "valor_totalflete": $scope.cotizacion.total
                }

                $http.post($envia.conf().fleteTope, data1).then(
                    function (res) {
                        $scope.cotizacion.HabRecoleccion = false;

                    },
                    function (err) {
                        $scope.cotizacion.HabRecoleccion = true;
 
                    }
                );


                $("#ss-cotizador, .ss-cotizador, .modal").LoadingOverlay("hide")
            },
            function (err) {
                $scope.cotizacion.error = err.data;
                // alert(JSON.stringify($scope.cotizacion.error));
                //alert(JSON.stringify(data));
                $("#ss-cotizador, .ss-cotizador, .modal").LoadingOverlay("hide")
            }
        );


    };

    $scope.rastrear = function (elId) {
        var guia = "";
        var form = $("#" + elId);
        var valid = true;
        guia = form.find('.input-rastreo').val();
        if (valid || true) {
            $envia.abrirModalRastrea(guia);
            form.find('input').each(function (i, input) {
                $(input).val("")
            });
        }
    }

    $scope.solicitarRecoleccion = function () {
        $("body").LoadingOverlay("show")
        if (location.pathname == "/recoleccion") {
            $scope.cambiarCotizacion($scope.cotizacion);
            $("body").LoadingOverlay("hide")
        }
        else {
            var form = $("#solicitar-recoleccion-form");
            form.find("[name='data']").val(JSON.stringify($scope.cotizacion));
            form.submit();
            $("body").LoadingOverlay("hide")
        }
    };

    $scope.solicitarVisita = function () {
        var data = {
            "email_cliente": $scope.visita.correo,
            "nom_cliente": $scope.visita.nom_cliente,
            "tel_cliente": $scope.visita.tel_cliente,
            "cod_ciudad": $scope.visita.cod_ciudad,
            "cod_servicio": $scope.cotizacion.cod_servicio,
            "nom_empresa": $scope.visita.nom_empresa,
            "cargo_empresa": $scope.visita.cargo_empresa

        };
        $("body").LoadingOverlay("show")
        $http.post($envia.conf().visita_comercial, data).then(
            function (res) {
                $scope.respuesta = res.data
                $("body").LoadingOverlay("hide")
                abrirModalExito($scope.respuesta);
                $scope.visita = {};
            },
            function (err) {
                $scope.error = err.data;
                $("body").LoadingOverlay("hide")
                abrirModalError($scope.error)
            }
        );
    };

    $scope.visitaValida = function () {
        var visita = $scope.visita;
        return (
            visita.nom_cliente && visita.correo && visita.tel_cliente &&
            visita.nom_empresa && visita.cargo_empresa && visita.cod_ciudad && visita.declaro
        )
    };

    function abrirModalExito(res) {
        $scope.resultado = {};
        $scope.resultado = res;

        $scope.modalInstance = $uibModal.open({
            templateUrl: '/modals/visita-confirmacion.html',
            controller: 'modalgen-ctrl',
            scope: $scope,
            size: 'md',
            resolve: {}
        });
    }

    function abrirModalError(err) {
        $scope.resultado = {};
        $scope.resultado = err;

        $scope.modalInstance = $uibModal.open({
            templateUrl: '/modals/visita-error.html',
            controller: 'modalgen-ctrl',
            scope: $scope,
            size: 'md',
            resolve: {}
        });
    }

    $scope.documentoValido = function () {

        var cotizacion = $scope.cotizacion;

        if (cotizacion.documentos.devolucion_radicado && cotizacion.documentos.devolucion_radicado == "no") {
            return (
                cotizacion.declaro && cotizacion.info_cubicacion[0].declarado
            )
        } else {
            return (
                cotizacion.declaro && cotizacion.info_cubicacion[0].declarado && cotizacion.documentos.unidades && cotizacion.documentos.devolucion_radicado
                && cotizacion.forma_pago
            )

        }
    }

    $scope.paqueteValido = function () {
        var cotizacion = $scope.cotizacion;
        if (cotizacion.info_cubicacion[1]) {

            return (
                cotizacion.info_cubicacion[1].declarado && cotizacion.info_cubicacion[1].peso && cotizacion.info_cubicacion[1].alto && cotizacion.info_cubicacion[1].ancho &&
                cotizacion.info_cubicacion[1].largo && cotizacion.declaro
            )
        }
    }

    $scope.mercanciasValidas = function () {
        var cotizacion = $scope.cotizacion;
        return (
            cotizacion.declaro
        )
    }

});

app.controller('RastreaModalInstanceCtrl', function ($scope, $uibModal, $uibModalInstance, $http, $envia, $timeout, guia, bandera) {

    

    if (typeof guia === 'string') {

        $scope.Captcha = {
        Valor1 : 0,
        Valor2 : 0,
        Resultado: null,
        Robot: false
    }
        $scope.Captcha.Valor1 = Math.floor((Math.random() * 6) + 1);
        $scope.Captcha.Valor2 = Math.floor((Math.random() * 6) + 1);
    
        if (bandera == "") {
            
            var modalInstance = $uibModal.open({
                //templateUrl: '/modals/Captcha.html',
                templateUrl: '/modals/CaptchaImg.html',
                controller: 'RastreaModalInstanceCtrl',
                size: 'md',
                resolve: {
                    guia: function () {
                        return guia;
                    },
                    bandera: function () {
                        return "1";
                    }
                }
            });
            $scope.close();
        } else {
            $scope.cod = guia.split("");
            $http.get($envia.conf().rastrea + guia)
                .then(function (res) {
                    $scope.error = false;
                    $scope.cargado = true
                    $scope.guia = res.data;
                    $scope.guia.cod = guia;
                    //w42,w59,w75,w90,wfinish
                    $scope.guia.clase_tren = "";
                    // $scope.guia.cod_estadog = 5;
                    var codEstado = parseInt($scope.guia.cod_estadog);
                    $scope.guia.cod_estadog = codEstado;

                    switch (codEstado) {

                        //=====================================================================================================
                        // Recogida
                        //======================================================================================================
                        case 1:
                        case 23:
                            $scope.guia.clase_tren = "w25";
                            break;

                        //=====================================================================================================
                        // En bodega origen
                        //======================================================================================================
                        case 2:
                        case 22:
                            $scope.guia.clase_tren = "w42";
                            break;

                        //=====================================================================================================
                        // En despacho
                        //======================================================================================================
                        case 4:
                        case 14:
                        case 15:
                            $scope.guia.clase_tren = "w59";
                            break;

                        //=====================================================================================================
                        // En Bodega
                        //======================================================================================================
                        case 5:
                        case 16:
                        case 18:
                        case 19:
                        case 20:
                        case 21:
                            $scope.guia.clase_tren = "w75";
                            break;

                        //======================================================================================================
                        // En Reparto
                        //=======================================================================================================
                        case 6:
                        case 17:
                            $scope.guia.clase_tren = "w90";
                            break;

                        //======================================================================================================
                        // Entregado
                        //=======================================================================================================
                        case 7:
                        case 12:
                        case 13:
                            $scope.guia.clase_tren = "wfinish";
                            break;

                        //=====================================================================================================
                        // No presente botones
                        //======================================================================================================
                        case 3:
                            $scope.guia.clase_tren = "hidden";
                            break;

                        default:
                            $scope.guia.clase_tren = "hidden";
                            break;

                    }
                }, function (err) {
                    $timeout(function () {
                        $scope.error = true
                        $scope.cargado = true
                        $scope.guia = {}
                        $scope.guia.error_message = err.data && err.data.status_message ? err.data.status_message : "Lo sentimos, Operación no exitosa.";

                        var lg = $(".modal-error").closest(".modal-lg")
                        lg.removeClass("modal-lg")

                    }, 0)
                });
        } 
    }
    else {
        $scope.guia = guia;
        $scope.cod = guia.cod;
        $scope.error = false;
        $scope.cargado = true
    }

    $scope.close = function () {
        $uibModalInstance.close();
    };

    $scope.CerrarCaptcha = function () {

        var response = grecaptcha.getResponse();

        if (response.length == 0) {
            alert("Captcha no verificado")
            $scope.close();
        } else {
            //alert("Captcha verificado");
            $scope.close();
            var modalInstance = $uibModal.open({
                templateUrl: '/modals/rastrear-modal.html',
                controller: 'RastreaModalInstanceCtrl',
                size: 'lg',
                resolve: {
                    guia: function () {
                        return guia;
                    },
                    bandera: function () {
                        return "1";
                    }
                }
            });
        }

        //if (parseInt($scope.Captcha.Valor1) + parseInt($scope.Captcha.Valor2) == parseInt($scope.Captcha.Resultado)) {
        //    $scope.close();
        //    var modalInstance = $uibModal.open({
        //        templateUrl: '/modals/rastrear-modal.html',
        //        controller: 'RastreaModalInstanceCtrl',
        //        size: 'lg',
        //        resolve: {
        //            guia: function () {
        //                return guia;
        //            },
        //            bandera: function () {
        //                return "1";
        //            }
        //        }
        //    });
        //} else {
        //    alert("Suma errada");
        //    $scope.close();
        //}

        
    };

    $scope.verDetalle = function () {
        $scope.close();
        var modalInstance = $uibModal.open({
            templateUrl: '/modals/rastrear-detalles-modal.html',
            controller: 'RastreaModalInstanceCtrl',
            size: 'lg',
            resolve: {
                guia: function () {
                    return $scope.guia;
                },
                bandera: function () {
                    return "1";
                }
            }
        });
    }

    $scope.cerrarDetalles = function () {
        $scope.close();
        var modalInstance = $uibModal.open({
            templateUrl: '/modals/rastrear-modal.html',
            controller: 'RastreaModalInstanceCtrl',
            size: 'lg',
            resolve: {
                guia: function () {
                    return $scope.guia;
                },
                bandera: function () {
                    return "1";
                }
            }
        });
    }

});

app.controller('CompletarDatosModalInstanceCtrl', function ($scope, $uibModal, $uibModalInstance, $http, $envia, $timeout) {

});

app.controller('header-ctrl', function ($rootScope, $scope, $timeout, $http, $envia, $uibModal, $auth) {

    $scope.registrar = {};
    $scope.ingresar = {};

    $scope.perfil = {};
    $scope.perfil.actualizar = 2;

    $scope.tipos_doc = [
        {cod: 1, nom: 'CC'},
        {cod: 2, nom: 'NIT'},
        {cod: 3, nom: 'PP'},
        {cod: 4, nom: 'CE'}
    ];

    $scope.tipos_documentos = [
        {cod: 1, nom: 'Cedula'},
        {cod: 2, nom: 'NIT'},
        {cod: 3, nom: 'Pasaporte'},
        {cod: 4, nom: 'Cedula extranjera'}
    ];

    $scope.scDocumento = {
        valueField: 'cod',
        labelField: 'nom',
        placeholder: 'Tipo',
        maxItems: 1,
        searchField: ['nom'],
        searchConjunction: 'or',
    };

    $scope.scCubrimiento = {
        valueField: 'cod_ciudad',
        labelField: 'nom_ciudad',
        placeholder: 'Ciudad',
        maxItems: 1,
        searchField: ['nom_ciudad', 'nom_departamento'],
        searchConjunction: 'or',
        render: {
            option: function (item, escape) {
                return '<div class="ss-coti-option">'
                    + escape(item.nom_ciudad) + ' - '
                    + escape(item.nom_departamento)
                    + '</div>';
            },
            item: function (item, escape) {
                return '<div>'
                    + escape(item.nom_ciudad) + ' - '
                    + escape(item.nom_departamento)
                    + '</div>';
            }
        }
    };

    function cargarCiudades() {
        var data = {

            "cod_regional": 1,
            "cod_servicio": 3
        };

        $http.post($envia.conf().cubrimiento, data).then(
            function (res) {
                $scope.cubrimiento = res.data[0].listado
            },
            function (err) {
                $timeout(function () {
                    cargarCiudades();
                }, 1000)
            }
        );
    }

    $rootScope.$on("ssConf", function (svc) {
        cargarCiudades();

    });


    $scope.usuario = $auth.darUsuario();

    $scope.registro = function () {
        if ($scope.registrar.conf_contrasena === $scope.registrar.contrasena) {

            //$("body").LoadingOverlay("show");
            $envia.registrar($scope.registrar.nombre, $scope.registrar.tipo_documento, $scope.registrar.num_documento, $scope.registrar.direccion,
                $scope.registrar.ciudad, $scope.registrar.telefono, $scope.registrar.correo, $scope.registrar.celular, $scope.registrar.contrasena)
                .then(function (regData) {
                    $envia.salir();
                    
                    console.log(regData);

                    $scope.resultado = {};
                    $scope.correo = {};
                    $scope.resultado = regData.respuesta;
                    $scope.resultado = $scope.registrar.correo;

                    $scope.modalInstance = $uibModal.open({
                        templateUrl: '/modals/registro-exito.html',
                        controller: 'modalgen-ctrl',
                        scope: $scope,
                        size: 'lg',
                        backdrop: 'static',
                        keyboard: false,
                        resolve: {}
                    });

                    $scope.registrar.nombre = "";
                    $scope.registrar.num_documento = "";
                    $scope.registrar.direccion = "";
                    $scope.registrar.telefono = "";
                    $scope.registrar.correo = "";
                    $scope.registrar.celular = "";
                    $scope.registrar.contrasena = "";
                    $scope.registrar.conf_contrasena = "";
                    $scope.registrar.declaro = false;

                   /* $timeout(function () {
                        $envia.salir();
                        $scope.usuario = undefined;
                        $scope.ingresar.usuario = $scope.registrar.correo;
                        $scope.ingresar.contrasena = $scope.registrar.contrasena;
                        $scope.registrar = {};
                        $("body").LoadingOverlay("hide");
                        $scope.ingresa();
                    });*/
                   //console.log(regData);
                }, function (err) {
                        console.error(err);
                        $scope.resultado = {};
                        $scope.resultado = err;
                        $scope.modalInstance = $uibModal.open({
                            templateUrl: '/modals/registro-error.html',
                            controller: 'modalgen-ctrl',
                            scope: $scope,
                            size: 'lg',
                            backdrop: 'static',
                            keyboard: false,
                            resolve: {}
                        });
                        //$("body").LoadingOverlay("show");
                });

        } else {
            alert("las contraseñas no coinciden")
        }
    };

    $scope.ingresa = function (fb) {

        $("body").LoadingOverlay("show");

        var promise = null;
        if (fb) {
            promise = $envia.fbLogin();
        }
        else {
            promise = $envia.ingresar($scope.ingresar.usuario, $scope.ingresar.contrasena);
        }

        promise.then(function (data) {
            $timeout(function () {
                $("body").LoadingOverlay("hide");
                $scope.ingresar = {};
                $scope.usuario = data;
                $scope.error = null;
            });
        }, function (err) {
            $timeout(function () {

                $scope.error = err;
                $scope.ingresar.contrasena = null;
                $("body").LoadingOverlay("hide");
            });

        });
    };

    $scope.salir = function () {
        $("body").LoadingOverlay("show");
        $envia.salir();
        $scope.usuario = undefined;
        $("body").LoadingOverlay("hide");

    };

    $scope.validarRegistro = function () {
        var registrar = $scope.registrar;

        return (
            registrar.nombre && registrar.tipo_documento && registrar.num_documento && registrar.direccion && registrar.telefono && registrar.correo &&
            registrar.celular && registrar.contrasena && registrar.conf_contrasena && registrar.declaro
        );
    };

    $rootScope.$on("userLoggedIn", function (usr) {
        $scope.usuario = $auth.darUsuario();
    });
});

app.controller('modalgen-ctrl', function ($rootScope, $scope, $envia, $uibModal, $uibModalInstance) {

    $scope.cerrarModal = function () {
        $uibModalInstance.close();
    }
});

app.controller('recoleccion-ctrl', function ($rootScope, $scope, $timeout, $http, $envia, $auth, $uibModal) {

    $scope.registrar = {};
    $scope.ingresar = {};

    $scope.scCubrimiento = {
        valueField: 'cod_ciudad',
        labelField: 'nom_ciudad',
        placeholder: 'Ciudad',
        maxItems: 1,
        searchField: ['nom_ciudad', 'nom_departamento'],
        searchConjunction: 'or',
        render: {
            option: function (item, escape) {
                return '<div class="ss-coti-option">'
                    + escape(item.nom_ciudad) + ' - '
                    + escape(item.nom_departamento)
                    + '</div>';
            },
            item: function (item, escape) {
                return '<div>'
                    + escape(item.nom_ciudad) + ' - '
                    + escape(item.nom_departamento)
                    + '</div>';
            }
        }
    };

    $scope.buscarCiudad = function (codigo) {
        var listado = $scope.cubrimiento;
        if (listado) {
            for (var i = 0; i < listado.length; i++) {
                if (listado[i].cod_ciudad == codigo) {
                    return listado[i].nom_ciudad + " - " + listado[i].nom_departamento;
                }
            }
        }
    }

    function cargarCiudades() {
        var data = {

            "cod_regional": 1,
            "cod_servicio": 3
        };

        $http.post($envia.conf().cubrimiento, data).then(
            function (res) {
                $scope.cubrimiento = res.data[0].listado
            },
            function (err) {
                $timeout(function () {
                    cargarCiudades();
                }, 1000)
            }
        );
    }

    $scope.tipos_doc = [
        {cod: 1, nom: 'Cedula'},
        {cod: 2, nom: 'NIT'},
        {cod: 3, nom: 'Pasaporte'},
        {cod: 4, nom: 'Cedula de extranjeria'}
    ];

    $scope.scDocumento = {
        valueField: 'cod',
        labelField: 'nom',
        placeholder: 'Tipo de documento',
        maxItems: 1,
        searchField: ['nom'],
        searchConjunction: 'or',
    };

    $rootScope.$on("ssConf", function (svc) {
        cargarCiudades();
    });


    $scope.loggedIn = $auth.darUsuario();

    $rootScope.$on("userLoggedIn", function (usr) {
        $scope.loggedIn = $auth.darUsuario();
        $scope.usuarioValido = $auth.verificarDatos();
    });

    //**********************************************
    // ================ WARNING ====================
    // ********** NO TOCAR ESTE CODIGO *************
    $scope.onInit = function () {
        //$.LoadingOverlay("show");
        ajustarCotizador();

    };

    $scope.cambiarCotizacion = function (cot) {
        $scope.cotizacion = cot;
        $scope.modalInstance.close(cot);
        $scope.cotizacion = JSON.parse(angular.toJson($scope.cotizacion))

    };

    // ***** DE AQUI PARA ABAJO ES SEGURO **********
    // =============================================

    try {
        if (cotizacion_data) {
            $scope.cambiarCotizacion(cotizacion_data);
        }
    }
    catch (e) {
        // No hay cotizacion_data
    }


    $scope.remitente = {}
    $scope.destinatario = {}
    $scope.contenido = {}

    $scope.tipos_doc = [
        {cod: 1, nom: 'Cedula'},
        {cod: 2, nom: 'NIT'},
        {cod: 3, nom: 'Pasaporte'},
        {cod: 4, nom: 'Cedula de extranjeria'}
    ];

    $scope.scDocumento = {
        valueField: 'cod',
        labelField: 'nom',
        placeholder: 'Tipo de documento',
        maxItems: 1,
        searchField: ['nom'],
        searchConjunction: 'or',
    };


    $scope.solicitar = function () {


        var data = {

            "ciudad_origen": $scope.cotizacion.origen,
            "ciudad_destino": $scope.cotizacion.destino,
            "cod_formapago": $scope.cotizacion.forma_pago,
            "cod_servicio": $scope.cotizacion.cod_servicio,

            "mca_nosabado": 0,
            "mca_docinternacional": 0,

            "info_origen": {
                "nom_remitente": $scope.remitente.nombre,
                "dir_remitente": $scope.remitente.direccion,
                "tel_remitente": $scope.remitente.telefono,
                "ced_remitente": $scope.remitente.num_documento
            },
            "info_destino": {
                "nom_destinatario": $scope.destinatario.nombre,
                "dir_destinatario": $scope.destinatario.direccion,
                "tel_destinatario": $scope.destinatario.telefono,
                "ced_destinatario": $scope.destinatario.num_documento
            },
            "info_contenido": {
                "dice_contener": $scope.contenido.observaciones,
                "texto_guia": "",
                "accion_notaguia": "",
                "num_documentos": "12345-67890",
                "centrocosto": ""

            },
            "numero_guia": "",
            "generar_os": "S"
        }
        $scope.contenido.fecha = $("#fecha").val();

        if ($scope.cotizacion.cartaporte) {
            data.con_cartaporte = $scope.cotizacion.cartaporte
        }

        if ($scope.cotizacion.cod_servicio == 1 || $scope.cotizacion.cod_servicio == 4) {
            data.num_unidades = 1;
            data.mpesoreal_k = 1;
            data.mpesovolumen_k = 1;
            data.valor_declarado = $scope.cotizacion.info_cubicacion[0].declarado;
            $scope.cotizacion.documentos.num_unidades = data.num_unidades;
        }
        else {
            data.info_cubicacion = [];
            angular.copy($scope.cotizacion.info_cubicacion, data.info_cubicacion);

            data.info_cubicacion.forEach(function (value) {
                delete value.edit
            });
            data.info_cubicacion.splice(0, 1);
        }

        if ($scope.cotizacion.info_cubicacion.length > 1) {
            var suma = 0
            for (var i = 0; i < $scope.cotizacion.info_cubicacion.length; i++) {

                var entero = parseInt($scope.cotizacion.info_cubicacion[i].cantidad)
                suma = entero + suma
                $scope.cotizacion.suma = suma
            }
        }

        $("body").LoadingOverlay("show");
        $http.post($envia.conf().recolecciones, data).then(
            function (res) {
                $("body").LoadingOverlay("hide");
                $scope.recoleccion = {};
                $scope.recoleccion.resultado = res.data;
                abrirModalExito($scope.recoleccion.resultado);

                var body = $("html, body");
                body.animate({scrollTop: 120}, 1000);
            },
            function (err) {
                $("body").LoadingOverlay("hide");
                $scope.error = err.data;

                abrirModalError($scope.error);
            }
        );

    };

    $scope.abrirModalRecoleccion = function () {
        abrirModalExito($scope.recoleccion.resultado);
    }

    $scope.abrirModalRegistro = function () {
        abrirModalExito($scope.registrar.resultado);
    }

    function abrirModalExito(res) {
        $scope.resultado = {};
        $scope.resultado = res;
        $scope.recolec = {"guia": "123456789"};
        $scope.modalInstance = $uibModal.open({
            templateUrl: '/modals/recoleccion-confirmacion.html',
            controller: 'modalgen-ctrl',
            scope: $scope,
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {}
        });
    }

    function abrirModalError(err) {
        $scope.resultado = {};
        $scope.resultado = err;
        $scope.modalInstance = $uibModal.open({
            templateUrl: '/modals/recoleccion-error.html',
            controller: 'modalgen-ctrl',
            scope: $scope,
            size: 'lg',
            backdrop: 'static',
            resolve: {}
        });
    }

    $scope.abrirCotizador = function () {

        $scope.modalInstance = $uibModal.open({
            templateUrl: '/cotizador.html',
            controller: 'cotizador-ctrl',
            scope: $scope,
            size: 'md',
            resolve: {}
        });

    };


    $scope.usuario = $auth.darUsuario();
    $scope.usuarioValido = $auth.verificarDatos();

    $scope.registro = function () {
        if ($scope.registrar.conf_contrasena === $scope.registrar.contrasena) {

            $("body").LoadingOverlay("show");
            $envia.registrar($scope.registrar.nombre, $scope.registrar.tipo_documento, $scope.registrar.num_documento, $scope.registrar.direccion,
                $scope.registrar.ciudad, $scope.registrar.telefono, $scope.registrar.correo, $scope.registrar.celular, $scope.registrar.contrasena)
                .then(function (regData) {
                    $timeout(function () {
                        $envia.salir();
                        $scope.usuario = undefined;

                        $scope.ingresar.usuario = $scope.registrar.correo;
                        $scope.ingresar.contrasena = $scope.registrar.contrasena;
                        $scope.registrar = {};
                        $("body").LoadingOverlay("hide");
                        $scope.ingresa();
                    });
                }, function (err) {
                    alert(JSON.stringify(err));
                    $("body").LoadingOverlay("hide");
                });

        } else {
            alert("las contraseñas o coinciden")
        }
    };


    $scope.ingresa = function (fb) {

        $("body").LoadingOverlay("show");

        var promise = null;
        if (fb) {
            promise = $envia.fbLogin();
        }
        else {
            promise = $envia.ingresar($scope.ingresar.usuario, $scope.ingresar.contrasena);
        }

        promise.then(function (data) {
            $timeout(function () {
                $("body").LoadingOverlay("hide");
                $scope.ingresar = {};
                $scope.usuario = data;
                $scope.error = null;
            });
        }, function (err) {
            $timeout(function () {

                $scope.error = err;
                $scope.ingresar.contrasena = null;
                $("body").LoadingOverlay("hide");
            });

        });
    };

    $scope.recoleccionValida = function () {
        var remitente = $scope.remitente;
        var destinatario = $scope.destinatario;
        var contenido = $scope.contenido;

        return (
            remitente.nombre && remitente.tipo_documento && remitente.num_documento && remitente.direccion && remitente.telefono && remitente.telefono && remitente.correo &&
            destinatario.nombre && destinatario.tipo_documento && destinatario.num_documento && destinatario.direccion && destinatario.telefono &&
            contenido.observaciones
            //pendiente la fecha
        );
    }

    $scope.validarRegistro = function () {
        var registrar = $scope.registrar;
        if (registrar) {

            return (
                registrar.nombre && registrar.tipo_documento && registrar.num_documento && registrar.direccion && registrar.telefono && registrar.correo &&
                registrar.celular && registrar.contrasena && registrar.conf_contrasena && registrar.declaro
            );
        }
    };

    $scope.validarDatosUsuario = function () {
        var usuario = $scope.loggedIn;
        if (usuario) {

            return (
                usuario.nom_cliente && usuario.tipoid_num_cliente && usuario.num_cliente && usuario.dir_cliente && usuario.tel_cliente &&
                usuario.tel_celular && usuario.ciudad && usuario.declaro
            );
        }
    }

    $scope.actualizarDatosUsuario = function () {

    }

});

app.controller('pqrs-ctrl', function ($rootScope, $scope, $timeout, $http, $envia, $uibModal) {

    $scope.scCubrimiento = {
        valueField: 'cod_ciudad',
        labelField: 'nom_ciudad',
        placeholder: 'Ciudad',
        maxItems: 1,
        searchField: ['nom_ciudad', 'nom_departamento'],
        searchConjunction: 'or',
        render: {
            option: function (item, escape) {
                return '<div class="ss-coti-option">'
                    + escape(item.nom_ciudad) + ' - '
                    + escape(item.nom_departamento)
                    + '</div>';
            },
            item: function (item, escape) {
                return '<div>'
                    + escape(item.nom_ciudad) + ' - '
                    + escape(item.nom_departamento)
                    + '</div>';
            }
        }
    };

    $scope.scCod_servicios = {
        valueField: 'cod_servicio',
        labelField: 'nom_servicio',
        placeholder: 'Seleccione el servicio',
        maxItems: 1,
        searchField: ['nom_servicio'],
        searchConjunction: 'or',
        render: {
            option: function (item, escape) {
                return '<div class="ss-coti-option">'
                    + escape(item.nom_servicio)
                    + '</div>';
            },
            item: function (item, escape) {
                return '<div>'
                    + escape(item.nom_servicio)
                    + '</div>';
            }
        }
    };

    $scope.tipoSolicitudAceptado = function (cliente, codigo, tipo) {
        var listado = cliente == 0 ? $scope.cod_natural : $scope.cod_corporativo
        if (listado) {
            for (var i = 0; i < listado.length; i++) {
                if (listado[i].cod_servicio == codigo) {
                    return listado[i]["" + tipo] == "1"
                }
            }
        }
    }


    $scope.tipoSolicitudAceptadoPrueba = function () {
        alert("Escuche");
    }

    $scope.tipos_doc = [
        {cod: 1, nom: 'Cedula'},
        {cod: 2, nom: 'NIT'},
        {cod: 3, nom: 'Pasaporte'},
        {cod: 4, nom: 'Cedula de extranjeria'}
    ];

    $scope.scDocumento = {
        valueField: 'cod',
        labelField: 'nom',
        placeholder: 'Tipo de documento',
        maxItems: 1,
        searchField: ['nom'],
        searchConjunction: 'or',
    };

    function cargarCiudades() {
        var data = {

            "cod_regional": 1,
            "cod_servicio": 3
        };


        $http.post($envia.conf().cubrimiento, data).then(
            function (res) {
                $scope.cubrimiento = res.data[0].listado
               
            },
            function (err) {
                $timeout(function () {
                    cargarCiudades();
                }, 1000)
            }
        );
    }

    function cargarServicios() {
        $http.get($envia.conf().pqr_natural).then(
            function (res) {
                //alert('res: ' + res.data[0].listado)
                $scope.cod_natural = res.data[0].listado;
            },
            function (err) {
                $timeout(function () {
                    cargarServicios();
                }, 1000)
            }
        );

        $http.get($envia.conf().pqr_corporativo).then(
            function (res) {
                $scope.cod_corporativo = res.data[0].listado;
            },
            function (err) {
                $timeout(function () {
                    cargarServicios();
                }, 1000)
            }
        );
    }

    $rootScope.$on("ssConf", function (svc) {

        cargarCiudades();
        cargarServicios();

    });


    $scope.reset = function () {
        $scope.pqr = {
            tipo_cliente: "Natural",
            cod_servicio: undefined,
            peticion: undefined,
            num_guia: undefined,
            data: undefined,
            datos_persona: {},
            datos_remitente: {},
            datos_destinatario: {},
            tiene_documento: {},
            esconderServicio: true,
            habilitarServicio: false,
            tipo_comentario: undefined,
            tipo_comentarioR: "1",
            esconderRecurso:false
        }
    };
    $scope.reset();


    function cargarGuia() {
        var divGuia = $("[data-id='pqr-guia']");
        var guia = "";
        var valid = true;
        divGuia.find('input').each(function (i, input) {
            var $input = $(input);
            guia += $input.val();
            if ($input.val().toString().length === 0) {
                valid = false;
                $input.addClass("rastrea-num-invalid");
            }
            else {
                $input.removeClass("rastrea-num-invalid");
            }
        });
        $scope.pqr.data = guia;


    };
    $scope.$watch("pqr.tipo_cliente ", function (newValue, oldValue) {

        if (newValue != oldValue) {
            $scope.pqr = {
                tipo_cliente: newValue,
                cod_servicio: undefined,
                peticion: undefined,
                num_guia: undefined,
                data: undefined,
                datos_persona: {},
                datos_remitente: {},
                datos_destinatario: {},
                tiene_documento: {},

            }

        }
    });


    $scope.validar = function () {

        var peso = 0;
        $.LoadingOverlay("show");
        $http.get($envia.conf().validarGuia + $scope.pqr.guia).then(function (res) {

                $http.get($envia.conf().rastrea + $scope.pqr.guia).then(function (res) {
                $scope.pqr.guiaValida = true;
                $.LoadingOverlay("hide");
                    peso = res.data.peso_real;

                    if (peso > 5) {
                        $scope.pqr.tipo_comentario = undefined;
                        $scope.pqr.esconderRecurso = true;
                    } else {
                        //Valida si tiene un queja en estado cerrado en los ultimos 6 meses
                        $http.get($envia.conf().pqr_Recurso + $scope.pqr.guia).then(function (res) {

                            if (res.data[0].listado) {

                            }

                            var abierta = 0;
                            var resuelta = 0;
                            res.data[0].listado.forEach(function (value) {

                                if (value.estado === "ABIERTA" || value.estado === "ASIGNADA" || value.estado === "EN TRAMITE" || value.estado === "PREASIGNADA" || value.estado === "PRECERRADA" || value.estado === "REPREASIGNADA") {
                                    abierta = 1;
                                }
                                if (value.estado === "RESUELTA") {
                                    resuelta = 1;
                                }

                                if (resuelta == 0) {
                                    if (abierta == 1) {
                                        $scope.pqr.tipo_comentario = undefined;
                                        $scope.pqr.esconderRecurso = true;

                                        //Mensaje de que hay una abierta
                                        abrirModalError({ respuesta: "Para la radicación del recurso debe estar RESUELTA su queja o petición, la cual se encuentra actualmente en trámite." });
                                        $.LoadingOverlay("hide");
                                    } else {
                                        $scope.pqr.tipo_comentario = undefined;
                                        $scope.pqr.esconderRecurso = true;
                                    }
                                } else {
                                    if (abierta == 1) {
                                        $scope.pqr.tipo_comentario = undefined;
                                        $scope.pqr.esconderRecurso = true;

                                        //Mensaje de que hay una abierta
                                        abrirModalError({ respuesta: "Para la radicación del recurso debe estar RESUELTA su queja o petición, la cual se encuentra actualmente en trámite." });
                                        $.LoadingOverlay("hide");
                                    } else {
                                        $scope.pqr.esconderRecurso = false;
                                    }
                                }

                            });


                        }, function (err) {
                                $scope.pqr.tipo_comentario = undefined;
                                $scope.pqr.esconderRecurso = true;
                        });
                    }


                    if (res.data.servicio_utilizado == "DOCUMENTO EXPRESS") {
                        $scope.pqr.cod_servicio = 1;
                        $scope.pqr.esconderServicio = false;
                        $scope.pqr.habilitarServicio = true;
                    }
                    if (res.data.servicio_utilizado == "MERCANCIA AEREA") {
                        $scope.pqr.cod_servicio = 2;
                        $scope.pqr.esconderServicio = false;
                        $scope.pqr.habilitarServicio = true;
                    }
                    if (res.data.servicio_utilizado == "MERCANCIA TERRESTRE") {
                        $scope.pqr.cod_servicio = 3;
                        $scope.pqr.esconderServicio = false;
                        $scope.pqr.habilitarServicio = true;
                    }
                    if (res.data.servicio_utilizado == "RADICACION DE FACTURAS") {
                        $scope.pqr.cod_servicio = 4;
                        $scope.pqr.esconderServicio = false;
                        $scope.pqr.habilitarServicio = true;
                    }
                    if (res.data.servicio_utilizado == "CADENA DE FRIO") {
                        $scope.pqr.cod_servicio = 5;
                        $scope.pqr.esconderServicio = false;
                        $scope.pqr.habilitarServicio = true;
                    }
                    if (res.data.servicio_utilizado == "ENVIA HOY") {
                        $scope.pqr.cod_servicio = 6;
                        $scope.pqr.esconderServicio = false;
                        $scope.pqr.habilitarServicio = true;
                    }
                    if (res.data.servicio_utilizado == "envia INTERNACIONAL") {
                        $scope.pqr.cod_servicio = 7;
                        $scope.pqr.esconderServicio = false;
                        $scope.pqr.habilitarServicio = true;
                    }
                    if (res.data.servicio_utilizado == "DOCUMENTOS MASIVOS") {
                        $scope.pqr.cod_servicio = 8;
                        $scope.pqr.esconderServicio = false;
                        $scope.pqr.habilitarServicio = true;
                    }
                    if (res.data.servicio_utilizado == "NOTIFICACIONES EXPRESS") {
                        $scope.pqr.cod_servicio = 9;
                        $scope.pqr.esconderServicio = false;
                        $scope.pqr.habilitarServicio = true;
                    }
                    if (res.data.servicio_utilizado == "SEMIMASIVO") {
                        $scope.pqr.cod_servicio = 10;
                        $scope.pqr.esconderServicio = false;
                        $scope.pqr.habilitarServicio = true;
                    }
                    if (res.data.servicio_utilizado == "envia EMPRESARIAL") {
                        $scope.pqr.cod_servicio = 11;
                        $scope.pqr.esconderServicio = false;
                        $scope.pqr.habilitarServicio = true;
                    }
                    if (res.data.servicio_utilizado == "PAQUETE TERRESTRE") {
                        $scope.pqr.cod_servicio = 12;
                        $scope.pqr.esconderServicio = false;
                        $scope.pqr.habilitarServicio = true;
                    }
                    if (res.data.servicio_utilizado == "PAQUETE AEREO") {
                        $scope.pqr.cod_servicio = 13;
                        $scope.pqr.esconderServicio = false;
                        $scope.pqr.habilitarServicio = true;
                    }
                    if (res.data.servicio_utilizado == "DOCUMENTO ELECTRONICO") {
                        $scope.pqr.cod_servicio = 14;
                        $scope.pqr.esconderServicio = false;
                        $scope.pqr.habilitarServicio = true;
                    }
                    


                    if ($scope.pqr.tipo_comentario === "Recurso") {
                        if (peso > 5) {
                            abrirModalError({ respuesta: "El presente trámite aplica solo para el servicio de mensajería expresa (Envíos hasta 5 Kilos)" });
                            $.LoadingOverlay("hide");
                        }
                    }
                    

            }, function (err) {
                $scope.pqr.guiaValida = false;
                abrirModalError({ respuesta: err.data.status_message });
                $.LoadingOverlay("hide");
            });


        }, function (err) {
            $scope.pqr.guiaValida = false;
            abrirModalError({ respuesta: err.data.status_message });
            $.LoadingOverlay("hide");
        });
    };

    $scope.generarPqr = function () {

        var tipo_recurso = 0;

        if ($scope.pqr.tipo_cliente === "Natural") {
            if ($scope.pqr.tipo_comentario === "Recurso") {
                $scope.pqr.tipo_comentario = "Queja";//$scope.pqr.tipo_comentarioR;

                tipo_recurso = $scope.pqr.tipo_comentarioR;

            }
        }


        var data = {
            "tipocliente": {
                "tipocliente": $scope.pqr.tipo_cliente
            },
            "tipocomentario": $scope.pqr.tipo_comentario,
            "nombre": $scope.pqr.datos_persona.nombre,
            "tipoidentificac": $scope.pqr.datos_persona.tipo_identificacion,
            "identificac": $scope.pqr.datos_persona.num_identificacion,
            "email": $scope.pqr.datos_persona.correo,
            "telefono": $scope.pqr.datos_persona.telefono,
            "celular": $scope.pqr.datos_persona.celular,
            "codigoservicio": $scope.pqr.cod_servicio,
            "tipo_recurso": tipo_recurso,

            "tienedocumento": {
                "tipo": $scope.pqr.tiene_documento.tipo,
                "documento": null
            },

            "datosremitente": {
                "direccion": $scope.pqr.datos_remitente.direccion,
                "ciudad": $scope.pqr.datos_remitente.ciudad
            },

            "notas": $scope.pqr.notas,
            "anexo": "link"
        }

        if ($scope.pqr.tipo_cliente == "Corporativo" || $scope.pqr.tipo_cliente == "Natural") {
            var razonsocial = $scope.pqr.datos_persona.razon_social;
            data.razonsocial = razonsocial;
        }

        if ($scope.pqr.tipo_cliente == "Natural") {
            if ($scope.pqr.tipo_comentario == "Solicitud" || $scope.pqr.tipopersona.persona == "Otro") {
                if ($scope.pqr.tiene_documento) {
                    $scope.pqr.tiene_documento.fecha = undefined;
                }
                data.tipocliente.tipocliente = "Corporativo";
            }

            if ($scope.pqr.tipo_comentario != "Solicitud" && $scope.pqr.tipopersona.persona != "Otro") {

                data.tienedocumento.fecharecogida = $("#fecha-recoleccion").val();

                data.tipopersona =
                    {
                        "tipo": $scope.pqr.tipopersona.persona
                    };
            }

            data.datosdestinatario =
                {
                    "nombre": $scope.pqr.datos_destinatario.nombre,
                    "direccion": $scope.pqr.datos_destinatario.direccion,
                    "ciudad": $scope.pqr.datos_destinatario.ciudad,
                    "telefono": $scope.pqr.datos_destinatario.telefono
                };
            data.datosremitente =
                {
                    "nombre": $scope.pqr.datos_remitente.nombre,
                    "telefono": $scope.pqr.datos_remitente.telefono
                };


            data.datosremitente =
                {
                    "nombre": $scope.pqr.datos_remitente.nombre,
                    "direccion": $scope.pqr.datos_remitente.direccion,
                    "telefono": $scope.pqr.datos_remitente.telefono,
                    "ciudad": $scope.pqr.datos_remitente.ciudad
                };


        }

        cargarGuia();
        data.tienedocumento.documento = $scope.pqr.data

        $("body").LoadingOverlay("show");
        $http.post($envia.conf().pqrs, data).then(
            function (res) {
                $scope.pqr.resultado = res.data;

                var body = $("html, body");
                body.animate({scrollTop: 1000}, 1000);

                $("body").LoadingOverlay("hide");
                abrirModalExito($scope.pqr.resultado);
                $scope.reset();

            },
            function (err) {
                $scope.pqr.error = err.data;
                $("body").LoadingOverlay("hide");
                abrirModalError($scope.pqr.error);

            }
        );
    };

    $scope.$watch("pqr.tipo_comentario", function (newValue, oldValue) {
        if (newValue != oldValue) {

            if (newValue != oldValue) {
                if (newValue != "Recurso") {
                    $scope.pqr.esconderRecurso = true;
                }
            }
            //$scope.pqr.num_guia = undefined;
            $scope.pqr.datos_persona = {};
            $scope.pqr.datos_remitente = {};
            $scope.pqr.tipo_comentario = newValue;
            //$scope.pqr.tiene_documento = {};
           // $(".num_guia, .rastrea-num-invalid").val("");
            $("#fecha-recoleccion").val("");


        }
        if (newValue == "Solicitud" && $scope.pqr.tipopersona) {
            $scope.pqr.tipopersona.persona = undefined;
            $scope.pqr.tiene_documento.fecha = undefined;
        }
    });

    $scope.$watch("pqr.tiene_documento.tipo", function (newValue, oldValue) {
        if (newValue != oldValue) {
            if (newValue == "0") {
                $scope.pqr.esconderServicio = true;
                $scope.pqr.guia = undefined;
                $scope.pqr.cod_servicio = 12;
                $scope.pqr.peticion = true;
            } else {
                if (newValue == "Orden") {
                    $scope.pqr.esconderServicio = true;
                    $scope.pqr.guia = undefined;
                    $scope.pqr.cod_servicio = 12;
                    $scope.pqr.peticion = true;
                } else {
                    $scope.pqr.cod_servicio = undefined;
                    $scope.pqr.peticion = false;
                }
            }
        }

    });



    function abrirModalExito(res) {
        $scope.resultado = {};
        $scope.resultado = res;

        $scope.modalInstance = $uibModal.open({
            templateUrl: '/modals/pqr-confirmacion.html',
            controller: 'modalgen-ctrl',
            scope: $scope,
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {}
        });
    }

    function abrirModalError(err) {
        $scope.resultado = {};
        $scope.resultado = err;

        $scope.modalInstance = $uibModal.open({
            templateUrl: '/modals/pqr-error.html',
            controller: 'modalgen-ctrl',
            scope: $scope,
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {}
        });
    }

    $scope.pqrValida = function () {
        var pqr = $scope.pqr;

        if (pqr.tipo_cliente == "Corporativo" ||
            (pqr.tipo_comentario == "Solicitud" && pqr.tipo_cliente == "Natural") ||
            (pqr.tipopersona && (pqr.tipopersona.persona == "Otro" && pqr.tipo_cliente == "Natural"))) {
            return (

                pqr.declaro && pqr.datos_persona.razon_social && pqr.datos_persona.nombre && pqr.datos_persona.tipo_identificacion &&
                pqr.datos_persona.num_identificacion && pqr.datos_remitente.direccion && pqr.datos_remitente.ciudad && pqr.datos_persona.celular &&
                pqr.datos_persona.telefono && pqr.datos_persona.correo && pqr.notas

            );
        }
        if (pqr.tipo_cliente == "Natural") {
            return (

                pqr.declaro && pqr.datos_persona.nombre && pqr.datos_persona.tipo_identificacion &&
                pqr.datos_persona.num_identificacion && pqr.datos_persona.correo && pqr.datos_persona.telefono &&
                pqr.datos_persona.celular && pqr.datos_remitente.nombre && pqr.datos_remitente.direccion &&
                pqr.datos_remitente.ciudad && pqr.datos_remitente.telefono && pqr.datos_destinatario.nombre &&
                pqr.datos_destinatario.direccion && pqr.datos_destinatario.ciudad && pqr.datos_destinatario.telefono && pqr.notas
            );
            //pendiente fecha debido a que este campo se llena solo cuando le doy un espacio
        }
    }

    $scope.funcionPrueba = function () {
        alert("Servicio: " + $scope.pqr.cod_servicio + " Valor: " + $scope.pqr.tipo_comentario);
    }

});

app.controller('gana-ctrl', function ($http, $rootScope, $scope, $envia, $uibModal, $timeout) {
    $scope.icons = undefined;
    $scope.consultar = undefined;

    $scope.byRange = function (fieldName, minValue, maxValue) {
        if (minValue === undefined || !(minValue > 0)) minValue = Number.MIN_VALUE;
        if (maxValue === undefined || !(maxValue > 0)) maxValue = Number.MAX_VALUE;

        return function predicateFunc(item) {
            return minValue <= item[fieldName] && item[fieldName] <= maxValue;
        };
    };

    $scope.byContains = function (fieldName, array) {
        return function predicateFunc(item) {
            return array.indexOf(item[fieldName]) >= 0 || array.length == 0;
        };
    };


    function cargarCategorias() {
        $http.get($envia.conf().categoriasPremios).then(
            function (res) {
                $scope.categorias = res.data[0].listado;
            },
            function (err) {
                $timeout(function () {
                    cargarCategorias();
                }, 300)
            });
    }

    function cargarCatalogo() {
        $http.get($envia.conf().premios).then(
            function (res) {
                $scope.premios = res.data[0].listado

            },
            function (err) {
                $timeout(function () {
                    cargarCatalogo();
                }, 1000)
            }
        );
    }

    $rootScope.$on("ssConf", function (svc) {
        cargarCategorias();
        cargarCatalogo();
    });


    $scope.consulta = function () {
        $http.get($envia.conf().puntos + $scope.consultar).then(
            function (res) {
                $scope.puntos = res.data;
                abrirModalExito($scope.puntos);
            },
            function (err) {
                $scope.puntos = err.data;
                abrirModalError($scope.puntos);
            }
        );
    };

    function abrirModalExito(res) {
        $scope.resultado = {};
        $scope.resultado = res;

        $scope.modalInstance = $uibModal.open({
            templateUrl: '/modals/gana-puntos.html',
            controller: 'modalgen-ctrl',
            scope: $scope,
            size: 'md',
            resolve: {}
        });
    }

    function abrirModalError(err) {
        $scope.resultado = {};
        $scope.resultado = err;

        $scope.modalInstance = $uibModal.open({
            templateUrl: '/modals/gana-puntos-error.html',
            controller: 'modalgen-ctrl',
            scope: $scope,
            size: 'md',
            resolve: {}
        });
    }


    function actualizarPorHash() {
        var hash = window.location.hash;

        switch (hash) {
            case "":
                $scope.icons = 1;
                break;
            case "#conoce":
                $scope.icons = 1;
                break;
            case "#inscribete":
                $scope.icons = 2;
                break;
            case "#consulta":
                $scope.icons = 3;
                break;
            case "#catalogo":
                $scope.icons = 4;
                $timeout(function () {
                        $(".grids_prods .easyzoom").matchHeight();
                        $(".grids_prods .prod-des").matchHeight();

                    },
                    500);
                break;

        }

    }

    function locationHashChanged(event) {
        var hash = location.hash;

        $timeout(function () {
            actualizarPorHash()
        });

        $timeout(function () {
            for (var i = 0; i < hash.length; i++) {
                var caracter = hash.charAt(i);
                if (caracter == "#") {
                    var body = $("html");
                    var pgopts = $("#pgopts");
                    ////console.log(pgopts);
                    body.animate({scrollTop: pgopts.offset().top}, 900);
                    ////console.log(hash)
                }
            }
        }, 50);
    };

    // Selected fruits
    $scope.selection = [];

    // Toggle selection for a given fruit by name
    $scope.toggleSelection = function toggleSelection(cod) {
        var idx = $scope.selection.indexOf(cod);

        // Is currently selected
        if (idx > -1) {
            $scope.selection.splice(idx, 1);
        }

        // Is newly selected
        else {
            $scope.selection.push(cod);
        }
    };

    window.addEventListener('load', locationHashChanged);
    window.addEventListener('hashchange', locationHashChanged, true);
    locationHashChanged();


});

app.controller('gana2', function ($scope, $http) {
    $http.get('https://portal.envia.co/ServicioRestConsultaEstados/Service1Consulta.svc/ConsultaEYG2/1216717942').then(
    //$http.get($envia.conf().puntos2 + '1216717942').then(
        function (res) {
            $scope.resultado = {};
            $scope.resultado = res.data;

        },
        function (err) {
            $scope.puntos = err.data;
        }
    );
})

app.controller('home-ctrl', function ($rootScope, $scope, $envia, $http, $timeout) {

    function cargarCifras() {
        $http.get($envia.conf().cifra).then(
            function (res) {
                $scope.cifras = res.data
                $timeout(function () {
                    if (Utils.isElementInView($(".cifras"))) {
                        AnimateCount();
                    }
                }, 200)
            },
            function (err) {
                $timeout(function () {
                    cargarCifras();
                }, 1000)
            }
        );
    }

    $rootScope.$on("ssConf", function (svc) {

        cargarCifras();

    });


});

app.controller('contacto-ctrl', function ($http, $rootScope, $scope, $envia, $uibModal, $timeout) {

    $scope.scCubrimiento = {
        valueField: 'cod_ciudad',
        labelField: 'nom_ciudad',
        placeholder: 'Ciudad',
        maxItems: 1,
        searchField: ['nom_ciudad', 'nom_departamento'],
        searchConjunction: 'or',
        render: {
            option: function (item, escape) {
                return '<div class="ss-coti-option">'
                    + escape(item.nom_ciudad) + ' - '
                    + escape(item.nom_departamento)
                    + '</div>';
            },
            item: function (item, escape) {
                return '<div>'
                    + escape(item.nom_ciudad) + ' - '
                    + escape(item.nom_departamento)
                    + '</div>';
            }
        }
    };

    $scope.buscarCiudad = function (codigo) {
        var listado = $scope.cubrimiento;
        if (listado) {
            for (var i = 0; i < listado.length; i++) {
                if (listado[i].cod_ciudad == codigo) {
                    return listado[i].nom_ciudad + " - " + listado[i].nom_departamento;
                }
            }
        }
    }

    function cargarCiudades() {
        var data = {

            "cod_regional": 1,
            "cod_servicio": 3
        };

        $http.post($envia.conf().cubrimiento, data).then(
            function (res) {
                $scope.cubrimiento = res.data[0].listado
            },
            function (err) {
                $timeout(function () {
                    cargarCiudades();
                }, 1000)
            }
        );
    }

    function cargarServicios() {
        $http.get($envia.conf().pqr_natural).then(
            function (res) {
                $scope.cod_servicio = res.data[0].listado;
            },
            function (err) {
                $timeout(function () {
                    cargarServicios();
                }, 1000)
            }
        );
    }

    $rootScope.$on("ssConf", function (svc) {

        cargarCiudades();
        cargarServicios();

    });

    $scope.scCod_servicios = {
        valueField: 'cod_servicio',
        labelField: 'nom_servicio',
        placeholder: 'Seleccione el servicio',
        maxItems: 1,
        searchField: ['nom_servicio'],
        searchConjunction: 'or',
        render: {
            option: function (item, escape) {
                return '<div class="ss-coti-option">'
                    + escape(item.nom_servicio)
                    + '</div>';
            },
            item: function (item, escape) {
                return '<div>'
                    + escape(item.nom_servicio)
                    + '</div>';
            }
        }
    };


    $scope.contacto = {};

    $scope.contactenos = function () {
        var data = {
            "email_cliente": $scope.contacto.correo,
            "nom_cliente": $scope.contacto.nombre,
            "tel_cliente": $scope.contacto.telefono,
            "cod_ciudad": $scope.contacto.cod_ciudad,
            "cod_servicio": $scope.contacto.cod_servicio,
            "mca_visitacomercial": $scope.contacto.solicita,
            "mensaje": $scope.contacto.mensaje
        };
        $("body").LoadingOverlay("show")
        $http.post($envia.conf().contactanos, data).then(
            function (res) {
                $scope.respuesta = res.data
                $("body").LoadingOverlay("hide")
                abrirModalExito($scope.respuesta);
                $scope.contacto = {};
            },
            function (err) {
                $scope.error = err.data
                $("body").LoadingOverlay("hide")
                abrirModalError($scope.error);
            }
        );
    };

    $scope.visitaValida = function () {
        var contacto = $scope.contacto;
        return (
            contacto.nombre && contacto.correo && contacto.telefono && contacto.cod_ciudad && contacto.cod_servicio && contacto.solicita
            && contacto.mensaje && contacto.declaro
        );
    };

    function abrirModalExito(res) {
        $scope.resultado = {};
        $scope.resultado = res;

        $scope.modalInstance = $uibModal.open({
            templateUrl: '/modals/contacto-confirmacion.html',
            controller: 'modalgen-ctrl',
            scope: $scope,
            size: 'md',
            resolve: {}
        });
    };

    function abrirModalError(err) {
        $scope.resultado = {};
        $scope.resultado = err;

        $scope.modalInstance = $uibModal.open({
            templateUrl: '/modals/contacto-error.html',
            controller: 'modalgen-ctrl',
            scope: $scope,
            size: 'md',
            resolve: {}
        });
    };

    $scope.buscar = function () {
        $(".cont_map").LoadingOverlay("show")

        $http.get($envia.conf().oficinas_ciudad + $scope.oficina.cod_ciudad).then(
            function (res) {
                $scope.respuesta = res.data[0].listado;
                $(".cont_map").LoadingOverlay("hide")
            },
            function (err) {
                $scope.error = err.data
                $(".cont_map").LoadingOverlay("hide")
            }
        );
    }

    $scope.ciudadValida = function () {
        var oficina = $scope.oficina;
        if (oficina) {
            return (
                oficina.cod_ciudad && oficina.direccion
            )
        }

    }

});

app.controller('footer-ctrl', function ($rootScope, $scope, $envia, $uibModal, $http, $timeout) {
    $scope.inscribe = {};
    $scope.inscribir = function () {
        $("body").LoadingOverlay("show")
        $http.get($envia.conf().inscribir_notienvia + $scope.inscribe.correo).then(
            function (res) {
                $scope.respuesta = res.data
                $("body").LoadingOverlay("hide")
                abrirModalExito($scope.respuesta);

                $scope.inscribe = {};
            },
            function (err) {
                $scope.error = err.data
                $("body").LoadingOverlay("hide");
                abrirModalError($scope.error);
            }
        );
    }


    $scope.inscripcionValida = function () {
        var inscribe = $scope.inscribe;
        if (inscribe) {

            return (
                inscribe.correo && inscribe.declaro
            );
        }
    }

    function abrirModalExito(res) {
        $scope.resultado = {};
        $scope.resultado = res;

        $scope.modalInstance = $uibModal.open({
            templateUrl: '/modals/notienvia-confirmacion.html',
            controller: 'modalgen-ctrl',
            scope: $scope,
            size: 'md',
            resolve: {}
        });
    }

    function abrirModalError(err) {
        $scope.resultado = {};
        $scope.resultado = err;

        $scope.modalInstance = $uibModal.open({
            templateUrl: '/modals/notienvia-error.html',
            controller: 'modalgen-ctrl',
            scope: $scope,
            size: 'md',
            resolve: {}
        });
    }


});

app.controller('perfil-ctrl', function ($rootScope, $scope, $timeout, $http, $envia, $uibModal, $auth) {


    $scope.search = '';

    //$http.get("http://200.69.100.66/ServicioRestRegistroClientePruebas/Service1.svc/ConsultarRegistro1");

    function actualizarUsuario() {
        $envia.actualizarUsuario(function (userData) {
            $scope.usuario = $auth.darUsuario();

            $.LoadingOverlay("hide");

            if (!$auth.verificarDatos() && window.location.href.indexOf("/perfil") > -1) {
                $auth.abrirModalCompletarDatos($uibModal);
            }

        }, function (err) {
            $timeout(function () {
                actualizarUsuario();
            }, 1000);

        });
    }

    $rootScope.$on("ssConf", function (svc) {

        cargarHistorial();
        cargarSectores();
        cargarCiudades();
        cargarPuntos();
        cargarCiudadesOficinas();
        cargarEnviosFrecuentes();
        cargarLugaresRecoleccion();
        cargarMisPuntos();
        $.LoadingOverlay("show", {zIndex: 2147483646});
        actualizarUsuario();

    });

    $rootScope.$on("userLoggedOut", function (svc) {
        window.location = "/";

    });


    $scope.usuario = $auth.darUsuario();


    if (!$scope.usuario) {
        window.location = "/";
    }

    $scope.scSectoresEconomicos = {
        valueField: 'cod_sector',
        labelField: 'nom_sector',
        placeholder: 'Sector economico',
        maxItems: 1,
        searchField: ['nom_sector'],
        searchConjunction: 'or',
        render: {
            option: function (item, escape) {
                return '<div class="ss-coti-option">'
                    + escape(item.nom_sector)
                    + '</div>';
            },
            item: function (item, escape) {
                return '<div>'
                    + escape(item.nom_sector)
                    + '</div>';
            }
        }
    };

    $scope.tipos_documentos = [
        {cod: 1, nom: 'Cedula'},
        {cod: 2, nom: 'NIT'},
        {cod: 3, nom: 'Pasaporte'},
        {cod: 4, nom: 'Cedula extranjera'}
    ];

    $scope.scDocumento = {
        valueField: 'cod',
        labelField: 'nom',
        placeholder: 'Tipo',
        maxItems: 1,
        searchField: ['nom'],
        searchConjunction: 'or',
    };

    $scope.scCubrimiento = {
        valueField: 'cod_ciudad',
        labelField: 'nom_ciudad',
        placeholder: 'Ciudad',
        maxItems: 1,
        searchField: ['nom_ciudad', 'nom_departamento'],
        searchConjunction: 'or',
        render: {
            option: function (item, escape) {
                return '<div class="ss-coti-option">'
                    + escape(item.nom_ciudad) + ' - '
                    + escape(item.nom_departamento)
                    + '</div>';
            },
            item: function (item, escape) {
                return '<div>'
                    + escape(item.nom_ciudad) + ' - '
                    + escape(item.nom_departamento)
                    + '</div>';
            }
        }
    };
    $scope.scCiudades = {
        valueField: 'ciudad',
        labelField: 'nom_ciudad',
        placeholder: 'Ciudad',
        maxItems: 1,
        searchField: ['nom_ciudad', 'nom_departamento'],
        searchConjunction: 'or',
        render: {
            option: function (item, escape) {
                return '<div class="ss-coti-option">'
                    + escape(item.nom_ciudad) + ' - '
                    + escape(item.nom_departamento)
                    + '</div>';
            },
            item: function (item, escape) {
                return '<div>'
                    + escape(item.nom_ciudad) + ' - '
                    + escape(item.nom_departamento)
                    + '</div>';
            }
        }
    };

    $scope.scBarrios = {
        valueField: 'barrio',
        labelField: 'barrio',
        placeholder: 'Barrio',
        maxItems: 1,
        searchField: ['barrio'],
        searchConjunction: 'or',
        render: {
            option: function (item, escape) {
                return '<div class="ss-coti-option">'
                    + escape(item.barrio)
                    + '</div>';
            },
            item: function (item, escape) {
                return '<div>'
                    + escape(item.barrio) +
                    '</div>';
            }
        }
    };

    function cargarCiudades() {
        var data = {

            "cod_regional": 1,
            "cod_servicio": 3
        };

        $http.post($envia.conf().cubrimiento, data).then(
            function (res) {
                $scope.cubrimiento = res.data[0].listado
            },
            function (err) {
                $timeout(function () {
                    cargarCiudades();
                }, 1000)
            }
        );
    }

    function cargarCiudadesOficinas() {
        $http.get($envia.conf().consultaCiudades).then(
            function (res) {
                $scope.ciudadesOficinas = res.data[0].listado
            },
            function (err) {
                $timeout(function () {
                    cargarCiudadesOficinas();
                }, 1000)
            }
        );
    }

    function cargarBarrios(codCiudad) {
        if (!codCiudad) return;
        if (!$envia.conf()) {
            $timeout(function () {
                cargarBarrios(codCiudad);
            }, 1000);
        }
        else {
            $http.get($envia.conf().consultaBarrioCiudades + codCiudad).then(
                function (res) {
                    $scope.favoritos.busqueda.barriosCiudad = res.data[0].listado
                    $("#favoritos-consulta").LoadingOverlay("hide");
                },
                function (err) {
                    $timeout(function () {
                        cargarBarrios(codCiudad);
                    }, 1000)
                }
            );
        }
    }

    function cargarSectores() {
        $http.get($envia.conf().sector).then(
            function (res) {
                $scope.sector = res.data[0].listado
            },
            function (err) {
                $timeout(function () {
                    cargarSectores();
                }, 1000)
            }
        );
    }

    function cargarPuntos() {
        if ($scope.usuario) {

            $http.get($envia.conf().puntos + $scope.usuario.num_cliente).then(
                function (res) {
                    $scope.puntos = res.data;
                },
                function (err) {
                    $scope.sinpuntos = err.data;
                }
            );
        }
    }


    $scope.historial = {
        enviosEnProceso: {loading: true, data: []},
        recogidasEnProceso: {loading: true, data: []},
        enviosRealizados: {loading: true, data: []},
    };

    $scope.favoritos = {
        busqueda: {ciudad: null, barrio: null, barriosCiudad: []},
        frecuentes: {loading: true, data: []},
        enviosFrecuentes: {loading: true, data: []},
        lugaresRecoleccion: {loading: true, data: []},
        misPuntos: {loading: true, data: []},
    };

    function cargarEnviosFrecuentes() {
        $scope.favoritos.enviosFrecuentes.loading = true;
        $http.get($envia.conf().consultarEnviosFrecuentes + $scope.usuario.email_cliente).then(
            function (res) {
                $scope.favoritos.enviosFrecuentes.loading = false;
                $scope.favoritos.enviosFrecuentes.data = res.data[0].listado;

            },
            function (err) {
                $timeout(function () {
                    cargarEnviosFrecuentes();
                }, 1000)
            }
        );
    };

    function cargarLugaresRecoleccion() {
        $scope.favoritos.lugaresRecoleccion.loading = true;
        $scope.favoritos.lugaresRecoleccion.data = [];
        $http.get($envia.conf().consultaLugaresRecoleccion + $scope.usuario.email_cliente).then(
            function (res) {
                $scope.favoritos.lugaresRecoleccion.loading = false;
                $scope.favoritos.lugaresRecoleccion.data = res.data[0].listado;

            },
            function (err) {
                $timeout(function () {
                    cargarLugaresRecoleccion();
                }, 1000)
            }
        );
    };

    function cargarMisPuntos() {
        $scope.favoritos.misPuntos.loading = true;
        $scope.favoritos.misPuntos.data = [];
        $http.get($envia.conf().consultaMisPuntosServicio + $scope.usuario.email_cliente).then(
            function (res) {
                $scope.favoritos.misPuntos.loading = false;
                $scope.favoritos.misPuntos.data = res.data[0] && res.data[0].listado ? res.data[0].listado : [];

            },
            function (err) {
                $timeout(function () {
                    cargarMisPuntos();
                }, 1000)
            }
        );
    };

    $scope.consultarOficinasCiudadBarrio = function () {
        var data = {
            ciudad: $scope.favoritos.busqueda.ciudad,
            barrio: $scope.favoritos.busqueda.barrio,
            email_cliente: $auth.darUsuario().email_cliente
        }
        $("#favoritos-consulta").LoadingOverlay("show");
        $scope.favoritos.busqueda.resultados = [];
        $http.post($envia.conf().consultaOficinasCiudadBarrio, data).then(function (res) {
            $scope.favoritos.busqueda.resultados = res.data[0].listado;
            $("#favoritos-consulta").LoadingOverlay("hide");
        }, function (err) {
            $scope.favoritos.busqueda.resultados = [];
            $("#favoritos-consulta").LoadingOverlay("hide");
        });
    };

    function cargarHistorial() {
        if ($scope.usuario) {

            $http.get($envia.conf().ConsultaHistorialOS + $scope.usuario.num_cliente).then(
                function (res) {
                    $scope.historial.recogidasEnProceso.loading = false;
                    $scope.historial.recogidasEnProceso.data = res.data[0].listado;

                },
                function (err) {
                    $scope.historial.recogidasEnProceso.loading = false;
                }
            );

            $http.get($envia.conf().ConsultaHistorialGuias + $auth.darUsuario().num_cliente).then(
                function (res) {
                    $scope.historial.enviosEnProceso.loading = false;
                    $scope.historial.enviosEnProceso.data = res.data[0].listado;

                },
                function (err) {
                    $scope.historial.enviosEnProceso.loading = false;
                }
            );

            $http.get($envia.conf().ConsultaHistorialGuiasRealizadas + $auth.darUsuario().num_cliente).then(
                function (res) {
                    $scope.historial.enviosRealizados.loading = false;
                    $scope.historial.enviosRealizados.data = res.data[0].listado;

                },
                function (err) {
                    $scope.historial.enviosRealizados.loading = false;
                }
            );
        }
    }

    function abrirModalError(err) {
        $scope.resultado = err;

        $scope.modalInstance = $uibModal.open({
            templateUrl: '/modals/modal-error-gen.html',
            controller: 'modalgen-ctrl',
            scope: $scope,
            size: 'md',
            resolve: {}
        });
    }

    $scope.editar = function () {
        $("body").LoadingOverlay("show");
        var data = {

            "nom_cliente": $scope.usuario.nom_cliente,
            "tipoid_num_cliente": $scope.usuario.num_cliente,
            "num_cliente": $scope.usuario.tipoid_num_cliente,
            "dir_cliente": $scope.usuario.dir_cliente,
            "tel_cliente": $scope.usuario.tel_cliente,
            "tel_celular": $scope.usuario.tel_celular,
            "ciudad": $scope.usuario.ciudad,
            "email_cliente": $scope.usuario.email_cliente,
            "contrasena": $scope.usuario.contrasena,
            "mca_genero": $scope.usuario.mca_genero,
            "fec_nacimiento": $scope.usuario.fec_nacimiento,
            "mca_independiente": $scope.usuario.mca_independiente,
            "profesion": $scope.usuario.profesion,
            "mca_empleado": $scope.usuario.mca_empleado,
            "nom_empresa": $scope.usuario.nom_empresa,
            "cod_sector": $scope.usuario.cod_sector,
            "cargo_empresa": $scope.usuario.cargo_empresa,
            "mca_estadocivil": $scope.usuario.mca_estadocivil,
            "num_hijos": $scope.usuario.num_hijos

        }

        $envia.actualizarDatosUsuario(data).then(
            function (res) {
                $scope.actualizado = res.data;

                $("body").LoadingOverlay("hide");

                $scope.resultado = {};
                $scope.resultado = res.respuesta;

                $scope.modalInstance = $uibModal.open({
                    templateUrl: '/modals/edicion-exito.html',
                    controller: 'modalgen-ctrl',
                    scope: $scope,
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {}
                });

            },
            function (err) {
                $("body").LoadingOverlay("hide");
                abrirModalError(err.data);
                //console.log(err);


            }
        );

    };

    $scope.rastrear = function (guia) {
        $envia.abrirModalRastrea(guia);

    }

    $scope.rastrearForm = function (elId) {
        var guia = "";
        var form = $("#" + elId);
        var valid = true;
        form.find('input').each(function (i, input) {
            var $input = $(input);
            guia += $input.val();
            if ($input.val().toString().length === 0) {
                valid = false;
            }
        });
        if (valid || true) {
            $envia.abrirModalRastrea(guia);
            form.find('input').each(function (i, input) {
                $(input).val("")
            });
        }
    }

    function abrirModalExito(res) {
        $scope.resultado = res;

        $scope.modalInstance = $uibModal.open({
            templateUrl: '/modals/modal-exito.html',
            controller: 'modalgen-ctrl',
            scope: $scope,
            size: 'md',
            resolve: {}
        });
    }

    function abrirModalError(err) {
        $scope.resultado = err;

        $scope.modalInstance = $uibModal.open({
            templateUrl: '/modals/modal-error-gen.html',
            controller: 'modalgen-ctrl',
            scope: $scope,
            size: 'md',
            resolve: {}
        });
    }

    $scope.agregarLugarRecoleccion = function (lugar) {
        $(".tabla-pts-recoleccion").LoadingOverlay("show");
        lugar.estado = 1;
        lugar.email_cliente = $auth.darUsuario().email_cliente;

        function limpiarLugar() {
            for (var key in lugar) {
                lugar[key] = undefined;
            }
        }

        $http.post($envia.conf().agregarLugarRecoleccion, lugar).then(
            function (res) {
                abrirModalExito(res.data);
                limpiarLugar();
                cargarLugaresRecoleccion();
                $(".tabla-pts-recoleccion").LoadingOverlay("hide");
            },
            function (err) {
                abrirModalError(err.data);
                $(".tabla-pts-recoleccion").LoadingOverlay("hide");
            }
        );


    };
    $scope.marcarPDSFavorito = function (pds) {
        $("#mis-puntos-de-servicio").LoadingOverlay("show");
        var data = {
            "email_cliente": $auth.darUsuario().email_cliente,
            "cod_oficina": pds.cod_oficina,
            "estado": pds.es_favorita === 1 ? 0 : 1
        };

        $http.post($envia.conf().marcarPDSFavorito, data).then(
            function (res) {
                abrirModalExito(res.data);
                pds.es_favorita = data.estado;
                cargarMisPuntos();
                $("#mis-puntos-de-servicio").LoadingOverlay("hide");
            },
            function (err) {
                abrirModalError(err.data);
                $("#mis-puntos-de-servicio").LoadingOverlay("hide");
            }
        );
    };

    $scope.eliminarLugarRecoleccion = function (lugar) {
        $(".tabla-pts-recoleccion").LoadingOverlay("show");
        lugar.estado = 0;
        lugar.email_cliente = $auth.darUsuario().email_cliente;

        $http.post($envia.conf().agregarLugarRecoleccion, lugar).then(
            function (res) {
                abrirModalExito(res.data);
                cargarLugaresRecoleccion();
                $(".tabla-pts-recoleccion").LoadingOverlay("hide");
            },
            function (err) {
                abrirModalError(err.data);
                $(".tabla-pts-recoleccion").LoadingOverlay("hide");
            }
        );


    };

    $scope.actualizarCalificacion = function (item, calificacion) {
        item.ranking = calificacion;
        var data = {
            guia: item.guia,
            ranking: calificacion
        }
        ////console.log(item, calificacion);  
        $.LoadingOverlay("show");
        $http.post($envia.conf().actualizarCalificacionEnvio, data).then(function (res) {
            cargarHistorial();
            $.LoadingOverlay("hide");
        }, function (err) {
            $.LoadingOverlay("hide");
            abrirModalError(err.data);
        });
    };
    $scope.actualizarEnvioFrecuente = function (guia, estado) {
        var data = {
            guia: guia,
            estado: estado
        };
        $.LoadingOverlay("show");
        $http.post($envia.conf().actualizarEnvioFrecuente, data).then(function (res) {
            cargarHistorial();
            $.LoadingOverlay("hide");
        }, function (err) {
            abrirModalError(err.data);
            $.LoadingOverlay("hide");
        })
    }

    $scope.$watch("favoritos.busqueda.ciudad", function (newVal, oldVal) {
        $scope.favoritos.busqueda.resultados = [];
        if (!newVal) return;
        $("#favoritos-consulta").LoadingOverlay("show");
        $scope.favoritos.busqueda.barrio = undefined;
        cargarBarrios(newVal);
    });

});


app.controller('promociones-ctrl', function ($http, $rootScope, $scope, $envia, $uibModal, $timeout) {

    $scope.filtro = {
        ciudad: null,
        barrio: null,
        campana: null,
        valid: function () {
            return this.campana != null && this.barrio != null;
        }
    };


    $scope.scCiudades = {
        valueField: 'cod_ciudad',
        labelField: 'nom_ciudad',
        placeholder: 'Ciudad',
        maxItems: 1,
        searchField: ['nom_ciudad', 'nom_departamento'],
        searchConjunction: 'or',
        render: {
            option: function (item, escape) {
                return '<div class="ss-coti-option">'
                    + escape(item.nom_ciudad) + ' - '
                    + escape(item.nom_departamento)
                    + '</div>';
            },
            item: function (item, escape) {
                return '<div>'
                    + escape(item.nom_ciudad) + ' - '
                    + escape(item.nom_departamento)
                    + '</div>';
            }
        }
    };

    $scope.scBarrios = {
        valueField: 'barrio',
        labelField: 'barrio',
        placeholder: 'Barrio',
        maxItems: 1,
        searchField: ['barrio'],
        searchConjunction: 'or',
        render: {
            option: function (item, escape) {
                return '<div class="">'
                    + escape(item.barrio)
                    + '</div>';
            },
            item: function (item, escape) {
                return '<div>'
                    + escape(item.barrio)
                    + '</div>';
            }
        }
    };

    $scope.scPromociones = {
        valueField: 'cod_promocion',
        labelField: 'des_promocion',
        placeholder: 'Campaña promocional',
        maxItems: 1,
        searchField: ['des_promocion'],
        searchConjunction: 'or',
        render: {
            option: function (item, escape) {
                return '<div class="">'
                    + escape(item.des_promocion)
                    + '</div>';
            },
            item: function (item, escape) {
                return '<div>'
                    + escape(item.des_promocion)
                    + '</div>';
            }
        }
    };

    function cargarCiudades() {rastrear
        var data = {
            "cod_regional": 1,
            "cod_servicio": 3
        };

        $http.post($envia.conf().cubrimiento, data).then(
            function (res) {
                $scope.ciudades = res.data[0].listado;

            },
            function (err) {
                $timeout(function () {
                    cargarCiudades();
                }, 1000)
            }
        );
    }

    function cargarBarrios(ciudad) {

        $http.get($envia.conf().consultaBarrios + "/" + ciudad).then(
            function (res) {
                $scope.barrios = res.data[0].listado;
                $scope.filtro.barrio = null;
                $(".consulta-promociones").LoadingOverlay("hide")
            },
            function (err) {
                $(".consulta-promociones").LoadingOverlay("hide")
                for (var i = 0; i < $scope.ciudades.length; i++) {
                    if ($scope.ciudades[i].cod_ciudad == $scope.filtro.ciudad) {
                        $scope.barrios = [{"barrio": $scope.ciudades[i].nom_ciudad}];
                    }
                }
                /*          $timeout(function () {
                              cargarBarrios(ciudad);
                          }, 500)*/
            }
        );
    }

    function cargarDatos() {

        $http.get($envia.conf().campanasActivas).then(
            function (res) {
                $scope.campanasActivas = res.data[0].listado
                for (var i = 0; i < $scope.campanasActivas.length; i++) {
                    var act = $scope.campanasActivas[i];
                    act.href = "/promociones/" + act.cod_promocion + "/" + slugify(act.des_promocion);
                    ////console.log(act);
                }
                setTimeout(function () {
                    $(".cols_promo a").matchHeight();
                }, 200);
            },
            function (err) {
                $timeout(function () {
                    cargarDatos();
                }, 1000)
            }
        );
    }

    $scope.consultar = function () {
        $scope.resultados = [];
        $(".consulta-promociones").LoadingOverlay("show");
        var data = {
            cod_ciudad: $scope.filtro.ciudad,
            barrio: $scope.filtro.barrio,
            cod_promocion: $scope.filtro.campana
        };
        $http.post($envia.conf().consultaOficinasPromociones, data).then(
            function (res) {
                $scope.resultados = res.data[0].listado;
                $(".consulta-promociones").LoadingOverlay("hide");

            },
            function (err) {
                $scope.resultados = [];
                $(".consulta-promociones").LoadingOverlay("hide");
            }
        );

    };

    $rootScope.$on("ssConf", function (svc) {
        cargarDatos();
        cargarCiudades();
    });

    $scope.$watch("filtro.ciudad", function (newVal, oldVal) {
        if (newVal) {
            $(".consulta-promociones").LoadingOverlay("show");
            $scope.filtro.barrio = null;
            cargarBarrios(newVal);
        }
    });


});


app.controller('faq-ctrl', function ($http, $rootScope, $scope, $envia, $uibModal, $timeout) {

    function abrirModalError() {

        $scope.modalInstance = $uibModal.open({
            templateUrl: '/modals/visita-error.html',
            controller: 'modalgen-ctrl',
            scope: $scope,
            size: 'md',
            resolve: {}
        });

    }

    function abrirModalExito() {

        $scope.modalInstance = $uibModal.open({
            templateUrl: '/modals/visita-confirmacion.html',
            controller: 'modalgen-ctrl',
            scope: $scope,
            size: 'md',
            resolve: {}
        });
    }

    $scope.abrirCotizador = function () {


        $scope.onInit = function () {
            //$.LoadingOverlay("show");
            ajustarCotizador();

        };

        $scope.modalInstance = $uibModal.open({
            templateUrl: '/cotizador.html',
            controller: 'cotizador-ctrl',
            scope: $scope,
            size: 'md',
            resolve: {}
        });

    };

    $scope.registrarMailPortafolio = function (mail, obj) {
        var url = $envia.conf().registrarMailPortafolio + mail;
        if (obj) {
            obj.email = '';
            obj.tyc = false;
        }
        $.LoadingOverlay("show");
        $http.get(url).then(function (res) {
            ////console.log(data);
            $.LoadingOverlay("hide");
            $scope.resultado = {
                respuesta: res.data.status_message
            };
            abrirModalExito();

        }, function (err) {
            ////console.log(err); 
            $.LoadingOverlay("hide");
            $scope.resultado = {
                respuesta: err.data.status_message
            };
            abrirModalError();
        });
    }
});


app.controller('general-ctrl', function ($rootScope, $http, $scope, $envia, $uibModal, $timeout) {

    function cargarSectoresEconomicos() {
        $scope.sectoresEconomicos = [];
        $http.get($envia.conf().consultaActividadesEconomicas).then(
            function (res) {
                $scope.sectoresEconomicos = res.data[0] && res.data[0].listado ? res.data[0].listado : [];

            },
            function (err) {
                $timeout(function () {
                    cargarSectoresEconomicos();
                }, 1000)
            }
        );
    };

    $rootScope.$on("ssConf", function (svc) {
        $timeout(function () {
            $envia.cargarRegionales($scope);
            $envia.cargarCiudades($scope);
            cargarSectoresEconomicos();
            if (["/quienes_somos"].indexOf(window.location.pathname) >= 0) {
                $envia.cargarOfertasLaborales($scope);
                $scope.solicitud = {};

            }

        });

    });

    $scope.scCubrimiento = {
        valueField: 'cod_ciudad',
        labelField: 'nom_ciudad',
        placeholder: 'Ciudad',
        maxItems: 1,
        searchField: ['nom_ciudad', 'nom_departamento'],
        searchConjunction: 'or',
        render: {
            option: function (item, escape) {
                return '<div class="ss-coti-option">'
                    + escape(item.nom_ciudad) + ' - '
                    + escape(item.nom_departamento)
                    + '</div>';
            },
            item: function (item, escape) {
                return '<div>'
                    + escape(item.nom_ciudad) + ' - '
                    + escape(item.nom_departamento)
                    + '</div>';
            }
        }
    };

    $scope.scOfertas = {
        valueField: 'cod_cargo',
        labelField: 'nom_cargo',
        placeholder: 'Oferta',
        maxItems: 1,
        searchField: ['nom_cargo'],
        searchConjunction: 'or',
        render: {
            option: function (item, escape) {
                return '<div class="ss-coti-option">'
                    + escape(item.nom_cargo)
                    + '</div>';
            },
            item: function (item, escape) {
                return '<div>'
                    + escape(item.nom_cargo)
                    + '</div>';
            }
        }
    };

    $scope.scSectores = {
        valueField: 'cod_sector',
        labelField: 'nom_sector',
        placeholder: 'Actividad comercial (Establecimiento comercial)',
        maxItems: 1,
        searchField: ['nom_sector'],
        searchConjunction: 'or',
        render: {
            option: function (item, escape) {
                return '<div class="ss-coti-option">'
                    + escape(item.nom_sector)
                    + '</div>';
            },
            item: function (item, escape) {
                return '<div>'
                    + escape(item.nom_sector)
                    + '</div>';
            }
        }
    };

    $scope.scDocumento = {
        valueField: 'cod',
        labelField: 'nom',
        placeholder: 'Tipo',
        maxItems: 1,
        searchField: ['nom'],
        searchConjunction: 'or',
    };

    $scope.tipos_doc = [
        {cod: 1, nom: 'CC'},
        {cod: 2, nom: 'NIT'},
        {cod: 3, nom: 'PP'},
        {cod: 4, nom: 'CE'}
    ];

    function abrirModalExito(res) {
        $scope.resultado = {};
        $scope.resultado = res;

        $scope.modalInstance = $uibModal.open({
            templateUrl: '/modals/modal-exito.html',
            controller: 'modalgen-ctrl',
            scope: $scope,
            size: 'md',
            resolve: {}
        });
    }

    function abrirModalError(err) {
        $scope.resultado = {};
        $scope.resultado = err;

        $scope.modalInstance = $uibModal.open({
            templateUrl: '/modals/modal-error-gen.html',
            controller: 'modalgen-ctrl',
            scope: $scope,
            size: 'md',
            resolve: {}
        });
    }

    $scope.solicitudOfertaValida = function (solicitud) {
        return solicitud && solicitud.nom_persona && solicitud.tel_persona && solicitud.email_persona && solicitud.ciudad && solicitud.cod_oferta && solicitud.autorizacion && solicitud.anexo_hv;
    };

    $scope.enviarSolicitudOferta = function (solicitud) {
        if (!$scope.solicitudOfertaValida(solicitud)) return;
        $.LoadingOverlay("show");
        solicitud = angular.copy(solicitud);
        solicitud.archivo64 = solicitud.anexo_hv.base64;
        solicitud.anexo_hv = solicitud.anexo_hv.filename;
        $http.post($envia.conf().aplicarOfertaLaboral, solicitud).then(
            function (res) {
                $scope.respuesta = res.data;
                $.LoadingOverlay("hide");
                abrirModalExito($scope.respuesta);
                $scope.visita = {};
            },
            function (err) {
                $scope.error = err.data;
                $.LoadingOverlay("hide");
                abrirModalError($scope.error)
            }
        );
    };

    $scope.enviarRegistroNuestraRed = function (solicitud) {
        $.LoadingOverlay("show");
        $http.post($envia.conf().registroNuestraRed, solicitud).then(
            function (res) {
                $scope.respuesta = res.data;
                $.LoadingOverlay("hide");
                abrirModalExito($scope.respuesta);
                $scope.registroNuestraRed = {};
            },
            function (err) {
                $scope.error = err.data;
                $.LoadingOverlay("hide");
                abrirModalError($scope.error)
            }
        );
    }

});


app.controller('documentoslegales-ctrl', function ($rootScope, $http, $scope, $envia, $uibModal, $timeout, $window) {

    function cargarTiposDocumentosLegales() {
        $scope.tiposDocumentos = [];
        $http.get($envia.conf().tipoDocumentosLegales).then(
            function (res) {
                $scope.tiposDocumentos = res.data[0] && res.data[0].listado ? res.data[0].listado : [];

            },
            function (err) {
                $timeout(function () {
                    cargarTiposDocumentosLegales();
                }, 1000)
            }
        );
    };
    function cargarAniosDocumentosLegales() {
        $scope.aniosDocumentos = [];
        $http.get($envia.conf().anioDocumentosLegales).then(
            function (res) {
                $scope.aniosDocumentos = res.data[0] && res.data[0].listado ? res.data[0].listado : [];

            },
            function (err) {
                $timeout(function () {
                    cargarAniosDocumentosLegales();
                }, 1000)
            }
        );
    };

    $rootScope.$on("ssConf", function (svc) {
        $timeout(function () {
            cargarTiposDocumentosLegales();
            cargarAniosDocumentosLegales();

        });

    });

    $scope.scTipoDocumento = {
        valueField: 'cod_documento',
        labelField: 'des_documento',
        placeholder: 'Tipo',
        maxItems: 1,
        searchField: ['des_documento'],
        searchConjunction: 'or',
        render: {
            option: function (item, escape) {
                return '<div class="ss-coti-option">'
                    + escape(item.des_documento)
                +'</div>';
            },
            item: function (item, escape) {
                return '<div>'
                    + escape(item.des_documento) 
                    +'</div>';
            }
        }
    };
    
    $scope.scAnioDocumento = {
        valueField: 'year_documento',
        labelField: 'year_documento',
        placeholder: 'Año',
        maxItems: 1,
        searchField: ['year_documento'],
        searchConjunction: 'or',
        render: {
            option: function (item, escape) {
                return '<div class="ss-coti-option">'
                    + escape(item.year_documento)
                +'</div>';
            },
            item: function (item, escape) {
                return '<div>'
                    + escape(item.year_documento) 
                    +'</div>';
            }
        }
    };
    

    function abrirModalExito(res) {
        $scope.resultado = {};
        $scope.resultado = res;

        $scope.modalInstance = $uibModal.open({
            templateUrl: '/modals/modal-exito.html',
            controller: 'modalgen-ctrl',
            scope: $scope,
            size: 'md',
            resolve: {}
        });
    }

    function abrirModalError(err) {
        $scope.resultado = {};
        $scope.resultado = err;

        $scope.modalInstance = $uibModal.open({
            templateUrl: '/modals/modal-error-gen.html',
            controller: 'modalgen-ctrl',
            scope: $scope,
            size: 'md',
            resolve: {}
        });
    }

    $scope.descargarCertificado = function (nit, tipo, anio) {
        $.LoadingOverlay("show");
        var data={
            "cod_documento": tipo,
            "identificacion": nit+"",
            "year_documento": anio
        };
        $http.post($envia.conf().descargaDocumentosLegales, data).then(function (res) {
            $.LoadingOverlay("hide");
            $scope.dcTipo = "";
            $scope.dcAnio = "";
            $scope.dcNit ="";
            abrirModalExito(res.data);
        }, function(err){
            $scope.dcTipo = "";
            $scope.dcAnio = "";
            $scope.dcNit ="";
            abrirModalError(err.data);
            $.LoadingOverlay("hide");
        })
    };

});

app.controller('landingEcommerce', function ($scope, $envia, $auth, $rootScope, $http, $timeout, $window) {

    $scope.usuario = $auth.darUsuario();

    $scope.Contacto = {
        TipoId: null,
        Identificacion:null,
        Nombre: null,
        telefono: null,
        correo: null,
        Empresa: null,
        Envios: null,
        url: null,
        declaro: null,
        Cod_Ciudad: null,
        Direccion:null
    }

    $scope.scCubrimiento = {
        valueField: 'cod_ciudad',
        labelField: 'nom_ciudad',
        placeholder: 'Ciudad',
        maxItems: 1,
        searchField: ['nom_ciudad', 'nom_departamento'],
        searchConjunction: 'or',
        render: {
            option: function (item, escape) {
                return '<div class="ss-coti-option">'
                    + escape(item.nom_ciudad) + ' - '
                    + escape(item.nom_departamento)
                    + '</div>';
            },
            item: function (item, escape) {
                return '<div>'
                    + escape(item.nom_ciudad) + ' - '
                    + escape(item.nom_departamento)
                    + '</div>';
            }
        }
    };

    function cargarCiudades() {
        var data = {

            "cod_regional": 1,
            "cod_servicio": 3
        };

        $http.post($envia.conf().cubrimiento, data).then(
            function (res) {
                $scope.Contacto.cubrimiento = res.data[0].listado
            },
            function (err) {
                $timeout(function () {
                    cargarCiudades();
                }, 1000)
            }
        );
    }

    $rootScope.$on("ssConf", function (svc) {
        cargarCiudades();

    });

    $scope.GuardarContacto = function () {

        var ciudad = $scope.Contacto.Cod_Ciudad.split(" - ")

        $scope.CiudadCodPersonal = ciudad[2];
        $scope.NomCiudadPersonal = ciudad[0] + " - " + ciudad[1];


        if ($scope.Contacto.TipoId === "1" && !$scope.Contacto.Identificacion.includes("-")) {
            alert("Debe ingresar el digíto de verificación precedido por - ");
            return;
        }

        $envia.ContactoLanding($scope.Contacto.TipoId, $scope.Contacto.Identificacion, $scope.Contacto.Nombre, $scope.Contacto.telefono, $scope.Contacto.correo,
                $scope.Contacto.Empresa, $scope.Contacto.url, $scope.CiudadCodPersonal, $scope.Contacto.declaro == true ? 1 : 0, $scope.Contacto.Envios, $scope.Contacto.Direccion)
                .then(function (regData) {

                    console.log(regData);

                    $scope.resultado = {};
                    $scope.correo = {};
                    $scope.resultado = regData.respuesta;

                    $scope.Contacto.TipoId = null,
                    $scope.Contacto.Identificacion = null,
                    $scope.Contacto.Nombre = null;
                    $scope.Contacto.telefono = null;
                    $scope.Contacto.correo = null;
                    $scope.Contacto.Empresa = null;
                    $scope.Contacto.url = null;
                    $scope.CiudadCodPersonal = null;
                    $scope.Contacto.declaro = false;

                    if ($scope.resultado == "registro insertado") {
                        $window.location.assign("correorecibido");
                    } else {
                        alert("Error, Por favor valide la información! ");
                    }

                }, function (err) {
                    console.error(err);
                    $scope.resultado = {};
                    $scope.resultado = err;
                    console.log(err);
                    alert($scope.resultado.respuesta);
                });  
    };
});

app.controller('chatboot', function ($scope) {

    $scope.Registro = {
        Chat: true,
        Boton: false,
        Cerrar: true
    }

    $scope.btnActivar = function () {
        $scope.Registro.Chat = false;
        $scope.Registro.Boton = true;
        $scope.Registro.Cerrar = false;
    }

    $scope.CerrarChat = function () {
        $scope.Registro.Chat = true;
        $scope.Registro.Boton = false;
        $scope.Registro.Cerrar = true;
    }
});

//======================================================================================
// EXTRA 
//======================================================================================

app.directive("rateYo", function () {
    return {
        restrict: "E",
        scope: {
            rating: "=",
            rychange: "&"
        },
        template: "<div class='rateYo'></div>",
        link: function (scope, ele, attrs) {
            $(ele).rateYo({
                rating: scope.rating,
                normalFill: "#9C9CA0",
                starWidth: "18px",
                precision: 0,
                multiColor: {
                    "startColor": "#88888A",
                    "endColor": "#565657"
                }
            }).on("rateyo.set", function (e, data) {

                //alert("The rating is set to " + data.rating + "!");
                ////console.log("onChange = "+data.rating);
                scope.rating = data.rating;
                if (scope.rychange) {
                    scope.rychange({rating: data.rating});
                }
            });
        }
    };
});
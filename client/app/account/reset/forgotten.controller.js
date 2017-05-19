'use strict';

angular.module('subexpuestaV2App')
    .controller('ForgottenCtrl', function($scope, $log) {

            $scope.error = false;
            $scope.enviando = false;
            $scope.enviado = false;
            $scope.correo = '';

            $scope.caca = '';


            $scope.olivdePassword = function() {
                $scope.submitted = true;
                
                if (!_.isUndefined($scope.correo)) {



                    
                   // $scope.enviando = true;
                    //$log.debug('email: ' + $scope.correo);
                    var emailReset = {};
                    emailReset.email = $scope.correo;
                    var settings =  {
  "async": true,
  "crossDomain": true,
  "url": "http://localhost:9000/api/users/forgotten",
  "method": "POST",
  "headers": {
    "content-type": "application/json"
  },
  "processData": false,
  "data": JSON.stringify(emailReset)
}
console.log('reset: '+JSON.stringify(settings));

$.ajax(settings).done(function (response) {
  
  if(response.toString()=="200")
  {
    console.log(response+"!!!!!!!!!!!");
    $scope.enviado = true;
    $scope.enviando = false;
    alert('e te acaba de enviar un correo a la dirección falicitada para poder resetear tu contraseña. Abra el correo y siga las instrucciones para completar el proceso. Gracias');
  }
  else
  {
    console.log(response);
     $scope.error = true;
     alert('Por favor, revise que ha puesto su email correctamente o espere unos minutos para volver a intentarlo. Gracias');
  }

});




                    /*  $http({
                          url: 'http://www.subexpuesta.com/api/users/forgotten',
                          method: "POST",
                          data: { 'email' : $scope.correo },
                          headers: 'application/json'
                      })
                      .then(function(response) {
                              // success
                              //$log.debug('Exito: '+JSON.stringify(response));
                              $scope.enviado = true;
                              $scope.enviando = false;
                      }, 
                      function(response) { // optional
                              // failed
                              //$log.debug('Error: '+JSON.stringify(response));
                              $scope.error = true;
                      });*/


                }
              };

              $scope.volver = function(){
                $scope.enviando = false;
                $scope.error = false;               
                $scope.enviado = false;
                $scope.correo = '';
              };

            });
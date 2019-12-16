// Declare Global variables
var getLogo, messenger, shift;



// Dom7
var $$ = Dom7;


// Init App
var app = new Framework7({
  name : 'Auditbar',
  id: 'com.auditbar.app',
  root: '#app',
  theme: 'auto',
  language: 'en',
  routes: routes
});

var mainView = app.views.create('.view-main', {
  url : './main.html',
  name : 'main',
  iosSwipeBack : false,
  router : true
});

toastMe = function(toastMessage){

    var toastMe = app.toast.create({
    text: toastMessage,
    position: 'bottom',
    closeTimeout: 3000,
  });

    toastMe.open();

}



messenger = function(theMessage, theChannel, theEmail, thePhone, theSubject){

  app.request.post('http://192.168.10.101/repo/php_hub/auditbar_backend/messenger.php', 
            {
             "the_message" : theMessage,
             "the_channel" : theChannel,
             "the_email" : theEmail,
             "the_phone" : thePhone,
             "the_subject" : theSubject
           },
             function (data) {

              data = JSON.parse(data);

                if (data.status == "message sent") {

                  toastMe("Message Sent");
                  
                }
                else{

                    toastMe("Unable to send message. Try again later");
                    console.log(data);
                    
                }

            }, function(){
                                 
                  toastMe("Network Error, Try again later");
                    
            });
}



shift = function(shiftItem, theKeyCode){



      var split2Number = shiftItem.split("-");
      var theRealNumber = parseInt(split2Number[1]);
      var shift2Me = 0;

        
        
        var key = theKeyCode;

        if( key == 8 || key == 46 ){

          if(shiftItem != 'otp-1'){
            
            shift2Me = parseInt(theRealNumber - 1);
            $$("#otp-" + shift2Me).focus();
            
          }

        }else{
          
          if(shiftItem != 'otp-6'){
            
            shift2Me = parseInt(theRealNumber + 1);
            $$("#otp-" + shift2Me).focus();
            
          }
          

        }

    }




       

document.addEventListener("deviceready", deviceIsReady, false);



function deviceIsReady(){


  StatusBar.backgroundColorByHexString("#ffffff");

  document.addEventListener("backbutton", function (){
    
    var currentPage = mainView.router.currentRoute.name;
    
    //Re-route to Dashboard
    if(currentPage == "dashboard" || currentPage == "main" || currentPage == "login" || currentPage == "slides"){

        navigator.app.exitApp();
    }
    else{
      
      mainView.router.back({
        ignoreCache : true,
        force : true
      });

    }

}, false);

  


  getLogo = function(){

      navigator.camera.getPicture(cameraSuccess, cameraError, {

          sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
          destinationType : Camera.DestinationType.FILE_URI,
          allowEdit : false,
          quality : 70

    });




        function cameraSuccess(imageURI){

          //change the logo to selected image and store logo name in localstorage

          $$(".logo-to-change").prop("src", imageURI);

          var tempStorage = window.localStorage.getItem("temporaryReg");
          tempStorage = JSON.parse(tempStorage);
          tempStorage["businessLogoImage"] = imageURI;

            tempStorage = JSON.stringify(tempStorage);
            window.localStorage.setItem("temporaryReg", tempStorage);


        }

        function cameraError(message){

          app.dialog.alert("Failed: " + message);

        }


  }
  



}// End of Document Ready




$$(document).on('page:init', function (e) {
  //fix sea blocking keyboard on phone

  $$(".keyboard-open").focus(function(){
    $$(".sea").hide();
  });

  $$(".keyboard-open").blur(function(){
    $$(".sea").show();
  });

});


$$(document).on('page:init', '.page[data-name="main"]', function (e){



        app.swiper.create({
          'el' : '.swiper-container',
          pagination: {
              el: '.swiper-pagination',
              type: 'bullets'
            }
        });
        var swiper = app.swiper.get('.swiper-container');

        $$("#next-btn").on("click", function(){
          swiper.slideNext();
        });

        $$("#skip-btn").click(function(){
          mainView.router.navigate("/login/");
        });



        swiper.on('slideChange', function () {
            thisSwipe = swiper.activeIndex;
            switch(thisSwipe){
                    case 2 : 
                    $$("#next-btn").text("Continue");
                    break;

                    default :
                    $$("#next-btn").text("Next");
                    console.log("You hit a road block");
            }

          });


          $$("#next-btn").click(function(){
            thisSwipe = swiper.activeIndex;
            if (thisSwipe == 2) {
              mainView.router.navigate("/login/");
            }
          });


});







$$(document).on('page:init', '.page[data-name="login"]', function (e){
  
      $$("#login-form").submit(function(e){
        e.preventDefault();

        if ($$("#user-email").val().trim() == "" || $$("#user-password").val().trim() == "") {
            toastMe("Please complete the form!");
        }
        else{

          $$("#login-btn").html("Logging in...").prop("disabled", true);
            

            app.request.post('http://192.168.10.101/repo/php_hub/auditbar_backend/user_login.php', 
            {
             "user_email" : $$("#user-email").val(),
             "user_password" : $$("#user-password").val()
           },
             function (data) {
              
              
              dataCheck = JSON.parse(data);
              console.log(dataCheck);

              if (dataCheck.status == "invalid") {

                console.log(dataCheck.status);
                toastMe("Invalid login details!");
                $$("#login-btn").html("Login").prop("disabled", false);

              }
              else if(dataCheck.status == "not found"){

                console.log(dataCheck.status);
                toastMe("Account not found!");
                $$("#login-btn").html("Login").prop("disabled", false);

              }
              else{

                console.log(dataCheck.status);
                toastMe("Login successful!");

                window.localStorage.setItem("permanentReg", data);
                  window.setTimeout(function(){
                      mainView.router.navigate("/dashboard/");
                  }, 3000);
                      
              }

            }, function(){
              
                    toastMe("Network Error, Try again later");
                    $$("#login-btn").html("Login").prop("disabled", false);

            });


            }

          });

    

  });









  
$$(document).on('page:init', '.page[data-name="signup"]', function (e){


      $$("#create-account-btn").click(function(e){
        

        if ($$("#new-user-full-name").val().trim() == "" || $$("#new-user-email").val().trim() == "" || $$("#new-user-password").val().trim() == "" || $$("#new-user-phone-number").val().trim() == ""){
            
            toastMe("Please complete the form!");
        }
        else{

            $$(this).html("Creating account...").prop("disabled", true);

            var splitName = $$("#new-user-full-name").val().split(" ");

            var tempStorage = {};

            var tempRegInputs = ["first_name", "last_name", "user_email", "tempUserPassword", "phone_number"];
            var tempRegArray = [splitName[0], splitName[1], $$("#new-user-email").val(), $$("#new-user-password").val(), $$("#new-user-phone-number").val()];

            for (var i = 0; i < tempRegInputs.length; i++) {

              var tempInput = tempRegInputs[i];
              var tempReg = tempRegArray[i];

              tempStorage[tempInput] = tempReg;

            }

            tempStorage = JSON.stringify(tempStorage);
            window.localStorage.setItem("temporaryReg", tempStorage);
            window.setTimeout(function(){
              mainView.router.navigate("/regcompany/");
            }, 3000);

        }


      });

      
});











$$(document).on('page:init', '.page[data-name="regcompany"]', function (e){

  $$("#continue-btn").click(function(e){

        if ($$("#business-name").val().trim() == "" || $$("#business-email").val().trim() == "") {
            toastMe("Please complete the form!");
        }
        else{

            $$(this).html("Please wait...").prop("disabled", true);

            var tempStorage = window.localStorage.getItem("temporaryReg");
            tempStorage = JSON.parse(tempStorage);

            var tempRegInputs = ["businessName", "businessEmail", "businessDescription"];
            var tempRegArray = [$$("#business-name").val(), $$("#business-email").val(), $$("#business-description").val()];

            for (var i = 0; i < tempRegInputs.length; i++) {

              var tempInput = tempRegInputs[i];
              var tempReg = tempRegArray[i];

              tempStorage[tempInput] = tempReg;

            }

            tempStorage = JSON.stringify(tempStorage);
            window.localStorage.setItem("temporaryReg", tempStorage);
            window.setTimeout(function(){
              mainView.router.navigate("/companylogo/");
            }, 3000);

        }


      });

});









$$(document).on('page:init', '.page[data-name="companylogo"]', function (e){

      var tempStorage = window.localStorage.getItem("temporaryReg");
      tempStorage = JSON.parse(tempStorage);

      var companyName = tempStorage.businessName;
      $$("#temp-company-name").text(companyName);


      toastMe("Click icon to set your Logo");


      $$(".logo-to-change").click(function(){
        getLogo();
      });



      $$("#finish-btn, #skip-logo").click(function(e){

            $$(this).text("Finishing...").prop("disabled", true);

            var tempStorage = window.localStorage.getItem("temporaryReg");
            tempStorage = JSON.parse(tempStorage);


             app.request.post('http://192.168.10.101/repo/php_hub/auditbar_backend/user_registration.php', 
            {
             "new_user_first_name" : tempStorage.first_name,
             "new_user_last_name" : tempStorage.last_name,
             "new_user_mail" : tempStorage.user_email,
             "new_user_phone" : tempStorage.phone_number,
             "new_user_password" : tempStorage.tempUserPassword,
             "company_name" : tempStorage.businessName,
             "company_email" : tempStorage.businessEmail,
             "company_description" : tempStorage.businessDescription
           },
             function (data) {
              
              data = JSON.parse(data);
              console.log(data);

              if (data.status != "account created") {

                console.log(data.status);
                toastMe(data.status);
                $$("#finish-btn").html("Finish Registration").prop("disabled", false);

              }
              else{

                
            var tempStorage = window.localStorage.getItem("temporaryReg");
            tempStorage = JSON.parse(tempStorage);

            var tempRegInputs = ["userSerial", "companys"];
            var tempRegArray = [data.user_serial, data.companys];

            for (var i = 0; i < tempRegInputs.length; i++) {

              var tempInput = tempRegInputs[i];
              var tempReg = tempRegArray[i];

              tempStorage[tempInput] = tempReg;

            }
            tempStorage = JSON.stringify(tempStorage);
            window.localStorage.setItem("permanentReg", tempStorage);
            
            window.setTimeout(function(){
                mainView.router.navigate("/regchooseplan/");
            }, 3000);
                      
              }

            }, function(){
              
                    toastMe("Network Error, Try again later");
                    $$("#finish").text("Finish Registration").prop("disabled", false);
                    $$("#skip-logo").text("Skip").prop("disabled", false);

            });

           
            
      });

});














$$(document).on('page:init', '.page[data-name="regchooseplan"]', function (e){



  });











$$(document).on('page:init', '.page[data-name="recovery"]', function (e){
  
    $$("#recovery-btn").click(function(e){

        if ($$("#recovery-email").val().trim() == "") {
            toastMe("Please complete the form!");
        }
        else{

            $$(this).html("Please wait...").prop("disabled", true);
             app.request.post('http://192.168.10.101/repo/php_hub/auditbar_backend/recover_account.php', 
            {
             "user_email" : $$("#recovery-email").val(),
           },
             function (data) {

              dataCheck = JSON.parse(data);
              console.log(dataCheck);

              if (dataCheck.status == "user not found") {

                toastMe("Account not found");
                $$("#recovery-btn").text("Recover").prop("disabled", false);

              }
              else{

                var recoveryMessage = "Hello " + dataCheck.first_name + ", You or somebody requested to recover your Auditbar account. <br> Your recovery code is <br><b>" + dataCheck.recovery_code + "</b>";

                // call on messenger
                messenger(recoveryMessage, "email", $$("#recovery-email").val(), "", "Auditbar account recovery");
                 window.setTimeout(function(){
                   $$("#recovery-btn").text("Recover").prop("disabled", false);
                  mainView.router.navigate("/recoverycode/");
                 }, 2000);

                 var recoveryProps = {
                  "recovery_code" : dataCheck.recovery_code,
                  "recovery_email" : $$("#recovery-email").val(),
                  "first_name" : dataCheck.first_name,
                  "user_serial_no" : dataCheck.user_sn
                 }
                 var recoveryProps = JSON.stringify(recoveryProps);
                 window.localStorage.setItem("recoveryProps", recoveryProps);
              }

             },
             function(){
                toastMe("Network error. Try Later");
                $$("#recovery-btn").text("Recover").prop("disabled", false);
             });

        }


      });

});









$$(document).on('page:init', '.page[data-name="recoverycode"]', function (e){

   $$("#resend-btn").hide();

   function runTimer(){

    var timer = 60;
    var countDown = window.setInterval(function(){
        timer = timer - 1;
        $$("#countdown-btn").text("00 : " + timer);
        if (timer == 0) { window.clearInterval(countDown); 
            $$("#countdown-btn").hide();
            $$("#resend-btn").show();
        }
        
    },1000);
  }

  runTimer();



    $$("#otp-1").keydown(function(){ 

      var key = event.keyCode || event.charCode;
      setTimeout(function(){
          shift("otp-1", key);
      },50);
      
      
    });


    $$("#otp-2").keydown(function(){ 

      var key = event.keyCode || event.charCode;
      setTimeout(function(){
          shift("otp-2", key);
      },50);
      
      
    });


    $$("#otp-3").keydown(function(){ 

      var key = event.keyCode || event.charCode;
      setTimeout(function(){
          shift("otp-3", key);
      },50);
      
      
    });


    $$("#otp-4").keydown(function(){ 

      var key = event.keyCode || event.charCode;
      setTimeout(function(){
          shift("otp-4", key);
      },50);

    });



    var recoveryProps = window.localStorage.getItem("recoveryProps");
    recoveryProps = JSON.parse(recoveryProps);





    $$("#resend-btn").click(function(){

      var recoveryMessage = "Hello " + recoveryProps.first_name + ", You or somebody requested to recover your Auditbar account. <br> Your recovery code is <br><b>" + recoveryProps.recovery_code + "</b>";

      $$("#countdown-btn").show();
      $$("#resend-btn").hide();
      runTimer();
      toastMe("Sending OTP...");
      // call on messenger
      messenger(recoveryMessage, "email", recoveryProps.recovery_email, "", "Auditbar account recovery");

    });



    $$("#verify-btn").click(function(){

      if($$("#otp-1").val().trim() == "" || $$("#otp-2").val().trim() == "" || $$("#otp-3").val().trim() == "" || $$("#otp-4").val().trim() == ""){

          toastMe("Please enter your otp");
      }
      else{

        toastMe("Verifying code...");
        var userRecoveryInput = $$("#otp-1").val() + $$("#otp-2").val() + $$("#otp-3").val() + $$("#otp-4").val();
        
        if (recoveryProps.recovery_code == userRecoveryInput) {

            window.setTimeout(function(){
              mainView.router.navigate("/newpassword/");
              $$("#verify-btn").text("Verify").prop("disabled", false);
             }, 2000);

             $$(this).text("Verifying...").prop("disabled", true);

        }
        else{


            $$("#verify-btn").text("Verify").prop("disabled", false);
            toastMe("Wrong recovery code!");

        }

      }

    });

});









$$(document).on('page:init', '.page[data-name="newpassword"]', function (e){

    var recoveryProps = window.localStorage.getItem("recoveryProps");
    recoveryProps = JSON.parse(recoveryProps);


     $$("#finish-recovery-btn").click(function(e){

        if ($$("#new-password").val().trim() == "" || $$("#confirm-new-password").val().trim() == "") {
            
            toastMe("Please complete the form!");
        }
        else if($$("#new-password").val() != $$("#confirm-new-password").val()){

          toastMe("Passwords do not match!");
        }
        else{

            $$(this).html("Please wait...").prop("disabled", true);
             app.request.post('http://192.168.10.101/repo/php_hub/auditbar_backend/set_new_password.php', 
            {
            "user_serial_no" : recoveryProps.user_serial_no,
             "user_email" : recoveryProps.recovery_email,
             "new_password" : $$("#new-password").val(),
             "new_password_confirm" : $$("#confirm-new-password").val()
           },
             function (data) {

              console.log(data);

              dataCheck = JSON.parse(data);
              console.log(dataCheck);

              if (dataCheck.status == "successful") {

                window.setTimeout(function(){
                  mainView.router.navigate("/login/");
                  toastMe("Recovery complete");
                  $$("#finish-recovery-btn").text("complete").prop("disabled", false);
                 }, 2000);

              }
              else{

                  toastMe(dataCheck.status);
                  $$("#finish-recovery-btn").text("complete").prop("disabled", false);
              }

             },
             function(){

                toastMe("Network error. Try Later");
                $$("#finish-recovery-btn").text("Complete").prop("disabled", false);

             });

        }


      });

});








$$(document).on('page:init', '.page[data-name="dashboard"]', function (e){

  var permanentReg = window.localStorage.getItem("permanentReg");
  permanentReg = JSON.parse(permanentReg);
  var company_name = permanentReg.companys[0]["company_name"];
  $$(".company-name").text(company_name);

  

        var gauge = app.gauge.create({
          el: '.gauge',
          value : '0.0',
          valueText : '0%',
          valueTextColor : '#2f2f2f',
          valueFontSize : '26',
          labelFontSize: '12',
          borderBgColor : '#eeeeee',
          labelText : 'Expenses',
          labelTextColor : '#2f2f2f',
          size : '140'
        });


         window.setTimeout(function(){
          gauge.update({
            value : '0.35',
            valueText : '35%',
            borderColor : '#ff9500',
            borderBgColor : '#069',
            labelText : 'Expenses',
            labelTextColor : '#2f2f2f'
          });
         }, 5000);



         var calendarModal = app.calendar.create({
            inputEl: '.demo-calendar-modal',
            openIn: 'customModal',
            header: true,
            footer: true,
            dateFormat: 'MM dd yyyy',
            rangePicker : true
          });



});





$$(document).on('page:init', '.page[data-name="more"]', function (e){

  var permanentReg = window.localStorage.getItem("permanentReg");
  permanentReg = JSON.parse(permanentReg);
  var company_name = permanentReg.companys[0]["company_name"];
  $$(".company-name").text(company_name);

      var calendarModal = app.calendar.create({
            inputEl: '.demo-calendar-modal',
            openIn: 'customModal',
            header: true,
            footer: true,
            dateFormat: 'MM dd yyyy',
            rangePicker : true
      });

  });















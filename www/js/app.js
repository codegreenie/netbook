// Declare Global variables
var getLogo, messenger, shift, selectCompany, grabCompanySummary, resetDashboard, resetDateRange, changeCurrency, refreshInvoiceList, invoicePageRefreshList, deleteInvoiceItem, uploadCompanyLogo, storeChosenContact, openInvoice, openInvoiceExpenses, openInvoicePayins;


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
    position: 'center',
    closeTimeout: 3000,
  });

    toastMe.open();

}



messenger = function(theMessage, theChannel, theEmail, thePhone, theSubject){

  app.request.post('https://nairasurvey.com/auditbar_backend/messenger.php', 
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
    if(currentPage == "dashboard" || currentPage == "login" || currentPage == "slides" || currentPage == "signup"){

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

          $$(".the-logo-to-change").prop("src", imageURI).css({
            "border-radius": "100%",
            "max-width" : "100px",
            "min-width" : "100px",
            "max-height" : "100px",
            "min-height" : "100px"
          });

          var tempStorage = window.localStorage.getItem("temporaryReg");
          tempStorage = JSON.parse(tempStorage);
          tempStorage["businessLogoImage"] = imageURI;

            tempStorage = JSON.stringify(tempStorage);
            window.localStorage.setItem("temporaryReg", tempStorage);

            $$("#store-company-logo").val(imageURI);
        }

        function cameraError(message){

          toastMe("Uanble to get image " + message);

        }


  }



  uploadCompanyLogo = function(){


$("#upload-company-logo-form").ajaxSubmit({
            
            beforeSend : function(){
                
                //$("#registration-btn").html("<i class='fa fa-spinner fa-spin'></i>").prop("disabled", "disabled");
            
            },
            success : (data) => {

              console.log(data);
              var dataParse = JSON.parse(data);

              
            if (dataParse.status == "upload successful"){

              var moiChosenCompany = window.localStorage.getItem("chosenCompany");
              moiChosenCompany = JSON.parse(moiChosenCompany);

              for(x in moiChosenCompany){
                moiChosenCompany["company_logo"] = dataParse.file_url;
              }
              window.localStorage.setItem("chosenCompany", JSON.stringify(moiChosenCompany));

              window.setTimeout(function(){
                mainView.router.navigate("/regchooseplan/");
              }, 2000);
              
            }

            else{

              window.alert(dataParse);
              $("#registration-btn").html("<i class='fa fa-check-square'></i> Register").prop("disabled", false);
            }

                  
             },

            error : (jqXHR, error, status) => {

             window.alert("Unable to locate file. Network Error");
       $("#registration-btn").html("<i class='fa fa-check-square'></i> Register").prop("disabled", false);

            }
        });




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


$$(document).on('page:init', '.page[data-name="slides"]', function (e){

  $$("#continue-btn").hide();


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
                    $$("#next-btn").hide();
                    $$("#continue-btn").show();
                    break;

                    default :
                    $$("#next-btn").show();
                    $$("#continue-btn").hide();
                    console.log("You hit a road block");
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
            
          
            app.request.post('https://nairasurvey.com/auditbar_backend/user_login.php', 
            {
             "user_email" : $$("#user-email").val(),
             "user_password" : $$("#user-password").val()
           },
             function (data) {
              
                console.log(data);
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

                dateRange = {
                  "fromDate" : "",
                  "endDate" : ""
                }
                dateRange = JSON.stringify(dateRange);
                var dateRange = window.localStorage.setItem("dateRange", dateRange);
                

                //quickly set chosen company
                var favouriteCompanyID = dataCheck.companys[0].company_id;
                var favouriteCompanyName = dataCheck.companys[0].company_name;
                var favouriteCompanyLogo = dataCheck.companys[0].company_logo;
                var favouriteCompanyAccess = dataCheck.companys[0].company_access;
                var favouriteCompanyEmail = dataCheck.companys[0].company_email;
                var favouriteCompanyPhone = dataCheck.companys[0].company_phone;
                var favouriteCompanyAddress = dataCheck.companys[0].company_address;
                var favouriteCompanyDescription = dataCheck.companys[0].company_description;

                var chosenCompany = {
                  company_id : favouriteCompanyID,
                  company_name : favouriteCompanyName,
                  company_logo : favouriteCompanyLogo,
                  company_access : favouriteCompanyAccess,
                  company_email : favouriteCompanyEmail,
                  company_phone : favouriteCompanyPhone,
                  company_address : favouriteCompanyAddress,
                  company_description : favouriteCompanyDescription
                }

                window.localStorage.setItem("chosenCompany", JSON.stringify(chosenCompany));

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
        else if($$("#new-user-phone-number").val().trim().length < 11){
            toastMe("Please enter a valid phone number");
        } 
        else{

            $$(this).html("<img src='imgs/assets/loading.gif' style='max-width:50px;'>").prop("disabled", true);

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
              $$(this).html("Create account").prop("disabled", false);
              mainView.router.navigate("/regcompany/");
            }, 3000);

        }


      });

      
});











$$(document).on('page:init', '.page[data-name="regcompany"]', function (e){

  $$("#continue-btn").click(function(e){

        if ($$("#business-name").val().trim() == "" || $$("#business-email").val().trim() == "" || $$("#business-phone").val().trim() == "") {
            toastMe("Please complete the form!");
        }
        else if($$("#business-phone").val().trim().length < 11){
            toastMe("Please enter a valid phone number");
        } 
        else{

            $$(this).html("<img src='imgs/assets/loading.gif' style='max-width:50px;'>").prop("disabled", true);

            var tempStorage = window.localStorage.getItem("temporaryReg");
            tempStorage = JSON.parse(tempStorage);

            var tempRegInputs = ["businessName", "businessEmail", "businessPhone", "businessAddress", "businessDescription"];
            var tempRegArray = [$$("#business-name").val(), $$("#business-email").val(), $$("#business-phone").val(), $$("#business-address").val(), $$("#business-description").val()];

            for (var i = 0; i < tempRegInputs.length; i++) {

              var tempInput = tempRegInputs[i];
              var tempReg = tempRegArray[i];

              tempStorage[tempInput] = tempReg;

            }

            tempStorage = JSON.stringify(tempStorage);
            window.localStorage.setItem("temporaryReg", tempStorage);
            window.setTimeout(function(){
              $$(this).html("Continue").prop("disabled", false);
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


      $$("#store-company-logo").change(function(){

        $$("#skip-logo-btn").html("<img src='imgs/assets/loading.gif' style='max-width:50px;'>").prop("disabled", true);

            var tempStorage = window.localStorage.getItem("temporaryReg");
            tempStorage = JSON.parse(tempStorage);



             app.request.post('https://nairasurvey.com/auditbar_backend/user_registration.php', 
            {
             "new_user_first_name" : tempStorage.first_name,
             "new_user_last_name" : tempStorage.last_name,
             "new_user_mail" : tempStorage.user_email,
             "new_user_phone" : tempStorage.phone_number,
             "new_user_password" : tempStorage.tempUserPassword,
             "company_name" : tempStorage.businessName,
             "company_email" : tempStorage.businessEmail,
             "company_phone" : tempStorage.businessPhone,
             "company_address" : tempStorage.businessAddress,
             "company_description" : tempStorage.businessDescription
           },
             function (data) {
              console.log(data);
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

                var companyID = data.companys[0].company_id;

                $$("#company-id-palette").val(companyID);

                //build chosen company parameters
                var myChosenCompany = {
                  "company_name" : data.companys[0].company_name,
                  "company_id" : companyID,
                  "company_logo" : "",
                  "company_access" : data.companys[0].company_access,
                  "company_email" : data.companys[0].company_email,
                  "company_phone" : data.companys[0].company_phone,
                  "company_address" : data.companys[0].company_address,
                  "company_description" : data.companys[0].company_description
                }

                window.localStorage.setItem("chosenCompany", JSON.stringify(myChosenCompany));

                var dateRange = {
                  "fromDate" : "",
                  "endDate" : ""
                }
                window.localStorage.setItem("dateRange", JSON.stringify(dateRange));
                

                // now quickly upload company logo
                window.setTimeout(function(){
                  uploadCompanyLogo();
                }, 1000);
                
                      
              }

            }, function(){
              
                    toastMe("Network Error, Try again later");
                    $$("#finish-btn").text("I don't have a logo yet").prop("disabled", false);
            });

           
      });
      



      $$("#skip-logo-btn").click(function(e){

            $$(this).html("<img src='imgs/assets/loading.gif' style='max-width:50px;'>").prop("disabled", true);

            var tempStorage = window.localStorage.getItem("temporaryReg");
            tempStorage = JSON.parse(tempStorage);


             app.request.post('https://nairasurvey.com/auditbar_backend/user_registration.php', 
            {
             "new_user_first_name" : tempStorage.first_name,
             "new_user_last_name" : tempStorage.last_name,
             "new_user_mail" : tempStorage.user_email,
             "new_user_phone" : tempStorage.phone_number,
             "new_user_password" : tempStorage.tempUserPassword,
             "company_name" : tempStorage.businessName,
             "company_phone" : tempStorage.businessPhone,
             "company_address" : tempStorage.businessAddress,
             "company_email" : tempStorage.businessEmail,
             "company_description" : tempStorage.businessDescription
           },
             function (data) {
              console.log(data);
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

                var companyID = data.companys[0].company_id;

                var myChosenCompany = {
                  "company_name" : data.companys[0].company_name,
                  "company_id" : companyID,
                  "company_logo" : "",
                  "company_access" : data.companys[0].company_access,
                  "company_email" : data.companys[0].company_email,
                  "company_phone" : data.companys[0].company_phone,
                  "company_address" : data.companys[0].company_address,
                  "company_description" : data.companys[0].company_description
                }

                window.localStorage.setItem("chosenCompany", JSON.stringify(myChosenCompany));



                var dateRange = {
                  "fromDate" : "",
                  "endDate" : ""
                }
                window.localStorage.setItem("dateRange", JSON.stringify(dateRange));
                
                // now quickly upload company logo
                window.setTimeout(function(){
                  mainView.router.navigate("/regchooseplan/");
                }, 1500);
                
                
                      
              }

            }, function(){
              
                    toastMe("Network Error, Try again later");
                    $$("#finish-btn").text("Finish Registration").prop("disabled", false);
            });

           
            
      });

});














$$(document).on('page:init', '.page[data-name="regchooseplan"]', function (e){


    console.log("Welcome to the reg choose plan page");
    $$("#free-trial-btn").click(function(){
      mainView.router.navigate("/dashboard/");
    });


  });











$$(document).on('page:init', '.page[data-name="recovery"]', function (e){
  
    $$("#recovery-btn").click(function(e){

        if ($$("#recovery-email").val().trim() == "") {
            toastMe("Please complete the form!");
        }
        else{

            $$(this).html("<img src='imgs/assets/loading.gif' style='max-width:50px;'>").prop("disabled", true);
             app.request.post('https://nairasurvey.com/auditbar_backend/recover_account.php', 
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
                  $$("#recovery-btn").text("Recover").prop("disabled", false);
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

             $$(this).html("<img src='imgs/assets/loading.gif' style='max-width:50px;'>").prop("disabled", true);

        }
        else{


            $$("#verify-btn").text("Verify").prop("disabled", false);
            toastMe("Wrong recovery code!");
            $$("#recovery-code-div").addClass("shake");
            window.setTimeout(function(){
              $$("#recovery-code-div").removeClass("shake");
            }, 2500);

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

            $$(this).html("<img src='imgs/assets/loading.gif' style='max-width:50px;'>").prop("disabled", true);
             app.request.post('https://nairasurvey.com/auditbar_backend/set_new_password.php', 
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
                  $$("#finish-recovery-btn").text("Complete").prop("disabled", false);
                 }, 2000);

              }
              else{

                  toastMe(dataCheck.status);
                  $$("#finish-recovery-btn").text("Complete").prop("disabled", false);
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

  var addBusinessPopup = app.popup.create({
    el : ".add-business-popup"
  });

 

  var theChosenCompany = window.localStorage.getItem("chosenCompany");
  theChosenCompany = JSON.parse(theChosenCompany);
  var chosen_company_name = theChosenCompany.company_name;
  var chosen_company_logo = theChosenCompany.company_logo;
  var chosen_company_id = theChosenCompany.company_id;

  $$(".company-name").text(chosen_company_name);
  //set company logo
  if (chosen_company_logo == "") {
    $$(".company-logo").prop("src", "imgs/assets/logo.png");
  }
  else{
    $$(".company-logo").prop("src", chosen_company_logo).css({'border-radius' : '50%'});
  }
  
  //then load default chosen company summary
  window.setTimeout(function(){
    resetDateRange();
    grabCompanySummary(chosen_company_id);
  }, 1500);



  $$("#create-invoice-btn").click(function(){

    $$(this).html("<img src='imgs/assets/loading.gif' style='max-width: 50px;'>").prop("disbled", true);

    //check if i am admin of company,
    //check if there are contacts for my account

    if (theChosenCompany.company_access == "administrator") {
        
    
     app.request.post("https://nairasurvey.com/auditbar_backend/find_contact.php",
          {
            "my_id" : permanentReg.user_serial
          },
            function(data){
              data = JSON.parse(data); 
              console.log(data[0].status);
              if (data[0].status == "Contact found") {
                  mainView.router.navigate("/createinvoice/");
                  addBusinessPopup.close();
                  $$("#create-invoice-btn").html("Create invoice").prop("disabled", false);
              }
              else{

                toastMe("Please add a contact before creating invoice");
                addBusinessPopup.close();
                $$("#create-invoice-btn").html("Create invoice").prop("disabled", false);

              }
          }, function(){

              $$("#add-contact-button").html("Add contact").prop("disbled", false);
              toastMe("Network error. Try again later");

          });
   }
   else{

      toastMe("Only administrators can create an invoice");
      addBusinessPopup.close();
    }
    
  });

  $$("#add-contact-btn").click(function(){
      mainView.router.navigate("/addcontact/");
      addBusinessPopup.close();
  });


  var ptr = $$('.ptr-content');
  ptr.on("ptr:refresh", function(){
    var theChosenCompany = window.localStorage.getItem("chosenCompany");
    theChosenCompany = JSON.parse(theChosenCompany);
    resetDateRange();
    grabCompanySummary(chosen_company_id);
    setTimeout(function(){
      app.ptr.done();
    }, 5000);
  });
  


  //Load up company list in popover
  for (var i = 0; i < permanentReg.companys.length; i++) {

    var company_id = permanentReg.companys[i]["company_id"];
    var company_name = permanentReg.companys[i]["company_name"];
    var company_logo = permanentReg.companys[i]["company_logo"];

    var peg = "<li><a class='list-button item-link' href='#' onclick=selectCompany(" + company_id + ")>" + company_name + "</a></li>";
    $$("#dashboard-company-list").append(peg);
  }

   var dashboardPopover = app.popover.create({
      el : '.popover-company-list'
   });


  selectCompany = function(theCompanyID){

        for (var i = 0; i < permanentReg.companys.length; i++) {

        var company_id = permanentReg.companys[i]["company_id"];
        if (company_id == theCompanyID) {

          var company_name = permanentReg.companys[i]["company_name"];
          var company_logo = permanentReg.companys[i]["company_logo"];
          var company_email = permanentReg.companys[i]["company_email"];
          var company_access = permanentReg.companys[i]["company_access"];
          var company_phone = permanentReg.companys[i]["company_phone"];
          var company_address = permanentReg.companys[i]["company_address"];
          var company_description = permanentReg.companys[i]["company_description"];
          $$(".company-name").text(company_name);
          dashboardPopover.close();

          //update chosen company
          var chosenCompanyDetails = {
            "company_id" : theCompanyID,
            "company_name" : company_name,
            "company_logo" : company_logo,
            "company_email" : company_email,
            "company_access" : company_access,
            "company_phone" : company_phone,
            "company_address" : company_address,
            "company_description" : company_description
          }

          if (company_logo == "") {
            $$(".company-logo").prop("src", "imgs/assets/logo.png");
          }
          else{
            $$(".company-logo").prop("src", company_logo);
          }

          chosenCompanyDetails = JSON.stringify(chosenCompanyDetails);
          window.localStorage.setItem("chosenCompany", chosenCompanyDetails);
          resetDateRange();
          grabCompanySummary(theCompanyID);

          break;
        }
        
      }

  }



  grabCompanySummary = function(theCompanyID){

    var dateRange = window.localStorage.getItem("dateRange");
    dateRange = JSON.parse(dateRange);

      app.request.post('https://nairasurvey.com/auditbar_backend/company_summary.php', 
            {
            "company_serial" : theCompanyID,
             "from_date" : dateRange.fromDate,
             "to_date" : dateRange.endDate            
           },
             function (data) {

              console.log(data);

              dataCheck = JSON.parse(data);
              console.log(dataCheck);
              var cashIDs = ["total-income", "total-expenses", "gross-profit", "total-invoice-amount", "total-paid-invoice", "total-unpaid-invoice", "inventory", "labour", "rent", "tax", "other", "net-profit"];
              var viewDatas = ["total_invoice_income", "total_expenses", "gross_profit", "total_invoice_amount", "total_invoice_income", "total_invoice_pending", "inventory_expenses", "labour_expenses", "rent_expenses", "tax_expenses", "other_expenses", "net_profit"];

                if (dataCheck.status == "no transactions") {
                  toastMe("No transactions");
                  resetDashboard();  
                }
                else{
                  for (var i = 0; i < cashIDs.length; i++) {
                    var thisDataView = viewDatas[i];
                    $$("#" + cashIDs[i]).text("NGN" + dataCheck[thisDataView]);
                  }

                   gauge.update({
                      value : dataCheck.guage_calculator,
                      valueText : (parseInt(dataCheck.guage_calculator * 100)) + '%',
                      borderColor : '#f93',
                      borderBgColor : '#069',
                      labelText : 'Expenses',
                      labelTextColor : '#2f2f2f'
                    });
                   
                }
             },
             function(){
                toastMe("Network error. Try again later");
             });
      }




      resetDashboard = function(){

         var cashIDs = ["total-income", "total-expenses", "gross-profit", "total-invoice-amount", "total-paid-invoice", "total-unpaid-invoice", "inventory", "labour", "rent", "tax", "other", "net-profit"];

         for (var i = 0; i < cashIDs.length; i++) {
            $$("#" + cashIDs[i]).text("NGN0");
          }
            gauge.update({
              value : '0',
              valueText : '0%',
              borderColor : 'transparent',
              borderBgColor : '#eeeeee',
              labelText : 'Expenses',
              labelTextColor : '#2f2f2f'
            });

          resetDateRange(); 
      }



      function resetDateRange(){

        var dateRange = window.localStorage.getItem("dateRange");
        dateRange = JSON.parse(dateRange);
        for (var p in dateRange) {
          dateRange[p] = "";
        }
        dateRange = JSON.stringify(dateRange);
        window.localStorage.setItem("dateRange", dateRange);

      }

  



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


        



         var calendarModal = app.calendar.create({
            inputEl: '.demo-calendar-modal',
            openIn: 'customModal',
            header: true,
            footer: true,
            dateFormat: 'yyyy-mm-dd',
            rangePicker : true,
            direction : 'vertical',
            header: true,
            toolbarCloseText : 'Apply',
            headerPlaceholder : 'Select date range',
            closeByOutsideClick : true,
            on: {
              closed: function(){
                console.log(calendarModal.value);
                var fromDate = calendarModal.value[0];
                var fromDay;
                if (fromDate.getDate().toString().length == 1) {
                  fromDay = "0" + fromDate.getDate();
                }
                else{
                  fromDay = fromDate.getDate();
                }


                var fromMonth;
                if (fromDate.getMonth().toString().length == 1) {
                  fromMonth = "0" + parseInt(fromDate.getMonth() + 1);
                }
                else{
                  fromMonth = parseInt(fromDate.getMonth()) + 1;
                }

                var mergeFromDate = fromDate.getFullYear() + "-" + fromMonth + "-" + fromDay + " " + "00:00:00";
                console.log(mergeFromDate);

                var endDate = calendarModal.value[1];
                var endDay;
                if (endDate.getDate().toString().length == 1) {
                  endDay = "0" + endDate.getDate();
                }
                else{
                  endDay = fromDate.getDate();
                }

                var endMonth;
                if (endDate.getMonth().toString().length == 1) {
                  endMonth = "0" + parseInt(endDate.getMonth() + 1);
                }
                else{
                  endMonth = endDate.getMonth();
                }

                var mergeEndDate = endDate.getFullYear() + "-" + endMonth + "-" + endDay + " " + "00:00:00";
                console.log(mergeEndDate);

                var dateRange = window.localStorage.getItem("dateRange");
                dateRange = JSON.parse(dateRange);
                for (var p in dateRange) {
                  dateRange["fromDate"] = mergeFromDate;
                  dateRange["endDate"] = mergeEndDate;
                }
                dateRange = JSON.stringify(dateRange);
                window.localStorage.setItem("dateRange", dateRange);
                grabCompanySummary(chosen_company_id);
              }
            }
          });



});










$$(document).on('page:init', '.page[data-name="more"]', function (e){

  var chosenCompany = window.localStorage.getItem("chosenCompany");
  chosenCompany = JSON.parse(chosenCompany);

  $$(".company-name").text(chosenCompany.company_name);
  if (chosenCompany.company_logo == "") {
    $$(".company-logo").prop("src", "imgs/assets/logo.png");
  }
  else{
    $$(".company-logo").prop("src", chosenCompany.company_logo).css({'border-radius' : '50%'});
  }

  $$("#logout-button").click(function(){
    app.dialog.confirm("Are you sure you want to Log out?", function(){
      window.localStorage.removeItem("permanentReg");
      window.localStorage.removeItem("chosenCompany");
      window.localStorage.removeItem("invoiceList");
      window.localStorage.removeItem("dateRange");

      mainView.router.navigate("/login/");
    });
  });

});








$$(document).on('page:init', '.page[data-name="createinvoice"]', function (e){

  if(!window.localStorage.getItem("invoiceList")){
    window.localStorage.setItem("invoiceList", JSON.stringify({
      "item_name" : [],
      "item_price" : [],
      "item_quantity" : [],
      "item_description" : []
    }));
  }


  var invoiceList = window.localStorage.getItem("invoiceList");
  invoiceList = JSON.parse(invoiceList);


  var permanentReg = window.localStorage.getItem("permanentReg");
  permanentReg = JSON.parse(permanentReg);

  var chosenCompany = window.localStorage.getItem("chosenCompany");
  chosenCompany = JSON.parse(chosenCompany);

  $$(".company-name").text(chosenCompany.company_name);

  changeCurrency = function(theCurrency){
    $$("#currency-plate").text(theCurrency);
    $$("#currency").val(theCurrency);
    currencyPopover.close();
  }

  var currencyPopover = app.popover.create({
      el : '.popover-currency-change'
   });


  var contactsPopover = app.popover.create({
      el : '.popover-contacts',
      targetEl : 'input.biller'
   });



  var addItemPopup = app.popup.create({
      el : '.add-item-popup'
  });

  var viewListPopup = app.popup.create({
      el : '.view-list-popup',
      on: {
        opened: function (popup) {
          toastMe('Swipe an item left to delete');
        }
      }
  });


  var previewInvoicePopup = app.popup.create({
      el : '.preview-invoice-popup'
  });


  var invoiceSentPopup = app.popup.create({
      el : '.invoice-sent-popup'
  });
  


   var calendarModal = app.calendar.create({
            inputEl: '#invoice-due-date',
            openIn: 'customModal',
            header: true,
            footer: true,
            dateFormat: 'yyyy-mm-dd',
            rangePicker : false,
            direction : 'vertical',
            header: true,
            toolbarCloseText : 'Apply',
            headerPlaceholder : 'Auditbar custom date',
            closeByOutsideClick : false,
            
          });

  


  $$('.swipeout').on('swipeout:deleted', function () {
    toastMe('Thanks, item removed!');
  });


  refreshInvoiceList = function(){

    var chosenCurrency = $$("#currency").val();

    $$("#invoice-list-container").html("");

    for (var i = 0; i < invoiceList["item_name"].length; i++) {
      var itemName = invoiceList["item_name"][i];
      var itemQty = invoiceList["item_quantity"][i];
      var itemPrice = invoiceList["item_price"][i];
      var itemDescription = invoiceList["item_description"][i];

      var itemTotalPrice = itemQty * itemPrice;
      itemTotalPrice = itemTotalPrice.toLocaleString();

      var listItem = "<li class='swipeout'><div class='swipeout-content'><a href='#' class='item-link item-content'><div class='item-media'><i class='icon f7-icons'>document</i></div><div class='item-inner invoice-item'><div class='item-title'><div class='item-header'>" + chosenCurrency + "" + itemPrice + " X " + itemQty + "</div>" + itemName + "</div><div class='item-after'>NGN" + itemTotalPrice + "</div></div></a></div><div class='swipeout-actions-right'><a href='#' class='swipeout-delete' onclick=\"deleteInvoiceItem('" + i + "')\"><i class='icon material-icons'>delete</i></a></div></li>"
      $$("#invoice-list-container").append(listItem);
    }

  }


  refreshInvoiceList();





    invoicePageRefreshList = function(){

    $$("#invoice-page-list").html("");

    for (var i = 0; i < invoiceList["item_name"].length; i++) {

      if (i == 5) {
        break;
      }

      var itemName = invoiceList["item_name"][i];
      var itemQty = invoiceList["item_quantity"][i];
      var itemPrice = invoiceList["item_price"][i];
      var itemDescription = invoiceList["item_description"][i];

      var itemTotalPrice = itemQty * itemPrice;
      itemTotalPrice = itemTotalPrice.toLocaleString();

      var listItem = "<li><a href='#' class='item-link item-content'><div class='item-media'><i class='icon f7-icons'>document</i></div><div class='item-inner invoice-item'><div class='item-title'><div class='item-header'>X " + itemQty + "</div>" + itemName + "</div><div class='item-after'>NGN" + itemTotalPrice + "</div></div></a></li>";
        $$("#invoice-page-list").append(listItem);
    }

  }


  invoicePageRefreshList();


  deleteInvoiceItem = function(arrayNumber){
    

      var itemName = invoiceList["item_name"];
      var itemQty = invoiceList["item_quantity"];
      var itemPrice = invoiceList["item_price"];
      var itemDescription = invoiceList["item_description"];


      console.log("Before deletion", itemName);

        var theIndex = itemName.indexOf(itemName[arrayNumber]);
        if (theIndex >  -1) {
          itemName.splice(theIndex, 1);
          itemPrice.splice(theIndex, 1);
          itemQty.splice(theIndex, 1);
          itemDescription.splice(theIndex, 1);
        }

        console.log("After deletion", itemName);
        window.localStorage.setItem("invoiceList", JSON.stringify({
          "item_name" : itemName,
          "item_price" : itemPrice,
          "item_quantity" : itemQty,
          "item_description" : itemDescription
        }));
        refreshInvoiceList();
        invoicePageRefreshList();
  }





  $$("#add-item-button").click(function(){

    if ($$("#item-name").val().trim() == "" || $$("#item-price").val().trim() == "" || $$("#item-quantity").val().trim() == "") {

      toastMe("Please complete the form!");
    }
    else{

          $$(this).html("Adding Item...").prop("disabled", true);
          invoiceList["item_name"].push($$("#item-name").val());
          invoiceList["item_quantity"].push($$("#item-quantity").val());
          invoiceList["item_price"].push($$("#item-price").val());
          invoiceList["item_description"].push($$("#item-description").val());
          console.log(invoiceList);
          window.localStorage.setItem("invoiceList", JSON.stringify(invoiceList));
          $$(this).html("Add").prop("disabled", false);
          refreshInvoiceList();
          invoicePageRefreshList();
          addItemPopup.close();
          $$("#item-name").val("").blur();
          $$("#item-quantity").val("").blur();
          $$("#item-price").val("").blur();
          $$("#item-description").val("").blur();       
    }
  });






    $$("#preview-invoice-button").click(function(){

      var invoiceList = window.localStorage.getItem("invoiceList");
      invoiceList = JSON.parse(invoiceList);

      if ($$("#invoice-due-date").val().trim() == "" || $$("#biller").val().trim() == "" || $$("#biller-address").val().trim() == "" || $$("#bank-details").val().trim() == "" || $$("#invoice-terms").val().trim() == "" || invoiceList["item_name"].length == 0) {

          toastMe("Please complete the form!");

      }
      else{


      $$("#preview-invoice").html("<img src='imgs/assets/loading.gif' style='max-width: 160px; display: block; margin:100px auto 0px;'><h2 class='text-center'>Generating invoice preview...</h2>");

      var totalInvoicePrice = 0;
      for (var i = 0; i < invoiceList["item_price"].length; i++) {
        var invoiceItemPrice = invoiceList["item_price"][i];
        var invoiceItemQty = invoiceList["item_quantity"][i];
        var itemTotalPrice = parseInt(invoiceItemPrice) * parseInt(invoiceItemQty);
        totalInvoicePrice = totalInvoicePrice + itemTotalPrice;
      }

      $$("#company-name-plate").text(chosenCompany.company_name);
      $$("#company-email-plate").text(chosenCompany.company_email);
      $$("#invoice-currency-plate").text($$("#currency").val());
      $$("#invoice-name-plate").text($$("#invoice-name").val());
      $$("#invoice-due-date-plate").text($$("#invoice-due-date").val());
      $$("#invoice-biller-plate").text($$("#biller").val());
      $$("#invoice-biller-email-plate").text($$("#biller-email").val());
      $$("#invoice-biller-phone-plate").text($$("#biller-phone").val());
      $$("#invoice-date-plate").text(new Date().getFullYear() + "-" + new Date().getMonth() + "-" + new Date().getDay());

      $$("#invoice-biller-address-plate").text($$("#biller-address").val());
      $$("#invoice-bank-details-plate").text($$("#bank-details").val());
      $$("#invoice-terms-plate").text($$("#invoice-terms").val());
      $$("#invoice-items-count-plate").text(invoiceList["item_name"].length + " item(s)");
      $$("#invoice-total-plate").text(totalInvoicePrice);


      app.request.post('https://nairasurvey.com/auditbar_backend/generate_invoice_preview.php', 
            {
              
            "invoice_owner" : chosenCompany.company_id,
            "biller_name" : $$("#biller").val(),
            "biller_email" : $$("#biller-email").val(),
            "biller_phone" : $$("#biller-phone").val(),
            "biller_address" : $$("#biller-address").val(),
            "currency" : $$("#currency").val(),
            "bank_details" : $$("#bank-details").val(),
            "invoice_terms" : $$("#invoice-terms").val(),
            "invoice_item" : invoiceList.item_name,
            "invoice_item_description" : invoiceList.item_description,
            "invoice_item_amount" : invoiceList.item_price,
            "invoice_item_quantity" : invoiceList.item_quantity,
            "invoice_due_date" : $$("#invoice-due-date").val(),
            "my_company_id" :  chosenCompany.company_id,
            "my_company_name" :  chosenCompany.company_name,
            "my_company_email" :  chosenCompany.company_email,
            "my_company_phone" :  chosenCompany.company_phone,
            "my_company_logo" :  chosenCompany.company_logo,
            "my_company_address" :  chosenCompany.company_address,
            "vat_percent" : $$("#vat-percent").val()
           },
             function (data) {

              console.log(data);
              var invoicePreviewURL = "https://nairasurvey.com/auditbar_backend/businesses/" + chosenCompany.company_name + "_" + chosenCompany.company_id + "/invoice.html";
              invoicePreviewURL = encodeURI(invoicePreviewURL);
              window.setTimeout(function(){
                $("#preview-invoice").load(invoicePreviewURL);
              }, 7000);
              

             },
             function(){
                toastMe("Network error. Try again later");
                previewInvoicePopup.close();
             });

      previewInvoicePopup.open();  

    }
    });






    $$("#send-invoice-button").click(function(){

      $$(this).html("<img src='imgs/assets/loading.gif' style='max-width: 50px;'>").prop("disbled", true);
      

          app.request.post("https://nairasurvey.com/auditbar_backend/create_invoice.php",
          {
            
            "invoice_owner" : chosenCompany.company_id,
            "biller_name" : $$("#biller").val(),
            "biller_email" : $$("#biller-email").val(),
            "biller_phone" : $$("#biller-phone").val(),
            "biller_address" : $$("#biller-address").val(),
            "currency" : $$("#currency").val(),
            "bank_details" : $$("#bank-details").val(),
            "invoice_terms" : $$("#invoice-terms").val(),
            "invoice_item" : invoiceList.item_name,
            "invoice_item_description" : invoiceList.item_description,
            "invoice_item_amount" : invoiceList.item_price,
            "invoice_item_quantity" : invoiceList.item_quantity,
            "invoice_due_date" : $$("#invoice-due-date").val(),
            "vat" : $$("#vat-percent").val()

          },
            function(data){
              console.log(data);
              data = JSON.parse(data);
              if (data.status == "successful") {
                toastMe("Invoice Sent!");
                $$("#sent-to-company-name").text(chosenCompany.company_name)
                invoiceSentPopup.open();

              }
              else{
                toastMe("Unable to send invoice. Try later");
                $$("#send-invoice-button").html("<i class='icon f7-icons' style='font-size: 32px;'>paper_plane</i>Send").prop("disbled", false);
              }

          }, function(){
              $$("#send-invoice-button").html("<i class='icon f7-icons' style='font-size: 32px;'>paper_plane</i>Send").prop("disbled", false);
              toastMe("Network error. Try again later");

          });


});




          $$('#vat-twist').click(function(){
            window.setTimeout(function(){
              checkVatBox();
            }, 100);
          });

          function checkVatBox(){

          if ($$("#vat-checkbox").prop("checked") == true) {
              app.dialog.prompt("Enter VAT value %", function(input){

                if(input.trim() == ""){
                  toastMe("Enter a valid number");
                  $$("#vat-value").text("0");
                  $$("#vat-checkbox").prop("checked", false);
                }
                else{
                  $$("#vat-value").text(input);
                  $$("#vat-percent").val(input);
                }

              }, function(){
                console.log("VAT % closed");
                $$("#vat-checkbox").prop("checked", false);
              });
            }
            else{
             console.log("VAT box unchecked");
             $$("#vat-value").text("0");
             $$("#vat-percent").val("0");
            }

          }




          $$("#invoice-done-button").click(function(){
            previewInvoicePopup.close();
            mainView.router.navigate("/dashboard/");
            invoiceSentPopup.close();
          });




          $$("#biller").keyup(function(){
            contactsPopover.open();
          });



          if (window.localStorage.getItem("chosenContact")) {

            var chosenContact = window.localStorage.getItem("chosenContact");
            chosenContact = JSON.parse(chosenContact);

          
            var chosenContactName = chosenContact.contact_name;
            var chosenContactEmail = chosenContact.contact_email;
            var chosenContactPhone = chosenContact.contact_phone;
            var chosenContactAddress = chosenContact.contact_address;

            $$("#biller").val(chosenContactName);
            $$("#biller-email").val(chosenContactEmail);
            $$("#biller-phone").val(chosenContactPhone);
            $$("#biller-address").val(chosenContactAddress);


          }



          $$("#biller, #biller-email, #biller-phone, #biller-address").click(function(){

              mainView.router.navigate("/contactsearch/");

          });







  }); // end of create invoice page










  

  $$(document).on('page:init', '.page[data-name="addcontact"]', function (e){

    var addContactPopup = app.popup.create({
      el : '.contact-added-popup'
   });


    var permanentReg = window.localStorage.getItem("permanentReg");
    permanentReg = JSON.parse(permanentReg);

    $$("#add-contact-button").click(function(){

      if ($$("#contact-name").val().trim() == "" || $$("#contact-email").val().trim() == "" || $$("#contact-phone").val().trim() == "" || $$("#contact-address").val().trim() == "") {

          toastMe("Please complete the form!");

      } else{

          $$(this).html("<img src='imgs/assets/loading.gif' style='max-width: 50px;'>").prop("disbled", true);

          app.request.post("https://nairasurvey.com/auditbar_backend/add_contact.php",
          {
            
            "contact_name" : $$("#contact-name").val(),
            "contact_email" : $$("#contact-email").val(),
            "contact_phone" : $$("#contact-phone").val(),
            "contact_address" : $$("#contact-address").val(),
            "my_id" : permanentReg.user_serial

          },
            function(data){
              
              console.log(data);
              dataRec = JSON.parse(data);
              if (dataRec.status == "Contact added") {
                
                toastMe(dataRec.status);
                addContactPopup.open();

              }
              else{

                toastMe(dataRec.status);
                $$("#add-contact-button").html("Add contact").prop("disbled", false);

              }
              

          }, function(){
              $$("#add-contact-button").html("Add contact").prop("disbled", false);
              toastMe("Network error. Try again later");

          });
      }

    });



    $$("#contact-added-button").click(function(){
      addContactPopup.close();
      mainView.router.navigate("/dashboard/");
    });

    

  });










$$(document).on('page:init', '.page[data-name="contactsearch"]', function (e){

  var permanentReg = window.localStorage.getItem("permanentReg");
    permanentReg = JSON.parse(permanentReg);


   // create searchbar
  var searchbar = app.searchbar.create({
    el: '.searchbar',
    searchContainer: '.list',
    searchIn: '.item-title',
    on: {
      search(sb, query, previousQuery) {
        console.log(query, previousQuery);
      }
    }
  });





    app.request.post("https://nairasurvey.com/auditbar_backend/find_contact.php",
          {
            
            "my_id" : permanentReg.user_serial

          },
            function(data){
              window.localStorage.setItem("myContacts", data);

              data = JSON.parse(data); 
              console.log(data);

              for (var i = 0; i < data.length; i++) {

                var contactSN = data[i]["contact_sn"];
                var contactName = data[i]["contact_name"];
                var contactEmail = data[i]["contact_email"];
                var contactPhone = data[i]["contact_phone"];
                var contactAddress = data[i]["contact_address"];

                

                $$(".search-found-bar").append("<li class='item-content' onclick=storeChosenContact(" + contactSN + ")><div class='item-inner'><div class='item-title'>" + contactName + "(" + contactEmail + ")</div></div></li>");
              }
              

          }, function(){

              $$("#add-contact-button").html("Add contact").prop("disbled", false);
              toastMe("Network error. Try again later");

          });


    storeChosenContact = function(contactSN){

     var allContacts = window.localStorage.getItem("myContacts");
     allContacts = JSON.parse(allContacts);

     for(p in allContacts){

        if(allContacts[p]['contact_sn'] == contactSN){

            var chosenContactName = allContacts[p]['contact_name'];
            var chosenContactEmail = allContacts[p]['contact_email'];
            var chosenContactPhone = allContacts[p]['contact_phone'];
            var chosenContactAddress = allContacts[p]['contact_address'];

            window.localStorage.setItem("chosenContact", JSON.stringify({
              "contact_name" : chosenContactName,
              "contact_email" : chosenContactEmail,
              "contact_phone" : chosenContactPhone,
              "contact_address" : chosenContactAddress
            }));
            mainView.router.navigate("/createinvoice/");
            break;
        }

     }

    }
    

  

});















$$(document).on('page:init', '.page[data-name="invoices"]', function (e){

  var chosenCompany = window.localStorage.getItem("chosenCompany");
  chosenCompany = JSON.parse(chosenCompany);

  $$(".company-name").text(chosenCompany.company_name);
  if (chosenCompany.company_logo == "") {
    $$(".company-logo").prop("src", "imgs/assets/logo.png");
  }
  else{
    $$(".company-logo").prop("src", chosenCompany.company_logo).css({'border-radius' : '50%'});
  }



  var openThisInvoice = app.popup.create({
      el : '.open-invoice-popup'
  });

  var openExpensesPopup = app.popup.create({
      el : '.open-expenses-popup'
  });

  var openPayinsPopup = app.popup.create({
      el : '.open-payins-popup'
  });
  


  openInvoice = function(id){

    //quickly save id of invoice selected
    window.localStorage.setItem("invoiceCurrentlyOn", id);

    var theLoadedInvoices = window.localStorage.getItem("loadedInvoices");
    theLoadedInvoices = JSON.parse(theLoadedInvoices);

    console.log(theLoadedInvoices);

    //app.dialog.alert(theLoadedInvoices[id]["invoice_number"]);
     app.dialog.preloader("Opening invoice...");
     setTimeout(function(){
      app.dialog.close();
      openThisInvoice.open();
    }, 1000);
     
    var invoiceTotalAmount = + theLoadedInvoices[id]["total_amount"];
    invoiceTotalAmount = invoiceTotalAmount.toLocaleString();

    var invoiceGrandTotalAmount = + theLoadedInvoices[id]["grand_total_amount"];
    invoiceGrandTotalAmount = invoiceGrandTotalAmount.toLocaleString();

    var vatAmount = + theLoadedInvoices[id]["vat_amount"];
    vatAmount = vatAmount.toLocaleString();

    var invoiceDate = theLoadedInvoices[id]["invoice_date"];
    invoiceDate = invoiceDate.split(" ");

    var invoiceDueDate = theLoadedInvoices[id]["invoice_due_date"];
    invoiceDueDate = invoiceDueDate.split(" ");

    $$(".open-invoice-number").text(theLoadedInvoices[id]["invoice_number"]);
    $$("#open-invoice-biller").text(theLoadedInvoices[id]["biller"]);
    $$("#open-invoice-biller-address").text(theLoadedInvoices[id]["biller_address"]);
    $$("#open-invoice-total-amount").text(theLoadedInvoices[id]["currency"] + "" + invoiceTotalAmount);
    $$("#open-invoice-vat").text(theLoadedInvoices[id]["vat"] + "% (" + theLoadedInvoices[id]["currency"] + "" + vatAmount + ")");
    $$("#open-invoice-grand-total-amount").text(theLoadedInvoices[id]["currency"] + "" +invoiceGrandTotalAmount);
    $$("#open-invoice-date").text(invoiceDate[0]);
    $$("#open-invoice-due-date").text(invoiceDueDate[0]);


  }



  openInvoiceExpenses = function(){


     //quickly save id of invoice selected
    var invoiceCurrentlyOn = window.localStorage.getItem("invoiceCurrentlyOn");

    var theLoadedInvoices = window.localStorage.getItem("loadedInvoices");
    theLoadedInvoices = JSON.parse(theLoadedInvoices);

    var thisInvoiceExpenses = theLoadedInvoices[invoiceCurrentlyOn]["invoice_expenses"];
    console.log(thisInvoiceExpenses);
    if (thisInvoiceExpenses.length == 0) {
      toastMe("No expenses found!");
    }
    else{



      var magnetExpenses = "<ul>"
      for (var i = 0; i < thisInvoiceExpenses.length; i++) {

        var expenseAmount = thisInvoiceExpenses[i]["amount"];
        expenseAmount = expenseAmount.toLocaleString();
          
        magnetExpenses += "<li class='accordion-item'><a href='#' class='item-link item-content'><div class='item-inner'><div class='item-title'>" + thisInvoiceExpenses[i]["expense_description"] + "<br><small>" + thisInvoiceExpenses[i]["transaction_id"] + "</small></div></div></a><div class='accordion-item-content'><ul><li><div class='item-content'><div class='item-inner'><div class='item-title'>Category:</div><div class='item-after' id='open-invoice-biller'>" + thisInvoiceExpenses[i]["category"] + "</div></div></div></li>   <li><div class='item-content'><div class='item-inner'><div class='item-title'>Amount:</div><div class='item-after'>" + theLoadedInvoices[invoiceCurrentlyOn]["currency"] + "" + expenseAmount + "</div></div></div></li>    <li><div class='item-content'><div class='item-inner'><div class='item-title'>Transaction ID:</div><div class='item-after'>" + thisInvoiceExpenses[i]["transaction_id"] + "</div></div></div></li>    <li><div class='item-content'><div class='item-inner'><div class='item-title'>Description:</div><div class='item-after'>" + thisInvoiceExpenses[i]["expense_description"] + "</div></div></div></li>   <li><div class='item-content'><div class='item-inner'><div class='item-title'>Transaction Date:</div><div class='item-after'>" + thisInvoiceExpenses[i]["expense_date"].split(" ")[0] + "</div></div></div></li>  </ul></div></li>";

      }

      magnetExpenses += "</ul>";
      $$("#load-invoice-expenses").html(magnetExpenses);

      app.dialog.preloader("Opening invoice expenses...");
       setTimeout(function(){
        app.dialog.close();
        openExpensesPopup.open();
      }, 1000);

    }

  }







  openInvoicePayins = function(){

     //quickly save id of invoice selected
    var invoiceCurrentlyOn = window.localStorage.getItem("invoiceCurrentlyOn");

    var theLoadedInvoices = window.localStorage.getItem("loadedInvoices");
    theLoadedInvoices = JSON.parse(theLoadedInvoices);

    var thisInvoicePayins = theLoadedInvoices[invoiceCurrentlyOn]["invoice_payins"];
    console.log(thisInvoicePayins);
    if (thisInvoicePayins.length == 0) {
      toastMe("No payins found!");
    }
    else{



      var magnetPayins = "<ul>"
      for (var i = 0; i < thisInvoicePayins.length; i++) {

        var payinAmount = thisInvoicePayins[i]["transaction_amount"];
        payinAmount = payinAmount.toLocaleString();
          
        magnetPayins += "<li class='accordion-item'><a href='#' class='item-link item-content'><div class='item-inner'><div class='item-title'>" + thisInvoicePayins[i]["payin_description"] + "<br><small>" + thisInvoicePayins[i]["transaction_id"] + "</small></div></div></a><div class='accordion-item-content'><ul>  <li><div class='item-content'><div class='item-inner'><div class='item-title'>Amount:</div><div class='item-after'>" + theLoadedInvoices[invoiceCurrentlyOn]["currency"] + "" + payinAmount + "</div></div></div></li>    <li><div class='item-content'><div class='item-inner'><div class='item-title'>Transaction ID:</div><div class='item-after'>" + thisInvoicePayins[i]["transaction_id"] + "</div></div></div></li>    <li><div class='item-content'><div class='item-inner'><div class='item-title'>Description:</div><div class='item-after'>" + thisInvoicePayins[i]["payin_description"] + "</div></div></div></li>   <li><div class='item-content'><div class='item-inner'><div class='item-title'>Transaction Date:</div><div class='item-after'>" + thisInvoicePayins[i]["transaction_date"].split(" ")[0] + "</div></div></div></li>  </ul></div></li>";

      }

      magnetPayins += "</ul>";
      $$("#load-invoice-payins").html(magnetPayins);

      app.dialog.preloader("Opening invoice payins...");
       setTimeout(function(){
        app.dialog.close();
        openPayinsPopup.open();
      }, 1000);

    }

  }


   app.request.post('https://nairasurvey.com/auditbar_backend/list_invoices.php', 
            {
            "company_serial" : chosenCompany.company_id,
             "from_date" : "",
             "to_date" : "",
             "invoice_status" : ""            
           },
             function (dataRec) {
              console.log(dataRec);
                data = JSON.parse(dataRec);
                console.log(data);

                if (data[0].count_status == 0) {
                  $$("#all-invoices-list").html("<img src='imgs/assets/box.png' style='margin:0 auto; max-width:120px;'><br><h3>No invoices found</h3>").addClass("text-center");
                }
                else{
                  window.localStorage.setItem("loadedInvoices", dataRec);
                var allInvoicesPlate = "<ul>";
                var invoicePaymentStatus = "<button type='button' class='button button-outline button-small'>Paid</button>";



              for (var i = 0; i < data.length; i++) {

                var grandTotalAmount = parseInt(data[i]["grand_total_amount"]);
                grandTotalAmount = grandTotalAmount.toLocaleString();
                
                switch(data[i]["invoice_status"]){

                  case "unpaid" : invoicePaymentStatus = "<button type='button' class='button button-outline button-small color-orange'>Sent</button>"; break;

                  case "paid" : invoicePaymentStatus = "<button type='button' class='button button-outline button-small color-green col'>Paid</button>"; break;

                  default : invoicePaymentStatus = "<button type='button' class='button button-outline button-small color-red'>Sent</button>"; break;

                }
            allInvoicesPlate += "<li onclick=openInvoice(" + i + ")><div class='item-content'><div class='item-inner'><div class='item-title'>" + data[i]["biller"] + "<br>" + data[i]["invoice_date"].split(" ")[0] + "</div><div class='item-after'>" + data[i]["currency"] + "" + grandTotalAmount + "&nbsp;&nbsp;" + invoicePaymentStatus +"</div></div></div></li>";

          }

          allInvoicesPlate += "</ul>";

             $$("#all-invoices-list").html(allInvoicesPlate).removeClass("text-center");
           }
             },
             function(){
                toastMe("Network error. Try again later");
             });


   $$("#open-invoice-expenses").click(function(){
    openInvoiceExpenses();
  });


   $$("#open-invoice-payins").click(function(){
    openInvoicePayins();
  });


});
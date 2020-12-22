// Declare Global variables
var getLogo, messenger, shift, selectCompany, grabCompanySummary, resetDashboard, resetDateRange, changeCurrency, refreshInvoiceList, invoicePageRefreshList, deleteInvoiceItem, uploadCompanyLogo, storeChosenContact, openInvoice, openInvoiceExpenses, openInvoicePayins, deleteChosenContact, editChosenContact, taxSubscribe, myLineCanvas, CanvasBackground, XValues, YValues, gridLineColor, gridNumeralColor, GridNumeralDecimals, gridLineFrecuency, lineStroke, lineColor, ChartAvarage, shareAuditbar, pushChart, pushChart2, changeTimeFrame;


// Dom7
var $$ = Dom7;


// Init App
var app = new Framework7({
  name : 'Netbook',
  id: 'com.blueportal.netbook',
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

  app.request.post('https://abtechnology.com.ng/auditbar/messenger.php', 
            {
             "the_message" : theMessage,
             "the_channel" : theChannel,
             "the_email" : theEmail,
             "the_phone" : thePhone,
             "the_subject" : theSubject
           },
             function (data) {
              console.log(data);
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


  shareAuditbar = function(){

// this is the complete list of currently supported params you can pass to the plugin (all optional)
var options = {

  message: 'Accounting and Invoicing app in your pocket. Download Auditbar app and get 2 months free trial when you use referral code - ' + window.localStorage.getItem('user_referral_code'), 
  subject: 'Auditbar', // fi. for email
  files: [], // an array of filenames either locally or remotely
  url: 'https://play.google.com/store/apps/details?id=com.auditbar.app',
  chooserTitle: 'Share via'
};

var onSuccess = function(result) {
  //console.log("Share was successful");
};

var onError = function(msg) {
  //console.log("Sharing Failed!");
};

window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);

}


  StatusBar.backgroundColorByHexString("#ffffff");

  document.addEventListener("backbutton", function (){
    
    var currentPage = mainView.router.currentRoute.name;
    app.popup.close();
    //Re-route to Dashboard
    if(currentPage == "dashboard" || currentPage == "login" || currentPage == "slides" || currentPage == "signup"){

        navigator.app.exitApp();
    }
    else if (currentPage == "more" || currentPage == "invoices") {
       mainView.router.navigate("/dashboard/");
    }
    else if (app.popup.opened == true) {
        app.popup.close();
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
            
          
            app.request.post('https://abtechnology.com.ng/auditbar/user_login.php', 
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
                window.localStorage.setItem("user_referral_code", dataCheck.referral_code);
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


            app.request.post('https://abtechnology.com.ng/auditbar/generate_code.php', 
            
             function (data) {

              var data = JSON.parse(data);

                window.localStorage.setItem("activation_code", data.status);
                console.log(data);
                var welcomeMsg = "<h2>Hi " + $$("#new-user-full-name").val() + "!</h2> Thank you for signing up and Welcome to Auditbar. Your verification code is " + data.status;

              // call on messenger
                messenger(welcomeMsg, "email", $$("#new-user-email").val(), "", "Welcome to Auditbar");


             },
             function(){

              console.log("We got dismissed!");

             });

            window.setTimeout(function(){
              $$(this).html("Create account").prop("disabled", false);
              mainView.router.navigate("/enterotp/");
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



             app.request.post('https://abtechnology.com.ng/auditbar/user_registration.php', 
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

                var tempRegInputs = ["user_serial", "companys"];
                var tempRegArray = [data.user_serial, data.companys];

                for (var i = 0; i < tempRegInputs.length; i++) {

                  var tempInput = tempRegInputs[i];
                  var tempReg = tempRegArray[i];

                  tempStorage[tempInput] = tempReg;

                }
                tempStorage = JSON.stringify(tempStorage);
                window.localStorage.setItem("permanentReg", tempStorage);

                //now set referral code too
                window.localStorage.setItem("user_referral_code", data.referral_code);

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


             app.request.post('https://abtechnology.com.ng/auditbar/user_registration.php', 
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

                var tempRegInputs = ["user_serial", "companys"];
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


  var permanentReg = window.localStorage.getItem("permanentReg");
  permanentReg = JSON.parse(permanentReg);







    console.log("Welcome to the reg choose plan page");
    $$("#free-trial-btn").click(function(){
      mainView.router.navigate("/dashboard/");
    });
    $$("#goto-dashboard-button").click(function(){
      paymentCompletePopup.close();
      mainView.router.navigate("/dashboard/");
    });

    $$("#registered-company-name").text(permanentReg.companys[0].company_name);

    $$("#one-k-subscription-button").click(function(){
      app.dialog.preloader();
      subscribe(1);
    });

    $$("#ten-k-subscription-button").click(function(){
      app.dialog.preloader();
      subscribe(2);
    });

    $$("#free-trial-button").click(function(){
      app.dialog.preloader();
      subscribe(3);
    });








    

    var paymentCompletePopup = app.popup.create({
      el : ".payment-complete-popup"
    });

    


    app.dialog.preloader("Fetching prices...", "blue");


      
  

      function subscribe(subscriptionID){

      app.request.post('https://abtechnology.com.ng/auditbar/init_transaction.php',
              {

               "subscription_id" : subscriptionID,
               "company_id" : permanentReg.companys[0].company_id
              },
               function (data) {
                console.log(data);

                var dataRec = JSON.parse(data);
                if (dataRec.status == "successful" && dataRec.subscription_price != 0) {
                  
                  runPayment(data);
                }
                else if(dataRec.subscription_price == 0){
                  app.dialog.close();
                  mainView.router.navigate("/dashboard/");
                }
                else{
                  app.dialog.close();
                  toastMe(dataRec.status);
                }

               }, function(){

                toastMe("Unable to create transaction. Try again");
                app.dialog.close();

               });
            

          }





          function runPayment(pushedData){

            
            pushedData = JSON.parse(pushedData);

            app.request.post("https://abtechnology.com.ng/auditbar/paystack/paystack_init.php",
                        {
                          "buyer_email" : permanentReg.user_email,
                          "amount_2_pay" : pushedData.subscription_price * 100,
                          "tnx_reference" : pushedData.transaction_id
                          
                        },
                         function(data){

                          if(typeof JSON.parse(data) != "object"){
                            
                            toastMe("Unable to create transaction. Try again");
                            app.dialog.close();

                          }
                          else{
                          app.dialog.close();
                          app.dialog.preloader("Awaiting payment...");
                          console.log(data);
                          var parsedData = JSON.parse(data);
                          var authUrl = parsedData.data.authorization_url;
                          window.open(authUrl, "_system");
                          confirmPayment(parsedData.data.reference);;

                          
                                                  
                      }
                          
                          
                         }, function(){

                            app.dialog.close();
                            toastMe("Unable to create transaction now. Try again later");
                            $$("#one-k-subscription-button").html("buttonText").prop("disabled", false);
                            
                         });


          }




          //fetch prices and add them to button
          app.request.post('https://abtechnology.com.ng/auditbar/fetch_prices.php',
              
               function (data) {
                

                console.log(JSON.parse(data));
                var data =  JSON.parse(data);
                $$("#basic-plan-price").text(parseInt(data[0].subscription_price).toLocaleString());
                $$("#standard-plan-price").text(parseInt(data[1].subscription_price).toLocaleString());

                app.dialog.close();
                

               }, function(){

                
                toastMe("Unable to fetch prices. Try again");
                mainView.router.navigate("/dashboard/");
                

               });






var counter = 0;


           function confirmPayment(transactionID){


            app.request.post("https://abtechnology.com.ng/auditbar/paystack/confirm_payment.php",
                        {
                          
                          "transaction_id" : transactionID                         
                          
                        },
                         function(data){
                          

                          console.log(JSON.parse(data));
                          var data = JSON.parse(data);


                          if (data.status == "No payment made") {
                            
                            if(counter < 60){
                              counter++;
                              console.log(counter);
                              confirmPayment(transactionID);
                            }
                            else{
                              app.dialog.close();
                              app.dialog.alert("Payment failed!");
                            }

                          }
                          else{
                            app.dialog.close();
                            paymentCompletePopup.open();
                          }
                          


                         }, function(){

                            app.dialog.close();
                            toastMe("Unable to verify transaction. Try again later");
                            
                         });

          }





        function checkPayment(paymentRef){


            app.request.post("https://abtechnology.com.ng/auditbar/paystack/verify_payment.php",
                        {
                          
                          "transaction_id" : paymentRef                         
                          
                        },
                         function(data){
                        
                          console.log(data);
                          paymentCompletePopup.open();


                         }, function(){

                            toastMe("Unable to verify transaction. Try again later");
                            
                         });

          }







  }); // end of regchooseplan page











$$(document).on('page:init', '.page[data-name="recovery"]', function (e){
  
    $$("#recovery-btn").click(function(e){

        if ($$("#recovery-email").val().trim() == "") {
            toastMe("Please complete the form!");
        }
        else{

            $$(this).html("<img src='imgs/assets/loading.gif' style='max-width:50px;'>").prop("disabled", true);
             app.request.post('https://abtechnology.com.ng/auditbar/recover_account.php', 
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
             app.request.post('https://abtechnology.com.ng/auditbar/set_new_password.php', 
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

  if (!window.localStorage.getItem("dashboard_currency")) {
    window.localStorage.setItem("dashboard_currency", "NGN");
    $$("#currency-plate").text("NGN");
  }
  else{
    $$("#currency-plate").text(window.localStorage.getItem("dashboard_currency"));
  }





  var timeFramePopover = app.popover.create({
      el : '.time-frame-change'
   });



  changeCurrency = function(theCurrency){
    $$("#currency-plate").text(theCurrency);
    window.localStorage.setItem("dashboard_currency", theCurrency);
    currencyPopover.close();
    grabCompanySummary(chosen_company_id);
  }

    function addZero(i){
        if (i < 10) {
          i = "0" + i;
        }

        return i;
      }



   var todaysDate = new Date().getFullYear() + "-" + addZero(new Date().getMonth() + 1) + "-" + addZero(new Date().getDate());

      $$("#date-span").text(todaysDate);
      


  changeTimeFrame = function(timeFrame){

    app.popover.close();


    



       var dateRange = window.localStorage.getItem("dateRange");
        dateRange = JSON.parse(dateRange);
        var newDate = new Date();
        console.log(newDate.getDay());

       switch(timeFrame){
          case "today" : todayNi(); grabCompanySummary(chosen_company_id); break;
          case "this_month" : thisMonthNi(); grabCompanySummary(chosen_company_id); break;
          case "this_year" : thisYearNi(); grabCompanySummary(chosen_company_id); break;
          case "all_time" : allTimeNi(); grabCompanySummary(chosen_company_id); break;
          default : thisWeekNi(); grabCompanySummary(chosen_company_id);
       }


    function todayNi(){
       
      dateRange["fromDate"] = newDate.getFullYear() + "-" + addZero(newDate.getMonth() + 1) + "-" + addZero(newDate.getDate()) + " " + "00:00:01";

          dateRange["endDate"] = newDate.getFullYear() + "-" + addZero(newDate.getMonth() + 1) + "-" + addZero(newDate.getDate()) + " " + "23:59:58";
        
        dateRange = JSON.stringify(dateRange);
        window.localStorage.setItem("dateRange", dateRange);
    }



    function thisMonthNi(){
       
      dateRange["fromDate"] = newDate.getFullYear() + "-" + addZero(newDate.getMonth() + 1) + "-01 " + "00:00:01";

      dateRange["endDate"] = newDate.getFullYear() + "-" + addZero(newDate.getMonth() + 1) + "-31 " + "23:59:58";
        
        dateRange = JSON.stringify(dateRange);
        window.localStorage.setItem("dateRange", dateRange);
    }




    function thisYearNi(){
       
      dateRange["fromDate"] = newDate.getFullYear() + "-01-01 00:00:01";

      dateRange["endDate"] = newDate.getFullYear() + "-12-31 23:59:58";
        
        dateRange = JSON.stringify(dateRange);
        window.localStorage.setItem("dateRange", dateRange);
    }      

     

    function thisWeekNi(){
       
      var days = 7; // Days you want to subtract
      var date = new Date();
      var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
      var day = last.getDate();
      var month = last.getMonth()+1;
      var year = last.getFullYear();

      var lastWeek = year + "-" + addZero(month) + "-" + day + " 00:00:00";

      var todaygangan = newDate.getFullYear() + "-" + addZero(newDate.getMonth() + 1) + "-" + addZero(newDate.getDate()) + " " + "23:59:58";

      console.log(lastWeek, todaygangan);

      dateRange["fromDate"] = lastWeek;
      dateRange["endDate"] = todaygangan;

        
        dateRange = JSON.stringify(dateRange);
        window.localStorage.setItem("dateRange", dateRange);
    }
    



    function allTimeNi(){
       
      dateRange["fromDate"] = "";

      dateRange["endDate"] = "";
        
        dateRange = JSON.stringify(dateRange);
        window.localStorage.setItem("dateRange", dateRange);
    }
    
   


    
  }

  var currencyPopover = app.popover.create({
      el : '.popover-currency-change'
   });


  $$(".demo-calendar-modal").click(function(){
    timeFramePopover.close();
  });

  var bigChart

  pushChart = function(myDataIncome, myDataExpense){

      var hugeData = [];

      for(b = 0; b < myDataIncome.length; b++){

        var dataToAppend = {
          "group_name": "Income", "name": myDataIncome[b].transaction_date.split(" ")[0], "value": parseInt(myDataIncome[b].transaction_amount)
        }

        hugeData.push(dataToAppend);
      }


      for(b = 0; b < myDataExpense.length; b++){

        var dataToAppend = {
          "group_name": "Expense", "name": myDataExpense[b].transaction_date.split(" ")[0], "value": parseInt(myDataExpense[b].transaction_amount)
        }

        hugeData.push(dataToAppend);
      }


      
 
      console.log("Huge data is ", hugeData);
      bigChart.updateChart({ data: hugeData });
  
}








   var zero_data = [
    { "group_name": "Income", "name": "0000-00-00", "value": 0 },
    { "group_name": "Expenses", "name": "0000-00-00", "value": 0 }
   ];
  




   bigChart = $('#chtAnimatedBarChart').animatedBarChart({ 
    data: zero_data,
    colors: ['#1c7ebf', '#d62728'],
	    number_format: {
	    format: ',.2f', // default number format
	    decimal: '.', // decimal symbol
	    thousands : ',', // thousand separator symbol
	    grouping: [3], // thousand separator grouping
	    currency: [window.localStorage.getItem("dashboard_currency")] // currency symbol
	   },


	   legend: {
	    position: LegendPosition.top, // legend position (bottom/top/right/left)
	    width: 500 // legend width in pixels for left/right
	  },

	  rotate_x_axis_labels: { 
	    process: true, // process xaxis label rotation
	    minimun_resolution: 720, // minimun_resolution for label rotating
	    bottom_margin: 100, // bottom margin for label rotation
	    rotating_angle: 75, // angle for rotation,
	    x_position: 10, // label x position after rotation
	    y_position: -3 // label y position after rotation
	  },


	   bars: { 
	    padding: 0.1, // padding between bars
	    opacity: 0.7, // default bar opacity
	    opacity_hover: 0.45, // default bar opacity on mouse hover
	    disable_hover: false, // disable animation and legend on hover
	    hover_name_text: 'date', // text for name column for label displayed on bar hover
	    hover_value_text: 'amount', // text for value column for label displayed on bar hover
	  },

  });



  var theChosenCompany = window.localStorage.getItem("chosenCompany");
  theChosenCompany = JSON.parse(theChosenCompany);
  var chosen_company_name = theChosenCompany.company_name;
  var chosen_company_logo = theChosenCompany.company_logo;
  var chosen_company_id = theChosenCompany.company_id;
  var chosen_company_email = theChosenCompany.company_email;

  $$(".company-name").html(chosen_company_name + "<br><small class='text-color-gray'>" + chosen_company_email + "</small>");
  //set company logo
  if (chosen_company_logo == "") {
    $$(".company-logo").prop("src", "imgs/assets/logo.png");
  }
  else{
    $$(".company-logo").prop("src", chosen_company_logo).css({'border-radius' : '50%'});
  }
  
  //then load default chosen company summary
  window.setTimeout(function(){
    grabCompanySummary(chosen_company_id);
  }, 500);



  $$("#dashboard-create-invoice-btn").click(function(){

    app.dialog.preloader("Please wait...", "blue");

    //check if i am admin of company,
    //check if company has an active subscription

    if (theChosenCompany.company_access == "administrator") {
        
    
     app.request.post("https://abtechnology.com.ng/auditbar/check_subscription.php",
          {
            "company_id" : chosen_company_id
          },
            function(data){
              console.log(data);
              data = JSON.parse(data); 
              console.log(data.status);
              if (data.status == "found") {

                  mainView.router.navigate("/createinvoice/");
                  app.dialog.close();
              }
              else{

                toastMe("Subscription expired");
                app.dialog.close();
                mainView.router.navigate("/chooseplan/");
                

              }
          }, function(){

              $$("#add-contact-button").html("Add contact").prop("disabled", false);
              toastMe("Network error. Try again later");

          });
   }
   else{

      toastMe("Only administrators can create an invoice");
      app.dialog.close();
    }
    
  });

  $$("#add-contact-btn").click(function(){
      mainView.router.navigate("/addcontact/");
      app.dialog.close();
  });


  var ptr = $$('.ptr-content');
  ptr.on("ptr:refresh", function(){
    var theChosenCompany = window.localStorage.getItem("chosenCompany");
    theChosenCompany = JSON.parse(theChosenCompany);
    grabCompanySummary(theChosenCompany.company_id);
    setTimeout(function(){
      app.ptr.done();
    }, 5000);
  });
  


  //Load up company list in popover
  for (var i = 0; i < permanentReg.companys.length; i++) {

    var company_id = permanentReg.companys[i]["company_id"];
    var company_name = permanentReg.companys[i]["company_name"];
    var company_logo = permanentReg.companys[i]["company_logo"];
    var company_email = permanentReg.companys[i]["company_email"];

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
          $$(".company-name").html(company_name + "<br><small class='text-color-gray'>" + company_email + "</small>");
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
            $$(".company-logo").prop("src", company_logo).css({"border-radius" : "50%"});
          }

          chosenCompanyDetails = JSON.stringify(chosenCompanyDetails);
          window.localStorage.setItem("chosenCompany", chosenCompanyDetails);
          //resetDateRange();
          grabCompanySummary(theCompanyID);

          break;
        }
        
      }

  }






  grabCompanySummary = function(theCompanyID){

    var dateRange = window.localStorage.getItem("dateRange");
    dateRange = JSON.parse(dateRange);

      app.request.post('https://abtechnology.com.ng/auditbar/company_summary.php', 
            {
            "company_serial" : theCompanyID,
             "from_date" : dateRange.fromDate,
             "to_date" : dateRange.endDate,
             "currency" :  window.localStorage.getItem("dashboard_currency")         
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
                  var invoiceCurrency = window.localStorage.getItem("dashboard_currency");
                  for (var i = 0; i < cashIDs.length; i++) {
                  var thisDataView = viewDatas[i];
                  $$("#" + cashIDs[i]).text(invoiceCurrency + " " + parseInt(dataCheck[thisDataView]).toLocaleString());
                  }
                  console.log(dataCheck.income_breakdown);
                  pushChart(dataCheck.income_breakdown, dataCheck.expenses_breakdown);
                  

                  
                   
                }
             },
             function(){
                toastMe("Network error. Try again later");
             });
      }


      
      




      resetDashboard = function(){

         var cashIDs = ["total-income", "total-expenses", "gross-profit", "total-invoice-amount", "total-paid-invoice", "total-unpaid-invoice", "inventory", "labour", "rent", "tax", "other", "net-profit"];

         for (var i = 0; i < cashIDs.length; i++) {
            $$("#" + cashIDs[i]).text(window.localStorage.getItem("dashboard_currency") + " 0");
          }
          var zero_data = [
            { "group_name": "Income", "name": "0000-00-00", "value": 0 },
            { "group_name": "Expense", "name": "0000-00-00", "value": 0 }
           ];
          bigChart.updateChart({ data: zero_data });
          
           
      }

      function addZero(i){
        if (i < 10) {
          i = "0" + i;
        }

        return i;
      }



  




        



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
                  endDay = endDate.getDate();
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

  $$("#share-auditbar").click(function(){
    shareAuditbar();
  });

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



  var selectBankAccountPopup = app.popup.create({
      el : '.select-bank-account-popup'
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
            headerPlaceholder : 'Invoice due date',
            closeByOutsideClick : false,
            
          });

  


  $$('.swipeout').on('swipeout:deleted', function () {
    toastMe('Thanks, item removed!');
  });



  $$("#bank-details").click(function(){
    selectBankAccountPopup.open();
  });



  app.request.post("https://abtechnology.com.ng/auditbar/list_bank_accounts.php",
          {
            
            "company_serial" : chosenCompany.company_id

          },
            function(dataSeed){

              console.log(dataSeed);
              var data = JSON.parse(dataSeed);

              if (data.count_status == 0) {

                $$("#bank-account-list-container").html("<img src='imgs/assets/box.png' style='margin:0 auto; max-width:120px;'><br><h3>No bank accounts!</h3>").addClass("text-center");
                app.dialog.close();

              }
              else{

              window.localStorage.setItem("foundBankAccounts", dataSeed);

              magnetAccounts = "<ul>";

              for (var i = 0; i < data["all_accounts"].length; i++) {


                magnetAccounts += "<li onclick='selectAccount(" + data["all_accounts"][i]['account_sn'] + ")'><div class='item-content'><div class='item-inner'><div class='item-title'>" + data["all_accounts"][i]["account_details"] + "</div></div></div></li>";

              }
              magnetAccounts += "</ul>";
              $$("#bank-account-list-container").html(magnetAccounts);
            }
              

          }, function(){

              app.dialog.close();
              toastMe("Network error. Try again later");

          });


  selectAccount = function(accountSN){

    var foundBankAccounts = JSON.parse(window.localStorage.getItem("foundBankAccounts"));
    for (var i = 0; i < foundBankAccounts["all_accounts"].length; i++) {
        if (foundBankAccounts["all_accounts"][i]["account_sn"] == accountSN) {

          $$("#bank-details").focus().text(foundBankAccounts["all_accounts"][i]["account_details"]);
          selectBankAccountPopup.close();
          break;
        }
      }
  }


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

      var listItem = "<li class='swipeout'><div class='swipeout-content'><a href='#' class='item-link item-content'><div class='item-media'><i class='icon f7-icons'>document</i></div><div class='item-inner invoice-item'><div class='item-title'><div class='item-header'>" + chosenCurrency + "" + itemPrice + " X " + itemQty + "</div>" + itemName + "</div><div class='item-after'>" + chosenCurrency + "" + itemTotalPrice + "</div></div></a></div><div class='swipeout-actions-right'><a href='#' class='swipeout-delete' onclick=\"deleteInvoiceItem('" + i + "')\"><i class='icon material-icons'>delete</i></a></div></li>"
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

      $$("#send-invoice-button").hide();

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


      app.request.post('https://abtechnology.com.ng/auditbar/generate_invoice_preview.php', 
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
              var invoicePreviewURL = "https://abtechnology.com.ng/auditbar/businesses/" + chosenCompany.company_name + "_" + chosenCompany.company_id + "/invoice.html";
              invoicePreviewURL = encodeURI(invoicePreviewURL);
              window.setTimeout(function(){
                $("#preview-invoice").load(invoicePreviewURL);
              }, 7000);

              window.setTimeout(function(){
                $$("#send-invoice-button").show();
                $$("#waiting-to-send-invoice-loader").hide();
              }, 10000);
              

             },
             function(){
                $$("#send-invoice-button").hide();
                $$("#waiting-to-send-invoice-loader").show();
                toastMe("Network error. Try again later");
                previewInvoicePopup.close();
             });

      previewInvoicePopup.open();  

    }
    });





    $$("#send-invoice-button").click(function(){

      toastMe("sending invoice...");
      var theChosenContact = JSON.parse(window.localStorage.getItem("chosenContact"));

      $$(this).html("<img src='imgs/assets/loading.gif' style='max-width: 50px;'>").prop("disabled", true);
      

          app.request.post("https://abtechnology.com.ng/auditbar/create_invoice.php",
          {
            "company_name" :  chosenCompany.company_name,
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
                
                $$("#sent-to-company-name").text(theChosenContact.contact_name);
                invoiceSentPopup.open();
                window.localStorage.removeItem("chosenContact");
                window.localStorage.removeItem("invoiceList");

              }
              else{
                toastMe("Unable to send invoice. Try later");
                $$("#send-invoice-button").html("<i class='icon f7-icons' style='font-size: 32px;'>paper_plane</i>Send").prop("disabled", false);
              }

          }, function(){
              $$("#send-invoice-button").html("<i class='icon f7-icons' style='font-size: 32px;'>paper_plane</i>Send").prop("disabled", false);
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

          $$(this).html("<img src='imgs/assets/loading.gif' style='max-width: 50px;'>").prop("disabled", true);

          app.request.post("https://abtechnology.com.ng/auditbar/add_contact.php",
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
                
                
                addContactPopup.open();

              }
              else{

                toastMe(dataRec.status);
                $$("#add-contact-button").html("Add customer").prop("disabled", false);

              }
              

          }, function(){
              $$("#add-contact-button").html("Add customer").prop("disabled", false);
              toastMe("Network error. Try again later");

          });
      }

    });



    $$("#contact-added-button").click(function(){
      addContactPopup.close();
      mainView.router.navigate("/contacts/");
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





    app.request.post("https://abtechnology.com.ng/auditbar/find_contact.php",
          {
            
            "my_id" : permanentReg.user_serial

          },
            function(data){
              window.localStorage.setItem("myContacts", data);

              data = JSON.parse(data); 
              console.log(data);

              if (data.count_status == 0) {

                  toastMe("No contacts found!");
                  mainView.router.navigate("/addcontact/");

              }
              else{

              for (var i = 0; i < data["found_contacts"].length; i++) {

                var contactSN = data["found_contacts"][i]["contact_sn"];
                var contactName = data["found_contacts"][i]["contact_name"];
                var contactEmail = data["found_contacts"][i]["contact_email"];
                var contactPhone = data["found_contacts"][i]["contact_phone"];
                var contactAddress = data["found_contacts"][i]["contact_address"];

                

                $$(".search-found-bar").append("<li class='item-content' onclick=storeChosenContact(" + contactSN + ")><div class='item-inner'><div class='item-title'>" + contactName + "</div></div></li>");
              }

            }
              

          }, function(){

              $$("#add-contact-button").html("Add contact").prop("disabled", false);
              toastMe("Network error. Try again later");

          });


    storeChosenContact = function(contactSN){

     var allContacts = window.localStorage.getItem("myContacts");
     allContacts = JSON.parse(allContacts);

     for (var p = 0; p < allContacts["found_contacts"].length; p++) {

        if(allContacts["found_contacts"][p]['contact_sn'] == contactSN){

            var chosenContactSN = allContacts["found_contacts"][p]['contact_sn'];
            var chosenContactName = allContacts["found_contacts"][p]['contact_name'];
            var chosenContactEmail = allContacts["found_contacts"][p]['contact_email'];
            var chosenContactPhone = allContacts["found_contacts"][p]['contact_phone'];
            var chosenContactAddress = allContacts["found_contacts"][p]['contact_address'];

            window.localStorage.setItem("chosenContact", JSON.stringify({
              "contact_sn" : chosenContactSN,
              "contact_name" : chosenContactName,
              "contact_email" : chosenContactEmail,
              "contact_phone" : chosenContactPhone,
              "contact_address" : chosenContactAddress
            }));
            
              mainView.router.navigate(mainView.router.previousRoute.url);
         
            
            break;
        }

     }

    }
    

  

});









$$(document).on('page:beforein', '.page[data-name="invoices"]', function (e){

StatusBar.backgroundColorByHexString("#2196f3");
StatusBar.styleLightContent();

});

$$(document).on('page:beforeout', '.page[data-name="invoices"]', function (e){

StatusBar.backgroundColorByHexString("#ffffff");
StatusBar.styleDefault();

});



$$(document).on('page:init', '.page[data-name="invoices"]', function (e){


  var chosenCompany = window.localStorage.getItem("chosenCompany");
  chosenCompany = JSON.parse(chosenCompany);

  $$(".company-name").text(chosenCompany.company_name.substr(0, 4) + "..");
  if (chosenCompany.company_logo == "") {
    $$(".company-logo").prop("src", "imgs/assets/logo.png");
  }
  else{
    $$(".company-logo").prop("src", chosenCompany.company_logo).css({'border-radius' : '50%'});
  }



  if (!window.localStorage.getItem("invoice_currency")) {
    window.localStorage.setItem("invoice_currency", "NGN");
    $$("#invoice-currency-plate").text("NGN");
  }
  else{
    $$("#invoice-currency-plate").text(window.localStorage.getItem("invoice_currency"));
  }

  if (!window.localStorage.getItem("invoiceDateRange")) {
    var myToday = new Date();
    function addZero(i){
        if (i < 10) {
          i = "0" + i;
        }
        return i;
      }


    var invoiceDateRange = {

      "from_date" : "",
      "to_date" : "",
    }

    invoiceDateRange = JSON.stringify(invoiceDateRange);
    window.localStorage.setItem("invoiceDateRange", invoiceDateRange);
  }




  function loodAllGrand(){
    loadAllInvoices();
    loadPaidInvoices();
    loadUnpaidInvoices();
    loadOverdueInvoices();
    loadPartialInvoices();
  }




  changeTimeFrame = function(timeFrame){

    app.popover.close();


      function addZero(i){
        if (i < 10) {
          i = "0" + i;
        }

        return i;
      }


       var dateRange = window.localStorage.getItem("invoiceDateRange");
        dateRange = JSON.parse(dateRange);
        var newDate = new Date();
        console.log(newDate.getDay());

       switch(timeFrame){
          case "today" : todayNi(); loodAllGrand(); break;
          case "this_month" : thisMonthNi(); loodAllGrand(); break;
          case "this_year" : thisYearNi(); loodAllGrand(); break;
          case "all_time" : allTimeNi(); loodAllGrand(); break;
          default : thisWeekNi(); loodAllGrand();
       }


    function todayNi(){
       
      dateRange["from_date"] = newDate.getFullYear() + "-" + addZero(newDate.getMonth() + 1) + "-" + addZero(newDate.getDate()) + " " + "00:00:01";

          dateRange["to_date"] = newDate.getFullYear() + "-" + addZero(newDate.getMonth() + 1) + "-" + addZero(newDate.getDate()) + " " + "23:59:58";
        
        dateRange = JSON.stringify(dateRange);
        window.localStorage.setItem("invoiceDateRange", dateRange);
    }



    function thisMonthNi(){
       
      dateRange["from_date"] = newDate.getFullYear() + "-" + addZero(newDate.getMonth() + 1) + "-01 " + "00:00:01";

      dateRange["to_date"] = newDate.getFullYear() + "-" + addZero(newDate.getMonth() + 1) + "-31 " + "23:59:58";
        
        dateRange = JSON.stringify(dateRange);
        window.localStorage.setItem("invoiceDateRange", dateRange);
    }




    function thisYearNi(){
       
      dateRange["from_date"] = newDate.getFullYear() + "-01-01 00:00:01";

      dateRange["to_date"] = newDate.getFullYear() + "-12-31 23:59:58";
        
        dateRange = JSON.stringify(dateRange);
        window.localStorage.setItem("invoiceDateRange", dateRange);
    }      



    function allTimeNi(){
       
      dateRange["from_date"] = "";

      dateRange["to_date"] = "";
        
        dateRange = JSON.stringify(dateRange);
        window.localStorage.setItem("invoiceDateRange", dateRange);
    } 

     

    function thisWeekNi(){
       
      var days = 7; // Days you want to subtract
      var date = new Date();
      var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
      var day = last.getDate();
      var month = last.getMonth()+1;
      var year = last.getFullYear();

      var lastWeek = year + "-" + addZero(month) + "-" + day + " 00:00:00";

      var todaygangan = newDate.getFullYear() + "-" + addZero(newDate.getMonth() + 1) + "-" + addZero(newDate.getDate()) + " " + "23:59:58";

      console.log(lastWeek, todaygangan);

      dateRange["from_date"] = lastWeek;
      dateRange["to_date"] = todaygangan;

        
        dateRange = JSON.stringify(dateRange);
        window.localStorage.setItem("invoiceDateRange", dateRange);
    }
    
  }



  var invoiceTimeFramePopover = app.popover.create({
      el : '.invoice-time-frame-change'
   });



  changeCurrency = function(theCurrency){
    $$("#invoice-currency-plate").text(theCurrency);
    window.localStorage.setItem("invoice_currency", theCurrency);
    invoiceCurrencyPopover.close();
                 loadAllInvoices();
                 loadPaidInvoices();
                 loadUnpaidInvoices();
                 loadOverdueInvoices();
                 loadPartialInvoices();
  }

  var invoiceCurrencyPopover = app.popover.create({
      el : '.invoice-popover-currency-change'
   });


  $$(".invoice-calendar-modal").click(function(){
    invoiceTimeFramePopover.close();
  });


  var calendarModal = app.calendar.create({
            inputEl: '.invoice-calendar-modal',
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
                  endDay = endDate.getDate();
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

                var invoiceDateRange = window.localStorage.getItem("invoiceDateRange");
                invoiceDateRange = JSON.parse(invoiceDateRange);
                for (var p in invoiceDateRange) {
                  invoiceDateRange["from_date"] = mergeFromDate;
                  invoiceDateRange["to_date"] = mergeEndDate;
                }
                invoiceDateRange = JSON.stringify(invoiceDateRange);
                window.localStorage.setItem("invoiceDateRange", invoiceDateRange);
                 loadAllInvoices();
                 loadPaidInvoices();
                 loadUnpaidInvoices();
                 loadOverdueInvoices();
                 loadPartialInvoices();
              }
            }
          });



  var openThisInvoice = app.popup.create({
      el : '.open-invoice-popup'
  });

  var openExpensesPopup = app.popup.create({
      el : '.open-expenses-popup'
  });

  var openPayinsPopup = app.popup.create({
      el : '.open-payins-popup'
  });


  var addPayinsPopup = app.popup.create({
      el : '.add-payins-popup'
  });


  var addExpensesPopup = app.popup.create({
      el : '.add-expenses-popup'
  });




  $$("#mark-as-paid-btn").click(function(){
    app.dialog.confirm("Are you sure you want to mark as paid?", function(){

      app.dialog.preloader("Please wait...", "blue");

      // if yes, grab invoice id
      var theInvoiceType = window.localStorage.getItem(window.localStorage.getItem("invoiceTypeCurrentlyOn"));
      var theInvoice = JSON.parse(theInvoiceType);
      theInvoice = theInvoice[window.localStorage.getItem("invoiceCurrentlyOn")];

      var totalPayins = 0;
      // quickly calculate total payins
      for (var i = 0; i < theInvoice["invoice_payins"].length; i++) {
        
        var thePayinAmount = theInvoice["invoice_payins"][i]["transaction_amount"];
        thePayinAmount = parseInt(thePayinAmount);

        totalPayins = totalPayins + thePayinAmount;
      }

      console.log(totalPayins);


      var invoicePayinBalance = theInvoice["grand_total_amount"] - totalPayins;
      console.log(invoicePayinBalance);


        app.request.post("https://abtechnology.com.ng/auditbar/mark_as_paid.php",
          {
            "invoice_id" : theInvoice.invoice_sn,
            "invoice_number" : theInvoice.invoice_number,
            "invoice_balance" : invoicePayinBalance
          },
            function(data){
              console.log(data);
              data = JSON.parse(data);

              if (data.status == "successful") {
                toastMe("Marked as paid!");
                  
                  app.dialog.close();
                  app.popup.close();
                  mainView.router.refreshPage();
              }
              else{

                toastMe(data.status);
                  
                app.dialog.close();
                
                

              }
          }, function(){

              $$("#add-contact-button").html("Add contact").prop("disabled", false);
              toastMe("Network error. Try again later");

          });



    }, function(){
      toastMe("Not sure you want to mark as paid");
    });
  });
  





  $$("#invoice-page-create-invoice-button").click(function(){

    app.dialog.preloader("Please wait...", "blue");

    //check if i am admin of company,
    //check if company has an active subscription

    if (chosenCompany.company_access == "administrator") {
        
    
     app.request.post("https://abtechnology.com.ng/auditbar/check_subscription.php",
          {
            "company_id" : chosenCompany.company_id
          },
            function(data){
              console.log(data);
              data = JSON.parse(data); 
              console.log(data.status);
              if (data.status == "found") {

                  mainView.router.navigate("/createinvoice/");
                  app.dialog.close();
              }
              else{

                toastMe("Subscription expired");
                app.dialog.close();
                mainView.router.navigate("/chooseplan/");
                

              }
          }, function(){

              $$("#add-contact-button").html("Add contact").prop("disabled", false);
              toastMe("Network error. Try again later");

          });
   }
   else{

      toastMe("Only administrators can create an invoice");
      app.dialog.close();
    }
    
  });
  


  openInvoice = function(id, theLoadedInvoice){

    //quickly save id of invoice selected
    window.localStorage.setItem("invoiceCurrentlyOn", id);
    window.localStorage.setItem("invoiceTypeCurrentlyOn", theLoadedInvoice);

    var theLoadedInvoices = window.localStorage.getItem(theLoadedInvoice);
    theLoadedInvoices = JSON.parse(theLoadedInvoices);

    var totalPayins = 0;
      // quickly calculate total payins
      for (var i = 0; i < theLoadedInvoices[id]["invoice_payins"].length; i++) {
        
        var thePayinAmount = theLoadedInvoices[id]["invoice_payins"][i]["transaction_amount"];
        thePayinAmount = parseInt(thePayinAmount);

        totalPayins = totalPayins + thePayinAmount;
      }

      totalPayins = parseInt(totalPayins);
      totalPayins = totalPayins.toLocaleString();

     app.dialog.preloader("Opening invoice...", "blue");
     setTimeout(function(){
      app.dialog.close();
      openThisInvoice.open();
    }, 2000);
     
    var invoiceTotalAmount = parseInt(theLoadedInvoices[id]["total_amount"]);
    invoiceTotalAmount = invoiceTotalAmount.toLocaleString();

    var invoiceGrandTotalAmount = parseInt(theLoadedInvoices[id]["grand_total_amount"]);
    invoiceGrandTotalAmount = invoiceGrandTotalAmount.toLocaleString();

    var vatAmount = parseInt(theLoadedInvoices[id]["vat_amount"]);
    vatAmount = vatAmount.toLocaleString();

    var invoiceDate = theLoadedInvoices[id]["invoice_date"];
    invoiceDate = invoiceDate.split(" ");

    var invoiceDueDate = theLoadedInvoices[id]["invoice_due_date"];
    invoiceDueDate = invoiceDueDate.split(" ");

    $$(".open-invoice-number").text(theLoadedInvoices[id]["invoice_number"]);
    $$("#open-invoice-biller").text(theLoadedInvoices[id]["biller"]);
    $$("#open-invoice-biller-address").text(theLoadedInvoices[id]["biller_address"]);
    $$("#open-invoice-total-amount").html("<b>" + theLoadedInvoices[id]["currency"] + "" + invoiceTotalAmount + "</b>");
    $$("#open-invoice-vat").html("<b>" + theLoadedInvoices[id]["vat"] + "% (" + theLoadedInvoices[id]["currency"] + "" + vatAmount + ")</b>");
    $$("#open-invoice-grand-total-amount").html("<b>" + theLoadedInvoices[id]["currency"] + "" +invoiceGrandTotalAmount + "</b>");

    $$("#open-invoice-amount-paid").html("<b>" + theLoadedInvoices[id]["currency"] + "" +totalPayins + "</b>");

    $$("#open-invoice-date").text(invoiceDate[0]);
    $$("#open-invoice-due-date").text(invoiceDueDate[0]);


  }



  openInvoiceExpenses = function(){


     //quickly save id of invoice selected
    var invoiceCurrentlyOn = window.localStorage.getItem("invoiceCurrentlyOn");
    var invoiceTypeCurrentlyOn = window.localStorage.getItem("invoiceTypeCurrentlyOn");

    var theLoadedInvoices = window.localStorage.getItem(invoiceTypeCurrentlyOn);
    theLoadedInvoices = JSON.parse(theLoadedInvoices);

    var thisInvoiceExpenses = theLoadedInvoices[invoiceCurrentlyOn]["invoice_expenses"];
    console.log(thisInvoiceExpenses);
    if (thisInvoiceExpenses.length == 0) {
      toastMe("No expenses found!");
    }
    else{

      var magnetExpenses = "<ul>"
      for (var i = 0; i < thisInvoiceExpenses.length; i++) {

        var expenseAmount = parseInt(thisInvoiceExpenses[i]["amount"]);
        expenseAmount = expenseAmount.toLocaleString();
          
        magnetExpenses += "<li class='accordion-item'><a href='#' class='item-link item-content'><div class='item-inner'><div class='item-title'>" + thisInvoiceExpenses[i]["expense_description"] + "<br><small>" + thisInvoiceExpenses[i]["transaction_id"] + "</small></div></div></a><div class='accordion-item-content'><ul><li><div class='item-content'><div class='item-inner'><div class='item-title'>Category:</div><div class='item-after text-color-black'>" + thisInvoiceExpenses[i]["category"] + "</div></div></div></li>   <li><div class='item-content'><div class='item-inner'><div class='item-title'>Amount:</div><div class='item-after text-color-black'>" + theLoadedInvoices[invoiceCurrentlyOn]["currency"] + "" + expenseAmount + "</div></div></div></li>    <li><div class='item-content'><div class='item-inner'><div class='item-title'>Transaction ID:</div><div class='item-after text-color-black'>" + thisInvoiceExpenses[i]["transaction_id"] + "</div></div></div></li>    <li><div class='item-content'><div class='item-inner'><div class='item-title'>Description:</div><div class='item-after text-color-black'>" + thisInvoiceExpenses[i]["expense_description"] + "</div></div></div></li>   <li><div class='item-content'><div class='item-inner'><div class='item-title'>Transaction Date:</div><div class='item-after text-color-black'>" + thisInvoiceExpenses[i]["expense_date"].split(" ")[0] + "</div></div></div></li>  </ul></div></li>";

      }

      magnetExpenses += "</ul>";
      $$("#load-invoice-expenses").html(magnetExpenses);

      app.dialog.preloader("Opening invoice expenses...", "blue");
       setTimeout(function(){
        app.dialog.close();
        openExpensesPopup.open();
      }, 1000);

    }

  }







  openInvoicePayins = function(){

     //quickly save id of invoice selected
    var invoiceCurrentlyOn = window.localStorage.getItem("invoiceCurrentlyOn");

    var theLoadedInvoiceType = window.localStorage.getItem("invoiceTypeCurrentlyOn");
    theLoadedInvoiceType = JSON.parse(window.localStorage.getItem(theLoadedInvoiceType));

    var thisInvoicePayins = theLoadedInvoiceType[invoiceCurrentlyOn]["invoice_payins"];
    console.log(thisInvoicePayins);
    if (thisInvoicePayins.length == 0) {
      toastMe("No payins found!");
    }
    else{



      var magnetPayins = "<ul>"
      for (var i = 0; i < thisInvoicePayins.length; i++) {

        var payinAmount = parseInt(thisInvoicePayins[i]["transaction_amount"]);
        payinAmount = payinAmount.toLocaleString();
          
        magnetPayins += "<li class='accordion-item'><a href='#' class='item-link item-content'><div class='item-inner'><div class='item-title'>" + thisInvoicePayins[i]["payin_description"] + "<br><small>" + thisInvoicePayins[i]["transaction_id"] + "</small></div></div></a><div class='accordion-item-content'><ul>  <li><div class='item-content'><div class='item-inner'><div class='item-title'>Amount:</div><div class='item-after text-color-black'>" + theLoadedInvoiceType[invoiceCurrentlyOn]["currency"] + "" + payinAmount + "</div></div></div></li>    <li><div class='item-content'><div class='item-inner'><div class='item-title'>Transaction ID:</div><div class='item-after text-color-black'>" + thisInvoicePayins[i]["transaction_id"] + "</div></div></div></li>    <li><div class='item-content'><div class='item-inner'><div class='item-title'>Description:</div><div class='item-after text-color-black'>" + thisInvoicePayins[i]["payin_description"] + "</div></div></div></li>   <li><div class='item-content'><div class='item-inner'><div class='item-title'>Transaction Date:</div><div class='item-after text-color-black'>" + thisInvoicePayins[i]["transaction_date"].split(" ")[0] + "</div></div></div></li>  </ul></div></li>";

      }

      magnetPayins += "</ul>";
      $$("#load-invoice-payins").html(magnetPayins);

      app.dialog.preloader("Opening invoice payins...", "blue");
       setTimeout(function(){
        app.dialog.close();
        openPayinsPopup.open();
      }, 2000);

    }

  }



function loadAllInvoices(){

   app.request.post('https://abtechnology.com.ng/auditbar/list_invoices.php', 
            {
            "company_serial" : chosenCompany.company_id,
             "from_date" : JSON.parse(window.localStorage.getItem("invoiceDateRange")).from_date,
             "to_date" : JSON.parse(window.localStorage.getItem("invoiceDateRange")).to_date,
             "invoice_status" : "",
             "currency" : window.localStorage.getItem("invoice_currency")           
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
                var invoicePaymentStatus = "";



              for (var i = 0; i < data.length; i++) {

                var grandTotalAmount = parseInt(data[i]["grand_total_amount"]);
                grandTotalAmount = grandTotalAmount.toLocaleString();
                
                switch(data[i]["invoice_status"]){

                  case "unpaid" : invoicePaymentStatus = "<button type='button' class='button button-outline button-small color-orange'>Unpaid</button>"; break;

                  case "paid" : invoicePaymentStatus = "<button type='button' class='button button-outline button-small color-teal col'>Paid</button>"; break;

                  case "partial" : invoicePaymentStatus = "<button type='button' class='button button-outline button-small color-green'>Partial</button>"; break;

                  default : invoicePaymentStatus = "<button type='button' class='button button-outline button-small color-red'>Overdue</button>"; break;

                }
            allInvoicesPlate += "<li onclick=openInvoice('" + i + "','loadedInvoices')><div class='item-content'><div class='item-inner text-color-black'><div class='item-title'>" + data[i]["biller"] + "<br>" + data[i]["invoice_date"].split(" ")[0] + "</div><div class='item-after text-color-black'>" + data[i]["currency"] + "" + grandTotalAmount + "&nbsp;&nbsp;" + invoicePaymentStatus +"</div></div></div></li>";

          }

          allInvoicesPlate += "</ul>";

             $$("#all-invoices-list").html(allInvoicesPlate).removeClass("text-center");
           }
             },
             function(){
                toastMe("Network error. Try again later");
             });

}



function loadPaidInvoices(){

   app.request.post('https://abtechnology.com.ng/auditbar/list_invoices.php', 
            {
            "company_serial" : chosenCompany.company_id,
             "from_date" : JSON.parse(window.localStorage.getItem("invoiceDateRange")).from_date,
             "to_date" : JSON.parse(window.localStorage.getItem("invoiceDateRange")).to_date,
             "invoice_status" : "paid",
             "currency" : window.localStorage.getItem("invoice_currency")            
           },
             function (dataRec) {
              console.log(dataRec);
                data = JSON.parse(dataRec);
                console.log(data);

                if (data[0].count_status == 0) {
                  $$("#all-paid-invoices-list").html("<img src='imgs/assets/box.png' style='margin:0 auto; max-width:120px;'><br><h3>No invoices found</h3>").addClass("text-center");
                }
                else{
                  window.localStorage.setItem("loadedPaidInvoices", dataRec);
                var allInvoicesPlate = "<ul>";
                var invoicePaymentStatus = "<button type='button' class='button button-outline button-small color-teal col'>Paid</button>";



              for (var i = 0; i < data.length; i++) {

                var grandTotalAmount = parseInt(data[i]["grand_total_amount"]);
                grandTotalAmount = grandTotalAmount.toLocaleString();
                
            
            allInvoicesPlate += "<li onclick=openInvoice('" + i + "','loadedPaidInvoices')><div class='item-content'><div class='item-inner text-color-black'><div class='item-title'>" + data[i]["biller"] + "<br>" + data[i]["invoice_date"].split(" ")[0] + "</div><div class='item-after text-color-black'>" + data[i]["currency"] + "" + grandTotalAmount + "&nbsp;&nbsp;" + invoicePaymentStatus +"</div></div></div></li>";

          }

          allInvoicesPlate += "</ul>";

             $$("#all-paid-invoices-list").html(allInvoicesPlate).removeClass("text-center");
           }
             },
             function(){
                toastMe("Network error. Try again later");
             });



}



function loadUnpaidInvoices(){

   app.request.post('https://abtechnology.com.ng/auditbar/list_invoices.php', 
            {
            "company_serial" : chosenCompany.company_id,
             "from_date" : JSON.parse(window.localStorage.getItem("invoiceDateRange")).from_date,
             "to_date" : JSON.parse(window.localStorage.getItem("invoiceDateRange")).to_date,
             "invoice_status" : "unpaid",
             "currency" : window.localStorage.getItem("invoice_currency")            
           },
             function (dataRec) {
              console.log(dataRec);
                data = JSON.parse(dataRec);
                console.log(data);

                if (data[0].count_status == 0) {
                  $$("#all-unpaid-invoices-list").html("<img src='imgs/assets/box.png' style='margin:0 auto; max-width:120px;'><br><h3>No invoices found</h3>").addClass("text-center");
                }
                else{
                  window.localStorage.setItem("loadedUnpaidInvoices", dataRec);
                var allInvoicesPlate = "<ul>";
                var invoicePaymentStatus = "<button type='button' class='button button-outline button-small color-orange col'>Unpaid</button>";



              for (var i = 0; i < data.length; i++) {

                var grandTotalAmount = parseInt(data[i]["grand_total_amount"]);
                grandTotalAmount = grandTotalAmount.toLocaleString();
                
              
            allInvoicesPlate += "<li onclick=openInvoice('" + i + "','loadedUnpaidInvoices')><div class='item-content'><div class='item-inner text-color-black'><div class='item-title'>" + data[i]["biller"] + "<br>" + data[i]["invoice_date"].split(" ")[0] + "</div><div class='item-after text-color-black'>" + data[i]["currency"] + "" + grandTotalAmount + "&nbsp;&nbsp;" + invoicePaymentStatus +"</div></div></div></li>";

          }

          allInvoicesPlate += "</ul>";

             $$("#all-unpaid-invoices-list").html(allInvoicesPlate).removeClass("text-center");
           }
             },
             function(){
                toastMe("Network error. Try again later");
             });

}






function loadOverdueInvoices(){

   app.request.post('https://abtechnology.com.ng/auditbar/list_invoices.php', 
            {
            "company_serial" : chosenCompany.company_id,
             "from_date" : JSON.parse(window.localStorage.getItem("invoiceDateRange")).from_date,
             "to_date" : JSON.parse(window.localStorage.getItem("invoiceDateRange")).to_date,
             "invoice_status" : "overdue",
             "currency" : window.localStorage.getItem("invoice_currency")            
           },
             function (dataRec) {
              console.log(dataRec);
                data = JSON.parse(dataRec);
                console.log(data);

                if (data[0].count_status == 0) {
                  $$("#all-overdue-invoices-list").html("<img src='imgs/assets/box.png' style='margin:0 auto; max-width:120px;'><br><h3>No invoices found</h3>").addClass("text-center");
                }
                else{
                  window.localStorage.setItem("loadedOverdueInvoices", dataRec);
                var allInvoicesPlate = "<ul>";
                var invoicePaymentStatus = "<button type='button' class='button button-outline button-small color-red col'>Overdue</button>";



              for (var i = 0; i < data.length; i++) {

                var grandTotalAmount = parseInt(data[i]["grand_total_amount"]);
                grandTotalAmount = grandTotalAmount.toLocaleString();
                
            allInvoicesPlate += "<li onclick=openInvoice('" + i + "','loadedOverdueInvoices')><div class='item-content'><div class='item-inner text-color-black'><div class='item-title'>" + data[i]["biller"] + "<br>" + data[i]["invoice_date"].split(" ")[0] + "</div><div class='item-after text-color-black'>" + data[i]["currency"] + "" + grandTotalAmount + "&nbsp;&nbsp;" + invoicePaymentStatus +"</div></div></div></li>";

          }

          allInvoicesPlate += "</ul>";

             $$("#all-overdue-invoices-list").html(allInvoicesPlate).removeClass("text-center");
           }
             },
             function(){
                toastMe("Network error. Try again later");
             });


}


















function loadPartialInvoices(){

   app.request.post('https://abtechnology.com.ng/auditbar/list_invoices.php', 
            {
            "company_serial" : chosenCompany.company_id,
             "from_date" : JSON.parse(window.localStorage.getItem("invoiceDateRange")).from_date,
             "to_date" : JSON.parse(window.localStorage.getItem("invoiceDateRange")).to_date,
             "invoice_status" : "partial",
             "currency" : window.localStorage.getItem("invoice_currency")            
           },
             function (dataRec) {
              console.log(dataRec);
                data = JSON.parse(dataRec);
                console.log(data);

                if (data[0].count_status == 0) {
                  $$("#all-partial-invoices-list").html("<img src='imgs/assets/box.png' style='margin:0 auto; max-width:120px;'><br><h3>No invoices found</h3>").addClass("text-center");
                }
                else{
                  window.localStorage.setItem("loadedPartialInvoices", dataRec);
                var allInvoicesPlate = "<ul>";
                var invoicePaymentStatus = "<button type='button' class='button button-outline button-small color-green col'>Partial</button>";



              for (var i = 0; i < data.length; i++) {

                var grandTotalAmount = parseInt(data[i]["grand_total_amount"]);
                grandTotalAmount = grandTotalAmount.toLocaleString();
                
              
            allInvoicesPlate += "<li onclick=openInvoice('" + i + "','loadedPartialInvoices')><div class='item-content'><div class='item-inner text-color-black'><div class='item-title'>" + data[i]["biller"] + "<br>" + data[i]["invoice_date"].split(" ")[0] + "</div><div class='item-after text-color-black'>" + data[i]["currency"] + "" + grandTotalAmount + "&nbsp;&nbsp;" + invoicePaymentStatus +"</div></div></div></li>";

          }

          allInvoicesPlate += "</ul>";

             $$("#all-partial-invoices-list").html(allInvoicesPlate).removeClass("text-center");
           }
             },
             function(){
                toastMe("Network error. Try again later");
             });


}


  $$("#open-invoice-expenses").click(function(){
    openInvoiceExpenses();
  });


   $$("#open-invoice-payins").click(function(){
    openInvoicePayins();
  });





   loadAllInvoices();
   loadPaidInvoices();
   loadUnpaidInvoices();
   loadOverdueInvoices();
   loadPartialInvoices();









   $$("#payin-button").click(function(){

    var loadedInvoiceType = window.localStorage.getItem("invoiceTypeCurrentlyOn");

    loadedInvoice = window.localStorage.getItem(loadedInvoiceType);
    loadedInvoice = JSON.parse(loadedInvoice);
    console.log(loadedInvoice);

    var selectedInvoice = loadedInvoice[window.localStorage.getItem("invoiceCurrentlyOn")];
    var thisInvoiceGrandTotalAmount = selectedInvoice.grand_total_amount;
    

      if ($$("#payin-amount").val().trim() == "" || $$("#payin-description").val().trim() == "" || $$("#payin-date").val().trim() == "") {

          toastMe("Please complete the form!");

      } else{

          $$(this).html("<img src='imgs/assets/loading.gif' style='max-width: 50px;'>").prop("disabled", true);

          app.request.post("https://abtechnology.com.ng/auditbar/invoice_payins.php",
          {
            
            "invoice_id" : selectedInvoice["invoice_sn"],
            "payin_description" : $$("#payin-description").val(),
            "amount" : $$("#payin-amount").val(),
            "payin_date" : $$("#payin-date").val(),
            "this_invoice_grand_total_amount" : thisInvoiceGrandTotalAmount

          },
            function(data){
              dataRec = JSON.parse(data);
              console.log(data); 
              if (dataRec.status == "successful") {

                  toastMe("Payin successful!");
                  addPayinsPopup.close();
                  openPayinsPopup.close();

                  $$("#payin-button").html("Add payment").prop("disabled", false);
                  $$("#add-payin-form").trigger("reset");


              }else{

                toastMe(dataRec.status);
                $$("#payin-button").html("Add payment").prop("disabled", false);

              }         

          }, function(){
              
              $$("#payin-button").html("Add payment").prop("disabled", false);
              toastMe("Network error. Try again later");

          });
      }



    });










   $$("#expense-button").click(function(){

    var loadedInvoiceType = window.localStorage.getItem("invoiceTypeCurrentlyOn");

    loadedInvoice = window.localStorage.getItem(loadedInvoiceType);
    loadedInvoice = JSON.parse(loadedInvoice);
    console.log(loadedInvoice);

    var selectedInvoice = loadedInvoice[window.localStorage.getItem("invoiceCurrentlyOn")];
    $$("#invoice-id").val(selectedInvoice.invoice_sn);
    console.log(selectedInvoice);
    

      if ($$("#expense-amount").val().trim() == "" || $$("#expense-description").val().trim() == "" || $$("#expense-date").val().trim() == "") {

          toastMe("Please complete the form!");

      } else{

          $$("#expense-button").html("<img src='imgs/assets/loading.gif' style='max-width: 50px;'>").prop("disabled", true);
          $("#add-expense-form").ajaxSubmit({
            success : (data) => {
                
                dataRec = JSON.parse(data);
              console.log(data); 
              if (dataRec.status == "successful") {

                  toastMe("Payin successful!");
                  addExpensesPopup.close();
                  openExpensesPopup.close();

                  $$("#expense-button").html("Add payment").prop("disabled", false);
                  $$("#add-expense-form").trigger("reset");


              }else{

                toastMe(dataRec.status);
                $$("#expense-button").html("Add payment").prop("disabled", false);

              }    
              console.log(data);
                  
             },

            error : (jqXHR, error, status) => {
                  
              $$("#expense-button").html("Add payment").prop("disabled", false);
              toastMe("Network error. Try again later");

            }
        });
      }



    });


   var payinCalendarModal = app.calendar.create({
            inputEl: '#payin-date',
            openIn: 'customModal',
            header: true,
            footer: true,
            dateFormat: 'yyyy-mm-dd',
            rangePicker : false,
            direction : 'vertical',
            header: true,
            toolbarCloseText : 'Apply',
            headerPlaceholder : 'Payin date',
            closeByOutsideClick : true,
            
    });


   var expenseCalendarModal = app.calendar.create({
            inputEl: '#expense-date',
            openIn: 'customModal',
            header: true,
            footer: true,
            dateFormat: 'yyyy-mm-dd',
            rangePicker : false,
            direction : 'vertical',
            header: true,
            toolbarCloseText : 'Apply',
            headerPlaceholder : 'Payin date',
            closeByOutsideClick : true,
            
    });



   var picker = app.picker.create({
    inputEl: '#expense-category',
    toolbarCloseText : 'Close',
    cols: [
       {
         textAlign : 'center',
         values: ['rent', 'food', 'transportation', 'vehicle expenses', 'home & office expenses', 'salaries & wages', 'office supplies & expenses', 'professional services', 'client & employee entertainment', 'furniture & equipment', 'independent labour / freelance services', 'employee benefits', 'start up expenses', 'computer software', 'utilities', 'travel', 'taxes', 'commision', 'machinery & equipment rental', 'interest on loan', 'employee education', 'employee child care assistance', 'mortgage interest', 'bank charges', 'insurance', 'tools', 'advertising & marketing', 'cleaning & janitorial services', 'moving expenses', 'intangible expenses', 'others'],
         displayValues: ['Rent', 'Food', 'Transportation', 'Vehicle expenses', 'Home & office expenses', 'Salaries & wages', 'Office supplies & expenses', 'Professional services', 'Client & employee entertainment', 'Furniture & equipment', 'Independent labour / freelance services', 'Employee benefits', 'Start up expenses', 'Computer software', 'Utilities', 'Travel', 'Taxes', 'Commision', 'Machinery & equipment rental', 'Interest on loan', 'Employee education', 'Employee child care assistance', 'Mortgage interest', 'Bank charges', 'Insurance', 'Tools', 'Advertising & marketing', 'Cleaning & janitorial services', 'Moving expenses', 'Intangible expenses', 'Others'],
       }
     ]
  });




});









$$(document).on('page:init', '.page[data-name="enterotp"]', function (e){

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



    var temporaryreg = window.localStorage.getItem("temporaryReg");
    temporaryreg = JSON.parse(temporaryreg);





    $$("#resend-btn").click(function(){

       var welcomeMsg = "<h1>Hi " + temporaryreg.first_name + "!</h1> Thank you for signing up and Welcome to Auditbar. Your verification code is " + window.localStorage.getItem("activation_code");

             

                

      $$("#countdown-btn").show();
      $$("#resend-btn").hide();
      runTimer();
      toastMe("Sending OTP...");
      
      // call on messenger
      messenger(welcomeMsg, "email", temporaryreg.user_email, "", "Welcome to Auditbar");

    });



    $$("#verify-btn").click(function(){

      if($$("#otp-1").val().trim() == "" || $$("#otp-2").val().trim() == "" || $$("#otp-3").val().trim() == "" || $$("#otp-4").val().trim() == ""){

          toastMe("Please enter your otp");
      }
      else{

        toastMe("Verifying code...");
        var userRecoveryInput = $$("#otp-1").val() + $$("#otp-2").val() + $$("#otp-3").val() + $$("#otp-4").val();
        
        if (window.localStorage.getItem("activation_code") == userRecoveryInput) {

            
              
              $$("#verify-btn").text("Verify").prop("disabled", false);
             mainView.router.navigate("/regcompany/");

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
















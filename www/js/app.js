// Declare Global variables
var getLogo, messenger, shift, selectCompany, grabCompanySummary, resetDashboard, resetDateRange, changeCurrency, refreshInvoiceList, invoicePageRefreshList, deleteInvoiceItem, uploadCompanyLogo;


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

                var chosenCompany = {
                  company_id : favouriteCompanyID,
                  company_name : favouriteCompanyName,
                  company_logo : favouriteCompanyLogo
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
                  "company_id" : companyID
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
                    $$("#finish-btn").text("Finish Registration").prop("disabled", false);
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
                  "company_logo" : ""
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


  });











$$(document).on('page:init', '.page[data-name="recovery"]', function (e){
  
    $$("#recovery-btn").click(function(e){

        if ($$("#recovery-email").val().trim() == "") {
            toastMe("Please complete the form!");
        }
        else{

            $$(this).html("Please wait...").prop("disabled", true);
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

            $$(this).html("Please wait...").prop("disabled", true);
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

  var addBusinessPopup = app.popup.create({
    el : ".add-business-popup"
  });

  $$("#create-invoice-btn").click(function(){
    addBusinessPopup.close();
    window.setTimeout(function(){
      mainView.router.navigate("/createinvoice/");
    }, 1500);
  });


 

  var theChosenCompany = window.localStorage.getItem("chosenCompany");
  theChosenCompany = JSON.parse(theChosenCompany);
  var chosen_company_name = theChosenCompany.company_name;
  var chosen_company_logo = theChosenCompany.company_logo;
  var chosen_company_id = theChosenCompany.company_id;

  $$(".company-name").text(chosen_company_name);
  /*var logoLink = "https://nairasurvey.com/auditbar_backend/businesses/" + company_name + "_" + company_id + "/" + company_logo;
  console.log(logoLink);
  $$(".company-logo").prop("src", logoLink);*/
  
  //then load default chosen company summary
  window.setTimeout(function(){
    resetDateRange();
    grabCompanySummary(chosen_company_id);
  }, 1500);


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
          $$(".company-name").text(company_name);
          dashboardPopover.close();

          //update chosen company
          var chosenCompanyDetails = {
            "company_id" : theCompanyID,
            "company_name" : company_name,
            "company_logo" : company_logo,
            "company_email" : company_email
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
            headerPlaceholder : 'Auditbar custom date',
            closeByOutsideClick : false,
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
    app.dialog.alert('Thanks, item removed!');
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

      app.dialog.alert("Please complete the form!");

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

      if ($$("#invoice-name").val().trim() == "" || $$("#invoice-due-date").val().trim() == "" || $$("#biller").val().trim() == "" || $$("#biller-address").val().trim() == "" || $$("#bank-details").val().trim() == "" || $$("#invoice-terms").val().trim() == "" || invoiceList["item_name"].length == 0) {

          app.dialog.alert("Please complete the form!");

      }
      else{

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

      previewInvoicePopup.open();


    }
    });




    $$("#send-invoice-button").click(function(){

      $$(this).html("Sending...").prop("disbled", true);
      

          app.request.post("https://nairasurvey.com/auditbar_backend/create_invoice.php",
          {
            "invoice_name" : $$("#invoice-name").val(),
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
            "invoice_due_date" : $$("#invoice-due-date").val()

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
                $$("#send-invoice-button").html("Send Invoice").prop("disbled", false);
              }

          }, function(){

              toastMe("Network error. Try again later");

          });

});






  }); // end of create invoice page
















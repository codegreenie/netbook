$$(document).on('page:init', '.page[data-name="taxcompliance"]', function (e){


  var permanentReg = window.localStorage.getItem("permanentReg");
  permanentReg = JSON.parse(permanentReg);


  var theChosenCompany = window.localStorage.getItem("chosenCompany");
  theChosenCompany = JSON.parse(theChosenCompany);


  $$("#payment-expiry-date").keyup(function(){
    var countEntry = $$(this).val().length;
    var key = event.keyCode || event.charCode;
    
    if (countEntry == 2 && key != 8 && key != 46) {
      $$("#payment-expiry-date").val($$("#payment-expiry-date").val() + " / ");
    }
  });


  $$("#regchooseplan-play-button").click(function(){
    if ($$("#card-number").val().trim() == "" || $$("#payment-expiry-date").val().trim() == "" || $$("#payment-cvv").val().trim() == "") {

        toastMe("Please complete card details");
    }
    else{

      $$("#regchooseplan-play-button").html("<img src='imgs/assets/loading.gif' style='max-width:50px;'>").prop("disabled", true);
      var splitExpiryDate = $$("#payment-expiry-date").val().split(" / ");
      $$("#expiry-month").val(splitExpiryDate[0]);
      $$("#expiry-year").val(splitExpiryDate[1]);

      
      Paystack.init({
            access_code: window.localStorage.getItem("regChoosePlanAccessCode"),
            form: "auditbar-payment-form"
        }).then(function(returnedObj){

            window.PAYSTACK = returnedObj;
            $$("#auditbar-payment-form").trigger("submit");

        }).catch(function(error){
            // If there was a problem, you may 
            // log to console (while testing)
            console.log("Problem connecting to payments server. Try again later");
            // or report to your backend for debugging (in production)
            window.reportErrorToBackend(error);
        });

    }
  });





  $$("#auditbar-payment-form").submit(function(){

      PAYSTACK.card.charge().then(function(response){

        console.log(response);

        switch(response.status) {
            case 'auth':
                switch(response.data.auth) {
                    case 'pin':
                        paySheet.close();
                        pinSheet.open();
                        break;
                    case 'phone':
                        toastMe("Invalid Card Supplied!");
                        paySheet.close();
                        break;
                    case 'otp':
                        paySheet.close();
                        otpSheet.open();
                        break;
                    case '3DS':
                        toastMe("Invalid Card Supplied!");
                        paySheet.close();
                        break;
                }
                break;
            case 'failed' : 
              toastMe("Payment failed");
              break;
            case 'timeout':
                toastMe("Server Timeout. Try Again");
                $$("#push-payment-btn").html("<i class='icon f7-icons'>lock</i>&nbsp;Pay").prop("disabled", false);
                break;
            case 'success':
                confirmPayment(response.data.reference);
                //paySheet.close();
                //paymentCompletePopup.open();
                break;
              }


              });


    });


    console.log("Welcome to the reg choose plan page");
    
    $$("#goto-dashboard-button").click(function(){
      paymentCompletePopup.close();
      mainView.router.navigate("/dashboard/");
    });

 

    $$("#confirm-pin-button").click(function(){
      if ($$("#card-pin").val().trim() == "" || $$("#card-pin").val().trim().length < 4) {
        toastMe("Enter a valid PIN");
      }
      else{
        $$(this).html("<img src='imgs/assets/loading.gif' style='max-width:50px;'>").prop("disabled", true);
        PAYSTACK.card.charge({
          pin: $$("#card-pin").val()

        }).then(function(response){
          console.log(response);
          switch(response.status) {
            case 'auth':
                switch(response.data.auth) {
                    case 'phone':
                        toastMe("Unsupported Card!");
                        pinSheet.close();
                    case 'otp':
                        pinSheet.close();
                        otpSheet.open();
                        break;
                    case '3DS':
                        toastMe("Unsupported Card!");
                        pinSheet.close();
                }
                break;
            case 'failed':
                toastMe("Incorrect PIN");
                $$("#confirm-pin-button").html("Confirm PIN").prop("disabled", false);
                break;
            case 'timeout':
                toastMe("Timeout. Try Again");
                $$("#confirm-pin-button").html("Confirm PIN").prop("disabled", false);
              break;
            case 'success': toastMe("success");
            //pinSheet.close();
            confirmPayment(response.data.reference);
            //paymentCompletePopup.open(); 
            break;
      }

    });

      }

    });





    $$("#confirm-otp-button").click(function(){
      if ($$("#card-otp").val().trim() == "") {
        toastMe("Enter a valid OTP");
      }
      else{
        $$(this).html("<img src='imgs/assets/loading.gif' style='max-width:50px;'>").prop("disabled", true);
        PAYSTACK.card.charge({
          pin: $$("#card-otp").val()

        }).then(function(response){
          console.log(response);
          switch(response.status) {
            case 'failed':
                toastMe("Incorrect OTP");
                $$("#confirm-otp-button").html("Confirm OTP").prop("disabled", false);
                break;
            case 'timeout':
                toastMe("Timeout. Try Again");
                $$("#confirm-otp-button").html("Confirm OTP").prop("disabled", false);
              break;
            case 'success': toastMe("success");
            //otpSheet.close();
            //paymentCompletePopup.open(); 
            confirmPayment(reference.data.reference);
            break;
      }

    });

  }

});




    var paySheet = app.sheet.create({
        el : '.pay-plan-sheet',
        swipeToClose : true,
        backdrop : true,
        closeByOutsideClick : true,
        closeOnEscape : true
    });

    var pinSheet = app.sheet.create({
        el : '.pin-sheet',
        swipeToClose : true,
        backdrop : true,
        closeByOutsideClick : true,
        closeOnEscape : true
    });


    var otpSheet = app.sheet.create({
        el : '.otp-sheet',
        swipeToClose : true,
        backdrop : true,
        closeByOutsideClick : true,
        closeOnEscape : true
    });

    

    var paymentCompletePopup = app.popup.create({
      el : ".payment-complete-popup"
    });

    


    


      
  

      taxSubscribe = function(subscriptionID){

        

      app.request.post('https://nairasurvey.com/auditbar_backend/tax_compliance_request.php',
              {

               "tax_compliance_id" : subscriptionID,
               "company_id" : theChosenCompany.company_id
              },
               function (data) {
                console.log(data);

                var dataRec = JSON.parse(data);
                if (dataRec.status == "successful" && dataRec.price != 0) {
                  
                  runPayment(data);
                }
                else if(dataRec.price == 0){
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

            app.request.post("https://nairasurvey.com/auditbar_backend/paystack/paystack_init.php",
                        {
                          "buyer_email" : permanentReg.user_email,
                          "amount_2_pay" : pushedData.price * 100,
                          "tnx_reference" : pushedData.transaction_id
                          
                        },
                         function(data){

                          if(typeof JSON.parse(data) != "object"){
                            
                            toastMe("Unable to create transaction. Try again");
                            app.dialog.close();

                          }
                          else{
                          app.dialog.close();
                          console.log(data);
                          var parsedData = JSON.parse(data);
                          var accessCode = parsedData.data.access_code;
                          window.localStorage.setItem("regChoosePlanAccessCode", accessCode);

                          paySheet.open();
                                                  
                      }
                          
                          
                         }, function(){

                            
                            toastMe("Unable to create transaction now. Try again later");
                            $$("#one-k-subscription-button").html("buttonText").prop("disabled", false);
                            
                         });


          }









           function confirmPayment(transactionID){


            app.request.post("https://nairasurvey.com/auditbar_backend/paystack/verify_tax_compliance_payment.php",
                        {
                          
                          "transaction_id" : transactionID                         
                          
                        },
                         function(data){

                        
                          console.log(data);
                         

                            paySheet.close();
                            pinSheet.close();
                            otpSheet.close();
                            paymentCompletePopup.open();

                                                                        
                      
                          
                          
                         }, function(){

                            
                            toastMe("Unable to verify transaction. Try again later");
                            
                            
                         });

          }






  }); // end of tax compliance page



















$$(document).on('page:init', '.page[data-name="addbusiness"]', function (e){

  var addBusinessPopup = app.popup.create({
      el : '.business-added-popup'
   });


    var permanentReg = window.localStorage.getItem("permanentReg");
    permanentReg = JSON.parse(permanentReg);

    


    $$("#user-id").val(permanentReg.user_serial);

$("#add-business-form").submit(function(){

  if ($$("#business-name").val().trim() == "" || $$("#business-email").val().trim() == "" || $$("#business-phone").val().trim() == "") {
            toastMe("Please complete the form!");
        }
        else if($$("#business-phone").val().trim().length < 11){
            toastMe("Please enter a valid phone number");
        } 
        else{

        

    $("#add-business-form").ajaxSubmit({
            
            beforeSend : function(){
                
                $("#add-business-btn").html("<img src='imgs/assets/loading.gif' style='max-width:50px;'>").prop("disabled", true);
            
            },
            success : (data) => {

              console.log(data);
              dataRec = JSON.parse(data);
              if (dataRec.status == "Business added") {
                
               toastMe("Please login to update companies");
               window.setTimeout(function(){
                mainView.router.navigate("/login/");
               }, 4000);

              }
              else{

                toastMe(dataRec.status);
                $("#add-business-btn").html("Add business").prop("disbled", false);

              }     
             },

            error : (jqXHR, error, status) => {

             $("#add-business-btn").html("Add business").prop("disbled", false);
              toastMe("Network error. Try again later");
            }
        });

  }



});



});








$$(document).on('page:init', '.page[data-name="updateprofile"]', function (e){

  var permanentReg = window.localStorage.getItem("permanentReg");
    permanentReg = JSON.parse(permanentReg);

    $$("#update-first-name").val(permanentReg.first_name);
    $$("#update-last-name").val(permanentReg.last_name);
    $$("#update-phone").val(permanentReg.phone_number);

    var updateProfilePopup = app.popup.create({
      el : '.update-profile-popup'
   });



    $$("#update-profile-button").click(function(){

  if ($$("#update-first-name").val().trim() == "" || $$("#update-last-name").val().trim() == "" || $$("#update-phone").val().trim() == "") {
            
            toastMe("Please complete the form!");
                    }
        else if($$("#update-phone").val().trim().length < 11){

            toastMe("Please enter a valid phone number");

        } 
        else{

          $$(this).html("<img src='imgs/assets/loading.gif' style='max-width:50px;'>").prop("disabled", true);

            app.request.post("https://nairasurvey.com/auditbar_backend/user_profile_update.php",
                        {
                          
                          "user_serial" : permanentReg.user_serial,
                          "user_edit_first_name" : $$("#update-first-name").val(),
                          "user_edit_last_name" : $$("#update-last-name").val(), 
                          "user_edit_phone_number" : $$("#update-phone").val()                         
                          
                        },
                         function(data){

                          console.log(data);
                          data = JSON.parse(data);
                          if (data.status == "update successful") {

                            updateProfilePopup.open();
                            
                          }
                          else{

                            toastMe(data.status);
                            $$("#update-profile-button").html("Update profile").prop("disabled", false);

                          }
                    
                         }, function(){

                            
                            toastMe("Network error. Try again later");
                            $$("#update-profile-button").html("Update profile").prop("disabled", false);
                            
                         });
        }

      });


    $$("#profile-updated-button").click(function(){
      updateProfilePopup.close();
      toastMe("Please re-login to update your profile");
      mainView.router.navigate("/login/");
    });




  });















$$(document).on('page:init', '.page[data-name="updateemail"]', function (e){

  var permanentReg = window.localStorage.getItem("permanentReg");
    permanentReg = JSON.parse(permanentReg);

    
    $$("#current-email-span").text(permanentReg.user_email);


    $$("#update-email-button").click(function(){

  if ($$("#update-email").val().trim() == "") {
            
            toastMe("Please complete the form!");
    }
    else if ($$("#update-email").val().trim() == permanentReg.user_email) {

        toastMe("You cannot update to your current email");

    }
        else{

            $$(this).html("<img src='imgs/assets/loading.gif' style='max-width:50px;'>").prop("disabled", true)
              
          app.request.post('https://nairasurvey.com/auditbar_backend/generate_code.php', 
            
             function (data) {

              var data = JSON.parse(data);

              var emailUpdateProps = {
                "verification_code" : data.status,
                "email_2_update" : $$("#update-email").val()
              }

                window.localStorage.setItem("email_update_props", JSON.stringify(emailUpdateProps));
                console.log(data);
                var emailChangeMsg = "<h2>Verify your new email on Auditbar!</h2> Hi, you requested for an email change on Auditbar. Your verification code is " + data.status;

              // call on messenger
              messenger(emailChangeMsg, "email", $$("#update-email").val(), "", "Auditbar Email update");
              $$("update-email-button").html("Update email").prop("disabled", false);
              mainView.router.navigate("/emailupdateotp/");

             },
             function(){

              console.log("We got dismissed!");
              $$("update-email-button").html("Update email").prop("disabled", false);

             });
              
        
        }

      });


  




  });














$$(document).on('page:init', '.page[data-name="emailupdateotp"]', function (e){


  var permanentReg = window.localStorage.getItem("permanentReg");
  permanentReg = JSON.parse(permanentReg);

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



    var emailUpdateProps = window.localStorage.getItem("email_update_props");
    emailUpdateProps = JSON.parse(emailUpdateProps);





    $$("#resend-btn").click(function(){

       var emailChangeMsg = "<h2>Verify your new email on Auditbar!</h2> Hi, you requested for an email change on Auditbar. Your verification code is " + emailUpdateProps.verification_code;

              // call on messenger
              messenger(emailChangeMsg, "email", emailUpdateProps.email_2_update , "", "Auditbar Email update");

             

                

      $$("#countdown-btn").show();
      $$("#resend-btn").hide();
      runTimer();
      toastMe("Sending OTP...");
      
      
      

    });



    $$("#verify-btn").click(function(){

      if($$("#otp-1").val().trim() == "" || $$("#otp-2").val().trim() == "" || $$("#otp-3").val().trim() == "" || $$("#otp-4").val().trim() == ""){

          toastMe("Please enter your otp");
      }
      else{

        toastMe("Verifying code...");
        var userRecoveryInput = $$("#otp-1").val() + $$("#otp-2").val() + $$("#otp-3").val() + $$("#otp-4").val();
        
        if (emailUpdateProps.verification_code == userRecoveryInput) {

              app.request.post("https://nairasurvey.com/auditbar_backend/update_email.php",
                        {
                          
                          "user_serial" : permanentReg.user_serial,
                          "update_email" : emailUpdateProps.email_2_update 
                        },
                         function(data){

                          console.log(data);
                          data = JSON.parse(data);
                          if (data.status == "update successful") {

                            $$("#verify-btn").text("Verify").prop("disabled", false);
                             toastMe("Email changed! Re-login!");
                             mainView.router.navigate("/login/");
                            
                          }
                          else{

                            toastMe(data.status);
                            $$("#verify-btn").html("Verify").prop("disabled", false);

                          }
                    
                         }, function(){

                            
                            toastMe("Network error. Try again later");
                            $$("#verify-btn").text("Verify").prop("disabled", false);
                            
                         });
              
              

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



















$$(document).on('page:init', '.page[data-name="updatepassword"]', function (e){

    var permanentReg = window.localStorage.getItem("permanentReg");
    permanentReg = JSON.parse(permanentReg);


    var passwordChangePopup = app.popup.create({
      el : '.password-change-popup'
   });


     $$("#update-password-button").click(function(e){

        if ($$("#current-password").val().trim() == "" || $$("#new-password").val().trim() == "" || $$("#confirm-new-password").val().trim() == "") {
            
            toastMe("Please complete the form!");
        }
        else if($$("#new-password").val() != $$("#confirm-new-password").val()){

          toastMe("Passwords do not match!");
        }
        else{

            $$(this).html("<img src='imgs/assets/loading.gif' style='max-width:50px;'>").prop("disabled", true);
             app.request.post('https://nairasurvey.com/auditbar_backend/change_password.php', 
            {
            "user_serial_no" : permanentReg.user_serial,
            "current_password" : $$("#current-password").val(),
             "new_password" : $$("#new-password").val()
           },
             function (data) {

              console.log(data);

              dataCheck = JSON.parse(data);
              console.log(dataCheck);

              if (dataCheck.status == "password change successful") {

                passwordChangePopup.open();
                $$("#update-password-button").text("Update password").prop("disabled", false);

                $$("#password-updated-button").click(function(){
                  passwordChangePopup.close();
                  mainView.router.navigate("/login/");
                });
                 

              }
              else{

                  toastMe(dataCheck.status);
                  $$("#update-password-button").text("Update password").prop("disabled", false);
              }

             },
             function(){

                toastMe("Network error. Try Later");
                $$("#update-password-button").text("Update password").prop("disabled", false);

             });

        }


      });

});

$$(document).on('page:init', '.page[data-name="taxcompliance"]', function (e){


  var permanentReg = window.localStorage.getItem("permanentReg");
  permanentReg = JSON.parse(permanentReg);


  var theChosenCompany = window.localStorage.getItem("chosenCompany");
  theChosenCompany = JSON.parse(theChosenCompany);





    console.log("Welcome to the reg choose plan page");
    
    $$("#goto-dashboard-button").click(function(){
      paymentCompletePopup.close();
      mainView.router.navigate("/dashboard/");
    });

 







      
  

      taxSubscribe = function(subscriptionID){

        app.dialog.preloader("Please wait...");

      app.request.post('https://abtechnology.com.ng/auditbar/tax_compliance_request.php',
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

            app.request.post("https://abtechnology.com.ng/auditbar/paystack/paystack_init.php",
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
                          app.dialog.preloader("Awaiting payment...");
                          console.log(data);
                          var parsedData = JSON.parse(data);
                          var authUrl = parsedData.data.authorization_url;
                          window.open(authUrl, "_system");

                                                  
                      }
                          
                          
                         }, function(){

                            
                            toastMe("Unable to create transaction now. Try again later");
                            $$("#one-k-subscription-button").html("buttonText").prop("disabled", false);
                            
                         });


          }









           function confirmPayment(transactionID){


            app.request.post("https://abtechnology.com.ng/auditbar/paystack/verify_tax_compliance_payment.php",
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
                $("#add-business-btn").html("Add business").prop("disabled", false);

              }     
             },

            error : (jqXHR, error, status) => {

             $("#add-business-btn").html("Add business").prop("disabled", false);
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

            app.request.post("https://abtechnology.com.ng/auditbar/user_profile_update.php",
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
              
          app.request.post('https://abtechnology.com.ng/auditbar/generate_code.php', 
            
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

              app.request.post("https://abtechnology.com.ng/auditbar/update_email.php",
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
                             window.localStorage.removeItem("permanentReg");
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
             app.request.post('https://abtechnology.com.ng/auditbar/change_password.php', 
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










$$(document).on('page:init', '.page[data-name="share"]', function (e){

  var permanentReg = window.localStorage.getItem("permanentReg");
  permanentReg = JSON.parse(permanentReg);

  $$("#enter-code-block").hide();

  //quickly check if i was already referred
  app.request.post('https://abtechnology.com.ng/auditbar/check_ref.php', 
            {
            "my_id" : permanentReg.user_serial,
           },
             function (data) {

              console.log(data);

              dataCheck = JSON.parse(data);
              console.log(dataCheck);

              if (dataCheck.status == "already ref") {
                

                $$("#ref-done-block").show();
                $$("#enter-code-block").hide();

                

              }
              else{

                $$("#ref-done-block").hide();
                $$("#enter-code-block").show();

              }


             },
             function(){

                toastMe("Network error. Try Later");
                $$("#validate-referral-button").text("Validate").prop("disabled", false);

             });











  $$("#referral-code-span").text(window.localStorage.getItem("user_referral_code"));

      $$("#share-auditbar-button").click(function(){
        shareAuditbar();
      });

      $$("#validate-referral-button").click(function(){
        if ($$("#referral-code-input").val().trim() == "") {
          toastMe("Please enter a referral code!");
        }
        else{

          $$(this).html("<img src='imgs/assets/loading.gif' style='max-width:50px;'>").prop("disabled", true);
          app.request.post('https://abtechnology.com.ng/auditbar/push_referrer.php', 
            {
            "my_id" : permanentReg.user_serial,
            "referral_code" : $$("#referral-code-input").val()
           },
             function (data) {

              console.log(data);

              dataCheck = JSON.parse(data);
              console.log(dataCheck);

              if (dataCheck.status != "successful") {
                

                toastMe(dataCheck.status);
                $$("#validate-referral-button").text("Validate").prop("disabled", false);
                mainView.router.refreshPage();
                

              }
              else{

                toastMe("successful!");
                $$("#validate-referral-button").text("Validate").prop("disabled", false);

              }


             },
             function(){

                toastMe("Network error. Try Later");
                $$("#validate-referral-button").text("Validate").prop("disabled", false);

             });

        }
      });

  });
















$$(document).on('page:init', '.page[data-name="mybusinesses"]', function (e){

    //toastMe("Swipe left to delete a customer");

var permanentReg = window.localStorage.getItem("permanentReg");
permanentReg = JSON.parse(permanentReg);




              var companyListJoin = "";


              for (var i = 0; i < permanentReg["companys"].length; i++) {

                var companySN = permanentReg["companys"][i]["company_id"];
                var companyName = permanentReg["companys"][i]["company_name"];
                var companyEmail = permanentReg["companys"][i]["company_email"];
                var companyPhone = permanentReg["companys"][i]["company_phone"];
                var companyAddress = permanentReg["companys"][i]["company_address"];
                var companyDescription = permanentReg["companys"][i]["company_description"];

                

               companyListJoin += "<li><a class='item-link item-content' href='#' onclick=editCompany(" + companySN + ")><div class='item-media'><i class='icon f7-icons'>business</i></div><div class='item-inner'><div class='item-title'>" + companyName + "</div></div></a></li>";
               $$("#all-companies-list").html(companyListJoin).removeClass("text-center");

             }









    editCompany = function(companySN){

     app.dialog.preloader("Editing business...", "blue");

      

       for (var i = 0; i < permanentReg["companys"].length; i++) {

        

          if(permanentReg["companys"][i]['company_id'] == companySN){

              var editCompanySN = permanentReg["companys"][i]['company_id'];
              var editCompanyName = permanentReg["companys"][i]['company_name'];
              var editCompanyEmail = permanentReg["companys"][i]['company_email'];
              var editCompanyPhone = permanentReg["companys"][i]['company_phone'];
              var editCompanyAddress = permanentReg["companys"][i]['company_address'];
              var editCompanyDescription = permanentReg["companys"][i]['company_description'];
              var editCompanyLogo = permanentReg["companys"][i]['company_logo'];

              window.localStorage.setItem("editCompany", JSON.stringify({
                "company_sn" : editCompanySN,
                "company_name" : editCompanyName,
                "company_email" : editCompanyEmail,
                "company_phone" : editCompanyPhone,
                "company_address" : editCompanyAddress,
                "company_description" : editCompanyDescription,
                "company_logo" : editCompanyLogo
              }));
              setTimeout(function(){
                mainView.router.navigate("/editbusiness/");
                app.dialog.close();
              }, 2500);
              break;
          }

       }

    }

});











$$(document).on('page:init', '.page[data-name="editbusiness"]', function (e){


  var updatedBusinessPopup = app.popup.create({
      el : '.business-updated-popup'
   });


    var companyToEdit = window.localStorage.getItem("editCompany");
    companyToEdit = JSON.parse(companyToEdit);

    $$("#business-name-edit").text(companyToEdit.company_name);
    $$("#image-update-edit").prop("src", companyToEdit.company_logo);
    $$("#update-business-name").val(companyToEdit.company_name);
    $$("#update-business-email").val(companyToEdit.company_email);
    $$("#update-business-phone").val(companyToEdit.company_phone);
    $$("#update-business-address").val(companyToEdit.company_address);
    $$("#update-business-description").val(companyToEdit.company_description);


    $$("#business-id").val(companyToEdit.company_sn);

$("#update-business-form").submit(function(){



    $("#update-business-form").ajaxSubmit({
            
            beforeSend : function(){
                
                $("#update-business-btn").html("<img src='imgs/assets/loading.gif' style='max-width:50px;'>").prop("disabled", true);
            
            },
            success : (data) => {

              console.log(data);

              var data = JSON.parse(data);
              if (data.status == "Business updated") {

                updatedBusinessPopup.open();

              }
              else{

                toastMe(dataRec.status);
                $("#update-business-btn").html("Update Business").prop("disabled", false);

              }

            
                  
             },

            error : (jqXHR, error, status) => {

            toastMe("Network Error. Try again later");
            $("#update-business-btn").html("Update Business").prop("disabled", false);

            }
        });



});








  $$("#business-updated-button").click(function(){
    updatedBusinessPopup.close();
    window.localStorage.removeItem("permanentReg");
    mainView.router.navigate("/login/");
    
  });




  });
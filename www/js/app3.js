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
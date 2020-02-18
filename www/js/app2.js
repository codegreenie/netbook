$$(document).on('page:init', '.page[data-name="contacts"]', function (e){

	toastMe("Swipe left to delete a customer");

var permanentReg = window.localStorage.getItem("permanentReg");
permanentReg = JSON.parse(permanentReg);


    app.request.post("https://nairasurvey.com/auditbar_backend/find_contact.php",
          {
            
            "my_id" : permanentReg.user_serial

          },
            function(data){
              window.localStorage.setItem("myContacts", data);

              data = JSON.parse(data); 
              console.log(data);
              if (data[0].count_status == 0) {

              		$$("#all-contacts-list").html("<img src='imgs/assets/box.png' style='margin:0 auto; max-width:120px;'><br><h3>No contacts found</h3>").addClass("text-center");
              		 
              }
              else{

              var contactListJoin = "";

              for (var i = 0; i < data.length; i++) {

                var contactSN = data[i]["contact_sn"];
                var contactName = data[i]["contact_name"];
                var contactEmail = data[i]["contact_email"];
                var contactPhone = data[i]["contact_phone"];
                var contactAddress = data[i]["contact_address"];

                

               contactListJoin += "<li class='swipeout'><a class='item-link item-content swipeout-content' href='#' onclick=editChosenContact(" + contactSN + ")><div class='item-media'><i class='icon f7-icons'>person_round</i></div><div class='item-inner'><div class='item-title'>" + contactName + "</div></div></a><div class='swipeout-actions-right'><a class='swipeout-delete' href='#' onclick=deleteChosenContact(" + contactSN + ")>Delete</a></div></li>";
               $$("#all-contacts-list").html(contactListJoin).removeClass("text-center");

              }

          }
              

          }, function(){

              $$("#add-contact-button").html("Add contact").prop("disbled", false);
              toastMe("Network error. Try again later");

          });






    deleteChosenContact = function(contactSN){

      app.dialog.preloader("Deleting contact...");

	     var allContacts = window.localStorage.getItem("myContacts");
	     allContacts = JSON.parse(allContacts);

	     for(p in allContacts){

	        if(allContacts[p]['contact_sn'] == contactSN){

              app.request.post("https://nairasurvey.com/auditbar_backend/delete_contact.php",
                  {
                    
                    "my_id" : permanentReg.user_serial,
                    "contact_sn" :  contactSN

                  },
                    function(data){
                      
                      var data = JSON.parse(data);
                      if (data.status == "Contact deleted") {
                        
                        toastMe(data.status);
                        console.log(data);
                        app.dialog.close();
                      
                      }
                      else{

                        toastMe(data.status);
                        app.dialog.close();

                      }


                      
                  }, function(){
                      
                      toastMe("Network error. Try again later");
                      app.dialog.close();

                  });
	            
	            break;
	        }

	     }

    }





     editChosenContact = function(contactSN){

     	app.dialog.preloader("Editing contact...");

	     var allContacts = window.localStorage.getItem("myContacts");
	     allContacts = JSON.parse(allContacts);

	     for(p in allContacts){

	        if(allContacts[p]['contact_sn'] == contactSN){

	            var chosenContactName = allContacts[p]['contact_name'];
	            var chosenContactEmail = allContacts[p]['contact_email'];
	            var chosenContactPhone = allContacts[p]['contact_phone'];
	            var chosenContactAddress = allContacts[p]['contact_address'];

	            window.localStorage.setItem("chosenContactEdit", JSON.stringify({
	              "contact_sn" : contactSN,
	              "contact_name" : chosenContactName,
	              "contact_email" : chosenContactEmail,
	              "contact_phone" : chosenContactPhone,
	              "contact_address" : chosenContactAddress
	            }));
	            setTimeout(function(){
	            	mainView.router.navigate("/editcontact/");
	            	app.dialog.close();
	            }, 2500);
	            break;
	        }

	     }

    }






});














$$(document).on('page:init', '.page[data-name="editcontact"]', function (e){


	var permanentReg = window.localStorage.getItem("permanentReg");
	permanentReg = JSON.parse(permanentReg);

    var chosenContactEdit = window.localStorage.getItem("chosenContactEdit");
    chosenContactEdit = JSON.parse(chosenContactEdit);

  
    var chosenContactEditName = chosenContactEdit.contact_name;
    var chosenContactEditEmail = chosenContactEdit.contact_email;
    var chosenContactEditPhone = chosenContactEdit.contact_phone;
    var chosenContactEditAddress = chosenContactEdit.contact_address;

    $$("#edit-contact-name").val(chosenContactEditName);
    $$("#edit-contact-email").val(chosenContactEditEmail);
    $$("#edit-contact-phone").val(chosenContactEditPhone);
    $$("#edit-contact-address").val(chosenContactEditAddress);


     





     $$("#update-contact-button").click(function(){

      if ($$("#edit-contact-name").val().trim() == "" || $$("#edit-contact-email").val().trim() == "" || $$("#edit-contact-phone").val().trim() == "" || $$("#edit-contact-address").val().trim() == "") {

          toastMe("Please complete the form!");

      } else{

          $$(this).html("<img src='imgs/assets/loading.gif' style='max-width: 50px;'>").prop("disbled", true);

          app.request.post("https://nairasurvey.com/auditbar_backend/update_contact.php",
          {
            
            "edit_contact_name" : $$("#edit-contact-name").val(),
            "edit_contact_email" : $$("#edit-contact-email").val(),
            "edit_contact_phone" : $$("#edit-contact-phone").val(),
            "edit_contact_address" : $$("#edit-contact-address").val(),
            "my_id" : permanentReg.user_serial,
            "edit_contact_sn" :  chosenContactEdit.contact_sn

          },
            function(data){
              
              console.log(data);
              dataRec = JSON.parse(data);
              if (dataRec.status == "Contact updated") {
                
                toastMe(dataRec.status);
                mainView.router.navigate("/contacts/");
                $$("#update-contact-button").html("Update contact").prop("disbled", false);

              }
              else{

                toastMe(dataRec.status);
                $$("#update-contact-button").html("Update contact").prop("disbled", false);

              }
              

          }, function(){
              $$("#update-contact-button").html("Update contact").prop("disbled", false);
              toastMe("Network error. Try again later");

          });
      }

    });



});











$$(document).on('page:init', '.page[data-name="employees"]', function (e){


app.dialog.preloader("Loading employees...");

var permanentReg = window.localStorage.getItem("permanentReg");
permanentReg = JSON.parse(permanentReg);


    app.request.post("https://nairasurvey.com/auditbar_backend/list_employees.php",
          {
            
            "my_id" : permanentReg.user_serial

          },
            function(data){

              window.localStorage.setItem("myEmployees", data);

              console.log(JSON.parse(data));

              data = JSON.parse(data);


              magnetEmployees = "<ul>";

              for (var i = 0; i < data.length; i++) {
              
              magnetEmployees += "<li class='accordion-item'><a href='#' class='item-link item-content'><div class='item-inner'><div class='item-title'>" + data[i]["first_name"] + " " + data[i]["last_name"] + "</div></div></a><div class='accordion-item-content'><ul>  <li><div class='item-content'><div class='item-inner'><div class='item-title'>Company:</div><div class='item-after'>" + data[i]["company"] + "</div></div></div></li>     <li><div class='item-content'><div class='item-inner'><div class='item-title'>Email:</div><div class='item-after'>" + data[i]["user_email"] + "</div></div></div></li>   <li><div class='item-content'><div class='item-inner'><div class='item-title'><button class='button button-fill color-red' onclick=removeEmployee(" + data[i]['user_serial'] + ")>Revoke Access</button></div><div class='item-after'>" + data[i]["access_type"] + "</div></div></div></li>  </ul></div></li>";

              }
              magnetEmployees += "</ul>";
              $$("#load-all-employees").html(magnetEmployees);
              app.dialog.close();
              

          }, function(){

              app.dialog.close();
              toastMe("Network error. Try again later");

          });








      removeEmployee = function(employeeSN){

      app.dialog.preloader("Removing access...");

       var allEmployees = window.localStorage.getItem("myEmployees");
       allEmployees = JSON.parse(allEmployees);

       for(p in allEmployees){

          if(allEmployees[p]['user_serial'] == employeeSN){

              app.request.post("https://nairasurvey.com/auditbar_backend/remove_employee.php",
                  {
                    
                    "my_id" : permanentReg.user_serial,
                    "employee_sn" :  employeeSN,
                    "the_company_sn" : allEmployees[p]['company_sn']

                  },
                    function(data){

                      console.log(data);
                      
                      var data = JSON.parse(data);
                      if (data.status == "Access revoked") {
                        
                        toastMe(data.status);
                        console.log(data);
                        app.dialog.close();
                        mainView.router.refreshPage();
                      
                      }
                      else{

                        toastMe(data.status);
                        app.dialog.close();

                      }

                      
                      
                  }, function(){
                      
                      toastMe("Network error. Try again later");
                      app.dialog.close();

                  });
              
              break;
          }

       }

    }




});












$$(document).on('page:init', '.page[data-name="addemployee"]', function (e){


  var permanentReg = window.localStorage.getItem("permanentReg");
  permanentReg = JSON.parse(permanentReg);


  //Load up my companies
  app.dialog.preloader("Loading companies...");


  var myCompanies = permanentReg.companys;
  for (var i = 0; i < myCompanies.length; i++) {

    var myCompanyID = myCompanies[i]["company_id"];
    var myCompanyName = myCompanies[i]["company_name"];

    $$("#my-company-list").append("<li onclick = setCompany(" + myCompanyID + ")><a class='list-button item-link' href='#'><span style='font-weight: bold; font-size: 18px; margin-left:5px;'>" + myCompanyName + "</span></a></li>");
  }

  app.dialog.close();


  var employeeDesignationPopover = app.popover.create({
      el : '.popover-employee-designation',
      targetEl : "#employee-designation"
  });

  var selectedCompanyPopover = app.popover.create({
      el : '.popover-selected-company',
      targetEl : "#selected-company"
  });


  var employeeAddedPopup = app.popup.create({
      el : '.employee-added-popup'
  });


  $$("#employee-designation").click(function(){
    employeeDesignationPopover.open();
  });


  $$("#selected-company").click(function(){
    selectedCompanyPopover.open();
  });


  setDesignation = function(theDesignation){
    $$("#employee-designation").val(theDesignation).focus();
    employeeDesignationPopover.close();
  }

  setCompany = function(companyID){

    for (var i = 0; i < myCompanies.length; i++){

      if (myCompanies[i]["company_id"] == companyID) {

        
        $$("#selected-company").val(myCompanies[i]["company_name"]);
        $$("#selected-company-id").val(companyID);
        selectedCompanyPopover.close();

      }

    }

    
  }







  $$("#add-employee-button").click(function(){

      if ($$("#employee-email").val().trim() == "" || $$("#selected-company").val().trim() == "" || $$("#employee-designation").val().trim() == "") {

          toastMe("Please complete the form!");

      } else{

          $$(this).html("<img src='imgs/assets/loading.gif' style='max-width: 50px;'>").prop("disbled", true);

          app.request.post("https://nairasurvey.com/auditbar_backend/add_employee.php",
          {
            
            
            "employee_email" : $$("#employee-email").val(),
            "company_id" : $$("#selected-company-id").val(),
            "employee_designation" : $$("#employee-designation").val(),
            "my_id" : permanentReg.user_serial

          },
            function(data){
              
              console.log(data);
              dataRec = JSON.parse(data);
              if (dataRec.status == "Employee added") {
                
                toastMe(dataRec.status);
                employeeAddedPopup.open();

              }
              else{

                toastMe(dataRec.status);
                $$("#add-employee-button").html("Add employee").prop("disbled", false);

              } 

          }, function(){
              $$("#add-employee-button").html("Add employee").prop("disbled", false);
              toastMe("Network error. Try again later");

          });
      }

    });


  $$("#employee-added-button").click(function(){
      employeeAddedPopup.close();
      mainView.router.navigate("/employees/");
      toastMe("baba you are too good!");
  });



});














$$(document).on('page:init', '.page[data-name="chooseplan"]', function (e){


  var permanentReg = window.localStorage.getItem("permanentReg");
  permanentReg = JSON.parse(permanentReg);

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

    


    app.dialog.preloader("Fetching prices...");


      
  

      function subscribe(subscriptionID){

      app.request.post('https://nairasurvey.com/auditbar_backend/init_transaction.php',
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

            app.request.post("https://nairasurvey.com/auditbar_backend/paystack/paystack_init.php",
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




          //fetch prices and add them to button
          app.request.post('https://nairasurvey.com/auditbar_backend/fetch_prices.php',
              
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







           function confirmPayment(transactionID){


            app.request.post("https://nairasurvey.com/auditbar_backend/paystack/verify_payment.php",
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






  }); // end of regchooseplan page





















$$(document).on('page:init', '.page[data-name="accountstatement"]', function (e){


  var permanentReg = window.localStorage.getItem("permanentReg");
  permanentReg = JSON.parse(permanentReg);


  var theChosenCompany = window.localStorage.getItem("chosenCompany");
  theChosenCompany = JSON.parse(theChosenCompany);

  var requestSuccesful = app.popup.create({
      el : ".request-successful-popup"
    });


    if (window.localStorage.getItem("chosenContact")) {

      var chosenContact = window.localStorage.getItem("chosenContact");
      chosenContact = JSON.parse(chosenContact);

      var chosenContactSN = chosenContact.contact_sn;
      var chosenContactName = chosenContact.contact_name;
      var chosenContactEmail = chosenContact.contact_email;
      var chosenContactPhone = chosenContact.contact_phone;
      var chosenContactAddress = chosenContact.contact_address;

      $$("#selected-contact").val(chosenContactName);
      $$("#customer-id").val(chosenContactSN);

      


    }











  var requestFromDate, requestToDate;
  

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

                
                
                  requestFromDate = mergeFromDate;
                  requestToDate=  mergeEndDate;
                
                
              }
            }
          });







 $$("#my-account-statement-request-button").click(function(){

      if ($$("#my-account-statement-request-date-range").val().trim() == "") {

          toastMe("Please complete the form!");

      } else{

          $$(this).html("<img src='imgs/assets/loading.gif' style='max-width: 50px;'>").prop("disbled", true);

          app.request.post("https://nairasurvey.com/auditbar_backend/account_statement_request.php",
          {
            
            
            "user_id" : permanentReg.user_serial,
            "company_id" : theChosenCompany.company_id,
            "from_date" : requestFromDate,
            "to_date" : requestToDate

          },
            function(data){
              
              console.log(data);
              dataRec = JSON.parse(data);
              if (dataRec.status == "successful") {
                
                toastMe(dataRec.status);
                $$("#my-account-statement-request-button").html("Request Statement").prop("disabled", false);
                requestSuccesful.open();
                $$("#my-account-statement-request-date-range").val("");

              }
              else{

                toastMe(dataRec.status);
                $$("#my-account-statement-request-button").html("Request Statement").prop("disabled", false);

              } 

          }, function(){
              $$("#my-account-statement-request-button").html("Request Statement").prop("disabled", false);
              toastMe("Network error. Try again later");

          });
      }

    });



  $$("#request-successful-button").click(function(){
    requestSuccesful.close();
  });



  $$("#selected-contact").click(function(){

              mainView.router.navigate("/contactsearch/");

          });












   $$("#customer-account-statement-request-button").click(function(){

      if ($$("#customer-account-statement-request-date-range").val().trim() == "") {

          toastMe("Please complete the form!");

      } else{

          $$(this).html("<img src='imgs/assets/loading.gif' style='max-width: 50px;'>").prop("disbled", true);

          app.request.post("https://nairasurvey.com/auditbar_backend/customer_account_statement_request.php",
          {
            
            "customer_id" : $$("#customer-id").val(),
            "user_id" : permanentReg.user_serial,
            "from_date" : requestFromDate,
            "to_date" : requestToDate

          },
            function(data){
              
              console.log(data);
              dataRec = JSON.parse(data);
              if (dataRec.status == "successful") {
                
                toastMe(dataRec.status);
                $$("#customer-account-statement-request-button").html("Request Statement").prop("disabled", false);
                requestSuccesful.open();
                $$("#customer-account-statement-request-date-range").val("");

              }
              else{

                toastMe(dataRec.status);
                $$("#customer-account-statement-request-button").html("Request Statement").prop("disabled", false);

              } 

          }, function(){
              $$("#customer-account-statement-request-button").html("Request Statement").prop("disabled", false);
              toastMe("Network error. Try again later");

          });
      }

    });


});
$$(document).on('page:init', '.page[data-name="contacts"]', function (e){

	//toastMe("Swipe left to delete a customer");

var permanentReg = window.localStorage.getItem("permanentReg");
permanentReg = JSON.parse(permanentReg);


    app.request.post("https://abtechnology.com.ng/auditbar/find_contact.php",
          {
            
            "my_id" : permanentReg.user_serial

          },
            function(data){
              window.localStorage.setItem("myContacts", data);

              console.log(data);

              data = JSON.parse(data); 
              console.log(data);
              if (data.count_status == 0) {

              		$$("#all-contacts-list").html("<img src='imgs/assets/box.png' style='margin:0 auto; max-width:120px;'><br><h3>No contacts found</h3>").addClass("text-center");
              		 
              }
              else{


              var contactListJoin = "";

              for (var i = 0; i < data["found_contacts"].length; i++) {

                var contactSN = data["found_contacts"][i]["contact_sn"];
                var contactName = data["found_contacts"][i]["contact_name"];
                var contactEmail = data["found_contacts"][i]["contact_email"];
                var contactPhone = data["found_contacts"][i]["contact_phone"];
                var contactAddress = data["found_contacts"][i]["contact_address"];

                

               contactListJoin += "<li class='swipeout'><a class='item-link item-content swipeout-content' href='#' onclick=editChosenContact(" + contactSN + ")><div class='item-media'><i class='icon f7-icons'>person_round</i></div><div class='item-inner'><div class='item-title'>" + contactName + "</div></div></a><div class='swipeout-actions-right'><a class='swipeout-delete' href='#' onclick=deleteChosenContact(" + contactSN + ")>Delete</a></div></li>";
               $$("#all-contacts-list").html(contactListJoin).removeClass("text-center");

              }

          }
              

          }, function(){

              $$("#add-contact-button").html("Add contact").prop("disabled", false);
              toastMe("Network error. Try again later");

          });






    deleteChosenContact = function(contactSN){

      app.dialog.preloader("Deleting contact...", "blue");

	     var allContacts = window.localStorage.getItem("myContacts");
	     allContacts = JSON.parse(allContacts);

	     for (var i = 0; i < allContacts['found_contacts'].length; i++) {

	        if(allContacts['found_contacts'][i]['contact_sn'] == contactSN){

              app.request.post("https://abtechnology.com.ng/auditbar/delete_contact.php",
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

     app.dialog.preloader("Editing contact...", "blue");

	     var allContacts = window.localStorage.getItem("myContacts");
	     allContacts = JSON.parse(allContacts);

	     for (var i = 0; i < allContacts['found_contacts'].length; i++) {

        

	        if(allContacts['found_contacts'][i]['contact_sn'] == contactSN){

	            var chosenContactName = allContacts['found_contacts'][i]['contact_name'];
	            var chosenContactEmail = allContacts['found_contacts'][i]['contact_email'];
	            var chosenContactPhone = allContacts['found_contacts'][i]['contact_phone'];
	            var chosenContactAddress = allContacts['found_contacts'][i]['contact_address'];

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

          $$(this).html("<img src='imgs/assets/loading.gif' style='max-width: 50px;'>").prop("disabled", true);

          app.request.post("https://abtechnology.com.ng/auditbar/update_contact.php",
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
                $$("#update-contact-button").html("Update contact").prop("disabled", false);

              }
              else{

                toastMe(dataRec.status);
                $$("#update-contact-button").html("Update contact").prop("disabled", false);

              }
              

          }, function(){
              $$("#update-contact-button").html("Update contact").prop("disabled", false);
              toastMe("Network error. Try again later");

          });
      }

    });



});

















$$(document).on('page:init', '.page[data-name="bankaccounts"]', function (e){


app.dialog.preloader("Loading bank accounts...", "blue");

var permanentReg = window.localStorage.getItem("permanentReg");
permanentReg = JSON.parse(permanentReg);

var theChosenCompany = window.localStorage.getItem("chosenCompany");
  theChosenCompany = JSON.parse(theChosenCompany);


    app.request.post("https://abtechnology.com.ng/auditbar/list_bank_accounts.php",
          {
            
            "company_serial" : theChosenCompany.company_id

          },
            function(dataSeed){

              console.log(dataSeed);
              var data = JSON.parse(dataSeed);

              if (data.count_status == 0) {

                $$("#load-all-accounts").html("<img src='imgs/assets/box.png' style='margin:0 auto; max-width:120px;'><br><h3>No bank accounts!</h3>").addClass("text-center");
                app.dialog.close();

              }
              else{

              //window.localStorage.setItem("myEmployees", dataSeed);

              magnetAccounts = "<ul>";

              for (var i = 0; i < data["all_accounts"].length; i++) {
              
              magnetAccounts += "<li class='accordion-item'><a href='#' class='item-link item-content'><div class='item-inner'><div class='item-title'>" + data["all_accounts"][i]["account_details"] + "</div></div></a><div class='accordion-item-content'><ul>  <li><div class='item-content'><div class='item-inner'>" + data["all_accounts"][i]["account_details"] + "<div class='item-after'></div></div></div></li>    <li><div class='item-content'><div class='item-inner'><div class='item-title'><button class='button button-fill color-red' onclick=deleteAccount(" + data["all_accounts"][i]['account_sn'] + ")>Delete bank account</button></div><div class='item-after'></div></div></div></li>     </ul></div></li>";

              }
              magnetAccounts += "</ul>";
              $$("#load-all-accounts").html(magnetAccounts);
              app.dialog.close();
            }
              

          }, function(){

              app.dialog.close();
              toastMe("Network error. Try again later");

          });








      deleteAccount = function(accountSN){

      app.dialog.preloader("Removing account...", "blue");

              app.request.post("https://abtechnology.com.ng/auditbar/delete_bank_account.php",
                  {
                    
                    "account_sn" :  accountSN,

                  },
                    function(data){

                      console.log(data);
                      
                      var data = JSON.parse(data);
                      if (data.status == "account deleted") {
                        
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
              
       

    }




});












$$(document).on('page:init', '.page[data-name="addbankaccount"]', function (e){


  var permanentReg = window.localStorage.getItem("permanentReg");
  permanentReg = JSON.parse(permanentReg);


  var theChosenCompany = window.localStorage.getItem("chosenCompany");
  theChosenCompany = JSON.parse(theChosenCompany);



  var bankAccountPopup = app.popup.create({
      el : '.bank-account-added-popup'
  });


  $$("#add-account-button").click(function(){

      if ($$("#bank-account-details").val().trim() == "") {

          toastMe("Please complete the form!");

      } else{

          $$(this).html("<img src='imgs/assets/loading.gif' style='max-width: 50px;'>").prop("disabled", true);

          app.request.post("https://abtechnology.com.ng/auditbar/add_bank_account.php",
          {
            
            "bank_account_details" : $$("#bank-account-details").val(),
            "company_id" : theChosenCompany.company_id
          },
            function(data){
              
              console.log(data);
              dataRec = JSON.parse(data);
              if (dataRec.status == "bank account added") {
                
                bankAccountPopup.open();

              }
              else{

                toastMe(dataRec.status);
                $$("#add-account-button").html("Add account").prop("disabled", false);

              } 

          }, function(){
              $$("#add-account-button").html("Add account").prop("disabled", false);
              toastMe("Network error. Try again later");

          });
      }

    });



});









$$(document).on('page:init', '.page[data-name="employees"]', function (e){


app.dialog.preloader("Loading employees...", "blue");

var permanentReg = window.localStorage.getItem("permanentReg");
permanentReg = JSON.parse(permanentReg);


    app.request.post("https://abtechnology.com.ng/auditbar/list_employees.php",
          {
            
            "my_id" : permanentReg.user_serial

          },
            function(dataSeed){

              console.log(dataSeed);
              var data = JSON.parse(dataSeed);

              if (data.count_status == 0) {

                $$("#load-all-employees").html("<img src='imgs/assets/box.png' style='margin:0 auto; max-width:120px;'><br><h3>No employees found!</h3>").addClass("text-center");
                app.dialog.close();

              }
              else{

              window.localStorage.setItem("myEmployees", dataSeed);

              magnetEmployees = "<ul>";

              for (var i = 0; i < data.length; i++) {


                magnetEmployees += "<div class='row no-gap' style='padding:30px;border-radius:20px;background-color: #efefef;margin:0px 0px 15px;' onclick=viewEmployee(" + data[i]['user_serial'] + ")> <div class='col-20'> <i class='icon f7-icons'>person_round</i> </div> <div class='col-75'> <h3 style='margin:0;'>" + data[i]["first_name"] + " " + data[i]["last_name"] + "</h3> <span>" + data[i]["user_email"] +"</span> </div> </div>"
              }
              magnetEmployees += "</ul>";
              $$("#load-all-employees").html(magnetEmployees);
              app.dialog.close();
            }
              

          }, function(){

              app.dialog.close();
              toastMe("Network error. Try again later");

          });






     viewEmployee = function(employeeSN){

      app.dialog.preloader("Please wait...", "blue");
      window.localStorage.setItem("employee_to_view", employeeSN);
      setTimeout(function() {
        mainView.router.navigate("/viewemployee/");
        app.dialog.close();
      }, 2000);
      


    }






});










$$(document).on('page:init', '.page[data-name="viewemployee"]', function (e){

var permanentReg = window.localStorage.getItem("permanentReg");
permanentReg = JSON.parse(permanentReg);


var myEmployees = window.localStorage.getItem("myEmployees");
myEmployees = JSON.parse(myEmployees);

var thisEmployeeID = window.localStorage.getItem("employee_to_view");


  
  for (var i = 0; i < myEmployees.length; i++) {

    var employeeFound;

    var employeeSerial = myEmployees[i]["user_serial"];
    if (employeeSerial == thisEmployeeID) {

      employeeFound = myEmployees[i];
      $$("#this-employee-name").html(employeeFound["first_name"] + " " + employeeFound["last_name"]);
      $$("#this-employee-email").html(employeeFound["user_email"]);
      $$("#this-employee-address").html(employeeFound["employee_address"]);
      $$("#this-employee-account-number").html(employeeFound["employee_account_number"]);
      $$("#this-employee-bank-name").html(employeeFound["employee_bank"]);
      $$("#this-employee-salary").html("NGN " + parseInt(employeeFound["employee_salary"]).toLocaleString());
      $$("#this-employee-designation").html(employeeFound["access_type"].toUpperCase());
      break;
    }

  }




  $$("#remove-employee").click(function(){
      removeEmployee(thisEmployeeID);
  });




      removeEmployee = function(employeeSN){

      app.dialog.preloader("Removing access...", "blue");

       var allEmployees = window.localStorage.getItem("myEmployees");
       allEmployees = JSON.parse(allEmployees);

       for(p in allEmployees){

          if(allEmployees[p]['user_serial'] == employeeSN){

              app.request.post("https://abtechnology.com.ng/auditbar/remove_employee.php",
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
                        mainView.router.back();
                      
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
  app.dialog.preloader("Loading companies...", "blue");


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

      if ($$("#employee-email").val().trim() == "" || $$("#selected-company").val().trim() == "" || $$("#employee-designation").val().trim() == "" || $$("#bank-name").val().trim() == "" || $$("#account-number").val().trim() == "" || $$("#salary").val().trim() == "" || $$("#employee-address").val().trim() == "") {

          toastMe("Please complete the form!");

      } else{

          $$(this).html("<img src='imgs/assets/loading.gif' style='max-width: 50px;'>").prop("disabled", true);

          app.request.post("https://abtechnology.com.ng/auditbar/add_employee.php",
          {
            
            
            "employee_email" : $$("#employee-email").val(),
            "company_id" : $$("#selected-company-id").val(),
            "employee_designation" : $$("#employee-designation").val(),
            "my_id" : permanentReg.user_serial,
            "bank_name" : $$("#bank-name").val(),
            "account_number" :$$("#account-number").val(),
            "salary" : $$("#salary").val(),
            "employee_address" : $$("#employee-address").val()

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
                $$("#add-employee-button").html("Add employee").prop("disabled", false);

              } 

          }, function(){
              $$("#add-employee-button").html("Add employee").prop("disabled", false);
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

  








    

    var paymentCompletePopup = app.popup.create({
      el : ".payment-complete-popup"
    });

    


    app.dialog.preloader("Fetching prices...");


      
  

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
                          confirmPayment(parsedData.data.reference);

                          
                                                  
                      }
                          
                          
                         }, function(){

                            
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

          $$(this).html("<img src='imgs/assets/loading.gif' style='max-width: 50px;'>").prop("disabled", true);

          app.request.post("https://abtechnology.com.ng/auditbar/account_statement_request.php",
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

          $$(this).html("<img src='imgs/assets/loading.gif' style='max-width: 50px;'>").prop("disabled", true);

          app.request.post("https://abtechnology.com.ng/auditbar/customer_account_statement_request.php",
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











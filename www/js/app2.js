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
                        //mainView.router.reload();
                      
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






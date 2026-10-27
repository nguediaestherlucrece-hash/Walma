import $ from 'jquery';
import { User } from "./../modeles/user";
import { initPage } from '../utilities';
import { loadDefaultLang } from '../share';

initPage("signIn.html");
$(document).ready(
    function () {
        $("#signInForm").on("submit", async function (event) {
            try {
              
                event.preventDefault();

                var isValid=true;

                $("#signInForm .form-control").each(function(){
                   
                    if(!this.checkValidity()){
                        isValid=false;

                        $(this).addClass('is-invalid');
                        $(this).removeClass('is-valid');
                    }else{
                        $(this).addClass('is-valid');
                        $(this).removeClass('is-invalid');

                    }
                });
                if(isValid){
                    let email = $("#email").val();
                    let nom = $("#nom").val();
                    let motDePasse = $("#password").val();
                    await User.creer_compte(nom, email, motDePasse);
                    location.href = "../views/dashboard.html";
                }else{
                    $("#signInForm").addClass('was-validated');
                }

                
            } catch (e) {
               $("#otherError").text(e.message).addClass("d-block text-center");
               


                
            }
        });


        $(".form-control").on("input",function(event){
            if(this.checkValidity()){
                $(this).addClass("is-valid");
                $(this).removeClass("is-invalid");
            }else{
                $(this).addClass("is-ivalid");
                $(this).removeClass("is-valid");

            }
        })

        

    }
)



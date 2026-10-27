
import $ from "jquery";
import { Controller } from './controller';
import { User } from "../modeles/user";
import { Profil } from "../modeles/profil";

const photoProfil = $("#photo-profil");
const defaultPhoto=$("#default-photo");
const previewPhoto=$("#preview");

const nom=$("#labelNomPrenom");
const email=$("#email");
const password=$("#password");
const sexe=$("#sexe");
const tel=$("#tel");
const submit=$("#submit");
const username=$("#userName");



export function changeProfil() {
    const input = document.getElementById("imageInput");
    const preview = document.getElementById("preview");

    input.addEventListener("change", () => {
        const file = input.files[0];
        if (!file) return;
       
        const imageURL = URL.createObjectURL(file);
        console.log(file);
         let profil=JSON.parse(localStorage.getItem("profil"));
         console.log(profil.owner);
         console.log("fin profil");
        User.updatePhotoProfil(profil.owner,file)
        preview.src = imageURL;
        
    });

}

export async function chargerPhotoProfil(){                

     let profil = JSON.parse(localStorage.getItem("profil"));
     let currentUser=await User.getUser(profil.owner);
     username.text(currentUser.nom);
      let photo=await User.getPhotoProfil(profil.owner);
        previewPhoto.attr("src",URL.createObjectURL(photo));

      
}






export function toggleForm(val) {
    if (!val) {
        $("#toggleActiveBtn").addClass("bi bi-arrow-counterclockwise").removeClass("bi bi-pencil");
    } else {
        $("#toggleActiveBtn").addClass("bi bi-pencil").removeClass("bi bi-arrow-counterclockwise");

    }
    $("#profilForm .form-control").each(
        function () {
            $(this).attr("disabled", val);
            console.log("deux");
        }
    )
    $("#submit").attr("disabled", val);
    $("#sexe").attr("disabled", val);
}

export async function initInfoProfil(){
    let profil=JSON.parse(localStorage.getItem("profil"));
    console.log(profil)
     let user= await User.getUser(profil.owner);
    console.log(user)
    nom.val(user.nom);
   
    email.val(user.email);
    password.val(user.password);
    if(profil.aboutMe.tel){
        tel.val(profil.aboutMe.tel);
    }
    if(profil.aboutMe.sexe){
        sexe.val(profil.aboutMe.sexe);
    }
}

export async function saveInfoProfil(){

    let name=nom.val();
    let mail=email.val();
    let pass=password.val();
    let phone=tel.val();
    let sex=sexe.val();

     let profil=JSON.parse(localStorage.getItem("profil"));
      let user= await User.getUser(profil.owner);
      user.nom=name;
      user.email=mail;
      user.password=pass;
     profil.aboutMe.tel=phone;
     profil.aboutMe.sexe=sex;
     localStorage.setItem("profil",JSON.stringify(profil));
     await Profil.updateProfil(profil.id,profil);
     await User.updateUser(user.id,user);

}













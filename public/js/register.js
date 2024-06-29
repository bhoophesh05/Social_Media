const form = document.getElementById("frm");

const emailField = document.getElementById("email");
const passwordField = document.getElementById("password");
const passwordConfirmField = document.getElementById("confirm");

String.prototype.isEmail = function () {
    return !!this.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
  };

form.addEventListener("submit", function (e) {
    e.preventDefault();
    if(!emailField.value.trim().isEmail()){
        emailField.parentElement.classList.add("error");
        return;
    } else{
        emailField.parentElement.classList.remove("error");
    }
    if(passwordField.value.trim()!=passwordConfirmField.value.trim()){
      passwordField.parentElement.classList.add("error");
      passwordConfirmField.parentElement.classList.add("error");
      return;
    } else {
        form.submit();
        // passwordField.parentElement.classList.remove("error");
        // passwordConfirmField.parentElement.classList.remove("error");
        
    }
})
var auth = undefined

async function setup(){
    auth = await getAuth()
}

setup()

//login validation
var attempt = 3;
function validate() {
    var email = document.getElementById("email");
    var password = document.getElementById("psw");
    //firebase sign in with authentificaiton
    const promise = auth.signInWithEmailAndPassword(email.value, password.value)
        .then(function (authenticate) {
            
            //checking if user is signed in
            const user = firebase.auth().currentUser;
            if (user) {
                // User is signed in
                alert("Login successfully");
                window.location = "ProfilePage.html"; // Redirecting to home
                return false;
            } else {
                // No user is signed in.
                if (attempt == 0) {
                    return false;
                }
                attempt--;
                if (attempt > 1) {
                    alert("You have left " + attempt + " attempts;");
                } else {
                    alert("You have left " + attempt + " attempt;");
                }

                // Disabling after 3 attempts.
                if (attempt == 0) {
                    document.getElementById("email").disabled = true;
                    document.getElementById("psw").disabled = true;
                    document.getElementById("submit").disabled = true;
                    return false;
                }
            }
        });
    promise.catch(e => alert(e.message));
}
//switches to sign up form
function signUpSwitch() {
    var confirmPassword, confirm, signUpLogIn;
    confirmPassword = document.getElementById("confirmPassword");
    confirm = document.getElementById("confirm");
    signUpLogIn = document.getElementById("signUpLogIn");
    confirmPassword.style.display = "block";
    confirm.style.display = "block";
    signUpLogIn.style.display = "none";
}
//signup function, on success moves to profile page
function signUp() {
    var email = document.getElementById("email");
    var password = document.getElementById("psw");
    var confirmPassword = document.getElementById("confirmPsw");
    var name = document.getElementById("name");
    //updating authenticator
    if (confirmPassword.value == password.value) {
        const promise = auth.createUserWithEmailAndPassword(email.value, password.value)
            .then(function (post) {
                //getting current user
                const user = firebase.auth().currentUser;
                var postData = {
                    email: email.value,
                    name: name.value,
                    bio: "",
                    images: {iconImage:"", bgImage:""},
                    audio: {0:""}
                };
                console.log(user.uid);
                firebase.database().ref().child('users/' + user.uid).set(postData);
            });
        promise.catch(e => alert(e.message));
        alert("SignUp Successfully");
        //updating new user
        const user = firebase.auth().currentUser;

        user.updateProfile({
            displayName: name.value
            //photoURL: "https://example.com/jane-q-user/profile.jpg" later
        }).then(() => {
            // Update successful
            // ...
        }).catch((error) => {
            // An error occurred
            // ...
        });
        //updating display
        var confirmPassword, confirm, signUpLogIn, nameField;
        confirmPassword = document.getElementById("confirmPassword");
        confirm = document.getElementById("confirm");
        signUpLogIn = document.getElementById("signUpLogIn");
        confirmPassword.style.display = "none";
        confirm.style.display = "none";
        signUpLogIn.style.display = "block";
    }
    else {
        alert("Passwords do not match")
    }

}
//signout funtion signs out user and moves to login page
function signOut() {
    auth.signOut();
    alert("SignOut Successfully from System");
    window.location = "login.html";
}
//delete account
function deleteAccount() {
    const user = firebase.auth().currentUser;

    user.delete().then(() => {
        alert("Account Deleted")
        window.location = "login.html";
    }).catch((error) => {
        // An error ocurred
        // ...
    });
}


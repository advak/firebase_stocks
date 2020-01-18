// get data
// get() is an a-synchronous task. It takes sometime to do it. It returns a promise. So we use the then()
// which fires a callback function when the get() is completed. the callback function takes in the response from the get()
// get() sends back a snapshot of this collection
db.collection('guides').get().then(snapshot => {
    setupGuides(snapshot.docs);
});

// listen for auth status changes
// onAuthStateChanged takes a callback function which takes in a user as a parameter.
// everytime there's outh state change (login or logout) this function right here is gonna
// fire because we setup this listener. If the change is a user log in, we get user=user back,
//if it's logout, we get back user=null.
auth.onAuthStateChanged(user => {
    if (user) {
        console.log('user logged in: ', user);
    } else {
        console.log('user looged out');
    }
});

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault(); // prevernts the default closing of the signup form

    // get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    // sign up the user
    // The next line is an a-synchronous operation, it returns a promise
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();
    })
})

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
})

// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    auth.signInWithEmailAndPassword(email, password).then(cred => {
        // close the login modal and reset the form
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
    });
});

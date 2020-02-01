// listen for auth status changes
// onAuthStateChanged takes a callback function which takes in a user as a parameter.
// everytime there's outh state change (login or logout) this function right here is gonna
// fire because we setup this listener. If the change is a user log in, we get user=user back,
//if it's logout, we get back user=null.
auth.onAuthStateChanged(user => {
  // console.log(user);
    if (user) {
        // get data
        // get() is an a-synchronous task. It takes sometime to do it. It returns a promise. So we use the then()
        // which fires a callback function when the get() is completed. the callback function takes in the response from the get()
        // get() sends back a snapshot of this collection
      db.collection('guides').onSnapshot(snapshot => {
        setupGuides(snapshot.docs);
        setupUI(user);
      }, err => console.log(err.message));
    } else {
      setupUI();
      setupGuides([]);
    }
});

// create new guide
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
    e.preventDefault();

    db.collection('guides').add({
      title: createForm['title'].value,
      content: createForm['content'].value
    }).then(() => {
      // close the modal and reset form
      const modal = document.querySelector('#modal-create');
      M.Modal.getInstance(modal).close();
      createForm.reset();
    // for the case a user which is not logge in tried to created a guide
    }).catch(err => {
      console.log(err.message)
    })
})

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
})

//sign up with Google
const signupWithGoogle = document.querySelector('#signup-with-google');
signupWithGoogle.addEventListener('click', (e) => {
    e.preventDefault();

    firebase.auth().signInWithPopup(provider).then(function(result){
      db.collection('portfolios').get().then(function(querySnapshot) {
        if (querySnapshot.empty) {
          db.collection('portfolios').add({
            user_id: result.user.uid
          });
        } else {
          var has_portfolio = false;
          querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            if (doc.data().user_id == result.user.uid) {
              has_portfolio = true
              console.log(doc.id, " => ", doc.data().id);
            }
          });
          if (has_portfolio == false) {
            db.collection('portfolios').add({
              user_id: result.user.uid
          });
          }
        }
      });
  }).catch(function(err){
      console.log(err)
      console.log("Failed to link Google acount")
    });
  });
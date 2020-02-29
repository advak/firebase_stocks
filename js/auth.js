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
      db.collection('portfolios').where('user_id', '==', user.uid).onSnapshot(snapshot => {
        // TODO: check why it is executed before and after first signup of user and returns a TypeError
        db.collection('portfolios').doc(snapshot.docs[0].id).collection('stocks').onSnapshot(stocks => {
        setupStocks(stocks.docs);
        setupUI(user);
        });
    }, err => console.log(err.message));
    } else {
      setupUI();
      setupStocks([]);
    }
});

// add new stock
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
    e.preventDefault();
    var user = firebase.auth().currentUser
    db.collection('portfolios').where('user_id', '==', user.uid).get().then(function(portfolios) {
      db.collection('portfolios').doc(portfolios.docs[0].id).collection('stocks').add ({
          symbol: createForm['symbol'].value.toUpperCase(),
          price: createForm['price'].value,
          buy: createForm['buy'].value,
          quantity: createForm['quantity'].value,
          date: createForm['date'].value
          }).then(() => {
          // close the modal and reset form
          const modal = document.querySelector('#modal-create');
          M.Modal.getInstance(modal).close();
          createForm.reset();
        // for the case a user which is not logge in tried to created a guide
        }).catch(err => {
          console.log(err.message)
        });
      })
    });

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
          db.collection('portfolios').where('user_id', '==', result.user.uid).get().then(function(portfolios) {
            if (portfolios.empty) {
              db.collection('portfolios').add({
                user_id: result.user.uid,
                user_email: result.user.email
            });
          }
          });
        }
      });
  }).catch(function(err){
      console.log(err)
      console.log("Failed to link Google acount")
    });
  });
const guideList = document.querySelector('.guides');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const photo = document.querySelector('.profile-pic');


const setupUI = (user) => {
  if (user) {
    // acount info
    const photohtml = `<img src="${user.photoURL}" alt="" class="circle">`;
    photo.innerHTML = photohtml;
    // toggle UI elements
    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
  } else {
    // hide account info
    photo.innerHTML = '';
    // toggle UI elements
    loggedOutLinks.forEach(item => item.style.display = 'block');
    loggedInLinks.forEach(item => item.style.display = 'none');
  }
}

//setup stocks
const setupStocks = (data) => {
  var user = firebase.auth().currentUser
  if (data.length) {
    let html = '';
	  data.forEach(doc => {
      const stock = doc.data();
      const li = `
      <li>
      <div class="collapsible-header grey lighten-4">${stock.symbol}</div>
      <div class="collapsible-body white">price: ${stock.price}</div>
      <div class="collapsible-body white">buy: ${stock.buy}</div>
      <div class="collapsible-body white">quantity: ${stock.quantity}</div>
      </li>
      `;
      html += li
    });
    guideList.innerHTML = html;
  } else {
    if (user) {
      guideList.innerHTML = '<h5 class="center-align">Add your stocks</h5>'
    } else {
      guideList.innerHTML = '<h5 class="center-align">Login to see your stocks</h5>'
    }
  }
}

const settings_btn = document.querySelector('#settings');
settings_btn.addEventListener('click', (e) => {
    e.preventDefault();
    var status = db.collection('portfolios').where('user_id', '==', firebase.auth().currentUser.uid).get().then(function(doc) {
      return doc.docs[0].data()["send_email"]
    }).then( function(d) {
    changeEmailSettings(d);

    })
})

function changeEmailSettings(status) {
  const email_status_btn = document.querySelector('#email');
  document.getElementById("email").checked = status;
  email_status_btn.addEventListener('change', function() {
    if (this.checked) {
      db.collection('portfolios').where('user_id', '==', firebase.auth().currentUser.uid).get().then(function(portfolios) {
        db.collection('portfolios').doc(portfolios.docs[0].id).set({send_email: true}, { merge: true })
      })

    } else {
      db.collection('portfolios').where('user_id', '==', firebase.auth().currentUser.uid).get().then(function(portfolios) {
        db.collection('portfolios').doc(portfolios.docs[0].id).set({send_email: false}, { merge: true })
      })
    }
  });
};


// setup materialize components
document.addEventListener('DOMContentLoaded', function () {
  var options = {
    hoverEnabled: false

  }
  var drop_options = {
    coverTrigger:false,
    constrainWidth: false
  }

  var elements = document.querySelectorAll('.fixed-action-btn');
  M.FloatingActionButton.init(elements, options);

	var modals = document.querySelectorAll('.modal');
	M.Modal.init(modals);

	var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);
  
  var elems = document.querySelectorAll('.dropdown-trigger');
  var instances = M.Dropdown.init(elems, drop_options);
});

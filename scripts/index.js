const guideList = document.querySelector('.guides');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');

const setupUI = (user) => {
  if (user) {
    // acount info
    const html = `
      <div>Loggen in as ${user.email}</div>
    `;
    accountDetails.innerHTML = html;
    // toggle UI elements
    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
  } else {
    // hide account info
    accountDetails.innerHTML = '';
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
      console.log(doc.data())
      const stock = doc.data();
      const li = `
      <li>
      <div class="collapsible-header grey lighten-4">${stock.symbol}</div>
      <div class="collapsible-body white">price: ${stock.price}</div>
      <div class="collapsible-body white">buy: ${stock.buy}</div>
      <div class="collapsible-body white">quantity: ${stock.quantity}</div>
      </li>
      `;
      console.log(li)
      html += li
    });
    guideList.innerHTML = html;
  } else {
    console.log("no stocks")
    guideList.innerHTML = '<h5 class="center-align">Login to view guides</h5>'
  }
}


// setup materialize components
document.addEventListener('DOMContentLoaded', function () {

	var modals = document.querySelectorAll('.modal');
	M.Modal.init(modals);

	var items = document.querySelectorAll('.collapsible');
	M.Collapsible.init(items);

});

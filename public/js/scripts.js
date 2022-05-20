const $mainContent = document.querySelector('#main-content')
const todoTemplate = document.querySelector('#todo-template').innerHTML
const userTemplate = document.querySelector('#user-profile-template').innerHTML
const loginTemplate = document.querySelector('#login-form-template').innerHTML
let userToken = localStorage.getItem('userToken')

var config = {
  method: 'get',
  url: '/users/me',
  headers: { 
    'Authorization': 'Bearer ' + userToken
  }
};

axios(config)
.then(function (response) {
  localStorage.setItem('User', JSON.stringify(response.data))
  const url = `/users/${response.data._id}/avatar`
  const html = Mustache.render(userTemplate, {
    url,
    name: response.data.name,
    _id: response.data._id,
    email: response.data.email 
  })
  $mainContent.insertAdjacentHTML('beforeend', html)
  userMenu()
})
.catch(function (error) {
  const html = Mustache.render(loginTemplate)
  $mainContent.insertAdjacentHTML('beforeend', html)

  const userEmail = document.querySelector('input[type=text]')
  const userPassword = document.querySelector('input[type=password]')
  const submitButton = document.querySelector('button[type=submit]')

  submitButton.addEventListener('click', (event) => {
    event.preventDefault()
    var data = JSON.stringify({
      "email": userEmail.value,
      "password": userPassword.value
    });

    var config = {
      method: 'post',
      url: '/users/login',
      headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };

  axios(config)
  .then(function (response) {
    const token = response.data.token 
    localStorage.setItem('userToken', token)
    userMenu()
})
.catch(function (error) {
  console.log(error);
});
  })
});

const userMenu = function () {
  userToken = localStorage.getItem('userToken')
  var config = {
    method: 'get',
    url: '/users/me',
    headers: { 
    'Authorization': 'Bearer ' + userToken
  }
};

axios(config)
.then(function (response) {
  $mainContent.innerHTML = ""
  localStorage.setItem('User', JSON.stringify(response.data))
  const url = `/users/${response.data._id}/avatar`
  const html = Mustache.render(userTemplate, {
    url,
    name: response.data.name,
    _id: response.data._id,
    email: response.data.email 
  })
  $mainContent.insertAdjacentHTML('beforeend', html)
})
.catch(function (error) {
  console.log(error);
})
} 

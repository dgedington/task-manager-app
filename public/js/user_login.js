const $loginForm = document.querySelector('#input-form')
const $userEmail = document.querySelector('#username')
const $userPassword = document.querySelector('#password')
const $submitButton = login.querySelector('#submit')

console.log($loginForm)
console.log($userPassword)
console.log($userEmail)

$loginForm.addEventListener('submit', (event) => {
    event.stopImmediatePropagation()
    console.log(event)
})
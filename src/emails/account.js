const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'dgeding@live.com',
        subject: 'Welcome to task manager app!',
        text: `Hello, ${name} \n Welcome to the task manager app.`
    })
}

const sendGoodbyeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'dgeding@live.com',
        subject: 'Goodbye from task manager app!',
        text: `Goodbye, ${name} \n Sorry to see you leave task manager app.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
}
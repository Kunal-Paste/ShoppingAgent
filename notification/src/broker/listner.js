const {subscribeToQueue} = require('./broker');
const {sendEmail} = require('../email')

module.exports = function () {
    subscribeToQueue('AUTH_NOTIFICATION.USER_CREATED', async(data)=>{
        const emailTemplate = `
          <h1>Welcome to our service</h1>
          <p>Dear ${data.fullName.firstName + " "+ (data.fullName.lastName || "")}</p>
          <p>Thank you for registering with us, We are exicited to have you on board!</p>
          <p>Best regards,<br/>The Team</p>
        `
        await sendEmail(data.email, "Welcome to our service", "Thankyou for registering with us!", emailTemplate)
    })
}
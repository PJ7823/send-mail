const express = require('express');
const cors = require('cors');
const SibApiV3Sdk = require('@getbrevo/brevo');
const bodyParser = require('body-parser');
const cron = require('node-cron');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
// add middleware to parse the json
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);

// Define routes
// https://www.npmjs.com/package/@getbrevo/brevo
app.post('/send-mail', async (req, res) => {
    try {
        let user_email = req.body.user_email;
        let user_name = req.body.user_name;
        let phone_number = req.body.phone_number;
        let course_name = req.body.course_name;
        let city = req.body.city;

        console.log(user_email, user_name);
        
		if (user_email === undefined || user_email === '') {
			return res.status(422).json({
				status: false,
				message: 'User Email is required.',
			})
		}

		if (user_name === undefined || user_name === '') {
			return res.status(422).json({
				status: false,
				message: 'User Name is required.',
			})
		}

        if (phone_number === undefined || phone_number === '') {
			return res.status(422).json({
				status: false,
				message: 'User Name is required.',
			})
		}

        if (course_name === undefined || course_name === '') {
			return res.status(422).json({
				status: false,
				message: 'User Name is required.',
			})
		}

        if (city === undefined || city === '') {
			return res.status(422).json({
				status: false,
				message: 'User Name is required.',
			})
		}
        // let apiInstance = new SibApiV3Sdk.AccountApi();

        // apiInstance.setApiKey(SibApiV3Sdk.AccountApiApiKeys.apiKey, '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')
        
        // apiInstance.getAccount().then(function(data) {
        //   console.log('API called successfully. Returned data: ' + JSON.stringify(data));
        
        // }, function(error) {
        //   console.error(error);
        // });

        let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

        let apiKey = apiInstance.authentications['apiKey'];
        apiKey.apiKey = process.env.MAIL_KEY;

        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); 

        sendSmtpEmail.subject = "{{params.subject}}";
        sendSmtpEmail.htmlContent = `<html><body><p>Hello,</p><p>Below are the user Details who have submitted the form</p><div><p>User Name: ${user_name}</p><p>User Email: ${user_email}</p><p>Phone Number: ${phone_number}</p><p>Course Name: ${course_name}</p><p>City: ${city}</p></div><div>Thank You.</div></body></html>`;
        sendSmtpEmail.sender = {"name":"BRAIN TECH Education & Placement","email":"piyush.shephertz@gmail.com"};
        sendSmtpEmail.to = [{"email": user_email,"name": user_name}];
        sendSmtpEmail.params = {"parameter":"My param value","subject": `BRAIN TECH - User Details (${user_name})`};

        let data = await apiInstance.sendTransacEmail(sendSmtpEmail);

        console.log('API called successfully. Returned data: ' + JSON.stringify(data));

        return res.status(200).json({
            message: 'Mail sent successfully!',
            status: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Something went wrong! Email not sent',
            status: false
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    return res.status(500).json({
        message: 'Something went wrong!',
        status: false
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


// CRON JOB
function logMessage() {
    console.log('Cron job executed at:', new Date().toLocaleString());
}
// Schedule the cron job to run every minute
cron.schedule('*/10 * * * *', () => {
    logMessage();
});
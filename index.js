const express = require('express');
const cors = require('cors');
const SibApiV3Sdk = require('@getbrevo/brevo');
const bodyParser = require('body-parser');

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
        // let apiInstance = new SibApiV3Sdk.AccountApi();

        // apiInstance.setApiKey(SibApiV3Sdk.AccountApiApiKeys.apiKey, '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')
        
        // apiInstance.getAccount().then(function(data) {
        //   console.log('API called successfully. Returned data: ' + JSON.stringify(data));
        
        // }, function(error) {
        //   console.error(error);
        // });

        let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

        let apiKey = apiInstance.authentications['apiKey'];
        apiKey.apiKey = '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';

        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); 

        sendSmtpEmail.subject = "My {{params.subject}}";
        sendSmtpEmail.htmlContent = "<html><body><h1>This is my first transactional email {{params.parameter}}</h1></body></html>";
        sendSmtpEmail.sender = {"name":"John Doe","email":"piyush.shephertz@gmail.com"};
        sendSmtpEmail.to = [{"email": user_email,"name": user_name}];
        sendSmtpEmail.params = {"parameter":"My param value","subject": user_name};

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
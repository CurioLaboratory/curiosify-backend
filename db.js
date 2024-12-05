const mongoose = require("mongoose");
// const AWS = require('aws-sdk');
// const { SecretsManager } = require('aws-sdk');

// // Set your region
// const region = 'us-east-1'; // Change this to your desired region
// AWS.config.update({ region });

// const secretsManager = new SecretsManager();

// const loadSecrets = async () => {
//     try {
//         const data = await secretsManager.getSecretValue({ SecretId: 'curiosify-backend-secrets' }).promise();
//         if ('SecretString' in data) {
//             const secret = JSON.parse(data.SecretString);

//             // Set environment variables
//             process.env.MONGO_STR = secret.MONGO_STR; 
//             process.env.JWT_SECRET = secret.JWT_SECRET;
//             process.env.JWT_EXPIRES_IN = secret.JWT_EXPIRES_IN;
//             process.env.FRONTEND_URL = secret.FRONTEND_URL;
//             process.env.REDIS_URL = secret.REDIS_URL;
//             process.env.SES_HOST = secret.SES_HOST;
//             process.env.SES_PORT = secret.SES_PORT;
//             process.env.SES_USER = secret.SES_USER;
//             process.env.SES_PASS = secret.SES_PASS;
//         }
//     } catch (err) {
//         console.error('Error retrieving secrets:', err);
//     }
// };

const connectToMongo = async () => {
    await loadSecrets(); // Load secrets before connecting to MongoDB

    const mongostr = process.env.MONGO_STR; // Load MongoDB URI from environment variables
    console.log('MongoDB URI:', mongostr);  // This should now log the correct URI

    try {
        await mongoose.connect(mongostr, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("NOT CONNECTED TO NETWORK", err); // Improved error logging
    }
};

module.exports = connectToMongo;

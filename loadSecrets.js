const AWS = require('aws-sdk');

// Set the region
AWS.config.update({ region: 'us-east-1' }); // Replace with your region if different
const secretsManager = new AWS.SecretsManager();

const loadSecrets = async () => {
    try {
        const data = await secretsManager.getSecretValue({ SecretId: 'curiosify-backend-secrets' }).promise();

        if ('SecretString' in data) {
            const secret = JSON.parse(data.SecretString);
            console.log("Retrieved secret data:", secret);

            // Set environment variables
            process.env.MONGO_STR = secret.MONGO_STR;
            process.env.JWT_SECRET = secret.JWT_SECRET;
            process.env.JWT_EXPIRES_IN = secret.JWT_EXPIRES_IN;
            process.env.FRONTEND_URL = secret.FRONTEND_URL;
            process.env.REDIS_URL = secret.REDIS_URL;
            process.env.SES_HOST = secret.SES_HOST;
            process.env.SES_PORT = secret.SES_PORT;
            process.env.SES_USER = secret.SES_USER;
            process.env.SES_PASS = secret.SES_PASS;

            console.log("Secrets successfully loaded and assigned to environment variables.");
        }
    } catch (error) {
        console.error("Error retrieving secrets:", error);
        throw error; // Rethrow the error for further handling
    }
};

module.exports = loadSecrets;

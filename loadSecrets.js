const AWS = require('aws-sdk');

// Set the region
AWS.config.update({ region: 'us-east-1' }); // Replace with your region if different
const secretsManager = new AWS.SecretsManager();

async function loadSecrets() {
    try {
        const data = await secretsManager.getSecretValue({ SecretId: 'curiosify-backend-secrets' }).promise();
        
        // Log the retrieved secret for debugging
        console.log("Retrieved secret data:", data);
        
        let secrets;
        if ('SecretString' in data) {
            secrets = JSON.parse(data.SecretString);
        } else {
            let buff = Buffer.from(data.SecretBinary, 'base64');
            secrets = JSON.parse(buff.toString('ascii'));
        }

        // Assign secrets to environment variables
        Object.keys(secrets).forEach((key) => {
            process.env[key] = secrets[key];
        });

        console.log("Secrets successfully loaded and assigned to environment variables.");
    } catch (err) {
        console.error("Error retrieving secrets:", err);
        throw err; // Rethrow the error for proper handling
    }
}

module.exports = loadSecrets;

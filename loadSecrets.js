const AWS = require('aws-sdk');

// Set the AWS region
AWS.config.update({ region: 'us-east-1' }); // Replace with your actual region

const secretsManager = new AWS.SecretsManager();

async function loadSecrets() {
  try {
    const data = await secretsManager.getSecretValue({ SecretId: 'curiosify-backend-secrets' }).promise();
    
    // Parse the secrets from SecretString
    const secrets = JSON.parse(data.SecretString);
    
    // Assign the secrets to process.env
    Object.keys(secrets).forEach((key) => {
      process.env[key] = secrets[key];
    });

    console.log("Secrets successfully loaded and assigned to environment variables.");
  } catch (err) {
    console.error("Error retrieving secrets:", err);
    throw err; // Re-throw the error to be handled in server.js
  }
}

module.exports = loadSecrets;

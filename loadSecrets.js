// loadSecrets.js
const AWS = require('aws-sdk');

// Set the AWS region
AWS.config.update({ region: 'us-east-1' }); // Replace with your actual region

const secretsManager = new AWS.SecretsManager();

async function loadSecrets() {
  try {
    const data = await secretsManager.getSecretValue({ SecretId: 'curiosify-backend-secrets' }).promise();
    const secrets = JSON.parse(data.SecretString);
    
    // Assign the secrets to process.env
    Object.keys(secrets).forEach((key) => {
      process.env[key] = secrets[key];
    });
  } catch (err) {
    console.error("Error retrieving secrets:", err);
  }
}

module.exports = loadSecrets;

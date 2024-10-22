const AWS = require('aws-sdk');
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

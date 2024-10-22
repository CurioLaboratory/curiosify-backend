const redis = require('redis');
const AWS = require('aws-sdk');
const { SecretsManager } = require('aws-sdk');

// Set your region
const region = 'us-east-1'; // Change this to your desired region
AWS.config.update({ region });

const secretsManager = new SecretsManager();

const loadSecrets = async () => {
    try {
        const data = await secretsManager.getSecretValue({ SecretId: 'curiosify-backend-secrets' }).promise();
        if ('SecretString' in data) {
            const secret = JSON.parse(data.SecretString);
            console.log('Retrieved secret data:', secret);

            // Check if REDIS_URL exists and log it
            if (secret.REDIS_URL) {
                console.log('Redis URL:', secret.REDIS_URL);
            } else {
                console.error('REDIS_URL is undefined in the secret');
            }

            // Set environment variables
            process.env.REDIS_URL = secret.REDIS_URL; // Directly assign without quotes
        }
    } catch (err) {
        console.error('Error retrieving secrets:', err);
    }
};

const connectRedis = async () => {
    await loadSecrets(); // Load secrets before connecting to Redis

    const redisURl = process.env.REDIS_URL; // Load Redis URI from environment variables
    const redisClient = redis.createClient({
        url: redisURl,
    });

    redisClient.on('error', (err) => {
        console.error('Redis error:', err);
    });

    try {
        await redisClient.connect();
        console.log('Connected to Redis');
        console.log(redisURl);
    } catch (err) {
        console.error('Error connecting to Redis:', err);
    }

    return redisClient; // Return the client to use in other modules
};

module.exports = connectRedis;

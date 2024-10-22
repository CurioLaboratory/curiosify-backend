const redis = require('redis');
const AWS = require('aws-sdk');
const { SecretsManager } = require('aws-sdk');

// Set your region
const region = 'us-east-1'; 
AWS.config.update({ region });

const secretsManager = new SecretsManager();

const loadSecrets = async () => {
    try {
        const data = await secretsManager.getSecretValue({ SecretId: 'curiosify-backend-secrets' }).promise();
        if ('SecretString' in data) {
            const secret = JSON.parse(data.SecretString);

            // Set environment variables
            process.env.REDIS_URL = secret.REDIS_URL;
        }
    } catch (err) {
        console.error('Error retrieving secrets:', err);
    }
};

const connectRedis = async () => {
    await loadSecrets(); // Load secrets before connecting to Redis

    const redisURL = process.env.REDIS_URL; 
    const redisClient = redis.createClient({
        url: redisURL,
    });

    redisClient.on('error', (err) => {
        console.error('Redis error:', err);
    });

    try {
        await redisClient.connect();
        console.log('Connected to Redis');
        return redisClient; // Return the Redis client instance after connection
    } catch (err) {
        console.error('Error connecting to Redis:', err);
        throw err; // Throw the error to be caught by calling function
    }
};

module.exports = connectRedis;

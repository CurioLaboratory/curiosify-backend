const mongoose = require("mongoose");


const connectToMongo = async () => {
  //  await loadSecrets(); // Load secrets before connecting to MongoDB

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
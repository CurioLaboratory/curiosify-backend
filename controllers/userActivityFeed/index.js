const User = require('../../models/auth/User')
const UserActivity = require('../../models/userActivityFeed/UserActivityFeed')

// Add a new activity for the user
exports.addActivity = async (req, res) => {
    const { userId, email, type, title } = req.body;

    try {
        let userActivity = await UserActivity.findOne({ user: userId });

        if (userActivity) {
            // Add new activity to the user's activity array
            userActivity.activities.push({ type, title });
            await userActivity.save();
        } else {
            // Create a new activity document for the user
            userActivity = new UserActivity({
                user: userId,
                email,
                activities: [{ type, title }]
            });
            await userActivity.save();
        }

        res.status(200).json({ message: 'Activity added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Fetch user's activities
exports.getActivities = async (req, res) => {
    const email = req.user.email;

    try {
        const userActivity = await UserActivity.findOne({email:email});

        if (!userActivity) {
            return res.status(200).json([]);
        }

        res.status(200).json(userActivity.activities);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const User = require('../../models/auth/User');
const Quiz = require('../../models/quiz/Quiz');
const Notification = require('../../models/notification/Notification');

exports.getNotifications = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { type } = req.query; // Optional type filter (quiz, flashcard, event)

        // Base query to get all notifications for the student
        const query = { studentId: req.user.email };

        // Apply the type filter only if it exists
        if (type && type !== '') {
            query.type = type;
        }

        // Fetch today's notifications in reverse order (latest first)
        const todayNotifications = await Notification.find({
            ...query,
            createdAt: { $gte: today }
        }).populate('itemId').sort({ createdAt: -1 });

        // Fetch other notifications in reverse order (latest first)
        const otherNotifications = await Notification.find({
            ...query,
            createdAt: { $lt: today }
        }).populate('itemId').sort({ createdAt: -1 });

        // Send response with both today and other notifications
        res.status(200).json({ todayNotifications, otherNotifications });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching notifications' });
    }
};

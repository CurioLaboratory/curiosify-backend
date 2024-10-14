const User = require("../../models/auth/User");
const Event = require('../../models/events/Event')
const Notification = require('../../models/notification/Notification')
exports.getallevents = async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
        return;
    }
}

exports.addevents = async (req, res) => {
    const { title, summary, date,poster } = req.body;
    console.log(poster);
    const userId = req.user.id;
    const user = await User.findById(userId);

    const existingEvent = await Event.findOne({ title });
    if (existingEvent) {
        return res.status(400).json({ message: 'Event with this title already exists' });
    }

    const event = new Event({
        title,
        poster,
        summary,
        date,
        createdBy: user.email
    });

    try {
        const newEvent = await event.save();
          // Fetch all users with the role "student" and collect their emails
        const students = await User.find({ role: 'student'});
        const studentEmails = students.map(student => student.email); // Extract emails into an array

        // Create a single notification for all students
        const notification = new Notification({
            studentId: studentEmails, // Set studentId as an array of student emails
            itemId: event._id, 
            type: 'event',
            message: `New Event added on title: ${event.title}`,
        });
        
        // Save the notification
        await notification.save();

        res.status(201).json(newEvent);
    } catch (err) {
        res.status(400).json({ message: err.message });
        return;
    }
}

exports.editevents = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.user.id);
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        if (event.createdBy !== user.email) {
            res.status(400).json({ message: "not the valid user" });
        }

        const { title, summary, date } = req.body;
        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            { title, summary, date },
            { new: true }
        );
        res.status(201).json(updatedEvent);
    } catch (err) {
        res.status(400).json({ message: err.message });
        return;
    }
}

exports.deleteevents = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const user = await User.findById(userId);

    const event = await Event.findById(id);
    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }
    if (event.createdBy !== user.email) {
        res.status(400).json({ message: "not the valid user" });
    }
    try {
        await Event.findByIdAndDelete(id);
        res.json({ success: true, message: "Event deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
        return;
    }
}
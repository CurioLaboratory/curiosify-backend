const User = require("../../models/auth/User");
const Event = require('../../models/events/Event')

exports.getallevents = async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.addevents = async (req, res) => {
    const { title, summary, date } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);

    const existingEvent = await Event.findOne({ title });
    if (existingEvent) {
        return res.status(400).json({ message: 'Event with this title already exists' });
    }

    const event = new Event({
        title,
        // poster,
        summary,
        date,
        createdBy: user.email
    });

    try {
        const newEvent = await event.save();
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(400).json({ message: err.message });
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
        res.status(400).json({  message:err.message });
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
    }
}
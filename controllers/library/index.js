const User = require('../../models/auth/User')
const Library = require('../../models/library/Library')

exports.getAllResources = async (req, res) => {
    try {
        const resources = await Library.find();
        res.json(resources);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching resources' });
        return;
    }
}

exports.createManualResources = async (req, res) => {
    const { title, classLevel, date, subject } = req.body;

    if (!title || !subject || !classLevel || !date) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    const userId = req.user.id;
    const user = await User.findById(userId);
    const existingResources = await Library.findOne({ title });
    if (existingResources) {
        return res.status(400).json({ message: 'Resources with this title already exists' });
    }

    const newResourcesItem = new Library({
        title,
        subject,
        classLevel,
        date,
        createdBy: user.email
    });
    try {
        await newResourcesItem.save();
        res.status(201).json({ message: 'Resources  added successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Error saving Resources' });
        return;
    }
}

exports.deleteResouces = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const user = await User.findById(userId);

    const resources = await Library.findById(id);
    if (!resources) {
        return res.status(404).json({ message: "resources not found" });
    }
    if (resources.createdBy !== user.email) {
        res.status(400).json({ message: "not the valid user" });
    }
    try {
        await Library.findByIdAndDelete(id);
        res.json({ success: true, message: "Resources deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
        return;
    }
}
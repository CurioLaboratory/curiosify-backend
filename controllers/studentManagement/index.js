const Batch = require("../../models/studentManagement/Batch");
const User = require("../../models/auth/User");

exports.createBatch = async (req, res) => {
    const { batchName, subject, dateCreated } = req.body;

    try {
        const newBatch = new Batch({
            name: batchName,
            subject,
            dateCreated,
            students: [],
        });

        newBatch.save();
        res.status(201).json({ message: "Batch created successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Error creating new batch" });
    }
};

exports.getAllBatches = async (req, res) => {
    try {
        const allBatches = await Batch.find();
        res.status(200).json({
            message: "Successfully fetched all batches.",
            allBatches,
        });
    } catch (error) {
        // console.log(error);
        res.status(500).json({ error: "Error fetching all batches." });
    }
};

exports.addEmail = async (req, res) => {
    const batchId = req.params.id;
    const { studentEmail } = req.body;
    try {
        const user = await User.findOne({
            email: studentEmail,
        });

        if (!user) {
            res.status(404).json({
                message: "Email not registered",
            });
        } else if (user.role === "teacher") {
            res.status(406).json({
                message: "Email not registered by student",
            });
        } else {
            const batch = await Batch.findById(batchId).select("students");

            const exists = batch.students.some(
                (student) => student.email === studentEmail
            );

            if (exists) {
                res.status(409).json({
                    message: "Student already added!",
                });
            } else {
                const updatedBatch = await Batch.findByIdAndUpdate(batchId, {
                    students: [...batch.students, { email: studentEmail }],
                });

                res.status(200).json({
                    message: "Student added successfully!",
                });
            }
        }
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            message: "Failed to add student",
        });
    }
};

exports.getBatchById = async (req, res) => {
    const batchId = req.params.id;
    try {
        const batch = await Batch.findById(batchId);
        res.status(200).json({
            batch,
            message: "Batch fetched successfully",
        });
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            error: "Failed to fetch all students of batch",
        });
    }
};

exports.deleteEmail = async (req, res) => {
    const batchId = req.params.id;
    const { studentEmail } = req.body;
    try {
        const batch = await Batch.findById(batchId);
        const students = batch.students;
        const filteredStudents = students.filter(
            (student) => student.email !== studentEmail
        );

        const updatedBatch = await Batch.findByIdAndUpdate(batchId, {
            students: filteredStudents,
        });

        res.status(201).json({
            message: "Student deleted successfully!",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting the student!",
        });
    }
};

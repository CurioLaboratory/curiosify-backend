const User = require('../../models/auth/User')
const Quiz = require('../../models/quiz/Quiz')
const Notification = require('../../models/notification/Notification')

exports.getAllQuiz = async (req, res) => {
    const { userId } = req.query;
    try {
        const quizzes = await Quiz.find({ createdBy: userId });
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching quiz questions' });
    }
}

exports.createManualQuiz = async (req, res) => {
    const { language, title, questions, classLevel,subject, date, createdBy, totalQuestions,collegeName } = req.body;

    // Validate the input fields
    if (!language || !title || !questions || !classLevel || !date || !createdBy||!subject) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);

    // Check if a quiz with the same title already exists
    const existingQuiz = await Quiz.findOne({ title });
    if (existingQuiz) {
        return res.status(203).json({ message: 'Quiz with this title already exists' });
    }

    // Create new quiz item
    const newQuizItem = new Quiz({
        language,
        title,
        questions,
        classLevel,
        subject,
        date,
        createdBy,
        totalQuestions,
        collegeName
    });

    try {
        // Save the new quiz
        await newQuizItem.save();

        // Fetch all users with the role "student" and collect their emails
        const students = await User.find({ role: 'student',classLevel:classLevel,collegeName:collegeName});
        const studentEmails = students.map(student => student.email); // Extract emails into an array

        // Create a single notification for all students
        const notification = new Notification({
            studentId: studentEmails, // Set studentId as an array of student emails
            itemId: newQuizItem._id, 
            type: 'quiz',
            message: `New quiz available on title: ${newQuizItem.title}`,
        });
        
        // Save the notification
        await notification.save();

        // Respond with success message
        res.status(201).json({ message: 'Quiz question added successfully and students notified!' });
    } catch (error) {
        res.status(500).json({ error: 'Error saving quiz question or sending notifications' });
    }
};

exports.deleteQuiz = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const user = await User.findById(userId);

    const quiz = await Quiz.findById(id);
    if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
    }
    if (quiz.createdBy !== user.email) {
        res.status(400).json({ message: "not the valid user" });
    }
    try {
        await Quiz.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Quiz deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.createAIquiz = async (req, res) => {
    const { language, title, questions, totalQuestions, createdBy, date,subject,classLevel,collegeName} = req.body;

    try {
        // Create a new quiz instance
        const newQuizItem = new Quiz({
            language,
            title,
            subject,
            questions,
            totalQuestions,
            createdBy,
            date,
            classLevel,
            collegeName
        });
        // Save the quiz to the database
        await newQuizItem.save();
         // Fetch all users with the role "student" and collect their emails
         const students = await User.find({ role: 'student',classLevel:classLevel,collegeName:collegeName});
         const studentEmails = students.map(student => student.email); // Extract emails into an array
 
         // Create a single notification for all students
         const notification = new Notification({
             studentId: studentEmails, // Set studentId as an array of student emails
             itemId: newQuizItem._id, 
             type: 'quiz',
             message: `New quiz available on title: ${newQuizItem.title}`,
         });
         
         // Save the notification
         await notification.save();
         res.status(201).json({ message: 'Quiz question added successfully and students notified!' });
        
    } catch (error) {
        console.error("Error saving quiz:", error); // Log the error for debugging
        res.status(500).json({ message: 'Error saving quiz question', error: error.message });
    }
}
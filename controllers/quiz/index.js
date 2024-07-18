const User = require('../../models/auth/User')
const Quiz = require('../../models/quiz/Quiz')

exports.getAllQuiz = async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching quiz questions' });
    }
}

exports.createManualQuiz = async (req, res) => {

    const { language, title, questions, classLevel, date, createdBy } = req.body;

    // console.log(req.body);
    if (!language || !title || !questions || !classLevel || !date || !createdBy) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    const userId = req.user.id;
    const user = await User.findById(userId);
    const existingQuiz = await Quiz.findOne({ title });
    if (existingQuiz) {
        return res.status(203).json({ message: 'Quiz with this title already exists' });
    }

    const newQuizItem = new Quiz({
        language,
        title,
        questions,
        classLevel,
        date,
        createdBy
    });
    try {
        await newQuizItem.save();
        res.status(201).json({ message: 'Quiz question added successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Error saving quiz question' });
    }
}

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
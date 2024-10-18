const Quiz = require('../../models/quiz/Quiz');
const StudentQuizAttendance = require('../../models/Student_quiz_attendance/Student_quiz_attendance');

exports.getActiveQuizzes = async (req, res) => {
    try {
        const classLevel = String(req.query.classLevel); 
        const collegeName = String(req.query.collegeName); 

        // Find all quiz IDs from StudentQuizAttendance for the logged-in user
        const attendedQuizRecords = await StudentQuizAttendance.find({ studentId: req.user.email }).select('quizId');

        // Extract the quizId values from the attendedQuizRecords
        const attendedQuizIds = attendedQuizRecords.map(record => record.quizId);

        // Find all quizzes where the _id is NOT in the attendedQuizIds and classLevel matches the user's classLevel
        const activeQuizzes = await Quiz.find({ 
            _id: { $nin: attendedQuizIds }, 
            classLevel: classLevel , // Filter by the user's classLevel and collegeName (as a string)
            collegeName:collegeName
        });

        // If no quizzes are found, log that information as well
        if (activeQuizzes.length === 0) {
            console.log("No quizzes found for classLevel:", classLevel);
        }

        // Return the active quizzes
        res.json(activeQuizzes);
    } catch (error) {
        // Handle any errors
        console.error("Error fetching active quizzes:", error);
        res.status(500).json({ error: 'Error fetching active quizzes' });
    }
};




exports.getCompletedQuizzes = async (req, res) => {
    try {
        // First, get all the completed quiz records for the student
        const completedQuizzesAttendance = await StudentQuizAttendance.find({
            studentId: req.user.email,
            status: 'completed'
        }).populate('quizId'); // Populating the quizId to retrieve the actual quiz object
        
        // If there are no completed quizzes, return an empty array
        if (!completedQuizzesAttendance || completedQuizzesAttendance.length === 0) {
            return res.json([]);
        }

        // Map over the completed quizzes attendance to fetch the corresponding quizzes from the Quiz model
        const completedQuizzes = await Promise.all(completedQuizzesAttendance.map(async (attendance) => {
            const quiz = await Quiz.findById(attendance.quizId);
            if (quiz) {
                return {
                    quiz, // Full quiz details
                    score: attendance.score, // Quiz score
                    userAnswers: attendance.userAnswers, // User's answers
                    questions: attendance.questions, // Questions stored in attendance
                    status: attendance.status // Quiz status (completed)
                };
            }
            return null;
        }));

        // Filter out any null values (in case any quiz was not found)
        const validQuizzes = completedQuizzes.filter(q => q !== null);

        res.json(validQuizzes);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching completed quizzes' });
    }
};


exports.getIncompleteQuizzes = async (req, res) => {
    try {
        const incompleteQuizzes = await StudentQuizAttendance.find({ studentId: req.user.email, status: 'incomplete' }).populate('quizId');
        res.json(incompleteQuizzes);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching incomplete quizzes' });
    }
};

exports.getCompletedQuizzes = async (req, res) => {
    try {
        // First, get all the completed quiz records for the student
        const completedQuizzesAttendance = await StudentQuizAttendance.find({
            studentId: req.user.email,
            status: 'completed'
        }).populate('quizId'); // Populating the quizId to retrieve the actual quiz object
        
        // If there are no completed quizzes, return an empty array
        if (!completedQuizzesAttendance || completedQuizzesAttendance.length === 0) {
            return res.json([]);
        }

        // Map over the completed quizzes attendance to fetch the corresponding quizzes from the Quiz model
        const completedQuizzes = await Promise.all(completedQuizzesAttendance.map(async (attendance) => {
            const quiz = await Quiz.findById(attendance.quizId);
            if (quiz) {
                return {
                    quiz, // Full quiz details
                    score: attendance.score, // Quiz score
                    userAnswers: attendance.userAnswers, // User's answers
                    questions: attendance.questions, // Questions stored in attendance
                    status: attendance.status // Quiz status (completed)
                };
            }
            return null;
        }));

        // Filter out any null values (in case any quiz was not found)
        const validQuizzes = completedQuizzes.filter(q => q !== null);

        res.json(validQuizzes);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching completed quizzes' });
    }
};


exports.submitQuiz = async (req, res) => {
    const { quizId, userAnswers, score,questions } = req.body;
    if (!quizId || !Array.isArray(userAnswers)) {
        return res.status(400).json({ error: 'Quiz ID and answers are required' });
    }
  
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
    }
   
    const answeredQuestions = userAnswers.filter(answer => answer !== null);

    // Now check if the number of answered questions matches the total number of questions
    const isCompleted = answeredQuestions.length === quiz.totalQuestions;
    const status = isCompleted ? 'completed' : 'incomplete';

    try {
        await StudentQuizAttendance.updateOne(
            { studentId: req.user.email, quizId: quizId },
            { studentId: req.user.email, quizId, userAnswers,questions, score, status},
            { upsert: true } // Create if it does not exist
        );
        res.status(200).json({ message: 'Quiz submitted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error saving quiz attempt' });
    }
};

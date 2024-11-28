const User = require("../../models/auth/User");
const Quiz = require("../../models/quiz/Quiz");
const Notification = require("../../models/notification/Notification");
const fs = require("fs");
const pdf = require("pdf-parse");
const { OpenAI } = require("openai");

exports.getAllQuiz = async (req, res) => {
  const { userId } = req.query;
  try {
    const quizzes = await Quiz.find({ createdBy: userId });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: "Error fetching quiz questions" });
  }
};

exports.createManualQuiz = async (req, res) => {
  const {
    language,
    title,
    questions,
    classLevel,
    subject,
    date,
    createdBy,
    totalQuestions,
    collegeName,
  } = req.body;

  // Validate the input fields
  if (
    !language ||
    !title ||
    !questions ||
    !classLevel ||
    !date ||
    !createdBy ||
    !subject
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const userId = req.user.id;
  const user = await User.findById(userId);

  // Check if a quiz with the same title already exists
  const existingQuiz = await Quiz.findOne({ title });
  if (existingQuiz) {
    return res
      .status(203)
      .json({ message: "Quiz with this title already exists" });
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
    collegeName,
  });

  try {
    // Save the new quiz
    const addedquiz = await newQuizItem.save();

    // Fetch all users with the role "student" and collect their emails
    const students = await User.find({
      role: "student",
      classLevel: classLevel,
      collegeName: collegeName,
    });
    const studentEmails = students.map((student) => student.email); // Extract emails into an array

    // Create a single notification for all students
    const notification = new Notification({
      studentId: studentEmails, // Set studentId as an array of student emails
      itemId: newQuizItem._id,
      type: "quiz",
      message: `New quiz available on title: ${newQuizItem.title}`,
    });

    // Save the notification
    await notification.save();

    // Respond with success message
    res.status(201).json({
      message: "Quiz question added successfully and students notified!",
      addedQuiz: addedquiz,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error saving quiz question or sending notifications" });
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
    res
      .status(200)
      .json({ success: true, message: "Quiz deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createAIquiz = async (req, res) => {
  const {
    language,
    title,
    questions,
    totalQuestions,
    createdBy,
    date,
    subject,
    classLevel,
    collegeName,
  } = req.body;

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
      collegeName,
    });
    // Save the quiz to the database
    const addedQuiz = await newQuizItem.save();
    // Fetch all users with the role "student" and collect their emails
    const students = await User.find({
      role: "student",
      classLevel: classLevel,
      collegeName: collegeName,
    });
    const studentEmails = students.map((student) => student.email); // Extract emails into an array

    // Create a single notification for all students
    const notification = new Notification({
      studentId: studentEmails, // Set studentId as an array of student emails
      itemId: newQuizItem._id,
      type: "quiz",
      message: `New quiz available on title: ${newQuizItem.title}`,
    });

    // Save the notification
    await notification.save();
    res.status(201).json({
      message: "Quiz question added successfully and students notified!",
      addedQuiz: addedQuiz,
    });
  } catch (error) {
    console.error("Error saving quiz:", error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Error saving quiz question", error: error.message });
  }
};

// genrate quiz using AI

exports.genrateAIquize = async (req, res) => {
  const {
    title,
    questionType,
    numberOfQuestions,
    level,
    startPage,
    endPage,
    pdfPath,
  } = req.body;

  if (!title || !questionType || !numberOfQuestions || !level || !pdfPath) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    console.log("apikey", process.env.OPENAI_API);
    const pdfData = fs.readFileSync(pdfPath);
    const parsedPdf = await pdf(pdfData);
    const pdfText = parsedPdf.text;
    let pagesText = pdfText;
    if (startPage && endPage) {
      const pages = pdfText.split("\n"); 
      pagesText = pages.slice(startPage - 1, endPage).join("\n");
    }
    const prompt = `
      You are a quiz generator. Based on the following text, generate ${numberOfQuestions} ${questionType} questions for a quiz at the ${level} level.

      Text:
      ${pagesText}
    `;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API, 
    });

    const aiResponse = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates quiz questions.",
        },
        { role: "user", content: prompt },
      ],
      model: "gpt-4",
    });

    let generatedQuestions = aiResponse.choices[0].message.content.trim();
    console.log("question", generatedQuestions);
    const parsedQuestions = generatedQuestions
      .split(/\n{2,}/) 
      .map((questionBlock) => {
        const lines = questionBlock.split("\n"); 
        const questionText = lines[0].trim(); 
        const options = lines.slice(1).map((option) => option.trim());
        return {
          question: questionText,
          options: options,
        };
      });
   // console.log("Formatted Questions:", parsedQuestions);
    res.status(201).json({
      message: "Quiz generated successfully!",
      generatedQuestions: parsedQuestions,
    });
  } catch (error) {
    console.error("Error generating quiz:", error);
    res.status(500).json({
      message: "Error generating quiz questions or sending notifications",
      error: error.message,
    });
  }
};

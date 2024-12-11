const User = require("../../models/auth/User");
const Quiz = require("../../models/quiz/Quiz");
const Notification = require("../../models/notification/Notification");
const fs = require("fs");
const pdf = require("pdf-parse");
const { OpenAI } = require("openai");
const { PDFDocument } = require("pdf-lib");
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
exports.generateAIQuiz = async (req, res) => {
  const { title, questionType, numberOfQuestions, level, startPage, endPage } =
    req.body;
  console.log("body", req.body);

  if (!title || !questionType || !numberOfQuestions || !level) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const pdfBuffer = req.file.buffer;
    const parsedPdf = await pdf(pdfBuffer);
    const pdfText = parsedPdf.text;
    let pagesText = pdfText;

    if (startPage && endPage) {
      const pages = pdfText.split("\n");
      pagesText = pages.slice(startPage - 1, endPage).join("\n");
    }
    console.log("type", questionType);
    const quizLevel = level || "easy";
    const prompt = `
    You are a quiz generator. Generate ${numQuestions} questions strictly based on the following parameters:
    - Title: ${title}
    - Text: ${pagesText}
    - Difficulty Level: ${quizLevel}
    - Question Type: ${questionType}

    Response format must always follow the specified JSON structure for each question type:

      For Multiple Single Choice questions:
      {
        "question": "The question text here",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct_answer": "The correct option here",
        questionType: "Multiple Single Choice"
      }

      For True/False questions:
      {
        "question": "The question text here",
        "options": [],
        "correct_answer": "True/False",
        questionType: "True/False"
      }

      For Formula Based questions:
      {
        "question": "The question text here",
        "options": [],
        "correct_answer": "The explanation of the answer",
         questionType: "Formula Based"
      }

      For Mixed Questions:
      A combination of questions should strictly adhere to the above formats for their respective types.

      Ensure the entire response is a valid JSON array of question objects, and do not include any additional text outside of the JSON format.
`;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API,
    });

    const aiResponse = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates quiz questions. and dont write anything just write question and option and answer",
        },
        { role: "user", content: prompt },
      ],
      model: "gpt-4",
    });

    let generatedQuestions = aiResponse.choices[0].message.content.trim();
    res.status(201).json({
      message: "Quiz generated successfully!",
      generatedQuestions: JSON.parse(generatedQuestions),
    });
    
  } catch (error) {
    console.error("Error generating quiz:", error);
    res.status(500).json({
      message: "Error generating quiz questions",
      error: error.message,
    });
  }
};
// text/ai
exports.generateQuizBasedOnTopic = async (req, res) => {
  const {
    language,
    title,
    subject,
    topic,
    questionType,
    level,
    numberOfQuestions,
  } = req.body;

  if (!title || !questionType || !numberOfQuestions || !topic || !language) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const quizLevel = level || "easy";

  try {
    const prompt = `
      You are a quiz generator. Generate ${numberOfQuestions} questions strictly based on the following parameters:
      - Title: "${title}"
      - Topic: "${topic}"
      - Subject: "${subject}"
      - Language: "${language}"
      - Difficulty Level: "${quizLevel}"
      - Question Type: "${questionType}"

      Response format must always follow the specified JSON structure for each question type:

      For Multiple Single Choice questions:
      {
        "question": "The question text here",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct_answer": "The correct option here",
        questionType: "Multiple Single Choice"
      }

      For True/False questions:
      {
        "question": "The question text here",
        "options": [],
        "correct_answer": "True/False",
        questionType: "True/False"
      }

      For Formula Based questions:
      {
        "question": "The question text here",
        "options": [],
        "correct_answer": "The explanation of the answer",
         questionType: "Formula Based"
      }

      For Mixed Questions:
      A combination of questions should strictly adhere to the above formats for their respective types.

      Ensure the entire response is a valid JSON array of question objects, and do not include any additional text outside of the JSON format.
    `;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API,
    });

    const aiResponse = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates quiz questions in strict JSON format.",
        },
        { role: "user", content: prompt },
      ],
      model: "gpt-4",
    });

    let generatedQuestions = aiResponse.choices[0].message.content.trim();

    // Parse the GPT response to ensure it's valid JSON
    const parsedQuestions = JSON.parse(generatedQuestions);

    res.status(201).json({
      message: "Quiz generated successfully!",
      generatedQuestions: parsedQuestions,
    });
  } catch (error) {
    console.error("Error generating quiz:", error);
    res.status(500).json({
      message: "Error generating quiz questions",
      error: error.message,
    });
  }
};

exports.downloadQuestionsPDF = async (req, res) => {
  try {
    const { questions } = req.body; // Extract questions array from the request body

    if (!Array.isArray(questions) || questions.length === 0) {
      return res
        .status(400)
        .send("Questions array is required and cannot be empty");
    }

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const pageWidth = 600;
    const pageHeight = 800;
    const fontSize = 12;
    const margin = 50;

    // Helper to add text with word wrap
    const addTextWithWordWrap = (
      page,
      text,
      x,
      y,
      maxWidth,
      fontSize,
      lineHeight
    ) => {
      const words = text.split(" ");
      let line = "";
      const lines = [];

      for (const word of words) {
        const testLine = line ? `${line} ${word}` : word;
        const testLineWidth = testLine.length * fontSize * 0.5; // Approximate width

        if (testLineWidth > maxWidth) {
          lines.push(line);
          line = word;
        } else {
          line = testLine;
        }
      }
      if (line) lines.push(line);

      lines.forEach((lineText) => {
        page.drawText(lineText, { x, y, size: fontSize });
        y -= lineHeight;
      });

      return y;
    };

    // Loop through questions and add them to pages
    let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;
    let i = 1;
    for (const { question, options, correctAnswer } of questions) {
      // Add question text

      y = addTextWithWordWrap(
        currentPage,
        `Q${i}: ${question}`,
        margin,
        y,
        pageWidth - 2 * margin,
        fontSize,
        fontSize * 1.5
      );
      i++;
      // Add options
      for (const [index, option] of options.entries()) {
        const optionText = `${String.fromCharCode(97 + index)}) ${option}`;
        y = addTextWithWordWrap(
          currentPage,
          optionText,
          margin + 20,
          y,
          pageWidth - 2 * margin - 20,
          fontSize,
          fontSize * 1.5
        );
      }

      // Add a blank line after each question
      y -= fontSize * 1.5;

      // Create a new page if there's no space left on the current page
      if (y < margin + fontSize * 1.5) {
        currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
    }

    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();

    // Set response headers to download the file
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="questions.pdf"'
    );
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    res.status(500).send("Error generating PDF");
  }
};

exports.genrateImagesQuestion = async (req, res) => {
  const { prompt, size = "1024x1024" } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API,
    });
    // Generate image using OpenAI
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    console.log("response", response);
    // Extract the image URL
    console.log("data", response.data);
    const imageUrl = response.data[0].url;
    res.status(200).json({ image_url: imageUrl });
  } catch (error) {
    console.error("Error generating image:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.genrateFlashCard = async (req, res) => {
  try {
    const {
      language,
      deckname,
      subject,
      studyType,
      numberofQuestion,
      Class,
      startPage,
      endPage,
    } = req.body;
    const pdfBuffer = req.file.buffer;
    const parsedPdf = await pdf(pdfBuffer);
    const pdfText = parsedPdf.text;
    let pagesText = pdfText;

    if (startPage && endPage) {
      const pages = pdfText.split("\n");
      pagesText = pages.slice(startPage - 1, endPage).join("\n");
    }

    const flashcards = await generateFlashcardsWithAIUsingPDF(
      pagesText,
      studyType,
      numberofQuestion
    );

    // Return the flashcards
    return res.status(200).json({
      deckname,
      subject,
      language,
      Class,
      studyType,
      numberOfFlashcards: flashcards.length,
      flashcards,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while generating flashcards" });
  }
};

async function generateFlashcardsWithAIUsingPDF(
  text,
  studyType,
  numberofQuestion
) {
  const prompt = `
You are an expert in creating educational flashcards. Based on the text below, generate ${numberofQuestion} flashcards in the format appropriate for ${studyType}:
TEXT:
"""
${text}
"""
FORMAT:
[
  { "question": "Question 1", "answer": "Answer 1" },
  { "question": "Question 2", "answer": "Answer 2" },
  ...
]
  `;
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API,
  });
  console.log("prompt length", prompt.length);
  const aiResponse = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that generates flashcard  with answers.",
      },
      { role: "user", content: prompt },
    ],
    model: "gpt-4",
  });

  const result = aiResponse.choices[0].message.content.trim();

  // Parse the JSON response
  try {
    return JSON.parse(result);
  } catch (error) {
    console.error("Error parsing OpenAI response:", error);
    throw new Error("Failed to generate flashcards.");
  }
}

exports.genrateFlashCardUsingText = async (req, res) => {
  try {
    const {
      language,
      deckname,
      topic,
      level,
      subject,
      studyType,
      numberofQuestion,
      Class,
    } = req.body;

    const flashcards = await generateFlashcardsWithAIUsingText(
      topic,
      level,
      studyType,
      numberofQuestion
    );

    // Return the flashcards
    return res.status(200).json({
      deckname,
      subject,
      language,
      Class,
      studyType,
      numberOfFlashcards: flashcards.length,
      flashcards,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while generating flashcards" });
  }
};

async function generateFlashcardsWithAIUsingText(
  topic,
  level,
  studyType,
  numberofQuestion
) {
  const prompt = `
You are an expert in creating educational flashcards. Based on the topic below, generate ${numberofQuestion} flashcards in the format appropriate for ${studyType} of level ${level}:
Topic:
"""
${topic}
"""
FORMAT:
[
  { "question": "Question 1", "answer": "Answer 1" },
  { "question": "Question 2", "answer": "Answer 2" },
  ...
]
  `;
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API,
  });
  // console.log("prompt length", prompt.length);
  const aiResponse = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that generates flashcard  with answers.",
      },
      { role: "user", content: prompt },
    ],
    model: "gpt-4",
  });

  const result = aiResponse.choices[0].message.content.trim();

  // Parse the JSON response
  try {
    return JSON.parse(result);
  } catch (error) {
    console.error("Error parsing OpenAI response:", error);
    throw new Error("Failed to generate flashcards.");
  }
}

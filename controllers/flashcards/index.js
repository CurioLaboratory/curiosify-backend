const Flashcard = require("../../models/flashcards/Flashcard");
const fs = require("fs");
const pdf = require("pdf-parse");
const { OpenAI } = require("openai");
const { PDFDocument } = require("pdf-lib");
exports.createManual = async (req, res) => {
  try {
      const {
          deckname,
          numberOfQues,
          tags,
          createdAt,
          studyType,
          targetClass,
          questions, // Now expects an array of questions with options and answers
      } = req.body;

      const newFlashcard = new Flashcard({
          deckname,
          numberOfQues,
          createdAt,
          lastAttempted: "NA",
          lastAttemptScore: "NA",
          studyType,
          targetClass,
          questions, // Populate questions directly
      });

      await newFlashcard.save();

      res.status(201).json({
          message: "Flashcard created successfully",
          flashcard: newFlashcard,
      });
  } catch (error) {
      console.error("Error creating flashcard:", error);
      res.status(500).json({
          message: "Error creating manual flashcard",
      });
  }
};

exports.getAllFlashcards = async (req, res) => {
  try {
      const flashcards = await Flashcard.find();
      res.status(200).json(flashcards);
  } catch (error) {
      console.error("Error fetching flashcards:", error);
      res.status(500).json({
          message: "Error fetching flashcards",
      });
  }
};

exports.deleteMany = async (req, res) => {
    try {
        const { deleteIds } = req.body;
        if (deleteIds?.length !== 0) {
            for (let i = 0; i < deleteIds.length; i++) {
                let deletedFlashcard = await Flashcard.findByIdAndDelete(deleteIds[i]);
            }

            res.status(200).json({
                message: ""
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Error in deleting the flashcards!",
        });
    }
};

// upload
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
  Ensure the entire response is a valid JSON array of question objects, and do not include any additional text outside of the JSON format.  
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
  // using Auto
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
    Ensure the entire response is a valid JSON array of question objects, and do not include any additional text outside of the JSON format.
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
  
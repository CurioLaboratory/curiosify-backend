const express = require("express");
const { OpenAI } = require("openai");
const pdf = require("pdf-parse");
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API,
});

const extractTextFromPDF = async (pdfBuffer) => {
  const data = await pdf(pdfBuffer);
  return data.text;
};

const generateAssignment = async ({
  assignmentType,
  grading,
  learningObjectives,
  language,
}) => {
  const prompt = `
Generate a ${assignmentType} assignment in ${language} with the following details:

Learning Objectives: ${learningObjectives}

Grading Criteria: ${grading}

The assignment must strictly follow this response structure:

{
    "Assignment Title": "Provide the title of the assignment.",
    "Objective": "Provide a detailed objective that outlines the purpose of the assignment.",
    "Grading": "Provide the grading criteria as a summary or an introductory statement.",
    "Instructions": [
        "Provide step-by-step instructions for the assignment, covering all required sections, including specific tasks students must complete.",
    ]
}

Ensure the response is in valid JSON format and includes all the specified fields with appropriate details.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an expert in educational content creation.",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 1500,
  });

  if (!response || !response.choices[0].message.content) {
    throw new Error("Failed to generate assignment.");
  }

  const assignmentText = response.choices[0].message.content.trim();
  return JSON.parse(assignmentText);
};

exports.createAssignment = async (req, res) => {
  try {
    const { assignmentType, grading, learningObjectives, language } = req.body;
    let extractedLearningObjectives = learningObjectives;

    // Check if a file is uploaded and extract text
    if (req.file) {
      const pdfBuffer = req.file.buffer;
      const extractedText = await extractTextFromPDF(pdfBuffer);
      extractedLearningObjectives += `\n\n${extractedText}`;
    }

    // Generate assignment using OpenAI
    const assignment = await generateAssignment({
      assignmentType,
      grading,
      learningObjectives: extractedLearningObjectives,
      language,
    });

    res.status(200).json(assignment);
  } catch (error) {
    console.error("Error creating assignment:", error);
    res
      .status(500)
      .json({ error: "Failed to create assignment. Please try again." });
  }
};

const generateCourseContent = async ({
  subject,
  learningObjectives,
  language,
}) => {
  const prompt = `
Generate a detailed course structure in ${language} for the subject '${subject}' with the following learning objectives:\n\n${learningObjectives}.\n
The course structure should be organized into chapters and modules. Each chapter must have a title, and each module within the chapter should include a name and an explanation. 

Response format must always strictly follow the specified JSON structure below and there can be any number of chapters and any number of modules inside each chapter:

[
  {
    Chapter: "chapter title",
    Modules: [
      {
        Name: "module name",
        Explanation: "module explanation",
      },
      {
        Name: "module name",
        Explanation: "module explanation",
      }
    ],
  },
  {
    Chapter: "chapter title",
    Modules: [
      {
        Name: "module name",
        Explanation: "module explanation",
      },
      {
        Name: "module name",
        Explanation: "module explanation",
      }
    ],
  }
]

Ensure the output is valid JSON and adheres to this format.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are an expert in course design." },
      { role: "user", content: prompt },
    ],
    max_tokens: 2000,
  });

  if (!response || !response.choices[0].message.content) {
    throw new Error("Failed to generate course content.");
  }
  const generatedCourse = response.choices[0].message.content;
  return JSON.parse(generatedCourse);
};
exports.createCourse = async (req, res) => {
  try {
    const { subject, learningObjectives, language } = req.body;
    let finalLearningObjectives = learningObjectives;

    // Check if a file is uploaded and extract text
    if (req.file) {
      const pdfBuffer = req.file.buffer;
      const extractedText = await extractTextFromPDF(pdfBuffer);
      finalLearningObjectives += `\n\n${extractedText}`;
    }

    // Generate course using OpenAI
    const courseContent = await generateCourseContent({
      subject,
      learningObjectives: finalLearningObjectives,
      language,
    });

    res.status(200).json({
      message: "Course successfully generated.",
      course: courseContent,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res
      .status(500)
      .json({ error: "Failed to create course. Please try again." });
  }
};

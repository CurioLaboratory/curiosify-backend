const Chapter = require("../../models/createCourse/CreateCourse");

// Controller to save chapter data
exports.saveChapterData = async (req, res) => {
    try {
      // Extract data from the request body
      const data = req.body; // Make sure the request body contains the JSON data
  
      // Save the data using insertMany to handle multiple chapters at once
      const savedChapters = await Chapter.insertMany(data);
  
      // Respond with success message and the saved data
      res.status(201).json({
        message: 'Chapters saved successfully!',
        savedChapters
      });
    } catch (error) {
      // Handle errors during the saving process
      console.error('Error saving chapters:', error);
      res.status(500).json({ message: 'An error occurred while saving chapters', error });
    }
  };
  
  
  
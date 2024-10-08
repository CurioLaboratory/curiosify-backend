const Chapter = require("../../models/createCourse/CreateCourse");
// Change to match the correct case of the filename
const CreateAssignment = require("../../models/createCourse/createAssignment");

// Controller to save chapter data
exports.saveChapterData = async (req, res) => {
  try {
    const courseData = req.body; // Expecting one course object with chapters array

    // Save the course as one document
    const {newCourse,createdBy }= new Chapter({
      Chapters: courseData,
      createdBy:createdBy
    });

    const savedCourse = await newCourse.save();

    res.status(201).json({
      message: 'Course added successfully!',
      data: savedCourse
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error adding course',
      error: error.message
    });
  }
  };

  exports.saveAssignmentData=async (req,res) =>{
    try {
      const { assignmentTitle, assignmentObjective, assignmentGrading, Instructions, createdBy } = req.body;
  
      // Create a new Assignment instance
      const newAssignment = new CreateAssignment({
        assignmentTitle,
        assignmentObjective,
        assignmentGrading,
        Instructions,
        createdBy
      });
  
      // Save the assignment to the database
      await newAssignment.save();
  
      res.status(201).json(newAssignment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  
  
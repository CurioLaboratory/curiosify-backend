const QuizPerformance = require('../../models/quizperformance/Quizperformance');

exports.updateOrAddSubjectScore = async (req, res) => {
    const { userId, email, subjectName, score } = req.body;
  
    try {
      let performance = await QuizPerformance.findOne({ email });
  
      if (performance) {
        // Check if the subject already exists in the subjects array
        const subjectIndex = performance.subjects.findIndex(subject => subject.name === subjectName);
  
        if (subjectIndex > -1) {
          // Update the existing subject's score
          performance.subjects[subjectIndex].score = score;
        } else {
          // Add a new subject with its score
          performance.subjects.push({ name: subjectName, score });
        }
  
        // Update the date field to reflect the update time
        performance.date = Date.now();
  
        await performance.save();
        res.status(200).json({ message: 'Performance updated successfully' });
      } else {
        // Create a new record if none exists for the user
        const newPerformance = new QuizPerformance({
          userId, // Storing userId as per your schema
          email,
          subjects: [{ name: subjectName, score }], // Add the first subject and score
          date: Date.now(), // Set the creation date
        });
  
        await newPerformance.save();
        res.status(200).json({ message: 'New performance created successfully' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

  exports.getStudentperformancedetails = async (req, res) => {
    try {
      const studentPerformanceDetail = await QuizPerformance.find({ email: req.user.email });
  
      if (studentPerformanceDetail.length === 0) {
        return res.status(200).json([]);
      }
  
      // Extract subjects from each performance record and flatten the array
      const subjectsArray = studentPerformanceDetail.flatMap(performance => performance.subjects);
  
      res.status(200).json(subjectsArray);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching student performance detail' });
    }
  };
  
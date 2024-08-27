const Flashcard = require("../../models/flashcards/Flashcard");

exports.createManual = async (req, res) => {
    try {
        const {
            deckname,
            numberOfQues,
            tags,
            createdAt,
            studyType,
            targetClass,
            question,
            answer,
        } = req.body;
        const newFlashcard = new Flashcard({
            deckname,
            numberOfQues,
            tags,
            createdAt,
            lastAttempted: "NA",
            lastAttemptScore: "NA",
            studyType,
            targetClass,
            question,
            answer,
        });

        await newFlashcard.save();
        res.status(201).json(newFlashcard);
    } catch (error) {
        res.status(500).json({
            message: "Error creating manual flashcard",
        });
    }
};

exports.getAllFlashcards = async (req, res) => {
    try {
        const flashcards = await Flashcard.find();
        res.status(200).json({
            flashcards,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching all flashcards",
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

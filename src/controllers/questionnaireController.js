import Questionnaire from '../models/Questionnaire.js';
import Response from "../models/Response.js";

export const createQuestionnaire = async (req, res) => {
    try {
        const { name, description, questions } = req.body;
        const newQuestionnaire = new Questionnaire({ name, description, questions });
        await newQuestionnaire.save();
        res.status(201).json(newQuestionnaire);
    } catch (error) {
        res.status(500).json({ message: 'Error creating questionnaire', error });
    }
};

export const getAllQuestionnaires = async (req, res) => {
    try {
        const { sortBy } = req.query;
        const sortOptions = {};

        switch (sortBy) {
            case 'name':
                sortOptions.name = 1;
                break;
            case 'questions':
                const questionnaires = await Questionnaire.find();

                questionnaires.sort((b, a) => a.questions.length - b.questions.length);

                return res.status(200).json(questionnaires);
            case 'completions':
                const questionnairesByCompletions = await Questionnaire.aggregate([
                    {
                        $lookup: {
                            from: 'responses',
                            localField: '_id',
                            foreignField: 'questionnaire_id',
                            as: 'responses',
                        },
                    },
                    {
                        $addFields: {
                            totalCompletions: { $size: '$responses' },
                        },
                    },
                    {
                        $sort: { totalCompletions: -1 },
                    },
                    {
                        $project: { responses: 0 },
                    },
                ]);
                return res.status(200).json(questionnairesByCompletions);
            default:
                sortOptions.name = 1; 
        }

        const questionnaires = await Questionnaire.find().sort(sortOptions);
        res.status(200).json(questionnaires);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching questionnaires', error });
    }
};

export const getQuestionnaireById = async (req, res) => {
    try {
        const questionnaire = await Questionnaire.findById(req.params.id);
        if (!questionnaire) return res.status(404).json({ message: 'Questionnaire not found' });
        res.status(200).json(questionnaire);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching questionnaire', error });
    }
};

export const updateQuestionnaire = async (req, res) => {
    try {
        const updatedQuestionnaire = await Questionnaire.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedQuestionnaire);
    } catch (error) {
        res.status(500).json({ message: 'Error updating questionnaire', error });
    }
};

export const deleteQuestionnaire = async (req, res) => {
    try {
        await Questionnaire.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Questionnaire deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting questionnaire', error });
    }
};

export const submitResponse = async (req, res) => {
    try {
        const { id } = req.params;
        const { answers, completion_time } = req.body;

        const user_id = req.userId;

        if (!answers || !completion_time) {
            return res.status(400).json({ message: "Invalid request body" });
        }

        const questionnaire = await Questionnaire.findById(id);
        if (!questionnaire) return res.status(404).json({ message: "Questionnaire not found" });

        const newResponse = new Response({
            questionnaire_id: id,
            user_id,
            answers,
            completion_time
        });

        await newResponse.save();
        res.status(200).json({ message: "Response submitted successfully" });

    } catch (error) {
        console.error("Error submitting response:", error);
        res.status(500).json({ message: "Error submitting response", error: error.message });
    }
};

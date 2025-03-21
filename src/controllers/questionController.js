import Questionnaire from '../../src/models/Questionnaire.js';

export const addQuestion = async (req, res) => {
    try {
        const { questionnaireId, question } = req.body;
        const questionnaire = await Questionnaire.findById(questionnaireId);
        if (!questionnaire) return res.status(404).json({ message: 'Questionnaire not found' });

        questionnaire.questions.push(question);
        await questionnaire.save();
        res.status(201).json(questionnaire);
    } catch (error) {
        res.status(500).json({ message: 'Error adding question', error });
    }
};
    
export const deleteQuestion = async (req, res) => {
    try {
        const { questionnaireId, questionId } = req.params;
        const questionnaire = await Questionnaire.findById(questionnaireId);
        if (!questionnaire) return res.status(404).json({ message: 'Questionnaire not found' });

        questionnaire.questions = questionnaire.questions.filter(q => q._id.toString() !== questionId);
        await questionnaire.save();
        res.status(200).json(questionnaire);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting question', error });
    }
};

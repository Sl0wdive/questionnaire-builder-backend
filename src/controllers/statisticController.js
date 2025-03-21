import Response from '../models/Response.js';

export const getQuestionnaireStatistics = async (req, res) => {
    try {
        const { id } = req.params;
        const responses = await Response.find({ questionnaire_id: id });

        const totalCompletions = responses.length;
        const averageTime = responses.reduce((sum, r) => sum + r.completion_time, 0) / totalCompletions;

        res.status(200).json({ totalCompletions, averageTime });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching statistics', error });
    }
};

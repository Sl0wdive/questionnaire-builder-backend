import SubmissionModel from '../models/Submission.js';

export const getQuestionnaireStatistics = async (req, res) => {
	try {
		const { id } = req.params;
		const submission = await SubmissionModel.find({ questionnaire_id: id });

		const totalCompletions = submission.length;
		const averageTime = submission.reduce((sum, r) => sum + r.completion_time, 0) / totalCompletions;

		res.status(200).json({ totalCompletions, averageTime });
	} catch (error) {
		res.status(500).json({ message: 'Error fetching statistics', error });
	}
};

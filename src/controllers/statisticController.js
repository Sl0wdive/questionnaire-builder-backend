import { StatisticService } from "../services/statisticService.js";

export const getQuestionnaireStatistics = async (req, res) => {
	try {
		const stats = await StatisticService.getById(req.params.id);

		res.status(200).json(stats);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching statistics', error });
	}
};

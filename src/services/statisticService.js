import SubmissionModel from '../models/Submission.js';

export class StatisticService {

    static getById = async (id) => {
        const submission = await SubmissionModel.find({ questionnaire_id: id });

        const totalCompletions = submission.length;
        const averageTime = submission.reduce((sum, r) => sum + r.completion_time, 0) / totalCompletions;

        return ({ totalCompletions, averageTime });
    };
};

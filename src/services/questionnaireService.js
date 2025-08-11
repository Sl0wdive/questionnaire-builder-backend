import QuestionnaireModel from '../models/Questionnaire.js';
import SubmissionModel from '../models/Submission.js';
import UserModel from '../models/User.js';

export class QuestionnaireService {
	static create = async (userId, { name, description, questions }) => {
		const creator = await UserModel.findById(userId);
		if (!creator) throw { status: 404, message: 'User not found' };

		const newQuestionnaire = new QuestionnaireModel({ creator, name, description, questions });
		await newQuestionnaire.save();
		return newQuestionnaire;
	};


	static getAll = async ({ sortBy, page = 1, limit = 9 }) => {
		const pageInt = parseInt(page);
		const limitInt = parseInt(limit);
		const skip = (pageInt - 1) * limitInt;

		const sortOptions = {};

		switch (sortBy) {
			case 'name':
				sortOptions.name = 1;
				break;
			case 'questions': {
				const questionnaires = await QuestionnaireModel.find().populate('creator', 'fullName');
				questionnaires.sort((b, a) => a.questions.length - b.questions.length);
				return questionnaires.slice(skip, skip + limitInt);
			}
			case 'completions': {
				const questionnairesByCompletions = await QuestionnaireModel.aggregate([
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
						}
					},
					{ $sort: { totalCompletions: -1 } },
					{ $project: { responses: 0 } },
					{ $skip: skip },
					{ $limit: limitInt },
					{
						$lookup: {
							from: 'users',
							localField: 'creator',
							foreignField: '_id',
							as: 'creator',
						},
					},
					{ $unwind: '$creator' },
					{
						$addFields: {
							creator: {
								_id: '$creator._id',
								fullName: '$creator.fullName',
							}
						}
					}
				]);
				return questionnairesByCompletions;
			}
			default:
				sortOptions.name = 1;
		}
		const questionnaires = await QuestionnaireModel.find()
			.sort(sortOptions)
			.skip(skip)
			.limit(limitInt)
			.populate('creator', 'fullName');

		return questionnaires;
	}


	static getById = async (questionnaire_id) => {
		const questionnaire = await QuestionnaireModel.findById(questionnaire_id);

		if (!questionnaire) throw { status: 404, message: 'Questionnaire not found' };

		return questionnaire;
	}

	static update = async (questionnaire_id, { name, description, questions }) => {
		const questionnaire = await QuestionnaireModel.findByIdAndUpdate(questionnaire_id, { name, description, questions }, { new: true });

		if (!questionnaire) throw { status: 404, message: 'Questionnaire not found' };

		return questionnaire;
	}

	static delete = async (questionnaire_id) => {
		const questionnaire = await QuestionnaireModel.findByIdAndDelete(questionnaire_id);

		if (!questionnaire) throw { status: 404, message: 'Questionnaire not found' };

		return questionnaire;
	}

	static submit = async (questionnaire_id, user_id, answers, completion_time) => {
		if (!answers || !completion_time) {
			return res.status(400).json({ message: "Invalid request body" });
		}

		const questionnaire = await QuestionnaireModel.findById(questionnaire_id);
		if (!questionnaire) return res.status(404).json({ message: "Questionnaire not found" });

		const newSubmission = new SubmissionModel({
			questionnaire_id,
			user_id,
			answers,
			completion_time
		});

		await newSubmission.save();

		return newSubmission;
	}
}
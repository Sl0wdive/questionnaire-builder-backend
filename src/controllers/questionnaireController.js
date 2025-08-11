import Questionnaire from '../models/Questionnaire.js';
import SubmissionModel from "../models/Submission.js";
import { QuestionnaireService } from '../services/questionnaireService.js';

export const createQuestionnaire = async (req, res) => {
  try {
    const { name, description, questions } = req.body;
    const newQuestionnaire = await QuestionnaireService.create(req.userId, { name, description, questions });
    res.status(201).json(newQuestionnaire);
  } catch (error) {
    res.status(error.status || 500).json({ message: 'Error creating questionnaire' });
    console.log(error);
  }
};

export const getAllQuestionnaires = async (req, res) => {
  try {
    const data = await QuestionnaireService.getAll(req.query);
    res.status(200).json(data);
  } catch (error) {
    res.status(error.status || 500).json({ message: 'Error fetching questionnaires' })
  }
};

export const getQuestionnaireById = async (req, res) => {
  try {
    const questionnaire = await QuestionnaireService.getById(req.params.id);
    res.status(200).json(questionnaire);
  } catch (error) {
    res.status(error.status || 500).json({ message: 'Error fetching questionnaire' });
  }
};

export const updateQuestionnaire = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, questions } = req.body;
    const updatedQuestionnaire = await QuestionnaireService.update(id, { name, description, questions });
    res.status(200).json(updatedQuestionnaire);
  } catch (error) {
    res.status(error.status || 500).json({ message: 'Error updating questionnaire' });
  }
};

export const deleteQuestionnaire = async (req, res) => {
  try {
    const { id } = req.params;
    await QuestionnaireService.delete(id);
    res.status(200).json({ message: 'Questionnaire deleted' });
  } catch (error) {
    res.status(error.status || 500).json({ message: 'Error deleting questionnaire' });
  }
};

export const submitQuestionnaire = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers, completion_time } = req.body;
    const user_id = req.userId;

    const newSubmission = QuestionnaireService.submit(id, user_id, answers, completion_time);

    res.status(200).json({ message: "Response submitted successfully" });

  } catch (error) {
    res.status(error.status || 500).json({ message: "Error submitting response" });
  }
};

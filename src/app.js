import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';

import connectDB from './config/db.js';

import * as Validation from './validation/validation.js';
import * as UserController from './controllers/userController.js';
import * as QuestionnaireController from './controllers/questionnaireController.js';
import * as StatisticController from './controllers/statisticController.js'

import checkAuth from './middlewares/checkAuth.js';

connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		if (!fs.existsSync('uploads')) {
			fs.mkdirSync('uploads');
		}
		cb(null, 'uploads');
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage });

app.post('/auth/register', Validation.registerValidation, UserController.register);
app.post('/auth/login', Validation.loginValidation, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/uploads', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
});

app.post('/questionnaires', checkAuth, QuestionnaireController.createQuestionnaire);
app.get('/questionnaires', QuestionnaireController.getAllQuestionnaires);
app.get('/questionnaires/:id', QuestionnaireController.getQuestionnaireById);
app.patch('/questionnaires/:id', checkAuth, QuestionnaireController.updateQuestionnaire);
app.delete('/questionnaires/:id', checkAuth, QuestionnaireController.deleteQuestionnaire);

app.post('/questionnaires/:id/submit', QuestionnaireController.submitQuestionnaire);

app.get('/questionnaires/:id/statistic', StatisticController.getQuestionnaireStatistics);

export default app;
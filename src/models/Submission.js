import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema({
  questionnaire_id: { type: mongoose.Schema.Types.ObjectId, ref: "Questionnaire", required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  answers: [
    {
      question_id: { type: mongoose.Schema.Types.ObjectId, required: true },
      answer_text: { type: [String], default: [] },
      image_url: { type: String },
    }
  ],
  completion_time: { type: Number, required: true },
  submitted_at: { type: Date, default: Date.now }
});


export default mongoose.model("Submission", SubmissionSchema);

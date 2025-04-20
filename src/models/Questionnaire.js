import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question_text: { type: String, required: true },
  type: {
    type: String,
    enum: ["text", "single_choice", "multiple_choice", "image"],
    required: true
  },
  options: {
    type: [String],
    required: function () {
      return this.type === "single_choice" || this.type === "multiple_choice";
    }
  },
  image_required: { type: Boolean, default: false },
  image_url: { type: String },
});

const QuestionnaireSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  description: { type: String },
  questions: { type: [QuestionSchema], required: true },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("Questionnaire", QuestionnaireSchema);

import mongoose from "mongoose";

const fitnessEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    date: {
      type: Date,
      required: true,
      index: true
    },
    workoutType: {
      type: String,
      trim: true,
      maxlength: 80
    },
    durationMinutes: {
      type: Number,
      default: 0
    },
    caloriesBurned: {
      type: Number,
      default: 0
    },
    waterIntakeMl: {
      type: Number,
      default: 0
    },
    bodyWeightKg: {
      type: Number
    },
    mood: {
      type: String,
      trim: true,
      maxlength: 40
    },
    sleepHours: {
      type: Number
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 4000
    }
  },
  { timestamps: true }
);

fitnessEntrySchema.index({ userId: 1, date: 1 });

export const FitnessEntry = mongoose.model("FitnessEntry", fitnessEntrySchema);


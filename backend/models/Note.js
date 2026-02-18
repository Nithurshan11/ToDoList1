import mongoose from "mongoose";

const positionSchema = new mongoose.Schema(
  {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 }
  },
  { _id: false }
);

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    color: {
      type: String,
      default: "#FFD966" // sticky-note yellow
    },
    position: {
      type: positionSchema,
      default: undefined
    }
  },
  {
    timestamps: true
  }
);

export const Note = mongoose.model("Note", noteSchema);


import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pendind", "in-progress", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);

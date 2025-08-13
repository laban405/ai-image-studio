import { Schema, model, Document } from "mongoose";

export interface Project extends Document {
  name: string;
  userId: string;
  json: string;
  height: number;
  width: number;
  thumbnailUrl?: string;
  isTemplate?: boolean;
  isPro?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<Project>(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true },
    json: { type: String, required: true },
    height: { type: Number, required: true },
    width: { type: Number, required: true },
    thumbnailUrl: { type: String },
    isTemplate: { type: Boolean, default: false },
    isPro: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" }, 
    collection: "projects",
  }
);

export const ProjectModel = model<Project>("Project", projectSchema);

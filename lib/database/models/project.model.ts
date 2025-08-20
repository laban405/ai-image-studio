import { Schema, model, Document, Types,models } from "mongoose";

export interface Project extends Document {
  name: string;
  userId: string;
  thumbnailUrl?: string;
  isTemplate?: boolean;
  activeLayer?: Types.ObjectId; // Reference to Layer
  layerComparisonMode: boolean;
  comparedLayers: Types.ObjectId[]; // References to Layer
  version?: number;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<Project>(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true },
    thumbnailUrl: { type: String },
    isTemplate: { type: Boolean, default: false },
    activeLayer: { type: Schema.Types.ObjectId, ref: "Layer" },
    layerComparisonMode: { type: Boolean, default: false },
    comparedLayers: [{ type: Schema.Types.ObjectId, ref: "Layer" }],
    version: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

projectSchema.virtual("layers", {
  ref: "Layer",
  localField: "_id",
  foreignField: "projectId",
});

projectSchema.set("toObject", { virtuals: true });
projectSchema.set("toJSON", { virtuals: true });

const Project = models?.Project || model<Project>("Project", projectSchema);
 export default Project;

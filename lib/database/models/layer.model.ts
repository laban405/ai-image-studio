import { Schema, model, Document, Types, models } from "mongoose";

export interface Layer extends Document {
  projectId: Types.ObjectId;
  userId: string;
  name: string;
  format: string;
  height: number;
  width: number;
  url: string;
  publicId: string;
  resourceType: string;
}

const layerSchema = new Schema<Layer>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    userId: { type: String, required: true },
    name: { type: String, required: true },
    format: { type: String, required: false },
    height: { type: Number, required: true },
    width: { type: Number, required: true },
    url: { type: String, required: false },
    publicId: { type: String, required: false },
    resourceType: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Layer = models?.Layer || model<Layer>("Layer", layerSchema);
export default Layer;

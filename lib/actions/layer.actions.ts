"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import User from "../database/models/user.model";
import Layer from "../database/models/layer.model";
import { redirect } from "next/navigation";

import { v2 as cloudinary } from "cloudinary";
import Project from "../database/models/project.model";
import { Types } from "mongoose";

const populateUser = (query: any) =>
  query.populate({
    path: "userId",
    model: User,
    select: "_id firstName lastName clerkId",
  });

// ADD LAYER
export async function addLayerApi({ layer, userId, path }: CreateLayerParams) {
  try {
    await connectToDatabase();
    console.log("add layer user id", userId);

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const newLayer = await Layer.create({
      ...layer,
      userId: user._id,
    });

    const updatedProject = await Project.findByIdAndUpdate(
      layer.projectId,
      { activeLayer: new Types.ObjectId(newLayer._id) },
      { new: true } 
    ).exec();

    revalidatePath(path);

    return JSON.parse(JSON.stringify(newLayer));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE LAYER
export async function updateLayerApi({
  layer,
  userId,
  path,
}: UpdateLayerParams) {
  try {
    await connectToDatabase();

    const layerToUpdate = await Layer.findById(layer._id);

    if (!layerToUpdate || layerToUpdate.userId !== userId) {
      throw new Error("Unauthorized or layer not found");
    }

    const updatedLayer = await Layer.findByIdAndUpdate(
      layerToUpdate._id,
      layer,
      { new: true }
    );

    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedLayer));
  } catch (error) {
    handleError(error);
  }
}

// DELETE LAYER
export async function deleteLayer(layerId: string) {
  try {
    await connectToDatabase();

    await Layer.findByIdAndDelete(layerId);
  } catch (error) {
    handleError(error);
  } finally {
    redirect("/app");
  }
}

// GET LAYER
export async function getLayerById(layerId: string) {
  try {
    await connectToDatabase();

    const layer = await populateUser(Layer.findById(layerId));

    if (!layer) throw new Error("Layer not found");

    return JSON.parse(JSON.stringify(layer));
  } catch (error) {
    handleError(error);
  }
}

// GET LAYERS
export async function getAllLayers({
  limit = 9,
  page = 1,
  searchQuery = "",
}: {
  limit?: number;
  page: number;
  searchQuery?: string;
}) {
  try {
    await connectToDatabase();

    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    let expression = "folder=layerstudio";

    if (searchQuery) {
      expression += ` AND ${searchQuery}`;
    }

    const { resources } = await cloudinary.search
      .expression(expression)
      .execute();

    const resourceIds = resources.map((resource: any) => resource.public_id);

    let query = {};

    if (searchQuery) {
      query = {
        publicId: {
          $in: resourceIds,
        },
      };
    }

    const skipAmount = (Number(page) - 1) * limit;

    const layers = await populateUser(Layer.find(query))
      .sort({ updatedAt: -1 })
      .skip(skipAmount)
      .limit(limit);

    const totalLayers = await Layer.find(query).countDocuments();
    const savedLayers = await Layer.find().countDocuments();

    return {
      data: JSON.parse(JSON.stringify(layers)),
      totalPage: Math.ceil(totalLayers / limit),
      savedLayers,
    };
  } catch (error) {
    handleError(error);
  }
}

// GET LAYERS BY USER
export async function getUserLayers({
  limit = 9,
  page = 1,
  userId,
}: {
  limit?: number;
  page: number;
  userId: string;
}) {
  try {
    await connectToDatabase();

    const skipAmount = (Number(page) - 1) * limit;

    const layers = await populateUser(Layer.find({ userId: userId }))
      .sort({ updatedAt: -1 })
      .skip(skipAmount)
      .limit(limit);

    const totalLayers = await Layer.find({ userId: userId }).countDocuments();

    return {
      data: JSON.parse(JSON.stringify(layers)),
      totalPages: Math.ceil(totalLayers / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

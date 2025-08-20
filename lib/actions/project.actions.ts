"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import User from "../database/models/user.model";
import Project from "../database/models/project.model";
import { redirect } from "next/navigation";
import Layer from "../database/models/layer.model";

const populateUser = (query: any) =>
  query.populate({
    path: "userId",
    model: User,
    select: "_id firstName lastName clerkId",
  });

export async function addProject({
  project,
  userId,
  path,
}: CreateProjectParams) {
  console.log("add project run");

  try {
    await connectToDatabase();

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const newProject = await Project.create({
      ...project,
      userId: user._id,
    });

   

   
    const newLayer = await Layer.create({
      projectId: newProject._id,
      name: "Initial Layer",
      format: "",
      height: 0,
      width: 0,
      url: "",
      publicId: "",
      resourceType: "image",
      userId: user._id,
    });

    

    
    const projectWithLayers = await Project.findById(newProject._id)
      .populate("layers")
      .exec();
    console.log('new layer',newLayer,'newproject',newProject,'projectWithLayers',projectWithLayers);

    revalidatePath(path);

    return JSON.parse(JSON.stringify(projectWithLayers));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE PROJECT
export async function updateProject({
  project,
  userId,
  path,
}: UpdateProjectParams) {
  console.log("update project run");

  try {
    await connectToDatabase();

    const projectToUpdate = await Project.findById(project._id);

    if (!projectToUpdate || projectToUpdate.userId !== userId) {
      throw new Error("Unauthorized or project not found");
    }

    const updatedProject = await Project.findByIdAndUpdate(
      projectToUpdate._id,
      project,
      { new: true }
    );

    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedProject));
  } catch (error) {
    handleError(error);
  }
}

// DELETE PROJECT
export async function deleteProject(projectId: string) {
  try {
    await connectToDatabase();
    await Project.findByIdAndDelete(projectId);
  } catch (error) {
    handleError(error);
  } finally {
    redirect("/app");
  }
}

// GET PROJECT
export async function getProjectById(projectId: string) {
  try {
    await connectToDatabase();

    const project = await populateUser(Project.findById(projectId)
      .populate("layers")
      );

    if (!project) throw new Error("Project not found");

    return JSON.parse(JSON.stringify(project));
  } catch (error) {
    handleError(error);
  }
}

// GET PROJECTS
export async function getAllProjects({
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

    const skipAmount = (Number(page) - 1) * limit;

    let query: any = {};

    if (searchQuery) {
      query = {
        name: { $regex: searchQuery, $options: "i" }, // case-insensitive name match
      };
    }

    const projects = await populateUser(Project.find(query))
      .sort({ updatedAt: -1 })
      .skip(skipAmount)
      .limit(limit);

    const totalProjects = await Project.countDocuments(query);
    const savedProjects = await Project.countDocuments(); // total count without filters

    return {
      data: JSON.parse(JSON.stringify(projects)),
      totalPage: Math.ceil(totalProjects / limit),
      savedProjects,
    };
  } catch (error) {
    handleError(error);
  }
}

// GET PROJECTS BY USER
export async function getUserProjects({
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

    const projects = await populateUser(Project.find({ userId: userId }))
      .sort({ updatedAt: -1 })
      .skip(skipAmount)
      .limit(limit);

    const totalProjects = await Project.find({
      userId: userId,
    }).countDocuments();

    return {
      data: JSON.parse(JSON.stringify(projects)),
      totalPages: Math.ceil(totalProjects / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

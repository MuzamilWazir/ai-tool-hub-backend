import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    isConnected = true;
    console.log("Database connected successfully");

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("Database connection error:", err);
      isConnected = false;
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Database disconnected");
      isConnected = false;
    });
  } catch (error) {
    console.error("Database connection error:", error);
    isConnected = false;
    throw error;
  }
};

export default connectDB;

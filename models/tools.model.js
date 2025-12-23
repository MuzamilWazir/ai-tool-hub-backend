import mongoose from "mongoose";

const toolSchema = new mongoose.Schema(
  {
    tool_name: {
      type: String,
      required: [true, "Tool name is required"],
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    forsales: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
    },

    pricing_model: {
      type: String,
      enum: ["Free", "Freemium", "Paid", "Subscription"],
      default: "Freemium",
    },

    rating: {
      type: Number,
      default: 0,
    },

    reviews: {
      type: Number,
      default: 0,
    },

    saves: {
      type: Number,
      default: 0,
    },

    website_url: {
      type: String,
      required: true,
      trim: true,
    },

    logo_url: {
      type: String,
      required: true,
      trim: true,
    },

    submitter_name: {
      type: String,
      required: true,
      trim: true,
    },

    submitter_email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    company_name: {
      type: String,
      default: "",
      trim: true,
    },

    thumbnail_url: {
      type: String,
      default: "",
    },

    additional_information: {
      type: String,
      default: "",
      trim: true,
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      default: "Active",
    },
  },

  { timestamps: true }
);

const Tool = mongoose.model("Tool", toolSchema);

export default Tool;

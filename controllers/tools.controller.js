import Tool from "../models/tools.model.js";

const AddTool = async (req, res) => {
  try {
    const {
      tool_name,
      category,
      description,
      pricing_model,
      website_url,
      logo_url,
      submitter_name,
      submitter_email,
      company_name,
      additional_information,
      featured = false,
      Forsales = false,
      rating = 0,
      reviews = 0,
      saves = 0,
    } = req.body;

    const existingTool = await Tool.findOne({ tool_name });

    if (existingTool) {
      return res.status(400).json({
        success: false,
        message: "Tool already exists",
      });
    }

    const newTool = await Tool.create({
      tool_name,
      category,
      description,
      pricing_model,
      website_url,
      logo_url,
      submitter_name,
      submitter_email,
      company_name,
      additional_information,
      featured,
      Forsales,
      rating,
      reviews,
      saves,
    });

    return res.status(201).json({
      success: true,
      message: "Tool added successfully",
      data: newTool,
    });
  } catch (error) {
    console.error("Error adding tool:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error adding the AI tool",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const UpdateTool = async (req, res) => {
  try {
    const toolId = req.params.id;
    const updateData = req.body;

    if (req.body.status && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can change tool status",
      });
    }

    const updatedTool = await Tool.findByIdAndUpdate(toolId, updateData, {
      new: true,
    });

    if (!updatedTool) {
      return res
        .status(404)
        .json({ success: false, message: "Tool not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Tool updated successfully",
      data: updatedTool,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error updating tool",
    });
  }
};

const DeleteTool = async (req, res) => {
  try {
    const toolId = req.params.id;
    const deletedTool = await Tool.findByIdAndDelete(toolId);

    if (!deletedTool) {
      return res
        .status(404)
        .json({ success: false, message: "Tool not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Tool deleted successfully",
      data: deletedTool,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error deleting tool",
    });
  }
};

const GetAllTools = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const total = await Tool.countDocuments();
    const tools = await Tool.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: tools,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching tools",
    });
  }
};

const GetAllToolsActive = async (req, res) => {
  try {
    const tools = await Tool.find();
    const activeTools = tools.filter((item) => item.status === "Active");
    return res.status(200).json({
      success: true,
      data: activeTools,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching tools",
    });
  }
};

const GetToolById = async (req, res) => {
  try {
    const toolId = req.params.id;

    const tool = await Tool.findById(toolId);

    if (!tool) {
      return res
        .status(404)
        .json({ success: false, message: "Tool not found" });
    }
    console.log("GetToolById Called5");
    return res.status(200).json({
      success: true,
      data: tool,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching tool",
    });
  }
};

export {
  AddTool,
  UpdateTool,
  DeleteTool,
  GetAllTools,
  GetToolById,
  GetAllToolsActive,
};

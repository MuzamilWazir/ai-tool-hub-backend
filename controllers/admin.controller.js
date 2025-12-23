import csv from "csvtojson";
import Tool from "../models/tools.model.js";

const uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const csvString = req.file.buffer.toString("utf8");

    const tools = await csv({
      checkType: true,
      trim: true,
      ignoreEmpty: true,
    }).fromString(csvString);

    console.log(`Parsed ${tools.length} records from CSV`);

    if (tools.length > 0) {
      console.log("First record keys:", Object.keys(tools[0]));
    }

    if (tools.length === 0) {
      return res.status(400).json({
        success: false,
        message: "CSV file is empty or contains no valid data",
      });
    }

    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    const errors = [];

    for (let i = 0; i < tools.length; i++) {
      const t = tools[i];
      const rowNumber = i + 2;

      try {
        const requiredFields = [
          "tool_name",
          "website_url",
          "description",
          "logo_url",
        ];
        const missingFields = requiredFields.filter(
          (field) => !t[field] || t[field].toString().trim() === ""
        );

        if (missingFields.length > 0) {
          errors.push(
            `Row ${rowNumber}: Missing required fields - ${missingFields.join(
              ", "
            )}`
          );
          skippedCount++;
          continue;
        }

        const exists = await Tool.findOne({
          $or: [{ tool_name: t.tool_name }, { website_url: t.website_url }],
        });

        const toolData = {
          tool_name: t.tool_name,
          category: t.category || "AI Agents",
          featured: false,
          forsales: false,
          description: t.description,
          pricing_model: "Freemium",
          rating: 0,
          reviews: 0,
          saves: 0,
          website_url: t.website_url,
          thumbnail_url: t.thumbnail_url,
          logo_url: t.logo_url,
          submitter_name: t.submitter_name || "Admin",
          submitter_email: t.submitter_email || "admin@example.com",
          company_name: t.company_name || "",
          additional_information: t.additional_information || "",
        };

        if (exists) {
          await Tool.findByIdAndUpdate(exists._id, toolData, { new: true });
          updatedCount++;
          console.log(`Updated tool: ${t.tool_name}`);
        } else {
          await Tool.create(toolData);
          createdCount++;
          console.log(`Created tool: ${t.tool_name}`);
        }
      } catch (error) {
        errors.push(`Row ${rowNumber}: ${error.message}`);
        skippedCount++;
        console.error(`Error processing row ${rowNumber}:`, error);
      }
    }

    const response = {
      success: true,
      message: `CSV processing completed: ${createdCount} created, ${updatedCount} updated, ${skippedCount} skipped`,
      details: {
        total: tools.length,
        created: createdCount,
        updated: updatedCount,
        skipped: skippedCount,
      },
    };

    if (errors.length > 0) {
      response.errors = errors.slice(0, 10);
    }

    res.status(201).json(response);
  } catch (error) {
    console.error("CSV upload error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing CSV file",
      error: error.message,
    });
  }
};

export { uploadCSV };

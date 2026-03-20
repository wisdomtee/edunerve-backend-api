import { resultQueue } from "../config/redis";

export const bulkResultUpload = async (req: any, res: any) => {
  try {
    const filePath = req.file.path;
    const schoolId = req.user.schoolId;

    await resultQueue.add("process-result-file", {
      filePath,
      schoolId
    });

    res.json({
      message: "Bulk upload queued for processing"
    });

  } catch {
    res.status(500).json({
      message: "Bulk upload failed"
    });
  }
};
export const addResult = async (req: any, res: any) => {
  try {
    const schoolId = req.user.schoolId;

    const result = await createResult(req.body, schoolId);

    res.status(201).json(result);
  } catch {
    res.status(500).json({
      message: "Result creation failed"
    });
  }
};
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }

  limits: {
  fileSize: 10 * 1024 * 1024
}
});

export const upload = multer({ storage });
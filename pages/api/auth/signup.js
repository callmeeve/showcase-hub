import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import multer from "multer";
import path from "path";

// Increase the body size limit
export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
  },
};

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(process.cwd(), "public/uploads"));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // Set the file size limit to 10MB
}).single("avatar");

export default async function handler(req, res) {
  if (req.method === "POST") {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        console.error("Multer error:", err);
        return res.status(400).json({ message: err.message });
      } else if (err) {
        console.error("Upload error:", err);
        return res.status(500).json({ message: err.message });
      }

      const { name, email, password } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : null;

      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ error: "Name, email, and password are required" });
      }

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        return res
          .status(400)
          .json({ error: "User already exists with that email" });
      }

      const hashedPassword = await hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          avatar: image,
        },
      });

      res.status(201).json(newUser);
    });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

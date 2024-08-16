import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import multer from "multer";
import cloudinary from "@/lib/cloudinary";
import streamifier from "streamifier";

// Increase the body size limit
export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
  },
};

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Use memory storage
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
      let imageUrl = null;

      if (req.file) {
        try {
          const streamUpload = (req) => {
            return new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream((error, result) => {
                if (result) {
                  resolve(result);
                } else {
                  reject(error);
                }
              });
              streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
          };
          const result = await streamUpload(req);
          imageUrl = result.secure_url;
        } catch (error) {
          console.error("Error uploading to Cloudinary:", error);
          return res.status(500).json({ message: "Error uploading image" });
        }
      }

      try {
        // Check if the email already exists
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          return res.status(400).json({ message: "Email already in use" });
        }

        const hashedPassword = await hash(password, 10);
        const newUser = await prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            avatar: imageUrl,
          },
        });

        res.status(201).json(newUser);
      } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
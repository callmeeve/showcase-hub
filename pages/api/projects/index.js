// pages/api/projects/index.js
import { getSession } from "next-auth/react";
import { prisma } from "@/lib/prisma";
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
}).single("image");

export default async function handler(req, res) {
  const session = await getSession({ req });
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const projects = await prisma.project.findMany({
          where: session ? { userId: session.user.id } : undefined, // No filter for non-logged-in users
          include: {
            user: {
              select: { email: true, name: true, avatar: true },
            },
          },
        });
        res.status(200).json(projects);
      } catch (error) {
        console.error("Error retrieving projects:", error);
        res.status(500).json({ message: "Error retrieving projects" });
      }
      break;

    case "POST":
      upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
          console.error("Multer error:", err);
          return res.status(400).json({ message: err.message });
        } else if (err) {
          console.error("Upload error:", err);
          return res.status(500).json({ message: err.message });
        }

        if (!session) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        const { name, description, url } = req.body;

        console.log("Request body:", req.body);
        console.log("Session:", session);

        if (!name || !url) {
          return res.status(400).json({ message: "Name and URL are required" });
        }

        let imageUrl;
        if (req.file) {
          try {
            const streamUpload = (req) => {
              return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                  (error, result) => {
                    if (result) {
                      resolve(result);
                    } else {
                      reject(error);
                    }
                  }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
              });
            };
            const result = await streamUpload(req);
            imageUrl = result.secure_url;
            console.log("Image uploaded to Cloudinary:", result);
          } catch (error) {
            console.error("Error uploading to Cloudinary:", error);
            return res.status(500).json({ message: "Error uploading image" });
          }
        }

        try {
          const projectData = {
            name,
            description,
            url,
            userId: session.user.id,
            image: imageUrl,
          };
          console.log("Data to be inserted:", projectData);

          const project = await prisma.project.create({
            data: projectData,
          });
          console.log("Project created:", project);
          res.status(201).json(project);
        } catch (error) {
          console.error("Error creating project:", error);
          res.status(500).json({ message: "Error creating project" });
        }
      });
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
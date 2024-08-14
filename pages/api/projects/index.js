// pages/api/projects/index.js
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
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
}).single("image");

export default async function handler(req, res) {
  const session = await getSession({ req });
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const projects = await prisma.project.findMany({
          where: session
            ? { userId: session.user.id }
            : undefined, // No filter for non-logged-in users
          include: {
            user: {
              select: {
                email: true,
                name: true,
              },
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

        if (!name || !url) {
          return res.status(400).json({ message: "Name and URL are required" });
        }

        try {
          const project = await prisma.project.create({
            data: {
              name,
              description,
              url,
              userId: session.user.id,
              image: req.file ? `/uploads/${req.file.filename}` : undefined,
            },
          });
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

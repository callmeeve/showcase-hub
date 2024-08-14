import prisma from "@/lib/prisma";
import { getSession } from "next-auth/react";
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

// GET a specific project (public), PUT, DELETE (restricted to authenticated users)
export default async function handler(req, res) {
  const session = await getSession({ req });

  if(!session){
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.query;
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const project = await prisma.project.findUnique({
          where: { id },
          include: {
            user: {
              select: {
                name: true, // Include the user's name (optional)
              },
            },
          },
        });
        if (!project) {
          return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json(project);
      } catch (error) {
        res.status(500).json({ message: "Error retrieving project" });
      }
      break;

    case "PUT":
      upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
          console.error("Multer error:", err);
          return res.status(400).json({ message: err.message });
        } else if (err) {
          console.error("Upload error:", err);
          return res.status(500).json({ message: err.message });
        }

        const { name, description, url } = req.body;

        try {
          const updatedProject = await prisma.project.update({
            where: { id },
            data: {
              name,
              description,
              url,
              image: req.file ? `/uploads/${req.file.filename}` : undefined,
            },
          });
          res.status(200).json(updatedProject);
        } catch (error) {
          res.status(500).json({ message: "Error updating project" });
        }
      });
      break;

    case "DELETE":
      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      try {
        await prisma.project.delete({
          where: { id },
        });
        res.status(204).end();
      } catch (error) {
        res.status(500).json({ message: "Error deleting project" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}

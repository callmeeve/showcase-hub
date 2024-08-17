import { getSession } from "next-auth/react";
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.query;
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const user = await prisma.user.findUnique({
          where: { id },
          select: {
            name: true,
            email: true,
            avatar: true,
            // Add other fields you want to include
          },
        });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({ message: "Error retrieving user" });
      }
      break;

    case "PUT":
      try {
        const { name, email } = req.body;
        const updatedUser = await prisma.user.update({
          where: { id },
          data: { name, email },
        });
        res.status(200).json(updatedUser);
      } catch (error) {
        res.status(500).json({ message: "Error updating user" });
      }
      break;

    case "DELETE":
      try {
        await prisma.user.delete({ where: { id } });
        res.status(204).end();
      } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

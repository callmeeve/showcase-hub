import AdminLayout from "@/components/AdminLayout";
import ProjectDialogForm from "@/components/ProjectDialogForm";
import Image from "next/image";
import { useState, useEffect } from "react";
import { InfinitySpin } from "react-loader-spinner";
import AlertDialog from "@/components/AlertDialog";
import axios from "axios";

const DashboardPage = () => {
  const [projects, setProjects] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const close = () => setIsOpen(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("/api/projects");
        setProjects(res.data);
      } catch (err) {
        console.log("Error fetching projects:", err); // Debugging error
        console.error("Error fetching projects:", err); // Debugging error
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleCreateProject = async (newProject) => {
    const formData = new FormData();
    formData.append("image", newProject.image);
    formData.append("name", newProject.name);
    formData.append("description", newProject.description);
    formData.append("url", newProject.url);

    try {
      const res = await axios.post("/api/projects", formData);
      setProjects([...projects, res.data]);

      // Reset form
      close();
    } catch (err) {
      console.error("Error creating project:", err); // Debugging error
      setError(err.message);
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await axios.delete(`/api/projects/${id}`);
      setProjects(projects.filter((project) => project.id !== id));
    } catch (err) {
      console.error("Error deleting project:", err); // Debugging error
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (projectId) => {
    setProjectToDelete(projectId);
    setIsDialogOpen(true);
  };

  const confirmDeleteProject = () => {
    if (projectToDelete) {
      handleDeleteProject(projectToDelete);
      setProjectToDelete(null);
    }
    setIsDialogOpen(false);
  };

  return (
    <AdminLayout>
      {loading ? (
        <InfinitySpin color="#06b6d4" size={50} />
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : projects.length === 0 ? (
        <div className="p-4 bg-white border border-gray-200 shadow-sm rounded">
          <div className="items-center justify-between sm:flex">
            <div>
              <h2 className="text-lg font-semibold">Projects</h2>
              <p className="text-gray-500">No projects found.</p>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="mt-2 px-4 py-2 bg-cyan-500 text-white rounded text-base sm:text-sm sm:leading-5 sm:mt-0"
            >
              Create Project
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="p-4 bg-white border border-gray-200 shadow-sm rounded">
            <div className="items-center justify-between sm:flex">
              <div>
                <h2 className="text-lg font-semibold">Projects</h2>
                <p className="text-gray-500">List of projects</p>
              </div>
              <button
                onClick={() => setIsOpen(true)}
                className="mt-2 px-4 py-2 bg-cyan-500 text-white rounded text-base sm:text-sm sm:leading-5 sm:mt-0"
              >
                Create Project
              </button>
            </div>
          </div>
          <div className="grid gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-4 bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200"
              >
                <div className="relative h-48">
                  <Image
                    src={project.image}
                    alt={project.name}
                    priority
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="mt-8">
                  <h4 className="font-bold text-xl">{project.name}</h4>
                  <p className="mt-2 text-gray-600">
                    {project.description.slice(0, 100)}...
                  </p>
                  <div className="mt-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Image
                          src={project.user?.avatar}
                          width={32}
                          height={32}
                          priority
                          alt={project.user?.name}
                          className="rounded-full"
                        />
                        <p className="text-gray-900 font-medium text-sm">
                          {project.user?.name}
                        </p>
                      </div>
                      <button
                        onClick={() => openDeleteDialog(project.id)}
                        className="px-4 py-2 text-base bg-white text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white sm:text-sm sm:leading-5"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <ProjectDialogForm
        isOpen={isOpen}
        onClose={close}
        onSubmit={handleCreateProject}
      />
      <AlertDialog
        isOpen={isDialogOpen}
        title="Delete Project"
        message="Are you sure you want to delete this project?"
        onClose={() => setIsDialogOpen(false)}
        onConfirm={confirmDeleteProject}
        submit="Delete"
      />
    </AdminLayout>
  );
};

export default DashboardPage;
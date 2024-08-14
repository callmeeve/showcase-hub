import AdminLayout from "@/components/AdminLayout";
import ProjectCard from "@/components/ProjectCard";
import ProjectDialogForm from "@/components/ProjectDialogForm";
import { useState, useEffect } from "react";

const Admin = () => {
  const [projects, setProjects] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const close = () => setIsOpen(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) {
          throw new Error(`Failed to fetch projects: ${res.statusText}`);
        }
        const data = await res.json();
        setProjects(data);
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
      const res = await fetch("/api/projects", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error(`Failed to create project: ${res.statusText}`);
      }
      const createdProject = await res.json();
      setProjects([...projects, createdProject]);
    } catch (err) {
      console.error("Error creating project:", err); // Debugging error
      setError(err.message);
    }
  };

  return (
    <AdminLayout>
      {loading ? (
        <div>Loading...</div>
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
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </>
      )}
      <ProjectDialogForm
        isOpen={isOpen}
        onClose={close}
        onSubmit={handleCreateProject}
      />
    </AdminLayout>
  );
};

export default Admin;

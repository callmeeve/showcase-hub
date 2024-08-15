import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { InfinitySpin } from "react-loader-spinner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) {
          throw new Error(`Failed to fetch projects: ${res.statusText}`);
        }
        const data = await res.json();
        setProjects(data);
        setFilteredProjects(data); // Initialize filtered projects
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

  useEffect(() => {
    // Filter projects based on search query
    if (searchQuery) {
      const filtered = projects.filter((project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(projects);
    }
  }, [searchQuery, projects]);

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent form submission
    // The filtering logic is handled by the useEffect hook
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <InfinitySpin
          visible={true}
          width="200"
          color="#06b6d4"
          ariaLabel="infinity-spin-loading"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Navbar />
      <section className="py-24">
        <div className="max-w-screen-2xl mx-auto text-gray-600 gap-x-12 items-center justify-between overflow-hidden md:flex md:px-8">
          <div className="flex-none space-y-5 px-4 sm:max-w-lg md:px-0 lg:max-w-xl">
            <h1 className="text-sm text-cyan-500 font-medium">
              Over 5+ years of experience
            </h1>
            <h2 className="text-3xl text-gray-900 font-bold md:text-4xl">
              We have the best solutions for your business
            </h2>
            <p>
              Our team of experts will help you build the best software for your
              business needs.
            </p>
            <div className="items-center gap-x-3 space-y-3 sm:flex sm:space-y-0">
              <Link
                href="/projects"
                className="block py-2 px-4 text-center text-white font-medium bg-cyan-500 duration-150 hover:bg-cyan-600 active:bg-cyan-700 rounded-lg shadow-lg hover:shadow-none"
              >
                Let`s get started
              </Link>
            </div>
          </div>
          <div className="flex-none mt-14 md:mt-0 md:max-w-xl">
            <Image
              src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              className=" md:rounded-tl-[108px]"
              width={700}
              height={500}
              alt="Startup"
            />
          </div>
        </div>
      </section>
      <section className="py-24">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="flex flex-col items-center gap-y-2">
            <div className="text-center space-y-2">
              <h2 className="text-2xl text-gray-900 font-bold">Our Projects</h2>
              <p className="text-gray-600">
                See our latest projects by our talented developers
              </p>
            </div>
            <form
              onSubmit={handleSearch}
              className="max-w-[480px] w-full px-4 mt-5"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search projects"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 h-12 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-cyan-500"
                />
                <button type="submit">
                  <MagnifyingGlassIcon className="text-cyan-500 h-5 w-5 absolute top-3.5 right-3" />
                </button>
              </div>
            </form>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.length === 0 && !loading && (
              <div className="flex items-center justify-center col-span-3">
                <p className="text-gray-600">No projects found</p>
              </div>
            )}
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

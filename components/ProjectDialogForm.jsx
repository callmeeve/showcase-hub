import { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Button } from '@headlessui/react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function ProjectDialogForm({ isOpen, onClose, onSubmit }) {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) { // Check file size (10MB)
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      alert("File size exceeds 10MB");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit({ image, name, description, url });
      setImage(null);
      setName('');
      setDescription('');
      setUrl('');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={onClose}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md border border-gray-300 rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <div className="flex items-center justify-between">
              <DialogTitle
                as="h3"
                className="text-base/7 font-medium text-gray-800"
              >
                Create New Project
              </DialogTitle>
              <Button
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-md p-1 hover:bg-gray-100 transition-colors duration-200 ease-in-out"
              >
                <XMarkIcon className="h-5 w-5" />
              </Button>
            </div>

            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

            <form onSubmit={handleSubmit} className="mt-4">
              <div className="mb-4 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="flex flex-col items-center justify-center space-y-2">
                  {imagePreview ? (
                    <Image src={imagePreview} alt={name} width={200} height={200} className="rounded" />
                  ) : (
                    <PhotoIcon className="h-12 w-12 text-gray-600" />
                  )}
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="image"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-cyan-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-cyan-600 focus-within:ring-offset-2 hover:text-cyan-500"
                    >
                      <span>Upload an Image</span>
                      <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                        aria-label="Upload an image"
                        required
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-800">Name</label>
                <div className="mt-2">
                  <input type="text" name="name" id="name" className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-800">Description</label>
                <div className="mt-2">
                  <textarea id="description" name="description" rows="3" className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about the project.</p>
              </div>
              <div className="mb-4">
                <label htmlFor="url" className="block text-sm font-medium leading-6 text-gray-800">URL</label>
                <div className="mt-2">
                  <input type="url" name="url" id="url" className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6" value={url} onChange={(e) => setUrl(e.target.value)} required />
                </div>
              </div>
              <button
                type="submit"
                className="mt-5 px-4 py-2 border border-cyan-500 text-cyan-500 rounded hover:bg-cyan-500 hover:text-white transition-colors duration-200 ease-in-out"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Project'}
              </button>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
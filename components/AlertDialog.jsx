import { Dialog, DialogPanel, DialogTitle, Button } from '@headlessui/react';

export default function AlertDialog({ isOpen, onClose, onConfirm, title, message, submit }) {
    return (
        <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={onClose}>
            {/* The backdrop, rendered as a fixed sibling to the panel container */}
            <div className="fixed inset-0 bg-black/30 backdrop-blur-md" aria-hidden="true" />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="w-full max-w-md rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                    >
                        <DialogTitle as="h3" className="text-base/7 font-medium text-gray-900">
                            {title}
                        </DialogTitle>
                        <p className="mt-2 text-sm/6 text-gray-600">
                            {message}
                        </p>
                        <div className="mt-4">
                            <Button
                                className="inline-flex items-center gap-2 rounded-md border border-transparent bg-cyan-600 text-white px-4 py-2 text-sm/6 font-medium hover:bg-cyan-700 focus:outline-none focus:ring focus:ring-cyan-500"
                                onClick={onConfirm}
                            >
                                {submit}
                            </Button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}
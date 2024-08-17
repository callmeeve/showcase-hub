import { useState, useEffect } from "react";
import { InfinitySpin } from "react-loader-spinner";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3BottomLeftIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import withAuth from "./withAuth";
import Image from "next/image";

const AdminLayout = ({ children }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { data: session } = useSession();

    const avatarSrc = session.user.avatar ? session.user.avatar : "/user.jpg";

    useEffect(() => {
        // Simulate a loading delay
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    if (!session) {
        return <p>Access denied</p>;
    }

    const navAdmin = [
        { name: "Dashboard", href: "/admin" },
        { name: "Projects", href: "/admin/projects" },
    ];

    const menuItems = [
        { name: "Profile", href: "/admin/profile" },
        { name: "Sign out", onClick: () => signOut() },
    ];

    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar */}
            <div
                className={`fixed h-screen transition-all duration-300 z-10 border border-r ${isOpen ? 'w-64' : 'w-0 overflow-hidden'}`}
            >
                {/* Sidebar content */}
                <div className="flex flex-col p-5 mt-2">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold">ShowcaseHub</h2>
                    </div>
                    <nav className="flex-grow">
                        <ul className="space-y-4">
                            {navAdmin.map((item) => (
                                <li key={item.href} className={`block p-2 font-medium text-sm rounded ${router.pathname === item.href ? "bg-cyan-500 text-white" : "text-gray-900 hover:bg-cyan-500 hover:text-white"}`}>
                                    <Link legacyBehavior href={item.href}>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
            <div className={`flex-1 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-0'}`}>
                <header className="flex justify-between items-center p-5 border-b border-gray-200">
                    <div className="flex items-center gap-5">
                        <button onClick={() => setIsOpen(!isOpen)}>
                            <Bars3BottomLeftIcon className="h-6 w-6 text-gray-900" />
                        </button>
                        <div className="flex flex-col items-start">
                            <h1 className="text-lg font-semibold">{router.pathname === "/admin" ? "Dashboard" : "Projects"}</h1>
                            <p className="text-gray-600">Welcome, {session.user.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-5">
                        <Menu as="div" className="relative">
                            <MenuButton className="flex items-center gap-2">
                                <Image
                                    src={avatarSrc}
                                    width={40}
                                    height={40}
                                    alt={session.user.name}
                                    className="rounded-full object-cover"
                                />
                                <ChevronDownIcon className="h-3 w-3 text-gray-900" />
                            </MenuButton>
                            <MenuItems className="absolute right-0 w-48 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                {menuItems.map((item, index) => (
                                    <MenuItem key={index}>
                                        {({ isActive }) => (
                                            <>
                                                {item.href && (
                                                    <Link legacyBehavior href={item.href}>
                                                        <a
                                                            className={`${router.pathname === item.href ? 'text-cyan-500' : 'hover:text-cyan-500'
                                                                } group flex items-center w-full px-2 py-2 text-sm`}
                                                        >
                                                            {item.name}
                                                        </a>
                                                    </Link>
                                                )}
                                                {item.onClick && (
                                                    <button
                                                        className="group flex items-center w-full px-2 py-2 text-sm hover:text-cyan-500"
                                                        onClick={item.onClick}
                                                    >
                                                        {item.name}
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </MenuItem>
                                ))}
                            </MenuItems>
                        </Menu>
                    </div>
                </header>
                {loading ? (
                    <div className="flex items-center justify-center min-h-screen">
                        <InfinitySpin
                            height="80"
                            width="80"
                            radius="9"
                            color="#06b6d4"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                        />
                    </div>
                ) : (
                    <main className="p-12 overflow-y-auto">
                        {children}
                    </main>
                )}
            </div>
        </div>
    );
};

export default withAuth(AdminLayout);
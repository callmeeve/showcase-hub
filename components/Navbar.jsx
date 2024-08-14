import Image from 'next/image'
import { useSession } from 'next-auth/react';
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link';

export default function Navbar() {
    const { data: session } = useSession();

    const [open, setOpen] = useState(false);
    const router = useRouter();

    // Replace javascript:void(0) paths with your paths
    const navigation = [
        { title: 'Home', path: '/' },
        { title: 'About', path: '/about' },
        { title: 'Services', path: '/services' },
        { title: 'Contact', path: '/contact' },
    ]

    return (
        <nav className="bg-white border-b w-full md:static md:text-sm md:border-none">
            <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
                <div className="flex items-center justify-between py-3 md:py-5 md:block">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/logo.png"
                            width={60}
                            height={60}
                            alt="Logo"
                            className="cursor-pointer object-cover"
                        />
                        <h1 className="hidden ml-2 text-xl font-bold md:block text-cyan-500">ShowcaseHub</h1>
                    </Link>
                    <div className="md:hidden">
                        <button className="text-gray-500 hover:text-gray-800"
                            onClick={() => setOpen(!open)}
                        >
                            {
                                open ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                    </svg>
                                )
                            }
                        </button>
                    </div>
                </div>
                <div className={`flex-1 pb-3 mt-8 md:block md:pb-0 md:mt-0 ${open ? 'block' : 'hidden'}`}>
                    <ul className="justify-end items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
                        {
                            navigation.map((item, idx) => {
                                return (
                                    <li key={idx} className={`font-medium ${router.pathname === item.path ? 'text-cyan-500' : ' text-gray-700 hover:text-cyan-500'}`}>
                                        <Link href={item.path} className="block">
                                            {item.title}
                                        </Link>
                                    </li>
                                )
                            })
                        }
                        <span className='hidden w-px h-6 bg-gray-300 md:block'></span>
                        <div className='space-y-3 items-center gap-x-6 md:flex md:space-y-0'>
                            { session ? (
                                <Link legacyBehavior href="/admin" className="block">
                                    <a className="px-4 py-2 text-white bg-cyan-500 hover:bg-cyan-500 font-medium rounded-lg shadow-lg">Dashboard</a>
                                </Link>
                            ) : (
                                <Link legacyBehavior href="/login" className="block">
                                    <a className="px-4 py-2 text-white bg-cyan-500 hover:bg-cyan-500 font-medium rounded-lg shadow-lg">Login</a>
                                </Link>
                            )}
                        </div>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function ProjectCard({project}) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            key={project.id}
            className="p-4 bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200"
        >
            <div className="relative h-48">
                <Image
                    src={project.image}
                    alt={project.name}
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <div className="mt-8">
                <h4 className="font-bold text-xl">{project.name}</h4>
                <p className="mt-2 text-gray-600">
                    {isExpanded
                        ? project.description
                        : `${project.description.slice(0, 100)}...`}
                    <span
                        className="text-cyan-600 cursor-pointer"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? " Show less" : " Read more"}
                    </span>
                </p>
                <div className="mt-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/user.jpg"
                                width={32}
                                height={32}
                                alt={project.user.name}
                                className="rounded-full"
                            />
                            <p className="text-gray-900 font-medium text-sm">{project.user.name}</p>
                        </div>
                        <Link legacyBehavior href={project.url}>
                            <a className="px-4 py-2.5 text-base bg-white text-cyan-500 border border-cyan-500 rounded hover:bg-cyan-500 hover:text-white sm:text-sm sm:leading-5">
                                View Project
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

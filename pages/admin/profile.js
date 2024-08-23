import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import AdminLayout from "@/components/AdminLayout";
import { InfinitySpin } from "react-loader-spinner";
import axios from "axios";

const ProfilePage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState({});
    const { data: session, status: loadingSession } = useSession();
    
    const router = useRouter();

    useEffect(() => {
        if (loadingSession === "loading") return;

        if (!session) {
            router.push("/login");
        } else {
            const fetchUserData = async () => {
                try {
                    const res = await axios.get(`/api/users/${session.user.id}`);
                    setUser(res.data);
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchUserData();
        }
    }, [loadingSession, session, router]);

    if (loadingSession === "loading" || loading) {
        return (
            <AdminLayout>
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
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl font-semibold text-gray-800">Profile</h1>
                    <div className="mt-4 p-4 bg-white shadow-md rounded-md">
                        <p className="text-red-500">{error}</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-semibold text-gray-800">Profile</h1>
                <div className="mt-4 p-4 bg-white shadow-md rounded-md">
                    <div className="flex items-center gap-5">
                        <Image
                            src={user.avatar}
                            width={40}
                            height={40}
                            alt={user.name}
                            className="rounded-full object-cover"
                        />
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
                            <p className="text-gray-600">{user.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ProfilePage;
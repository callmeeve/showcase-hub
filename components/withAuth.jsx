import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function withAuth(WrappedComponent) {
  return function ProtectedComponent(props) {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      if (status === "loading") {
        return; // Do nothing while loading
      }

      if (!session) {
        // No session means user is not authenticated
        router.replace("/login"); // Redirect to a custom login page
      } else {
        setLoading(false);
      }
    }, [session, status, router]);

    if (loading || status === "loading") {
      return (
        <div className="flex items-center justify-center h-screen">
          <p className="text-cyan-500">Loading...</p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}
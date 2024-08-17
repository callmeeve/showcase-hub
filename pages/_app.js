import { useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { InfinitySpin } from "react-loader-spinner";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SessionProvider session={pageProps.session}>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <InfinitySpin visible={true} width="200" color="#06b6d4" />
        </div>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  );
}

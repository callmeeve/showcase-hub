import { useState, useEffect } from 'react';
import { SessionProvider } from "next-auth/react";
import { ThreeDots } from "react-loader-spinner";
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
          <ThreeDots 
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
        <Component {...pageProps} />
      )}
    </SessionProvider>
  );
}
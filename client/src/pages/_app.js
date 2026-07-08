import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function App({ Component, pageProps }) {
  return(<GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
              <Component {...pageProps} />;
              <Toaster
                  position="top-right"
                  toastOptions={{
                    style: {
                      background: '#333',
                      color: '#fff',
                    },
                  }}
                />
        </GoogleOAuthProvider>
  ) 
}

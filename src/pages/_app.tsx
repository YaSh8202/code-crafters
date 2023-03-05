import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <div className="mx-auto flex min-h-screen w-[min(100%-2rem,1400px)] flex-col ">
        <Navbar />
        <div className="flex-1">
          <Component {...pageProps} />
        </div>
        <Footer />
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

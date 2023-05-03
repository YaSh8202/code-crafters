import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import { Barlow } from "next/font/google";
import {Toaster} from 'react-hot-toast';

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <main data-mode="light" className={barlow.className}>
      <SessionProvider session={session}>
        <Navbar />
        <div className="mx-auto flex min-h-screen  flex-col ">
          <div className=" flex-1">
            <Component {...pageProps} />
            <Toaster />
          </div>
          <Footer />
        </div>
      </SessionProvider>
    </main>
  );
};

export default api.withTRPC(MyApp);

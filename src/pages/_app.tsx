import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import PageHeader from "~/components/PageHeader";
import { Barlow } from "next/font/google";

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
        <PageHeader />
        <div className="mx-auto flex min-h-screen w-[min(100%-2rem,1400px)] flex-col ">
          <div className="my-6 flex-1">
            <Component {...pageProps} />
          </div>
          <Footer />
        </div>
      </SessionProvider>
    </main>
  );
};

export default api.withTRPC(MyApp);

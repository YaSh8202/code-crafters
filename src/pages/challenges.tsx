import { type NextPage } from "next";
import Head from "next/head";
// import { signIn, signOut, useSession } from "next-auth/react";

// import { api } from "~/utils/api";
import ChallengeCard from "~/components/ChallengeCard";

const ChallengesPage: NextPage = () => {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Code Crafters</title>
      </Head>
      <main className="flex flex-wrap mx-auto w-full ">
        {[0, 1, 2, 3, 4].map((i) => (
          <ChallengeCard
            key={i}
            title="Results summary component"
            description="This challenge has something for everyone. It's a HTML and CSS only project, but we've also provided a JSON file of the test results for anyone wanting to practice JS."
            image="https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_700/Challenges/aqbssn4qnnb7jwp9kbw2.jpg"
          />
        ))}
      </main>
    </>
  );
};

export default ChallengesPage;

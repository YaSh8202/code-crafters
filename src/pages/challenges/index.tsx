import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import ChallengeCard from "~/components/ChallengeCard";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";

const ChallengesPage: NextPage = () => {
  const { data: challenges } = api.challenge.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Code Crafters</title>
      </Head>
      <main className=" mx-auto xl:w-[75rem]">
        <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-8">
          {challenges?.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              slug={challenge.slug}
              title={challenge.title}
              description={challenge.shortDesc}
              image={challenge.imagesURL[0]}
              type={challenge.type}
              difficulty={challenge.difficulty}
            />
          ))}
        </div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const ssg = generateSSGHelper();
  await ssg.challenge.getAll.prefetch();
  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};


export default ChallengesPage;

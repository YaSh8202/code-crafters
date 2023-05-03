import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import SolutionCard from "../../components/SolutionCard";
import PageHeader from "~/components/PageHeader";
import LoadingSpinner from "~/components/LoadingSpinner";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";

const SolutionsPage: NextPage = () => {
  const { data: solutions } = api.solution.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Solutions</title>
      </Head>
      <PageHeader pageTitle="Solutions" />

      <main>
        <section data-test-id="solutionsContainer" className="mx-auto flex max-w-7xl flex-wrap ">
          {solutions ? (
            solutions.map((solution) => (
              <SolutionCard key={solution.id} solution={solution} />
            ))
          ) : (
            <div className="flex h-[80vh] w-full items-center justify-center ">
              <LoadingSpinner />
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const ssg = generateSSGHelper();
  await ssg.solution.getAll.prefetch();
  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 10 * 60, // 10 minutes
  };
};

export default SolutionsPage;

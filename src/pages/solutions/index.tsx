import type { NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import SolutionCard from "../../components/SolutionCard";
import PageHeader from "~/components/PageHeader";
import LoadingSpinner from "~/components/LoadingSpinner";

const SolutionsPage: NextPage = () => {
  const { data: solutions } = api.solution.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Solutions</title>
      </Head>
      <PageHeader pageTitle="Solutions" />

      <main>
        <section className="mx-auto flex max-w-7xl flex-wrap ">
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

export default SolutionsPage;

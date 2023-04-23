import type { NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import SolutionCard from "../../components/SolutionCard";
import PageHeader from "~/components/PageHeader";

const SolutionsPage: NextPage = () => {
  const { data: solutions } = api.solution.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Solutions</title>
      </Head>
      <PageHeader pageTitle="Solutions" />

      <main>
        <section
          style={
            {
              // columnGap: "1em",
            }
          }
          className="mx-auto flex max-w-7xl flex-wrap "
        >
          {solutions?.map((solution) => (
            <SolutionCard key={solution.id} solution={solution} />
          ))}
        </section>
      </main>
    </>
  );
};

export default SolutionsPage;

import type { NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import SolutionCard from "../../components/SolutionCard";

const SolutionsPage: NextPage = () => {
  const { data: solutions } = api.solution.getAll.useQuery();
  console.log("solutions", solutions);

  return (
    <>
      <Head>
        <title>Solutions</title>
      </Head>
      <main>
        <section style={{
          // columnGap: "1em",
        }} className=" columns-[25em] max-w-7xl mx-auto ">
          {solutions?.map((solution) => (
            <SolutionCard key={solution.id} solution={solution} />
          ))}
        </section>
      </main>
    </>
  );
};

export default SolutionsPage;

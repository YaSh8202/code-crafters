import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import LoadingSpinner from "~/components/LoadingSpinner";
import PageHeader from "~/components/PageHeader";
import SolutionCard from "~/components/SolutionCard";
import { SolutionIcon } from "~/components/Icones";
import { api } from "~/utils/api";

const SolutionsPage: NextPage = () => {
  const router = useRouter();
  const slug = router.query.slug as string;

  const { data: solutions } = api.solution.getAllByChallenge.useQuery({
    slug: slug,
  });
  console.log("solutions", solutions);

  return (
    <>
      <Head>
        <title>Code Crafters</title>
      </Head>
      <PageHeader pageTitle={"challenge"}>
          <Link href={`/challenges/${slug}`}>
            <p className="two group relative w-max">
              <span className="font-medium">Overview</span>
              <span className="absolute -bottom-1 left-1/2 h-0.5 w-0 bg-blue-400 transition-all duration-300 group-hover:w-[50%]"></span>
              <span className="absolute -bottom-1 right-1/2 h-0.5 w-0 bg-blue-400 transition-all duration-300 group-hover:w-[50%]"></span>
            </p>
          </Link>
          <Link href={`/challenges/${slug}/solutions`}>
            <p className="two group relative ml-4 w-max">
              <span className="font-medium">Solutions</span>
              <span className="absolute -bottom-1 left-1/2 h-0.5  w-[50%] bg-blue-400 transition-all duration-300 "></span>
              <span className="absolute -bottom-1 right-1/2 h-0.5  w-[50%] bg-blue-400 transition-all duration-300"></span>
            </p>
          </Link>
      </PageHeader>

      <main>
        <section
          data-test-id="solutionsContainer"
          className="mx-auto flex max-w-7xl flex-wrap "
        >
          {solutions ? (
            solutions.length > 0 ? (
              solutions.map((solution) => (
                <SolutionCard key={solution.id} solution={solution} />
              ))
            ) : (
              <div className="mt-[10rem] flex w-full flex-col items-center justify-center gap-4 rounded-lg border border-gray-200 bg-white p-8 shadow-md transition-all duration-300 hover:shadow-lg">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                  <SolutionIcon className="h-10 w-10 text-blue-500" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">No solutions yet</h3>
                <p className="max-w-md text-center text-gray-500">Be the first to submit a solution for this challenge!</p>
                <Link href={`/challenges/${slug}/solutions/new`}>
                  <button className="mt-4 transform rounded-md bg-blue-500 px-6 py-2.5 text-white transition-all duration-300 hover:scale-105 hover:bg-blue-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Submit Solution
                  </button>
                </Link>
              </div>
            )
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

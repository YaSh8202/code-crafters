import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import LoadingSpinner from "~/components/LoadingSpinner";
import PageHeader from "~/components/PageHeader";
import SolutionCard from "~/components/SolutionCard";
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
              <div className="mt-[15rem] flex w-full items-center justify-center">
                <p>No solutions yet. </p>
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

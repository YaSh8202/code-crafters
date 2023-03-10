// import { type InferGetStaticPropsType, type GetStaticPropsContext } from "next";
// import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import Head from "next/head";
import { api } from "~/utils/api";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";

const ChallengePage = () =>
  // props: InferGetStaticPropsType<typeof getStaticProps>
  {
    const { slug } = useRouter().query;
    const { data: challenge } = api.challenge.getBySlug.useQuery({
      slug: slug as string,
    });

    if (!challenge || !slug) return <div>Challenge not found</div>;

    return (
      <>
        <Head>
          <title>Code Crafters | {challenge.title}</title>
        </Head>
        <main className="px-32 pt-8">
          <div className="grid grid-cols-2 gap-6 ">
            <section className=" col-span-2 flex flex-row space-x-6 rounded-xl border bg-white p-6 ">
              <div className="my-auto flex flex-1 flex-col space-y-4">
                <div className="flex flex-row items-center justify-between">
                  <p className="font-medium uppercase text-green-500">
                    {challenge.type}
                  </p>
                  <p className="rounded-md border border-red-200 p-0.5 text-sm font-medium uppercase text-red-500">
                    {challenge.difficulty}
                  </p>
                </div>
                <h2 className="text-3xl font-semibold">{challenge.title}</h2>
                <p>{challenge.shortDesc}</p>
                <Link href={`/challenges/${slug as string}/solutions/new`} className="btn-primary btn w-48 ">
                  Start Challenge
                </Link>
              </div>
              <div className=" carousel w-full flex-1">
                {challenge.imagesURL.map((imgSrc, i) => (
                  <div
                    key={i}
                    id={`item${i}`}
                    className="carousel-item relative min-h-[25rem] w-full"
                  >
                    <Image
                      src={imgSrc}
                      className="w-full"
                      fill
                      alt={"challengeImage"}
                    />
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                      <a
                        href={`#item${
                          i - 1 < 0 ? challenge.imagesURL.length - 1 : i - 1
                        }`}
                        className="btn-circle btn"
                      >
                        ❮
                      </a>
                      <a
                        href={`#item${(i + 1) % challenge.imagesURL.length}`}
                        className="btn-circle btn"
                      >
                        ❯
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section className="col-span-2  rounded-xl border bg-white p-6">
              <h4 className="text-2xl font-bold">Brief</h4>
              <p>{challenge.briefDesc}</p>
            </section>
          </div>
        </main>
      </>
    );
  };

// export async function getStaticPaths() {
//   const challenges = await prisma.challenge.findMany({
//     select: {
//       slug: true,
//     },
//   });
//   // console.log(challenges);
//   return {
//     paths: challenges.map((challenge) => ({
//       params: { slug: challenge.slug },
//     })),
//     fallback: "blocking", // can also be true or 'blocking'
//   };
// }

// `getStaticPaths` requires using `getStaticProps`
// export async function getStaticProps(
//   context: GetStaticPropsContext<{ slug: string }>
// ) {
//   const slug = context.params?.slug as string;
//   const ssg = createProxySSGHelpers({
//     router: appRouter,
//     ctx: {
//       prisma,
//       session: null,
//     },
//     transformer: superjson, // optional - adds superjson serialization
//   });
//   // const id = context.params?.id as string;

//   // prefetch `post.byId`
//   await ssg.challenge.getBySlug.prefetch({ slug });
//   return {
//     // Passed to the page component as props
//     props: {
//       trpcState: ssg.dehydrate(),
//       slug,
//     },
//   };
// }

export default ChallengePage;

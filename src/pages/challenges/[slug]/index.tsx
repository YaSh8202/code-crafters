import { type GetStaticProps } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { prisma } from "~/server/db";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { useSession } from "next-auth/react";
import PageHeader from "~/components/PageHeader";
import { StarFilled, StarOutline } from "~/components/Icones";
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default.Markdown),
  { ssr: false }
);

const ChallengePage = (props: { slug: string }) => {
  const { slug } = props;
  const utilis = api.useContext();
  const { data: challenge } = api.challenge.getBySlug.useQuery({
    slug: slug,
  });
  const { status } = useSession();
  const { data } = api.challenge.isStarred.useQuery({
    slug,
  });
  const toggleStar = api.challenge.toggleStar.useMutation({
    onError: (error) => {
      console.log(error);
    },
    onMutate: async ({ slug }) => {
      await utilis.challenge.isStarred.cancel({
        slug,
      });
      const prevData = utilis.challenge.isStarred.getData({
        slug,
      });
      if (!prevData) {
        return { prevData };
      }
      utilis.challenge.isStarred.setData(
        {
          slug,
        },
        (prevData) => {
          if (!prevData) {
            return {
              isStarred: false,
              stars: 0,
            };
          }

          return {
            ...prevData,
            isStarred: !prevData.isStarred,
            stars: prevData.isStarred ? prevData.stars - 1 : prevData.stars + 1,
          };
        }
      );
      return { prevData };
    },
    onSettled: async (newChallenge) => {
      if (!newChallenge) return;
      await utilis.challenge.isStarred.refetch({
        slug,
      });
    },
  });
  const isStarred = data?.isStarred || false;
  const starCount = data?.stars || 0;

  const handleStar = () => {
    toggleStar.mutate({ slug });
  };

  if (!challenge || !slug) return <div>Challenge not found</div>;
  return (
    <>
      <Head>
        <title>{challenge.title}</title>
      </Head>
      <PageHeader pageTitle={"challenge"} />
      <main
        style={{
          width: "clamp(300px,80rem,90vw)",
        }}
        className=" mx-auto pt-4  md:pt-8"
      >
        <div className="grid grid-cols-2 gap-6 ">
          <section className=" col-span-2 flex flex-col-reverse space-y-4 rounded-xl border bg-white p-3 md:p-6 md:flex-row md:space-x-6 ">
            <div className="mt-2 flex flex-col space-y-4 md:my-auto md:flex-1">
              <div className="flex flex-row items-center justify-between">
                <p className="font-medium uppercase text-green-500">
                  {challenge.type}
                </p>
                <p className="rounded-md border border-red-200 p-0.5 text-sm font-medium uppercase text-red-500">
                  {challenge.difficulty}
                </p>
              </div>
              <div className="flex flex-row items-center justify-between">
                <h2 className="text-3xl font-semibold">{challenge.title}</h2>
                {status === "authenticated" && (
                  <button
                    onClick={() => void handleStar()}
                    className={` flex items-center gap-1 rounded-xl border  px-3 py-1 font-semibold uppercase duration-200 hover:border-blue-400 hover:text-blue-400 ${
                      isStarred ? "text-blue-500" : "text-gray-700"
                    } `}
                  >
                    {isStarred ? (
                      <StarFilled fontSize={20} />
                    ) : (
                      <StarOutline fontSize={20} />
                    )}
                    {starCount}
                  </button>
                )}
              </div>
              <p>{challenge.shortDesc}</p>
              {status === "authenticated" && (
                <Link
                  href={`/challenges/${slug}/solutions/new`}
                  className={`btn-primary btn w-48 `}
                >
                  Start Challenge
                </Link>
              )}
            </div>
            <div className=" carousel w-full flex-1">
              {challenge.imagesURL?.map((imgSrc, i) => (
                <div
                  key={i}
                  id={`item${i}`}
                  className="carousel-item relative min-h-[25rem] w-full"
                >
                  <Image
                    src={imgSrc}
                    className="w-full object-cover"
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
          <section
            data-color-mode="light"
            className=" prose col-span-2 max-w-full rounded-xl  bg-white"
          >
            <MDEditor
              style={
                {
                  // borderRadius: "0.5rem",
                }
              }
              className="rounded-xl border p-6 "
              source={challenge.briefDesc}
            />
          </section>
        </div>
      </main>
    </>
  );
};

export async function getStaticPaths() {
  const challenges = await prisma.challenge.findMany({
    select: {
      slug: true,
    },
  });
  return {
    paths: challenges.map((challenge) => ({
      params: { slug: challenge.slug },
    })),
    fallback: "blocking", // can also be true or 'blocking'
  };
}

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("Slug is not a string");

  await ssg.challenge.getBySlug.prefetch({ slug });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      slug,
    },
    revalidate: 60 * 60, // 1 hour
  };
};

export default ChallengePage;

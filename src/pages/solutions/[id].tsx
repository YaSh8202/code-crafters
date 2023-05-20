import { type GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {
  Downvote,
  Fa6SolidArrowUpRightFromSquare,
  FilledDownvote,
  FilledUpvote,
  Upvote,
} from "~/components/Icones";
import { prisma } from "~/server/db";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";
import { timeAgo } from "~/utils/helpers";
import dynamic from "next/dynamic";
import Comments from "~/components/Comments";
import { useSession } from "next-auth/react";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default.Markdown),
  { ssr: false }
);

const SolutionPage = ({ id }: { id: string }) => {
  const utilis = api.useContext();
  const { status } = useSession();

  const { data: solution } = api.solution.getById.useQuery(
    { id: id || "" },
    {
      onError: (err) => {
        console.log("error", err);
      },
    }
  );
  const { data: vote } = api.solution.getVotes.useQuery({
    id,
  });
  const mutateUpvote = api.solution.upvote.useMutation({
    onMutate: async ({ id }) => {
      await utilis.solution.getVotes.cancel({
        id,
      });
      const prevData = utilis.solution.getVotes.getData({
        id,
      });
      if (!prevData) {
        return { prevData };
      }
      utilis.solution.getVotes.setData(
        {
          id,
        },
        (prevData) => {
          if (!prevData) {
            return {
              voteCount: 0,
              voteValue: 0,
            };
          }
          return {
            ...prevData,
            voteCount:
              prevData.voteValue === 1
                ? prevData.voteCount - 1
                : prevData.voteValue === -1
                ? prevData.voteCount + 2
                : prevData.voteCount + 1,
            voteValue: prevData.voteValue === 1 ? 0 : 1,
          };
        }
      );
    },
  });
  const mutateDownvote = api.solution.downvote.useMutation({
    onMutate: async ({ id }) => {
      await utilis.solution.getVotes.cancel({
        id,
      });
      const prevData = utilis.solution.getVotes.getData({
        id,
      });
      if (!prevData) {
        return { prevData };
      }
      utilis.solution.getVotes.setData(
        {
          id,
        },
        (prevData) => {
          if (!prevData) {
            return {
              voteCount: 0,
              voteValue: 0,
            };
          }
          return {
            ...prevData,
            voteCount:
              prevData.voteValue === -1
                ? prevData.voteCount + 1
                : prevData.voteValue === 1
                ? prevData.voteCount - 2
                : prevData.voteCount - 1,
            voteValue: prevData.voteValue === -1 ? 0 : -1,
          };
        }
      );
    },
  });

  if (!solution) return <div>loading...</div>;

  const image = solution.image || solution.challenge.imagesURL[0];
  const title = `Code Crafters | ${solution.title || ""}`;

  const upvoteHandler = () => {
    mutateUpvote.mutate({ id });
  };

  const downvoteHandler = () => {
    mutateDownvote.mutate({ id });
  };

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <main className="relative max-w-full  ">
        <article
          style={{
            backgroundImage: `url(${image || ""})`,
          }}
          className="relative left-[calc(-50vw+50%)] w-screen bg-gray-900/80 bg-cover  bg-center bg-no-repeat px-4 bg-blend-multiply  "
        >
          <div className=" mx-auto  max-w-6xl  py-8 text-gray-100  ">
            <div className="relative mx-auto flex max-w-4xl flex-col items-center py-12 ">
              {vote && (
                <div className="absolute left-0 flex flex-col items-center space-y-1 text-xl duration-100 ">
                  <button
                    disabled={
                      mutateUpvote.status === "loading" ||
                      status !== "authenticated"
                    }
                    onClick={() => void upvoteHandler()}
                    className="group hover:text-green-400 disabled:cursor-not-allowed "
                  >
                    {vote.voteValue === 1 ? (
                      <FilledUpvote className="text-green-500 group-hover:text-green-400 " />
                    ) : (
                      <Upvote />
                    )}
                  </button>
                  <p>{vote.voteCount}</p>
                  <button
                    disabled={
                      mutateDownvote.status === "loading" ||
                      status !== "authenticated"
                    }
                    onClick={() => void downvoteHandler()}
                    className="group disabled:cursor-not-allowed "
                  >
                    {vote.voteValue === -1 ? (
                      <FilledDownvote className=" text-red-400 " />
                    ) : (
                      <Downvote className=" group-hover:text-red-400 " />
                    )}
                  </button>
                </div>
              )}
              <p className="text-sm md:text-base">
                Submitted about {timeAgo(solution.createdAt)}
              </p>
              <h1 className="my-3 px-6 text-center text-2xl font-semibold tracking-wider md:text-3xl ">
                {solution.title}
              </h1>
              <div className="my-2 flex flex-row items-center space-x-3 ">
                <Link
                  className="group"
                  href={`/profile/${solution.user.username}`}
                >
                  <Image
                    src={solution.user.image}
                    width={50}
                    height={50}
                    alt={"user-avatar"}
                    className="rounded-full"
                  />
                </Link>
                <div className="flex flex-col items-start gap-y-0.5">
                  <Link
                    className="group"
                    href={`/profile/${solution.user.username}`}
                  >
                    <p className="font-semibold hover:underline  ">
                      {solution.user.name}
                    </p>
                  </Link>
                  <p className="text-sm text-gray-300">
                    @{solution.user.username}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <div className="flex w-full flex-col items-center space-y-3 sm:space-x-3 sm:flex-row">
                {solution.liveURL && (
                  <Link
                    target="_blank"
                    href={solution.liveURL}
                    className="flex w-full flex-row items-center justify-center gap-2 rounded-full bg-red-500 px-5 py-2 text-lg font-semibold uppercase text-white duration-150 hover:brightness-90 sm:w-auto "
                  >
                    Preview
                    <Fa6SolidArrowUpRightFromSquare fontSize={14} />
                  </Link>
                )}
                <Link
                  target="_blank"
                  href={`${solution.repoURL}`}
                  className="flex w-full items-center justify-center  gap-2 rounded-full  bg-gray-100 px-5 py-2 text-lg font-semibold uppercase text-gray-800 duration-150 hover:brightness-90 sm:w-auto "
                >
                  View Code
                  <Fa6SolidArrowUpRightFromSquare fontSize={14} />
                </Link>
              </div>
              <div className="flex flex-row items-center space-x-3">
                {/* <button className="flex items-center gap-2  rounded-full bg-gray-100 px-5 py-2 text-lg font-semibold uppercase text-gray-800 duration-150 hover:brightness-90 ">
                  <Upvote />
                  {solution.voteValue}
                </button> */}
              </div>
            </div>
          </div>
        </article>
        <Challenge
          image={image}
          title={solution.challenge.title}
          slug={solution.challenge.slug}
          difficulty={solution.challenge.difficulty}
          type={solution.challenge.type}
        />

        {solution.image && (
          <div className="mx-auto my-12 flex w-full max-w-5xl ">
            <div className="mx-auto ">
              <Image
                src={solution.image}
                width={1024}
                height={600}
                alt={"solutin image"}
              />
            </div>
          </div>
        )}
        {solution.description && (
          <section
            data-color-mode="light"
            className="prose max-w-5xl  col-span-2 mx-auto mt-8 w-[clamp(20rem,90vw,64rem)] rounded-xl border bg-white  p-6  "
          >
            <h3>Description</h3>
            <MDEditor
              style={
                {
                  // borderRadius: "0.5rem",
                }
              }
              // className="  p-6 "
              source={solution.description}
            />
          </section>
        )}
        <Comments id={solution.id} />
      </main>
    </>
  );
};

export default SolutionPage;

export async function getStaticPaths() {
  const solutions = await prisma.solution.findMany({
    select: {
      id: true,
    },
  });
  return {
    paths: solutions.map((solution) => ({
      params: { id: solution.id },
    })),
    fallback: "blocking", // can also be true or 'blocking'
  };
}

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no solution id");

  await ssg.solution.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id: id,
    },
  };
};

const Challenge = ({
  image,
  title,
  difficulty,
  type,
  slug,
}: {
  image?: string;
  title: string;
  difficulty: string;
  type: string;
  slug: string;
}) => {
  return (
    <div
      style={{
        clipPath: "inset(0 -100vmax)",
      }}
      className="flex items-center justify-between border-b bg-white px-3 py-5 shadow-[0_0_0_100vmax] shadow-white"
    >
      <div className="flex items-center">
        {image && (
          <Image
            className={"mr-3 hidden h-24 w-36 md:block "}
            src={image}
            width={150}
            height={100}
            alt="solution-image"
          />
        )}
        <div className="flex flex-col items-start gap-1">
          <p>This is a solution for...</p>
          <Link
            href={`/challenges/${slug}`}
            className="text-lg font-medium hover:underline "
          >
            {title}
          </Link>
          <div className="flex items-center gap-3">
            <p className="uppercase text-green-500 ">{type}</p>
            <p className="uppercase text-red-500 ">{difficulty}</p>
          </div>
        </div>
      </div>
      <Link
        className="hidden items-center gap-2 rounded-full  bg-blue-600 px-6 py-2 text-lg font-semibold uppercase text-white duration-150  hover:brightness-90 md:flex "
        href={`/challenges/${slug}`}
      >
        View Challenge
      </Link>
    </div>
  );
};

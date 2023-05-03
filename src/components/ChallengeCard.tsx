import Image from "next/image";
import Link from "next/link";
import React from "react";
import { StarFilled, StarOutline } from "./Icones";
import { type RouterOutputs, api } from "~/utils/api";
import { useSession } from "next-auth/react";

type AllChallenges = RouterOutputs["challenge"]["getAll"];

type Props = {
  challenge: AllChallenges[number];
};

function ChallengeCard({
  challenge: {
    title,
    shortDesc: description,
    imagesURL: [image],
    type,
    slug,
    difficulty,
  },
}: Props) {
  const utilis = api.useContext();
  const { status } = useSession();

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
  const { data } = api.challenge.isStarred.useQuery({
    slug,
  });

  const isStarred = data?.isStarred || false;
  const starCount = data?.stars || 0;

  const handleStar = () => {
    toggleStar.mutate({ slug });
  };

  return (
    <div
      data-test-id="challengeCard"
      className="card mx-3 max-w-[24rem] justify-self-center border bg-base-100 md:mx-0  "
    >
      <figure className="relative">
        <Link href={`/challenges/${slug}`}>
          <Image
            src={image ?? ""}
            alt={`${title}-image`}
            width={384}
            height={256}
            className="h-[256px] object-cover transition-all duration-300 hover:scale-105"
          />
        </Link>

        <button
          disabled={status !== "authenticated"}
          onClick={() => void handleStar()}
          className={`absolute right-3 top-3  flex items-center gap-1 rounded-xl border bg-gray-100 px-3 py-2 font-semibold uppercase shadow duration-150 hover:text-blue-400 disabled:hover:text-gray-600 ${
            isStarred ? "text-blue-500" : "text-gray-700"
          }  `}
        >
          {isStarred ? (
            <StarFilled fontSize={20} />
          ) : (
            <StarOutline fontSize={20} />
          )}
          {starCount}
        </button>
      </figure>
      <div className="card-body">
        <Link
          data-test-id="challengeCardTitle"
          href={`/challenges/${slug}`}
          className="card-title line-clamp-1 text-2xl hover:link "
        >
          <h4>{title}</h4>
        </Link>
        <div className="flex items-center justify-between">
          <span className="font-semibold uppercase text-accent">{type}</span>
          <span className="font-semibold uppercase text-accent">
            {difficulty}
          </span>
        </div>
        <p data-test-id="challengeCardDescription" className="line-clamp-4">
          {description}
        </p>
      </div>
    </div>
  );
}

export default ChallengeCard;

import { type Difficulty, type ChallengeType } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { StarFilled, StarOutline } from "./Icones";
import { type RouterOutputs, api } from "~/utils/api";
import type {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "@tanstack/react-query";

type AllChallenges = RouterOutputs["challenge"]["getAll"];

type Props = {
  title: string;
  description: string;
  image?: string;
  type: ChallengeType;
  slug: string;
  difficulty: Difficulty;
  starCount: number;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<AllChallenges, unknown>>;
};

function ChallengeCard({
  slug,
  title,
  description,
  image,
  type,
  difficulty,
  starCount,
  refetch,
}: Props) {
  const toggleStar = api.challenge.toggleStar.useMutation({
    onSuccess: (data) => {
      console.log(data);
      void refetch();
      void refetchIsStarred();
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const { data: isStarred, refetch: refetchIsStarred } =
    api.challenge.isStarred.useQuery({ slug });

  const handleStar = async () => {
    await toggleStar.mutateAsync({ slug });
  };

  return (
    <div className="card max-w-[24rem] justify-self-center border bg-base-100  ">
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
          onClick={() => void handleStar()}
          className={`absolute right-3 top-3 flex items-center gap-1 rounded-xl border bg-gray-100 px-3 py-2 font-semibold uppercase shadow duration-150 hover:text-blue-400 ${
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
      </figure>
      <div className="card-body">
        <Link
          href={`/challenges/${slug}`}
          className="card-title text-2xl hover:link  "
        >
          {title}
        </Link>
        <div className="flex items-center justify-between">
          <span className="font-semibold uppercase text-accent">{type}</span>
          <span className="font-semibold uppercase text-accent">
            {difficulty}
          </span>
        </div>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default ChallengeCard;

import { type Difficulty, type ChallengeType } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  title: string;
  description: string;
  image?: string;
  type: ChallengeType;
  slug: string;
  difficulty: Difficulty;
};

function ChallengeCard({
  slug,
  title,
  description,
  image,
  type,
  difficulty,
}: Props) {
  return (
    <div className="card max-w-[24rem] justify-self-center border bg-base-100  ">
      <figure>
        <Link href={`/challenges/${slug}`}>
          <Image
            src={image ?? ""}
            alt={`${title}-image`}
            width={384}
            height={256}
            className="transition-all duration-300 hover:scale-105 h-[256px] object-cover"
          />
        </Link>
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

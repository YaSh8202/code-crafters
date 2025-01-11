import React from "react";
import { type RouterOutputs } from "~/utils/api";
import ChallengeCard from "./ChallengeCard";

type Challenge = RouterOutputs["challenge"]["getAll"][number];

function Challenges({ challenges }: { challenges?: Challenge[] }) {
  return (
    <section className=" mx-auto mt-4 max-w-7xl  ">
      <div className="grid w-full grid-cols-4 gap-8">
        {challenges ? (
          challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              // refetch={refetch}
            />
          ))
        ) : (
          <div
            className="mx-auto inline-block h-8 w-8 animate-spin rounded-full border-[3px] border-current border-t-transparent text-blue-600"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </div>
    </section>
  );
}

export default Challenges;

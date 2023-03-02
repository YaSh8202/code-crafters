import Image from "next/image";
import React from "react";

type Props = {
  title: string;
  description: string;
  image: string;
};

function ChallengeCard({ title, description, image }: Props) {
  return (
    <div className="card max-w-[24rem] bg-base-100 shadow-xl justify-self-center ">
      <figure>
        <Image src={image} alt={`${title}-image`} width={384} height={256} />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-2xl  ">{title}</h2>
        <p>{description}</p>
        {/* <div className="card-actions justify-end">
          <button className="btn-primary btn">Buy Now</button>
        </div> */}
      </div>
    </div>
  );
}

export default ChallengeCard;

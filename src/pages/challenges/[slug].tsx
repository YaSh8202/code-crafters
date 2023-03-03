import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const ChallengePage: NextPage = () => {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const { slug } = useRouter().query;
  const { data: challenge } = api.challenge.getById.useQuery({
    id: slug as string,
  });
  console.log(challenge, slug);

  return (
    <>
      <Head>
        <title>Code Crafters</title>
      </Head>
    </>
  );
};

// export async function getStaticPaths() {
//   return {
//     paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
//     fallback: false, // can also be true or 'blocking'
//   }
// }

// // `getStaticPaths` requires using `getStaticProps`
// export async function getStaticProps(context) {
//   return {
//     // Passed to the page component as props
//     props: { post: {} },
//   }
// }

export default ChallengePage;

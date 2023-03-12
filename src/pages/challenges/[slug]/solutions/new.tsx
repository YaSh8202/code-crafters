import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/utils/api";
import Select from "react-select";

type FormValues = {
  title: string;
  repoURL: string;
  liveURL: string;
  description: string;
};
const tagsOptions = [
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "MongoDB",
  "Mongoose",
  "TypeScript",
  "JavaScript",
  "CSS",
  "HTML",
  "Sass",
  "Tailwind",
  "Bootstrap",
  "Material UI",
  "React Native",
  "Flutter",
  "Dart",
  "Firebase",
  "GraphQL",
  "Apollo",
  "Redux",
  "MobX",
  "Zustand",
  "Jotai",
  "swr",
  "React Query",
  "React Hook Form",
  "Redis",
];

const NewSolutionPage: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [tags, setTags] = React.useState<string[]>([]);
  const router = useRouter();
  const { slug } = router.query;
  const challengeId = api.challenge.getChallengeIdBySlug.useQuery({
    slug: slug as string,
  });
  const createNewSolution = api.solution.create.useMutation({
    onSuccess: () => {
      void router.push(`/challenges/${slug as string}/solutions`);
    },
  });
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    if (!challengeId.data?.id) {
      return;
    }
    createNewSolution.mutate({
      repoURL: data.repoURL,
      liveURL: data.liveURL,
      tags: tags,
      description: data.description,
      title: data.title,
      challengeId: challengeId.data?.id,
    });
  };
  return (
    <>
      <Head>
        <title>New Solution</title>
      </Head>
      <main className="flex min-h-screen flex-col py-12 ">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit(onSubmit)();
          }}
          className="mx-auto flex w-full max-w-3xl flex-col rounded-lg border bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col space-x-2">
            <label className="label">
              <span className="label-text text-base font-medium">
                Solution title *
              </span>
            </label>
            <input
              {...register("title", {
                required: "Solution title is required",
              })}
              placeholder=""
              type="text"
              className={`input-bordered ${
                errors.title ? "input-error" : ""
              } input w-full`}
            />
            {errors.title?.type === "required" && (
              <label className="label">
                <span className="label-text-alt text-red-400">
                  {errors.title?.message}
                </span>
              </label>
            )}
          </div>
          <div className="flex flex-col space-x-2">
            <label className="label">
              <span className="label-text text-base font-medium">
                Repository URL *
              </span>
            </label>
            <input
              {...register("repoURL", {
                required: "Repository URL is required",
              })}
              placeholder=""
              type="text"
              className={`input-bordered ${
                errors.title ? "input-error" : ""
              } input w-full`}
            />
            {errors.title?.type === "required" && (
              <label className="label">
                <span className="label-text-alt text-red-400">
                  {errors.liveURL?.message}
                </span>
              </label>
            )}
          </div>
          <div className="flex flex-col space-x-2">
            <label className="label">
              <span className="label-text text-base font-medium">
                Live site URL *
              </span>
            </label>
            <input
              {...register("liveURL")}
              placeholder=""
              type="text"
              className={`input-bordered ${
                errors.title ? "input-error" : ""
              } input w-full`}
            />
            {errors.title?.type === "required" && (
              <label className="label">
                <span className="label-text-alt text-red-400">
                  {errors.liveURL?.message}
                </span>
              </label>
            )}
          </div>
          <div className="flex flex-col space-x-2">
            <label className="label">
              <span className="label-text text-base font-medium">Tags *</span>
            </label>
            <Select
              isMulti
              name="tags"
              options={tagsOptions.map((tag) => ({ value: tag, label: tag }))}
              className="basic-multi-select"
              classNamePrefix="select"
              styles={{
                input: (provided) => ({
                  ...provided,
                  padding: "0.5rem 0",
                }),
              }}
              onChange={(e) => {
                setTags(e.map((tag) => tag.value));
              }}
            />
          </div>
          <div className="flex flex-col space-x-2">
            <label className="label">
              <span className="label-text text-base font-medium">
                Brief Description *
              </span>
            </label>
            <textarea
              {...register("description", {
                required: "Brief Description is required",
              })}
              className="textarea-bordered textarea h-24"
              placeholder="Description"
            />
            {errors.description?.type === "required" && (
              <label className="label">
                <span className="label-text-alt text-red-400">
                  {errors.description?.message}
                </span>
              </label>
            )}
          </div>
          <button
            type="submit"
            className="btn-primary btn mt-5
          "
          >
            Submit
          </button>
        </form>
      </main>
    </>
  );
};

export default NewSolutionPage;

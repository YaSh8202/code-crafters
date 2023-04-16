import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/utils/api";
import Select from "react-select";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import {
  codeLive,
  codePreview,
  codeEdit,
} from "@uiw/react-md-editor/lib/commands";
import { useDropzone } from "react-dropzone";
import DropZoneInput from "~/components/DropZoneInput";

type FormValues = {
  title: string;
  repoURL: string;
  liveURL: string;
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
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

const NewSolutionPage: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [tags, setTags] = useState<string[]>([]);
  const [desc, setDesc] = useState<string>("");
  const router = useRouter();
  const [showImageError, setShowImageError] = useState(false);
  const { slug } = router.query;
  const { data: challengeId } = api.challenge.getChallengeIdBySlug.useQuery({
    slug: slug as string,
  });
  const createNewSolution = api.solution.create.useMutation({
    onSuccess: () => {
      void router.push(`/challenges/${slug as string}/solutions`);
    },
  });
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 5000000, // 5MB
  });
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    if (!challengeId?.id) {
      return;
    }
    if (!acceptedFiles[0]) {
      setShowImageError(true);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(acceptedFiles[0]);
    reader.onloadend =  () => {
    console.log("url",reader.result)
      createNewSolution.mutate({
        repoURL: data.repoURL,
        liveURL: data.liveURL,
        tags: tags,
        description: desc,
        title: data.title,
        challengeId: challengeId.id,
        image: reader.result as string,
      });
    };
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
            <label className="label justify-start space-x-2">
              <span className=" label-text text-base font-medium">
                Challenge Images *
              </span>
              {showImageError && (
                <span className="label-text-alt text-red-400">
                  Please upload at least one image
                </span>
              )}
            </label>
            <DropZoneInput
              acceptedFiles={acceptedFiles}
              getInputProps={getInputProps}
              getRootProps={getRootProps}
            />
          </div>
          <div data-color-mode="light" className="flex flex-col space-x-2  ">
            <label className="label">
              <span className="label-text text-base font-medium">
                Brief Description *
              </span>
            </label>
            <MDEditor
              value={desc}
              onChange={(val) => {
                setDesc(val || "");
              }}
              preview="edit"
              enableScroll
              extraCommands={[codeEdit, codePreview, codeLive]}
            />
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

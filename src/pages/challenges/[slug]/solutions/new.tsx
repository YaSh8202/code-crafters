import { type NextPage } from "next";
import Head from "next/head";
import React from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

type FormValues = {
  title: string;
  repoURL: string;
  liveURL: string;
  tags: string[];
  description: string;
};

const NewSolutionPage: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
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
              {...register("title", {
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
              {...register("title")}
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

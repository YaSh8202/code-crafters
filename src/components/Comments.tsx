import Image from "next/image";
import React, { useState, useMemo } from "react";
import { type RouterOutputs, api } from "~/utils/api";
import { timeAgo } from "~/utils/helpers";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import {
  codeLive,
  codePreview,
  codeEdit,
} from "@uiw/react-md-editor/lib/commands";
import { CommentIcon } from "./Icones";

type CommentType = RouterOutputs["solution"]["getComments"][0];

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);
function Comments({ id }: { id: string }) {
  const {
    data: comments,
    isLoading,
    refetch,
  } = api.solution.getComments.useQuery({
    id,
  });

  const commentMap = useMemo(() => {
    const map = new Map<string, CommentType[]>();
    comments?.forEach((comment) => {
      if (comment.parentCommentId) {
        map.set(comment.parentCommentId, [
          ...(map.get(comment.parentCommentId) || []),
          comment,
        ]);
      }
    });
    return map;
  }, [comments]);

  if (isLoading || !comments) {
    return <p>Loading...</p>;
  }

  const refetchComments = () => {
    void refetch();
  };

  return (
    <div className=" mx-auto my-16 max-w-5xl ">
      <CommentForm solId={id} refetchComments={refetchComments} />
      <section className="mt-5 flex flex-col rounded-lg border bg-white p-5">
        {comments.map(
          (comment) =>
            comment.parentCommentId === null && (
              <Comment
                key={comment.id}
                comment={comment}
                solutionId={id}
                commentMap={commentMap}
                refetchComments={refetchComments}
              />
            )
        )}
      </section>
    </div>
  );
}

function Comment({
  comment,
  solutionId,
  commentMap,
  refetchComments,
}: {
  comment: CommentType;
  solutionId: string;
  commentMap: Map<string, CommentType[]>;
  refetchComments: () => void;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const replyHandler = () => {
    setShowReplyForm(!showReplyForm);
  };
  const containerRef = React.useRef<HTMLDivElement>(null);
  const avatarRef = React.useRef<HTMLImageElement>(null);

  return (
    <div ref={containerRef} className="relative mt-3 flex flex-col gap-1 ">
      <div
        style={{
          height: "calc(100% - 30px)",
        }}
        className={`absolute 
          left-[14px] top-[30px] w-[1px]
         bg-gray-300 dark:bg-gray-700
        `}
      />
      <div className="relative flex flex-row items-center gap-2 text-sm ">
        <Image
          ref={avatarRef}
          src={comment.user.image}
          width={28}
          height={28}
          alt={"user image"}
          className="rounded-full"
        />
        <p className="font-semibold">{comment.user.username}</p>
        <p className="">{timeAgo(comment.createdAt)}</p>
      </div>

      <div className="ml-8">
        <p className=" text-lg  ">{comment.text}</p>
        <button
          onClick={replyHandler}
          type="button"
          className="mb-2 inline-flex items-center justify-center gap-2 rounded-md border border-transparent px-2 py-1 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 dark:text-white dark:hover:border-gray-900 dark:hover:bg-gray-900 dark:focus:ring-gray-900 dark:focus:ring-offset-gray-800  "
        >
          <CommentIcon className="text-lg" />
          Reply
        </button>
        {showReplyForm && (
          <CommentForm
            solId={solutionId}
            parentid={comment.id}
            refetchComments={refetchComments}
            onSubmit={() => void setShowReplyForm(false)}
          />
        )}
        {commentMap.get(comment.id)?.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            solutionId={solutionId}
            commentMap={commentMap}
            refetchComments={refetchComments}
          />
        ))}
      </div>
    </div>
  );
}

function CommentForm({
  solId,
  parentid,
  refetchComments,
  onSubmit,
}: {
  solId: string;
  parentid?: string;
  refetchComments: () => void;
  onSubmit?: () => void;
}) {
  const [comment, setComment] = useState("");
  const newComment = api.solution.createComment.useMutation({
    onSuccess: () => {
      refetchComments();
    },
  });

  const handleSubmit = () => {
    if (comment.trim() === "") return;
    onSubmit?.();
    newComment.mutate({
      solId: solId,
      text: comment,
      parentCommentId: parentid,
    });
    setComment("");
  };

  return (
    <div data-color-mode="light" className="flex flex-col space-x-2   ">
      <MDEditor
        value={comment}
        onChange={(val) => {
          setComment(val || "");
        }}
        preview="edit"
        enableScroll
        extraCommands={[codeEdit, codePreview, codeLive]}
        previewOptions={{
          className: "prose",
        }}
      />
      <button
        onClick={handleSubmit}
        disabled={newComment.isLoading || comment.trim() === ""}
        className="  btn-primary btn mt-2 self-end "
      >
        Comment
      </button>
    </div>
  );
}

export default Comments;

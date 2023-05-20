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
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

type CommentType = RouterOutputs["solution"]["getComments"][0];

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);
const MDPreviewer = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default.Markdown),
  { ssr: false }
);

function Comments({ id }: { id: string }) {
  const { data: comments, isLoading } = api.solution.getComments.useQuery({
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

  if (comments.length === 0) {
    return null;
  }

  return (
    <div className=" mx-auto my-16 w-[clamp(20rem,90vw,64rem)] ">
      <CommentForm solId={id} />
      <section className="mt-5 flex flex-col rounded-lg border bg-white p-5">
        {comments.map(
          (comment) =>
            comment.parentCommentId === null && (
              <Comment
                key={comment.id}
                comment={comment}
                solutionId={id}
                commentMap={commentMap}
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
}: {
  comment: CommentType;
  solutionId: string;
  commentMap: Map<string, CommentType[]>;
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
        <Link href={`/profile/${comment.user.username}`}>
          <Image
            ref={avatarRef}
            src={comment.user.image}
            width={28}
            height={28}
            alt={"user image"}
            className="rounded-full"
          />
        </Link>
        <Link href={`/profile/${comment.user.username}`}>
          <p className="font-semibold hover:underline ">
            {comment.user.username}
          </p>
        </Link>
        <p className="">{timeAgo(comment.createdAt)}</p>
      </div>

      <div data-color-mode="light" className="ml-8 ">
        {/* <p className=" text-lg  ">{comment.text}</p> */}
        <MDPreviewer source={comment.text} className="" />
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
            onSubmit={() => void setShowReplyForm(false)}
          />
        )}
        {commentMap.get(comment.id)?.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            solutionId={solutionId}
            commentMap={commentMap}
          />
        ))}
      </div>
    </div>
  );
}

function CommentForm({
  solId,
  parentid,
  onSubmit,
}: {
  solId: string;
  parentid?: string;
  onSubmit?: () => void;
}) {
  const utilis = api.useContext();
  const [comment, setComment] = useState("");
  const { data: session, status } = useSession();
  const newComment = api.solution.createComment.useMutation({
    onMutate: async ({ solId, text, parentCommentId }) => {
      await utilis.solution.getComments.cancel({
        id: solId,
      });
      const previousComments = utilis.solution.getComments.getData({
        id: solId,
      });
      if (!previousComments) {
        return {
          previousComments: [],
        };
      }
      utilis.solution.getComments.setData(
        {
          id: solId,
        },
        (prevData) => {
          if (!prevData) {
            return [];
          }

          return [
            {
              user: {
                username: session?.user.username || "",
                image: session?.user.image || "",
                name: session?.user.name || "",
              },
              id: Math.random().toString(),
              text: text,
              createdAt: new Date(),
              parentCommentId: parentCommentId || null,
            },
            ...prevData,
          ];
        }
      );
    },
    onSettled: async (comment) => {
      if (!comment) return;
      await utilis.solution.getComments.refetch({
        id: comment.solutionId,
      });
    },
  });

  const handleSubmit = () => {
    if(status!=="authenticated"){
      toast("You are not logged in",{
        position: 'bottom-center',
        icon: '🔒',
      })
      return;
    }

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
    <div
      data-color-mode="light"
      className="relative flex flex-col space-x-2   "
    >
      {/* { status !== "authenticated" &&
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20">
          <p className="text-xl text-blue-300">
            
             You need to be logged in to comment
            
          </p>
        </div>
      } */}
      <MDEditor
        value={comment}
        onChange={(val) => {
          setComment(val || "");
        }}
        preview="edit"
        enableScroll
        extraCommands={[codeEdit, codePreview, codeLive]}
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

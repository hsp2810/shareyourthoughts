"use client";

import { createReply } from "@/actions/comment";
import { useToast } from "@/hooks/use-toast";
import { CommentWithUser } from "@/types";
import { User } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { ChangeEvent, useState, useTransition } from "react";
import CommentFooterButtons from "./CommentFooterButtons";
import Reply from "./Reply";
import { Button } from "./ui/button";
import { CardContent, CardFooter } from "./ui/card";
import { Input } from "./ui/input";
interface CommentContentContainerProps {
  comment: CommentWithUser;
  replies: CommentWithUser[];
  loggedInUser: User;
}

export default function CommentReplyInput({
  comment,
  replies,
  loggedInUser,
}: CommentContentContainerProps) {
  const [reply, setReply] = useState<string>("");
  const [showReplyInput, setShowReplyInput] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = () => {
    startTransition(async () => {
      createReply(comment.id, reply).then((data) => {
        if (data.success) {
          toast({
            title: data.success,
            variant: "success",
          });

          setReply("");
          setShowReplyInput(false);
          return;
        }

        toast({
          title: data.error,
          variant: "error",
        });
      });
    });
  };

  return (
    <>
      <CardContent className='flex flex-col gap-8'>
        <CommentFooterButtons comment={comment} loggedInUser={loggedInUser} />

        {replies.length > 0 && (
          <div className='flex flex-col gap-2'>
            <h2 className='font-semibold'>Replies</h2>
            <div className='flex flex-col gap-2'>
              {replies.map((reply) => (
                <Reply
                  key={reply.id}
                  reply={reply}
                  loggedInUser={loggedInUser}
                />
              ))}
            </div>
          </div>
        )}

        {showReplyInput && (
          <Input
            type='text'
            placeholder='Add a reply'
            value={reply}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setReply(e.target.value)
            }
          />
        )}
      </CardContent>

      <CardFooter>
        {showReplyInput && reply.length > 0 && (
          <Button className='mr-2' onClick={handleSubmit}>
            {isPending ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              "Submit"
            )}
          </Button>
        )}
        <Button
          variant='outline'
          onClick={() => setShowReplyInput(!showReplyInput)}
        >
          {showReplyInput ? "Cancel" : "Reply"}
        </Button>
      </CardFooter>
    </>
  );
}

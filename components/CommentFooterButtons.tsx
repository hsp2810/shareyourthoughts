"use client";

import { deleteComment, editComment } from "@/actions/comment";
import { useToast } from "@/hooks/use-toast";
import { CommentWithUser } from "@/types";
import { User } from "@prisma/client";
import { Check, Loader2, Pencil, Trash } from "lucide-react";
import { ChangeEvent, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface CommentFooterButtonsProps {
  comment: CommentWithUser;
  loggedInUser: User;
}

export default function CommentFooterButtons({
  comment,
  loggedInUser,
}: CommentFooterButtonsProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState<string>(comment.content);

  const handleDelete = () => {
    startTransition(() => {
      deleteComment(comment.id).then((data) => {
        if (data.success) {
          toast({
            title: data.success,
            variant: "success",
          });
        } else {
          toast({
            title: data.error,
            variant: "error",
          });
        }
      });
    });
  };

  const handleEdit = () => {
    startTransition(() => {
      editComment(comment.id, editedComment).then((data) => {
        if (data.success) {
          toast({
            title: data.success,
            variant: "success",
          });
          setEditedComment("");
          setIsEditing(false);
        } else {
          toast({
            title: data.error,
            variant: "error",
          });
        }
      });
    });
  };

  return (
    <div className='flex items-center gap-3 justify-between'>
      {isEditing ? (
        <Input
          type='text'
          placeholder='Edit your reply'
          value={editedComment}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEditedComment(e.target.value)
          }
        />
      ) : (
        <p className='text-sm text-gray-700'>{comment.content}</p>
      )}

      {loggedInUser.id === comment.user.id && (
        <div className='flex flex-col md:flex-row gap-2'>
          {isEditing ? (
            <Button
              variant='outline'
              size='icon'
              disabled={isPending}
              onClick={handleEdit}
            >
              {isPending ? <Loader2 className='animate-spin' /> : <Check />}
            </Button>
          ) : (
            <Button
              variant='outline'
              size='icon'
              disabled={isPending}
              onClick={() => setIsEditing(!isEditing)}
            >
              <Pencil />
            </Button>
          )}
          <Button
            variant='destructive'
            size='icon'
            disabled={isPending}
            onClick={handleDelete}
          >
            {isPending ? <Loader2 className='animate-spin' /> : <Trash />}
          </Button>
        </div>
      )}
    </div>
  );
}

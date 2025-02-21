"use client";

import { Card, CardContent, CardFooter } from "./ui/card";
import { CardHeader, CardTitle } from "./ui/card";
import { CommentWithUser } from "@/types";
import { Button } from "./ui/button";
import { Check, Loader2, Pencil, Trash } from "lucide-react";
import { User } from "@prisma/client";
import { ChangeEvent, useState, useTransition } from "react";
import { deleteReply, editReply } from "@/actions/comment";
import { useToast } from "@/hooks/use-toast";
import { Input } from "./ui/input";
interface ReplyProps {
  reply: CommentWithUser;
  loggedInUser: User;
}

export default function Reply({ reply, loggedInUser }: ReplyProps) {
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedReply, setEditedReply] = useState<string>(reply.content);
  const { toast } = useToast();

  const handleDelete = () => {
    startTransition(() => {
      deleteReply(reply.id).then((data) => {
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
      editReply(reply.id, editedReply).then((data) => {
        if (data.success) {
          toast({
            title: data.success,
            variant: "success",
          });
          setEditedReply("");
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
    <Card className='flex items-center justify-between'>
      <div className='flex gap-2 items-center'>
        <CardHeader className='p-3'>
          <CardTitle className='text-sm'>
            {reply.user.name} {reply.user.id === loggedInUser.id && "(You)"}
          </CardTitle>
        </CardHeader>

        <CardContent className='px-0 py-3'>
          {isEditing ? (
            <Input
              type='text'
              placeholder='Edit your reply'
              value={editedReply}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEditedReply(e.target.value)
              }
            />
          ) : (
            <p className='text-sm text-gray-700'>{reply.content}</p>
          )}
        </CardContent>
      </div>

      {loggedInUser.id === reply.user.id && (
        <CardFooter className='p-3 gap-2'>
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
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? <Loader2 className='animate-spin' /> : <Trash />}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

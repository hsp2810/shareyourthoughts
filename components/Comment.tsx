import { prisma } from "@/lib/db";
import { CommentWithUser } from "@/types";
import { User } from "@prisma/client";
import CommentContentContainer from "./CommentContentContainer";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface CommentProps {
  comment: CommentWithUser;
  loggedInUser: User;
}

export default async function Comment({ comment, loggedInUser }: CommentProps) {
  const replies = await prisma.comment.findMany({
    where: {
      parentId: comment.id,
    },
    include: {
      user: true,
    },
  });

  return (
    <Card>
      <CardHeader className='flex flex-row justify-between'>
        <div className='flex flex-col gap-2'>
          <CardTitle>
            {comment.user.name} {loggedInUser.id === comment.user.id && "(You)"}
          </CardTitle>
          <CardDescription>
            Added - {comment.createdAt.toLocaleString()}
          </CardDescription>
        </div>
      </CardHeader>

      <CommentContentContainer
        comment={comment}
        replies={replies}
        loggedInUser={loggedInUser}
      />
    </Card>
  );
}

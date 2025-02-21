import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import Comment from "./Comment";

export default async function CommentsContainer() {
  const comments = await prisma.comment.findMany({
    where: {
      parent: null,
    },
    include: {
      user: true,
    },
  });
  const user = await currentUser();
  const loggedInUser = await prisma.user.findUnique({
    where: {
      email: user?.emailAddresses[0].emailAddress as string,
    },
  });
  if (!loggedInUser) {
    return (
      <div className='flex flex-col gap-4'>
        <p className='text-muted-foreground text-lg'>
          Please sign in to view comments
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      {!comments || comments.length === 0 ? (
        <p className='text-muted-foreground text-lg'>
          No one has added any thoughts yet. Be the first to add a thought.
        </p>
      ) : (
        comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            loggedInUser={loggedInUser}
          />
        ))
      )}
    </div>
  );
}

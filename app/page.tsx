import CommentsContainer from "@/components/CommentsContainer";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Home() {
  const user = await currentUser();
  if (!user) {
    return (
      <main className='w-3/4 mx-auto space-y-4 py-10'>
        <h1 className='text-4xl font-bold'>Comments</h1>
        <p className='text-muted-foreground text-lg'>
          Please sign in to view comments and also for creating comments.
        </p>
      </main>
    );
  }

  const userExists = await prisma.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
  });

  if (!userExists) {
    await prisma.user.create({
      data: {
        email: user.emailAddresses[0].emailAddress,
        name: user.firstName?.concat(" ", user.lastName as string) as string,
      },
    });
  }

  return (
    <main className='w-3/4 mx-auto min-h-screen space-y-4 py-10'>
      <div className='flex justify-between items-center'>
        <h1 className='text-4xl font-bold'>Feed</h1>
        <Link href='/comments/new' className={cn(buttonVariants())}>
          Add your thought
        </Link>
      </div>
      <CommentsContainer />
    </main>
  );
}

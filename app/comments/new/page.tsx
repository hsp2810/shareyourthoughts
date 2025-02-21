import CommentNewForm from "@/components/CommentNewForm";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function CommentsCreatePage() {
  return (
    <main className='w-3/4 mx-auto space-y-5 min-h-screen py-10'>
      <Link href='/' className={cn(buttonVariants({ variant: "outline" }))}>
        Back
      </Link>
      <h1 className='text-3xl md:text-4xl font-bold'>Write your thoughts</h1>

      <CommentNewForm />
    </main>
  );
}

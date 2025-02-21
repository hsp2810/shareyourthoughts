"use client";

import { createComment } from "@/actions/comment";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function CommentNewForm() {
  const [comment, setComment] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  function handleSubmit() {
    if (comment.length === 0) {
      toast({
        title: "Comment cannot be empty",
        variant: "error",
      });

      return;
    }

    startTransition(() => {
      createComment(comment).then((data) => {
        if (data.success) {
          toast({
            title: data.success,
            variant: "success",
          });

          setComment("");
          router.push("/");
          return;
        }

        toast({
          title: data.error,
          variant: "error",
        });
      });
    });
  }

  return (
    <section className='flex flex-col gap-5'>
      <Input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder='Write here...'
      />
      <Button className='w-fit' onClick={handleSubmit}>
        {isPending ? <Loader2 className='w-4 h-4 animate-spin' /> : "Submit"}
      </Button>
    </section>
  );
}

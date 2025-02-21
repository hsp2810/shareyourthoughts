import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

export default function Footer() {
  return (
    <footer className='flex justify-center items-center p-4 gap-5 h-16'>
      <a
        href='https://www.harshitpatel.dev/'
        target='_blank'
        className={cn(buttonVariants())}
      >
        Made by Harshit Patel with ❤️
      </a>
    </footer>
  );
}

"use server";

import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createComment(comment: string) {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: "You must be logged in to create a comment" };
    }

    const userExists = await prisma.user.findUnique({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
    });
    if (!userExists) {
      return { error: "User not found" };
    }

    await prisma.comment.create({
      data: {
        content: comment,
        user: {
          connect: {
            email: userExists.email,
          },
        },
      },
    });

    revalidatePath("/");

    return { success: "Comment created successfully" };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create comment" };
  }
}

export async function createReply(commentId: string, reply: string) {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: "You must be logged in to create a reply" };
    }

    const userExists = await prisma.user.findUnique({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
    });
    if (!userExists) {
      return { error: "User not found" };
    }

    const commentExists = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (!commentExists) {
      return { error: "Comment not found" };
    }

    if (!reply || reply.trim() === "") {
      return { error: "Reply content cannot be empty" };
    }

    await prisma.comment.create({
      data: {
        content: reply,
        userId: userExists.id,
        parentId: commentId,
      },
    });

    revalidatePath("/");

    return { success: "Replied successfully" };
  } catch (error) {
    console.error("Error creating reply:", error);
    return { error: "Something went wrong" };
  }
}

export async function deleteReply(replyId: string) {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: "You must be logged in to delete a reply" };
    }

    const replyExists = await prisma.comment.findUnique({
      where: {
        id: replyId,
      },
    });
    if (!replyExists) {
      return { error: "Reply not found" };
    }

    await prisma.comment.delete({
      where: { id: replyId },
    });

    revalidatePath("/");

    return { success: "Reply deleted successfully" };
  } catch (error) {
    console.error("Error deleting reply:", error);
    return { error: "Failed to delete reply" };
  }
}

export async function deleteComment(commentId: string) {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: "You must be logged in to delete a comment" };
    }

    const commentExists = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!commentExists) {
      return { error: "Comment not found" };
    }

    // Step 1: Delete all child comments first
    await prisma.comment.deleteMany({
      where: { parentId: commentId },
    });

    // Step 2: Delete the parent comment
    await prisma.comment.delete({
      where: { id: commentId },
    });

    revalidatePath("/");

    return { success: "Comment deleted successfully" };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return { error: "Failed to delete comment" };
  }
}

export async function editReply(replyId: string, reply: string) {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: "You must be logged in to edit a reply" };
    }

    const replyExists = await prisma.comment.findUnique({
      where: {
        id: replyId,
      },
    });
    if (!replyExists) {
      return { error: "Reply not found" };
    }

    await prisma.comment.update({
      where: { id: replyId },
      data: { content: reply },
    });

    revalidatePath("/");

    return { success: "Reply updated successfully" };
  } catch (error) {
    console.error("Error editing reply:", error);
    return { error: "Failed to edit reply" };
  }
}

export async function editComment(commentId: string, comment: string) {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: "You must be logged in to edit a comment" };
    }

    const commentExists = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (!commentExists) {
      return { error: "Comment not found" };
    }

    if (!comment || comment.trim() === "") {
      return { error: "Comment content cannot be empty" };
    }

    await prisma.comment.update({
      where: { id: commentId },
      data: { content: comment },
    });

    revalidatePath("/");

    return { success: "Comment updated successfully" };
  } catch (error) {
    console.error("Error editing comment:", error);
    return { error: "Failed to edit comment" };
  }
}

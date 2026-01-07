"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/navigation";

const COMMENTS_PATH = path.join(process.cwd(), "data", "comments.json");

export async function getComments(videoSlug) {
    try {
        const data = await fs.readFile(COMMENTS_PATH, "utf-8");
        const allComments = JSON.parse(data);
        return allComments[videoSlug] || [];
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        console.error("[CommentService] Error reading comments:", error);
        return [];
    }
}

export async function addComment(videoSlug, formData) {
    const name = formData.get("name");
    const email = formData.get("email");
    const text = formData.get("comment");

    if (!name || !email || !text) {
        return { error: "All fields are required" };
    }

    const newComment = {
        id: Date.now().toString(),
        name,
        email,
        text,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };

    try {
        let allComments = {};
        try {
            const data = await fs.readFile(COMMENTS_PATH, "utf-8");
            allComments = JSON.parse(data);
        } catch (e) {
            // file doesn't exist yet
        }

        if (!allComments[videoSlug]) {
            allComments[videoSlug] = [];
        }

        allComments[videoSlug].unshift(newComment);

        const dir = path.dirname(COMMENTS_PATH);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(COMMENTS_PATH, JSON.stringify(allComments, null, 2));

        revalidatePath(`/videos/${videoSlug}`);
        return { success: true };
    } catch (error) {
        console.error("[CommentService] Error saving comment:", error);
        return { error: "Failed to save comment" };
    }
}

import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMarkdown } from "@content-collections/markdown";
import { z } from "zod";

const blogPosts = defineCollection({
  name: "blogPosts",
  directory: "content/blog",
  include: "**/*.md",
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    image: z.object({
      path: z.string().regex(/^\/media\/[a-z0-9-]+\.(?:jpg|png|webp)$/),
      alt: z.string().min(1),
    }).optional(),
    gallery: z.array(z.union([
      z.string().regex(/^\/media\/[a-z0-9-]+\.(?:jpg|png|webp)$/),
      z.object({
        path: z.string().regex(/^\/media\/[a-z0-9-]+\.(?:jpg|png|webp)$/),
        captionMode: z.enum(["database", "custom", "none"]).default("database"),
        caption: z.string().min(1).optional(),
      }).superRefine((slide, context) => {
        if (slide.captionMode === "custom" && !slide.caption?.trim()) context.addIssue({ code: "custom", message: "A custom gallery caption is required when captionMode is custom." });
      }),
    ])).min(2).optional(),
    actionLabel: z.string().min(1).optional(),
    actionHref: z.string().min(1).optional(),
    content: z.string(),
  }),
  transform: async (post, context) => ({
    ...post,
    slug: post._meta.path,
    html: await compileMarkdown(context, post),
  }),
});

export default defineConfig({
  content: [blogPosts],
});

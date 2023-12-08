"use client";

import { newBlogSubmit } from "@/lib/imgProcessor";
import MkEditor from "@/components/blog/MkEditor";
import { Button, Divider, Input, Spacer, Textarea } from "@nextui-org/react";
import { Spinner } from "@nextui-org/spinner";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const NewBlog = () => {
  const [text, setText] = useState("");
  const [html, setHtml] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // if (!isLogined) {
  //   return (
  //     <div>
  //       <Spinner
  //         label="Loading..."
  //         color="primary"
  //         className="flex flex-1 items-center"
  //       />
  //     </div>
  //   );
  // }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!e.target) return;
    setIsLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);

    const title = formData.get("title")?.toString();
    const brief = formData.get("brief")?.toString();
    const luckyDigit = Number(formData.get("luckydigit")) || 0;
    const content = formData.get("content")?.toString();
    const renderedContent = formData.get("renderedcontent")?.toString();

    if (!title) {
      alert("Please enter title!");
      setIsLoading(false);

      return;
    }
    if (!brief) {
      alert("Please enter brief!");
      setIsLoading(false);

      return;
    }
    if (!luckyDigit) {
      alert("Please enter lucky digit!");
      setIsLoading(false);

      return;
    }
    if (!content) {
      alert("Please enter content!");
      setIsLoading(false);

      return;
    }
    if (!renderedContent) {
      setIsLoading(false);

      return;
    }

    try {
      const blogId = await newBlogSubmit(
        title,
        brief,
        luckyDigit,
        content,
        renderedContent,
      );
      if (blogId === "Error") {
        alert("Server Error");
        return;
      }
      router.push("/blog/" + blogId);
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">New Blog</h1>

      <Divider className="my-4" />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="renderedcontent"
          value={html}
          className="hidden"
        />
        <Textarea type="text" name="content" value={text} className="hidden" />
        <Input
          type="text"
          name="title"
          label="Title"
          size="md"
          radius="md"
          placeholder="Title will be showed in the blog list"
          isRequired
          className="relative mb-4 w-full md:w-1/2"
        />
        <Textarea
          name="brief"
          label="Brief Description"
          size="md"
          radius="md"
          placeholder="Brief description will be showed in the blog list"
          isRequired
          className="relative mb-4 w-full md:w-1/2"
        />
        <Input
          type="number"
          name="luckydigit"
          label="Lucky Digit"
          size="md"
          radius="md"
          isRequired
          placeholder="0"
          description={
            <div>
              <p>
                1. Lucky Digit will be pushed into the system collection when
                the blog becomes popular.
              </p>
              <p>2. Lucky Digit can not be modified after submitted.</p>
            </div>
          }
          className="relative mb-4 w-full md:w-1/2"
          style={{ whiteSpace: "pre-line" }}
        />
        <MkEditor text={text} setText={setText} html={html} setHtml={setHtml} />
        <div className="my-4 flex w-full  flex-row justify-center">
          <Button type="button" color="primary" onClick={() => router.back()}>
            Back
          </Button>
          <Spacer x={6} />
          <Button type="submit" color="primary" isLoading={isLoading}>
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewBlog;

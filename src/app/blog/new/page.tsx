import MkEditor from "@/components/blog/MkEditor";
import { authOptions } from "@/lib/auth-options";
import { Button } from "@nextui-org/react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const NewBlog = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  }
  return (
    <div>
      <h1>New Blog</h1>
      <MkEditor />
    </div>
  );
};

export default NewBlog;

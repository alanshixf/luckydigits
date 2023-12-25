import { newBlogSubmit } from "@/lib/blog/blogProcessor";
import { Typography, Divider, Box } from "@mui/material";
import EditBlogForm from "@/components/blog/editBlogForm";
import { redirect } from "next/navigation";

const NewBlog = () => {
  async function handleSubmit(formData: FormData) {
    "use server";
    let blogId = "";
    try {
      blogId = await newBlogSubmit(formData);
      if (blogId.startsWith("Error")) {
        return blogId;
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
    redirect("/management/blog/" + blogId);
  }

  return (
    <Box sx={{ m: 4 }}>
      <Typography variant="h4" mb={2}>
        New Blog
      </Typography>

      <Divider sx={{ mb: 2 }} />
      <EditBlogForm blog={null} handleSubmit={handleSubmit} />

      {/* <form onSubmit={handleSubmit}>
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
      </form> */}
    </Box>
  );
};

export default NewBlog;

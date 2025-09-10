import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // uploader for docs + images
  fileUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 }, // jpg, png, webp
    "application/pdf": { maxFileSize: "8MB" },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: "8MB" }, // docx
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": { maxFileSize: "16MB" }, // pptx
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { maxFileSize: "8MB" }, // xlsx
  })
    .onUploadComplete(async ({ file }) => {
      console.log("✅ Uploaded file:", file.ufsUrl); // use ufsUrl instead of file.url
      return { uploadedUrl: file.ufsUrl }; // will be returned client-side
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

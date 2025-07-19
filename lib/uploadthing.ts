import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } }).onUploadComplete(async ({ metadata, file }) => {
    // This code RUNS ON YOUR SERVER after upload
    console.log("Upload complete!")
    console.log("file url", file.url)
    console.log("file name", file.name)
    console.log("file size", file.size)

    // Return any data you want to the client
    return {
      url: file.url,
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    }
  }),

  blogImageUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } }).onUploadComplete(
    async ({ metadata, file }) => {
      console.log("Blog image upload complete!")
      console.log("file url", file.url)

      return {
        url: file.url,
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      }
    }
  ),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

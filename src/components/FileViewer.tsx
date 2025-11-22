'use client'
import { Document, Page, pdfjs } from "react-pdf"
import Image from "next/image";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type FileViewerProps = {
    fileUrl: string
    fileType: string
}

const FileViewer = ({ fileUrl, fileType }: FileViewerProps) => {
    switch (fileType) {
        case "image":
            return <Image src={fileUrl} alt="preview" className="max-w-full max-h-[600px] mx-auto" />

        case "video":
            return <video src={fileUrl} controls className="w-full max-h-[500px]" />

        case "pdf":
            return (
                <iframe src={fileUrl} className="w-full h-[80vh] border rounded" />
            );

        case "docx":
        case "pptx":
            return (
                <iframe
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`}
            style={{ width: "100%", height: "80vh", border: "none" }}
                />
            )
    }

    return (
        <iframe
            src={fileUrl}
            className="w-full h-[600px] border rounded"
        />
    )
}

export default FileViewer
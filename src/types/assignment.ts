export type UploadThingFile = {
    fileUrl: string
    key?: string
    fileName? : string
    size?: number
    mimeType?: string
    [k: string]: unknown
}

export interface Assignment {
    id: string
    programId: string
    title: string
    description?: string | null
    attactments?: UploadThingFile[] | null
    dueDate?: string | null
    createdAt: string
    updatedAt: string
    createdAtBy: { id: string, name: string | null, image?: string | null }
    submissions?: { id: string }
}

export interface Submission {
    id: string
    assignmentId: string
    submitterId: string
    files: UploadThingFile[]
    comment?: string | null
    grade?: number | null
    createdAt: string
}
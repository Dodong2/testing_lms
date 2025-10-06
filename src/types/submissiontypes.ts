import { FileMeta } from "./postManagetypes"

export interface SubmitWorkPayload {
    files?: FileMeta[]   // from UploadThing
    links?: string  
}

export interface gradeSubmissionTypes {
    programId: string,
    postId: string,
    submissionId: string,
    grade: number,
    feedback?: string
}
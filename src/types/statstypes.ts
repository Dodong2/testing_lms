export interface UserRegisterStats {
    month: string
    total: number
    admin: number
    instructor: number
    beneficiary: number
}

export interface PostsPerMonth {
  month: string;
  totalPosts: number;
  announcementCount: number;
  taskCount: number;
//   normalCount: number;
}

// for charts - files stats (actual file count)
export interface FilesStatsResponse {
  instructorFiles: number
  beneficiaryFiles: number
  total: number
  mostFilesRole: string
}

// for active programs
export interface ActiveProgram {
    id: string
    name: string
    posts: number
    comments: number
    totalActivity: number
}
// for active programs
export interface ActiveProgramsResponse {
    programs: ActiveProgram[]
    page: number
    limit: number
    total: number
    hasMore: boolean
}
// for latest programs
export interface LatestProgramData {
    id: string
    name: string
    createdAt: Date | string
}
// for latest programs
export interface LatestProgramResponse {
    program: LatestProgramData | null
}
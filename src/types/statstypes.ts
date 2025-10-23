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
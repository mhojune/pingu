// 공통 페이지 요청/응답
export type PageRequestDTO = {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: "ASC" | "DESC";
};

export type PageResultDTO<T> = {
  dtoList: T[];
  totalPage: number;
  page: number;
  size: number;
  start: number;
  end: number;
  prev: boolean;
  next: boolean;
  pageList: number[];
};

// User
export type UserDTO = {
  userId?: number; // 회원가입 시에는 선택적, 조회 시에는 필수
  username: string;
  password: string;
  phoneNumber: string;
  regDate: string;
  modDate: string;
};

// File
export type FileResponseDTO = {
  fileId: number;
  name: string;
  url: string;
  contentType: string;
  fileSize: number;
};

// Post
export type PostRequestDTO = {
  postId?: number;
  userId: number;
  title: string;
  content: string;
  likeCount?: number;
  viewCount?: number;
  longitude?: number | null;
  latitude?: number | null;
  scope?: "PUBLIC" | "PRIVATE" | "FRIENDS";
  files?: File[];
};

export type PostResponseDTO = {
  postId: number;
  userId: number;
  title: string;
  content: string;
  regDate: string;
  likeCount: number;
  viewCount: number;
  longitude: number; // 백엔드에서 null -> 0 치환됨
  latitude: number; // 백엔드에서 null -> 0 치환됨
  scope: "PUBLIC" | "PRIVATE" | "FRIENDS"; // default PUBLIC 가정
  files: FileResponseDTO[];
};

// Friendship
export type FriendshipRequestDTO = {
  requesterId: number;
  receiverId: number;
};

export type FriendshipResponseDTO = {
  id: number;
  friend1: UserDTO;
  friend2: UserDTO;
  status: "REQUESTING" | "ACCEPTED" | "DELETED";
};

// Folder
export type PostFolderDTO = {
  id: number;
  name: string;
  userId: number;
  postIds: number[];
};

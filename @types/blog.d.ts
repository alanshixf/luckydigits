type BlogListItem = {
  id: string;
  postBy: string;
  title: string;
  brief: string;
  content?: string;
  showedCount: number;
  tags: string[];
  published: boolean;
  publishedDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  Images?: { id: string; url: string; alt: string | null }[];
  Likes: { id: string }[];
  _count: { Likes: number; Comments: number };
};

type Author = {
  id: string;
  name: string | null;
  image: string | null;
  title: string | null;
  aboutMe?: string | null;
  isFollowed?: boolean;
  _count?: {
    blogs?: number;
    Comments?: number;
    followers?: number;
    followings?: number;
  };
};
type BlogListItemWithUser = BlogListItem & {
  user: Author;
};

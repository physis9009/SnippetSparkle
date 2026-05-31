export type Snippet = {
  id: string;
  title?: string;
  language: string;
  summary?: string;
  code: string;
  tags?: string[];
  created_at: string; // ISO 日期字符串
  created_by: string;
};

export type Tag = {
  name: string;  // 小写版本，作为主键
  displayName: string;  // 原始大小写，用于显示
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

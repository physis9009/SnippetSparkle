export type Snippet = {
  title?: string;
  language: string;
  summary?: string;
  code: string;
  tags?: string[];
  created_at: string; // ISO 日期字符串
};

export const supportedLanguage: string[] = [];

function toTagKey(displayName: string): string {
  return displayName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // 将非字母数字替换为连字符
    .replace(/^-|-$/g, '');        // 去除首尾连字符
}

export type Tag = {
  name: string;  // 小写版本，作为主键
  displayName: string;  // 原始大小写，用于显示
};
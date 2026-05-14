export type Snippet = {
  id: string;
  title: string;
  language: string;
  author: string;
  source: string;
  summary: string;
  code: string;
  analysis: string;
  tags: string[];
  created_at: string; // ISO 日期字符串
};

export type Tag = {
  id: string;
  name: string;
};

export type SnippetTag = {
  snippetId: string;
  tagId: string;
};

// 视图/组合类型
// 详情页用：snippet 带上完整标签对象数组
export type SnippetWithTags = Snippet & {
  tags: Tag[];
};

// 列表/卡片展示用（标签已转化为逗号分隔的字符串，便于渲染）
export type SnippetCard = {
  id: string;
  title: string;
  language: string;
  author: string;
  summary: string;
  tags: string; // 由后端拼接好的标签名字符串，例如 "位运算技巧, 性能优化"
  created_at: string;
};

// 表单用（创建/编辑时，标签通常单独处理）
export type SnippetForm = {
  title: string;
  language: string;
  author: string;
  source: string;
  summary: string;
  code: string;
  analysis: string;
  tagIds: string[]; // 前端选择的标签 id 列表
};
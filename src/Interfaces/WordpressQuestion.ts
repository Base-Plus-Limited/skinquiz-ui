export interface IIngredient extends IWordpressQuestion {
  rank: number;
}

export interface IWordpressQuestion {
  id: number;
  date: string;
  date_gmt: string;
  guid: Guid;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: Guid;
  content: Content;
  excerpt: Content;
  template: string;
  meta: any[];
  _links: Links;
}

interface Links {
  self: Self[];
  collection: Self[];
  about: Self[];
  'wp:attachment': Self[];
  curies: Cury[];
}

interface Cury {
  name: string;
  href: string;
  templated: boolean;
}

interface Self {
  href: string;
}

interface Content {
  rendered: string;
  protected: boolean;
}

interface Guid {
  rendered: string;
}
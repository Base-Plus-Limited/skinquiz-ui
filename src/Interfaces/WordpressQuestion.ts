export enum QuestionIds {
  areYouAged = 683,
  whatIsYourGender = 682,
  whatIsYourEthnicity = 708,
  naturalSkinTone = 716,
  whenYouWakeUpInTheMorning = 1443,
  skinConcernsAndConditions = 706,
  sensitiveSkin = 715,
  adverseReactions = 712,
  exisitingConditions = 1659,
  fragranceFree = 3870
}

export enum SkinConditonAnswers {
  Oily = "oily",
  FeelsDry = "feels dry",
  ScarringAndBlemishes = "scarring and blemishes",
  DullOrBrightening = "dull or in need of brightening",
  UnevenAndPigmentation = "uneven skin tone and pigmentation",
  LooksDry = "looks dry"
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
  tags: Tag[];
  template: string;
  prompt: string;
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

interface Tag {
  id: number;
  name: string;
  slug: string;
}
export interface AddData {
  english: string;
  thai: string;
}

export interface FoundText {
  word: string;
  count: number;
}

export interface PatentTranslator {
  uniqueKeys: string[];
  englishTexts: string[];
  uniqueKeysSortByUseCount: string[];
  keysToShow: string[];
  foundTexts: FoundText[];
}

import { getArticles } from './articles';

export const getUniqueTags = (state) =>
  getArticles(state).
    flatMap((a) => a.get('tags')).filter((i) => i !== null).
    toSet().
    toList();

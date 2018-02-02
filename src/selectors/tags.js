import { getArticles } from './articles';

export const getUniqueTags = (state) =>
  getArticles(state).
    toList().
    flatMap((a) => a.get('tags')).
    toSet().
    toList().
    filter((i) => i !== null);

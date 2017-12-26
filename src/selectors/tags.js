import { getArticles } from './articles';

export const getUniqueTags = (state) =>
  getArticles(state).
    flatMap((a) => a.get('tags')).
    toSet().
    toList().
    filter((i) => i !== null);

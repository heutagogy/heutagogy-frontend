import { getArticles } from './articles';

export const getTags = (state) =>
  getArticles(state).flatMap((a) => a.get('tags')).filter((i) => i !== null);

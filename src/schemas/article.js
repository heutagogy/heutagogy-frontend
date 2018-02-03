import { schema } from 'normalizr';

const note = new schema.Entity('notes');

const article = new schema.Entity('articles');
const articles = new schema.Array(article);

article.define({ children: articles, notes: [note] });

export default article;

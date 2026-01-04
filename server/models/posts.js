import { v4 as uuid } from 'uuid';
import db from '../db/knex.js';

const TABLE = 'posts';

const baseQuery = () =>
  db(TABLE)
    .select('id', 'title', 'category', 'publish_date as date', 'excerpt', 'content', 'image', 'author', 'views', 'author_id', 'created_at', 'updated_at')
    .orderBy([{ column: 'publish_date', order: 'desc' }, { column: 'created_at', order: 'desc' }]);

export const findAll = () => baseQuery();

export const findById = (id) => baseQuery().where({ id }).first();

export const create = async ({ title, category, date, excerpt, content, image, author, authorId }) => {
  const record = {
    id: uuid(),
    title,
    category: category || 'General',
    publish_date: date ?? null,
    excerpt,
    content: content || null,
    image: image || null,
    author: author || 'Equipo Imparables',
    views: 0,
    author_id: authorId ?? null,
  };
  await db(TABLE).insert(record);
  return findById(record.id);
};

export const updateById = async (id, payload) => {
  const updates = {
    ...('title' in payload && { title: payload.title }),
    ...('category' in payload && { category: payload.category }),
    ...('date' in payload && { publish_date: payload.date ?? null }),
    ...('excerpt' in payload && { excerpt: payload.excerpt }),
    ...('content' in payload && { content: payload.content ?? null }),
    ...('image' in payload && { image: payload.image ?? null }),
    ...('author' in payload && { author: payload.author ?? 'Equipo Imparables' }),
    updated_at: db.fn.now(),
  };

  await db(TABLE).where({ id }).update(updates);
  return findById(id);
};

export const deleteById = async (id) => {
  const post = await findById(id);
  if (!post) return null;
  await db(TABLE).where({ id }).del();
  return post;
};

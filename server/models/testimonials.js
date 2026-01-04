import { v4 as uuid } from 'uuid';
import db from '../db/knex.js';

const TABLE = 'testimonials';

export const findAll = () =>
  db(TABLE)
    .select('id', 'name', 'message', 'approved', 'created_at')
    .orderBy('created_at', 'desc');

export const findApproved = () =>
  db(TABLE)
    .select('id', 'name', 'message', 'created_at')
    .where({ approved: true })
    .orderBy('created_at', 'desc');

export const findById = (id) =>
  db(TABLE)
    .select('id', 'name', 'message', 'approved', 'created_at')
    .where({ id })
    .first();

export const create = async ({ name, message }) => {
  const record = {
    id: uuid(),
    name,
    message,
    approved: false,
  };
  await db(TABLE).insert(record);
  return findById(record.id);
};

export const approve = async (id) => {
  await db(TABLE).where({ id }).update({ approved: true });
  return findById(id);
};

export const deleteById = async (id) => {
  const testimonial = await findById(id);
  if (!testimonial) return null;
  await db(TABLE).where({ id }).del();
  return testimonial;
};

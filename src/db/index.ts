import Dexie, { Table } from 'dexie';
import { v4 as uuidv4 } from 'uuid';
import type { Entry, EntryInput } from '../types';

class TeaDiaryDB extends Dexie {
  entries!: Table<Entry, string>;

  constructor() {
    super('TeaDiary');
    this.version(1).stores({
      entries: 'id, drunkAt, price, isFavorite, iceLevel, sugarLevel, rating, createdAt',
    });
  }
}

export const db = new TeaDiaryDB();

export async function loadAllEntries(): Promise<Entry[]> {
  try {
    return await db.entries.orderBy('drunkAt').reverse().toArray();
  } catch {
    return [];
  }
}

export async function addEntry(input: EntryInput): Promise<Entry> {
  const entry: Entry = {
    ...input,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  await db.entries.put(entry);
  return entry;
}

export async function updateEntry(id: string, input: Partial<EntryInput>): Promise<Entry | null> {
  const existing = await db.entries.get(id);
  if (!existing) return null;
  const updated: Entry = { ...existing, ...input, id: existing.id, createdAt: existing.createdAt };
  await db.entries.put(updated);
  return updated;
}

export async function deleteEntry(id: string): Promise<void> {
  await db.entries.delete(id);
}

export async function toggleFavorite(id: string): Promise<Entry | null> {
  const existing = await db.entries.get(id);
  if (!existing) return null;
  const updated: Entry = { ...existing, isFavorite: !existing.isFavorite };
  await db.entries.put(updated);
  return updated;
}

export async function importEntries(entries: Entry[]): Promise<{ added: number; skipped: number }> {
  let added = 0;
  let skipped = 0;
  for (const entry of entries) {
    const exists = await db.entries.get(entry.id);
    if (exists) {
      skipped++;
    } else {
      await db.entries.put(entry);
      added++;
    }
  }
  return { added, skipped };
}

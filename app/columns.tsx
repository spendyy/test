'use client';

import { ColumnDef } from '@tanstack/react-table';

export type Payment = {
  id: string;
  created_at: string;
  title: string;
  creator: string;
  slug: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'created_at',
    header: 'Дата',
  },
  {
    accessorKey: 'title',
    header: 'Заголовок',
  },
  {
    accessorKey: 'creator',
    header: 'Создатель',
  },
  {
    accessorKey: 'slug',
    header: 'Слизень',
  },
];

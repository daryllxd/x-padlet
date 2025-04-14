'use client';

import { Dialog } from '@/components/ui/dialog';
import { useTodoLists } from '@/hooks/useTodoLists';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CommandPalette, { filterItems, getItemIndex } from 'react-cmdk';
import 'react-cmdk/dist/cmdk.css';

export function CmdkPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const { data: todoLists } = useTodoLists({ status: 'active' });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const filteredItems = filterItems(
    [
      {
        id: 'actions',
        heading: 'Puglets',
        items:
          todoLists?.map((todoList) => ({
            id: todoList.id,
            children: todoList.title,
            onClick: () => {
              router.push(`/${todoList.id}`);
              setOpen(false);
            },
          })) || [],
      },
    ],
    search
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <CommandPalette
        onChangeSearch={setSearch}
        onChangeOpen={setOpen}
        search={search}
        isOpen={open}
        page="root"
      >
        <CommandPalette.Page id="root">
          {filteredItems.length ? (
            filteredItems.map((list) => (
              <CommandPalette.List key={list.id} heading={list.heading}>
                {list.items.map(({ id, ...rest }) => (
                  <CommandPalette.ListItem
                    key={id}
                    index={getItemIndex(filteredItems, id)}
                    {...rest}
                  />
                ))}
              </CommandPalette.List>
            ))
          ) : (
            <CommandPalette.FreeSearchAction />
          )}
        </CommandPalette.Page>
      </CommandPalette>
    </Dialog>
  );
}

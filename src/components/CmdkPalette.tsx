'use client';

import { Dialog } from '@/components/ui/dialog';
import { useTodoLists } from '@/hooks/useTodoLists';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
// import CommandPalette, { filterItems, getItemIndex } from 'react-cmdk';
// import 'react-cmdk/dist/cmdk.css';
import { DevToolsContext } from './Providers';

export function CmdkPalette() {
  const { isReactQueryDevtoolsOpen, setIsReactQueryDevtoolsOpen } = useContext(DevToolsContext);
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

  // const filteredItems = useMemo(() => {
  //   const result = filterItems(
  //     [
  //       {
  //         id: 'open-pages',
  //         heading: 'Pages',
  //         items: navigationItems.map((item) => ({
  //           id: item.href,
  //           children: item.name,
  //           icon: navigationIcons[item.icon],
  //           onClick: () => router.push(item.href),
  //         })),
  //       },
  //       {
  //         heading: 'Puglets',
  //         id: 'puglets',
  //         items:
  //           todoLists?.map((list) => ({
  //             id: list.id,
  //             children: list.title,
  //             icon: DogIcon,
  //             onClick: () => router.push(`/${list.id}`),
  //           })) ?? [],
  //       },

  //       process.env.NODE_ENV === 'development'
  //         ? {
  //             id: 'dev-tool-actions',
  //             heading: 'Dev tools',
  //             items: [
  //               {
  //                 id: 'toggle-react-query-dev-tools',
  //                 children: 'Toggle react-query dev tools',
  //                 icon: WrenchIcon,
  //                 onClick: () => setIsReactQueryDevtoolsOpen(!isReactQueryDevtoolsOpen),
  //               },
  //             ],
  //           }
  //         : null,
  //     ].filter((item): item is NonNullable<typeof item> => item !== null),
  //     search
  //   );
  //   return result;
  // }, [todoLists, isReactQueryDevtoolsOpen, search]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <CommandPalette
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
      </CommandPalette> */}
    </Dialog>
  );
}

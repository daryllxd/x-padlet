import { withRevalidation } from '@/lib/api/withRevalidation';
import { supabase } from '@/lib/db';
import { TODO_TEMPLATES } from '@/lib/templates/todo-templates';
import { THEME_COLORS } from '@/types/todo-list';
import { isValidTemplateId } from '@/types/todo-list-template';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    let query = supabase.from('todo_lists').select('*').order('position');

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    const transformedData = data.map((list) => ({
      ...list,
    }));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching todo lists:', error);
    return NextResponse.json({ error: 'Failed to fetch todo lists' }, { status: 500 });
  }
}

const getRandomTheme = () => {
  const themes = THEME_COLORS.filter((color) => color !== 'white');
  return themes[Math.floor(Math.random() * themes.length)];
};

const createFromTemplate = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const templateId = formData.get('templateId') as string;
    const customTitle = formData.get('title') as string | null;
    const customDescription = formData.get('description') as string | null;

    if (!templateId || !isValidTemplateId(templateId)) {
      return NextResponse.json({ error: 'Invalid template ID' }, { status: 400 });
    }

    const template = TODO_TEMPLATES[templateId];
    const theme = getRandomTheme();

    const { data, error } = await supabase
      .from('todo_lists')
      .select('position')
      .order('position', { ascending: false })
      .limit(1)
      .single();
    if (error) throw error;

    const maxPosition = data?.position ?? 0;

    return await supabase.auth.getSession().then(async ({ data: { session } }) => {
      return await supabase
        .from('todo_lists')
        .insert([
          {
            title: customTitle || template.todoList.title,
            description: customDescription || template.todoList.description,
            display_mode: template.todoList.display_mode,
            theme,
            position: maxPosition + 1,
            status: 'active',
          },
        ])
        .select()
        .single()
        .then(async ({ data: todoList, error: todoListError }) => {
          if (todoListError || !todoList) throw todoListError;

          const groups = await Promise.all(
            template.todoGroups.map(async (group, index) => {
              const { data: todoGroup, error: groupError } = await supabase
                .from('todo_groups')
                .insert([
                  {
                    name: group.name,
                    todo_list_id: todoList.id,
                    position: index,
                  },
                ])
                .select()
                .single();

              if (groupError || !todoGroup) throw groupError;
              return { group: todoGroup, templateGroup: group };
            })
          );

          // Create all items for each group
          await Promise.all(
            groups.map(async ({ group, templateGroup }) => {
              let templateItems =
                template.todoItems.find((ti) => ti.groupName === templateGroup.name)?.items || [];

              if (template.metadata.itemSelectionStrategy?.type === 'random') {
                templateItems = [...templateItems]
                  .sort(() => Math.random() - 0.5)
                  .slice(0, template.metadata.itemSelectionStrategy.count);
              }

              const { error: itemsError } = await supabase.from('todos').insert(
                templateItems.map((item, index) => ({
                  title: item.title,
                  description: item.description,
                  is_completed: item.is_completed,
                  todo_list_id: todoList.id,
                  todo_group_id: group.id,
                  theme: theme,
                  position: index + 1,
                  position_in_group: index + 1,
                }))
              );

              if (itemsError) throw itemsError;
            })
          );

          return NextResponse.json(todoList);
        });
    });
  } catch (error) {
    console.error('💥 Template creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create todo list from template' },
      { status: 500 }
    );
  }
};

export const POST = withRevalidation('todo-lists')(createFromTemplate);

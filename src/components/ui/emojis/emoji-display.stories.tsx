import { EMOJI_MAP } from '@/lib/utils/emoji';
import type { Meta, StoryObj } from '@storybook/react';
import { EmojiDisplay } from './emoji-display';

const meta: Meta<typeof EmojiDisplay> = {
  title: 'UI/Emojis/EmojiDisplay',
  component: EmojiDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    code: {
      control: 'select',
      options: Object.values(EMOJI_MAP),
    },
    size: {
      control: { type: 'range', min: 16, max: 128, step: 8 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof EmojiDisplay>;

export const Default: Story = {
  args: {
    code: '1f604',
    size: 32,
  },
};

export const Large: Story = {
  args: {
    code: '1f604',
    size: 64,
  },
};

export const Small: Story = {
  args: {
    code: '1f604',
    size: 16,
  },
};

export const AllEmojis: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Object.entries(EMOJI_MAP).map(([name, code]) => (
        <div key={name} className="flex flex-col items-center gap-2 rounded-lg border p-4">
          <div className="text-sm font-medium capitalize">{name.replace(/-/g, ' ')}</div>
          <EmojiDisplay code={code} size={48} />
          <div className="flex flex-col items-center gap-1 text-xs text-gray-500">
            <div>Key (set this in the database): {name}</div>
            <div>Code: {code}</div>
          </div>
        </div>
      ))}
    </div>
  ),
};

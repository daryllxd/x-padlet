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

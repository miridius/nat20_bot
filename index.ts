import { DiceRoll } from '@dice-roller/rpg-dice-roller';
import { type Context, Telegraf } from 'telegraf';
import type { Message, ParseMode, Update } from 'telegraf/types';

const getOrThrow = (envVar: string): string => {
  const value = Bun.env[envVar];
  if (!value) throw new Error(`${envVar} environment variable is required`);
  return value;
};

const bot = new Telegraf(getOrThrow('BOT_TOKEN'));

const helpMsg = `This bot is just a thin wrapper around the [rpg-dice-roller](https://github.com/dice-roller/rpg-dice-roller) library.

There is only one command: ${'`'}/roll {notation}${'`'}. See [the dice-roller docs](https://dice-roller.github.io/documentation/guide/notation/) for all supported notations.

Examples:
 - /roll d20+5   (rolls a [d20](https://dice-roller.github.io/documentation/guide/notation/dice.html#standard) then adds 5)
 - /roll 2d20k1 + 5   (rolls 2d20, [keeps](https://dice-roller.github.io/documentation/guide/notation/modifiers.html#keep) the highest, then adds 5 to it)
 - /roll 2d6ro<=2+3   (rolls 2d6, [rerolls](https://dice-roller.github.io/documentation/guide/notation/modifiers.html#re-roll) any 1s or 2s (once), then adds 3)
 
 Source is on [GitHub](https://github.com/miridius/nat20_bot/blob/main/index.ts). Issues/PRs welcome.`;

// helper fn because ctx.reply doesn't properly reply, and we never want to unfurl links.
const reply = (
  ctx: Context<Update.MessageUpdate<Message.TextMessage>>,
  text: string,
  parse_mode?: ParseMode,
) =>
  ctx.reply(text, {
    parse_mode,
    link_preview_options: { is_disabled: true },
    reply_parameters: { message_id: ctx.msgId },
  });

bot.start((ctx) =>
  reply(
    ctx,
    `*Welcome!*

${helpMsg}

_Type /help to see these instructions again._`,
    'Markdown',
  ),
);

bot.help((ctx) => reply(ctx, helpMsg, 'Markdown'));

const emoji = ({ total, minTotal, maxTotal }: DiceRoll): string =>
  total === maxTotal ? ' 🎉' : total === minTotal ? ' 💩' : '';

bot.command('roll', (ctx) => {
  const notation = ctx.text.replace(/^[^ ]+\w+/, '').trim();
  if (notation.length === 0) return;
  try {
    const roll = new DiceRoll(notation);
    console.log(ctx.from.first_name, 'rolled', roll.output);
    reply(ctx, roll.output.substring(notation.length + 2) + emoji(roll));
  } catch (error) {
    reply(
      ctx,
      `${error}

${'`' + notation}
${' '.repeat((error as any)?.location?.start?.offset ?? 0) + '`^'}
_See https://dice-roller.github.io/documentation/guide/notation/_`,
      'Markdown',
    );
  }
});
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

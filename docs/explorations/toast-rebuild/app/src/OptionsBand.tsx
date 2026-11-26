import React from 'react';
import { Radio, RadioGroup } from '../../../../../components/composites/Radio';
import {
  ACTION_CHOICES,
  FORM_CHOICES,
  ICON_CHOICES,
  WIDE_CHOICES,
  summaryOf,
  type Look,
} from './options';

interface GroupProps<K extends keyof Look> {
  name: K;
  legend: string;
  choices: { value: Look[K]; label: string }[];
  look: Look;
  onChange: (next: Look) => void;
}

function Group<K extends keyof Look>({ name, legend, choices, look, onChange }: GroupProps<K>) {
  return (
    <RadioGroup legend={legend} inline>
      {choices.map((c) => (
        <Radio
          key={c.value}
          name={name}
          value={c.value}
          label={c.label}
          checked={look[name] === c.value}
          onChange={() => onChange({ ...look, [name]: c.value })}
        />
      ))}
    </RadioGroup>
  );
}

/**
 * ページの上の帯。sticky にしない。畳める (<details>)。畳んだ状態でも、選んでいる組が 1 行で読める
 */
export const OptionsBand: React.FC<{ look: Look; onChange: (next: Look) => void }> = ({ look, onChange }) => (
  <details data-ds-root className="border-b border-border-subtle bg-surface" data-testid="band">
    {/* 畳んだ状態の 1 行: 狭い幅でも折り返さないよう type-caption で、はみ出す分は … にする */}
    <summary className="focus-ring-inset cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap px-3 py-3 type-caption">
      <span className="sr-only">案の切り替え：</span>
      <span data-testid="band-summary">{summaryOf(look)}</span>
    </summary>
    <div className="flex flex-col gap-4 px-4 pb-4">
      <Group name="form" legend="形と色" choices={FORM_CHOICES} look={look} onChange={onChange} />
      <Group name="icon" legend="文が 2 行以上のときのアイコン" choices={ICON_CHOICES} look={look} onChange={onChange} />
      <Group name="action" legend="操作の位置" choices={ACTION_CHOICES} look={look} onChange={onChange} />
      <Group name="wide" legend="広い幅での置き場所（狭い幅はどちらも下の中央）" choices={WIDE_CHOICES} look={look} onChange={onChange} />
    </div>
  </details>
);

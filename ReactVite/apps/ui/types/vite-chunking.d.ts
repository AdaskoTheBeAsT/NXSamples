import type { Rolldown } from 'vite';

export type OutputOptions = Exclude<
  NonNullable<Rolldown.RolldownOptions['output']>,
  readonly unknown[]
>;

export type ManualChunks = NonNullable<OutputOptions['manualChunks']>;

export type ManualChunkMeta = Parameters<ManualChunks>[1];

export type ManualChunkName = ReturnType<ManualChunks>;

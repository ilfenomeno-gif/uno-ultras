import type { MpEnvelope } from '../types/mp';

export function makeEnvelope<T>(seq: number, token: string, type: string, payload: T): MpEnvelope<T> {
  return {
    seq,
    token,
    type,
    payload,
    sentAt: Date.now()
  };
}

export function validateSequence(expected: number, incoming: number): boolean {
  return expected === incoming;
}

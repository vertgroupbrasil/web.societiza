'use client';

import { useMemo } from 'react';
import { getAccessToken } from '@societiza/lib/axios';

type JwtClaims = {
  sub: string;
  email: string;
  role: 'SystemAdmin' | 'AccountancyAdmin' | 'AccountancyEmployee';
  accountancy_id?: string;
  exp: number;
};

type CurrentUser = {
  id: string;
  email: string;
  name: string;       // derivado do e-mail até o backend retornar o nome
  role: JwtClaims['role'];
  accountancyId?: string;
  initials: string;
};

function decodeJwtPayload(token: string): JwtClaims | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as JwtClaims;
  } catch {
    return null;
  }
}

function initialsFromEmail(email: string): string {
  const parts = email.split('@')[0].split(/[._-]/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

/** Lê o access token em memória e extrai as claims sem chamar o backend. */
export function useCurrentUser(): CurrentUser | null {
  return useMemo((): CurrentUser | null => {
    const token = getAccessToken();
    if (!token) return null;

    const claims = decodeJwtPayload(token);
    if (!claims) return null;

    const nameFromEmail = claims.email
      .split('@')[0]
      .split(/[._-]/)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');

    const user: CurrentUser = {
      id: claims.sub,
      email: claims.email,
      name: nameFromEmail,
      role: claims.role,
      initials: initialsFromEmail(claims.email),
    };

    if (claims.accountancy_id) {
      user.accountancyId = claims.accountancy_id;
    }

    return user;
  }, []);
}

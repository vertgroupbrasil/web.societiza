import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PROTECTED_ROUTES } from './routes/routes.conf';

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;

  // Só protege rotas especificadas
  const isProtected = PROTECTED_ROUTES.some((route) =>
    nextUrl.pathname.startsWith(route),
  );
  if (!isProtected) return NextResponse.next();

  // Requisição ao backend Django para verificar se o cookie é válido
  const sessionRes = await fetch('http://localhost:8000/api/session/', {
    headers: {
      Cookie: request.headers.get('cookie') || '',
    },
    credentials: 'include',
  });

  if (sessionRes.status === 200) {
    return NextResponse.next(); // usuário autenticado
  }

  // Redireciona para o login se não autenticado
  return NextResponse.redirect(new URL('/login', request.url));
}

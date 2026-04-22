import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from './routes/routes.conf';

// Cookie não-HttpOnly que o client seta após login (mesmo lifetime do access token: 15 min).
// O middleware lê esse cookie para decidir se há sessão ativa sem precisar chamar o backend.
// A validação real do token acontece no backend a cada requisição autenticada.
const ACCESS_TOKEN_COOKIE = 'societiza_at';

export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/'),
  );

  // Rotas não protegidas passam direto
  if (!isProtected) return NextResponse.next();

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    // Sem token → redireciona para login preservando a URL de destino
    const loginUrl = new URL('/login', request.url);
    if (!isPublic) {
      loginUrl.searchParams.set('next', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Aplica o middleware em todas as rotas exceto:
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagem)
     * - favicon.ico, ícones, manifests
     * - api routes
     */
    // eslint-disable-next-line unicorn/prefer-string-raw
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/).*)',
  ],
};

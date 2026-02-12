# 🎬 Meu Societário - Vídeo Promocional

Vídeo promocional animado mostrando um tour completo pela plataforma Meu Societário.

## 📋 Conteúdo do Vídeo

O vídeo tem aproximadamente **35 segundos** e mostra:

1. **Introdução** (3s) - Logo e apresentação da plataforma
2. **Login** (5s) - Tela de autenticação com animação de digitação
3. **Dashboard** (4s) - Visão geral com cards dos módulos
4. **Kanban Board** (6s) - Sistema de gestão visual de processos com colunas e cards
5. **Detalhes do Card** (6s) - Drawer lateral com progresso, tarefas sequenciais e informações
6. **Formulário** (7s) - Criação de novo processo com múltiplas etapas
7. **Encerramento** (4s) - Features principais e call-to-action

## 🎨 Design System

O vídeo utiliza as **cores e componentes reais** do projeto:
- Estilo baseado no Tailwind CSS com variáveis HSL
- Cores: `bluetec (#007BFF)` e `greentec (#00D084)`
- Componentes inspirados nos reais: Cards, Drawer, Forms, etc.

## 🚀 Como Usar

### Visualizar no navegador

```bash
npm run video:studio
# ou
npx remotion studio src/remotion/index.ts
```

Isso abrirá o Remotion Studio onde você pode:
- Ver o preview do vídeo em tempo real
- Ajustar cada cena individualmente
- Modificar timing e animações
- Testar diferentes resoluções

### Renderizar o vídeo

```bash
# Renderizar em MP4 (alta qualidade)
npm run video:render
# ou
npx remotion render MeuSocietarioPromo out/promo.mp4

# Criar thumbnail
npm run video:thumbnail
# ou
npx remotion still MeuSocietarioPromo out/thumbnail.png --frame=300
```

### Opções avançadas de renderização

```bash
# Com codec específico e qualidade máxima
npx remotion render MeuSocietarioPromo out/promo.mp4 --codec=h264 --quality=95

# Renderizar em resolução diferente (720p)
npx remotion render MeuSocietarioPromo out/promo-720p.mp4 --width=1280 --height=720

# Renderizar apenas um trecho
npx remotion render MeuSocietarioPromo out/snippet.mp4 --frames=0-300

# Com concorrência para render mais rápido
npx remotion render MeuSocietarioPromo out/promo.mp4 --concurrency=4
```

## 🎨 Customização

### Ajustar duração das cenas

Edite o arquivo [Composition.tsx](./Composition.tsx):

```typescript
const INTRO_DURATION = 180; // 3 segundos (180 frames @ 60fps)
const LOGIN_DURATION = 300; // 5 segundos
const DASHBOARD_DURATION = 240; // 4 segundos
// ... ajuste conforme necessário
```

### Modificar cores e estilos

As cenas usam as variáveis CSS do projeto. Para ajustar cores, edite cada cena em `scenes/`:

- `IntroScene.tsx` - Tela de introdução com logo
- `LoginScene.tsx` - Tela de login com formulário animado
- `DashboardScene.tsx` - Dashboard com cards de módulos
- `KanbanScene.tsx` - Board Kanban completo com colunas e cards
- `CardDetailScene.tsx` - Drawer de detalhes com tarefas
- `FormScene.tsx` - Formulário multi-etapas
- `OutroScene.tsx` - Encerramento com features

### Alterar conteúdo

Você pode modificar:
- Textos dos cards no Kanban
- Nomes de empresas e contabilidades
- Tarefas no drawer
- Campos do formulário
- Features no encerramento

## 🎬 Estrutura do Projeto

```
src/remotion/
├── index.ts              # Ponto de entrada do Remotion
├── Root.tsx              # Composição raiz
├── Composition.tsx       # Composição principal com sequências
├── README.md             # Este arquivo
└── scenes/               # Cenas individuais
    ├── IntroScene.tsx         # 3s - Introdução
    ├── LoginScene.tsx         # 5s - Login
    ├── DashboardScene.tsx     # 4s - Dashboard
    ├── KanbanScene.tsx        # 6s - Kanban Board
    ├── CardDetailScene.tsx    # 6s - Detalhes/Drawer
    ├── FormScene.tsx          # 7s - Formulário
    └── OutroScene.tsx         # 4s - Encerramento
```

## 📊 Especificações Técnicas

- **Resolução**: 1920x1080 (Full HD)
- **FPS**: 60 frames por segundo
- **Duração Total**: ~35 segundos (2100 frames)
- **Formato**: MP4 (H.264)
- **Animações**: Spring physics do Remotion
- **Estilo**: CSS-in-JS com variáveis HSL

## 💡 Dicas

1. **Performance**: Se o Remotion Studio estiver lento:
   ```bash
   # Reduzir FPS temporariamente
   # Edite Root.tsx e mude fps para 30
   ```

2. **Iteração rápida**: Use Fast Refresh - qualquer mudança no código é refletida instantaneamente.

3. **Thumbnails**: Renderize frames específicos:
   ```bash
   # Frame 300 (5 segundos) - Login
   npx remotion still MeuSocietarioPromo thumbnail-login.png --frame=300
   
   # Frame 1080 (18 segundos) - Kanban
   npx remotion still MeuSocietarioPromo thumbnail-kanban.png --frame=1080
   ```

4. **GIF**: Para criar um GIF otimizado:
   ```bash
   # Primeiro renderize em MP4
   npm run video:render
   
   # Depois converta com ffmpeg
   ffmpeg -i out/promo.mp4 -vf "fps=30,scale=800:-1:flags=lanczos" \
     -c:v gif out/promo.gif
   ```

## 🎥 Export para Redes Sociais

### Instagram Feed (1:1)
```bash
npx remotion render MeuSocietarioPromo out/instagram-feed.mp4 \
  --width=1080 --height=1080
```

### Instagram Stories/Reels (9:16)
```bash
npx remotion render MeuSocietarioPromo out/instagram-stories.mp4 \
  --width=1080 --height=1920
```

### YouTube (Full HD)
```bash
npx remotion render MeuSocietarioPromo out/youtube.mp4 \
  --quality=95 --codec=h264
```

### LinkedIn (Recomendado)
```bash
npx remotion render MeuSocietarioPromo out/linkedin.mp4 \
  --width=1280 --height=720 --quality=90
```

## 🐛 Troubleshooting

**Erro: Cannot find module**
```bash
npm install
```

**Vídeo não renderiza**
```bash
# Verificar se o Remotion CLI está instalado
npx remotion --version

# Reinstalar se necessário
npm install --save-exact remotion@4.0.420 @remotion/cli@4.0.420
```

**Performance ruim no Studio**
- Reduza a qualidade do preview no Studio
- Feche outras aplicações
- Use `--concurrency=1` ao renderizar

## 📝 Scripts NPM

```json
{
  "video:studio": "remotion studio src/remotion/index.ts",
  "video:render": "remotion render MeuSocietarioPromo out/promo.mp4",
  "video:thumbnail": "remotion still MeuSocietarioPromo out/thumbnail.png --frame=300"
}
```

## 🎯 Próximos Passos

- [ ] Adicionar transições suaves entre cenas
- [ ] Incluir som/música de fundo
- [ ] Criar versões para diferentes idiomas
- [ ] Adicionar legendas/closed captions
- [ ] Otimizar para diferentes resoluções

---

**Desenvolvido para Meu Societário** - Sistema de gestão de processos corporativos


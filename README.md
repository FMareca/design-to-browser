# DO DESIGN AO BROWSER — Uma Anatomia do Render

Exposição digital interativa (página única) que percorre as camadas de uma interface:
design → HTML → CSS → JavaScript → React → responsivo → interação → browser.

Stack: [Next.js](https://nextjs.org) 16 (App Router), React 19, Tailwind CSS 4, TypeScript,
`framer-motion` e `lucide-react`.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção
- `npm run start` — serve o build de produção
- `npm run lint` — ESLint

## Estrutura

- `app/layout.tsx` — layout raiz, fontes (`next/font`: Inter, Space Grotesk, JetBrains Mono) e metadata
- `app/page.tsx` — rota `/`
- `app/globals.css` — tokens de cor/fonte e utilitários (`hairline`, `font-mono-code`, `text-stroke`)
- `components/exhibition/Exhibition.tsx` — página (client component): scroll spy, progresso e grid de depuração
- `components/exhibition/*Section.tsx` — cada estágio da exposição
- `components/exhibition/motion.ts` — variantes de animação compartilhadas

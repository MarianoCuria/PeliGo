# PeliGo

App para buscar dónde ver películas y series (Argentina). Next.js + TMDB.

---

## Subir cambios a GitHub (si `git push` falla)

El remoto está en **SSH** (`git@github.com:MarianoCuria/PeliGo.git`). Si ves `Permission denied (publickey)`:

### Opción A – Usar HTTPS con token (rápido)

En la terminal, dentro de esta carpeta:

```bash
git remote set-url origin https://github.com/MarianoCuria/PeliGo.git
git push -u origin feature/peligo-full-app
```

Cuando pida usuario: tu usuario de GitHub. Cuando pida contraseña: un **Personal Access Token** (no la contraseña de la cuenta).

- Crear token: GitHub → Settings → Developer settings → Personal access tokens → Generate new token (classic). Darle permiso `repo`. Copiar el token y pegarlo cuando git pida la contraseña.

### Opción B – Configurar SSH

```bash
# Ver si tenés clave
ls -la ~/.ssh/id_*.pub

# Si no hay, crear una
ssh-keygen -t ed25519 -C "tu@email.com" -f ~/.ssh/id_ed25519 -N ""

# Copiar la clave pública (luego pegarla en GitHub)
cat ~/.ssh/id_ed25519.pub
```

En GitHub: **Settings** → **SSH and GPG keys** → **New SSH key** → pegar el contenido de `id_ed25519.pub`. Después:

```bash
git push -u origin feature/peligo-full-app
```

Luego en GitHub abrís un **Pull Request** de la rama `feature/peligo-full-app` hacia `main`.

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# PeliGo

# ReneGatos Guild Portal

Portal web oficial del gremio **ReneGatos** para Star Wars Galaxy of Heroes.

## Stack

- **Frontend**: React + Vite → desplegado en Vercel
- **Backend**: Vercel Serverless Functions (Node.js)
- **APIs**: Mandalorian Bot + Comlink

---

## 🚀 Setup inicial

### 1. Clonar el repo y subir a GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/renegatos-guild.git
git push -u origin main
```

### 2. Conectar a Vercel

1. Ve a [vercel.com](https://vercel.com) → **Add New Project**
2. Selecciona el repo `renegatos-guild`
3. Vercel detectará el proyecto automáticamente (Vite)
4. En **Build Command**: `npm run build`
5. En **Output Directory**: `dist`
6. **Antes de dar a Deploy**, ve al paso 3 ↓

### 3. Variables de entorno en Vercel

En **Settings > Environment Variables**, añade estas variables:

| Variable             | Valor                                      |
|----------------------|--------------------------------------------|
| `COMLINK_URL`        | `https://comlink.kaiwu.dev`                |
| `MANDO_URL`          | `https://mhanndalorianbot.work/api`        |
| `MANDO_ACCOUNT_ID`   | Tu código de aliado (ej: `717154995`)      |
| `MANDO_PASSWORD`     | Tu contraseña del bot                      |
| `GUILD_ID`           | ID de tu gremio (ver más abajo)            |

> ⚠️ **NUNCA** subas estos valores al repo. El `.gitignore` ya excluye `.env`.

### 4. Obtener el Guild ID

El Guild ID lo puedes ver en el Excel en **API Settings > Guild ID**, o bien desde la API:

```bash
curl -X POST https://comlink.kaiwu.dev/getGuild \
  -H "Content-Type: application/json" \
  -d '{"payload": {"playerAllyCode": "TU_ALLY_CODE"}}'
```

### 5. Añadir el logo

Copia el logo del gremio como `public/logo.png`. El sidebar lo cargará automáticamente.

---

## 🖥️ Desarrollo local

```bash
npm install
npm run dev
```

Para que las API functions funcionen localmente necesitas el CLI de Vercel:

```bash
npm i -g vercel
vercel dev
```

Y crear un archivo `.env.local` con tus variables (copia `.env.example`).

---

## 📁 Estructura

```
renegatos-guild/
├── api/                  ← Vercel Serverless Functions (backend seguro)
│   ├── guild.js          ← Datos del gremio (miembros, GP, tickets)
│   ├── tw.js             ← Territory War
│   └── events.js         ← Calendario de eventos
├── src/
│   ├── App.jsx           ← Router principal
│   ├── theme.js          ← Colores y tokens de diseño
│   ├── pages/
│   │   ├── Dashboard.jsx ← Página principal
│   │   └── placeholders.jsx
│   └── components/
│       ├── Sidebar.jsx
│       ├── StatCard.jsx
│       ├── MembersTable.jsx
│       └── ui/           ← Componentes base (Panel, Badge, Bar, Dot)
├── public/
│   └── logo.png          ← ¡Añade aquí el logo!
├── .env.example          ← Plantilla de variables de entorno
├── vercel.json           ← Configuración de Vercel
└── vite.config.js
```

---

## 🗺️ Roadmap

- [x] Dashboard con roster, tickets y TW widget
- [ ] Territory War — tracking en vivo
- [ ] Territory Battle — seguimiento de fases
- [ ] Raids — asignación de equipos
- [ ] Repositorio de counters
- [ ] Objetivos del gremio
- [ ] Sistema de notificaciones Discord

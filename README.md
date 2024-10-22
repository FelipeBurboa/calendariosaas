# Programador de Citas

## Descripción
Una aplicación web moderna para la gestión y programación de citas que se integra con tu calendario personal a través de Nylas. Optimiza la forma en que organizas y manejas tus reuniones y eventos.

## Características Principales
- Integración completa con calendarios personales mediante Nylas
- Autenticación segura con NextAuth
- Interfaz de usuario moderna y responsive usando Tailwind CSS
- Gestión de datos eficiente con Prisma
- Diseño elegante con componentes de shadcn/ui
- Soporte para temas claro/oscuro
- Carga de archivos integrada con UploadThing

## Tecnologías Utilizadas

### Frontend
- React 18
- Next.js 14
- Tailwind CSS
- shadcn/ui
- Lucide Icons
- Sonner para notificaciones

### Backend
- Prisma como ORM
- NextAuth para autenticación
- Nylas para integración de calendario
- Zod para validación de datos

### Herramientas de Desarrollo
- TypeScript
- Prisma CLI

## Instalación

1. Clona el repositorio
```bash
git clone
```

2. Instala las dependencias
```bash
npm install
```

3. Configura las variables de entorno
```env
AUTH_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
DATABASE_URL=
DIRECT_URL=
NYLAS_API_KEY=
NYLAS_API_URI=
NYLAS_CLIENT_ID=
NEXT_PUBLIC_URL=http://localhost:3000
UPLOADTHING_TOKEN=
```

4. Ejecuta las migraciones de Prisma
```bash
npx prisma migrate dev
```

5. Inicia el servidor de desarrollo
```bash
npm run dev
```

## Configuración
Para utilizar esta aplicación, necesitarás:
- Una cuenta en Nylas para la integración del calendario
- Una base de datos compatible con Prisma
- Configurar las credenciales de autenticación para NextAuth

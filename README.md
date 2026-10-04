# ViscoAr

Catálogo profesional de lubricación para talleres y lubricentros. Next.js App Router + Supabase, preparado para Vercel. Interfaz responsive inspirada en Apple: buscador por marca/modelo/año/motor, fichas con fuentes, favoritos, historial, edición de catálogo, importación/exportación JSON e impresión a PDF.

## Desplegar en Vercel

1. Importar `brunnojuarez553-design/ViscoAr` desde Vercel y seleccionar Next.js. Directorio raíz: el repositorio. Instalar con `npm ci`; build: `npm run build`. Usar Node.js 22 o superior.
2. Crear o elegir un proyecto Supabase y ejecutar **supabase/schema.sql** en SQL Editor. El archivo crea tablas `viscoar_licenses` y `viscoar_records` con RLS. No modifica usuarios existentes ni otras aplicaciones.
3. Agregar estas variables en Vercel (producción y previews que necesiten acceso):
   - `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto.
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: clave publishable. No usar secret key ni service_role.
4. En Supabase Auth activar Email/Password y desactivar el registro público si se habilitan cuentas únicamente después de cobrar. No hay formulario de registro público en la aplicación.
5. Crear el usuario desde Supabase Authentication → Users → Add user → Create new user, con email y contraseña segura, y confirmar su email. Compartir la contraseña por un canal privado. Para recuperación inicial, gestionar la cuenta desde Supabase; aún no hay flujo de recuperación en la web.
6. Activar su licencia con SQL, reemplazando el email por el real:

```sql
insert into public.viscoar_licenses (user_id, active)
select id, true from auth.users where email = 'cliente@ejemplo.com'
on conflict (user_id) do update set active = excluded.active;
```

7. Volver a desplegar si agregaste o cambiaste variables y entrar al dominio de Vercel. Si faltan variables o tablas, se muestra una pantalla de configuración en vez de un catálogo ficticio.

## Pago único y acceso

La licencia es manual, sin fecha de vencimiento. Después de confirmar el pago, el administrador crea la cuenta y activa la licencia desde Supabase. Una cuenta sin licencia ve la pantalla de activación. Los datos de cada cuenta están aislados por RLS, incluso cuando se consulta directamente la API de Supabase. Los usuarios no pueden activar sus propias licencias. Esta versión **no incluye checkout, cobros ni activación automática por webhook**.

El catálogo inicial en `lib/catalog.ts` es común. Las ediciones, fichas nuevas, eliminaciones, favoritos e historial son privados por cuenta. Todavía no existe un panel de administración central que distribuya fichas nuevas a todos los clientes. Para ampliar el catálogo común, actualizar ese archivo y desplegar. Esto conserva las personalizaciones de cada cuenta.

## Datos técnicos iniciales

- 4 fichas documentadas: Ford Fiesta 1.6 (2019) y Ranger 2.2, 3.2 y 2.5 (2019).
- 6 fichas pendientes, sin recomendaciones de aceite.
- Fuentes oficiales de Ford Argentina y páginas del manual visibles en cada ficha.
- Verificar año, motor, mercado y fecha de fabricación antes de aplicar una recomendación. No extender fichas a otras variantes sin documentación.

Una ficha marcada como documentada requiere viscosidad, capacidad, homologación, fuente HTTPS y páginas. Este estado expresa documentación cargada por el usuario, no una certificación automática del contenido.

## Desarrollo

```bash
npm ci
cp .env.example .env.local
# Completar las variables de tu proyecto Supabase
npm run dev
```

```bash
npm run typecheck
npm run build
```

## Importación y respaldo

Exportar genera un JSON con el catálogo efectivo de la cuenta. Importar admite ese mismo formato, hasta 200 fichas y 1 MB por lote. Actualiza por ID y valida todo antes de enviar una escritura atómica. Los IDs duplicados se rechazan. La exportación del catálogo no incluye favoritos ni historial.

## Pendiente antes de vender a escala

Ampliar y revisar cobertura técnica, agregar recuperación de contraseña, checkout si se desea, definir condiciones de licencia y soporte, y probar login/RLS en el proyecto Supabase real. No se conectó ni modificó ningún proyecto Supabase durante la preparación del repositorio.

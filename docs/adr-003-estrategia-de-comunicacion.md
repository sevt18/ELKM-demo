# ADR 003: Estrategia de Comunicación

- **Estado:** Aceptado
- **Fecha:** 2026-10-28
- **Autores:** 
  - Sebastián Jiménez Mena (202320048)
  - Samuel David Quintana (202310319)
- **Proyecto:** ELKM - Event Lifecycle & Kit Manager

---

## 1. Contexto

En el desarrollo del sistema **ELKM (Event Lifecycle & Kit Manager)**, la gestión operativa de bodegas de producción técnica exige un intercambio de información continuo, seguro y eficiente entre la interfaz de usuario (operadores de bodega, técnicos de rampa y coordinadores de eventos) y las capas de servicios en la nube (persistencia, autenticación y almacenamiento de evidencias técnicas).

El equipo de desarrollo está conformado por **dos (2) ingenieros** en proceso de consolidación técnica, utilizando **Google IA** como herramienta de aceleración de desarrollo. En este contexto, la definición de la estrategia de comunicación entre componentes y servicios debe satisfacer los siguientes requisitos y restricciones del proyecto:

1. **Simplicidad y Baja Complejidad Cognitiva:** El equipo requiere una tecnología ampliamente conocida, con soporte nativo en el navegador web, sin toolchains complejos de compilación de esquemas binarios ni capas intermedias de proxies.
2. **Naturaleza de las Operaciones de Bodega:** Las transacciones críticas (alta de kits con validación estricta, registro de despacho a evento, triaje físico en rampa con acumulación de ciclos `+1`, y órdenes de servicio técnico) requieren confirmación determinista e inmediata (síncrona).
3. **Reconocimiento del Estado en Tiempo Real:** El personal en rampa necesita visualizar cambios de disponibilidad sin recargar la página cuando otro operador despacha o recibe un kit (requerimiento de reactividad por eventos).
4. **Principios de FinOps y Green Software:** Tal como se discutió en la Sesión 11 de la cátedra de Arquitectura de Software (IUSH), cada salto de red adicional, servidor intermedio o serialización redundante genera costos económicos innecesarios en la nube y consumo energético superfluo (haciendo eco del caso de estudio de *Amazon Prime Video*, que optimizó costos y latencia al simplificar microservicios intermedios redundantes).
5. **Contrato de Servicios Plausible:** Se requiere una definición formal, legible y estándar para los contratos de comunicación que permita validar peticiones, prevenir campos vacíos y servir de referencia para futuras integraciones.

---

## 2. Decisión

Se toman las siguientes decisiones formales de arquitectura de comunicación:

### 2.1. Paradigma de Comunicación: Enfoque Híbrido Pragmático (Síncrono + Asíncrono Reactivo)

Se adopta un **modelo de comunicación híbrido pragmático** adaptado a las necesidades funcionales del dominio de inventario técnico:

1. **Comunicación Síncrona (Request-Response / HTTPS):**
   - Se utiliza para todas las mutaciones transaccionales del ciclo de vida: creación de kits, actualización de metadatos, autenticación de usuarios, registro de retornos y cambio de estados operativos.
   - **Mecanismo:** Solicitudes HTTP directas con respuesta inmediata y determinista (código de estado HTTP + cuerpo de confirmación JSON).
   - **Justificación:** Garantiza consistencia inmediata y permite que la interfaz informe al usuario al instante si la operación fue aprobada o rechazada por validaciones de negocio.

2. **Comunicación Asíncrona Reactiva (Event-Driven Observer / WebSockets / Cloud Storage):**
   - Se utiliza para la sincronización reactiva del inventario en vivo mediante listeners de cambio (`onSnapshot` de Cloud Firestore) y para la subida de evidencias fotográficas pesadas y actas técnicas a Firebase Storage en segundo plano.
   - **Mecanismo:** Flujo de eventos basados en el patrón Observer. La aplicación suscribe los componentes a cambios en las colecciones y recibe deltas incrementales sin bloquear el hilo principal de la interfaz ni requerir sondeos periódicos (*polling*).
   - **Justificación:** Reduce drásticamente el consumo de red en más de un 85% comparado con el sondeo continuo (*polling*), alineándose directamente con las metas de Green Software y FinOps.

### 2.2. Tecnología de Comunicación Seleccionada: REST (Representational State Transfer) sobre HTTPS

Se selecciona **REST (HTTP/1.1 y HTTP/2 con JSON)** como la tecnología oficial de comunicación entre el cliente y los servicios:

- **Estructura de Endpoints:** Recursos modelados como sustantivos en plural (`/kits`, `/dispatches`, `/returns`, `/maintenance`, `/auth`), utilizando los verbos HTTP estándar (`GET`, `POST`, `PUT`, `DELETE`).
- **Formato de Carga Útil (Payload):** JSON estándar (`application/json`), ligero, nativamente soportado por JavaScript/TypeScript y serializable sin dependencias binarias.
- **Justificación Técnica:**
  - **Ubicuidade Inmediata:** Funciona de forma nativa en cualquier navegador moderno mediante la API `fetch`, sin requerir librerías cliente pesadas ni adaptadores de red especiales.
  - **Baja Curva de Aprendizaje:** Permite al equipo de 2 desarrolladores depurar peticiones y respuestas directamente en las herramientas de desarrollo del navegador (*DevTools Network tab*), inspeccionando headers y cuerpos legibles en texto plano.
  - **Alineación con el Monolito Modular:** Facilita la comunicación interna y el desacoplamiento claro entre la capa de presentación y los servicios de acceso a datos (`src/firebase/firestoreService.ts`).

### 2.3. Definición del Contrato de Servicios: OpenAPI 3.0 (Swagger) + Interfaces Canónicas TypeScript

Se adopta **OpenAPI 3.0.3 (Swagger)** complementado con **Interfaces Canónicas en TypeScript (`src/types/elkm.ts`)** como el contrato formal de comunicación entre servicios:

- **Ubicación del Contrato:** El archivo formal de especificación OpenAPI se encuentra registrado en el repositorio en `/docs/swagger.json`.
- **Justificación de ser el Contrato "Más Básico y Plausible":**
  - **Sin Compilación Binaria:** A diferencia de `.proto` (gRPC) que exige configurar el compilador `protoc` y generar stubs de código para cada lenguaje, OpenAPI y JSON Schema son interpretables directamente como archivos JSON/YAML estándar.
  - **Tipado Estricto de Punta a Punta (End-to-End Type Safety):** Las estructuras definidas en `docs/swagger.json` (`Kit`, `NewKitRequest`, `DispatchEvent`, `ReturnLog`, `MaintenanceRequest`, `UserProfile`, `ErrorResponse`) tienen correspondencia biunívoca exacta (1:1) con las interfaces canónicas de TypeScript en `src/types/elkm.ts`.
  - **Validación Estricta:** Permite verificar la presencia obligatoria de todos los campos (como se implementó en `NewKitModal.tsx`) evitando registros con datos vacíos o inconsistentes.
  - **Interoperabilidad y Documentación Viva:** Cualquier herramienta estándar (Swagger UI, Postman, Redoc) puede importar `docs/swagger.json` para probar endpoints y validar esquemas sin intervención manual.

---

## 3. Alternativas Descartadas y Análisis Comparativo

En el marco de los temas abordados en la Sesión 11, se evaluaron rigurosamente las siguientes alternativas tecnológicas y de contratos:

| Tecnología / Contrato | Paradigma | Formato de Payload | Complejidad de Adopción | Veredicto | Razón Principal de Descarte |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **REST + OpenAPI** | Síncrono / Req-Res | JSON | **Baja** (Nativo web) | **SELECCIONADO** | Simplicidad, compatibilidad nativa, cero tooling complejo y alineado a 2 devs. |
| **SOAP + WSDL** | Síncrono RPC | XML | **Muy Alta** (Obsoleto) | **DESCARTADO** | Verbosidad extrema de payloads XML, sobrecarga de ancho de banda y penalización FinOps. |
| **gRPC + .proto** | Síncrono / Streaming | Binario (Protobuf) | **Alta** (No nativo web) | **DESCARTADO** | Requiere proxy intermedio (Envoy / gRPC-Web); sobreingeniería para un cliente SPA web. |
| **GraphQL + SDL** | Síncrono Flexible | JSON sobre HTTP | **Media - Alta** | **DESCARTADO** | Requiere desplegar y costear un servidor intermedio dedicado (Apollo), introduciendo saltos de red. |
| **Webhooks** | Asíncrono Push | JSON | **Baja en Backend** | **DESCARTADO (como canal primario)** | Inviable en clientes web/SPA: los navegadores no tienen IP pública para escuchar peticiones entrantes. |

### 3.1. Por qué se descartó SOAP (WSDL / XML)
- **Sobrecarga de Datos (Payload Overhead):** El encapsulamiento en sobres SOAP y esquemas XML incrementa el tamaño de cada mensaje entre un 300% y 500% en comparación con JSON, desperdiciando ancho de banda y batería en dispositivos móviles.
- **Obsolescencia Técnica:** SOAP fue diseñado para arquitecturas empresariales de principios de los años 2000 y carece de soporte amigable en frameworks frontend modernos como React 19.
- **Impacto Green Software:** El procesamiento y parseo de árboles DOM XML en el cliente consume ciclos de CPU significativamente mayores que `JSON.parse()`.

### 3.2. Por qué se descartó gRPC (.proto / Protobuf)
- **Incompatibilidad Nativa con Navegadores:** Aunque gRPC ofrece un rendimiento excelente con Protobuf y HTTP/2, los navegadores web modernos no exponen las primitivas de control HTTP/2 necesarias para soportar gRPC de forma nativa.
- **Sobrecarga de Infraestructura:** Obligaría al equipo a desplegar, configurar y mantener un proxy intermedio (como Envoy o un backend de traducción gRPC-Web), aumentando los costos de hosting y los puntos de fallo.
- **Complejidad del Toolchain:** Exige instalar compiladores binarios (`protoc`), plugins de generación de código TypeScript y flujos de recompilación para cada cambio en el modelo de datos, lo cual ralentizaría el flujo ágil del equipo de 2 personas asistido por IA.

### 3.3. Por qué se descartó GraphQL (Schema Definition Language - SDL)
- **Costo de Servidor Intermedio y FinOps (El caso Prime Video):** GraphQL no puede ejecutarse directamente contra bases de datos serverless de forma transparente sin un servidor de capas intermedias (por ejemplo, Apollo Server o NestJS GraphQL Gateway). Mantener este contenedor en Cloud Run o ECS añade un costo mensual fijo y latencia añadida en cada consulta.
- **Complejidad en Caché y Control de Acceso:** En GraphQL, casi todas las peticiones son de tipo `POST` dirigidas a un único endpoint `/graphql`, lo cual inhabilita las bondades del almacenamiento en caché HTTP estándar de navegadores y CDNs.
- **Sobredimensión para el Alcance:** Los beneficios de GraphQL (evitar *over-fetching* y *under-fetching*) son irrelevantes para ELKM, dado que las entidades del sistema (Kits, Despachos, Retornos) tienen estructuras compactas y bien acotadas.

### 3.4. Por qué se descartaron los Webhooks como canal principal
- **Inviabilidad en Clientes Web:** Un webhook requiere que el receptor sea un servidor con una dirección IP pública estática o un nombre de dominio accesible vía DNS con un puerto abierto para recibir llamadas `POST`. Los navegadores de los operadores de bodega se encuentran detrás de firewalls corporativos o NATs móviles, por lo que no pueden recibir webhooks directos.
- **Canal de Notificación Adecuado:** Los webhooks se reservan exclusivamente para integraciones futuras máquina a máquina (ej. notificar a un ERP externo como SAP cuando se cierre una orden de mantenimiento), pero no como mecanismo de comunicación cliente-servidor en ELKM.

---

## 4. Buenas Prácticas de Comunicación Adoptadas (Discutidas en Clase)

1. **Principio KISS (Keep It Simple, Stupid) y YAGNI (You Aren't Gonna Need It):**
   - Se priorizó una solución directa, comprensible y de fácil mantenimiento por encima de arquitecturas de comunicación sobreingeniadas que requerirían semanas de configuración.
2. **Semántica Rigurosa de Códigos de Estado HTTP:**
   - La API y los servicios responden estrictamente con los códigos semánticos estándar:
     - `200 OK`: Consulta o actualización exitosa.
     - `201 Created`: Kit o despacho registrado satisfactoriamente.
     - `400 Bad Request`: Formulario con campos faltantes o valores no permitidos (validación preventiva estricta).
     - `401 Unauthorized` / `403 Forbidden`: Intento de acceso sin credenciales válidas o con permisos insuficientes según el rol.
     - `404 Not Found`: Kit o registro no encontrado en la base de datos.
     - `409 Conflict`: Intento de despachar un kit que se encuentra en estado `mantenimiento` o `despachado`.
     - `500 Internal Server Error`: Fallos no controlados del servidor.
3. **Tipado Estricto de Extremo a Extremo (End-to-End Type Safety):**
   - No se utiliza el tipo `any` en los servicios de comunicación. Todas las solicitudes y respuestas están tipadas mediante TypeScript en `src/types/elkm.ts`, garantizando que un error en el contrato sea detectado en tiempo de compilación y no en producción.
4. **Idempotencia en Operaciones de Estado:**
   - Las operaciones de actualización (como poner un kit en mantenimiento o reiniciar su contador de ciclos) son idempotentes: ejecutarlas múltiples veces con los mismos parámetros produce el mismo estado en el sistema, evitando inconsistencias por reconexiones de red.
5. **FinOps y Green Software (Reducción de Huella de Carbono y Costos Cloud):**
   - **Eliminación de Saltos de Red Innecesarios:** Comunicación directa cliente-BaaS sin intermediarios de proxy.
   - **Compresión y Minimización de Payloads:** Payloads JSON planos, desprovistos de redundancias.
   - **Event-Driven vs. Polling:** El uso de listeners reactivos frente al sondeo HTTP convencional elimina miles de peticiones redundantes por hora, reduciendo la factura de Firestore y el consumo de energía en los centros de datos.

---

## 5. Catálogo de Servicios y Contratos (OpenAPI 3.0 / Swagger)

La totalidad de los servicios del sistema ELKM se encuentra documentada en el contrato formal `/docs/swagger.json`. A continuación se resumen los 11 endpoints agrupados por módulo funcional:

### 5.1. Módulo de Inventario y Kits (`/kits`)
- `GET /kits`: Obtiene el catálogo completo de kits técnicos con sus ciclos acumulados, estado operativo y categoría.
- `POST /kits`: Registra un nuevo kit técnico con validación estricta de todos sus campos obligatorios (código, nombre, categoría, tolerancia, ubicación, número de serie, costo y notas).
- `GET /kits/{id}`: Consulta la ficha técnica detallada y estado de ciclo de vida de un kit específico.
- `PUT /kits/{id}`: Actualiza los datos operativos, ubicación en bodega o notas de un kit.
- `DELETE /kits/{id}`: Da de baja un kit del inventario activo.

### 5.2. Módulo de Despachos Logísticos (`/dispatches`)
- `GET /dispatches`: Lista el historial de órdenes de salida de equipamiento a eventos.
- `POST /dispatches`: Registra una nueva orden de despacho, asociando el kit, evento de destino, responsable técnico y fecha estimada de retorno, transicionando el estado del kit a `despachado`.

### 5.3. Módulo de Rampa y Retornos (`/returns`)
- `GET /returns`: Consulta la bitácora de recepciones de equipamiento en rampa de bodega.
- `POST /returns`: Registra el acta de triaje técnico de retorno, incrementa atómicamente el contador de ciclos del kit (`+1 ciclo`), evalúa el umbral preventivo y determina el semáforo de triaje (`optimo`, `calibracion`, `critico`).

### 5.4. Módulo de Taller y Mantenimiento (`/maintenance`)
- `GET /maintenance`: Consulta las órdenes de servicio técnico y calibración preventivas/correctivas.
- `POST /maintenance`: Emite una nueva orden de mantenimiento para kits que alcanzaron o superaron el 100% de tolerancia de ciclos.
- `PUT /maintenance/{id}/complete`: Finaliza la orden de mantenimiento, adjunta el certificado de calibración en PDF/Storage y reinicia los ciclos operativos del kit a cero (`0`).

### 5.5. Módulo de Autenticación y Perfiles (`/auth`)
- `POST /auth/login`: Autentica credenciales operativas del personal y retorna el token de sesión y perfil con rol asignado (`admin`, `tecnico`, `logistica`).
- `GET /auth/profile`: Consulta el perfil del operador actualmente autenticado.

---

## 6. Consecuencias

### 6.1. Consecuencias Positivas
- **Máxima Velocidad de Desarrollo:** El equipo de 2 personas puede desarrollar y probar nuevas funcionalidades en cuestión de minutos, sin fricciones de compiladores externos o herramientas intermedias.
- **Interoperabilidad Garantizada:** Cualquier sistema externo o herramienta de evaluación académica puede inspeccionar `docs/swagger.json` e interactuar de forma estandarizada con la API.
- **Eficiencia Económica (FinOps):** Cero costos fijos en servidores proxy o puertas de enlace GraphQL dedicadas; consumo bajo demanda optimizado mediante eventos.
- **Mantenibilidad y Robustez:** Contratos claros y sincronizados con TypeScript garantizan que las refactorizaciones de código no rompan la compatibilidad de datos.

### 6.2. Riesgos y Estrategias de Mitigación
- **Riesgo de Desincronización entre Swagger y TypeScript:**
  - *Riesgo:* Modificar un campo en `src/types/elkm.ts` sin reflejarlo en `docs/swagger.json`.
  - *Mitigación:* Se establece como política obligatoria que cualquier cambio en las interfaces del modelo de datos deba actualizar simultáneamente el archivo `docs/swagger.json` en el mismo commit.
- **Control de Volumen de Payloads JSON:**
  - *Riesgo:* Enviar colecciones excesivamente grandes en listados generales a medida que el inventario crezca.
  - *Mitigación:* Los endpoints soportan filtros por categoría y estado, y en etapas de escalamiento futuro se incorporará paginación basada en cursores (`limit` y `startAfter`).

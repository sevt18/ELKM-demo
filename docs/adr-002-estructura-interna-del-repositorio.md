# ADR 002: Estructura Interna del Repositorio

- **Estado:** Aceptado
- **Fecha:** 2026-10-14
- **Autores:** 
  - Sebastián Jiménez Mena (202320048)
  - Samuel David Quintana (202310319)
- **Proyecto:** ELKM - Event Lifecycle & Kit Manager

---

## 1. Contexto

El sistema ELKM (Event Lifecycle & Kit Manager) se enfoca en resolver los desafíos de trazabilidad, control de ciclos operativos, triaje de retornos en rampa y mantenimiento preventivo para kits de producción técnica en eventos.

El desarrollo está a cargo de un equipo compacto de **dos (2) desarrolladores** con experiencia técnica en consolidación, apoyados por **Google IA** como herramienta de aceleración. El alcance del proyecto está delimitado a un producto mínimo viable (MVP) de alta fidelidad, con integración a servicios en la nube de Firebase (Cloud Firestore, Firebase Authentication y Firebase Storage).

Para garantizar un flujo de trabajo fluido, minimizar conflictos de integración y mantener la calidad del software a lo largo del ciclo de vida del proyecto, se identificó la necesidad imperativa de definir tres directrices fundamentales de estructura interna:

1. **Estrategia de Repositorio:** Determinar si el código y sus artefactos conexos deben residir en un único repositorio (*Monorepo*) o distribuirse en múltiples repositorios (*Multirepo*).
2. **Patrón Arquitectónico de Código:** Definir el estilo de descomposición y flujo interno de datos, contrastando un **Patrón por Capas (Layered Architecture)** frente a una **Arquitectura Hexagonal (Ports & Adapters)**.
3. **Organización de Directorios:** Seleccionar el criterio de empaquetado del árbol de directorios de código fuente, contrastando una **Organización Funcional (Package-by-Feature / Bounded Contexts)** frente a una **Organización Técnica tradicional (Package-by-Layer / por tipo de archivo)**.

---

## 2. Decisiones

### 2.1. Estrategia de Repositorio: Monorepo

Se decide adoptar una estrategia de **Monorepo** (un solo repositorio de control de versiones en Git):

- **Contenido del Repositorio:** Contiene la aplicación web cliente (React 19 + TypeScript + Vite), las definiciones de esquemas (`firebase-blueprint.json`), las reglas de seguridad declarativas (`firestore.rules`, `storage.rules`), los contratos de tipos globales, la documentación de arquitectura (`docs/`) y los scripts de automatización.
- **Justificación Técnica:**
  - **Eficiencia para 2 Personas:** Elimina la sobrecarga de gestionar múltiples repositorios, tokens de acceso dispersos, sincronización manual de Pull Requests entre repos y versionado de paquetes internos (`npm publish` o Git submodules).
  - **Atomicidad en Cambios Cruzados:** Cualquier modificación al modelo de datos (por ejemplo, agregar una fotografía de evidencia a un kit) se refleja de manera atómica en un único commit: contratos de interfaz TypeScript, reglas de Firestore/Storage y componentes de interfaz gráfica.
  - **Trazabilidad y CI/CD Simplificado:** Un único pipeline de compilación (`compile_applet`), verificación estática (`tsc --noEmit`) y despliegue unificado.

### 2.2. Patrón de Código: Arquitectura por Capas (Layered Architecture)

Se decide adoptar un patrón de **Arquitectura por Capas**, adaptado pragmáticamente a un cliente frontend moderno con backend serverless (BaaS):

1. **Capa de Presentación (UI / View Layer):** Componentes visuales declarativos en React 19 estructurados con Tailwind CSS (`src/modules/*/*.tsx`, `src/components/`, `src/shared/components/`). Su responsabilidad exclusiva es capturar eventos del operador de bodega y renderizar el estado.
2. **Capa de Lógica de Negocio y Dominio (Business Logic Layer):** Reglas de cálculo de acumulación de ciclos operativos (+1 ciclo por retorno), evaluación de umbrales preventivos (&ge;100% de tolerancia), triaje dinámico (`optimo`, `calibracion`, `critico`), transiciones de estados del kit y validación de formularios.
3. **Capa de Servicios y Acceso a Datos (Service & BaaS Layer):** Módulos desacoplados (`src/firebase/firestoreService.ts`, `src/firebase/storageService.ts`) que encapsulan los SDKs de Google Cloud Firestore, Firebase Auth y Firebase Storage. Proporcionan suscripciones reactivas en tiempo real (`onSnapshot`) y operaciones idempotentes sin exponer detalles de bajo nivel a los componentes.

- **Justificación Técnica:**
  - **Alineación con el Alcance y BaaS:** El uso de Firebase traslada la lógica de persistencia y autorización a servicios gestionados en la nube. Un patrón por capas ofrece un flujo de dependencias unidireccional y predecible (Presentación &rarr; Dominio &rarr; Servicios &rarr; Firebase), sin incurrir en abstracciones innecesarias.
  - **Baja Sobrecarga Cognitiva:** Permite al equipo de 2 integrantes entender el flujo de datos de inmediato: si falla la visualización, se revisa la capa de presentación; si falla la regla del semáforo de ciclos, se revisa la capa de dominio; si falla la persistencia, se revisa el servicio de Firestore.

### 2.3. Organización de Carpetas: Organización Funcional (Package-by-Feature)

Se decide organizar el árbol de código fuente según un criterio **Funcional (por Dominio / Feature)** en lugar de un criterio técnico:

```text
src/
├── firebase/               # Capa de infraestructura y servicios BaaS
│   ├── config.ts
│   ├── firestoreService.ts
│   ├── storageService.ts
│   └── errors.ts
├── modules/                # Módulos Funcionales (Bounded Contexts)
│   ├── auth/               # Autenticación dual, perfiles y control de acceso
│   ├── inventory/          # Gestión de kits, componentes, fichas técnicas y fotos
│   ├── dispatch/           # Órdenes de despacho a eventos y calendario logístico
│   ├── returns/            # Rampa de retorno, triaje (+1 ciclo) y evidencia física
│   ├── maintenance/        # Taller técnico, actas de servicio y reinicio de ciclos
│   ├── alerts/             # Monitoreo de umbrales críticos y riesgos de falla
│   └── docs/               # Visualizadores de arquitectura técnica en el sistema
├── shared/                 # Elementos transversales reutilizables
│   └── components/         # FirebaseFileUpload, StatusBadge, CycleProgress
├── types/                  # Contratos y tipos canónicos compartidos (elkm.ts)
└── data/                   # Semillas de demostración e inicialización de datos
```

- **Justificación Técnica:**
  - **Principio de Localidad (High Cohesion):** Todo lo necesario para operar una funcionalidad (vistas, modales específicos, validaciones) coexiste en un mismo directorio. Si se modifica la gestión de retornos, el desarrollador trabaja dentro de `src/modules/returns/`, sin tener que navegar por 5 carpetas distintas.
  - **Paralelismo sin Conflictos en Git:** Cada uno de los dos integrantes del equipo puede trabajar en módulos distintos de forma simultánea (por ejemplo, uno en `modules/dispatch/` y otro en `modules/maintenance/`), minimizando colisiones en merge requests y ramas de trabajo.
  - **Bajo Acoplamiento (Loose Coupling):** Cada módulo expone su interfaz al resto del sistema y consume tipos de `src/types/elkm.ts` o componentes compartidos de `src/shared/components/`, evitando dependencias cruzadas enredadas.

---

## 3. Alternativas Descartadas y Justificación

### 3.1. Alternativa Descartada: Multirepo (Repositorios Múltiples)

- **Descripción de la Alternativa:** Separar la solución en repositorios independientes de GitHub (ejemplo: un repositorio para el frontend, uno para las funciones/servicios backend, uno para la documentación y uno para librerías compartidas).
- **Razones para Descartarla:**
  1. **Fricción Operativa Injustificada:** Para un equipo de 2 personas, coordinar issues, pull requests, sincronización de versiones semánticas y despliegues en múltiples repositorios consume un tiempo valioso sin aportar beneficios reales de aislamiento de infraestructura.
  2. **Riesgo de Inconsistencia de Versiones:** Cambios en el modelo de datos requerirían publicar y actualizar paquetes dependientes entre repositorios, propiciando errores de versión en tiempo de ejecución.
  3. **Curva de Herramientas Excesiva:** Demandaría configurar herramientas como Lerna, Nx o Git Submodules, agregando complejidad accidental no alineada con el alcance ágil del proyecto.

### 3.2. Alternativa Descartada: Arquitectura Hexagonal (Ports & Adapters / Clean Architecture Estricta)

- **Descripción de la Alternativa:** Aislar el núcleo del dominio mediante interfaces de Puertos Primarios (Driving Ports), Puertos Secundarios (Driven Ports) y Adaptadores concretos para cada tecnología (ej. FirestoreAdapter, StorageAdapter, MockAdapter), desacoplando totalmente el dominio de cualquier framework o librería.
- **Razones para Descartarla:**
  1. **Sobreingeniería y Proliferación Excesiva de Código (Boilerplate):** Para un sistema frontend reactivo apoyado en Firebase (BaaS), la arquitectura hexagonal exigiría quintuplicar el número de archivos por cada entidad (crear entidades puras, interfaces de puertos de entrada, casos de uso individuales, interfaces de repositorios, adaptadores de salida y factorías de inyección).
  2. **Incompatibilidad Práctica con el Paradigma Reactivo de Firebase:** El mayor valor de Firebase radica en sus listeners en tiempo real (`onSnapshot`) y mutaciones optimistas. Abstraer estas capacidades detrás de puertos de repositorio síncronos o genéricos introduce una capa de traducción compleja que diluye las ventajas nativas del SDK.
  3. **Baja Probabilidad de Sustitución:** La premisa fundamental de la arquitectura hexagonal es permitir cambiar de base de datos o framework fácilmente (por ejemplo, reemplazar Firestore por PostgreSQL o React por Vue). En el contexto de este proyecto, Firebase es la solución tecnológica concertada y no existe requerimiento comercial ni técnico de sustitución durante el ciclo de vida proyectado.
  4. **Sobrecarga para un Equipo Amateur:** Imponer abstracciones abstractas complejas dificulta el desarrollo colaborativo y ralentiza la velocidad de entrega del equipo sin reportar valor al usuario final.

### 3.3. Alternativa Descartada: Organización Técnica por Tipo de Archivo (Package-by-Layer)

- **Descripción de la Alternativa:** Organizar el árbol de directorios agrupando todos los archivos por su rol técnico genérico:
  ```text
  src/
  ├── components/    # 35+ componentes mezclados de todos los dominios
  ├── views/         # Todas las pantallas juntas
  ├── services/      # Servicios genéricos
  ├── utils/         # Funciones misceláneas
  └── hooks/         # Hooks globales
  ```
- **Razones para Descartarla:**
  1. **Baja Cohesión y Alta Dispersión:** Para realizar una modificación a una feature (como agregar una validación en el despacho de kits), el desarrollador está obligado a saltar constantemente entre `views/`, `components/`, `services/` y `utils/`.
  2. **Dificultad de Mantenimiento y Escalabilidad:** Con el crecimiento del proyecto, carpetas como `components/` se convierten en "cajones de sastre" sin fronteras claras de propiedad ni dominio, propiciando código espagueti.
  3. **Mayor Probabilidad de Conflictos de Fusión (Merge Conflicts):** Ambos desarrolladores editando constantemente archivos ubicados en las mismas carpetas genéricas incrementa exponencialmente los conflictos en Git.

---

## 4. Buenas Prácticas Adoptadas

Para asegurar la solidez y mantenibilidad de la solución elegida, el equipo adopta el siguiente conjunto de buenas prácticas:

### 4.1. Buenas Prácticas en el Monorepo
- **Commits Semánticos y Atómicos:** Uso de convenciones semánticas (`feat(inventory): ...`, `fix(returns): ...`, `docs(adr): ...`) que permiten identificar de inmediato el alcance del cambio.
- **Configuración Centralizada de Calidad:** Configuración estricta única para TypeScript (`tsconfig.json`), Vite y Tailwind CSS, asegurando consistencia de estilos y compilación uniforme.
- **Versionado Declarativo de Seguridad:** Los archivos de seguridad (`firestore.rules`, `storage.rules`, `firebase-blueprint.json`) residen en la raíz del repositorio, versionados y auditados de manera simultánea con el código de la aplicación.

### 4.2. Buenas Prácticas en el Patrón por Capas
- **Encapsulación de Servicios Externos:** Ningún componente visual de React consume directamente APIs crudas de Firebase ni realiza llamadas de red sin pasar por los servicios de `src/firebase/`.
- **Inmutabilidad y Tipado Estricto:** Toda comunicación entre capas se rige estrictamente por las interfaces definidas en `src/types/elkm.ts`. No se permite el uso de tipos ambiguos (`any`).
- **Manejo Centralizado de Errores y Fallbacks:** El módulo `src/firebase/errors.ts` captura excepciones del SDK (como desconexiones o denegación de permisos) y entrega mensajes amigables al operador sin bloquear la interfaz.

### 4.3. Buenas Prácticas en la Organización Funcional
- **Regla de Fronteras Explícitas:** Los módulos en `src/modules/*` pueden importar de `shared/`, `types/` y `firebase/`, pero está prohibido importar código privado interno de otro módulo hermano (evitando acoplamiento cruzado no deseado).
- **Componentes Compartidos Reutilizables:** Todo componente que deba ser usado por más de un módulo funcional debe ser promovido explícitamente a `src/shared/components/` (como `FirebaseFileUpload.tsx` y `CycleProgress.tsx`).
- **Sanitización Previa al Guardado:** La función utilitaria `sanitizePayload` elimina valores `undefined` antes de emitir escrituras a Firestore, salvaguardando la integridad de los documentos en la base de datos.

---

## 5. Consecuencias

### 5.1. Consecuencias Positivas
- **Velocidad de Iteración Máxima:** El equipo de 2 personas trabaja sin fricciones operativas ni burocracia de versionado, logrando avances significativos en plazos reducidos.
- **Comprensión Rápida del Sistema:** La estructura funcional permite a cualquier colaborador o evaluador externo navegar por el repositorio e identificar intuitivamente dónde reside cada caso de uso del negocio.
- **Facilidad de Prueba y Depuración:** Las capas desacopladas permiten aislar errores de interfaz de problemas de sincronización de datos o reglas de seguridad en la nube.
- **Camino de Crecimiento Claro:** Si un módulo funcional específico (por ejemplo, el módulo de Mantenimiento o Alertas) requiere en el futuro convertirse en un microservicio o función serverless, su código ya se encuentra delimitado y listo para ser extraído.

### 5.2. Retos y Mitigaciones
- **Disciplina en las Fronteras de los Módulos:**
  - *Riesgo:* Que un desarrollador introduzca dependencias circulares o importe componentes privados entre módulos funcionales.
  - *Mitigación:* Se aplican revisiones de código cruzadas entre ambos integrantes del equipo y verificación automática mediante el compilador de TypeScript y linters (`tsc --noEmit`).
- **Prevención de Fatiga en Componentes Compartidos:**
  - *Riesgo:* Que la carpeta `src/shared/` se convierta en un acumulador desordenado de código.
  - *Mitigación:* Criterio estricto de promoción: un componente solo se mueve a `src/shared/` si es utilizado por al menos dos módulos independientes y no contiene lógica de negocio particular de un solo dominio.

# ADR 001: Arquitectura Seleccionada para el Proyecto ELKM

- **Estado:** Aceptado
- **Fecha:** 2026-10-11
- **Autores:** 
  - Sebastián Jiménez Mena (202320048)
  - Samuel David Quintana (202310319)
- **Proyecto:** ELKM - Event Lifecycle & Kit Manager

---

## 1. Contexto

El proyecto ELKM (Event Lifecycle & Kit Manager) es un sistema diseñado para la gestión logística, control de ciclos operativos, triaje de retorno y mantenimiento preventivo de equipamiento para eventos en bodegas técnicas.

Al planificar la solución, el equipo de desarrollo (conformado por dos integrantes) identificó las siguientes condiciones y necesidades:

1. **Equipo Reducido y Curva de Aprendizaje:** Al ser un equipo pequeño y con experiencia en consolidación, se requería una arquitectura clara, sin sobrecarga operativa excesiva (como la que demandaría una arquitectura de microservicios distribuidos), pero con suficiente orden para evitar código espagueti.
2. **Desarrollo Acelerado con IA:** Se tomó la decisión de emplear **Google IA** (Google AI Studio y modelos Gemini) como copiloto y motor principal de asistencia técnica en la generación de código y scaffolding, buscando optimizar los tiempos de entrega.
3. **Persistencia y Servicios en la Nube:** Se requería una base de datos reactiva y servicios de backend (autenticación y almacenamiento de archivos/evidencias) que ofrecieran integración nativa, facilidad de configuración y sincronización en tiempo real.
4. **Evaluación de Plataforma de Despliegue para Producción:** Por el momento, el equipo se encuentra evaluando e investigando la incorporación de plataformas como **Vercel** o **AWS** (Amazon Web Services) para el despliegue del frontend y la infraestructura que llevará el aplicativo completo a producción.

---

## 2. Decisión

Se toman las siguientes decisiones arquitectónicas para el proyecto:

### 2.1. Arquitectura de Software: Monolito Modular
Se adopta el patrón de **Monolito Modular** en el frontend/cliente (React 19 + TypeScript + Vite):
- **Estructuración por Bounded Contexts:** El código se divide en módulos de dominio autónomos (`src/modules/auth`, `src/modules/inventory`, `src/modules/dispatch`, `src/modules/returns`, `src/modules/maintenance`, `src/modules/alerts`).
- **Desacoplamiento e Interfaces Claras:** Los módulos comparten contratos de tipos canónicos (`src/types/elkm.ts`) y componentes reutilizables (`src/shared/components`), evitando dependencias circulares.
- **Justificación:** Ofrece la simplicidad de despliegue y desarrollo de un monolito, combinada con la separación de responsabilidades y orden de una arquitectura modular, facilitando el mantenimiento y trabajo en equipo.

### 2.2. Base de Datos y Backend as a Service (BaaS): Firebase
Se adopta **Firebase** como el backend del proyecto:
- **Cloud Firestore:** Base de datos NoSQL documental con suscripciones en tiempo real (`onSnapshot`) para trazabilidad inmediata de inventario, despachos y bitácoras de retorno.
- **Firebase Authentication:** Gestión de acceso con autenticación dual (Correo/Contraseña y Google Identity), control de roles operativos y perfiles en Firestore.
- **Firebase Storage:** Almacenamiento de fotos técnicas de kits, actas de recepción de retorno, certificados de calibración y manuales en PDF.
- **Justificación:** Su excelente integración con el ecosistema de Google, su curva de aprendizaje accesible, la capacidad de modelado directo asistido por IA y el soporte de reglas de seguridad robustas (ABAC).

### 2.3. Adopción de Google IA para Asistencia en el Desarrollo
Se adopta **Google IA** como herramienta transversal para la construcción del proyecto:
- **Beneficios en Tiempo:** Reducción drástica en tiempos de scaffolding, generación de interfaces con Tailwind CSS, modelado de esquemas y boilerplate de integración.
- **Enfoque de Desarrollo Asistido:** Facilita la exploración ágil de soluciones técnicas y la generación rápida de prototipos funcionales hacia producción.

---

## 3. Consecuencias

### 3.1. Consecuencias Positivas
- **Velocidad de Salida al Mercado (Time to Market):** La combinación de Monolito Modular, Firebase y asistencia de Google IA permite avanzar rápidamente en las funcionalidades clave sin invertir semanas en configurar servidores propios.
- **Trazabilidad y Sincronización en Tiempo Real:** Todos los movimientos de bodega (altas, salidas a eventos, retornos con acumulación de ciclos, órdenes de taller) quedan persistidos en la nube en Firestore y Firebase Storage con trazabilidad inmediata.
- **Simplicidad Operativa:** El equipo de 2 personas puede enfocarse en la lógica de negocio y reglas operativas en lugar del mantenimiento de infraestructura de bases de datos tradicionales.
- **Escalabilidad Gradual:** La arquitectura modular permite en el futuro extraer módulos a servicios independientes si el volumen del negocio lo requiere.

### 3.2. Riesgos y Consideraciones (Consecuencias Negativas / Retos)
- **Riesgo de "Vibe Coding" y Alucinaciones de la IA:**
  - Debido a que el desarrollo es fuertemente asistido por modelos de inteligencia artificial, existe el riesgo de que la IA alucine dependencias obsoletas, patrones inseguros o código redundante.
  - **Mitigación obligatoria:** Se debe ejercer precaución continua mediante revisión humana estricta, auditoría de seguridad en las reglas (`firestore.rules`), pruebas manuales y validación rigurosa de tipos con TypeScript y linters para prevenir brechas de seguridad o malas prácticas.
- **Requerimiento de Cuenta de Pago / Facturación en Firebase:**
  - Si bien Firebase ofrece una capa gratuita (Spark Plan), el uso de Firestore en modo empresarial o el consumo intensivo de Storage/lecturas requerirá en producción vincular una cuenta de facturación (Blaze Plan), lo que introduce consideraciones de costos si no se vigilan las cuotas.
- **Vendor Lock-in (Acoplamiento a Firebase):**
  - El uso de SDKs propios de Firebase genera cierta dependencia hacia Google Cloud. Sin embargo, se mitiga encapsulando las llamadas en capas de servicio (`src/firebase/firestoreService.ts` y `src/firebase/storageService.ts`).
- **Transición de Despliegue:**
  - Al estar evaluando Vercel o AWS, se deberá contemplar en etapas posteriores la configuración del pipeline CI/CD en GitHub Actions y las variables de entorno para el hosting final.

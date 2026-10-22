# Diagrama de Arquitectura del Sistema ELKM
**Event Lifecycle & Kit Manager · Proyecto Arquitectura de Software**

- **Autores:** Sebastián Jiménez Mena (202320048) & Samuel David Quintana (202310319)
- **Tipo de Arquitectura:** Monolito Modular con Backend-as-a-Service (BaaS) en Google Cloud Firebase
- **Patrón de Código:** Arquitectura por Capas (Presentación &rarr; Dominio &rarr; Servicios BaaS)

---

## 🖼️ Diagrama Gráfico Oficial de Arquitectura

![Diagrama Oficial de Arquitectura ELKM](./architecture_diagram.jpg)

*Diagrama de 3 Tiers: Actores &rarr; Monolito Modular Frontend (React 19) &rarr; Google Cloud Firebase BaaS (Firestore, Storage, Auth).*

---

## 1. Diagrama de Contenedores y Componentes (C4 Nivel 2 y 3)

Este diagrama modela la estructura completa del sistema: los roles de usuario, la aplicación web cliente dividida en módulos de dominio, la capa de servicios desacoplados y los servicios administrados en Google Cloud Firebase.

```mermaid
flowchart TB
    subgraph Actores["👥 Usuarios y Roles Operativos"]
        Admin["👤 Administrador General<br/>(Control total y reportería)"]
        Warehouse["📦 Operario de Bodega<br/>(Despachos y retornos)"]
        Tech["🔧 Técnico de Taller<br/>(Mantenimiento preventivo)"]
    end

    subgraph Frontend["💻 Aplicación Web ELKM (React 19 + Vite + TypeScript)"]
        subgraph Modulos["📦 Módulos Funcionales (Bounded Contexts)"]
            M_Auth["🔐 Módulo Auth<br/>(Login dual & Roles)"]
            M_Inv["📋 Módulo Inventario<br/>(Kits, SKU, Fotos)"]
            M_Disp["🚚 Módulo Despacho<br/>(Calendario logístico)"]
            M_Ret["🔄 Módulo Retornos<br/>(Triaje +1 Ciclo)"]
            M_Maint["🛠️ Módulo Taller<br/>(Órdenes & Reset ciclos)"]
            M_Alerts["🚨 Módulo Alertas<br/>(Umbrales ≥100%)"]
        end

        subgraph CapaShared["🧩 Capa Compartida & Contratos"]
            Types["📄 Canonical Types<br/>(src/types/elkm.ts)"]
            SharedUI["🎨 Shared UI & Upload<br/>(FirebaseFileUpload, Badges)"]
        end

        subgraph CapaServicios["🔌 Capa de Servicios BaaS (src/firebase/)"]
        FS_Svc["📡 firestoreService.ts<br/>(CRUD & onSnapshot real-time)"]
        ST_Svc["💾 storageService.ts<br/>(Uploads, URLs, 25MB limit)"]
        Err_Svc["🛡️ errors.ts<br/>(Manejo centralizado de errores)"]
    end
    end

    subgraph FirebaseBaaS["☁️ Google Cloud Firebase (Proyecto: true-framing-gn2tx)"]
        subgraph AuthServ["🔑 Firebase Authentication"]
            EmailAuth["Correo y Contraseña"]
            GoogleAuth["Google Identity Provider"]
        end

        subgraph FirestoreDB["🗄️ Cloud Firestore (Database ID: ai-studio-remixelkmeventli...)"]
            Col_Kits["📁 /kits/{kitId}"]
            Col_Disp["📁 /dispatches/{dispatchId}"]
            Col_Ret["📁 /returns/{returnId}"]
            Col_Users["📁 /users/{userId}"]
            Rules_FS["🔒 firestore.rules (ABAC)"]
        end

        subgraph StorageBucket["🪣 Firebase Storage (true-framing-gn2tx.firebasestorage.app)"]
            B_Kits["📁 kits/ (Fotos de equipos)"]
            B_Manuals["📁 manuals/ (PDFs técnicos)"]
            B_Returns["📁 returns/ (Evidencias de rampa)"]
            B_Reports["📁 reports/ (Certificados de taller)"]
            Rules_ST["🔒 storage.rules (MIME & Size)"]
        end
    end

    %% Relaciones Actores -> Frontend
    Admin -->|Acceso integral| M_Auth
    Warehouse -->|Control de rampa| M_Disp
    Warehouse -->|Triaje| M_Ret
    Tech -->|Servicio de equipos| M_Maint

    %% Módulos -> Capa de Servicios
    M_Auth --> AuthServ
    M_Inv --> FS_Svc
    M_Inv --> ST_Svc
    M_Disp --> FS_Svc
    M_Ret --> FS_Svc
    M_Ret --> ST_Svc
    M_Maint --> FS_Svc
    M_Maint --> ST_Svc
    M_Alerts --> FS_Svc

    %% Modulos <-> Capa Shared
    Modulos -.-> Types
    Modulos -.-> SharedUI

    %% Servicios -> Firebase BaaS
    FS_Svc <-->|Sincronización reactiva bidireccional| FirestoreDB
    ST_Svc <-->|Subida asíncrona de archivos| StorageBucket
    AuthServ -.->|Persistencia de perfil| Col_Users
```

---

## 2. Diagrama de Flujo de Negocio: Ciclo de Vida del Kit (ELKM Engine)

Este diagrama representa la máquina de estados y las reglas de negocio del kit a través de los eventos de la bodega:

```mermaid
stateDiagram-v2
    [*] --> AltaKit: Validación estricta de todos los campos
    AltaKit --> Disponible: Registro en Firestore (Ciclos: 0)

    Disponible --> EnEvento: Orden de Despacho Logístico (handleDispatchToField)
    EnEvento --> RetornoRampa: Fin de Evento / Regreso a Bodega

    state RetornoRampa {
        [*] --> Triaje
        Triaje --> Optimo: Estado Físico Aceptable (+1 Ciclo)
        Triaje --> Calibracion: Requiere Ajuste Leve (+1 Ciclo)
        Triaje --> Critico: Daño Físico / Componente Roto (+1 Ciclo)
    }

    Optimo --> EvaluacionCiclos
    Calibracion --> Mantenimiento: Pasa a Taller
    Critico --> Bloqueado: Fuera de Servicio Inmediato

    state EvaluacionCiclos <<choice>>
    EvaluacionCiclos --> Disponible: Ciclos < Umbral Línea
    EvaluacionCiclos --> AlertaPreventiva: Ciclos >= Umbral (100%)

    AlertaPreventiva --> Mantenimiento: Envío a Servicio Técnico

    state Mantenimiento {
        [*] --> Diagnostico
        Diagnostico --> Reparacion_Preventiva
        Diagnostico --> Reparacion_Correctiva
        Reparacion_Preventiva --> AdjuntarCertificado: Storage (reports/)
        Reparacion_Correctiva --> AdjuntarCertificado: Storage (reports/)
        AdjuntarCertificado --> ResetCiclos: Reinicio a 0 Ciclos
    }

    ResetCiclos --> Disponible: Retorno a Inventario Activo
    Bloqueado --> Mantenimiento: Evaluación Mayor
    Bloqueado --> [*]: Baja Definitiva de Activo
```

---

## 3. Diagrama de Arquitectura en Bloques (Vista ASCII / Universal)

Para visualización directa en terminales o editores de texto sin extensiones gráficas:

```text
======================================================================================================
                                       ARQUITECTURA DEL SISTEMA ELKM
======================================================================================================

 [USUARIOS] ----> [Administrador]       [Operario de Bodega]       [Técnico de Mantenimiento]
                         |                       |                              |
                         +-----------------------+------------------------------+
                                                 |
                                                 v  (Navegador Web / HTTPS)
 +--------------------------------------------------------------------------------------------------+
 | FRONTEND: MONOLITO MODULAR (React 19 + TypeScript + Vite + Tailwind CSS)                        |
 |                                                                                                  |
 |  [Capa de Presentación / Bounded Contexts]                                                       |
 |  +--------------------+  +--------------------+  +--------------------+  +---------------------+ |
 |  |    modules/auth    |  | modules/inventory  |  |  modules/dispatch  |  |   modules/returns   | |
 |  | (Login/Register)   |  | (Kits / SKUs)      |  | (Calendario/Órden) |  | (Triaje +1 Ciclo)   | |
 |  +--------------------+  +--------------------+  +--------------------+  +---------------------+ |
 |  +--------------------+  +--------------------+  +--------------------+                          |
 |  |modules/maintenance |  |   modules/alerts   |  |    modules/docs    |                          |
 |  | (Taller / Records) |  | (Umbrales >=100%)  |  | (ADRs / Diagramas) |                          |
 |  +--------------------+  +--------------------+  +--------------------+                          |
 |                                                                                                  |
 |  [Capa Compartida y Contratos de Dominio]                                                        |
 |  * src/types/elkm.ts (Kit, DispatchEvent, ReturnLog, UserProfile, ServiceRecord)                 |
 |  * src/shared/components/FirebaseFileUpload.tsx (Drag & Drop, Barra de Progreso)                |
 |                                                                                                  |
 |  [Capa de Servicios BaaS / Acceso a Datos]                                                      |
 |  * src/firebase/firestoreService.ts (subscribeKits, saveKit, updateDispatch, saveReturnLog)       |
 |  * src/firebase/storageService.ts (uploadFileToFirebaseStorage, getDownloadURL)                  |
 |  * src/firebase/errors.ts (Mapeo centralizado de códigos de error y fallbacks seguros)           |
 +-----------------------------------------------+--------------------------------------------------+
                                                 |
                                (SDK Firebase Web v11 / TLS 1.3)
                                                 |
                                                 v
 +--------------------------------------------------------------------------------------------------+
 | BACKEND-AS-A-SERVICE: GOOGLE CLOUD FIREBASE (Proyecto: true-framing-gn2tx)                      |
 |                                                                                                  |
 |  [Firebase Authentication]              [Google Cloud Firestore]         [Firebase Storage]     |
 |  * Correo / Contraseña                  * BD ID: ai-studio-remixelkm...  * true-framing-gn2tx...|
 |  * Google Identity Provider             * Colección /kits/               * Carpeta /kits/       |
 |  * Token JWT + Roles en Firestore       * Colección /dispatches/         * Carpeta /manuals/    |
 |                                         * Colección /returns/            * Carpeta /returns/    |
 |                                         * Colección /users/              * Carpeta /reports/    |
 |                                         * Reglas ABAC (firestore.rules)  * Reglas storage.rules |
 +--------------------------------------------------------------------------------------------------+
======================================================================================================
```

---

## 4. Visualización Nativa en el Sistema

El diagrama de arquitectura y el diagrama de ciclo de vida del kit se encuentran integrados de forma nativa e interactiva directamente dentro del aplicativo ELKM:
- Se consulta en la aplicación haciendo clic en **"Arquitectura"** (barra superior) o **"Ficha Técnica y Arquitectura"** (pie de página).
- Cuenta con conmutador dinámico de vistas para alternar entre el modelo por capas (C4) y la máquina de estados del ciclo de vida del kit.


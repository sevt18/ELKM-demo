# Proyecto ELKM
 
Repositorio ELKM. En esta práctica el equipo implementa una estrategia de branching justificada, configura un pipeline DevSecOps funcional y comprueba la eficacia de los controles de seguridad ante escenarios reales de ataque.
 
## Equipo
 
| Integrante | Código estudiantil |
|------------|--------------------|
| Sebastián Jiménez Mena | 202320048 |
| Samuel David Quintana | 202310319 |
 
## Estrategia de Branching
 
**Estrategia elegida: GitHub Flow**
 
GitHub Flow trabaja con 2 ramas permanente, `master`, que siempre debe estar estable y lista para desplegarse. Cada cambio se desarrolla en una rama corta y temporal como `feature/*`, se propone mediante un Pull Request, se valida con pruebas automatizadas y revisión, y luego se fusiona de vuelta a `master`.
 
### Justificación
 
**1. Frecuencia de despliegue esperada**
 
Esperamos desplegar con frecuencia y en incrementos pequeños: cada cambio aprobado que llega a `main` puede pasar directamente a despliegue. GitHub Flow está pensado para ese ritmo, porque no obliga a esperar ciclos de release ni a pasar por ramas intermedias (`develop`, `release`) antes de publicar: con solo dos ramas, `main` y `feature/*`, el camino de un cambio hasta producción es corto. Además, encaja con nuestro pipeline DevSecOps, que se ejecuta en cada Pull Request para validar pruebas y controles de seguridad antes de cada fusión.

**2. Tamaño del equipo**
 
Somos un equipo de dos personas. Con un equipo tan pequeño no necesitamos una estructura pesada de ramas para coordinar trabajo en paralelo: `main` y ramas cortas son suficientes. Estrategias como GitFlow, con ramas de larga duración, nos añadirían coordinación y fusiones que no aprovecharíamos. Además, con dos integrantes la revisión de código es directa: cada uno revisa y aprueba los Pull Requests del otro.
 
**Factor adicional: experiencia del equipo**
 
Somos novatos en la creación y manejo de repositorios y pipelines. GitHub Flow tiene pocas reglas y pocas ramas de corta duración, lo que reduce el riesgo de errores típicos de quien está aprendiendo, como fusionar en la rama equivocada o acumular conflictos difíciles de resolver. También nos obliga desde el inicio a practicar Pull Requests, revisión entre pares y pruebas automáticas, que son la base de un flujo DevSecOps.
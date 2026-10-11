# Security Specification - ELKM Firestore Security

## 1. Data Invariants
1. Only authenticated users can access, create, update, or inspect warehouse kits, dispatches, and return logs.
2. Documents must strictly conform to allowed keys and data formats (no shadow fields or arbitrary malicious payloads).
3. Kit IDs, Dispatch IDs, and Return IDs must match regex `^[a-zA-Z0-9_-]+$` with length <= 128 characters to prevent path traversal and resource exhaustion attacks.
4. Numerical metrics like `currentCycles` and `cycleThreshold` must be non-negative integers.
5. Critical actions (status changes, maintenance resets, dispatches) must validate allowable statuses ('disponible', 'en_evento', 'mantenimiento', 'bloqueado').
6. User profiles in `/users/{userId}` can only be written by the respective user (`request.auth.uid == userId`) or an admin (`isAdmin()`).
7. Admin permissions check against `/admins/{uid}` or bootstrap email `sebastian581mena@gmail.com`.

## 2. The "Dirty Dozen" Payloads (Adversarial Tests)
1. **Unauthenticated Read on Kits**: An anonymous request attempts to read `/kits/KIT-DJ-01` -> REJECTED.
2. **Path Traversal / Poisoned ID**: Attempt to create kit with ID `../../secrets/dump` -> REJECTED.
3. **Ghost Field Shadow Update**: Attempt to update a kit with `{ "shadowAdmin": true, "backdoor": "x" }` -> REJECTED.
4. **Invalid Kit Status Injection**: Attempt to set kit status to `"unauthorized_state"` -> REJECTED.
5. **Negative Cycles Injection**: Attempt to set `currentCycles: -999` -> REJECTED.
6. **Denial of Wallet Payload**: Attempt to write a 2MB string into `specs` -> REJECTED.
7. **Identity Spoofing on User Profile**: User `attacker123` attempts to update `/users/victim456` -> REJECTED.
8. **Privilege Escalation on User Profile**: Standard user attempts to grant themselves `role: "admin"` -> REJECTED.
9. **Unauthenticated Dispatch Creation**: Unauthenticated write to `/dispatches/DISP-999` -> REJECTED.
10. **Corrupted Array Injection**: Attempt to insert non-string or oversized array in `kitIds` -> REJECTED.
11. **Malicious Return Log with Spoofed Status**: Return log with non-allowed `resultingStatus: "deleted"` -> REJECTED.
12. **Blanket Query Scraping**: Malicious query attempting to list user profiles of other users -> REJECTED.

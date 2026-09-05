# VCT Hospital OS 5.0-r08 — HIS 2.0 Professional Baseline

## Fixed public version
`5.0-r08` remains fixed. Feature additions do not change the public version number.

## Core model
Customer → Patient → Encounter → Clinical record / Lab / Imaging / Prescription / Billing / Dispensing / Consent / Procedure / Follow-up.

## UI model
Primary navigation uses compact first-level modules with secondary navigation and patient-centered tabs. The patient center is intentionally a single work page with tabs rather than a proliferation of standalone pages.

## Six workflow layers
1. Hospital shell and secondary menus.
2. Customer/patient/encounter data core and patient center.
3. Pharmacy, pricing, inventory, batch/expiry, dispensing and billing linkage.
4. Medical record, prescription and print/consent document center.
5. Clinical workflow: triage, waiting, consultation, inpatient/ICU, surgery/anesthesia, follow-up.
6. AI/management layer: clinical assistance, operational analytics, callback and inventory suggestions; AI does not sign or finalize medical acts.

## Risk-control principle
Consent documents are designed for risk disclosure, alternatives, refusal/deferral consequences, additional treatment/cost authorization, owner acknowledgement, veterinarian confirmation, timestamps, template version and audit trace. They are not written as absolute liability waivers.

## Production boundary
This release is a browser/local-first implementation. Before production deployment, move authoritative data to a server database, implement RBAC, reliable electronic signatures, immutable audit/versioning, backups/disaster recovery, concurrent access controls, pharmacy/finance permissions, and validated print/archive workflows.

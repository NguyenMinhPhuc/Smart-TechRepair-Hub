# Role & Task:
- You are a Principal Full-Stack Engineer. Your task is to implement the Smart TechRepair Hub project (Repair & Warranty Service System) with clean architecture, strict data integrity, and robust state management.

Please strictly follow the tech stack, code style, database design, and business rules defined below:
1. TECH STACK & ARCHITECTURE
- Frontend: React.js (or Next.js) + TailwindCSS + React Query / Zustand.
- Backend: Node.js (NestJS) 
- Database: Microsoft SQL Server.
- ORM:  TypeORM 
- Action: Implement domain-driven design principles with clear separation of concerns.

2. CORE BUSINESS RULES TO IMPLEMENT
- Unique Tracking Code: Generate a unique, unguessable Tracking Code (e.g., TRK-2026X89A) for each repair ticket.
- Ticket State Machine: Strict status progression:
  CREATED -> INSPECTING -> QUOTED -> APPROVED (or REJECTED) -> REPAIRING -> TESTED -> READY_FOR_PICKUP -> COMPLETED -> CANCELLED.
- Inventory Allocation:
  * When a Technician adds a part to a Quote: Reserve stock (Soft Lock).
  * If Customer APPROVES: Deduct stock permanently upon ticket completion.
  * If Customer REJECTS or CANCELS: Release reserved stock immediately.
- Photo Audit: Allow technicians to upload before/after repair photos linked to specific tickets.

3. API DESIGN & SECURITY REQUIREMENTS
- Authentication: JWT with Access Token (short-lived) + Refresh Token (HttpOnly Cookie).
- Authorization: Role-Based Access Control (RBAC) with 4 Roles:
  * Admin (Full Access, Stock Management, Reports)
  * Receptionist (Create Tickets, Customer Check-in/out)
  * Technician (Inspect, Create Quotes, Update Repair Status)
  * Customer (Public access via Tracking Code ONLY, no account required for tracking).
- Input Validation: Strict payload validation using Zod / class-validator.
- Concurrency: Handle double-booking or inventory race conditions using Database Transactions.

4. CODE STYLE & PATTERNS
- Write clean, modular, and DRY code with TypeScript strictly typed (no 'any').
- Separation of Concerns: Controller -> Service -> Repository / ORM layer.
- Global Error Handling: Standardized JSON error response format:
  { "success": false, "message": "...", "errors": [] }
- Defensive programming: Always validate ticket status transitions before processing updates.

You are a Principal Database Administrator & Full-Stack Engineer. Your task is to implement the Smart TechRepair Hub project.

CRITICAL RULE: DIRECT SQL QUERIES (INSERT, UPDATE, DELETE) AND DIRECT ORM DATA MUTATIONS FROM BACKEND CODE ARE STRICTLY FORBIDDEN. All database reads, writes, transactions, and business logic enforcement MUST be executed strictly through Stored Procedures (SP) and Database Functions.
1. DATABASE MUTATION RULE (STORED PROCEDURES ONLY)
- Backend services (Node.js/C#) MUST ONLY invoke Stored Procedures (e.g., `CALL sp_create_ticket(...)`, `CALL sp_approve_quote(...)`).
- RAW SQL string concatenation or ORM-generated dynamic SQL (Prisma create/update/delete) is NOT ALLOWED for data mutations.
- Use ORM ONLY to call SPs (e.g., Prisma `$queryRaw` or `$executeRawUnsafe`).

2. CORE STORED PROCEDURES TO IMPLEMENT IN SQL

- `sp_create_repair_ticket`:
  * Inputs: Customer Info, Device Info, Initial Defect, CreatedBy User ID.
  * Logic: Generate unique Tracking Code (TRK-XXXXX), create/link Customer & Device, insert Ticket with status 'CREATED', write AuditLog.

- `sp_update_ticket_status`:
  * Inputs: Ticket ID, New Status, User ID, Note.
  * Logic: Validate State Machine progression. Raise exception if invalid transition. Write AuditLog.

- `sp_submit_quote`:
  * Inputs: Ticket ID, Array/JSON of Parts & Labor Items, Technician User ID.
  * Logic: Calculate total, update ticket to 'QUOTED', increment `reservedStock` (Soft Lock) for each part in `SparePart`.

- `sp_approve_quote`:
  * Inputs: Ticket ID (or Tracking Code).
  * Logic: Validate status = 'QUOTED', change status to 'APPROVED', write AuditLog.

- `sp_complete_ticket`:
  * Inputs: Ticket ID, User ID.
  * Logic: Validate status = 'READY_FOR_PICKUP', update to 'COMPLETED', deduct actual `stockQuantity` and decrement `reservedStock` for used parts, write AuditLog.

- `sp_reject_or_cancel_quote`:
  * Inputs: Ticket ID, Reason, User ID.
  * Logic: Change status to 'REJECTED' or 'CANCELLED', release `reservedStock` in `SparePart` table immediately, write AuditLog.

3. DATA ARCHITECTURE & SECURITY
- RBAC validation: Check user role inside Backend API before calling SP, or pass `p_user_id` to SP to assert permissions.
- Database Transactions: ALL multi-table operations (e.g., deducting inventory + status change) MUST be wrapped inside a `BEGIN...COMMIT/ROLLBACK` block inside the Stored Procedure itself.
- Error Handling: Use SQL `RAISE EXCEPTION` (PostgreSQL) or `SIGNAL SQLSTATE` (MySQL) to return clear business error messages to the Backend.
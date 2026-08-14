# Use Case: Manage Parts

**Description:** Quản lý linh kiện tồn kho theo từng Serial/IMEI.

**Precondition:** User is logged in.

**Postcondition:** Part is registered in inventory with unique Serial/IMEI.

## Actors
- **Technician**
- **Admin**

## Data Entities
- **Part Category**
- **Part**

## Flows
### EXCEPTION: Duplicate Serial/IMEI
User enters a Serial/IMEI already registered in the system. System rejects entry with error 'Duplicate Serial/IMEI'.

### MAIN: Register Part
User enters Serial/IMEI, selects Category from dropdown, enters Part Name, Model, Cost, and selects Status. System validates uniqueness of Serial/IMEI and ensures Category exists. System saves part record to DB.

## Business Rules
- Part status must be New/Used/Damaged
- Each Part must belong to a Category
- Serial/IMEI must be unique


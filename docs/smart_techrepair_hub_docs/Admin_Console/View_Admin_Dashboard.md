# Use Case: View Admin Dashboard

**Description:** Admin view for system health and actionable items.

**Precondition:** Admin is logged in with appropriate permissions.

**Postcondition:** Admin has a snapshot of system health and can navigate to actionable items.

## Actors
- **Admin**

## Data Entities
- **Quote**
- **Part**
- **ServiceOrder**

## Flows
### EXCEPTION: Data Retrieval Error
1. System fails to fetch data from the database.
2. System displays an error message 'Unable to load dashboard, please try again'.
3. Admin is provided with a 'Retry' button.

### ALT: No Data Available
1. System detects that there is no data to display (e.g., no pending orders).
2. System displays a 'No pending actions' message or a neutral state indicator.

### MAIN
1. Admin logs into the system.
2. Admin navigates to the 'Dashboard' section.
3. System fetches and displays aggregated metrics:
   - Total new service orders pending assignment.
   - Number of quotes awaiting customer approval.
   - Low inventory alerts (parts with quantity below threshold).
   - Real-time revenue indicator for the current day.
4. Admin reviews the metrics.
5. Admin clicks on any metric/alert card to drill down into the detailed list or specific module.

## Business Rules
- Admin must have 'Manager' or 'Owner' role to access full metrics.
- Dashboard data must be refreshed or cached for a maximum of 5 minutes.


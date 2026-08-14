# Use Case: Trigger Automated Notification

**Description:** Automated mechanism to notify customers about service order updates or quote actions.

**Precondition:** A business event has occurred that requires customer notification.

**Postcondition:** Notification is successfully sent to the customer or scheduled for retry.

## Actors
- **Customer**
- **System**

## Data Entities
- **CustomerProfile**
- **NotificationLog**
- **NotificationTemplate**

## Flows
### EXCEPTION: Gateway Communication Error
1. Gateway returns a communication error (e.g., unreachable service).
2. System marks NotificationLog as 'PENDING_RETRY'.
3. System schedules a background task to retry sending after a defined interval.

### MAIN: MAIN
1. System detects a business event (e.g., Service Order Created, Quote Ready).
2. System retrieves the corresponding NotificationTemplate based on the event type.
3. System fetches the Customer's contact information (Email/Phone) from the CustomerProfile associated with the entity that triggered the event.
4. System personalizes the notification message using data from the triggering entity.
5. System attempts to send the notification (SMS/Email) via configured gateway.
6. System logs the outcome (SUCCESS/FAILED) in NotificationLog.

## Business Rules
- Event must exist in the Notification Registry
- Phone number must be exactly 10 digits (if sending via SMS)
- Email format must be valid (if sending via Email)
- Notification message content cannot be empty


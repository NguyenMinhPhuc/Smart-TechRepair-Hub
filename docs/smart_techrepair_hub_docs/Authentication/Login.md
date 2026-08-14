# Use Case: Login

**Description:** Người dùng đăng nhập hệ thống bằng email và mật khẩu để nhận JWT.

**Precondition:** None

**Postcondition:** User is authenticated and possesses a valid JWT.

## Actors
- **User**

## Data Entities
- **User Account**

## Flows
### EXCEPTION: Invalid Credentials
User enters invalid credentials. System rejects login and returns 401 Unauthorized.

### MAIN: Successful Login
User enters email and password on the login screen. System validates credentials against database. Upon successful validation, System generates a JWT and returns it to the user.

## Business Rules
- Email must be a valid format
- Password must be at least 8 characters


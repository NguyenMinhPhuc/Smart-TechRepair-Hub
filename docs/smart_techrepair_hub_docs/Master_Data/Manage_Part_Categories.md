# Use Case: Manage Part Categories

**Description:** Quản lý danh mục sản phẩm/linh kiện (Ví dụ: Màn hình, Pin, RAM).

**Precondition:** Admin is logged in.

**Postcondition:** New category is added to the system.

## Actors
- **Admin**

## Data Entities
- **Part Category**

## Flows
### EXCEPTION: Duplicate Category Name
Admin enters a category name that already exists. System displays error 'Category already exists'.

### MAIN: Add Category
Admin navigates to category management and fills in category name and description. System validates input. System saves new category to DB.

## Business Rules
- Category name is required
- Category name is unique


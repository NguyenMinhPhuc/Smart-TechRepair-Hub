-- ============================================================================
-- 1. TẠO CSDL VÀ CÁC BẢNG (CORE ENTITIES)
-- ============================================================================
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'SmartTechRepairDB_v2')
BEGIN
    CREATE DATABASE SmartTechRepairDB_v2;
END
GO

USE SmartTechRepairDB_v2;
GO

-- Xóa bảng cũ nếu tồn tại (theo thứ tự phụ thuộc khóa ngoại)
IF OBJECT_ID('Notifications', 'U') IS NOT NULL DROP TABLE Notifications;
IF OBJECT_ID('OrderParts', 'U') IS NOT NULL DROP TABLE OrderParts;
IF OBJECT_ID('Quotes', 'U') IS NOT NULL DROP TABLE Quotes;
IF OBJECT_ID('DevicePhotos', 'U') IS NOT NULL DROP TABLE DevicePhotos;
IF OBJECT_ID('ServiceOrders', 'U') IS NOT NULL DROP TABLE ServiceOrders;
IF OBJECT_ID('Parts', 'U') IS NOT NULL DROP TABLE Parts;
IF OBJECT_ID('Categories', 'U') IS NOT NULL DROP TABLE Categories;
IF OBJECT_ID('Customers', 'U') IS NOT NULL DROP TABLE Customers;
IF OBJECT_ID('Users', 'U') IS NOT NULL DROP TABLE Users;
GO

-- 1.1 Bảng Users (Nhóm A)
CREATE TABLE Users (
    UserId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role NVARCHAR(20) NOT NULL CHECK (Role IN ('Admin', 'Technician')),
    IsDeleted BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 DEFAULT SYSDATETIME()
);

-- 1.2 Bảng Customers (Nhóm A)
CREATE TABLE Customers (
    CustomerId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    FullName NVARCHAR(100) NOT NULL,
    Phone VARCHAR(10) NOT NULL UNIQUE CHECK (Phone LIKE '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'), -- Đúng 10 chữ số
    Email NVARCHAR(100) NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 DEFAULT SYSDATETIME()
);

-- 1.3 Bảng Categories (Nhóm B)
CREATE TABLE Categories (
    CategoryId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(100) NOT NULL UNIQUE,
    IsDeleted BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME()
);

-- 1.4 Bảng Parts (Nhóm B)
CREATE TABLE Parts (
    PartId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    CategoryId UNIQUEIDENTIFIER NOT NULL,
    Name NVARCHAR(150) NOT NULL,
    SerialIMEI VARCHAR(100) NOT NULL UNIQUE, -- Unique ở mức DB
    Status NVARCHAR(20) NOT NULL DEFAULT 'New' CHECK (Status IN ('New', 'Used', 'Damaged')),
    Price DECIMAL(18, 2) NOT NULL CHECK (Price >= 0),
    IsDeleted BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Parts_Categories FOREIGN KEY (CategoryId) REFERENCES Categories(CategoryId)
);

-- 1.5 Bảng ServiceOrders (Nhóm C)
CREATE TABLE ServiceOrders (
    OrderId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    TrackingCode VARCHAR(50) NOT NULL UNIQUE, -- Unique ở mức DB
    CustomerId UNIQUEIDENTIFIER NOT NULL,
    TechnicianId UNIQUEIDENTIFIER NULL,
    IssueDescription NVARCHAR(MAX) NOT NULL,
    Status NVARCHAR(30) NOT NULL DEFAULT 'Created' CHECK (
        Status IN ('Created', 'Inspecting', 'Quoted', 'Approved', 'Rejected', 'Repairing', 'Completed', 'Cancelled')
    ),
    IsDeleted BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 DEFAULT SYSDATETIME(),
    CONSTRAINT FK_ServiceOrders_Customers FOREIGN KEY (CustomerId) REFERENCES Customers(CustomerId),
    CONSTRAINT FK_ServiceOrders_Users FOREIGN KEY (TechnicianId) REFERENCES Users(UserId)
);

-- 1.6 Bảng DevicePhotos (Nhóm C)
CREATE TABLE DevicePhotos (
    PhotoId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    OrderId UNIQUEIDENTIFIER NOT NULL,
    PhotoUrl NVARCHAR(500) NOT NULL,
    UploadedAt DATETIME2 DEFAULT SYSDATETIME(),
    CONSTRAINT FK_DevicePhotos_ServiceOrders FOREIGN KEY (OrderId) REFERENCES ServiceOrders(OrderId) ON DELETE CASCADE
);

-- 1.7 Bảng Quotes (Nhóm C - Quan hệ 1:1 với ServiceOrders)
CREATE TABLE Quotes (
    QuoteId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    OrderId UNIQUEIDENTIFIER NOT NULL UNIQUE, -- UNIQUE để đảm bảo quan hệ 1:1
    TotalLaborCost DECIMAL(18, 2) NOT NULL DEFAULT 0.00 CHECK (TotalLaborCost >= 0),
    TotalPartsCost DECIMAL(18, 2) NOT NULL DEFAULT 0.00 CHECK (TotalPartsCost >= 0),
    Status NVARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (Status IN ('Pending', 'Approved', 'Rejected')),
    CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Quotes_ServiceOrders FOREIGN KEY (OrderId) REFERENCES ServiceOrders(OrderId) ON DELETE CASCADE
);

-- 1.8 Bảng OrderParts (Nhóm D - Bảng liên kết N:N giữa ServiceOrders và Parts)
CREATE TABLE OrderParts (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    OrderId UNIQUEIDENTIFIER NOT NULL,
    PartId UNIQUEIDENTIFIER NOT NULL,
    Quantity INT NOT NULL DEFAULT 1 CHECK (Quantity > 0),
    CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
    CONSTRAINT FK_OrderParts_ServiceOrders FOREIGN KEY (OrderId) REFERENCES ServiceOrders(OrderId) ON DELETE CASCADE,
    CONSTRAINT FK_OrderParts_Parts FOREIGN KEY (PartId) REFERENCES Parts(PartId)
);

-- 1.9 Bảng Notifications (Nhóm D)
CREATE TABLE Notifications (
    NotifId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    OrderId UNIQUEIDENTIFIER NOT NULL,
    Type VARCHAR(10) NOT NULL CHECK (Type IN ('SMS', 'Email')),
    Content NVARCHAR(MAX) NOT NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (Status IN ('Pending', 'Sent', 'Failed')),
    SentAt DATETIME2 NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Notifications_ServiceOrders FOREIGN KEY (OrderId) REFERENCES ServiceOrders(OrderId) ON DELETE CASCADE
);
GO

-- ============================================================================
-- 2. ĐÁNH INDEX TỐI ƯU TRUY VẤN (BA TIPS REQUIREMENT)
-- ============================================================================
CREATE INDEX IX_Parts_SerialIMEI ON Parts(SerialIMEI);
CREATE INDEX IX_ServiceOrders_TrackingCode ON ServiceOrders(TrackingCode);
CREATE INDEX IX_Customers_Phone ON Customers(Phone);
CREATE INDEX IX_ServiceOrders_CustomerId ON ServiceOrders(CustomerId);
CREATE INDEX IX_ServiceOrders_TechnicianId ON ServiceOrders(TechnicianId);
CREATE INDEX IX_ServiceOrders_Status ON ServiceOrders(Status);
GO

-- ============================================================================
-- 3. TRIGGER SINH TỰ ĐỘNG TRACKING CODE
-- ============================================================================
CREATE OR ALTER TRIGGER trg_GenerateTrackingCode_v2
ON ServiceOrders
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @OrderId UNIQUEIDENTIFIER, @CustomerId UNIQUEIDENTIFIER, @TechnicianId UNIQUEIDENTIFIER;
    DECLARE @IssueDescription NVARCHAR(MAX), @Status NVARCHAR(30);
    DECLARE @TrackingCode VARCHAR(50);
    DECLARE @DatePrefix VARCHAR(8) = CONVERT(VARCHAR(8), GETDATE(), 112);
    DECLARE @RandomSuffix INT;

    DECLARE cur CURSOR FOR 
    SELECT OrderId, CustomerId, TechnicianId, IssueDescription, Status FROM inserted;

    OPEN cur;
    FETCH NEXT FROM cur INTO @OrderId, @CustomerId, @TechnicianId, @IssueDescription, @Status;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        IF @OrderId IS NULL SET @OrderId = NEWID();

        WHILE 1 = 1
        BEGIN
            SET @RandomSuffix = FLOOR(RAND() * 8999 + 1000);
            SET @TrackingCode = 'TRK-' + @DatePrefix + '-' + CAST(@RandomSuffix AS VARCHAR(4));
            
            IF NOT EXISTS (SELECT 1 FROM ServiceOrders WHERE TrackingCode = @TrackingCode)
                BREAK;
        END

        INSERT INTO ServiceOrders (OrderId, TrackingCode, CustomerId, TechnicianId, IssueDescription, Status, IsDeleted, CreatedAt, UpdatedAt)
        VALUES (@OrderId, @TrackingCode, @CustomerId, @TechnicianId, @IssueDescription, ISNULL(@Status, 'Created'), 0, SYSDATETIME(), SYSDATETIME());

        FETCH NEXT FROM cur INTO @OrderId, @CustomerId, @TechnicianId, @IssueDescription, @Status;
    END

    CLOSE cur;
    DEALLOCATE cur;
END;
GO

-- ============================================================================
-- 4. STORED PROCEDURES THAO TÁC DỮ LIỆU (STORED PROCEDURES)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- SP 1: Tiếp nhận Đơn sửa chữa & Tải ảnh ban đầu (Bắt buộc >= 1 ảnh)
-- ----------------------------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_CreateServiceOrder
    @CustomerId UNIQUEIDENTIFIER,
    @IssueDescription NVARCHAR(MAX),
    @PhotoUrl NVARCHAR(500), -- Yêu cầu tối thiểu 1 ảnh ban đầu
    @OutTrackingCode VARCHAR(50) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    BEGIN TRY
        -- Kiểm tra sự tồn tại của Customer
        IF NOT EXISTS (SELECT 1 FROM Customers WHERE CustomerId = @CustomerId AND IsDeleted = 0)
            RAISEERROR(N'Khách hàng không tồn tại hoặc đã bị xóa.', 16, 1);

        DECLARE @OrderId UNIQUEIDENTIFIER = NEWID();

        -- 1. Tạo đơn sửa chữa (Trigger sẽ tự sinh TrackingCode)
        INSERT INTO ServiceOrders (OrderId, CustomerId, IssueDescription, Status)
        VALUES (@OrderId, @CustomerId, @IssueDescription, 'Created');

        SELECT @OutTrackingCode = TrackingCode FROM ServiceOrders WHERE OrderId = @OrderId;

        -- 2. Thêm ảnh thiết bị ban đầu (Đảm bảo ServiceOrders - DevicePhotos có ít nhất 1 ảnh)
        INSERT INTO DevicePhotos (OrderId, PhotoUrl)
        VALUES (@OrderId, @PhotoUrl);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- ----------------------------------------------------------------------------
-- SP 2: Xuất linh kiện cho Đơn hàng & Tự động đổi trạng thái Parts sang 'Used' (TRANSACTION)
-- ----------------------------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_AddOrderPart
    @OrderId UNIQUEIDENTIFIER,
    @PartId UNIQUEIDENTIFIER,
    @Quantity INT = 1
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    BEGIN TRY
        -- 1. Kiểm tra sự tồn tại & trạng thái linh kiện
        DECLARE @PartStatus NVARCHAR(20), @PartPrice DECIMAL(18, 2);
        SELECT @PartStatus = Status, @PartPrice = Price 
        FROM Parts WHERE PartId = @PartId AND IsDeleted = 0;

        IF @PartStatus IS NULL
            RAISEERROR(N'Linh kiện không tồn tại hoặc đã bị xóa.', 16, 1);

        IF @PartStatus <> 'New'
            RAISEERROR(N'Linh kiện này không ở trạng thái "New" để xuất kho.', 16, 1);

        -- 2. Thêm vào bảng liên kết OrderParts
        INSERT INTO OrderParts (OrderId, PartId, Quantity)
        VALUES (@OrderId, @PartId, @Quantity);

        -- 3. Đổi trạng thái Linh kiện từ 'New' sang 'Used' (Business Rule bắt buộc trong cùng Transaction)
        UPDATE Parts
        SET Status = 'Used',
            UpdatedAt = SYSDATETIME()
        WHERE PartId = @PartId;

        -- 4. Tự động cập nhật lại tổng tiền linh kiện trong bảng Quotes (nếu Quote đã được tạo)
        IF EXISTS (SELECT 1 FROM Quotes WHERE OrderId = @OrderId)
        BEGIN
            UPDATE Quotes
            SET TotalPartsCost = TotalPartsCost + (@PartPrice * @Quantity),
                UpdatedAt = SYSDATETIME()
            WHERE OrderId = @OrderId;
        END

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- ----------------------------------------------------------------------------
-- SP 3: Lập Báo giá cho Đơn sửa chữa (Quan hệ 1:1)
-- ----------------------------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_CreateOrUpdateQuote
    @OrderId UNIQUEIDENTIFIER,
    @TotalLaborCost DECIMAL(18, 2)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM ServiceOrders WHERE OrderId = @OrderId AND IsDeleted = 0)
            RAISEERROR(N'Đơn sửa chữa không tồn tại.', 16, 1);

        -- Tính tổng giá linh kiện từ danh sách OrderParts
        DECLARE @CalculatedPartsCost DECIMAL(18, 2) = 0.00;

        SELECT @CalculatedPartsCost = ISNULL(SUM(P.Price * OP.Quantity), 0.00)
        FROM OrderParts OP
        INNER JOIN Parts P ON OP.PartId = P.PartId
        WHERE OP.OrderId = @OrderId;

        -- Upsert Báo giá (Quan hệ 1:1 với ServiceOrders)
        IF EXISTS (SELECT 1 FROM Quotes WHERE OrderId = @OrderId)
        BEGIN
            UPDATE Quotes
            SET TotalLaborCost = @TotalLaborCost,
                TotalPartsCost = @CalculatedPartsCost,
                Status = 'Pending',
                UpdatedAt = SYSDATETIME()
            WHERE OrderId = @OrderId;
        END
        ELSE
        BEGIN
            INSERT INTO Quotes (OrderId, TotalLaborCost, TotalPartsCost, Status)
            VALUES (@OrderId, @TotalLaborCost, @CalculatedPartsCost, 'Pending');
        END

        -- Cập nhật trạng thái đơn hàng sang 'Quoted'
        UPDATE ServiceOrders 
        SET Status = 'Quoted', UpdatedAt = SYSDATETIME() 
        WHERE OrderId = @OrderId;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- ----------------------------------------------------------------------------
-- SP 4: Soft Delete (Xóa mềm) Linh kiện hoặc Đơn hàng
-- ----------------------------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_SoftDeleteEntity
    @EntityType VARCHAR(20), -- 'Part' hoặc 'Order' hoặc 'Customer'
    @EntityId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    IF @EntityType = 'Part'
    BEGIN
        UPDATE Parts SET IsDeleted = 1, UpdatedAt = SYSDATETIME() WHERE PartId = @EntityId;
    END
    ELSE IF @EntityType = 'Order'
    BEGIN
        UPDATE ServiceOrders SET IsDeleted = 1, UpdatedAt = SYSDATETIME() WHERE OrderId = @EntityId;
    END
    ELSE IF @EntityType = 'Customer'
    BEGIN
        UPDATE Customers SET IsDeleted = 1, UpdatedAt = SYSDATETIME() WHERE CustomerId = @EntityId;
    END
    ELSE
    BEGIN
        RAISEERROR(N'EntityType không hợp lệ.', 16, 1);
    END
END;
GO

-- ----------------------------------------------------------------------------
-- SP 5: Báo cáo Thống kê Doanh thu (Tính từ Quotes và ServiceOrders đã hoàn tất)
-- ----------------------------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_GetRevenueReport
    @FromDate DATETIME2,
    @ToDate DATETIME2
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        COUNT(SO.OrderId) AS TotalCompletedOrders,
        SUM(Q.TotalLaborCost) AS TotalLaborRevenue,
        SUM(Q.TotalPartsCost) AS TotalPartsRevenue,
        SUM(Q.TotalLaborCost + Q.TotalPartsCost) AS TotalGrossRevenue
    FROM ServiceOrders SO
    INNER JOIN Quotes Q ON SO.OrderId = Q.OrderId
    WHERE SO.Status = 'Completed'
      AND Q.Status = 'Approved'
      AND SO.IsDeleted = 0
      AND SO.UpdatedAt BETWEEN @FromDate AND @ToDate;
END;
GO
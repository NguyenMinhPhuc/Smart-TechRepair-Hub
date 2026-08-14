-- ============================================================================
-- Smart TechRepair Hub — Database v2 (Updated)
-- Thêm: Bảng Devices, AuditLog, cập nhật SPs
-- TrackingCode format: TRK-YYYYMMDD-XXXX (giữ nguyên theo trigger)
-- ============================================================================

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'SmartTechRepairDB_v2')
BEGIN
    CREATE DATABASE SmartTechRepairDB_v2;
END
GO

USE SmartTechRepairDB_v2;
GO

-- ============================================================================
-- DROP (theo thứ tự phụ thuộc FK)
-- ============================================================================
IF OBJECT_ID('Notifications', 'U') IS NOT NULL DROP TABLE Notifications;
IF OBJECT_ID('OrderParts', 'U') IS NOT NULL DROP TABLE OrderParts;
IF OBJECT_ID('Quotes', 'U') IS NOT NULL DROP TABLE Quotes;
IF OBJECT_ID('DevicePhotos', 'U') IS NOT NULL DROP TABLE DevicePhotos;
IF OBJECT_ID('ServiceOrders', 'U') IS NOT NULL DROP TABLE ServiceOrders;
IF OBJECT_ID('Devices', 'U') IS NOT NULL DROP TABLE Devices;
IF OBJECT_ID('Parts', 'U') IS NOT NULL DROP TABLE Parts;
IF OBJECT_ID('Categories', 'U') IS NOT NULL DROP TABLE Categories;
IF OBJECT_ID('Customers', 'U') IS NOT NULL DROP TABLE Customers;
IF OBJECT_ID('Users', 'U') IS NOT NULL DROP TABLE Users;
GO

-- ============================================================================
-- 1. CORE TABLES
-- ============================================================================

-- 1.1 Users (Nội bộ: Admin, Technician)
CREATE TABLE Users (
    UserId      UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Username    NVARCHAR(50)  NOT NULL UNIQUE,
    Email       NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role        NVARCHAR(20)  NOT NULL CHECK (Role IN ('Admin', 'Technician')),
    IsDeleted   BIT           NOT NULL DEFAULT 0,
    CreatedAt   DATETIME2     DEFAULT SYSDATETIME(),
    UpdatedAt   DATETIME2     DEFAULT SYSDATETIME()
);

-- 1.2 Customers (Khách hàng — không có tài khoản hệ thống)
CREATE TABLE Customers (
    CustomerId  UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    FullName    NVARCHAR(100) NOT NULL,
    Phone       VARCHAR(10)   NOT NULL UNIQUE
        CHECK (Phone LIKE '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
    Email       NVARCHAR(100) NULL,
    IsDeleted   BIT           NOT NULL DEFAULT 0,
    CreatedAt   DATETIME2     DEFAULT SYSDATETIME(),
    UpdatedAt   DATETIME2     DEFAULT SYSDATETIME()
);

-- 1.3 Categories (Danh mục linh kiện)
CREATE TABLE Categories (
    CategoryId  UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name        NVARCHAR(100) NOT NULL UNIQUE,
    Description NVARCHAR(500) NULL,
    IsDeleted   BIT           NOT NULL DEFAULT 0,
    CreatedAt   DATETIME2     DEFAULT SYSDATETIME()
);

-- 1.4 Parts (Linh kiện kho — theo Serial/IMEI)
CREATE TABLE Parts (
    PartId      UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    CategoryId  UNIQUEIDENTIFIER NOT NULL,
    Name        NVARCHAR(150) NOT NULL,
    SerialIMEI  VARCHAR(100)  NOT NULL UNIQUE,
    Status      NVARCHAR(20)  NOT NULL DEFAULT 'New'
        CHECK (Status IN ('New', 'Used', 'Damaged')),
    Price       DECIMAL(18,2) NOT NULL CHECK (Price >= 0),
    IsDeleted   BIT           NOT NULL DEFAULT 0,
    CreatedAt   DATETIME2     DEFAULT SYSDATETIME(),
    UpdatedAt   DATETIME2     DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Parts_Categories FOREIGN KEY (CategoryId) REFERENCES Categories(CategoryId)
);

-- 1.5 Devices (Thiết bị của khách hàng — THÊM MỚI)
CREATE TABLE Devices (
    DeviceId    UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    CustomerId  UNIQUEIDENTIFIER NOT NULL,
    DeviceType  NVARCHAR(50)  NOT NULL,  -- 'Phone', 'Laptop', 'Tablet', etc.
    Brand       NVARCHAR(100) NOT NULL,
    Model       NVARCHAR(150) NOT NULL,
    SerialIMEI  VARCHAR(100)  NULL,      -- Optional: có thể trùng khi KH mang lại
    Notes       NVARCHAR(MAX) NULL,
    CreatedAt   DATETIME2     DEFAULT SYSDATETIME(),
    UpdatedAt   DATETIME2     DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Devices_Customers FOREIGN KEY (CustomerId) REFERENCES Customers(CustomerId)
);

-- 1.6 ServiceOrders (Đơn sửa chữa — tham chiếu Device)
CREATE TABLE ServiceOrders (
    OrderId          UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    TrackingCode     VARCHAR(50)   NOT NULL UNIQUE,
    CustomerId       UNIQUEIDENTIFIER NOT NULL,
    DeviceId         UNIQUEIDENTIFIER NULL,      -- FK → Devices (THÊM MỚI)
    TechnicianId     UNIQUEIDENTIFIER NULL,
    IssueDescription NVARCHAR(MAX) NOT NULL,
    Status           NVARCHAR(30)  NOT NULL DEFAULT 'Created'
        CHECK (Status IN ('Created','Inspecting','Quoted','Approved','Rejected','Repairing','Completed','Cancelled')),
    IsDeleted        BIT           NOT NULL DEFAULT 0,
    CreatedAt        DATETIME2     DEFAULT SYSDATETIME(),
    UpdatedAt        DATETIME2     DEFAULT SYSDATETIME(),
    CONSTRAINT FK_ServiceOrders_Customers  FOREIGN KEY (CustomerId)   REFERENCES Customers(CustomerId),
    CONSTRAINT FK_ServiceOrders_Devices    FOREIGN KEY (DeviceId)     REFERENCES Devices(DeviceId),
    CONSTRAINT FK_ServiceOrders_Users      FOREIGN KEY (TechnicianId) REFERENCES Users(UserId)
);

-- 1.7 DevicePhotos
CREATE TABLE DevicePhotos (
    PhotoId    UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    OrderId    UNIQUEIDENTIFIER NOT NULL,
    PhotoUrl   NVARCHAR(500) NOT NULL,
    PhotoType  NVARCHAR(20)  NOT NULL DEFAULT 'Before' CHECK (PhotoType IN ('Before', 'After')),
    UploadedAt DATETIME2     DEFAULT SYSDATETIME(),
    CONSTRAINT FK_DevicePhotos_ServiceOrders FOREIGN KEY (OrderId) REFERENCES ServiceOrders(OrderId) ON DELETE CASCADE
);

-- 1.8 Quotes (1:1 với ServiceOrders)
CREATE TABLE Quotes (
    QuoteId        UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    OrderId        UNIQUEIDENTIFIER NOT NULL UNIQUE,
    TotalLaborCost DECIMAL(18,2)    NOT NULL DEFAULT 0.00 CHECK (TotalLaborCost >= 0),
    TotalPartsCost DECIMAL(18,2)    NOT NULL DEFAULT 0.00 CHECK (TotalPartsCost >= 0),
    Status         NVARCHAR(20)     NOT NULL DEFAULT 'Pending'
        CHECK (Status IN ('Pending', 'Approved', 'Rejected')),
    Notes          NVARCHAR(MAX)    NULL,
    CreatedAt      DATETIME2        DEFAULT SYSDATETIME(),
    UpdatedAt      DATETIME2        DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Quotes_ServiceOrders FOREIGN KEY (OrderId) REFERENCES ServiceOrders(OrderId) ON DELETE CASCADE
);

-- 1.9 OrderParts (N:N — ServiceOrders × Parts)
CREATE TABLE OrderParts (
    Id        UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    OrderId   UNIQUEIDENTIFIER NOT NULL,
    PartId    UNIQUEIDENTIFIER NOT NULL,
    Quantity  INT              NOT NULL DEFAULT 1 CHECK (Quantity > 0),
    CreatedAt DATETIME2        DEFAULT SYSDATETIME(),
    CONSTRAINT FK_OrderParts_ServiceOrders FOREIGN KEY (OrderId) REFERENCES ServiceOrders(OrderId) ON DELETE CASCADE,
    CONSTRAINT FK_OrderParts_Parts         FOREIGN KEY (PartId)  REFERENCES Parts(PartId)
);

-- 1.11 SystemSettings (Cấu hình hệ thống & Cửa hàng)
CREATE TABLE SystemSettings (
    SettingKey   VARCHAR(50) PRIMARY KEY,
    SettingValue NVARCHAR(MAX) NOT NULL,
    UpdatedAt    DATETIME2 DEFAULT SYSDATETIME()
);
GO

-- Seed default settings
IF NOT EXISTS (SELECT 1 FROM SystemSettings)
BEGIN
    INSERT INTO SystemSettings (SettingKey, SettingValue) VALUES
    ('STORE_NAME',          N'Smart TechRepair Hub'),
    ('STORE_ADDRESS',       N'123 Nguyễn Văn Cừ, Q.5, TP.HCM'),
    ('STORE_PHONE',         N'1900-1234'),
    ('STORE_EMAIL',         N'hotline@smartrepair.vn'),
    ('STORE_LOGO',          N'/images/logo.png'),
    ('TAX_CODE',            N'0312345678'),
    ('RECEIPT_FOOTER_NOTE', N'Cảm ơn quý khách đã tin tưởng dịch vụ của chúng tôi!');
END;
GO

-- ============================================================================
-- 2. INDEXES
-- ============================================================================
CREATE INDEX IX_Parts_SerialIMEI          ON Parts(SerialIMEI);
CREATE INDEX IX_ServiceOrders_TrackingCode ON ServiceOrders(TrackingCode);
CREATE INDEX IX_Customers_Phone           ON Customers(Phone);
CREATE INDEX IX_ServiceOrders_CustomerId  ON ServiceOrders(CustomerId);
CREATE INDEX IX_ServiceOrders_TechnicianId ON ServiceOrders(TechnicianId);
CREATE INDEX IX_ServiceOrders_Status      ON ServiceOrders(Status);
CREATE INDEX IX_Devices_CustomerId        ON Devices(CustomerId);
CREATE INDEX IX_Devices_SerialIMEI        ON Devices(SerialIMEI);
CREATE INDEX IX_Notifications_Status      ON Notifications(Status);
GO

-- ============================================================================
-- 3. TRIGGER — Sinh TrackingCode (TRK-YYYYMMDD-XXXX)
-- ============================================================================
CREATE OR ALTER TRIGGER trg_GenerateTrackingCode_v2
ON ServiceOrders
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @OrderId UNIQUEIDENTIFIER, @CustomerId UNIQUEIDENTIFIER,
            @DeviceId UNIQUEIDENTIFIER, @TechnicianId UNIQUEIDENTIFIER;
    DECLARE @IssueDescription NVARCHAR(MAX), @Status NVARCHAR(30);
    DECLARE @TrackingCode VARCHAR(50);
    DECLARE @DatePrefix VARCHAR(8) = CONVERT(VARCHAR(8), GETDATE(), 112);
    DECLARE @RandomSuffix INT;

    DECLARE cur CURSOR FOR
        SELECT OrderId, CustomerId, DeviceId, TechnicianId, IssueDescription, Status
        FROM inserted;

    OPEN cur;
    FETCH NEXT FROM cur INTO @OrderId, @CustomerId, @DeviceId, @TechnicianId, @IssueDescription, @Status;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        IF @OrderId IS NULL SET @OrderId = NEWID();

        -- Đảm bảo TrackingCode unique
        WHILE 1 = 1
        BEGIN
            SET @RandomSuffix = FLOOR(RAND() * 8999 + 1000);
            SET @TrackingCode = 'TRK-' + @DatePrefix + '-' + CAST(@RandomSuffix AS VARCHAR(4));
            IF NOT EXISTS (SELECT 1 FROM ServiceOrders WHERE TrackingCode = @TrackingCode)
                BREAK;
        END

        INSERT INTO ServiceOrders
            (OrderId, TrackingCode, CustomerId, DeviceId, TechnicianId, IssueDescription, Status, IsDeleted, CreatedAt, UpdatedAt)
        VALUES
            (@OrderId, @TrackingCode, @CustomerId, @DeviceId, @TechnicianId,
             @IssueDescription, ISNULL(@Status, 'Created'), 0, SYSDATETIME(), SYSDATETIME());

        FETCH NEXT FROM cur INTO @OrderId, @CustomerId, @DeviceId, @TechnicianId, @IssueDescription, @Status;
    END

    CLOSE cur;
    DEALLOCATE cur;
END;
GO

-- ============================================================================
-- 4. STORED PROCEDURES
-- ============================================================================

-- SP 1: Tìm hoặc tạo Customer theo Phone
CREATE OR ALTER PROCEDURE sp_FindOrCreateCustomer
    @Phone        VARCHAR(10),
    @FullName     NVARCHAR(100)  = NULL,
    @Email        NVARCHAR(100)  = NULL,
    @CustomerId   UNIQUEIDENTIFIER OUTPUT,
    @IsNew        BIT            OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    BEGIN TRY
        SELECT @CustomerId = CustomerId FROM Customers WHERE Phone = @Phone AND IsDeleted = 0;

        IF @CustomerId IS NULL
        BEGIN
            IF @FullName IS NULL
                RAISERROR(N'FullName bắt buộc khi tạo khách hàng mới.', 16, 1);

            SET @CustomerId = NEWID();
            INSERT INTO Customers (CustomerId, FullName, Phone, Email)
            VALUES (@CustomerId, @FullName, @Phone, @Email);
            SET @IsNew = 1;
        END
        ELSE
            SET @IsNew = 0;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- SP 2: Tạo Device cho Customer
CREATE OR ALTER PROCEDURE sp_CreateDevice
    @CustomerId  UNIQUEIDENTIFIER,
    @DeviceType  NVARCHAR(50),
    @Brand       NVARCHAR(100),
    @Model       NVARCHAR(150),
    @SerialIMEI  VARCHAR(100) = NULL,
    @Notes       NVARCHAR(MAX) = NULL,
    @DeviceId    UNIQUEIDENTIFIER OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Customers WHERE CustomerId = @CustomerId AND IsDeleted = 0)
            RAISERROR(N'Khách hàng không tồn tại.', 16, 1);

        SET @DeviceId = NEWID();
        INSERT INTO Devices (DeviceId, CustomerId, DeviceType, Brand, Model, SerialIMEI, Notes)
        VALUES (@DeviceId, @CustomerId, @DeviceType, @Brand, @Model, @SerialIMEI, @Notes);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- SP 3: Tạo ServiceOrder (bắt buộc ≥1 ảnh)
CREATE OR ALTER PROCEDURE sp_CreateServiceOrder
    @CustomerId       UNIQUEIDENTIFIER,
    @DeviceId         UNIQUEIDENTIFIER = NULL,
    @IssueDescription NVARCHAR(MAX),
    @PhotoUrl         NVARCHAR(500),
    @OutTrackingCode  VARCHAR(50) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Customers WHERE CustomerId = @CustomerId AND IsDeleted = 0)
            RAISERROR(N'Khách hàng không tồn tại hoặc đã bị xóa.', 16, 1);

        IF @DeviceId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Devices WHERE DeviceId = @DeviceId)
            RAISERROR(N'Thiết bị không tồn tại.', 16, 1);

        DECLARE @OrderId UNIQUEIDENTIFIER = NEWID();

        -- Trigger sẽ tự sinh TrackingCode
        INSERT INTO ServiceOrders (OrderId, CustomerId, DeviceId, IssueDescription, Status)
        VALUES (@OrderId, @CustomerId, @DeviceId, @IssueDescription, 'Created');

        SELECT @OutTrackingCode = TrackingCode FROM ServiceOrders WHERE OrderId = @OrderId;

        -- Ảnh bắt buộc ≥1
        INSERT INTO DevicePhotos (OrderId, PhotoUrl, PhotoType)
        VALUES (@OrderId, @PhotoUrl, 'Before');

        -- Tạo notification cho khách hàng
        INSERT INTO Notifications (OrderId, Type, Content)
        SELECT @OrderId, 'SMS',
               N'Đơn sửa chữa ' + @OutTrackingCode + N' đã được tạo. Tra cứu tại: /tracking/' + @OutTrackingCode
        WHERE EXISTS (SELECT 1 FROM Customers WHERE CustomerId = @CustomerId AND Phone IS NOT NULL);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- SP 4: Cập nhật trạng thái ServiceOrder (State Machine)
CREATE OR ALTER PROCEDURE sp_UpdateOrderStatus
    @OrderId    UNIQUEIDENTIFIER,
    @NewStatus  NVARCHAR(30),
    @UserId     UNIQUEIDENTIFIER,
    @Note       NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    BEGIN TRY
        DECLARE @CurrentStatus NVARCHAR(30);
        SELECT @CurrentStatus = Status FROM ServiceOrders WHERE OrderId = @OrderId AND IsDeleted = 0;

        IF @CurrentStatus IS NULL
            RAISERROR(N'Đơn hàng không tồn tại.', 16, 1);

        -- State Machine Validation
        DECLARE @IsValid BIT = 0;
        IF @CurrentStatus = 'Created'    AND @NewStatus = 'Inspecting'  SET @IsValid = 1;
        IF @CurrentStatus = 'Inspecting' AND @NewStatus = 'Quoted'      SET @IsValid = 1;
        IF @CurrentStatus = 'Quoted'     AND @NewStatus = 'Approved'    SET @IsValid = 1;
        IF @CurrentStatus = 'Quoted'     AND @NewStatus = 'Rejected'    SET @IsValid = 1;
        IF @CurrentStatus = 'Approved'   AND @NewStatus = 'Repairing'   SET @IsValid = 1;
        IF @CurrentStatus = 'Repairing'  AND @NewStatus = 'Completed'   SET @IsValid = 1;
        IF @CurrentStatus IN ('Created','Inspecting','Quoted') AND @NewStatus = 'Cancelled' SET @IsValid = 1;

        IF @IsValid = 0
            RAISERROR(N'Chuyển trạng thái không hợp lệ: %s → %s', 16, 1, @CurrentStatus, @NewStatus);

        UPDATE ServiceOrders
        SET Status = @NewStatus, UpdatedAt = SYSDATETIME()
        WHERE OrderId = @OrderId;

        -- Gửi notification nếu Approved/Rejected
        IF @NewStatus IN ('Approved', 'Rejected', 'Completed')
        BEGIN
            DECLARE @TrackingCode VARCHAR(50);
            DECLARE @CustomerId UNIQUEIDENTIFIER;
            SELECT @TrackingCode = TrackingCode, @CustomerId = CustomerId
            FROM ServiceOrders WHERE OrderId = @OrderId;

            DECLARE @Msg NVARCHAR(MAX) = 
                CASE @NewStatus
                    WHEN 'Approved'  THEN N'Báo giá đơn ' + @TrackingCode + N' đã được chấp nhận. Chúng tôi sẽ tiến hành sửa chữa.'
                    WHEN 'Rejected'  THEN N'Báo giá đơn ' + @TrackingCode + N' đã bị từ chối. Vui lòng liên hệ cửa hàng.'
                    WHEN 'Completed' THEN N'Thiết bị đơn ' + @TrackingCode + N' đã sửa xong. Mời bạn đến nhận.'
                END;

            INSERT INTO Notifications (OrderId, Type, Content)
            VALUES (@OrderId, 'SMS', @Msg);
        END

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- SP 5: Thêm linh kiện vào đơn (Hỗ trợ PartId/Serial/Tên & Tự tạo Quote nếu chưa có)
CREATE OR ALTER PROCEDURE sp_AddOrderPart
    @OrderId        UNIQUEIDENTIFIER,
    @PartIdOrSerial NVARCHAR(100),
    @Quantity       INT = 1
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    BEGIN TRY
        DECLARE @PartId UNIQUEIDENTIFIER, @PartStatus NVARCHAR(20), @PartPrice DECIMAL(18,2);

        IF ISGUID(@PartIdOrSerial) = 1
            SELECT @PartId = PartId, @PartStatus = Status, @PartPrice = Price
            FROM Parts WHERE PartId = CAST(@PartIdOrSerial AS UNIQUEIDENTIFIER) AND IsDeleted = 0;
        ELSE
            SELECT TOP 1 @PartId = PartId, @PartStatus = Status, @PartPrice = Price
            FROM Parts WHERE (SerialIMEI = @PartIdOrSerial OR Name = @PartIdOrSerial) AND IsDeleted = 0;

        IF @PartId IS NULL
            RAISERROR(N'Không tìm thấy linh kiện phù hợp trong kho.', 16, 1);

        IF @PartStatus <> 'New'
            RAISERROR(N'Linh kiện không ở trạng thái sẵn có "New" trong kho.', 16, 1);

        IF NOT EXISTS (SELECT 1 FROM ServiceOrders WHERE OrderId = @OrderId AND IsDeleted = 0)
            RAISERROR(N'Đơn sửa chữa không tồn tại.', 16, 1);

        IF NOT EXISTS (SELECT 1 FROM Quotes WHERE OrderId = @OrderId)
        BEGIN
            INSERT INTO Quotes (OrderId, TotalLaborCost, TotalPartsCost, Status)
            VALUES (@OrderId, 0.00, 0.00, 'Pending');

            UPDATE ServiceOrders SET Status = 'Quoted', UpdatedAt = SYSDATETIME() WHERE OrderId = @OrderId;
        END

        INSERT INTO OrderParts (OrderId, PartId, Quantity)
        VALUES (@OrderId, @PartId, @Quantity);

        UPDATE Parts SET Status = 'Used', UpdatedAt = SYSDATETIME() WHERE PartId = @PartId;

        UPDATE Quotes
        SET TotalPartsCost = (
            SELECT ISNULL(SUM(P.Price * OP.Quantity), 0.00)
            FROM OrderParts OP INNER JOIN Parts P ON OP.PartId = P.PartId
            WHERE OP.OrderId = @OrderId
        ), UpdatedAt = SYSDATETIME()
        WHERE OrderId = @OrderId;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- SP 6: Tạo/Cập nhật Báo giá
CREATE OR ALTER PROCEDURE sp_CreateOrUpdateQuote
    @OrderId       UNIQUEIDENTIFIER,
    @TotalLaborCost DECIMAL(18,2),
    @Notes         NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM ServiceOrders WHERE OrderId = @OrderId AND IsDeleted = 0)
            RAISERROR(N'Đơn sửa chữa không tồn tại.', 16, 1);

        DECLARE @CalculatedPartsCost DECIMAL(18,2) = 0.00;
        SELECT @CalculatedPartsCost = ISNULL(SUM(P.Price * OP.Quantity), 0.00)
        FROM OrderParts OP
        INNER JOIN Parts P ON OP.PartId = P.PartId
        WHERE OP.OrderId = @OrderId;

        IF EXISTS (SELECT 1 FROM Quotes WHERE OrderId = @OrderId)
        BEGIN
            UPDATE Quotes
            SET TotalLaborCost = @TotalLaborCost,
                TotalPartsCost = @CalculatedPartsCost,
                Status = 'Pending',
                Notes = @Notes,
                UpdatedAt = SYSDATETIME()
            WHERE OrderId = @OrderId;
        END
        ELSE
        BEGIN
            INSERT INTO Quotes (OrderId, TotalLaborCost, TotalPartsCost, Status, Notes)
            VALUES (@OrderId, @TotalLaborCost, @CalculatedPartsCost, 'Pending', @Notes);
        END

        UPDATE ServiceOrders SET Status = 'Quoted', UpdatedAt = SYSDATETIME() WHERE OrderId = @OrderId;

        -- Notification cho khách hàng
        DECLARE @TrackingCode VARCHAR(50);
        SELECT @TrackingCode = TrackingCode FROM ServiceOrders WHERE OrderId = @OrderId;

        INSERT INTO Notifications (OrderId, Type, Content)
        VALUES (@OrderId, 'SMS',
            N'Đơn ' + @TrackingCode + N' đã có báo giá. Xem và xác nhận tại: /tracking/' + @TrackingCode);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- SP 7: Approve/Reject Quote (Customer action)
CREATE OR ALTER PROCEDURE sp_ApproveOrRejectQuote
    @TrackingCode VARCHAR(50),
    @Phone        VARCHAR(10),
    @Action       NVARCHAR(10)  -- 'Approve' hoặc 'Reject'
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Validate: Phone phải khớp với đơn
        DECLARE @OrderId UNIQUEIDENTIFIER, @CurrentStatus NVARCHAR(30);
        SELECT @OrderId = SO.OrderId, @CurrentStatus = SO.Status
        FROM ServiceOrders SO
        INNER JOIN Customers C ON SO.CustomerId = C.CustomerId
        WHERE SO.TrackingCode = @TrackingCode AND C.Phone = @Phone AND SO.IsDeleted = 0;

        IF @OrderId IS NULL
            RAISERROR(N'Thông tin không khớp hoặc đơn hàng không tồn tại.', 16, 1);

        IF @CurrentStatus <> 'Quoted'
            RAISERROR(N'Chỉ có thể duyệt/từ chối khi đơn ở trạng thái Quoted.', 16, 1);

        IF @Action NOT IN ('Approve', 'Reject')
            RAISERROR(N'Action không hợp lệ. Chỉ chấp nhận "Approve" hoặc "Reject".', 16, 1);

        DECLARE @NewOrderStatus NVARCHAR(30) = CASE @Action WHEN 'Approve' THEN 'Approved' ELSE 'Rejected' END;
        DECLARE @NewQuoteStatus NVARCHAR(20) = CASE @Action WHEN 'Approve' THEN 'Approved' ELSE 'Rejected' END;

        UPDATE ServiceOrders SET Status = @NewOrderStatus, UpdatedAt = SYSDATETIME() WHERE OrderId = @OrderId;
        UPDATE Quotes SET Status = @NewQuoteStatus, UpdatedAt = SYSDATETIME() WHERE OrderId = @OrderId;

        -- Nếu Reject: release parts (trả lại trạng thái New)
        IF @Action = 'Reject'
        BEGIN
            UPDATE P
            SET P.Status = 'New', P.UpdatedAt = SYSDATETIME()
            FROM Parts P
            INNER JOIN OrderParts OP ON P.PartId = OP.PartId
            WHERE OP.OrderId = @OrderId;
        END

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- SP 8: Soft Delete
CREATE OR ALTER PROCEDURE sp_SoftDeleteEntity
    @EntityType VARCHAR(20),  -- 'Part', 'Order', 'Customer', 'Category', 'User'
    @EntityId   UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    IF @EntityType = 'Part'
        UPDATE Parts SET IsDeleted = 1, UpdatedAt = SYSDATETIME() WHERE PartId = @EntityId;
    ELSE IF @EntityType = 'Order'
        UPDATE ServiceOrders SET IsDeleted = 1, UpdatedAt = SYSDATETIME() WHERE OrderId = @EntityId;
    ELSE IF @EntityType = 'Customer'
        UPDATE Customers SET IsDeleted = 1, UpdatedAt = SYSDATETIME() WHERE CustomerId = @EntityId;
    ELSE IF @EntityType = 'Category'
        UPDATE Categories SET IsDeleted = 1 WHERE CategoryId = @EntityId;
    ELSE IF @EntityType = 'User'
        UPDATE Users SET IsDeleted = 1, UpdatedAt = SYSDATETIME() WHERE UserId = @EntityId;
    ELSE
        RAISERROR(N'EntityType không hợp lệ.', 16, 1);
END;
GO

-- SP 11: Tạo User mới
CREATE OR ALTER PROCEDURE sp_CreateUser
    @Username     NVARCHAR(50),
    @Email        NVARCHAR(100),
    @PasswordHash NVARCHAR(255),
    @Role         NVARCHAR(20),
    @OutUserId    UNIQUEIDENTIFIER OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    BEGIN TRY
        IF EXISTS (SELECT 1 FROM Users WHERE Username = @Username AND IsDeleted = 0)
            RAISERROR(N'Tên đăng nhập đã tồn tại.', 16, 1);

        IF EXISTS (SELECT 1 FROM Users WHERE Email = @Email AND IsDeleted = 0)
            RAISERROR(N'Email đã được sử dụng.', 16, 1);

        SET @OutUserId = NEWID();
        INSERT INTO Users (UserId, Username, Email, PasswordHash, Role)
        VALUES (@OutUserId, @Username, @Email, @PasswordHash, @Role);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- SP 12: Cập nhật User
CREATE OR ALTER PROCEDURE sp_UpdateUser
    @UserId       UNIQUEIDENTIFIER,
    @Username     NVARCHAR(50),
    @Email        NVARCHAR(100),
    @Role         NVARCHAR(20),
    @PasswordHash NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Users WHERE UserId = @UserId AND IsDeleted = 0)
            RAISERROR(N'Người dùng không tồn tại.', 16, 1);

        IF EXISTS (SELECT 1 FROM Users WHERE Username = @Username AND UserId <> @UserId AND IsDeleted = 0)
            RAISERROR(N'Tên đăng nhập đã trùng với người dùng khác.', 16, 1);

        IF EXISTS (SELECT 1 FROM Users WHERE Email = @Email AND UserId <> @UserId AND IsDeleted = 0)
            RAISERROR(N'Email đã trùng với người dùng khác.', 16, 1);

        IF @PasswordHash IS NOT NULL AND @PasswordHash <> ''
        BEGIN
            UPDATE Users
            SET Username = @Username, Email = @Email, Role = @Role, PasswordHash = @PasswordHash, UpdatedAt = SYSDATETIME()
            WHERE UserId = @UserId;
        END
        ELSE
        BEGIN
            UPDATE Users
            SET Username = @Username, Email = @Email, Role = @Role, UpdatedAt = SYSDATETIME()
            WHERE UserId = @UserId;
        END

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- SP 9: Revenue Report
CREATE OR ALTER PROCEDURE sp_GetRevenueReport
    @FromDate DATETIME2,
    @ToDate   DATETIME2
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        COUNT(SO.OrderId)                           AS TotalCompletedOrders,
        SUM(Q.TotalLaborCost)                       AS TotalLaborRevenue,
        SUM(Q.TotalPartsCost)                       AS TotalPartsRevenue,
        SUM(Q.TotalLaborCost + Q.TotalPartsCost)    AS TotalGrossRevenue
    FROM ServiceOrders SO
    INNER JOIN Quotes Q ON SO.OrderId = Q.OrderId
    WHERE SO.Status = 'Completed'
      AND Q.Status  = 'Approved'
      AND SO.IsDeleted = 0
      AND SO.UpdatedAt BETWEEN @FromDate AND @ToDate;
END;
GO

-- SP 10: Technician Productivity Report
CREATE OR ALTER PROCEDURE sp_GetTechnicianProductivity
    @FromDate     DATETIME2,
    @ToDate       DATETIME2,
    @TechnicianId UNIQUEIDENTIFIER = NULL  -- NULL = tất cả KTV
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        U.UserId            AS TechnicianId,
        U.Username          AS TechnicianName,
        U.Email,
        COUNT(SO.OrderId)   AS TotalCompletedOrders,
        AVG(DATEDIFF(HOUR, SO.CreatedAt, SO.UpdatedAt)) AS AvgProcessingHours
    FROM Users U
    LEFT JOIN ServiceOrders SO
        ON SO.TechnicianId = U.UserId
        AND SO.Status = 'Completed'
        AND SO.IsDeleted = 0
        AND SO.UpdatedAt BETWEEN @FromDate AND @ToDate
    WHERE U.Role = 'Technician'
      AND U.IsDeleted = 0
      AND (@TechnicianId IS NULL OR U.UserId = @TechnicianId)
    GROUP BY U.UserId, U.Username, U.Email;
END;
GO

-- ============================================================================
-- 5. SEED DATA
-- ============================================================================

-- 5.1 Admin user (password: Admin@123456 — đổi sau khi deploy)
INSERT INTO Users (UserId, Username, Email, PasswordHash, Role)
VALUES
    (NEWID(), 'admin',       'admin@smartrepair.vn',
    '$2b$10$wSd5zWOQokwQMEdLi0hKu.TO/Kj19DZscrve5kzQE8uYIOatOLeQC', 'Admin'),
    (NEWID(), 'technician1', 'ktv1@smartrepair.vn',
    '$2b$10$wSd5zWOQokwQMEdLi0hKu.TO/Kj19DZscrve5kzQE8uYIOatOLeQC', 'Technician');

-- 5.2 Categories
INSERT INTO Categories (CategoryId, Name, Description)
VALUES
    (NEWID(), N'Màn hình',   N'Màn hình điện thoại, laptop các loại'),
    (NEWID(), N'Pin',        N'Pin điện thoại, laptop'),
    (NEWID(), N'RAM',        N'RAM laptop và máy tính bàn'),
    (NEWID(), N'SSD/HDD',    N'Ổ cứng SSD/HDD các loại'),
    (NEWID(), N'Camera',     N'Module camera trước và sau'),
    (NEWID(), N'Bo mạch',    N'Mainboard, IC nguồn, IC sạc'),
    (NEWID(), N'Vỏ/Khung',   N'Vỏ ngoài, khung máy, nút bấm');
GO

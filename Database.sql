-- ============================================================================
-- 1. TẠO CSDL VÀ CÁC BẢNG (DATABASE & TABLES)
-- ============================================================================
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'SmartTechRepairDB')
BEGIN
    CREATE DATABASE SmartTechRepairDB;
END
GO

USE SmartTechRepairDB;
GO

-- Xóa bảng cũ nếu tồn tại (theo thứ tự phụ thuộc)
IF OBJECT_ID('AuditLogs', 'U') IS NOT NULL DROP TABLE AuditLogs;
IF OBJECT_ID('TicketPhotos', 'U') IS NOT NULL DROP TABLE TicketPhotos;
IF OBJECT_ID('TicketItems', 'U') IS NOT NULL DROP TABLE TicketItems;
IF OBJECT_ID('SpareParts', 'U') IS NOT NULL DROP TABLE SpareParts;
IF OBJECT_ID('RepairTickets', 'U') IS NOT NULL DROP TABLE RepairTickets;
IF OBJECT_ID('Devices', 'U') IS NOT NULL DROP TABLE Devices;
IF OBJECT_ID('Customers', 'U') IS NOT NULL DROP TABLE Customers;
IF OBJECT_ID('Users', 'U') IS NOT NULL DROP TABLE Users;
GO

-- Bảng Người dùng (Users / RBAC)
CREATE TABLE Users (
    UserId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    FullName NVARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(20) NOT NULL UNIQUE,
    Role NVARCHAR(20) NOT NULL CHECK (Role IN ('ADMIN', 'RECEPTIONIST', 'TECHNICIAN', 'CUSTOMER')),
    CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 DEFAULT SYSDATETIME()
);

-- Bảng Khách hàng (Customers)
CREATE TABLE Customers (
    CustomerId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    FullName NVARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(20) NOT NULL UNIQUE,
    Email NVARCHAR(100) NULL,
    Address NVARCHAR(255) NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 DEFAULT SYSDATETIME()
);

-- Bảng Thiết bị (Devices)
CREATE TABLE Devices (
    DeviceId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    CustomerId UNIQUEIDENTIFIER NOT NULL,
    DeviceType NVARCHAR(50) NOT NULL,  -- Laptop, Phone, Tablet...
    Brand NVARCHAR(50) NOT NULL,       -- Apple, Dell, Asus...
    ModelName NVARCHAR(100) NOT NULL,
    SerialNumber VARCHAR(100) NULL,    -- Serial/IMEI
    CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Devices_Customers FOREIGN KEY (CustomerId) REFERENCES Customers(CustomerId) ON DELETE CASCADE
);

-- Bảng Linh kiện (SpareParts)
CREATE TABLE SpareParts (
    PartId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    SKU VARCHAR(50) NOT NULL UNIQUE,
    PartName NVARCHAR(150) NOT NULL,
    Price DECIMAL(18, 2) NOT NULL CHECK (Price >= 0),
    StockQuantity INT NOT NULL DEFAULT 0 CHECK (StockQuantity >= 0),
    ReservedStock INT NOT NULL DEFAULT 0 CHECK (ReservedStock >= 0), -- Soft Lock khi lập báo giá
    CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 DEFAULT SYSDATETIME()
);

-- Bảng Phiếu sửa chữa (RepairTickets)
CREATE TABLE RepairTickets (
    TicketId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    TrackingCode VARCHAR(50) NOT NULL UNIQUE,
    CustomerId UNIQUEIDENTIFIER NOT NULL,
    DeviceId UNIQUEIDENTIFIER NOT NULL,
    CreatedById UNIQUEIDENTIFIER NOT NULL,  -- Lễ tân nhận máy
    TechnicianId UNIQUEIDENTIFIER NULL,     -- Kỹ thuật viên phụ trách
    InitialDefect NVARCHAR(MAX) NOT NULL,   -- Lỗi ban đầu
    TechnicianNote NVARCHAR(MAX) NULL,      -- Chẩn đoán KTV
    Status VARCHAR(30) NOT NULL DEFAULT 'CREATED' CHECK (
        Status IN ('CREATED', 'INSPECTING', 'QUOTED', 'APPROVED', 'REJECTED', 'REPAIRING', 'TESTED', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED')
    ),
    TotalAmount DECIMAL(18, 2) NOT NULL DEFAULT 0.00 CHECK (TotalAmount >= 0),
    CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 DEFAULT SYSDATETIME(),

    CONSTRAINT FK_Tickets_Customers FOREIGN KEY (CustomerId) REFERENCES Customers(CustomerId),
    CONSTRAINT FK_Tickets_Devices FOREIGN KEY (DeviceId) REFERENCES Devices(DeviceId),
    CONSTRAINT FK_Tickets_CreatedBy FOREIGN KEY (CreatedById) REFERENCES Users(UserId),
    CONSTRAINT FK_Tickets_Technician FOREIGN KEY (TechnicianId) REFERENCES Users(UserId)
);

-- Bảng Chi tiết báo giá/sửa chữa (TicketItems)
CREATE TABLE TicketItems (
    TicketItemId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    TicketId UNIQUEIDENTIFIER NOT NULL,
    PartId UNIQUEIDENTIFIER NULL, -- NULL nếu là tiền công sửa chữa
    ItemDescription NVARCHAR(255) NOT NULL,
    Quantity INT NOT NULL DEFAULT 1 CHECK (Quantity > 0),
    UnitPrice DECIMAL(18, 2) NOT NULL CHECK (UnitPrice >= 0),
    Subtotal AS (Quantity * UnitPrice) PERSISTED,

    CONSTRAINT FK_TicketItems_Tickets FOREIGN KEY (TicketId) REFERENCES RepairTickets(TicketId) ON DELETE CASCADE,
    CONSTRAINT FK_TicketItems_Parts FOREIGN KEY (PartId) REFERENCES SpareParts(PartId)
);

-- Bảng Ảnh tình trạng máy (TicketPhotos)
CREATE TABLE TicketPhotos (
    PhotoId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    TicketId UNIQUEIDENTIFIER NOT NULL,
    PhotoUrl NVARCHAR(500) NOT NULL,
    PhotoType VARCHAR(10) NOT NULL CHECK (PhotoType IN ('BEFORE', 'AFTER')),
    CreatedAt DATETIME2 DEFAULT SYSDATETIME(),

    CONSTRAINT FK_TicketPhotos_Tickets FOREIGN KEY (TicketId) REFERENCES RepairTickets(TicketId) ON DELETE CASCADE
);

-- Bảng Nhật ký thao tác (AuditLogs)
CREATE TABLE AuditLogs (
    LogId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    TicketId UNIQUEIDENTIFIER NOT NULL,
    UserId UNIQUEIDENTIFIER NULL, -- NULL nếu do Khách thao tác qua link tracking
    Action VARCHAR(50) NOT NULL,
    Note NVARCHAR(MAX) NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME(),

    CONSTRAINT FK_AuditLogs_Tickets FOREIGN KEY (TicketId) REFERENCES RepairTickets(TicketId) ON DELETE CASCADE,
    CONSTRAINT FK_AuditLogs_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);
GO

-- Bổ sung Index tối ưu hiệu năng tra cứu
CREATE INDEX IX_RepairTickets_TrackingCode ON RepairTickets(TrackingCode);
CREATE INDEX IX_RepairTickets_Status ON RepairTickets(Status);
CREATE INDEX IX_Devices_SerialNumber ON Devices(SerialNumber);
GO

-- ============================================================================
-- 2. TRÌNH KÍCH HOẠT (TRIGGER) SINH MÃ TRACKING CODE TỰ ĐỘNG
-- ============================================================================
CREATE OR ALTER TRIGGER trg_GenerateTrackingCode
ON RepairTickets
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @TicketId UNIQUEIDENTIFIER, @CustomerId UNIQUEIDENTIFIER, @DeviceId UNIQUEIDENTIFIER, @CreatedById UNIQUEIDENTIFIER;
    DECLARE @InitialDefect NVARCHAR(MAX), @Status VARCHAR(30), @TotalAmount DECIMAL(18, 2);
    DECLARE @TrackingCode VARCHAR(50);
    DECLARE @DatePrefix VARCHAR(8) = CONVERT(VARCHAR(8), GETDATE(), 112); -- YYYYMMDD
    DECLARE @RandomSuffix INT;

    DECLARE cur CURSOR FOR 
    SELECT TicketId, CustomerId, DeviceId, CreatedById, InitialDefect, Status, TotalAmount FROM inserted;

    OPEN cur;
    FETCH NEXT FROM cur INTO @TicketId, @CustomerId, @DeviceId, @CreatedById, @InitialDefect, @Status, @TotalAmount;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        IF @TicketId IS NULL SET @TicketId = NEWID();

        -- Sinh mã TRK-YYYYMMDD-XXXX ngẫu nhiên không trùng
        WHILE 1 = 1
        BEGIN
            SET @RandomSuffix = FLOOR(RAND() * 8999 + 1000);
            SET @TrackingCode = 'TRK-' + @DatePrefix + '-' + CAST(@RandomSuffix AS VARCHAR(4));
            
            IF NOT EXISTS (SELECT 1 FROM RepairTickets WHERE TrackingCode = @TrackingCode)
                BREAK;
        END

        INSERT INTO RepairTickets (TicketId, TrackingCode, CustomerId, DeviceId, CreatedById, InitialDefect, Status, TotalAmount, CreatedAt, UpdatedAt)
        VALUES (@TicketId, @TrackingCode, @CustomerId, @DeviceId, @CreatedById, @InitialDefect, ISNULL(@Status, 'CREATED'), ISNULL(@TotalAmount, 0.00), SYSDATETIME(), SYSDATETIME());

        FETCH NEXT FROM cur INTO @TicketId, @CustomerId, @DeviceId, @CreatedById, @InitialDefect, @Status, @TotalAmount;
    END

    CLOSE cur;
    DEALLOCATE cur;
END;
GO

-- ============================================================================
-- 3. STORED PROCEDURES XỬ LÝ NGHIỆP VỤ (STORED PROCEDURES)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- SP 1: Tiếp nhận máy & Tạo Ticket mới (sp_CreateRepairTicket)
-- ----------------------------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_CreateRepairTicket
    @CustomerName NVARCHAR(100),
    @CustomerPhone VARCHAR(20),
    @CustomerEmail NVARCHAR(100) = NULL,
    @CustomerAddress NVARCHAR(255) = NULL,
    @DeviceType NVARCHAR(50),
    @Brand NVARCHAR(50),
    @ModelName NVARCHAR(100),
    @SerialNumber VARCHAR(100) = NULL,
    @InitialDefect NVARCHAR(MAX),
    @CreatedById UNIQUEIDENTIFIER,
    @OutTrackingCode VARCHAR(50) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @CustomerId UNIQUEIDENTIFIER, @DeviceId UNIQUEIDENTIFIER, @TicketId UNIQUEIDENTIFIER = NEWID();

        -- 1. Quản lý thông tin Khách hàng (Tạo mới nếu chưa có)
        SELECT @CustomerId = CustomerId FROM Customers WHERE PhoneNumber = @CustomerPhone;
        IF @CustomerId IS NULL
        BEGIN
            SET @CustomerId = NEWID();
            INSERT INTO Customers (CustomerId, FullName, PhoneNumber, Email, Address)
            VALUES (@CustomerId, @CustomerName, @CustomerPhone, @CustomerEmail, @CustomerAddress);
        END

        -- 2. Tạo thông tin Thiết bị
        SET @DeviceId = NEWID();
        INSERT INTO Devices (DeviceId, CustomerId, DeviceType, Brand, ModelName, SerialNumber)
        VALUES (@DeviceId, @CustomerId, @DeviceType, @Brand, @ModelName, @SerialNumber);

        -- 3. Tạo Ticket (Trigger sẽ tự sinh TrackingCode)
        INSERT INTO RepairTickets (TicketId, CustomerId, DeviceId, CreatedById, InitialDefect, Status)
        VALUES (@TicketId, @CustomerId, @DeviceId, @CreatedById, @InitialDefect, 'CREATED');

        -- Lấy mã TrackingCode vừa được sinh
        SELECT @OutTrackingCode = TrackingCode FROM RepairTickets WHERE TicketId = @TicketId;

        -- 4. Ghi Audit Log
        INSERT INTO AuditLogs (TicketId, UserId, Action, Note)
        VALUES (@TicketId, @CreatedById, 'TICKET_CREATED', N'Tiếp nhận thiết bị vào hệ thống. Mã tra cứu: ' + @OutTrackingCode);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- ----------------------------------------------------------------------------
-- SP 2: Lập Báo giá & Soft Lock Linh kiện (sp_SubmitQuote)
-- Lưu ý: @ItemsJson nhận định dạng JSON: 
-- [{"PartId": "GUID", "Description": "Thay RAM", "Quantity": 1, "UnitPrice": 500000}]
-- ----------------------------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_SubmitQuote
    @TicketId UNIQUEIDENTIFIER,
    @TechnicianId UNIQUEIDENTIFIER,
    @TechnicianNote NVARCHAR(MAX),
    @ItemsJson NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @CurrentStatus VARCHAR(30);

        SELECT @CurrentStatus = Status FROM RepairTickets WHERE TicketId = @TicketId;
        IF @CurrentStatus IS NULL
            RAISEERROR(N'Ticket không tồn tại.', 16, 1);

        IF @CurrentStatus NOT IN ('CREATED', 'INSPECTING')
            RAISEERROR(N'Chỉ có thể lập báo giá khi Ticket ở trạng thái CREATED hoặc INSPECTING.', 16, 1);

        -- 1. Xóa các item cũ nếu có
        DELETE FROM TicketItems WHERE TicketId = @TicketId;

        -- 2. Thêm danh sách item từ JSON
        INSERT INTO TicketItems (TicketId, PartId, ItemDescription, Quantity, UnitPrice)
        SELECT 
            @TicketId,
            CASE WHEN PartId = '' THEN NULL ELSE CAST(PartId AS UNIQUEIDENTIFIER) END,
            ItemDescription,
            Quantity,
            UnitPrice
        FROM OPENJSON(@ItemsJson)
        WITH (
            PartId VARCHAR(50) '$.PartId',
            ItemDescription NVARCHAR(255) '$.Description',
            Quantity INT '$.Quantity',
            UnitPrice DECIMAL(18,2) '$.UnitPrice'
        );

        -- 3. Soft Lock Linh kiện (Tăng ReservedStock)
        DECLARE @PartId UNIQUEIDENTIFIER, @Qty INT;
        DECLARE curParts CURSOR FOR 
            SELECT CAST(PartId AS UNIQUEIDENTIFIER), Quantity 
            FROM OPENJSON(@ItemsJson) WITH (PartId VARCHAR(50) '$.PartId', Quantity INT '$.Quantity')
            WHERE PartId IS NOT NULL AND PartId <> '';

        OPEN curParts;
        FETCH NEXT FROM curParts INTO @PartId, @Qty;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            -- Kiểm tra tồn kho khả dụng
            IF NOT EXISTS (SELECT 1 FROM SpareParts WHERE PartId = @PartId AND (StockQuantity - ReservedStock) >= @Qty)
            BEGIN
                DECLARE @PartName NVARCHAR(150);
                SELECT @PartName = PartName FROM SpareParts WHERE PartId = @PartId;
                RAISEERROR(N'Linh kiện [%s] không đủ số lượng khả dụng trong kho.', 16, 1, @PartName);
            END

            -- Tăng giữ chỗ
            UPDATE SpareParts 
            SET ReservedStock = ReservedStock + @Qty, UpdatedAt = SYSDATETIME()
            WHERE PartId = @PartId;

            FETCH NEXT FROM curParts INTO @PartId, @Qty;
        END

        CLOSE curParts;
        DEALLOCATE curParts;

        -- 4. Tính lại tổng tiền và cập nhật trạng thái QUOTED
        DECLARE @Total DECIMAL(18, 2);
        SELECT @Total = SUM(Subtotal) FROM TicketItems WHERE TicketId = @TicketId;

        UPDATE RepairTickets
        SET Status = 'QUOTED',
            TechnicianId = @TechnicianId,
            TechnicianNote = @TechnicianNote,
            TotalAmount = ISNULL(@Total, 0.00),
            UpdatedAt = SYSDATETIME()
        WHERE TicketId = @TicketId;

        -- 5. Ghi Audit Log
        INSERT INTO AuditLogs (TicketId, UserId, Action, Note)
        VALUES (@TicketId, @TechnicianId, 'QUOTE_SUBMITTED', N'Kỹ thuật viên đã lập báo giá và giữ chỗ linh kiện.');

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF CURSOR_STATUS('global', 'curParts') >= 0
        BEGIN
            CLOSE curParts;
            DEALLOCATE curParts;
        END
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- ----------------------------------------------------------------------------
-- SP 3: Khách hàng Duyệt báo giá (sp_ApproveQuote)
-- ----------------------------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_ApproveQuote
    @TrackingCode VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @TicketId UNIQUEIDENTIFIER, @CurrentStatus VARCHAR(30);

        SELECT @TicketId = TicketId, @CurrentStatus = Status 
        FROM RepairTickets WHERE TrackingCode = @TrackingCode;

        IF @TicketId IS NULL
            RAISEERROR(N'Mã tra cứu không hợp lệ.', 16, 1);

        IF @CurrentStatus <> 'QUOTED'
            RAISEERROR(N'Ticket không ở trạng thái chờ duyệt báo giá (QUOTED).', 16, 1);

        UPDATE RepairTickets 
        SET Status = 'APPROVED', UpdatedAt = SYSDATETIME() 
        WHERE TicketId = @TicketId;

        INSERT INTO AuditLogs (TicketId, UserId, Action, Note)
        VALUES (@TicketId, NULL, 'QUOTE_APPROVED', N'Khách hàng đã đồng ý báo giá qua cổng trực tuyến.');

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- ----------------------------------------------------------------------------
-- SP 4: Từ chối Báo giá / Hủy Ticket & Giải phóng Kho (sp_RejectOrCancelTicket)
-- ----------------------------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_RejectOrCancelTicket
    @TicketId UNIQUEIDENTIFIER,
    @UserId UNIQUEIDENTIFIER = NULL, -- NULL nếu do Khách thao tác
    @Reason NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @CurrentStatus VARCHAR(30);

        SELECT @CurrentStatus = Status FROM RepairTickets WHERE TicketId = @TicketId;
        IF @CurrentStatus IS NULL
            RAISEERROR(N'Ticket không tồn tại.', 16, 1);

        IF @CurrentStatus IN ('COMPLETED', 'CANCELLED')
            RAISEERROR(N'Ticket đã hoàn tất hoặc đã bị hủy trước đó.', 16, 1);

        -- Hoàn trả số lượng giữ chỗ (ReservedStock) cho các linh kiện trong báo giá
        UPDATE S
        SET S.ReservedStock = S.ReservedStock - T.Quantity,
            S.UpdatedAt = SYSDATETIME()
        FROM SpareParts S
        INNER JOIN TicketItems T ON S.PartId = T.PartId
        WHERE T.TicketId = @TicketId AND T.PartId IS NOT NULL;

        -- Cập nhật trạng thái Ticket sang REJECTED hoặc CANCELLED
        DECLARE @NewStatus VARCHAR(30) = CASE WHEN @CurrentStatus = 'QUOTED' AND @UserId IS NULL THEN 'REJECTED' ELSE 'CANCELLED' END;

        UPDATE RepairTickets 
        SET Status = @NewStatus, UpdatedAt = SYSDATETIME() 
        WHERE TicketId = @TicketId;

        INSERT INTO AuditLogs (TicketId, UserId, Action, Note)
        VALUES (@TicketId, @UserId, @NewStatus, N'Lý do: ' + ISNULL(@Reason, N'Không có lý do'));

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- ----------------------------------------------------------------------------
-- SP 5: Hoàn tất Sửa chữa, Bàn giao & Trừ kho Thực tế (sp_CompleteTicket)
-- ----------------------------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_CompleteTicket
    @TicketId UNIQUEIDENTIFIER,
    @UserId UNIQUEIDENTIFIER -- Lễ tân/Thu ngân thu tiền bàn giao
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @CurrentStatus VARCHAR(30);

        SELECT @CurrentStatus = Status FROM RepairTickets WHERE TicketId = @TicketId;
        IF @CurrentStatus IS NULL
            RAISEERROR(N'Ticket không tồn tại.', 16, 1);

        IF @CurrentStatus <> 'READY_FOR_PICKUP'
            RAISEERROR(N'Thiết bị chưa ở trạng thái sẵn sàng bàn giao (READY_FOR_PICKUP).', 16, 1);

        -- Thực tế xuất kho: Trừ StockQuantity và giảm ReservedStock tương ứng
        UPDATE S
        SET S.StockQuantity = S.StockQuantity - T.Quantity,
            S.ReservedStock = S.ReservedStock - T.Quantity,
            S.UpdatedAt = SYSDATETIME()
        FROM SpareParts S
        INNER JOIN TicketItems T ON S.PartId = T.PartId
        WHERE T.TicketId = @TicketId AND T.PartId IS NOT NULL;

        -- Cập nhật trạng thái thành COMPLETED
        UPDATE RepairTickets 
        SET Status = 'COMPLETED', UpdatedAt = SYSDATETIME() 
        WHERE TicketId = @TicketId;

        INSERT INTO AuditLogs (TicketId, UserId, Action, Note)
        VALUES (@TicketId, @UserId, 'TICKET_COMPLETED', N'Đã thu tiền, xuất kho linh kiện và hoàn tất bàn giao cho khách.');

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO
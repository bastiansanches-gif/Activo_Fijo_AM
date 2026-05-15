USE [master];
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.sql_logins
    WHERE [name] = N'audiomusica_app'
)
BEGIN
    CREATE LOGIN [audiomusica_app]
        WITH PASSWORD = N'Amsa.2026#',
        CHECK_POLICY = ON,
        CHECK_EXPIRATION = OFF;
END
ELSE
BEGIN
    ALTER LOGIN [audiomusica_app] ENABLE;
    ALTER LOGIN [audiomusica_app]
        WITH PASSWORD = N'Amsa.2026#',
        CHECK_POLICY = ON,
        CHECK_EXPIRATION = OFF;
END
GO

USE [AudiomusicaAssetManagementDb];
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.database_principals
    WHERE [name] = N'audiomusica_app'
)
BEGIN
    CREATE USER [audiomusica_app] FOR LOGIN [audiomusica_app];
END
GO

ALTER ROLE [db_datareader] ADD MEMBER [audiomusica_app];
ALTER ROLE [db_datawriter] ADD MEMBER [audiomusica_app];
ALTER ROLE [db_ddladmin] ADD MEMBER [audiomusica_app];
GO

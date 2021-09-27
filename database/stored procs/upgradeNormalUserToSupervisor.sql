USE [Management]
GO

/****** Object:  StoredProcedure [dbo].[upgradeNormalUserToSupervisor]    Script Date: 27/09/2021 10:51:28 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[upgradeNormalUserToSupervisor]
(
     @id varchar(50)
)
AS
BEGIN
    BEGIN TRANSACTION;

    BEGIN TRY
        INSERT INTO [dbo].[supervisor_users]
            ([id]
            ,[firstname]
            ,[lastname]
            ,[email]
            ,[password]
            ) SELECT id,firstname, lastname, email, password FROM dbo.normal_users WHERE id = @id;
            

		
		DELETE FROM dbo.normal_users WHERE id = @id;
        COMMIT TRANSACTION 
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
        BEGIN
            ROLLBACK TRANSACTION; -- rollback to MySavePoint
        END
    END CATCH
END;
GO



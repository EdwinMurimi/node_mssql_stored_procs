USE [Management]
GO

/****** Object:  StoredProcedure [dbo].[upgradeSupervisorUserToAdmin]    Script Date: 27/09/2021 10:52:41 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[upgradeSupervisorUserToAdmin]
(
     @id varchar(50)
)
AS
BEGIN
    BEGIN TRANSACTION;

    BEGIN TRY
        INSERT INTO [dbo].[admin_users]
            ([id]
            ,[firstname]
            ,[lastname]
            ,[email]
            ,[password]
            ) SELECT id,firstname, lastname, email, password FROM dbo.supervisor_users WHERE id = @id;
            

		
		DELETE FROM dbo.supervisor_users WHERE id = @id;
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



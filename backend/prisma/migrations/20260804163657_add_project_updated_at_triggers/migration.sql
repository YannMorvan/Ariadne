-- Refresh the "Project" table to ensure that the "updatedAt" column is updated when related tables are modified.
CREATE OR REPLACE FUNCTION update_project_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    UPDATE "Project" 
    SET "updatedAt" = NOW() 
    WHERE "id" = OLD."projectId";
    RETURN OLD;
  ELSE
    UPDATE "Project" 
    SET "updatedAt" = NOW() 
    WHERE "id" = NEW."projectId";
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;


-- Trigger for Task table
DROP TRIGGER IF EXISTS trigger_update_project_on_task_change ON "Task";
CREATE TRIGGER trigger_update_project_on_task_change
AFTER INSERT OR UPDATE OR DELETE ON "Task"
FOR EACH ROW
EXECUTE FUNCTION update_project_updated_at();

-- Trigger for ProjectMember table
DROP TRIGGER IF EXISTS trigger_update_project_on_member_change ON "ProjectMember";
CREATE TRIGGER trigger_update_project_on_member_change
AFTER INSERT OR UPDATE OR DELETE ON "ProjectMember"
FOR EACH ROW
EXECUTE FUNCTION update_project_updated_at();
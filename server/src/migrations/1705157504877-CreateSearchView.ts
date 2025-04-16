import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateSearchView1705157504877 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      CREATE VIEW search_view AS
      SELECT 'Company' AS type, id, name AS text FROM companies
      UNION ALL
      SELECT 'Employee', id, CONCAT(firstName, ' ', lastName) AS text FROM employees
      UNION ALL
      SELECT 'Location', id, name AS text FROM locations;
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP VIEW search_view');
    }

}

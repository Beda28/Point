import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1792108800000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS wallets (
        id              CHAR(36)                          NOT NULL PRIMARY KEY,
        client_id       VARCHAR(64)                       NOT NULL,
        user_id         VARCHAR(128)                      NOT NULL,
        balance         BIGINT                            NOT NULL DEFAULT 0,
        status          ENUM('ACTIVE', 'INACTIVE')         NOT NULL DEFAULT 'ACTIVE',
        created_at      DATETIME(6)                       NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id              CHAR(36)                          NOT NULL PRIMARY KEY,
        wallet_id       CHAR(36)                          NOT NULL,
        type            ENUM('EARN', 'SPEND', 'REVERSE')   NOT NULL,
        amount          BIGINT                            NOT NULL,
        balance         BIGINT                            NOT NULL,
        ref_id          VARCHAR(128)                      NOT NULL,
        original_id     CHAR(36)                          NULL,
        created_at      DATETIME(6)                       NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS records (
        client_id       VARCHAR(64)                       NOT NULL,
        req_key         VARCHAR(128)                      NOT NULL,
        req_hash        CHAR(64)                          NOT NULL,
        status          ENUM('PROCESSING', 'COMPLETED')    NOT NULL DEFAULT 'PROCESSING',
        tx_id           CHAR(36)                          NULL,
        created_at      DATETIME(6)                       NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (client_id, req_key)
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE records');
    await queryRunner.query('DROP TABLE transactions');
    await queryRunner.query('DROP TABLE wallets');
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1697869151855 implements MigrationInterface {
  name = 'Init1697869151855';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`size\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`benefit\` varchar(255) NOT NULL, \`img\` json NOT NULL, \`money\` varchar(255) NOT NULL, \`quantity\` int NOT NULL, \`isShow\` tinyint NOT NULL DEFAULT 1, \`categoryId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`sale\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`percent\` double NOT NULL, \`dateStart\` datetime NOT NULL, \`dateEnd\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`order_detail\` (\`id\` int NOT NULL AUTO_INCREMENT, \`money\` varchar(255) NOT NULL, \`orderId\` int NULL, \`productId\` int NULL, \`saleId\` int NULL, UNIQUE INDEX \`REL_a3647bd11aed3cf968c9ce9b83\` (\`productId\`), UNIQUE INDEX \`REL_c30bc42cfeec08306c0760acd7\` (\`saleId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`roles\` enum ('admin', 'user') NOT NULL DEFAULT 'user', \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`order\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateCreate\` datetime NOT NULL, \`totalMoney\` varchar(255) NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`recipient_detail\` (\`id\` int NOT NULL AUTO_INCREMENT, \`money\` varchar(255) NOT NULL, \`recipientIdId\` int NULL, \`productId\` int NULL, UNIQUE INDEX \`REL_0a9ecb93d76eceb5e800a302b9\` (\`productId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`supplier\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`recipient_bill\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dateImport\` datetime NOT NULL, \`totalMoney\` varchar(255) NOT NULL, \`supplierId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`rate\` (\`id\` int NOT NULL AUTO_INCREMENT, \`comment\` varchar(255) NOT NULL, \`rate\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`rate_users_users\` (\`rateId\` int NOT NULL, \`usersId\` int NOT NULL, INDEX \`IDX_ce3b135a89848b6e69d68fbe5f\` (\`rateId\`), INDEX \`IDX_e45d3ee181a353def80df31038\` (\`usersId\`), PRIMARY KEY (\`rateId\`, \`usersId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`rate_products_product\` (\`rateId\` int NOT NULL, \`productId\` int NOT NULL, INDEX \`IDX_c8c5828699149c5960d75f0569\` (\`rateId\`), INDEX \`IDX_a46974bbd9f0b319cd33695512\` (\`productId\`), PRIMARY KEY (\`rateId\`, \`productId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product\` ADD CONSTRAINT \`FK_ff0c0301a95e517153df97f6812\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_detail\` ADD CONSTRAINT \`FK_88850b85b38a8a2ded17a1f5369\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_detail\` ADD CONSTRAINT \`FK_a3647bd11aed3cf968c9ce9b835\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_detail\` ADD CONSTRAINT \`FK_c30bc42cfeec08306c0760acd79\` FOREIGN KEY (\`saleId\`) REFERENCES \`sale\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD CONSTRAINT \`FK_caabe91507b3379c7ba73637b84\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`recipient_detail\` ADD CONSTRAINT \`FK_5e274becedf06cc98d16f973118\` FOREIGN KEY (\`recipientIdId\`) REFERENCES \`recipient_bill\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`recipient_detail\` ADD CONSTRAINT \`FK_0a9ecb93d76eceb5e800a302b98\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`recipient_bill\` ADD CONSTRAINT \`FK_e3b6e92e6f69ab24a87aa971b54\` FOREIGN KEY (\`supplierId\`) REFERENCES \`supplier\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`rate_users_users\` ADD CONSTRAINT \`FK_ce3b135a89848b6e69d68fbe5f6\` FOREIGN KEY (\`rateId\`) REFERENCES \`rate\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`rate_users_users\` ADD CONSTRAINT \`FK_e45d3ee181a353def80df310383\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`rate_products_product\` ADD CONSTRAINT \`FK_c8c5828699149c5960d75f05698\` FOREIGN KEY (\`rateId\`) REFERENCES \`rate\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`rate_products_product\` ADD CONSTRAINT \`FK_a46974bbd9f0b319cd33695512f\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`rate_products_product\` DROP FOREIGN KEY \`FK_a46974bbd9f0b319cd33695512f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`rate_products_product\` DROP FOREIGN KEY \`FK_c8c5828699149c5960d75f05698\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`rate_users_users\` DROP FOREIGN KEY \`FK_e45d3ee181a353def80df310383\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`rate_users_users\` DROP FOREIGN KEY \`FK_ce3b135a89848b6e69d68fbe5f6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`recipient_bill\` DROP FOREIGN KEY \`FK_e3b6e92e6f69ab24a87aa971b54\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`recipient_detail\` DROP FOREIGN KEY \`FK_0a9ecb93d76eceb5e800a302b98\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`recipient_detail\` DROP FOREIGN KEY \`FK_5e274becedf06cc98d16f973118\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_caabe91507b3379c7ba73637b84\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_detail\` DROP FOREIGN KEY \`FK_c30bc42cfeec08306c0760acd79\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_detail\` DROP FOREIGN KEY \`FK_a3647bd11aed3cf968c9ce9b835\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_detail\` DROP FOREIGN KEY \`FK_88850b85b38a8a2ded17a1f5369\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_ff0c0301a95e517153df97f6812\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_a46974bbd9f0b319cd33695512\` ON \`rate_products_product\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_c8c5828699149c5960d75f0569\` ON \`rate_products_product\``,
    );
    await queryRunner.query(`DROP TABLE \`rate_products_product\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_e45d3ee181a353def80df31038\` ON \`rate_users_users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_ce3b135a89848b6e69d68fbe5f\` ON \`rate_users_users\``,
    );
    await queryRunner.query(`DROP TABLE \`rate_users_users\``);
    await queryRunner.query(`DROP TABLE \`rate\``);
    await queryRunner.query(`DROP TABLE \`recipient_bill\``);
    await queryRunner.query(`DROP TABLE \`supplier\``);
    await queryRunner.query(
      `DROP INDEX \`REL_0a9ecb93d76eceb5e800a302b9\` ON \`recipient_detail\``,
    );
    await queryRunner.query(`DROP TABLE \`recipient_detail\``);
    await queryRunner.query(`DROP TABLE \`order\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(
      `DROP INDEX \`REL_c30bc42cfeec08306c0760acd7\` ON \`order_detail\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_a3647bd11aed3cf968c9ce9b83\` ON \`order_detail\``,
    );
    await queryRunner.query(`DROP TABLE \`order_detail\``);
    await queryRunner.query(`DROP TABLE \`sale\``);
    await queryRunner.query(`DROP TABLE \`category\``);
    await queryRunner.query(`DROP TABLE \`product\``);
  }
}

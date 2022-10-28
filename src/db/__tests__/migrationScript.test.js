import { migrationScript } from '../migrationsScript';
import { mockSourcedDB } from '../DB_mocks/mockSourceDB';
import { mockResultdDB } from '../DB_mocks/mockResultDB';

it('migration sript converted input data in needed formation', () => {
  const resultData = migrationScript(mockSourcedDB);

  expect(resultData).toEqual(mockResultdDB);
});

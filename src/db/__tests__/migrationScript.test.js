import { migrationScript } from '../migrationsScript';
import { mockSourcedDB } from '../__mocks__/mockSourceDB';
import { mockResultdDB } from '../__mocks__/mockResultDB';

it('migration sript converted input data in needed formation', () => {
  const resultData = migrationScript(mockSourcedDB);

  expect(resultData).toEqual(mockResultdDB);
});

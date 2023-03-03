const ROOT = '/';

const NEW_ENTITY = 'new';

const pages = {
  MAIN: ROOT,
  CLUBS: `${ROOT}clubs`,
  CLUB_INFO: `:id`,
  EDIT_CLUB: `:id/edit`,
  PLAYERS: `${ROOT}players`,
  PLAYER_INFO: `:id`,
  EDIT_PLAYER: `:id/edit`,
  TRANSFERS: `${ROOT}transfers`,
  TRANSFER_EDIT: `:id/edit`,
  YOUR_ACCOUNT: `${ROOT}your-account`,
  REQUEST_NEW: `${ROOT}request/license/new`,
  REQUEST_CONTINUE: `${ROOT}request/license/continue`,
  INFO: `${ROOT}info`,
};

export { ROOT, pages, NEW_ENTITY };

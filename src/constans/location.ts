const ROOT = '/';

const NEW_ENTITY = 'new';

const pages = {
  MAIN: ROOT,
  CLUBS: `${ROOT}clubs`,
  CLUB_INFO: `${ROOT}clubs/:id`,
  EDIT_CLUB: `${ROOT}clubs/:id/edit`,
  PLAYERS: `${ROOT}players`,
  PLAYER_INFO: `${ROOT}players/:id`,
  EDIT_PLAYER: `${ROOT}players/:id/edit`,
  TRANSFERS: `${ROOT}transfers`,
  TRANSFER_EDIT: `${ROOT}transfers/:id/edit`,
  YOUR_ACCOUNT: `${ROOT}your-account`,
  REQUEST_NEW: `${ROOT}request/license/new`,
  REQUEST_CONTINUE: `${ROOT}request/license/continue`,
};

export { ROOT, pages, NEW_ENTITY };

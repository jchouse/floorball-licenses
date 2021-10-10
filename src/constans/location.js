const ROOT = '/';
const pages = {
  MAIN: ROOT,
  CLUBS: `${ROOT}clubs`,
  CLUB_INFO: `${ROOT}clubs/:id`,
  PLAYERS: `${ROOT}players`,
  PLAYER_INFO: `${ROOT}players/:id`,
  TRANSFERS: `${ROOT}transfers`,
  NEW_CLUB: `${ROOT}clubs/new/edit`,
  NEW_PLAYER: `${ROOT}players/new/edit`,
  NEW_TRANSFER: `${ROOT}transfers/new/edit`,
  YOUR_ACCOUNT: `${ROOT}your-account`,
  REQUEST_NEW: `${ROOT}request/license/new`,
  REQUEST_CONTINUE: `${ROOT}request/license/continue`,
};

export { ROOT, pages };

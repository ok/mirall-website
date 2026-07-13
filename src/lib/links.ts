// External links used in more than one place. Keep them here so a move doesn't
// leave a stale copy behind in a component nobody thought to check.

export const GITHUB_URL = 'https://github.com/ok/mirall-app'

// `HEAD` resolves to whatever the repo's default branch is (currently `staging`,
// not `main`) — so this survives a branch rename, which a hardcoded /blob/main/
// would not.
export const GITHUB_LICENSE_URL = `${GITHUB_URL}/blob/HEAD/LICENSE`

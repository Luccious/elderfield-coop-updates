# Elderfield co-op updates

Signed releases of the Welcome to Elderfield co-op mod's own files (its plugin and network library), read by the
co-op updater on the title screen and on Join. Nothing here runs by itself, and the game takes a release only when
it is signed with co-op's key.

- `latest.json` + `latest.json.sig`: the newest release
- `builds/<build>/manifest.json` + `.sig`: each release's file list (paths, SHA-256, sizes)
- `builds/<build>/files/...`: the files

## Getting co-op

- **First install, or after the game itself updates:** download a setup from
  [Releases](https://github.com/Luccious/elderfield-coop-updates/releases/latest) and run it:
  `Elderfield-Coop-Steam-Setup.exe` connects through Steam, `Elderfield-Coop-Setup.exe` directly (home network,
  internet code or Hamachi). It makes a co-op copy of your own Steam game, or updates an existing one in place and
  keeps its co-op worlds. Uninstall it from Windows' installed apps.
- **After that:** the title screen offers each new co-op release; say "Update now". When joining a host whose
  co-op files differ, the Co-op menu offers "Update to the host's version". Nothing changes until you say yes,
  and "Don't check for updates" turns it off.

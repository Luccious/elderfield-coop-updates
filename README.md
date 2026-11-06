# Elderfield co-op updates

Signed releases of the Welcome to Elderfield co-op mod's own files (its plugin and network library), read by the
co-op updater on the title screen and on Join. Nothing here runs by itself, and the game takes a release only when
it is signed with co-op's key.

- `latest.json` + `latest.json.sig`: the newest release
- `builds/<build>/manifest.json` + `.sig`: each release's file list (paths, SHA-256, sizes)
- `builds/<build>/files/...`: the files

## Getting co-op

- **The mods-folder version (Nexus):** unzip `Elderfield-Coop-Mod.zip` into the game's `mods` folder (it makes
  `mods\ElderfieldCoop`), start the game from Steam and press **CO-OP** on the title screen. The first time it
  makes the co-op copy of your game (its own folder and saves; your Steam game and its saves are never changed);
  after a game update it brings the copy up to date (co-op worlds kept); then it starts it. The copy gets co-op
  updates from here like a setup's copy, and pressing CO-OP never puts an older co-op build over a newer one it
  got. A game update empties the `mods` folder: put the mod back.
- **Or a setup (first install, or after the game itself updates):** download one from
  [Releases](https://github.com/Luccious/elderfield-coop-updates/releases/latest) and run it:
  `Elderfield-Coop-Steam-Setup.exe` connects through Steam, `Elderfield-Coop-Setup.exe` directly (home network,
  internet code or Hamachi). It makes a co-op copy of your own Steam game, or updates an existing one in place and
  keeps its co-op worlds. Uninstall it from Windows' installed apps.
- **After that:** the title screen offers each new co-op release; say "Update now". When joining a host whose
  co-op files differ, the Co-op menu offers "Update to the host's version". Nothing changes until you say yes,
  and "Don't check for updates" turns it off.

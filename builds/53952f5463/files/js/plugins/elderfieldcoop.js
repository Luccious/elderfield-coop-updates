/*:
 * @target MZ
 * @plugindesc Co-op multiplayer foundation for Welcome to Elderfield (host-authoritative; Steam or relay transport)
 * @author Community Modders
 *
 * @param updateCheck
 * @text Look for co-op updates
 * @type boolean
 * @default true
 * @desc On the title screen, look for a newer signed co-op release and offer it (nothing changes until the player says yes).
 *
 * @param updateUrl
 * @text Co-op updates address
 * @default https://raw.githubusercontent.com/Luccious/elderfield-coop-updates/main/
 * @desc Where co-op's signed releases are published (tools/publish-update.js). Only releases signed with co-op's key are taken.
 *
 * @param transport
 * @text Transport
 * @type select
 * @option p2p
 * @option relay
 * @option steam
 * @default p2p
 * @desc p2p = the host's game runs the server itself (6-digit code on the local network, internet code / IP across the internet). relay = optional WebSocket relay server. steam = unused.
 *
 * @param p2pPort
 * @text Host port (P2P)
 * @type number
 * @min 1024
 * @max 65530
 * @default 24680
 * @desc TCP port the host's game listens on. The next 4 ports are tried if it is busy. Local-network discovery uses this port + 1 (UDP).
 *
 * @param allowInternet
 * @text Open the port automatically (UPnP)
 * @type boolean
 * @default true
 * @desc When hosting, ask the router (UPnP) to open the port and read the public address, so the internet code works.
 *
 * @param publicAddress
 * @text Public IP (port forwarded by hand)
 * @type string
 * @default
 * @desc Your internet (public) IPv4 address, for when you forwarded the port by hand and the router won't report it. Used to make the internet code.
 *
 * @param coopTitlePos
 * @text CO-OP title button position
 * @type string
 * @default 279,545
 * @desc x,y like MOG_TitleCommands' "Command Pos" values (from the 816x624 area centred on the screen). Default: centred above the bottom row.
 *
 * @param detectPublicIp
 * @text Look up public IP online
 * @type boolean
 * @default false
 * @desc If the router won't report the public IP, ask a "what is my IP" web service (api.ipify.org, then icanhazip.com). Off by default: that service sees your IP.
 *
 * @param steamLobbyType
 * @text Steam lobby visibility
 * @type select
 * @option code
 * @option friends
 * @option public
 * @default code
 * @desc code = hidden from friends lists but findable with the short 6-digit code (default). friends = only the host's Steam friends, long ID only. public = also shown to friends as joinable.
 *
 * @param relayUrl
 * @text Relay URL
 * @type string
 * @default ws://127.0.0.1:8765
 *
 * @param templateHouseMapId
 * @text Template house map ID
 * @type number
 * @min 0
 * @default 2
 * @desc Map each non-host player gets a private instance of. 0 disables instancing. VERIFY this against your game's data.
 *
 * @param syncTime
 * @text Sync DK_Game_Time clock
 * @type boolean
 * @default true
 * @desc Host's $gameTime (DK_Game_Time) is broadcast to clients. Midnight events still run locally on each client (not yet coordinated).
 *
 * @param lobbyKeyCode
 * @text Lobby key (title screen)
 * @type number
 * @default 120
 * @desc 120 = F9. F6 is used by WTE_NPCVision, F7 by WTE_Godrays.
 *
 * @param tradeKeyCode
 * @text Trade key (map)
 * @type number
 * @default 121
 * @desc 121 = F10.
 *
 * @param maxPlayers
 * @text Max players
 * @type number
 * @min 2
 * @max 4
 * @default 4
 *
 * @param titleCommand
 * @text Add "Multiplayer" to title menu
 * @type boolean
 * @default false
 * @desc Off by default: custom title plugins (e.g. MOG_TitleCommands) may not show it. F9 always opens the lobby.
 *
 * @param ritualTimeoutSec
 * @text Group sleep wait limit (seconds)
 * @type number
 * @min 0
 * @default 0
 * @desc 0 = wait for everyone (a waiting player can always cancel with Esc). Above 0 the host cancels the wait after this long.
 *
 * @param seedDailyRolls
 * @text Share the midnight random rolls
 * @type boolean
 * @default true
 * @desc Midnight (moon phase, weather, shop stock, NPC schedules...) rolls come from one shared seed so every player gets the same day.
 *
 * @param sharedMapIds
 * @text Maps whose monster state is shared
 * @type string
 * @default 3,24,33,36,84,88,92,93,94,96,98,99,116,119,120,121,122,123,159,160,161,162,163,166,167,229,233,237,238,239,240,245,247,264,265,266,267
 * @desc Comma list of map IDs. A monster defeated here (self switch A) stays defeated for every player until the world respawns its monsters. Generated from the maps that contain MONSTER events.
 *
 * @param sharedSelfSwitches
 * @text Shared self-switch letters
 * @type string
 * @default A
 * @desc Only A (defeated). Never add D: it triggers the battle encounter and would drag other players into your fight.
 *
 * @param sharedVariableIds
 * @text Shared game variables
 * @type string
 * @desc Comma list / ranges. Empty = the built-in scope table (every variable that is world progress).
 *
 * @param worldSwitchIds
 * @text Shared game switches
 * @type string
 * @desc Comma list / ranges. Empty = the built-in scope table (loot taken, unlocks, quests, events of the world).
 *
 * @param bathCommonEventId
 * @text Bath common event
 * @type number
 * @default 959
 * @desc Game-specific: the common event the tub runs. Each player's own: its world reset is held back.
 *
 * @param sleepSwitchId
 * @text Sleeping switch
 * @type number
 * @default 211
 * @desc Game-specific: the switch the bed turns ON when you go to sleep. Gated so everyone sleeps together.
 *
 * @param bedCounterVariableId
 * @text Bed counter variable
 * @type number
 * @default 1493
 * @desc Game-specific: restored if you cancel the group-sleep wait.
 *
 * @param midnightCommonEventId
 * @text Midnight common event
 * @type number
 * @default 507
 * @desc Game-specific: the "Midnight (Moon Event)" common event whose rolls are seeded.
 *
 * @param tutorialSwitchId
 * @text Tutorial switch
 * @type number
 * @default 507
 * @desc Game-specific: while this switch is ON the tutorial bed/bath run unmodified.
 *
 * @param sleepFromHour
 * @text Sleep allowed from hour
 * @type number
 * @min 0
 * @max 23
 * @default 18
 *
 * @param sleepUntilHour
 * @text Sleep allowed until hour
 * @type number
 * @min 0
 * @max 23
 * @default 5
 * @desc The bed works from 18:00 through 05:59 in this game.
 *
 * @command Trade
 * @text Trade with nearest player
 *
 * @command ChestDeposit
 * @text Communal chest: deposit
 * @arg chestId @text Chest ID @type string @default shared1
 * @arg kind @text Kind @type select @option item @option weapon @option armor @default item
 * @arg id @text Database ID @type number @min 1 @default 1
 * @arg amount @text Amount @type number @min 1 @default 1
 *
 * @command ChestWithdraw
 * @text Communal chest: withdraw
 * @arg chestId @text Chest ID @type string @default shared1
 * @arg kind @text Kind @type select @option item @option weapon @option armor @default item
 * @arg id @text Database ID @type number @min 1 @default 1
 * @arg amount @text Amount @type number @min 1 @default 1
 *
 * @help
 * elderfieldcoop.js
 *
 * Install: js/plugins/elderfieldcoop.js (file name must match the plugin name).
 * Open the lobby with F9 on the title screen. Trade with the nearest player: F10.
 *
 * Model: star topology. The host is the single authority. Clients only talk to
 * the host; the host validates and relays. Sender identity comes from the
 * transport (relay) and is never trusted from packet contents where the
 * transport can supply it. Every player runs their own game state (own
 * inventory, storage, relationships, quests); only the things listed below are shared.
 *
 * BATH: each player's own. Anyone bathes at their own tub whenever they like; it
 * heals them and resets their own daily things. Nobody else is asked or moved, and
 * the world (monsters, resources, rooms) is not reset by a bath.
 *
 * GROUP SLEEP: when one player confirms sleep (the bed), they wait until EVERY
 * player in the session has done the same (Esc cancels the wait). Each player
 * sleeps in their own bed (asked when someone lies down). Then everyone runs the
 * game's own sleep sequence at the same time, and the host finishes the ritual
 * when all are done; sleeping moves everyone to the next morning together.
 *
 * SHARED DAY: midnight rolls use one seed shared by all players. Defeated
 * monsters (self switch A on the configured maps) and the r_* room flags are
 * shared. Everything else (farm, NPCs, shops) is still per player.
 *
 * KNOWN LIMITATIONS (see report): saving is disabled while a session is active;
 * communal chest contents live in host RAM only; trade escrow is in RAM only;
 * farm/crop sync and compact shared bedrooms are NOT implemented.
 */

(function () {
    'use strict';

    const hasDOM = typeof document !== 'undefined';

    // =====================================================================
    // 0. DIAGNOSTICS (works even when the game blocks the developer console)
    //    - everything this plugin logs, plus any script error, is kept in memory,
    //      written to elderfield_coop.log in the game folder, and shown by Shift+F9
    //    - Ctrl+F9 tries to open the NW.js DevTools window (only works in an SDK build of NW.js)
    // =====================================================================
    const Diag = (() => {
        const lines = []; let file = '', fs = null, panel = null, toastEl = null, toastTimer = null;
        const stamp = () => new Date().toTimeString().slice(0, 8);
        const fmt = a => { if (a instanceof Error) return a.stack ? a.stack.split('\n').slice(0, 3).join(' | ') : a.message;
            if (typeof a === 'string') return a; try { return JSON.stringify(a); } catch (e) { return String(a); } };
        try {
            if (hasDOM && typeof require === 'function') {
                fs = require('fs'); const path = require('path');
                const dirs = [];
                try { if (process.mainModule && process.mainModule.filename) dirs.push(path.dirname(process.mainModule.filename)); } catch (e) { /* ignore */ }
                try { if (typeof nw !== 'undefined' && nw.App && nw.App.startPath) dirs.push(nw.App.startPath); } catch (e) { /* ignore */ }
                dirs.push(process.cwd());
                // a window started with its own profile (e.g. "Start second player (testing).bat") gets its own log file
                let name = 'elderfield_coop.log';
                try {
                    const argv = (typeof nw !== 'undefined' && nw.App && nw.App.fullArgv) || process.argv || [];
                    const a = argv.find(x => /^--user-data-dir=/.test(String(x)));
                    if (a) name = 'elderfield_coop-' + path.basename(String(a).slice(16).replace(/["\\\/]+$/g, '').replace(/"/g, '')).replace(/[^\w.-]/g, '_').slice(0, 40) + '.log';
                } catch (e) { /* default name */ }
                for (const d of dirs) {
                    try {
                        const f = path.join(d, name);
                        // the last 3 sessions' logs stay, in coop-logs\ (name-1.log is the one before): a problem found after a restart is still there
                        try { if (fs.existsSync(f)) { const od = path.join(d, 'coop-logs'), o = k => path.join(od, name.replace(/\.log$/, '-' + k + '.log')); if (!fs.existsSync(od)) fs.mkdirSync(od);
                            for (let k = 2; k >= 1; k--) if (fs.existsSync(o(k))) fs.renameSync(o(k), o(k + 1)); fs.renameSync(f, o(1)); } } catch (e) { /* keep going */ }
                        fs.writeFileSync(f, 'Elderfield co-op log ' + new Date().toISOString() + '\n'); file = f; break; } catch (e) { /* try next */ }
                }
            }
        } catch (e) { fs = null; }
        function log(level, msg, quiet) {
            // one line per entry: a stack the game prints in several lines stays together (where an error came from is then
            // in any summary that reads one line)
            const line = stamp() + ' [' + level + '] ' + String(msg).replace(/\s*\n\s*/g, ' | ');
            lines.push(line); if (lines.length > 200) lines.shift();
            if (file && fs) { try { fs.appendFileSync(file, line + '\n'); } catch (e) { file = ''; } }
            if (panel) render();
            if (level === 'error' && !quiet && hasDOM) Diag.show(true);
        }
        function render() { if (panel) panel.textContent = 'ELDERFIELD CO-OP LOG   (Shift+F9 hides)   file: ' + (file || '(could not write)') + '\n' + lines.slice(-24).join('\n'); }
        const Diag = {
            file: () => file,
            lines: () => lines.slice(),
            log: (level, ...a) => log(level, a.map(fmt).join(' ')),
            err: (where, e) => log('error', where + ': ' + fmt(e)),
            show(on) {
                if (!hasDOM || !document.body) return;
                if (on === undefined) on = !panel;
                if (!on) { if (panel) { panel.remove(); panel = null; } return; }
                if (!panel) {
                    panel = document.createElement('pre');
                    panel.style.cssText = 'position:absolute;left:8px;right:8px;bottom:8px;max-height:45%;overflow:hidden;z-index:30000;margin:0;padding:8px;background:rgba(0,0,0,.88);color:#9fe39f;font:12px/1.35 monospace;white-space:pre-wrap;pointer-events:none;border:1px solid #2d6a2d;';
                    document.body.appendChild(panel);
                }
                render();
            },
            toast(text, ms) {
                if (!hasDOM || !document.body) return;
                if (!toastEl) {
                    toastEl = document.createElement('div');
                    toastEl.style.cssText = 'position:absolute;top:6px;left:50%;transform:translateX(-50%);z-index:30001;pointer-events:none;background:rgba(15,12,22,.9);border:1px solid #8b0000;color:#ffd27f;font:13px monospace;padding:5px 12px;';
                    document.body.appendChild(toastEl);
                }
                toastEl.textContent = text; toastEl.style.display = 'block';
                clearTimeout(toastTimer); toastTimer = setTimeout(() => { if (toastEl) toastEl.style.display = 'none'; }, ms || 8000);
            },
            devtools() {
                try {
                    if (typeof nw === 'undefined' || !nw.Window) throw new Error('nw.Window is not available');
                    const w = nw.Window.get();
                    if (typeof w.showDevTools !== 'function') throw new Error('showDevTools is missing (not an SDK build of NW.js)');
                    w.showDevTools(); log('info', 'DevTools requested.');
                } catch (e) { log('error', 'DevTools could not be opened: ' + (e && e.message || e)); }
            }
        };
        // mirror this plugin's own console output
        ['log', 'warn', 'error'].forEach(k => {
            const orig = console[k] && console[k].bind(console); if (!orig) return;
            console[k] = function () {
                try { const a = Array.prototype.slice.call(arguments); if (typeof a[0] === 'string' && a[0].indexOf('[Elderfield MP]') === 0) log(k === 'log' ? 'info' : k === 'warn' ? 'warn' : 'error', a.map(fmt).join(' ')); else if (k === 'error') log('error', 'game: ' + a.map(fmt).join(' ').slice(0, 2000), true); } catch (e) { /* never break logging */ }
                return orig.apply(null, arguments);
            };
        });
        if (hasDOM && typeof window.addEventListener === 'function') {
            window.addEventListener('error', e => {
                const ours = /elderfield/i.test(String(e.filename || '')) || /elderfield/i.test(String(e.message || ''));
                log(ours ? 'error' : 'warn', 'script error: ' + e.message + ' @ ' + String(e.filename || '').split(/[\\\/]/).pop() + ':' + e.lineno);
            });
            window.addEventListener('unhandledrejection', e => log('warn', 'unhandled promise rejection: ' + fmt(e.reason)));
        }
        return Diag;
    })();
    /** Absolute path of this plugin file (NW.js: from the script tag; Node test harness: __filename). */
    const PLUGIN_FILE = (() => {
        try {
            if (hasDOM && document.currentScript && document.currentScript.src) {
                const u = new URL(document.currentScript.src);
                if (u.protocol === 'file:') return decodeURIComponent(u.pathname.replace(/^\/([A-Za-z]:)/, '$1'));
                if (typeof nw !== 'undefined' && nw.App && nw.App.startPath) return nw.App.startPath + decodeURIComponent(u.pathname);
            }
        } catch (e) { /* ignore */ }
        try { if (typeof __filename !== 'undefined') return __filename; } catch (e) { /* ignore */ }
        return '';
    })();
    Diag.log('info', 'plugin file executing (protocol 3). DOM=' + hasDOM + ', NW.js=' + (typeof nw !== 'undefined') + ', log=' + (Diag.file() || 'none'));
    const PLUGIN = (hasDOM && document.currentScript &&
        /([^\/]+)\.js(\?|$)/.exec(document.currentScript.src || '') || [])[1] || 'elderfield_coop';
    const P = (typeof PluginManager !== 'undefined') ? PluginManager.parameters(PLUGIN) : {};
    const num = (v, d) => { const n = Number(v); return Number.isFinite(n) && v !== undefined && v !== '' ? n : d; };
    /** "1,5,10-12" -> Set{1,5,10,11,12}. Ignores junk; caps the span so a typo cannot allocate millions. */
    function parseIdSet(text, hardMax) {
        const out = new Set();
        String(text === undefined ? '' : text).split(',').forEach(part => {
            const m = /^\s*(\d+)\s*(?:-\s*(\d+))?\s*$/.exec(part);
            if (!m) return;
            const a = Number(m[1]), b = m[2] === undefined ? a : Number(m[2]);
            if (b < a || b - a > 2000 || b > hardMax) return;
            for (let i = a; i <= b; i++) out.add(i);
        });
        return out;
    }
    Diag.log('info', 'parameters read as plugin "' + PLUGIN + '" (' + Object.keys(P).length + ' values)');
    /** The scope table (design §2.2, decision 47), built from the game's own data by tools/scope-scan.js: who writes and
     *  who reads each switch and variable. WORLD = one value for everyone (loot already taken, unlocks, quests, the farm,
     *  rooms, festivals, the house). PLAYER = the character's own (relationships, gifts, marriage, meeting people, dreams,
     *  skills, buffs and curses, sleep; and since decision 49 their own story: quests, tasks, the job board, mail, story
     *  scenes), saved with the player. Everything else is a temporary value each game keeps (tools/scope-story.js). */
    /** "Seen it" switches of WTE's how-to pop-ups on furniture and tutorial spots (the "!" over the bed, chest, desk,
     *  cooking pot, TV, radio, shelf, wardrobe, bath; farming, mining, foraging, fishing, husbandry, school): each read only
     *  by its own pop-up. Each player's own (user, 2026-11-04: "if a player does it then it goes away for all players. Each
     *  player should have the option"), so every player gets the "!" and the pop-up for themselves. 635: the radio's "!". */
    const SEEN_POPUPS = [635, 680, 681, 682, 683, 684, 685, 686, 687, 688, 689, 690, 691, 692, 693, 694, 695, 1262];
    const SCOPE = {
        worldSwitches: '28,42-48,62,122,136-137,202,223-224,230-237,248-249,255,267,270,274,299,302-317,464-468,470,472,486-487,490-491,512-516,520,525-527,530,532-533,535-537,539,541-546,550,562-563,576,581,585,589-591,595,599-605,610-611,635,641-653,663-664,668-670,672,675-676,680-696,716,728-730,732-733,761-773,775-784,786,795,798-806,815,817,821-823,825-837,843,857-860,865-866,869-872,874-875,878,880,890-892,902-903,905-906,908-920,933-934,945,958-959,961-968,971-977,979-980,988,991-992,998,1100,1102-1107,1110-1124,1128-1131,1136,1139,1141,1146-1151,1153-1156,1163-1171,1174,1176,1180-1184,1208,1211,1213,1219,1236,1245,1247,1252,1262,1267,1402-1421,1661-1667,1683-1687,1702-1717,1742-1755,1757,1849-1850,1853,1859-1860,1862,1864-1867,1872-1874,1877-1887,1891-1892,1894,1896,1901-1912,1927-1928,1935-1936,1944,1955,1959-1962,1973,1985,1988-1992,2102-2110',
        worldVars: '42,46-53,57-67,70,90-92,94-100,113,115,138,143,147,150-151,202-203,205-210,212-240,245,248-253,255-256,340,350-352,361-368,442-444,522,528-559,562-569,575-591,598-600,602,604,606,608,610,612,614,618,843,854,858-861,873,910-913,915-919,921-925,932-936,954-956,992-995,1004,1008,1010,1027-1028,1224-1225,1238,1242,1251,1254-1255,1257-1258,1261-1264,1267-1272,1277,1294-1296,1298-1300,1403-1405,1408-1419,1421,1424,1435,1466,1474-1475,1493-1498,1500,1624,1636,1640-1646,1652,1663-1664,1670-1672,1679-1680,1684-1687,1691-1692,1702-1717,1802-1804,1877,1879,1921-1926',
        playerSwitches: '54,59,142-150,203,221-222,225-229,242-247,250-254,256-266,268-269,271-273,276,286-287,290,324-326,362-365,367-373,402-416,418-421,423-440,460-461,469,473-476,488,501-507,521,528-529,534,538,582-584,638-640,654,656,671,702-715,742,774,785,788-789,807-814,838-839,844-856,862-864,873,876-877,881-889,893,897,901,936,989,996,1002-1016,1018-1035,1082-1093,1132-1134,1144,1152,1159,1173,1212,1214,1222,1224,1226-1234,1250-1251,1254-1260,1264-1265,1690-1693,1695-1697,1699,1762-1812,1838,1841-1846,1848,1868-1871,1875,1899,1940,1948-1950,1966-1970,1984,2978,2984,2995',
        playerVars: '41,43-45,54-56,68-69,83-85,135,139-142,144-146,148-149,152,211,246-247,260,282-298,322-328,330-336,338-339,382-388,390-396,402-403,405-418,420,422-430,502-510,597,622-638,641-646,648-662,664-666,669-679,681-687,821-829,834-837,840-842,872,882-888,943,945,947,1002-1003,1006,1029-1030,1038,1040-1043,1045-1053,1222-1223,1228-1230,1237,1248,1406,1420,1450-1454,1469,1601-1609,1625-1635,1649,1682,1822-1864,1866,1868-1876,1878,1880-1882'
    };
    const CFG = {
        updateUrl: String(P.updateUrl === undefined ? 'https://raw.githubusercontent.com/Luccious/elderfield-coop-updates/main/' : P.updateUrl).trim(),   // the updater (27_9c): co-op's signed releases
        updateCheck: P.updateCheck !== 'false',
        transport: P.transport === 'relay' ? 'relay' : P.transport === 'steam' ? 'steam' : 'p2p',
        p2pPort: Math.max(1024, Math.min(65530, num(P.p2pPort, 24680))),
        allowInternet: P.allowInternet !== 'false',
        publicAddress: String(P.publicAddress || '').trim(),
        detectPublicIp: P.detectPublicIp === 'true',
        coopTitlePos: /^-?\d+,\s*-?\d+$/.test(String(P.coopTitlePos || '')) ? String(P.coopTitlePos) : '279,545',
        steamLobbyType: P.steamLobbyType === 'friends' ? 'friends' : P.steamLobbyType === 'public' ? 'public' : 'code',
        relayUrl: P.relayUrl || 'ws://127.0.0.1:8765',
        templateMapId: Number(P.templateHouseMapId) || 0,   // old "private house" locations; off: the house is shared and joiners have real bedrooms (design rev 2)
        syncTime: P.syncTime !== 'false',
        lobbyKey: Number(P.lobbyKeyCode) || 120,
        tradeKey: Number(P.tradeKeyCode) || 121,
        maxPlayers: Math.max(2, Math.min(4, Number(P.maxPlayers) || 4)),
        titleCommand: P.titleCommand === 'true',
        ritualTimeoutSec: Math.max(0, num(P.ritualTimeoutSec, 0)),
        seedDaily: P.seedDailyRolls !== 'false',
        sharedMaps: parseIdSet(P.sharedMapIds === undefined ? '3,24,33,36,84,88,92,93,94,96,98,99,116,119,120,121,122,123,159,160,161,162,163,166,167,229,233,237,238,239,240,245,247,264,265,266,267' : P.sharedMapIds, 9999),
        sharedChannels: new Set(String(P.sharedSelfSwitches === undefined ? 'A' : P.sharedSelfSwitches).toUpperCase().split(',').map(s => s.trim()).filter(s => /^[A-D]$/.test(s))),
        sharedVars: (s => { parseIdSet('42,46-53,57-65,340,910', 999).forEach(i => s.add(i)); return s; })(parseIdSet(P.sharedVariableIds === undefined ? SCOPE.worldVars : P.sharedVariableIds, 9999)),   // the world's variables + the r_* rooms, 340 Mob Respawn Counter (§7h), 910 Clutter to Spawn (§7f)
        worldSwitches: (s => { SEEN_POPUPS.forEach(i => s.delete(i)); return s; })(parseIdSet(P.worldSwitchIds === undefined ? SCOPE.worldSwitches : P.worldSwitchIds, 9999)),
        playerSwitches: (s => { SEEN_POPUPS.forEach(i => s.add(i)); return s; })(parseIdSet(SCOPE.playerSwitches, 9999)),
        playerVars: parseIdSet(SCOPE.playerVars, 9999),
        bathCE: num(P.bathCommonEventId, 959),
        sleepSwitch: num(P.sleepSwitchId, 211),
        bedCounterVar: num(P.bedCounterVariableId, 1493),
        midnightCE: num(P.midnightCommonEventId, 507),
        tutorialSwitch: num(P.tutorialSwitchId, 507),
        sleepFromHour: Math.max(0, Math.min(23, num(P.sleepFromHour, 18))),
        sleepUntilHour: Math.max(0, Math.min(23, num(P.sleepUntilHour, 5))),
        ritualRunLimitMs: 900000,
        protocol: 3,
        maxMsgChars: 16384,
        syncMs: 50,
        silenceMs: 30000,          // in play (design §10.7); 30 s: a player loading a map can be busy for a while (decision 90)
        connectMs: 45000,
        reconnectMs: num(P.reconnectSeconds, 45) * 1000,   // a joiner's dropped connection: how long it keeps trying by itself (0: never)          // while connecting / transferring
        hostPingMs: 3000,
        virtualBase: 9000
    };

    // =====================================================================
    // 1. SESSION STATE MACHINE
    // =====================================================================
    const S = { MENU: 'MENU', HOSTING: 'HOSTING', CONNECTING: 'CONNECTING', SYNCHRONIZING: 'SYNCHRONIZING',
                PLAYING: 'PLAYING', DISCONNECTING: 'DISCONNECTING', ERROR: 'ERROR' };
    const ALLOWED = {
        MENU: ['HOSTING', 'CONNECTING', 'ERROR'],
        HOSTING: ['PLAYING', 'DISCONNECTING', 'ERROR'],
        CONNECTING: ['SYNCHRONIZING', 'DISCONNECTING', 'ERROR'],
        SYNCHRONIZING: ['PLAYING', 'DISCONNECTING', 'ERROR'],
        PLAYING: ['DISCONNECTING', 'ERROR'],
        DISCONNECTING: ['MENU', 'ERROR'],
        ERROR: ['DISCONNECTING', 'MENU']
    };

    // =====================================================================
    // 2. VALIDATION + ITEM HELPERS
    // =====================================================================
    /** Identifies the game build so different builds cannot join each other (design §10.5). */
    const gameVersion = () => (window.$dataSystem && $dataSystem.versionId) ? String($dataSystem.versionId) : '';
    /** Shared clock (design §3): the host's DK_Game_Time is the truth. The host sends it every 1 s (250 ms while
     *  time runs fast, e.g. during sleep); joiners snap when more than CLOCK_SNAP_SEC game-seconds apart and copy
     *  the host's speed ratio and pause state, so both clocks run at the same rate between messages. */
    const CLOCK_SNAP_SEC = 20;
    const Clock = {
        pending: null,
        gameLoaded() { return !!(window.$gameTime && window.$gameMap && $gameMap.mapId() > 0); },
        periodMs() { const t = window.$gameTime; return (t && Number(t.speedRatio) > 2) ? 250 : 1000; },
        snapshot() {
            const t = window.$gameTime;
            if (!t || !this.gameLoaded()) return null;
            return { y: t.year, mo: t.month, d: t.day, h: t.hour, mi: t.min, sec: t.sec, ms: t.ms, sr: Number(t.speedRatio) || 1, p: t.isPaused() ? 1 : 0 };
        },
        seconds(o) { return ((((o.y * 12 + o.mo) * 31 + o.d) * 24 + o.h) * 60 + o.mi) * 60 + o.sec; },
        /** Joiner: bring the local clock to the host's. Returns true if the time was set. */
        apply(o) {
            const t = window.$gameTime;
            if (!t || !this.gameLoaded()) return false;
            const cur = { y: t.year, mo: t.month, d: t.day, h: t.hour, mi: t.min, sec: t.sec };
            const diff = this.seconds(o) - this.seconds(cur);
            let set = false;
            if (diff > 0 && cur.h === 23 && (o.y !== cur.y || o.mo !== cur.mo || o.d !== cur.d)) {
                // Jumping over midnight would skip WTE's 00:00 trigger (moon, crops, shops...): land on 00:00 of the new
                // day instead and let the game's own midnight chain add its minutes and catch up with the host.
                t.year = o.y; t.month = o.mo; t.day = o.d; t.hour = 0; t.min = 0; t.sec = 0; t.ms = 0;
                this.midnightUntil = Date.now() + 6000;
                set = true;
            } else if (Math.abs(diff) > CLOCK_SNAP_SEC) {
                const catchingUp = Date.now() < (this.midnightUntil || 0) && diff > 0 && cur.h === 0 && o.h === 0 && o.d === cur.d;
                if (!catchingUp) {
                    t.year = o.y; t.month = o.mo; t.day = o.d; t.hour = o.h; t.min = o.mi; t.sec = o.sec;   // month before day: setters clamp
                    if (o.ms !== undefined) t.ms = o.ms;
                    set = true;
                }
            }
            if (o.sr !== undefined && Number(t.speedRatio) !== o.sr) t.speedRatio = o.sr;
            if (o.p === 1 && !t.isPaused()) t.pause(-1);
            else if (o.p === 0 && t.isPaused()) t.resume();          // in a session only the host pauses the shared clock
            return set;
        },
        /** Joiner, every frame: apply the newest host clock (if one arrived). */
        update() {
            if (!this.pending || !Net.isPlaying() || Net.isHost) return;
            if (this.apply(this.pending)) Diag.log('info', 'clock set to host time');
            this.pending = null;
        }
    };
    /** True only when a map is fully loaded (on the title screen or mid-transfer $dataMap is null). */
    const mapReady = () => !!(window.$dataMap && window.$gameMap && typeof Scene_Map !== 'undefined' &&
                              window.SceneManager && SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging());
    const isInt = (v, lo, hi) => Number.isInteger(v) && v >= lo && v <= hi;
    const isNum = (v, lo, hi) => typeof v === 'number' && Number.isFinite(v) && v >= lo && v <= hi;
    const cleanStr = (v, max) => (typeof v === 'string') ? v.replace(/[\u0000-\u001f<>]/g, '').slice(0, max) : '';
    const CHEST_RE = /^[A-Za-z0-9_-]{1,32}$/;
    const RITUAL_KINDS = ['sleep'];                 // the bath is each player's own (decision 130)
    const idList = v => Array.isArray(v) && v.length <= 8 && v.every(x => typeof x === 'string' && x.length <= 64) ? v.slice() : null;

    const Items = {
        tables: { item: () => window.$dataItems, weapon: () => window.$dataWeapons, armor: () => window.$dataArmors },
        get(k, id) { const f = this.tables[k]; const a = f && f(); return (a && a[id]) || null; },
        kindOf(o) { return DataManager.isItem(o) ? 'item' : DataManager.isWeapon(o) ? 'weapon' : 'armor'; },
        tradable(o) { return !!o && !!o.name && !(DataManager.isItem(o) && o.itypeId === 2); }, // key items never move
        /** Returns a sanitized list or null if anything is malformed. */
        clean(v) {
            if (!Array.isArray(v) || v.length > 12) return null;
            const seen = new Set(), out = [];
            for (const e of v) {
                if (!e || typeof e !== 'object') return null;
                if (!Object.prototype.hasOwnProperty.call(this.tables, e.k)) return null;
                if (!isInt(e.id, 1, 100000) || !isInt(e.n, 1, 999)) return null;
                const key = e.k + ':' + e.id;
                if (seen.has(key) || !this.tradable(this.get(e.k, e.id))) return null;
                seen.add(key); out.push({ k: e.k, id: e.id, n: e.n });
            }
            return out;
        }
    };

    // =====================================================================
    // 3. SESSION (one authority, many endpoints)
    // =====================================================================
    class Session {
        constructor() {
            this.ui = {};            // optional UI callbacks (status, peers, trade, chest)
            this.factory = null;     // transport factory override (tests)
            this._party = null;
            this.state = S.MENU;
            this.error = '';
            this.name = 'Player';
            this.reset();
        }

        get party() { return this._party || window.$gameParty; }
        isPlaying() { return this.state === S.PLAYING; }
        isMember(id) { return (this.isHost && id === this.selfId) || this.peers.has(id); }
        playerCount() { return this.peers.size + 1; }
        /** Rooms always equal the players who have ever joined this world (present or away) plus the host. */
        roomCount() { return this.slots.size + 1; }
        freeSlot() {
            const used = new Set(this.slots.values());
            for (let i = 1; i < CFG.maxPlayers; i++) if (!used.has(i)) return i;
            return 0;
        }
        /** Host-only snapshot stored inside the host's co-op save: who owns which room, and the communal chests. */
        exportSession() {
            if (!this.isHost) return null;
            const roster = [];
            this.slots.forEach((slot, id) => roster.push({ id, slot, name: (this.peers.get(id) || {}).name || this.slotNames.get(id) || '' }));
            const chests = [];
            this.chestStore.forEach((store, id) => chests.push([id, Array.from(store.entries())]));
            return { v: 1, roster, chests };
        }
        /** Restore the above into a fresh host session. Everything is validated; bad entries are skipped. */
        importSession(o) {
            if (!this.isHost || !o || o.v !== 1 || this.slots.size) return false;
            const usedSlots = new Set();
            (Array.isArray(o.roster) ? o.roster : []).slice(0, 32).forEach(r => {
                if (this.slots.size >= CFG.maxPlayers - 1) return;
                if (!r || typeof r.id !== 'string' || !r.id || r.id.length > 64 || r.id === this.selfId) return;
                if (!isInt(r.slot, 1, CFG.maxPlayers - 1) || usedSlots.has(r.slot) || this.slots.has(r.id)) return;
                usedSlots.add(r.slot); this.slots.set(r.id, r.slot); this.slotNames.set(r.id, cleanStr(r.name, 24));
            });
            (Array.isArray(o.chests) ? o.chests : []).slice(0, 64).forEach(c => {
                if (!Array.isArray(c) || typeof c[0] !== 'string' || !CHEST_RE.test(c[0]) || !Array.isArray(c[1])) return;
                const store = new Map();
                c[1].slice(0, 64).forEach(e => { if (Array.isArray(e) && /^[a-z]{1,12}:\d{1,6}$/.test(String(e[0])) && isInt(e[1], 1, 99999)) store.set(e[0], e[1]); });
                this.chestStore.set(c[0], store);
                this.chestView.set(c[0], Array.from(store.entries()).map(([key, n]) => ({ key, n })));
            });
            if (this.ui.peers) this.ui.peers(this);
            return true;
        }

        reset() {
            this.isHost = false; this.selfId = ''; this.hostId = ''; this.slot = 0; this.code = ''; this.codeLong = ''; this.netInfo = null; this.lastHostPing = 0;
            this.world = null; this.joinCtx = null; this.inWorld = false; this.closedByHost = false; this.playerId = ''; this.rxUploads = new Map(); this.lastUpload = 0; this.sendCharacterWhenIdle = false;
            this.myLooks = {}; this.sentLooks = {}; this.lastLookCn = ''; this.lastLookCheck = 0;
            this.rosterNames = null;
            this.saveSlot = 0; this.autosavePending = false;   // co-op save slot this player writes to, and a request to save when idle
            this.transport = null; this.peers = new Map(); this.lastSeq = new Map(); this.seq = 0;
            this.slots = new Map(); this.slotNames = new Map();   // stable player id -> reserved room/slot (kept while the player is away)
            this.chestStore = new Map(); this.chestView = new Map(); this.seenRid = new Map();
            this.pendingChest = new Map(); this.ridCounter = 0;
            this.trades = new Map(); this.localTrade = null; this.tradeCounter = 0;
            this.pendingWorld = null; this.lastWorldKey = ''; this.lastWorldSent = 0; this.lastHostSeen = 0;
            this.timers = []; this.joinTimer = null; this.lastSyncSent = 0; this.lastSyncKey = '';
            // group sleep (ritual): `ritual` is host-only truth, `rl` = my own wait, `rs` = what the host last published
            this.ritual = null; this.ritualCounter = 0; this.rl = null; this.rs = null;
            this.sessionSeed = null;       // shared by all players; drives the seeded midnight rolls
            this.pendingFlags = new Map(); // shared monster/room flags that arrived before the map scene existed
        }

        setState(next, err) {
            if (this.state === next) return false;
            if (!ALLOWED[this.state].includes(next)) {
                console.warn('[Elderfield MP] illegal state transition ' + this.state + ' -> ' + next);
                return false;
            }
            this.state = next;
            if (err !== undefined) this.error = err;
            if (this.ui.status) this.ui.status(this);
            return true;
        }

        // ---------- lifecycle ----------
        bind(t) {
            t.onMessage = (from, raw) => this.receive(from, raw);
            t.onPeerLeft = id => this.onTransportPeerLeft(id);
            t.onClosed = reason => { if (this.state !== S.DISCONNECTING && this.state !== S.MENU) this.fail(reason || 'Connection closed'); };
        }

        /** world = the co-op world record (CoopWorlds.newWorld / read). Joiners can only join a hosted world. */
        async host(world) {
            if (this.state === S.ERROR) this.leave();
            if (this.state !== S.MENU) return false;
            this.setState(S.HOSTING, '');
            this.isHost = true;
            this.world = world || null;
            this.sessionSeed = (Math.random() * 4294967296) >>> 0;
            let t;
            try {
                t = this.transport = (this.factory || defaultFactory)();
                this.bind(t);
                const info = await t.host(CFG.maxPlayers);
                if (this.transport !== t) return false;
                this.selfId = String(info.selfId); this.hostId = this.selfId; this.code = String(info.code); this.codeLong = String(info.long || ''); this.slot = 0;
                this.netInfo = info;                     // P2P: lan addresses, internet code, UPnP result (shown by the UI)
                this.startTimers();
                this.setState(S.PLAYING);
                return true;
            } catch (e) { if (this.transport === t) this.fail(e.message || String(e)); return false; }
        }

        async join(code) {
            code = cleanStr(String(code || ''), 64).trim();
            if (this.state === S.ERROR) { const rc = this.reconnecting; this.leave(); this.reconnecting = rc; }   // (a reconnect in progress goes on)
            if (!code) { this.fail('Enter a session code first.'); return false; }
            if (this.state !== S.MENU) return false;
            this.setState(S.CONNECTING, '');
            let t;
            try {
                t = this.transport = (this.factory || defaultFactory)();
                this.bind(t);
                const info = await t.join(code);
                if (this.transport !== t) return false;
                this.selfId = String(info.selfId); this.hostId = String(info.hostId); this.code = code;
                this.joinAddress = info.address ? info.address + ':' + info.port : '';
                this.lastHostSeen = Date.now();
                this.setState(S.SYNCHRONIZING);
                this.joinTimer = setTimeout(() => { if (this.state === S.SYNCHRONIZING) this.fail('The host did not answer the join request.'); }, CFG.connectMs);
                this.send(this.hostId, { t: 'JOIN_REQUEST', ver: CFG.protocol, gv: gameVersion(), name: this.name, mods: Mods.stamp() });
                return true;
            } catch (e) { if (this.transport === t) this.fail(e.message || String(e)); return false; }
        }

        fail(msg) {
            Diag.log('error', 'session failed: ' + msg);
            if (!this.isHost && this.inWorld && !this.closedByHost && CFG.reconnectMs > 0 && !this.reconnecting) return this.startReconnect(msg);
            const sendHome = !this.isHost && this.inWorld;          // a joiner already inside the host's world
            this.teardown();
            this.setState(S.ERROR, msg);
            if (sendHome) { Notice.set(msg); try { GameBridge.toTitle(); } catch (e) { Diag.err('return to title', e); } }   // decision 34
        }

        // ---------- automatic reconnect (user, 2026-11-02) ----------
        // A joiner whose connection drops (Wi-Fi, a router, Steam: not the host closing the world) isn't sent to the title:
        // the game says so, holds them where they stand, and joins the same host again every few seconds for
        // CFG.reconnectMs, as the same character (their key: no menu), carrying what they had at the drop (newer than
        // the host's last checkpoint). Only if that runs out does it go to the title, as before (decision 34).
        startReconnect(msg) {
            let data = null; try { data = PlayerData.capture(this.name); } catch (e) { Diag.err('my data at the drop', e); }
            this.reconnecting = { target: this.code, name: this.name, data, since: Date.now(), tries: 0, why: msg };
            this.teardown();
            this.setState(S.ERROR, msg);
            Diag.log('warn', 'connection lost (' + msg + '): reconnecting');
            this.reconnectTick();
        }
        async reconnectTick() {
            const r = this.reconnecting; if (!r) return;
            if (Date.now() - r.since > CFG.reconnectMs) return this.reconnectGiveUp();
            r.tries++;
            Diag.toast('Connection lost. Reconnecting... (' + r.tries + ')', 3500);
            this.name = r.name;
            try { await this.join(r.target); } catch (e) { /* tried */ }
            const t0 = Date.now();
            while (this.reconnecting === r && !this.inWorld && (this.state === S.CONNECTING || this.state === S.SYNCHRONIZING) && Date.now() - t0 < 30000) await new Promise(res => setTimeout(res, 400));
            if (this.reconnecting !== r) return;
            if (this.inWorld && this.state === S.PLAYING) {
                this.reconnecting = null; this.reconnects = (this.reconnects || 0) + 1;
                Diag.toast('Reconnected.', 3000);
                Diag.log('info', 'reconnected after ' + r.tries + ' tr' + (r.tries > 1 ? 'ies' : 'y'));
                setTimeout(() => { if (this.inWorld) this.uploadPlayerData('reconnect'); }, 3000);   // the host gets what I had at the drop
                return;
            }
            setTimeout(() => this.reconnectTick(), 3000);
        }
        reconnectGiveUp() {
            const r = this.reconnecting; this.reconnecting = null;
            Diag.log('error', 'could not reconnect: ' + r.why);
            this.teardown();
            this.setState(S.ERROR, r.why);
            Notice.set(r.why + ' (could not reconnect)');
            try { GameBridge.toTitle(); } catch (e) { Diag.err('return to title', e); }
        }

        leave() {
            this.reconnecting = null;
            if (this.state === S.MENU) return;
            if (this.state !== S.DISCONNECTING) this.setState(S.DISCONNECTING);
            if (this.transport) {
                try {
                    if (this.isHost) this.broadcast({ t: 'SESSION_CLOSED' });
                    else if (this.hostId) { if (this.inWorld) this.uploadPlayerData('leave'); this.send(this.hostId, { t: 'LEAVE' }); }
                } catch (e) { /* closing anyway */ }
            }
            this.teardown();
            this.setState(S.MENU, '');
        }

        teardown() {
            this.abortLocalTrade('Session ended');
            this.pendingChest.forEach(p => { if (p.op === 'deposit') this.give(p.list); });
            this.timers.forEach(clearInterval);
            if (this.joinTimer) clearTimeout(this.joinTimer);
            const t = this.transport;
            if (t) { t.onMessage = t.onPeerLeft = t.onClosed = null; try { t.close(); } catch (e) { /* ignore */ } }
            this.reset();
            try { WorldObjects.reset(); Night.reset(); Spawns.reset(); Scenes.reset(); Mobs.reset(); Uses.reset(); Progress.reset(); Opening.reset(); Festival.reset(); Invites.reset(); Chat.reset(); Ping.reset(); Desync.reset(); Story.reset(); Duel.reset(); Perks.reset(); Gates.reset(); Bosses.reset(); Walkers.reset(); Marriages.reset(); Wedding.reset(); Fair.reset(); Mentions.reset(); Balances.reset(); Tools.reset(); MoonSync.reset(); Death.reset(); Counters.reset(); BgmSync.reset(); OneSound.reset(); Clock.pending = null; } catch (e) { /* defined later; nothing to clear yet */ }
            try { if (window.$gameSwitches && $gameSwitches.value(Rooms.SWITCH)) $gameSwitches.setValue(Rooms.SWITCH, false); } catch (e) { /* no game */ }
            if (this.ui.peers) this.ui.peers(this);
        }

        startTimers() {
            this.lastHostSeen = Date.now();
            this.timers.push(setInterval(() => this.housekeeping(), 250));
        }

        housekeeping() {
            const now = Date.now();
            if (this.state === S.PLAYING) { WorldObjects.flushSelf(now); Shared.flushLocal(now); Progress.tick(now); Uses.keepAlive(now); Ping.tick(now); Duel.hostTick(now); Wedding.frame(now); }
            if (Chat.lines.length || Chat.typing) { Chat.render(false); Chat.place(); }   // notes fade and move on every screen (battles, menus)   // shared changes, also while a menu or a battle is open
            // a minimized or covered window pauses the game's drawing loop (and with it the position updates): keep the link
            // alive from this timer, so alt-tabbing never drops a player
            if (this.state === S.PLAYING && !this.isHost && this.hostId && now - Math.max(this.lastSyncSent || 0, this.lastPing || 0) > 3000) { this.lastPing = now; this.send(this.hostId, { t: 'PING' }); }
            if (this.state === S.SYNCHRONIZING && !this.isHost) {        // joiner receiving/loading the world: keep the link alive
                if (now - this.lastHostSeen > CFG.connectMs) { this.fail('The host stopped responding while sending the world.'); return; }
                if (now - (this.lastPing || 0) > 3000) { this.lastPing = now; this.send(this.hostId, { t: 'PING' }); }
                return;
            }
            if (this.state !== S.PLAYING) return;
            if (!this.isHost && this.inWorld && now - this.lastUpload > 120000) this.uploadPlayerData('periodic');
            else if (!this.isHost && this.inWorld && now - this.lastUpload > 15000 && now - (this.lastPocketCheck || 0) > 5000 && window.$gameParty && !$gameParty.inBattle()) {
                this.lastPocketCheck = now;                                   // my pockets or level changed: a checkpoint soon, so a crash loses seconds, not minutes
                const key = this.pocketKey();
                if (this.lastPocketKey === undefined) this.lastPocketKey = key;
                else if (key !== this.lastPocketKey && this.uploadPlayerData('change')) this.lastPocketKey = key;
            }
            if (this.isHost || this.inWorld) Perks.tick(this, now);
            if (this.isHost) {
                this.peers.forEach((p, id) => { if (now - p.lastSeen > CFG.silenceMs) this.dropPeer(id, 'timed out'); });
                if (now - (this.lastHostPing || 0) > CFG.hostPingMs) { this.lastHostPing = now; this.broadcast({ t: 'HPING' }); }
                if (CFG.syncTime && now - (this.lastClockSent || 0) >= Clock.periodMs()) {        // design §3: host clock every 1 s (250 ms when fast)
                    const c = Clock.snapshot();
                    if (c) { this.lastClockSent = now; this.broadcast(Object.assign({ t: 'CLOCK' }, c)); }
                }
                this.ritualTimers(now);
                const w = this.captureWorld();
                if (w) {
                    const key = w.wt + ':' + w.wp;                 // weather change => immediate; clock rides the 5 s heartbeat
                    if (key !== this.lastWorldKey || now - this.lastWorldSent > 5000) {
                        this.lastWorldKey = key; this.lastWorldSent = now;
                        this.broadcast(Object.assign({ t: 'WORLD_STATE' }, w));
                    }
                }
            } else {
                if (now - this.lastHostSeen > CFG.silenceMs) { this.fail('Lost connection to the host.'); return; }
                if (now - (this.lastPing || 0) > 3000) { this.lastPing = now; this.send(this.hostId, { t: 'PING' }); }
            }
        }

        onTransportPeerLeft(id) {
            if (this.isHost) this.dropPeer(id, 'left');
            else if (id === this.hostId) this.fail('The host closed the connection.');
        }

        // ---------- players of this world (host) / my player (joiner) ----------
        /** Joiner: send my player's data to the host (checkpoint). Only when no event is running. */
        uploadPlayerData(why) {
            if (this.isHost || !this.inWorld || !this.hostId) return false;
            this.lastUpload = Date.now();
            try {
                if (why !== 'leave' && window.$gameMap && $gameMap.isEventRunning && $gameMap.isEventRunning()) return false;
                const packed = Xfer.pack({ player: PlayerData.capture(this.name) });
                this.send(this.hostId, { t: 'UP_BEGIN', id: packed.id, n: packed.n, sha: packed.sha, why: String(why).slice(0, 12) });
                Xfer.send(this, this.hostId, 'UP_CHUNK', packed);
                Profile.save(PlayerData.actorName() || this.name, PlayerData.look());   // this PC remembers its character for other worlds
                return true;
            } catch (e) { Diag.err('player data upload', e); return false; }
        }
        /** Host: ask every joiner in the world for fresh player data; resolves when all answered or after timeoutMs. */
        collectUploads(timeoutMs) {
            if (!this.isHost) return Promise.resolve();
            const since = Date.now(), waitFor = [];
            this.peers.forEach((p, id) => { if (!p.loading) { waitFor.push(id); this.send(id, { t: 'UP_REQ' }); } });
            return new Promise(resolve => {
                const tick = setInterval(() => {
                    const done = waitFor.every(id => { const r = this.rosterOf(id); return !r || !this.peers.has(id) || (r.lastSeen >= since && r.data); });
                    if (done || Date.now() - since > timeoutMs) { clearInterval(tick); resolve(); }
                }, 100);
            });
        }
        /** Host: the roster entry a connected peer is bound to. */
        rosterOf(id) { const p = this.peers.get(id); return p && this.world ? this.world.roster.find(r => r.playerId === p.playerId) : null; }
        rosterFreeSlot() {
            const used = new Set(this.world.roster.map(r => r.slot));
            for (let s = 1; s < (this.world.maxPlayers || CFG.maxPlayers); s++) if (!used.has(s)) return s;
            return 0;
        }

        /** Joiner: what a checkpoint would save that changes often (items, gear, level). */
        pocketKey() {
            try {
                const p = window.$gameParty, a = p && p.leader && p.leader();
                return p ? JSON.stringify([p._items, p._weapons, p._armors, a ? [a.level, a.currentExp()] : 0]) : '';
            } catch (e) { return ''; }
        }
        /** Host: a player who drops without a goodbye (a crash, a closed window) comes back where they were last seen, today,
         *  not at their last checkpoint (up to 2 minutes old). Only the spot changes; the rest of their data stays as uploaded. */
        keepLastSpot(r, p) {
            const st = p.state;
            if (!r.data || p.loading || !st || !isInt(st.map, 1, 99999)) return;
            try {
                const d = JSON.parse(r.data); if (!d || d.v !== 1) return;
                const map = st.map > CFG.virtualBase && CFG.templateMapId ? CFG.templateMapId : st.map;   // their own room: the room map
                if (!isInt(map, 1, 9999)) return;
                d.pos = { map, x: Math.round(st.x), y: Math.round(st.y), dir: st.dir || 2 };
                d.day = window.$gameVariables ? $gameVariables.value(250) : d.day;
                r.data = JSON.stringify(d);
            } catch (e) { /* the uploaded spot stays */ }
        }
        dropPeer(id, why) {
            if (!this.peers.has(id)) return;
            this.trades.forEach(s => { if (s.ids.includes(id)) this.abortSession(s, 'Partner disconnected'); });
            const r = this.rosterOf(id), gone = this.peers.get(id);
            if (r && gone) this.keepLastSpot(r, gone);
            if (r) { r.lastSeen = Date.now(); CoopWorlds.saveRoster(this.world); }
            if (gone && gone.name && !gone.loading) { if (this.ui.notice) this.ui.notice(gone.name + ' left.'); Chat.system(gone.name + ' left.'); }
            this.peers.delete(id);
            this.lastSeq.delete(id);
            this.rxUploads.delete(id);
            this.broadcast({ t: 'PEER_LEFT', id });
            this.ritualMemberGone(id);           // a vanished player must never hold a group sleep hostage
            WorldObjects.releaseAllOf(id);       // ...or a chest
            Night.memberGone();                  // ...or the night
            console.log('[Elderfield MP] peer ' + id + ' removed (' + why + ')');
            if (this.ui.peers) this.ui.peers(this);
        }

        // ---------- messaging ----------
        send(to, msg) {
            if (!this.transport && to !== this.selfId) return;
            msg.q = ++this.seq; msg.s = this.selfId;
            const raw = JSON.stringify(msg);
            if (raw.length > CFG.maxMsgChars) { console.warn('[Elderfield MP] outgoing message too large: ' + msg.t); return; }
            if (to === this.selfId) { setTimeout(() => this.receive(this.selfId, raw), 0); return; }
            try { this.transport.send(to, raw); } catch (e) { console.warn('[Elderfield MP] send failed', e); }
        }
        sendTo(id, msg) { this.send(id, msg); }
        broadcast(msg, exceptId) {
            if (!this.isHost) return;
            this.peers.forEach((p, id) => { if (id !== exceptId) this.send(id, Object.assign({}, msg)); });
        }

        receive(from, raw) {
            if (typeof raw !== 'string' || raw.length > CFG.maxMsgChars) return;
            let m;
            try { m = JSON.parse(raw); } catch (e) { return; }
            if (!m || typeof m !== 'object' || typeof m.t !== 'string' || !isInt(m.q, 0, 1e12)) return;
            from = String(from);
            const h = Object.prototype.hasOwnProperty.call(H, m.t) ? H[m.t] : null;
            if (!h) return;
            if (!h.pre && this.state !== S.PLAYING) return;
            if (h.dir === 'h2c') { if (from !== this.hostId) return; }
            else if (h.dir === 'c2h') {
                if (!this.isHost) return;
                if (!h.open && !this.isMember(from)) return;
            }
            if (m.t !== 'JOIN_REQUEST') {
                if (from !== this.selfId) {
                    if ((this.lastSeq.get(from) || 0) >= m.q) return;   // duplicate / replay / reorder
                    this.lastSeq.set(from, m.q);
                }
            } else this.lastSeq.set(from, m.q);
            if (this.isHost) { const p = this.peers.get(from); if (p) p.lastSeen = Date.now(); }
            else if (from === this.hostId) this.lastHostSeen = Date.now();
            try {
                const r = h.fn(this, from, m);
                if (r && typeof r.catch === 'function') r.catch(e => console.error('[Elderfield MP] handler error in ' + m.t, e));
            } catch (e) { console.error('[Elderfield MP] handler error in ' + m.t, e); }
        }

        // ---------- world ----------
        captureWorld() {
            if (!window.$gameScreen) return null;
            const w = { wt: String(window.$gameScreen.weatherType()), wp: Math.round(window.$gameScreen.weatherPower()) };
            const t = window.$gameTime;
            if (CFG.syncTime && t) Object.assign(w, { y: t.year, mo: t.month, d: t.day, h: t.hour, mi: t.min, sec: t.sec });   // not "s": the envelope uses s = sender
            return w;
        }
        applyWorld() {
            const w = this.pendingWorld;
            if (!w || !window.$gameScreen) return;
            this.pendingWorld = null;
            // the clock itself now comes from the 1-second CLOCK message (Clock.apply); this only handles the join snapshot
            if (CFG.syncTime && w.y !== undefined) Clock.apply({ y: w.y, mo: w.mo, d: w.d, h: w.h, mi: w.mi, sec: w.sec, ms: 0 });
            if (window.$gameScreen.weatherType() !== w.wt || window.$gameScreen.weatherPower() !== w.wp)
                window.$gameScreen.changeWeather(w.wt, w.wp, 0);
        }

        // ---------- players ----------
        tickPlayer(now) {
            if (this.state !== S.PLAYING || !window.$gamePlayer || !window.$gameMap) return;
            const p = window.$gamePlayer;
            // a new pose goes at once (a harvest's or a swing's frame can be shorter than the 50 ms between updates, and
            // was then never seen on the others' screens); otherwise every 50 ms
            const pose = p.characterName() + '#' + p.characterIndex() + ':' + p.pattern() + ':' + p.direction();
            if (now - this.lastSyncSent < (pose !== this.lastPose ? 15 : CFG.syncMs)) return;
            this.lastPose = pose;
            // the drawn position and the exact frame shown (action index + animation frame), so others replay it instead of guessing
            const st = { map: Locator.local(), x: Math.round(p._realX * 1000) / 1000, y: Math.round(p._realY * 1000) / 1000, dir: p.direction(),
                         cn: p.characterName(), ci: p.characterIndex(), pt: p.pattern(), vis: (p.isTransparent() || p.opacity() === 0 || Night.isRunningCE(PlayerData.CUSTOMISER_CE)) ? 0 : 1,
                         bz: Night.busy() ? 1 : 0,      // in a scene/message (the 23:59 hold waits for it)
                         hd: (Scenes.isWaiting() || Festival.isWaiting() || Story.isWaiting()) ? 1 : 0,   // a scene of mine is waiting for the others: never wait for me (no two players waiting on each other)
                         fi: Night.fishing() ? 1 : 0,      // fishing: nobody waits for me (decision 54)
                         fb: Night.bobber(),               // where my bobber floats (0: none), so the others see me fish
                         bg: BgmSync.mine(),               // my background track and when it started on the shared clock (decision 94)
                         mc: OneSound.machine(),           // which computer I run on: one soundtrack per computer (decision 94)
                         bs: OneSound.sounds() };          // my background sounds (BGS, BGS2): the same rain plays once per computer             // my background track and when it started on the shared clock (decision 94)
            const key = JSON.stringify(st);
            if (key === this.lastSyncKey && now - this.lastSyncSent < 1000) return;
            this.lastSyncKey = key; this.lastSyncSent = now;
            if (this.isHost) this.broadcast(Object.assign({ t: 'PLAYER_STATE', id: this.selfId }, st));
            else this.send(this.hostId, Object.assign({ t: 'PLAYER_SYNC' }, st));
            this.tickLook(now, st.cn);
        }
        validState(m) {
            return isInt(m.map, 1, 99999) && isNum(m.x, -1, 1000) && isNum(m.y, -1, 1000) && [2, 4, 6, 8].includes(m.dir) &&
                   typeof m.cn === 'string' && m.cn.length <= 96 && isInt(m.ci, 0, 7) &&
                   (m.pt === undefined || isInt(m.pt, 0, 15)) && (m.vis === undefined || m.vis === 0 || m.vis === 1) && (m.bz === undefined || m.bz === 0 || m.bz === 1) && (m.hd === undefined || m.hd === 0 || m.hd === 1) && (m.fi === undefined || m.fi === 0 || m.fi === 1) && (m.fb === undefined || m.fb === 0 || (Array.isArray(m.fb) && m.fb.length === 3 && isInt(m.fb[0], 0, 999) && isInt(m.fb[1], 0, 999) && [2, 4, 6, 8].includes(m.fb[2]))) && BgmSync.valid(m.bg) && OneSound.validMc(m.mc) && OneSound.validBs(m.bs);
        }
        applyPlayerState(id, m) {
            const p = this.peers.get(id);
            if (!p || !this.validState(m)) return;
            p.state = { map: m.map, x: m.x, y: m.y, dir: m.dir, cn: m.cn, ci: m.ci, pt: m.pt === undefined ? 1 : m.pt, vis: m.vis === undefined ? 1 : m.vis, bz: m.bz === 1 ? 1 : 0, hd: m.hd === 1 ? 1 : 0, fi: m.fi === 1 ? 1 : 0, fb: Array.isArray(m.fb) ? m.fb : 0, bg: Array.isArray(m.bg) ? m.bg : 0, mc: typeof m.mc === 'string' ? m.mc : '', bs: Array.isArray(m.bs) ? m.bs : 0 };
            if (!mapReady()) return;                 // still on the title / loading a map: keep the state, place the sprite later
            if (!p.char && RemoteChar) { p.char = new RemoteChar(); p.char._coopPeer = p; }
            if (p.char) p.char.remoteState(p.state);
            if (p.state.fb && !p.bobChar && BobberChar) p.bobChar = new BobberChar();
            if (p.bobChar) p.bobChar.bob(p.state);
        }
        /** Place any remote players whose state arrived before this game had a map (called from Scene_Map.update). */
        flushRemoteStates() {
            if (!mapReady()) return;
            this.peers.forEach(p => {
                if (p.state && !p.char && RemoteChar) { p.char = new RemoteChar(); p.char._coopPeer = p; p.char.remoteState(p.state); }
            });
        }
        /** My look as other players must draw it: the flattened composite layers of the sheet I'm using now.
         *  Sent when it changes (customiser, bike set-up, clothes); the host re-sends every look to newcomers. */
        tickLook(now, cn) {
            // decision 105: all my poses, not just the one in use; checked every half second (only changed ones are sent), so a
            // look rebuilt a moment ago (clothes, the customiser) is there before my next short pose (2026-11-04: a joiner's
            // first watering, seconds after dressing, was never seen on the host's screen)
            if (now - (this.lastAllLooks || 0) > 500) {
                this.lastAllLooks = now;
                const kc = Looks.kc();
                if (kc && kc.tvCharLayers) Object.keys(kc.tvCharLayers).filter(k => /__PROXY$/.test(k) && k !== cn).slice(0, 24).forEach(k => {
                    const l = Looks.layersOf(k); if (!l) return;
                    const j = JSON.stringify(l); this.sentLooks = this.sentLooks || {}; if (this.sentLooks[k] === j) return;
                    this.sentLooks[k] = j; this.myLooks = this.myLooks || {}; this.myLooks[k] = l;
                    if (this.isHost) this.broadcast({ t: 'PLOOKS', id: this.selfId, cn: k, layers: l });
                    else this.send(this.hostId, { t: 'PLOOK', cn: k, layers: l });
                });
            }
            if (cn === this.lastLookCn && now - (this.lastLookCheck || 0) < 1000) return;
            this.lastLookCheck = now; this.lastLookCn = cn;
            const layers = Looks.layersOf(cn);
            if (!layers) return;
            const json = JSON.stringify(layers);
            this.sentLooks = this.sentLooks || {};
            if (this.sentLooks[cn] === json) return;
            this.sentLooks[cn] = json;
            this.myLooks = this.myLooks || {};
            this.myLooks[cn] = layers;
            if (this.isHost) this.broadcast({ t: 'PLOOKS', id: this.selfId, cn, layers });
            else this.send(this.hostId, { t: 'PLOOK', cn, layers });
        }
        applyLook(id, cn, layers) {
            const p = this.peers.get(id);
            const clean = Looks.clean(cn, layers);
            if (!p || !clean) return null;
            p.looks = p.looks || {};
            p.looks[cn] = clean;
            try { Looks.bitmapFor(id, cn, clean); } catch (e) { /* built when first used */ }   // decision 105
            try { ImageManager.loadCharacter(cn); } catch (e) { /* loaded when first used */ }   // the sheet itself too: a first swing of a tool is shown, not lost while its sheet loads (user, 2026-11-03)
            if (p.char) p.char._lookRev = (p.char._lookRev || 0) + 1;
            return clean;
        }
        /** Host: give a newcomer every look already known (mine and each other player's). */
        sendLooksTo(to) {
            Object.keys(this.myLooks || {}).forEach(cn => this.send(to, { t: 'PLOOKS', id: this.selfId, cn, layers: this.myLooks[cn] }));
            this.peers.forEach((p, id) => { if (id !== to) Object.keys(p.looks || {}).forEach(cn => this.send(to, { t: 'PLOOKS', id, cn, layers: p.looks[cn] })); });
        }

        // ---------- shared day-end ritual: group sleep (the bath is each player's own, decision 130) ----------
        nameOf(id) { const p = this.peers.get(id); return (p && p.name) || (id === this.selfId ? this.name : 'a player'); }
        ritualActive() { return this.state === S.PLAYING && this.playerCount() >= 2; }
        ritualMembers() { return [this.selfId].concat(Array.from(this.peers.keys())); }
        ritualUi(msg) { if (this.ui.ritual) this.ui.ritual(this, msg || ''); }
        ritualCast(msg) { this.broadcast(msg); this.send(this.selfId, Object.assign({}, msg)); }   // everyone, host included

        // endpoint (every player, host included)
        /** I want to sleep now. The game's own sequence must wait until ritualPhase() === 'go'. */
        ritualReady(kind) {
            if (!this.ritualActive() || !RITUAL_KINDS.includes(kind)) return false;
            const cur = this.rl;
            if (cur && (cur.phase === 'go' || cur.phase === 'finishing')) return false;   // my previous group action is still running
            if (cur && cur.phase === 'ready' && cur.kind === kind) return true;           // already waiting: idempotent
            this.rl = { kind, phase: 'ready', token: 0, msg: '' };
            this.send(this.hostId, { t: 'RITUAL_READY', kind });
            this.ritualUi();
            return true;
        }
        ritualCancel(kind) {
            if (this.rl && this.rl.kind === kind && this.rl.phase === 'ready') this.send(this.hostId, { t: 'RITUAL_CANCEL', kind });
            if (this.rl && this.rl.kind === kind && this.rl.phase === 'ready') this.rl = null;
            this.ritualUi();
        }
        /** My local sleep sequence finished. */
        ritualDone(kind) {
            const rl = this.rl;
            if (!rl || rl.kind !== kind || rl.phase !== 'go') return;
            rl.phase = 'finishing';
            this.send(this.hostId, { t: 'RITUAL_DONE', kind, token: rl.token });
            this.ritualUi();
        }
        ritualPhase(kind) { return (this.rl && this.rl.kind === kind) ? this.rl.phase : ''; }

        // host
        ritualRequest(from, kind) {
            const r = this.ritual;
            if (r && r.kind !== kind) return this.send(from, { t: 'RITUAL_DENY', reason: 'Someone is already waiting. Finish that first.' });
            if (r && r.phase === 'run') return this.send(from, { t: 'RITUAL_DENY', reason: 'That is already happening. Wait for it to finish.' });
            if (!r) this.ritual = { kind, phase: 'gather', ready: new Set(), done: new Set(), members: [], token: 0, since: Date.now(), runSince: 0 };
            this.ritual.ready.add(from);
            this.ritualPublish();
            this.ritualCheck();
        }
        ritualRetract(from, kind) {
            const r = this.ritual;
            if (!r || r.phase !== 'gather' || r.kind !== kind || !r.ready.delete(from)) return;
            if (r.ready.size === 0) this.ritual = null;
            this.ritualPublish();
        }
        ritualPublish() {
            const r = this.ritual;
            this.ritualCast(r
                ? { t: 'RITUAL_STATE', kind: r.kind, phase: r.phase, ready: Array.from(r.ready), need: this.ritualMembers().filter(id => !r.ready.has(id)),
                    left: r.until && r.phase === 'gather' ? Math.max(0, r.until - Date.now()) : 0 }
                : { t: 'RITUAL_STATE', kind: '', phase: '', ready: [], need: [] });
        }
        sleepWindowOpen() {
            const w = this.captureWorld();
            if (!w || w.h === undefined) return true;            // no readable clock: the game's own hour check already ran
            return CFG.sleepFromHour <= CFG.sleepUntilHour
                ? (w.h >= CFG.sleepFromHour && w.h <= CFG.sleepUntilHour)
                : (w.h >= CFG.sleepFromHour || w.h <= CFG.sleepUntilHour);
        }
        ritualCheck() {
            const r = this.ritual;
            if (!r || r.phase !== 'gather') return;
            const members = this.ritualMembers();
            if (!members.every(id => r.ready.has(id))) return;
            if (r.kind === 'sleep' && !this.sleepWindowOpen()) return this.ritualAbort('It is no longer night. Try again after ' + CFG.sleepFromHour + ':00.');
            r.phase = 'run'; r.members = members; r.token = ++this.ritualCounter; r.runSince = Date.now();
            this.ritualPublish();
            this.ritualCast({ t: 'RITUAL_GO', kind: r.kind, token: r.token, world: this.captureWorld() });
        }
        ritualAbort(reason) {
            const r = this.ritual; if (!r) return;
            this.ritual = null;
            this.ritualCast({ t: 'RITUAL_ABORT', kind: r.kind, reason });
            this.ritualPublish();
        }
        ritualDoneFrom(from, kind, token) {
            const r = this.ritual;
            if (!r || r.phase !== 'run' || r.kind !== kind || r.token !== token || !r.members.includes(from)) return;
            r.done.add(from);
            this.ritualMaybeFinish();
        }
        ritualMaybeFinish() {
            const r = this.ritual;
            if (!r || r.phase !== 'run') return;
            if (r.members.filter(id => this.isMember(id)).every(id => r.done.has(id))) this.ritualFinish();
        }
        ritualFinish() {
            const r = this.ritual; if (!r) return;
            this.ritual = null;
            this.ritualCast({ t: 'RITUAL_COMPLETE', kind: r.kind, token: r.token, world: this.captureWorld() });
            this.ritualPublish();
        }
        ritualMemberGone(id) {
            const r = this.ritual; if (!r) return;
            r.ready.delete(id); r.done.delete(id);
            if (r.phase === 'gather') {
                if (r.ready.size === 0) this.ritual = null;
                this.ritualPublish(); this.ritualCheck();
            } else this.ritualMaybeFinish();
        }
        ritualTimers(now) {
            const r = this.ritual; if (!r) return;
            // decision 38: nobody is ever sent to bed. Whoever stays up gets WTE's own sleepless effects at midnight;
            // if morning comes before everyone went to bed, the ones waiting get up again
            if (r.kind === 'sleep' && r.phase === 'gather' && !this.sleepWindowOpen()) return this.ritualAbort('Morning came before everyone went to bed.');
            if (r.phase === 'gather' && CFG.ritualTimeoutSec > 0 && now - r.since > CFG.ritualTimeoutSec * 1000) this.ritualAbort('Not everyone was ready in time.');
            else if (r.phase === 'run' && now - r.runSince > CFG.ritualRunLimitMs) this.ritualFinish();   // never hold the world hostage
        }

        // ---------- shared monster / room flags ----------
        flagChanged(entry) {
            if (!this.isPlaying()) return;
            if (this.isHost) this.broadcast({ t: 'FLAG_SET', e: entry });
            else this.send(this.hostId, { t: 'FLAG_PUSH', e: entry });
        }
        flagsChanged(list) {
            if (!this.isPlaying() || !list.length) return;
            if (this.isHost) this.broadcast({ t: 'FLAG_BULK', list });
            else this.send(this.hostId, { t: 'FLAG_LIST', list });
        }
        sendFlagSnapshot(to) {
            const all = Shared.snapshot();
            for (let i = 0; i < all.length; i += 250) this.send(to, { t: 'FLAG_BULK', list: all.slice(i, i + 250) });
        }

        // ---------- inventory primitives (use the game's real party/item data) ----------
        objs(list) { return list.map(e => ({ o: Items.get(e.k, e.id), n: e.n })); }
        has(list) { return this.objs(list).every(e => e.o && this.party.numItems(e.o) >= e.n); }
        /** Capacity check that follows DM_LimitedInventory (this game: "Slot Based"): stack cap + total slots/weight. */
        canHold(list) {
            const gc = window.$gameContainers, LI = window.Dungeonmind && window.Dungeonmind.LI;
            if (gc && LI && typeof gc.getCurrentPartyInventoryWeight === 'function') {
                let w = gc.getCurrentPartyInventoryWeight();
                const max = gc.getCurrentPartyInventoryMaxWeight();
                for (const e of this.objs(list)) {
                    if (!e.o) return false;
                    const have = this.party.numItems(e.o);
                    if (have + e.n > LI.itemMaxDefault) return false;
                    const iw = (e.o.meta && e.o.meta.itemWeight !== undefined) ? Number(e.o.meta.itemWeight) : 1;
                    if (LI.inventoryType === 'Item Weight') w += iw * e.n; else if (have === 0) w += iw;   // slot mode: a new stack costs a slot
                }
                return w <= max;
            }
            return this.objs(list).every(e => e.o && this.party.numItems(e.o) + e.n <= this.party.maxItems(e.o));
        }
        take(list) { this.objs(list).forEach(e => this.party.loseItem(e.o, e.n, false)); }
        give(list) { this.objs(list).forEach(e => e.o && this.party.gainItem(e.o, e.n, false)); }

        // ---------- trade: endpoint API ----------
        tradeRequest(target) {
            if (!this.isPlaying() || this.localTrade || !this.peers.has(target) && !(target === this.hostId)) return false;
            this.localTrade = { phase: 'waiting', partner: target };
            this.sendTo(this.hostId, { t: 'TRADE_REQUEST', to: target });
            this.tradeUi(); return true;
        }
        tradeAnswer(accept) {
            const lt = this.localTrade;
            if (!lt || lt.phase !== 'invited') return;
            this.sendTo(this.hostId, { t: 'TRADE_ANSWER', tid: lt.tid, accept: !!accept });
            if (accept) lt.phase = 'accepted'; else { this.localTrade = null; this.tradeUi(); }
        }
        tradeSetOffer(list) {
            const lt = this.localTrade;
            if (!lt || lt.phase !== 'open') return false;
            const c = Items.clean(list);
            if (!c || !this.has(c)) return false;
            this.sendTo(this.hostId, { t: 'TRADE_OFFER', tid: lt.tid, items: c });
            return true;
        }
        tradeConfirm() {
            const lt = this.localTrade;
            if (!lt || lt.phase !== 'open') return;
            lt.confirmed = true;
            this.sendTo(this.hostId, { t: 'TRADE_CONFIRM', tid: lt.tid, ver: lt.ver });
            this.tradeUi();
        }
        tradeCancel() {
            const lt = this.localTrade;
            if (!lt) return;
            if (lt.tid) this.sendTo(this.hostId, { t: 'TRADE_CANCEL', tid: lt.tid });
            this.abortLocalTrade('Trade cancelled');
        }
        abortLocalTrade(reason) {
            const lt = this.localTrade;
            if (!lt) return;
            if (lt.escrow) this.give(lt.escrow);        // return locked items
            this.localTrade = null;
            this.tradeUi(reason);
        }
        tradeUi(msg) { if (this.ui.trade) this.ui.trade(this, msg || ''); }
        tradeOf(id) { for (const s of this.trades.values()) if (s.ids.includes(id)) return s; return null; }
        abortSession(s, reason) {
            this.trades.delete(s.tid);
            s.ids.forEach(id => { if (this.isMember(id)) this.sendTo(id, { t: 'TRADE_ABORT', tid: s.tid, reason }); });
        }

        // ---------- communal chests ----------
        chestOp(op, chestId, k, id, n) {
            if (!this.isPlaying() || !CHEST_RE.test(chestId || '') || (op !== 'deposit' && op !== 'withdraw')) return false;
            const list = Items.clean([{ k, id, n }]);
            if (!list) return false;
            if (op === 'deposit') { if (!this.has(list)) return false; this.take(list); }
            else if (!this.canHold(list)) return false;
            const rid = this.selfId + '-' + (++this.ridCounter);
            this.pendingChest.set(rid, { op, list });
            this.sendTo(this.hostId, { t: 'CHEST_OP', rid, op, chest: chestId, k, id, n });
            return true;
        }
    }

    // =====================================================================
    // 4. MESSAGE HANDLERS  (dir: c2h = client->host, h2c = host->client)
    // =====================================================================
    const H = Object.create(null);
    const def = (t, dir, fn, opts) => { H[t] = Object.assign({ dir, fn }, opts || {}); };

    // ---- joining a hosted world (decisions 35, 36): JOIN_REQUEST -> WORLD_HELLO -> CLAIM -> JOIN_ACCEPT + XFER -> IN_WORLD
    const reject = (ses, to, reason) => ses.send(to, { t: 'JOIN_REJECT', reason, build: Mods.coopBuild() });   // the host's co-op build: the joiner can offer to fetch it (27_9c)
    /** The mods in this game (decision 107): added top-level maps beyond WTE's own, by name. */
    const Mods = {
        WTE_LAST_MAP: 288,
        list() { return (window.$dataMapInfos || []).filter(m => m && m.id > this.WTE_LAST_MAP && !m.parentId && typeof m.name === 'string' && m.name.trim()).map(m => cleanStr(m.name, 40)).filter((n, i, a) => n && a.indexOf(n) === i).slice(0, 20); },
        /** This game's mods as "Name@version" (a mod tells co-op its version in window.CoopMods[name]; one that doesn't is
         *  just "Name"). Sent with a join request and in the host's LAN / Steam announcements. */
        stamp() { const v = window.CoopMods || {}; return this.list().map(n => n + (v[n] ? '@' + cleanStr(String(v[n]), 24) : '')).concat(this.folderMods(), [this.CO_OP + '@' + this.coopBuild()]); },
        /** Co-op's own build (2026-11-03): its plugin file's fingerprint. Two builds can lay out the house's rooms differently
         *  (event ids), so players need the same co-op files, not only the same protocol. */
        CO_OP: 'Co-op',
        coopBuild() {
            if (this._build) return this._build;
            let b = 'unknown';
            try { b = require('crypto').createHash('sha256').update(require('fs').readFileSync(PLUGIN_FILE)).digest('hex').slice(0, 10); } catch (e) { /* no file to read: the same for everyone like it */ }
            return (this._build = b);
        },
        /** The mods the game's own mod loader (VirtualModLoader) runs: every folder in its mods folder whose name doesn't
         *  start with "!" (the loader's rule), as "Name@modversion" from its mod.json (user, 2026-11-02: "scanning the folder
         *  they have for mods"). Read once: the loader reads the folder at start-up too. */
        folderMods() {
            if (this._folder) return this._folder;
            let out = [];
            try {
                const fs = require('fs'), path = require('path');
                let dir = path.join(path.dirname(process.mainModule.filename), 'mods');
                if (!fs.existsSync(dir)) dir = path.join(path.dirname(process.execPath), 'mods');
                if (fs.existsSync(dir)) out = fs.readdirSync(dir).filter(n => !n.startsWith('!') && fs.statSync(path.join(dir, n)).isDirectory()).sort().slice(0, 20).map(n => {
                    let info = {};
                    try { let raw = fs.readFileSync(path.join(dir, n, 'mod.json'), 'utf8'); if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1); info = JSON.parse(raw) || {}; } catch (e) { /* no mod.json: the folder's name */ }
                    const ver = info.modversion || info.version;
                    return cleanStr(String(info.name || n), 40) + (ver ? '@' + cleanStr(String(ver), 24) : '');
                });
            } catch (e) { out = []; }
            return (this._folder = out);
        },
        /** How another game's mods differ from this one's (decision 107, both ways, user 2026-11-02: "no one gets corrupt data
         *  or saves"): null when they match, else { lack: mods only this game has, extra: mods only theirs has, ver: mods with
         *  a different version }. A world with a mod the other game lacks can't be shared safely either way. */
        diff(theirs) {
            const parse = a => (Array.isArray(a) ? a : []).filter(s => typeof s === 'string' && s.trim()).map(s => { const i = s.lastIndexOf('@'); return i > 0 ? { n: s.slice(0, i).trim(), v: s.slice(i + 1).trim() } : { n: s.trim(), v: '' }; });
            const mine = parse(this.stamp()), other = parse(theirs), key = m => m.n.toLowerCase();
            const lack = mine.filter(m => !other.some(o => key(o) === key(m))).map(m => m.n);
            const extra = other.filter(o => !mine.some(m => key(m) === key(o))).map(o => o.n);
            const ver = mine.filter(m => other.some(o => key(o) === key(m) && o.v && m.v && o.v !== m.v)).map(m => m.n);
            return lack.length || extra.length || ver.length ? { lack, extra, ver } : null;
        },
        /** A short line for the Join list (what the joiner sees beside a host): d is diff(host's mods) from the joiner's side. */
        short(d) { if ([].concat(d.extra, d.lack, d.ver).some(n => n === this.CO_OP)) return 'other co-op files'; return d.extra.length ? 'needs ' + d.extra.join(', ') : d.lack.length ? 'no ' + d.lack.join(', ') : d.ver.join(', ') + ': other version'; },
        /** The full reason, told to the joiner. fromHost: d is diff(joiner's mods) worked out by the host. */
        reason(d, fromHost) {
            if ([].concat(d.extra, d.lack, d.ver).some(n => n === this.CO_OP)) return "Your co-op files aren't the same as the host's. Everyone playing together needs the same co-op files: both run the newest Install Co-op.bat.";
            const needs = fromHost ? d.lack : d.extra, without = fromHost ? d.extra : d.lack, list = a => a.join(', '), it = a => a.length > 1 ? 'them' : 'it';
            if (needs.length) return "This world uses " + list(needs) + ", which your game doesn't have. Install " + it(needs) + " to join, so your game can load every place in this world.";
            if (without.length) return "Your game has " + list(without) + ", which this world doesn't use. Joining could carry " + it(without) + " into a world that can't load " + it(without) + ": uninstall " + it(without) + " first, or join a world that uses " + it(without) + ".";
            return list(d.ver) + ": your version and the host's differ. You both need the same version so your saves match.";
        },
        /** The host's check of a joiner's mods: a reason to turn them away, or null. */
        missing(theirs) { const d = this.diff(theirs); return d ? this.reason(d, true) : null; }
    };
    /** The host's player name: its actor's name once the game has one. */
    const hostName = ses => { try { const a = window.$gameActors && $gameActors.actor(1); if (a && a.name() && a.name().trim()) return a.name().trim(); } catch (e) { /* no game yet */ } return (ses.name && ses.name.trim()) || 'the host'; };
    def('JOIN_REQUEST', 'c2h', (ses, from, m) => {
        if (ses.state !== S.PLAYING) return;
        if (m.ver !== CFG.protocol) return reject(ses, from, 'Co-op version mismatch (host ' + CFG.protocol + ', you ' + m.ver + ').');
        const gv = gameVersion();
        if (gv && m.gv && m.gv !== gv) return reject(ses, from, 'Different game version (host ' + gv + ', you ' + cleanStr(String(m.gv), 20) + ').');
        { const lack = Mods.missing(m.mods); if (lack) return reject(ses, from, lack); }   // decision 107
        if (!ses.world) return reject(ses, from, 'The host has no world loaded yet. Try again in a moment.');
        if (!CoopFlow.hostAvailable()) return ses.send(from, { t: 'BUSY' });       // never hand out a world in the middle of a scene
        const w = ses.world;
        // the world's characters, like Stardew's farmhand list (A11, R8/R17): a character belongs to the PC that made it,
        // recognised by a short tag of its binding hash (the secret token itself never leaves that PC)
        const online = new Set(); ses.peers.forEach(p => { if (p.playerId) online.add(p.playerId); });
        const chars = w.roster.map(r => ({ slot: r.slot, name: r.name, tag: String(r.tokenHash || '').slice(0, 16), online: online.has(r.playerId), seen: r.lastSeen || 0 }));
        ses.send(from, { t: 'WORLD_HELLO', worldId: w.worldId, name: w.name, host: cleanStr(hostName(ses), 24), chars,
                         allowNew: !!w.allowNew && ses.rosterFreeSlot() > 0, players: ses.peers.size + 1, max: w.maxPlayers || CFG.maxPlayers,
                         noNew: !w.allowNew ? 'closed' : ses.rosterFreeSlot() > 0 ? '' : 'roster' });
    }, { open: true });

    def('WORLD_HELLO', 'h2c', async (ses, from, m) => {
        if (ses.state !== S.SYNCHRONIZING || ses.joinCtx || typeof m.worldId !== 'string' || !/^[0-9a-f]{8,64}$/.test(m.worldId)) return;
        ses.busyWait = false;
        ses.joinCtx = { worldId: m.worldId, worldName: cleanStr(m.name, 40), stage: 'choose' };
        const rec = await Identity.lookup(m.worldId);
        if (ses.state !== S.SYNCHRONIZING) return;
        const token = rec && typeof rec.token === 'string' && /^[0-9a-f]{32}$/.test(rec.token) ? rec.token : null;
        const myTag = token ? sha256(token).slice(0, 16) : '';
        const chars = (Array.isArray(m.chars) ? m.chars : []).filter(c => c && isInt(c.slot, 1, 3) && typeof c.tag === 'string').slice(0, 3)
            .map(c => ({ slot: c.slot, name: cleanStr(c.name, 16) || ('Player ' + c.slot), mine: !!myTag && c.tag === myTag, online: !!c.online, seen: isNum(c.seen, 0, 1e15) ? c.seen : 0 }));
        ses.rosterNames = new Map(chars.map(c => [c.slot, c.name]));      // room door plates name every room's owner, online or not
        // why a new player can't join: told plainly (a full game said so before the host kept a spare connection, 2026-11-03)
        const noNewWhy = isInt(m.players, 1, 8) && isInt(m.max, 2, 8) && m.players >= m.max ? 'That game is full (' + m.players + ' of ' + m.max + ' players).'
            : m.noNew === 'roster' ? 'This world already has the most players it allows.' : 'This world only allows its existing players.';
        let choice;
        if (ses.joinTimer) clearTimeout(ses.joinTimer);                     // no time limit while choosing
        if (ses.reconnecting && token && chars.some(c => c.mine)) choice = { kind: 'claim' };   // reconnecting: my own character, no menu
        else if (ses.ui.chooseCharacter) {
            choice = await ses.ui.chooseCharacter({ worldName: ses.joinCtx.worldName, host: cleanStr(m.host, 24), chars, allowNew: !!m.allowNew, profile: await Profile.load() });
        } else choice = token ? { kind: 'claim' } : m.allowNew ? { kind: 'new' } : null;   // no menu (tests): my own player, else a new one
        if (ses.state !== S.SYNCHRONIZING) return;
        if (!choice) return (!token && !m.allowNew) ? ses.fail(noNewWhy) : ses.leave();
        ses.joinCtx.stage = 'claim';
        ses.joinTimer = setTimeout(() => { if (ses.state === S.SYNCHRONIZING && ses.joinCtx && ses.joinCtx.stage === 'claim') ses.fail('The host did not answer.'); }, 5 * 60000);
        if (choice.kind === 'reclaim') {                                     // mine from another PC or copy: the host decides (decision 102)
            const c = chars.find(x => x.slot === choice.slot);
            if (!c) return ses.leave();
            ses.joinCtx.name = c.name;
            return ses.send(ses.hostId, { t: 'CLAIM', reclaim: c.slot });
        }
        if (choice.kind === 'claim' && token) {                               // my own character in this world
            ses.joinCtx.name = (chars.find(c => c.mine) || {}).name || rec.name;
            let rename = '';
            if (ses.ui.askName && /^Player \d$/.test(ses.joinCtx.name || '')) {   // made before characters had names: name it once
                rename = cleanStr(await ses.ui.askName(ses.joinCtx.worldName, ''), 16);
                if (ses.state !== S.SYNCHRONIZING) return;
                if (!rename) return ses.leave();
                ses.joinCtx.name = rename;
            }
            return ses.send(ses.hostId, rename ? { t: 'CLAIM', token, rename } : { t: 'CLAIM', token });
        }
        if (!m.allowNew) return ses.fail(noNewWhy);
        // a new character: always named here and made in WTE's customiser after arriving; this PC's last character
        // only fills in the starting name and look
        const prof = ses.ui.askName ? await Profile.load() : null;
        let name = choice.name, look = PlayerData.cleanLook(choice.look) || (prof && PlayerData.cleanLook(prof.look)) || null;
        if (!name) {
            name = ses.ui.askName ? await ses.ui.askName(ses.joinCtx.worldName, prof ? prof.name : '') : ses.name;
            if (ses.state !== S.SYNCHRONIZING) return;
            name = cleanStr(name, 16);
            if (!name) return ses.leave();
        }
        ses.joinCtx.name = cleanStr(name, 16) || 'Player';
        ses.send(ses.hostId, { t: 'CLAIM', newName: ses.joinCtx.name, look });
    }, { pre: true });

    /** Decision 102: a player without the key for their character (another PC or game copy) asks to continue as it. The
     *  host is asked in their game when free (a message with Yes / No); Yes: that PC gets a new key, the old one stops working. */
    const Reclaims = {
        queue: [], asking: null,
        ask(ses, from, m, r) {
            if (this.queue.some(q => q.from === from) || (this.asking && this.asking.from === from)) return;
            this.queue.push({ ses, from, m, name: r.name, at: Date.now() });
            ses.send(from, { t: 'ASK_HOST' });
            try { Chat.system(r.name + ' is joining from another PC and asks to continue as ' + r.name + '.'); } catch (e) { /* no chat yet */ }
        },
        update() {
            if (this.asking || !this.queue.length || !Net.isHost || !window.$gameMessage || !Invites.free()) return;
            if (typeof Scene_Map === 'undefined' || !(SceneManager._scene instanceof Scene_Map)) return;
            const q = this.queue.shift();
            if (!q.ses.transport || Date.now() - q.at > 5 * 60000) return;     // they gave up or the session ended
            this.asking = q;
            $gameMessage.add('\\c[6]' + q.name + '\\c[0] is joining from another PC or game copy and asks to continue as \\c[6]' + q.name + '\\c[0].');
            $gameMessage.add('Is that really them? (Yes: their old PC can no longer play ' + q.name + '.)');
            $gameMessage.setChoices(['Yes, let them in', 'No'], 1, 1);
            $gameMessage.setChoiceCallback(n => this.decide(q, n === 0));
        },
        /** The host's answer for one request (also used by tests). */
        decide(q, yes) {
            if (this.asking === q) this.asking = null;
            const i = this.queue.indexOf(q); if (i >= 0) this.queue.splice(i, 1);
            if (yes) { q.m._ok = true; H.CLAIM.fn(q.ses, q.from, q.m); }
            else reject(q.ses, q.from, 'The host did not let you continue as ' + q.name + '.');
        }
    };
    def('CLAIM', 'c2h', (ses, from, m) => {
        if (ses.state !== S.PLAYING || !ses.world) return;
        if (!CoopFlow.hostAvailable()) {                                    // a scene started while the joiner was choosing: wait for it
            m._waits = (m._waits || 0) + 1;
            if (m._waits === 1) ses.send(from, { t: 'BUSY' });
            if (m._waits < 300) setTimeout(() => { if (ses.transport) H.CLAIM.fn(ses, from, m); }, 1000);
            return;
        }
        const w = ses.world;
        let entry = null, token = null, isNew = false;
        if (isInt(m.reclaim, 1, 3) && !m.token) {                          // decision 102: "this is mine, from another PC"
            const r = w.roster.find(x => x.slot === m.reclaim);
            if (!r) return reject(ses, from, 'That character is not in this world.');
            if (w.bans.includes(r.playerId)) return reject(ses, from, 'You are banned from this world.');
            if ([...ses.peers.values()].some(p => p.playerId === r.playerId)) return reject(ses, from, r.name + ' is being played right now.');
            if (!m._ok) return Reclaims.ask(ses, from, m, r);
            token = newToken(); r.tokenHash = sha256(token); r.lastSeen = Date.now(); CoopWorlds.saveRoster(w); entry = r;
            Diag.log('info', 'returning player ' + r.name + ' allowed by the host from another PC: a new key');
        }
        if (typeof m.token === 'string' && /^[0-9a-f]{32}$/.test(m.token)) {
            const h = sha256(m.token);
            entry = w.roster.find(r => r.tokenHash === h) || null;
            if (entry && w.bans.includes(entry.playerId)) return reject(ses, from, 'You are banned from this world.');
            if (entry && /^Player \d$/.test(entry.name) && cleanStr(m.rename, 16)) { entry.name = cleanStr(m.rename, 16); CoopWorlds.saveRoster(w); }
            if (!entry && !w.allowNew) return reject(ses, from, 'Your player was not found in this world, and it does not accept new players.');
        }
        if (!entry) {
            if (!w.allowNew) return reject(ses, from, 'This world only allows its existing players.');
            const slot = ses.rosterFreeSlot();
            if (!slot) return reject(ses, from, 'This world already has the most players it allows.');
            token = newToken(); isNew = true;
            entry = { playerId: 'P' + makeId(), slot, name: cleanStr(m.newName, 16) || ('Player ' + slot), tokenHash: sha256(token),
                      created: Date.now(), lastSeen: Date.now(), look: PlayerData.cleanLook(m.look), data: null };
            w.roster.push(entry);                                           // join order is kept: slot 1, 2, 3 (decision 36)
            w.roster.sort((a, b) => a.slot - b.slot);
            CoopWorlds.saveRoster(w);                                       // remembered even if the host never saves
        }
        ses.peers.forEach((p, id) => { if (p.playerId === entry.playerId && id !== from) { ses.send(id, { t: 'SESSION_CLOSED', reason: 'You joined this world from another window.' }); ses.dropPeer(id, 'replaced'); } });
        entry.lastSeen = Date.now();
        ses.peers.set(from, { id: from, playerId: entry.playerId, name: entry.name, slot: entry.slot, lastSeen: Date.now(), loading: true, state: null, char: null });
        let packed;
        try { packed = Xfer.pack({ world: GameBridge.snapshot(), player: entry.data || null }); }
        catch (e) { Diag.err('world snapshot', e); ses.dropPeer(from, 'snapshot failed'); return reject(ses, from, 'The host could not prepare the world.'); }
        const peers = [{ id: ses.selfId, name: hostName(ses), slot: 0 }];
        ses.peers.forEach((p, id) => { if (id !== from && !p.loading) peers.push({ id, name: p.name, slot: p.slot }); });
        ses.send(from, { t: 'JOIN_ACCEPT', playerId: entry.playerId, slot: entry.slot, name: entry.name, token, isNew, look: entry.look || null, spawn: Rooms.spawnFor(entry.slot),
                         seed: ses.sessionSeed, peers, chests: Array.from(ses.chestView.entries()), tools: Array.from(Tools.sparesExcept(entry.playerId)),
                         xfer: { id: packed.id, n: packed.n, sha: packed.sha } });
        Xfer.send(ses, from, 'XFER_CHUNK', packed);
        Diag.log('info', (isNew ? 'new player ' : 'returning player ') + entry.name + ' (slot ' + entry.slot + ') joining; world ' + Math.round(packed.b64.length / 1024) + ' KB in ' + packed.n + ' parts');
    }, { open: true });

    def('BUSY', 'h2c', ses => {                                          // host is mid-scene / setting up: ask again shortly
        if (ses.state === S.SYNCHRONIZING && ses.joinCtx && ses.joinCtx.stage === 'claim') { ses.busyWait = true; return; }   // the host keeps my claim and answers when free
        if (ses.state !== S.SYNCHRONIZING || ses.joinCtx) return;
        ses.busyWait = true;
        if (ses.joinTimer) clearTimeout(ses.joinTimer);
        ses.joinTimer = setTimeout(() => { if (ses.state === S.SYNCHRONIZING && !ses.joinCtx) ses.fail('The host stayed busy for too long. Try again.'); }, 5 * 60000);
        setTimeout(() => { if (ses.state === S.SYNCHRONIZING && !ses.joinCtx) ses.send(ses.hostId, { t: 'JOIN_REQUEST', ver: CFG.protocol, gv: gameVersion(), mods: Mods.stamp() }); }, 2000);
    }, { pre: true });

    def('ASK_HOST', 'h2c', ses => { if (ses.state === S.SYNCHRONIZING && ses.joinCtx) ses.askWait = true; }, { pre: true });   // decision 102: the host is being asked
    def('JOIN_REJECT', 'h2c', (ses, from, m) => { if (ses.state !== S.SYNCHRONIZING) return; const why = cleanStr(m.reason, 160) || 'Join rejected.'; ses.fail(why); Updater.hostCheck(typeof m.build === 'string' ? m.build : '', why); }, { pre: true });

    def('JOIN_ACCEPT', 'h2c', async (ses, from, m) => {
        const ctx = ses.joinCtx;
        if (ses.state !== S.SYNCHRONIZING || !ctx || ctx.stage !== 'claim' || !isInt(m.slot, 1, 3) || !Array.isArray(m.peers) || m.peers.length > 4) return;
        if (!isInt(m.seed, 0, 4294967295) || !m.xfer || !isInt(m.xfer.n, 1, 1000) || typeof m.xfer.sha !== 'string') return ses.fail('The host sent an invalid answer (different plugin version?).');
        ctx.stage = 'xfer'; ctx.accept = m; ses.busyWait = false; ses.askWait = false; Tools.others = Tools.clean(m.tools);
        if (m.spawn && !RoomsBuild.ok) m.spawn = null;                       // my game has no rooms: start in the house
        if (m.spawn && !(isInt(m.spawn.map, 1, 9999) && isInt(m.spawn.x, 0, 999) && isInt(m.spawn.y, 0, 999))) m.spawn = null;
        ctx.rx = { id: String(m.xfer.id), n: m.xfer.n, sha: m.xfer.sha, parts: [], got: 0, size: 0 };
        ses.sessionSeed = m.seed; ses.slot = m.slot; ses.playerId = String(m.playerId || ''); ses.name = cleanStr(m.name, 16) || ses.name;
        for (const p of m.peers) if (p && typeof p.id === 'string' && isInt(p.slot, 0, 3) && p.id !== ses.selfId) ses.peers.set(p.id, { id: p.id, name: cleanStr(p.name, 24), slot: p.slot, state: null, char: null });
        if (Array.isArray(m.chests)) m.chests.forEach(c => applyChestView(ses, c[0], c[1]));
        if (typeof m.token === 'string' && /^[0-9a-f]{32}$/.test(m.token))      // first time here: remember the binding
            await Identity.remember(ctx.worldId, { token: m.token, playerId: ses.playerId, slot: m.slot, name: ses.name, worldName: ctx.worldName, address: ses.joinAddress || '' });
        else await Identity.remember(ctx.worldId, { playerId: ses.playerId, slot: m.slot, name: ses.name, worldName: ctx.worldName, address: ses.joinAddress || '' });
        if (ses.joinTimer) clearTimeout(ses.joinTimer);
        ses.startTimers();                                                  // keep pinging while the world arrives
        if (ses.ui.progress) ses.ui.progress(ses, 0);
    }, { pre: true });

    def('XFER_CHUNK', 'h2c', (ses, from, m) => {
        const ctx = ses.joinCtx;
        if (ses.state !== S.SYNCHRONIZING || !ctx || ctx.stage !== 'xfer') return;
        let payload;
        try { payload = Xfer.collect(ctx.rx, m); } catch (e) { return ses.fail('The world could not be received (' + e.message + ').'); }
        if (ses.ui.progress) ses.ui.progress(ses, ctx.rx.got / ctx.rx.n);
        if (!payload) return;
        ctx.stage = 'enter'; ctx.rx = null;
        try {
            if (ses.reconnecting && ses.reconnecting.data) payload.player = ses.reconnecting.data;   // what I had at the drop, newer than the host's checkpoint
            (ses.enterWorld || GameBridge.enterWorld.bind(GameBridge))(payload, ctx.accept);
        } catch (e) { Diag.err('entering the host world', e); return ses.fail('Could not load the host world: ' + (e.message || e)); }
        ses.inWorld = true;
        ses.setState(S.PLAYING);
        try { Achievements.catchUp(); } catch (e) { Diag.err('achievements of the world', e); }   // milestones reached while I was away
        try { Upgrades.applyMine(); } catch (e) { Diag.err('my equipment upgrades after joining', e); }   // decision 91
        try { if ($gameSystem.refreshAllPerks) $gameSystem.refreshAllPerks(); if ($gameSystem.refreshAllAutoPerks) $gameSystem.refreshAllAutoPerks(); }   // my perks from my own professions: the load's own refresh ran on the world copy (decision 91)
        catch (e) { Diag.err('perks after joining', e); }
        if (ctx.accept && ctx.accept.isNew === false) LoadEvent.run('a returning player entering the world');   // their own load's fix-ups (decision 91)
        ses.send(ses.hostId, { t: 'IN_WORLD' });
        if (ses.ui.peers) ses.ui.peers(ses);
    }, { pre: true });

    def('IN_WORLD', 'c2h', (ses, from) => {
        const p = ses.peers.get(from);
        if (!p || !p.loading) return;
        p.loading = false;
        ses.broadcast({ t: 'PEER_JOINED', id: from, name: p.name, slot: p.slot }, from);
        ses.sendLooksTo(from);                                             // draw everyone already here with their own look
        WorldObjects.snapshotFor(from);                                    // who is using which chest right now
        ses.send(from, { t: 'MOBT', l: Mobs.table() });                   // who is hunting / fighting which monster
        if (window.$gameParty) ses.send(from, { t: 'GOLD', g: $gameParty.gold() });   // the shared wallet
        ses.sendFlagSnapshot(from);
        if (ses.ritual) ses.ritualPublish();
        if (ses.ui.notice) ses.ui.notice(p.name + ' joined.');
        Chat.system(p.name + ' joined.');
        if (ses.ui.peers) ses.ui.peers(ses);
    });

    // player data checkpoints (joiner -> host), kept in the world's roster and written with the world save
    def('UP_BEGIN', 'c2h', (ses, from, m) => {
        if (!ses.rosterOf(from) || !isInt(m.n, 1, 400) || typeof m.sha !== 'string' || typeof m.id !== 'string') return;
        ses.rxUploads.set(from, { id: m.id, n: m.n, sha: m.sha, parts: [], got: 0, size: 0 });
    });
    def('UP_CHUNK', 'c2h', (ses, from, m) => {
        const rx = ses.rxUploads.get(from), entry = ses.rosterOf(from);
        if (!rx || !entry) return;
        let payload;
        try { payload = Xfer.collect(rx, m); } catch (e) { ses.rxUploads.delete(from); Diag.log('warn', 'bad player data from ' + entry.name + ': ' + e.message); return; }
        if (!payload) return;
        ses.rxUploads.delete(from);
        if (typeof payload.player === 'string' && payload.player.length < 4 * 1024 * 1024) {
            entry.data = payload.player; entry.lastSeen = Date.now();
            try {                                                           // keep the character's name and look in the roster file
                const d = JSON.parse(payload.player), lk = PlayerData.cleanLook(d && d.look), nm = cleanStr(d && d.name, 16);
                if (lk) entry.look = lk;
                if (nm && nm !== entry.name) {                              // everyone's label and door plate follow the character's name
                    entry.name = nm;
                    const p = ses.peers.get(from); if (p) p.name = nm;
                    ses.broadcast({ t: 'PEER_JOINED', id: from, name: nm, slot: entry.slot }, from);
                }
            } catch (e) { /* data kept; look unchanged */ }
            CoopWorlds.saveRoster(ses.world);
        }
    });

    def('SESSION_CLOSED', 'h2c', (ses, from, m) => (ses.closedByHost = true, ses.fail(cleanStr(m && m.reason, 120) || 'The host closed the connection.')));   // the host meant it: no reconnecting
    def('UP_REQ', 'h2c', ses => { ses.uploadPlayerData('save'); });
    def('WORLD_SAVED', 'h2c', () => { try { Diag.toast('The host saved the world.', 2500); } catch (e) { /* optional */ } });
    def('LEAVE', 'c2h', (ses, from) => ses.dropPeer(from, 'left'));
    def('PING', 'c2h', () => { /* lastSeen updated in receive() */ });
    def('HPING', 'h2c', () => { /* host heartbeat: lastHostSeen updated in receive() */ });
    def('PEER_JOINED', 'h2c', (ses, from, m) => {
        if (typeof m.id !== 'string' || !isInt(m.slot, 1, 3) || m.id === ses.selfId) return;
        const known = ses.peers.get(m.id);
        if (known) known.name = cleanStr(m.name, 24) || known.name;        // a renamed character: keep how they are drawn
        else ses.peers.set(m.id, { id: m.id, name: cleanStr(m.name, 24), slot: m.slot, state: null, char: null });
        if (ses.rosterNames) ses.rosterNames.set(m.slot, cleanStr(m.name, 24));
        if (!known && ses.ui.notice) ses.ui.notice(cleanStr(m.name, 24) + ' joined.');
        if (!known) Chat.system(cleanStr(m.name, 24) + ' joined.');
        if (ses.ui.peers) ses.ui.peers(ses);
    });
    def('PEER_LEFT', 'h2c', (ses, from, m) => {
        if (typeof m.id !== 'string') return;
        const gone = ses.peers.get(m.id);
        if (gone && gone.name) { if (ses.ui.notice) ses.ui.notice(gone.name + ' left.'); Chat.system(gone.name + ' left.'); }
        ses.peers.delete(m.id); ses.lastSeq.delete(m.id);
        if (ses.localTrade && ses.localTrade.partner === m.id) ses.abortLocalTrade('Partner disconnected');
        if (ses.ui.peers) ses.ui.peers(ses);
    });

    // players
    def('PLAYER_SYNC', 'c2h', (ses, from, m) => {
        const p = ses.peers.get(from);
        if (!p || !ses.validState(m)) return;
        const now = Date.now();
        if (now - (p.lastSyncAt || 0) < 20) return;            // rate limit
        p.lastSyncAt = now;
        ses.applyPlayerState(from, m);
        ses.broadcast({ t: 'PLAYER_STATE', id: from, map: m.map, x: m.x, y: m.y, dir: m.dir, cn: m.cn, ci: m.ci, pt: m.pt, vis: m.vis, bz: m.bz, hd: m.hd, fi: m.fi, fb: m.fb, bg: m.bg, mc: m.mc, bs: m.bs }, from);
    });
    def('PLAYER_STATE', 'h2c', (ses, from, m) => { if (typeof m.id === 'string' && m.id !== ses.selfId) ses.applyPlayerState(m.id, m); });
    def('BAL', 'c2h', (ses, from, m) => { const b = Balances.clean(m); if (!b) return; Balances.apply(b.m, b.b); ses.broadcast({ t: 'BAL_ALL', m: b.m, b: b.b }, from); });
    def('BAL_ALL', 'h2c', (ses, from, m) => { const b = Balances.clean(m); if (b) Balances.apply(b.m, b.b); });
    def('PERKS', 'c2h', (ses, from, m) => { const v = Perks.clean(m.v), p = ses.peers.get(from); if (v && p) p.perks = v; const n = Perks.cleanNames(m.n); if (n && p) p.perkNames = n; const sm = Perks.cleanMods(m.sm); if (sm && p) p.statMods = sm; });
    def('PERKS_BEST', 'h2c', (ses, from, m) => {
        const v = Perks.clean(m.v); if (v) Perks.bestOf = v;
        if (m.nm && typeof m.nm === 'object' && Object.keys(m.nm).length <= 8) { const all = {}; Object.keys(m.nm).forEach(id => { const n = Perks.cleanNames(m.nm[id]); if (n && id.length <= 64) all[id] = n; }); Perks.namesOf = all; }
        if (m.sm && typeof m.sm === 'object' && Object.keys(m.sm).length <= 8) { const all = {}; Object.keys(m.sm).forEach(id => { const v = Perks.cleanMods(m.sm[id]); if (v && id.length <= 64) all[id] = v; }); Perks.modsOf = all; }
    });
    // shared placed objects and chests (§7d): joiner -> host (W), host -> everyone (WB)
    def('W', 'c2h', (ses, from, m) => {
        if (m.op === 'lock') { if (WorldObjects.valid(m)) { const p = ses.peers.get(from); WorldObjects.hostLock(m.i, m.on === 1, from, p ? p.name : '?'); } return; }
        if (m.op === 'locks' || m.op === 'rstores' || !WorldObjects.valid(m)) return;   // only the host sends these
        if (m.op === 'cont') { const l = WorldObjects.locks[m.i]; if (l && l.by !== from && (l.by === ses.selfId || ses.peers.has(l.by))) return; }   // only the chest's current user may change it
        const fwd = Object.assign({}, m); delete fwd.t; delete fwd.q; delete fwd.s;
        if (isInt(fwd.m, 1, 9999) && isInt(fwd.e, 1, 99999)) { const r = Spawns.remapped.get(from + '|' + fwd.m + '|' + fwd.e); if (r) fwd.e = r; }   // that player's spawn got a new id here
        if (fwd.op === 'place' && WorldObjects.valid(fwd) && WorldObjects.clash(fwd)) {   // someone placed on that tile first
            return ses.send(from, { t: 'WB', by: ses.selfId, op: 'unplace', m: fwd.m, e: fwd.e, u: fwd.u, item: fwd.item });
        }
        if (fwd.op === 'selfs' && Array.isArray(fwd.l)) fwd.l.forEach(x => { const r = x && Spawns.remapped.get(from + '|' + x.m + '|' + x.e); if (r) x.e = r; });
        if (fwd.op === 'sp' || fwd.op === 'sps') {                         // spawned during play: the host decides each event id
            if (!WorldObjects.valid(fwd)) return;
            const ok = [];
            (fwd.op === 'sp' ? [fwd] : fwd.l).forEach(x => {
                const r = Spawns.remapped.get(from + '|' + x.m + '|' + x.e); if (r && fwd.op === 'sps') x.e = r;
                if (x.a === 1 && Spawns.onMap(x.m)) return ses.send(from, { t: 'WB', by: ses.selfId, op: 'unsp', m: x.m, e: x.e, id: x.id });   // the host makes this map's automatic spawns
                const e = Spawns.applySpawn(x);
                if (e !== x.e) { Spawns.remapped.set(from + '|' + x.m + '|' + x.e, e); ses.send(from, { t: 'WB', by: ses.selfId, op: 'spmv', m: x.m, from: x.e, to: e }); x.e = e; }
                ok.push({ m: x.m, e: x.e, id: x.id, x: x.x, y: x.y });
            });
            WorldObjects.batches(ok, 11000).forEach(l => ses.broadcast({ t: 'WB', by: from, op: 'sps', l }, from));
            return;
        }
        WorldObjects.apply(fwd);
        ses.broadcast(Object.assign({ t: 'WB', by: from }, fwd), from);
    });
    // one player at a time per object (§7i)
    def('USE', 'c2h', (ses, from, m) => {
        if (!isInt(m.m, 1, 9999) || !isInt(m.e, 1, 99999)) return;
        const held = Uses.hostTake(from, m.m, m.e);
        ses.send(from, { t: 'USED', m: m.m, e: m.e, ok: held ? 0 : 1, name: held ? held.name : '' });
    });
    // chat (§11.15): the host passes each line to everyone, the sender included (one order for all)
    def('CHAT_UP', 'c2h', (ses, from, m) => {
        const p = ses.peers.get(from), x = Chat.clean(m.x);
        if (!p || !x) return;
        const now = Date.now(); p.chatAt = (p.chatAt || []).filter(a => now - a < 5000);
        if (p.chatAt.length >= 6) return;                                 // per-player rate limit
        p.chatAt.push(now);
        ses.broadcast({ t: 'CHAT', id: from, n: p.name || 'a player', x });
        Chat.say(p.name || 'a player', x);
    });
    def('CHAT', 'h2c', (ses, from, m) => { const x = Chat.clean(m.x); if (x && typeof m.id === 'string') Chat.say(cleanStr(m.n, 24) || ses.nameOf(m.id), x); });
    // boss battles together (§7p)
    def('BREADY', 'c2h', (ses, from, m) => { if (typeof m.snap === 'string' && isInt(m.m, 1, 9999)) Duel.onHost(from, m); });
    def('BGO', 'h2c', (ses, from, m) => {
        if (!isInt(m.seed, 0, 4294967295) || !Array.isArray(m.order) || m.order.length > 4 || !m.snaps || typeof m.snaps !== 'object') return;
        if (!m.order.every(id => typeof id === 'string' && typeof m.snaps[id] === 'string' && m.snaps[id].length < 200000)) return;
        if (m.kind !== 'field' || m.order.includes(Net.selfId)) Duel.want = m;
    });
    ['WED', 'WEDF', 'WEDEND', 'WEDHERE', 'WEDNO'].forEach(k => def(k, 'c2h', (ses, from, m) => {
        if (k === 'WED' && !isInt(m.npc, 1, 9)) return;
        if (k === 'WEDF' && (!Array.isArray(m.e) || m.e.length > 200)) return;
        Wedding.onHost(from, m);
    }));
    def('BOSSWON', 'c2h', (ses, from, m) => Bosses.onHost(from, m));
    def('BOSSES', 'h2c', (ses, from, m) => { if (m.w && typeof m.w === 'object') Bosses.onList(m.w); });
    def('GATE', 'c2h', (ses, from, m) => { if (Array.isArray(m.l) && m.l.length <= 30 && isInt(m.day, 0, 1e6)) Gates.onHost(m); });
    def('GATES', 'h2c', (ses, from, m) => { if (m.w && typeof m.w === 'object') { const o = {}; Gates.FLAGS.forEach(f => { if (isInt(m.w[f.k], 0, 1e6)) o[f.k] = m.w[f.k]; }); Gates.list = o; } });
    def('WALK', 'c2h', (ses, from, m) => { if (isInt(m.m, 1, 9999) && Array.isArray(m.l) && m.l.length <= 300) { Walkers.apply(m.m, m.l); ses.broadcast({ t: 'WALKS', m: m.m, by: from, l: m.l }); } });
    def('WALKS', 'h2c', (ses, from, m) => { if (isInt(m.m, 1, 9999) && Array.isArray(m.l) && m.l.length <= 300 && m.by !== ses.selfId) Walkers.apply(m.m, m.l); });
    def('CHORENOTE', 'h2c', (ses, from, m) => { if (typeof m.text === 'string' && m.text.length < 200) Chores.heard(cleanStr(m.text, 200)); });
    def('CHOREGIFT', 'h2c', (ses, from, m) => { if (isInt(m.id, 1, 9999) && typeof m.text === 'string' && m.text.length < 200) Chores.got(m.id, cleanStr(m.text, 200)); });
    def('WEDCALL', 'h2c', (ses, from, m) => { if (typeof m.by === 'string' && isInt(m.npc, 1, 9) && typeof m.name === 'string') Wedding.onCall(m); });
    ['WEDFR', 'WEDENDR'].forEach(k => def(k, 'h2c', (ses, from, m) => Wedding.onClient(m)));
    def('WEDREADY', 'h2c', (ses, from, m) => { if (typeof m.who === 'string') Wedding.answered(m.who); });
    def('MARRY', 'c2h', (ses, from, m) => { if (isInt(m.npc, 1, 9) && typeof m.name === 'string') Marriages.onHost(m); });
    def('MARRIAGES', 'h2c', (ses, from, m) => {
        if (!m.l || typeof m.l !== 'object') return;
        const out = {}; Object.keys(m.l).slice(0, 9).forEach(k => { const n = Number(k), v = m.l[k]; if (isInt(n, 1, 9) && typeof v === 'string') out[n] = cleanStr(v, 24); });
        Marriages.list = out;
        const w = {}, r = {};
        if (m.w && typeof m.w === 'object') Object.keys(m.w).slice(0, 9).forEach(k => { const n = Number(k), v = m.w[k]; if (isInt(n, 1, 9) && typeof v === 'string') w[n] = cleanStr(v, 24); });
        if (m.r && typeof m.r === 'object') Object.keys(m.r).slice(0, 9).forEach(k => { const n = Number(k), v = m.r[k]; if (isInt(n, 1, 9) && isInt(v, 0, 3)) r[n] = v; });
        Marriages.wedList = w; Marriages.roomList = r;
    });
    def('BPULL', 'h2c', (ses, from, m) => { if (isInt(m.tr, 1, 9999) && typeof m.by === 'string') Duel.pulled(m); });
    def('BOUT', 'h2c', (ses, from, m) => { if (Duel.on && m.bid === Duel.seed && typeof m.id === 'string') Duel.out.add(m.id); });
    ['BFLEE', 'BFLEEANS'].forEach(k => def(k, 'c2h', (ses, from, m) => { if (isInt(m.bid, 0, 4294967295)) Duel.onHost(from, m); }));
    def('BFLEEASK', 'h2c', (ses, from, m) => { if (isInt(m.bid, 0, 4294967295) && typeof m.by === 'string') Duel.onClient(m); });
    def('BFLEERES', 'h2c', (ses, from, m) => { if (isInt(m.bid, 0, 4294967295) && typeof m.by === 'string' && typeof m.no === 'string') Duel.onClient(m); });
    ['BNO', 'BBAIL', 'BEND', 'BAUTO'].forEach(k => def(k, 'c2h', (ses, from, m) => { if (k === 'BNO' || isInt(m.bid, 0, 4294967295)) Duel.onHost(from, m); }));
    def('BACT', 'c2h', (ses, from, m) => Duel.onHost(from, m));
    def('BDO', 'h2c', (ses, from, m) => { if (isInt(m.bid, 0, 4294967295) && isInt(m.n, 1, 1e7) && isInt(m.mi, 0, 3) && ['s', 'i'].includes(m.k) && isInt(m.i, 0, 9999) && isInt(m.tg, -1, 99)) Duel.gotDo(m); });
    def('BHASH', 'c2h', (ses, from, m) => { if (isInt(m.bid, 0, 4294967295) && isInt(m.c, 0, 1e7) && isInt(m.h, 0, 4294967295)) Duel.hostCompare(from, m.c, m.h, m.bid); });
    def('BLIFE', 'c2h', (ses, from, m) => { if (isInt(m.bid, 0, 4294967295) && isInt(m.c, 0, 1e7) && typeof m.d === 'string' && /^[01]{1,16}$/.test(m.d) && isInt(m.w, 0, 600000)) Duel.hostLife(from, m); });
    def('BFIX', 'h2c', (ses, from, m) => { if (isInt(m.c, 0, 1e7) && isInt(m.bid, 0, 4294967295) && Array.isArray(m.b) && m.b.length <= 16) Duel.fix(m); });
    // big story moments together (§7o)
    def('STORY_UP', 'c2h', (ses, from, m) => {
        if (m.by !== from && m.k !== 'answer') return;
        if (m.k === 'answer' && m.id !== from) return;
        const out = Object.assign({}, m, { t: 'STORY' }); Story.receive(out); ses.broadcast(out, from);
    });
    def('STORY', 'h2c', (ses, from, m) => Story.receive(m));
    // ping (decision 58)
    def('RTT', 'h2c', (ses, from, m) => { if (isNum(m.ts, 0, 1e15)) { BgmSync.hostTime(m.ts); ses.send(ses.hostId, { t: 'RTTR', ts: m.ts }); } });
    def('RTTR', 'c2h', (ses, from, m) => { if (isNum(m.ts, 0, 1e15) && m.ts <= Date.now()) Ping.got(from, m.ts); });
    def('PINGS', 'h2c', (ses, from, m) => { if (Array.isArray(m.l) && m.l.length <= 8) m.l.forEach(x => { if (Array.isArray(x) && typeof x[0] === 'string' && isInt(x[1], 0, 600000)) Ping.ms.set(x[0], x[1]); }); });
    // desync check (decision 58)
    def('DSYNC', 'c2h', (ses, from, m) => {
        if (!isInt(m.m, 1, 9999) || !isInt(m.g, 0, 4294967295) || !isInt(m.v, 0, 4294967295) || !isNum(m.gold, 0, 1e12) || !Array.isArray(m.ev) || m.ev.length > 400) return;
        if (!m.ev.every(x => Array.isArray(x) && isInt(x[0], 1, 999) && isInt(x[1], 0, 4294967295))) return;
        Desync.check(from, m);
    });
    def('DSYNC_AGAIN', 'h2c', () => { Desync.again = Date.now() + Desync.RECHECK_MS; });
    def('USE_KEEP', 'c2h', (ses, from, m) => { if (!isInt(m.m, 1, 9999) || !isInt(m.e, 1, 99999)) return; const cur = Uses.table.get(Uses.key(m.m, m.e)); if (cur && cur.by === from) cur.at = Date.now(); });
    def('UNUSE', 'c2h', (ses, from, m) => { if (isInt(m.m, 1, 9999) && isInt(m.e, 1, 99999)) Uses.hostGive(from, m.m, m.e); });
    def('USED', 'h2c', (ses, from, m) => { if (isInt(m.m, 1, 9999) && isInt(m.e, 1, 99999)) Uses.answer(m.m, m.e, m.ok === 1, cleanStr(m.name, 24)); });
    // monsters (§7h): who moves each one, their positions, individual battles
    const mobId = (m, e) => isInt(m, 1, 9999) && isInt(e, 1, 99999);
    def('MOBC', 'c2h', (ses, from, m) => { if (mobId(m.m, m.e)) Mobs.hostClaim(from, m.m, m.e); });
    def('MOBR', 'c2h', (ses, from, m) => { if (mobId(m.m, m.e)) Mobs.hostRelease(from, m.m, m.e); });
    def('MOBB', 'c2h', (ses, from, m) => { if (mobId(m.m, m.e)) Mobs.hostFight(from, m.m, m.e, m.on === 1); });
    def('MOBP', 'c2h', (ses, from, m) => { if (isInt(m.m, 1, 9999) && Array.isArray(m.l) && m.l.length <= 200) { Mobs.applyPositions(m.m, m.l); ses.broadcast({ t: 'MOBPS', m: m.m, by: from, l: m.l }, from); } });
    def('MOBPS', 'h2c', (ses, from, m) => { if (isInt(m.m, 1, 9999) && Array.isArray(m.l) && m.l.length <= 200 && m.by !== ses.selfId) Mobs.applyPositions(m.m, m.l); });
    def('MOBO', 'h2c', (ses, from, m) => { if (mobId(m.m, m.e) && typeof m.by === 'string' && m.by.length <= 64) Mobs.applyOwner(m.m, m.e, m.by, cleanStr(m.b, 24)); });
    def('MOBT', 'h2c', (ses, from, m) => { if (Array.isArray(m.l) && m.l.length <= 2000) { Mobs.owners.clear(); m.l.forEach(r => { if (Array.isArray(r) && mobId(r[0], r[1]) && typeof r[2] === 'string') Mobs.applyOwner(r[0], r[1], r[2], cleanStr(r[3], 24)); }); } });
    // shared resources (§7f): one spawned set per map, the host's
    def('SPQ', 'c2h', (ses, from, m) => { if (isInt(m.m, 1, 9999) && isInt(m.e || 0, 0, 99999)) Spawns.hostQuery(from, m.m, m.e || 0, m.roll === 1); });
    def('SPUP', 'c2h', (ses, from, m) => { if (isInt(m.m, 1, 9999) && isInt(m.e, 1, 99999) && Spawns.validSet(m.set)) Spawns.hostUpload(from, m.m, m.e, m.set); });
    def('SPGO', 'h2c', (ses, from, m) => { if (isInt(m.m, 1, 9999)) Spawns.granted(m.m); });
    def('SPSET', 'h2c', (ses, from, m) => { if (isInt(m.m, 1, 9999) && isInt(m.e || 0, 0, 99999)) Spawns.received(m.m, m.e || 0, m.set); });
    def('WB', 'h2c', (ses, from, m) => { if (m.by !== ses.selfId) { const d = Object.assign({}, m); delete d.t; delete d.q; delete d.s; delete d.by; WorldObjects.apply(d); } });
    // shared wallet (decision 11): joiner -> host as a change (GOLDD), host -> everyone as the total (GOLD)
    def('GOLDD', 'c2h', (ses, from, m) => { if (isInt(m.d, -1e9, 1e9) && m.d !== 0 && window.$gameParty) $gameParty.gainGold(m.d); });
    def('GOLD', 'h2c', (ses, from, m) => { if (isInt(m.g, 0, 1e10)) Wallet.set(m.g); });
    // placement preview: joiner -> host (GHOST), host -> everyone (GHOSTS)
    def('GHOST', 'c2h', (ses, from, m) => { if (WorldObjects.validGhost(m.g)) { WorldObjects.applyGhost(from, m.g); ses.broadcast({ t: 'GHOSTS', id: from, g: m.g }, from); } });
    def('GHOSTS', 'h2c', (ses, from, m) => { if (typeof m.id === 'string' && m.id !== ses.selfId) WorldObjects.applyGhost(m.id, m.g); });
    // looks (design §2.6 KC_CompositeBitmaps: each player is drawn with their own composite, not the viewer's)
    def('PLOOK', 'c2h', (ses, from, m) => {
        const clean = ses.applyLook(from, m.cn, m.layers);
        if (clean) ses.broadcast({ t: 'PLOOKS', id: from, cn: m.cn, layers: clean }, from);
    });
    def('PLOOKS', 'h2c', (ses, from, m) => { if (typeof m.id === 'string' && m.id !== ses.selfId) ses.applyLook(m.id, m.cn, m.layers); });

    // world (host only)
    function sanitizeWorld(w) {
        if (!w || !/^[a-z_]{1,16}$/.test(String(w.wt)) || !isInt(w.wp, 0, 9)) return null;
        const out = { wt: w.wt, wp: w.wp };
        if (w.y !== undefined) {
            if (!isInt(w.y, 0, 9999) || !isInt(w.mo, 0, 11) || !isInt(w.d, 1, 31) || !isInt(w.h, 0, 23) || !isInt(w.mi, 0, 59) || !isInt(w.sec, 0, 59)) return null;
            Object.assign(out, { y: w.y, mo: w.mo, d: w.d, h: w.h, mi: w.mi, sec: w.sec });
        }
        return out;
    }
    def('WORLD_STATE', 'h2c', (ses, from, m) => { const w = sanitizeWorld(m); if (w) ses.pendingWorld = w; });
    def('CLOCK', 'h2c', (ses, from, m) => {
        if (!isInt(m.y, 0, 9999) || !isInt(m.mo, 0, 11) || !isInt(m.d, 1, 31) || !isInt(m.h, 0, 23) || !isInt(m.mi, 0, 59) || !isInt(m.sec, 0, 59) ||
            !isInt(m.ms, 0, 1000) || !isNum(m.sr, 0, 1000) || !(m.p === 0 || m.p === 1)) return;
        Clock.pending = { y: m.y, mo: m.mo, d: m.d, h: m.h, mi: m.mi, sec: m.sec, ms: m.ms, sr: m.sr, p: m.p };
    });

    // ---- group sleep ----
    def('RITUAL_READY', 'c2h', (ses, from, m) => { if (RITUAL_KINDS.includes(m.kind)) ses.ritualRequest(from, m.kind); });
    def('RITUAL_CANCEL', 'c2h', (ses, from, m) => { if (RITUAL_KINDS.includes(m.kind)) ses.ritualRetract(from, m.kind); });
    def('RITUAL_DONE', 'c2h', (ses, from, m) => { if (RITUAL_KINDS.includes(m.kind) && isInt(m.token, 1, 1e9)) ses.ritualDoneFrom(from, m.kind, m.token); });
    def('RITUAL_STATE', 'h2c', (ses, from, m) => {
        if (m.kind !== '' && !RITUAL_KINDS.includes(m.kind)) return;
        const ready = idList(m.ready), need = idList(m.need);
        if (!ready || !need) return;
        ses.rs = m.kind ? { kind: m.kind, phase: m.phase === 'run' ? 'run' : 'gather', ready, need,
                            until: isNum(m.left, 1, 600000) ? Date.now() + m.left : 0 } : null;
        ses.ritualUi();
    });
    // ---- night and cutscene sync (§7e) ----
    def('NDONE', 'c2h', (ses, from, m) => { if (Night.KINDS.includes(m.kind) && typeof m.key === 'string' && m.key.length <= 24) Night.doneFrom(from, m.kind, m.key); });
    def('NREL', 'h2c', (ses, from, m) => { if (Night.KINDS.includes(m.kind)) Night.released(m.kind); });
    def('NVIEW', 'h2c', (ses, from, m) => { Night.setView(m.v); });
    def('RITUAL_GO', 'h2c', (ses, from, m) => {
        if (!RITUAL_KINDS.includes(m.kind) || !isInt(m.token, 1, 1e9)) return;
        const rl = ses.rl;
        if (!rl || rl.kind !== m.kind || rl.phase !== 'ready') return;      // only players who actually asked can be released
        rl.phase = 'go'; rl.token = m.token;
        const w = sanitizeWorld(m.world); if (w) ses.pendingWorld = w;      // start from the host's clock/weather (drift rule still applies)
        ses.ritualUi();
    });
    def('RITUAL_ABORT', 'h2c', (ses, from, m) => {
        if (!RITUAL_KINDS.includes(m.kind)) return;
        if (ses.rl && ses.rl.kind === m.kind && (ses.rl.phase === 'ready')) { ses.rl.phase = 'abort'; ses.rl.msg = cleanStr(m.reason, 120); }
        ses.ritualUi(cleanStr(m.reason, 120));
    });
    def('RITUAL_DENY', 'h2c', (ses, from, m) => {
        if (ses.rl && ses.rl.phase === 'ready') { ses.rl.phase = 'abort'; ses.rl.msg = cleanStr(m.reason, 120); }
        ses.ritualUi(cleanStr(m.reason, 120));
    });
    def('RITUAL_COMPLETE', 'h2c', (ses, from, m) => {
        if (!RITUAL_KINDS.includes(m.kind)) return;
        if (ses.rl && ses.rl.kind === m.kind && (ses.rl.phase === 'go' || ses.rl.phase === 'finishing') && ses.rl.token === m.token) ses.rl = null;
        const w = sanitizeWorld(m.world); if (w) ses.pendingWorld = w;      // everyone leaves the ritual on the host's clock
        if (m.kind === 'sleep' && ses.saveSlot) ses.autosavePending = true;  // save to the co-op slot once the player is idle
        ses.ritualUi(m.kind === 'sleep' ? 'Everyone is awake.' : 'Everyone is refreshed.');
    });

    // ---- shared monster / room flags ----
    def('FLAG_PUSH', 'c2h', (ses, from, m) => {
        const p = ses.peers.get(from);
        if (!p || !Shared.valid(m.e)) return;
        const now = Date.now();
        if (now - (p.flagWin || 0) > 1000) { p.flagWin = now; p.flagN = 0; }
        if (++p.flagN > 200) return;                                          // per-peer rate limit
        Shared.apply(m.e);
        ses.broadcast({ t: 'FLAG_SET', e: m.e }, from);
    });
    def('FLAG_LIST', 'c2h', (ses, from, m) => {                              // a batch of world changes from one player
        const p = ses.peers.get(from);
        if (!p || !Array.isArray(m.list) || m.list.length > 300) return;
        const now = Date.now();
        if (now - (p.flagWin || 0) > 1000) { p.flagWin = now; p.flagN = 0; }
        if ((p.flagN += m.list.length) > 3000) return;                        // per-peer rate limit
        const ok = m.list.filter(e => Shared.valid(e));
        ok.forEach(e => Shared.applySafe(e));
        if (ok.length) ses.broadcast({ t: 'FLAG_BULK', list: ok }, from);
    });
    def('FLAG_SET', 'h2c', (ses, from, m) => { if (Shared.valid(m.e)) Shared.applySafe(m.e); });
    // the opening together (§7k)
    def('OPEN_READY', 'c2h', (ses, from) => { Opening.ready.add(from); });
    // festivals together (§7l)
    def('FEST_UP', 'c2h', (ses, from, m) => { if (m.by !== from && m.k !== 'answer') return; if (m.k === 'answer' && m.id !== from) return; const out = Object.assign({}, m, { t: 'FEST' }); Festival.receive(out); ses.broadcast(out, from); });
    def('FEST', 'h2c', (ses, from, m) => Festival.receive(m));
    def('OPEN_GO', 'h2c', () => { if (window.$gameSystem) $gameSystem._coopOpeningGo = true; Opening.waiting = false; });
    def('FX', 'c2h', (ses, from, m) => { if (!Fx.valid(m)) return; const p = ses.peers.get(from); if (!p) return; Fx.apply(from, m); ses.broadcast(Object.assign({}, m, { t: 'FX_ALL', by: from }), from); });   // decision 92
    def('TUT', 'c2h', (ses, from, m) => { if (!Tutorials.is(m.ce) || !ses.peers.get(from)) return; Tutorials.got(m.ce); ses.broadcast({ t: 'TUT_ALL', ce: m.ce, by: from }, from); });   // decision 106
    def('TUT_ALL', 'h2c', (ses, from, m) => { if (m.by !== ses.selfId) Tutorials.got(m.ce); });
    def('ACH', 'c2h', (ses, from, m) => { if (!Achievements.valid(m.id) || !ses.peers.get(from)) return; Achievements.remember(m.id); Achievements.got(m.id); ses.broadcast({ t: 'ACH_ALL', id: m.id, by: from }, from); });   // a world milestone (achievements)
    def('ACH_ALL', 'h2c', (ses, from, m) => { if (m.by !== ses.selfId && Achievements.valid(m.id)) { Achievements.remember(m.id); Achievements.got(m.id); } });
    def('FX_ALL', 'h2c', (ses, from, m) => { if (typeof m.by === 'string' && m.by !== ses.selfId) Fx.apply(m.by, m); });
    def('MOONRDY', 'c2h', (ses, from, m) => { const r = MoonSync.clean(m); if (r) MoonSync.ready.set(from, r); });   // decision 92
    def('MOONGO', 'h2c', (ses, from, m) => { if (typeof m.k === 'string' && m.k.length <= 24) MoonSync.go(m.k); });
    def('FLAG_BULK', 'h2c', (ses, from, m) => {
        if (!Array.isArray(m.list) || m.list.length > 300) return;
        const was = m.rep === 1 && window.$gameSwitches ? m.list.map(e => Desync.valueOf(e)) : null;
        m.list.forEach(e => { if (Shared.valid(e)) Shared.applySafe(e); });
        if (was) Desync.noteRepair(m.list, was);
    });

    // chests (host authority)
    function applyChestView(ses, id, items) {
        if (typeof id !== 'string' || !CHEST_RE.test(id) || !Array.isArray(items)) return;
        ses.chestView.set(id, items.filter(e => e && typeof e.key === 'string' && isInt(e.n, 1, 99999)).slice(0, 64));
    }
    def('CHEST_OP', 'c2h', (ses, from, m) => {
        const reply = (ok, reason) => ses.send(from, { t: 'CHEST_RESULT', rid: m.rid, ok, reason: reason || '' });
        if (typeof m.rid !== 'string' || m.rid.length > 64 || !CHEST_RE.test(String(m.chest))) return;
        let seen = ses.seenRid.get(from); if (!seen) ses.seenRid.set(from, seen = new Set());
        if (seen.has(m.rid)) return;                        // replayed request
        seen.add(m.rid); if (seen.size > 200) seen.delete(seen.values().next().value);
        const list = Items.clean([{ k: m.k, id: m.id, n: m.n }]);
        if (!list || (m.op !== 'deposit' && m.op !== 'withdraw')) return reply(false, 'invalid request');
        const store = ses.chestStore.get(m.chest) || new Map();
        const key = list[0].k + ':' + list[0].id, have = store.get(key) || 0;
        if (m.op === 'deposit') {
            if (!store.has(key) && store.size >= 64) return reply(false, 'chest full');
            store.set(key, have + list[0].n);
        } else {
            if (have < list[0].n) return reply(false, 'not enough in chest');
            if (have === list[0].n) store.delete(key); else store.set(key, have - list[0].n);
        }
        ses.chestStore.set(m.chest, store);
        const view = Array.from(store.entries()).map(([k2, n2]) => ({ key: k2, n: n2 }));
        ses.chestView.set(m.chest, view);
        reply(true);
        const st = { t: 'CHEST_STATE', chest: m.chest, items: view };
        ses.broadcast(st); ses.send(ses.selfId, Object.assign({}, st));
    });
    def('CHEST_RESULT', 'h2c', (ses, from, m) => {
        const p = ses.pendingChest.get(m.rid);
        if (!p) return;                                      // unknown/duplicate result
        ses.pendingChest.delete(m.rid);
        if (m.ok === true && p.op === 'withdraw') ses.give(p.list);
        if (m.ok !== true && p.op === 'deposit') ses.give(p.list);   // refund
        if (ses.ui.chest) ses.ui.chest(ses, m.ok === true, cleanStr(m.reason, 60));
    });
    def('CHEST_STATE', 'h2c', (ses, from, m) => applyChestView(ses, m.chest, m.items));

    // trade: host side
    def('TRADE_REQUEST', 'c2h', (ses, from, m) => {
        const to = String(m.to);
        if (to === from || !ses.isMember(to) || ses.tradeOf(from) || ses.tradeOf(to))
            return ses.send(from, { t: 'TRADE_DENY', reason: 'That player is unavailable.' });
        const tid = 'T' + (++ses.tradeCounter);
        ses.trades.set(tid, { tid, ids: [from, to], offers: { [from]: [], [to]: [] }, ver: 0, conf: {}, prep: {}, phase: 'invite' });
        ses.send(to, { t: 'TRADE_INVITE', tid, peer: from });
    });
    def('TRADE_ANSWER', 'c2h', (ses, from, m) => {
        const s = ses.trades.get(m.tid);
        if (!s || s.phase !== 'invite' || s.ids[1] !== from) return;
        if (m.accept !== true) { ses.trades.delete(s.tid); return ses.send(s.ids[0], { t: 'TRADE_DENY', reason: 'Trade declined.' }); }
        s.phase = 'open';
        ses.send(s.ids[0], { t: 'TRADE_OPEN', tid: s.tid, peer: s.ids[1] });
        ses.send(s.ids[1], { t: 'TRADE_OPEN', tid: s.tid, peer: s.ids[0] });
    });
    def('TRADE_OFFER', 'c2h', (ses, from, m) => {
        const s = ses.trades.get(m.tid), list = Items.clean(m.items);
        if (!s || s.phase !== 'open' || !s.ids.includes(from) || !list) return;
        s.offers[from] = list; s.ver++; s.conf = {};
        s.ids.forEach(id => {
            const other = s.ids[0] === id ? s.ids[1] : s.ids[0];
            ses.send(id, { t: 'TRADE_OFFER_UPDATE', tid: s.tid, ver: s.ver, mine: s.offers[id], theirs: s.offers[other] });
        });
    });
    def('TRADE_CONFIRM', 'c2h', (ses, from, m) => {
        const s = ses.trades.get(m.tid);
        if (!s || s.phase !== 'open' || !s.ids.includes(from) || m.ver !== s.ver) return;   // stale confirms ignored
        s.conf[from] = true;
        if (s.ids.every(id => s.conf[id])) { s.phase = 'prepare'; s.ids.forEach(id => ses.send(id, { t: 'TRADE_PREPARE', tid: s.tid, ver: s.ver })); }
    });
    def('TRADE_PREPARED', 'c2h', (ses, from, m) => {
        const s = ses.trades.get(m.tid);
        if (!s || s.phase !== 'prepare' || !s.ids.includes(from) || from in s.prep) return;
        s.prep[from] = m.ok === true;
        if (m.ok !== true) return ses.abortSession(s, cleanStr(m.reason, 80) || 'Trade could not be prepared.');
        if (s.ids.every(id => s.prep[id] === true)) {
            s.phase = 'done'; ses.trades.delete(s.tid);
            s.ids.forEach(id => {
                const other = s.ids[0] === id ? s.ids[1] : s.ids[0];
                ses.send(id, { t: 'TRADE_COMMIT', tid: s.tid, get: s.offers[other] });
            });
        }
    });
    def('TRADE_CANCEL', 'c2h', (ses, from, m) => {
        const s = ses.trades.get(m.tid);
        if (s && s.ids.includes(from)) ses.abortSession(s, 'Partner cancelled the trade.');
    });

    // trade: endpoint side
    def('TRADE_DENY', 'h2c', (ses, from, m) => {
        if (ses.localTrade && !ses.localTrade.escrow && (ses.localTrade.phase === 'waiting' || ses.localTrade.phase === 'invited')) ses.abortLocalTrade(cleanStr(m.reason, 80));
    });
    def('TRADE_INVITE', 'h2c', (ses, from, m) => {
        if (typeof m.tid !== 'string' || typeof m.peer !== 'string') return;
        if (ses.localTrade) return ses.sendTo(ses.hostId, { t: 'TRADE_ANSWER', tid: m.tid, accept: false });
        ses.localTrade = { tid: m.tid, partner: m.peer, phase: 'invited' };
        ses.tradeUi();
    });
    def('TRADE_OPEN', 'h2c', (ses, from, m) => {
        const lt = ses.localTrade;
        if (!lt || (lt.phase !== 'waiting' && lt.phase !== 'accepted') || typeof m.tid !== 'string') return;
        ses.localTrade = { tid: m.tid, partner: lt.partner, phase: 'open', mine: [], theirs: [], ver: 0, confirmed: false, escrow: null };
        ses.tradeUi();
    });
    def('TRADE_OFFER_UPDATE', 'h2c', (ses, from, m) => {
        const lt = ses.localTrade, mine = Items.clean(m.mine), theirs = Items.clean(m.theirs);
        if (!lt || lt.tid !== m.tid || lt.phase !== 'open' || !mine || !theirs || !isInt(m.ver, 0, 1e9)) return;
        Object.assign(lt, { mine, theirs, ver: m.ver, confirmed: false });
        ses.tradeUi();
    });
    def('TRADE_PREPARE', 'h2c', (ses, from, m) => {
        const lt = ses.localTrade;
        if (!lt || lt.tid !== m.tid || lt.phase !== 'open' || lt.escrow) return;
        const reply = (ok, reason) => ses.sendTo(ses.hostId, { t: 'TRADE_PREPARED', tid: lt.tid, ok, reason });
        if (m.ver !== lt.ver) return reply(false, 'Offer changed.');
        if (!ses.has(lt.mine)) return reply(false, 'Missing offered items.');
        ses.take(lt.mine);                                       // lock into escrow
        if (!ses.canHold(lt.theirs)) { ses.give(lt.mine); return reply(false, 'Not enough inventory space.'); }
        lt.escrow = lt.mine; lt.phase = 'preparing';
        reply(true);
    });
    def('TRADE_COMMIT', 'h2c', (ses, from, m) => {
        const lt = ses.localTrade;
        if (!lt || lt.tid !== m.tid || lt.phase !== 'preparing' || !lt.escrow) return;   // applied at most once
        const get = Items.clean(m.get);
        if (!get) return ses.abortLocalTrade('Corrupt trade data.');
        lt.escrow = null; ses.give(get); ses.localTrade = null;
        ses.tradeUi('Trade complete.');
    });
    def('TRADE_ABORT', 'h2c', (ses, from, m) => {
        if (ses.localTrade && ses.localTrade.tid === m.tid) ses.abortLocalTrade(cleanStr(m.reason, 80) || 'Trade aborted.');
    });

    // =====================================================================
    // 5. TRANSPORTS
    // =====================================================================
    /** Steam transport over Greenworks lobbies + legacy P2P.
     *  Call shapes follow mainline Greenworks (createLobby(type,max), joinLobby(id), getLobbyOwner(id),
     *  sendP2PPacket(id,sendType,data,channel), readP2PPacket(size,channel) -> {data, steamIDRemote},
     *  acceptP2PSessionWithUser(id)) and the function/event names present in this game's greenworks-win64.node.
     *  UNVERIFIED in a live Steam session: the exact event payload shapes, so ids are extracted defensively
     *  and raw payloads are put in error messages. The sender of every packet is steamIDRemote (authenticated
     *  by Steam), never a field of the payload. */
    const STEAM_ID_RE = /^\d{15,20}$/;
    function steamIdOf(x, depth) {
        depth = depth || 0;
        if (x === null || x === undefined || depth > 3) return '';
        if (typeof x === 'bigint' || typeof x === 'number') { const s = String(x); return STEAM_ID_RE.test(s) ? s : ''; }
        if (typeof x === 'string') return STEAM_ID_RE.test(x) ? x : '';
        if (typeof x !== 'object') return '';
        for (const k of ['steamId', 'steamID', 'steamIDLobby', 'steamIDRemote', 'm_steamIDLobby', 'lobbyId', 'id']) {
            if (k in x) { const r = steamIdOf(x[k], depth + 1); if (r) return r; }
        }
        if (typeof x.getRawSteamID === 'function') { try { const r = steamIdOf(x.getRawSteamID(), depth + 1); if (r) return r; } catch (e) { /* ignore */ } }
        for (const k of Object.keys(x)) { const r = steamIdOf(x[k], depth + 1); if (r) return r; }
        return '';
    }
    function steamIdFromArgs(args) {
        for (const a of args) { const r = steamIdOf(a); if (r) return r; }
        return '';
    }
    function rawPayload(args) { try { return JSON.stringify(args, (k, v) => typeof v === 'bigint' ? String(v) : v).slice(0, 200); } catch (e) { return String(args).slice(0, 200); } }

    function makeJoinCode() {
        try { return String(require('crypto').randomInt(100000, 1000000)); }
        catch (e) { return String(100000 + Math.floor(Math.random() * 900000)); }
    }

    /** Steam friends who are in Welcome to Elderfield and hosting a co-op world now (user, 2026-11-01): the host's Steam
     *  transport sets rich presence (ec_lobby), which Steam shares only with friends in the same game; the Join tab lists
     *  them by their Steam name and joins the lobby directly, no code to type. */
    const SteamFriends = {
        APP: '3195440',
        gw() { const cs = window.CycloneSteam; return cs && cs.greenworks && cs.running !== false ? cs.greenworks : null; },
        available() { const gw = this.gw(); return !!gw && typeof gw.getFriends === 'function' && typeof gw.getFriendRichPresence === 'function'; },
        hosting() {
            const gw = this.gw(); if (!this.available()) return [];
            let friends = []; try { friends = gw.getFriends((gw.FriendFlags && gw.FriendFlags.Immediate) || 4) || []; } catch (e) { return []; }
            const out = [];
            friends.slice(0, 1000).forEach(f => {
                try {
                    const id = String(f.getRawSteamID());
                    const g = typeof gw.getFriendGamePlayed === 'function' ? gw.getFriendGamePlayed(id) : null;
                    if (g && String(g.m_gameID || '') !== this.APP) return;                     // not in WTE right now
                    const lobby = String(gw.getFriendRichPresence(id, 'ec_lobby') || '');
                    if (!STEAM_ID_RE.test(lobby)) return;                                        // in WTE, not hosting
                    out.push({ id, lobby, name: cleanStr(typeof f.getPersonaName === 'function' ? f.getPersonaName() : '', 32) || 'A friend',
                               world: cleanStr(String(gw.getFriendRichPresence(id, 'ec_world') || ''), 30), code: String(gw.getFriendRichPresence(id, 'ec_code') || '').replace(/\D/g, '').slice(0, 6),
                               mods: (m => m.charAt(0) === '+' ? m.slice(1).split('|').filter(Boolean) : null)(String(gw.getFriendRichPresence(id, 'ec_mods') || '')) });   // ('+' even with no mods; an older co-op says nothing: null)
                } catch (e) { /* one friend */ }
            });
            return out.sort((a, b) => a.name.localeCompare(b.name));
        },
        /** Every Steam friend, for the host's invite list: those in WTE now first (`inWte`), then the rest by name. */
        all() {
            const gw = this.gw(); if (!gw || typeof gw.getFriends !== 'function') return [];
            let friends = []; try { friends = gw.getFriends((gw.FriendFlags && gw.FriendFlags.Immediate) || 4) || []; } catch (e) { return []; }
            const out = [];
            friends.slice(0, 1000).forEach(f => {
                try {
                    const id = String(f.getRawSteamID()); if (!STEAM_ID_RE.test(id)) return;
                    const g = typeof gw.getFriendGamePlayed === 'function' ? gw.getFriendGamePlayed(id) : null;
                    out.push({ id, inWte: !!g && String(g.m_gameID || '') === this.APP, name: cleanStr(typeof f.getPersonaName === 'function' ? f.getPersonaName() : '', 32) || 'A friend' });
                } catch (e) { /* one friend */ }
            });
            return out.sort((a, b) => (b.inWte - a.inWte) || a.name.localeCompare(b.name));
        }
    };

    /** Steam invites (user, 2026-11-04: "steam invites would be cool"). The host's world can be joined from Steam itself:
     *  "Join Game" on the host in the Steam friends list (rich presence `connect`), or an invite the host sends (Steam's
     *  own invite window, or the friends list in the co-op panel). Accepting one in Steam, with the game open or closed
     *  (Steam then starts it with "+connect_lobby <id>"), opens the Co-op menu and joins that lobby; the usual join checks
     *  (game version, mods, co-op build) still apply. An invite only received (not yet accepted) is told and listed in
     *  the Join tab; nothing joins without the player choosing it. */
    const SteamInvites = {
        pending: null, MAX_AGE: 15 * 60000, installed: false, stamp: 0,
        /** Every Steam ID in an event's payload, with its account type (Steam ID bits 52-55: 1 a person, 8 a lobby). */
        ids(args) {
            const out = [], seen = new Set();
            const walk = (x, d) => {
                if (x === null || x === undefined || d > 3) return;
                const id = steamIdOf(typeof x === 'object' ? null : x);
                if (id) { if (!seen.has(id)) { seen.add(id); out.push(id); } return; }
                if (typeof x !== 'object') return;
                if (typeof x.getRawSteamID === 'function') { try { walk(x.getRawSteamID(), d + 1); } catch (e) { /* ignore */ } }
                Object.keys(x).forEach(k => walk(x[k], d + 1));
            };
            args.forEach(a => walk(a, 0));
            return out;
        },
        kind(id) { try { return Number((BigInt(id) >> 52n) & 15n); } catch (e) { return 0; } },
        /** "+connect_lobby <id>" in a launch line or a rich-presence join's connect text. */
        lobbyInText(s) { const m = /\+connect_lobby\s+(\d{15,20})/.exec(String(s || '')); return m ? m[1] : ''; },
        nameOf(id) { const gw = SteamFriends.gw(); try { return id && gw && typeof gw.getFriendPersonaName === 'function' ? cleanStr(gw.getFriendPersonaName(id), 32) : ''; } catch (e) { return ''; } },
        take(args, accepted, how) {
            const ids = this.ids(args), texts = args.filter(a => typeof a === 'string').concat(args.filter(a => a && typeof a === 'object').map(a => Object.values(a).filter(v => typeof v === 'string').join(' ')));
            const lobby = ids.find(id => this.kind(id) === 8) || texts.map(t => this.lobbyInText(t)).find(Boolean) || '';
            if (!lobby) { Diag.log('warn', 'Steam invite (' + how + ') without a lobby: ' + rawPayload(args)); return null; }
            const from = ids.find(id => this.kind(id) === 1) || '';
            if (this.pending && this.pending.lobby === lobby && this.pending.accepted && !accepted) return this.pending;   // already accepted
            this.pending = { lobby, from, name: this.nameOf(from), accepted: !!accepted, at: Date.now(), told: false, how };
            this.stamp++;
            Diag.log('info', 'Steam invite ' + (accepted ? 'accepted' : 'received') + ' (' + how + '): lobby ' + lobby + (from ? ' from ' + from : ''));
            return this.pending;
        },
        /** Steam's events, once Steam is up; and a game Steam started to accept an invite (its launch line). */
        install() {
            if (this.installed) return true;
            const gw = SteamFriends.gw(); if (!gw || typeof gw.on !== 'function') return false;
            this.installed = true;
            const on = (ev, fn) => { try { gw.on(ev, fn); } catch (e) { Diag.log('warn', 'Steam event ' + ev + ' not available'); } };
            on('lobby-join-requested', (...a) => this.take(a, true, 'invite accepted in Steam'));
            on('rich-presence-join-requested', (...a) => this.take(a, true, 'Join Game in Steam'));
            on('lobby-invite', (...a) => this.take(a, false, 'invite'));
            on('new-url-launch-parameters', () => this.fromLaunch());
            this.fromLaunch();
            return true;
        },
        fromLaunch() {
            let args = [];
            try { if (typeof nw !== 'undefined' && nw.App) args = [].concat(nw.App.fullArgv || [], nw.App.argv || []); } catch (e) { /* not NW.js */ }
            try { const gw = SteamFriends.gw(); if (gw && typeof gw.getLaunchCommandLine === 'function') args.push(String(gw.getLaunchCommandLine() || '')); } catch (e) { /* older Steam */ }
            const lobby = this.lobbyInText(args.map(String).join(' '));
            if (lobby && !(this.pending && this.pending.lobby === lobby) && lobby !== this.launched) { this.launched = lobby; this.take([lobby], true, 'game started by Steam'); }
        },
        /** The invite still waiting (15 minutes at most, and not the world this game is already in). */
        current() {
            const p = this.pending;
            if (!p || Date.now() - p.at > this.MAX_AGE) return null;
            const t = Net.transport; if (t && t.lobbyId === p.lobby && Net.state !== S.ERROR && Net.state !== S.MENU) return null;
            return p;
        },
        clear() { if (this.pending) { this.pending = null; this.stamp++; } },
        /** Host: the lobby friends are invited to ('' when not hosting over Steam). */
        hostLobby() { const t = Net.transport; return Net.isHost && t instanceof SteamTransport && t.gw && t.lobbyId ? t.lobbyId : ''; },
        overlay() { const gw = SteamFriends.gw(); try { return !!gw && typeof gw.activateGameOverlayInviteDialog === 'function' && (typeof gw.isGameOverlayEnabled !== 'function' || !!gw.isGameOverlayEnabled()); } catch (e) { return false; } },
        openOverlay() { const id = this.hostLobby(); if (!id) return false; try { SteamFriends.gw().activateGameOverlayInviteDialog(id); return true; } catch (e) { Diag.err('Steam invite window', e); return false; } },
        invite(friendId) {
            const id = this.hostLobby(), gw = SteamFriends.gw();
            if (!id || !gw || typeof gw.inviteUserToLobby !== 'function') return false;
            try { return gw.inviteUserToLobby(id, friendId) !== false; } catch (e) { Diag.err('Steam invite', e); return false; }
        }
    };

    class SteamTransport {
        constructor() { this.members = new Set(); this.listeners = []; }
        init() {
            if (typeof require !== 'function') throw new Error('Steam transport needs NW.js (require() unavailable).');
            // This game loads Greenworks via CycloneSteam (require('./greenworks') from the game root); reuse that instance.
            const cs = window.CycloneSteam;
            if (!cs || !cs.greenworks) throw new Error('Steam is not initialised (launch the game through Steam; CycloneSteam.greenworks is unavailable).');
            const gw = cs.greenworks;
            const need = ['getSteamId', 'createLobby', 'joinLobby', 'leaveLobby', 'getLobbyOwner', 'getNumLobbyMembers', 'getLobbyMemberByIndex',
                'acceptP2PSessionWithUser', 'closeP2PSessionWithUser', 'isP2PPacketAvailable', 'readP2PPacket', 'sendP2PPacket', 'on', 'removeListener'];
            const missing = need.filter(n => typeof gw[n] !== 'function');
            if (missing.length) throw new Error('This Greenworks build lacks: ' + missing.join(', ') + '. Use the relay transport instead.');
            if (cs.running === false) throw new Error('Steam API is not running.');
            this.selfId = steamIdOf(gw.getSteamId());
            if (!this.selfId) throw new Error('Could not read your Steam ID.');
            this.gw = gw;
            this.listen('p2p-session-request', (...a) => this.onSessionRequest(steamIdFromArgs(a)));
            this.listen('p2p-session-connect-fail', (...a) => { const id = steamIdFromArgs(a); if (id && id !== this.selfId) this.refreshMembers(); });
            this.listen('lobby-chat-update', () => this.refreshMembers());
        }
        listen(ev, fn) { this.gw.on(ev, fn); this.listeners.push([ev, fn]); }
        once(ev, ms, what) {
            return new Promise((res, rej) => {
                // its own hold on Steam: an answer (or the timeout) after close() never reads the gone connection (2026-11-04)
                let to; const gw = this.gw;
                const off = () => { try { gw.removeListener(ev, fn); } catch (e) { /* already gone */ } };
                const fn = (...a) => { clearTimeout(to); off(); if (this.gw) res(a); else rej(new Error(what + ': the Steam connection was closed.')); };
                to = setTimeout(() => { off(); rej(new Error(what + ' timed out.')); }, ms);
                gw.on(ev, fn);
            });
        }
        lobbyType() {
            // Steam's ELobbyType: 0 Private, 1 FriendsOnly, 2 Public, 3 Invisible (findable by search, not listed to friends).
            // FriendsOnly lobbies never appear in searches, so the short code needs Invisible or Public.
            const t = CFG.steamLobbyType === 'friends' ? 'FriendsOnly' : CFG.steamLobbyType === 'public' ? 'Public' : 'Invisible';
            const e = this.gw.LobbyType;
            if (e && typeof e[t] === 'number') return e[t];
            return { FriendsOnly: 1, Public: 2, Invisible: 3 }[t];
        }
        async host(max) {
            this.init();
            const ev = this.once('lobby-created', 10000, 'Creating the Steam lobby');
            ev.catch(() => {});                       // avoid an unhandled rejection if createLobby throws first
            try { this.gw.createLobby(this.lobbyType(), max); } catch (e) { throw new Error('Lobby creation failed: ' + (e && e.message || e)); }
            const args = await ev;
            this.stillOpen();
            const id = steamIdFromArgs(args);
            if (!id) throw new Error('Steam lobby was created but its id could not be read. Payload: ' + rawPayload(args));
            this.lobbyId = id;
            let code = id;
            if (CFG.steamLobbyType !== 'friends') {                 // searchable lobby: publish a short random join code
                let c = makeJoinCode();
                try {
                    // never reuse a code that another open lobby already shows (a failed search just skips the check)
                    let taken = new Set();
                    try { taken = new Set((await this.searchOnce(3000)).filter(l => l.id !== id).map(l => l.code)); } catch (e) { /* no info */ }
                    for (let i = 0; i < 20 && taken.has(c); i++) c = makeJoinCode();
                    if (typeof this.gw.setLobbyData !== 'function') throw new Error('setLobbyData is missing');
                    this.gw.setLobbyData(id, 'ec_code', c); this.gw.setLobbyData(id, 'ec_proto', String(CFG.protocol));
                    code = c;
                } catch (e) { console.warn('[Elderfield MP] could not publish a short code; using the long lobby ID', e); }
            }
            this.refreshMembers();
            this.startPoll();
            // friends in WTE see this world in their Join tab (Steam shares this "rich presence" only with friends in the same game)
            try { this.gw.setRichPresence('ec_lobby', id); this.gw.setRichPresence('ec_code', code); this.gw.setRichPresence('ec_world', String((Net.world && Net.world.name) || 'Elderfield').slice(0, 30)); this.gw.setRichPresence('ec_mods', '+' + Mods.stamp().join('|').slice(0, 250)); this.gw.setRichPresence('status', 'Hosting Elderfield co-op'); } catch (e) { /* the code still works */ }
            try { this.gw.setRichPresence('connect', '+connect_lobby ' + id); } catch (e) { /* no "Join Game" in Steam; invites and the code still work */ }
            return { selfId: this.selfId, code, long: id };
        }
        /** One lobby search. Steam gives no filter in this Greenworks build, so list (max 50) and read each lobby's `ec_code`. */
        async searchOnce(timeoutMs) {
            const gw = this.gw;
            for (const n of ['requestLobbyList', 'getLobbyByIndex', 'getLobbyData']) {
                if (typeof gw[n] !== 'function') throw new Error('This Greenworks build cannot search lobbies (' + n + ' missing). Use the long lobby ID.');
            }
            const ev = this.once('lobby-match-list', timeoutMs || 8000, 'Searching for the lobby'); ev.catch(() => {});
            try { gw.requestLobbyList(); } catch (e) { throw new Error('Lobby search failed: ' + (e && e.message || e)); }
            const args = await ev;
            let count = 50;                                         // payload shape is undocumented: take a count if one is given
            for (const a of args) { if (typeof a === 'number' && Number.isFinite(a) && a >= 0) { count = a; break; } }
            const out = [];
            for (let i = 0; i < Math.min(count, 50); i++) {
                let id = ''; try { id = steamIdOf(gw.getLobbyByIndex(i)); } catch (e) { break; }
                if (!id) break;                                     // past the end of the list
                let v = ''; try { v = String(gw.getLobbyData(id, 'ec_code') || ''); } catch (e) { v = ''; }
                out.push({ id, code: v });
            }
            return out;
        }
        /** The short code is only a label stored on the real lobby; joining always resolves it to that lobby's long ID. */
        async findByCode(code) {
            for (let attempt = 0; attempt < 3; attempt++) {
                if (attempt) await new Promise(r => setTimeout(r, this.retryMs === undefined ? 1500 : this.retryMs));
                const hit = (await this.searchOnce()).find(l => l.code === code);
                if (hit) return hit.id;
            }
            throw new Error('No lobby with code ' + code + ' was found. The code only finds lobbies near you; if the host is far away, enter the long lobby ID shown under their code.');
        }
        async join(code) {
            this.init();
            code = String(code).replace(/\s+/g, '');
            if (/^\d{6}$/.test(code)) { code = await this.findByCode(code); this.stillOpen(); }
            else if (!STEAM_ID_RE.test(code)) throw new Error('Enter the 6-digit code from the host (or the long lobby ID).');
            const ev = this.once('lobby-enter', 10000, 'Joining the Steam lobby');
            ev.catch(() => {});
            try { this.gw.joinLobby(code); } catch (e) { throw new Error('Joining lobby failed: ' + (e && e.message || e)); }
            const args = await ev;
            this.stillOpen();
            const entered = steamIdFromArgs(args);
            if (entered && entered !== code) throw new Error('Joined a different lobby than requested. Payload: ' + rawPayload(args));
            this.lobbyId = code;
            const hostId = steamIdOf(this.gw.getLobbyOwner(code));
            if (!hostId) throw new Error('Could not read the lobby owner.');
            this.hostId = hostId;
            this.refreshMembers();
            this.startPoll();
            return { selfId: this.selfId, hostId };
        }
        refreshMembers() {
            if (!this.gw || !this.lobbyId) return;
            let now = new Set();
            try {
                const n = this.gw.getNumLobbyMembers(this.lobbyId);
                for (let i = 0; i < n && i < 64; i++) { const id = steamIdOf(this.gw.getLobbyMemberByIndex(this.lobbyId, i)); if (id) now.add(id); }
            } catch (e) { return; }
            const gone = [...this.members].filter(id => !now.has(id) && id !== this.selfId);
            this.members = now;
            gone.forEach(id => { try { this.gw.closeP2PSessionWithUser(id); } catch (e) { /* ignore */ } if (this.onPeerLeft) this.onPeerLeft(id); });
        }
        isAllowed(id) {
            if (!id || id === this.selfId) return false;
            if (this.hostId) return id === this.hostId;       // a client talks to the host only
            return this.members.has(id);                       // the host talks to lobby members only
        }
        onSessionRequest(id) {
            if (!id) return;
            if (!this.members.has(id)) this.refreshMembers();  // a new member may not be listed yet
            if (this.isAllowed(id)) { try { this.gw.acceptP2PSessionWithUser(id); } catch (e) { console.warn('[Elderfield MP] accept failed', e); } }
        }
        send(to, str) {
            if (!this.gw) return;
            const ok = this.gw.sendP2PPacket(to, 2, Buffer.from(str, 'utf8'), 0);     // 2 = Reliable
            if (ok === false) console.warn('[Elderfield MP] Steam refused to send a packet');
        }
        /** A host or join that finished after the connection was closed (cancelled, timed out) goes no further. */
        stillOpen() { if (!this.gw) throw new Error('The Steam connection was closed while it was being set up.'); }
        startPoll() {
            this.stillOpen();
            clearInterval(this.timer); clearInterval(this.memberTimer);   // never a second poll beside the first (close() stops only one)
            this.timer = setInterval(() => {
                if (!this.gw) { clearInterval(this.timer); clearInterval(this.memberTimer); return; }   // closed: a poll never reads a gone connection
                let n, guard = 0;
                while (guard++ < 64 && (n = this.gw.isP2PPacketAvailable(0))) {
                    let pkt; try { pkt = this.gw.readP2PPacket(n, 0); } catch (e) { break; }
                    if (!pkt) break;                                                  // never spin on a failed read
                    const from = steamIdOf(pkt.steamIDRemote);
                    if (!this.isAllowed(from)) { this.dropped = (this.dropped || 0) + 1; continue; }
                    const d = pkt.data;
                    const s = typeof d === 'string' ? d : (d ? Buffer.from(d).toString('utf8') : '');
                    if (s && this.onMessage) this.onMessage(from, s);
                }
            }, 33);
            this.memberTimer = setInterval(() => this.refreshMembers(), 2000);
        }
        close() {
            clearInterval(this.timer); clearInterval(this.memberTimer);
            if (this.gw) {
                this.listeners.forEach(([ev, fn]) => { try { this.gw.removeListener(ev, fn); } catch (e) { /* ignore */ } });
                this.members.forEach(id => { try { this.gw.closeP2PSessionWithUser(id); } catch (e) { /* ignore */ } });
                if (this.lobbyId) { try { this.gw.leaveLobby(this.lobbyId); } catch (e) { /* ignore */ } }
                try { if (typeof this.gw.clearRichPresence === 'function') this.gw.clearRichPresence(); } catch (e) { /* ignore */ }   // no longer listed as hosting
            }
            this.listeners = []; this.gw = null;
        }
    }

    class RelayTransport {
        open() {
            return new Promise((res, rej) => {
                if (typeof WebSocket === 'undefined') return rej(new Error('WebSocket unavailable in this runtime.'));
                const ws = this.ws = new WebSocket(CFG.relayUrl);
                ws.onopen = () => res();
                ws.onerror = () => rej(new Error('Cannot reach relay at ' + CFG.relayUrl));
                ws.onmessage = e => this.recv(e.data);
                ws.onclose = () => { if (this.onClosed) this.onClosed('Connection to relay closed.'); };
            });
        }
        request(msg, expect) {
            return new Promise((res, rej) => {
                this.pending = { expect, res, rej };
                this.ws.send(JSON.stringify(msg));
                setTimeout(() => { if (this.pending && this.pending.rej === rej) { this.pending = null; rej(new Error('Relay did not answer.')); } }, 8000);
            });
        }
        async host(max) { await this.open(); const m = await this.request({ op: 'host', max }, 'hosted'); return { selfId: m.id, code: m.code }; }
        async join(code) { await this.open(); const m = await this.request({ op: 'join', code }, 'joined'); return { selfId: m.id, hostId: m.hostId }; }
        send(to, str) { this.ws.send(JSON.stringify({ op: 'to', to, data: str })); }
        recv(data) {
            let m; try { m = JSON.parse(data); } catch (e) { return; }
            if (m.op === 'msg') { if (this.onMessage) this.onMessage(String(m.from), m.data); }   // `from` set by relay
            else if (m.op === 'peer_left') { if (this.onPeerLeft) this.onPeerLeft(String(m.id)); }
            else if (m.op === 'error' && this.pending) { const p = this.pending; this.pending = null; p.rej(new Error(String(m.reason))); }
            else if (this.pending && m.op === this.pending.expect) { const p = this.pending; this.pending = null; p.res(m); }
        }
        close() { try { this.ws.close(); } catch (e) { /* ignore */ } }
    }

    // =====================================================================
    // 5b. P2P: THE HOST'S GAME IS THE SERVER (design §10)
    //     Host  = WebSocket server inside NW.js + UDP announcer for the 6-digit code + optional UPnP port mapping.
    //     Joiner= WebSocket client. Join target: 6-digit code (local network), internet code, or "ip[:port]".
    //     Framing on the socket: {op:'welcome', id, hostId} | {op:'msg', data} | {op:'bye', reason}.
    //     The host stamps the sender of every message from the socket it arrived on; payload ids are never trusted.
    // =====================================================================
    const P2P = {
        MAGIC: 'WTE-COOP', DISCOVERY_V: 1,
        nodeRequire(name) {
            if (typeof require !== 'function') throw new Error('Co-op hosting needs the desktop (NW.js) version of the game.');
            return require(name);
        },
        buf() { return this.nodeRequire('buffer').Buffer; },
        /** Candidate game folders: this plugin file's location first (js/plugins/ -> ../..), then NW.js/Node hints. */
        gameRoots() {
            const path = this.nodeRequire('path'), out = [];
            try { if (PLUGIN_FILE) out.push(path.resolve(path.dirname(PLUGIN_FILE), '..', '..')); } catch (e) { /* ignore */ }
            try { if (typeof nw !== 'undefined' && nw.App && nw.App.startPath) out.push(nw.App.startPath); } catch (e) { /* ignore */ }
            try { if (process.mainModule && process.mainModule.filename) out.push(path.dirname(process.mainModule.filename)); } catch (e) { /* ignore */ }
            try { out.push(process.cwd()); } catch (e) { /* ignore */ }
            return out;
        },
        /** The bundled ws package (js/libs/node_modules/ws), falling back to a normal require. */
        ws() {
            if (this._ws) return this._ws;
            const path = this.nodeRequire('path'), fs = this.nodeRequire('fs');
            for (const root of this.gameRoots()) {
                const p = path.join(root, 'js', 'libs', 'node_modules', 'ws');
                if (fs.existsSync(path.join(p, 'package.json'))) { this._ws = this.nodeRequire(p); return this._ws; }
            }
            this._ws = this.nodeRequire('ws');
            return this._ws;
        },
        /** A virtual-LAN adapter (decision 81): its name for the host's screen, or '' for a real network. */
        vpnKind(name, address) {
            const n = String(name || ''), a = String(address || '').split('.').map(Number);
            if (/hamachi/i.test(n) || a[0] === 25) return 'Hamachi';
            if (/radmin/i.test(n) || a[0] === 26) return 'Radmin VPN';
            if (/zerotier/i.test(n)) return 'ZeroTier';
            if (/tailscale/i.test(n) || (a[0] === 100 && a[1] >= 64 && a[1] <= 127)) return 'Tailscale';
            return '';
        },
        /** IPv4 LAN interfaces with their broadcast addresses. */
        lanInterfaces() {
            const os = this.nodeRequire('os'), out = [];
            const nets = os.networkInterfaces();
            for (const name of Object.keys(nets)) {
                for (const n of nets[name] || []) {
                    if (n.internal || (n.family !== 'IPv4' && n.family !== 4)) continue;
                    const ip = n.address.split('.').map(Number), mask = (n.netmask || '255.255.255.0').split('.').map(Number);
                    const bc = ip.map((b, i) => (b | (~mask[i] & 255))).join('.');
                    out.push({ name, address: n.address, broadcast: bc });
                }
            }
            return out;
        }
    };

    /** Internet code: IPv4 + port packed into 10 Crockford-base32 characters, shown as XXXX-XXXX-XX. */
    const InternetCode = {
        ALPHA: '0123456789ABCDEFGHJKMNPQRSTVWXYZ',
        encode(ip, port) {
            const p = String(ip).split('.').map(Number);
            if (p.length !== 4 || p.some(b => !Number.isInteger(b) || b < 0 || b > 255) || !isInt(port, 1, 65535)) return '';
            let n = 0n;
            for (const b of p) n = (n << 8n) | BigInt(b);
            n = (n << 16n) | BigInt(port);                 // 48 bits; the top 2 of 50 bits are the code version (0)
            let s = '';
            for (let i = 0; i < 10; i++) { s = this.ALPHA[Number(n & 31n)] + s; n >>= 5n; }
            return s.slice(0, 4) + '-' + s.slice(4, 8) + '-' + s.slice(8);
        },
        decode(text) {
            const s = String(text || '').toUpperCase().replace(/[\s-]/g, '').replace(/O/g, '0').replace(/[IL]/g, '1');
            if (!/^[0-9A-HJKMNP-TV-Z]{10}$/.test(s)) return null;
            let n = 0n;
            for (const ch of s) n = (n << 5n) | BigInt(this.ALPHA.indexOf(ch));
            if ((n >> 48n) !== 0n) return null;            // unknown code version
            const port = Number(n & 0xFFFFn); n >>= 16n;
            const ip = [24n, 16n, 8n, 0n].map(sh => Number((n >> sh) & 255n)).join('.');
            return port ? { address: ip, port } : null;
        }
    };

    /** Classifies what the joiner typed. */
    function parseJoinTarget(text) {
        const t = String(text || '').trim();
        const digits = t.replace(/[\s-]/g, '');
        if (/^\d{6}$/.test(digits)) return { kind: 'code', code: digits };
        const m = /^\[?([0-9a-zA-Z.\-:]+?)\]?(?::(\d{1,5}))?$/.exec(t);
        if (m && /^(\d{1,3}\.){3}\d{1,3}$/.test(m[1])) return { kind: 'address', address: m[1], port: m[2] ? Number(m[2]) : CFG.p2pPort };
        const ic = InternetCode.decode(t);
        if (ic) return { kind: 'address', address: ic.address, port: ic.port, viaInternetCode: true };
        if (m && /^[a-zA-Z0-9.\-]+$/.test(m[1]) && m[1].includes('.')) return { kind: 'address', address: m[1], port: m[2] ? Number(m[2]) : CFG.p2pPort };
        return null;
    }

    /** Local-network discovery of a host by its 6-digit code (UDP, port = host port + 1). */
    const Discovery = {
        port() { return CFG.p2pPort + 1; },
        targets(includeLoopback) {
            const list = new Set(['255.255.255.255']);
            try { P2P.lanInterfaces().forEach(n => list.add(n.broadcast)); } catch (e) { /* ignore */ }
            if (includeLoopback) list.add('127.0.0.1');     // two game windows on one PC
            return Array.from(list);
        },
        /** Host side: answer probes and announce periodically. Returns a stop() function. */
        announce(getInfo) {
            const dgram = P2P.nodeRequire('dgram');
            const sock = dgram.createSocket({ type: 'udp4', reuseAddr: true });
            const packet = () => P2P.buf().from(JSON.stringify(Object.assign({ wte: P2P.MAGIC, v: P2P.DISCOVERY_V, kind: 'announce' }, getInfo())));
            let timer = null, closed = false;
            sock.on('error', e => Diag.log('warn', 'discovery socket: ' + (e && e.message)));
            sock.on('message', (buf, rinfo) => {
                if (buf.length > 512) return;
                let m; try { m = JSON.parse(buf.toString()); } catch (e) { return; }
                if (!m || m.wte !== P2P.MAGIC || m.kind !== 'probe') return;
                const info = getInfo();
                if (m.code !== '*' && m.code !== info.code) return;
                try { sock.send(packet(), rinfo.port, rinfo.address); } catch (e) { /* ignore */ }
            });
            sock.bind(this.port(), () => {
                try { sock.setBroadcast(true); } catch (e) { /* ignore */ }
                const send = () => { if (closed) return; const p = packet(); this.targets(false).forEach(a => { try { sock.send(p, this.port(), a); } catch (e) { /* ignore */ } }); };
                send(); timer = setInterval(send, 2000);
            });
            return () => { closed = true; if (timer) clearInterval(timer); try { sock.close(); } catch (e) { /* ignore */ } };
        },
        /** Joiner side: find hosts. code '*' = list all. Resolves with [{address, port, info}] (first match for a real code). */
        find(code, timeoutMs) {
            return new Promise(resolve => {
                const dgram = P2P.nodeRequire('dgram');
                const sock = dgram.createSocket({ type: 'udp4', reuseAddr: true });
                const found = new Map();
                let done = false, probeTimer = null;
                const finish = () => {
                    if (done) return; done = true;
                    clearInterval(probeTimer); clearTimeout(stopTimer);
                    try { sock.close(); } catch (e) { /* ignore */ }
                    resolve(Array.from(found.values()));
                };
                sock.on('error', () => finish());
                sock.on('message', (buf, rinfo) => {
                    if (buf.length > 512) return;
                    let m; try { m = JSON.parse(buf.toString()); } catch (e) { return; }
                    if (!m || m.wte !== P2P.MAGIC || m.kind !== 'announce' || !/^\d{6}$/.test(String(m.code)) || !isInt(m.port, 1, 65535)) return;
                    if (code !== '*' && m.code !== code) return;
                    const key = rinfo.address + ':' + m.port;
                    found.set(key, { address: rinfo.address, port: m.port,
                        info: { code: m.code, world: cleanStr(m.world, 40), host: cleanStr(m.host, 24), players: m.players | 0, max: m.max | 0, gv: cleanStr(String(m.gv || ''), 20),
                                mods: Array.isArray(m.mods) ? m.mods.slice(0, 20).map(s => cleanStr(String(s), 70)) : null } });   // (null: an older co-op that doesn't say)
                    if (code !== '*') finish();
                });
                const probe = P2P.buf().from(JSON.stringify({ wte: P2P.MAGIC, v: P2P.DISCOVERY_V, kind: 'probe', code }));
                sock.bind(0, () => {
                    try { sock.setBroadcast(true); } catch (e) { /* ignore */ }
                    const send = () => this.targets(true).forEach(a => { try { sock.send(probe, this.port(), a); } catch (e) { /* ignore */ } });
                    send(); probeTimer = setInterval(send, 700);
                });
                const stopTimer = setTimeout(finish, timeoutMs || 5000);
            });
        }
    };

    /** Minimal UPnP-IGD client: discover the router, open a TCP port, read the public IPv4. No third-party service. */
    const Upnp = {
        ST: ['urn:schemas-upnp-org:service:WANIPConnection:1', 'urn:schemas-upnp-org:service:WANIPConnection:2',
             'urn:schemas-upnp-org:service:WANPPPConnection:1', 'urn:schemas-upnp-org:device:InternetGatewayDevice:1'],
        mapping: null, renewTimer: null,
        httpRequest(url, method, headers, body, timeoutMs) {
            return new Promise((resolve, reject) => {
                const u = new URL(url);
                const lib = P2P.nodeRequire(u.protocol === 'https:' ? 'https' : 'http');
                const req = lib.request({ hostname: u.hostname, port: u.port || 80, path: u.pathname + u.search, method, headers }, res => {
                    const localAddress = (res.socket && res.socket.localAddress) || '';      // read now: the socket is gone by 'end'
                    let data = ''; res.setEncoding('utf8');
                    res.on('data', c => { data += c; if (data.length > 262144) req.destroy(new Error('response too large')); });
                    res.on('end', () => resolve({ status: res.statusCode, body: data, localAddress }));
                });
                req.on('error', reject);
                req.setTimeout(timeoutMs || 3000, () => req.destroy(new Error('router did not answer')));
                if (body) req.write(body);
                req.end();
            });
        },
        /** SSDP M-SEARCH; resolves with the list of LOCATION urls answering within timeoutMs. */
        discoverLocations(timeoutMs) {
            return new Promise(resolve => {
                const dgram = P2P.nodeRequire('dgram');
                const sock = dgram.createSocket({ type: 'udp4', reuseAddr: true });
                const locs = new Set();
                sock.on('error', () => { try { sock.close(); } catch (e) { /* ignore */ } resolve(Array.from(locs)); });
                sock.on('message', buf => { const m = /^location:\s*(\S+)/im.exec(buf.toString()); if (m && /^https?:\/\//i.test(m[1])) locs.add(m[1]); });
                sock.bind(0, () => {
                    this.ST.forEach(st => {
                        const msg = P2P.buf().from('M-SEARCH * HTTP/1.1\r\nHOST: 239.255.255.250:1900\r\nMAN: "ssdp:discover"\r\nMX: 2\r\nST: ' + st + '\r\n\r\n');
                        try { sock.send(msg, 1900, '239.255.255.250'); } catch (e) { /* ignore */ }
                    });
                });
                setTimeout(() => { try { sock.close(); } catch (e) { /* ignore */ } resolve(Array.from(locs)); }, timeoutMs || 2500);
            });
        },
        /** From a device description, the WAN*Connection service control URL. */
        async findService(location) {
            const res = await this.httpRequest(location, 'GET', {}, null, 3000);
            if (res.status !== 200) throw new Error('router description HTTP ' + res.status);
            const xml = res.body, base = (/<URLBase>\s*([^<]+?)\s*<\/URLBase>/i.exec(xml) || [])[1] || location;
            const services = xml.split(/<service>/i).slice(1);
            for (const s of services) {
                const type = (/<serviceType>\s*([^<]+?)\s*<\/serviceType>/i.exec(s) || [])[1] || '';
                const ctrl = (/<controlURL>\s*([^<]+?)\s*<\/controlURL>/i.exec(s) || [])[1] || '';
                if (/WAN(IP|PPP)Connection:\d/.test(type) && ctrl) return { type, url: new URL(ctrl, base).toString(), localAddress: String(res.localAddress || '').replace(/^::ffff:/i, '') };
            }
            throw new Error('router has no WAN connection service');
        },
        async soap(svc, action, args) {
            const body = '<?xml version="1.0"?>\r\n<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><s:Body>' +
                '<u:' + action + ' xmlns:u="' + svc.type + '">' +
                Object.keys(args).map(k => '<' + k + '>' + String(args[k]).replace(/[<>&]/g, '') + '</' + k + '>').join('') +
                '</u:' + action + '></s:Body></s:Envelope>';
            const res = await this.httpRequest(svc.url, 'POST', { 'Content-Type': 'text/xml; charset="utf-8"', 'SOAPAction': '"' + svc.type + '#' + action + '"', 'Content-Length': P2P.buf().byteLength(body) }, body, 4000);
            if (res.status !== 200) {
                const code = (/<errorCode>\s*(\d+)\s*<\/errorCode>/i.exec(res.body) || [])[1];
                const err = new Error(action + ' refused by router' + (code ? ' (UPnP error ' + code + ')' : ' (HTTP ' + res.status + ')'));
                err.upnpCode = code ? Number(code) : 0; throw err;
            }
            return res.body;
        },
        /** Open port (TCP) on the router. Resolves {ok, externalIp?, warning?, error?}. Never throws. */
        async open(port, description) {
            try {
                const locs = await this.discoverLocations(2500);
                if (!locs.length) return { ok: false, error: 'No UPnP router answered (UPnP may be off on the router).' };
                let svc = null, lastErr = null;
                for (const l of locs) { try { svc = await this.findService(l); break; } catch (e) { lastErr = e; } }
                if (!svc) return { ok: false, error: 'Router found but no usable UPnP service (' + (lastErr && lastErr.message) + ').' };
                const args = lease => ({ NewRemoteHost: '', NewExternalPort: port, NewProtocol: 'TCP', NewInternalPort: port,
                    NewInternalClient: svc.localAddress, NewEnabled: 1, NewPortMappingDescription: description, NewLeaseDuration: lease });
                let lease = 3600;
                try { await this.soap(svc, 'AddPortMapping', args(lease)); }
                catch (e) {
                    // 725 = "only permanent leases"; some routers report the same problem as 501 "action failed"
                    if (e.upnpCode === 725 || e.upnpCode === 501 || e.upnpCode === 402) { lease = 0; await this.soap(svc, 'AddPortMapping', args(0)); }
                    else throw e;
                }
                this.mapping = { svc, port };
                if (lease) { clearInterval(this.renewTimer); this.renewTimer = setInterval(() => this.soap(svc, 'AddPortMapping', args(lease)).catch(() => {}), 1800000); }
                let externalIp = '';
                try { externalIp = (/<NewExternalIPAddress>\s*([^<]*?)\s*<\/NewExternalIPAddress>/i.exec(await this.soap(svc, 'GetExternalIPAddress', {})) || [])[1] || ''; } catch (e) { /* optional */ }
                const r = { ok: true, externalIp, localAddress: svc.localAddress };
                if (externalIp && Upnp.isPrivate(externalIp)) r.warning = 'Your router itself is behind another network (shared/CGNAT address). Internet players probably cannot reach you; use a virtual LAN (ZeroTier, Tailscale, Radmin VPN).';
                else if (!externalIp) r.warning = 'Port opened, but the router would not tell its public address, so no internet code can be made. Friends can join with your public IP address + port ' + port + ', or use a virtual LAN.';
                return r;
            } catch (e) {
                const detail = (e && e.message) || String(e);
                return { ok: false, detail,
                    error: 'The router did not allow automatic port opening (' + detail + '). The code works on your own network. ' +
                           'For internet play: turn on UPnP in the router settings, forward TCP port ' + port + ' to this PC by hand, or use a virtual LAN (Hamachi, Radmin VPN, ZeroTier, Tailscale).' };
            }
        },
        isPrivate(ip) {
            const p = String(ip).split('.').map(Number);
            return p[0] === 10 || p[0] === 127 || (p[0] === 172 && p[1] >= 16 && p[1] <= 31) || (p[0] === 192 && p[1] === 168) || (p[0] === 100 && p[1] >= 64 && p[1] <= 127) || (p[0] === 169 && p[1] === 254) || p[0] === 0;
        },
        async close() {
            clearInterval(this.renewTimer); this.renewTimer = null;
            const m = this.mapping; this.mapping = null;
            if (m) { try { await this.soap(m.svc, 'DeletePortMapping', { NewRemoteHost: '', NewExternalPort: m.port, NewProtocol: 'TCP' }); } catch (e) { /* lease expires anyway */ } }
        }
    };

    /** Host transport: the WebSocket server inside the host's game. */
    class P2PHostTransport {
        constructor() { this.sockets = new Map(); this.counter = 0; this.server = null; this.stopAnnounce = null; this.closed = false; }
        async host(max) {
            const WS = P2P.ws();
            this.max = max;
            this.selfId = 'h' + makeId();
            this.code = makeJoinCode();
            let port = CFG.p2pPort, lastErr = null;
            for (let i = 0; i < 5 && !this.server; i++, port++) {
                try { this.server = await this.listen(WS, port); this.port = port; }
                catch (e) { lastErr = e; if (!e || e.code !== 'EADDRINUSE') break; }
            }
            if (!this.server) throw new Error('Could not open port ' + CFG.p2pPort + ' for hosting (' + ((lastErr && lastErr.message) || 'unknown error') + ').');
            this.server.on('connection', (ws, req) => this.accept(ws, req));
            this.heartbeat = setInterval(() => this.sockets.forEach(c => {
                c.missed = c.alive ? 0 : (c.missed || 0) + 1;               // no answer to the last ping: count it (a loading player answers late)
                if (c.missed >= 6) { try { c.ws.terminate(); } catch (e) { /* ignore */ } return; }   // about 30 s without an answer: gone
                c.alive = false; try { c.ws.ping(); } catch (e) { /* ignore */ }
            }), 5000);
            try { this.stopAnnounce = Discovery.announce(() => this.announceInfo()); }
            catch (e) { Diag.log('warn', 'local-network code announce unavailable: ' + e.message); }
            const nets = (() => { try { return P2P.lanInterfaces(); } catch (e) { return []; } })();
            const lan = nets.filter(n => !P2P.vpnKind(n.name, n.address)).map(n => n.address + ':' + this.port);
            const vpn = nets.filter(n => P2P.vpnKind(n.name, n.address)).map(n => ({ kind: P2P.vpnKind(n.name, n.address), address: n.address + ':' + this.port }));
            let upnp = { ok: false, error: 'disabled in settings' }, internet = '', publicIp = '', publicSource = '';
            if (CFG.allowInternet) {
                upnp = await Upnp.open(this.port, 'Welcome to Elderfield co-op');
                if (upnp.ok && upnp.externalIp && !Upnp.isPrivate(upnp.externalIp)) { publicIp = upnp.externalIp; publicSource = 'router'; }
                Diag.log(upnp.ok ? 'info' : 'warn', 'UPnP: ' + (upnp.ok ? 'port ' + this.port + ' opened' + (upnp.warning ? ' (' + upnp.warning + ')' : '') : upnp.error));
            }
            if (!publicIp && isPublicIPv4(CFG.publicAddress)) { publicIp = CFG.publicAddress; publicSource = 'manual'; }
            if (!publicIp && CFG.detectPublicIp) {
                publicIp = await lookupPublicIp();
                if (publicIp) publicSource = 'lookup';
            }
            if (publicIp) internet = InternetCode.encode(publicIp, this.port);
            Diag.log('info', 'hosting on port ' + this.port + ', code ' + this.code + (internet ? ', internet code ' + internet + ' (public IP from ' + publicSource + ')' : ''));
            return { selfId: this.selfId, code: this.code, long: internet, port: this.port, lan, vpn, internet, upnp, publicIp, publicSource };
        }
        listen(WS, port) {
            return new Promise((resolve, reject) => {
                const srv = new WS.Server({ port, host: '0.0.0.0', maxPayload: 64 * 1024, clientTracking: false });
                srv.once('listening', () => { srv.removeListener('error', reject); srv.on('error', e => Diag.log('warn', 'host server: ' + e.message)); resolve(srv); });
                srv.once('error', reject);
            });
        }
        announceInfo() {
            const ses = Net;
            return { code: this.code, port: this.port, players: this.sockets.size + 1, max: this.max, gv: gameVersion(), mods: Mods.stamp(),
                     host: cleanStr(hostName(ses) || 'Host', 24), world: cleanStr((window.$gameSystem && $gameSystem._coopWorldName) || 'Elderfield', 40) };
        }
        accept(ws, req) {
            if (this.closed) { try { ws.close(1001, 'closing'); } catch (e) { /* ignore */ } return; }
            // one spare connection over the players: a player whose connection dropped reconnects (automatic reconnect) while
            // their old one may still be open here (up to ~30 s); the world's own check (WORLD_HELLO, JOIN) lets them back in
            // as themselves and drops the old one, and still turns away a new player when every place is taken
            if (this.sockets.size >= this.max) { try { ws.send(JSON.stringify({ op: 'bye', reason: 'That game is full.' })); ws.close(1013, 'full'); } catch (e) { /* ignore */ } return; }
            const id = 'p' + makeId();
            const c = { id, ws, alive: true, window: Date.now(), count: 0, ip: (req && req.socket && req.socket.remoteAddress) || '' };
            this.sockets.set(id, c);
            ws.on('pong', () => { c.alive = true; });
            ws.on('message', raw => {
                c.alive = true;
                const now = Date.now();
                if (now - c.window >= 1000) { c.window = now; c.count = 0; }
                if (++c.count > 120) { Diag.log('warn', 'rate limit: dropping ' + id); try { ws.close(1008, 'rate limit'); } catch (e) { /* ignore */ } return; }
                let f; try { f = JSON.parse(raw.toString()); } catch (e) { return; }
                if (f && f.op === 'msg' && typeof f.data === 'string' && this.onMessage) this.onMessage(id, f.data);   // sender = this socket
            });
            const gone = () => { if (this.sockets.get(id) === c) { this.sockets.delete(id); if (this.onPeerLeft) this.onPeerLeft(id); } };
            ws.on('close', gone);
            ws.on('error', gone);
            try { ws.send(JSON.stringify({ op: 'welcome', id, hostId: this.selfId })); } catch (e) { /* ignore */ }
        }
        send(to, str) {
            const c = this.sockets.get(to);
            if (c && c.ws.readyState === 1) c.ws.send(JSON.stringify({ op: 'msg', data: str }));
        }
        close() {
            if (this.closed) return; this.closed = true;
            clearInterval(this.heartbeat);
            if (this.stopAnnounce) this.stopAnnounce();
            this.sockets.forEach(c => { try { c.ws.send(JSON.stringify({ op: 'bye', reason: 'The host closed the connection.' })); c.ws.close(1001, 'host left'); } catch (e) { /* ignore */ } });
            this.sockets.clear();
            if (this.server) { try { this.server.close(); } catch (e) { /* ignore */ } }
            Upnp.close();
        }
    }

    /** Joiner transport: WebSocket client to a host found by code, internet code or address. */
    class P2PClientTransport {
        async join(text) {
            const target = parseJoinTarget(text);
            if (!target) throw new Error('Enter a 6-digit code, an internet code (XXXX-XXXX-XX) or an address like 192.168.1.20:' + CFG.p2pPort + '.');
            let address = target.address, port = target.port;
            if (target.kind === 'code') {
                const hits = await Discovery.find(target.code, 6000);
                if (!hits.length) throw new Error('No game with code ' + target.code + ' on your network. Check the code. Not on the same network? Use the internet code, or on Hamachi the host\'s Hamachi IP.');
                address = hits[0].address; port = hits[0].port;
            }
            if (!isInt(port, 1, 65535)) throw new Error('Invalid port.');
            return this.connect(address, port);
        }
        connect(address, port) {
            return new Promise((resolve, reject) => {
                const url = 'ws://' + address + ':' + port;
                const Impl = (typeof WebSocket !== 'undefined') ? WebSocket : P2P.ws();
                let settled = false;
                const fail = msg => { if (!settled) { settled = true; clearTimeout(timer); try { this.ws.close(); } catch (e) { /* ignore */ } reject(new Error(msg)); } };
                const why = '. Check: the host is hosting; the host allowed Elderfield through the Windows Firewall (Private and Public); on Hamachi, you are both in the same Hamachi network and online.';
                const timer = setTimeout(() => fail("Couldn't reach " + address + (port === CFG.p2pPort ? '' : ':' + port) + why), 10000);
                const ws = this.ws = new Impl(url);
                ws.onerror = () => fail("Couldn't connect to " + address + (port === CFG.p2pPort ? '' : ':' + port) + why);
                ws.onclose = () => {
                    if (!settled) return fail('The host closed the connection.');
                    if (this.onClosed) this.onClosed(this.byeReason || 'Lost connection to the host.');
                };
                ws.onmessage = e => {
                    let f; try { f = JSON.parse(typeof e.data === 'string' ? e.data : String(e.data)); } catch (er) { return; }
                    if (!f) return;
                    if (f.op === 'welcome' && !settled) {
                        if (typeof f.id !== 'string' || typeof f.hostId !== 'string') return fail('The host sent an invalid greeting.');
                        settled = true; clearTimeout(timer);
                        this.hostId = f.hostId;
                        resolve({ selfId: f.id, hostId: f.hostId, address, port });
                    } else if (f.op === 'msg' && typeof f.data === 'string') {
                        if (this.onMessage) this.onMessage(this.hostId, f.data);          // a client only ever hears the host
                    } else if (f.op === 'bye') {
                        this.byeReason = cleanStr(String(f.reason || ''), 120);
                        if (!settled) fail(this.byeReason || 'The host refused the connection.');
                    }
                };
            });
        }
        send(to, str) { if (this.ws && this.ws.readyState === 1) this.ws.send(JSON.stringify({ op: 'msg', data: str })); }
        close() { try { if (this.ws) this.ws.close(1000, 'leaving'); } catch (e) { /* ignore */ } }
    }

    /** One transport object per session: hosting uses the server, joining uses the client. */
    class P2PTransport {
        async host(max) { this.impl = new P2PHostTransport(); this.wire(); return this.impl.host(max); }
        async join(code) { this.impl = new P2PClientTransport(); this.wire(); return this.impl.join(code); }
        wire() {
            this.impl.onMessage = (from, raw) => { if (this.onMessage) this.onMessage(from, raw); };
            this.impl.onPeerLeft = id => { if (this.onPeerLeft) this.onPeerLeft(id); };
            this.impl.onClosed = reason => { if (this.onClosed) this.onClosed(reason); };
        }
        send(to, str) { if (this.impl) this.impl.send(to, str); }
        close() { if (this.impl) this.impl.close(); }
    }

    function makeId() {
        try { return P2P.nodeRequire('crypto').randomBytes(6).toString('hex'); }
        catch (e) { return Math.random().toString(16).slice(2, 14); }
    }
    const isPublicIPv4 = ip => /^(\d{1,3}\.){3}\d{1,3}$/.test(String(ip)) && String(ip).split('.').every(b => +b <= 255) && !Upnp.isPrivate(ip);
    /** Opt-in only (detectPublicIp): ask a public "what is my IP" service. Two services, 4 s each. */
    async function lookupPublicIp() {
        for (const url of ['https://api.ipify.org', 'https://icanhazip.com']) {
            try {
                const r = await Upnp.httpRequest(url, 'GET', { 'User-Agent': 'WTE-coop' }, null, 4000);
                const ip = String(r.body || '').trim();
                if (r.status === 200 && isPublicIPv4(ip)) { Diag.log('info', 'public IP looked up via ' + url); return ip; }
            } catch (e) { Diag.log('warn', 'public IP lookup failed (' + url + '): ' + e.message); }
        }
        return '';
    }
    function hostShareText(s) {
        if (CFG.transport === 'steam') return 'Hosting on Steam. Code ' + s.code + ': friends anywhere enter it in Join (they need the same Steam test copy)' + (s.codeLong && s.codeLong !== s.code ? '  |  Lobby ID ' + s.codeLong + ' (if the code is not found)' : '') + '.';
        const ni = s.netInfo || {};
        const at = a => String(a || '').replace(new RegExp(':' + CFG.p2pPort + '$'), '');   // the usual port goes without saying
        const parts = ['Code ' + s.code + ' (same network)'];
        if (ni.internet) parts.push('Internet code ' + ni.internet + (ni.publicSource === 'manual' ? ' (using your port forward)' : ''));
        if (ni.lan && ni.lan.length) parts.push('LAN IP ' + at(ni.lan[0]));
        (ni.vpn || []).forEach(v => parts.push(v.kind + ' IP ' + at(v.address)));
        if (!ni.internet && CFG.allowInternet) {
            parts.push('No internet code (' + (ni.upnp && !ni.upnp.ok ? 'your router did not open the port by itself' : (ni.upnp && ni.upnp.warning) || 'the public IP is unknown') + '). ' +   // the router's own words are in the log
                       ((ni.vpn || []).length ? 'Friends online: join your ' + ni.vpn[0].kind + ' network and enter your ' + ni.vpn[0].kind + ' IP.'
                                              : 'Friends online: everyone joins the same Hamachi network, then enters your Hamachi IP. (Or forward port ' + CFG.p2pPort + ' and set "Public IP" in the co-op settings.)'));
        } else if (ni.upnp && ni.upnp.warning && ni.publicSource === 'router') parts.push(ni.upnp.warning);
        return 'Hosting. ' + parts.join('  |  ');
    }

    const defaultFactory = () => CFG.transport === 'relay' ? new RelayTransport() : CFG.transport === 'steam' ? new SteamTransport() : new P2PTransport();


    // =====================================================================
    // 5a. THE PLAYERS' ROOMS, BUILT FROM THE PLAYER'S OWN GAME (design §4, decisions 20, 29)
    //     The rooms (Rooms, 5c) are built into Map002 [T_Home] and its layer picture by this game itself, the first time it
    //     starts, from the Map002 and picture of the player's own game version (user, 2026-11-03: a game update must not
    //     stop anyone installing co-op). Nothing here is shipped as a finished map, so a game update's own changes to the
    //     house are kept: the installer puts the game's own Map002 and picture back and the next start builds the rooms on
    //     them again. tools/build-coop-rooms.js runs this same code for the developer's test copy.
    //     - the map grows downward (existing tiles, events and coordinates unchanged; the new area starts far below)
    //     - the players' rooms (user, 2026-11-02: "as big as the living room in the main house ... decently large"): the
    //       living room's red wall over its wood floor, 18 x 9 inside, with a kitchenette, a chest, a bed, a tub and lamps;
    //       the hallway: a copy of the bedroom with the rooms' doors, two lamps and a light (it was dark, user)
    //     - doors (WTE's own !$BathroomDoor) that only appear while switch 2717 (co-op rooms) is ON
    //     - the built map carries coopRooms: VERSION; a map without it, 40 x 25, is the game's own and is kept as
    //       *.bak-before-rooms (the base of every later build)
    // =====================================================================
    const RoomsBuild = (() => {
        const VERSION = 2;                                 // 2 (2026-11-03): the rooms' events from a fixed id (PIN), see below
        // WTE remembers which starter objects it has placed by their event id ($gameSystem._initialPlacedPE, PKD Pocket
        // Events): the rooms' events start at a fixed id, not after the game's own, so a game update that adds events to
        // the house can't move them (moved, every world would get its rooms' furniture again, or lose some)
        const PIN = 600;
        const TILE = 16, SW = 2717;                        // "co-op rooms visible": an unnamed, unreferenced switch (tools/free-switch.js); 2994 before the 2026-10-28 game update
        // the hallway = a copy of the bedroom with its own back wall (x 21..29, y 2..10). The rooms = the living room's size and
        // look: its red wall (3 rows, from its plain stretches) over its wood floor (x 3..20, y 14..19). Each block: a black ring.
        const SRC = { x: 21, y: 2, w: 9, h: 9 };
        const LIV = { w: 18, h: 9, wallRows: 3, wallY: 11, floorX: 3, floorY: 14, wallCols: [14, 15, 16, 17, 18] };
        const RING = 1, BW = SRC.w + 2 * RING, BH = SRC.h + 2 * RING, RW = LIV.w + 2 * RING, RH = LIV.h + 2 * RING;
        const GAP_ROWS = 15;                               // empty rows between the house and the new area (camera never reaches it)
        const OLD_H = 25, OLD_W = 40;
        const BY = OLD_H + GAP_ROWS;                       // first row of the new area
        // two rooms side by side, then the hallway and the third room (the map stays 40 wide)
        const BLOCKS = { room1: { x: 0, y: BY, kind: 'room' }, room2: { x: RW, y: BY, kind: 'room' },
                         hall: { x: 0, y: BY + RH + 1, kind: 'hall' }, room3: { x: BW + 1, y: BY + RH + 1, kind: 'room' } };
        const NEW_H = BLOCKS.room3.y + RH + 1;

        // ---------- the layer picture (RPG Maker's encrypted .png_) ----------
        const decrypt = (buf, key) => { const b = Buffer.from(buf.subarray(16)); for (let i = 0; i < 16; i++) b[i] ^= key[i]; return b; };
        const encrypt = (png, key, header) => { const b = Buffer.from(png); for (let i = 0; i < 16; i++) b[i] ^= key[i]; return Buffer.concat([header, b]); };
        function pngDecode(buf, zlib) {
            let p = 8, w, h, depth, ct; const idat = [];
            while (p < buf.length) { const len = buf.readUInt32BE(p), type = buf.toString('ascii', p + 4, p + 8), data = buf.subarray(p + 8, p + 8 + len);
                if (type === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); depth = data[8]; ct = data[9]; if (data[12]) throw new Error('interlaced PNG not supported'); }
                else if (type === 'IDAT') idat.push(data); else if (type === 'IEND') break; p += 12 + len; }
            if (depth !== 8 || (ct !== 2 && ct !== 6)) throw new Error('unsupported PNG (depth ' + depth + ', type ' + ct + ')');
            const bpp = ct === 6 ? 4 : 3, stride = w * bpp, raw = zlib.inflateSync(Buffer.concat(idat)), out = Buffer.alloc(w * h * 4);
            let prev = Buffer.alloc(stride);
            for (let y = 0; y < h; y++) {
                const f = raw[y * (stride + 1)], line = Buffer.from(raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)));
                for (let i = 0; i < stride; i++) { const a = i >= bpp ? line[i - bpp] : 0, b = prev[i], c = i >= bpp ? prev[i - bpp] : 0;
                    line[i] = (line[i] + (f === 1 ? a : f === 2 ? b : f === 3 ? ((a + b) >> 1) : f === 4 ? paeth(a, b, c) : 0)) & 255; }
                for (let x = 0; x < w; x++) { const o = (y * w + x) * 4; out[o] = line[x * bpp]; out[o + 1] = line[x * bpp + 1]; out[o + 2] = line[x * bpp + 2]; out[o + 3] = bpp === 4 ? line[x * bpp + 3] : 255; }
                prev = line;
            }
            return { w, h, px: out, rgb: ct === 2 };
            function paeth(a, b, c) { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); return pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
        }
        function pngEncode(img, zlib) {
            const bpp = img.rgb ? 3 : 4, stride = img.w * bpp, raw = Buffer.alloc((stride + 1) * img.h);
            for (let y = 0; y < img.h; y++) { raw[y * (stride + 1)] = 0;
                for (let x = 0; x < img.w; x++) { const o = (y * img.w + x) * 4, d = y * (stride + 1) + 1 + x * bpp; raw[d] = img.px[o]; raw[d + 1] = img.px[o + 1]; raw[d + 2] = img.px[o + 2]; if (bpp === 4) raw[d + 3] = img.px[o + 3]; } }
            const crcT = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crcT[n] = c >>> 0; }
            const crc = b => { let c = 0xffffffff; for (const v of b) c = crcT[(c ^ v) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
            const chunk = (type, data) => { const l = Buffer.alloc(4); l.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type, 'ascii'), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
            const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(img.w, 0); ihdr.writeUInt32BE(img.h, 4); ihdr[8] = 8; ihdr[9] = img.rgb ? 2 : 6;
            return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
        }

        /** The game's own Map002 (parsed) and layer picture (encrypted bytes) -> the map and picture with the rooms. */
        function build(map, encRaw, key, zlib) {
            if (map.height !== OLD_H || map.width !== OLD_W) throw new Error('Map002 is not the expected 40x25 (got ' + map.width + 'x' + map.height + ')');
            const W = map.width, Z = 6;
            const at = (data, H, x, y, z) => data[(z * H + y) * W + x];
            const nd = new Array(W * NEW_H * Z).fill(0);
            for (let z = 0; z < Z; z++) for (let y = 0; y < OLD_H; y++) for (let x = 0; x < W; x++) nd[(z * NEW_H + y) * W + x] = at(map.data, OLD_H, x, y, z);
            // fill the new rows with the house's outer black wall (copied from a region-1 cell) so nothing out there is walkable
            const fillCell = [0, 1, 2, 3, 4, 5].map(z => at(map.data, OLD_H, 0, 21, z));
            for (let y = OLD_H; y < NEW_H; y++) for (let x = 0; x < W; x++) for (let z = 0; z < Z; z++) nd[(z * NEW_H + y) * W + x] = fillCell[z];
            // block cell: the black ring (same as the map's outer wall) or a copy of the source cell
            const srcCell = (sx, sy) => [0, 1, 2, 3, 4, 5].map(z => at(map.data, OLD_H, sx, sy, z));
            const sizeOf = kind => kind === 'room' ? [RW, RH] : [BW, BH];
            function blockCell(kind, bx, by) {
                const [w, h] = sizeOf(kind);
                if (bx < RING || by < RING || bx >= w - RING || by >= h - RING) return { cell: fillCell, from: null };
                const ix = bx - RING, iy = by - RING;
                let sx, sy;
                if (kind === 'room') {
                    if (iy < LIV.wallRows) { sx = LIV.wallCols[ix % LIV.wallCols.length]; sy = LIV.wallY + iy; }   // the living room's red wall
                    else { sx = LIV.floorX + ix; sy = LIV.floorY + iy - LIV.wallRows; }                            // its wood floor, tile for tile
                } else { sx = SRC.x + ix; sy = SRC.y + iy; }
                return { cell: srcCell(sx, sy), from: [sx, sy] };
            }
            const pixelCopies = [];
            for (const b of Object.values(BLOCKS)) for (let by = 0; by < sizeOf(b.kind)[1]; by++) for (let bx = 0; bx < sizeOf(b.kind)[0]; bx++) {
                const r = blockCell(b.kind, bx, by);
                for (let z = 0; z < Z; z++) nd[(z * NEW_H + b.y + by) * W + b.x + bx] = r.cell[z];
                if (r.from) pixelCopies.push({ from: r.from, to: [b.x + bx, b.y + by] });
            }
            map.data = nd; map.height = NEW_H;

            // ---------- events ----------
            const base = map.events[22];                                // the house bed placeholder: page shape to copy
            if (!base || !base.pages || !base.pages[0]) throw new Error('Map002 has no event 22 (the bed) to copy');
            const blankPage = () => JSON.parse(JSON.stringify(base.pages[0]));
            const mkPage = (opts) => Object.assign(blankPage(), { list: [...(opts.list || []), { code: 0, indent: 0, parameters: [] }] }, opts.page || {});
            const doorPages = script => [
                mkPage({ page: { priorityType: 0, trigger: 0 } }),                                   // single player: nothing here
                mkPage({ page: { conditions: Object.assign(blankPage().conditions, { switch1Id: SW, switch1Valid: true }),
                                 image: { characterIndex: 0, characterName: '!$BathroomDoor', direction: 2, pattern: 1, tileId: 0 },
                                 priorityType: 1, trigger: 0, directionFix: true },
                         list: [{ code: 250, indent: 0, parameters: [{ name: 'Door6', volume: 100, pitch: 60, pan: 0 }] },
                                { code: 355, indent: 0, parameters: [script] }] })
            ];
            const placeholder = template => [Object.assign(blankPage(), { list: [{ code: 108, indent: 0, parameters: ['initialPocketEvent:' + template] }, { code: 0, indent: 0, parameters: [] }] })];
            const own = map.events.length;
            if (own > PIN) throw new Error('the house map has ' + own + ' events, more than the rooms\' fixed start (' + PIN + ')');
            let nextId = PIN;
            const add = (name, x, y, pages, note) => { const e = { id: nextId, name, note: note || '', pages, x, y }; map.events[nextId] = e; nextId++; return e; };
            const DOOR_ROW = RING + 3;                                    // block row of the wall's bottom line (source y 5)
            const hall = BLOCKS.hall, conf = { switch: SW, map: 2, houseDoor: { x: 27, y: 5 }, houseStand: { x: 27, y: 6 }, hall: {}, rooms: [] };
            add('CO-OP: door to player rooms', 27, 5, doorPages('ElderfieldCoop.Rooms.go("hall")'));
            const hallDoorX = [2, 4, 6, 8];                               // block columns: rooms 1-3, then back to the bedroom
            const starters = [];                                          // [name, template event, x, y]: each room's own furniture
            const lamps = [];                                             // each room's lamps (decision 96; more of them, user 2026-11-02): added last
            const glows = [];                                             // a soft light over a whole room, as the house's own "Light Big" (its event 70)
            ['room1', 'room2', 'room3'].forEach((rk, i) => {
                const hx = hall.x + hallDoorX[i], hy = hall.y + DOOR_ROW, n = i + 1;
                add('CO-OP: hallway door ' + n, hx, hy, doorPages('ElderfieldCoop.Rooms.go("room' + n + '")'));
                // the room: its door in the middle of the wall's bottom row; along the back wall a kitchenette (fridge, counter,
                // cooking pot, sink: cook here while someone else uses the house kitchen) and the chest; the bed on the right
                // with the side-table lamp; standing lamps either side of the door and in the far corner; the tub bottom-left
                const r = BLOCKS[rk], I = (dx, dy) => [r.x + RING + dx, r.y + RING + dy], WALL = LIV.wallRows - 1, ROW = LIV.wallRows;   // ROW: the first floor row
                const [ex, ey] = I(9, WALL);
                add('CO-OP: room ' + n + ' door', ex, ey, doorPages('ElderfieldCoop.Rooms.go("hall", ' + n + ')'));
                add('CO-OP: room ' + n + ' bed', ...I(15, ROW + 1), placeholder(28));
                starters.push(['room ' + n + ' fridge', 26, ...I(0, ROW)], ['room ' + n + ' counter', 62, ...I(1, ROW)],
                              ['room ' + n + ' cooking pot', 25, ...I(2, ROW)], ['room ' + n + ' sink', 61, ...I(3, ROW)],   // WTE's own kitchen pieces (templates of the house kitchen)
                              ['room ' + n + ' storage', 24, ...I(5, ROW)],                                                   // WTE's "Storage" chest
                              ['room ' + n + ' tub', 19, ...I(1, ROW + 4)]);                                                  // WTE's "Tub1" (bath CE959)
                lamps.push(['room ' + n + ' side table', 31, ...I(17, ROW)],                     // WTE's "Cluttered End Table Lamp", by the bed as in the house
                           ['room ' + n + ' lamp by the door', 30, ...I(7, ROW)], ['room ' + n + ' lamp by the door 2', 30, ...I(11, ROW)],   // "Basic Standing Lamp" (light 100)
                           ['room ' + n + ' corner lamp', 30, ...I(17, LIV.h - 1)]);
                glows.push(['room ' + n, ...I(9, ROW + 2)]);
                conf.rooms.push({ slot: n, door: { x: ex, y: ey }, stand: { x: ex, y: ey + 1 }, spawn: { x: I(13, ROW + 2)[0], y: I(13, ROW + 2)[1] }, hallStand: { x: hx, y: hy + 1 } });
            });
            add('CO-OP: hallway door back', hall.x + hallDoorX[3], hall.y + DOOR_ROW, doorPages('ElderfieldCoop.Rooms.go("house")'));
            conf.hall = { back: { x: hall.x + hallDoorX[3], y: hall.y + DOOR_ROW + 1 } };
            lamps.push(['hallway lamp', 36, hall.x + 3, hall.y + DOOR_ROW + 1], ['hallway lamp 2', 36, hall.x + 7, hall.y + DOOR_ROW + 1]);
            glows.push(['hallway', hall.x + RING + 4, hall.y + RING + 6]);
            // WTE's starter-object placeholders (PKD "initialPocketEvent:<template event>"), added after the doors and beds so
            // every existing event keeps its id
            starters.concat(lamps).forEach(([name, template, x, y]) => add('CO-OP: ' + name, x, y, placeholder(template)));
            glows.forEach(([name, x, y]) => add('CO-OP: ' + name + ' light', x, y, [Object.assign(blankPage(), { priorityType: 0, through: true, list: [{ code: 0, indent: 0, parameters: [] }] })], map.events[70] ? map.events[70].note : 'light 100<cl: light 55 #ffffff B1>'));
            conf.starters = starters.concat(lamps).map(s => s.slice(0, 4));
            conf.events = nextId - 1;
            map.coopRooms = VERSION; map.coopRoomsBase = own;   // (where version 1 started them: the game's own event count)

            // ---------- the layer picture: the house stays pixel-identical, the new rows black, each block's cells copied ----------
            const img = pngDecode(decrypt(encRaw, key), zlib);
            if (img.w !== W * TILE || img.h !== OLD_H * TILE) throw new Error('the house layer picture is not 640x400');
            const out = { w: img.w, h: NEW_H * TILE, rgb: img.rgb, px: Buffer.alloc(img.w * NEW_H * TILE * 4) };
            img.px.copy(out.px, 0, 0, img.px.length);
            const blackRow = Buffer.alloc(4 * TILE); for (let i = 0; i < TILE; i++) blackRow.writeUInt32BE(0x000000ff, i * 4);
            for (let y = OLD_H * TILE; y < out.h; y++) for (let x = 0; x < out.w; x += TILE) blackRow.copy(out.px, (y * out.w + x) * 4);
            for (const c of pixelCopies) for (let py = 0; py < TILE; py++)
                img.px.copy(out.px, ((c.to[1] * TILE + py) * out.w + c.to[0] * TILE) * 4, ((c.from[1] * TILE + py) * img.w + c.from[0] * TILE) * 4, ((c.from[1] * TILE + py) * img.w + c.from[0] * TILE + TILE) * 4);
            return { map, img: encrypt(pngEncode(out, zlib), key, encRaw.subarray(0, 16)), conf };
        }

        /** Makes sure the game folder's Map002 has this version's rooms (force: build again anyway). Returns what it did. */
        function ensure(dir, force) {
            const fs = require('fs'), path = require('path'), zlib = require('zlib');
            const MAP = path.join(dir, 'data', 'Map002.json'), IMG = path.join(dir, 'img', 'layers', 'HousePlainBottom.png_');
            const bak = f => f + '.bak-before-rooms';
            const map = JSON.parse(fs.readFileSync(MAP, 'utf8'));
            if (map.coopRooms === VERSION && !force) return { built: false, ok: true, why: 'rooms already built' };
            // the game's own map (40 x 25, no rooms) becomes the base; a map with rooms of another version is built again from it
            if (!map.coopRooms && map.width === OLD_W && map.height === OLD_H) fs.writeFileSync(bak(MAP), fs.readFileSync(MAP));
            const encNow = fs.readFileSync(IMG), key = JSON.parse(fs.readFileSync(path.join(dir, 'data', 'System.json'), 'utf8')).encryptionKey.match(/.{2}/g).map(h => parseInt(h, 16));
            if (pngDecode(decrypt(encNow, key), zlib).h === OLD_H * TILE) fs.writeFileSync(bak(IMG), encNow);
            if (!fs.existsSync(bak(MAP)) || !fs.existsSync(bak(IMG))) return { built: false, ok: map.height === NEW_H, why: 'no copy of the game\'s own house to build from (run Install Co-op.bat again)' };
            const r = build(JSON.parse(fs.readFileSync(bak(MAP), 'utf8')), fs.readFileSync(bak(IMG)), key, zlib);
            // whole files only (a second window of the same copy may be starting too): written beside, then renamed over;
            // the picture first, so a map with coopRooms always has its picture
            // a file held for a moment (OneDrive syncing the desktop, a virus scan) is tried again for up to a second, then
            // written in place
            const pause = ms => { try { Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms); } catch (e) { const t = Date.now() + ms; while (Date.now() < t) { /* wait */ } } };
            const put = (file, data) => {
                const t = file + '.' + process.pid + '.tmp'; fs.writeFileSync(t, data);
                for (let i = 0; ; i++) {
                    try { fs.renameSync(t, file); return; } catch (e) {
                        if (i >= 9) { fs.writeFileSync(file, data); try { fs.unlinkSync(t); } catch (e2) { /* left behind: harmless */ } return; }
                        pause(100);
                    }
                }
            };
            put(IMG, r.img);
            put(MAP, JSON.stringify(r.map));
            return { built: true, ok: true, why: 'rooms built (' + r.map.width + 'x' + r.map.height + ', ' + r.conf.events + ' events)', conf: r.conf };
        }

        // in the game: before any map loads (plugins load before the title), from the folder index.html is in
        const state = { ok: true, why: 'not checked' };
        if (typeof window !== 'undefined' && typeof require === 'function' && typeof process !== 'undefined') {
            try {
                const path = require('path'), fs = require('fs'), dirs = [];
                try { if (process.mainModule && process.mainModule.filename) dirs.push(path.dirname(process.mainModule.filename)); } catch (e) { /* ignore */ }
                try { if (typeof nw !== 'undefined' && nw.App && nw.App.startPath) dirs.push(nw.App.startPath); } catch (e) { /* ignore */ }
                dirs.push(process.cwd());
                const dir = dirs.find(d => fs.existsSync(path.join(d, 'data', 'Map002.json')));
                if (dir) { const t = Date.now(), r = ensure(dir); state.ok = r.ok; state.why = r.why; Diag.log(r.ok ? 'info' : 'warn', 'players\' rooms: ' + r.why + (r.built ? ' in ' + (Date.now() - t) + ' ms' : '')); }
                else Diag.log('warn', 'players\' rooms: no data\\Map002.json found in ' + dirs.join(', '));
            } catch (e) { state.ok = false; state.why = 'could not be built: ' + (e && e.message || e); Diag.log('warn', 'players\' rooms ' + state.why + ' (co-op plays on; joiners start in the house)'); }
        }
        /** A world whose rooms were placed under version 1 (events right after the game's own): WTE's record of the
         *  starter objects it placed there moves to the fixed ids once, so nothing is placed twice. Map002 loading. */
        function migrate(dataMap) {
            const P = window.$gameSystem && $gameSystem._initialPlacedPE, list = P && P[2], base = dataMap && dataMap.coopRoomsBase;
            if ($gameSystem._coopRoomsPinned || !base) return 0;
            $gameSystem._coopRoomsPinned = VERSION;
            if (!Array.isArray(list)) return 0;
            const n = (dataMap.events || []).filter((e, i) => e && i >= PIN).length; let moved = 0;
            for (let i = 0; i < list.length; i++) if (list[i] >= base && list[i] < base + n) { list[i] = list[i] - base + PIN; moved++; }
            return moved;
        }
        /** The player slot (1-3) whose room holds this tile of the house map, or 0 (the house, the hallway). */
        function slotAt(x, y) {
            for (const n of [1, 2, 3]) { const b = BLOCKS['room' + n]; if (x >= b.x && x < b.x + RW && y >= b.y && y < b.y + RH) return n; }
            return 0;
        }
        return { VERSION, PIN, build, ensure, migrate, slotAt, get ok() { return state.ok; }, get why() { return state.why; } };
    })();
    // the house map loading: a world from before the fixed ids has WTE's record of its placed starter objects moved (once)
    if (typeof Game_Map !== 'undefined') {
        const _setupRooms = Game_Map.prototype.setup;
        Game_Map.prototype.setup = function (mapId) {
            if (mapId === 2) try { const n = RoomsBuild.migrate(window.$dataMap); if (n) Diag.log('info', 'players\' rooms: ' + n + ' placed starter objects moved to the rooms\' fixed ids'); } catch (e) { Diag.err('players\' rooms: moving the placed starter objects', e); }
            return _setupRooms.call(this, mapId);
        };
    }
    // =====================================================================
    // 5c. CO-OP WORLDS, PLAYER IDENTITY, WORLD TRANSFER (design §9, decisions 24, 34–36)
    //     Host PC:   save/coopworld<N>.rmmzsave (+ _bak) = the host's world + roster + every joiner's player data
    //                save/coopworlds.rmmzsave = index for the Host tab. Never named file<N> (I-6).
    //     Every PC:  save/coop_identity.rmmzsave = {worlds: {worldId: {token, playerId, slot, name, address}}}
    //                The host stores only sha256(token): a joiner is bound to its player automatically.
    // =====================================================================
    /** Save storage: the game's StorageManager in NW.js, an in-memory map in the Node test harness. */
    const CoopStore = {
        mem: new Map(),
        real() { return typeof StorageManager !== 'undefined' && typeof StorageManager.saveObject === 'function'; },
        exists(name) { return this.real() ? StorageManager.exists(name) : this.mem.has(name); },
        async load(name) { return this.real() ? StorageManager.loadObject(name) : JSON.parse(JSON.stringify(this.mem.get(name) || null)); },
        async save(name, obj) { if (this.real()) return StorageManager.saveObject(name, obj); this.mem.set(name, JSON.parse(JSON.stringify(obj))); },
        async remove(name) { if (this.real()) { if (StorageManager.exists(name)) StorageManager.remove(name); } else this.mem.delete(name); }
    };
    const sha256 = text => P2P.nodeRequire('crypto').createHash('sha256').update(String(text)).digest('hex');
    const newToken = () => P2P.nodeRequire('crypto').randomBytes(16).toString('hex');

    const Identity = {
        FILE: 'coop_identity', data: null,
        /** This PC's copy (decision 102), outside every game folder, so all copies of the game on the PC know its characters. */
        machineFile() {
            if (!CoopStore.real()) return null;                              // tests: memory only
            try { const path = P2P.nodeRequire('path'), os = P2P.nodeRequire('os'); return path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), 'ElderfieldCoop', 'coop_identity.json'); } catch (e) { return null; }
        },
        readMachine() {
            const file = this.machineFile(); if (!file) return null;
            try { const fsm = P2P.nodeRequire('fs'); if (!fsm.existsSync(file)) return null; const o = JSON.parse(fsm.readFileSync(file, 'utf8')); return o && o.worlds && typeof o.worlds === 'object' ? o : null; }
            catch (e) { Diag.err('identity copy on this PC unreadable', e); return null; }
        },
        writeMachine() {
            const file = this.machineFile(); if (!file) return;
            try { const fsm = P2P.nodeRequire('fs'), path = P2P.nodeRequire('path'); fsm.mkdirSync(path.dirname(file), { recursive: true }); fsm.writeFileSync(file, JSON.stringify(this.data)); }
            catch (e) { Diag.err('identity copy on this PC not saved', e); }
        },
        async load() {
            if (this.data) return this.data;
            try { if (CoopStore.exists(this.FILE)) this.data = await CoopStore.load(this.FILE); } catch (e) { Diag.err('identity file unreadable (a new one is made)', e); }
            if (!this.data || typeof this.data.worlds !== 'object' || !this.data.worlds) this.data = { v: 1, worlds: {} };
            const pc = this.readMachine(); let added = 0;                      // keys this PC has from its other game copies
            if (pc) Object.keys(pc.worlds).forEach(id => { const a = this.data.worlds[id], b = pc.worlds[id]; if (b && typeof b.token === 'string' && (!a || !a.token || (b.lastJoined || 0) > (a.lastJoined || 0))) { this.data.worlds[id] = b; added++; } });
            if (added) Diag.log('info', 'identity: ' + added + ' character key(s) from this PC\'s other game copies');
            return this.data;
        },
        async lookup(worldId) { await this.load(); return Object.prototype.hasOwnProperty.call(this.data.worlds, worldId) ? this.data.worlds[worldId] : null; },
        async remember(worldId, rec) {
            await this.load();
            this.data.worlds[worldId] = Object.assign({}, this.data.worlds[worldId] || {}, rec, { lastJoined: Date.now() });
            await CoopStore.save(this.FILE, this.data);
            const pc = this.readMachine();                                  // this PC's copy: its other worlds kept, this one updated
            if (pc) Object.keys(pc.worlds).forEach(id => { if (!this.data.worlds[id]) this.data.worlds[id] = pc.worlds[id]; });
            this.writeMachine();
        },
        /** Recently joined worlds for the Join tab. */
        async recent() { await this.load(); return Object.keys(this.data.worlds).map(id => Object.assign({ worldId: id }, this.data.worlds[id])).sort((a, b) => (b.lastJoined || 0) - (a.lastJoined || 0)); }
    };

    /** This PC's last co-op character (name + look), so a new character in another world can start from it. */
    const Profile = {
        FILE: 'coop_profile', data: null,
        async load() {
            if (this.data) return this.data;
            try { if (CoopStore.exists(this.FILE)) this.data = await CoopStore.load(this.FILE); } catch (e) { Diag.err('co-op profile unreadable', e); }
            if (!this.data || this.data.v !== 1 || !PlayerData.cleanLook(this.data.look)) this.data = null;
            return this.data;
        },
        async save(name, look) {
            const lk = PlayerData.cleanLook(look), nm = cleanStr(name, 16);
            if (!lk || !nm) return;
            this.data = { v: 1, name: nm, look: lk, at: Date.now() };
            try { await CoopStore.save(this.FILE, this.data); } catch (e) { Diag.err('co-op profile save', e); }
        }
    };

    /** What belongs to a player (not the world). System 3 widens this with the scope table. */
    const PlayerData = {
        LOOK_VARS: [890, 893, 896, 897, 898, 899],             // body/face, hair style, hair colour, skin, shirt, pants (CE2045)
        CUSTOMISER_CE: 2045,                                   // WTE's character customiser
        BUILD_CE: 2037,                                        // WTE's "Build Character": redraws the player from the look variables
        look() { const o = {}; this.LOOK_VARS.forEach(id => { o[id] = window.$gameVariables ? $gameVariables.value(id) : 0; }); return o; },
        /** A look object with exactly the look variables as small integers, or null. A look of all zeros was never made. */
        cleanLook(o) {
            if (!o || typeof o !== 'object') return null;
            const out = {}; let any = false;
            for (const id of this.LOOK_VARS) { const v = o[id]; if (!isInt(v, 0, 999)) return null; out[id] = v; if (v) any = true; }
            return any ? out : null;
        },
        applyLook(look) { const lk = this.cleanLook(look); if (lk && window.$gameVariables) this.LOOK_VARS.forEach(id => $gameVariables.setValue(id, lk[id])); return !!lk; },
        /** The character's name. WTE itself never names the player (actor 1 is " "), so co-op keeps it on actor 1. */
        actorName() { try { const a = window.$gameActors && $gameActors.actor(1); return a ? String(a.name() || '').trim() : ''; } catch (e) { return ''; } },
        setName(name) { const nm = cleanStr(name, 16); try { const a = window.$gameActors && $gameActors.actor(1); if (a && nm) a.setName(nm); } catch (e) { /* no game yet */ } return nm; },
        /** The character's own switches and variables (scope table): relationships, gifts, skills, buffs, intros, dreams. */
        ownValues() {
            const s = [], v = {};
            CFG.playerSwitches.forEach(i => { if ($gameSwitches._data[i]) s.push(i); });
            CFG.playerVars.forEach(i => { const x = $gameVariables.value(i); if (x !== 0 && Shared.validValue(x)) v[i] = x; });
            const ss = [], sv = {};                                            // my own story's events: what I did with them
            Object.keys($gameSelfSwitches._data || {}).forEach(k => { const [m, e] = k.split(',').map(Number); if ($gameSelfSwitches._data[k] && (Spawns.personalAny(m, e) || FirstTime.personalKey(k))) ss.push(k); });
            Object.keys($gameVariables._selfData || {}).forEach(k => { const [m, e] = k.split(',').map(Number); const x = $gameVariables._selfData[k]; if (typeof x === 'number' && x !== 0 && (Spawns.personalAny(m, e) || FirstTime.ownSvKey(k))) sv[k] = x; });
            return { s, v, ss, sv, pc: FirstTime.own() };
        },
        /** Put this character's own values in place of whatever the world copy held (the host's). */
        setOwn(o) {
            CFG.playerSwitches.forEach(i => { $gameSwitches._data[i] = false; });
            CFG.playerVars.forEach(i => { $gameVariables._data[i] = 0; });
            (o && Array.isArray(o.s) ? o.s : []).forEach(i => { if (CFG.playerSwitches.has(i)) $gameSwitches._data[i] = true; });
            const v = (o && o.v) || {};
            Object.keys(v).forEach(k => { const i = Number(k); if (CFG.playerVars.has(i) && Shared.validValue(v[k])) $gameVariables._data[i] = v[k]; });
            Object.keys($gameSelfSwitches._data || {}).forEach(k => { if (FirstTime.personalKey(k)) delete $gameSelfSwitches._data[k]; });   // first-time rewards: mine, never the host's
            Object.keys($gameVariables._selfData || {}).forEach(k => { if (FirstTime.ownSvKey(k)) delete $gameVariables._selfData[k]; });
            Object.keys((o && o.sv) || {}).forEach(k => { if (FirstTime.ownSvKey(k) && isNum(o.sv[k], -1e9, 1e9)) $gameVariables._selfData[k] = o.sv[k]; });
            if (o && Array.isArray(o.ss)) {                                   // my own story's events: never what the host did with them
                const key = /^\d{1,4},\d{1,5},[A-D]$/, vkey = /^\d{1,4},\d{1,5},\d{1,4}$/;
                Object.keys($gameSelfSwitches._data || {}).forEach(k => { const [m, e] = k.split(',').map(Number); if (Spawns.personalAny(m, e)) delete $gameSelfSwitches._data[k]; });
                Object.keys($gameVariables._selfData || {}).forEach(k => { const [m, e] = k.split(',').map(Number); if (Spawns.personalAny(m, e)) delete $gameVariables._selfData[k]; });
                o.ss.forEach(k => { if (typeof k === 'string' && key.test(k)) { const [m, e] = k.split(',').map(Number); if (Spawns.personalAny(m, e) || FirstTime.personalKey(k)) $gameSelfSwitches._data[k] = true; } });
                Object.keys(o.sv || {}).forEach(k => { const x = o.sv[k]; if (vkey.test(k) && isNum(x, -1e9, 1e9)) { const [m, e] = k.split(',').map(Number); if (Spawns.personalAny(m, e)) $gameVariables._selfData[k] = x; } });
            }
            FirstTime.setOwn(o && o.pc);                                       // my buried treasure (decision 69)
            if (window.$gameMap && $gameMap.requestRefresh) $gameMap.requestRefresh();
        },
        NEW_PLAYER: { s: [], v: { 339: 1, 246: 10 }, ss: [], sv: {} },        // a new character: level 1 as WTE starts it, nobody met yet, no skills or curses
        mailbox() { return window.$cgmz && $cgmz._mailboxData ? $cgmz._mailboxData : null; },
        FISH_KEY: 'PKD_FishingStats',
        /** My fishing record (PKD_SimpleFishing keeps it on the player object, which comes from the host's world). */
        fishing() { return window.$gamePlayer && $gamePlayer[this.FISH_KEY] && typeof $gamePlayer[this.FISH_KEY] === 'object' ? $gamePlayer[this.FISH_KEY] : null; },
        setFishing(s) {
            if (!window.$gamePlayer) return;
            if (s && typeof s === 'object' && !Array.isArray(s)) $gamePlayer[this.FISH_KEY] = s; else delete $gamePlayer[this.FISH_KEY];
            try { const F = window.PKD_SimpleFishing && PKD_SimpleFishing.FishingStatistics; if (F) F._stats = null; } catch (e) { /* re-read when next shown */ }
        },
        /** The character's parts WTE keeps on world-level objects: which tool tiers they ever owned (DM_ProtectedItems gives
         *  back lost tools from it), the gift tracker, equipment loadouts and upgrade stats, inventory sorting, bag size. */
        SYS_KEYS: ['_protectedItemHighestTiers', '_wteGiftTracker', '_equipLoadouts', '_customStats', '_inventorySortData',
                   '_battleCount', '_winCount', '_escapeCount', '_defeatedEnemies',                        // + my battles (decision 85)
                   '_wteProfessions', '_wteActivePerkNames', '_wteSeenProfessionPerks',                // + my professions and perks (decision 90)
                   '_wteShopPurchaseTracker', '_wteIgnoreSeasonRate', '_wteIgnoreTimeRate', '_wteQuestMapConfig',     // + my shop counts, fishing rates, quest map (decision 90)
                   '_wteSellModifiers', '_wteStatModifiers', '_wteScalingStatMods', '_wteMaterialSubstitutes',         // + my perks' effects (WTE_GameModifiers, decision 90)
                   '_wteItemPreserve', '_wteCategoryPreserve', '_wteQualityVariantCrafts', '_wteDoubleYieldCrafts',
                   '_wteSelectItemStorageModes',                                                       // + my item-select "storage too" choice per processor (WTE 26409135)
                   '_hb'],                                                                             // + the Hollowbrook mod's story and friendships (each player's own)
        PARTY_KEYS: ['_newItemsList', '_lastGainedItemData', '_shopTrackingData', '_wteLifetimeGold', '_steps'],
        gear() {
            const sys = {}, party = {};
            this.SYS_KEYS.forEach(k => { if (window.$gameSystem && $gameSystem[k] !== undefined) sys[k] = $gameSystem[k]; });
            this.PARTY_KEYS.forEach(k => { if (window.$gameParty && $gameParty[k] !== undefined) party[k] = $gameParty[k]; });
            const bag = window.$gameContainers && Number.isFinite($gameContainers._inventoryMaxWeight) ? $gameContainers._inventoryMaxWeight : null;
            const timed = window.Game_Time && Array.isArray(Game_Time._actorStates) ? Game_Time._actorStates : [];   // my timed buffs (decision 85)
            return { sys, party, bag, timed };
        },
        /** Mine (g) or, for a new character (null), what a new game starts with. */
        setGear(g) {
            let fs = null, fp = null;
            const fresh = () => { if (!fs) { try { fs = new Game_System(); } catch (e) { fs = {}; } try { fp = new Game_Party(); } catch (e) { fp = {}; } } };
            this.SYS_KEYS.forEach(k => { if (g && g.sys && k in g.sys) $gameSystem[k] = g.sys[k]; else if (!g) { fresh(); if (fs[k] !== undefined) $gameSystem[k] = fs[k]; else delete $gameSystem[k]; } });
            this.PARTY_KEYS.forEach(k => { if (g && g.party && k in g.party) $gameParty[k] = g.party[k]; else if (!g) { fresh(); if (fp[k] !== undefined) $gameParty[k] = fp[k]; else delete $gameParty[k]; } });
            if (window.Game_Time) Game_Time._actorStates = g && Array.isArray(g.timed) ? g.timed.filter(s => s && isInt(s.actorId, 1, 999) && isInt(s.stateId, 1, 9999) && s.gameTime) : [];   // never the host's
            if (window.$gameContainers) {
                if (g && isInt(g.bag, 0, 9999)) $gameContainers._inventoryMaxWeight = g.bag;
                else if (!g && $gameContainers.setInitialMaxWeight) $gameContainers._inventoryMaxWeight = $gameContainers.setInitialMaxWeight();
            }
        },
        quests() { return window.$cgmz && $cgmz._questData ? { data: $cgmz._questData, pin: $cgmz._questPinOrder | 0 } : null; },
        setQuests(q) {
            if (!window.$cgmz || !$cgmz.initializeQuestData) return;
            if (q && q.data && typeof q.data === 'object') { $cgmz._questData = q.data; $cgmz._questPinOrder = q.pin | 0; $cgmz.initializeQuestData(false); }   // + quests this build added
            else $cgmz.initializeQuestData(true);                               // a new player: every quest still ahead of them
            try { if (window.$cgmzTemp && $cgmzTemp.populateQuestAutoTracking) $cgmzTemp.populateQuestAutoTracking(); } catch (e) { /* tracking is optional */ }
        },
        capture(name) {
            const p = window.$gamePlayer;
            return JsonEx.stringify({
                v: 1, name: this.actorName() || name, actors: $gameActors,
                party: { items: $gameParty._items, weapons: $gameParty._weapons, armors: $gameParty._armors },
                look: this.look(), own: this.ownValues(), mail: this.mailbox(), fish: this.fishing(), quests: this.quests(), shops: Progress.ownRows(), gear: this.gear(),
                pos: p ? { map: $gameMap.mapId(), x: p.x, y: p.y, dir: p.direction() } : null,
                day: window.$gameVariables ? $gameVariables.value(250) : 0, at: Date.now()
            });
        },
        apply(str) {
            const d = JsonEx.parse(str);
            if (!d || d.v !== 1) throw new Error('player data has an unknown format');
            if (d.actors) $gameActors = d.actors;
            if (d.party) { $gameParty._items = d.party.items || {}; $gameParty._weapons = d.party.weapons || {}; $gameParty._armors = d.party.armors || {}; }
            if (d.look) this.LOOK_VARS.forEach(id => { if (isInt(d.look[id], -1e6, 1e6)) $gameVariables.setValue(id, d.look[id]); });
            if (d.own) this.setOwn(d.own);                                   // (older player data has none: it keeps the world's values, as before)
            if (d.mail && typeof d.mail === 'object' && window.$cgmz) $cgmz._mailboxData = d.mail;   // my own mailbox: what I read and collected
            if (d.quests) this.setQuests(d.quests);                            // my own quest log
            if (d.gear) this.setGear(d.gear);                                  // my tools record, loadouts, bag size...
            this.setFishing(d.fish || null);                                   // my fishing record; none saved yet = none (never the host's, decision 95)
            Progress.setOwnRows(d.shops && typeof d.shops === 'object' ? d.shops : null);   // my own stock of tools, keys, tomes
            return d;
        },
        /** A brand-new player in an existing world: fresh actor, empty pockets, their own name. */
        fresh(name) {
            $gameActors = new Game_Actors();
            $gameParty._items = {}; $gameParty._weapons = {}; $gameParty._armors = {};
            this.setName(name);
            const tut = !!(window.$gameSystem && $gameSystem._coopTutorial && $gameSwitches.value(CFG.tutorialSwitch));   // the host is still in the tutorial
            this.setOwn(this.NEW_PLAYER);
            if (tut) $gameSwitches._data[CFG.tutorialSwitch] = true;            // then so is the new player (decision 50)
            const mb = this.mailbox();                                         // letters already in the world's box: read, their gifts not mine
            if (mb) Object.values(mb).forEach(l => { if (l && l._isReceived) { l._isItemsCollected = true; l._isRead = true; } });
            this.setQuests(null);                                              // their own quests from the start
            this.setGear(null);                                                // a new game's tool record, loadouts and bag
            this.setFishing(null);                                             // and no fishing record yet (decision 95)
            Progress.setOwnRows(null);                                         // every tool, key and tome in the shops for them too
        }
    };

    /** Big payloads (world snapshot, player data) travel as deflated base64 in 12 000-character chunks with a SHA-256. */
    const Xfer = {
        CHUNK: 12000, MAX: 8 * 1024 * 1024,
        pack(obj) {
            const b64 = P2P.nodeRequire('zlib').deflateSync(P2P.buf().from(JSON.stringify(obj), 'utf8')).toString('base64');
            const n = Math.ceil(b64.length / this.CHUNK);
            return { id: makeId(), n, sha: sha256(b64), b64 };
        },
        send(ses, to, type, packed) {
            for (let i = 0; i < packed.n; i++) ses.send(to, { t: type, id: packed.id, i, n: packed.n, d: packed.b64.slice(i * this.CHUNK, (i + 1) * this.CHUNK) });
        },
        /** Collect a chunk into rx (a {id, n, sha, parts, size}); returns the decoded object when complete, else null. Throws on corruption. */
        collect(rx, m) {
            if (!rx || m.id !== rx.id || !isInt(m.i, 0, rx.n - 1) || m.n !== rx.n || typeof m.d !== 'string') return null;
            if (rx.parts[m.i] === undefined) { rx.parts[m.i] = m.d; rx.got = (rx.got || 0) + 1; rx.size = (rx.size || 0) + m.d.length; }
            if (rx.size > this.MAX) throw new Error('transfer too large');
            if (rx.got < rx.n) return null;
            const b64 = rx.parts.join('');
            if (sha256(b64) !== rx.sha) throw new Error('transfer damaged (checksum mismatch)');
            return JSON.parse(P2P.nodeRequire('zlib').inflateSync(P2P.buf().from(b64, 'base64')).toString('utf8'));
        }
    };

    /** The host's co-op world saves. Single-player files are never read or written here (I-5, I-6). */
    const CoopWorlds = {
        SLOTS: 4, INDEX: 'coopworlds',
        file(slot) { return 'coopworld' + slot; },
        backup(slot) { return 'coopworld' + slot + '_bak'; },
        rosterFile(slot) { return 'coopworld' + slot + '_roster'; },
        /** The world's characters (name, look, binding), written the moment one is made, changed or leaves, so nobody
         *  has to remake their character because the host quit before saving. Inventory and progress stay with the
         *  world save, like Stardew's farmhand data (spec sleep-day-save §5, R8). */
        rosterOnly(world) {
            return { v: 1, worldId: world.worldId, at: Date.now(),
                     roster: world.roster.map(r => ({ playerId: r.playerId, slot: r.slot, name: r.name, tokenHash: r.tokenHash, created: r.created, lastSeen: r.lastSeen, look: r.look || null })) };
        },
        saveRoster(world) {
            if (!world || !this.validSlot(world.slot)) return;
            clearTimeout(this._rosterTimer);
            this._rosterTimer = setTimeout(async () => {
                try {
                    await CoopStore.save(this.rosterFile(world.slot), this.rosterOnly(world));
                    const idx = await this.index();
                    if (idx.slots[world.slot]) { idx.slots[world.slot].players = world.roster.length + 1; await CoopStore.save(this.INDEX, idx); }
                } catch (e) { Diag.err('co-op roster save', e); }
            }, 300);
        },
        /** Characters saved in the roster file after the last world save are added back (without inventory). */
        async mergeRoster(world) {
            try {
                if (!CoopStore.exists(this.rosterFile(world.slot))) return;
                const r = await CoopStore.load(this.rosterFile(world.slot));
                if (!r || r.worldId !== world.worldId || !Array.isArray(r.roster)) return;
                for (const e of r.roster) {
                    if (!e || typeof e.playerId !== 'string' || typeof e.tokenHash !== 'string' || !isInt(e.slot, 1, 3)) continue;
                    const cur = world.roster.find(x => x.playerId === e.playerId);
                    if (cur) {
                        if ((e.lastSeen || 0) >= (cur.lastSeen || 0)) { cur.name = cleanStr(e.name, 16) || cur.name; if (PlayerData.cleanLook(e.look)) cur.look = PlayerData.cleanLook(e.look); cur.lastSeen = e.lastSeen; }
                    } else if (!world.roster.some(x => x.slot === e.slot)) {
                        world.roster.push({ playerId: e.playerId, slot: e.slot, name: cleanStr(e.name, 16) || ('Player ' + e.slot), tokenHash: e.tokenHash,
                                            created: e.created || Date.now(), lastSeen: e.lastSeen || 0, look: PlayerData.cleanLook(e.look), data: null });
                    }
                }
                world.roster.sort((a, b) => a.slot - b.slot);
            } catch (e) { Diag.err('co-op roster file unreadable (world save used)', e); }
        },
        validSlot(n) { return isInt(n, 1, this.SLOTS); },
        async index() {
            try { if (CoopStore.exists(this.INDEX)) { const o = await CoopStore.load(this.INDEX); if (o && o.slots) return o; } } catch (e) { Diag.err('co-op world index unreadable', e); }
            return { v: 1, slots: {} };
        },
        async list() {
            const idx = await this.index(), out = [];
            for (let s = 1; s <= this.SLOTS; s++) out.push({ slot: s, exists: CoopStore.exists(this.file(s)), info: idx.slots[s] || null });
            return out;
        },
        freeSlot(list) { const f = list.find(x => !x.exists); return f ? f.slot : 0; },
        newWorld(slot, name, maxPlayers) {
            return { v: 1, worldId: makeId() + makeId(), name: cleanStr(name, 40) || 'Elderfield', slot, created: Date.now(),
                     maxPlayers: Math.max(2, Math.min(4, maxPlayers || CFG.maxPlayers)), allowNew: true, roster: [], bans: [] };
        },
        /** Write the world (host only). The previous file is kept as _bak. */
        async save(world, reason) {
            if (!world || !this.validSlot(world.slot)) throw new Error('No co-op world is loaded.');
            if ($gameSystem && $gameSystem.onBeforeSave) $gameSystem.onBeforeSave();
            const contents = DataManager.makeSaveContents();
            contents.coopWorld = JSON.parse(JSON.stringify(world));
            if (CoopStore.exists(this.file(world.slot))) {
                try { await CoopStore.save(this.backup(world.slot), await CoopStore.load(this.file(world.slot))); }
                catch (e) { Diag.err('co-op backup copy failed (continuing)', e); }
            }
            await CoopStore.save(this.file(world.slot), contents);
            await CoopStore.save(this.rosterFile(world.slot), this.rosterOnly(world));
            const idx = await this.index();
            idx.slots[world.slot] = { name: world.name, worldId: world.worldId, players: world.roster.length + 1,
                day: window.$gameVariables ? $gameVariables.value(250) : 0, savedAt: Date.now(),
                playtime: ($gameSystem && $gameSystem.playtimeText) ? $gameSystem.playtimeText() : '' };
            await CoopStore.save(this.INDEX, idx);
            Diag.log('info', 'co-op world ' + world.slot + ' saved (' + reason + ')');
            Profile.save(PlayerData.actorName(), PlayerData.look());           // this PC's character, for its next new world
            return true;
        },
        /** Delete a co-op world: its save, backup and roster files and its entry in the index. Never touches other files. */
        async remove(slot) {
            if (!this.validSlot(slot)) throw new Error('No such co-op world.');
            if (Net.isHost && Net.world && Net.world.slot === slot) throw new Error('That world is being hosted right now.');
            for (const f of [this.file(slot), this.backup(slot), this.rosterFile(slot)]) await CoopStore.remove(f);
            const idx = await this.index();
            delete idx.slots[slot];
            await CoopStore.save(this.INDEX, idx);
            Diag.log('info', 'co-op world ' + slot + ' deleted');
        },
        /** Read a world file; returns {contents, world}. Does not touch the running game. */
        async read(slot) {
            if (!CoopStore.exists(this.file(slot))) throw new Error('That co-op world no longer exists.');
            const contents = await CoopStore.load(this.file(slot));
            const need = ['system', 'switches', 'variables', 'selfSwitches', 'actors', 'party', 'map', 'player'];
            if (!contents || need.some(k => !contents[k]) || !contents.coopWorld || !contents.coopWorld.worldId) throw new Error('That co-op world file is damaged or incomplete.');
            const world = contents.coopWorld;
            if (!Array.isArray(world.roster)) world.roster = [];
            await this.mergeRoster(world);
            return { contents, world };
        }
    };

    /** Engine side of loading: put save contents into the running game (same path as Scene_Load). */
    const GameBridge = {
        extract(contents) {
            DataManager.createGameObjects();
            DataManager.extractSaveContents(contents);
            DataManager.correctDataErrors();
            if ($gameSystem._bgmOnSave == null && typeof AudioManager !== 'undefined') $gameSystem._bgmOnSave = AudioManager.makeEmptyAudioObject();
            if ($gameSystem._bgsOnSave == null && typeof AudioManager !== 'undefined') $gameSystem._bgsOnSave = AudioManager.makeEmptyAudioObject();
            if ($gameSystem.onAfterLoad) $gameSystem.onAfterLoad();
        },
        /** Host: the world as JsonEx text (keeps the classes, like a save file), prepared the way Scene_Save prepares a save. */
        snapshot() {
            if (typeof $gameSystem !== 'undefined' && $gameSystem && $gameSystem.onBeforeSave) {
                const count = $gameSystem._saveCount;
                $gameSystem.onBeforeSave();                                   // music/frames on save + plugins' own save preparation
                $gameSystem._saveCount = count;                               // sending the world is not a save
            }
            return JsonEx.stringify(DataManager.makeSaveContents());
        },
        /** Joiner: become a player inside the host's world. */
        enterWorld(payload, accept) {
            const world = typeof payload.world === 'string' ? JsonEx.parse(payload.world) : payload.world;   // rebuild real game objects, as loading a save does
            this.extract(world);                                              // the host's world, exactly as the host has it now
            // WTE 26409135 keeps the look on $gameSystem (_wteCharCust) and copies it into the look variables on every build:
            // the world's copy is the host's look. Dropped, WTE makes it again from my own look variables (set below), the
            // way it brings an older save's look over.
            delete $gameSystem._wteCharCust;
            $gameParty._inBattle = false;                                    // a player always arrives on the map: never in the host's battle of the moment
            let pos = null, ce = PlayerData.BUILD_CE;                           // draw my own look (the world copy still shows the host's)
            if (payload.player) {
                const d = PlayerData.apply(payload.player) || {};
                if (d.pos && d.day === $gameVariables.value(250)) pos = d.pos;   // same in-game day: back where I left; otherwise my bedroom
                PlayerData.setName(accept.name);                                // the world's roster holds the character's name
            } else if (accept.isNew) {
                // a brand-new character in this world: its own name, then WTE's customiser (CE2045), starting from the
                // look this PC made last time (the customiser keeps the current look when the world already set it up)
                PlayerData.fresh(accept.name);
                PlayerData.applyLook(accept.look);
                ce = PlayerData.CUSTOMISER_CE;
                if (Scenes.inTutorialWorld()) {                                  // its own customiser, movie, then the forest (decisions 50, 51)
                    ce = 0; pos = { map: Scenes.OPENING.map, x: Scenes.OPENING.x, y: Scenes.OPENING.y, dir: 2 };
                    if (window.$gameScreen && $gameScreen.clear) $gameScreen.clear();   // not the host's pictures, fade or tint
                }
            } else {
                PlayerData.fresh(accept.name);                                  // my character, but the host has no data for it yet
                if (!PlayerData.applyLook(accept.look)) ce = PlayerData.CUSTOMISER_CE;
            }
            if (ce && $gameTemp && $gameTemp.reserveCommonEvent) $gameTemp.reserveCommonEvent(ce);
            if ($gameMap._interpreter) $gameMap._interpreter.clear();           // never the host's own scene (it may be waiting for me)
            if (window.$gameSystem) $gameSystem._playerMovementDisabled = false;   // nor the host's "can't move" of that moment (decision 85)
            Net.sendCharacterWhenIdle = true;                                 // tell the host my name + look as soon as it is drawn/made
            const spot = pos && isInt(pos.map, 1, 9999) ? pos : (accept.spawn || null);
            if (spot) $gamePlayer.reserveTransfer(spot.map, spot.x, spot.y, spot.dir || 2, 0);
            else $gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y, $gamePlayer.direction(), 0);
            $gamePlayer.requestMapReload();
            SceneManager.goto(Scene_Map);
        },
        toTitle() { if (typeof SceneManager !== 'undefined' && typeof Scene_Title !== 'undefined') SceneManager.goto(Scene_Title); }
    };

    /** Saving during a hosted co-op world: only the host writes, into coopworld<N> (decisions 17, 19, 24). */
    const WorldSave = {
        busy: false, lastAuto: 0,
        active() { return Net.isPlaying() && (Net.isHost ? !!Net.world : Net.inWorld); },
        /** Host: write the world. fresh = first ask every joiner for their newest player data (bed save). */
        async hostSave(reason, fresh) {
            if (!Net.isHost || !Net.world || this.busy) return false;
            this.busy = true;
            try {
                if (fresh) await Net.collectUploads(3000);
                await CoopWorlds.save(Net.world, reason);
                Net.broadcast({ t: 'WORLD_SAVED', reason: String(reason).slice(0, 12) });
                return true;
            } finally { this.busy = false; }
        },
        /** Bed -> Save opens Scene_Save; in a co-op world that becomes a world save (host) or a refusal (joiner). */
        interceptPush(sceneClass) {
            if (typeof Scene_Save === 'undefined' || sceneClass !== Scene_Save || !this.active()) return false;
            if (!Net.isHost) {
                try { SoundManager.playBuzzer(); } catch (e) { /* optional */ }
                Diag.toast('Only the host can save. The world is saved on the host\'s computer.', 4000);
                this.refusedAt = Date.now();                                    // the bed's "save used" mark that follows is left out (decision 93)
                return true;
            }
            this.hostSave('bed', true)
                .then(ok => { if (ok) { try { SoundManager.playSave(); } catch (e) { /* optional */ } Diag.toast('World saved for everyone.', 3000); } })
                .catch(e => { Diag.err('co-op world save failed', e); try { SoundManager.playBuzzer(); } catch (e2) { /* optional */ } Diag.toast('World save FAILED: ' + (e && e.message || e), 8000); });
            return true;
        },
        SAVE_COUNTER_VAR: 1494, refusedAt: 0,
        /** A joiner's refused save is no save: the bed's "save used" mark right after it is left out (decision 93). */
        skipCounter(id) {
            if (id !== this.SAVE_COUNTER_VAR || !this.refusedAt || Net.isHost || !Net.isPlaying()) return false;
            const fresh = Date.now() - this.refusedAt < 10000; this.refusedAt = 0;
            if (fresh) Diag.log('info', 'bed: the refused save does not use up the day\'s save');
            return fresh;
        },
        /** WTE autosaves (story points, map transfers) in a co-op world write the host's world file (decision 24). */
        autosave() {
            if (Net.isHost) {
                if (Date.now() - this.lastAuto < 30000) return;              // map-transfer autosaves can come in bursts
                this.lastAuto = Date.now();
                this.hostSave('autosave', false).catch(e => Diag.err('co-op autosave failed', e));
            } else Net.uploadPlayerData('autosave');                         // joiner: give the host my newest data
        }
    };

    /** Player bedrooms built into Map002 by this game itself (RoomsBuild, 5a; design §4, decisions 20, 29).
     *  The doors only appear while switch 2717 is ON, which is only during a co-op session (I-20; 2994 before the 2026-10-28 game update). */
    const Rooms = {
        SWITCH: 2717, MAP: 2,
        HOUSE: { x: 27, y: 6 },                                           // in front of the bedroom door
        HALL_BACK: { x: 8, y: 57 },                                       // in front of the hallway's "back to bedroom" door
        ROOM: {                                                           // per player slot (join order, decision 36); the rooms are the
            1: { stand: { x: 10, y: 44 }, spawn: { x: 14, y: 46 }, hall: { x: 2, y: 57 } },   // living room's size since 2026-11-02 (user):
            2: { stand: { x: 30, y: 44 }, spawn: { x: 34, y: 46 }, hall: { x: 4, y: 57 } },   // RoomsBuild (5a) prints these
            3: { stand: { x: 22, y: 56 }, spawn: { x: 26, y: 58 }, hall: { x: 6, y: 57 } }
        },
        built() { return !!(window.$dataMap && $gameMap.mapId() === this.MAP ? $dataMap.height >= 60 : true); },
        active() { return RoomsBuild.ok && CFG.transport !== 'relay' && Net.isPlaying() && (Net.isHost ? !!Net.world : Net.inWorld); },
        /** Every map frame: the door switch follows the session. */
        update() {
            if (!window.$gameSwitches) return;
            const on = this.active();
            if ($gameSwitches.value(this.SWITCH) !== on) $gameSwitches.setValue(this.SWITCH, on);
            if (on && Net.isHost) RoomStores.ensure();                         // each room's own chest and fridge (28_09)
        },
        spawnFor(slot) { const r = RoomsBuild.ok && this.ROOM[slot]; return r ? { map: this.MAP, x: r.spawn.x, y: r.spawn.y, dir: 2 } : null; },
        ownerName(slot) {
            if (Net.isHost && Net.world) { const r = Net.world.roster.find(e => e.slot === slot); return r ? r.name : ''; }
            if (slot === Net.slot) return PlayerData.actorName() || Net.name;
            let n = ''; Net.peers.forEach(p => { if (p.slot === slot) n = p.name; });
            return n || (Net.rosterNames && Net.rosterNames.get(slot)) || '';
        },
        /** Called by the door events: go('hall' [, fromRoom]), go('room1'..'room3'), go('house'). */
        go(where, fromRoom) {
            if (!this.active()) return;
            let to = null, note = '';
            if (where === 'house') to = this.HOUSE;
            else if (where === 'hall') to = fromRoom && this.ROOM[fromRoom] ? this.ROOM[fromRoom].hall : this.HALL_BACK;
            else {
                const slot = Number(String(where).replace('room', '')), r = this.ROOM[slot];
                if (!r) return;
                to = r.stand;
                const owner = this.ownerName(slot);
                note = owner ? owner + "'s room" : 'Room ' + slot + ' (nobody yet)';
            }
            $gamePlayer.reserveTransfer(this.MAP, to.x, to.y, 2, 0);
            if (note) Diag.toast(note, 2000);
        }
    };

    /** A message to show on the title screen after being sent back (decision 34). */
    const Notice = { text: '', set(t) { this.text = String(t || ''); }, take() { const t = this.text; this.text = ''; return t; } };
    const Net = new Session();


    // ---- the character creator keeps its place (user, 2026-11-01): WTE's creator (CE2045) shows its menus again after
    //      every change with the cursor back on the first line ("Hair Style", "Next"), so changing your shirt colour
    //      meant scrolling down again each time. While it runs, each menu starts where you last chose. Other menus: as WTE. ----
    const CreatorCursor = {
        last: new Map(),                                  // a menu's lines -> the line chosen last
        on() { return !!window.$gameMap && Night.isRunningCE(PlayerData.CUSTOMISER_CE); }
    };
    if (typeof Game_Interpreter !== 'undefined') {
        const _setupChoices = Game_Interpreter.prototype.setupChoices;
        Game_Interpreter.prototype.setupChoices = function (params) {
            const r = _setupChoices.apply(this, arguments);
            try {
                if (CreatorCursor.on() && Array.isArray(params[0])) {
                    const key = params[0].join('|'), n = CreatorCursor.last.get(key);
                    if (Number.isInteger(n) && n >= 0 && n < params[0].length) $gameMessage._choiceDefaultType = n;
                    const cb = $gameMessage._choiceCallback;
                    if (typeof cb === 'function') $gameMessage._choiceCallback = i => { if (i >= 0) CreatorCursor.last.set(key, i); return cb(i); };
                }
            } catch (e) { /* the cursor only */ }
            return r;
        };
    }
    // =====================================================================
    // 6. REMOTE PLAYERS (engine integration)
    // =====================================================================
    /** Other players' looks. WTE draws the player from KC_CompositeBitmaps layer lists keyed by "proxy" sheet names
     *  (e.g. CharCustomization/CharOutdoor/!OUTDOOR__PROXY), and each game only has its own player's lists, so
     *  every player sends the flattened list of the sheet they use (PLOOK) and remote sprites are composited from it.
     *  Layer files are checked to exist first, so a bad name can never bring up the game's "Retry" screen. */
    const Looks = {
        NAME: /^[\w\-\/ !$()'.,#&+]{1,96}$/,
        files: new Map(), cache: new Map(),
        kc() { return (typeof KCDev !== 'undefined' && KCDev.CompositeBitmaps) || null; },
        layersOf(cn) {
            const kc = this.kc();
            if (!kc || !cn || !kc.tvCharLayers || !kc.tvCharLayers[cn]) return null;
            try { return kc.flattenLayerInfos(cn, kc.tvCharLayers).map(i => ({ filename: String(i.filename), sIndex: Number(i.sIndex) | 0, dIndex: Number(i.dIndex) | 0, _isBig: !!i._isBig })); }
            catch (e) { return null; }
        },
        fileOk(name) {
            if (this.files.has(name)) return this.files.get(name);
            let ok = false;
            try {
                const fs = P2P.nodeRequire('fs'), path = P2P.nodeRequire('path'), root = P2P.gameRoots()[0];
                ok = ['.png_', '.png'].some(ext => fs.existsSync(path.join(root, 'img', 'characters', name + ext)));
            } catch (e) { ok = typeof require === 'undefined'; }          // no file system (tests): trust the name check
            this.files.set(name, ok);
            return ok;
        },
        clean(cn, layers) {
            if (typeof cn !== 'string' || !this.NAME.test(cn) || cn.includes('..') || !this.fileOk(cn) || !Array.isArray(layers) || layers.length > 96) return null;
            const out = [];
            for (const l of layers) {
                if (!l || typeof l.filename !== 'string' || !this.NAME.test(l.filename) || l.filename.includes('..') || !isInt(l.sIndex, 0, 7) || !isInt(l.dIndex, 0, 7)) return null;
                if (this.fileOk(l.filename)) out.push({ filename: l.filename, sIndex: l.sIndex, dIndex: l.dIndex, _isBig: !!l._isBig });
            }
            return out;
        },
        /** A composite bitmap of one remote player's sheet (cached until their layers change). */
        bitmapFor(who, cn, layers) {
            const kc = this.kc();
            if (!kc || !kc.Composite_Character_Bitmap) return null;
            const key = who + '|' + cn, config = JSON.stringify(layers), c = this.cache.get(key);
            if (c && c.config === config) return c.bitmap;
            const bitmap = new kc.Composite_Character_Bitmap(layers, cn);
            this.cache.set(key, { config, bitmap });
            return bitmap;
        },
        /** The sheet's own file, without anyone's layers (shown until a player's look has arrived). */
        baseBitmap(cn) { const kc = this.kc(); return kc && kc.ImageManager_loadCharacter ? kc.ImageManager_loadCharacter.call(ImageManager, cn) : ImageManager.loadCharacter(cn); }
    };

    let RemoteChar = null;
    if (typeof Game_Character !== 'undefined') {
        /** Another player on this map. It replays what that player's game actually showed (position, facing, action
         *  index, animation frame) about 0.1 s behind, interpolated between updates, so walking, running and the
         *  bike look the same as on their screen instead of being re-simulated here. */
        RemoteChar = class RemoteChar extends Game_Character {
            constructor() { super(); this._remoteMap = 0; this._samples = []; this._remoteVisible = 1; this._lookRev = 0; this.setThrough(true); }
            remoteState(s) {
                const now = performance.now(), S = this._samples, last = S[S.length - 1];
                if (s.map !== this._remoteMap || !last || Math.abs(s.x - last.x) > 4 || Math.abs(s.y - last.y) > 4) S.length = 0;   // new map or a warp: jump there
                else if (last.t < now - RemoteChar.DELAY) last.t = now - 50;  // they stood still: start moving from now, not from the past
                this._remoteMap = s.map;
                S.push({ t: now, x: s.x, y: s.y, dir: s.dir, cn: s.cn, ci: s.ci, pt: s.pt, vis: s.vis });
                if (S.length > 40) S.splice(0, S.length - 40);
                if (S.length === 1) this.show(S[0], s.x, s.y);
            }
            show(a, x, y) {
                if (this._characterName !== a.cn || this._characterIndex !== a.ci) {
                    if (!this._pend || this._pend.cn !== a.cn || this._pend.ci !== a.ci) {
                        let b = null; try { b = a.cn ? ImageManager.loadCharacter(a.cn) : null; } catch (e) { b = null; }
                        if (b && !b.isReady() && this._characterName) this._pend = { cn: a.cn, ci: a.ci, b };   // the old picture stays until the new one has loaded: never blinks out (user, 2026-11-01)
                        else { this._pend = null; this.setImage(a.cn, a.ci); this._imgWait = b && !b.isReady() ? b : null; }   // the first picture: hidden until loaded (decision 92)
                    }
                } else this._pend = null;
                this._x = this._realX = x; this._y = this._realY = y;
                this._direction = a.dir; this._remoteVisible = a.vis;
                if (!this._pend) this._pattern = a.pt;                            // a frame of the new sheet waits for the new sheet
            }
            pattern() { return this._pattern; }                            // the sender's frame, already resolved by its plugins
            update() {
                const S = this._samples, at = performance.now() - RemoteChar.DELAY;
                if (S.length) {
                    while (S.length >= 2 && S[1].t <= at) S.shift();
                    const a = S[0], b = S[1];
                    if (b && a.t < at) { const k = (at - a.t) / (b.t - a.t); this.show(a, a.x + (b.x - a.x) * k, a.y + (b.y - a.y) * k); }
                    else this.show(a, a.x, a.y);
                }
                if (this._pend && (this._pend.b.isReady() || (this._pend.b.isError && this._pend.b.isError()))) { const p = this._pend; this._pend = null; this.setImage(p.cn, p.ci); const s = S[0]; if (s) this._pattern = s.pt; }   // loaded: swapped in one frame, picture and frame together
                if (this._imgWait && this._imgWait.isReady()) { this._imgWait = null; this._imgShownAt = Graphics.frameCount + 1; }   // ready: shown from the next frame, with its own frame (decision 92)
                const loading = !!this._imgWait || (this._imgShownAt && Graphics.frameCount < this._imgShownAt);
                // WTE draws players on a "proxy" sheet whose own picture is grey noise; their look (its layers) makes the
                // picture: until a player's first look has arrived they stay hidden, never shown as static (user, 2026-11-01)
                const p = this._coopPeer, lk = p && p.looks;
                if (lk && Object.keys(lk).length) this._coopHadLook = true;
                const bare = !this._coopHadLook && /__PROXY$/.test(this._characterName || '') && !(lk && lk[this._characterName]);
                this.setTransparent(loading || bare || this._remoteMap !== Locator.local() || !this._remoteVisible || Scenes.hideOthers());   // my cutscene shows only me
            }
        };
        RemoteChar.DELAY = 110;                                             // ms behind real time: room for two updates (50 ms apart)
    }

    let GhostChar = null;
    if (typeof Game_Character !== 'undefined') {
        /** What another player is about to place (PKD placement preview), see-through, at the spot they are choosing. */
        GhostChar = class GhostChar extends Game_Character {
            constructor() { super(); this._g = null; this._item = -1; this.setThrough(true); this.setOpacity(140); this.setTransparent(true); }
            ghost(g) {
                this._g = g;
                if (!g) return;
                // a picture WTE drew in the placer's game (an auto-tiled path, "$WTE_PATH_..."): no such file here, and loading it
                // stops the game (2026-11-04): this game shows the item's own picture instead
                const drawn = typeof g.cn === 'string' && g.cn.startsWith('$WTE_') && !(window.ImageManager && ImageManager._cache && ImageManager._cache['img/characters/' + encodeURIComponent(g.cn) + '.png']);
                if (typeof g.cn === 'string' && !drawn) {                      // the placer's exact frame
                    const k = g.cn + '|' + g.ci + '|' + g.tile;
                    if (k !== this._frameKey) { this._frameKey = k; this._item = g.item; if (g.tile > 0) this.setTileImage(g.tile); else this.setImage(g.cn, g.ci); }
                    this.locate(g.x, g.y); this.setDirection(g.d); this._pattern = g.pt;
                    return;
                }
                if (g.item !== this._item) {
                    this._item = g.item;
                    const data = typeof PKD_EPManager !== 'undefined' && PKD_EPManager.ItemData(g.item);
                    const ev = data && window.$dataEPEventsMap && $dataEPEventsMap.events[data.eventId];
                    const img = ev && ev.pages && ev.pages[0] && ev.pages[0].image;
                    if (img && img.tileId > 0) this.setTileImage(img.tileId);
                    else if (img) { this.setImage(img.characterName, img.characterIndex); this._originalPattern = img.pattern; this.resetPattern(); }
                    else this.setImage('', 0);
                }
                this.locate(g.x, g.y);
                this.setDirection(g.d);
            }
            pattern() { return this._g && typeof this._g.cn === 'string' ? this._g.pt : super.pattern(); }
            update() { this.setTransparent(!this._g || this._g.m !== $gameMap.mapId() || Scenes.hideOthers()); }
        };
    }

    let BobberChar = null;
    if (typeof Game_Character !== 'undefined') {
        /** Another player's bobber while they fish (WTE's own bobber sprite, bobbing where theirs floats). */
        BobberChar = class BobberChar extends Game_Character {
            constructor() { super(); this._b = 0; this._m = 0; this.setThrough(true); this.setImage('!$Bobber', 0); this.setStepAnime(true); this.setPriorityType(2); this.setTransparent(true); }
            bob(st) { this._b = st && st.fb; this._m = st ? st.map : 0; if (this._b) { if (this.x !== this._b[0] || this.y !== this._b[1]) this.locate(this._b[0], this._b[1]); this.setDirection(this._b[2]); } }
            update() { super.update(); this.setTransparent(!this._b || this._m !== Locator.local() || Scenes.hideOthers()); }
        };
    }

    // =====================================================================
    // 7. PRIVATE HOUSES BY LOCATION (no map loading hooks)
    // =====================================================================
    /** Every player already owns a private game state (inventory, storage, furniture, pocket events), so
     *  homes do not need separate map files. Players just report a different LOCATION ID for their house:
     *  the host reports the real house map, each client reports 9000+slot while inside the house map.
     *  Remote players are only drawn when the reported location equals your own, so nobody sees into
     *  anyone else's house. Nothing about map loading, map IDs or $dataMapInfos is touched. */
    const Locator = {
        effective(mapId) {
            return (CFG.templateMapId && mapId === CFG.templateMapId && Net.isPlaying() && !Net.isHost && Net.slot > 0)
                ? CFG.virtualBase + Net.slot : mapId;
        },
        local() { return window.$gameMap ? this.effective(window.$gameMap.mapId()) : 0; }
    };

    // =====================================================================
    // 7b. SHARED MONSTER / ROOM FLAGS
    // =====================================================================
    /** Whitelisted game state that every player sees the same way: a monster defeated (self switch A) on a
     *  configured map, and the r_* room/mystery variables. Host is the single relay; last write wins.
     *  Chase/encounter switches (D) are deliberately NOT shared: they would force other players into your battle. */
    const Shared = {
        applying: false,
        ready() { return !!(window.$gameSelfSwitches && window.$gameVariables && window.$gameMap && window.$gamePlayer); },
        valid(e) {
            if (!e || typeof e !== 'object') return false;
            if (e.k === 's') return isInt(e.m, 1, 9999) && isInt(e.e, 1, 9999) && CFG.sharedChannels.has(e.c) && CFG.sharedMaps.has(e.m) && (e.v === 0 || e.v === 1);
            if (e.k === 'v') return isInt(e.i, 1, 9999) && CFG.sharedVars.has(e.i) && this.validValue(e.v);
            if (e.k === 'g') return isInt(e.i, 1, 9999) && CFG.worldSwitches.has(e.i) && (e.v === 0 || e.v === 1);
            return false;
        },
        validValue(v) {   // some variables hold names (tax items, places); a script may keep true/false or a short list in one
            return isNum(v, -1e12, 1e12) || (typeof v === 'string' && v.length <= 200) || typeof v === 'boolean'
                || (v !== null && typeof v === 'object' && (() => { try { return JSON.stringify(v).length <= 400; } catch (e) { return false; } })());
        },
        key(e) { return e.k === 's' ? 's:' + e.m + ',' + e.e + ',' + e.c : e.k === 'g' ? 'g:' + e.i : 'v:' + e.i; },
        /** Apply a remote change (queued until the map scene exists). Never re-broadcasts it. */
        /** One flag; a failure never stops the rest of its batch (decision 78). */
        applySafe(e) { try { this.apply(e); } catch (x) { this.applying = false; Diag.err('world flag ' + this.key(e), x); } },
        /** A joiner's own midnight or morning is running: the host's world changes wait until it is over (decision 92);
         *  both games start it from the same values and the host's results land afterwards (no double counting). */
        held() { return !Net.isHost && Net.isPlaying() && (Night.isRunningCE(Night.CE.midnight) || Night.isRunningCE(Night.CE.wake)); },
        apply(e) {
            if (!this.ready() || this.held()) { Net.pendingFlags.set(this.key(e), e); if (Net.pendingFlags.size > 3000) Net.pendingFlags.delete(Net.pendingFlags.keys().next().value); return; }
            this.applying = true;
            try {
                if (e.k === 's') window.$gameSelfSwitches.setValue([e.m, e.e, e.c], e.v === 1);
                else if (e.k === 'g') { const was = window.$gameSwitches.value(e.i); window.$gameSwitches.setValue(e.i, e.v === 1); if (e.i === Festival.EGG.hunt && was && e.v === 0) Festival.huntEnded(); }
                else { window.$gameVariables.setValue(e.i, e.v); Counters.noteHost(e.i, e.v); }
            } finally { this.applying = false; }
        },
        flush() {
            if (!Net.pendingFlags.size || !this.ready() || this.held()) return;
            const list = Array.from(Net.pendingFlags.values()); Net.pendingFlags.clear();
            list.forEach(e => this.applySafe(e));
        },
        /** My own change -> tell the host. */
        /** My own change -> tell the host: the latest value per flag, at most 10 times a second (a counter that a loop
         *  runs down, like the farm's clutter, would otherwise be hundreds of messages at once). */
        pending: new Map(), lastFlush: 0,
        local(e) {
            if (this.applying || !Net.isPlaying() || !this.valid(e)) return;
            if (Counters.quiet) return;                                         // a counter changed by a page the map's authority runs for everyone (decision 92)
            if (e.k === 'v') Counters.noteHost(e.i, e.v);                       // the world's value as I know it
            if (!Net.isHost && e.k !== 's' && Spawns.stack.some(i => i && i._coopRng && !i._coopRngKeep)) return;   // a joiner's midnight rolls: the host's are the world's (same seed, same result); a story moment's changes are sent
            if (this.WORK[e.k] && this.WORK[e.k].has(e.i)) return;              // a working value of one event's run: each game keeps its own
            if (this.MIDNIGHT_OWN[e.k] && this.MIDNIGHT_OWN[e.k].has(e.i) && Spawns.stack.some(i => i && i._coopRng && !i._coopRngKeep)) return;   // set and used up within each game's own midnight run
            this.pending.set(this.key(e), e);
        },
        /** Why the host kept repairing a few world values (suite runs 2026-11-01/02; user: "fix the values the host keeps
         *  repairing"). Values that each game's own midnight run both sets and uses up: V245 "Crop Growth Repeat" (the
         *  Strange Moon adds one, the crop update runs again and takes it away) and S696 "Grow Crop" (the growth check's
         *  signal). Every game runs the same seeded midnight, so each has the right value; the host's mid-run value landed in
         *  a joiner's run after the joiner had used its own (V245 left at 1: an extra growth the next night). A rune or a
         *  sleep gift outside midnight still tells everyone. */
        MIDNIGHT_OWN: { v: new Set([245]), g: new Set([696]) },
        /** Working values an event sets and uses within its own run, on every game that runs it: the farm boss event
         *  (Map 34 E255) zeroes V917, turns S1211 "Farmboss Headcount" on for 4 frames while the farm's creatures count
         *  themselves into V917, then off, and pulses S1219 "Erase Farm Bosses" the same way. Sent over the network, an
         *  "on" arriving after the other game's own "off" left the switch on for good (the host's S1211 repairs). */
        WORK: { g: new Set([1211, 1219]), v: new Set([917]) },
        flushLocal(now) {
            if (!this.pending.size || now - this.lastFlush < 100) return;
            this.lastFlush = now;
            const list = Array.from(this.pending.values()); this.pending.clear();
            for (let i = 0; i < list.length; i += 250) Net.flagsChanged(list.slice(i, i + 250));   // one message per batch, not one per flag
        },
        snapshot() {
            const out = [];
            if (!this.ready()) return out;
            const data = window.$gameSelfSwitches._data || {};
            for (const k of Object.keys(data)) {
                if (data[k] !== true) continue;
                const [m, e, c] = k.split(',');
                const entry = { k: 's', m: Number(m), e: Number(e), c, v: 1 };
                if (this.valid(entry)) out.push(entry);
            }
            CFG.sharedVars.forEach(i => {
                const v = window.$gameVariables.value(i);
                if (v !== 0 && v !== '' && v !== null && v !== undefined) { const entry = { k: 'v', i, v }; if (this.valid(entry)) out.push(entry); }
            });
            CFG.worldSwitches.forEach(i => { if (window.$gameSwitches.value(i)) out.push({ k: 'g', i, v: 1 }); });
            return out;
        }
    };

    // =====================================================================
    // 7d. SHARED PLACED OBJECTS AND CHESTS (design §2.4, §2.6: PKD_PocketEvents and DM_LimitedInventory adapters)
    //     Placing, picking up and moving furniture/chests reach every player (PKD's own network hooks, wired to
    //     this session). A placed object's self switches/variables are shared, so a chest points at the same
    //     container everywhere. Container contents are the host's: a chest is used by one player at a time
    //     (interact lock, I-18) and its contents are sent when it closes.
    // =====================================================================
    const WorldObjects = {
        applying: false,
        removedUid: new Map(),        // "map,event" -> uniqueId, captured just before PKD forgets it
        lastMove: new Map(),
        pendingSpawn: [], pendingRemove: [],   // {m, id}: changes that arrived while this player was in a menu
        locks: {},                    // container id -> { by: peer id, name } (host truth, mirrored to everyone)
        active() { return Net.isPlaying() && (Net.isHost || Net.inWorld); },
        db(mapId) { try { return (window.$gameSystem && $gameSystem.pGetEPDB && $gameSystem.pGetEPDB()[mapId]) || []; } catch (e) { return []; } },
        uidOf(mapId, eventId) { const r = this.db(mapId).find(d => d && d[3] === eventId); return r && r.length > 5 ? String(r[r.length - 1]) : null; },
        /** This game's event number for a placed object: by its unique id, else the number it was sent with. */
        localId(mapId, eventId, uid) {
            const rows = this.db(mapId);
            if (uid) { const r = rows.find(d => d && d.length > 5 && String(d[d.length - 1]) === uid); if (r) return r[3]; }
            const r = rows.find(d => d && d[3] === eventId && (!uid || d.length <= 5));
            return r ? r[3] : 0;
        },
        isPlaced(ev) { return !!ev && typeof ev.pGetEPDynamicObjId === 'function' && ev.pGetEPDynamicObjId() >= 0; },
        /** Send a change (host: to everyone; joiner: to the host, who applies it and passes it on). */
        emit(op, data) {
            if (!this.active() || this.applying) return;
            if (['t', 'q', 's'].some(k => k in data)) { Diag.log('warn', 'shared change "' + op + '" uses a field the message envelope owns (t/q/s): not sent'); return; }
            if (op === 'place' && Net.isHost) this.notePlaced(data.m, data.x, data.y, data.u);
            const msg = Object.assign({ op }, data);
            if (Net.isHost) Net.broadcast(Object.assign({ t: 'WB', by: Net.selfId }, msg));
            else Net.send(Net.hostId, Object.assign({ t: 'W' }, msg));
        },
        valid(m) {
            const id = v => isInt(v, 1, 99999), uid = v => v === null || v === undefined || (typeof v === 'string' && /^[\w-]{1,48}$/.test(v));
            switch (m.op) {
                case 'place': return id(m.m) && id(m.e) && isInt(m.item, 0, 9999) && isInt(m.x, 0, 999) && isInt(m.y, 0, 999) && uid(m.u) && (m.d === undefined || [2, 4, 6, 8].includes(m.d)) && (m.my === undefined || m.my === null || isNum(m.my, -999, 999));
                case 'remove': return id(m.m) && id(m.e) && uid(m.u);
                case 'move': return id(m.m) && id(m.e) && uid(m.u) && isInt(m.x, 0, 999) && isInt(m.y, 0, 999) && [2, 4, 6, 8].includes(m.d);
                case 'self': return id(m.m) && id(m.e) && uid(m.u) && ((m.k === 's' && /^[A-D]$/.test(m.c) && (m.v === 0 || m.v === 1)) || (m.k === 'v' && isInt(m.c, 1, 9999) && (isNum(m.v, -1e9, 1e9) || m.v === 0 || (typeof m.v === 'string' && m.v.length <= 40))));
                case 'sps': return Array.isArray(m.l) && m.l.length >= 1 && m.l.length <= 400 && m.l.every(x => x && typeof x === 'object' && this.valid(Object.assign({}, x, { op: 'sp' })));
                case 'selfs': return Array.isArray(m.l) && m.l.length >= 1 && m.l.length <= 400 && m.l.every(x => x && typeof x === 'object' && this.valid(Object.assign({}, x, { op: 'self' })));
                case 'cont': return isInt(m.i, 1, 9999) && !!m.c && typeof m.c === 'object' && Array.isArray(m.c.items) && m.c.items.length <= 2000;
                case 'lock': return isInt(m.i, 1, 9999) && (m.on === 0 || m.on === 1);
                case 'locks': return !!m.locks && typeof m.locks === 'object';
                case 'rstores': return RoomStores.valid(m.v);                  // the players' rooms' own containers (host only)
                case 'unplace': return id(m.m) && id(m.e) && uid(m.u) && isInt(m.item, 0, 9999);
                case 'sp': return id(m.m) && id(m.e) && id(m.id) && isInt(m.x, 0, 999) && isInt(m.y, 0, 999) && (m.a === undefined || m.a === 0 || m.a === 1);
                case 'unsp': return id(m.m) && id(m.e) && id(m.id);
                case 'spmv': return id(m.m) && id(m.from) && id(m.to);
                case 'erase': return id(m.m) && id(m.e);
                case 'dc': return id(m.m) && id(m.e) && isInt(m.tp, 0, 9999);   // tp, not t: t is the message type
                case 'shop': return isInt(m.i, 0, 999) && Progress.validShop(m.rows);
                case 'disc': return Progress.validDisc(m.d);
                case 'sbase': return typeof m.k === 'string' && /^\d{1,3}:\d{1,5}$/.test(m.k) && isInt(m.a, -1, 1e7) && isInt(m.u, 0, 9);
                case 'obj': return id(m.m) && id(m.e) && !!m.st && typeof m.st === 'object' && /^[A-D]{0,4}$/.test(String(m.st.ss)) && !!m.st.sv && typeof m.st.sv === 'object'
                    && Object.keys(m.st.sv).length <= 60 && Object.values(m.st.sv).every(v => isNum(v, -1e9, 1e9)) && isInt(m.st.dc || 0, 0, 9999);
                default: return false;
            }
        },
        /** Apply a change that came from another player. Never re-sent. */
        apply(m, fromName) {
            if (!this.valid(m) || (typeof PKD_EPManager === 'undefined' && ['place', 'remove', 'move'].includes(m.op))) { Diag.log('warn', 'shared object message ignored: ' + JSON.stringify(m).slice(0, 200)); return; }
            this.applying = true;
            try {
                if (m.op === 'place') this.applyPlace(m);
                else if (m.op === 'remove') this.applyRemove(m);
                else if (m.op === 'move') this.applyMove(m);
                else if (m.op === 'self') this.applySelf(m);
                else if (m.op === 'selfs') m.l.forEach(x => { try { this.applySelf(x); } catch (e) { Diag.err('shared object (self ' + x.m + ',' + x.e + ')', e); } });
                else if (m.op === 'cont') this.applyContainer(m.i, m.c);
                else if (m.op === 'locks') this.locks = m.locks;
                else if (m.op === 'rstores') RoomStores.set(m.v);
                else if (m.op === 'sp') Spawns.applySpawn(m);
                else if (m.op === 'sps') m.l.forEach(x => { try { Spawns.applySpawn(x); } catch (e) { Diag.err('shared object (spawn ' + x.m + ',' + x.e + ')', e); } });
                else if (m.op === 'unsp') Spawns.applyUnspawn(m);
                else if (m.op === 'spmv') Spawns.applyMove(m);
                else if (m.op === 'dc') Spawns.applyClone(m);
                else if (m.op === 'obj') Spawns.applyObject(m);
                else if (m.op === 'shop' || m.op === 'sbase' || m.op === 'disc') {
                    Progress.applying = true;
                    try { if (m.op === 'shop') Progress.applyShop(m.i, m.rows); else if (m.op === 'sbase') Progress.setBase(m.k, m.a, m.u); else Progress.applyDisc(m.d); }
                    finally { Progress.applying = false; }
                }
                else if (m.op === 'unplace') this.applyUnplace(m);
                else if (m.op === 'erase') Spawns.applyErase(m);
            } catch (e) { Diag.err('shared object (' + m.op + ')', e); }
            finally { this.applying = false; }
        },
        applyPlace(m) {
            if (Net.isHost) this.notePlaced(m.m, m.x, m.y, m.u);
            const rows = this.db(m.m);                                           // already here? (same unique id, or same kind on the same spot)
            if (m.u ? rows.some(d => d && d.length > 5 && String(d[d.length - 1]) === m.u)
                    : rows.some(d => d && d[0] === m.item && d[1] === m.x && d[2] === m.y)) return;
            const onMap = window.$gameMap && $gameMap.mapId() === m.m;
            const taken = id => this.db(m.m).some(d => d && d[3] === id) || (onMap && !!$gameMap._events[id]);
            let id = m.e;
            if (taken(id)) { id = Math.max(m.e + 1, onMap ? $gameMap._events.length : 0); while (taken(id)) id++; }   // never overwrite an event here
            const data = PKD_EPManager.ItemData(m.item);
            if (!data || !(data.eventId > 0)) return Diag.log('warn', 'a placed object from another player has an unknown kind (' + m.item + ')');
            // The same steps as PKD's own "outer item" code, done here: that code needs KDCore, which this game doesn't ship.
            $gameSystem.pSaveEPMargins(m.m, id, 0, m.my || 0);
            const row = $gameSystem.pRegisterEPItem(m.m, m.item, m.x, m.y, id);
            row[4] = m.d || 2;
            row.push(m.u || this.newUid(m.m));
            if (onMap) this.spawn(id, m.item, data.eventId, m.x, m.y, m.d || 2, true);
            PKD_EPManager.ActivatePlacedItem(m.m, m.item, id);
        },
        applyRemove(m) {
            const id = this.localId(m.m, m.e, m.u);
            if (!id) return;
            if (window.$gameMap && $gameMap.mapId() === m.m) {
                if (typeof InitialPlacedPEManager !== 'undefined' && InitialPlacedPEManager.unregisterInitialPlacedPE) InitialPlacedPEManager.unregisterInitialPlacedPE(id);
                const ev = $gameMap.event(id);
                if (ev) { Spawns.forgetTarget(id); if (typeof ev.wteUnbake === 'function') ev.wteUnbake(); }   // WTE draws still furniture into the map picture
                if (SceneManager._scene instanceof Scene_Map && SceneManager._scene.pUnSpawnEPEvent) SceneManager._scene.pUnSpawnEPEvent(id);
                else this.pendingRemove.push({ m: m.m, id });                      // in a menu: removed when the map scene is back
            }
            $gameSystem.pRemoveEPItem(m.m, id);
            PKD_EPManager.ClearSelfSwitches(m.m, id);
        },
        /** Put a placed object on the current map (now, or when the map scene is back from a menu). */
        spawn(id, item, templateId, x, y, d, animate) {
            const sc = SceneManager._scene;
            if (!(sc instanceof Scene_Map) || !sc.pSpawnEPEvent || !sc._spriteset) { this.pendingSpawn.push({ m: $gameMap.mapId(), id }); return; }
            const keep = $gameTemp._epPlacementItemId;
            $gameTemp._epPlacementItemId = item;                                   // PKD's event reads its kind from here while spawning
            try {
                const ev = sc.pSpawnEPEvent(templateId, x, y, id);
                if (ev && d) ev.setDirection(d);
                if (animate && ev) PKD_EPManager.CallPlacementAnimation(ev, item);
                PKD_EPManager.RestoreMargins();
            } finally { $gameTemp._epPlacementItemId = keep; }
        },
        /** Back on the map after a menu: add/remove what changed meanwhile (PKD only reloads objects on a new map). */
        flushPending() {
            if (!this.pendingSpawn.length && !this.pendingRemove.length) return;
            const sc = SceneManager._scene;
            if (!(sc instanceof Scene_Map) || !sc._spriteset) return;
            const m = $gameMap.mapId(), spawn = this.pendingSpawn.splice(0).filter(p => p.m === m).map(p => p.id), remove = this.pendingRemove.splice(0).filter(p => p.m === m).map(p => p.id);
            this.applying = true;
            try {
                remove.forEach(id => { const ev = $gameMap.event(id); if (ev) { Spawns.forgetTarget(id); if (typeof ev.wteUnbake === 'function') ev.wteUnbake(); sc.pUnSpawnEPEvent(id); } });
                spawn.forEach(id => {
                    const row = this.db(m).find(d => d && d[3] === id), data = row && PKD_EPManager.ItemData(row[0]);
                    if (row && data && !$gameMap.event(id)) { this.spawn(id, row[0], data.eventId, row[1], row[2], row[4], false); PKD_EPManager.ActivatePlacedItem(m, row[0], id); }
                });
            } catch (e) { Diag.err('shared objects after menu', e); }
            finally { this.applying = false; }
        },
        // ---- self switch / self variable changes go out in batches: the latest value per switch, at most 10 times a second
        //      (a new day updates every crop plot at once; one message per change would flood the connection) ----
        selfQ: new Map(), lastSelfFlush: 0,
        spQ: [],
        queueSelf(x) { if (this.active() && !this.applying && !(x.u === null && Spawns.quiet(x.m))) this.selfQ.set(x.m + ',' + x.e + ',' + x.k + x.c, x); },
        flushSelf(now, force) {
            Spawns.flushObjects(now, force);
            if ((!this.selfQ.size && !this.spQ.length) || (!force && now - this.lastSelfFlush < 100)) return;
            this.lastSelfFlush = now;
            const sps = this.spQ.splice(0);                                // spawns first: the changes after them may be about them
            this.batches(sps, 11000).forEach(l => this.emit('sps', { l }));
            const all = Array.from(this.selfQ.values()); this.selfQ.clear();
            this.batches(all, 11000).forEach(l => this.emit('selfs', { l }));
        },
        /** Split a list into pieces that each fit in one message. */
        batches(list, maxChars) {
            const out = []; let cur = [], size = 0;
            list.forEach(x => { const n = JSON.stringify(x).length + 1; if (cur.length && (size + n > maxChars || cur.length >= 400)) { out.push(cur); cur = []; size = 0; } cur.push(x); size += n; });
            if (cur.length) out.push(cur);
            return out;
        },
        /** Host: two players placed on the same tile at the same moment (within 3 s): the first one keeps it.
         *  (Placing on purpose on top of something, like decor on a table, is left to the game as always.) */
        recentTiles: new Map(),
        notePlaced(m, x, y, u) { this.recentTiles.set(m + ',' + x + ',' + y, { u, at: Date.now() }); },
        clash(m) {
            const r = this.recentTiles.get(m.m + ',' + m.x + ',' + m.y);
            return !!r && r.u !== m.u && Date.now() - r.at < 3000;
        },
        /** My placement lost the race for that tile: take it back and return the item. */
        applyUnplace(m) {
            this.applyRemove({ m: m.m, e: m.e, u: m.u });
            const item = window.$dataItems && $dataItems[m.item];
            if (item) $gameParty.gainItem(item, 1);
            Diag.toast('Someone placed something there first.', 2500);
        },
        newUid(m) { return 'c' + (Net.isHost ? 0 : Net.slot) + '_' + makeId() + '_' + m; },
        applyMove(m) {
            const id = this.localId(m.m, m.e, m.u), row = id && this.db(m.m).find(d => d && d[3] === id);
            if (!row) return;
            row[1] = m.x; row[2] = m.y; row[4] = m.d;
            if ($gameMap.mapId() === m.m && $gameMap.event(id)) { const ev = $gameMap.event(id); if (typeof ev.wteUnbake === 'function') ev.wteUnbake(); ev.locate(m.x, m.y); ev.setDirection(m.d); Spawns.wake(ev); }
        },
        applySelf(m) {
            const id = this.localId(m.m, m.e, m.u) || m.e;
            if (m.k === 's' && FirstTime.personal(m.m, id, m.c)) return;   // another player's first-time reward: not mine
            const ready = !!window.$dataMap && !!$dataMap.events;               // (still loading: the values are kept, the map shows them when it's up)
            if (m.k === 's') {
                // this map while it is loading: stored without Simple_AntiLag's instant refresh of the event, which reads
                // the map data that isn't there yet (the suite saw 360 errors in a burst); the map shows it when it's up
                if (!ready && window.$gameMap && $gameMap.mapId() === m.m) { const k = [m.m, id, m.c]; if (m.v === 1) $gameSelfSwitches._data[k] = true; else delete $gameSelfSwitches._data[k]; }
                else $gameSelfSwitches.setValue([m.m, id, m.c], m.v === 1);
            } else if ($gameVariables.setSelfValue) $gameVariables.setSelfValue([m.m, id, m.c], typeof m.v === 'string' ? cleanStr(m.v, 40) : m.v);   // (a name: cleaned)
            if (ready && Spawns.onMap(m.m)) Spawns.wake($gameMap.event(id));       // a picked herb looks picked here at once
            if (ready && m.k === 's' && m.c === 'A' && Spawns.onMap(m.m) && Mobs.isMob($gameMap.event(id))) Diag.log('info', 'monster ' + (m.v ? 'defeated' : 'back') + ' by another player: map ' + m.m + ' event ' + id);
        },
        // ---- containers (chests) ----
        packContainer(c) {
            return { name: String(c.name || '').slice(0, 80), max: c.maxStorage === Infinity || c.maxStorage === null ? 0 : Number(c.maxStorage) || 0,
                     icon: Number(c.storageIconId) || 0, loot: !!c.containerLoot, opened: !!c._wteWasOpened,
                     items: (c.itemArray || []).map(it => [it.itemId | 0, it.itemAmount | 0, it.etypeId === undefined ? -1 : it.etypeId | 0]) };
        },
        applyContainer(i, p) {
            if (!window.$gameContainers || !Array.isArray($gameContainers._containers)) return;
            if (FirstTime.personalCont(i) && !FirstTime.writing) return;       // another player's buried treasure is not mine
            const items = [];
            for (const [id, amount, et] of p.items) {
                if (!isInt(id, 1, 99999) || !isInt(amount, 1, 1e7) || !isInt(et, -1, 99)) continue;
                const db = et === -1 ? $dataItems : et === 1 ? $dataWeapons : $dataArmors, d = db && db[id];
                if (!d) continue;
                const etypeId = et === -1 ? undefined : et;
                items.push(Object.assign({}, d, { itemId: id, itemAmount: amount, name: d.name, iconIndex: d.iconIndex, etypeId, description: d.description,
                    itemWeight: d.meta && d.meta.itemWeight, itypeId: d.itypeId, categories: $gameContainers.changeDefaultCategories(d.categories), meta: d.meta }));
            }
            const cur = $gameContainers._containers[i - 1] || {};
            $gameContainers._containers[i - 1] = Object.assign(cur, { name: String(p.name || cur.name || ''), maxStorage: p.max > 0 ? p.max : Infinity,
                itemArray: items, storageIconId: Number(p.icon) || 0, containerLoot: !!p.loot, _wteWasOpened: !!p.opened });
        },
        sendContainer(i) {
            if (FirstTime.personalCont(i)) return;                             // my own buried treasure (decision 69)
            const c = window.$gameContainers && $gameContainers._containers[i - 1];
            if (c) this.emit('cont', { i, c: this.packContainer(c) });
        },
        lockHolder(i) { const l = this.locks[i]; return l && l.by !== Net.selfId ? l : null; },
        /** Host: grant/release a container lock and tell everyone. */
        hostLock(i, on, by, name) {
            const l = this.locks[i];
            if (on) { if (l && l.by !== by && (l.by === Net.selfId || Net.peers.has(l.by))) return false; this.locks[i] = { by, name }; }
            else if (l && l.by === by) delete this.locks[i];
            Net.broadcast({ t: 'WB', op: 'locks', locks: this.locks });
            return true;
        },
        releaseAllOf(by) { let any = false; Object.keys(this.locks).forEach(i => { if (this.locks[i].by === by) { delete this.locks[i]; any = true; } }); if (any) Net.broadcast({ t: 'WB', op: 'locks', locks: this.locks }); },
        lock(i, on) {
            if (!this.active()) return;
            if (Net.isHost) this.hostLock(i, on, Net.selfId, hostName(Net));
            else Net.send(Net.hostId, { t: 'W', op: 'lock', i, on: on ? 1 : 0 });
        },
        /** The full set of shared object state a newcomer needs beyond the world snapshot: current locks. */
        snapshotFor(to) { Net.send(to, { t: 'WB', op: 'locks', locks: this.locks }); },
        // ---- placement preview ("ghost"): others see what you are about to place, and where ----
        lastGhost: 'null', lastGhostAt: 0,
        reset() { this.locks = {}; this.pendingSpawn = []; this.pendingRemove = []; this.lastMove.clear(); this.removedUid.clear(); this.lastGhost = 'null'; this.openId = 0; this.selfQ.clear(); this.spQ = []; },
        tickGhost(now) {
            if (!this.active()) return;
            const sc = SceneManager._scene, sp = $gameTemp._epSpawned, item = $gameTemp._epPlacementItemId;
            const on = !!(sc && sc.pIsEPMode && sc.pIsEPMode() && sp && isInt(item, 0, 9999));
            const g = on ? { m: $gameMap.mapId(), item, x: Math.round(sp.x), y: Math.round(sp.y), d: [2, 4, 6, 8].includes(sp.direction()) ? sp.direction() : 2,
                             cn: String(sp.characterName() || '').slice(0, 96), ci: sp.characterIndex() | 0, pt: sp.pattern() | 0, tile: sp.tileId() | 0 } : null;   // the exact frame shown
            const key = JSON.stringify(g);
            if (key === this.lastGhost || (g && now - this.lastGhostAt < 80)) return;
            this.lastGhost = key; this.lastGhostAt = now;
            if (Net.isHost) Net.broadcast({ t: 'GHOSTS', id: Net.selfId, g });
            else Net.send(Net.hostId, { t: 'GHOST', g });
        },
        validGhost(g) {
            return g === null || (!!g && isInt(g.m, 1, 9999) && isInt(g.item, 0, 9999) && isInt(g.x, -1, 999) && isInt(g.y, -1, 999) && [2, 4, 6, 8].includes(g.d)
                && (g.cn === undefined || (typeof g.cn === 'string' && g.cn.length <= 96 && isInt(g.ci, 0, 7) && isInt(g.pt, 0, 15) && isInt(g.tile, 0, 99999))));
        },
        applyGhost(id, g) {
            const p = Net.peers.get(id);
            if (!p || !this.validGhost(g)) return;
            if (g && !p.ghostChar && GhostChar) p.ghostChar = new GhostChar();
            if (p.ghostChar) p.ghostChar.ghost(g);
        }
    };

    // =====================================================================
    // 7f. SHARED RESOURCES AND CROPS (GALV_EventSpawner, SpawnEventCommands, CGMZ_EventClone(_Dynamic), CropGrowthSystem)
    //     - A map's spawned resources are rolled by its RESOURCE SPAWNER event (page 0 clears the map with
    //       EraseAllMap and re-rolls when its self variable 24 is 0; CE18 resets those after a rest/new week).
    //       Each game used to roll its own random set. Now one set per map is the host's: before a spawner
    //       rolls, the game asks the host. The host answers with its set (already rolled), lets that player
    //       roll and send the result up (nobody rolled it yet), or makes them wait while someone else rolls.
    //       Everyone gets the same events with the same event ids.
    //     - During play: a saved spawn (CE2244 etc.) and an unspawn (mining, picking up, CE2250/CE2158) reach everyone.
    //     - Self switches / self variables / crop type (dynamic clone) of spawned events and of the farm's
    //       plot events are shared (World scope, §2.1), so a crop is watered, grows and is harvested for everyone.
    //     - Crop growth: UpdateCrop's 50% roll for an unwatered day uses a seed from the plot and the day, so
    //       every game computes the same growth.
    // =====================================================================
    const Spawns = {
        CLONES: new Set([124, 215, 216, 253, 257, 191, 192, 193, 196, 198, 200]),   // plots, wheat, mutant pumpkin, corn-maze crate
        LOCK_MS: 30000, ASK_MS: 15000,
        rolling: 0,                   // the map this game is rolling right now (its single spawns are not sent one by one)
        applying: false,
        locks: new Map(),             // host: map -> { by: peer id or 'host', at }
        waiting: new Map(),           // map -> this game's spawner waiting for the host's answer
        remapped: new Map(),          // host: 'peer|map|event' -> the id that player's spawn got here (until they hear it)
        moved: new Map(),             // joiner: "map,event" of my own spawn that had to make room -> its new id here
        cloneCache: new Map(),
        active() { return WorldObjects.active(); },
        saved(m) { const s = window.$gameMap && $gameMap._savedSpawnedEvents; if (!s) return {}; return s[m] || (s[m] = {}); },
        isSpawnerList(list) {
            if (!Array.isArray(list)) return false;
            if (list._coopSpawner === undefined) {
                Object.defineProperty(list, '_coopSpawner', { value: list.some(c => c && ((c.code === 357 && c.parameters[0] === 'SpawnEventCommands' && c.parameters[1] === 'EraseAllMap') ||
                    (c.code === 357 && c.parameters[0] === 'Ritter_EventSpawner' && c.parameters[1] === 'UnspawnAll') || (c.code === 355 && /Galv\.SPAWN\.clear\(/.test(c.parameters[0])))), enumerable: false });
            }
            return list._coopSpawner;
        },
        /** Most spawners start with "if self variable 24 = 0": they only roll after a reset. */
        wantsRoll(list, m, e) {
            const c = list[0];
            if (c && c.code === 111 && c.parameters[0] === 1 && c.parameters[1] === 24 && c.parameters[4] === 0 && c.parameters[3] === 0) return $gameVariables.selfValue([m, e, 24]) === 0;
            return true;
        },
        /** The farm's and the ranch's work events (plots, water spots, storage; animals, troughs, coop, eggs), from the map
         *  files: everyone tends the same farm, like Stardew's farmhands. Story/NPC events there stay per player. */
        FARM_RULES: { 34: /^(Water Spot|Storage)/, 50: /^(Animal|Trough|Gemflower|Treasure|EGG SPAWNER)/ },
        farmIds: null,
        /** Is event e of map m personal, on any map (the current one from memory, others from their map file)? */
        personalMaps: new Map(),
        personalAny(m, e) {
            if (window.$gameMap && m === $gameMap.mapId() && this.mapData(m)) return this.personalEvent(m, e);
            if (Scenes.TUTORIAL_MAPS.includes(m) || Scenes.OPENING.maps.includes(m)) return true;
            if (!this.personalMaps.has(m)) {
                const ids = new Set();
                try {
                    const fsm = P2P.nodeRequire('fs'), pth = P2P.nodeRequire('path'), base = pth.dirname(process.mainModule.filename);
                    const data = JSON.parse(fsm.readFileSync(pth.join(base, 'data', 'Map' + String(m).padStart(3, '0') + '.json'), 'utf8'));
                    (data.events || []).forEach(d => { if (d && this.isPersonal(d)) ids.add(d.id); });
                } catch (err) { /* no such map here */ }
                this.personalMaps.set(m, ids);
            }
            return this.personalMaps.get(m).has(e);
        },
        farmEvent(m, e) {
            if (!this.farmIds) {
                this.farmIds = new Map();
                try {
                    const fsm = P2P.nodeRequire('fs'), pth = P2P.nodeRequire('path'), base = pth.dirname(process.mainModule.filename);
                    Object.keys(this.FARM_RULES).forEach(k => {
                        const data = JSON.parse(fsm.readFileSync(pth.join(base, 'data', 'Map' + String(k).padStart(3, '0') + '.json'), 'utf8')), ids = new Set();
                        (data.events || []).forEach(ev => {
                            if (!ev) return;
                            const r = /<cgmzclone:(\d+)>/i.exec(ev.note || '');
                            if (this.FARM_RULES[k].test(ev.name || '') || (r && this.CLONES.has(Number(r[1])))) ids.add(ev.id);
                        });
                        this.farmIds.set(Number(k), ids);
                    });
                } catch (err) { Diag.log('warn', 'farm events could not be read: ' + (err.message || err)); }
            }
            const s = this.farmIds.get(m);
            return !!s && s.has(e);
        },
        /** A world object a player changes by using it: it changes its own state or disappears (doors, chests, mimics,
         *  journals, crystals, gates, bosses...). Never a person or anyone who talks: talk stays each player's own. */
        isObject(d) {
            if (!d || !Array.isArray(d.pages) || this.NPC_NAMES.test(d.name || '')) return false;
            if (this.bundleUser(d)) return true;       // an Art Gallery painting: its Void bundle's progress is in its own self variables

            if (d.pages.some(p => { const n = String(p.image.characterName || ''); return n && !/(^|\/)!/.test(n); })) return false;
            if (d.pages.some(p => p.list.some(c => c.code === 101 && String(c.parameters[4] || '').trim()))) return false;
            const selfVar = id => { const n = window.$dataSystem && $dataSystem.variables[id]; return !!n && n.includes('SV:'); };
            return d.pages.some(p => [0, 1, 2].includes(p.trigger) && p.list.some(c => c.code === 123 || c.code === 214 || (c.code === 122 && selfVar(c.parameters[0]))));
        },
        /** A map event that opens one of WTE's Void bundles (calls an event that runs "Run Bundle Menu"). The bundle's
         *  progress is written by script into that event's self variables, so it is a world object like a chest: what
         *  one player gives counts for everyone (user, 2026-11-01). Found from the data, so new bundles count too. */
        bundleUser(d) {
            if (!this.bundleCEs) {
                const ces = window.$dataCommonEvents || [], menus = new Set();
                ces.forEach(c => { if (c && /^Run Bundle Menu/i.test(c.name || '')) menus.add(c.id); });
                this.bundleCEs = new Set();
                ces.forEach(c => { if (c && c.list.some(x => x.code === 117 && menus.has(x.parameters[0]))) this.bundleCEs.add(c.id); });
            }
            return !!this.bundleCEs.size && d.pages.some(p => (p.list || []).some(c => c.code === 117 && this.bundleCEs.has(c.parameters[0])));
        },
        objCache: new Map(),
        /** A world object that is not also a find, plot or spawn: only a player's own use of it is shared. */
        objectOnly(m, e) {
            if (!window.$gameMap || m !== $gameMap.mapId() || e >= 1000 || this.personalEvent(m, e)) return false;
            const k = m + ',' + e;
            if (!this.objCache.has(k) && !this.mapData(m)) return false;     // not this map's data yet: never cache a guess (decision 90)
            if (!this.objCache.has(k)) {
                const d = window.$dataMap && $dataMap.events[e], r = d && /<cgmzclone:(\d+)>/i.exec(d.note || '');
                this.objCache.set(k, !!d && !(r && this.CLONES.has(Number(r[1]))) && !this.isFind(d) && this.isObject(d));
            }
            return this.objCache.get(k);
        },
        // A world object is sent as its final state after a player used it, never step by step: an item's "taken" step
        // starts its own reward page (autorun), which must only run in the game of the player who took it.
        objTouched: new Map(), objDirty: new Map(),
        touchObject(ev) { if (ev && this.objectOnly(ev._mapId, ev._eventId)) this.objTouched.set(ev._mapId + ',' + ev._eventId, Date.now()); },
        /** A self switch/variable of a world object changed here: true = it is handled here (sent later, as a whole). */
        objectChanged(m, e) {
            if (!this.objectOnly(m, e)) return false;
            const k = m + ',' + e, at = this.objTouched.get(k);
            if (at && Date.now() - at < 120000) this.objDirty.set(k, Date.now());   // my use of it (and what its own pages did after)
            return true;
        },
        flushObjects(now, force) {
            if (!this.objDirty.size || !window.$gameMap) return;
            const it = $gameMap._interpreter;
            this.objDirty.forEach((last, k) => {
                const [m, e] = k.split(',').map(Number);
                if (m === $gameMap.mapId()) {
                    const ev = $gameMap.event(e);
                    if ((it && it.isRunning() && it.eventId() === e) || (ev && ((ev._interpreter && ev._interpreter.isRunning()) || ev.isStarting()))) return;   // still in use
                }
                if (!force && now - last < 500) return;                      // its next page may be about to start
                this.objDirty.delete(k);
                WorldObjects.emit('obj', { m, e, st: this.selfOf(m, e) });   // st, not s: s is the message envelope's
            });
        },
        applyObject(m) {
            this.writeSelf(m.m, m.e, m.st);
            if (this.onMap(m.m)) { this.wake($gameMap.event(m.e)); $gameMap.requestRefresh(); }
        },
        /** A personal event: part of each player's own story (decision 49). A page waits on or sets one of the player's own
         *  values (a quest, a task, mail, a scene seen), or it hands out a personal item (a quest key, a tool). Every player
         *  gets their own: never shared, never locked, its monsters fight only whoever has it. */
        personalCache: new Map(),
        /** The loaded map data, only if it is map m's own (decision 90: just after a join it can still be another map's). */
        mapData(m) { const d = window.$dataMap; return d && d.events && d._coopMapId === m ? d : null; },
        personalEvent(m, e) {
            if (!window.$gameMap || m !== $gameMap.mapId() || e >= 1000) return false;
            if (Scenes.TUTORIAL_MAPS.includes(m) || Scenes.OPENING.maps.includes(m)) return true;   // each player's own tutorial: its items, cultists, doors
            if (!this.mapData(m)) return this.personalAny(m, e);           // not this map's data (yet): its map file
            const k = m + ',' + e;
            if (!this.personalCache.has(k)) this.personalCache.set(k, this.isPersonal(window.$dataMap && $dataMap.events[e]));
            return this.personalCache.get(k);
        },
        /** A cutscene a player walks into or presses (it hides the HUD, freezes the player, or switches other events
         *  itself, like the new game's yard intro opening the yard): everyone plays it in their own game. Shared, the
         *  first player's "done" would leave the others without the scene and with the yard still closed. */
        isSceneTrigger(d) {
            return d.pages.some(p => [0, 1, 2].includes(p.trigger) && (p.list || []).some(c => (c.code === 357 && ((c.parameters[0] === 'SRD_HUDMakerUltra' && c.parameters[1] === 'Set HUD Visibility' && /false/i.test(JSON.stringify(c.parameters[3])))
                || (c.parameters[0] === 'DK_Disable_Player_Movement' && /Disable/.test(String(c.parameters[1]))))) || ((c.code === 355 || c.code === 655) && /\$gameSelfSwitches\.setValue\(/.test(String(c.parameters[0])))));
        },
        /** A festival's own events (a page shows only on that day): the doors to knock on, the game booths, the offering,
         *  the contest and its judging. Every player does them themselves, like Stardew's festival activities (decision 53). */
        FESTIVAL_SWITCHES: [1128, 1129, 1130, 1131, 1141, 945],   // All Hallows' Eve, Harvest Festival, "Egg" Festival, Carnival of Souls, the Egg Hunt, Fishing Contest day
        festivalPage(p) { const c = p.conditions || {}; return (c.switch1Valid && this.FESTIVAL_SWITCHES.includes(c.switch1Id)) || (c.switch2Valid && this.FESTIVAL_SWITCHES.includes(c.switch2Id)); },
        /** A festival page a player uses (talks to, presses, walks into) that does something. A page that only hides the
         *  event on festival days (an ordinary sign, a find, a stand moved aside) does not make it personal: its item
         *  is still taken once for everyone. */
        festivalActivity(p) { return this.festivalPage(p) && [0, 1, 2].includes(p.trigger) && (p.list || []).some(c => c && ![0, 108, 408].includes(c.code)); },
        isPersonal(d) {
            if (!d || !Array.isArray(d.pages)) return false;
            if (Mysteries.event(d)) return true;                                   // a mystery: each player's own, once a day (decision 71)
            const S = CFG.playerSwitches, V = CFG.playerVars, span = (a, b, set) => { for (let i = a; i <= b && i - a < 500; i++) if (set.has(i)) return true; return false; };
            if (this.isSceneTrigger(d)) return true;
            if (d.pages.some(p => this.festivalActivity(p))) return true;
            return d.pages.some(p => {
                const c = p.conditions || {};
                if ((c.switch1Valid && S.has(c.switch1Id)) || (c.switch2Valid && S.has(c.switch2Id)) || (c.variableValid && V.has(c.variableId))) return true;
                return (p.list || []).some(x => (x.code === 121 && span(x.parameters[0], x.parameters[1], S)) || (x.code === 122 && span(x.parameters[0], x.parameters[1], V))
                    || (x.code === 126 && x.parameters[1] === 0 && Progress.personalItem(window.$dataItems && $dataItems[x.parameters[0]])));
            });
        },
        /** Is this event's state World (shared)? Saved spawns, plot clones, farm/ranch work events. Placed objects are WorldObjects'. */
        sharedEvent(m, e) {
            if (this.personalEvent(m, e)) return false;
            if (e < 1000 && this.farmEvent(m, e)) return true;
            if (!window.$gameMap || m !== $gameMap.mapId()) return false;
            const ev = $gameMap._events[e];
            if (!ev || WorldObjects.isPlaced(ev)) return false;
            if (ev.isSpawnEvent) return !!ev.isSavedEvent;
            const k = m + ',' + e;
            if (!this.cloneCache.has(k) && !this.mapData(m)) return false;   // not this map's data yet: never cache a guess (decision 90)
            if (!this.cloneCache.has(k)) {
                const d = window.$dataMap && $dataMap.events[e], r = d && /<cgmzclone:(\d+)>/i.exec(d.note || '');
                this.cloneCache.set(k, (!!r && this.CLONES.has(Number(r[1]))) || this.isFind(d) || this.isObject(d));
            }
            return this.cloneCache.get(k);
        },
        /** A one-time find placed in the map: a player's own action on it gives items (garbage cans, chests, mud,
         *  branches, stones, shrines, items lying around). Found once = gone for everyone. People are not finds: an
         *  NPC's gift stays each player's own. */
        NPC_NAMES: /\(|^(Sam|Alice|Edwin|Ellie|Rachel|Brian|Manager John|Cat$|Molly|Celeste|Josh|Jacob|Sarah|Guy|Shopper|Emissary|DevilChild|Pumpkid|Akira|Adrian|Earl|Art|Professor|Jenna|Blorph|Mall Admin|Season Tester|Crow|Henrietta|Tanner|Mayor|Imposter)\b/i,
        giveCEs: null,
        FIND_CES: [2290],
        SEEDED_CES: [2291],           // the egg's daily "is it here today?" roll: seeded per egg and day, so every game agrees             // the Egg Hunt's "Egg" (smash it: its item, once, for whoever smashed it; decision 53)
        isFind(d) {
            if (!d || !Array.isArray(d.pages) || this.NPC_NAMES.test(d.name || '')) return false;
            if (!this.giveCEs) {
                this.giveCEs = new Set();
                (window.$dataCommonEvents || []).forEach(c => { if (c && c.list.some(x => [126, 127, 128].includes(x.code) && x.parameters[1] === 0)) this.giveCEs.add(c.id); });
                this.FIND_CES.forEach(id => this.giveCEs.add(id));
            }
            const person = d.pages.some(p => { const n = String(p.image.characterName || ''); return n && !/(^|\/)!/.test(n); });
            if (person) return false;
            return d.pages.some(p => [0, 1, 2].includes(p.trigger) && p.list.some(c => ([126, 127, 128].includes(c.code) && c.parameters[1] === 0)
                || (c.code === 117 && this.giveCEs.has(c.parameters[0])) || ((c.code === 355 || c.code === 655) && /gainItem/.test(c.parameters[0]))));
        },
        // ---- one event's World state ----
        selfOf(m, e) {
            const ss = ['A', 'B', 'C', 'D'].filter(c => $gameSelfSwitches.value([m, e, c]) && !FirstTime.personal(m, e, c)).join('');
            const sv = {}, pre = m + ',' + e + ',', data = $gameVariables._selfData || {};
            if (!Mysteries.spawnedHere(m, e)) Object.keys(data).forEach(k => { if (k.startsWith(pre) && typeof data[k] === 'number' && !FirstTime.ownSv(m, e, k.slice(pre.length))) sv[k.slice(pre.length)] = data[k]; });
            const dc = $gameSystem.cgmzGetDynamicClone ? $gameSystem.cgmzGetDynamicClone(m, e) : null;
            return { ss, sv, dc: dc || 0 };
        },
        clearSelf(m, e) {
            ['A', 'B', 'C', 'D'].forEach(c => { if (!FirstTime.personal(m, e, c)) delete $gameSelfSwitches._data[m + ',' + e + ',' + c]; });
            const pre = m + ',' + e + ',', data = $gameVariables._selfData || {};
            if (!Mysteries.spawnedHere(m, e)) Object.keys(data).forEach(k => { if (k.startsWith(pre) && !FirstTime.ownSv(m, e, k.slice(pre.length))) delete data[k]; });
            if ($gameSystem.cgmzClearDynamicClone) $gameSystem.cgmzClearDynamicClone(m, e);
        },
        writeSelf(m, e, s) {
            this.clearSelf(m, e);
            if (!s) return;
            String(s.ss || '').split('').forEach(c => { if (/^[A-D]$/.test(c) && !FirstTime.personal(m, e, c)) $gameSelfSwitches._data[m + ',' + e + ',' + c] = true; });
            if (!Mysteries.spawnedHere(m, e)) Object.keys(s.sv || {}).forEach(v => { if (isInt(Number(v), 1, 9999) && !FirstTime.ownSv(m, e, v) && isNum(s.sv[v], -1e9, 1e9)) $gameVariables._selfData[m + ',' + e + ',' + v] = s.sv[v]; });
            if (s.dc && $gameSystem.cgmzSetDynamicClone) $gameSystem.cgmzSetDynamicClone(m, e, s.dc);
        },
        /** A map's spawned set (+ the spawner's own self variables), as sent between games. */
        pack(m, spawners) {
            const ev = [], self = {}, own = {};
            Object.values(this.saved(m)).forEach(d => {
                const e = Number(d.eId);
                if (!isInt(e, 1, 99999)) return;
                ev.push([e, d.id, d.x, d.y]);
                self[e] = this.selfOf(m, e);
            });
            (spawners || []).forEach(e => { own[e] = this.selfOf(m, e).sv; });
            return { ev, self, own };
        },
        validSet(s) {
            return !!s && Array.isArray(s.ev) && s.ev.length <= 3000 && s.ev.every(r => Array.isArray(r) && isInt(r[0], 1, 99999) && isInt(r[1], 1, 19999) && isInt(r[2], 0, 999) && isInt(r[3], 0, 999))
                && !!s.self && typeof s.self === 'object' && !!s.own && typeof s.own === 'object';
        },
        /** This map is loaded here (its data too: a set can arrive while a joiner is still loading the world). */
        onMap(m) { return !!window.$gameMap && $gameMap.mapId() === m && !!window.$dataMap && $dataMap.width > 0 && !(window.$gamePlayer && $gamePlayer.isTransferring()); },
        spriteset() { const sc = SceneManager._scene; return sc instanceof Scene_Map && sc._spriteset ? sc._spriteset : null; },
        /** Put a saved spawned event into this game (data always; the event and its sprite when the map is open). */
        create(m, e, id, x, y, self) {
            this.saved(m)[e] = { id, x, y, eId: e };
            this.writeSelf(m, e, self);
            if (!this.onMap(m) || typeof Game_SpawnEvent === 'undefined' || !this.template(id)) return;
            const cur = $gameMap._events[e];
            if (cur && !(cur.isSpawnEvent && cur.isSavedEvent)) this.makeRoom(m, e);       // a temporary spawn of mine: moved aside
            else if (cur) this.dropEvent(e);
            const ev = $gameMap._events[e] = new Game_SpawnEvent(m, e, x, y, id, true);
            ev.locate(x, y); ev.refresh();
            const ss = this.spriteset(); if (ss) ss.createSpawnEvent(e);
        },
        /** WTE bakes still objects (forage, rocks) into the map picture and puts far ones to sleep (WTE_SpriteBaker,
         *  Simple_AntiLag); their own pickup unbakes them first. A change from another player has to do the same, or the
         *  old picture stays on the map (an item that looks untouched, or still there after it was taken). */
        wake(ev) {
            if (!ev) return;
            if (typeof ev.wteUnbake === 'function') ev.wteUnbake();
            ev._wteWakeTimer = 15; ev._wteIsFrozen = false; ev._wtePendingRefresh = false;
            ev.refresh();
        },
        /** WTE's action indicator (GALV) points at the event in front of the player: let go of it before it disappears. */
        forgetTarget(e) {
            const t = window.$gamePlayer && $gamePlayer.actionIconTarget;
            if (t && t.eventId === e) { t.eventId = 0; t.iconId = 0; if (typeof Galv !== 'undefined' && Galv.AI) Galv.AI.needRefresh = true; }
        },
        dropEvent(e) {
            if (!$gameMap._events[e]) return;
            this.forgetTarget(e);
            if (typeof $gameMap._events[e].wteUnbake === 'function') $gameMap._events[e].wteUnbake();   // its baked picture goes too
            $gameMap._events[e] = null;
            const ss = this.spriteset(); if (ss) ss.unspawnEvent(e);
        },
        remove(m, e) {
            delete this.saved(m)[e];
            this.clearSelf(m, e);
            if (this.onMap(m)) this.dropEvent(e);
        },
        freeId(m) {
            const sv = this.saved(m);
            let e = Math.max(1000, this.onMap(m) ? $gameMap._events.length : 1000);
            while ((this.onMap(m) && $gameMap._events[e]) || sv[e]) e++;
            return e;
        },
        /** Re-number one of this game's spawned events (its id is needed for someone else's). */
        makeRoom(m, e) {
            const to = this.freeId(m), d = this.saved(m)[e], self = this.selfOf(m, e), ev = this.onMap(m) ? $gameMap._events[e] : null;
            if (ev) { $gameMap._events[to] = ev; ev._eventId = to; $gameMap._events[e] = null; }
            if (d) { delete this.saved(m)[e]; d.eId = to; this.saved(m)[to] = d; }
            this.clearSelf(m, e); this.writeSelf(m, to, self);
            this.moved.set(m + ',' + e, to);
            return to;
        },
        /** Replace this game's set for a map with one from another game. */
        applySet(m, s, spawners) {
            if (!this.validSet(s)) return Diag.log('warn', 'shared spawns: a damaged set for map ' + m + ' was ignored');
            this.applying = true;
            try {
                const want = new Map(s.ev.map(r => [r[0], r])), cur = this.saved(m);
                Object.keys(cur).forEach(k => {                            // gone, or different: removed first
                    const e = Number(k), d = cur[k], r = want.get(e);
                    if (!r || r[1] !== d.id || r[2] !== d.x || r[3] !== d.y) this.remove(m, e);
                });
                s.ev.forEach(r => {
                    const [e, id, x, y] = r, d = cur[e];
                    if (d && this.onMap(m) && $gameMap._events[e]) { this.writeSelf(m, e, s.self[e]); this.wake($gameMap._events[e]); }   // same event: its state only
                    else this.create(m, e, id, x, y, s.self[e]);
                });
                Object.keys(s.own).forEach(k => {                          // the spawner's own self variables (24 = rolled)
                    const e = Number(k), sv = s.own[k];
                    if (!isInt(e, 1, 99999) || !sv || typeof sv !== 'object') return;
                    const pre = m + ',' + e + ',', data = $gameVariables._selfData;
                    Object.keys(data).forEach(x => { if (x.startsWith(pre)) delete data[x]; });
                    Object.keys(sv).forEach(v => { if (isInt(Number(v), 1, 9999) && isNum(sv[v], -1e9, 1e9)) data[pre + v] = sv[v]; });
                });
                if (this.onMap(m)) $gameMap.requestRefresh();
            } catch (e) { Diag.err('shared spawns (map ' + m + ')', e); }
            finally { this.applying = false; }
        },
        // ---- the roll gate (Game_Interpreter.setup/update) ----
        onSetup(interp, list, eventId) {
            if (interp._coopSpawn) this.finish(interp);
            if (!this.active() || !eventId || !this.isSpawnerList(list) || !window.$gameMap) return;
            const m = $gameMap.mapId(), e = eventId;
            if (!this.wantsRoll(list, m, e)) return;
            const g = interp._coopSpawn = { m, e, state: 'ask', at: Date.now() };
            this.waiting.set(m, g);
            if (Net.isHost) this.hostWants(g);
            else Net.send(Net.hostId, { t: 'SPQ', m, e, roll: 1 });
        },
        /** Called before the interpreter's update: false = wait this frame. */
        canRun(interp) {
            const g = interp._coopSpawn;
            if (!g) return true;
            if (g.state === 'skip') { if (this.waiting.get(g.m) === g) this.waiting.delete(g.m); interp._coopSpawn = null; interp._list = null; interp._index = 0; return false; }   // another game's roll was used
            if (g.state === 'ask' || g.state === 'wait') {
                if (Net.isHost) this.hostWants(g);
                else if (Date.now() - g.at > this.ASK_MS) { Diag.log('warn', 'shared spawns: no answer for map ' + g.m + ', rolling here'); this.go(g); }
                return g.state === 'go' || g.state === 'run';
            }
            return true;
        },
        go(g) { g.state = Net.isHost ? 'run' : 'go'; this.rolling = g.m; },
        /** The spawner list ended (or was replaced). */
        finish(interp) {
            const g = interp._coopSpawn; interp._coopSpawn = null;
            if (!g) return;
            if (this.waiting.get(g.m) === g) this.waiting.delete(g.m);
            if (this.rolling === g.m) this.rolling = 0;
            if (!this.active()) return;
            if (g.state === 'go') Net.send(Net.hostId, { t: 'SPUP', m: g.m, e: g.e, set: this.pack(g.m, [g.e]) });
            else if (g.state === 'run') {
                const l = this.locks.get(g.m); if (l && l.by === 'host') this.locks.delete(g.m);
                Net.broadcast({ t: 'SPSET', m: g.m, e: g.e, set: this.pack(g.m, [g.e]) });
            }
        },
        // ---- host side ----
        lockOf(m) {
            const l = this.locks.get(m);
            if (l && (Date.now() - l.at > this.LOCK_MS || (l.by !== 'host' && !Net.peers.has(l.by)))) { this.locks.delete(m); return null; }
            return l || null;
        },
        /** A spawned event's template: the spawn map's, or (10000 and up, decision 91) the placeables map's. */
        template(id) {
            if (id >= 10000) return typeof window.WTE_ExecuteSurrogate === 'function' && window.$dataEPEventsMap && $dataEPEventsMap.events ? $dataEPEventsMap.events[id - 10000] || null : null;
            return window.$dataSpawnMap && $dataSpawnMap.events ? $dataSpawnMap.events[id] || null : null;
        },
        /** The blank stand-in WTE_GalvConverter spawns while converting a piece of furniture (it becomes the furniture a
         *  moment later, in WTE_ExecuteSurrogate): the finished piece is what the others get. */
        surrogate(id) { return !!window.$gameTemp && !!$gameTemp._wtePayload && Number(id) === (Number($gameTemp._wteBlankEventId) || 0) + 10000; },
        rolled(m, e) { return $gameVariables.selfValue([m, e, 24]) !== 0; },
        hostWants(g) {
            if (g.state !== 'ask' && g.state !== 'wait') return;
            if (this.rolled(g.m, g.e)) { g.state = 'skip'; return; }           // a joiner's roll arrived meanwhile
            const l = this.lockOf(g.m);
            if (l && l.by !== 'host') { g.state = 'wait'; return; }
            this.locks.set(g.m, { by: 'host', at: Date.now() });
            this.go(g);
        },
        /** A joiner entered a map (roll = 0) or its spawner wants to roll (roll = 1). */
        hostQuery(from, m, e, roll) {
            const sendSet = () => Net.send(from, { t: 'SPSET', m, e, set: this.pack(m, e ? [e] : []) });
            if (!roll) return sendSet();
            if (this.rolled(m, e)) return sendSet();
            const l = this.lockOf(m);
            if (l && l.by !== from) return;                                    // someone is rolling it: everyone gets that set
            this.locks.set(m, { by: from, at: Date.now() });
            Net.send(from, { t: 'SPGO', m });
        },
        hostUpload(from, m, e, set) {
            const l = this.lockOf(m);
            if (l && l.by !== from) return;
            this.locks.delete(m);
            this.applySet(m, set, [e]);
            Net.broadcast({ t: 'SPSET', m, e, set }, from);
        },
        // ---- single changes during play ----
        emit(op, data) { if (!this.applying && !this.rolling) WorldObjects.emit(op, data); },
        queueSpawn(x) { if (!this.applying && !this.rolling && WorldObjects.active()) WorldObjects.spQ.push(Object.assign(x, { a: this.inAuto() ? 1 : 0 })); },
        // ---- the map's authority: only one game makes a map's automatic changes ----
        stack: [],                    // interpreters updating right now (innermost last)
        autoLists: null,
        isAutomatic(list, eventId) {
            if (eventId > 0) { const ev = window.$gameMap && $gameMap.event(eventId); return !!ev && (ev._trigger === 3 || ev._trigger === 4) && ev.list() === list; }
            if (!this.autoLists) { this.autoLists = new Set(); (window.$dataCommonEvents || []).forEach(c => { if (c && c.trigger > 0) this.autoLists.add(c.list); }); }
            return this.autoLists.has(list);
        },
        inAuto() { const top = this.stack[this.stack.length - 1]; return !!(top && top._coopAuto); },
        /** The host when it is on this map, otherwise the lowest-numbered player there (Stardew-style location authority). */
        authority(m) {
            if (Net.isHost) return true;
            let best = Net.slot, hostHere = false;
            Net.peers.forEach(p => { const s = p.state; if (!s || s.map !== m) return; if (p.slot === 0) hostHere = true; else if (p.slot < best) best = p.slot; });
            return !hostHere && best === Net.slot;
        },
        /** A map event (not a player) changed something on this map, and another game is the map's authority. */
        quiet(m) { return this.active() && !this.applying && !this.rolling && this.inAuto() && this.onMap(m) && !this.authority(m); },
        suppressed(m) { return this.quiet(m); },
        /** Apply a single spawn. Returns the id it got here (the host may give it a new one). */
        applySpawn(m) {
            const sv = this.saved(m.m), d = sv[m.e];
            const same = d && d.id === m.id && d.x === m.x && d.y === m.y;
            if (same) return m.e;
            let e = m.e;
            const taken = !!d || (this.onMap(m.m) && !!$gameMap._events[e]);
            if (taken) {
                if (Net.isHost) e = this.freeId(m.m);                          // the host keeps its own; the newcomer moves
                else this.makeRoom(m.m, e);                                    // mine is not confirmed yet: it moves
            }
            this.applying = true;
            try { this.create(m.m, e, m.id, m.x, m.y, m.self || null); } finally { this.applying = false; }
            if (this.onMap(m.m)) $gameMap.requestRefresh();
            return e;
        },
        applyUnspawn(m) {
            const d = this.saved(m.m)[m.e];
            if (!d || d.id !== m.id) return Diag.log('info', 'picked up elsewhere: map ' + m.m + ' event ' + m.e + ' (kind ' + m.id + ') is not here (' + (d ? 'kind ' + d.id : 'none') + ')');
            this.applying = true;
            try { this.remove(m.m, m.e); } finally { this.applying = false; }
            Diag.log('info', 'picked up by another player: map ' + m.m + ' event ' + m.e + ' (kind ' + m.id + ')');
        },
        /** A map-placed find that removed itself with Erase Event (WTE's items lying around): gone here too. */
        applyErase(m) {
            const ev = this.onMap(m.m) && $gameMap.event(m.e);
            if (!ev || ev._erased) return;
            this.applying = true;
            try { this.forgetTarget(m.e); if (typeof ev.wteUnbake === 'function') ev.wteUnbake(); ev.erase(); } finally { this.applying = false; }
            Diag.log('info', 'taken by another player: map ' + m.m + ' event ' + m.e);
        },
        /** The host gave my spawn a different id (someone else had that one). */
        applyMove(m) {
            const from = this.moved.get(m.m + ',' + m.from) || m.from;
            this.moved.delete(m.m + ',' + m.from);
            if (from === m.to) return;
            const d = this.saved(m.m)[from];
            if (!d) return;
            this.applying = true;
            try {
                if (this.saved(m.m)[m.to] || (this.onMap(m.m) && $gameMap._events[m.to])) this.makeRoom(m.m, m.to);
                const self = this.selfOf(m.m, from), ev = this.onMap(m.m) ? $gameMap._events[from] : null;
                if (ev) { $gameMap._events[m.to] = ev; ev._eventId = m.to; $gameMap._events[from] = null; }
                delete this.saved(m.m)[from]; d.eId = m.to; this.saved(m.m)[m.to] = d;
                this.clearSelf(m.m, from); this.writeSelf(m.m, m.to, self);
            } finally { this.applying = false; }
        },
        applyClone(m) {
            this.applying = true;
            try {
                const ev = this.onMap(m.m) && $gameMap._events[m.e];
                if (ev && ev.setDynamicClone) { if (m.tp) ev.setDynamicClone(m.tp); else ev.revertDynamicClone(); }
                else if (m.tp) $gameSystem.cgmzSetDynamicClone(m.m, m.e, m.tp);
                else $gameSystem.cgmzClearDynamicClone(m.m, m.e);
            } finally { this.applying = false; }
        },
        /** Joiner: the host's answer for a map. */
        received(m, e, set) {
            if (this.rolling === m) return;                                    // my own roll for it is under way
            this.applySet(m, set, e ? [e] : []);
            if (set && Array.isArray(set.ev)) Diag.log('info', 'resources: map ' + m + ' has ' + set.ev.length + ' from the host');
            const g = this.waiting.get(m);
            if (g && g.state === 'ask' && e) g.state = 'skip';                // an answer about this spawner: its set is used, no roll here
        },
        granted(m) { const g = this.waiting.get(m); if (g && g.state === 'ask') this.go(g); },
        reset() { this.remapped.clear(); this.waiting.clear(); this.locks.clear(); this.moved.clear(); this.rolling = 0; this.cloneCache.clear(); this.objCache.clear(); this.personalCache.clear(); this.objTouched.clear(); this.objDirty.clear(); }
    };


    // ---- one floor for everyone (user, 2026-11-01): a mine floor has rooms (Mine1 F2: maps 45/38/46, F3: 47/48/49, Mine2
    //      F2: 120/121/122) and its ladder or door picks one by a world roll (V442, V443, V66) that changes at midnight.
    //      Someone still in yesterday's room would be alone on "the same" floor: going down while another player is in
    //      one of the floor's rooms takes you to theirs. Found in the event itself, so an update's new floors work too. ----
    const Floors = {
        /** The rooms a transfer could have picked: the event's other transfers chosen by a world variable to sibling maps. */
        rooms(interp, params) {
            const list = interp && interp._list; if (!Array.isArray(list) || params[0] !== 0) return null;
            if (!list.some(c => c.code === 111 && c.parameters[0] === 1 && CFG.sharedVars.has(c.parameters[1]))) return null;
            const info = window.$dataMapInfos || [], parent = m => info[m] ? info[m].parentId : -1;
            const out = list.filter(c => c.code === 201 && c.parameters[0] === 0).map(c => ({ m: c.parameters[1], x: c.parameters[2], y: c.parameters[3], d: c.parameters[4], f: c.parameters[5] }));
            const maps = new Set(out.map(r => r.m));
            if (maps.size < 2 || !maps.has(params[1]) || !out.every(r => parent(r.m) === parent(params[1]))) return null;
            return out;
        },
        /** The room other players are in now: the host's, else the one with the most players. */
        theirs(rooms) {
            const count = new Map(); let host = 0;
            Net.peers.forEach((p, id) => {
                const m = p && !p.loading && p.state && p.state.map;
                if (!m || !rooms.some(r => r.m === m)) return;
                count.set(m, (count.get(m) || 0) + 1); if (id === Net.hostId) host = m;
            });
            if (host) return host;
            let best = 0; count.forEach((n, m) => { if (!best || n > count.get(best)) best = m; }); return best;
        },
        /** Called for every Transfer Player: the transfer to use instead, or null. */
        pick(interp, params) {
            if (!Net.isPlaying() || !Net.peers.size) return null;
            const rooms = this.rooms(interp, params); if (!rooms) return null;
            const m = this.theirs(rooms); if (!m || m === params[1]) return null;
            const r = rooms.find(x => x.m === m);
            Diag.log('info', 'floor: the others are in room map ' + m + ' (the roll says map ' + params[1] + '): going to theirs');
            return [0, r.m, r.x, r.y, r.d, r.f];
        },
    };
    if (typeof Game_Interpreter !== 'undefined') {
        const _201floor = Game_Interpreter.prototype.command201;
        Game_Interpreter.prototype.command201 = function (params) {
            if (!$gameParty.inBattle() && !$gameMessage.isBusy()) { try { const alt = Floors.pick(this, params); if (alt) params = alt; } catch (e) { Diag.err('floor room', e); } }
            return _201floor.call(this, params);
        };
    }
    // =====================================================================
    // 7g. CUTSCENES (playtest 2026-10-25)
    //     A cutscene that starts by itself (an autorun page or common event that shows text and moves, transfers,
    //     scrolls or fades) waits until every player is on that map, so everyone starts it together. Cancel starts
    //     it without them. Each player sees only their own character during it (the others are hidden), and when it
    //     ends on the same map the player is put back where they came into the map, so nobody stands on anyone.
    //     The night's own events (midnight, bed, morning) and resource spawners are not cutscenes here.
    // =====================================================================
    const Scenes = {
        entry: null,                  // { m, x, y, d }: where I came into the current map
        running: null,                // the cutscene (token) running here
        holding: null,                // the cutscene (token) waiting for the others
        active() { return Net.isPlaying() && (Net.isHost || Net.inWorld) && Net.playerCount() >= 2; },
        /** The first command of a scene: a message, the HUD going away (WTE hides it for every cutscene) or a movie. */
        startsScene(c) {
            if (!c) return false;
            if (c.code === 101 || c.code === 261) return true;
            return c.code === 357 && c.parameters[0] === 'SRD_HUDMakerUltra' && c.parameters[1] === 'Set HUD Visibility' && String((c.parameters[3] || {})['Visible?']).toLowerCase() === 'false';
        },
        excluded(list) {
            const ces = window.$dataCommonEvents || [];
            return Spawns.isSpawnerList(list) || Night.PAUSE_CES.concat([Night.BED_CE, Night.MISSED_CE], Mobs.DEATH_CES).some(id => ces[id] && ces[id].list === list);
        },
        /** Who is not on this map yet (names). */
        missing(m) {
            const out = [];
            const tut = this.tutorialTogether();                              // the tutorial together: someone still loading is on their way too
            const near = tut && this.TUTORIAL_MAPS.includes(m) && window.$gamePlayer;  // …and in the forest and the tutorial house, "here" is close by: a scene waits for the others to walk up (decision 51)
            const far = s => near && Math.max(Math.abs(s.x - $gamePlayer.x), Math.abs(s.y - $gamePlayer.y)) > this.NEAR;
            Net.peers.forEach(p => {
                if (p.state && p.state.hd === 1) return;                    // they are waiting for a scene of their own (often for me): never wait on each other
                if ((!p.loading || tut) && (!(p.state && p.state.map === m) || far(p.state))) out.push(p.name || 'a player');
            });
            return out;
        },
        /** An automatic event (autorun/parallel, not a player's action) started: it may become a cutscene. */
        onSetup(interp, list) {
            if (interp._coopSceneTok && interp._coopSceneRoot) this.finish(interp);
            interp._coopSceneTok = null; interp._coopSceneRoot = false;
            if ((!this.active() && !this.hostAlone()) || !interp._coopAuto || !window.$gameMap || this.excluded(list)) return;
            const own = interp._eventId > 0 && Spawns.personalEvent($gameMap.mapId(), interp._eventId) && !this.tutorialTogether();   // my own story scene: nobody waits (the tutorial played together does)
            interp._coopSceneTok = { m: Locator.local(), state: 'idle', story: this.isStoryPage(list) && !Story.isMoment(list) && $gameMap.mapId() !== Rooms.MAP && !this.OPENING.maps.includes($gameMap.mapId()) && !own, at: Date.now() };   // the opening movie never waits   // the house (bedrooms, spawn) never waits   // plain data: interpreters are saved with the game
            interp._coopSceneRoot = true;
        },
        /** Before a command runs: hold a scene's first message until everyone is here (false = try again next frame). */
        mayRun(interp) {
            const tok = interp._coopSceneTok;
            // only a story page waits, before its first command (the map is still on screen); loaders, lighting and notices
            // never do, and nothing waits while a player is dying and going home
            if (!tok || tok.state === 'run' || !tok.story || Date.now() < (this.noHoldUntil || 0)) return true;
            const cancel = (typeof Input !== 'undefined' && Input.isTriggered('cancel')) || (typeof TouchInput !== 'undefined' && TouchInput.isCancelled());
            const here = Locator.local() === tok.m, tooLong = Date.now() - (tok.at || 0) > (this.tutorialTogether() ? 600000 : 90000);   // left that map, or 90 s (the tutorial: 10 min, players may still be in the opening): start anyway
            if (this.active() && here && !tooLong && this.missing(tok.m).length && !cancel) { tok.state = 'wait'; tok.seen = Date.now(); this.holding = tok; return false; }
            if (this.waitingToJoin(tok) && here && !tooLong && !cancel) { tok.state = 'wait'; tok.seen = Date.now(); this.holding = tok; return false; }   // the tutorial together: nobody has joined yet
            if (this.holding === tok) this.holding = null;
            tok.state = 'run'; this.running = tok;
            return true;
        },
        finish(interp) {
            const tok = interp._coopSceneTok; interp._coopSceneTok = null; interp._coopSceneRoot = false;
            if (!tok) return;
            if (this.holding === tok) this.holding = null;
            if (tok.state !== 'run') return;
            if (this.running === tok) this.running = null;
        },
        /** WTE's opening: GAME START (map 11) and the character scene with its movie (map 185, where a new player starts at 8,6). */
        OPENING: { map: 185, x: 8, y: 6, maps: [11, 185] },
        TUTORIAL_MAP: 183,                                             // the forest (where the tutorial starts)
        TUTORIAL_MAPS: [183, 184],                                     // the forest and the tutorial house; then the real house (map 2)
        NEAR: 10,                                                      // tiles: in the tutorial forest, a scene waits until the others are this close
        inTutorialWorld() { return !!(window.$gameSystem && $gameSystem._coopTutorial && window.$gameSwitches && $gameSwitches.value(CFG.tutorialSwitch)); },
        /** A world made with WTE's tutorial on (decision 50): while it lasts, its scenes wait for everyone. */
        tutorialTogether() { return !!(window.$gameSystem && $gameSystem._coopTutorial && window.$gameSwitches && $gameSwitches.value(CFG.tutorialSwitch)); },
        /** A scene of mine is waiting right now (it checks every frame; one that stopped, e.g. its event was removed, is not). */
        isWaiting() { const h = this.holding; return !!h && Date.now() - (h.seen || 0) < 1500; },
        /** Others are hidden while I watch a cutscene. */
        hideOthers() { return !!this.running || !!this.holding || Night.isRunningCE(PlayerData.CUSTOMISER_CE); },   // + my character creator (decision 92)
        /** A world made to play the tutorial together: its forest scenes wait for the first players to join. */
        waitingToJoin(tok) { return !!tok && tok.m === this.TUTORIAL_MAP && this.hostAlone(); },
        /** The host of a tutorial-together world, nobody joined yet (hosting, before the first player arrives). */
        hostAlone() { return Net.isHost && [S.HOSTING, S.PLAYING].includes(Net.state) && Net.peers.size === 0 && this.tutorialTogether(); },
        waitText() {
            if (!this.holding) return null;
            if (this.waitingToJoin(this.holding)) return 'Waiting for players to join the tutorial  (Cancel: start now)';
            const names = this.missing(this.holding.m);
            return names.length ? 'Waiting for ' + names.slice(0, 3).join(', ') + ' to come here  (Cancel: start now)' : null;
        },
        /** Where I came into this map from another one (a cutscene's own moves on the same map never change it). */
        entered() {
            if (!window.$gamePlayer || (this.entry && this.entry.m === $gameMap.mapId())) return;
            this.entry = { m: $gameMap.mapId(), x: $gamePlayer.x, y: $gamePlayer.y, d: $gamePlayer.direction() };
        },
        /** A story scene page: it hides the HUD and shows text itself (WTE's cutscene convention). */
        isStoryPage(list) {
            if (!Array.isArray(list)) return false;
            if (list._coopStory === undefined) Object.defineProperty(list, '_coopStory', { value: list.some(c => c && c.code === 101) && list.some(c => this.startsScene(c) && c.code === 357), enumerable: false });
            return list._coopStory;
        },
        /** A map's own setup autoruns (loader, lighting, spawners) run before its story scene, as they do when one player
         *  arrives alone. In a shared world a story switch can already be on when a map loads, which would start the scene
         *  over the loading screen. The scene waits for them (at most 5 s). */
        deferStory(ev) {
            if (!this.active() || !this.isStoryPage(ev.list())) return false;
            const now = Date.now();
            if (!ev._coopDeferSince) ev._coopDeferSince = now;
            if (now - ev._coopDeferSince > 5000) return false;
            const pending = $gameMap.events().some(o => o !== ev && !o._erased && o._trigger === 3 && o._pageIndex >= 0 && !!o.page() && o.list() && o.list().length > 1 && !this.isStoryPage(o.list()));   // (an event between pages has none)
            if (!pending) ev._coopDeferSince = 0;
            return pending;
        },
        reset() { this.running = null; this.holding = null; }
    };

    // =====================================================================
    // 7i. ONE PLAYER AT A TIME PER OBJECT (playtest 2026-10-25)
    //     Nobody is kept from any kind of work: every player farms, tends animals, mines and crafts like the host.
    //     Only the same object at the same moment is one player's: two players cannot harvest the same crop, plant in
    //     the same plot or milk the same animal at once (which would give both the items or break the object). The
    //     second sees "In use by <name>" for those few seconds. The host decides; the lock ends when the action does.
    // =====================================================================
    const Uses = {
        HOLD_MS: 30000,
        table: new Map(),             // host: "map,event" -> { by, name, at }
        mine: new Map(),              // "map,event" -> { at, seen }: granted to me
        pending: new Map(),           // "map,event" -> { ev, at }: asked, no answer yet
        key(m, e) { return m + ',' + e; },
        active() { return Net.isPlaying() && (Net.isHost || Net.inWorld) && Net.playerCount() >= 2; },
        /** A player's own action on a shared object (not a map's automatic page, not a monster). */
        needs(ev) {
            if (!this.active() || !ev || ![0, 1, 2].includes(ev._trigger) || Mobs.isMob(ev)) return false;
            if (Spawns.objectOnly(ev._mapId, ev._eventId)) {
                const d = window.$dataMap && $dataMap.events[ev._eventId];
                return !!d && d.pages.some(p => p.list.some(c => [126, 127, 128, 214, 301].includes(c.code) || (c.code === 357 && /openContainer|Loot/i.test(String(c.parameters[1])))));
            }
            return WorldObjects.isPlaced(ev) || Spawns.sharedEvent(ev._mapId, ev._eventId);
        },
        /** Called from Game_Event.start: true = go ahead now. */
        allow(ev) {
            const m = ev._mapId, e = ev._eventId, k = this.key(m, e);
            if (this.mine.has(k)) return true;
            if (Net.isHost) {
                const held = this.hostTake(Net.selfId, m, e);
                if (!held) { this.mine.set(k, { at: Date.now(), seen: false }); return true; }
                this.busy(held.name); return false;
            }
            if (this.pending.has(k)) return false;                          // asked already: the first one is waiting
            this.pending.set(k, { ev, at: Date.now(), held: true }); Net.send(Net.hostId, { t: 'USE', m, e });
            return true;                                                     // it starts now and waits for the answer (decision 92)
        },
        /** The map's interpreter is at the first command of an event whose use the host has not answered yet. */
        waiting(interp) {
            if (!this.pending.size || interp !== ($gameMap && $gameMap._interpreter) || !interp.isRunning() || interp._index !== 0) return false;
            const p = this.pending.get(this.key($gameMap.mapId(), interp.eventId()));
            return !!p && p.held && Date.now() - p.at < 3000;                // no answer in 3 s: go ahead (the host may be busy loading)
        },
        busy(name) { try { SoundManager.playBuzzer(); } catch (e) { /* optional */ } Diag.toast('In use by ' + (name || 'another player') + '.', 2000); },
        // ---- host ----
        alive(id) { return id === Net.selfId || Net.peers.has(id); },
        hostTake(by, m, e) {
            const k = this.key(m, e), cur = this.table.get(k), now = Date.now();
            if (cur && cur.by !== by && this.alive(cur.by) && now - cur.at < this.HOLD_MS) return cur;
            this.table.set(k, { by, name: by === Net.selfId ? hostName(Net) : ((Net.peers.get(by) || {}).name || 'a player'), at: now });
            return null;
        },
        hostGive(by, m, e) { const k = this.key(m, e), cur = this.table.get(k); if (cur && cur.by === by) this.table.delete(k); },
        // ---- answers / release ----
        answer(m, e, ok, name) {
            const k = this.key(m, e), p = this.pending.get(k);
            this.pending.delete(k);
            const it = window.$gameMap && $gameMap._interpreter, heldHere = !!p && p.held && Spawns.onMap(m) && it && it.isRunning() && it.eventId() === e;
            if (!ok) { if (heldHere && it._index === 0) it.clear(); return this.busy(name); }   // someone else has it: called off before it did anything
            this.mine.set(k, { at: Date.now(), seen: false });
            if (heldHere) return;                                                              // it is already running: go on
            const ev = p && Spawns.onMap(m) && $gameMap.event(e);
            if (ev && ev === p.ev && !$gameMap.isEventRunning()) ev.start();                  // now it's mine: do it
            else this.release(m, e);
        },
        release(m, e) {
            WorldObjects.flushSelf(Date.now(), true);                   // what I did to it reaches everyone before it is free again
            this.mine.delete(this.key(m, e));
            if (Net.isHost) this.hostGive(Net.selfId, m, e); else Net.send(Net.hostId, { t: 'UNUSE', m, e });
        },
        /** Every frame: my action on it has ended (or never started) -> it's free again. */
        update(now) {
            if (!this.mine.size && !this.pending.size) return;
            const it = window.$gameMap && $gameMap._interpreter, m = window.$gameMap ? $gameMap.mapId() : 0;
            this.mine.forEach((s, k) => {
                const [km, ke] = k.split(',').map(Number);
                const running = km === m && it && it.isRunning() && it.eventId() === ke;
                if (running) s.seen = true;
                else if (s.seen || now - s.at > 2000) this.release(km, ke);
            });
            this.pending.forEach((p, k) => { if (now - p.at > 5000) this.pending.delete(k); });   // no answer: try again
        },
        /** What I hold stays mine while I use it, also through a battle it started (the map, and with it update(), is paused
         *  then): the host is told every 10 s. Its own hold expires after HOLD_MS without word, so a player who vanished frees it. */
        keepAlive(now) {
            this.mine.forEach((s, k) => {
                if (now - (s.kept || s.at) < 10000) return;
                s.kept = now;
                const [m, e] = k.split(',').map(Number);
                if (Net.isHost) { const cur = this.table.get(k); if (cur && cur.by === Net.selfId) cur.at = now; }
                else Net.send(Net.hostId, { t: 'USE_KEEP', m, e });
            });
        },
        reset() { this.table.clear(); this.mine.clear(); this.pending.clear(); }
    };

    // =====================================================================
    // 7h. MONSTERS (WTE_NPCVision; playtest 2026-10-25)
    //     A monster is an event with WTE's vision features (sight/hearing radius, pursuit). Each one is moved by one game,
    //     its owner: normally the map's authority (§7f). When another player comes into its sight or hearing in their own
    //     game and it is not hunting anyone, the host hands it to that player's game, whose WTE pathfinding then hunts
    //     them. Everyone else sees the owner's positions (WTE's own walking animation between tiles) and never starts its
    //     events. Caught = that player's own battle: the monster stays where it is for everyone, labelled with who is
    //     fighting it, and hunts nobody else. Won: it is gone for everyone (self switch A). Lost: it goes back to its normal
    //     wandering. The battle never pauses anyone else's game or the shared clock.
    // =====================================================================
    // =====================================================================
    // 7k. THE OPENING TOGETHER (decision 51): in a world made to play the tutorial together, players join while the host
    //     makes their character (map 185). Each makes their own; the opening movie waits until everyone is done (or the
    //     host presses Cancel), then starts for everyone at once. Players who join later play it on their own.
    // =====================================================================
    const Opening = {
        MAP: 185, EVENT: 1, CUSTOMISER_CE: 2045, LIMIT_MS: 600000,
        ready: new Set(), sent: false, waiting: false, since: 0,
        started() { return !!(window.$gameSystem && $gameSystem._coopOpeningGo); },
        lobby() { return Scenes.tutorialTogether() && !this.started(); },
        /** The movie's first command: the one right after the customiser in WTE's character scene. */
        gateIndex(list) { if (!Array.isArray(list)) return -1; const n = list.findIndex(c => c && c.code === 117 && c.parameters[0] === this.CUSTOMISER_CE); return n < 0 ? -1 : n + 1; },
        /** Before a command runs: false = wait here (everyone is still making their character). */
        mayRun(interp) {
            if (!window.$gameMap || $gameMap.mapId() !== this.MAP || interp !== $gameMap._interpreter || interp.eventId() !== this.EVENT) return true;
            if (interp._index !== this.gateIndex(interp._list) || !this.lobby() || !(Net.isHost ? [S.HOSTING, S.PLAYING].includes(Net.state) : Net.inWorld)) return true;
            if (!this.waiting) { this.waiting = true; this.since = Date.now(); }
            if (Net.isHost) {
                this.ready.add(Net.selfId);
                const cancel = (typeof Input !== 'undefined' && Input.isTriggered('cancel')) || (typeof TouchInput !== 'undefined' && TouchInput.isCancelled());
                if (cancel || Date.now() - this.since > this.LIMIT_MS || (Net.peers.size > 0 && !this.missing().length)) this.start();
            } else {
                if (!this.sent) { this.sent = true; Net.send(Net.hostId, { t: 'OPEN_READY' }); }
                const host = Net.peers.get(Net.hostId);                      // the host already left character creation (e.g. a world saved
                if (host && host.state && host.state.map !== this.MAP && window.$gameSystem) $gameSystem._coopOpeningGo = true;   // mid-tutorial): play it on my own
            }
            if (this.started()) { this.waiting = false; return true; }
            return false;
        },
        /** Host: who is still making their character (joined players, also those still loading in). */
        missing() { const out = []; Net.peers.forEach((p, id) => { if (!this.ready.has(id)) out.push(p.name || 'a player'); }); return out; },
        start() { if (window.$gameSystem) $gameSystem._coopOpeningGo = true; this.waiting = false; Net.broadcast({ t: 'OPEN_GO' }); Diag.log('info', 'the opening starts for everyone'); },
        text() {
            if (!this.waiting || this.started()) return null;
            if (!Net.isHost) return 'Waiting for everyone to finish their character';
            const m = this.missing();
            return (m.length ? 'Waiting for ' + m.slice(0, 3).join(', ') + ' to finish their character' : 'Waiting for players to join') + '  (Cancel: start now)';
        },
        reset() { this.ready.clear(); this.sent = false; this.waiting = false; }
    };

    // =====================================================================
    // 7m. EACH PLAYER'S OWN BED AND TUB (design §4, §6.2, §7; decision 56)
    //     The house's bed and tub are the host's; each player's room has their own (the co-op rooms of Map002). A bed or
    //     tub belongs to whoever's room it stands in (moved furniture keeps belonging to that room); everything outside
    //     the rooms is the host's. Nobody uses someone else's.
    //     - Bath: each player's own, any time, at their own tub (decision 130). It heals them and resets their own daily
    //       things; nobody else is asked or moved, and the world isn't reset (that waits for the night).
    //     - Sleep: when someone lies down, everyone else is asked "Go to your bed and sleep now?". Yes takes them to their
    //       own bed and lies them down with WTE's own sleep; "Not now" stays up (asked again two hours later), and staying
    //       up past midnight brings WTE's own Missed Sleep (decision 38).
    // =====================================================================
    const Home = {
        MAP: 2, BED_CE: 965,
        ROOMS: { 1: [1, 41, 18, 49], 2: [21, 41, 38, 49], 3: [13, 53, 30, 61] },   // x1, y1, x2, y2 of each player room, the living room's size (tools/build-coop-rooms.js, 2026-11-02)
        SPOTS: { 0: { bed: [28, 7], tub: [10, 7] }, 1: { bed: [16, 45], tub: [2, 48] }, 2: { bed: [36, 45], tub: [22, 48] }, 3: { bed: [28, 57], tub: [14, 60] } },
        mySlot() { return Net.isHost ? 0 : (Net.slot || 0); },
        active() { return Rooms.active() && !Ritual.inTutorial(); },
        ownerAt(m, x, y) {
            if (m !== this.MAP) return 0;
            for (const s of [1, 2, 3]) { const r = this.ROOMS[s]; if (x >= r[0] && x <= r[2] && y >= r[1] && y <= r[3]) return s; }
            return 0;
        },
        ownerName(slot) { return slot === 0 ? (Net.isHost ? hostName(Net) : Net.nameOf(Net.hostId)) : (Rooms.ownerName(slot) || 'another player'); },
        callsCE(ev, id) { const p = ev && ev._pageIndex >= 0 && ev.page && ev.page(); return !!p && (p.list || []).some(c => c && c.code === 117 && c.parameters[0] === id); },
        /** My bed/tub on this map nearest to me (my room, or the house for the host). */
        find(ce) {
            if (!window.$gameMap || $gameMap.mapId() !== this.MAP) return null;
            const me = this.mySlot(); let best = null, bd = 1e9;
            ($gameMap._events || []).forEach(ev => {
                if (!ev || ev._erased || !this.callsCE(ev, ce) || this.ownerAt(this.MAP, ev.x, ev.y) !== me) return;
                const d = Math.abs(ev.x - $gamePlayer.x) + Math.abs(ev.y - $gamePlayer.y);
                if (d < bd) { bd = d; best = ev; }
            });
            return best;
        },
        /** Where to stand for my bed/tub (in front of where the room's own one starts out). */
        spot(kind) { const p = (this.SPOTS[this.mySlot()] || this.SPOTS[0])[kind]; return { x: p[0], y: p[1] + 1 }; },
        /** Show a line as the event's own next message (a child list), so it never merges with a menu that is closing. */
        say(interp, text) { interp.setupChild([{ code: 101, indent: 0, parameters: ['', 0, 0, 2, ''] }, { code: 401, indent: 0, parameters: [text] }, { code: 0, indent: 0, parameters: [] }], interp._eventId); },
        /** A bed or tub is about to run its menu: false = not this player's (a message says whose it is). */
        mayUse(interp, ce) {
            if (!this.active() || !interp || !(interp._eventId > 0) || !window.$gameMap) return true;
            const ev = $gameMap.event(interp._eventId);
            if (!ev) return true;
            const owner = this.ownerAt($gameMap.mapId(), ev.x, ev.y), me = this.mySlot();
            const what = ce === this.BED_CE ? 'bed' : 'tub';
            if (owner !== me) {
                this.say(interp, 'This is \\c[6]' + this.ownerName(owner) + "\\c[0]'s " + what + '.' + (me ? ' Yours is in your room.' : ''));
                return false;
            }
            const rs = Net.rs;
            if (ce === this.BED_CE && rs && rs.kind === 'sleep' && rs.phase === 'gather' && !Net.rl && window.$gameVariables)
                $gameVariables._data[CFG.bedCounterVar] = 0;               // the others went to bed tonight: joining them is not a second night (shared bed counter)
            return true;
        },
        /** WTE's own "go to sleep" steps (CE965: Sleep → "Are you sure?" → Yes), run for a player who accepted the invite. */
        sleepList() {
            if (this._sleepList) return this._sleepList;
            const ce = window.$dataCommonEvents && $dataCommonEvents[this.BED_CE];
            if (!ce) return null;
            const L = ce.list;
            const ask = L.findIndex((c, i) => c.code === 102 && c.parameters[0][0] === 'Yes' && L.slice(Math.max(0, i - 4), i).some(x => x.code === 401 && /sure you want to sleep/i.test(x.parameters[0])));
            if (ask < 0) return null;
            const yes = L.findIndex((c, i) => i > ask && c && c.code === 402 && c.indent === L[ask].indent && (c.parameters[0] === 0 || String(c.parameters[1]).trim() === 'Yes'));
            if (yes < 0) {                                                       // decision 93: never read past a branch that isn't there
                Diag.log('warn', 'bed: the "Yes" branch of the sleep question was not found (the game\'s bed menu opens instead): ' + JSON.stringify(L.slice(ask, ask + 4).map(c => c && [c.code, c.indent, c.parameters])).slice(0, 300));
                return null;
            }
            let n = yes + 1; const body = [];
            while (n < L.length && L[n].indent > L[yes].indent) { body.push(Object.assign({}, L[n], { indent: L[n].indent - L[yes].indent - 1 })); n++; }
            body.push({ code: 0, indent: 0, parameters: [] });
            return (this._sleepList = body);
        }
    };

    const Invites = {
        sleep: null,
        free() { return !$gameMap.isEventRunning() && !$gameMessage.isBusy() && !SceneManager.isSceneChanging() && !$gamePlayer.isTransferring(); },
        update() { this.sleepUpdate(); },
        /** Someone is in bed: the others are asked whether to sleep now, in their own bed. */
        sleepUpdate() {
            const rs = Net.rs;
            if (!rs || rs.kind !== 'sleep' || rs.phase !== 'gather' || !rs.ready.length) { this.sleep = null; return; }
            if (rs.ready.includes(Net.selfId) || Net.rl || Ritual.inTutorial() || !this.free()) return;
            const s = this.sleep || (this.sleep = { step: 'ask', hour: null });
            if (s.step === 'go') {
                if ($gameMap.mapId() !== Home.MAP) return;
                if ((window.$gameSwitches && $gameSwitches.value(CFG.sleepSwitch)) || Net.rl) { s.step = 'asleep'; return; }   // already asleep in my own bed: not twice (decision 94)
                const bed = Home.find(Home.BED_CE), list = Home.sleepList();
                if (bed) { $gamePlayer.locate(bed.x, bed.y + 1); $gamePlayer.setDirection(8); }
                if (list) { $gameVariables._data[CFG.bedCounterVar] = 0; $gameMap._interpreter.setup(list, bed ? bed.eventId() : 0); }
                else if (window.$gameTemp) $gameTemp.reserveCommonEvent(Home.BED_CE);   // the game's own bed menu: Sleep as usual (decision 93)
                s.step = 'asleep';
                return;
            }
            if (s.step !== 'ask') return;
            const h = window.$gameTime ? $gameTime.hour : 0;
            if (s.hour !== null && (h - s.hour + 24) % 24 < 2) return;     // "Not now": asked again two hours later
            s.hour = h;
            const names = rs.ready.map(id => Net.nameOf(id));
            $gameMessage.add('\\c[6]' + names.join(', ') + '\\c[0] ' + (names.length > 1 ? 'are' : 'is') + ' in bed.');
            $gameMessage.add('Go to your bed and sleep now?');
            $gameMessage.setChoices(['Yes', 'Not now'], 0, 1);
            $gameMessage.setChoiceCallback(n => {
                if (n !== 0) return;
                const sp = Home.spot('bed');
                $gamePlayer.reserveTransfer(Home.MAP, sp.x, sp.y, 8, 0);
                s.step = 'go';
            });
        },
        reset() { this.sleep = null; }
    };

    // =====================================================================
    // 7o. BIG STORY MOMENTS TOGETHER (design §5.2, ASK-2; decision 59)
    //     A big moment is an event page that ends in WTE's story autosave (CE2738): the bosses, the shrines and the key
    //     scenes, 13 in this game. The player who starts one (the lead) waits until everyone is near (Cancel: start alone;
    //     5 minutes at most); the others are invited ("Go there" puts them beside the lead, "Not now" lets the scene go
    //     on without them). Then the scene starts in every present player's game at once: the same page of the same event,
    //     the lead's choices for everyone (a question waits in the others' games until the lead has answered it), and the
    //     scene's random rolls seeded alike. Each player's own story records it (their quests, flags, items); the gold it
    //     gives reaches the shared wallet once (the lead's).
    // =====================================================================
    const Story = {
        AUTOSAVE_CE: 2738, NEAR: 12, LIMIT_MS: 300000, FOLLOW_MS: 30000,
        wait: null,                   // lead: { st, since, seen, declined: Set } while my scene waits for the others
        call: null,                   // someone's: { by, name, m, e, p, x, y, at } a big moment is about to start
        asked: '', follow: null,      // the call I was asked about; a scene to start here: { lead, m, e, p, seed, at }
        run: null,                    // the big moment running in this game (the root interpreter's tag)
        active() { return Net.isPlaying() && (Net.isHost || Net.inWorld) && Net.playerCount() >= 2; },
        isMoment(list) {
            if (!Array.isArray(list)) return false;
            if (list._coopMoment === undefined) Object.defineProperty(list, '_coopMoment', { value: list.some(c => c && c.code === 117 && c.parameters[0] === this.AUTOSAVE_CE), enumerable: false });
            return list._coopMoment;
        },
        /** A map event's page that is a big moment starts here: the player who started it leads. */
        onSetup(interp, list, eventId) {
            interp._coopStory = interp._coopStoryNext || null; interp._coopStoryNext = null;   // a new list: a new scene (a follower's start is tagged in advance)
            if (interp._coopStory || !this.active() || !window.$gameMap || interp !== $gameMap._interpreter || !(eventId > 0) || !this.isMoment(list)) return;
            const ev = $gameMap.event(eventId);
            interp._coopStory = { m: $gameMap.mapId(), e: eventId, p: ev ? ev._pageIndex : -1, lead: Net.selfId, state: 'gather', k: 0, choices: new Map() };
        },
        near(st, s) { return !!s && s.map === st.m && Math.max(Math.abs(s.x - $gamePlayer.x), Math.abs(s.y - $gamePlayer.y)) <= this.NEAR; },
        missing() {
            const w = this.wait, out = [];
            if (!w) return out;
            Net.peers.forEach((p, id) => { if (!p.loading && !w.declined.has(id) && !this.near(w.st, p.state)) out.push(p.name || 'a player'); });
            return out;
        },
        rng(st) { return Daily.active() ? Daily.make('story|' + st.m + '|' + st.e + '|' + st.p + '|' + st.seed) : null; },
        /** Before each command of a lead's big moment: its first command waits for everyone. */
        mayRun(interp) {
            const st = interp._coopStory;
            if (!st || st.lead !== Net.selfId || st.state !== 'gather') return true;
            if (!this.active() || st.p < 0) { st.state = 'run'; return true; }
            const now = Date.now();
            if (!this.wait || this.wait.st !== st) { this.wait = { st, since: now, seen: now, declined: new Set() }; this.cast({ k: 'call', m: st.m, e: st.e, p: st.p, x: $gamePlayer.x, y: $gamePlayer.y }); }
            this.wait.seen = now;
            const cancel = (typeof Input !== 'undefined' && Input.isTriggered('cancel')) || (typeof TouchInput !== 'undefined' && TouchInput.isCancelled());
            if (!cancel && now - this.wait.since < this.LIMIT_MS && this.missing().length) return false;
            this.wait = null;
            st.state = 'run'; st.seed = (Math.random() * 1e9) >>> 0;
            const r = this.rng(st); if (r) { interp._coopRng = r; interp._coopRngKeep = true; }
            this.run = st;
            this.cast({ k: 'go', m: st.m, e: st.e, p: st.p, seed: st.seed });
            Diag.log('info', 'big story moment (map ' + st.m + ', event ' + st.e + ') starts together');
            return true;
        },
        isWaiting() { return !!this.wait && Date.now() - this.wait.seen < 1500; },
        cast(m) {
            const msg = Object.assign({ t: 'STORY', by: Net.selfId }, m);
            if (Net.isHost) Net.broadcast(msg); else Net.send(Net.hostId, Object.assign({}, msg, { t: 'STORY_UP' }));
        },
        valid(m) { return ['call', 'go', 'answer', 'choice'].includes(m.k) && typeof m.by === 'string' && (m.k === 'answer' || m.k === 'choice' || (isInt(m.m, 1, 9999) && isInt(m.e, 1, 9999) && isInt(m.p, 0, 99))); },
        receive(m) {
            if (!this.valid(m)) return;
            if (m.k === 'call' && m.by !== Net.selfId && isInt(m.x, 0, 999) && isInt(m.y, 0, 999)) this.call = { by: m.by, name: Net.nameOf(m.by), m: m.m, e: m.e, p: m.p, x: m.x, y: m.y, at: Date.now() };
            if (m.k === 'go' && m.by !== Net.selfId) {
                if (this.call && this.call.by === m.by) this.call = null;
                if (isInt(m.seed, 0, 4294967295) && window.$gameMap && $gameMap.mapId() === m.m) this.follow = { lead: m.by, m: m.m, e: m.e, p: m.p, seed: m.seed, at: Date.now() };
            }
            if (m.k === 'answer' && this.wait && m.by === Net.selfId && typeof m.id === 'string' && m.a === 0) { this.wait.declined.add(m.id); Diag.toast(Net.nameOf(m.id) + ' will play this part later.', 4000); }
            if (m.k === 'choice' && this.run && this.run.lead === m.by && isInt(m.c, 0, 9999) && isInt(m.n, -2, 99)) this.run.choices.set(m.c, m.n);
        },
        /** Every map frame: the invite, and starting the scene the lead started. */
        update() {
            if (this.run && !(window.$gameMap && $gameMap._interpreter.isRunning() && $gameMap._interpreter._coopStory === this.run)) this.run = null;   // the scene ended here
            const f = this.follow;
            if (f) {
                if (Date.now() - f.at > this.FOLLOW_MS || $gameMap.mapId() !== f.m) this.follow = null;
                else if (!$gameMap.isEventRunning() && !$gameMessage.isBusy() && !SceneManager.isSceneChanging() && !$gamePlayer.isTransferring()) {
                    const d = window.$dataMap && $dataMap.events[f.e], pg = d && d.pages[f.p];
                    this.follow = null;
                    if (pg) {
                        const it = $gameMap._interpreter, st = { m: f.m, e: f.e, p: f.p, lead: f.lead, state: 'run', seed: f.seed, k: 0, choices: new Map() };
                        it._coopStoryNext = st;                               // tagged before setup: never a lead here
                        it.setup(pg.list, f.e);
                        const r = this.rng(st); if (r) { it._coopRng = r; it._coopRngKeep = true; }
                        this.run = st;
                    }
                }
            }
            const c = this.call;
            if (!c) return;
            if (!this.active() || Date.now() - c.at > this.LIMIT_MS + 5000) { this.call = null; return; }
            const key = c.by + '@' + c.at;
            if (this.asked === key || this.near(c, { map: $gameMap.mapId(), x: $gamePlayer.x, y: $gamePlayer.y })) return;
            if ($gameMap.isEventRunning() || $gameMessage.isBusy() || SceneManager.isSceneChanging() || $gamePlayer.isTransferring()) return;
            this.asked = key;
            const info = window.$dataMapInfos && $dataMapInfos[c.m];
            $gameMessage.add('\\c[6]' + c.name + '\\c[0] reached a big moment of the story' + (info && info.name ? ' (' + info.name + ')' : '') + '.');
            $gameMessage.add('Play it together?');
            $gameMessage.setChoices(['Go there', 'Not now'], 0, 1);
            $gameMessage.setChoiceCallback(n => {
                if (n === 0) { $gamePlayer.reserveTransfer(c.m, c.x, Math.min(c.y + 1, 999), 8, 0); return; }
                const msg = { t: 'STORY', k: 'answer', by: c.by, id: Net.selfId, a: 0 };
                if (Net.isHost) Net.broadcast(msg); else Net.send(Net.hostId, Object.assign({}, msg, { t: 'STORY_UP' }));
            });
        },
        /** A question in a big moment. The lead's answer is sent; elsewhere the question waits for it (false = wait). */
        choice(interp) {
            const st = interp._coopStory;
            if (!st || st.state !== 'run' || !this.active()) return null;
            if (interp._coopChoiceK === undefined) interp._coopChoiceK = st.k++;
            const c = interp._coopChoiceK;
            if (st.lead === Net.selfId) return { lead: true, c };
            if (!st.choices.has(c)) { this.waitingChoice = Date.now(); return false; }
            interp._coopChoiceK = undefined;
            return { lead: false, c, n: st.choices.get(c) };
        },
        sendChoice(st, c, n) { const msg = { t: 'STORY', k: 'choice', by: Net.selfId, c, n }; if (Net.isHost) Net.broadcast(msg); else Net.send(Net.hostId, Object.assign({}, msg, { t: 'STORY_UP' })); },
        /** A follower's own run of the lead's scene: its gold reaches the wallet from the lead's run only. */
        followerRun() { return Spawns.stack.some(i => i && i._coopStory && i._coopStory.lead !== Net.selfId && i._coopStory.state === 'run'); },
        text() {
            if (this.isWaiting()) { const m = this.missing(); return m.length ? 'Waiting for ' + m.slice(0, 3).join(', ') + ' to come and play this together  (Cancel: start now)' : null; }
            if (this.run && this.run.lead !== Net.selfId && this.waitingChoice && Date.now() - this.waitingChoice < 1000) return 'Waiting for ' + Net.nameOf(this.run.lead) + ' to choose…';
            const c = this.call;
            if (c && this.active()) return c.name + ' is starting a big moment of the story — play it together';
            return null;
        },
        reset() { this.wait = null; this.call = null; this.asked = ''; this.follow = null; this.run = null; }
    };

    // =====================================================================
    // 7p. BOSS BATTLES TOGETHER (decision 60)
    //     The battle of a big story moment (§7o) is everyone's: each game builds the same party (every player's character,
    //     in the same order everywhere; the others as stand-ins made from their character), the same troop and one seed.
    //     - Turns: WTE's AP turns. In the player phase each player chooses only for their own character; a choice goes to
    //       the host, which numbers it, and every game carries the actions out in that order. The boss's phase follows.
    //     - Rolls: hits, criticals, damage spread, states, enemy choices, drops and the battle's events draw from one
    //       seeded stream (only there: effects keep their own randomness), so every game gets the same results.
    //     - WTE's skill scenes were written for one hero: during an action "actor 1" is whoever acts, "alive actors"
    //       means the user (a player's skill) or the targets (an enemy's), and "the whole party" changes only the actor.
    //     - After every action the joiners' battlers are compared with the host's; any difference is corrected.
    //     - Each player's own battle counters (WTE keeps them in variables) are theirs: during an action the variables
    //       hold the counters of the player it is about, and the screen always shows this player's own (decision 61).
    //     - Food, potions and Mending can be given to another player (one ally instead of only yourself, in these
    //       battles only); a gift's effects land on the one who receives it.
    //     - The other players are a row of small walking models (name, HP, MP); whoever's turn it is pops up and walks.
    //     - Any battle (decision 62): when a monster attacks a player, everyone within view of them who is free (on the
    //       map, not in a scene, a menu-free moment) is pulled into the same battle. The attacked player's game resolves
    //       the troop; the gold goes to them. A big moment's boss has more HP with every player in the world
    //       (+50% each), whoever is there to fight it.
    //     - The host numbers each battle's actions by its id (the seed), also battles it isn't in. A player who leaves
    //       (or could not join after all) keeps guarding: the others' games ask the host for it, once per turn.
    //     - Revive (General Store, co-op only, 50 gold): a downed player gets back up with half their HP and AP.
    //     - Fleeing (decision 63): never from a big moment's boss. Elsewhere "Flee in Terror" first asks everyone else;
    //       only when all agree does it go ahead (WTE's own flee: its roll, then everyone escapes). A no, or no answer
    //       in time, gives the one who asked their turn back.
    //     - Rewards: everyone gets their own EXP and items; the gold goes once to the shared wallet (the scene's lead).
    //       No escaping. A player who leaves keeps guarding until the battle ends.
    // =====================================================================
    const Duel = {
        GUEST_BASE: 101, READY_MS: 20000, FIELD_MS: 3000, GUARD: 2, IDLE_MS: 1000, STUCK_MS: 4000, HP_PER_PLAYER: 0.25, DMG_PER_PLAYER: 0.10, FLEE_SKILL: 958, VOTE_MS: 25000,
        voteAsk: null, fleeMine: null, note: '', noteUntil: 0,
        nums: new Map(), out: new Set(), autoAsked: new Map(), fgather: null, pulledWait: null, kind: '', hpRate: 1, dmgRate: 1,
        on: false, order: [], ids: new Map(), seed: 0, rand: null, n: 0, done: 0, queue: new Map(), want: null,
        actingAs: null, partyList: false, selecting: false, gold: true, hist: new Map(), gather: null, waitingFor: '',
        active() { return Net.isPlaying() && (Net.isHost || Net.inWorld) && Net.playerCount() >= 2; },
        /** The battle of a big moment played together: this game's command 301 is part of it. */
        isTogether(interp) { const st = interp && interp._coopStory; return !!st && st.state === 'run' && this.active(); },
        /** The difficulty's enemy stat modifier (CGMZ_Difficulty: Cozy 0.5 ... Nightmare 1.4); 1 if it can't be read. */
        difficultyRate() {
            try { const d = $cgmzTemp.getDifficulty($cgmz.getDifficulty()), r = d && Number(d._enemyStatModifier); return r > 0 && r < 10 ? r : 1; } catch (e) { return 1; }
        },
        snap() {
            const a = $gameActors.actor(1); if (!a) return '';
            try { a._coopVars = this.readVars(); a._coopMaxAp = this.maxAp ? this.maxAp.call(a) : undefined; return JsonEx.stringify(a); } catch (e) { return ''; } finally { delete a._coopVars; delete a._coopMaxAp; }
        },
        // ---- before the battle: everyone's character and one seed (host) ----
        /** command301 of a together battle: false = wait for everyone. */
        ready(interp, params) {
            if (this.on) return true;
            const now = Date.now();
            if (!interp._coopDuel) { interp._coopDuel = { at: now }; this.want = null; this.send({ t: 'BREADY', tr: params[1] || 0, snap: this.snap(), m: $gameMap.mapId() }); }
            if (Net.isHost && this.gather) this.checkGather();             // someone who never answers is not waited for forever
            if (this.want) { const go = this.want; this.want = null; interp._coopDuel = null; this.setup(go); return true; }
            if (now - interp._coopDuel.at > this.READY_MS + 10000) { interp._coopDuel = null; Diag.log('warn', 'boss battle: nobody answered, fighting alone'); return true; }
            this.waitingFor = 'the others';
            return false;
        },
        send(m) { if (Net.isHost) this.onHost(Net.selfId, m); else Net.send(Net.hostId, m); },
        /** Host: a player's character is ready for the battle. */
        onHost(from, m) {
            if (m.t === 'BREADY' && m.pulled) {                             // someone near the attacked player: in, with their character
                const g = this.fgather;
                if (g && g.want.has(from)) { if (typeof m.snap === 'string' && m.snap.length < 200000) g.snaps.set(from, m.snap); g.want.delete(from); this.checkGather(); }
                return;
            }
            if (m.t === 'BREADY' && m.f) { this.hostField(from, m); return; }
            if (m.t === 'BNO') { const g = this.fgather; if (g) { g.want.delete(from); this.checkGather(); } return; }
            if (m.t === 'BAUTO') { this.hostAuto(from, m); return; }
            if (m.t === 'BFLEE') { this.hostFlee(from, m); return; }
            if (m.t === 'BFLEEANS') { this.hostFleeAnswer(from, m); return; }
            if (m.t === 'BBAIL' || m.t === 'BEND') { this.hostLeft(from, m); return; }
            if (m.t === 'BREADY') {
                const g = this.gather && Date.now() - this.gather.at < this.READY_MS ? this.gather : (this.gather = { at: Date.now(), snaps: new Map(), m: m.m, tr: m.tr });
                if (typeof m.snap === 'string' && m.snap.length < 200000) g.snaps.set(from, m.snap);
                this.checkGather();
            } else if (m.t === 'BACT') this.hostAct(from, m);
        },
        checkGather() { this.closeStory(); this.closeField(); },
        /** Host: start a battle's numbering and tell its players (a big moment's: everyone, so the others stop waiting). */
        launch(order, snaps, tr, extra, everyone) {
            const go = Object.assign({ t: 'BGO', seed: (Math.random() * 4294967295) >>> 0, order, snaps, tr, pc: Net.playerCount() }, extra);
            this.nums.set(go.seed, { order, n: 0, out: new Set(), auto: new Map(), ended: new Set(), at: Date.now() });
            if (everyone) Net.broadcast(go); else order.forEach(id => { if (id !== Net.selfId) Net.send(id, go); });
            if (order.includes(Net.selfId)) this.want = go;
        },
        /** Host: a monster attacked someone; ask everyone within their view to join. */
        hostField(from, m) {
            if (!isInt(m.tr, 1, 9999) || !isNum(m.x, 0, 9999) || !isNum(m.y, 0, 9999) || typeof m.snap !== 'string' || m.snap.length > 200000) return;
            const tx = Pack.clean(m.tx);                                       // more monsters closing in: their groups join (all games add the same)
            const solo = () => this.launch([from], { [from]: m.snap }, m.tr, { kind: 'field', lead: from, tx });
            if (this.fgather) { solo(); return; }                          // one gathering at a time: they fight alone
            const g = this.fgather = { at: Date.now(), snaps: new Map([[from, m.snap]]), want: new Set(), from, tr: m.tr, tx, esc: m.esc ? 1 : 0, lose: m.lose ? 1 : 0 };
            [Net.selfId].concat(Array.from(Net.peers.keys())).forEach(id => {
                if (id === from || !this.near(m.m, m.x, m.y, id)) return;
                g.want.add(id);
                const ask = { t: 'BPULL', tr: m.tr, by: from };
                if (id === Net.selfId) this.pulled(ask); else Net.send(id, ask);
            });
            this.checkGather();
        },
        closeField() {
            const g = this.fgather; if (!g || (g.want.size && Date.now() - g.at < this.FIELD_MS)) return;
            this.fgather = null;
            const rest = [Net.selfId].concat(Array.from(Net.peers.values()).sort((a, b) => (a.slot || 9) - (b.slot || 9)).map(p => p.id)).filter(id => g.snaps.has(id) && id !== g.from);
            const order = (g.snaps.has(g.from) ? [g.from] : []).concat(rest);   // the attacked player first (decision 103)
            const snaps = {}; order.forEach(id => { snaps[id] = g.snaps.get(id); });
            this.launch(order, snaps, g.tr, { kind: 'field', lead: g.from, lose: g.lose, tx: g.tx || [] });
        },
        /** Host: number a battle's next action and send it to that battle's players. */
        number(s, b, a) {
            const d = Object.assign({ t: 'BDO', bid: s, n: ++b.n }, a);
            b.order.forEach(id => { if (id === Net.selfId) this.gotDo(d); else Net.send(id, d); });
        },
        gotDo(d) { if (this.on && d.bid === this.seed) this.queue.set(d.n, d); },
        /** Host: someone in the battle sees a player who is gone with a turn to take: guard for them (once per turn). */
        hostAuto(from, m) {
            const b = this.nums.get(m.bid);
            if (!b || !b.order.includes(from) || !isInt(m.mi, 0, 3) || !isInt(m.d, 0, 1e7)) return;
            const id = b.order[m.mi];
            if (!id || !(b.out.has(id) || (id !== Net.selfId && !Net.peers.has(id)))) return;
            if (b.auto.get(m.mi) === m.d) return;
            b.auto.set(m.mi, m.d);
            this.number(m.bid, b, { mi: m.mi, k: 's', i: this.GUARD, tg: -1 });
        },
        /** Host: a player could not join after all (BBAIL) or finished the battle (BEND). */
        hostLeft(from, m) {
            const b = this.nums.get(m.bid); if (!b || !b.order.includes(from)) return;
            if (m.t === 'BBAIL') {
                b.out.add(from);
                b.order.forEach(id => { if (id === Net.selfId) { if (this.on && this.seed === m.bid) this.out.add(from); } else if (id !== from) Net.send(id, { t: 'BOUT', bid: m.bid, id: from }); });
            } else b.ended.add(from);
            if (b.order.every(id => b.ended.has(id) || b.out.has(id) || (id !== Net.selfId && !Net.peers.has(id)))) this.nums.delete(m.bid);
        },
        /** Host, every frame (any scene): close gatherings that are due; forget battles long over. */
        hostTick(now) {
            if (!Net.isHost) return;
            if (this.gather || this.fgather) this.checkGather();
            this.nums.forEach((b, bid) => { if (b.vote) this.voteCheck(bid, b); });   // someone left, or time ran out
            if (now - (this.numsSwept || 0) > 60000) { this.numsSwept = now; this.nums.forEach((b, s) => { if (now - b.at > 3 * 3600000) this.nums.delete(s); }); }
        },
        // ---- any battle together (decision 62) ----
        /** Is that player on map m within view of (x, y)? */
        near(m, x, y, id) {
            let pm, px, py;
            if (id === Net.selfId) { if (!window.$gameMap) return false; pm = $gameMap.mapId(); px = $gamePlayer.x; py = $gamePlayer.y; }
            else { const p = Net.peers.get(id), s = p && !p.loading && p.state; if (!s) return false; pm = s.map; px = s.x; py = s.y; }
            if (pm !== m || !isNum(px, -1e4, 1e4) || !isNum(py, -1e4, 1e4)) return false;
            const z = (window.$gameScreen && $gameScreen.zoomScale && $gameScreen.zoomScale()) || 1;
            return Math.abs(px - x) <= $gameMap.screenTileX() / 2 / z + 1 && Math.abs(py - y) <= $gameMap.screenTileY() / 2 / z + 1;
        },
        /** Free to be pulled into a battle: on the map, nothing going on. */
        free() {
            return SceneManager._scene instanceof Scene_Map && !SceneManager.isSceneChanging() && !$gameMap.isEventRunning() && !$gameMessage.isBusy()
                && !$gamePlayer.isTransferring() && !$gameParty.inBattle() && !this.on && !Night.fishing() && !Scenes.holding;
        },
        fieldable() { return this.active() && !this.on && !this.pulledWait; },
        /** command301 of an ordinary battle: false = wait (a moment) for whoever is near to join. */
        fieldReady(interp, params) {
            const now = Date.now(); let d = interp._coopDuel;
            if (!d) {
                const tid = params[0] === 0 ? params[1] : params[0] === 1 ? $gameVariables.value(params[1]) : $gamePlayer.makeEncounterTroopId();
                d = interp._coopDuel = { at: now, tid, field: true };
                const pk = Pack.find(interp._eventId, tid); d.tx = pk.tx;          // other monsters closing in on me join this fight
                const m = $gameMap.mapId(), x = $gamePlayer.x, y = $gamePlayer.y;
                const others = new Set([Net.hostId].concat(Array.from(Net.peers.keys()))); others.delete(Net.selfId);
                if (!$dataTroops[tid] || !Array.from(others).some(id => this.near(m, x, y, id))) { d.solo = true; return true; }   // nobody near: as before
                this.want = null;
                this.send({ t: 'BREADY', f: 1, tr: tid, tx: d.tx, snap: this.snap(), m, x, y, esc: params[2] ? 1 : 0, lose: params[3] ? 1 : 0 });
            }
            if (d.solo) return true;
            if (Net.isHost) this.checkGather();
            if (this.want) { const go = this.want; this.want = null; this.setup(go); return true; }
            if (now - d.at > this.FIELD_MS + 4000) { d.solo = true; Diag.log('warn', 'battle: no answer from the host, fighting alone'); return true; }
            this.waitingFor = 'the others';
            return false;
        },
        /** Someone near me was attacked: in if I'm free (my character goes to the host), else no. */
        pulled(m) {
            if (!this.free() || this.pulledWait) { this.send({ t: 'BNO' }); return; }
            this.pulledWait = { at: Date.now(), by: m.by };
            this.send({ t: 'BREADY', f: 1, pulled: 1, tr: m.tr, snap: this.snap(), m: $gameMap.mapId() });
        },
        /** Map frame: the host's go for a battle I was pulled into: start it here. */
        tick() {
            const w = this.pulledWait; if (!w) return;
            const go = this.want;
            if (!go) { if (Date.now() - w.at > this.FIELD_MS + 3000) this.pulledWait = null; return; }
            this.want = null; this.pulledWait = null;
            if (go.kind !== 'field' || !go.order.includes(Net.selfId)) return;
            if (!this.free()) { this.send({ t: 'BBAIL', bid: go.seed }); return; }   // something started meanwhile: the others guard for me
            this.setup(go);
            if (!this.on) return;
            Chat.system(Net.nameOf(go.lead) + ' was attacked: you join the fight!');
            Pack.pending = Pack.clean(go.tx);
            BattleManager.setup(go.tr, false, !!go.lose);
            $gamePlayer.makeEncounterCount();
            SceneManager.push(Scene_Battle);
        },
        closeStory() {
            const g = this.gather; if (!g) return;
            const here = [Net.selfId].concat(Array.from(Net.peers.keys()).filter(id => { const p = Net.peers.get(id); return p && !p.loading && p.state && p.state.map === g.m; }));
            const all = here.every(id => g.snaps.has(id));
            if (!all && Date.now() - g.at < this.READY_MS) return;
            const order = [Net.selfId].concat(Array.from(Net.peers.values()).sort((a, b) => (a.slot || 9) - (b.slot || 9)).map(p => p.id)).filter(id => g.snaps.has(id));
            const snaps = {}; order.forEach(id => { snaps[id] = g.snaps.get(id); });
            this.gather = null;
            this.launch(order, snaps, g.tr, { kind: 'boss' }, true);
        },
        // ---- the party ----
        guestData(gid) {
            if (!$dataActors[gid]) { const d = JSON.parse(JSON.stringify($dataActors[1])); d.id = gid; $dataActors[gid] = d; }
        },
        setup(go) {
            const order = go.order.filter(id => typeof go.snaps[id] === 'string');
            if (!order.includes(Net.selfId) || order.length < 2) return;
            this.saved = $gameParty._actors.slice();
            this.ids = new Map(); let k = 0;
            order.forEach(id => {
                if (id === Net.selfId) { this.ids.set(id, 1); return; }
                const gid = this.GUEST_BASE + (k++);
                let a = null;
                try { a = JsonEx.parse(go.snaps[id]); } catch (e) { a = null; }
                if (!a || !(a instanceof Game_Actor)) return;
                this.guestData(gid);
                a._actorId = gid; a._coopGuest = id;
                a._name = cleanStr(a._name, 24) || Net.nameOf(id);
                a._coopVars = this.VARS.map((v, k) => k < 3 ? 0 : (Array.isArray(a._coopVars) && isNum(a._coopVars[k], -1e6, 1e6) ? Number(a._coopVars[k]) : 0));   // a battle starts with no Swift/Lethal/Defensive
                this.apFix(a, a._coopMaxAp); delete a._coopMaxAp;
                $gameActors._data[gid] = a;
                this.ids.set(id, gid);
            });
            this.order = order.filter(id => this.ids.has(id));
            $gameParty._actors = this.order.map(id => this.ids.get(id));
            this.seed = go.seed; this.rand = mulberry32(go.seed >>> 0); this.n = 0; this.done = 0; this.queue.clear(); this.hist.clear();
            this.actions = 0; this.idleAt = 0; this.idleC = 0; this.idleSince = Date.now(); this.lifeLogged = '';   // every game counts this battle's actions from 0: the check compares the same moment
            this.kind = go.kind === 'field' ? 'field' : 'boss';
            this.gold = this.kind === 'field' ? go.lead === Net.selfId : !!(Story.run && Story.run.lead === Net.selfId);
            this.hpRate = this.kind === 'boss' && isInt(go.pc, 1, 8) ? 1 + this.HP_PER_PLAYER * (go.pc - 1) : 1;   // the boss grows with the world, not the fight
            this.dmgRate = this.kind === 'boss' && isInt(go.pc, 1, 8) ? 1 + this.DMG_PER_PLAYER * this.difficultyRate() * (go.pc - 1) : 1;   // and hits a little harder, as the difficulty says (decision 79)
            this.out = new Set(); this.autoAsked = new Map(); this.voteAsk = null; this.fleeMine = null; this.note = '';
            this.helpScopes();
            this.on = true;
            Diag.log('info', (this.kind === 'boss' ? 'boss battle together (boss HP x' + this.hpRate + ', damage x' + Math.round(this.dmgRate * 1000) / 1000 + '): ' : 'battle together: ') + this.order.map(id => id === Net.selfId ? (Net.isHost ? hostName(Net) : Net.name) : Net.nameOf(id)).join(', '));
        },
        finish() {
            if (!this.on) return;
            this.unloadVars(); this.restoreScopes(); this.ally = null; this.targetActor = null; this.hpRate = 1; this.dmgRate = 1; this.voteAsk = null; this.fleeMine = null;
            this.send({ t: 'BEND', bid: this.seed });
            this.on = false; this.actingAs = null;
            $gameParty._actors = this.saved && this.saved.length ? this.saved : [1];
            this.ids.forEach(gid => { if (gid !== 1) delete $gameActors._data[gid]; });
            this.ids = new Map(); this.queue.clear(); this.hist.clear(); this.order = [];
            const me = $gameActors.actor(1); if (me) me._coopPending = false;
        },
        isGuest(b) { return !!b && b.isActor && b.isActor() && !!b._coopGuest; },
        local() { return $gameActors.actor(1); },
        memberIndex(b) { return $gameParty.battleMembers().indexOf(b); },
        // ---- rolls ----
        /** The player whose hero is battle member mi (the turn order every game shares). */
        ownerOf(actor) { const mi = $gameParty.battleMembers().indexOf(actor); return mi >= 0 ? this.order[mi] || null : null; },
        /** The players' turn starts (WTE_CustomAPEngine's CE3744): each hero rolls its own player's fighter perk for +1 AP. */
        turnStartPerks(ceId) {
            const ce = window.$dataCommonEvents && $dataCommonEvents[ceId];
            if (!ce) return;
            const chances = [];
            ce.list.forEach((c, i) => {
                const m = c.code === 111 && c.parameters[0] === 12 && /isProfessionPerkActive\(\s*['"](.+?)['"]\s*\)/.exec(String(c.parameters[1]));
                if (!m) return;
                const roll = ce.list.slice(i + 1, i + 4).find(x => x.code === 111 && x.parameters[0] === 1 && x.parameters[1] === 2 && x.parameters[2] === 0);
                if (roll) chances.push({ name: m[1], pct: Number(roll.parameters[3]) || 0 });
            });
            this.roll(() => {
                $gameParty.battleMembers().forEach(a => {
                    if (!a || !a.isAlive()) return;
                    const names = Perks.namesFor(this.ownerOf(a)), c = names && chances.find(x => names.includes(x.name));
                    if (!c || Math.randomInt(100) + 1 > c.pct) return;
                    if (window.$gameSwitches) $gameSwitches.setValue(2975, true);           // "Item AP Added", as WTE's +1 AP does
                    a._wteCurrentAp = (a._wteCurrentAp || 0) + 1;
                    a.addState(210);
                    if (typeof a.setupTextPopup === 'function') { try { a.setupTextPopup('+1 AP!', { textColor: '#4e93f7', flashColor: [0, 0, 0, 100], flashDuration: 30 }); } catch (e) { /* the popup is optional */ } }
                    try { AudioManager.playSe({ name: 'Chime5', volume: 100, pitch: 150, pan: 0 }); } catch (e) { /* optional */ }
                });
            }, null, []);
            if (BattleManager.wteSyncApVariables) BattleManager.wteSyncApVariables();
        },
        roll(fn, self, args) {
            if (!this.on || !this.rand) return fn.apply(self, args);
            const saved = Math.random; Math.random = this.rand;
            try { return fn.apply(self, args); } finally { Math.random = saved; }
        },
        // ---- choices: mine to the host, everyone's from the host in one order ----
        /** My character finished choosing (the battle's own input): send it, hold it until the host's turn order says go. */
        chose(actor) {
            const a = actor.currentAction() || (actor._actions && actor._actions[0]);
            if (this.kind === 'field' && this.isFlee(a) && !actor._coopFleeOk) {   // fleeing: everyone has to agree first
                actor._coopPending = true; this.fleeMine = { at: Date.now() };
                this.send({ t: 'BFLEE', bid: this.seed });
                return;
            }
            actor._coopFleeOk = false;
            const item = a && a.item();
            const act = { t: 'BACT', bid: this.seed, mi: this.memberIndex(actor), k: a && a.isSkill() ? 's' : 'i', i: item ? item.id : 0, tg: a ? a._targetIndex : -1 };
            actor._coopPending = true;
            this.send(act);
            this.waitingFor = '';
        },
        hostAct(from, m) {
            const b = this.nums.get(m.bid); if (!b) return;
            const mi = b.order.indexOf(from);
            if (mi < 0 || m.mi !== mi || !['s', 'i'].includes(m.k) || !isInt(m.i, 0, 9999) || !isInt(m.tg, -1, 99)) return;
            this.number(m.bid, b, { mi, k: m.k, i: m.i, tg: m.tg });
        },
        /** Every battle frame: carry out the next numbered action once that character is ready for it here. */
        pump() {
            if (!this.on) return;
            this.askAuto();
            this.idleCheck();
            for (;;) {
                const d = this.queue.get(this.done + 1);
                if (!d) return;
                const b = $gameParty.battleMembers()[d.mi];
                if (!b) { this.queue.delete(d.n); this.done = d.n; continue; }
                if (!(b.isTpbCharged() || b._coopPending) || BattleManager._actionBattlers.includes(b) || BattleManager._subject === b) return;   // not its turn here yet
                const a = new Game_Action(b);
                if (d.k === 's') a.setSkill(d.i); else a.setItem(d.i);
                a.setTarget(d.tg);
                b._actions = [a]; b._coopPending = false;
                if (BattleManager._currentActor === b) { BattleManager._currentActor = null; BattleManager._inputting = false; }
                b.setActionState('waiting');
                b.startTpbAction();
                BattleManager._actionBattlers.push(b);
                this.queue.delete(d.n); this.done = d.n;
            }
        },
        /** A player who left (or could not join after all) keeps guarding: ask the host for it, once per turn. */
        askAuto() {
            this.order.forEach((id, mi) => {
                if (id === Net.selfId || (Net.peers.has(id) && !this.out.has(id))) return;
                const b = $gameParty.battleMembers()[mi];
                if (!b || !b.isTpbCharged() || b.isDead() || this.autoAsked.get(mi) === this.done) return;
                if (Array.from(this.queue.values()).some(d => d.mi === mi && d.n > this.done)) return;
                this.autoAsked.set(mi, this.done);
                this.send({ t: 'BAUTO', bid: this.seed, mi, d: this.done });
            });
        },
        // ---- every action compared with the host's ----
        state() {
            return BattleManager.allBattleMembers().map(b => [b.hp, b.mp, b.tp, b._states.slice().sort((x, y) => x - y).join('.'), b._buffs.join('.'), b._wteCurrentAp || 0]);
        },
        afterAction() {
            if (!this.on) return;
            this.actions = (this.actions || 0) + 1;
            const s = this.state(), h = hash32(JSON.stringify(s)) >>> 0;
            if (Net.isHost) { this.hist.set(this.actions, s); if (this.hist.size > 40) this.hist.delete(this.hist.keys().next().value); }
            else Net.send(Net.hostId, { t: 'BHASH', bid: this.seed, c: this.actions, h });
        },
        /** Who is down, between actions as well: a team's turn end (regeneration, damage over time) changes HP on each
         *  game's own clock with no action after it to be checked, and a game that thinks a fallen player is still up
         *  waits for them to choose. (2026-11-03: a player was down on the host and at 7 HP on the other game.) Now and
         *  then, while nothing acts, the others send who is down here; the host answers only a difference in that. */
        downMask() { return BattleManager.allBattleMembers().map(b => b.isDead() ? 1 : 0).join(''); },
        idleCheck() {
            if (Net.isHost) return;
            const now = Date.now();
            if (BattleManager._subject || BattleManager._actionBattlers.length || BattleManager._phase === 'action' || this.idleC !== this.actions) { this.idleC = this.actions; this.idleSince = now; return; }
            if (now - this.idleAt < this.IDLE_MS) return;
            this.idleAt = now;
            Net.send(Net.hostId, { t: 'BLIFE', bid: this.seed, c: this.actions, d: this.downMask(), w: Math.min(now - this.idleSince, 600000) });
        },
        /** Host: someone's game has a different idea of who is down. At the same point in the battle, or stuck waiting
         *  for 4 s while I went on (it waits for someone who fell here), it gets those players' numbers. */
        hostLife(from, m) {
            if (!this.on || m.bid !== this.seed || !this.order.includes(from) || m.d === this.downMask()) return;
            if (!(m.c === this.actions || (m.c < this.actions && m.w >= this.STUCK_MS))) return;
            Net.send(from, { t: 'BFIX', bid: m.bid, c: m.c, b: this.state(), life: 1 });
            const key = m.c + ':' + m.d; if (this.lifeLogged !== key) { this.lifeLogged = key; Diag.log('warn', 'battle: ' + Net.nameOf(from) + ' saw someone up who is down here (or the other way round), corrected'); }
        },
        hostCompare(from, c, h, seed) {
            if (!this.on || seed !== this.seed || !this.order.includes(from)) return;   // a battle I'm not in: no check
            const s = this.hist.get(c);
            if (!s || (hash32(JSON.stringify(s)) >>> 0) === h) return;
            Net.send(from, { t: 'BFIX', bid: seed, c, b: s });
            Diag.log('warn', 'boss battle: ' + Net.nameOf(from) + ' differed after action ' + c + ', corrected');
        },
        fix(m) {
            if (!this.on || !Array.isArray(m.b) || m.bid !== this.seed) return;
            if (m.c !== this.actions || BattleManager._subject || BattleManager._phase === 'action') return;   // moved on since: stale numbers would undo newer ones (bring back someone who fell); the next check sends fresh ones
            const all = BattleManager.allBattleMembers();
            m.b.forEach((v, i) => {
                const b = all[i]; if (!b || !Array.isArray(v)) return;
                const down = String(v[3] || '').split('.').map(Number).includes(b.deathStateId());
                if (m.life && down === b.isDead()) return;   // who is down: only those it differs for
                b._hp = Math.max(0, Number(v[0]) || 0); b._mp = Math.max(0, Number(v[1]) || 0); b._tp = Math.max(0, Number(v[2]) || 0);
                b._states = String(v[3] || '').split('.').filter(Boolean).map(Number).filter(n => isInt(n, 1, 9999) && (n !== b.deathStateId() || !b.isAlive()));   // falling here comes from the HP below: refresh() makes them fall properly (no turn, no choosing)
                const bf = String(v[4] || '').split('.').map(Number); if (bf.length === 8) b._buffs = bf;
                if (isInt(v[5], 0, 99)) b._wteCurrentAp = v[5];
                b.refresh();
                if (down && !b.isDead()) b.addNewState(b.deathStateId());   // a fall this game would refuse outside an action: the host's word
            });
        },
        text() {
            if (!this.on) return '';
            if (this.fleeMine) return 'Asking everyone to flee…';
            if (this.note && Date.now() < this.noteUntil) return this.note;
            return this.local() && this.local()._coopPending ? 'Waiting for the others…' : '';
        },
        // ---- fleeing together (decision 63) ----
        isFlee(a) { const it = a && a.item(); return !!it && a.isSkill() && it.id === this.FLEE_SKILL; },
        say(s) { this.note = s; this.noteUntil = Date.now() + 4500; },
        toPlayer(id, msg) { if (id === Net.selfId) this.onClient(msg); else Net.send(id, msg); },
        /** Host: someone asks to flee. A second asker at the same time just counts as a yes. */
        hostFlee(from, m) {
            const b = this.nums.get(m.bid); if (!b || !b.order.includes(from)) return;
            if (b.vote) { b.vote.yes.add(from); this.voteCheck(m.bid, b); return; }
            const need = b.order.filter(id => !b.out.has(id) && !b.ended.has(id) && (id === Net.selfId || Net.peers.has(id)));
            b.vote = { by: from, yes: new Set([from]), need, at: Date.now() };
            need.forEach(id => { if (id !== from) this.toPlayer(id, { t: 'BFLEEASK', bid: m.bid, by: from }); });
            this.voteCheck(m.bid, b);
        },
        hostFleeAnswer(from, m) {
            const b = this.nums.get(m.bid), v = b && b.vote;
            if (!v || !v.need.includes(from)) return;
            if (!m.yes) { this.voteDone(m.bid, b, false, from); return; }
            v.yes.add(from); this.voteCheck(m.bid, b);
        },
        /** Everyone still in the battle said yes (someone who left doesn't hold it up). */
        voteCheck(bid, b) {
            const v = b.vote; if (!v) return;
            if (v.need.every(id => v.yes.has(id) || b.out.has(id) || (id !== Net.selfId && !Net.peers.has(id)))) this.voteDone(bid, b, true, '');
            else if (Date.now() - v.at > this.VOTE_MS) this.voteDone(bid, b, false, '');
        },
        voteDone(bid, b, ok, no) {
            const v = b.vote; b.vote = null;
            const res = { t: 'BFLEERES', bid, ok: ok ? 1 : 0, by: v.by, no: no || '' };
            b.order.forEach(id => { if (!b.out.has(id)) this.toPlayer(id, res); });
        },
        /** A player's game: asked to vote, or the outcome. */
        onClient(m) {
            if (!this.on || m.bid !== this.seed) return;
            if (m.t === 'BFLEEASK') { this.voteAsk = { by: m.by, at: Date.now() }; return; }
            if (m.t !== 'BFLEERES') return;
            this.voteAsk = null;
            const me = this.fleeMine && this.local();
            if (me) {
                this.fleeMine = null;
                if (m.ok && m.by === Net.selfId) { me._coopFleeOk = true; this.chose(me); }   // agreed: my Flee goes ahead, as WTE's own
                else { me._coopPending = false; me.clearActions(); me.makeActions(); me.setActionState('undecided'); }   // my turn back
            }
            const who = id => id === Net.selfId ? 'You' : Net.nameOf(id);
            this.say(m.ok ? 'Everyone agreed: ' + (m.by === Net.selfId ? 'you try' : who(m.by) + ' tries') + ' to flee!' : m.no ? who(m.no) + (m.no === Net.selfId ? ' chose' : ' chooses') + ' to keep fighting.' : 'Not everyone answered: the fight goes on.');
        },
        answer(yes) { this.voteAsk = null; this.send({ t: 'BFLEEANS', bid: this.seed, yes: yes ? 1 : 0 }); },
        // ---- each player's own battle counters (decision 61) ----
        VARS: [1012, 1013, 1014, 322, 323, 324, 325, 326, 327, 328, 1468, 1624],   // Swift, Lethal, Defensive; curse stacks; double guard; ring
        swapped: null, mine: null, ui: false, ally: null, allyGift: false,
        readVars() { return this.VARS.map(i => $gameVariables.value(i)); },
        writeVars(v) { this.VARS.forEach((id, k) => { $gameVariables._data[id] = v && v[k] !== undefined ? v[k] : 0; }); },   // no change hooks: these never leave this game
        /** "Actor 1" of the current action: who acts, or who receives a gift, or the player an enemy hits. */
        as() { return (this.allyGift && this.ally) || this.actingAs || this.targetActor || null; },
        /** The counters of the player this action is about go into the variables (mine are kept aside). */
        loadVars(who) {
            if (this.swapped || !who || !this.isGuest(who)) return;
            this.mine = this.readVars(); this.writeVars(who._coopVars); this.swapped = who;
        },
        unloadVars() {
            if (!this.swapped) return;
            this.swapped._coopVars = this.readVars(); this.writeVars(this.mine); this.swapped = null; this.mine = null;
        },
        // ---- gifts: food, potions and Mending can be given to another player (these battles only) ----
        HELP_SKILLS: [23, 52],                                            // Greater and Lesser Mending
        scoped: [],
        helpScopes() {
            this.restoreScopes();
            $dataItems.forEach(it => { if (it && it.scope === 11 && (it.occasion === 0 || it.occasion === 1)) { it.scope = 7; this.scoped.push(it); } });
            this.HELP_SKILLS.forEach(i => { const s = $dataSkills[i]; if (s && s.scope === 11) { s.scope = 7; this.scoped.push(s); } });
        },
        restoreScopes() { this.scoped.forEach(it => { it.scope = 11; }); this.scoped = []; },
        // ---- actions per turn: each player's as their own game counts them (some of WTE's bonuses count only for "the player") ----
        maxAp: null,
        apFix(a, base) { a._coopApFix = this.maxAp && isNum(base, 0, 99) ? base - this.maxAp.call(a) : 0; },
        reset() { this.finish(); this.gather = null; this.fgather = null; this.want = null; this.pulledWait = null; this.nums.clear(); this.actions = 0; }
    };

    // ---- monsters that close in together fight together (user, 2026-11-01: two monsters attacked, the battle had one) ----
    //      When a monster catches a player in co-op, up to 2 more that are hunting within 3 tiles join: each brings a group
    //      from this area's encounters (WTE's own "same as random encounter"), added to the troop in every game in the same
    //      order. A win defeats them all (A, shared); a loss sends them back to wandering. ----
    const Pack = {
        MAX_EXTRA: 2, NEAR: 3, MAX_ENEMIES: 8,
        pending: [],                  // troops to add at the next Game_Troop.setup (this game)
        fighting: null,               // my fight's extra monsters: { m, xe: [event ids] }
        clean(tx) { return Array.isArray(tx) ? tx.filter(t => isInt(t, 1, 9999) && !![t]).slice(0, this.MAX_EXTRA) : []; },
        /** The monster e0 caught me: the others hunting near me, nearest first, each with a group of this area's. */
        find(e0, tid) {
            const out = { tx: [] };
            if (!Mobs.active() || !window.$gameMap || !Mobs.isMob($gameMap.event(e0))) return out;
            const m = $gameMap.mapId(), px = $gamePlayer.x, py = $gamePlayer.y, dist = ev => Math.abs(ev.x - px) + Math.abs(ev.y - py);
            const near = $gameMap.events().filter(ev => {
                const e = ev.eventId();
                if (e === e0 || !Mobs.isMob(ev) || $gameSelfSwitches.value([m, e, 'A'])) return false;              // the one that caught me / a defeated one
                if (Mobs.busy(m, e) && !Mobs.owns(m, e)) return false;                                          // someone else's (hunting or fighting them)
                if (Math.max(Math.abs(ev.x - px), Math.abs(ev.y - py)) > this.NEAR) return false;
                return Mobs.stateOf(m, e) >= 1 || dist(ev) <= 1;                                                // hunting me, or right beside me
            }).sort((a, b) => dist(a) - dist(b)).slice(0, this.MAX_EXTRA);
            const xe = [];
            near.forEach(ev => { const t = $gamePlayer.makeEncounterTroopId() || tid; if ($dataTroops[t]) { out.tx.push(t); xe.push(ev.eventId()); } });
            if (xe.length) {
                this.fighting = { m, xe };
                xe.forEach(e => Mobs.fight(m, e, true));                                                         // theirs to nobody else meanwhile
                Diag.log('info', 'battle: ' + xe.length + ' more monster(s) closing in join the fight');
            }
            return out;
        },
        /** Game_Troop.setup: the joined groups' enemies, then everyone spread out so none stand on another. */
        append(troop, tx) {
            const add = [];
            tx.forEach(t => ($dataTroops[t].members || []).forEach(mb => { if ($dataEnemies[mb.enemyId] && !mb.hidden) add.push(mb); }));
            const room = this.MAX_ENEMIES - troop._enemies.length; if (room <= 0 || !add.length) return;
            add.slice(0, room).forEach(mb => troop._enemies.push(new Game_Enemy(mb.enemyId, mb.x, mb.y)));
            const w = (window.Graphics && Graphics.boxWidth) || 816;
            troop._enemies.slice().sort((a, b) => a._screenX - b._screenX).forEach((en, i, all) => { en._screenX = Math.round(w * (i + 1) / (all.length + 1)); });
            troop._enemies.forEach(en => { en._letter = ''; en._plural = false; }); troop._namesCount = {}; troop.makeUniqueNames();
        },
        /** My fight is over: the monsters that joined are defeated with it, or wander again. */
        done(won) {
            const f = this.fighting; this.fighting = null; if (!f) return;
            f.xe.forEach(e => {
                if (won) {
                    // as WTE's own fight event leaves the monster that caught the player (CE527): its respawn stamp (self
                    // variable 25 = the respawn counter V340, else its "defeated" page brings it straight back), the chase
                    // cleared, then defeated (A: sent to everyone with its own values)
                    if ($gameVariables.setSelfValue) { $gameVariables.setSelfValue([f.m, e, 25], $gameVariables.value(340)); $gameVariables.setSelfValue([f.m, e, Mobs.STATE_VAR], 0); }
                    ['B', 'D'].forEach(c => $gameSelfSwitches.setValue([f.m, e, c], false));
                    $gameSelfSwitches.setValue([f.m, e, 'A'], true);
                }
                Mobs.fight(f.m, e, false);
            });
            if (won && window.$gameMap && $gameMap.mapId() === f.m) f.xe.forEach(e => { const ev = $gameMap.event(e); if (ev) ev.refresh(); });
            Diag.log('info', 'battle: the ' + f.xe.length + ' monster(s) that joined ' + (won ? 'are defeated too' : 'wander again'));
        },
        reset() { this.pending = []; this.fighting = null; }
    };
    // ---- afflictions outlast a fall (user, 2026-11-01): in co-op, a player who falls with debuffs is revived with them
    //      (their turns and stacks too) until cured the way the game allows (an item, a skill, rest). Death normally clears
    //      every state; VisuStella's own <No Death Clear> check is where a debuff is kept. Buffs still end with a fall. ----
    const Afflict = {
        SEALS: [42, 44, 54],          // seal a skill type / a skill / equipment
        cache: new Map(),
        /** A state that harms: lowers a stat, makes you miss, take more or drains, seals, or stops you acting (by its traits;
         *  WTE's scripted ones like Poison and Stun by their tooltip's red, or their name). */
        isDebuff(st) {
            if (!st || st.id === 1 || !st.iconIndex) return false;                                    // 1: death itself
            if (this.cache.has(st.id)) return this.cache.get(st.id);
            let bad = st.restriction > 0, good = false;
            const mark = harm => { if (harm) bad = true; else good = true; };
            (st.traits || []).forEach(tr => {
                if (tr.code === 21 && tr.value !== 1) mark(tr.value < 1);                                // a stat lowered / raised
                if (tr.code === 22 && tr.value !== 0) mark(tr.value < 0);                                // hit, evasion, regeneration ...
                if (tr.code === 23 && tr.dataId > 0 && tr.value !== 1) mark([4, 5, 8].includes(tr.dataId) ? tr.value > 1 : tr.value < 1);   // costs, floor damage up; guard, recovery, EXP, WTE's damage (6, 7: "+15% Damage") down (not the target rate: Provoke)
                if (tr.code === 11 && tr.value !== 1) mark(tr.value > 1);                                // weak / resistant to an element
                if (this.SEALS.includes(tr.code)) mark(true);
            });
            if (/^(poison|toxic|burn|bleed|curse|stun|frozen|paraly)/i.test(st.name || '')) bad = true;   // WTE's scripted ones (no traits)
            bad = bad && !good;                                                                         // a boon with a drawback (a god's favor, a meal) is no curse
            this.cache.set(st.id, bad);
            return bad;
        },
        keeps(b, st) { return Net.isPlaying() && !!b && b.isActor && b.isActor() && this.isDebuff(st); }
    };
    if (typeof Game_BattlerBase !== 'undefined') {
        const _canClear = Game_BattlerBase.prototype.canClearState;
        if (_canClear) Game_BattlerBase.prototype.canClearState = function (state) {
            if (this._coopFalling && Afflict.keeps(this, state)) return false;                        // kept through the fall
            return _canClear.apply(this, arguments);
        };
        const _die = Game_BattlerBase.prototype.die;
        Game_BattlerBase.prototype.die = function () {
            const lowered = Net.isPlaying() && this.isActor && this.isActor() ? this._buffs.map((v, i) => v < 0 ? [i, v, this._buffTurns[i]] : null).filter(Boolean) : [];
            this._coopFalling = true;
            try { return _die.apply(this, arguments); }
            finally { this._coopFalling = false; lowered.forEach(([i, v, n]) => { this._buffs[i] = v; this._buffTurns[i] = n; }); }   // a lowered stat stays lowered too
        };
    }

    if (typeof BattleManager !== 'undefined') {
        // the moment the battle ends (not when the map is back: a joined monster still hunting beside the player would catch
        // them again in the first frame and start a new fight). Won = every enemy down and the party not (WTE ends won fights
        // with Abort Battle, so the result code alone doesn't say).
        const _endPack = BattleManager.endBattle;
        BattleManager.endBattle = function (result) {
            try { if (Pack.fighting) Pack.done($gameTroop.isAllDead() && !$gameParty.isAllDead()); } catch (e) { Diag.err('the monsters that joined', e); }
            return _endPack.apply(this, arguments);
        };
    }
    if (typeof Game_Troop !== 'undefined') {
        const _troopSetup = Game_Troop.prototype.setup;
        Game_Troop.prototype.setup = function (troopId) {
            const r = _troopSetup.apply(this, arguments);
            const tx = Pack.pending; Pack.pending = [];
            if (tx.length) { try { Pack.append(this, tx); } catch (e) { Diag.err('the monsters that joined', e); } }
            return r;
        };
    }

    if (typeof BattleManager !== 'undefined' && typeof Game_Action !== 'undefined') {
        // the battle's own rolls: one seeded stream in every game
        [[Game_Action.prototype, 'apply'], [Game_Action.prototype, 'makeTargets'], [Game_Enemy.prototype, 'makeActions'], [Game_Troop.prototype, 'updateInterpreter'], [Game_Troop.prototype, 'makeDropItems'], [Game_Battler.prototype, 'onBattleStart']].forEach(([o, k]) => {
            const fn = o[k]; if (typeof fn !== 'function') return;
            o[k] = function () { return Duel.roll(fn, this, arguments); };
        });
        // profession perks in a battle together (decision 90): the acting hero's own player's perks; the turn-start AP per hero
        if (typeof Game_System !== 'undefined' && typeof Game_System.prototype.isProfessionPerkActive === 'function') {
            const _perkActive = Game_System.prototype.isProfessionPerkActive;
            Game_System.prototype.isProfessionPerkActive = function (name, perk) {
                const s = Duel.on && BattleManager._subject;
                if (s && s.isActor && s.isActor()) {
                    const names = Perks.namesFor(Duel.ownerOf(s));
                    // ("Skill", "Perk") since WTE 26409135; a player whose list has no "Skill/Perk" entries: by the perk's name
                    if (names) return perk === undefined ? names.includes(name) : (names.includes(name + '/' + perk) || (!names.some(x => x.includes('/')) && names.includes(perk)));
                }
                return _perkActive.apply(this, arguments);
            };
        }
        if (typeof Game_Troop !== 'undefined' && typeof PluginManager !== 'undefined') {
            const turnCe = Number((PluginManager.parameters('WTE_CustomAPEngine') || {}).PlayerTurnStartCE) || 0;
            const _setupBattleEvent = Game_Troop.prototype.setupBattleEvent;
            Game_Troop.prototype.setupBattleEvent = function () {
                const q = BattleManager._wteQueuedTurnStartCE, mine = Duel.on && turnCe > 0 && q === turnCe;
                if (mine) BattleManager._wteQueuedTurnStartCE = 0;                   // co-op plays it per hero (below)
                const r = _setupBattleEvent.apply(this, arguments);
                if (mine) {
                    if (this._interpreter.isRunning()) BattleManager._wteQueuedTurnStartCE = q;   // a battle event first: next time
                    else if (!$gameParty.isAllDead() && !$gameTroop.isAllDead()) Duel.turnStartPerks(q);
                }
                return r;
            };
        }
        // perk stat bonuses in a battle together (decision 91): each hero's stats with its own player's bonuses
        if (typeof Game_BattlerBase !== 'undefined' && typeof Game_System !== 'undefined' && typeof Game_System.prototype.getStatModifier === 'function') {
            const withOwnersMods = (battler, fn) => {
                if (!Duel.on || !battler || !battler.isActor || !battler.isActor() || !window.$gameSystem) return fn();
                const owner = Duel.ownerOf(battler);
                if (!owner || owner === Net.selfId) return fn();
                const m = Perks.modsFor(owner) || { s: {}, c: {} }, sys = $gameSystem, s0 = sys._wteStatModifiers, c0 = sys._wteScalingStatMods;
                sys._wteStatModifiers = m.s; sys._wteScalingStatMods = m.c;
                try { return fn(); } finally { sys._wteStatModifiers = s0; sys._wteScalingStatMods = c0; }
            };
            ['paramPlus', 'paramRate', 'xparam', 'sparam'].forEach(fn => {
                const o = Game_BattlerBase.prototype[fn];
                if (o) Game_BattlerBase.prototype[fn] = function () { return withOwnersMods(this, () => o.apply(this, arguments)); };
            });
        }
        // equipment upgrades in a battle together (decision 91): another player's hero with that player's upgrades
        if (typeof Game_Actor !== 'undefined') {
            const otherOwner = a => { if (!Duel.on || !a || !a.isActor || !a.isActor()) return null; const o = Duel.ownerOf(a); return o && o !== Net.selfId ? o : null; };
            const _apPlus = Game_Actor.prototype.paramPlus;
            Game_Actor.prototype.paramPlus = function (paramId) {
                const v = _apPlus.apply(this, arguments), owner = otherOwner(this);
                if (!owner) return v;
                let d = 0; this.equips().forEach(it => { if (it && Array.isArray(it.params)) { const o = Upgrades.asOwnerHas(owner, it); d += (o.params[paramId] || 0) - (it.params[paramId] || 0); } });
                return v + d;
            };
            const _apTraits = Game_Actor.prototype.traitObjects;
            Game_Actor.prototype.traitObjects = function () {
                const l = _apTraits.apply(this, arguments), owner = otherOwner(this);
                return owner ? l.map(o => Upgrades.asOwnerHas(owner, o)) : l;
            };
        }
        // the target window works while the others' actions play (decision 91 too): see the header
        if (typeof Window_BattleEnemy !== 'undefined' && typeof Window_Selectable !== 'undefined') {
            const cmdActive = () => { const sc = SceneManager._scene; return !!(sc && sc._actorCommandWindow && sc._actorCommandWindow.active); };
            const _enemySelect = Window_BattleEnemy.prototype.select;
            Window_BattleEnemy.prototype.select = function (index) {
                if (Duel.on && index >= 0 && !cmdActive() && BattleManager.isBusy()) {
                    Window_Selectable.prototype.select.call(this, index);
                    if (typeof $gameTroop.select === 'function') $gameTroop.select(this.enemy());
                    return;
                }
                return _enemySelect.apply(this, arguments);
            };
            const _enemyTouch = Window_BattleEnemy.prototype.processTouch;
            Window_BattleEnemy.prototype.processTouch = function () {
                if (Duel.on && this.active && !cmdActive()) return Window_Selectable.prototype.processTouch.call(this);
                return _enemyTouch.apply(this, arguments);
            };
            if (typeof Scene_Battle !== 'undefined') {
                const _startEnemySel = Scene_Battle.prototype.startEnemySelection;
                Scene_Battle.prototype.startEnemySelection = function () {
                    const r = _startEnemySel.apply(this, arguments);
                    const w = this._enemyWindow;
                    if (Duel.on && w && w.index() < 0 && w.maxItems() > 0) {          // opened while busy: put the cursor on someone
                        const last = $gameTroop._dmLastTargetedEnemyIndex !== undefined ? $gameTroop.members()[$gameTroop._dmLastTargetedEnemyIndex] : null;
                        const i = last && last.isAlive() ? $gameTroop.aliveMembers().indexOf(last) : -1;
                        w.select(i >= 0 ? i : 0);
                    }
                    return r;
                };
            }
        }
        // my choice goes to the host; nobody else's character opens a command window here
        const _finishInput = BattleManager.finishActorInput;
        BattleManager.finishActorInput = function () {
            const a = this._currentActor;
            if (Duel.on && a && !Duel.isGuest(a)) { Duel.chose(a); a.setActionState('waiting'); return; }
            return _finishInput.call(this);
        };
        const _change = BattleManager.changeCurrentActor;
        BattleManager.changeCurrentActor = function (forward) { Duel.selecting = Duel.on; try { return _change.call(this, forward); } finally { Duel.selecting = false; } };
        const _canInput = Game_Battler.prototype.canInput;
        Game_Battler.prototype.canInput = function () {
            if (Duel.selecting && this.isActor() && (Duel.isGuest(this) || this._coopPending)) return false;
            return _canInput.call(this);
        };
        const _partyInput = BattleManager.isPartyTpbInputtable;
        BattleManager.isPartyTpbInputtable = function () {
            if (!Duel.on) return _partyInput.call(this);
            const me = Duel.local();
            return !!me && $gameParty.battleMembers().includes(me) && !me._coopPending && me.canInput() && this.isTpbMainPhase();
        };
        const _timeout = Game_Battler.prototype.isTpbTimeout;
        Game_Battler.prototype.isTpbTimeout = function () { return Duel.on ? false : _timeout.call(this); };   // nobody's turn runs out while someone chooses
        const _canEscape = BattleManager.canEscape;
        BattleManager.canEscape = function () { return Duel.on ? false : _canEscape.call(this); };
        // the numbered actions, every frame
        const _bmUpdate = BattleManager.update;
        BattleManager.update = function () { Duel.pump(); return _bmUpdate.apply(this, arguments); };
        // during an action, "actor 1" is whoever acts (or is hit); "the whole party" is only them
        const _startAction = BattleManager.startAction;
        BattleManager.startAction = function () {
            if (Duel.on) { const s = this._subject; Duel.actingAs = s && s.isActor() ? s : null; Duel.targetActor = null; Duel.ally = null; Duel.allyGift = false; }
            const r = _startAction.call(this);
            if (Duel.on) {
                const hit = (this._targets || []).filter(b => b && b.isActor && b.isActor());
                if (!Duel.actingAs) Duel.targetActor = hit[0] || null;      // an enemy's action: "the player" is the one it hits
                else if (hit.length === 1 && hit[0] !== Duel.actingAs) {    // a player helps another: animations go to them; a gift's effects too
                    Duel.ally = hit[0];
                    const a = this._action; Duel.allyGift = !!(a && a.isItem && a.isItem());
                }
                Duel.loadVars(Duel.as());
            }
            return r;
        };
        const _endAction = BattleManager.endAction;
        BattleManager.endAction = function () {
            const r = _endAction.call(this);
            if (Duel.on) { Duel.unloadVars(); Duel.actingAs = null; Duel.targetActor = null; Duel.ally = null; Duel.allyGift = false; Duel.afterAction(); }
            return r;
        };
        const _actor = Game_Actors.prototype.actor;
        Game_Actors.prototype.actor = function (id) {
            if (id === 1 && Duel.on && !Duel.partyList && !Duel.ui) { const who = Duel.as(); if (who) return who; }
            return _actor.call(this, id);
        };
        const _allMembers = Game_Party.prototype.allMembers;
        Game_Party.prototype.allMembers = function () { Duel.partyList = true; try { return _allMembers.call(this); } finally { Duel.partyList = false; } };   // the party itself is never remapped
        const _iterateActorId = Game_Interpreter.prototype.iterateActorId;
        Game_Interpreter.prototype.iterateActorId = function (param, callback) {
            if (Duel.on && param === 0 && Duel.as()) { callback(Duel.as()); return; }
            return _iterateActorId.call(this, param, callback);
        };
        // a stand-in's items are its player's: never taken from this game's bag, always usable
        const _consume = Game_Battler.prototype.consumeItem;
        Game_Battler.prototype.consumeItem = function (item) { if (Duel.on && Duel.isGuest(this)) return; return _consume.call(this, item); };
        const _meetsItem = Game_BattlerBase.prototype.meetsItemConditions;
        Game_BattlerBase.prototype.meetsItemConditions = function (item) { if (Duel.on && Duel.isGuest(this)) return this.meetsUsableItemConditions(item); return _meetsItem.call(this, item); };
        // the gold once (the scene's lead), everyone's own EXP and items
        const _gainGold = BattleManager.gainGold;
        BattleManager.gainGold = function () { if (Duel.on && !Duel.gold) return; return _gainGold.call(this); };
        const _endBattle = BattleManager.endBattle;
        BattleManager.endBattle = function (result) { const r = _endBattle.call(this, result); Duel.finish(); return r; };
        // a player who has spent their actions waits for the next player phase. (WTE lets them charge again while a
        // teammate still has actions; each game would do that at its own pace, while someone elsewhere is choosing.)
        const _charge = Game_Battler.prototype.updateTpbChargeTime;
        Game_Battler.prototype.updateTpbChargeTime = function () {
            if (Duel.on && this.isActor() && BattleManager._wteLastTeamActive === 'player' && !this._wteTurnActive && !(this._wteCurrentAp > 0)) return;
            return _charge.call(this);
        };
        if (Game_BattlerBase.prototype.wteGetMaxAp) {
            const _maxAp = Duel.maxAp = Game_BattlerBase.prototype.wteGetMaxAp;
            Game_BattlerBase.prototype.wteGetMaxAp = function () { const v = _maxAp.call(this); return Duel.on && this._coopApFix ? Math.max(0, v + this._coopApFix) : v; };
        }
        // no fleeing from a big moment's boss (decision 63)
        const _meetsSkill = Game_BattlerBase.prototype.meetsSkillConditions;
        Game_BattlerBase.prototype.meetsSkillConditions = function (skill) {
            if (Duel.on && Duel.kind === 'boss' && skill && skill.id === Duel.FLEE_SKILL) return false;
            return _meetsSkill.call(this, skill);
        };
        // someone asks to flee: a question in front of whatever I was doing; my windows come back after
        class Window_CoopVote extends Window_Command {
            makeCommandList() { this.addCommand('Flee together', 'yes'); this.addCommand('Keep fighting', 'no'); }
        }
        Scene_Battle.prototype.openCoopVote = function (ask) {
            const w = 420, qh = this.calcWindowHeight(1, false), ch = this.calcWindowHeight(2, true), x = Math.round((Graphics.boxWidth - w) / 2), y = 230;
            const q = new Window_Base(new Rectangle(x, y, w, qh));
            q.drawText((ask.by === Net.selfId ? 'You' : Net.nameOf(ask.by)) + ' wants to flee.', 0, 0, q.innerWidth, 'center');
            const c = new Window_CoopVote(new Rectangle(x, y + qh, w, ch));
            const done = yes => { Duel.answer(yes); this.closeCoopVote(); };
            c.setHandler('yes', () => done(true)); c.setHandler('no', () => done(false)); c.setHandler('cancel', () => done(false));
            this._coopVoteWas = this._windowLayer.children.filter(win => win.active);
            this._coopVoteWas.forEach(win => win.deactivate());
            this.addWindow(q); this.addWindow(c); c.select(0); c.activate();
            this._coopVote = c; this._coopVoteQ = q;
        };
        Scene_Battle.prototype.closeCoopVote = function () {
            [this._coopVote, this._coopVoteQ].forEach(win => { if (win && win.parent) win.parent.removeChild(win); });
            (this._coopVoteWas || []).forEach(win => { if (win.visible && win.isOpen()) win.activate(); });
            this._coopVote = null; this._coopVoteQ = null; this._coopVoteWas = null;
        };
        const _sbUpdate = Scene_Battle.prototype.update;
        Scene_Battle.prototype.update = function () {
            _sbUpdate.call(this);
            if (Duel.voteAsk && !this._coopVote && !$gameMessage.isBusy()) this.openCoopVote(Duel.voteAsk);
            else if (!Duel.voteAsk && this._coopVote) this.closeCoopVote();   // decided without me (time ran out, or someone said no)
        };
        // a big moment's boss has more HP with every player in the world (decision 62)
        const _paramBase = Game_Enemy.prototype.paramBase;
        Game_Enemy.prototype.paramBase = function (paramId) {
            const v = _paramBase.call(this, paramId);
            return paramId === 0 && Duel.on && Duel.hpRate > 1 ? Math.round(v * Duel.hpRate) : v;
        };
        // ...and its hits on the heroes grow a little with each player too, as the difficulty says (decision 79)
        const _mdv = Game_Action.prototype.makeDamageValue;
        Game_Action.prototype.makeDamageValue = function (target, critical) {
            const v = _mdv.call(this, target, critical);
            const s = this.subject();
            return Duel.on && Duel.dmgRate > 1 && v > 0 && s && s.isEnemy() && target && target.isActor() ? Math.round(v * Duel.dmgRate) : v;
        };
        // Revive: back up with half HP and half AP (a turn this phase if it's the players' phase)
        const _apply = Game_Action.prototype.apply;
        Game_Action.prototype.apply = function (target) {
            const wasDead = !!target && target.isDead();
            const r = _apply.call(this, target);
            if (Revive.is(this.item()) && target && target.isActor()) Revive.after(target, wasDead);
            return r;
        };
        // the screen (windows, HUD, faces) always shows this player's own character and counters, even mid-action
        const _updateChildren = Scene_Base.prototype.updateChildren;
        Scene_Base.prototype.updateChildren = function () {
            if (!Duel.on || !(this instanceof Scene_Battle)) return _updateChildren.call(this);
            const who = Duel.swapped;
            if (who) { who._coopVars = Duel.readVars(); Duel.writeVars(Duel.mine); }
            Duel.ui = true;
            try { return _updateChildren.call(this); } finally { Duel.ui = false; if (who) Duel.writeVars(who._coopVars); }
        };
        // the other players: a row of small walking models instead of big faces over the HUD (decision 61)
        const Panel = {
            // on my portrait (bottom right), the first partner right above it and the next ones higher up, their right edges on
            // the portrait's: a little wider than it (their own width, not a column of pictures); never over WTE's enemy bars
            // (bottom left, in columns of three) nor my own HUD (user, 2026-11-01)
            X: 1199 - 140, TOP: 536, W: 140, H: 62, GAP: 12, ICON: 16,   // slim cards, clear of my portrait and of each other (user, 2026-11-01: "more slim with spacing")
            others() { return $gameParty.battleMembers().filter(a => Duel.isGuest(a)); },
            slotY(k) { return this.TOP - this.H - k * (this.H + this.GAP); },      // upwards from my portrait
            slotCenter(a) { return this.others().indexOf(a) < 0 ? null : this.X + this.W / 2; },
            /** What this player is doing now, as this game sees it. */
            status(a) {
                if (a.isDead()) return 'down';
                if (BattleManager._subject === a) return 'act';
                const mi = $gameParty.battleMembers().indexOf(a);
                if (Array.from(Duel.queue.values()).some(d => d.mi === mi)) return 'ready';
                if (BattleManager._wteLastTeamActive !== 'enemy' && a.isTpbCharged && a.isTpbCharged() && a.canMove()) return 'choose';
                return '';
            },
            /** Their own look: the composite sheet their game sends for the map (their character sheet if none yet). */
            look(a) {
                const p = Net.peers.get(a._coopGuest), st = p && p.state, cn = st && typeof st.cn === 'string' ? st.cn : a.characterName();
                const ci = st && isInt(st.ci, 0, 7) ? st.ci : a.characterIndex();
                let bmp = null;
                try { const layers = p && p.looks && p.looks[cn]; bmp = layers ? Looks.bitmapFor(p.id, cn, layers) : (st && st.cn ? Looks.baseBitmap(cn) : ImageManager.loadCharacter(cn)); } catch (e) { bmp = null; }
                if (!(p && p.looks && p.looks[cn]) && /__PROXY$/.test(cn)) {      // no look for this sheet: their last real one, never the grey proxy sheet
                    const any = p && p.looks && Object.keys(p.looks).find(k => p.looks[k]);
                    try { bmp = any ? Looks.bitmapFor(p.id, any, p.looks[any]) : null; } catch (e) { bmp = null; }
                    return { bmp, cn: any || cn, ci };
                }
                return { bmp: bmp || ImageManager.loadCharacter(a.characterName()), cn, ci };
            }
        };
        class Sprite_CoopMember extends Sprite {
            constructor(actor) {
                super(); this._actor = actor; this._key = ''; this._lift = 0; this._pop = 0; this._was = ''; this._tick = 0;
                this._bg = new Sprite(new Bitmap(Panel.W, Panel.H)); this.addChild(this._bg);
                this._model = new Sprite(); this._model.anchor.x = 0.5; this._model.anchor.y = 1; this._model.x = 24; this._model.y = Panel.H - Panel.ICON - 3; this.addChild(this._model);
                this._text = new Sprite(new Bitmap(Panel.W - 50, Panel.H)); this._text.x = 48; this.addChild(this._text);
                this._icons = new Sprite(new Bitmap(Panel.W - 8, Panel.ICON)); this._icons.x = 4; this._icons.y = Panel.H - Panel.ICON - 2; this.addChild(this._icons); this._iconKey = '';
            }
            update() {
                super.update();
                const a = this._actor, st = Panel.status(a), aw = SceneManager._scene && SceneManager._scene._actorWindow;
                const picked = !!(aw && aw.active && aw.actor && aw.actor(aw.index()) === a);
                const turn = st === 'act' || st === 'choose';
                if (turn && this._was !== st) this._pop = 14;               // pops up when their turn starts
                this._was = st; this._tick++;
                this.updateModel(turn, st === 'down');
                const key = [a.name(), a.hp, a.mhp, a.mp, a.mmp, st, picked].join('|');
                if (key !== this._key) { this._key = key; this.redraw(a, st, picked, turn); }
                this.updateIcons(a);
            }
            updateModel(turn, down) {
                if (!this._look || this._tick % 60 === 1) this._look = Panel.look(this._actor);   // their look, checked now and then
                const m = this._model, l = this._look, b = l.bmp;
                if (m.bitmap !== b) m.bitmap = b;
                if (!b || !b.isReady() || !b.width) return;
                const big = ImageManager.isBigCharacter(l.cn), pw = b.width / (big ? 3 : 12), ph = b.height / (big ? 4 : 8);
                const bx = big ? 0 : (l.ci % 4) * 3 * pw, by = big ? 0 : Math.floor(l.ci / 4) * 4 * ph;
                const pattern = turn ? [0, 1, 2, 1][Math.floor(this._tick / 9) % 4] : 1;   // walking in place on their turn
                m.setFrame(bx + pattern * pw, by, pw, ph);
                this._lift += ((turn ? 6 : 0) - this._lift) * 0.25;
                if (this._pop > 0) this._pop--;
                const s = Math.min(2, 40 / ph) * (1 + Math.sin(this._pop / 14 * Math.PI) * 0.25);
                m.scale.x = m.scale.y = s;
                m.y = Panel.H - Panel.ICON - 3 - this._lift;          // standing above the icon row
                m.opacity = down ? 110 : turn ? 255 : 200;
                m.setColorTone(down ? [0, 0, 0, 255] : [0, 0, 0, 0]);
            }
            /** Their afflictions (and boosts), as WTE's own icons: everyone sees who was hit by what. */
            updateIcons(a) {
                const icons = a.stateIcons ? a.stateIcons().filter(i => i > 0) : [], key = icons.join(',');   // states only: WTE changes stats through states, and its icon sheet has its own art where RPG Maker keeps the buff/debuff arrows (a fishing pole)
                const set = ImageManager.loadSystem('IconSet');
                if (key === this._iconKey || !set.isReady()) return;
                this._iconKey = key;
                const b = this._icons.bitmap, s = Panel.ICON, iw = ImageManager.iconWidth, ih = ImageManager.iconHeight, per = Math.floor(b.width / (s + 2));
                b.clear();
                icons.slice(0, per).forEach((i, k) => b.blt(set, (i % 16) * iw, Math.floor(i / 16) * ih, iw, ih, k * (s + 2), 0, s, s));
                if (icons.length > per) { b.fontSize = 13; b.drawText('+' + (icons.length - per + 1), b.width - s - 2, 0, s + 2, s, 'center'); }
            }
            redraw(a, st, picked, turn) {
                const g = this._bg.bitmap, w = Panel.W, h = Panel.H;
                g.clear();
                g.fillRect(0, 0, w, h, picked ? '#7fe3ff' : turn ? '#e8c35a' : '#5a5560');
                g.fillRect(1, 1, w - 2, h - 2, turn ? 'rgba(48,36,12,0.72)' : 'rgba(12,10,16,0.6)');   // see-through: the monster behind still shows
                const c = this._text.bitmap, tw = c.width;
                c.clear(); c.fontFace = $gameSystem.mainFontFace(); c.outlineWidth = 3; c.outlineColor = 'rgba(0,0,0,0.85)';
                c.fontSize = 15; c.textColor = '#ffffff'; c.drawText(a.name(), 0, 0, tw, 18, 'left');
                const bar = (y, hgt, rate, col) => { c.fillRect(0, y, tw - 2, hgt, '#1b1820'); c.fillRect(0, y, Math.round((tw - 2) * Math.max(0, Math.min(1, rate))), hgt, col); };
                bar(20, 6, a.mhp ? a.hp / a.mhp : 0, '#c8323c');
                c.fontSize = 12; c.drawText(a.hp + '/' + a.mhp, 0, 25, tw - 2, 13, 'right');
                bar(38, 4, a.mmp ? a.mp / a.mmp : 0, '#2fb3a8');
                const act = picked && BattleManager.inputtingAction(), label = picked ? (act && act.isItem() ? '◀ give to' : '◀ target') : { act: 'acting', choose: 'choosing…', ready: 'ready', down: 'down' }[st] || '';
                c.fontSize = 11; c.textColor = picked ? '#7fe3ff' : turn ? '#ffd76a' : '#bdb6c4'; c.drawText(label, 0, 1, tw - 2, 16, 'right');   // beside the name
            }
        }
        class Sprite_CoopPanel extends Sprite {
            constructor() {
                super(); this._rows = [];
                this._note = new Sprite(new Bitmap(320, 22)); this._note.y = -24; this.addChild(this._note); this._noteText = null;
                this.x = Panel.X; this.y = 0;
            }
            update() {
                const list = Panel.others();
                if (this._rows.length !== list.length || this._rows.some((r, k) => r._actor !== list[k])) {
                    this._rows.forEach(r => { this.removeChild(r); r.destroy({ children: true }); });
                    this._rows = list.map((a, k) => { const r = new Sprite_CoopMember(a); r.y = Panel.slotY(k); this.addChild(r); return r; });
                    this._note.x = Panel.W - 320; this._note.y = Panel.slotY(Math.max(0, list.length - 1)) - 24;   // above the top card, right-aligned
                }
                super.update();
                const note = Duel.text();
                if (note !== this._noteText) {
                    this._noteText = note; const b = this._note.bitmap; b.clear();
                    if (note) { b.fontFace = $gameSystem.mainFontFace(); b.fontSize = 15; b.outlineWidth = 3; b.drawText(note, 0, 0, 318, 22, 'right'); }
                }
            }
        }
        const _createAllWindows = Scene_Battle.prototype.createAllWindows;
        Scene_Battle.prototype.createAllWindows = function () {
            _createAllWindows.call(this);
            if (!Duel.on) return;
            this._coopPanel = new Sprite_CoopPanel();
            const i = this.children.indexOf(this._windowLayer);
            if (i >= 0) this.addChildAt(this._coopPanel, i); else this.addChild(this._coopPanel);   // under the windows: a skill list covers it
        };
        // VisuStella's faces: only mine, where it is in a game of one; the others' (hidden) stand over their models, so
        // their damage numbers and the target cursor appear there
        if (typeof Sprite_FvUiStatus !== 'undefined') {
            const faceX = sp => {
                const a = Duel.on && sp.actor && sp.actor(), win = sp._parentWindow;
                if (!a || !win) return null;
                if (!Duel.isGuest(a)) return sp._startingPosition === 'right' ? win.width - ImageManager.faceWidth / 2 - (Sprite_FvUiStatus.START_BUFFER_X || 0) : null;
                const gx = Panel.slotCenter(a), wt = win.worldTransform;
                return gx === null ? null : Math.round((gx - wt.tx) / (wt.a || 1));
            };
            ['startingPositionX', 'targetPositionX'].forEach(k => {
                const fn = Sprite_FvUiStatus.prototype[k]; if (typeof fn !== 'function') return;
                Sprite_FvUiStatus.prototype[k] = function () { const x = faceX(this); return x === null ? fn.apply(this, arguments) : x; };
            });
            const _fvUpdate = Sprite_FvUiStatus.prototype.update;
            Sprite_FvUiStatus.prototype.update = function () {
                _fvUpdate.apply(this, arguments);
                if (!Duel.on) return;
                const a = this.actor && this.actor();
                if (a && Duel.isGuest(a)) { this.visible = false; const x = faceX(this); if (x !== null) this.x = x; }
            };
        }
        const _terminate = Scene_Battle.prototype.terminate;
        Scene_Battle.prototype.terminate = function () { const r = _terminate.call(this); Duel.finish(); return r; };   // won, lost or aborted: the party is this player's own again
    }

    // ---- mysteries: each player investigates each one once a day (decision 71) ----
    const Mysteries = {
        EFFECT_CE: 19, TEMPLATE_CE: 187, ces: null,
        /** The mysteries: common events that open with WTE's mystery effect (not the template). */
        list() {
            if (!this.ces && window.$dataCommonEvents) this.ces = new Set($dataCommonEvents.filter(c => c && c.id !== this.TEMPLATE_CE && (c.list || []).some(x => x.code === 117 && x.parameters[0] === this.EFFECT_CE)).map(c => c.id));
            return this.ces || new Set();
        },
        /** A map event that runs a mystery. */
        event(d) { const l = this.list(); return l.size > 0 && d.pages.some(p => (p.list || []).some(c => c.code === 117 && l.has(c.parameters[0]))); },
        /** A spawned mystery on this map (the Honey Trees): the tree is the world's, what I did with it today is mine. */
        spawnedHere(m, e) {
            const ev = window.$gameMap && $gameMap.mapId() === m && $gameMap.event(e);
            if (!ev || !ev.isSpawnEvent) return false;
            if (!window.$dataMap || !$dataMap.events) return false;              // the map is still loading
            if (ev._coopMyst === undefined) { const d = ev.event(); ev._coopMyst = !!d && Array.isArray(d.pages) && this.event(d); }
            return ev._coopMyst;
        }
    };

    // ---- time in the Void: it stands still only while every player is there (decision 71) ----
    const VoidClock = {
        MAP: 109, hold: false,
        /** Host: is everyone in the world (who has finished loading) in the Void right now? */
        allIn() {
            if (!Net.isHost || !window.$gameMap || $gameMap.mapId() !== this.MAP) return false;
            return Array.from(Net.peers.values()).filter(p => p && !p.loading).every(p => p.state && p.state.map === this.MAP);
        },
        update() {
            const h = this.allIn();
            if (h !== this.hold) { this.hold = h; Diag.log('info', h ? 'everyone is in the Void: time stands still' : 'time runs again (not everyone is in the Void)'); }
        }
    };

    // ---- doors one player opened are open for everyone (decision 70) ----
    const Gates = {
        // the flag behind each door, and whether it lasts (an area opened) or is today's (the news)
        FLAGS: [{ k: 'S276', s: 276 }, { k: 'V660', v: 660, min: 3 }, { k: 'V628', v: 628, min: 3 }, { k: 'V672', v: 672, min: 2 }, { k: 'S59', s: 59, today: true }, { k: 'S1870', s: 1870 },
                // met a villager (Sam, Alice, Ellie, Josh, Edwin, Blorph, Celeste, Tanner, Molly): where they stand, for everyone
                ...[142, 143, 144, 145, 146, 147, 148, 149, 150].map(s => ({ k: 'S' + s, s, place: true }))],
        EVENTS: new Set(["32,28","32,29","32,30","32,31","37,2","40,69","74,53","92,40","160,270","160,271","160,272","160,273","160,274","160,275","160,277","180,53"].concat(['283,4'])),           // the doors (map,event) those flags open (tools/gate-scan.js; + the Stone Tower's 5F)
        list: {}, lastSent: '', lastCheck: 0, opening: false, placing: false,
        reset() { this.list = {}; this.lastSent = ''; this.lastCheck = 0; this.opening = false; this.placing = false; },   // a session ended (decision 90)
        world() { const s = window.$gameSystem; if (!s) return {}; if (!s._coopGates || typeof s._coopGates !== 'object') s._coopGates = {}; return s._coopGates; },
        all() { return Net.isHost ? this.world() : this.list; },
        today() { return window.$gameVariables ? $gameVariables.value(250) | 0 : 0; },
        mine(f) { return f.s ? !!$gameSwitches._data[f.s] : (Number($gameVariables._data[f.v]) || 0) >= f.min; },
        /** Opened by someone in the world (for today's flags: today). */
        open(f) { const x = this.all()[f.k]; return f.today ? x === this.today() : !!x; },
        tick(now) {
            if (!Net.isPlaying() || !window.$gameSwitches || now - this.lastCheck < 3000) return;
            this.lastCheck = now;
            const have = this.FLAGS.filter(f => this.mine(f)).map(f => f.k), key = have.join(',') + '@' + this.today();
            if (have.length && key !== this.lastSent) { this.lastSent = key; this.send({ t: 'GATE', l: have, day: this.today() }); }
            if (Net.isHost && now - (this.lastBroadcast || 0) > 10000) { this.lastBroadcast = now; Net.broadcast({ t: 'GATES', w: this.world() }); }
        },
        send(m) { if (Net.isHost) this.onHost(m); else Net.send(Net.hostId, m); },
        onHost(m) {
            const w = this.world(); let changed = false;
            (m.l || []).forEach(k => { const f = this.FLAGS.find(x => x.k === k); if (!f) return; const v = f.today ? m.day : 1; if (w[k] !== v) { w[k] = v; changed = true; } });
            if (changed) { this.lastBroadcast = 0; Diag.log('info', 'doors opened for everyone: ' + Object.keys(w).join(', ')); }
        },
        /** One of those doors (or a villager's schedule), evaluated as if the world's flags were mine. */
        override(id, kind, real) {
            const f = this.FLAGS.find(x => (kind === 's' ? x.s === id : x.v === id) && (x.place ? this.placing : this.opening));
            if (!f || !this.open(f)) return real;
            return kind === 's' ? true : Math.max(Number(real) || 0, f.min);
        }
    };

    // ---- villagers: one place for everyone; the introduction comes on a player's first talk (decision 70) ----
    const Intros = {
        DATA: {"142":{"m":1,"e":1,"k":6,"name":"Sam (Regular Schedule)","ce":2253,"list":[{"code":117,"indent":0,"parameters":[2253]},{"code":117,"indent":0,"parameters":[1061]},{"code":205,"indent":0,"parameters":[0,{"list":[{"code":25,"indent":null},{"code":0}],"repeat":false,"skippable":false,"wait":true}]},{"code":505,"indent":0,"parameters":[{"code":25,"indent":null}]},{"code":101,"indent":0,"parameters":["",0,0,2,"Sam"]},{"code":401,"indent":0,"parameters":["Oh, hi."]},{"code":101,"indent":0,"parameters":["",0,0,2,"Sam"]},{"code":401,"indent":0,"parameters":["My name's Sam."]},{"code":101,"indent":0,"parameters":["",0,0,2,"Sam"]},{"code":401,"indent":0,"parameters":["I think we may have gone to school together, but I can't remember..."]},{"code":101,"indent":0,"parameters":["",0,0,2,"Sam"]},{"code":401,"indent":0,"parameters":["I have a tendency to get sort of... lost."]},{"code":111,"indent":0,"parameters":[0,142,1]},{"code":357,"indent":1,"parameters":["EliMZ_ChoiceManager","cmd_setupByTemplate","Setup By Template",{"id":"left"}]},{"code":657,"indent":1,"parameters":["Template Id = left"]},{"code":101,"indent":1,"parameters":["",0,0,2,"Sam"]},{"code":401,"indent":1,"parameters":["Do you ever feel that way?"]},{"code":102,"indent":1,"parameters":[["Yes","No"],1,0,1,0]},{"code":402,"indent":1,"parameters":[0,"Yes"]},{"code":122,"indent":2,"parameters":[424,424,1,0,5]},{"code":121,"indent":2,"parameters":[499,499,0]},{"code":101,"indent":2,"parameters":["",0,0,2,"Sam"]},{"code":401,"indent":2,"parameters":["Oh, that's good to hear."]},{"code":101,"indent":2,"parameters":["",0,0,2,"Sam"]},{"code":401,"indent":2,"parameters":["I'm glad I'm not alone."]},{"code":101,"indent":2,"parameters":["",0,0,2,"Sam"]},{"code":401,"indent":2,"parameters":["Here. When I get lost, this helps me snap back to my senses."]},{"code":357,"indent":2,"parameters":["VisuMZ_3_MsgLetterSounds","MsgSoundResetMessageSound","Message Sound: Reset",{}]},{"code":250,"indent":2,"parameters":[{"name":"Chime2","volume":70,"pitch":50,"pan":0}]},{"code":128,"indent":2,"parameters":[458,0,0,1,false]},{"code":101,"indent":2,"parameters":["",0,0,2,""]},{"code":401,"indent":2,"parameters":["Found \\c[12]Seeker's Orb"]},{"code":121,"indent":2,"parameters":[142,142,0]},{"code":0,"indent":2,"parameters":[]},{"code":402,"indent":1,"parameters":[1,"No"]},{"code":122,"indent":2,"parameters":[424,424,1,0,5]},{"code":121,"indent":2,"parameters":[499,499,0]},{"code":101,"indent":2,"parameters":["",0,0,2,"Sam"]},{"code":401,"indent":2,"parameters":["That's good. The world wouldn't work if we were all so scattered."]},{"code":101,"indent":2,"parameters":["",0,0,2,"Sam"]},{"code":401,"indent":2,"parameters":["If I feel myself wandering aimlessly, I'll look to people like you to find my way back."]},{"code":101,"indent":2,"parameters":["",0,0,2,"Sam"]},{"code":401,"indent":2,"parameters":["Here, this should help if you need to get lost for a change."]},{"code":357,"indent":2,"parameters":["VisuMZ_3_MsgLetterSounds","MsgSoundResetMessageSound","Message Sound: Reset",{}]},{"code":250,"indent":2,"parameters":[{"name":"Chime2","volume":70,"pitch":50,"pan":0}]},{"code":128,"indent":2,"parameters":[459,0,0,1,false]},{"code":101,"indent":2,"parameters":["",0,0,2,""]},{"code":401,"indent":2,"parameters":["Found \\c[12]Wanderer's Orb"]},{"code":121,"indent":2,"parameters":[142,142,0]},{"code":357,"indent":2,"parameters":["VisuMZ_3_MsgLetterSounds","MsgSoundChangeMessageSound","Message Sound: Change",{"name:str":"Speech1","Interval:num":"7","volume:num":"75","VolVariance:num":"10","pitch:num":"150","PitchVariance:num":"20","pan:num":"0","PanVariance:num":"0"}]},{"code":657,"indent":2,"parameters":["Filename = Speech1"]},{"code":657,"indent":2,"parameters":["Interval = 7"]},{"code":657,"indent":2,"parameters":["Volume = 75"]},{"code":657,"indent":2,"parameters":["Variance = 10"]},{"code":657,"indent":2,"parameters":["Pitch = 150"]},{"code":657,"indent":2,"parameters":["Variance = 20"]},{"code":657,"indent":2,"parameters":["Pan = 0"]},{"code":657,"indent":2,"parameters":["Variance = 0"]},{"code":0,"indent":2,"parameters":[]},{"code":404,"indent":1,"parameters":[]},{"code":101,"indent":1,"parameters":["",0,0,2,"Sam"]},{"code":401,"indent":1,"parameters":["I'll see you around."]},{"code":0,"indent":1,"parameters":[]},{"code":412,"indent":0,"parameters":[]},{"code":117,"indent":0,"parameters":[1062]},{"code":0,"indent":0,"parameters":[]}]},"143":{"m":3,"e":144,"k":2,"name":"Alice (Regular Schedule)","ce":2255,"list":[{"code":117,"indent":0,"parameters":[2255]},{"code":117,"indent":0,"parameters":[1057]},{"code":111,"indent":0,"parameters":[0,143,1]},{"code":101,"indent":1,"parameters":["",0,0,2,"Alice"]},{"code":401,"indent":1,"parameters":["Oh, Hi there."]},{"code":101,"indent":1,"parameters":["",0,0,2,"Alice"]},{"code":401,"indent":1,"parameters":["You seem to be a normal one."]},{"code":101,"indent":1,"parameters":["",0,0,2,"Alice"]},{"code":401,"indent":1,"parameters":["Not everyone around this mall is exactly\\..\\..\\.. right."]},{"code":101,"indent":1,"parameters":["",0,0,2,"Alice"]},{"code":401,"indent":1,"parameters":["Do you come here often? I don't think I've seen you around before."]},{"code":101,"indent":1,"parameters":["",0,0,2,"Alice"]},{"code":401,"indent":1,"parameters":["Of course, maybe we've just missed each other. The town can be a bit unpredictable sometimes."]},{"code":122,"indent":1,"parameters":[422,422,1,0,5]},{"code":121,"indent":1,"parameters":[499,499,0]},{"code":101,"indent":1,"parameters":["",0,0,2,"Alice"]},{"code":401,"indent":1,"parameters":["My name's Alice, pleased to meet you."]},{"code":101,"indent":1,"parameters":["",0,0,2,"Alice"]},{"code":401,"indent":1,"parameters":["Here, maybe this will let us cross paths again sometime."]},{"code":357,"indent":1,"parameters":["VisuMZ_3_MsgLetterSounds","MsgSoundResetMessageSound","Message Sound: Reset",{}]},{"code":250,"indent":1,"parameters":[{"name":"Chime2","volume":70,"pitch":50,"pan":0}]},{"code":128,"indent":1,"parameters":[460,0,0,1,false]},{"code":101,"indent":1,"parameters":["",0,0,2,""]},{"code":401,"indent":1,"parameters":["Found \\c[12]Brass Compass"]},{"code":121,"indent":1,"parameters":[143,143,0]},{"code":0,"indent":1,"parameters":[]},{"code":411,"indent":0,"parameters":[]},{"code":101,"indent":1,"parameters":["",0,0,2,"Alice"]},{"code":401,"indent":1,"parameters":["You seem nice. I hope we'll cross paths again sometime."]},{"code":0,"indent":1,"parameters":[]},{"code":412,"indent":0,"parameters":[]},{"code":117,"indent":0,"parameters":[1058]},{"code":0,"indent":0,"parameters":[]}]},"144":{"m":1,"e":123,"k":4,"name":"Ellie (Mon/Tues/Sat)","ce":2252,"list":[{"code":117,"indent":0,"parameters":[2252]},{"code":111,"indent":0,"parameters":[0,494,0]},{"code":117,"indent":1,"parameters":[1064]},{"code":115,"indent":1,"parameters":[]},{"code":0,"indent":1,"parameters":[]},{"code":412,"indent":0,"parameters":[]},{"code":117,"indent":0,"parameters":[1063]},{"code":111,"indent":0,"parameters":[0,144,1]},{"code":101,"indent":1,"parameters":["",0,0,2,"Ellie"]},{"code":401,"indent":1,"parameters":["Hi!"]},{"code":101,"indent":1,"parameters":["",0,0,2,"Ellie"]},{"code":401,"indent":1,"parameters":["Have we met?!"]},{"code":101,"indent":1,"parameters":["",0,0,2,"Ellie"]},{"code":401,"indent":1,"parameters":["I can't remember!"]},{"code":101,"indent":1,"parameters":["",0,0,2,"Ellie"]},{"code":401,"indent":1,"parameters":["How are you doing?"]},{"code":101,"indent":1,"parameters":["",0,0,2,"Ellie"]},{"code":401,"indent":1,"parameters":["I'm doing pretty well, myself!"]},{"code":101,"indent":1,"parameters":["",0,0,2,"Ellie"]},{"code":401,"indent":1,"parameters":["There's something about waiting for the bus that just amps me right up!"]},{"code":101,"indent":1,"parameters":["",0,0,2,"Ellie"]},{"code":401,"indent":1,"parameters":["There's a real mystery to where I might end up, it gets me so excited!"]},{"code":101,"indent":1,"parameters":["",0,0,2,"Ellie"]},{"code":401,"indent":1,"parameters":["Of course, I could plan my route, but where's the fun in that!"]},{"code":101,"indent":1,"parameters":["",0,0,2,"Ellie"]},{"code":401,"indent":1,"parameters":["I  like to just get on, and see where it takes me!"]},{"code":101,"indent":1,"parameters":["",0,0,2,"Ellie"]},{"code":401,"indent":1,"parameters":["Sometimes the bus even goes somewhere it's not supposed to. That's my favorite!"]},{"code":101,"indent":1,"parameters":["",0,0,2,"Ellie"]},{"code":401,"indent":1,"parameters":["Getting lost out there in the world, and having to find my way back."]},{"code":101,"indent":1,"parameters":["",0,0,2,"Ellie"]},{"code":401,"indent":1,"parameters":["What a thrill!"]},{"code":122,"indent":1,"parameters":[425,425,1,0,5]},{"code":121,"indent":1,"parameters":[499,499,0]},{"code":101,"indent":1,"parameters":["",0,0,2,"Ellie"]},{"code":401,"indent":1,"parameters":["Anyways, I hope you have a good day too!"]},{"code":101,"indent":1,"parameters":["",0,0,2,"Ellie"]},{"code":401,"indent":1,"parameters":["Oh yeah, I found this on the ground."]},{"code":101,"indent":1,"parameters":["",0,0,2,"Ellie"]},{"code":401,"indent":1,"parameters":["You can have it!"]},{"code":357,"indent":1,"parameters":["VisuMZ_3_MsgLetterSounds","MsgSoundResetMessageSound","Message Sound: Reset",{}]},{"code":122,"indent":1,"parameters":[30,30,0,0,10]},{"code":122,"indent":1,"parameters":[31,31,0,0,3]},{"code":250,"indent":1,"parameters":[{"name":"Chime2","volume":70,"pitch":50,"pan":0}]},{"code":117,"indent":1,"parameters":[12]},{"code":121,"indent":1,"parameters":[144,144,0]},{"code":0,"indent":1,"parameters":[]},{"code":411,"indent":0,"parameters":[]},{"code":357,"indent":1,"parameters":["VisuMZ_3_MsgLetterSounds","MsgSoundChangeMessageSound","Message Sound: Change",{"name:str":"Speech1","Interval:num":"7","volume:num":"75","VolVariance:num":"10","pitch:num":"200","PitchVariance:num":"50","pan:num":"0","PanVariance:num":"0"}]},{"code":657,"indent":1,"parameters":["Filename = Speech1"]},{"code":657,"indent":1,"parameters":["Interval = 7"]},{"code":657,"indent":1,"parameters":["Volume = 75"]},{"code":657,"indent":1,"parameters":["Variance = 10"]},{"code":657,"indent":1,"parameters":["Pitch = 200"]},{"code":657,"indent":1,"parameters":["Variance = 50"]},{"code":657,"indent":1,"parameters":["Pan = 0"]},{"code":657,"indent":1,"parameters":["Variance = 0"]},{"code":101,"indent":1,"parameters":["",0,0,2,"Ellie"]},{"code":401,"indent":1,"parameters":["I hope you're having a good day, too!"]},{"code":0,"indent":1,"parameters":[]},{"code":412,"indent":0,"parameters":[]},{"code":117,"indent":0,"parameters":[1064]},{"code":0,"indent":0,"parameters":[]}]},"145":{"m":1,"e":119,"k":6,"name":"Josh (Regular Schedule)","ce":2254,"list":[{"code":117,"indent":0,"parameters":[2254]},{"code":117,"indent":0,"parameters":[1059]},{"code":111,"indent":0,"parameters":[0,145,1]},{"code":101,"indent":1,"parameters":["",0,0,2,"Josh"]},{"code":401,"indent":1,"parameters":["Oh, hey."]},{"code":101,"indent":1,"parameters":["",0,0,2,"Josh"]},{"code":401,"indent":1,"parameters":["I think I've seen you around before. How's it going?"]},{"code":357,"indent":1,"parameters":["EliMZ_ChoiceManager","cmd_setupByTemplate","Setup By Template",{"id":"center"}]},{"code":657,"indent":1,"parameters":["Template Id = center"]},{"code":102,"indent":1,"parameters":[["Things are good","I've been better","I don't want to talk about it"],-1,0,2,0]},{"code":402,"indent":1,"parameters":[0,"Things are good"]},{"code":122,"indent":2,"parameters":[423,423,1,0,5]},{"code":121,"indent":2,"parameters":[499,499,0]},{"code":101,"indent":2,"parameters":["",0,0,2,"Josh"]},{"code":401,"indent":2,"parameters":["That's great to hear. I feel like I hear more bad news than good around here sometimes. It can really get you down."]},{"code":101,"indent":2,"parameters":["",0,0,2,"Josh"]},{"code":401,"indent":2,"parameters":["I hope things keep going well for you. "]},{"code":101,"indent":2,"parameters":["",0,0,2,"Josh"]},{"code":401,"indent":2,"parameters":["Maybe this will keep your good luck going."]},{"code":357,"indent":2,"parameters":["VisuMZ_3_MsgLetterSounds","MsgSoundResetMessageSound","Message Sound: Reset",{}]},{"code":122,"indent":2,"parameters":[30,30,0,0,64]},{"code":122,"indent":2,"parameters":[31,31,0,0,1]},{"code":250,"indent":2,"parameters":[{"name":"Chime2","volume":70,"pitch":50,"pan":0}]},{"code":117,"indent":2,"parameters":[12]},{"code":0,"indent":2,"parameters":[]},{"code":402,"indent":1,"parameters":[1,"I've been better"]},{"code":122,"indent":2,"parameters":[423,423,1,0,5]},{"code":121,"indent":2,"parameters":[499,499,0]},{"code":101,"indent":2,"parameters":["",0,0,2,"Josh"]},{"code":401,"indent":2,"parameters":["Oh. I've been there."]},{"code":101,"indent":2,"parameters":["",0,0,2,"Josh"]},{"code":401,"indent":2,"parameters":["Hopefully things turn around for you soon. Things can't stay the same forever."]},{"code":101,"indent":2,"parameters":["",0,0,2,"Josh"]},{"code":401,"indent":2,"parameters":["Maybe this will help you get through the tough times a little."]},{"code":357,"indent":2,"parameters":["VisuMZ_3_MsgLetterSounds","MsgSoundResetMessageSound","Message Sound: Reset",{}]},{"code":122,"indent":2,"parameters":[30,30,0,0,68]},{"code":122,"indent":2,"parameters":[31,31,0,0,1]},{"code":250,"indent":2,"parameters":[{"name":"Chime2","volume":70,"pitch":50,"pan":0}]},{"code":117,"indent":2,"parameters":[12]},{"code":0,"indent":2,"parameters":[]},{"code":402,"indent":1,"parameters":[2,"I don't want to talk about it"]},{"code":122,"indent":2,"parameters":[423,423,1,0,5]},{"code":121,"indent":2,"parameters":[499,499,0]},{"code":101,"indent":2,"parameters":["",0,0,2,"Josh"]},{"code":401,"indent":2,"parameters":["I get that, no need to talk about it. We barely know each other, after all."]},{"code":101,"indent":2,"parameters":["",0,0,2,"Josh"]},{"code":401,"indent":2,"parameters":["In fact, some folks around here tell me a little TOO much, if you know what I mean."]},{"code":101,"indent":2,"parameters":["",0,0,2,"Josh"]},{"code":401,"indent":2,"parameters":["Thanks for chatting with me, hopefully we can get to know each other a little better someday."]},{"code":101,"indent":2,"parameters":["",0,0,2,"Josh"]},{"code":401,"indent":2,"parameters":["Here's a little something for you. My good deed for the day."]},{"code":101,"indent":2,"parameters":["",0,0,2,"Josh"]},{"code":401,"indent":2,"parameters":["I figure it fits with your \"strong silent type\" vibe."]},{"code":357,"indent":2,"parameters":["VisuMZ_3_MsgLetterSounds","MsgSoundResetMessageSound","Message Sound: Reset",{}]},{"code":122,"indent":2,"parameters":[30,30,0,0,67]},{"code":122,"indent":2,"parameters":[31,31,0,0,1]},{"code":250,"indent":2,"parameters":[{"name":"Chime2","volume":70,"pitch":50,"pan":0}]},{"code":117,"indent":2,"parameters":[12]},{"code":0,"indent":2,"parameters":[]},{"code":404,"indent":1,"parameters":[]},{"code":0,"indent":1,"parameters":[]},{"code":412,"indent":0,"parameters":[]},{"code":121,"indent":0,"parameters":[145,145,0]},{"code":357,"indent":0,"parameters":["VisuMZ_3_MsgLetterSounds","MsgSoundChangeMessageSound","Message Sound: Change",{"name:str":"Speech3","Interval:num":"6","volume:num":"75","VolVariance:num":"10","pitch:num":"80","PitchVariance:num":"10","pan:num":"0","PanVariance:num":"0"}]},{"code":657,"indent":0,"parameters":["Filename = Speech3"]},{"code":657,"indent":0,"parameters":["Interval = 6"]},{"code":657,"indent":0,"parameters":["Volume = 75"]},{"code":657,"indent":0,"parameters":["Variance = 10"]},{"code":657,"indent":0,"parameters":["Pitch = 80"]},{"code":657,"indent":0,"parameters":["Variance = 10"]},{"code":657,"indent":0,"parameters":["Pan = 0"]},{"code":657,"indent":0,"parameters":["Variance = 0"]},{"code":101,"indent":0,"parameters":["",0,0,2,"Josh"]},{"code":401,"indent":0,"parameters":["Hopefully we'll run into each other again sometime."]},{"code":117,"indent":0,"parameters":[1060]},{"code":0,"indent":0,"parameters":[]}]},"146":{"m":32,"e":11,"k":3,"name":"Edwin (Regular Schedule)","ce":2251,"list":[{"code":117,"indent":0,"parameters":[2251]},{"code":117,"indent":0,"parameters":[1065]},{"code":101,"indent":0,"parameters":["",0,0,2,"Edwin"]},{"code":401,"indent":0,"parameters":["Have you ever wondered what came first?"]},{"code":101,"indent":0,"parameters":["",0,0,2,"Edwin"]},{"code":401,"indent":0,"parameters":["The town, or the people?"]},{"code":101,"indent":0,"parameters":["",0,0,2,"Edwin"]},{"code":401,"indent":0,"parameters":["Some think that the town has always been here, long before the first hapless wanderers set foot here, and could not leave..."]},{"code":101,"indent":0,"parameters":["",0,0,2,"Edwin"]},{"code":401,"indent":0,"parameters":["Oh... my name is Edwin. I think I've seen you around before... from afar..."]},{"code":111,"indent":0,"parameters":[2,"C",1]},{"code":122,"indent":1,"parameters":[426,426,1,0,5]},{"code":121,"indent":1,"parameters":[499,499,0]},{"code":101,"indent":1,"parameters":["",0,0,2,"Edwin"]},{"code":401,"indent":1,"parameters":["Here, something to keep you safe."]},{"code":357,"indent":1,"parameters":["VisuMZ_3_MsgLetterSounds","MsgSoundResetMessageSound","Message Sound: Reset",{}]},{"code":250,"indent":1,"parameters":[{"name":"Chime2","volume":70,"pitch":50,"pan":0}]},{"code":128,"indent":1,"parameters":[413,0,0,1,false]},{"code":101,"indent":1,"parameters":["",0,0,2,""]},{"code":401,"indent":1,"parameters":["Found \\c[12]Ancient Coin of Order"]},{"code":121,"indent":1,"parameters":[668,668,0]},{"code":121,"indent":1,"parameters":[146,146,0]},{"code":0,"indent":1,"parameters":[]},{"code":412,"indent":0,"parameters":[]},{"code":123,"indent":0,"parameters":["C",0]},{"code":357,"indent":0,"parameters":["VisuMZ_3_MsgLetterSounds","MsgSoundChangeMessageSound","Message Sound: Change",{"name:str":"Speech4","Interval:num":"8","volume:num":"75","VolVariance:num":"10","pitch:num":"80","PitchVariance:num":"10","pan:num":"0","PanVariance:num":"0"}]},{"code":657,"indent":0,"parameters":["Filename = Speech4"]},{"code":657,"indent":0,"parameters":["Interval = 8"]},{"code":657,"indent":0,"parameters":["Volume = 75"]},{"code":657,"indent":0,"parameters":["Variance = 10"]},{"code":657,"indent":0,"parameters":["Pitch = 80"]},{"code":657,"indent":0,"parameters":["Variance = 10"]},{"code":657,"indent":0,"parameters":["Pan = 0"]},{"code":657,"indent":0,"parameters":["Variance = 0"]},{"code":101,"indent":0,"parameters":["",0,0,2,"Edwin"]},{"code":401,"indent":0,"parameters":["There are strange things lurking in the dark."]},{"code":101,"indent":0,"parameters":["",0,0,2,"Edwin"]},{"code":401,"indent":0,"parameters":["We'll meet again soon."]},{"code":117,"indent":0,"parameters":[1066]},{"code":0,"indent":0,"parameters":[]}]},"147":{"m":84,"e":140,"k":8,"name":"Blorph (Mon-Sun)","ce":2256,"list":[{"code":108,"indent":0,"parameters":["======"]},{"code":408,"indent":0,"parameters":["INTRO"]},{"code":408,"indent":0,"parameters":["======"]},{"code":357,"indent":0,"parameters":["VisuMZ_3_MsgLetterSounds","MsgSoundChangeMessageSound","Message Sound: Change",{"name:str":"Speech7","Interval:num":"5","volume:num":"80","VolVariance:num":"10","pitch:num":"100","PitchVariance:num":"40","pan:num":"0","PanVariance:num":"0"}]},{"code":657,"indent":0,"parameters":["Filename = Speech7"]},{"code":657,"indent":0,"parameters":["Interval = 5"]},{"code":657,"indent":0,"parameters":["Volume = 80"]},{"code":657,"indent":0,"parameters":["Variance = 10"]},{"code":657,"indent":0,"parameters":["Pitch = 100"]},{"code":657,"indent":0,"parameters":["Variance = 40"]},{"code":657,"indent":0,"parameters":["Pan = 0"]},{"code":657,"indent":0,"parameters":["Variance = 0"]},{"code":117,"indent":0,"parameters":[69]},{"code":117,"indent":0,"parameters":[1079]},{"code":111,"indent":0,"parameters":[0,147,1]},{"code":101,"indent":1,"parameters":["",0,0,2,"Blorph"]},{"code":401,"indent":1,"parameters":["Eek!"]},{"code":101,"indent":1,"parameters":["",0,0,2,"Blorph"]},{"code":401,"indent":1,"parameters":["What are you doing in my house?!"]},{"code":357,"indent":1,"parameters":["EliMZ_ChoiceManager","cmd_setupByTemplate","Setup By Template",{"id":"center"}]},{"code":657,"indent":1,"parameters":["Template Id = center"]},{"code":102,"indent":1,"parameters":[["Uhh... Just visiting.","You live in this dump?!"],-1,0,1,0]},{"code":402,"indent":1,"parameters":[0,"Uhh... Just visiting."]},{"code":122,"indent":2,"parameters":[429,429,1,0,5]},{"code":121,"indent":2,"parameters":[499,499,0]},{"code":101,"indent":2,"parameters":["",0,0,2,"Blorph"]},{"code":401,"indent":2,"parameters":["Oh... a visitor... oh my!"]},{"code":101,"indent":2,"parameters":["",0,0,2,"Blorph"]},{"code":401,"indent":2,"parameters":["I... don't get many visitors....!"]},{"code":101,"indent":2,"parameters":["",0,0,2,"Blorph"]},{"code":401,"indent":2,"parameters":["Uhh..."]},{"code":357,"indent":2,"parameters":["EliMZ_ChoiceManager","cmd_setupByTemplate","Setup By Template",{"id":"left"}]},{"code":657,"indent":2,"parameters":["Template Id = left"]},{"code":101,"indent":2,"parameters":["",0,0,2,"Blorph"]},{"code":401,"indent":2,"parameters":["Would you like some tea...?"]},{"code":102,"indent":2,"parameters":[["Yes","No"],1,0,2,0]},{"code":402,"indent":2,"parameters":[0,"Yes"]},{"code":101,"indent":3,"parameters":["",0,0,2,"Blorph"]},{"code":401,"indent":3,"parameters":["Okay\\..\\..\\.. here you go!"]},{"code":357,"indent":3,"parameters":["VisuMZ_3_MsgLetterSounds","MsgSoundResetMessageSound","Message Sound: Reset",{}]},{"code":122,"indent":3,"parameters":[30,30,0,0,120]},{"code":122,"indent":3,"parameters":[31,31,0,0,1]},{"code":250,"indent":3,"parameters":[{"name":"Chime2","volume":70,"pitch":50,"pan":0}]},{"code":117,"indent":3,"parameters":[12]},{"code":357,"indent":3,"parameters":["VisuMZ_3_MsgLetterSounds","MsgSoundChangeMessageSound","Message Sound: Change",{"name:str":"Speech7","Interval:num":"5","volume:num":"80","VolVariance:num":"10","pitch:num":"100","PitchVariance:num":"40","pan:num":"0","PanVariance:num":"0"}]},{"code":657,"indent":3,"parameters":["Filename = Speech7"]},{"code":657,"indent":3,"parameters":["Interval = 5"]},{"code":657,"indent":3,"parameters":["Volume = 80"]},{"code":657,"indent":3,"parameters":["Variance = 10"]},{"code":657,"indent":3,"parameters":["Pitch = 100"]},{"code":657,"indent":3,"parameters":["Variance = 40"]},{"code":657,"indent":3,"parameters":["Pan = 0"]},{"code":657,"indent":3,"parameters":["Variance = 0"]},{"code":101,"indent":3,"parameters":["",0,0,2,"Blorph"]},{"code":401,"indent":3,"parameters":["Uhh..."]},{"code":101,"indent":3,"parameters":["",0,0,2,"Blorph"]},{"code":401,"indent":3,"parameters":["\\..\\..\\..Make yourself at home!"]},{"code":121,"indent":3,"parameters":[147,147,0]},{"code":0,"indent":3,"parameters":[]},{"code":402,"indent":2,"parameters":[1,"No"]},{"code":101,"indent":3,"parameters":["",0,0,2,"Blorph"]},{"code":401,"indent":3,"parameters":["Oh... uhh... okay, well..."]},{"code":101,"indent":3,"parameters":["",0,0,2,"Blorph"]},{"code":401,"indent":3,"parameters":["\\..\\..\\..Make yourself at home!"]},{"code":121,"indent":3,"parameters":[147,147,0]},{"code":0,"indent":3,"parameters":[]},{"code":404,"indent":2,"parameters":[]},{"code":0,"indent":2,"parameters":[]},{"code":402,"indent":1,"parameters":[1,"You live in this dump?!"]},{"code":122,"indent":2,"parameters":[429,429,2,0,5]},{"code":121,"indent":2,"parameters":[498,498,0]},{"code":101,"indent":2,"parameters":["",0,0,2,"Blorph"]},{"code":401,"indent":2,"parameters":["Ahhh!!"]},{"code":101,"indent":2,"parameters":["",0,0,2,"Blorph"]},{"code":401,"indent":2,"parameters":["It's not much, I know..."]},{"code":101,"indent":2,"parameters":["",0,0,2,"Blorph"]},{"code":401,"indent":2,"parameters":["But, it's all I have!"]},{"code":101,"indent":2,"parameters":["",0,0,2,"Blorph"]},{"code":401,"indent":2,"parameters":["Please, uhh..."]},{"code":101,"indent":2,"parameters":["",0,0,2,"Blorph"]},{"code":401,"indent":2,"parameters":["\\..\\..\\..Make yourself at home!"]},{"code":121,"indent":2,"parameters":[147,147,0]},{"code":0,"indent":2,"parameters":[]},{"code":404,"indent":1,"parameters":[]},{"code":0,"indent":1,"parameters":[]},{"code":411,"indent":0,"parameters":[]},{"code":101,"indent":1,"parameters":["",0,0,2,"Blorph"]},{"code":401,"indent":1,"parameters":["Uhh..."]},{"code":101,"indent":1,"parameters":["",0,0,2,"Blorph"]},{"code":401,"indent":1,"parameters":["\\..\\..\\..Make yourself at home!"]},{"code":0,"indent":1,"parameters":[]},{"code":412,"indent":0,"parameters":[]},{"code":357,"indent":0,"parameters":["VisuMZ_3_MsgLetterSounds","MsgSoundResetMessageSound","Message Sound: Reset",{}]},{"code":117,"indent":0,"parameters":[70]},{"code":117,"indent":0,"parameters":[1080]},{"code":0,"indent":0,"parameters":[]}]},"148":{"m":126,"e":109,"k":99,"name":"Celeste","ce":2257,"list":[{"code":108,"indent":0,"parameters":["[size|0|0|0|0|1]"]},{"code":117,"indent":0,"parameters":[2257]},{"code":117,"indent":0,"parameters":[1091]},{"code":121,"indent":0,"parameters":[148,148,0]},{"code":111,"indent":0,"parameters":[2,"A",1]},{"code":123,"indent":1,"parameters":["A",0]},{"code":101,"indent":1,"parameters":["",0,0,2,"Celeste"]},{"code":401,"indent":1,"parameters":["Oh... hi."]},{"code":101,"indent":1,"parameters":["",0,0,2,"Celeste"]},{"code":401,"indent":1,"parameters":["Welcome to the Elderfield Public Library."]},{"code":101,"indent":1,"parameters":["",0,0,2,"Celeste"]},{"code":401,"indent":1,"parameters":["If you're looking to take out a book\\..\\..\\.. good luck."]},{"code":101,"indent":1,"parameters":["",0,0,2,"Celeste"]},{"code":401,"indent":1,"parameters":["The layout of the library is changing by the week, and some of the books are not very friendly."]},{"code":101,"indent":1,"parameters":["",0,0,2,"Celeste"]},{"code":401,"indent":1,"parameters":["If you have any historical questions, Professor Dayton is in his study to the east."]},{"code":101,"indent":1,"parameters":["",0,0,2,"Celeste"]},{"code":401,"indent":1,"parameters":["If you'd prefer not to be trapped for all eternity, I'd suggest staying near the front."]},{"code":101,"indent":1,"parameters":["",0,0,2,"Celeste"]},{"code":401,"indent":1,"parameters":["If you're having trouble finding something\\..\\..\\.. too bad."]},{"code":101,"indent":1,"parameters":["",0,0,2,"Celeste"]},{"code":401,"indent":1,"parameters":["Enjoy your visit."]},{"code":0,"indent":1,"parameters":[]},{"code":411,"indent":0,"parameters":[]},{"code":101,"indent":1,"parameters":["",0,0,2,"Celeste"]},{"code":401,"indent":1,"parameters":["Welcome to the Elderfield Public Library."]},{"code":101,"indent":1,"parameters":["",0,0,2,"Celeste"]},{"code":401,"indent":1,"parameters":["Enjoy your visit..."]},{"code":0,"indent":1,"parameters":[]},{"code":412,"indent":0,"parameters":[]},{"code":117,"indent":0,"parameters":[1092]},{"code":0,"indent":0,"parameters":[]}]}},                                  // intro switch -> the intro event and page (tools/intro-scan.js)
        OVERRIDES_CE: 1020, upd: new WeakMap(),
        /** A villager's schedule page (parallel: on S796, or one that runs Overrides or tests an intro switch): it decides where they stand today. */
        updater(p) {
            if (!p || p.trigger !== 4) return false;
            if (!this.upd.has(p)) this.upd.set(p, (p.conditions.switch1Valid && p.conditions.switch1Id === 796) || (p.list || []).some(c => (c.code === 117 && c.parameters[0] === this.OVERRIDES_CE) || (c.code === 111 && c.parameters[0] === 0 && c.parameters[1] >= 142 && c.parameters[1] <= 150)));
            return this.upd.get(p);
        },
        npcCache: new Map(),
        npc(ev) { const k = ev._mapId + ',' + ev._eventId; if (!this.npcCache.has(k)) { const d = ev.event(); this.npcCache.set(k, !!d && d.pages.some(p => this.updater(p))); } return this.npcCache.get(k); },
        /** Talking to a villager I haven't met (not on their own intro page): their introduction. */
        due(ev) {
            const p = ev.page(); if (!p || p.trigger !== 0) return null;
            const ces = new Set(p.list.filter(c => c.code === 117).map(c => c.parameters[0]));
            const s = Object.keys(this.DATA).find(k => ces.has(this.DATA[k].ce)); if (!s || $gameSwitches._data[s]) return null;
            const d = this.DATA[s], c = p.conditions;
            if (ev._mapId === d.m && ev._eventId === d.e && c.variableValid && c.variableId === 24 && c.variableValue === d.k) return null;   // already it
            return d;
        },
        /** The introduction's own letters (its "done") are mine, kept on the intro event wherever it was played. */
        self(m, e) { return Object.keys(this.DATA).some(k => this.DATA[k].m === m && this.DATA[k].e === e); },
        asIntro(it, fn) {
            if (!it._coopSelf) return fn();
            const a = it._mapId, b = it._eventId; it._mapId = it._coopSelf[0]; it._eventId = it._coopSelf[1];
            try { return fn(); } finally { it._mapId = a; it._eventId = b; }
        }
    };

    // ---- NPCs and wandering monsters walk the same way on every screen (decision 70) ----
    const Walkers = {
        SEND_MS: 150, FULL_MS: 2000, HEARD_MS: 3000,
        sent: new Map(), lastSend: 0, lastFull: 0, heard: new Map(),   // heard: map -> when the authority last spoke
        /** Someone who moves: an NPC or a wandering monster (not a hunting monster, a player's own story's event, a placed object or a spawn). */
        walker(ev) {
            if (!ev || ev._erased || !ev.characterName() || ev.isSpawnEvent) return false;
            if (Mobs.isMob(ev) || WorldObjects.isPlaced(ev)) return false;
            // a mod's scenery that each game plays for itself (<coop:local> in its note: Hollowbrook's Float lanterns, let go in
            // each player's own Float scene): every game moves its own
            if (/<coop:local>/i.test((ev.event() && ev.event().note) || '')) return false;
            return true;                                                      // a player's own story's NPCs too: one place for everyone (decision 78)
        },
        /** Map frame: the authority tells where they are (only what changed; everything every 2 s for anyone just arrived). */
        tick(now) {
            if (!Mobs.active() || !window.$gameMap || $gameMap.mapId() <= 0) return;
            const m = $gameMap.mapId();
            if (!Spawns.authority(m) || now - this.lastSend < this.SEND_MS) return;
            this.lastSend = now;
            const full = now - this.lastFull > this.FULL_MS; if (full) this.lastFull = now;
            const out = [];
            $gameMap.events().forEach(ev => {
                if (!this.walker(ev) || !this.moves(ev) || (ev._moveRouteForcing && $gameMap.isEventRunning())) return;   // not my own scene's moves
                const r = [ev.eventId(), ev.x, ev.y, ev.direction()], k = m + ',' + r[0], sig = r.join(',');
                if (ev.x !== ev.event().x || ev.y !== ev.event().y) ev._coopMoved = true;
                if (!full && this.sent.get(k) === sig) return;
                this.sent.set(k, sig); out.push(r);
            });
            for (let i = 0; i < Math.max(out.length, full ? 1 : 0); i += 250) {   // every 2 s even with nothing moved (an empty list): followers keep waiting for my word
                const l = out.slice(i, i + 250);
                if (Net.isHost) Net.broadcast({ t: 'WALKS', m, by: Net.selfId, l });
                else Net.send(Net.hostId, { t: 'WALK', m, l });
            }
        },
        /** Another game is this map's authority: walk them where it shows them. */
        apply(m, l) {
            if (!window.$gameMap || !Spawns.onMap(m) || Spawns.authority(m)) return;   // onMap: the map is loaded (a rejoining game still has the old map's id before its data)
            this.heard.set(m, Date.now());
            const it = $gameMap._interpreter, talking = it && it.isRunning() ? it.eventId() : 0;
            l.forEach(r => {
                if (!Array.isArray(r) || !isInt(r[0], 1, 999) || !isInt(r[1], 0, 999) || !isInt(r[2], 0, 999) || ![2, 4, 6, 8].includes(r[3])) return;
                const ev = $gameMap.event(r[0]);
                if (!ev || !this.walker(ev) || ev._moveRouteForcing || ev._locked || ev.eventId() === talking) return;   // my own scene or my talk with them comes first
                ev._coopWalk = true;
                if (Math.abs(ev._realX - r[1]) > 2 || Math.abs(ev._realY - r[2]) > 2) ev.locate(r[1], r[2]);   // far: there at once
                else if (ev._x !== r[1] || ev._y !== r[2]) { ev._x = r[1]; ev._y = r[2]; ev.resetStopCount(); }   // near: a step, with its walk cycle (decision 80)
                ev.setDirection(r[3]);                                            // facing as on the authority's screen, walking or turning
            });
        },
        /** Wanders, or has moved from where the map put it (signs, chests, lamps and swaying trees never do). */
        moves(ev) { const d = ev.event(); return ev._moveType === 1 || ev._moveType === 2 || !d || ev.x !== d.x || ev.y !== d.y || ev._coopMoved; },
        following(ev) { return Date.now() - (this.heard.get(ev._mapId) || 0) < this.HEARD_MS && this.walker(ev); },   // the authority is speaking: nobody walks on their own here
        reset() { this.sent.clear(); this.heard.clear(); this.lastFull = 0; }
    };

    // ---- first-time rewards on a mystery's or shrine's own self switch: each player's own (decision 69) ----
    const FirstTime = {
        LETTERS: {"3,32":["A"],"33,97":["A"],"84,97":["A","B"],"93,20":["A","B"],"160,194":["A","B"],"163,124":["A","B"],"241,16":["A","B"],"248,10":["A","B"],"3,77":["A","B"],"29,10":["A","B"],"3,146":["A"],"17,11":["A","B"],"33,144":["A","B"],"99,54":["A"],"95,98":["A"],"101,9":["A"],"102,9":["A"],"104,11":["A"],"162,142":["A"],"163,89":["A","B"],"237,59":["A"],"234,58":["B"],"235,48":["B"],"235,51":["B"]},                       // "map,event" -> letters (tools/firsttime-scan.js)
        OWN_TRIPS: { '109,3': ['A'] },
        // WTE's tutorial spots (fishing, farming, mining, husbandry: switched on by the scene that teaches it, then a pop-up):
        // each player's own, so each gets their own pop-up (user, 2026-11-04; their "seen" switches: SEEN_POPUPS)
        TUTORIAL_SPOTS: { '9,38': ['A'], '34,329': ['A', 'B'], '44,5': ['A', 'B'], '50,182': ['A'] },
        // one-time quest items (decision 76): each player takes their own
        PICKUPS: { '8,25': ['A'], '26,6': ['A', 'B', 'C'], '28,3': ['A', 'B', 'C'], '87,1': ['A'], '88,15': ['A'], '159,142': ['A', 'B'], '159,169': ['A', 'B'],
                   '238,286': ['A'], '265,177': ['A'], '270,1': ['A', 'B'], '239,56': ['A'], '227,4': ['A', 'B', 'C', 'D'], '229,14': ['A', 'B'], '240,282': ['A', 'B'],
                   // tomes (decision 77)
                   '30,100': ['A', 'B'], '33,87': ['A', 'B'], '75,39': ['A', 'B'], '84,155': ['A', 'B'], '128,1': ['A', 'B'], '129,1': ['A', 'B'], '130,1': ['A', 'B'],
                   '131,1': ['A', 'B'], '132,1': ['A', 'B'], '133,1': ['A', 'B'], '134,1': ['A', 'B'], '135,1': ['A', 'B'], '136,1': ['A', 'B'], '220,4': ['A'], '221,4': ['A'],
                   '222,4': ['A'], '223,4': ['A'], '224,4': ['A'], '265,179': ['A'], '265,180': ['A'] },
        OWN_SV: { '3,222': [26, 27] },                                     // the Mall's first monster: "its tome given" is mine (decision 77)
        ownSv(m, e, v) { const l = this.OWN_SV[m + ',' + e]; return !!l && l.includes(Number(v)); },
        ownSvKey(k) { const p = String(k).split(','); return p.length === 3 && this.ownSv(Number(p[0]), Number(p[1]), p[2]); },                                    // the Void's altar: one offering per player per news day (decision 71)
        personal(m, e, c) { const l = this.LETTERS[m + ',' + e] || this.OWN_TRIPS[m + ',' + e] || this.PICKUPS[m + ',' + e] || this.TUTORIAL_SPOTS[m + ',' + e]; return (!!l && l.includes(String(c))) || Intros.self(m, e) || Mysteries.spawnedHere(m, e); },
        personalKey(k) { const p = String(k).split(','); return p.length === 3 && this.personal(Number(p[0]), Number(p[1]), p[2]); },
        // buried treasure: a container that opens only for whoever holds their own treasure map is that player's own
        CONTAINERS: [5,6,7,8,10,14,15,16,17,18,19,20],
        personalCont(i) { return this.CONTAINERS.includes(Number(i)); },
        writing: false,
        /** The container as WTE starts it (its plugin settings): what a new player finds buried. */
        initial(i) {
            let d = null; try { d = JSON.parse(JSON.parse(PluginManager.parameters('DM_LimitedInventory')['Storage Containers'] || '[]')[i - 1] || 'null'); } catch (e) { d = null; }
            if (!d) return null;
            const list = (k, et) => { let a = []; try { a = JSON.parse(d[k] || '[]').map(x => JSON.parse(x)); } catch (e) { a = []; } return a.map(x => { const id = Number(x['Item Id'] || x['Weapon Id'] || x['Armor Id']) || 0; return [id, Number(x.Amount) || 1, et === 'a' ? (($dataArmors[id] || {}).etypeId | 0) : et]; }).filter(x => x[0] > 0); };
            return { name: String(d['Container Name'] || ''), max: Number(d['Max Storage']) || 0, icon: Number(d['Container Icon']) || 0, loot: d['Loot Container'] === 'true', opened: false,
                     items: list('Items', -1).concat(list('Weapons', 1), list('Armors', 'a')) };
        },
        write(i, p) { if (!p) return; this.writing = true; try { WorldObjects.applyContainer(i, p); } finally { this.writing = false; } },
        own() { const out = {}; const all = (window.$gameContainers && $gameContainers._containers) || []; this.CONTAINERS.forEach(i => { if (all[i - 1]) out[i] = WorldObjects.packContainer(all[i - 1]); }); return out; },
        setOwn(o) { this.CONTAINERS.forEach(i => this.write(i, o && o[i] && Array.isArray(o[i].items) ? o[i] : this.initial(i))); }
    };

    // ---- marriage (decision 64): everyone has their own hearts and can marry; a person already engaged or married to
    //      one player turns the others down (and hands the ring back). The host keeps who, with the world. ----
    const Marriages = {
        NPCS: { 1: 'Alice', 2: 'Josh', 3: 'Sam', 4: 'Edwin', 5: 'Ellie', 6: 'Tanner', 7: 'Molly', 8: 'Blorph', 9: 'Celeste' },
        GIFT_CES: [1031, 1032, 1040, 1041, 1042, 1043, 1044, 1045, 1046], RING: 2175, VAR: 842,
        list: {}, wedList: {}, roomList: {}, lastClaim: 0, lastSent: 0, sent: '',
        reset() { this.list = {}; this.wedList = {}; this.roomList = {}; this.lastClaim = 0; this.lastSent = 0; this.sent = ''; },   // a session ended (decision 90)
        // map events of a spouse at home (Map 2 and its other version): event id -> person
        EV_NPC: { 95: 2, 96: 4, 97: 5, 98: 3, 99: 1, 100: 6, 101: 7, 102: 8, 103: 9, 63: 2, 77: 4, 78: 5, 79: 3, 80: 1, 81: 6, 82: 7, 83: 8, 84: 9 },
        HOMES: [2, 259], MARRIED_SW: 1225,                                       // S1226 Alice Married ... S1234 Celeste Married (= 1225 + person)
        wedded() { const s = window.$gameSystem; if (!s) return {}; if (!s._coopWedded || typeof s._coopWedded !== 'object') s._coopWedded = {}; return s._coopWedded; },
        allWed() { return Net.isHost ? this.wedded() : this.wedList; },
        /** Married to another player: in my game they are married too (home, schedule), just not to me. */
        marriedToOther(npc) { const w = this.allWed()[npc]; return !!w && w !== this.myName(); },
        /** The room (player slot) a spouse lives in: their partner's. 0 = the host's part of the house (WTE's own spot). */
        roomOf(npc) {
            if (!Net.isHost) return this.roomList[npc] | 0;
            const who = this.wedded()[npc]; if (!who || who === this.myName()) return 0;
            const p = Array.from(Net.peers.values()).find(x => x && x.name === who); return p ? p.slot | 0 : 0;
        },
        rooms() { const out = {}; Object.keys(this.wedded()).forEach(k => { const s = this.roomOf(Number(k)); if (s) out[k] = s; }); return out; },
        /** What a spouse says to a player who isn't their partner. */
        LINES: {
            1: ['{p} brings me flowers sometimes. I pretend not to notice how wilted they are.', 'Life with {p} is a little cluttered and a lot of fun. I wouldn\'t change it.',
                'If you see {p}, remind them to have some tea and slow down a little.', '{p} makes this strange old town feel like home.'],
            2: ['{p} still lets me ramble about my theories. That\'s love, I think.', 'I made {p} coffee this morning. Strong. We have mysteries to solve.',
                'Being married to {p} is the least scary thing in this town.', 'If you see {p}, tell them I found another clue. They\'ll know what I mean.'],
            3: ['I cooked {p}\'s favourite last night. Seconds. Thirds, actually.', 'Since {p} and I moved in together, I finally feel safe here.',
                '{p} works so hard. I just make sure there\'s a warm meal waiting.', 'You\'re a friend of {p}\'s? Then you\'re welcome at our table any time.'],
            4: ['{p} listens when I talk about what lies beyond the forest. Not many people do.', 'What I feel for {p} is stronger than anything out there in the dark.',
                'Sometimes I catch {p} watching the treeline too. We understand each other.', 'Look after {p} out there, will you?'],
            5: ['{p} came home starving, so I made enough food for a small army.', 'I\'m so lucky to have {p}. Don\'t tell them I said that.',
                'If {p} looks tired, it\'s because I keep them up talking. Every night.', 'Come by for dinner sometime. {p} would love that.'],
            6: ['I made {p} coffee just the way they like it. Took me a few tries to learn.', '{p} keeps me grounded. Mostly. I still knock things over.',
                'The animals like {p} more than me. I\'m not jealous. Much.', 'Tell {p} I\'ll have the mess cleaned up before they get home. Probably.'],
            7: ['{p} is my favourite person in all of Elderfield. Don\'t spread it around.', 'Living with {p} is never boring, I\'ll say that much.',
                'I worry when {p} goes out at night. Keep an eye on them, okay?', '{p} and I have big plans for this place.'],
            8: ['I made {p} tea this morning. And a cake. Then another cake.', 'I\'ve been cleaning all day so the house is nice when {p} gets home.',
                '{p} is my favourite. You are... also acceptable.', 'Sometimes I get lost in thought about {p}, and then, boom! There\'s a cake.'],
            9: ['I was thinking about {p} and got so bored waiting that I made them something.', '{p} understands me. That\'s rare, in this town.',
                'I hope {p}\'s day gets better before it ends. Will you check on them?', 'Every day with {p} is a lot like the last one, in the best way.']
        },
        aboutPartner(npc) {
            const p = this.allWed()[npc] || 'my partner', day = (window.$gameVariables && $gameVariables.value(250)) | 0, l = this.LINES[npc] || this.LINES[1];
            return l[(day + npc) % l.length].split('{p}').join(p);
        },
        world() { const s = window.$gameSystem; if (!s) return {}; if (!s._coopMarriages || typeof s._coopMarriages !== 'object') s._coopMarriages = {}; return s._coopMarriages; },
        all() { return Net.isHost ? this.world() : this.list; },
        myName() { return Net.isHost ? hostName(Net) : (PlayerData.actorName() || Net.name || ''); },
        /** Someone else is engaged or married to that person: who (for the event's answer). */
        takenBy(npc) { const w = this.all()[npc]; return w && w !== this.myName() ? w : ''; },
        refusal(npc) { return (this.NPCS[npc] || 'They') + ' smiles sadly. "I\'m already promised to ' + this.takenBy(npc) + '."'; },
        /** My game: I'm engaged or married (WTE's V842 = who). Tell the host; again now and then (rejoins, a host restart). */
        claim(npc) { if (!isInt(npc, 1, 9) || !Net.isPlaying()) return; this.lastClaim = Date.now(); this.send({ t: 'MARRY', npc, name: this.myName(), wed: $gameSwitches._data[this.MARRIED_SW + npc] ? 1 : 0 }); },
        send(m) { if (Net.isHost) this.onHost(m); else Net.send(Net.hostId, m); },
        onHost(m) {
            const w = this.world(), name = cleanStr(m.name, 24);
            if (!name || (w[m.npc] && w[m.npc] !== name)) return;             // first come: already someone else's
            if (w[m.npc] !== name) { w[m.npc] = name; this.lastSent = 0; Diag.log('info', name + ' is engaged to ' + this.NPCS[m.npc]); }
            const wd = this.wedded();
            if (m.wed && wd[m.npc] !== name) { wd[m.npc] = name; this.lastSent = 0; Diag.log('info', name + ' married ' + this.NPCS[m.npc]); }
        },
        tick(now) {
            if (!Net.isPlaying() || !window.$gameVariables) return;
            const v = $gameVariables.value(this.VAR);
            if (isInt(v, 1, 9) && now - this.lastClaim > 20000) this.claim(v);
            if (Net.isHost && now - this.lastSent > 15000) { this.lastSent = now; Net.broadcast({ t: 'MARRIAGES', l: this.world(), w: this.wedded(), r: this.rooms() }); }
        },
        /** WTE's gift events: before "already married?", a person someone else has asked answers no and gives the ring back. */
        patch(ces) {
            this.GIFT_CES.forEach(id => {
                const ce = ces && ces[id], l = ce && ce.list; if (!l || l._coopMarry) return;
                const set = l.find(c => c.code === 122 && c.parameters[0] === this.VAR), k = l.findIndex(c => c.code === 111 && c.parameters[0] === 1 && c.parameters[1] === this.VAR);
                const npc = set && set.parameters[4]; if (k < 0 || !isInt(npc, 1, 9)) return;
                const ind = l[k].indent;
                l.splice(k, 0,
                    { code: 111, indent: ind, parameters: [12, 'ElderfieldCoop.Marriages.takenBy(' + npc + ') !== ""'] },
                    { code: 355, indent: ind + 1, parameters: ['$gameVariables.setValue(15, ElderfieldCoop.Marriages.refusal(' + npc + '))'] },
                    { code: 101, indent: ind + 1, parameters: ['', 0, 0, 2, ''] },
                    { code: 401, indent: ind + 1, parameters: ['\\V[15]'] },
                    { code: 126, indent: ind + 1, parameters: [this.RING, 0, 0, 1] },
                    { code: 119, indent: ind + 1, parameters: ['end'] },
                    { code: 0, indent: ind + 1, parameters: [] },
                    { code: 412, indent: ind, parameters: [] });
                l._coopMarry = true;
            });
            // CE1020 "Overrides" hides a villager the viewer has not met yet (their "<name> Intro" switch, each player's own).
            // Someone married to a player of this world lives in the shared house: every player sees them, met or not.
            const ov = ces && ces[this.OVERRIDES_CE], ol = ov && ov.list;
            if (ol && !ol._coopMarry) {
                ol.forEach(c => {
                    if (c.code !== 111 || c.parameters[0] !== 0 || c.parameters[2] !== 1) return;
                    const npc = this.INTRO_SW[c.parameters[1]]; if (!npc) return;
                    c.parameters = [12, '!$gameSwitches.value(' + c.parameters[1] + ') && !ElderfieldCoop.Marriages.allWed()[' + npc + ']'];
                });
                ol._coopMarry = true;
            }
        },
        OVERRIDES_CE: 1020,
        INTRO_SW: { 143: 1, 145: 2, 142: 3, 146: 4, 144: 5, 149: 6, 150: 7, 148: 9 },   // "<name> Intro" -> NPCS id (Blorph has none)
        /** A joiner's spouse lives in their own room of the house, not in the host's part. */
        SPOUSE_EVENTS: [63, 77, 78, 79, 80, 81, 82, 83, 84, 95, 96, 97, 98, 99, 100, 101, 102, 103],
        toMyRoom(only) {
            if (!Net.isPlaying() || !window.$gameMap || $gameMap.mapId() !== Home.MAP) return;
            (only ? [only] : this.SPOUSE_EVENTS.map(id => $gameMap.event(id)).filter(ev => ev && ev.characterName())).forEach(ev => {
                const npc = this.EV_NPC[ev.eventId()], mine = $gameSwitches._data[this.MARRIED_SW + npc];
                const slot = mine ? Home.mySlot() : this.roomOf(npc);
                if (slot) this.toRoom(ev, slot);
            });
        },
        toRoom(ev, slot) {
            const r = Home.ROOMS[slot]; if (!r) return;
            const cx = Math.round((r[0] + r[2]) / 2), cy = Math.round((r[1] + r[3]) / 2);
            const free = (x, y) => $gameMap.isValid(x, y) && $gameMap.isPassable(x, y, 2) && !$gameMap.eventsXyNt(x, y).length;
            let spot = null;
            for (let d = 0; d <= 4 && !spot; d++) for (let dx = -d; dx <= d && !spot; dx++) for (let dy = -d; dy <= d && !spot; dy++) if (free(cx + dx, cy + dy)) spot = [cx + dx, cy + dy];
            if (spot) ev.locate(spot[0], spot[1]);
        }
    };
    // ---- tax effects are the farm's: every player's character carries the blessing or curse the world has (decision 65) ----
    const Fair = {
        TAX: [[646, 204], [647, 203], [648, 202], [649, 201], [650, 200], [651, 199], [652, 198], [653, 197]],   // world switch -> state
        last: 0,
        reset() { this.last = 0; },   // a session ended (decision 90)
        tick(now) {
            if (!Net.isPlaying() || now - this.last < 2000 || !window.$gameActors || $gameParty.inBattle()) return;
            this.last = now;
            const a = $gameActors._data[1]; if (!a) return;
            this.TAX.forEach(([sw, st]) => { const on = !!$gameSwitches._data[sw], has = a.isStateAffected(st); if (on && !has) a.addState(st); else if (!on && has) a.removeState(st); });
        }
    };

    // ---- spouses help on the farm (decision 66) ----
    //      Every morning (from 7 AM) the host has each married person do one big chore: water every crop (not when it
    //      rains: WTE waters them itself), fill every trough, pet every animal, or make their partner something.
    //      leaning to what they already like doing in WTE. Two spouses do two chores. Everyone gets a note of it.
    const Chores = {
        FARM: 34, PLOTS: [30, 209], RANCH: 50, TROUGHS: [[4, 562], [37, 563], [38, 564], [39, 565]], ANIMALS: [2, 36], HOUR: 7, WEATHER: 243, WET: [2, 4],
        // what each one leans to (water, feed, pet, gift) and what they make: from WTE's own home dialogue
        LEAN: { 1: [4, 1, 1, 2], 2: [1, 2, 1, 3], 3: [2, 1, 1, 3], 4: [1, 1, 2, 3], 5: [2, 1, 1, 3], 6: [1, 3, 3, 1], 7: [2, 2, 2, 1], 8: [1, 1, 1, 3], 9: [2, 1, 2, 2] },
        GIFTS: { 1: [120, 173], 2: [2043], 3: [16, 12], 4: [164, 2084, 2126], 5: [112, 2013], 6: [2043], 7: [14, 2013], 8: [120, 2057, 2198], 9: [2131, 2033] },
        sv(m, e, v) { return Number($gameVariables.selfValue([m, e, v])) || 0; },
        today() { return $gameVariables.value(250) | 0; },
        hour() { return window.$gameTime && $gameTime.hour !== undefined ? $gameTime.hour : $gameVariables.value(127); },
        /** Host, map frame: once a day, each spouse's chore. */
        tick() {
            if (!Net.isHost || !Net.isPlaying() || !window.$gameSystem || !window.$gameVariables) return;
            const day = this.today(), h = this.hour();
            if (!day || $gameSystem._coopChoreDay === day || h < this.HOUR || h >= 20) return;
            $gameSystem._coopChoreDay = day;
            const wed = Marriages.wedded();
            Object.keys(wed).map(Number).filter(n => isInt(n, 1, 9)).forEach(npc => { try { this.doOne(npc, wed[npc], day); } catch (e) { Diag.err('spouse chore', e); } });
        },
        rng(npc, day) { return mulberry32((hash32('chore|' + npc + '|' + day) >>> 0)); },
        doOne(npc, partner, day) {
            const who = Marriages.NPCS[npc], r = this.rng(npc, day), lean = this.LEAN[npc] || [1, 1, 1, 1];
            const can = [this.waterable().length > 0, this.feedable().length > 0, this.pettable().length > 0, !!this.partnerId(partner)];
            const w = lean.map((x, i) => can[i] ? x : 0), sum = w.reduce((a, b) => a + b, 0);
            if (!sum) return;
            let pick = r() * sum, k = 0; while (pick >= w[k]) { pick -= w[k]; k++; }
            let note = '';
            if (k === 0) { const l = this.waterable(); l.forEach(e => $gameVariables.setSelfValue([this.FARM, e, 25], 1)); note = who + ' watered all the crops on the farm (' + l.length + ').'; }
            else if (k === 1) { const l = this.feedable(); l.forEach(([e, cap]) => $gameVariables.setSelfValue([this.RANCH, e, 24], cap)); note = who + ' filled every trough with feed.'; }
            else if (k === 2) { const l = this.pettable(); l.forEach(e => { $gameVariables.setSelfValue([this.RANCH, e, 24], Math.min(100, this.sv(this.RANCH, e, 24) + 4)); $gameVariables.setSelfValue([this.RANCH, e, 93], 1); }); note = who + ' petted every animal on the ranch (' + l.length + ').'; }
            else {
                const g = this.GIFTS[npc] || [14], id = g[Math.floor(r() * g.length)], it = $dataItems[id];
                if (!it) return;
                this.deliver(partner, id, who + ' made you ' + this.a(it.name) + '.');
                note = who + ' made ' + partner + ' ' + this.a(it.name) + '.';
            }
            this.tell(note);
        },
        a(name) { return (/^[aeiou]/i.test(name) ? 'an ' : 'a ') + name; },
        waterable() { if (this.WET.includes($gameVariables.value(this.WEATHER))) return []; const out = []; for (let e = this.PLOTS[0]; e <= this.PLOTS[1]; e++) if (this.sv(this.FARM, e, 26) > 0 && this.sv(this.FARM, e, 847) === 0 && this.sv(this.FARM, e, 25) !== 1) out.push(e); return out; },
        feedable() { return this.TROUGHS.filter(([e, b]) => $gameVariables.value(b) > 0).map(([e]) => [e, this.sv(this.RANCH, e, 25) || 8]).filter(([e, cap]) => this.sv(this.RANCH, e, 24) < cap); },
        pettable() { const out = []; for (let e = this.ANIMALS[0]; e <= this.ANIMALS[1]; e++) if (this.sv(this.RANCH, e, 26) >= 1 && this.sv(this.RANCH, e, 93) === 0) out.push(e); return out; },
        partnerId(name) { if (name === Marriages.myName()) return Net.selfId; const p = Array.from(Net.peers.values()).find(x => x && x.name === name && !x.loading); return p ? p.id : null; },
        deliver(name, id, text) { const to = this.partnerId(name); if (to === Net.selfId) this.got(id, text); else if (to) Net.send(to, { t: 'CHOREGIFT', id, text }); },
        got(id, text) { if ($dataItems[id]) $gameParty.gainItem($dataItems[id], 1); Chat.system(text); },
        tell(text) { Net.broadcast({ t: 'CHORENOTE', text }); this.heard(text); },
        heard(text) { Chat.system(text); if (window.$gameMap && [this.FARM, this.RANCH].includes($gameMap.mapId())) $gameMap.requestRefresh(); }
    };

    // ---- NPCs now and then mention another player (decision 66): once a day per person, about a third of the days ----
    const Mentions = {
        SET_ID: { 2251: 'Edwin', 2252: 'Ellie', 2253: 'Sam', 2254: 'Josh', 2255: 'Alice', 2256: 'Blorph', 2257: 'Celeste', 2258: 'Molly', 2259: 'Tanner' },
        LINES: ['I ran into {o} earlier. They seem to be settling into Elderfield.', 'Are you friends with {o}? Tell them I said hello.',
            '{o} was asking about you, I think.', 'I saw {o} heading out earlier. Busy day for you farmers.', '{o} stopped by to chat today. You two make a good team.'],
        seenToday: new Set(),
        reset() { this.seenToday = new Set(); },   // a session ended (decision 90)
        others() { return Array.from(Net.peers.values()).filter(p => p && !p.loading && p.name).map(p => p.name); },
        pick(who) {
            const o = this.others(); if (!o.length || !window.$gameVariables) return '';
            const day = $gameVariables.value(250) | 0, key = who + '|' + day;
            if (this.seenToday.has(key)) return '';
            const r = mulberry32(hash32(key + '|' + Marriages.myName()) >>> 0);
            if (r() > 0.34) return '';
            return this.LINES[Math.floor(r() * this.LINES.length)].split('{o}').join(o[Math.floor(r() * o.length)]);
        },
        seen(who) { this.seenToday.add(who + '|' + ($gameVariables.value(250) | 0)); }
    };

    // ---- the wedding together (decision 65) ----
    const Wedding = {
        CHURCH: 138, EVENT: 29, CUTSCENE_SW: 1222, SEATS: [[19, 18], [23, 18], [17, 18], [25, 18]], HOLD_MS: 25000, COME_MS: 25000, FRAME_MS: 100, SILENT_MS: 30000,
        lead: null, watch: null, lastFrame: 0, lastFull: 0, sent: new Map(), msgKey: '', caption: '',
        reset() { this.lead = null; this.watch = null; this.lastFrame = 0; this.lastFull = 0; this.sent = new Map(); this.msgKey = ''; this.caption = ''; },   // a session ended (decision 90)
        // ---- the couple's game ----
        started(npc) {
            if (!Net.isPlaying() || Net.playerCount() < 2 || this.lead) return;
            this.lead = { npc, at: Date.now(), expect: Net.peers.size, answered: new Set(), go: false };
            this.sent.clear(); this.msgKey = '';
            this.up({ t: 'WED', npc, name: Marriages.myName() });
            Diag.log('info', 'wedding: calling everyone to the church');
        },
        /** The ceremony's first command waits until everyone called is seated (or said they can't come). */
        holding() {
            const L = this.lead; if (!L || L.go) return false;
            if (L.answered.size >= L.expect || Date.now() - L.at > this.HOLD_MS) { L.go = true; return false; }
            return true;
        },
        ended() { if (!this.lead) return; this.lead = null; this.up({ t: 'WEDEND' }); },
        /** Every 100 ms on the church map: the events as the couple's game shows them, and the words being said. */
        frame(now) {
            if (!this.lead || !window.$gameMap || $gameMap.mapId() !== this.CHURCH || now - this.lastFrame < this.FRAME_MS) return;
            this.lastFrame = now;
            const full = now - this.lastFull > 2000; if (full) this.lastFull = now;
            const e = [];
            $gameMap.events().forEach(ev => {
                const s = [ev.eventId(), Math.round(ev._realX * 100) / 100, Math.round(ev._realY * 100) / 100, ev.direction(), ev.pattern(), ev.characterName(), ev.characterIndex(), ev.opacity(), ev.isTransparent() ? 1 : 0];
                const k = s.join('|'); if (!full && this.sent.get(s[0]) === k) return;
                this.sent.set(s[0], k); e.push(s);
            });
            const m = { t: 'WEDF', e };
            const busy = $gameMessage.isBusy(), win = SceneManager._scene && SceneManager._scene._messageWindow;
            const text = busy && win ? win.convertEscapeCharacters($gameMessage.allText()) : '', name = busy && win ? win.convertEscapeCharacters($gameMessage.speakerName() || '') : '';
            const key = name + '|' + text; if (key !== this.msgKey) { this.msgKey = key; m.msg = [name.slice(0, 40), text.slice(0, 400)]; }
            if (e.length || m.msg) this.up(m);
        },
        // ---- routing: the couple's game -> host -> everyone else; a guest's "seated" -> host -> the couple ----
        up(m) { if (Net.isHost) this.onHost(Net.selfId, m); else Net.send(Net.hostId, m); },
        onHost(from, m) {
            if (m.t === 'WED') {
                this.hostBy = from;
                const call = { t: 'WEDCALL', by: from, npc: m.npc, name: cleanStr(m.name, 24) };
                Net.peers.forEach((p, id) => { if (id !== from) Net.send(id, call); });
                if (from !== Net.selfId) this.onCall(call);
            } else if (m.t === 'WEDF' || m.t === 'WEDEND') {
                const out = Object.assign({}, m, { t: m.t === 'WEDF' ? 'WEDFR' : 'WEDENDR' });
                Net.peers.forEach((p, id) => { if (id !== from) Net.send(id, out); });
                if (from !== Net.selfId) this.onClient(out);
            } else if (m.t === 'WEDHERE' || m.t === 'WEDNO') {
                if (this.hostBy === Net.selfId) this.answered(from); else if (this.hostBy) Net.send(this.hostBy, { t: 'WEDREADY', who: from });
            }
        },
        answered(who) { if (this.lead) this.lead.answered.add(who); },
        // ---- a guest's game ----
        onCall(m) {
            if (this.lead || this.watch) return;
            this.watch = { by: m.by, npc: m.npc, name: m.name, at: Date.now(), state: 'coming', heard: Date.now() };
            Chat.system(m.name + ' and ' + (Marriages.NPCS[m.npc] || 'their love') + ' are getting married! Everyone, to the church.');
        },
        seat() { const s = Home.mySlot(); return this.SEATS[s] || this.SEATS[0]; },
        /** Map frame: go to the church when free, then sit in the front pew and watch. */
        tick(now) {
            this.resumeTick();
            const w = this.watch; if (!w) return;
            if (w.state === 'coming') {
                if (now - w.at > this.COME_MS) { this.up({ t: 'WEDNO' }); this.stopWatching(false); return; }   // couldn't get away: the wedding goes on
                if (!Duel.free()) return;
                const s = this.seat(); $gamePlayer.reserveTransfer(this.CHURCH, s[0], s[1], 8, 0); w.state = 'going';
            } else if (w.state === 'going') {
                if ($gameMap.mapId() === this.CHURCH && !$gamePlayer.isTransferring() && !SceneManager.isSceneChanging()) { w.state = 'seated'; w.heard = now; this.up({ t: 'WEDHERE' }); }
            } else if (w.state === 'seated' && now - w.heard > this.SILENT_MS) this.stopWatching(true);   // the couple's game went quiet
        },
        onClient(m) {
            const w = this.watch; if (!w) return;
            if (m.t === 'WEDENDR') { this.stopWatching(true); return; }
            if (m.t !== 'WEDFR' || w.state !== 'seated' || $gameMap.mapId() !== this.CHURCH) return;
            w.heard = Date.now();
            (Array.isArray(m.e) ? m.e : []).slice(0, 200).forEach(s => {
                if (!Array.isArray(s) || !isInt(s[0], 1, 999)) return;
                const ev = $gameMap.event(s[0]); if (!ev) return;
                ev._coopMirror = true;
                const cn = typeof s[5] === 'string' ? s[5] : '', ci = isInt(s[6], 0, 7) ? s[6] : 0;
                if (ev._characterName !== cn || ev._characterIndex !== ci) ev.setImage(cn, ci);
                if (isNum(s[1], -1, 1e4) && isNum(s[2], -1, 1e4)) { ev._realX = s[1]; ev._realY = s[2]; ev._x = Math.round(s[1]); ev._y = Math.round(s[2]); }
                if (isInt(s[3], 2, 8)) ev._direction = s[3];
                if (isInt(s[4], 0, 3)) ev._pattern = s[4];
                if (isInt(s[7], 0, 255)) ev.setOpacity(s[7]);
                ev.setTransparent(s[8] === 1);
            });
            if (Array.isArray(m.msg)) { const [n, s] = m.msg.map(x => String(x || '')); this.caption = s ? (n ? '\x1bC[6]' + n + '\x1bC[0]: ' : '') + s : ''; }
        },
        stopWatching(congrats) {
            const w = this.watch; this.watch = null; this.caption = '';
            if (window.$gameMap) $gameMap.events().forEach(ev => { if (ev._coopMirror) { ev._coopMirror = false; ev.locate(ev.event().x, ev.event().y); ev.refresh(); } });
            if (congrats && w) Chat.system('Congratulations to ' + w.name + ' and ' + (Marriages.NPCS[w.npc] || 'their love') + '!');
        },
        frozen() { return !!this.watch && this.watch.state !== 'coming'; },
        // ---- a guest in a battle: paused for the ceremony, then back into it (decision 68) ----
        susp: null,
        /** A quiet moment in the battle: nobody acting, nothing queued, no message, no battle event. */
        canPause() {
            const sc = SceneManager._scene;
            return sc instanceof Scene_Battle && !SceneManager.isSceneChanging() && !BattleManager._subject && !(BattleManager._actionBattlers || []).length
                && !$gameTroop.isEventRunning() && !$gameMessage.isBusy() && !['init', 'start', 'battleEnd', 'aborting'].includes(BattleManager._phase)
                && !(sc._logWindow && sc._logWindow.isBusy && sc._logWindow.isBusy());
        },
        /** Battle frame: called to a wedding while fighting: set the battle aside and go. */
        battleTick() {
            const w = this.watch; if (!w || w.state !== 'coming' || this.susp || !this.canPause()) return;
            const s = this.seat();
            this.susp = { map: $gameMap.mapId(), x: $gamePlayer.x, y: $gamePlayer.y, d: $gamePlayer.direction() };
            BattleManager._coopPaused = true; $gameParty._inBattle = false;
            $gamePlayer.reserveTransfer(this.CHURCH, s[0], s[1], 8, 0);
            SceneManager.goto(Scene_Map);                                      // the battle itself (BattleManager, troop, party) stays as it is
            w.state = 'going';
            Diag.log('info', 'wedding: battle paused for the ceremony');
        },
        /** Map frame, after the ceremony: back to where the battle was, then the battle itself. */
        resumeTick() {
            const p = this.susp; if (!p || this.watch || SceneManager.isSceneChanging() || $gamePlayer.isTransferring()) return;
            if (!p.back) { p.back = true; $gamePlayer.reserveTransfer(p.map, p.x, p.y, p.d, 0); return; }
            if ($gameMap.mapId() !== p.map) return;
            this.susp = null; BattleManager._coopPaused = false; BattleManager._coopResume = true; $gameParty._inBattle = true;
            Chat.system('Back to the fight!');
            SceneManager._stack = [Scene_Map]; SceneManager.goto(Scene_Battle);   // the same battle, as it was; its end returns to the map as usual
            // (never pop here: the map screen clears the scene stack, and popping an empty stack closes the game)
        }
    };
    if (typeof Game_Switches !== 'undefined') {
        const _swSet = Game_Switches.prototype.setValue;
        Game_Switches.prototype.setValue = function (id, value) {
            const before = !!this._data[id];
            _swSet.call(this, id, value);
            if (id === Wedding.CUTSCENE_SW && !!value !== before && Net.isPlaying()) {
                const npc = window.$gameVariables ? $gameVariables.value(Marriages.VAR) : 0;
                if (value && isInt(npc, 1, 9)) Wedding.started(npc); else if (!value) Wedding.ended();
            }
        };
        // a person married to another player is married in my game too (their home, their schedule), just not to me
        const _swValue = Game_Switches.prototype.value;
        Game_Switches.prototype.value = function (id) {
            const v0 = _swValue.call(this, id), v = Gates.opening || Gates.placing ? Gates.override(id, 's', v0) : v0;
            if (v || id <= Marriages.MARRIED_SW || id > Marriages.MARRIED_SW + 9 || !Net.isPlaying()) return v;
            return Marriages.marriedToOther(id - Marriages.MARRIED_SW);
        };
    }
    /** One of the nine's talk pages: their first line, then (sometimes) a mention of another player. */
    const withMention = (ev, l) => {
        if (!l || !Net.isPlaying() || !ev.page() || ev.page().trigger !== 0) return l;
        const set = l.find(c => c.code === 117 && Mentions.SET_ID[c.parameters[0]]); if (!set) return l;
        const who = Mentions.SET_ID[set.parameters[0]], line = Mentions.pick(who); if (!line) return l;
        // right after WTE's Talk/Gift exchange (at low friendship that exchange is the whole talk), else as their closing line
        const opt = l.findIndex(c => c.code === 117 && c.parameters[0] === 1035 && c.indent === 0), k = l.findIndex(c => c.code === 101 && c.indent === 0);
        let end = opt + 1;
        if (opt < 0) { end = l.length - 1; if (end < 0 || l[end].code !== 0 || l[end].indent !== 0) return l; }   // no Talk/Gift exchange: their closing line
        const face = k >= 0 ? l[k].parameters : ['', 0, 0, 2, who];
        return l.slice(0, end).concat([
            { code: 101, indent: 0, parameters: [face[0], face[1], face[2], face[3], face[4] || who] },
            { code: 401, indent: 0, parameters: [line] },
            { code: 355, indent: 0, parameters: ['ElderfieldCoop.Mentions.seen(' + JSON.stringify(who) + ')'] }], l.slice(end));
    };
    if (typeof Game_Event !== 'undefined') {
        const _meets = Game_Event.prototype.meetsConditions;
        Game_Event.prototype.meetsConditions = function (page) {
            const ok = _meets.call(this, page);
            if (ok || !Net.isPlaying() || !Gates.EVENTS.has(this._mapId + ',' + this._eventId)) return ok;
            Gates.opening = true;
            try { return _meets.call(this, page); } finally { Gates.opening = false; }   // a door someone in the world opened
        };
        // a villager's schedule page: the world decides where they stand
        const _par = Game_Event.prototype.updateParallel;
        Game_Event.prototype.updateParallel = function () {
            if (!Net.isPlaying() || !this._interpreter || !Intros.updater(this.page())) return _par.apply(this, arguments);
            Gates.placing = true;
            try { return _par.apply(this, arguments); } finally { Gates.placing = false; }
        };
        // talking to a villager I haven't met: their introduction
        const _introStart = Game_Event.prototype.start;
        Game_Event.prototype.start = function () {
            this._coopIntro = Net.isPlaying() && Intros.npc(this) ? Intros.due(this) : null;
            return _introStart.apply(this, arguments);
        };
        // followers walk where the map's authority shows them (they don't wander on their own meanwhile)
        const _selfMove = Game_Event.prototype.updateSelfMovement;
        Game_Event.prototype.updateSelfMovement = function () { if (Walkers.following(this)) return; return _selfMove.call(this); };
        // a spouse talking to a player who isn't their partner: something nice about the partner, then the usual goodbye
        const _evList = Game_Event.prototype.list;
        Game_Event.prototype.list = function () {
            if (this._coopIntro) return this._coopIntro.list;                  // a villager I'm meeting for the first time (decision 70)
            const l = withMention(this, _evList.call(this));
            const npc = Marriages.EV_NPC[this._eventId];
            if (!npc || !l || !Net.isPlaying() || !Marriages.HOMES.includes(this._mapId) || $gameSwitches._data[Marriages.MARRIED_SW + npc] || !Marriages.marriedToOther(npc)) return l;
            const page = this.page(); if (!page || page.trigger !== 0) return l;
            const k = l.findIndex(c => c.code === 101); if (k < 0) return l;
            const clear = l.slice().reverse().find(c => c.code === 117 && c.indent === 0);
            const out = l.slice(0, k).concat([
                { code: 101, indent: 0, parameters: ['', 0, 0, 2, Marriages.NPCS[npc]] },
                { code: 401, indent: 0, parameters: [Marriages.aboutPartner(npc)] }]);
            if (clear) out.push(clear);
            out.push({ code: 0, indent: 0, parameters: [] });
            return out;
        };
        // the ceremony as the couple sees it: those events follow their game, not their own routes
        const _evUpdate = Game_Event.prototype.update;
        Game_Event.prototype.update = function () { if (this._coopMirror) return; return _evUpdate.call(this); };
    }
    if (typeof Game_Interpreter !== 'undefined') {
        const _117 = Game_Interpreter.prototype.command117;
        Game_Interpreter.prototype.command117 = function (params) {
            if (params[0] === 2012 && Net.isPlaying() && !Net.isHost) return true;   // "Roll NPC Schedules": the world's roll comes from the host
            return _117.call(this, params);
        };
        const _exec = Game_Interpreter.prototype.executeCommand;
        Game_Interpreter.prototype.executeCommand = function () {
            if (this._mapId === Wedding.CHURCH && this._eventId === Wedding.EVENT && Wedding.holding()) return false;   // waiting for everyone to sit
            return _exec.call(this);
        };
    }
    if (typeof Scene_Battle !== 'undefined') {
        // a paused battle: leaving it keeps everything (no end-of-battle clean-up); coming back doesn't start it again
        const _sbUpdateW = Scene_Battle.prototype.update;
        Scene_Battle.prototype.update = function () { _sbUpdateW.call(this); try { Wedding.battleTick(); } catch (e) { Diag.err('wedding pause', e); } };
        const _sbTerminateW = Scene_Battle.prototype.terminate;
        Scene_Battle.prototype.terminate = function () { if (BattleManager._coopPaused) { Scene_Message.prototype.terminate.call(this); return; } return _sbTerminateW.call(this); };
        const _startBattleW = BattleManager.startBattle;
        BattleManager.startBattle = function () { if (this._coopResume) { this._coopResume = false; return; } return _startBattleW.apply(this, arguments); };
        // the map's event that started the battle waits for its result, as it would during the battle
        const _intUpdateW = Game_Interpreter.prototype.update;
        Game_Interpreter.prototype.update = function () { if (BattleManager._coopPaused && window.$gameMap && this === $gameMap._interpreter) return; return _intUpdateW.call(this); };
    }
    if (typeof Game_Player !== 'undefined') {
        const _canMoveW = Game_Player.prototype.canMove;
        Game_Player.prototype.canMove = function () { return Wedding.frozen() ? false : _canMoveW.call(this); };   // a guest stays in the pew
    }
    if (typeof Scene_Map !== 'undefined') {
        // the ceremony's words, for the guests
        const _smUpdate = Scene_Map.prototype.update;
        Scene_Map.prototype.update = function () {
            _smUpdate.call(this);
            const text = Wedding.watch ? Wedding.caption : (Wedding.lead && !Wedding.lead.go && $gameMap.mapId() === Wedding.CHURCH ? 'Waiting for everyone to take their seats…' : '');
            if (text && !this._coopCaption) {
                const w = 940, h = this.calcWindowHeight(3, false);
                this._coopCaption = new Window_Base(new Rectangle(Math.round((Graphics.boxWidth - w) / 2), Graphics.boxHeight - h - 24, w, h));
                this.addWindow(this._coopCaption); this._coopCaptionText = null;
            }
            if (this._coopCaption) {
                if (text !== this._coopCaptionText) { this._coopCaptionText = text; this._coopCaption.contents.clear(); if (text) this._coopCaption.drawTextEx(text, 0, 0, this._coopCaption.innerWidth); }
                this._coopCaption.visible = !!text;
            }
        };
    }
    // ---- death in co-op (decision 65): never a save erased, never the title; Hard/Nightmare die like Normal ----
    if (typeof Game_Variables !== 'undefined') {
        const _varValue = Game_Variables.prototype.value;
        Game_Variables.prototype.value = function (id) {
            const v0 = _varValue.call(this, id), v = Gates.opening || Gates.placing ? Gates.override(id, 'v', v0) : v0;
            if (Perks.IDS.has(id) && Perks.worldRoll()) return Perks.best(id, v);   // a midnight roll: the best perk in the world (decision 90)
            if ((id !== 8 && id !== 1500) || !Net.isPlaying() || !Mobs.inDeath()) return v;
            if (id === 8) return v === 2 || v === 4 ? 5 : v;                  // Hard/Nightmare -> Normal's recovery (home, gold penalty)
            return 0;                                                          // Custom: "erase autosave" off
        };
    }
    if (typeof StorageManager !== 'undefined' && typeof DataManager !== 'undefined') {
        const _remove = StorageManager.remove;
        StorageManager.remove = function (name) {
            if (Net.isPlaying() && name === DataManager.makeSavename(0)) { Diag.log('warn', 'co-op: kept the single-player autosave (a death never erases saves in co-op)'); return Promise.resolve(); }
            return _remove.apply(this, arguments);
        };
    }

    if (typeof DataManager !== 'undefined') {
        const _onLoadM = DataManager.onLoad;
        DataManager.onLoad = function (object) { const r = _onLoadM.call(this, object); if (object && object === window.$dataCommonEvents) Marriages.patch(object); return r; };
    }
    if (typeof Game_Map !== 'undefined') {
        const _refreshM = Game_Map.prototype.refresh;
        Game_Map.prototype.refresh = function () { const r = _refreshM.call(this); if (!this._coopSpouseMoved || this._coopSpouseMoved !== this._mapId) { this._coopSpouseMoved = this._mapId; try { Marriages.toMyRoom(); } catch (e) { Diag.err('spouse room', e); } } return r; };
        // WTE's schedule page puts the spouse at home by "set event location": a joiner's goes to their own room instead
        const _203 = Game_Interpreter.prototype.command203;
        Game_Interpreter.prototype.command203 = function (params) {
            const r = _203.call(this, params);
            if (this._mapId === Home.MAP && $gameMap.mapId() === Home.MAP) {
                const ev = this.character(params[0]);
                if (ev && ev instanceof Game_Event && Marriages.SPOUSE_EVENTS.includes(ev.eventId())) { try { Marriages.toMyRoom(ev); } catch (e) { Diag.err('spouse room', e); } }
            }
            return r;
        };
        const _setupM = Game_Map.prototype.setup;
        Game_Map.prototype.setup = function (mapId) { this._coopSpouseMoved = 0; return _setupM.call(this, mapId); };
    }

    // ---- Revive (decision 62): a new item in the database's one blank slot, sold by the General Store in co-op ----
    const Revive = {
        ID: 3000, PRICE: 50, ICON: 1493, SHOPS: /^General Store$/i,
        install() {
            const d = window.$dataItems, base = d && d[14];
            if (!d || !base || !d[this.ID] || (d[this.ID].name && d[this.ID].name !== 'Revive')) return;   // the slot is used: leave it
            const it = Object.assign(JSON.parse(JSON.stringify(base)), {
                id: this.ID, name: 'Revive', iconIndex: this.ICON, price: this.PRICE, consumable: true, scope: 9, occasion: 1,
                description: '\\c[0]Revives a downed player in a co-op battle\nwith half their \\c[21]HP\\c[0] and AP.',
                effects: [{ code: 11, dataId: 0, value1: 0.5, value2: 0 }],
                note: '<Categories>\nitems\npotion\nall\n</Categories>\n<actions>\nUse\n</actions>'
            });
            d[this.ID] = it;
            if (DataManager.extractMetadata) DataManager.extractMetadata(it);
        },
        is(item) { return !!item && item.id === this.ID && !!window.$dataItems && item === $dataItems[this.ID] && item.name === 'Revive'; },
        /** After it lands: exactly half HP; half the actions (rounded up), and a turn now if it's the players' phase. */
        after(a, wasDead) {
            if (!wasDead || a.isDead()) return;
            a.setHp(Math.max(1, Math.ceil(a.mhp / 2)));
            const max = typeof a.wteGetMaxAp === 'function' ? a.wteGetMaxAp() : 1;
            a._wteCurrentAp = Math.ceil(max / 2);
            if (a._wteCurrentAp > 0 && BattleManager._wteLastTeamActive === 'player' && BattleManager._subject !== a) {
                a._wteTurnActive = true; a._tpbChargeTime = 0.999; a._tpbCastTime = 0; a._tpbState = 'charging'; a.setActionState('undecided');
            }
            if (BattleManager.wteSyncApVariables) BattleManager.wteSyncApVariables();
        },
        /** In this shop's list right now? (a co-op session, a General Store) */
        inShop() {
            if (!Net.isPlaying() || !window.$gameShop || !this.is(window.$dataItems && $dataItems[this.ID])) return false;
            if (!this._names) { try { this._names = JSON.parse(PluginManager.parameters('DM_CoreShop')['Shop Manager'] || '[]').map(s => { try { return JSON.parse(s)['Shop Name'] || ''; } catch (e) { return ''; } }); } catch (e) { this._names = []; } }
            return this.SHOPS.test(this._names[$gameShop._tempShopId] || '');
        }
    };
    if (typeof DataManager !== 'undefined') {
        const _onLoad = DataManager.onLoad;
        DataManager.onLoad = function (object) { const r = _onLoad.call(this, object); if (object && object === window.$dataItems) Revive.install(); return r; };
    }
    if (typeof Window_CoreShopBuy !== 'undefined') {
        const _list = Window_CoreShopBuy.prototype.makeItemList;
        Window_CoreShopBuy.prototype.makeItemList = function () {
            _list.call(this);
            if (!Revive.inShop() || !Array.isArray(this._data)) return;
            const it = $dataItems[Revive.ID];
            if (this._data.includes(it)) return;
            const cat = this._category;
            if (!(cat === 'item' || cat === 'all' || (cat !== 'weapon' && cat !== 'armor' && cat !== 'keyItem' && this.getCategories && this.getCategories(it, cat)))) return;
            Object.assign(it, { amount: '', infinite: true, retained: true, unlockStatus: 0 });   // always in stock; never part of the shop's saved stock
            this._data.push(it); this._price.push(Revive.PRICE);
        };
    }
    if (typeof Game_Player !== 'undefined') {
        const _canMove = Game_Player.prototype.canMove;
        Game_Player.prototype.canMove = function () { return Duel.pulledWait ? false : _canMove.call(this); };   // pulled into a battle: a moment's stand-still
    }

    // =====================================================================
    // 7l. FESTIVALS TOGETHER (decision 53; Stardew's festival main event: everyone is there before it starts)
    //     WTE's festivals are open all day in town; every activity is each player's own. Its one main event, the Mayor's
    //     "Egg" Hunt, starts for everyone at once (the hunt switch is the world's): the player who answers "Yes" waits
    //     until everyone is by the Mayor (Cancel: start now; 3 minutes at most); the others are invited ("Go there" /
    //     "Not now"). Each player is judged on their own score at 6PM.
    // =====================================================================
    const Festival = {
        EGG: { map: 1, event: 290, x: 47, y: 18, goX: 47, goY: 20, hunt: 1141, fest: 1130, judged: 936, warp: 1143, hourVar: 127 },
        NEAR: 14, LIMIT_MS: 180000,
        wait: null,                   // mine: { since, seen, declined: Set } while my "Yes" waits for the others
        call: null,                   // someone's: { by, name, at, near } the Egg Hunt is about to start (I may be invited)
        asked: '',                    // the call I was already asked about
        active() { return Net.isPlaying() && (Net.isHost || Net.inWorld) && Net.playerCount() >= 2; },
        sw(i) { return !!window.$gameSwitches && $gameSwitches.value(i); },
        /** The Mayor's "Yes" branch: the command right after it (the countdown) waits for everyone. */
        gateIndex(list) {
            if (!Array.isArray(list)) return -1;
            if (list._coopEggGate === undefined) {
                const on = list.findIndex(c => c && c.code === 121 && c.parameters[0] === this.EGG.hunt && c.parameters[1] === this.EGG.hunt && c.parameters[2] === 0);
                let n = on; while (n > 0 && !(list[n].code === 402 && list[n].indent < list[on].indent)) n--;
                Object.defineProperty(list, '_coopEggGate', { value: on > 0 && n > 0 ? n + 1 : -1, enumerable: false });
            }
            return list._coopEggGate;
        },
        near(st) { return !!st && st.map === this.EGG.map && Math.max(Math.abs(st.x - this.EGG.x), Math.abs(st.y - this.EGG.y)) <= this.NEAR; },
        /** Who the hunt still waits for (names): not by the Mayor yet, and did not say "Not now". */
        missing() {
            const out = [];
            Net.peers.forEach((p, id) => { if (!p.loading && !(this.wait && this.wait.declined.has(id)) && !this.near(p.state)) out.push(p.name || 'a player'); });
            return out;
        },
        /** Before a command runs: false = wait here. */
        mayRun(interp) {
            if (!window.$gameMap || $gameMap.mapId() !== this.EGG.map || interp !== $gameMap._interpreter || interp.eventId() !== this.EGG.event) return true;
            if (interp._index !== this.gateIndex(interp._list) || !this.active() || this.sw(this.EGG.hunt)) { this.wait = null; return true; }
            const now = Date.now();
            if (!this.wait) { this.wait = { since: now, seen: now, declined: new Set() }; this.cast({ k: 'call' }); }
            this.wait.seen = now;
            const cancel = (typeof Input !== 'undefined' && Input.isTriggered('cancel')) || (typeof TouchInput !== 'undefined' && TouchInput.isCancelled());
            if (!cancel && now - this.wait.since < this.LIMIT_MS && this.missing().length) return false;
            this.wait = null;
            this.cast({ k: 'go' });
            return true;
        },
        isWaiting() { return !!this.wait && Date.now() - this.wait.seen < 1500; },
        /** To everyone (the host passes a joiner's on). */
        cast(m) {
            const msg = Object.assign({ t: 'FEST', f: 'egg', by: Net.selfId }, m);
            if (Net.isHost) { Net.broadcast(msg); } else Net.send(Net.hostId, Object.assign({}, msg, { t: 'FEST_UP' }));
        },
        receive(m) {
            if (m.f !== 'egg' || !['call', 'go', 'answer'].includes(m.k) || typeof m.by !== 'string') return;
            const name = Net.nameOf(m.by);
            if (m.k === 'call' && m.by !== Net.selfId) this.call = { by: m.by, name, at: Date.now() };
            if (m.k === 'go') {
                if (this.call && this.call.by === m.by) this.call = null;
                if (m.by !== Net.selfId) Diag.toast('The "Egg" Hunt has begun! Smash "Eggs" with an axe until 6PM.', 6000);
            }
            if (m.k === 'answer' && this.wait && m.by === Net.selfId && typeof m.id === 'string' && m.a === 0) {
                this.wait.declined.add(m.id);
                Diag.toast(Net.nameOf(m.id) + ' will join the "Egg" Hunt later.', 4000);
            }
        },
        /** Every frame on the map: the invite, once I am free to answer. */
        update() {
            this.judgeWhenDue();
            const c = this.call;
            if (!c) return;
            if (!this.active() || this.sw(this.EGG.hunt) || Date.now() - c.at > this.LIMIT_MS + 5000) { this.call = null; return; }
            const key = c.by + '@' + c.at;
            if (this.asked === key || this.near({ map: $gameMap.mapId(), x: $gamePlayer.x, y: $gamePlayer.y })) return;
            if ($gameMap.isEventRunning() || $gameMessage.isBusy() || SceneManager.isSceneChanging() || $gamePlayer.isTransferring()) return;
            this.asked = key;
            $gameMessage.add('\\c[6]' + c.name + '\\c[0] is starting the \\c[6]"Egg" Hunt\\c[0] with the Mayor in the park.');
            $gameMessage.add('Everyone should be there when it starts.');
            $gameMessage.setChoices(['Go there', 'Not now'], 0, 1);
            $gameMessage.setChoiceCallback(n => {
                if (n === 0) { $gamePlayer.reserveTransfer(this.EGG.map, this.EGG.goX, this.EGG.goY, 8, 0); return; }
                const msg = { t: 'FEST', f: 'egg', k: 'answer', by: c.by, id: Net.selfId, a: 0 };
                if (Net.isHost) Net.broadcast(msg); else Net.send(Net.hostId, Object.assign({}, msg, { t: 'FEST_UP' }));
            });
        },
        /** The notice under the clock. */
        text() {
            if (this.isWaiting()) { const m = this.missing(); return m.length ? 'Waiting for ' + m.slice(0, 3).join(', ') + ' to come to the "Egg" Hunt  (Cancel: start now)' : null; }
            const c = this.call;
            if (c && this.active() && !this.sw(this.EGG.hunt)) return c.name + ' is starting the "Egg" Hunt by the Mayor (park)';
            return null;
        },
        /** The hunt ended in another player's game first (its 6PM came a moment before mine): my own judging still happens
         *  when my clock reaches 6PM, exactly as WTE's own timer (CE2285) would start it. */
        judgeLater: false,
        huntEnded() { if (this.sw(this.EGG.fest) && !this.sw(this.EGG.judged)) this.judgeLater = true; },
        judgeWhenDue() {
            if (!this.judgeLater || !window.$gameVariables) return;
            if (!this.sw(this.EGG.fest) || this.sw(this.EGG.judged) || this.sw(this.EGG.hunt)) { this.judgeLater = false; return; }
            if ($gameVariables.value(this.EGG.hourVar) < 18) return;
            this.judgeLater = false;
            $gameSwitches.setValue(this.EGG.warp, true);
        },
        reset() { this.wait = null; this.call = null; this.asked = ''; this.judgeLater = false; }
    };

    // =====================================================================
    // 7j. SHARED PROGRESS (design §2.1, §2.6, decisions 47, 49): shop stock and discoveries (crafting recipes,
    //     encyclopedia, fast travel, world map) are the world's. Personal items in shops (tools, rods, keys, tomes) are
    //     stocked for every player separately; the quest log is each player's own (saved with the player).
    //     Crafting draws from chests nobody else is using.
    // =====================================================================
    const Progress = {
        applying: false, dirtyShops: new Set(), sent: new Map(), primed: false, lastTick: 0,
        active() { return WorldObjects.active(); },
        quiet() { return this.applying || WorldObjects.applying || (!Net.isHost && Spawns.stack.some(i => i && i._coopRng)); },
        reset() { this.dirtyShops.clear(); this.sent.clear(); this.primed = false; },
        // ---- shops (DM_CoreShop): what is left to buy ----
        shopDirty(i) { if (this.active() && !this.quiet() && isInt(i, 0, 999)) this.dirtyShops.add(i); },
        /** An item each player needs their own of: WTE marks them undroppable and unsellable (tools, fishing rods and reels,
         *  the net, quest keys, tomes, costumes, vouchers, the extra pouch). Not furniture, blueprints, recipes or contracts. */
        personalItem(it) {
            if (!it || typeof it.note !== 'string' || it.etypeId !== undefined || it.wtypeId !== undefined || it.atypeId !== undefined) return false;
            if (!/<undroppable>/i.test(it.note) || !/<Cannot Sell>/i.test(it.note) || /^(Blueprint|Recipe|Contract|Forge Upgrade)/i.test(it.name || '')) return false;
            return !(it.effects || []).some(e => e.code === 44 && this.placeCEs().has(e.dataId));   // furniture: using it places it (a world object)
        },
        _placeCEs: null,
        placeCEs() {
            if (!this._placeCEs && window.$dataCommonEvents) { this._placeCEs = new Set(); $dataCommonEvents.forEach(c => { if (c && c.list.some(x => x.code === 357 && x.parameters[0] === 'PKD_PocketEvents' && /PlacePocketEvent/.test(x.parameters[1]))) this._placeCEs.add(c.id); }); }
            return this._placeCEs || new Set();
        },
        isPersonalRow(d, it) {
            if (!d || d.etypeId !== undefined) return false;
            const item = (window.$dataItems && $dataItems[d.itemId]) || it;
            if (this.personalItem(item) || this.isPet(item)) return true;
            return this.limited(d.amount) && !this.worldUnlock(item);         // decision 64: a limited stock is everyone's own
        },
        /** A row with a stock count (not the shop's endless supply). */
        limited(amount) { return amount !== '' && amount !== undefined && amount !== null && amount !== -1 && isNum(Number(amount), 0, 1e7); },
        /** Bought once for the whole world: knowledge and buildings (the world has them, not a player). */
        worldUnlock(it) { return !!it && /^(Blueprint|Recipe|Contract|Forge Upgrade)/i.test(it.name || ''); },
        isPet(it) { return !!it && typeof it.note === 'string' && /<Categories>[^<]*\bpet\b[^<]*<\/Categories>/i.test(it.note); },
        packShop(i) {
            const s = window.$gameShop && $gameShop._coreShops && $gameShop._coreShops[i];
            if (!s) return null;
            const items = s._storedContents || [], out = [];
            (s._storedDataContents || []).forEach((d, n) => {
                const it = items[n] || {}, kind = it.wtypeId !== undefined ? 1 : it.atypeId !== undefined ? 2 : 0;
                if (!d) return;
                if (kind === 0 && this.isPersonalRow(d, it)) {                    // my own count: never the world's; the row itself is offered
                    const b = this.base()[i + ':' + (d.itemId | 0)], amt = b ? b[0] : (d.amount === '' ? -1 : Number(d.amount) || 0);
                    const own = [3, d.itemId | 0, amt, -1, it.infinite ? 1 : 0, b ? b[1] | 0 : it.unlockStatus | 0];
                    if (it.newDatabasePrice !== undefined && isInt(Number(it.price), 0, 1e8)) own.push(Number(it.price));   // its own price (decision 91)
                    out.push(own);
                    return;
                }
                const row = [kind, d.itemId | 0, d.amount === '' ? -1 : Number(d.amount) || 0, d.etypeId === undefined ? -1 : d.etypeId | 0, it.infinite ? 1 : 0, it.unlockStatus | 0];
                if (it.newDatabasePrice !== undefined && isInt(Number(it.price), 0, 1e8)) row.push(Number(it.price));   // its own price (decision 91)
                out.push(row);
            });
            return out;
        },
        // ---- personal stock: what each player has left of the tools/keys/tomes a shop sells ----
        /** The stock a personal item had before anyone bought it (the world keeps it, so a new player finds it in the shop). */
        base() { const s = window.$gameSystem; if (!s) return {}; if (!s._coopShopBase || typeof s._coopShopBase !== 'object') s._coopShopBase = {}; return s._coopShopBase; },
        setBase(k, a, u) { const b = this.base(); if (!b[k]) b[k] = [a, u]; },
        noteBase(i, d, it) {
            const k = i + ':' + d.itemId;
            if (this.base()[k] || !this.isPersonalRow(d, it)) return;
            const a = d.amount === '' ? -1 : Number(d.amount) || 0, u = (it && it.unlockStatus) | 0;
            this.setBase(k, a, u);
            if (this.active()) WorldObjects.emit('sbase', { k, a, u });
        },
        entry(id, amount, unlock) {                                            // a shop row as DM_CoreShop builds it
            const d = window.$dataItems && $dataItems[id];
            if (!d) return null;
            const amt = amount === -1 ? '' : amount;
            d.amount = amt; d.infinite = amount === -1; d.unlockStatus = unlock | 0; d.retained = true;
            if (d.meta && d.meta.itemWeight) d.itemWeight = d.meta.itemWeight;
            return { data: { itemId: id, amount: amt, etypeId: undefined }, it: d };
        },
        /** My personal rows in every shop (saved with me). */
        ownRows() {
            const out = {}, shops = (window.$gameShop && $gameShop._coreShops) || [];
            shops.forEach((s, i) => {
                if (!s) return;
                const rows = [];
                (s._storedDataContents || []).forEach((d, n) => { const it = (s._storedContents || [])[n]; if (this.isPersonalRow(d, it)) rows.push([d.itemId | 0, d.amount === '' ? -1 : Number(d.amount) || 0, (it && it.unlockStatus) | 0]); });
                this.removed.forEach(k => { const [si, id] = k.split(':').map(Number); if (si === i) rows.push([id, -2, 0]); });   // taken out by my story
                if (rows.length) out[i] = rows;
            });
            return out;
        },
        removed: new Set(),                                                    // 'shop:item' rows my own story removed
        /** Put my personal rows in place of the world copy's (rows: shop -> [[id, amount, unlock]]); null = a new player:
         *  every personal item back at the stock it had before anyone bought it. */
        setOwnRows(rows) {
            const shops = (window.$gameShop && $gameShop._coreShops) || [], b = this.base();
            this.removed = new Set();
            shops.forEach((s, i) => {
                if (!s || !Array.isArray(s._storedDataContents)) return;
                const data = [], items = [], cur = new Map();
                s._storedDataContents.forEach((d, n) => {
                    const it = (s._storedContents || [])[n];
                    if (this.isPersonalRow(d, it)) { cur.set(d.itemId, [d.amount === '' ? -1 : Number(d.amount) || 0, (it && it.unlockStatus) | 0]); return; }
                    data.push(d); items.push(it);
                });
                let mine;
                if (rows) {
                    mine = (rows[i] || []).filter(x => Array.isArray(x) && isInt(x[0], 1, 99999) && isInt(x[1], -2, 1e7) && isInt(x[2], 0, 9));
                    const had = new Set(mine.map(x => x[0]));
                    mine = mine.filter(x => { if (x[1] !== -2) return true; this.removed.add(i + ':' + x[0]); return false; });
                    cur.forEach((v, id) => { if (had.has(id) || this.personalItem(window.$dataItems && $dataItems[id])) return; const bb = b[i + ':' + id]; mine.push([id, bb ? bb[0] : v[0], bb ? bb[1] : v[1]]); });   // newly own rows (pets, limited stock); a tool missing from an older save was bought out
                }
                else {                                                             // new: what the shop has, plus what was bought out
                    const all = new Map(cur);
                    Object.keys(b).forEach(k => { const [si, id] = k.split(':').map(Number); if (si === i) all.set(id, b[k]); });
                    mine = Array.from(all.entries()).map(([id, v]) => [id, v[0], v[1]]).filter(x => x[1] !== 0);
                }
                mine.forEach(([id, amount, unlock]) => { const e = this.entry(id, amount, unlock); if (e) { data.push(e.data); items.push(e.it); } });
                s._storedDataContents = data; s._storedContents = items;
            });
        },
        validShop(rows) { return Array.isArray(rows) && rows.length <= 600 && rows.every(r => Array.isArray(r) && (r.length === 6 || (r.length === 7 && isInt(r[6], 0, 1e8))) && isInt(r[0], 0, 3) && isInt(r[1], 1, 99999) && isInt(r[2], -1, 1e7) && isInt(r[3], -1, 99) && isInt(r[4], 0, 1) && isInt(r[5], 0, 9)); },
        applyShop(i, rows) {
            const s = window.$gameShop && $gameShop._coreShops && $gameShop._coreShops[i];
            if (!s) return;
            const oldData = s._storedDataContents || [], oldItems = s._storedContents || [], data = [], items = [], own = [];
            oldData.forEach((d, n) => { if (this.isPersonalRow(d, oldItems[n])) own.push({ n, d, it: oldItems[n] }); });   // my own stock stays mine
            const mine = new Set(own.map(o => o.d.itemId));
            rows.forEach(([kind, id, amount, et, inf, unlock, price]) => {
                if (kind === 3) {                                                  // a row each player has their own of: mine, if I have none yet
                    if (isInt(price, 0, 1e8)) own.forEach(o => { if (o.d.itemId === id && o.it) { o.it.price = price; o.it.newDatabasePrice = price; } });   // the price is the item's, my stock stays mine (decision 91)
                    if (mine.has(id) || this.removed.has(i + ':' + id)) return;
                    const e = this.entry(id, amount, unlock); if (!e) return;
                    if (isInt(price, 0, 1e8)) { e.it.price = price; e.it.newDatabasePrice = price; }   // its own price (decision 91)
                    data.push(e.data); items.push(e.it); mine.add(id); return;
                }
                if (kind === 0 && this.isPersonalRow({ itemId: id, etypeId: et === -1 ? undefined : et, amount: amount === -1 ? '' : amount })) return;
                const db = kind === 1 ? window.$dataWeapons : kind === 2 ? window.$dataArmors : window.$dataItems, d = db && db[id];
                if (!d) return;
                const etypeId = et === -1 ? undefined : et, n = oldData.findIndex(x => x && x.itemId === id && x.etypeId === etypeId);
                const it = n >= 0 && oldItems[n] ? oldItems[n] : d;            // DM_CoreShop keeps the database entry itself
                const amt = amount === -1 ? '' : amount;
                it.amount = amt; it.infinite = inf === 1; it.unlockStatus = unlock; if (it.retained === undefined) it.retained = true;
                if (isInt(price, 0, 1e8)) { it.price = price; it.newDatabasePrice = price; }   // the row's own price, as DM_CoreShop sets it (decision 91)
                if (it.meta && it.meta.itemWeight) it.itemWeight = it.meta.itemWeight;
                data.push({ itemId: id, amount: amt, etypeId }); items.push(it);
            });
            own.forEach(o => { const at = Math.min(o.n, data.length); data.splice(at, 0, o.d); items.splice(at, 0, o.it); });
            s._storedDataContents = data; s._storedContents = items;
            const sc = SceneManager._scene;                                    // someone bought while I'm in the same shop: show what is left
            if (typeof Scene_CoreShop !== 'undefined' && sc instanceof Scene_CoreShop && $gameShop._tempShopId === i && sc._windowLayer)
                sc._windowLayer.children.forEach(w => { try { if (w && w.visible && typeof w.refresh === 'function') w.refresh(); } catch (e) { /* a window without items */ } });
        },
        // ---- discoveries: anyone's discovery is everyone's (shared-merge, D21) ----
        ENCY: { bestiary: '_bestiary', items: '_items', armors: '_armors', weapons: '_weapons', skills: '_skills', states: '_states', actors: '_actors' },
        discoveries() {
            const out = {}, c = window.$cgmz;
            if (!c) return out;
            if (c._recipes) out.r = Object.values(c._recipes).filter(r => r && r._discovered).map(r => String(r._name));
            const en = c._encyclopedia;
            if (en) {
                Object.keys(this.ENCY).forEach(sym => { const a = en[this.ENCY[sym]]; if (Array.isArray(a)) out['e:' + sym] = a.filter(o => o && o._discovered).map(o => o._id); });
                Object.keys(en._customData || {}).forEach(sym => { const a = en._customData[sym]; if (Array.isArray(a)) out['e:' + sym] = a.filter(o => o && o._discovered).map(o => o._id); });
            }
            if (Array.isArray(c._fastTravelPoints)) out.f = c._fastTravelPoints.filter(p => p && p._discovered).map(p => String(p._name));
            const mk = c._worldMapData && c._worldMapData.markers;
            if (mk) out.m = Object.keys(mk).filter(k => mk[k] && mk[k].visible).map(String);
            return out;
        },
        validDisc(d) { return !!d && typeof d === 'object' && Object.keys(d).length <= 40 && Object.keys(d).every(k => /^(r|f|m|e:[\w ]{1,40})$/.test(k) && Array.isArray(d[k]) && d[k].length <= 3000 && d[k].every(x => (typeof x === 'string' && x.length <= 80) || isInt(x, 0, 99999))); },
        applyDisc(d) {
            const c = window.$cgmz;
            if (!c) return;
            (d.r || []).forEach(n => { const r = c.getRecipe && c.getRecipe(n); if (r && !r._discovered) r._discovered = true; });   // learned without the "learned" toast
            Object.keys(d).filter(k => k.startsWith('e:')).forEach(k => { try { d[k].forEach(id => c.encyclopediaDiscovery(k.slice(2), id)); } catch (e) { /* that book is not in this build */ } });
            (d.f || []).forEach(n => { try { c.discoverFastTravelPoint(n, true); } catch (e) { /* unknown stop */ } });
            const mk = c._worldMapData && c._worldMapData.markers;
            (d.m || []).forEach(k => { if (mk && mk[k] && !mk[k].visible) mk[k].visible = true; });
            const now = this.discoveries();                                    // what I have now is known to be shared already
            Object.keys(now).forEach(k => this.sent.set('d:' + k, now[k].join('|')));
        },
        /** Every half second: send what changed here (a quest step, a recipe learned, a shop sale). */
        tick(now) {
            if (!this.active() || now - this.lastTick < 500 || !window.$cgmz) return;
            this.lastTick = now;
            if (!this.primed) { this.primed = true; this.prime(); return; }
            if (this.quiet()) return;
            this.dirtyShops.forEach(i => { const rows = this.packShop(i); if (rows) WorldObjects.emit('shop', { i, rows }); });
            this.dirtyShops.clear();
            const d = this.discoveries(), add = {};
            Object.keys(d).forEach(k => {
                const s = d[k].join('|'), was = this.sent.get('d:' + k);
                if (was === s) return;
                const old = new Set(was ? was.split('|') : []), fresh = d[k].filter(x => !old.has(String(x)));
                this.sent.set('d:' + k, s);
                if (fresh.length) add[k] = fresh;
            });
            if (Object.keys(add).length) WorldObjects.emit('disc', { d: add });
        },
        prime() {
            const d = this.discoveries();
            Object.keys(d).forEach(k => this.sent.set('d:' + k, d[k].join('|')));
        },
        // ---- the storage crafting draws from (DM_LimitedInventory take all / put back) ----
        drawn: []
    };

    const Mobs = {
        STATE_VAR: 1661, DEATH_CES: [1, 26], SEND_MS: 120, IDLE_RELEASE_MS: 3000,
        owners: new Map(),            // "map,event" -> { by: player id, b: name of who is fighting it ('' = no battle) }
        last: new Map(),              // "map,event" -> last position sent / idle since
        claimAt: new Map(),
        battle: null,                 // { m, e }: my own fight
        result: null,                 // my last battle's result (0 = won)
        lastSend: 0, applying: false,
        active() { return Net.isPlaying() && (Net.isHost || Net.inWorld) && Net.playerCount() >= 2; },
        key(m, e) { return m + ',' + e; },
        /** A monster stays one after its page changes (the noticed/battle pages have no sight of their own). */
        isMob(ev) {
            if (!ev || ev._erased || Spawns.personalEvent(ev._mapId, ev._eventId)) return false;   // a quest's monster is each player's own
            if (ev._wteHasVisionFeatures === true && (ev._wteMaxSensorRange > 0 || ev._wtePursueRange > 0)) ev._coopMob = true;   // sees/hears or pursues (not a wandering crow)
            return !!ev._coopMob;
        },
        entry(m, e) { return this.owners.get(this.key(m, e)) || null; },
        owns(m, e) { const o = this.entry(m, e); return o && o.by ? o.by === Net.selfId : Spawns.authority(m); },
        busy(m, e) { const o = this.entry(m, e); return !!(o && o.by); },
        stateOf(m, e) { return window.$gameVariables ? $gameVariables.selfValue([m, e, this.STATE_VAR]) : 0; },
        fightingName(m, e) { const o = this.entry(m, e); return o && o.b && o.by !== Net.selfId ? o.b : ''; },   // shown to the others, not to the fighter
        // ---- requests (every game) ----
        claim(m, e, why) {
            const k = this.key(m, e), now = Date.now();
            if (now - (this.claimAt.get(k) || 0) < 1000) return;
            this.claimAt.set(k, now);
            if (Net.isHost) this.hostClaim(Net.selfId, m, e);
            else Net.send(Net.hostId, { t: 'MOBC', m, e, why });
        },
        release(m, e) { if (Net.isHost) this.hostRelease(Net.selfId, m, e); else Net.send(Net.hostId, { t: 'MOBR', m, e }); },
        fight(m, e, on) { if (Net.isHost) this.hostFight(Net.selfId, m, e, on); else Net.send(Net.hostId, { t: 'MOBB', m, e, on: on ? 1 : 0 }); },
        // ---- host: the table of owners ----
        nameOf(id) { return id === Net.selfId ? hostName(Net) : ((Net.peers.get(id) || {}).name || 'a player'); },
        publish(m, e) { const o = this.entry(m, e); Net.broadcast({ t: 'MOBO', m, e, by: o ? o.by : '', b: o ? o.b : '' }); },
        hostClaim(from, m, e) {
            const o = this.entry(m, e);
            if (o && o.by && o.by !== from && (o.by === Net.selfId || Net.peers.has(o.by))) return;   // hunting / fighting someone else
            this.owners.set(this.key(m, e), { by: from, b: '' });
            this.publish(m, e);
        },
        hostRelease(from, m, e) { const o = this.entry(m, e); if (o && o.by === from) { this.owners.delete(this.key(m, e)); this.publish(m, e); } },
        hostFight(from, m, e, on) {
            const o = this.entry(m, e);
            if (o && o.by && o.by !== from && (o.by === Net.selfId || Net.peers.has(o.by))) return;
            if (on) this.owners.set(this.key(m, e), { by: from, b: this.nameOf(from) });
            else this.owners.delete(this.key(m, e));
            this.publish(m, e);
        },
        /** Host: a player left the map or the game: their monsters go back to the map. */
        hostSweep() {
            this.owners.forEach((o, k) => {
                if (!o.by || o.by === Net.selfId) return;
                const p = Net.peers.get(o.by), m = Number(k.split(',')[0]);
                if (!p || (p.state && p.state.map !== m && !o.b)) { this.owners.delete(k); const [mm, ee] = k.split(',').map(Number); this.publish(mm, ee); }
            });
        },
        table() { const t = []; this.owners.forEach((o, k) => { const [m, e] = k.split(',').map(Number); t.push([m, e, o.by, o.b || '']); }); return t; },
        applyOwner(m, e, by, b) {
            const k = this.key(m, e);
            if (by) this.owners.set(k, { by, b: b || '' }); else this.owners.delete(k);
            const ev = Spawns.onMap(m) && $gameMap.event(e);
            if (ev && by === Net.selfId && !b) {                            // mine now: let WTE's sensors notice me afresh
                ev._wtePlayerWasInside = false; ev._wteHasFired = false; ev._wteTriggerDelay = 0; ev._wteCooldownTimer = 0;
            }
        },
        // ---- every frame on the map ----
        update(now) {
            if (!this.active() || !window.$gameMap) return;
            if (Net.isHost && now - (this._sweep || 0) > 1000) { this._sweep = now; this.hostSweep(); }
            const m = $gameMap.mapId(), out = [];
            $gameMap.events().forEach(ev => {
                if (!this.isMob(ev)) return;
                const e = ev.eventId(), k = this.key(m, e), st = this.stateOf(m, e), o = this.entry(m, e);
                if (this.owns(m, e)) {
                    if (st >= 1 && !(o && o.by)) this.claim(m, e, 'pin');          // hunting: keep it while it hunts me
                    const l = this.last.get(k) || {};
                    if (o && o.by === Net.selfId && !o.b) {                       // hunting nobody for a while: back to the map
                        if (st === 0) { if (!l.idle) l.idle = now; else if (now - l.idle > this.IDLE_RELEASE_MS) { l.idle = 0; this.release(m, e); } }
                        else l.idle = 0;
                    }
                    const sig = ev.x + ',' + ev.y + ',' + ev.direction() + ',' + st;
                    if (sig !== l.sig) { l.sig = sig; out.push([e, ev.x, ev.y, ev.direction(), st]); }
                    this.last.set(k, l);
                } else if (!this.busy(m, e) && st === 0 && this.sees(ev)) this.claim(m, e, 'see');
            });
            if (out.length && now - this.lastSend >= this.SEND_MS) {
                this.lastSend = now;
                if (Net.isHost) Net.broadcast({ t: 'MOBPS', m, by: Net.selfId, l: out });
                else Net.send(Net.hostId, { t: 'MOBP', m, l: out });
            } else if (out.length) out.forEach(r => { const l = this.last.get(this.key(m, r[0])); if (l) l.sig = ''; });   // send next time
        },
        /** WTE's own sight/hearing checks, against my player, without starting anything. */
        sees(ev) {
            if (!ev.wteIsInRadius || !window.$gamePlayer) return false;
            const p = $gamePlayer, px = p._realX, py = p._realY, ex = ev._realX, ey = ev._realY;
            if (ev._wteRadius > 0 && ev.wteIsInRadius(px, py, ex, ey, ev._wteRadius)) return true;
            return ev._wteLoS > 0 && ev.wteIsInLineOfSight(px, py, ex, ey, ev._wteLoS, ev.direction()) && ev.wteCheckTrueLoS(px, py);
        },
        /** Another game moved one of its monsters. */
        applyPositions(m, l) {
            if (!Spawns.onMap(m) || !Array.isArray(l)) return;
            this.applying = true;
            try {
                l.forEach(r => {
                    if (!Array.isArray(r) || !isInt(r[0], 1, 99999) || !isInt(r[1], 0, 999) || !isInt(r[2], 0, 999) || ![2, 4, 6, 8].includes(r[3]) || !isInt(r[4], 0, 99)) return;
                    const [e, x, y, d, st] = r, ev = $gameMap.event(e);
                    if (!ev || this.owns(m, e)) return;
                    if (Math.abs(ev._realX - x) > 2 || Math.abs(ev._realY - y) > 2) ev.locate(x, y);   // far: jump
                    else { ev._x = x; ev._y = y; }                                // near: WTE walks it there
                    ev.setDirection(d);
                    if (this.stateOf(m, e) !== st) { $gameVariables.setSelfValue([m, e, this.STATE_VAR], st); ev.refresh(); }
                });
            } finally { this.applying = false; }
        },
        // ---- my battle ----
        battleStarted(ev) { if (!this.active() || !this.isMob(ev)) return; const m = $gameMap.mapId(), e = ev.eventId(); this.battle = { m, e, lost: false }; this.result = null; this.fight(m, e, true); },
        /** The death sequence started during my fight: I lost it. */
        died() { if (this.battle) this.battle.lost = true; },
        /** After a lost fight WTE's battle page would still mark the monster defeated and erase it: not in co-op. */
        keepAlive(interp, code, params) {
            const b = this.battle;
            if (!b || !b.lost || !window.$gameMap || $gameMap.mapId() !== b.m || interp._eventId !== b.e) return false;
            return code === 214 || (code === 123 && params[0] === 'A' && params[1] === 0);
        },
        /** Back on the map: wait until the monster's own battle page has finished (it marks the monster defeated). */
        afterBattle() { if (this.battle) this.battle.back = Date.now(); },
        /** Every frame: a fight whose page is done is settled (won = gone for everyone, lost = back to wandering). */
        settle(now) {
            const b = this.battle;
            if (!b || !b.back || !window.$gameMap) return;
            const running = $gameMap.isEventRunning() && $gameMap._interpreter.eventId() === b.e && $gameMap.mapId() === b.m;
            if (running && now - b.back < 15000) return;
            this.battle = null;
            this.endFight(b);
        },
        endFight(b) {
            // WTE ends a won fight with Abort Battle (result 1), so the monster's own 'defeated' switch (A) says who won
            const won = !b.lost && (this.result === 0 || (window.$gameSelfSwitches && $gameSelfSwitches.value([b.m, b.e, 'A'])));
            if (!won && window.$gameMap && $gameMap.mapId() === b.m) {
                this.applying = true;
                try {
                    ['B', 'D'].forEach(c => $gameSelfSwitches.setValue([b.m, b.e, c], false));
                    $gameVariables.setSelfValue([b.m, b.e, this.STATE_VAR], 0);
                    const ev = $gameMap.event(b.e); if (ev) { if (ev.wteForceDropPursuit) ev.wteForceDropPursuit(); ev.refresh(); }
                } finally { this.applying = false; }
            }
            this.fight(b.m, b.e, false);
            Pack.done(won);
        },
        inDeath() { return Spawns.stack.some(i => i._coopDeath); },
        reset() { this.owners.clear(); this.last.clear(); this.claimAt.clear(); this.battle = null; this.result = null; Pack.reset(); }
    };

    // =====================================================================
    // 7c. SHARED DAILY ROLLS
    // =====================================================================
    /** The game's midnight event (Moon phase, weather, shop stock, NPC schedules, visitors...) is driven by
     *  Math.random, so two players would otherwise wake up to two different days. While that common event (and
     *  the common events it calls) executes, Math.random is replaced with a PRNG seeded from the session seed
     *  and the midnight's date, so every player's roll is identical. Only the interpreter's own update call is
     *  affected; the engine's other random users are untouched. */
    function hash32(str) {
        let h = 2166136261 >>> 0;
        for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
        return h >>> 0;
    }
    function mulberry32(seed) {
        let a = seed >>> 0;
        return function () {
            a = (a + 0x6D2B79F5) | 0;
            let t = Math.imul(a ^ (a >>> 15), 1 | a);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }
    const Daily = {
        active() { return CFG.seedDaily && Net.isPlaying() && Net.sessionSeed !== null && !!window.$gameTime; },
        /** Which midnight this is, robust to clients being a minute apart: round to the NEAREST midnight (UTC maths, no time zones). */
        dayKey() {
            const t = window.$gameTime;
            return Math.round(Date.UTC(t.year, t.month, t.day, t.hour, t.min, t.sec) / 86400000);
        },
        make(path) { return { path, fn: mulberry32(hash32(Net.sessionSeed + '|' + this.dayKey() + '|' + path)) }; },
        LUCK_DIE_CE: 36,                                                  // "Roll Die 1-6": the night's luck die, each player's own
        /** This character, for a roll that is each player's own: the same on every reconnect. */
        me() { return 'p:' + (Net.playerId || (Net.isHost ? 'host' : Net.selfId) || '?'); },
        isMidnightList(list) {
            const ce = window.$dataCommonEvents && window.$dataCommonEvents[CFG.midnightCE];
            return !!(ce && list && ce.list === list);
        }
    };

    // =====================================================================
    // 7d. GROUP RITUAL GATE (engine side)
    // =====================================================================
    const Ritual = {
        bedCounterBefore: null,
        /** Is this the real (non-tutorial) bed/bath? */
        inTutorial() { return !!(window.$gameSwitches && CFG.tutorialSwitch && window.$gameSwitches.value(CFG.tutorialSwitch)); },
        REST_CE: 23,
        WORLD_CES: [18, 66],                     // REST RESET's Resource Respawn and Mob Respawn
        /** Each player bathes on their own (decision 130): the bath heals them and resets their own daily things; the
         *  world (respawns, rooms, its shared values) waits for the night, or for everyone falling together. */
        inBath(interp) { return Net.isPlaying() && !!interp && !!interp._coopBath && !!interp._coopRest; },
        restQuiet() { return Net.isPlaying() && Spawns.stack.some(i => this.inBath(i)); },
        isRestList(list) { const ce = window.$dataCommonEvents && $dataCommonEvents[this.REST_CE]; return !!ce && ce.list === list; },
        cancelPressed() {
            return (typeof Input !== 'undefined' && Input.isTriggered('cancel')) || (typeof TouchInput !== 'undefined' && TouchInput.isCancelled());
        },
        terminate(interp) { if (typeof interp.command115 === 'function') interp.command115(); else if (interp._list) interp._index = interp._list.length; },
        /** Called every frame by the gated command. Returns false = keep waiting, 'free' = not a group action (vanilla),
         *  'go' = everyone is ready, run the game's own sequence now. */
        gate(interp, kind) {
            if (!Net.ritualActive() || this.inTutorial()) { interp._coopGate = null; return 'free'; }
            const rl = Net.rl;
            if (!interp._coopGate || interp._coopGate.kind !== kind) {
                if (!Net.ritualReady(kind)) return 'free';             // cannot coordinate right now: never trap the player
                interp._coopGate = { kind };
                return false;
            }
            if (!rl || rl.kind !== kind) { interp._coopGate = null; return 'free'; }   // session ended while waiting: vanilla
            if (rl.phase === 'go') { interp._coopGate = null; if (kind === 'sleep') Night.slept(); return 'go'; }
            if (rl.phase === 'abort') {
                interp._coopGate = null; const msg = rl.msg; Net.rl = null; Net.ritualUi(msg);
                this.cancelCleanup(kind, interp); this.terminate(interp); return false;
            }
            if (rl.phase === 'ready' && kind === 'sleep') Night.midnightInBed(interp);
            if (rl.phase === 'ready' && !interp._childInterpreter && this.cancelPressed()) {
                interp._coopGate = null; Net.ritualCancel(kind); Net.ritualUi('Cancelled.');
                this.cancelCleanup(kind, interp); this.terminate(interp); return false;
            }
            return false;
        },
        /** Undo what the game's bed event already did before the gate (it ran "Yes" first). */
        cancelCleanup(kind, interp) {
            if (kind !== 'sleep') return;
            Night.gotUp();
            if (this.bedCounterBefore !== null && window.$gameVariables) window.$gameVariables.setValue(CFG.bedCounterVar, this.bedCounterBefore);
            try { if (typeof PluginManager !== 'undefined' && PluginManager.callCommand) PluginManager.callCommand(interp, 'DM_CustomMapMouse', 'setPluginStatus', { value: 'true' }); }
            catch (e) { console.warn('[Elderfield MP] could not re-enable the map mouse', e); }
        }
    };

    // =====================================================================
    // 7e. NIGHT AND CUTSCENE SYNC (design §3, §6.2, §6.3; decisions 14, 16, 18, 22, 31)
    //     - The shared clock is the host's. In a session only the night, the morning and REST RESET may pause it
    //       (on the host); every other "PauseGameTime" (placing furniture, scenes) is ignored, joiners never pause it.
    //     - Barriers: the host holds the clock after its own midnight (CE507: moon, world updates) until every
    //       player's midnight has finished, and after its own morning (CE962: dreams, rolls) until every player is
    //       awake, so the next part of the night/day starts together, like Stardew's new-day barriers.
    //     - 23:59 hold: midnight waits while someone is in a scene or message.
    //     - Bed countdown: 60 s after the first player goes to bed, whoever is still up passes out in their own bed
    //       with WTE's own sleepless penalty (V1248 +1, CE458) and then runs WTE's own "Sleep → Yes" steps.
    // =====================================================================
    // ---- the map's own rolls are the world's (decision 92): see the header of moon-edit ----
    const AutoRoll = {
        /** An automatic page of a map event (it starts by itself) on my map, in a session, outside midnight's own seeding. */
        key(interp) {
            if (!interp || !interp._coopAuto || !(interp._eventId > 0) || !Daily.active() || !window.$gameMap || !window.$gameVariables) return '';
            if (Spawns.stack.some(i => i && i._coopRng)) return '';
            return $gameMap.mapId() + '|' + interp._eventId + '|' + $gameVariables.value(250) + '|' + (interp._depth || 0);
        },
        runs: new Map(), runsMap: 0,
        /** The page's dice for this run: its first run since the map loaded rolls the same in every game (a once-a-day roll
         *  like the treasure tentacle); a page that loops gets fresh dice on each later run (an ambient chance stays a chance). */
        rng(interp, k) {
            if (!interp._coopRoll || interp._coopRoll.k !== k) {
                if (this.runsMap !== $gameMap.mapId()) { this.runsMap = $gameMap.mapId(); this.runs.clear(); }
                const n = this.runs.get(k) || 0; this.runs.set(k, n + 1);
                interp._coopRoll = { k, fn: n === 0 ? Daily.make('auto|' + k).fn : Math.random.bind(Math) };
                if (n > 0) interp._coopRoll.fn = this.native;
            }
            return interp._coopRoll.fn;
        },
        native: Math.random,
        inRoll() { return Spawns.stack.some(i => i && i._coopRoll && i._coopAuto && i._eventId > 0); }
    };
    if (typeof Game_Interpreter !== 'undefined') {
        const _setupRoll = Game_Interpreter.prototype.setup;
        Game_Interpreter.prototype.setup = function () { this._coopRoll = null; return _setupRoll.apply(this, arguments); };   // each run of the page rolls the same sequence
        const _execRoll = Game_Interpreter.prototype.executeCommand;
        Game_Interpreter.prototype.executeCommand = function () {
            const k = AutoRoll.key(this);
            if (!k) return _execRoll.apply(this, arguments);
            const saved = Math.random; Math.random = AutoRoll.rng(this, k);
            try { return _execRoll.apply(this, arguments); } finally { Math.random = saved; }
        };
    }

    // ---- world counters: the map's authority counts (decision 92): see the header of moon-edit ----
    const Counters = {
        quiet: false, touched: new Set(), host: new Map(),
        /** A value of the host's (or what I sent as the world's): what a quiet counter goes back to. */
        noteHost(i, v) { this.host.set(i, v); },
        /** Every map frame: the automatic pages are over, so the counters they changed here go back to the world's. */
        settle() {
            if (!this.touched.size || Spawns.stack.length || ($gameMap && $gameMap._interpreter && $gameMap._interpreter.isRunning() && $gameMap._interpreter._coopAuto) || (!Net.isHost && Night.isRunningCE(Night.CE.midnight))) return;
            Shared.applying = true;
            try { this.touched.forEach(i => { if (this.host.has(i)) $gameVariables.setValue(i, this.host.get(i)); }); }
            finally { Shared.applying = false; }
            this.touched.clear();
        },
        reset() { this.quiet = false; this.touched.clear(); this.host.clear(); }
    };
    if (typeof Game_Interpreter !== 'undefined') {
        const _122count = Game_Interpreter.prototype.command122;
        Game_Interpreter.prototype.command122 = function (params) {
            if (Net.isPlaying() && params && [1, 2, 3, 4, 5].includes(params[2]) && window.$gameMap && (Spawns.quiet($gameMap.mapId()) || (!Net.isHost && Night.isRunningCE(Night.CE.midnight)))) {   // + a joiner's own midnight (decision 95)
                let world = false; for (let i = params[0]; i <= params[1]; i++) if (CFG.sharedVars.has(i)) { world = true; Counters.touched.add(i); }
                if (world) { Counters.quiet = true; try { return _122count.apply(this, arguments); } finally { Counters.quiet = false; } }   // here only: the authority counts for everyone
            }
            return _122count.apply(this, arguments);
        };
    }

    // ---- WTE's how-to pop-ups: each player's own (user, 2026-11-04: "it should be individualized and not happen when another
    //      player performs the task ... so it wont interfere with other players screens"). Decision 106 sent each one to
    //      everyone; now a pop-up shows only to the player who used the thing, and its "!" and "seen" switch are that
    //      player's own (SEEN_POPUPS, FirstTime.TUTORIAL_SPOTS), so everyone gets each one for themselves. ----
    const Tutorials = {
        FIRST: 1974, LAST: 1991, queue: [], starting: false,
        is(id) { return isInt(id, this.FIRST, this.LAST); },
        /** The tutorials this player has seen (kept with their character, so with their own data in a co-op world). */
        seen() { const a = window.$gameActors && $gameActors.actor(1); if (!a) return null; if (!Array.isArray(a._coopTuts)) a._coopTuts = []; return a._coopTuts; },
        /** My game shows a tutorial: remembered. Nobody else is sent it. */
        shown(id) {
            if (!Net.isPlaying() || this.starting || !this.is(id)) return;
            const s = this.seen(); if (s && !s.includes(id)) s.push(id);
        },
        got(id) { /* another player's pop-up (an older co-op build sends them): never shown here */ },
        /** Map frame: a tutorial someone else saw starts here once I'm free. */
        update() {
            if (!this.queue.length || !window.$gameTemp || !Invites.free() || $gameTemp.isCommonEventReserved() || Scenes.running || Scenes.holding) return;
            if (typeof Scene_Map === 'undefined' || !(SceneManager._scene instanceof Scene_Map)) return;
            const id = this.queue.shift(), s = this.seen();
            if (s && s.includes(id)) return;
            if (s) s.push(id);
            this.starting = true; try { $gameTemp.reserveCommonEvent(id); } finally { this.starting = false; }
            Diag.log('info', 'tutorial ' + id + ' (' + (($dataCommonEvents[id] || {}).name || '?') + ') shown here too');
        },
        reset() { this.queue = []; }
    };
    // ---- achievements (user, 2026-11-02: "make it to where you can get the same achievements in multiplayer as in the single
    //      player mode so players won't miss out"). WTE unlocks them through CycloneSteam.activateAchievement (its CE2760).
    //      A personal one (deaths, gold, hearts, marriage, gifts, crops, animals, illnesses, the priest's questions) is earned
    //      on the player's own game, as in single player. A WORLD milestone (the bosses, the shrine, the school, the colony,
    //      the art, the mall's hall and admin, the endings, the first day) happens on one game only, whoever was there: it
    //      reaches everyone in the world, and the world keeps it (its save) for a partner who wasn't on: theirs on the next
    //      join. Each player's own "unlocked" switch (named after the achievement, S1762-1800...) is set as WTE sets it. ----
    const Achievements = {
        WORLD: new Set(['WTE_START', 'WTE_HALL', 'WTE_ADMIN', 'WTE_MUSHROOM', 'WTE_TREE', 'WTE_COLONY', 'WTE_SOUL', 'WTE_DAEUS', 'WTE_DELVEK',
            'WTE_KAAL', 'WTE_SAVIOR', 'WTE_SCHOOL', 'WTE_SCHOOL_ALL', 'WTE_ART_1', 'WTE_ART_ALL', 'WTE_TOWER_COZY', 'WTE_TOWER_EASY',
            'WTE_TOWER_NORMAL', 'WTE_TOWER_HARD', 'WTE_TOWER_NIGHTMARE', 'WTE_TOWER_CUSTOM']),
        granting: false, queue: [],
        valid(id) { return typeof id === 'string' && this.WORLD.has(id); },
        /** The world's milestones so far (in the world's save). */
        list() { const s = window.$gameSystem; if (!s) return []; if (!Array.isArray(s._coopAch)) s._coopAch = []; return s._coopAch; },
        remember(id) { const l = this.list(); if (this.valid(id) && !l.includes(id)) l.push(id); },
        /** WTE unlocked one on my game: a world milestone goes to everyone. */
        unlocked(id) {
            if (this.granting || !Net.isPlaying() || !this.valid(id)) return;
            this.remember(id);
            if (Net.isHost) Net.broadcast({ t: 'ACH_ALL', id, by: Net.selfId }); else Net.send(Net.hostId, { t: 'ACH', id });
        },
        /** Someone else's milestone: mine too. */
        got(id) { if (this.valid(id) && !this.queue.includes(id)) this.queue.push(id); },
        /** Entering a world: every milestone it has that I haven't got. */
        catchUp() { this.list().forEach(id => this.got(id)); },
        /** Map frame: one at a time (Steam takes them one by one too). */
        update() {
            if (!this.queue.length || !window.$gameSwitches || !window.$dataSystem) return;
            const id = this.queue.shift(), sw = this.switchOf(id);
            if (sw && $gameSwitches.value(sw)) return;                          // mine already
            if (sw) $gameSwitches.setValue(sw, true);
            this.granting = true;
            try { if (window.CycloneSteam && typeof CycloneSteam.activateAchievement === 'function') CycloneSteam.activateAchievement(id); }
            catch (e) { Diag.err('achievement ' + id, e); } finally { this.granting = false; }
            Diag.log('info', 'achievement ' + id + ' (a world milestone) unlocked here too');
        },
        /** WTE's own "unlocked" switch for an achievement: the switch named after it. */
        switchOf(id) {
            if (!this._sw) { this._sw = {}; ($dataSystem.switches || []).forEach((n, i) => { const k = String(n || '').trim(); if (/^WTE_[A-Z0-9_]+$/.test(k)) this._sw[k] = i; }); }
            return this._sw[id] || 0;
        },
        reset() { this.queue = []; }
    };
    if (window.CycloneSteam && typeof CycloneSteam.activateAchievement === 'function') {
        const _ach = CycloneSteam.activateAchievement;
        CycloneSteam.activateAchievement = function (id) {
            let r; try { r = _ach.apply(this, arguments); } catch (e) { Diag.err('Steam achievement ' + id, e); }   // Steam never stops the game
            try { Achievements.unlocked(String(id || '').trim()); } catch (e) { /* only the sharing */ }
            return r;
        };
    }
    if (typeof Game_Interpreter !== 'undefined') {
        const _117tut = Game_Interpreter.prototype.command117;
        Game_Interpreter.prototype.command117 = function (params) { try { if (Tutorials.is(params[0])) Tutorials.shown(params[0]); } catch (e) { /* only the sharing */ } return _117tut.apply(this, arguments); };
    }
    if (typeof Game_Temp !== 'undefined') {
        const _reserveTut = Game_Temp.prototype.reserveCommonEvent;
        Game_Temp.prototype.reserveCommonEvent = function (id) { try { if (Tutorials.is(id)) Tutorials.shown(id); } catch (e) { /* only the sharing */ } return _reserveTut.apply(this, arguments); };
    }

    // ---- what another player's action shows (decision 92): animations, balloons, an object's own moves ----
    const Fx = {
        sending: false, applying: false, touched: new Map(), TOUCH_MS: 15000,
        /** This interpreter runs my own action (my map's interpreter, not an automatic page or a scene of the map). */
        mine(interp) {
            if (!Net.isPlaying() || this.applying || !window.$gameMap || interp !== $gameMap._interpreter && !this.childOfMap(interp)) return false;
            if (Night.isRunningCE(Night.CE.midnight) || Scenes.running || Scenes.holding) return false;
            const e = this.rootEvent();
            if (e > 0 && this.myMob(e)) return true;                         // my monster noticing / catching me (its own pages run by themselves)
            if (Spawns.inAuto()) return false;
            return e === 0 || (e > 0 && !!$gameMap.event(e) && [0, 1, 2].includes($gameMap.event(e)._trigger));
        },
        /** The page an object runs by itself just after I used it (a plot's own page puts the watered picture on
         *  after watering): its picture is my work too. (2026-11-03: watered plots stayed dry on the others' screens.) */
        touch(ev) { if (Net.isPlaying() && ev && [0, 1, 2].includes(ev._trigger)) this.touched.set(ev._mapId + ',' + ev._eventId, Date.now()); },
        mineAfter(interp) {
            if (!Net.isPlaying() || this.applying || !window.$gameMap || !(interp._eventId > 0) || interp._mapId !== $gameMap.mapId()) return false;
            return Date.now() - (this.touched.get(interp._mapId + ',' + interp._eventId) || 0) < this.TOUCH_MS;
        },
        /** A monster this game moves (decision 46): its '!' and its pounce are seen by everyone near. */
        myMob(e) { const ev = $gameMap.event(e); return !!ev && Mobs.active() && Mobs.isMob(ev) && Mobs.owns($gameMap.mapId(), e); },
        childOfMap(interp) { let it = $gameMap._interpreter; while (it) { if (it === interp) return true; it = it._childInterpreter; } return false; },
        rootEvent() { return $gameMap._interpreter.eventId(); },
        /** A character as the others can find it: 'p' (me) or an event id they have too. */
        ref(ch) {
            if (ch === $gamePlayer) return 'p';
            if (ch && ch instanceof Game_Event && !(RemoteChar && ch instanceof RemoteChar) && isInt(ch.eventId(), 1, 99999)) {
                const m = $gameMap.mapId(), e = ch.eventId();
                if (Spawns.saved(m)[e] || WorldObjects.isPlaced(ch) || (e < 1000 && Spawns.sharedEvent(m, e)) || this.myMob(e)) return e;   // shared objects only: never an event of one player's own story
            }
            return null;
        },
        send(o) {
            if (!Net.isPlaying()) return;
            const m = Object.assign({ t: Net.isHost ? 'FX_ALL' : 'FX', m: Locator.local() }, o);
            if (Net.isHost) Net.broadcast(Object.assign(m, { by: Net.selfId })); else Net.send(Net.hostId, m);
        },
        valid(m) {
            const tg = v => v === 'p' || isInt(v, 1, 99999);
            if (!isInt(m.m, 1, 99999) || !Array.isArray(m.tg) || m.tg.length < 1 || m.tg.length > 8 || !m.tg.every(tg)) return false;
            if (m.k === 'a') return isInt(m.id, 1, 9999);
            if (m.k === 'b') return isInt(m.id, 1, 15);
            if (m.k === 'g') return !!m.a && typeof m.a === 'object' && Object.keys(m.a).length <= 24 && Object.keys(m.a).every(k => k.length <= 40 && typeof m.a[k] === 'string' && m.a[k].length <= 40) && m.tg.every(x => x !== 'p');
            if (m.k === 'r') return !!m.r && Array.isArray(m.r.list) && m.r.list.length <= 200 && m.r.list.every(c => c && isInt(c.code, 0, 45) && (!c.parameters || (Array.isArray(c.parameters) && c.parameters.length <= 4)))
                && (m.ph === undefined || (Array.isArray(m.ph) && m.ph.length === 4 && isInt(m.ph[0], 0, 15) && [2, 4, 6, 8].includes(m.ph[1]) && isInt(m.ph[2], 0, 9999) && isInt(m.ph[3], 0, 99999)));
            if (m.k === 'e') return this.CHAR_CMDS.includes(m.c) && !!m.a && typeof m.a === 'object' && Object.keys(m.a).length <= 12 && Object.keys(m.a).every(k => k.length <= 40 && typeof m.a[k] === 'string' && m.a[k].length <= 40) && m.tg.every(x => x !== 'p');
            if (m.k === 'x') return m.tg.length === 1 && m.tg[0] !== 'p' && Array.isArray(m.v) && m.v.length === 4 && m.v.every(n => typeof n === 'number' && Math.abs(n) <= 600);
            if (m.k === 'f') return m.tg.length === 1 && m.tg[0] !== 'p' && Array.isArray(m.v) && m.v.length === 5 && m.v.every(n => typeof n === 'number' && Math.abs(n) <= 600);
            if (m.k === 'k') return m.tg.length === 1 && m.tg[0] !== 'p' && Array.isArray(m.l) && m.l.length <= 40 && m.l.every(i => i && typeof i.source === 'string' && /^[\w !$\/()-]{0,80}$/.test(i.source) && isInt(i.sIndex, 0, 7) && isInt(i.dIndex, 0, 7));
            if (m.k === 'n') return m.tg.length === 1 && m.tg[0] === 'p' && this.ANIM_SPAWNS.includes(m.tp) && isInt(m.x, 0, 999) && isInt(m.y, 0, 999);
            if (m.k === 's') return m.tg.length === 1 && !!m.se && typeof m.se.name === 'string' && /^[\w \/()-]{1,60}$/.test(m.se.name) && isInt(m.se.volume, 0, 100) && isInt(m.se.pitch, 50, 150);
            return false;
        },
        /** Someone else's action: show it on their character or on the object, if I am on that map. */
        apply(by, m) {
            // (the map loaded, not only named: between two maps the old map's id stays a moment after its data has gone)
            if (!this.valid(m) || m.m !== Locator.local() || !window.$gameMap || !Spawns.onMap(m.m)) return;
            const p = Net.peers.get(by), chars = m.tg.map(x => x === 'p' ? (p && p.char) : $gameMap.event(x)).filter(Boolean);
            if (!chars.length) return;
            chars.forEach(c => { if (c !== (p && p.char)) Spawns.wake(c); });   // a baked or sleeping object comes alive to show it
            this.applying = true;
            try {
                if (m.k === 'a') $gameTemp.requestAnimation(chars, m.id);
                else if (m.k === 'b') chars.forEach(c => $gameTemp.requestBalloon(c, m.id));
                else if (m.k === 'g') chars.forEach(c => { if (c instanceof Game_Event) PluginManager.callCommand($gameMap._interpreter, 'WTE_Geysers', 'emitEventGeyser', Object.assign({}, m.a, { eventId: String(c.eventId()) })); });   // WTE's particle bursts (water, dust, sparks)
                else if (m.k === 'e') chars.forEach(c => { if (c instanceof Game_Event) PluginManager.callCommand($gameMap._interpreter, 'EliMZ_CharManager', m.c, Object.assign({}, m.a, { id: String(c.eventId()) })); });   // an object's wobble, tilt, squash when hit
                else if (m.k === 'x') { if (typeof chars[0].wteStartShakeFX === 'function') chars[0].wteStartShakeFX(m.v[0], m.v[1], m.v[2], m.v[3]); }   // WTE 26409135's shake of an object hit
                else if (m.k === 'f') { if (typeof chars[0].wteStartSlowFallFX === 'function') chars[0].wteStartSlowFallFX(m.v[0], m.v[1], !!m.v[2], !!m.v[3], m.v[4]); }   // ...and a tree's fall
                else if (m.k === 's') this.hear(chars[0], m.se);
                else if (m.k === 'n') this.spawnAnim(m.tp, m.x, m.y);
                else if (m.k === 'k') { const L = this.kcLayers(), key = m.m + '/!' + m.tg[0]; if (L) { if (m.l.length) L[key] = m.l.map(i => ({ filename: i.source, sIndex: i.sIndex, dIndex: i.dIndex, _isBig: ImageManager.isBigCharacter(i.source) })); else delete L[key]; KCDev.CompositeBitmaps.invalidateCachedComposites(key, KCDev.CompositeBitmaps.TOP_VIEW_PREFIX); KCDev.CompositeBitmaps.refreshMapCompositeChars(); } }   // the object's picture as the worker's game drew it
                else if (m.k === 'r') chars.forEach(c => { if (c !== (p && p.char) && !c.isMoveRouteForcing() && m.ph) { c._pattern = m.ph[0]; c._direction = m.ph[1]; c._animationCount = m.ph[2]; c._stopCount = m.ph[3]; }
                    if (c !== (p && p.char) && !c.isMoveRouteForcing()) c.forceMoveRoute({ list: m.r.list.map(x => ({ code: x.code, parameters: x.parameters || [] })).concat(m.r.list.length && m.r.list[m.r.list.length - 1].code === 0 ? [] : [{ code: 0, parameters: [] }]), repeat: false, skippable: true, wait: false }); });
            } catch (e) { Diag.err('another player\'s action', e); }
            finally { this.applying = false; }
        }
    };
    Object.assign(Fx, {
        /** EliMZ_CharManager's looks of a character that WTE uses on objects when they are hit (the tree shakes). */
        CHAR_CMDS: ['cmd_offset', 'cmd_angle', 'cmd_rotation', 'cmd_scale', 'cmd_skew'],
        // WTE's little effects spawned for a moment (CE2245 Spawn Event XY (Nosave)): the hoe's dirt, a splash, the harvest
        // pop. Only these three: each only moves and erases itself (the bobbers are drawn by co-op itself; user, 2026-11-01)
        ANIM_SPAWNS: [187, 188, 189],
        spawnAnim(t, x, y) {
            if (typeof Galv !== 'undefined' && Galv.SPAWN && typeof Galv.SPAWN.event === 'function' && (!window.$gameSwitches || $gameSwitches.value(1191) || typeof Ritter === 'undefined')) Galv.SPAWN.event(t, x, y, false);
            else if (typeof Ritter !== 'undefined' && typeof Ritter.spawnEvent === 'function') Ritter.spawnEvent(36, t, x, y, false, true);
        },
        sendAnim(t, x, y) {
            if (this.applying || !this.ANIM_SPAWNS.includes(Number(t)) || !this.scripting || !this.mine(this.scripting)) return;
            this.send({ k: 'n', tg: ['p'], tp: Number(t), x: x | 0, y: y | 0 });   // tp: the template (t is the message's own type)
        },
        /** Menu and message sounds are the player's own; the sounds of the work itself are heard by those nearby. */
        UI_SE: /^(Cursor|Decision|Cancel|Buzzer|Chime|Save|Load|Equip|Item|Book|Menu|Popup|Toast|Shop|Coin)/i,
        HEAR_TILES: 12,
        /** KC_CompositeBitmaps' layer lists of the objects on my map ("<map>/!<event>"), as text to compare. */
        kcLayers() { return (window.KCDev && KCDev.CompositeBitmaps && KCDev.CompositeBitmaps.tvCharLayers) || null; },
        plotLayers() {
            const L = this.kcLayers(), out = {}, pre = $gameMap.mapId() + '/!'; if (!L) return out;
            Object.keys(L).forEach(k => { if (k.startsWith(pre)) out[k] = JSON.stringify(L[k]); });
            return out;
        },
        /** My work changed an object's picture layers: the others get the finished list (WTE built it from my own
         *  scratch variables, which differ in their games), for a shared object only. */
        sendLayers(key) {
            const e = Number(key.split('/!')[1]), r = this.ref($gameMap.event(e)); if (r === null || r === 'p') return;
            const L = this.kcLayers(), list = (L && L[key]) || [];
            if (list.length > 40) return;
            this.send({ k: 'k', tg: [r], l: list.map(i => ({ source: String(i.filename || '').slice(0, 80), sIndex: Number(i.sIndex) | 0, dIndex: Number(i.dIndex) | 0 })) });
        },
        /** Another player's sound, from them or the object they work on: softer with distance, from that side. */
        hear(src, se) {
            if (!src || !window.$gamePlayer) return;
            const dx = src.x - $gamePlayer.x, d = Math.abs(dx) + Math.abs(src.y - $gamePlayer.y);
            if (d > this.HEAR_TILES) return;
            AudioManager.playSe({ name: se.name, volume: Math.round(se.volume * Math.max(0.2, 1 - d / this.HEAR_TILES)), pitch: se.pitch, pan: Math.max(-100, Math.min(100, dx * 10)) });
        }
    });
    if (typeof Game_Interpreter !== 'undefined') {
        const _212 = Game_Interpreter.prototype.command212, _213 = Game_Interpreter.prototype.command213, _205 = Game_Interpreter.prototype.command205;
        const _iuUse = Game_Interpreter.prototype.update;
        Game_Interpreter.prototype.update = function () { if (Uses.waiting(this)) return; return _iuUse.apply(this, arguments); };   // my use of a shared object waits for the host's answer (decision 92)
        Game_Interpreter.prototype.command212 = function (params) {
            try { if (Fx.mine(this)) { const tg = []; const ch = this.character(params[0]); const r = Fx.ref(ch); if (r !== null) tg.push(r); if (tg.length && isInt(params[1], 1, 9999)) Fx.send({ k: 'a', tg, id: params[1] }); } } catch (e) { /* only a picture */ }
            return _212.apply(this, arguments);
        };
        Game_Interpreter.prototype.command213 = function (params) {
            try { if (Fx.mine(this)) { const r = Fx.ref(this.character(params[0])); if (r !== null && isInt(params[1], 1, 15)) Fx.send({ k: 'b', tg: [r], id: params[1] }); } } catch (e) { /* only a balloon */ }
            return _213.apply(this, arguments);
        };
        const _357fx = Game_Interpreter.prototype.command357;
        Game_Interpreter.prototype.command357 = function (params) {
            try {
                if (params[0] === 'WTE_Geysers' && params[1] === 'emitEventGeyser' && Fx.mine(this)) {   // the water splash, dust, sparks of my action on an object
                    const a = Object.assign({}, params[3] || {}), id = Number(a.eventId) || 0;
                    const ch = id === 0 ? $gameMap.event($gameMap._interpreter.eventId()) : id > 0 ? $gameMap.event(id) : null, r = Fx.ref(ch);
                    if (r !== null && r !== 'p') { Object.keys(a).forEach(k => { a[k] = String(a[k]).slice(0, 40); }); Fx.send({ k: 'g', tg: [r], a }); }
                }
                if (params[0] === 'EliMZ_CharManager' && Fx.CHAR_CMDS.includes(params[1]) && Fx.mine(this)) {   // the object I hit wobbles for everyone
                    const a = Object.assign({}, params[3] || {}), n = Number(String(a.id).trim());
                    const ch = n === 0 ? $gameMap.event(this.eventId()) : n > 0 ? $gameMap.event(n) : null, r = Fx.ref(ch);
                    if (r !== null && r !== 'p' && Object.keys(a).length <= 12) { Object.keys(a).forEach(k => { a[k] = String(a[k]).slice(0, 40); }); Fx.send({ k: 'e', tg: [r], c: params[1], a }); }
                }
            } catch (e) { /* only particles */ }
            const layers = (params[0] === 'KC_CompositeBitmaps' && /TvLayers$/.test(params[1])) || (params[0] === 'WTE_EventActionAccelerator' && params[1] === 'applyCropImage');   // WTE 26409135 draws the crop with its own command
            const own = layers && (Fx.mine(this) ? 'all' : Fx.mineAfter(this) ? $gameMap.mapId() + '/!' + this._eventId : '');
            if (own) {   // a plot's picture (tilled, watered, the crop); from its own page after my work: that plot only
                const before = Fx.plotLayers(), r = _357fx.apply(this, arguments);
                try { const after = Fx.plotLayers(); Object.keys(Object.assign({}, before, after)).forEach(key => { if (before[key] !== after[key] && (own === 'all' || key === own)) Fx.sendLayers(key); }); } catch (e) { /* only a picture */ }
                return r;
            }
            return _357fx.apply(this, arguments);
        };
        /** My axe, hoe, splash: heard by players nearby. From the source object if it is a shared one, else from me. */
        if (typeof Galv !== 'undefined' && Galv.SPAWN && typeof Galv.SPAWN.event === 'function') {
            const _gsp = Galv.SPAWN.event;
            Galv.SPAWN.event = function (id, x, y, save) { try { if (!save) Fx.sendAnim(id, x, y); } catch (e) { /* only an effect */ } return _gsp.apply(this, arguments); };
        }
        if (typeof Ritter !== 'undefined' && typeof Ritter.spawnEvent === 'function') {
            const _rsp = Ritter.spawnEvent;
            Ritter.spawnEvent = function (mapId, id, x, y, save) { try { if (!save && Number(mapId) === 36) Fx.sendAnim(id, x, y); } catch (e) { /* only an effect */ } return _rsp.apply(this, arguments); };
        }
        // WTE 26409135 (WTE_EventActionAccelerator): an object hit shakes, a tree falls by its own commands, not EliMZ's.
        // The object my action shakes or fells does so on the others' screens too (user rule: farming looks the same).
        if (typeof Game_CharacterBase !== 'undefined' && typeof Game_CharacterBase.prototype.wteStartShakeFX === 'function') {
            const _shk = Game_Interpreter.prototype.wteShakeEvent, _fall = Game_Interpreter.prototype.wteSlowFallEvent;
            const by = (fn) => function () { const was = Fx.fxBy; Fx.fxBy = this; try { return fn.apply(this, arguments); } finally { Fx.fxBy = was; } };
            if (_shk) Game_Interpreter.prototype.wteShakeEvent = by(_shk);
            if (_fall) Game_Interpreter.prototype.wteSlowFallEvent = by(_fall);
            const num = v => { const n = Number(v); return isFinite(n) ? Math.max(-600, Math.min(600, n)) : 0; };
            const relay = (k, ch, v) => { try { if (Fx.fxBy && Fx.mine(Fx.fxBy)) { const r = Fx.ref(ch); if (r !== null && r !== 'p') Fx.send({ k, tg: [r], v: v.map(num) }); } } catch (e) { /* only a shake */ } };
            const _sfx = Game_CharacterBase.prototype.wteStartShakeFX, _ffx = Game_CharacterBase.prototype.wteStartSlowFallFX;
            Game_CharacterBase.prototype.wteStartShakeFX = function (px, py, cycles, dur) {
                relay('x', this, [px === undefined ? 4 : px, py || 0, cycles === undefined ? 3 : cycles, dur === undefined ? 15 : dur]);
                return _sfx.apply(this, arguments);
            };
            if (_ffx) Game_CharacterBase.prototype.wteStartSlowFallFX = function (deg, dur, fade, reset, grav) {
                relay('f', this, [deg === undefined ? 90 : deg, dur === undefined ? 45 : dur, fade ? 1 : 0, reset === false ? 0 : 1, grav === undefined ? 0 : grav]);
                return _ffx.apply(this, arguments);
            };
        }
        Fx.sendSound = function (interp, se) {
            if (!se || !se.name || this.UI_SE.test(se.name) || !this.mine(interp)) return;
            const ev = interp.eventId() > 0 ? $gameMap.event(interp.eventId()) : null, r = this.ref(ev);
            this.send({ k: 's', tg: [r !== null ? r : 'p'], se: { name: String(se.name).slice(0, 60), volume: Math.max(0, Math.min(100, se.volume === undefined ? 90 : se.volume | 0)), pitch: Math.max(50, Math.min(150, se.pitch === undefined ? 100 : se.pitch | 0)) } });
        };
        const _250fx = Game_Interpreter.prototype.command250;
        Game_Interpreter.prototype.command250 = function (params) {
            try { Fx.sendSound(this, params[0]); } catch (e) { /* only a sound */ }
            return _250fx.apply(this, arguments);
        };
        // WTE plays many work sounds from a script line (CE841-851 "Do hit sound": wood, stone, clay; harvesting): a sound
        // played while one of my action's scripts runs is heard nearby too
        const _355fx = Game_Interpreter.prototype.command355;
        Game_Interpreter.prototype.command355 = function () {
            const was = Fx.scripting; Fx.scripting = this;
            try { return _355fx.apply(this, arguments); } finally { Fx.scripting = was; }
        };
        if (typeof AudioManager !== 'undefined') {
            const _playSeFx = AudioManager.playSe;
            AudioManager.playSe = function (se) {
                try { if (Fx.scripting && !Fx.applying) Fx.sendSound(Fx.scripting, se); } catch (e) { /* only a sound */ }
                return _playSeFx.apply(this, arguments);
            };
        }
        Game_Interpreter.prototype.command205 = function (params) {
            try {
                if (Fx.mine(this)) {
                    const ch = this.character(params[0]), r = Fx.ref(ch), route = params[1];
                    if (r !== null && r !== 'p' && !Fx.myMob(r) && route && Array.isArray(route.list) && route.list.length <= 200)   // an object's own moves (mine travel as my position and frame)
                        Fx.send({ k: 'r', tg: [r], r: { list: route.list.map(c => ({ code: c.code, parameters: Array.isArray(c.parameters) ? c.parameters.slice(0, 4) : [] })) },
                            ph: [ch._pattern, ch._direction, Math.round(ch._animationCount) || 0, Math.round(ch._stopCount) || 0] });   // where its own animation stood: the same frames come in the same order on every screen
                }
            } catch (e) { /* only a move */ }
            return _205.apply(this, arguments);
        };
    }

    // ---- one midnight for everyone (decision 92): see the header of moon-edit ----
    const MoonSync = {
        LIMIT_MS: 120000,
        released: '',                 // the midnight (date) the host let go
        hostKey: '', hostSince: 0,    // host: the midnight it is gathering everyone for
        ready: new Map(),             // host: player -> { k, qd, fr, mn } (never q: the envelope's sequence number)
        sent: '', lastFrame: 0,
        today() { const t = window.$gameTime; return t ? t.year + '-' + t.month + '-' + t.day : ''; },
        /** My midnight is queued in WTE's queue: its date, or ''. */
        queuedKey() { const s = window.$gameSystem; return s && s._wteMidnightState === 1 ? String(s._wteMidnightFiredDate || '') : ''; },
        inMenu() { const sc = SceneManager._scene; return !!sc && !(sc instanceof Scene_Map) && !(typeof Scene_Battle !== 'undefined' && sc instanceof Scene_Battle) && !(sc instanceof Scene_Title) && !(typeof Scene_Gameover !== 'undefined' && sc instanceof Scene_Gameover); },
        /** Nothing of mine that the moon has to wait for: no scene, conversation, battle or cast in progress. */
        free() {
            if (!window.$gameParty || !window.$gameMap) return false;
            if ($gameParty.inBattle() || (typeof Scene_Battle !== 'undefined' && SceneManager._scene instanceof Scene_Battle)) return false;
            if (Night.fishing()) return false;
            return this.inMenu() || !Night.busy();
        },
        holding() { return Net.isPlaying() && !!this.queuedKey() && this.released !== this.queuedKey(); },
        mine() { const k = this.queuedKey(); return { k: k || this.today(), qd: k ? 1 : 0, fr: this.free() ? 1 : 0, mn: this.inMenu() ? 1 : 0 }; },
        /** Every frame, every scene: tell the host where my midnight is. */
        frame(now) {
            if (!Net.isPlaying() || now - this.lastFrame < 250) return;
            this.lastFrame = now;
            this.menuGuard();
            const me = this.mine(), key = JSON.stringify(me);
            if (Net.isHost) { this.ready.set(Net.selfId, me); this.hostTick(); return; }   // every scene: a host in a menu still lets midnight go
            if (key !== this.sent) { this.sent = key; Net.send(Net.hostId, Object.assign({ t: 'MOONRDY' }, me)); }
        },
        /** A menu I opened myself closes when something wants to play for me (in one player's game the map is frozen
         *  while a menu is open; together, a scene, a pull to a shared moment or a move can come meanwhile). A menu an
         *  event opened (a shop, the character creator) stays, and so does everything in the opening and tutorial. */
        menuGuard() {
            if (!this.inMenu() || SceneManager.isSceneChanging() || !window.$gameMap || !window.$gameTemp || $gameMap.isEventRunning() || Night.inPrologue()) return;
            const why = $gamePlayer.isTransferring() ? 'a move' : $gameTemp.isCommonEventReserved() ? 'a scene' : ($gameMap.isAnyEventStarting && $gameMap.isAnyEventStarting()) ? 'an event' : '';
            if (!why) return;
            Diag.log('info', 'menu closed: ' + why + ' is waiting to play');
            SceneManager.goto(Scene_Map);
        },
        /** Host: everyone's midnight queued (or in a menu) and nobody busy, or the time limit: go. */
        hostTick() {
            let mine = this.queuedKey();                                     // my midnight, or the first one anybody queued (I may be in a menu)
            if (!mine) this.ready.forEach(r => { if (!mine && r.qd === 1 && r.k && r.k !== this.released) mine = r.k; });
            if (!mine || this.released === mine) return;
            if (this.hostKey !== mine) { this.hostKey = mine; this.hostSince = Date.now(); Diag.log('info', 'midnight ' + mine + ': waiting for everyone to be free'); }
            const waiting = Night.members().filter(id => { const r = this.ready.get(id); return !(r && r.fr === 1 && (r.mn === 1 || (r.qd === 1 && r.k === mine))); });
            const late = Date.now() - this.hostSince > this.LIMIT_MS;
            if (waiting.length && !late) return;
            if (late && waiting.length) Diag.log('warn', 'midnight ' + mine + ': went ahead after 2 minutes without ' + waiting.map(id => Night.nameOf(id)).join(', '));
            Net.broadcast({ t: 'MOONGO', k: mine });
            this.go(mine);
        },
        /** Midnight goes: back to the map from a menu, and WTE's queue runs it now. */
        go(k) {
            this.released = k;
            if (this.inMenu() && !SceneManager.isSceneChanging()) SceneManager.goto(Scene_Map);
            Diag.log('info', 'midnight ' + k + ': everyone together');
        },
        clean(m) { return m && typeof m.k === 'string' && m.k.length <= 24 && [0, 1].includes(m.qd) && [0, 1].includes(m.fr) && [0, 1].includes(m.mn) ? { k: m.k, qd: m.qd, fr: m.fr, mn: m.mn } : null; },
        reset() { this.released = ''; this.hostKey = ''; this.hostSince = 0; this.ready.clear(); this.sent = ''; this.lastFrame = 0; }
    };
    if (typeof Game_System !== 'undefined' && typeof Game_System.prototype.wteUpdateMidnightEvent === 'function') {
        const _midQueue = Game_System.prototype.wteUpdateMidnightEvent;
        Game_System.prototype.wteUpdateMidnightEvent = function () {
            if (this === window.$gameSystem && MoonSync.holding()) return;      // until everyone's midnight goes together
            return _midQueue.apply(this, arguments);
        };
    }
    if (typeof Scene_Base !== 'undefined') {
        const _sbMoon = Scene_Base.prototype.update;
        Scene_Base.prototype.update = function () { _sbMoon.apply(this, arguments); try { MoonSync.frame(Date.now()); } catch (e) { /* next frame */ } };
    }

    // ---- a death regenerates the world only when everyone falls together (decision 92) ----
    const Death = {
        WIPE_MS: 180000, wipeAt: 0,
        wipe() { return Date.now() - this.wipeAt < this.WIPE_MS; },
        /** A death's world changes stay out of the world (always for a joiner; for the host unless everyone fell). */
        quiet() { return Mobs.inDeath() && !(Net.isHost && this.wipe()); },
        reset() { this.wipeAt = 0; }
    };
    if (typeof Game_Interpreter !== 'undefined') {
        const _117death = Game_Interpreter.prototype.command117;
        Game_Interpreter.prototype.command117 = function (params) {
            if (Net.isPlaying() && Number(params[0]) === Ritual.REST_CE && Mobs.inDeath() && !Death.wipe()) {
                Diag.log('info', 'a death: the world is not regenerated (only when everyone falls together, or at sleep)');
                return true;
            }
            return _117death.apply(this, arguments);
        };
    }
    if (typeof BattleManager !== 'undefined' && BattleManager.processDefeat) {
        const _defeat = BattleManager.processDefeat;
        BattleManager.processDefeat = function () {
            try {
                const all = Night.members();
                if (Net.isPlaying() && Duel.on && all.length >= 2 && all.every(id => Duel.order.includes(id))) { Death.wipeAt = Date.now(); Diag.log('info', 'everyone fell in the same battle: the world regenerates (once, by the host)'); }
            } catch (e) { /* the defeat goes on */ }
            return _defeat.apply(this, arguments);
        };
    }

    const Night = {
        KINDS: ['midnight', 'wake'],
        CE: { midnight: 507, wake: 962 },
        PAUSE_CES: [507, 961, 962, 23],          // midnight, bed night + morning, REST RESET (everyone fell together; never one player's bath); not the midnight's "wait while fishing/placing" (decision 54)
        FISHING_SW: 283,
        BED_CE: 965, PENALTY_CE: 458, SLEEPLESS_VAR: 1248, SLEEP_SW: 211,
        BARRIER_LIMIT_MS: 4 * 60000, MISSED_CE: 459,
        localPaused: false,       // host: what its own allowed night events asked for
        prologuePause: false,     // host: that pause came from WTE's prologue (lifted when the host leaves it)
        holds: new Set(),         // host: why the shared clock is held ('midnight', 'wake', '2359')
        barriers: {},             // host: kind -> { key, done: Set, since }
        early: [],                // host: done reports that arrived before the host's own part began
        running: {},              // kind -> is that part running in this game right now
        waiting: {},              // kind -> this player finished and waits for the others
        view: null,               // the notice under the clock: { kind, names }
        missedInBed: false,      // midnight came while I lay in bed waiting for the others: WTE's "Missed Sleep" waits for that sleep
        lastTick: 0, viewKey: '',
        releasedKey: {},          // host: kind -> the day whose barrier is over (a late player is let go at once)
        active() { return Net.isPlaying() && (Net.isHost || Net.inWorld); },
        reset() {
            if (window.$gameTime && $gameTime.isPaused() && (this.holds.size || this.localPaused)) $gameTime.resume();
            if (window.$gameTime && $gameTime.isPaused() && VoidClock.hold) $gameTime.resume();
            VoidClock.hold = false;
            this.localPaused = false; this.prologuePause = false; this.holds.clear(); this.barriers = {}; this.early = []; this.running = {}; this.waiting = {}; this.releasedKey = {};
            this.view = null; this.viewKey = ''; this.missedInBed = false;
        },
        key() { const t = window.$gameTime; return t ? t.year + '-' + t.month + '-' + t.day : ''; },
        members() { const out = [Net.selfId]; Net.peers.forEach((p, id) => { if (!p.loading) out.push(id); }); return out; },
        nameOf(id) { return id === Net.selfId ? (Net.isHost ? hostName(Net) : Net.name) : ((Net.peers.get(id) || {}).name || 'a player'); },
        isRunningCE(id) {
            const ce = window.$dataCommonEvents && $dataCommonEvents[id];
            let it = window.$gameMap && $gameMap._interpreter;
            while (ce && it) { if (it._list === ce.list) return true; it = it._childInterpreter; }
            return false;
        },
        /** Is this interpreter running one of the events that may pause the shared clock? */
        allowedPause(interp) {
            const lists = this.PAUSE_CES.map(id => window.$dataCommonEvents && $dataCommonEvents[id] && $dataCommonEvents[id].list);
            return (lists.includes(interp._list) && !Ritual.inBath(interp)) || this.inPrologue();   // + WTE's prologue (opening, forest): time stands still there, as in one player's game
        },
        /** The host is in WTE's prologue: GAME START, the character scene with the movie, the tutorial forest. */
        inPrologue() { return !!window.$gameMap && [11, Scenes.OPENING.map].concat(Scenes.TUTORIAL_MAPS).includes($gameMap.mapId()); },
        /** In a scene or message: not when asleep, and not while waiting in bed/at the tub for the others. */
        busy() { return !!window.$gameMap && ($gameMap.isEventRunning() || $gameMessage.isBusy()) && !(window.$gameSwitches && $gameSwitches.value(this.SLEEP_SW)) && !(Net.rl && Net.rl.phase === 'ready') && !Scenes.holding && !this.fishing(); },
        /** Casting, waiting for a bite or in the fishing minigame: each player's own, nobody waits for it (decision 54).
         *  WTE delays that player's own midnight until the line is in (CE518); everyone else's goes on. */
        fishing() { return !!window.$gameSwitches && $gameSwitches.value(this.FISHING_SW); },
        /** My bobber in the water: [x, y, facing] of WTE's bobber event, or 0. */
        bobber() {
            if (!this.fishing() || !window.$gameMap) return 0;
            const ev = ($gameMap._events || []).find(e => e && !e._erased && e.isSpawnEvent && /^Bobber/.test(((e.event && e.event()) || {}).name || ''));
            return ev ? [ev.x, ev.y, ev.direction()] : 0;
        },
        isFishing(id) { return id === Net.selfId ? this.fishing() : ((Net.peers.get(id) || {}).state || {}).fi === 1; },
        /** Every frame on the map. */
        update() {
            if (!this.active() || !window.$gameMap) return;
            if (this.prologuePause && Net.isHost && !this.inPrologue()) { this.prologuePause = false; this.localPaused = false; this.enforce(); }   // out of the prologue: the shared clock runs again
            if (Net.isHost && this.inPrologue()) this.enforce();               // a waiting prologue scene holds the clock
            this.KINDS.forEach(kind => {                                   // my midnight / morning started or ended
                const on = this.isRunningCE(this.CE[kind]);
                if (on && !this.running[kind]) this.onStart(kind);
                if (!on && this.running[kind]) this.onEnd(kind);
                this.running[kind] = on;
            });
            if (Net.isHost) {
                const t = window.$gameTime;                               // 23:59 hold (decision 18)
                if (t && t.hour === 23 && t.min === 59 && this.members().some(id => id === Net.selfId ? this.busy() : ((Net.peers.get(id) || {}).state || {}).bz === 1)) this.holds.add('2359');
                else this.holds.delete('2359');
                const now = Date.now();
                Object.keys(this.barriers).forEach(kind => {
                    if (now - this.barriers[kind].since > this.BARRIER_LIMIT_MS) { Diag.log('warn', 'night: stopped waiting for everyone (' + kind + ')'); this.release(kind); }
                });
                VoidClock.update();
                this.enforce();
                this.publish();
            }
        },
        /** Host: the shared clock is paused exactly when an allowed event or a hold wants it. */
        enforce() {
            const t = window.$gameTime;
            if (!t) return;
            const want = (this.localPaused && this.inPrologue()) || VoidClock.hold || (Net.isHost && this.inPrologue() && Scenes.isWaiting()) || (Net.isHost && !!this.running.midnight);   // + the moon event plays (decision 93)   // never paused otherwise (decision 92)   // + a prologue scene waiting for the others: WTE's own pause comes right after
            if (want !== t.isPaused()) { if (want) t.pause(-1); else t.resume(); Net.lastClockSent = 0; }   // tell joiners at once
        },
        onStart(kind) {
            this.waiting[kind] = false;
            if (!Net.isHost) return;
            const b = this.barriers[kind] = { key: this.key(), done: new Set(), since: Date.now(), members: this.members().filter(id => !this.isFishing(id)) };   // only who is here now (not who is fishing: their midnight comes when the line is in)
            this.holds.add(kind);
            this.enforce();
            this.early = this.early.filter(e => { if (e.kind === kind && e.key === b.key) { b.done.add(e.from); return false; } return Date.now() - e.at < this.BARRIER_LIMIT_MS; });
        },
        onEnd(kind) {
            const key = this.key();
            this.waiting[kind] = true;                                     // until everyone is through (released)
            if (Net.isHost) this.doneFrom(Net.selfId, kind, key);
            else Net.send(Net.hostId, { t: 'NDONE', kind, key });
        },
        doneFrom(from, kind, key) {
            const b = this.barriers[kind];
            if (!b && this.releasedKey[kind] === key) { if (from === Net.selfId) this.waiting[kind] = false; else Net.send(from, { t: 'NREL', kind }); return; }   // late (fished through it): the others already went on
            if (!b || b.key !== key) { this.early.push({ from, kind, key, at: Date.now() }); return; }
            b.done.add(from);
            this.check(kind);
        },
        check(kind) {
            const b = this.barriers[kind];
            const here = new Set(this.members());
            if (b && b.members.filter(id => here.has(id)).every(id => b.done.has(id))) this.release(kind);
        },
        release(kind) {
            if (this.barriers[kind]) this.releasedKey[kind] = this.barriers[kind].key;
            delete this.barriers[kind];
            this.holds.delete(kind);
            this.waiting[kind] = false;
            Net.broadcast({ t: 'NREL', kind });
            this.enforce();
            this.publish();
        },
        released(kind) { this.waiting[kind] = false; },
        memberGone() { Object.keys(this.barriers).forEach(kind => this.check(kind)); },
        /** Host: who is everyone waiting for (shown under every player's clock). */
        publish() {
            let v = null;
            const order = ['midnight', 'wake'];
            for (const kind of order) {
                const b = this.barriers[kind];
                if (b && b.done.size) { const here = new Set(this.members()); v = { kind, names: b.members.filter(id => here.has(id) && !b.done.has(id)).map(id => this.nameOf(id)).slice(0, 4) }; break; }
            }
            if (!v && this.holds.has('2359')) v = { kind: '2359', names: this.members().filter(id => id === Net.selfId ? this.busy() : ((Net.peers.get(id) || {}).state || {}).bz === 1).map(id => this.nameOf(id)).slice(0, 4) };
            const key = JSON.stringify(v);
            if (key === this.viewKey) return;
            this.viewKey = key; this.view = v;
            Net.broadcast({ t: 'NVIEW', v });
        },
        setView(v) {
            if (v !== null && !(v && ['midnight', 'wake', '2359'].includes(v.kind) && Array.isArray(v.names))) return;
            this.view = v ? { kind: v.kind, names: v.names.slice(0, 4).map(n => cleanStr(n, 24)) } : null;
        },
        /** This player finished their part and waits for the others: keep them still, like Stardew's waiting screen. */
        frozen() { return this.active() && ((this.waiting.midnight && this.view && this.view.kind === 'midnight') || (this.waiting.wake && this.view && this.view.kind === 'wake')); },
        // ---- staying up (decision 38): WTE's own midnight, even for a player lying in bed waiting for the others ----
        waitingInBed() { return !!(Net.rl && Net.rl.kind === 'sleep' && Net.rl.phase === 'ready'); },
        /** Called every frame while the bed waits: a midnight WTE's queue holds (it waits for a free map) runs inside the wait,
         *  so it is never skipped. Not while WTE's own "Midnight Moon Delay" (S2972) is on. */
        MOON_DELAY_SW: 2972, MOON_WAIT_SW: 2980,
        midnightInBed(interp) {
            if (!this.active() || !window.$gameSystem || $gameSystem._wteMidnightState !== 1 || interp._childInterpreter || this.isRunningCE(this.CE.midnight)) return;
            if (MoonSync.holding()) return;                                   // everyone's midnight starts together (decision 92)
            if (window.$gameSwitches && $gameSwitches.value(this.MOON_DELAY_SW)) return;
            const ce = window.$dataCommonEvents && $dataCommonEvents[this.CE.midnight];
            if (!ce) return;
            $gameSystem._wteMidnightState = 0; $gameSystem._wteHardPaused = false; $gameSwitches.setValue(this.MOON_WAIT_SW, false);   // taken over from the queue
            interp.setupChild(ce.list, 0);
        },
        /** WTE's "Missed Sleep" (CE459) for a player lying in bed waits: sleeping clears it, getting up applies it. */
        skipMissedSleep() { if (!this.active() || !this.waitingInBed()) return false; this.missedInBed = true; return true; },
        gotUp() { if (this.missedInBed && window.$gameTemp) { this.missedInBed = false; $gameTemp.reserveCommonEvent(this.MISSED_CE); } },
        slept() { this.missedInBed = false; },
        // ---- the notice under the clock ----
        hudText(now) {
            const ow = Opening.text(); if (ow) return { text: ow };
            const fw = Festival.text(); if (fw) return { text: fw };
            const stw = Story.text(); if (stw) return { text: stw };
            if (!this.active()) { const sw = Scenes.hostAlone() ? Scenes.waitText() : null; return sw ? { text: sw } : null; }   // a host waiting for the first players
            const sw = Scenes.waitText(); if (sw) return { text: sw };
            const v = this.view;
            if (v && v.names.length) {
                const me = Net.isHost ? hostName(Net) : Net.name, others = v.names.filter(n => n !== me);
                const who = others.length ? others.join(', ') : 'you';
                if (v.kind === 'midnight') return { text: 'Midnight · waiting for ' + who };
                if (v.kind === 'wake') return { text: 'Morning · waiting for ' + who };
                return { text: 'Midnight is waiting for ' + who + ' (in a scene)' };
            }
            const rs = Net.rs;
            if (rs && rs.kind === 'sleep' && rs.phase === 'gather') {
                if (!rs.ready.includes(Net.selfId)) return { text: rs.ready.map(id => this.nameOf(id)).join(', ') + (rs.ready.length > 1 ? ' are' : ' is') + ' in bed' };
                return { text: 'In bed · waiting for ' + rs.need.map(id => this.nameOf(id)).join(', ') + '  (Cancel: get up)' };
            }
            return ritualShown ? { text: ritualShown } : null;
        }
    };

    /** Perks at midnight (decision 90): every player sends its perk values; the host sends back the best of each, and
     *  inside the midnight (CE507 and what it calls, seeded the same in every game) a perk reads as that best value. */
    const Perks = {
        IDS: new Set([].concat(Array.from({ length: 43 }, (_, i) => 1822 + i), [1866], Array.from({ length: 9 }, (_, i) => 1868 + i), [1878, 1880, 1881, 1882])),
        bestOf: {}, sentKey: '', lastTick: 0, reading: false, namesOf: {},
        /** My active perk names (WTE_Professions), and another player's as they told the host. Also "Skill/Perk" for each
         *  tier I chose: WTE 26409135 asks isProfessionPerkActive("Combat", "Patient") so a cooking perk of the same name
         *  doesn't count. */
        names() {
            const s = window.$gameSystem; if (!s) return [];
            const out = Array.isArray(s._wteActivePerkNames) ? s._wteActivePerkNames.filter(x => typeof x === 'string').slice(0, 64) : [];
            const pro = s._wteProfessions && typeof s._wteProfessions === 'object' ? s._wteProfessions : {};
            Object.keys(pro).forEach(skill => { const t = pro[skill]; if (t && typeof t === 'object') Object.keys(t).forEach(k => { const v = t[k], n = typeof v === 'string' ? v : (v && v.name); if (typeof n === 'string' && out.length < 128) out.push((skill + '/' + n).slice(0, 64)); }); });
            return out;
        },
        namesFor(id) { return id === Net.selfId ? this.names() : (Array.isArray(this.namesOf[id]) ? this.namesOf[id] : null); },
        modsOf: {},
        /** My perk stat bonuses (WTE_GameModifiers), and another player's as the host passed them on. */
        mods() { const s = window.$gameSystem; return s ? { s: s._wteStatModifiers || {}, c: s._wteScalingStatMods || {}, u: Upgrades.mine() } : null; },
        modsFor(id) { return id === Net.selfId ? this.mods() : (this.modsOf[id] || null); },
        cleanMods(v) {
            if (!v || typeof v !== 'object' || !v.s || typeof v.s !== 'object' || !v.c || typeof v.c !== 'object') return null;
            let n = 0; try { n = JSON.stringify(v).length; } catch (e) { return null; }
            if (n > 60000 || !Object.keys(v.s).every(k => k.length <= 32 && isNum(v.s[k], -1e6, 1e6)) || !Object.keys(v.c).every(k => k.length <= 32 && Array.isArray(v.c[k]) && v.c[k].length <= 32)) return null;
            return { s: Object.assign({}, v.s), c: JSON.parse(JSON.stringify(v.c)), u: Upgrades.clean(v.u) || { w: {}, a: {} } };
        },
        cleanNames(v) { return Array.isArray(v) && v.length <= 128 &&v.every(x => typeof x === 'string' && x.length <= 64) ? v.slice() : null; },
        mine() {
            const out = {}; if (!window.$gameVariables) return out;
            this.reading = true;
            try { this.IDS.forEach(id => { const v = Number($gameVariables.value(id)) || 0; if (v) out[id] = v; }); } finally { this.reading = false; }
            return out;
        },
        clean(o) {
            if (!o || typeof o !== 'object') return null;
            const out = {};
            for (const k of Object.keys(o)) { const id = Number(k); if (!this.IDS.has(id) || !isNum(o[k], -1e6, 1e6)) return null; out[id] = o[k]; }
            return out;
        },
        /** Inside a midnight roll right now? */
        WORLD_CES: [2721, 2832, 2833, 2386, 2466],           // the crow-eat chance (V90-92), the farm's daily forage and bug spawns, the Catacombs' and Old Woods' bug spawners
        worldRoll() {
            if (this.reading || !Net.isPlaying()) return false;
            const p = 'ce' + CFG.midnightCE, lists = this.WORLD_CES.map(id => window.$dataCommonEvents && $dataCommonEvents[id] && $dataCommonEvents[id].list).filter(Boolean);
            const own = Spawns.stack.some(i => i && i._coopRng && i._coopRng.path.includes('|p:'));   // the night's luck die: my own perks (each player's own roll)
            return !own && (Spawns.stack.some(i => i && ((i._coopRng && (i._coopRng.path === p || i._coopRng.path.startsWith(p + '>'))) || lists.includes(i._list))) || AutoRoll.inRoll());   // + the map's own rolls (decision 92)
        },
        best(id, v) { const b = this.bestOf[id]; return isNum(b, -1e6, 1e6) && b > v ? b : v; },
        tick(ses, now) {
            if (now - this.lastTick < 2000) return;
            this.lastTick = now;
            const mine = this.mine();
            const nm = this.names();
            const md = this.mods();
            if (!ses.isHost) { const k = JSON.stringify([mine, nm, md]); if (k !== this.sentKey) { this.sentKey = k; ses.send(ses.hostId, { t: 'PERKS', v: mine, n: nm, sm: md }); } return; }
            const b = Object.assign({}, mine);
            ses.peers.forEach(p => { if (p.perks && !p.loading) Object.keys(p.perks).forEach(id => { if (!(id in b) || p.perks[id] > b[id]) b[id] = p.perks[id]; }); });
            const all = {}; all[Net.selfId] = nm; ses.peers.forEach((p, id) => { if (p.perkNames && !p.loading) all[id] = p.perkNames; });
            this.namesOf = all;
            const sm = {}; if (md) sm[Net.selfId] = md; ses.peers.forEach((p, id) => { if (p.statMods && !p.loading) sm[id] = p.statMods; });
            this.modsOf = sm;
            const k = JSON.stringify([b, all, sm]);
            if (k !== this.sentKey) { this.sentKey = k; this.bestOf = b; ses.broadcast({ t: 'PERKS_BEST', v: b, nm: all, sm }); }
        },
        reset() { this.bestOf = {}; this.sentKey = ''; this.lastTick = 0; this.namesOf = {}; this.modsOf = {}; Upgrades.reset(); }
    };

    // which map the loaded $dataMap is (decision 90): see Spawns.mapData
    if (typeof DataManager !== 'undefined' && typeof DataManager.loadMapData === 'function' && typeof DataManager.onLoad === 'function') {
        const _loadMapData = DataManager.loadMapData;
        DataManager.loadMapData = function (mapId) { this._coopNextMapId = mapId; return _loadMapData.apply(this, arguments); };
        const _onLoadMapId = DataManager.onLoad;
        DataManager.onLoad = function (object) { if (object && object === window.$dataMap && object.events) object._coopMapId = this._coopNextMapId; return _onLoadMapId.apply(this, arguments); };
    }
    /** Map balances (decision 90): one per-map cache for everyone (see the header). */
    const Balances = {
        sentKey: {},
        clean(m) {
            if (!m || !isInt(m.m, 1, 9999) || !m.b || typeof m.b !== 'object') return null;
            const ks = Object.keys(m.b); if (ks.length > 64) return null;
            const b = {};
            for (const k of ks) { if (!isInt(Number(k), 1, 9999) || !isNum(m.b[k], -1e6, 1e6)) return null; b[k] = m.b[k]; }
            return { m: m.m, b };
        },
        /** After this game recalculated a map: tell everyone (only when it changed). */
        mine(mapId) {
            const s = window.$gameSystem; if (!Net.isPlaying() || !s || !s._mapVarBalances) return;
            const b = s._mapVarBalances[mapId] || {}, key = JSON.stringify(b);
            if (this.sentKey[mapId] === key) return;
            this.sentKey[mapId] = key;
            if (Net.isHost) Net.broadcast({ t: 'BAL_ALL', m: mapId, b }); else Net.send(Net.hostId, { t: 'BAL', m: mapId, b });
        },
        /** Another game's entry for a map: use it, and the totals as the plugin computes them. */
        apply(mapId, b) {
            const s = window.$gameSystem; if (!s || !window.$gameVariables) return;
            s._mapVarBalances = s._mapVarBalances || {}; s._trackedBalanceVars = s._trackedBalanceVars || [];
            s._mapVarBalances[mapId] = b; this.sentKey[mapId] = JSON.stringify(b);
            Object.keys(b).forEach(k => { if (!s._trackedBalanceVars.includes(Number(k))) s._trackedBalanceVars.push(Number(k)); });
            const g = {};
            Object.keys(s._mapVarBalances).forEach(id => { const mb = s._mapVarBalances[id] || {}; Object.keys(mb).forEach(k => { g[k] = (g[k] || 0) + mb[k]; }); });
            s._trackedBalanceVars.forEach(k => $gameVariables.setValue(Number(k), Math.max(0, g[k] || 0)));
        },
        reset() { this.sentKey = {}; }
    };
    if (typeof Game_System !== 'undefined' && typeof Game_System.prototype.recalculateMapVarBalances === 'function') {
        const _recalcBal = Game_System.prototype.recalculateMapVarBalances;
        Game_System.prototype.recalculateMapVarBalances = function () {
            const r = _recalcBal.apply(this, arguments);
            try { if (window.$gameMap && $gameMap.mapId() > 0) Balances.mine($gameMap.mapId()); } catch (e) { Diag.err('map balances', e); }
            return r;
        };
    }

    /** The night notice under the clock (§11.10, §11.13): WTE's font with its crisp outline, no window, right-aligned. */
    const NightHud = {
        W: 660,
        update(scene) {
            if (typeof Sprite === 'undefined' || typeof Bitmap === 'undefined') return;
            const info = Night.hudText(Date.now());
            let sp = scene._coopNightHud;
            if (!sp) {
                if (!info) return;
                sp = scene._coopNightHud = new Sprite(new Bitmap(this.W, 40));
                sp.x = Graphics.width - this.W - 14; sp.y = 92;
                scene.addChild(sp);
            }
            const key = info ? info.text + (info.red ? '!' : '') : '';
            if (key !== sp._key) {
                sp._key = key;
                const b = sp.bitmap;
                b.clear();
                if (info) {
                    b.fontFace = $gameSystem.mainFontFace(); b.fontSize = 22;
                    b.outlineColor = 'rgba(0,0,0,1)'; b.outlineWidth = 5;
                    b.textColor = info.red ? '#ff5a5a' : '#ffffff';
                    b.drawText(info.text, 0, 4, this.W - 8, 32, 'right');
                }
            }
        }
    };


    // ---- the catacomb pendulums swing together (user, 2026-11-01) ----
    //      WTE's pendulum traps follow hidden clock events (maps 160, 161: "Pend Clock ...") that each game starts when
    //      its player walks in, so two players saw them swing out of step and were hit at different moments. In co-op
    //      each clock's position comes from the shared clock (BgmSync.now: the host's time) instead: the same swing on
    //      every screen, with no network traffic. WTE's own rhythm is kept: steps and pauses are read from the clock's
    //      page (an "inverted" clock's first-time head start becomes its delay). The clock events' own writes are skipped.
    const Pendulums = {
        FRAME: 1000 / 60, NAME: /Pend(ulum)? ?Clock/i,
        cache: new Map(),                                 // map id -> [{ e, v, delay, segs: [[value, frames]], period }]
        active() { return Net.isPlaying() && (Net.isHost || Net.inWorld) && !!window.$gameMap && !!window.$dataMap && !!$dataMap.events; },
        clocks(m) {
            if (this.cache.has(m)) return this.cache.get(m);
            const out = [];
            ($dataMap.events || []).forEach(ev => {
                if (!ev || !this.NAME.test(ev.name || '') || !ev.pages || !ev.pages[0]) return;
                let v = 0, delay = 0, head = -1, varId = 0, jump = '', at = 0; const segs = [], labels = {};
                for (const c of ev.pages[0].list || []) {
                    if (c.code === 111 && c.parameters[0] === 2) { head = c.indent; continue; }          // "first time" (self switch): the head start
                    if (head >= 0 && c.indent <= head && (c.code === 411 || c.code === 412)) { head = -1; continue; }
                    const inHead = head >= 0 && c.indent > head;
                    if (c.code === 119 && inHead) jump = String(c.parameters[0]);                           // the head start jumps into the loop ("opp")
                    if (c.code === 118 && !inHead) labels[String(c.parameters[0])] = at;
                    if (c.code === 122) { varId = c.parameters[0]; const n = Number(c.parameters[4]) || 0; if (!inHead) v = c.parameters[2] === 1 ? v + n : n; }
                    if (c.code === 230) { const f = Number(c.parameters[0]) || 0; if (inHead) delay += f; else { segs.push([v, f]); at += f; } }
                }
                const period = segs.reduce((s, x) => s + x[1], 0);
                if (jump && labels[jump] !== undefined) delay -= labels[jump];                             // it starts that far into its loop
                if (varId && period > 0) out.push({ e: ev.id, v: varId, delay, segs, period });
            });
            this.cache.set(m, out);
            return out;
        },
        /** Every map frame: each clock's value at this moment of the shared clock. */
        update() {
            if (!this.active()) return;
            const cl = this.clocks($gameMap.mapId()); if (!cl.length) return;
            const t = Math.floor(BgmSync.now() / this.FRAME);
            cl.forEach(c => {
                let k = (((t - c.delay) % c.period) + c.period) % c.period, val = c.segs[0][0];
                for (const [v, f] of c.segs) { if (k < f) { val = v; break; } k -= f; }
                if ($gameVariables.value(c.v) !== val) $gameVariables.setValue(c.v, val);
            });
        },
        /** A clock event's own variable writes (skipped while the shared clock drives it). */
        isClock(interp) {
            if (!this.active() || !interp || !interp._eventId || interp === $gameMap._interpreter) return false;
            return this.clocks($gameMap.mapId()).some(c => c.e === interp._eventId);
        }
    };
    if (typeof Game_Interpreter !== 'undefined') {
        const _122pend = Game_Interpreter.prototype.command122;
        Game_Interpreter.prototype.command122 = function (params) {
            try { if (Pendulums.isClock(this)) return true; } catch (e) { /* as WTE does it */ }
            return _122pend.apply(this, arguments);
        };
    }
    // =====================================================================
    // 8. UI (DOM overlays; real markup)
    // =====================================================================
    function el(tag, css, text, kids) {
        const e = document.createElement(tag);
        if (css) e.style.cssText = css;
        if (text != null) e.textContent = text;
        (kids || []).forEach(k => e.appendChild(k));
        return e;
    }
    const PANEL = 'position:absolute;z-index:10000;background:rgba(15,12,22,.95);border:2px solid #8b0000;color:#e0e0e0;font:14px monospace;padding:16px;box-sizing:border-box;';
    const BTN = 'margin:4px;padding:6px 12px;background:#2a1e30;color:#e0e0e0;border:1px solid #8b0000;font:14px monospace;cursor:pointer;';
    const shield = input => { input.addEventListener('keydown', e => e.stopPropagation()); input.addEventListener('keyup', e => e.stopPropagation()); return input; };

    let lobbyEl = null, hudEl = null, tradeEl = null;

    function statusText(s) {
        switch (s.state) {
            case S.MENU: return 'Not connected.';
            case S.HOSTING: return 'Creating session...';
            case S.CONNECTING: return 'Connecting...';
            case S.SYNCHRONIZING: return 'Connected. Waiting for the host\'s world state...';
            case S.PLAYING: return s.isHost ? hostShareText(s) : 'Connected to host.';
            case S.DISCONNECTING: return 'Disconnecting...';
            default: return 'ERROR: ' + s.error;
        }
    }

    // ---------------------------------------------------------------------
    // CO-OP SAVES. Kept apart from the game's own 20 slots: files save/coopsave1..4.rmmzsave plus a small
    // index save/coopsaves.rmmzsave. The single-player index (global.rmmzsave) and file1..N are never written
    // by the co-op code, so the two kinds of save cannot overwrite or corrupt each other.
    // Loading mirrors DataManager.loadGame (same hooks the other plugins add to createGameObjects /
    // makeSaveContents / extractSaveContents run); saving mirrors Scene_Save (onBeforeSave, makeSaveContents).
    // ---------------------------------------------------------------------
    const Saves = {
        SLOTS: 4, INDEX: 'coopsaves', index: { slots: {} }, busy: false,
        name(slot) { return 'coopsave' + slot; },
        validSlot(n) { return Number.isInteger(n) && n >= 1 && n <= this.SLOTS; },
        async refresh() {
            this.index = { slots: {} };
            try {
                if (StorageManager.exists(this.INDEX)) {
                    const o = await StorageManager.loadObject(this.INDEX);
                    if (o && typeof o.slots === 'object' && o.slots) this.index = o;
                }
            } catch (e) { Diag.err('co-op save index unreadable (ignored)', e); }
            return this.index;
        },
        slotExists(slot) { try { return this.validSlot(slot) && StorageManager.exists(this.name(slot)); } catch (e) { return false; } },
        describe(info) {
            if (!info) return 'no details';
            return [info.playtime, info.timestamp ? new Date(info.timestamp).toLocaleString() : ''].filter(Boolean).join(', ') || 'no details';
        },
        /** Everything the lobby can start from. */
        options() {
            const out = [{ key: 'new', src: 'new', label: 'New game' }];
            for (let i = 1; i <= this.SLOTS; i++) {
                const has = this.slotExists(i);
                out.push({ key: 'coop' + i, src: 'coop', id: i, ok: has, label: 'Co-op save ' + i + (has ? ' (' + this.describe(this.index.slots[i]) + ')' : ' (empty)') });
            }
            try {
                const max = DataManager.maxSavefiles();
                for (let i = 1; i <= max; i++) {
                    const info = DataManager.savefileInfo(i);
                    if (info && DataManager.savefileExists(i)) out.push({ key: 'sp' + i, src: 'sp', id: i, ok: true, label: 'Copy of single-player file ' + i + ' (' + this.describe(info) + ')' });
                }
            } catch (e) { Diag.err('listing single-player saves', e); }
            return out;
        },
        /** Put the chosen save (or a new game) into the running game objects. */
        async enter(choice) {
            if (choice.src === 'new') { DataManager.setupNewGame(); return null; }
            const name = choice.src === 'coop' ? this.name(choice.id) : DataManager.makeSavename(choice.id);
            if (!StorageManager.exists(name)) throw new Error('That save file no longer exists.');
            const contents = await StorageManager.loadObject(name);
            const need = ['system', 'switches', 'variables', 'selfSwitches', 'actors', 'party', 'map', 'player'];
            if (!contents || need.some(k => !contents[k])) throw new Error('That save file is damaged or incomplete; nothing was changed.');
            if (choice.src === 'coop' && !(contents.elderfieldCoop && contents.elderfieldCoop.v === 1)) throw new Error('That file is not a co-op save.');
            DataManager.createGameObjects();
            DataManager.extractSaveContents(contents);
            DataManager.correctDataErrors();
            if ($gameSystem.onAfterLoad) $gameSystem.onAfterLoad();
            // same as Scene_Load.reloadMapIfUpdated
            if ($gameSystem.versionId && $gameSystem.versionId() !== $dataSystem.versionId) {
                $gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y, $gamePlayer.direction(), 0);
                $gamePlayer.requestMapReload();
            }
            return contents.elderfieldCoop || null;
        },
        /** The pause menu's Save during a session: save to the co-op slot instead of opening the 20-slot screen. */
        interceptPush(sceneClass) {
            if (WorldSave.interceptPush(sceneClass)) return true;          // P2P co-op world (decision 17: host-only saving)
            if (typeof Scene_Save === 'undefined' || sceneClass !== Scene_Save || !Net.saveSlot || Net.state !== S.PLAYING) return false;
            this.saveFromMenu();
            return true;
        },
        saveFromMenu() {
            if (Net.rl || Net.ritualActive() || $gameMap.isEventRunning() || $gameMessage.isBusy()) { Diag.toast('Cannot save right now.', 3000); return; }
            const slot = Net.saveSlot;
            this.save(slot, 'menu')
                .then(ok => { try { SoundManager.playSave(); } catch (e) { /* optional */ } if (ok) Diag.toast('Saved to Co-op save ' + slot + ' (your normal save slots were not touched).', 4000); })
                .catch(e => { Diag.err('co-op save failed', e); try { SoundManager.playBuzzer(); } catch (e2) { /* optional */ } Diag.toast('Co-op save FAILED: ' + (e && e.message || e), 8000); });
        },
        /** Write the current game into the player's co-op slot. Never touches single-player files. */
        async save(slot, why) {
            if (!this.validSlot(slot)) throw new Error('No co-op save slot is selected.');
            if (this.busy) return false;
            this.busy = true;
            try {
                if ($gameSystem.onBeforeSave) $gameSystem.onBeforeSave();
                const contents = DataManager.makeSaveContents();
                contents.elderfieldCoop = { v: 1, slot, why: String(why || ''), at: Date.now(), role: Net.isHost ? 'host' : 'client', session: Net.exportSession() };
                await StorageManager.saveObject(this.name(slot), contents);        // core writes a temp file and restores the old one on failure
                const info = DataManager.makeSavefileInfo ? DataManager.makeSavefileInfo() : { timestamp: Date.now() };
                this.index.slots[slot] = info;
                await StorageManager.saveObject(this.INDEX, this.index);
                Diag.log('info', 'co-op progress saved to slot ' + slot + ' (' + why + ')');
                return true;
            } finally { this.busy = false; }
        },
        /** Called every map frame: saves a requested autosave only when nothing is running. */
        tick(manual) {
            if (!Net.saveSlot || (!Net.autosavePending && !manual) || Net.state !== S.PLAYING) return;
            if (Net.rl || Net.ritualActive() || $gameMap.isEventRunning() || $gameMessage.isBusy() || SceneManager.isSceneChanging()) {
                if (manual) Diag.toast('Cannot save right now (an event is running).', 3000);
                return;
            }
            const slot = Net.saveSlot; Net.autosavePending = false;
            this.save(slot, manual ? 'manual' : 'group sleep')
                .then(ok => { if (ok) Diag.toast('Co-op progress saved (co-op save ' + slot + ').', 3000); })
                .catch(e => { Diag.err('co-op save failed', e); Diag.toast('Co-op save FAILED: ' + (e && e.message || e), 8000); });
        }
    };

    // lobby choices survive the panel closing (clients start automatically once synchronised)
    const lobbyChoice = { src: 'new', id: 0, dest: 0 };
    function rememberChoice() { try { localStorage.setItem('elderfieldCoopChoice', JSON.stringify(lobbyChoice)); } catch (e) { /* storage optional */ } }
    function recallChoice() {
        try {
            const c = JSON.parse(localStorage.getItem('elderfieldCoopChoice') || 'null');
            if (c && ['new', 'coop', 'sp'].includes(c.src)) { lobbyChoice.src = c.src; lobbyChoice.id = c.id | 0; lobbyChoice.dest = c.dest | 0; }
        } catch (e) { /* ignore */ }
    }

    function ensureUiStyle() {
        if (!hasDOM || document.getElementById('ec-ui-style')) return;
        // The game hides the OS cursor on every element (it draws its own cursor inside the canvas, below any
        // HTML panel). These rules bring the normal cursor back over this plugin's panels only.
        const st = document.createElement('style'); st.id = 'ec-ui-style';
        st.textContent = '.ec-ui, .ec-ui * { cursor: default !important; } .ec-ui button, .ec-ui select, .ec-ui option { cursor: pointer !important; } .ec-ui input { cursor: text !important; }';
        document.head.appendChild(st);
    }
    function panelEvents(node) {
        ['mousedown', 'mouseup', 'touchstart', 'touchend', 'wheel', 'click', 'contextmenu'].forEach(ev => node.addEventListener(ev, e => e.stopPropagation()));
        return node;
    }

    const Lobby = {
        show() {
            if (!hasDOM || lobbyEl) return;
            ensureUiStyle(); recallChoice();
            const status = el('div', 'margin:10px 0;min-height:36px;color:#ffd27f;word-break:break-all;', statusText(Net));
            const note = el('div', 'margin:4px 0;min-height:18px;color:#ff9b9b;font-size:12px;word-break:break-word;', '');
            const code = shield(el('input', 'width:90%;padding:6px;background:#111;color:#eee;border:1px solid #666;font:14px monospace;'));
            code.placeholder = '6-digit code from the host';
            const selStyle = 'width:92%;background:#111;color:#eee;border:1px solid #666;font:13px monospace;padding:4px;margin:2px 0;';
            const from = el('select', selStyle), dest = el('select', selStyle);
            const fromLabel = el('div', 'text-align:left;margin-top:8px;color:#bbb;', 'Play on:'), destLabel = el('div', 'text-align:left;margin-top:6px;color:#bbb;', 'Save co-op progress to:');
            let opts = [];
            const fillDest = () => {
                const o = opts.find(x => x.key === from.value) || opts[0];
                dest.innerHTML = '';
                for (let i = 1; i <= Saves.SLOTS; i++) {
                    const op = el('option', null, 'Co-op save ' + i + (Saves.slotExists(i) ? ' (in use - will be overwritten)' : ' (empty)')); op.value = String(i); dest.appendChild(op);
                }
                if (o.src === 'coop') { dest.value = String(o.id); dest.disabled = true; destLabel.textContent = 'Progress is saved back to the same co-op save:'; }
                else {
                    dest.disabled = false; destLabel.textContent = 'Save co-op progress to:';
                    let pick = lobbyChoice.dest; if (!Saves.validSlot(pick)) { pick = 1; for (let i = 1; i <= Saves.SLOTS; i++) if (!Saves.slotExists(i)) { pick = i; break; } }
                    dest.value = String(pick);
                }
                sync();
            };
            const sync = () => {
                const o = opts.find(x => x.key === from.value) || opts[0];
                lobbyChoice.src = o.src; lobbyChoice.id = o.id || 0; lobbyChoice.dest = o.src === 'coop' ? o.id : (parseInt(dest.value, 10) || 1);
                rememberChoice();
            };
            const fillFrom = async () => {
                await Saves.refresh(); opts = Saves.options(); from.innerHTML = '';
                opts.forEach(o => { const op = el('option', null, o.label); op.value = o.key; if (o.ok === false) op.disabled = true; from.appendChild(op); });
                const want = lobbyChoice.src === 'new' ? 'new' : (lobbyChoice.src === 'coop' ? 'coop' : 'sp') + lobbyChoice.id;
                from.value = opts.some(o => o.key === want && o.ok !== false) ? want : 'new';
                fillDest();
            };
            from.onchange = fillDest; dest.onchange = sync;
            fillFrom().catch(e => Diag.err('save list', e));
            const host = el('button', BTN, 'HOST');
            const join = el('button', BTN, 'JOIN');
            const start = el('button', BTN + 'display:none;', 'START GAME');
            const back = el('button', BTN, 'BACK');
            const guard = fn => () => { sync(); note.textContent = ''; fn(); };
            host.onclick = guard(() => Net.host());
            join.onclick = guard(() => Net.join(code.value));
            start.onclick = () => { sync(); startGame(); };
            back.onclick = () => { Net.leave(); Lobby.hide(); };
            lobbyEl = el('div', PANEL + 'top:50%;left:50%;transform:translate(-50%,-50%);width:500px;max-width:96%;text-align:center;', null,
                [el('div', 'font-size:18px;color:#ff6b6b;', 'CO-OP MULTIPLAYER'), status, fromLabel, from, destLabel, dest, el('br'), code, el('br'), host, join, start, back, note]);
            lobbyEl.className = 'ec-ui'; panelEvents(lobbyEl);
            lobbyEl._note = note;
            lobbyEl._refresh = () => {
                status.textContent = statusText(Net);
                const idle = Net.state === S.MENU || Net.state === S.ERROR;
                host.disabled = join.disabled = !idle;
                const cur = opts.find(x => x.key === from.value);
                from.disabled = !idle;
                dest.disabled = !idle || !!(cur && cur.src === 'coop');
                start.style.display = (Net.state === S.PLAYING && Net.isHost) ? 'inline-block' : 'none';
                if (Net.state === S.PLAYING && !Net.isHost) startGame();                              // clients enter only after sync
            };
            document.body.appendChild(lobbyEl);
        },
        hide() {
            if (lobbyEl) { lobbyEl.remove(); lobbyEl = null; }
            const sc = window.SceneManager && SceneManager._scene;
            if (sc && sc._commandWindow && !(sc instanceof Scene_Map)) { try { sc._commandWindow.open(); sc._commandWindow.activate(); } catch (e) { Diag.err('reopen title menu', e); } }
        },
        note(text) { if (lobbyEl && lobbyEl._note) lobbyEl._note.textContent = text; }
    };

    let starting = false;
    async function startGame() {
        const sc = SceneManager._scene;
        if (starting || !sc || sc instanceof Scene_Map) return;
        starting = true;
        try {
            Diag.log('info', 'starting: ' + lobbyChoice.src + (lobbyChoice.id ? ' ' + lobbyChoice.id : '') + ', co-op slot ' + lobbyChoice.dest);
            const meta = await Saves.enter(lobbyChoice);
            if (Net.isHost && meta && meta.session) Net.importSession(meta.session);
            Net.saveSlot = Saves.validSlot(lobbyChoice.dest) ? lobbyChoice.dest : 0;
            updateHud();
            if (lobbyEl) { lobbyEl.remove(); lobbyEl = null; }
            if (sc._commandWindow && sc._commandWindow.close) sc._commandWindow.close();
            if (sc.fadeOutAll) sc.fadeOutAll();
            SceneManager.goto(Scene_Map);
        } catch (e) {
            Diag.err('startGame', e);
            const msg = String(e && e.message || e);
            if (Net.state !== S.MENU && !Net.isHost) Net.leave();      // a client that cannot load must not linger in the session
            Lobby.note('Could not start: ' + msg);
        } finally { starting = false; }
    }

    /** Open the lobby from any non-map scene (the title screen may be a custom scene class). */
    function openLobby(via) {
        const sc = window.SceneManager && SceneManager._scene;
        Diag.log('info', 'co-op menu requested via ' + via + '; scene=' + (sc && sc.constructor && sc.constructor.name));
        if (!sc) return;
        if (sc instanceof Scene_Map) {                                   // in game: the Co-op panel (players, where they are, joining, leaving)
            if (Net.isPlaying() && window.Scene_CoopPanel && !$gameMap.isEventRunning() && !$gameMessage.isBusy() && !SceneManager.isSceneChanging()) { try { SoundManager.playOk(); } catch (e) { /* optional */ } SceneManager.push(window.Scene_CoopPanel); }
            else if (Net.isPlaying() && Net.isHost) Diag.toast(hostShareText(Net), 12000);
            return;
        }
        if (!window.Scene_CoopMenu || sc instanceof window.Scene_CoopMenu || SceneManager.isSceneChanging()) return;
        try { SoundManager.playOk(); } catch (e) { /* sound is optional */ }
        SceneManager.push(window.Scene_CoopMenu);
    }

    let hudStamp = 0;
    /** The corner status line: off unless the player turned it on with /status (decision 84). */
    const hudWanted = () => { try { return localStorage.getItem('elderfieldCoopHud') === '1'; } catch (e) { return false; } };
    function updateHud() {
        if (!hasDOM) return;
        if (!hudEl) { if (!hudWanted()) return; hudEl = el('div', 'position:absolute;top:4px;right:8px;z-index:9000;pointer-events:none;color:#ffd27f;font:12px monospace;text-shadow:1px 1px #000;'); document.body.appendChild(hudEl); }
        if (!hudWanted()) { hudEl.textContent = ''; return; }
        hudEl.textContent = (Net.state === S.PLAYING)
            ? (Net.isHost ? 'Hosting · code ' + Net.code : 'Connected to ' + Net.nameOf(Net.hostId)) + ' · ' + Net.playerCount() + (Net.playerCount() === 1 ? ' player' : ' players') : '';
    }

    // ---- controllers (decision 90): one per game window, so two players on one PC each move only their own character ----
    const Pads = {
        KEY: 'elderfieldCoopController', installed: false, _no: 0,
        /** Which game window this is: 1 normally; 2 for the second-player window (its own browser profile), 3, 4. */
        windowNo() {
            if (this._no) return this._no;
            let args = [];
            try { if (typeof nw !== 'undefined' && nw.App) args = [].concat(nw.App.fullArgv || [], nw.App.argv || []); } catch (e) { /* not NW.js */ }
            const a = args.map(String).find(s => /user-data-dir/i.test(s));
            let n = 1;
            if (a) {
                const name = a.replace(/["']/g, '').split(/[\\/=]/).filter(Boolean).pop() || '';
                n = /second/i.test(name) ? 2 : /third/i.test(name) ? 3 : /fourth/i.test(name) ? 4 : (Number((/(\d)\D*$/.exec(name) || [0, 2])[1]) || 2);
            }
            return (this._no = Math.max(1, Math.min(4, n)));
        },
        /** 0 (auto), 1-4 (the Nth controller, /controller), or { i, id }: a controller claimed by pressing it (Options). */
        choice() {
            try {
                const v = localStorage.getItem(this.KEY);
                if (v && /^[1-4]$/.test(v)) return Number(v);
                if (v && v[0] === '{') { const o = JSON.parse(v); if (o && Number.isInteger(o.i) && o.i >= 0 && o.i < 16 && typeof o.id === 'string') return { i: o.i, id: o.id.slice(0, 200) }; }
                return 0;
            } catch (e) { return 0; }
        },
        set(v) { try { if (v) localStorage.setItem(this.KEY, typeof v === 'object' ? JSON.stringify(v) : String(v)); else localStorage.removeItem(this.KEY); } catch (e) { /* storage optional */ } },
        raw: null, claiming: null, claimWin: null,
        /** Options: the next button pressed on any controller becomes this window's. */
        claim(win) {
            const pads = this.rawPads(), held = new Set();
            pads.forEach(p => (p.buttons || []).forEach((b, k) => { if (b && (b.pressed || b.value > 0.5)) held.add(p.index + ':' + k); }));
            this.claiming = { at: Date.now(), held }; this.claimWin = win || null;
        },
        rawPads() { try { return Array.from((this.raw ? this.raw() : []) || []).filter(p => p && p.connected); } catch (e) { return []; } },
        /** Every frame while claiming: the first new button press (or 10 s: back as it was). */
        tick() {
            const c = this.claiming; if (!c) return;
            if (Date.now() - c.at > 10000) { this.claiming = null; this.redraw(); return; }
            for (const p of this.rawPads()) {
                const k = (p.buttons || []).findIndex((b, n) => b && (b.pressed || b.value > 0.5) && !c.held.has(p.index + ':' + n));
                if (k >= 0) { this.set({ i: p.index, id: String(p.id || '') }); this.claiming = null; Diag.log('info', 'controllers: this window now uses ' + this.name(p)); this.redraw(); return; }
            }
            c.held.forEach(h => { const [i, n] = h.split(':').map(Number); const p = this.rawPads().find(x => x.index === i); if (!p || !p.buttons[n] || !(p.buttons[n].pressed || p.buttons[n].value > 0.5)) c.held.delete(h); });   // released: may count next time
        },
        redraw() { try { const w = this.claimWin; if (w && w.redrawItem && w.findSymbol) w.redrawItem(w.findSymbol('coopPad')); } catch (e) { /* the window closed */ } },
        /** Options left/right (decision 100): Auto, then each controller that is plugged in (its name and slot), round and round. */
        cycle(dir) {
            this.claiming = null;
            const pads = this.rawPads(), ch = this.choice();
            let at = 0;                                                          // where the current choice is: 0 = Auto, k = the k-th connected controller
            if (typeof ch === 'number' && ch) at = pads[ch - 1] ? ch : 0;
            else if (ch) { const k = pads.findIndex(p => p.index === ch.i && String(p.id) === ch.id); at = k >= 0 ? k + 1 : 0; }
            const n = pads.length + 1, next = (at + (dir < 0 ? -1 : 1) + n) % n, p = next ? pads[next - 1] : null;
            this.set(p ? { i: p.index, id: String(p.id || '') } : 0);
            Diag.log('info', 'controllers: this window now uses ' + (p ? this.name(p) : 'Auto'));
            return p;
        },
        name(p) { const s = String(p && p.id || 'Controller').replace(/\s*\((STANDARD GAMEPAD|Vendor|XInput)[^)]*\)/gi, '').replace(/\s+/g, ' ').trim(); return (s.slice(0, 28) || 'Controller') + ' (slot ' + ((p && p.index) + 1) + ')'; },
        /** What Options shows. */
        label() {
            if (this.claiming) return 'Press a button...';
            const ch = this.choice();
            if (!ch) return 'Auto';
            if (typeof ch === 'number') return 'Controller ' + ch;
            const p = this.rawPads().find(x => x.index === ch.i && String(x.id) === ch.id) || this.rawPads().find(x => String(x.id) === ch.id);
            return p ? this.name(p) : this.name({ id: ch.id, index: ch.i }) + ' - not connected';
        },
        /** Every reader (the engine, WTE's plugins, co-op) asks navigator.getGamepads(): give this window only its own controller. */
        filter(list) {
            const arr = Array.from(list || []), pads = arr.filter(p => p && p.connected);
            if (!pads.length) return arr;
            if (this.claiming) return arr.map(() => null);                // choosing in Options: the pressed button only chooses
            const pick = this.choice();
            let keep = null;
            if (pick && typeof pick === 'object') {                          // claimed: that very controller (its slot and name), or the same name elsewhere
                keep = pads.find(p => p.index === pick.i && String(p.id) === pick.id) || null;
                if (!keep) { const same = pads.filter(p => String(p.id) === pick.id); keep = same.length === 1 ? same[0] : null; }
            } else if (pick) keep = pads[pick - 1] || null;
            else if (pads.length === 1) keep = (typeof document === 'undefined' || !document.hasFocus || document.hasFocus()) ? pads[0] : null;   // one controller: the window in front
            else keep = pads[this.windowNo() - 1] || null;
            return arr.map(p => (p && p === keep) ? p : null);
        },
        install() {
            if (this.installed || typeof navigator === 'undefined' || typeof navigator.getGamepads !== 'function') return;
            const orig = navigator.getGamepads.bind(navigator);
            this.raw = orig;
            try { Object.defineProperty(navigator, 'getGamepads', { configurable: true, writable: true, value: () => this.filter(orig()) }); this.installed = true; }
            catch (e) { Diag.log('warn', 'controllers: could not give this window its own controller: ' + e.message); return; }
            Diag.log('info', 'controllers: game window ' + this.windowNo() + (this.choice() ? ', controller ' + this.label() + ' chosen' : ''));
        },
        /** The names of the buttons for "page left/right" (the co-op menu's tabs) on this window's controller, as WTE
         *  names them (Hendrix_Keyboard_Gamepad's layout: Xbox, PlayStation or Nintendo, picked from the controller or
         *  chosen in Control Config) and wherever the player rebound them; null without a controller. */
        NAMES: {
            xbox: ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT', 'View', 'Menu', 'LS', 'RS', 'Up', 'Down', 'Left', 'Right'],
            ps: ['Cross', 'Circle', 'Square', 'Triangle', 'L1', 'R1', 'L2', 'R2', 'Share', 'Options', 'L3', 'R3', 'Up', 'Down', 'Left', 'Right'],
            nintendo: ['B', 'A', 'Y', 'X', 'L', 'R', 'ZL', 'ZR', '-', '+', 'LS', 'RS', 'Up', 'Down', 'Left', 'Right']
        },
        layout(id) {
            try { if (typeof gamepadType !== 'undefined' && this.NAMES[gamepadType]) return gamepadType; } catch (e) { /* WTE's controller plugin is off */ }
            const s = String(id || '').toLowerCase();
            if (/xbox|045e|xinput/.test(s)) return 'xbox';                     // "Xbox Wireless Controller" is not a PlayStation one
            return /054c|playstation|dualshock|dualsense|wireless controller/.test(s) ? 'ps' : /057e|nintendo|pro controller|joy-con/.test(s) ? 'nintendo' : 'xbox';
        },
        shoulders() {
            let pad = null;
            try { pad = Array.from(navigator.getGamepads() || []).find(p => p && p.connected) || null; } catch (e) { return null; }
            if (!pad) return null;
            const names = this.NAMES[this.layout(pad.id)], map = (window.Input && Input.gamepadMapper) || {};
            const find = sym => { const k = Object.keys(map).find(b => map[b] === sym); return k !== undefined && names[Number(k)] ? names[Number(k)] : null; };
            const l = find('pageup'), r = find('pagedown');
            return l && r ? { l, r } : null;
        },
        describe() {
            const n = (() => { try { return Array.from(navigator.getGamepads.call ? (Object.getPrototypeOf(navigator).getGamepads.call(navigator) || []) : []).filter(p => p && p.connected).length; } catch (e) { return 0; } })();
            const pick = this.choice(), w = this.windowNo();
            return 'Controllers connected: ' + n + '. This is game window ' + w + '; it uses ' + (pick ? this.label() + ' (chosen)' : n >= 2 ? 'controller ' + w : 'the controller while it is the window in front') + '.';
        }
    };
    Pads.install();
    /** Controller moves on the title with CO-OP in it (decision 101): see tools/plugin-build/titlepad-edit.js. */
    const TitlePad = {
        /** Where a direction goes from button i: an index, -1 (stay), or null (WTE's own move). */
        target(dir, i, list, pics) {
            const c = list.findIndex(x => x && x.symbol === 'coop');
            if (c < 0 || !pics) return null;
            if (!pics[c] || !pics[c]._orgXY) return null;
            // the bottom row and CO-OP (a button elsewhere on the screen, like WTE's extra one at the top, keeps WTE's moves)
            const order = pics.map((p, k) => k).filter(k => pics[k] && pics[k]._orgXY && Math.abs(pics[k]._orgXY[1] - pics[c]._orgXY[1]) <= 120).sort((a, b) => pics[a]._orgXY[0] - pics[b]._orgXY[0]);
            if (order.indexOf(i) < 0) return null;
            if (dir === 'left' || dir === 'right') return order[(order.indexOf(i) + (dir === 'right' ? 1 : -1) + order.length) % order.length];
            if (dir === 'up') return i === c ? -1 : c;
            if (dir === 'down' && i === c) {
                const cx = pics[c]._orgXY[0], cy = pics[c]._orgXY[1];
                const below = order.filter(k => k !== c && pics[k]._orgXY[1] > cy);
                return below.length ? below.sort((a, b) => Math.abs(pics[a]._orgXY[0] - cx) - Math.abs(pics[b]._orgXY[0] - cx))[0] : -1;
            }
            return null;
        }
    };
    if (typeof Scene_Base !== 'undefined') {
        const _sbPads = Scene_Base.prototype.update;
        Scene_Base.prototype.update = function () { _sbPads.apply(this, arguments); try { Pads.tick(); } catch (e) { /* next frame */ } };
    }
    /** The farm's loading picture (decision 90): see the header. */
    const FarmLoad = {
        MAP: 34, PIC: 86, SCENE: 226, quiet: 0,
        update() {
            if (!Net.isPlaying() || !window.$gameMap || !window.$gameScreen || $gameMap.mapId() !== this.MAP) { this.quiet = 0; return; }
            const pic = $gameScreen.picture(this.PIC), it = $gameMap._interpreter;
            if (pic && pic.name() === 'LoadingFarm' && it && it.isRunning() && it.eventId() === this.SCENE) {   // the shrine scene started (decision 92)
                $gameScreen.erasePicture(this.PIC); this.quiet = 0;
                Diag.log('info', 'farm: the shrine scene started under the loading picture: removed');
                return;
            }
            if (!pic || pic.name() !== 'LoadingFarm' || $gameMap.isEventRunning() || $gamePlayer.isTransferring()) { this.quiet = 0; return; }
            if (++this.quiet < 90) return;
            this.quiet = 0;
            $gameScreen.erasePicture(this.PIC);
            Diag.log('info', 'farm: the loading picture was left on screen (the shrine scene had already been seen in this world): removed');
        }
    };

    // ---- chat (design §11.15; decision 57): the "Co-op Chat" key (binds page, C by default) opens the box, Enter sends, Esc closes ----
    //      Lines show bottom-left and fade after 10 s while the box is closed. Joins, departures and group moments are
    //      posted as notices. /list shows who is where, /help the commands.
    const Chat = {
        MAX: 120, SHOW: 8, FADE_MS: 10000,
        lines: [], box: null, log: null, input: null, typing: false, sent: [],
        active() { return Net.isPlaying() && (Net.isHost || Net.inWorld); },
        clean(x) { return typeof x === 'string' ? x.replace(/[\u0000-\u001f\u007f<>]/g, '').trim().slice(0, this.MAX) : ''; },
        add(text, color) { this.lines.push({ text: String(text), color: color || '#FCE7FF', at: Date.now() }); if (this.lines.length > 60) this.lines.shift(); this.render(true); },
        system(text) { this.add(text, '#84AAFF'); },
        say(name, x) { this.add(name + ': ' + x); },
        ensure() {
            if (!hasDOM || this.box || !document.body) return !!this.box;
            const font = 'font:16px rmmz-mainfont, monospace;text-shadow:2px 0 #000,-2px 0 #000,0 2px #000,0 -2px #000;';
            this.box = el('div', 'position:absolute;left:12px;bottom:12px;width:46%;z-index:9400;pointer-events:none;' + font);
            this.log = el('div', 'display:flex;flex-direction:column;gap:2px;margin-bottom:6px;');
            this.input = shield(el('input', 'display:none;width:100%;box-sizing:border-box;pointer-events:auto;background:rgba(20,8,30,.88);color:#FCE7FF;border:2px solid #A17BA7;outline:1px solid #1F132A;padding:5px 8px;' + font));
            this.input.maxLength = this.MAX;
            this.input.addEventListener('keydown', e => {
                if (e.key === 'Enter') { e.preventDefault(); const v = this.input.value; this.input.value = ''; this.close(); this.submit(v); }
                else if (e.key === 'Escape') { e.preventDefault(); this.close(); }
            });
            this.input.addEventListener('blur', () => this.close());
            this.box.appendChild(this.log); this.box.appendChild(this.input);
            document.body.appendChild(this.box);
            return true;
        },
        open() {
            if (!this.active() || this.typing || !this.ensure()) return;
            this.typing = true; this.input.style.display = 'block'; this.input.placeholder = 'Say something  (Enter: send · Esc: close · /help)';
            if (typeof Input !== 'undefined') Input.clear();
            setTimeout(() => { try { this.input.focus(); } catch (e) { /* no focus */ } }, 0);
            this.render(true);
        },
        close() { if (!this.typing) return; this.typing = false; if (this.input) { this.input.style.display = 'none'; this.input.blur(); } if (typeof Input !== 'undefined') Input.clear(); this.render(true); },
        submit(v) {
            const x = this.clean(v);
            if (!x || !this.active()) return;
            if (x[0] === '/') return this.command(x);
            const now = Date.now(); this.sent = this.sent.filter(at => now - at < 5000);
            if (this.sent.length >= 5) return this.system('Slow down a little.');
            this.sent.push(now);
            if (Net.isHost) { Net.broadcast({ t: 'CHAT', id: Net.selfId, n: hostName(Net), x }); this.say(hostName(Net), x); }
            else Net.send(Net.hostId, { t: 'CHAT_UP', x });
        },
        command(x) {
            const c = x.slice(1).split(/\s+/)[0].toLowerCase();
            if (c === 'list' || c === 'who') { Players.rows().forEach(r => this.system(r.name + ' · ' + r.where + (r.status ? ' · ' + r.status : '') + (r.ping ? ' · ' + r.ping : ''))); return; }
            if (c === 'controller' || c === 'pad') {                        // which controller this window uses (decision 90)
                const a = (x.split(/\s+/)[1] || '').toLowerCase();
                if (/^[1-4]$/.test(a)) { Pads.set(Number(a)); return this.system('This window now uses controller ' + a + ' only.'); }
                if (a === 'auto') { Pads.set(0); return this.system(Pads.describe()); }
                return this.system(Pads.describe() + '   ·   /controller 1-4 chooses, /controller auto goes back');
            }
            if (c === 'status') {
                const on = !hudWanted(); try { localStorage.setItem('elderfieldCoopHud', on ? '1' : '0'); } catch (e) { /* storage optional */ }
                updateHud(); this.system(on ? 'Status line shown (top right). /status hides it.' : 'Status line hidden. /status shows it again; F9 has the same and more.'); return;
            }
            this.system('/list: who is here and where   ·   /status: the status line on/off   ·   /controller: which controller this window uses   ·   /help: this list   ·   F9: the Co-op panel');
        },
        render(force) {
            if (!this.box && !this.ensure()) return;
            const now = Date.now(), show = this.lines.slice(-this.SHOW).filter(l => this.typing || now - l.at < this.FADE_MS);
            const key = show.map(l => l.at + l.text).join('|') + this.typing;
            if (!force && key === this._key) return;
            this._key = key;
            this.log.innerHTML = '';
            show.forEach(l => { const d = el('div', 'color:' + l.color + ';white-space:pre-wrap;word-break:break-word;'); d.textContent = l.text; this.log.appendChild(d); });
            this.box.style.display = show.length || this.typing ? 'block' : 'none';
            this.place();
        },
        tick() { if (this.lines.length || this.typing) this.render(false); if (this.typing && !this.active()) this.close(); },
        /** Where the notes go, in screen pixels over the game's canvas. */
        place() {
            if (!this.box || !window.Graphics || !Graphics._canvas || this.box.style.display === 'none') return;
            const sc = window.SceneManager && SceneManager._scene, r = Graphics._canvas.getBoundingClientRect(), k = r.height / Graphics.height || 1;
            const left = Math.round(r.left + 12 * k) + 'px';
            let top = 'auto', bottom = Math.round(window.innerHeight - r.bottom + 12 * k) + 'px';
            if (typeof Scene_Battle !== 'undefined' && sc instanceof Scene_Battle) { top = Math.round(r.top + 212 * k) + 'px'; bottom = 'auto'; }
            else {
                const mw = sc && sc._messageWindow, wl = sc && sc._windowLayer;
                if (mw && window.$gameMessage && $gameMessage.isBusy() && mw.isOpen() && mw.y > Graphics.height / 2) {
                    const nb = sc._nameBoxWindow, y = nb && nb.visible && nb.isOpen() && nb.width > 0 ? Math.min(mw.y, nb.y) : mw.y;   // above the speaker's name tag too
                    bottom = Math.round(window.innerHeight - (r.top + (y + (wl ? wl.y : 0)) * k) + 6) + 'px';
                }
            }
            const key = left + top + bottom; if (key === this._place) return;
            this._place = key; this.box.style.left = left; this.box.style.top = top; this.box.style.bottom = bottom;
        },
        reset() { this.close(); this.lines = []; this.sent = []; this.hinted = false; this.render(true); },
        /** Once per session, the host only, on their own screen. */
        hint() { if (this.hinted || !Net.isHost || !this.active() || !(SceneManager._scene instanceof Scene_Map)) return; this.hinted = true; this.system('Co-op: press ' + this.keyName() + ' to chat  ·  F9 opens the Co-op panel  ·  /help lists the commands'); const n = Unadapted.note(); if (n) this.system(n); },
        /** The chat key is on WTE's binds page ("Co-op Chat", decision 90)? */
        bound() { return typeof Input !== 'undefined' && !!Input.keyMapper && Object.values(Input.keyMapper).includes('coopchat'); },
        keyName() {
            if (!this.bound()) return 'C';
            const codes = Object.keys(Input.keyMapper).filter(k => Input.keyMapper[k] === 'coopchat').map(Number);
            const name = c => c >= 65 && c <= 90 ? String.fromCharCode(c) : c >= 48 && c <= 57 ? String.fromCharCode(c) : c >= 112 && c <= 123 ? 'F' + (c - 111) : 'key ' + c;
            return codes.length ? codes.map(name).join(' or ') : 'C';
        },
        canOpen() {
            const sc = window.SceneManager && SceneManager._scene;
            return !this.typing && this.active() && typeof Scene_Map !== 'undefined' && sc instanceof Scene_Map && !(window.$gameMessage && $gameMessage.isBusy()) && !SceneManager.isSceneChanging()
                && !(document.activeElement && /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName));
        }
    };
    if (hasDOM) document.addEventListener('keydown', e => {
        if (Chat.typing || e.repeat || Chat.bound() || e.code !== 'KeyC' || e.ctrlKey || e.altKey || e.metaKey) return;   // no binds page: C
        const sc = window.SceneManager && SceneManager._scene;
        if (!Chat.active() || typeof Scene_Map === 'undefined' || !(sc instanceof Scene_Map) || (window.$gameMessage && $gameMessage.isBusy()) || SceneManager.isSceneChanging()) return;
        if (document.activeElement && /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) return;
        e.preventDefault(); Chat.open();
    });

    // ---- ping (decision 58): the host times a round trip to each player every 2 s and tells everyone ----
    const Ping = {
        EVERY_MS: 2000, last: 0, ms: new Map(),                        // player id -> ms (host: measured; joiners: from the host)
        tick(now) {
            if (!Net.isHost || !Net.isPlaying() || now - this.last < this.EVERY_MS) return;
            this.last = now;
            Net.peers.forEach((p, id) => { if (!p.loading) Net.send(id, { t: 'RTT', ts: now }); });
            const l = []; this.ms.forEach((v, id) => { if (Net.peers.has(id)) l.push([id, v]); });
            if (l.length) Net.broadcast({ t: 'PINGS', l });
        },
        got(id, ts) { const v = Math.max(0, Date.now() - ts), o = this.ms.get(id); this.ms.set(id, o === undefined ? v : Math.round(o * 0.6 + v * 0.4)); },
        text(id) { if (id === Net.hostId) return 'host'; const v = this.ms.get(id); return v === undefined ? '' : v + ' ms'; },
        reset() { this.ms.clear(); this.last = 0; }
    };

    // ---- desync check (decision 58; design §15.1) ----
    //      Every 30 s, while nothing is going on, a joiner sends fingerprints of what should be the same everywhere: the
    //      world's switches and variables, the shared wallet, and each shared object on its map (finds, plots, world
    //      objects: self switches, self variables, crop type). The host compares them with its own. A difference seen
    //      twice in a row (not just a change still on its way) is repaired from the host's copy, and logged.
    const Desync = {
        EVERY_MS: 30000, RECHECK_MS: 4000, last: 0, again: 0, map: 0, mapAt: 0, strikes: new Map(), seenAt: new Map(), repairs: 0,
        h(x) { return hash32(JSON.stringify(x)) >>> 0; },
        world() {
            const g = [], v = [];
            CFG.worldSwitches.forEach(i => { if ($gameSwitches.value(i)) g.push(i); });
            CFG.sharedVars.forEach(i => { const x = $gameVariables.value(i); if (x !== 0 && x !== '' && x != null) v.push(i + '=' + x); });
            return { g: this.h(g), v: this.h(v), gold: window.$gameParty ? $gameParty.gold() : 0 };
        },
        evHash(m, e) { const st = Spawns.selfOf(m, e); return this.h([st.ss, Object.keys(st.sv).sort().map(k => k + '=' + st.sv[k]), st.dc]); },
        /** A helper that every game runs itself on each map load (parallel pages, then only an invisible "done" page: a
         *  tint, a light, a blocker). Its self switches are each game's own, so comparing them only finds false alarms. */
        helperCache: new Map(),
        loadHelper(m, e) {
            const k = m + ',' + e;
            if (!this.helperCache.has(k)) {
                const d = window.$dataMap && $dataMap.events[e], blank = p => !p.image.characterName && !(p.image.tileId > 0);
                const done = p => blank(p) && (p.list || []).every(c => [0, 108, 408, 214].includes(c.code));
                this.helperCache.set(k, !!d && Array.isArray(d.pages) && d.pages.some(p => p.trigger === 4) && d.pages.every(p => p.trigger === 4 || done(p)));
            }
            return this.helperCache.get(k);
        },
        /** The shared objects of my map (not spawns, not anyone's own, not one in use right now, not a load helper). */
        events() {
            const m = $gameMap.mapId(), it = $gameMap._interpreter, out = [];
            ($gameMap._events || []).forEach(ev => {
                if (!ev || ev._eventId >= 1000 || ev.isSpawnEvent || !Spawns.sharedEvent(m, ev._eventId) || this.loadHelper(m, ev._eventId)) return;
                if ((it && it.isRunning() && it.eventId() === ev._eventId) || (ev._interpreter && ev._interpreter.isRunning()) || Uses.mine.has(Uses.key(m, ev._eventId))) return;
                if (out.length < 400) out.push([ev._eventId, this.evHash(m, ev._eventId)]);
            });
            return out;
        },
        quiet() {
            return !!window.$gameMap && $gameMap.mapId() > 0 && !$gameMap.isEventRunning() && !$gameMessage.isBusy() && !SceneManager.isSceneChanging() && !$gamePlayer.isTransferring()
                && !Net.rl && !Net.rs && !Object.keys(Night.barriers).length && !Night.holds.size && !Shared.pending.size && !Spawns.objDirty.size;
        },
        /** Joiner, every map frame. */
        tick(now) {
            if (Net.isHost || !Net.inWorld || !Net.isPlaying() || !window.$gameMap) return;
            if ($gameMap.mapId() !== this.map) { this.map = $gameMap.mapId(); this.mapAt = now; return; }
            if (now - this.mapAt < 5000) return;                           // just arrived: the map's own setup and sync first
            const due = (this.again && now >= this.again) || now - this.last >= this.EVERY_MS;
            if (!due || !this.quiet()) return;
            this.last = now; this.again = 0;
            Net.send(Net.hostId, Object.assign({ t: 'DSYNC', m: $gameMap.mapId(), ev: this.events() }, this.world()));
        },
        /** Host: compare a joiner's fingerprints with mine. Only while my own game is quiet too (a map loading or an event
         *  of mine changing the world means my side is the one still on its way), and a second sighting counts only when
         *  it came a few seconds after the first (two checks that waited in line while my game was busy are one look). */
        check(from, msg) {
            if (!this.quiet()) { Net.send(from, { t: 'DSYNC_AGAIN' }); return; }
            const now0 = Date.now(), seen = this.seenAt.get(from) || 0;
            if (seen && now0 - seen < this.RECHECK_MS / 2) return;
            this.seenAt.set(from, now0);
            const mine = this.world(), diff = [];
            if (msg.g !== mine.g) diff.push('g');
            if (msg.v !== mine.v) diff.push('v');
            if (msg.gold !== mine.gold) diff.push('gold');
            (msg.ev || []).forEach(([e, hh]) => { if (isInt(e, 1, 999) && hh !== this.evHash(msg.m, e)) diff.push('e' + e); });
            const prev = this.strikes.get(from) || new Set(), now = new Set(diff);
            this.strikes.set(from, now);
            if (!diff.length) return;
            const fix = diff.filter(d => prev.has(d));                     // seen twice in a row: really different
            if (fix.length) this.repair(from, msg.m, fix);
            if (fix.length < diff.length) Net.send(from, { t: 'DSYNC_AGAIN' });   // new differences: look again in a few seconds
        },
        repair(to, m, fix) {
            const list = [];
            if (fix.includes('g')) CFG.worldSwitches.forEach(i => list.push({ k: 'g', i, v: $gameSwitches.value(i) ? 1 : 0 }));
            const cant = [];   // a world value the repair can't carry would differ for good: named in the log, so it can be found
            if (fix.includes('v')) CFG.sharedVars.forEach(i => { const x = $gameVariables.value(i); const e = { k: 'v', i, v: x == null ? 0 : x }; if (Shared.valid(e)) list.push(e); else cant.push('V' + i + ' (' + (typeof x) + ')'); });
            if (cant.length) Diag.log('warn', 'desync repair: these world values can\'t be sent: ' + cant.slice(0, 20).join(', '));
            for (let i = 0; i < list.length; i += 250) Net.send(to, { t: 'FLAG_BULK', list: list.slice(i, i + 250), rep: 1 });
            if (fix.includes('gold') && window.$gameParty) Net.send(to, { t: 'GOLD', g: $gameParty.gold() });
            fix.filter(d => d[0] === 'e').forEach(d => { const e = Number(d.slice(1)); Net.send(to, { t: 'WB', by: Net.selfId, op: 'obj', m, e, st: Spawns.selfOf(m, e) }); });
            this.repairs++;
            Diag.log('warn', 'desync with ' + Net.nameOf(to) + ' repaired from the host: ' + fix.join(', ') + ' (map ' + m + ')');
        },
        reset() { this.last = 0; this.again = 0; this.strikes.clear(); this.seenAt.clear(); },
        /** A repair from the host arrived (joiner): what it changed here, for the co-op log. */
        valueOf(e) { return !e ? null : e.k === 'g' ? ($gameSwitches.value(e.i) ? 1 : 0) : e.k === 'v' ? $gameVariables.value(e.i) : null; },
        noteRepair(list, was) {
            const changed = []; list.forEach((e, i) => { if (e && (e.k === 'g' || e.k === 'v') && this.valueOf(e) !== was[i]) changed.push((e.k === 'g' ? 'S' : 'V') + e.i + ' ' + JSON.stringify(was[i]) + '->' + JSON.stringify(this.valueOf(e))); });
            if (changed.length) Diag.log('warn', 'desync repaired by the host here: ' + changed.slice(0, 40).join(', ') + (changed.length > 40 ? ' ...' : ''));
        }
    };

    /** Who is in the session, where they are and what they are doing (the Co-op panel and /list). */
    const Players = {
        place(m) {
            if (!m) return 'loading';
            if (m >= CFG.virtualBase) return 'House';
            const info = window.$dataMapInfos && $dataMapInfos[m];
            return info && info.name ? info.name.replace(/^T_/, '') : 'Map ' + m;
        },
        status(id, st) {
            const rs = Net.rs;
            if (rs && rs.kind === 'sleep' && rs.ready.includes(id)) return 'in bed';
            if (!st) return '';
            if (st.fi === 1) return 'fishing';
            if (st.hd === 1) return 'waiting for others';
            if (st.bz === 1) return 'busy';
            return '';
        },
        rows() {
            const me = { id: Net.selfId, name: (Net.isHost ? hostName(Net) : (PlayerData.actorName() || Net.name)) + ' (you)', host: Net.isHost, where: this.place(Locator.local()), status: this.status(Net.selfId, { fi: Night.fishing() ? 1 : 0, hd: Scenes.isWaiting() ? 1 : 0, bz: Night.busy() ? 1 : 0 }), ping: Net.isHost ? '' : Ping.text(Net.selfId) };
            const out = [me];
            Net.peers.forEach((p, id) => out.push({ id, name: p.name || 'a player', host: id === Net.hostId, where: p.loading ? 'joining…' : this.place(p.state && p.state.map), status: this.status(id, p.state), ping: id === Net.hostId ? '' : Ping.text(id) }));
            return out.map(r => Object.assign(r, { name: r.name + (r.host ? '  ★ host' : '') }));
        }
    };

    // ---- group sleep banner (top centre) ----
    let ritualEl = null, ritualFlash = { text: '', until: 0 }, ritualShown = '';
    function ritualBannerText(ses) {
        const rl = ses.rl, rs = ses.rs;
        const names = ids => ids.map(id => ses.nameOf(id)).join(', ');
        if (rl && rl.phase === 'ready') {
            const waitFor = rs && rs.kind === rl.kind ? rs.need.filter(id => id !== ses.selfId) : [];
            return 'Waiting for ' + (waitFor.length ? names(waitFor) : 'the others') + ' to sleep too...   [Esc] cancel';
        }
        if (rl && rl.phase === 'finishing') return 'Waiting for the others to finish...';
        if (rl && rl.phase === 'go') return '';
        if (rs && rs.kind && rs.phase === 'gather' && rs.ready.length) {
            return names(rs.ready) + (rs.ready.length === 1 ? ' wants' : ' want') + ' to sleep (' +
                rs.ready.length + '/' + (rs.ready.length + rs.need.length) + '). Use your bed to join.';
        }
        return '';
    }
    function renderRitual(ses, msg) {
        if (msg) ritualFlash = { text: msg, until: Date.now() + 4000 };
        const text = Date.now() < ritualFlash.until ? ritualFlash.text : ritualBannerText(ses);
        if (text === ritualShown) return;
        ritualShown = text;
        if (!hasDOM || typeof Sprite !== 'undefined') return;              // in the game this text is drawn under the clock (NightHud)
        if (!ritualEl) {
            ritualEl = el('div', 'position:absolute;top:30px;left:50%;transform:translateX(-50%);z-index:9500;pointer-events:none;' +
                'background:rgba(15,12,22,.85);border:1px solid #8b0000;color:#ffd27f;font:14px monospace;padding:6px 14px;max-width:80%;text-align:center;display:none;');
            document.body.appendChild(ritualEl);
        }
        ritualEl.textContent = text;
        ritualEl.style.display = text ? 'block' : 'none';
    }

    function renderTrade(ses, msg) {
        if (!hasDOM) return;
        if (tradeEl) { tradeEl.remove(); tradeEl = null; }
        const lt = ses.localTrade;
        if (!lt) { if (msg && window.$gameMessage && window.$gameMap) $gameMessage.add(msg); return; }
        const pname = (ses.peers.get(lt.partner) || {}).name || (lt.partner === ses.hostId ? ses.name : 'player');
        const kids = [el('div', 'color:#ff6b6b;font-size:16px;', 'ITEM EXCHANGE with ' + pname)];
        if (lt.phase === 'waiting') kids.push(el('div', 'margin:10px 0;', 'Waiting for response...'), btn('CANCEL', () => ses.tradeCancel()));
        else if (lt.phase === 'invited') kids.push(el('div', 'margin:10px 0;', pname + ' wants to trade.'), btn('ACCEPT', () => ses.tradeAnswer(true)), btn('DECLINE', () => ses.tradeAnswer(false)));
        else if (lt.phase === 'accepted') kids.push(el('div', 'margin:10px 0;', 'Opening trade...'));
        else {
            const fmt = l => l.length ? l.map(e => (Items.get(e.k, e.id) || {}).name + ' x' + e.n).join(', ') : '(nothing)';
            const sel = el('select', 'background:#111;color:#eee;max-width:240px;');
            ses.party.allItems().filter(Items.tradable).forEach(o => {
                const opt = el('option', null, o.name + ' (have ' + ses.party.numItems(o) + ')'); opt.value = Items.kindOf(o) + ':' + o.id; sel.appendChild(opt);
            });
            const qty = shield(el('input', 'width:50px;background:#111;color:#eee;')); qty.type = 'number'; qty.min = 1; qty.value = 1;
            kids.push(el('div', 'margin:8px 0;', 'Your offer: ' + fmt(lt.mine)), el('div', 'margin:8px 0;', 'Their offer: ' + fmt(lt.theirs)), sel, qty,
                btn('ADD', () => {
                    const [k, id] = sel.value.split(':'); const n = parseInt(qty.value, 10);
                    const next = lt.mine.filter(e => !(e.k === k && e.id === +id)).concat([{ k, id: +id, n }]);
                    if (!ses.tradeSetOffer(next)) ses.tradeUi('You do not have that many.');
                }),
                btn('CLEAR', () => ses.tradeSetOffer([])),
                el('br'),
                btn(lt.confirmed ? 'CONFIRMED - waiting' : 'CONFIRM', () => ses.tradeConfirm()),
                btn('CANCEL', () => ses.tradeCancel()));
        }
        if (msg) kids.push(el('div', 'color:#ffd27f;margin-top:8px;', msg));
        ensureUiStyle();
        tradeEl = el('div', PANEL + 'top:20%;left:25%;width:50%;', null, kids);
        tradeEl.className = 'ec-ui'; panelEvents(tradeEl);
        document.body.appendChild(tradeEl);
        function btn(label, fn) { const b = el('button', BTN, label); b.onclick = fn; return b; }
    }

    Net.ui.status = () => { updateHud(); if (lobbyEl && lobbyEl._refresh) lobbyEl._refresh(); };
    Net.ui.peers = () => updateHud();
    Net.ui.trade = renderTrade;
    Net.ui.ritual = renderRitual;
    Net.ui.chest = (ses, ok, reason) => { if (window.$gameMessage && window.$gameMap) $gameMessage.add(ok ? 'Chest updated.' : 'Chest: ' + reason); };

    // =====================================================================
    // 8b. WTE-STYLED CO-OP MENUS (design §11, decisions 32, 34–36)
    //     Built only from MZ window classes, so VisuMZ, the WTE window corners, the menu cursor,
    //     the crisp outlines and the windowskin style them exactly like the rest of the game.
    // =====================================================================
    /** All co-op UI text in one place (to be moved into game_messages.csv for translation). */
    const T = {
        title: 'Co-op', join: 'Join', host: 'Host',
        enterCode: 'Enter join code', enterAddress: 'Enter an address (IP)', otherWays: 'Other ways to join',
        onNetwork: 'Games on your network', recent: 'Recently joined', none: '(none found)',
        steamFriends: 'Steam friends hosting', steamNone: '(no friends hosting right now)', steamLooking: 'Looking for Steam friends who are hosting…', steamHosting: 'is hosting', helpCodeSteam: 'The 6-digit code the host sees (or their long Lobby ID). Friends who are hosting are listed below.', helpFriend: "Join this friend's world through Steam.",
        invited: 'Steam invite', invitedBy: '%1 invited you: join their world', invitedSomeone: 'A Steam friend invited you: join their world',
        helpInvite: 'Join the world you were invited to through Steam.',
        inviteSection: 'Invite Steam friends', inviteOverlay: "Steam's invite window", inviteOverlayHelp: "Pick friends in Steam's own invite window. They get the invite in Steam chat.",
        inviteHelp: 'Send %1 an invite in Steam chat. Accepting it starts the game (if it is closed) and joins this world.',
        inviteInWte: 'in Elderfield now', inviteFriend: 'Steam friend', inviteSent: 'invite sent', inviteFailed: 'could not send',
        inviteFull: 'This world is full.', inviteNone: '(no Steam friends found)',
        toastInvite: '%1 invited you to their co-op world. Accept it in Steam, or pick it in CO-OP > Join.',
        toastInviteMap: "%1's co-op world: save, then go back to the title screen. Co-op opens and joins it by itself.",
        toastInviteBusy: "%1 invited you to their co-op world. Leave this co-op session first to join theirs.",
        hostNew: 'Host a new world', world: 'Co-op world', empty: '(empty)', importOld: '',
        codePrompt: 'Join code (6 digits, or an internet code)', addressPrompt: 'Host address (e.g. 192.168.1.20:24680)',
        namePrompt: "Your character's name", worldPrompt: 'Name of the new world',
        tutQ: 'Play the tutorial in this world?', tutQb: 'Everyone plays it together: its scenes wait until all players are there.',
        tutTogether: 'Yes, play the tutorial together', tutSkip: 'No, skip the tutorial',
        connecting: 'Connecting…', receiving: 'Receiving the world…', busy: 'The host is busy (a cutscene or the night). You will join automatically.',
        looking: 'Looking for games on your network…', ready: 'Choose how to join, or host a world.',
        noSlot: 'All 4 co-op world slots are used. Load one, or delete one first.', cancel: 'Cancel',
        paste: 'Paste', del: 'Del', ok: 'OK',
        tabHint: 'click a tab or press Left/Right to switch Join / Host', tabHintPad: 'press %1 / %2 to switch Join / Host',
        roomFree: 'empty',
        hostThis: 'Host this world', deleteThis: 'Delete this world',
        deleteQ1: 'Delete "%1"?', deleteQ1b: 'Co-op world %1 and everyone\'s characters in it will be removed.', deleteYes: 'Yes, delete it', deleteNo: 'No, keep it',
        deleteQ2: 'Are you sure? "%1" will be gone for good.', deleteQ2b: 'This cannot be undone. Your single-player saves are not touched.',
        deleteForever: 'Delete forever', deleteKeep: 'Keep it', deleted: '"%1" was deleted.',
        updTitle: 'Co-op update available', updBuild: 'Build %1, you have %2.', updNow: 'Update now', updSkip: 'Skip this version', updOff: "Don't check for updates", updLater: 'Not now',
        updHostTitle: "The host's co-op files are different", updHostBuild: 'The host has build %1, you have %2.', updHostAsk: "Get the host's version? Join again after the restart.", updHostNow: "Update to the host's version",
        updOther: 'Other co-op files', updUnpublished: "That build isn't published, so it can't be fetched.", updNoFetch: "It couldn't be fetched (%1).", updAskHost: 'Both of you need the same co-op files: ask the host which zip they used.',
        updUnfit: 'Co-op build %1 is made for game version %2; this co-op copy has %3. Use the co-op zip made for your game version.',
        updRunning: 'Updating co-op', updFetching: 'Fetching build %1…', updFile: 'File %1 of %2…',
        updDone: 'Co-op is updated', updChanged: 'Build %1, %2 file(s) changed.', updRestartMsg: 'The game starts again now.', updQuitMsg: 'Start the game again to finish.', updRestart: 'Restart', updQuit: 'Close the game',
        updFailed: "Co-op couldn't update", updUnchanged: 'Nothing in your game was changed.',
        chooseTitle: 'Choose your character', hostedBy: 'hosted by', charsHere: 'Characters in this world', noChars: '(nobody has joined this world yet)',
        charMine: 'yours', charMineOnline: 'yours · playing in another window', charPlaying: 'playing now', charOther: "another player's",
        newChar: 'New character',
        noNew: 'This world only takes the players who already joined it',
        helpPick: 'Pick a character, or press Cancel to go back.',
        helpMine: 'Your character in this world: you continue where you left off.',
        helpOther: "This character belongs to another player. They can play it from their own PC.",
        helpReclaim: "Played %1 on another PC or game copy? Choose it: the host is asked to let you continue as %1 here.",
        asking: 'Waiting for the host to let you continue as your character…',
        helpNew: 'Choose a name, then make your look in the character creator.',
        helpNoNew: 'The host loaded a saved world. Ask the host to start a new world to add players.',
        helpCode: "Same network: the host's 6-digit code. Online: the host's internet code (XXXX-XXXX-XX).",
        helpAddress: "Hamachi (or Radmin VPN, ZeroTier): join the host's network in that app, then enter the host's IP from it (e.g. 25.12.34.56). Same network: the host's LAN IP."
    };

    /** Draws the CO-OP title button in the same style as img/titles2/Command_N (260×120: selected row, idle row). */
    const CoopTitleArt = {
        bitmap() {
            if (this._bmp) return this._bmp;
            const b = new Bitmap(260, 120);
            b.fontFace = ($gameSystem && $gameSystem.mainFontFace) ? $gameSystem.mainFontFace() : 'VCR';
            b.fontSize = 44; b.outlineColor = 'rgba(0,0,0,1)'; b.outlineWidth = 8;
            b.textColor = '#D04CE0'; b.drawText('CO-OP', 0, 4, 260, 52, 'center');
            b.textColor = '#FFFFFF'; b.drawText('CO-OP', 0, 64, 260, 52, 'center');
            this._bmp = b;
            return b;
        }
    };

    /** Promise-based helpers the session calls while joining (ses.ui.askName etc.). */
    const CoopUI = {
        /** Open a co-op scene once the previous one has really closed (a prompt right after another prompt would
         *  otherwise be pushed on top of the closing one and break the scene stack). */
        push(cls) {
            const go = () => { if (SceneManager.isSceneChanging()) return setTimeout(go, 30); SceneManager.push(cls); };
            go();
        },
        /** Run fn on the co-op menu once it is back on screen (a prompt closing rebuilds the menu scene). */
        onMenu(fn) {
            const go = () => { const sc = SceneManager._scene; if (SceneManager.isSceneChanging() || !(sc instanceof Scene_CoopMenu) || !sc.isStarted()) return setTimeout(go, 30); fn(sc); };
            go();
        },
        askName(worldName, initial) {
            return new Promise(resolve => {
                Scene_CoopInput.prepare({ mode: 'name', label: T.namePrompt + (worldName ? ' (' + worldName + ')' : ''), max: 16, initial: initial || '', onDone: v => resolve(v) });
                CoopUI.push(Scene_CoopInput);
            });
        }
    };
    Net.ui.askName = (worldName, initial) => CoopUI.askName(worldName, initial);
    Net.ui.notice = text => { if (!Chat.active() || !(window.SceneManager && SceneManager._scene instanceof Scene_Map)) Diag.toast(text, 3000); };   // in the world the chat says it (decision 84)

    /** Hosting flows (decision 24: a new world is saved at once; a loaded world only takes its existing players). */
    const CoopFlow = {
        skipTutorial: false,
        async hostNew(name, charName, tutorial) {
            const list = await CoopWorlds.list();
            const slot = CoopWorlds.freeSlot(list);
            if (!slot) throw new Error(T.noSlot);
            const world = CoopWorlds.newWorld(slot, name, CFG.maxPlayers);
            DataManager.setupNewGame();
            world.hostChar = PlayerData.setName(charName) || '';        // WTE's own new game makes the look (character creation)
            this.skipTutorial = true;                                   // decision 27 by default; the host may choose it (decision 50)
            this.withTutorial = !!tutorial; world.tutorial = !!tutorial;
            $gameSystem._coopWorldName = world.name; $gameSystem._coopTutorial = !!tutorial;
            if (!(await Net.host(world))) throw new Error(Net.error || 'Could not start hosting.');
            await CoopWorlds.save(world, 'created');
            return world;
        },
        /** The host's character name saved with a world ('' when the world was made before names were kept). */
        async hostCharOf(slot) {
            const { contents, world } = await CoopWorlds.read(slot);
            const a = contents.actors && contents.actors._data && contents.actors._data[1];
            return cleanStr(world.hostChar, 16) || cleanStr(a && String(a._name || '').trim(), 16);
        },
        async hostLoad(slot, charName) {
            const { contents, world } = await CoopWorlds.read(slot);
            // A world saved the moment it was created has no map yet (map 0): it is still a brand-new game.
            // Start it the way a new game starts (loading that half-made state leaves GAME START on a black screen).
            const unplayed = !(contents.map && contents.map._mapId > 0);
            world.allowNew = unplayed;                                  // a played world only takes players who already joined
            if (unplayed) { DataManager.setupNewGame(); this.skipTutorial = true; this.withTutorial = !!world.tutorial; $gameSystem._coopTutorial = !!world.tutorial; }   // decisions 27, 50
            else GameBridge.extract(contents);
            const cn = PlayerData.actorName() || cleanStr(world.hostChar, 16) || cleanStr(charName, 16);
            world.hostChar = PlayerData.setName(cn) || '';
            $gameSystem._coopWorldName = world.name;
            if (!(await Net.host(world))) throw new Error(Net.error || 'Could not start hosting.');
            if (!unplayed) {
                $gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y, $gamePlayer.direction(), 0);
                $gamePlayer.requestMapReload();
                LoadEvent.run('the host loading the world');               // as WTE's load screen does (decision 91)
            }
            return world;
        },
        /** The host is "busy" while it is still setting up a new game or a scene/message is running (design §10.5 BUSY). */
        hostAvailable() {
            if (typeof Scene_Map === 'undefined') return true;             // test harness: no engine
            if (!window.$gameMap || $gameMap.mapId() <= 0 || SceneManager.isSceneChanging()) return false;
            const id = $gameMap.mapId();
            if (id === 185 && Scenes.tutorialTogether()) return true;  // the opening together: come in and make your character (§7k)
            if (id === 11 || id === 185) return false;                  // GAME START / character creation of a brand-new world
            if (Night.holds.size || (Net.ritual && Net.ritual.kind === 'sleep')) return false;   // the night: join in the morning
            if (Scenes.holding && !$gameMessage.isBusy()) return true;        // a scene waiting for everyone (before its first command): come in
            if (Night.fishing() && !$gameMap._interpreter.isRunning() && !$gameMessage.isBusy()) return true;   // fishing: nobody waits for it (decision 54)
            return !$gameMap.isEventRunning() && !$gameMessage.isBusy();
        }
    };

    // Window/Scene classes need the engine; the Node test harness skips them.
    if (typeof Window_Selectable !== 'undefined' && typeof Window_HorzCommand !== 'undefined' && typeof Scene_MenuBase !== 'undefined') {
    // ---------- windows ----------
    class Window_CoopTabs extends Window_HorzCommand {
        maxCols() { return 2; }
        makeCommandList() { this.addCommand(T.join, 'join'); this.addCommand(T.host, 'host'); }
        /** With a controller: its shoulder buttons beside the tabs ("LB  Join", "Host  RB"), as named by Pads.shoulders(). */
        drawItem(index) {
            super.drawItem(index);
            const sh = this._shoulders; if (!sh) return;
            const r = this.itemLineRect(index);
            this.changeTextColor(ColorManager.textColor(8));
            this.drawText(index === 0 ? '◀ ' + sh.l : sh.r + ' ▶', r.x, r.y, r.width, index === 0 ? 'left' : 'right');
            this.resetTextColor();
        }
        setShoulders(sh) { const k = sh ? sh.l + '/' + sh.r : ''; if (k === this._shoulderKey) return false; this._shoulderKey = k; this._shoulders = sh; this.refresh(); return true; }
    }

    class Window_CoopList extends Window_Selectable {
        initialize(rect) { super.initialize(rect); this._items = []; }
        setItems(items) { const sym = this.item() && this.item().key; this._items = items; this.refresh(); const i = items.findIndex(x => x.key === sym && x.key); this.select(i >= 0 ? i : this.firstEnabled()); }
        firstEnabled() { const i = this._items.findIndex(x => x.enabled !== false && !x.header); return i < 0 ? 0 : i; }
        maxItems() { return (this._items || []).length; }
        item() { return (this._items || [])[this.index()] || null; }
        isCurrentItemEnabled() { const it = this.item(); return !!it && !it.header && it.enabled !== false; }
        drawItem(index) {
            const it = this._items[index], r = this.itemLineRect(index);
            if (!it) return;
            this.resetTextColor();
            if (it.header) { this.changeTextColor(ColorManager.systemColor()); this.drawText('— ' + it.label + ' —', r.x, r.y, r.width, 'left'); return; }
            this.changePaintOpacity(it.enabled !== false);
            this.drawText(it.label, r.x, r.y, Math.floor(r.width * 0.55), 'left');
            const cw = it.ok ? r.height : 0;                                   // room for the check at the far right
            if (it.bad) { this.changePaintOpacity(true); this.changeTextColor(ColorManager.textColor(18)); this.drawText(it.right, r.x, r.y, r.width, 'right'); }
            else if (it.right) { this.changeTextColor(ColorManager.textColor(8)); this.drawText(it.right, r.x, r.y, r.width - cw - (cw ? 6 : 0), 'right'); }
            if (it.ok) this.drawCheck(r.x + r.width - cw, r.y, cw);
            this.changePaintOpacity(true);
        }
        /** A green check mark (this host's game matches yours), drawn in a size x size box. */
        drawCheck(x, y, size) {
            const c = this.contents, col = '#5fd068', k = Math.max(2, Math.round(size / 10)), s = size * 0.7, ox = x + size * 0.15, oy = y + size * 0.15;
            for (let i = 0; i <= s * 0.35; i++) c.fillRect(Math.round(ox + i), Math.round(oy + s * 0.5 + i), k, k, col);           // the short stroke, down
            for (let i = 0; i <= s * 0.65; i++) c.fillRect(Math.round(ox + s * 0.35 + i), Math.round(oy + s * 0.85 - i * 1.25), k, k, col);   // the long stroke, up
        }
        // headers are not selectable stops
        cursorDown(wrap) { super.cursorDown(wrap); this.skipHeaders(1); }
        cursorUp(wrap) { super.cursorUp(wrap); this.skipHeaders(-1); }
        skipHeaders(dir) { let n = 0; while (this.item() && this.item().header && n++ < this.maxItems()) this.select((this.index() + dir + this.maxItems()) % this.maxItems()); }
    }

    class Window_CoopStatus extends Window_Base {
        setText(text, color) { if (text === this._text && color === this._color) return; this._text = text; this._color = color; this.refresh(); }
        refresh() {
            this.contents.clear();
            this.changeTextColor(ColorManager.textColor(this._color || 0));
            const lines = wrapText(this, String(this._text || ''), this.innerWidth);
            lines.slice(0, 3).forEach((l, i) => this.drawText(l, 0, i * this.lineHeight(), this.innerWidth, 'left'));
        }
    }
    /** Word-wrap text to a window's width using that window's font. */
    function wrapText(win, text, width) {
        const out = []; let line = '';
        String(text).split(' ').forEach(w => { const t = line ? line + ' ' + w : w; if (win.textWidth(t) > width && line) { out.push(line); line = w; } else line = t; });
        if (line) out.push(line);
        return out;
    }

    /** A small question over the co-op menu: a title line, a detail line, then the choices (WTE window style). */
    class Window_CoopAsk extends Window_Command {
        setup(lines, choices) { this._lines = lines; this._choices = choices; this.refresh(); this.select(0); this.open(); this.activate(); }
        headerHeight() { return (this._lines ? this._lines.length : 0) * this.lineHeight() + 10; }
        makeCommandList() { (this._choices || []).forEach(c => this.addCommand(c.label, c.key)); }
        itemRect(index) { const r = super.itemRect(index); r.y += this.headerHeight(); return r; }
        refresh() {
            super.refresh();
            (this._lines || []).forEach((l, i) => {
                this.changeTextColor(i === 0 ? ColorManager.systemColor() : ColorManager.normalColor());
                this.drawText(l, 0, i * this.lineHeight(), this.innerWidth, 'center');
            });
            this.resetTextColor();
        }
        drawItem(index) { const r = this.itemLineRect(index); this.changePaintOpacity(true); this.drawText(this.commandName(index), r.x, r.y, r.width, 'center'); }
    }
    window.Window_CoopAsk = Window_CoopAsk;   // the updater's window (27_9c) asks with it too

    // ---------- Co-op menu scene ----------
    class Scene_CoopMenu extends Scene_MenuBase {
        create() {
            super.create();
            const ww = Math.min(Graphics.boxWidth, 1000), wx = (Graphics.boxWidth - ww) / 2;
            const tabH = this.calcWindowHeight(1, true), statH = this.calcWindowHeight(2, false);
            const top = Math.max(this.mainAreaTop(), 40);
            this._tabs = new Window_CoopTabs(new Rectangle(wx, top, ww, tabH));
            this._tabs.setHandler('join', this.onTab.bind(this));
            this._tabs.setHandler('host', this.onTab.bind(this));
            this._tabs.setHandler('cancel', this.onCancel.bind(this));
            this.addWindow(this._tabs);
            const listY = top + tabH, listH = Graphics.boxHeight - listY - statH - 20;
            this._list = new Window_CoopList(new Rectangle(wx, listY, ww, listH));
            this._list.setHandler('ok', this.onPick.bind(this));
            this._list.setHandler('cancel', this.onListCancel.bind(this));
            this.addWindow(this._list);
            this._status = new Window_CoopStatus(new Rectangle(wx, listY + listH, ww, statH));
            this.addWindow(this._status);
            this._lan = []; this._recent = []; this._worlds = []; this._scan = 0; this._friends = []; this._friendsAt = 0;
            this._tab = Scene_CoopMenu.lastTab || 'join';
            this._tabs.selectSymbol(this._tab);
            this._tabs.deactivate(); this._list.activate();
            this.refreshLists();
        }
        start() { super.start(); this.loadData(); }
        async loadData() {
            try { this._recent = await Identity.recent(); this._worlds = await CoopWorlds.list(); }
            catch (e) { Diag.err('co-op menu data', e); }
            this.refreshLists();
        }
        /** Before joining (user 2026-11-02): does this host's game match yours? Your mods (your game's own list) against the
         *  ones the host announces, and the game version. { ok } when all is well (a green check), { bad, help } when not
         *  (the line says what, and you can't pick it), null when the host's co-op is older and doesn't say (checked on joining). */
        fit(mods, gv) {
            if (gv && gameVersion() && gv !== gameVersion()) return { bad: 'other game version', help: 'This host plays game version ' + gv + ' and you have ' + gameVersion() + '. You both need the same version to share a world.' };
            if (!Array.isArray(mods)) return null;
            const d = Mods.diff(mods);
            return d ? { bad: Mods.short(d), help: Mods.reason(d, false) } : { ok: true };
        }
        refreshLists() {
            const items = [];
            if (this._tab === 'join') {
                const steam = CFG.transport === 'steam';                     // Steam: a code or a friend; no IP addresses
                items.push({ key: 'code', kind: 'code', label: T.enterCode, help: steam ? T.helpCodeSteam : T.helpCode });
                if (!steam) { items.push({ header: true, label: T.otherWays }); items.push({ key: 'address', kind: 'address', label: T.enterAddress, help: T.helpAddress }); }
                const inv = steam && SteamInvites.current();                   // an invite through Steam: at the top
                if (inv) { items.unshift({ key: 'inv' + inv.lobby, kind: 'target', target: inv.lobby, label: inv.name ? T.invitedBy.replace('%1', inv.name) : T.invitedSomeone, help: T.helpInvite }, { header: true, label: T.otherWays });
                           items.unshift({ header: true, label: T.invited }); }
                if (CFG.transport === 'steam') {                              // friends in WTE who are hosting, by their Steam names
                    items.push({ header: true, label: T.steamFriends });
                    if (!this._friends.length) items.push({ key: 'fr-none', label: T.steamNone, enabled: false });
                    this._friends.forEach(f => { const fit = this.fit(f.mods, '');
                        items.push({ key: 'fr' + f.id, kind: 'target', target: f.lobby, label: f.name + ' ' + T.steamHosting + (f.world ? ': ' + f.world : ''), right: fit && fit.bad ? fit.bad : f.code ? 'code ' + f.code : 'Steam',
                                     help: fit && fit.bad ? fit.help : T.helpFriend, enabled: !(fit && fit.bad), bad: !!(fit && fit.bad), ok: !!(fit && fit.ok) }); });
                }
                if (CFG.transport === 'p2p') items.push({ header: true, label: T.onNetwork });
                if (CFG.transport === 'p2p' && !this._lan.length) items.push({ key: 'lan-none', label: T.none, enabled: false });
                this._lan.forEach(h => { const fit = this.fit(h.info.mods, h.info.gv);
                    items.push({ key: 'lan' + h.address + h.port, kind: 'target', target: h.address + ':' + h.port,
                        label: (h.info.world || 'Elderfield') + '  (host ' + (h.info.host || '?') + ')', right: fit && fit.bad ? fit.bad : h.info.players + '/' + h.info.max + '  ' + h.info.code,
                        help: fit && fit.bad ? fit.help : undefined, enabled: h.info.players < h.info.max && !(fit && fit.bad), bad: !!(fit && fit.bad), ok: !!(fit && fit.ok) }); });
                const rec = steam ? [] : this._recent.filter(r => r.address);
                if (!steam) items.push({ header: true, label: T.recent });
                if (!steam && !rec.length) items.push({ key: 'rec-none', label: T.none, enabled: false });
                rec.slice(0, 5).forEach(r => items.push({ key: 'rec' + r.worldId, kind: 'target', target: r.address, label: (r.worldName || 'World') + '  as ' + (r.name || '?'), right: r.address }));
            } else {
                const free = CoopWorlds.freeSlot(this._worlds);
                items.push({ key: 'new', kind: 'new', label: T.hostNew, enabled: !!free });
                this._worlds.forEach(w => {
                    const i = w.info;
                    items.push(w.exists
                        ? { key: 'w' + w.slot, kind: 'world', slot: w.slot, label: T.world + ' ' + w.slot + ': ' + ((i && i.name) || '?'), right: i ? ('day ' + (i.day || 0) + ' · ' + (i.players || 1) + ' players · ' + (i.playtime || '')) : '' }
                        : { key: 'w' + w.slot, label: T.world + ' ' + w.slot + ': ' + T.empty, enabled: false });
                });
            }
            this._list.setItems(items);
            this.updateStatus();
        }
        updateStatus() {
            if (this._busyText) return this._status.setText(this._busyText, 0);
            if (Net.state === S.ERROR) return this._status.setText(Net.error, 18);
            const sh = this._tabs && this._tabs._shoulders, hint = '   (' + (sh ? T.tabHintPad.replace('%1', sh.l).replace('%2', sh.r) : T.tabHint) + ')', it = this._list && this._list.item();
            if (it && it.help && !this._joining) return this._status.setText(it.help, 0);   // what the selected line is for (decision 81)
            this._status.setText((this._tab === 'join' ? (CFG.transport === 'steam' ? (this._friends.length ? T.ready : T.steamLooking) : this._lan.length ? T.ready : T.looking) : T.ready) + hint, 0);
        }
        update() {
            super.update();
            const at = this._list ? this._list.index() : -1;                 // the selection moved: its help
            if (at !== this._helpAt) { this._helpAt = at; if (!this._busyText && Net.state !== S.ERROR) this.updateStatus(); }
            if (!this._padAt || Date.now() - this._padAt > 500) {          // a controller plugged in or out: its button names by the tabs
                this._padAt = Date.now();
                if (this._tabs.setShoulders(Pads.shoulders()) && !this._busyText && Net.state !== S.ERROR) this.updateStatus();
            }
            // keep the "games on your network" list fresh while the Join tab is open
            // (Steam connects by code: no network scan, so no firewall question on a PC new to the game)
            if (this._tab === 'join' && CFG.transport === 'p2p' && !this._scanning && Date.now() - this._scan > 3000 && !this._joining) {
                this._scanning = true; this._scan = Date.now();
                Discovery.find('*', 1500).then(list => { this._scanning = false; this._lan = list; if (this._tab === 'join' && !this._joining) this.refreshLists(); })
                    .catch(() => { this._scanning = false; });
            }
            // Steam: friends in WTE who are hosting, every few seconds while the Join tab is open
            if (this._tab === 'join' && CFG.transport === 'steam' && !this._joining && Date.now() - this._friendsAt > 4000) {
                this._friendsAt = Date.now(); const list = SteamFriends.hosting(), key = JSON.stringify(list.map(f => f.id + f.lobby));
                if (key !== this._friendsKey) { this._friendsKey = key; this._friends = list; this.refreshLists(); }
            }
            if (this._invStamp !== SteamInvites.stamp) { this._invStamp = SteamInvites.stamp; if (!this._joining) this.refreshLists(); }
            if (this._joining) { this.updateJoining(); return; }
            if (this._ask && this._ask.isOpen()) return;                 // a question is open: tabs wait
            this.updateTabInput();
        }
        /** Ask a question over the menu. choices: [{key, label}]; Cancel answers the LAST choice (always the safe one). */
        ask(lines, choices, onAnswer) {
            if (!this._ask) {
                this._ask = new Window_CoopAsk(new Rectangle(0, 0, 10, 10));
                this.addWindow(this._ask);
            }
            const w = Math.min(Graphics.boxWidth - 40, 860), lh = this._ask.lineHeight();
            const h = (lines.length + choices.length) * lh + 10 + this._ask.padding * 2 + 8;
            this._ask.move((Graphics.boxWidth - w) / 2, (Graphics.boxHeight - h) / 2, w, h);
            this._ask.createContents();
            const done = key => { this._ask.close(); this._ask.deactivate(); this._list.activate(); onAnswer(key); };
            this._ask.clearCommandList && this._ask.clearCommandList();
            choices.forEach(c => this._ask.setHandler(c.key, () => done(c.key)));
            this._ask.setHandler('cancel', () => { SoundManager.playCancel(); done(choices[choices.length - 1].key); });
            this._list.deactivate();
            this._ask.setup(lines, choices);
            this._ask.select(choices.length - 1);                        // the safe answer is selected first
        }
        /** Host tab: a co-op world was picked → Host / Delete / Cancel; deleting asks twice, naming the world. */
        worldMenu(it) {
            const w = this._worlds.find(x => x.slot === it.slot), info = (w && w.info) || {}, name = info.name || ('Co-op world ' + it.slot);
            const detail = T.world + ' ' + it.slot + ' · day ' + (info.day || 0) + ' · ' + (info.players || 1) + ' players';
            this.ask(['"' + name + '"', detail], [{ key: 'host', label: T.hostThis }, { key: 'delete', label: T.deleteThis }, { key: 'cancel', label: T.cancel }], a => {
                if (a === 'host') return this.askHostName(it.slot, cn => this.host(() => CoopFlow.hostLoad(it.slot, cn)));
                if (a !== 'delete') return;
                this.ask([T.deleteQ1.replace('%1', name), T.deleteQ1b.replace('%1', String(it.slot))], [{ key: 'yes', label: T.deleteYes }, { key: 'no', label: T.deleteNo }], a2 => {
                    if (a2 !== 'yes') return;
                    this.ask([T.deleteQ2.replace('%1', name), T.deleteQ2b], [{ key: 'yes', label: T.deleteForever }, { key: 'no', label: T.deleteKeep }], a3 => {
                        if (a3 !== 'yes') return;
                        CoopWorlds.remove(it.slot)
                            .then(() => { SoundManager.playOk(); this._status.setText(T.deleted.replace('%1', name), 0); this.loadData(); })
                            .catch(e => { SoundManager.playBuzzer(); this._status.setText(String(e.message || e), 18); });
                    });
                });
            });
        }
        /** Tabs can be changed by clicking them, Left/Right or the page keys while the list is active,
         *  or by Left/Right on the tab bar itself (reached with Cancel from the list). */
        updateTabInput() {
            if (TouchInput.isClicked() && this._tabs.isOpen()) {
                const i = this._tabs.hitIndex();
                if (i >= 0) { const sym = this._tabs.commandSymbol(i); if (sym && sym !== this._tab) this.setTab(sym, true); else SoundManager.playCursor(); this._tabs.deactivate(); this._list.activate(); return; }
            }
            if (this._tabs.active) {                                    // the tab bar handles Left/Right itself: follow its cursor
                if (Input.isTriggered('pageup') || Input.isTriggered('pagedown')) { this._tabs.selectSymbol(Input.isTriggered('pageup') ? 'join' : 'host'); SoundManager.playCursor(); }
                const sym = this._tabs.currentSymbol();
                if (sym && sym !== this._tab) this.setTab(sym, false);
                return;
            }
            // left tab / right tab (the shoulder buttons, page keys or Left/Right), never a toggle: a button mapped twice
            // (WTE's rebinding) can't switch there and back in one press
            const toJoin = Input.isTriggered('pageup') || Input.isTriggered('left'), toHost = Input.isTriggered('pagedown') || Input.isTriggered('right');
            if (toJoin !== toHost) { const sym = toJoin ? 'join' : 'host'; if (sym !== this._tab) this.setTab(sym, true); else SoundManager.playCursor(); }
        }
        setTab(sym, sound) {
            this._tab = sym; Scene_CoopMenu.lastTab = sym;
            this._tabs.selectSymbol(sym);
            if (sound) SoundManager.playCursor();
            this.refreshLists();
        }
        switchTab() { this.setTab(this._tab === 'join' ? 'host' : 'join', true); }
        onTab() { this.setTab(this._tabs.currentSymbol(), false); this._tabs.deactivate(); this._list.activate(); }
        onListCancel() { if (this._joining) { this.cancelJoin(); return; } this._list.deactivate(); this._tabs.activate(); }   // up to the tab bar
        onCancel() { this.popScene(); }
        onPick() {
            const it = this._list.item();
            if (!it) return this._list.activate();
            if (it.kind === 'code') return this.input('code', T.codePrompt, 20, v => v && this.join(v));
            if (it.kind === 'address') return this.input('address', T.addressPrompt, 40, v => v && this.join(v));
            if (it.kind === 'target') return this.join(it.target);
            if (it.kind === 'new') return this.input('name', T.worldPrompt, 30, v => v && this.askHostName(null, cn =>
                CoopUI.onMenu(m => m.ask([T.tutQ, T.tutQb], [{ key: 'together', label: T.tutTogether }, { key: 'skip', label: T.tutSkip }], a => m.host(() => CoopFlow.hostNew(v, cn, a === 'together'))))));
            if (it.kind === 'world') return this.worldMenu(it);
            this._list.activate();
        }
        input(mode, label, max, onDone, initial) {
            Scene_CoopInput.prepare({ mode, label, max, initial, onDone: v => { onDone(v); } });
            CoopUI.push(Scene_CoopInput);
        }
        /** The host's character name: asked for a new world (and for a world saved before names were kept). */
        askHostName(slot, then) {
            (slot ? CoopFlow.hostCharOf(slot) : Promise.resolve('')).then(async known => {
                if (known) return then(known);
                const prof = await Profile.load();
                this.input('name', T.namePrompt, 16, v => { v = cleanStr(v, 16); if (v) then(v); else this._list.activate(); }, prof ? prof.name : '');
            }).catch(e => { this._status.setText(String(e.message || e), 18); this._list.activate(); });
        }
        // ---- joining ----
        join(target) {
            if (Net.state === S.ERROR) Net.leave();
            this._joining = true; this._busyText = T.connecting; this.updateStatus();
            Net.name = Net.name || 'Player';
            Net.join(target).then(ok => { if (!ok && Net.state !== S.SYNCHRONIZING) this.joinEnded(); });
        }
        updateJoining() {
            if (Net.state === S.ERROR || Net.state === S.MENU) return this.joinEnded();
            const ctx = Net.joinCtx;
            this._busyText = Net.askWait ? T.asking : Net.busyWait ? T.busy : (ctx && ctx.stage === 'xfer' && ctx.rx) ? T.receiving + ' ' + Math.floor(100 * ctx.rx.got / ctx.rx.n) + '%' : T.connecting;
            this.updateStatus();
            if (!this._list.active) this._list.activate();
        }
        cancelJoin() { Net.leave(); this.joinEnded(); }
        joinEnded() { this._joining = false; this._busyText = ''; this.updateStatus(); this._list.activate(); }
        // ---- hosting ----
        host(start) {
            this._busyText = T.connecting; this.updateStatus();
            start().then(() => { this._busyText = ''; this.fadeOutAll(); SceneManager.goto(Scene_Map); })
                .catch(e => { Diag.err('host', e); if (Net.state !== S.MENU) Net.leave(); this._busyText = ''; this._status.setText(String(e.message || e), 18); this._list.activate(); this.loadData(); });
        }
    }
    window.Scene_CoopMenu = Scene_CoopMenu;

    // ---------- text entry scene (keyboard, paste, and an on-screen grid for mouse/gamepad) ----------
    class Window_CoopEdit extends Window_Base {
        setup(o) { this._label = o.label; this._max = o.max; this._text = o.initial || ''; this.refresh(); }
        refresh() {
            this.contents.clear();
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(this._label, 0, 0, this.innerWidth, 'left');
            this.resetTextColor();
            const shown = this._text + (this._text.length < this._max ? '_' : '');
            this.drawText(shown, 0, this.lineHeight() + 6, this.innerWidth, 'left');
        }
        add(ch) { if (this._text.length < this._max) { this._text += ch; this.refresh(); return true; } return false; }
        back() { if (this._text.length) { this._text = this._text.slice(0, -1); this.refresh(); return true; } return false; }
        text() { return this._text; }
    }
    class Window_CoopKeys extends Window_Selectable {
        setup(chars) { this._keys = chars.split('').concat([T.paste, T.del, T.ok]); this.refresh(); this.select(0); }
        maxCols() { return 13; }
        maxItems() { return this._keys ? this._keys.length : 0; }
        key() { return this._keys[this.index()]; }
        drawItem(i) { const r = this.itemLineRect(i); this.drawText(this._keys[i] === ' ' ? '␣' : this._keys[i], r.x, r.y, r.width, 'center'); }
    }
    class Scene_CoopInput extends Scene_MenuBase {
        static prepare(o) { Scene_CoopInput._opts = o; }
        create() {
            super.create();
            const o = this._opts = Scene_CoopInput._opts || { mode: 'code', label: '', max: 14, onDone: () => {} };
            const ww = Math.min(Graphics.boxWidth, 900), wx = (Graphics.boxWidth - ww) / 2;
            const eh = this.calcWindowHeight(2, false) + 10, y = Math.floor(Graphics.boxHeight / 2) - 160;
            this._edit = new Window_CoopEdit(new Rectangle(wx, y, ww, eh));
            this._edit.setup({ label: o.label, max: o.max, initial: o.initial });
            this.addWindow(this._edit);
            this._chars = o.mode === 'name' ? "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 -'." : '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ.:-';
            this._keys = new Window_CoopKeys(new Rectangle(wx, y + eh, ww, this.calcWindowHeight(o.mode === 'name' ? 6 : 4, true)));
            this._keys.setup(this._chars);
            this._keys.setHandler('ok', this.onKey.bind(this));
            this._keys.setHandler('cancel', () => this.finish(null));
            this.addWindow(this._keys);
            this._keys.activate();
            this._onKey = this.onKeyboard.bind(this);
            window.addEventListener('keydown', this._onKey, true);       // capture: typed letters must not reach the game's own key handling
        }
        terminate() { super.terminate(); window.removeEventListener('keydown', this._onKey, true); }
        onKeyboard(e) {
            if (e.ctrlKey && (e.key === 'v' || e.key === 'V')) { this.paste(); e.preventDefault(); e.stopPropagation(); return; }
            if (e.key === 'Enter') { this.finish(this._edit.text()); e.preventDefault(); e.stopPropagation(); return; }
            if (e.key === 'Escape') { this.finish(null); e.preventDefault(); e.stopPropagation(); return; }
            if (e.key === 'Backspace') { if (this._edit.back()) SoundManager.playCancel(); e.preventDefault(); e.stopPropagation(); return; }
            if (e.key.length === 1 && !e.ctrlKey && !e.altKey) {
                const ch = this._opts.mode === 'name' ? e.key : e.key.toUpperCase();
                if (this._chars.includes(ch) && this._edit.add(ch)) SoundManager.playCursor();
                e.preventDefault(); e.stopPropagation();                 // swallow letters even if not allowed (Z/X must not act as OK/Cancel)
            }
        }
        onKey() {
            const k = this._keys.key();
            if (k === T.ok) return this.finish(this._edit.text());
            if (k === T.del) this._edit.back();
            else if (k === T.paste) this.paste();
            else this._edit.add(k);
            this._keys.activate();
        }
        paste() {
            let text = '';
            try { text = (typeof nw !== 'undefined' && nw.Clipboard) ? nw.Clipboard.get().get('text') : ''; } catch (e) { /* no clipboard */ }
            String(text || '').trim().split('').forEach(ch => { const c = this._opts.mode === 'name' ? ch : ch.toUpperCase(); if (this._chars.includes(c)) this._edit.add(c); });
            SoundManager.playOk();
        }
        finish(value) {
            const done = this._opts.onDone; this._opts.onDone = () => {};
            if (value !== null) SoundManager.playOk(); else SoundManager.playCancel();
            this.popScene();
            const v = value === null ? null : String(value).trim();
            setTimeout(() => done(v ? v : null), 0);
        }
    }
    window.Scene_CoopInput = Scene_CoopInput;

    // ---------- character select when joining (Stardew's farmhand list, A11: R8/R17) ----------
    class Window_CoopHeader extends Window_Base {
        setup(title, sub) {
            this.contents.clear();
            this.changeTextColor(ColorManager.systemColor()); this.drawText(title, 0, 0, this.innerWidth, 'center');
            this.resetTextColor(); this.drawText(sub, 0, this.lineHeight(), this.innerWidth, 'center');
        }
    }
    class Scene_CoopCharacters extends Scene_MenuBase {
        static prepare(o) { Scene_CoopCharacters._opts = o; }
        create() {
            super.create();
            const o = this._opts = Scene_CoopCharacters._opts;
            const ww = Math.min(Graphics.boxWidth, 900), wx = (Graphics.boxWidth - ww) / 2;
            const headH = this.calcWindowHeight(2, false), statH = this.calcWindowHeight(2, false);
            const top = Math.max(this.mainAreaTop(), 40), listH = Math.min(this.calcWindowHeight(8, true), Graphics.boxHeight - top - headH - statH - 20);
            this._head = new Window_CoopHeader(new Rectangle(wx, top, ww, headH));
            this._head.setup(T.chooseTitle, (o.worldName || 'Elderfield') + (o.host ? '   ·   ' + T.hostedBy + ' ' + o.host : ''));
            this.addWindow(this._head);
            this._list = new Window_CoopList(new Rectangle(wx, top + headH, ww, listH));
            this._list.setHandler('ok', this.onPick.bind(this));
            this._list.setHandler('cancel', () => this.finish(null));
            this.addWindow(this._list);
            this._status = new Window_CoopStatus(new Rectangle(wx, top + headH + listH, ww, statH));
            this.addWindow(this._status);
            const items = [{ header: true, label: T.charsHere }];
            if (!o.chars.length) items.push({ key: 'none', label: T.noChars, enabled: false });
            o.chars.forEach(c => items.push({ key: 'c' + c.slot, kind: c.mine ? 'claim' : c.online ? null : 'reclaim', slot: c.slot, label: c.name,
                right: c.mine ? (c.online ? T.charMineOnline : T.charMine) : (c.online ? T.charPlaying : T.charOther),
                enabled: c.mine || !c.online, help: c.mine ? T.helpMine : c.online ? T.helpOther : T.helpReclaim.split('%1').join(c.name) }));
            items.push({ header: true, label: T.newChar });
            if (!o.allowNew) items.push({ key: 'nonew', label: T.noNew, enabled: false, help: T.helpNoNew });
            else items.push({ key: 'nn', kind: 'new', label: T.newChar, help: T.helpNew });
            this._list.setItems(items);
            this._list.activate();
        }
        update() {
            super.update();
            const it = this._list.item();
            this._status.setText((it && it.help) || T.helpPick, 0);
        }
        onPick() {
            const it = this._list.item();
            if (!it || !it.kind) return this._list.activate();
            if (it.kind === 'claim') return this.finish({ kind: 'claim' });
            if (it.kind === 'reclaim') return this.finish({ kind: 'reclaim', slot: it.slot });
            this.finish({ kind: 'new' });
        }
        finish(choice) {
            const done = this._opts.onDone; this._opts.onDone = () => {};
            if (!choice) SoundManager.playCancel();
            this.popScene();
            setTimeout(() => done(choice), 0);
        }
    }
    window.Scene_CoopCharacters = Scene_CoopCharacters;

    /** In game, F9: who is playing, where they are and what they are doing; how others join; leave (decision 57). */
    class Scene_CoopPanel extends Scene_MenuBase {
        create() {
            super.create();
            const ww = Math.min(Graphics.boxWidth - 48, 900), wx = (Graphics.boxWidth - ww) / 2;
            const headH = this.calcWindowHeight(2, false), statH = this.calcWindowHeight(2, false);
            const top = Math.max(this.mainAreaTop(), 40), listH = Math.min(this.calcWindowHeight(10, true), Graphics.boxHeight - top - headH - statH - 20);
            this._head = new Window_CoopHeader(new Rectangle(wx, top, ww, headH));
            this.addWindow(this._head);
            this._list = new Window_CoopList(new Rectangle(wx, top + headH, ww, listH));
            this._list.setHandler('ok', this.onOk.bind(this));
            this._list.setHandler('cancel', this.popScene.bind(this));
            this.addWindow(this._list);
            this._status = new Window_CoopStatus(new Rectangle(wx, top + headH + listH, ww, statH));
            this.addWindow(this._status);
            this._ask = new Window_CoopAsk(new Rectangle(wx + ww / 4, top + headH, ww / 2, this.calcWindowHeight(4, true)));
            this._ask.setHandler('yes', () => { this._ask.close(); this._ask.deactivate(); Net.leave(); if (typeof Scene_Title !== 'undefined') SceneManager.goto(Scene_Title); });
            this._ask.setHandler('no', () => { this._ask.close(); this._ask.deactivate(); this._list.activate(); });
            this._ask.setHandler('cancel', () => { this._ask.close(); this._ask.deactivate(); this._list.activate(); });
            this._ask.close(); this._ask.deactivate();
            this.addWindow(this._ask);
            this.fill(); this._list.activate();
        }
        fill() {
            if (!Net.isPlaying()) return;
            const rows = Players.rows();
            this._head.setup('Co-op', ((Net.isHost ? Net.world && Net.world.name : Net.joinCtx && Net.joinCtx.worldName) || 'Elderfield') + '   ·   ' + rows.length + (rows.length === 1 ? ' player' : ' players') +
                (Net.isHost ? '   ·   you host, code ' + Net.code : '   ·   hosted by ' + Net.nameOf(Net.hostId)));
            const items = [{ header: true, label: 'Players' }];
            rows.forEach(r => items.push({ key: 'p' + r.id, label: r.name, right: r.where + (r.status ? ' · ' + r.status : '') + (r.ping ? ' · ' + r.ping : ''), help: 'Chat with everyone: press ' + Chat.keyName() + ' on the map.' }));
            if (SteamInvites.hostLobby()) {                                 // the host, over Steam: invite friends (user, 2026-11-04)
                items.push({ header: true, label: T.inviteSection });
                const full = Net.playerCount() >= CFG.maxPlayers;
                if (SteamInvites.overlay()) items.push({ key: 'inv-overlay', label: T.inviteOverlay, help: full ? T.inviteFull : T.inviteOverlayHelp, enabled: !full });
                if (!this._friends || Date.now() - this._friendsAt > 5000) { this._friendsAt = Date.now(); this._friends = SteamFriends.all(); }
                const inGame = new Set(Array.from(Net.peers.keys()).map(String));
                const list = this._friends.filter(f => !inGame.has(f.id)).slice(0, 100);
                if (!list.length) items.push({ key: 'inv-none', label: T.inviteNone, enabled: false });
                this._sent = this._sent || {};
                list.forEach(f => items.push({ key: 'inv' + f.id, friend: f.id, label: f.name, right: this._sent[f.id] || (f.inWte ? T.inviteInWte : T.inviteFriend), help: full ? T.inviteFull : T.inviteHelp.replace('%1', f.name), enabled: !full }));
            }
            items.push({ header: true, label: 'Session' });
            items.push({ key: 'chat', label: 'Chat', right: Chat.keyName() + ' on the map', help: 'Press ' + Chat.keyName() + ' on the map to type (change it in Options -> Button Config). /list shows who is where.' });
            if (!Net.isHost) items.push({ key: 'leave', label: 'Leave the session', help: 'Your character and progress are kept by the host. You can join again any time.' });
            items.push({ key: 'close', label: 'Close', help: '' });
            this._key = JSON.stringify(items.map(i => [i.key, i.label, i.right]));
            this._list.setItems(items);
        }
        update() {
            super.update();
            if (!Net.isPlaying()) return this.popScene();
            if (Date.now() - (this._at || 0) > 1000) { this._at = Date.now(); const before = this._key; const idx = this._list.index(); this.fill(); if (before !== this._key) this._list.select(Math.min(idx, this._list.maxItems() - 1)); }
            const it = this._list.item();
            this._status.setText((it && it.help) || (Net.isHost ? hostShareText(Net) : 'Connected to ' + Net.nameOf(Net.hostId) + "'s world."), 0);
        }
        onOk() {
            const it = this._list.item();
            if (it && it.key === 'leave') { this._ask.setup(['Leave the session?', 'Your progress is kept by the host.'], [{ label: 'Leave', key: 'yes' }, { label: 'Stay', key: 'no' }]); return; }
            if (it && (it.key === 'close' || it.key === 'chat')) return this.popScene();
            if (it && it.key === 'inv-overlay') { if (SteamInvites.openOverlay()) SoundManager.playOk(); else SoundManager.playBuzzer(); }
            if (it && it.friend) {
                const ok = SteamInvites.invite(it.friend);
                this._sent = this._sent || {}; this._sent[it.friend] = ok ? T.inviteSent : T.inviteFailed;
                if (ok) SoundManager.playOk(); else SoundManager.playBuzzer();
                Diag.log('info', 'Steam invite to ' + it.friend + (ok ? ' sent' : ' failed'));
                this.fill();
            }
            this._list.activate();
        }
    }
    window.Scene_CoopPanel = Scene_CoopPanel;
    CoopUI.chooseCharacter = o => new Promise(resolve => {
        Scene_CoopCharacters.prepare(Object.assign({}, o, { onDone: resolve }));
        CoopUI.push(Scene_CoopCharacters);
    });
    Net.ui.chooseCharacter = o => CoopUI.chooseCharacter(o);

    // ---------- title screen: CO-OP command + "host closed the connection" notice ----------
    if (typeof Window_TitleCommand !== 'undefined') {
        const _makeTitle = Window_TitleCommand.prototype.makeCommandList;
        Window_TitleCommand.prototype.makeCommandList = function () {
            _makeTitle.call(this);
            if (CFG.transport === 'relay' || this._list.some(c => c.symbol === 'coop')) return;   // the direct connection and Steam (user, 2026-11-01)
            const at = Math.max(0, this._list.findIndex(c => c.symbol === 'newGame')) + 1;
            this._list.splice(at, 0, { name: T.title.toUpperCase(), symbol: 'coop', enabled: true, ext: null, mogOriginalIndex: 'coop' });
        };
    }
    if (typeof Moghunter !== 'undefined' && Moghunter.title_com_pos) Moghunter.title_com_pos.coop = CFG.coopTitlePos;
    if (typeof Scene_Title !== 'undefined' && Scene_Title.prototype.moveSpatialIndex) {
        const _moveSpatial = Scene_Title.prototype.moveSpatialIndex;
        Scene_Title.prototype.moveSpatialIndex = function (dir) {
            const w = this._commandWindow;
            const to = w && w._list ? TitlePad.target(dir, w._index, w._list, this._TpictureCom) : null;
            if (to === null) return _moveSpatial.apply(this, arguments);
            if (to >= 0 && to !== w._index) { SoundManager.playCursor(); w._index = to; }
        };
    }
    if (typeof TpictureCom !== 'undefined') {
        const _prep = TpictureCom.prototype.prepareBitmap;
        TpictureCom.prototype.prepareBitmap = function () {
            if (this._originalIndex === 'coop') { this.bitmap = CoopTitleArt.bitmap(); return; }
            _prep.call(this);
        };
    }
    class Window_CoopNotice extends Window_Base {
        show(text) {
            this._text = text; this.contents.clear();
            this.changeTextColor(ColorManager.textColor(17)); this.drawText(T.title, 0, 0, this.innerWidth, 'center');
            this.resetTextColor();
            wrapText(this, text, this.innerWidth).slice(0, 3).forEach((l, i) => this.drawText(l, 0, (i + 1) * this.lineHeight() + 4, this.innerWidth, 'center'));
            this.changeTextColor(ColorManager.textColor(8)); this.drawText('OK', 0, 4 * this.lineHeight() + 8, this.innerWidth, 'center');
            this.open();
        }
    }
    if (typeof Scene_Title !== 'undefined') {
        const _titleCmd = Scene_Title.prototype.createCommandWindow;
        Scene_Title.prototype.createCommandWindow = function () {
            _titleCmd.call(this);
            this._commandWindow.setHandler('coop', () => { this._commandWindow.close(); openLobby('title command'); });
        };
        const _titleStart = Scene_Title.prototype.start;
        Scene_Title.prototype.start = function () {
            _titleStart.call(this);
            const text = Notice.take();
            if (text) {
                const w = 640, h = this.calcWindowHeight ? this.calcWindowHeight(5, false) + 16 : 220;
                this._coopNotice = new Window_CoopNotice(new Rectangle((Graphics.boxWidth - w) / 2, (Graphics.boxHeight - h) / 2, w, h));
                this._coopNotice.openness = 0;
                this.addChild(this._coopNotice);                         // above MOG's picture commands
                this._coopNotice.show(text);
                try { SoundManager.playBuzzer(); } catch (e) { /* optional */ }
            }
        };
        const _titleUpdate = Scene_Title.prototype.update;
        Scene_Title.prototype.update = function () {
            const n = this._coopNotice;
            if (n && (n.isOpen() || n.isOpening())) {                     // the notice owns input until dismissed
                Scene_Base.prototype.update.call(this);
                if (n.isOpen() && (Input.isTriggered('ok') || Input.isTriggered('cancel') || TouchInput.isTriggered())) { SoundManager.playOk(); n.close(); }
                return;
            }
            _titleUpdate.call(this);
        };
    }

    // ---------- Steam invites: one accepted in Steam opens the Co-op menu and joins that world (user, 2026-11-04) ----------
    const isTitleScene = sc => (typeof Scene_Title !== 'undefined' && sc instanceof Scene_Title) || /Title/.test((sc && sc.constructor && sc.constructor.name) || '');
    function inviteTick() {
        if (CFG.transport !== 'steam' || !SteamInvites.install()) return;
        const inv = SteamInvites.current(), sc = SceneManager._scene;
        if (!inv || !sc || SceneManager.isSceneChanging()) return;
        const who = inv.name || 'A Steam friend', tell = (text, ms) => { if (!inv.told) { inv.told = true; Diag.toast(text.replace('%1', who), ms || 10000); } };
        if (Net.state !== S.MENU && Net.state !== S.ERROR) return tell(T.toastInviteBusy);       // in a co-op world already (or joining one)
        if (!inv.accepted) return tell(T.toastInvite);                                           // received only: the player chooses
        if (sc instanceof Scene_CoopMenu) {
            if (!sc.isStarted() || sc._joining || (sc._ask && sc._ask.isOpen())) return;
            SteamInvites.clear(); if (sc._tab !== 'join') sc.setTab('join', false); sc.join(inv.lobby); return;
        }
        if (isTitleScene(sc)) { if (!(sc._coopNotice && (sc._coopNotice.isOpen() || sc._coopNotice.isOpening())) && sc.isStarted && sc.isStarted()) openLobby('Steam invite'); return; }
        if (sc instanceof Scene_Map) return tell(T.toastInviteMap, 15000);                      // a single-player game: saving is theirs to do
    }
    setInterval(() => { try { inviteTick(); } catch (e) { Diag.err('Steam invite', e); } }, 500);

    // ---------- a new co-op world skips WTE's tutorial (decision 27): answer GAME START's own choices ----------
    if (typeof Game_Interpreter !== 'undefined') {
        const _setupChoices = Game_Interpreter.prototype.setupChoices;
        Game_Interpreter.prototype.setupChoices = function (params) {
            const sc = this._coopStory && Story.choice(this);
            if (sc && sc.lead) {                                            // the lead answers; everyone gets the answer
                _setupChoices.call(this, params);
                const cb = $gameMessage._choiceCallback, st = this._coopStory;
                $gameMessage.setChoiceCallback(n => { if (cb) cb(n); Story.sendChoice(st, sc.c, n); });
                this._coopChoiceK = undefined;
                return;
            }
            if (sc && !sc.lead) {                                           // a follower: the lead's answer
                this._branch[this._indent] = sc.n;
                const label = Array.isArray(params[0]) && params[0][sc.n];
                if (label && String(label).trim()) Diag.toast(Net.nameOf(this._coopStory.lead) + ' chose: ' + label, 3000);
                return;
            }
            if (CoopFlow.skipTutorial && window.$gameMap && $gameMap.mapId() === 11 && Array.isArray(params[0])) {
                const ch = params[0].join('|');
                if (ch === 'Yes|No') {                                                                  // "Enable tutorials?"
                    if (CoopFlow.withTutorial) { this._branch[this._indent] = 0; CoopFlow.skipTutorial = false; return; }   // -> Yes: played together
                    this._branch[this._indent] = 1; return;                                             // -> No
                }
                if (ch === 'Yes, disable them|No, enable them') { this._branch[this._indent] = 0; CoopFlow.skipTutorial = false; return; }  // -> disable
            }
            _setupChoices.call(this, params);
        };
    }
    }   // end: engine-only UI

    // =====================================================================
    // 9. THE WATCHER (2026-11-03): notes where things go wrong while people play, in the log, with what the game was
    //    doing then: a battle or an event that stops going on, a loading screen or a map change that never ends, the
    //    game freezing or running slowly, and the context of every script error. tools/watch-report.js turns the log
    //    into a short list (each problem once, how often, the source file and line it came from).
    // =====================================================================
    const Watch = {
        TICK_MS: 2000, BATTLE_MS: 30000, EVENT_MS: 60000, LOAD_MS: 15000, FREEZE_MS: 1500, SLOW_FPS: 20, SLOW_S: 5, REPEAT_MS: 300000,
        started: false, away: false, seen: new Map(), frames: 0, slowFor: 0, lastBeat: 0, sig: {},
        start() {
            if (this.started || !hasDOM) return;
            this.started = true; this.lastBeat = Date.now();
            try { const w = nw.Window.get(); w.on('minimize', () => { this.away = true; }); w.on('restore', () => { this.away = false; this.lastBeat = Date.now(); this.slowFor = 0; }); } catch (e) { /* not NW.js */ }
            setInterval(() => { try { this.beat(); } catch (e) { /* the watcher never breaks the game */ } }, 250);
            setInterval(() => { try { this.tick(); } catch (e) { /* the watcher never breaks the game */ } }, this.TICK_MS);
            window.addEventListener('error', () => { try { Diag.log('warn', 'WATCH error-context: where the game was for the error above || ' + this.where()); } catch (e) { /* ignore */ } });
        },
        /** One note per problem (and place), again only after 5 minutes: how often it came is counted, not every time. */
        note(kind, text, key) {
            const k = kind + '|' + (key === undefined ? text : key), now = Date.now(), s = this.seen.get(k);
            if (s && now - s.at < this.REPEAT_MS) { s.n++; return; }
            const again = s && s.n ? ' (and ' + s.n + ' more time' + (s.n > 1 ? 's' : '') + ' since)' : '';
            this.seen.set(k, { at: now, n: 0 });
            Diag.log('warn', 'WATCH ' + kind + ': ' + text + again + ' || ' + this.where());
        },
        /** What the game was doing: the scene, the map and spot, the event running, the battle, co-op. */
        where() {
            const out = [];
            const sc = SceneManager._scene; out.push('scene ' + (sc ? sc.constructor.name : '-'));
            try {
                if ($gameMap && $gameMap.mapId()) out.push('map ' + $gameMap.mapId() + ($dataMapInfos && $dataMapInfos[$gameMap.mapId()] ? ' ' + $dataMapInfos[$gameMap.mapId()].name : '') + ' at ' + $gamePlayer.x + ',' + $gamePlayer.y);
                const it = $gameMap && $gameMap._interpreter;
                if (it && it.isRunning()) { const c = it._list && it._list[it._index]; out.push('event ' + (it._eventId || 'common') + ' line ' + it._index + (c ? ' (code ' + c.code + ')' : '') + (it._waitMode ? ' waiting ' + it._waitMode : '')); }
                if ($gameMessage && $gameMessage.isBusy()) out.push('message open');
                if ($gameParty && $gameParty.inBattle()) {
                    const BM = BattleManager, f = b => b.name() + ' ' + b.hp + (b.isDead() ? ' down' : '') + (b._wteCurrentAp ? ' ap' + b._wteCurrentAp : '');
                    out.push('battle ' + BM._phase + ' team ' + BM._wteLastTeamActive + ' turn ' + $gameTroop.turnCount() + ', acting ' + (BM._subject ? BM._subject.name() : '-') + ', choosing ' + (BM._currentActor ? BM._currentActor.name() : '-') +
                        ', party ' + $gameParty.battleMembers().map(f).join('/') + ', foes ' + $gameTroop.aliveMembers().map(f).join('/'));
                    if (Duel.on) out.push('together: ' + Duel.kind + ', action ' + Duel.actions + ', numbered ' + Duel.done + ', queued ' + Array.from(Duel.queue.keys()).join(',') + ', down ' + Duel.downMask() + (Duel.local() && Duel.local()._coopPending ? ', mine sent' : ''));
                }
            } catch (e) { out.push('(' + e.message + ')'); }
            try { if (Net.isPlaying()) out.push((Net.isHost ? 'host' : 'joined') + ', ' + Net.peers.size + ' other(s)'); } catch (e) { /* not in co-op */ }
            return out.join('; ');
        },
        /** Every 250 ms: a beat that comes late means the game froze (only while the window is in front: a window behind
         *  others is slowed down by Windows on purpose). */
        beat() {
            const now = Date.now(), gap = now - this.lastBeat; this.lastBeat = now;
            if (gap > this.FREEZE_MS && !document.hidden && !this.away) this.note('freeze', 'the game stood still for ' + (gap / 1000).toFixed(1) + ' s', 'freeze ' + this.place());
        },
        place() { try { return SceneManager._scene.constructor.name + ' ' + ($gameMap ? $gameMap.mapId() : 0); } catch (e) { return '-'; } },
        countFrame() { this.frames++; },
        /** Every 2 s: slow frames, and anything that should be going on but isn't. */
        tick() {
            const now = Date.now(), fps = this.frames / (this.TICK_MS / 1000); this.frames = 0;
            if (!document.hidden && !this.away && fps < this.SLOW_FPS) { this.slowFor += this.TICK_MS / 1000; if (this.slowFor >= this.SLOW_S) this.note('slow', 'about ' + Math.round(fps) + ' frames a second for ' + this.slowFor + ' s', 'slow ' + this.place()); }
            else this.slowFor = 0;
            const sc = SceneManager._scene;
            this.stuck('loading', sc && !(sc.isStarted && sc._started) ? sc.constructor.name : '', this.LOAD_MS, s => 'the ' + s + ' screen has been loading for ' + this.LOAD_MS / 1000 + '+ s', now);
            this.stuck('transfer', $gamePlayer && $gamePlayer.isTransferring() && sc instanceof Scene_Map ? String($gamePlayer._newMapId) : '', this.LOAD_MS, s => 'going to map ' + s + ' has not happened in ' + this.LOAD_MS / 1000 + '+ s', now);
            // a battle that does not go on: nobody's numbers, turn or AP change, and nobody here is choosing
            let b = '';
            if (sc instanceof Scene_Battle && !(sc._actorCommandWindow && sc._actorCommandWindow.active) && !(sc._partyCommandWindow && sc._partyCommandWindow.active) && !$gameMessage.isBusy() && !BattleManager.isBattleEnd()) {
                const BM = BattleManager;
                b = JSON.stringify([BM._phase, BM._wteLastTeamActive, $gameTroop.turnCount(), BM._subject && BM._subject.name(), Duel.on && Duel.actions,
                    BM.allBattleMembers().map(x => [x.hp, x._wteCurrentAp, x._tpbState, Math.round((x._tpbChargeTime || 0) * 20)])]);
                if (sc._actorWindow && sc._actorWindow.active || sc._enemyWindow && sc._enemyWindow.active || sc._skillWindow && sc._skillWindow.active || sc._itemWindow && sc._itemWindow.active) b = '';   // choosing a target or a skill
            }
            this.stuck('battle', b, this.BATTLE_MS, () => 'the battle has not moved on for ' + this.BATTLE_MS / 1000 + '+ s and nobody on this PC is choosing (in co-op: someone elsewhere may be thinking)', now);
            // an event that stays on one line (not a message or a choice: those wait for the player)
            let e = '';
            const it = $gameMap && $gameMap._interpreter;
            if (sc instanceof Scene_Map && it && it.isRunning() && !$gameMessage.isBusy()) e = (it._mapId || 0) + ':' + (it._eventId || 'common') + ':' + it._index + ':' + (it._waitMode || '') + ':' + (it._childInterpreter ? it._childInterpreter._index : '');
            this.stuck('event', e, this.EVENT_MS, s => 'an event has stayed on one line for ' + this.EVENT_MS / 1000 + '+ s (map:event:line:wait ' + s + ')', now);
        },
        /** The same state for too long: noted once (until it changes). */
        stuck(kind, state, ms, text, now) {
            const s = this.sig[kind];
            if (!state) { delete this.sig[kind]; return; }
            if (!s || s.state !== state) { this.sig[kind] = { state, at: now, told: false }; return; }
            if (!s.told && now - s.at >= ms) { s.told = true; this.note(kind, text(state), kind + ' ' + state.slice(0, 120)); }
        }
    };
    if (typeof SceneManager !== 'undefined') {
        const _updateMain = SceneManager.updateMain;
        SceneManager.updateMain = function () { Watch.countFrame(); return _updateMain.apply(this, arguments); };
        // the game's own crash screen: the whole stack and where the game was, before it shows
        const _catch = SceneManager.catchException;
        if (_catch) SceneManager.catchException = function (e) { try { Diag.log('error', 'the game stopped on an error: ' + (e && e.stack ? e.stack : e)); Watch.note('crash', 'the game showed its error screen', String(e && e.message)); } catch (x) { /* ignore */ } return _catch.apply(this, arguments); };
        Watch.start();
    }

    // =====================================================================
    // 9c. THE UPDATER (user, 2026-11-05: "when they start the exe it would look for new updates ... and then apply them"):
    //     co-op's own files only (its plugin and its network library), from the updates repo (tools/publish-update.js).
    //     Every release is signed with co-op's key (tools/make-update-key.js), so nobody else can push code to players: a
    //     file list that isn't signed with it, a file that doesn't match its fingerprint, or a path outside co-op's own
    //     files is refused before anything is written. Opt-in: nothing changes until the player says yes.
    //      - the title screen: a newer release, offered when this game has an earlier release (never a test build, never
    //        an older one), with "Skip this version", "Don't check for updates" and "Not now"
    //      - Join: a host with other co-op files offers the host's own release (newer or older), so both match
    //     A new game version still comes with the zip: the co-op copy needs the game's own files for it.
    //     The window is co-op's own question box, in the game's style like every co-op menu (user, 2026-11-05).
    // =====================================================================
    const Updater = {
        KEY: 'tnHoLy2YjnyjKpOVrPT5pxJGtDb9xzN4Y0NtdeRi2GU=',     // Ed25519 public key (raw, base64): its private half signs releases
        PLUGIN: 'js/plugins/elderfieldcoop.js',
        /** The only files an update may write: co-op's plugin and the ws library it ships (no programs, nothing of the game's). */
        ALLOWED: /^js\/(plugins\/elderfieldcoop\.js|libs\/node_modules\/ws\/([\w-]+\/)*[\w.-]+\.(js|mjs|json|md)|libs\/node_modules\/ws\/LICENSE)$/,
        MAX: 20 * 1024 * 1024,
        base: CFG.updateUrl,
        checked: false,
        /** This game's co-op build: its plugin's fingerprint (the one Join compares). */
        mine() { return Mods.coopBuild(); },
        req(n) { return P2P.nodeRequire(n); },
        root() { const path = this.req('path'); return path.resolve(path.dirname(PLUGIN_FILE), '..', '..'); },
        dir() { return this.req('path').join(this.root(), 'coop-update'); },
        sha(buf) { return this.req('crypto').createHash('sha256').update(buf).digest('hex'); },
        url(rel) { const b = String(this.base || ''); return (b.endsWith('/') ? b : b + '/') + rel; },
        /** The player's choices, kept in the co-op copy: builds skipped, and whether to look at all. */
        prefs() { try { return JSON.parse(this.req('fs').readFileSync(this.req('path').join(this.dir(), 'prefs.json'), 'utf8')) || {}; } catch (e) { return {}; } },
        setPrefs(p) { try { const fs = this.req('fs'); fs.mkdirSync(this.dir(), { recursive: true }); fs.writeFileSync(this.req('path').join(this.dir(), 'prefs.json'), JSON.stringify(Object.assign(this.prefs(), p))); } catch (e) { Diag.err('updater prefs', e); } },
        enabled() { return CFG.updateCheck && !!this.base && !!PLUGIN_FILE && !this.prefs().off; },
        /** HTTPS GET (http only to this PC, for tests), following GitHub's redirects, capped in size and time. */
        get(url, hops) {
            return new Promise((res, rej) => {
                let u; try { u = new URL(url); } catch (e) { return rej(new Error('bad address')); }
                const local = u.hostname === '127.0.0.1' || u.hostname === 'localhost';
                if (u.protocol !== 'https:' && !(u.protocol === 'http:' && local)) return rej(new Error('not https'));
                const r = this.req(u.protocol === 'https:' ? 'https' : 'http').get(u, { headers: { 'User-Agent': 'ElderfieldCoop-Updater' } }, rs => {
                    if ([301, 302, 303, 307, 308].includes(rs.statusCode) && rs.headers.location && (hops || 0) < 4) { rs.resume(); return res(this.get(new URL(rs.headers.location, u).href, (hops || 0) + 1)); }
                    if (rs.statusCode !== 200) { rs.resume(); return rej(new Error(rs.statusCode === 404 ? 'not published' : 'the server said ' + rs.statusCode)); }
                    const parts = []; let n = 0;
                    rs.on('data', c => { n += c.length; if (n > this.MAX) { r.destroy(); rej(new Error('too big')); } else parts.push(c); });
                    rs.on('end', () => res(Buffer.concat(parts)));
                    rs.on('error', rej);
                });
                r.setTimeout(20000, () => r.destroy(new Error('no answer')));
                r.on('error', rej);
            });
        },
        verify(data, sig) {
            try {
                const c = this.req('crypto');
                const key = c.createPublicKey({ key: Buffer.concat([Buffer.from('302a300506032b6570032100', 'hex'), Buffer.from(this.KEY, 'base64')]), format: 'der', type: 'spki' });
                return c.verify(null, data, key, Buffer.from(String(sig).trim(), 'base64'));
            } catch (e) { return false; }
        },
        /** A release's signed file list: the newest (no build) or one build's own. Throws unless it is signed and sound. */
        async manifest(build) {
            const rel = build ? 'builds/' + build + '/manifest.json' : 'latest.json', q = build ? '' : '?t=' + Date.now();
            const data = await this.get(this.url(rel + q)), sig = await this.get(this.url(rel + '.sig' + q));
            if (!this.verify(data, sig.toString('utf8'))) throw new Error("it isn't signed with co-op's key");
            const m = JSON.parse(data.toString('utf8'));
            if (!m || m.format !== 1 || !/^[0-9a-f]{10}$/.test(m.build) || !Array.isArray(m.files)) throw new Error("it isn't a co-op release");
            if (build && m.build !== build) throw new Error('it is another build');
            for (const f of m.files) {
                if (!f || typeof f.path !== 'string' || !this.ALLOWED.test(f.path) || f.path.split('/').includes('..') || !/^[0-9a-f]{64}$/.test(f.sha256) || !isInt(f.size, 0, this.MAX))
                    throw new Error('it lists a file co-op never updates (' + cleanStr(String(f && f.path), 60) + ')');
            }
            if (!m.files.some(f => f.path === this.PLUGIN)) throw new Error('it has no co-op plugin');
            return m;
        },
        local(rel) { try { return this.sha(this.req('fs').readFileSync(this.req('path').join(this.root(), rel))); } catch (e) { return ''; } },
        /** Why this release can't go into this game (another game version), or ''. */
        unfit(m) { const gv = gameVersion(); return m.gameVersion && gv && String(m.gameVersion) !== gv ? T.updUnfit.replace('%1', m.build).replace('%2', String(m.gameVersion)).replace('%3', gv) : ''; },
        /** Downloads every changed file and checks each against the signed list, then swaps them in (the old ones kept in
         *  coop-update\backup-<old build>, put back if anything fails half way). Returns the paths changed. */
        async apply(m, progress) {
            const fs = this.req('fs'), path = this.req('path'), root = this.root();
            const todo = m.files.filter(f => this.local(f.path) !== f.sha256);
            const got = [];
            for (let i = 0; i < todo.length; i++) {
                const f = todo[i]; if (progress) progress(i + 1, todo.length);
                const buf = await this.get(this.url('builds/' + m.build + '/files/' + f.path.split('/').map(encodeURIComponent).join('/')));
                if (buf.length !== f.size || this.sha(buf) !== f.sha256) throw new Error('a download did not match its fingerprint (' + f.path + ')');
                if (f.path === this.PLUGIN && this.sha(buf).slice(0, 10) !== m.build) throw new Error('the plugin is not build ' + m.build);
                got.push({ f, buf });
            }
            const back = path.join(this.dir(), 'backup-' + this.mine()), done = [];
            try {
                for (const { f, buf } of got) {
                    const dest = path.join(root, ...f.path.split('/')), keep = path.join(back, ...f.path.split('/'));
                    const had = fs.existsSync(dest);
                    fs.mkdirSync(path.dirname(dest), { recursive: true });
                    if (had) { fs.mkdirSync(path.dirname(keep), { recursive: true }); fs.copyFileSync(dest, keep); }
                    fs.writeFileSync(dest + '.coop-new', buf); fs.renameSync(dest + '.coop-new', dest);
                    done.push({ dest, keep, had });
                }
            } catch (e) {
                done.forEach(d => { try { if (d.had) fs.copyFileSync(d.keep, d.dest); else fs.unlinkSync(d.dest); } catch (x) { /* best effort */ } });
                throw new Error('a file could not be written, so the old ones are back (' + e.message + ')');
            }
            try { fs.writeFileSync(path.join(this.dir(), 'last-update.json'), JSON.stringify({ from: this.mine(), to: m.build, at: new Date().toISOString(), files: got.map(g => g.f.path) }, null, 1)); } catch (e) { /* a note only */ }
            Diag.log('info', 'updater: co-op ' + this.mine() + ' -> ' + m.build + ', ' + got.length + ' file(s)');
            return got.map(g => g.f.path);
        },
        /** Starts the updated co-op: the page loads its plugins again; a new network library needs the game started again. */
        restart(changed) {
            try {
                if (changed.some(p => p !== this.PLUGIN)) { if (typeof nw !== 'undefined') nw.App.quit(); else window.close(); return; }
                if (typeof nw !== 'undefined') nw.Window.get().reloadIgnoringCache(); else location.reload();
            } catch (e) { Diag.err('updater restart', e); }
        },
        /** The title screen: once per start, in the background; an offer only for a release newer than this one. */
        titleCheck() {
            if (this.checked || !this.enabled()) return;
            this.checked = true;
            const mine = this.mine();
            this.manifest().then(m => {
                if (m.build === mine) return Diag.log('info', 'updater: co-op is up to date (' + mine + ')');
                if (!(Array.isArray(m.previous) && m.previous.includes(mine))) return Diag.log('info', 'updater: this co-op build (' + mine + ') is not an earlier release of ' + m.build + ': nothing offered');
                if ((this.prefs().skip || []).includes(m.build)) return Diag.log('info', 'updater: ' + m.build + ' skipped by the player');
                this.offer(m, 'title');
            }).catch(e => Diag.log('info', 'updater: no update check (' + e.message + ')'));
        },
        /** Join: the host turned this game away for other co-op files; the host's build is offered when it is published. */
        hostCheck(build, reason) {
            if (!this.enabled() || !/^[0-9a-f]{10}$/.test(String(build || '')) || build === this.mine() || !/co-op/i.test(String(reason || ''))) return;
            this.manifest(build).then(m => this.offer(m, 'host')).catch(e => {
                Diag.log('info', "updater: the host's build " + build + ': ' + e.message);
                this.show([T.updOther, T.updHostBuild.replace('%1', build).replace('%2', this.mine()),
                    e.message === 'not published' ? T.updUnpublished : T.updNoFetch.replace('%1', cleanStr(String(e.message), 60)), T.updAskHost], [{ label: T.ok, key: 'close' }]);
            });
        },
        offer(m, why) {
            const bad = this.unfit(m);
            if (bad) return why === 'host' ? this.show([T.updOther, bad], [{ label: T.ok, key: 'close' }]) : Diag.log('info', 'updater: ' + bad);
            const notes = cleanStr(String(m.notes || ''), 90);
            const lines = why === 'host'
                ? [T.updHostTitle, T.updHostBuild.replace('%1', m.build).replace('%2', this.mine()), T.updHostAsk]
                : [T.updTitle, T.updBuild.replace('%1', m.build + (m.date ? ' (' + cleanStr(String(m.date), 10) + ')' : '')).replace('%2', this.mine())];
            if (notes) lines.push(notes);
            // the safe answer last, as in co-op's other questions: it is selected first and Cancel picks it
            const choices = why === 'host' ? [{ label: T.updHostNow, key: 'go' }, { label: T.updLater, key: 'close' }]
                : [{ label: T.updNow, key: 'go' }, { label: T.updSkip, key: 'skip' }, { label: T.updOff, key: 'off' }, { label: T.updLater, key: 'close' }];
            this.show(lines, choices, key => {
                if (key === 'skip') this.setPrefs({ skip: (this.prefs().skip || []).concat(m.build).slice(-20) });
                if (key === 'off') this.setPrefs({ off: true });
                if (key !== 'go') return true;
                this.run(m); return false;
            });
        },
        async run(m) {
            const sc = SceneManager._scene;
            const say = (lines, choices, cb) => { if (sc && sc.coopUpdate) sc.coopUpdate(lines, choices, cb); };
            say([T.updRunning, T.updFetching.replace('%1', m.build)], []);
            try {
                const changed = await this.apply(m, (i, n) => say([T.updRunning, T.updFile.replace('%1', i).replace('%2', n)], []));
                const quit = changed.some(p => p !== this.PLUGIN);
                say([T.updDone, T.updChanged.replace('%1', m.build).replace('%2', changed.length), quit ? T.updQuitMsg : T.updRestartMsg],
                    [{ label: quit ? T.updQuit : T.updRestart, key: 'go' }], () => { this.restart(changed); return false; });
            } catch (e) {
                Diag.log('warn', 'updater: ' + e.message);
                say([T.updFailed, cleanStr(String(e.message), 120), T.updUnchanged], [{ label: T.ok, key: 'close' }]);
            }
        },
        /** Puts the update window over whatever screen is open (the title, the Co-op menu); never over the map or a battle. */
        show(lines, choices, cb) {
            const go = () => {
                const sc = SceneManager._scene;
                if (!Scene_CoopUpdate) return Diag.log('info', 'updater: ' + lines.join(' / '));
                if (!sc || SceneManager.isSceneChanging() || (typeof Scene_Map !== 'undefined' && sc instanceof Scene_Map) || (typeof Scene_Battle !== 'undefined' && sc instanceof Scene_Battle)) return setTimeout(go, 500);
                Scene_CoopUpdate.pending = { lines, choices, cb }; SceneManager.push(Scene_CoopUpdate);
            };
            go();
        }
    };
    /** The update window: co-op's own question box (Window_CoopAsk, styled by the game's windowskin, corners, cursor and
     *  fonts like every co-op menu) on its own screen over the one before, so the title or menu underneath takes no input.
     *  Laid out as co-op's other questions (Scene_Coop.ask): sized to its lines, centred, the safe answer selected first. */
    // the screen needs the engine; the Node test harness has none (as the co-op menus, 8b)
    const Scene_CoopUpdate = typeof Scene_MenuBase === 'undefined' ? null : class Scene_CoopUpdate extends Scene_MenuBase {
        create() {
            super.create();
            this._ask = new window.Window_CoopAsk(new Rectangle(0, 0, 10, 10));
            this.addWindow(this._ask);
            const p = Scene_CoopUpdate.pending || { lines: [T.updOther], choices: [{ label: T.ok, key: 'close' }] };
            Scene_CoopUpdate.pending = null;
            this.coopUpdate(p.lines, p.choices, p.cb);
        }
        coopUpdate(lines, choices, cb) {
            const a = this._ask;
            this._cb = cb; this._busy = !choices.length;
            const w = Math.min(Graphics.boxWidth - 40, 860);
            const h = lines.length * a.lineHeight() + 10 + choices.length * a.itemHeight() + a.padding * 2 + 8;   // choice rows are taller than text lines
            a.move((Graphics.boxWidth - w) / 2, (Graphics.boxHeight - h) / 2, w, h);
            a.createContents();
            a.clearCommandList && a.clearCommandList();
            choices.forEach(c => a.setHandler(c.key, () => this.pick(c.key)));
            a.setHandler('cancel', () => { if (this._busy) return; SoundManager.playCancel(); this.pick(choices[choices.length - 1].key); });
            a.setup(lines, choices);
            if (this._busy) a.deactivate(); else a.select(choices.length - 1);
        }
        pick(key) {
            if (this._busy) return;
            const stay = this._cb ? this._cb(key) === false : false;
            if (!stay) this.popScene(); else this._ask.activate();
        }
    };
    if (Scene_CoopUpdate) window.Scene_CoopUpdate = Scene_CoopUpdate;
    if (typeof Scene_Title !== 'undefined') {
        const _titleStartUpd = Scene_Title.prototype.start;
        Scene_Title.prototype.start = function () { _titleStartUpd.call(this); try { Updater.titleCheck(); } catch (e) { Diag.err('updater', e); } };
    }
    // =====================================================================
    // 9. ENGINE HOOKS (all guarded so the file also loads in a test harness)
    // =====================================================================
    if (typeof Input !== 'undefined') { Input.keyMapper[CFG.lobbyKey] = 'elderfield_lobby'; Input.keyMapper[CFG.tradeKey] = 'elderfield_trade'; }


    /** Shift+F10: write where this player stands and what the collision check says, for reporting map problems. */
    function reportPosition() {
        try {
            if (!window.$gamePlayer || !window.$gameMap || !(SceneManager._scene instanceof Scene_Map)) return Diag.toast('Position report works on the map only.', 3000);
            const p = $gamePlayer, x = Math.round(p.x), y = Math.round(p.y);
            const dirs = { up: 8, down: 2, left: 4, right: 6 }, pass = [];
            Object.keys(dirs).forEach(k => pass.push(k + '=' + (p.canPass(x, y, dirs[k]) ? 'open' : 'blocked') + '/' + ($gameMap.isPassable(x, y, dirs[k]) ? 'tile-open' : 'tile-wall')));
            const info = $dataMapInfos && $dataMapInfos[$gameMap.mapId()];
            Diag.log('info', 'POSITION REPORT: map ' + $gameMap.mapId() + ' (' + ((info && info.name) || '?') + ') x=' + p.x + ' y=' + p.y + ' facing=' + p.direction() +
                ' region=' + $gameMap.regionId(x, y) + ' through=' + p.isThrough() + ' ' + pass.join(' ') + (Net.isPlaying() ? ' | co-op ' + (Net.isHost ? 'host' : 'joiner slot ' + Net.slot) : ' | single player'));
            Diag.toast('Position written to the co-op log (Shift+F9 shows it).', 3000);
        } catch (e) { Diag.err('position report', e); }
    }

    // Keyboard hooks at the DOM level, independent of the engine's Input mapping, so they still work when a
    // custom title screen replaces Scene_Title.update.
    if (hasDOM && typeof document.addEventListener === 'function') {
        document.addEventListener('keydown', e => {
            if (e.keyCode >= 112 && e.keyCode <= 123) Diag.log('info', 'function key seen: keyCode ' + e.keyCode + (e.ctrlKey ? ' +Ctrl' : '') + (e.shiftKey ? ' +Shift' : ''));
            if (e.ctrlKey && !e.shiftKey && e.keyCode === 83 && !e.repeat) { if (Net.saveSlot) Saves.tick(true); return; }   // Ctrl+S: save co-op progress
            if (e.shiftKey && e.keyCode === 121 && !e.repeat) { e.preventDefault(); reportPosition(); return; }                                   // Shift+F10: where am I (bug reports)
            if (e.keyCode !== CFG.lobbyKey || e.repeat) return;
            if (e.shiftKey) { Diag.show(); return; }
            if (e.ctrlKey) { Diag.devtools(); return; }
            openLobby('DOM key');
        }, true);
        const ready = () => Diag.toast('Elderfield co-op loaded. F9 = co-op menu, Shift+F9 = co-op log, Shift+F10 = report position', 10000);
        if (document.body) ready(); else document.addEventListener('DOMContentLoaded', ready);
    }

    // every map frame (decision 90): the binds page's chat key; the farm's leftover loading picture
    if (typeof Scene_Map !== 'undefined') {
        const _smUpdateCoop = Scene_Map.prototype.update;
        Scene_Map.prototype.update = function () {
            if (typeof Input !== 'undefined' && Chat.bound() && Input.isTriggered('coopchat') && Chat.canOpen()) Chat.open();
            FarmLoad.update(); Counters.settle();
            _smUpdateCoop.apply(this, arguments);
        };
    }

    // Shared clock keeps running in a session [decisions 14, 16]: on the map even while a message is open, and in
    // every other scene (pause menu, inventory, shops, options). Single player keeps DK_Game_Time's own rules (I-7).
    if (typeof Scene_Map !== 'undefined' && Scene_Map.prototype.isGameTimeUpdated) {
        const _isGTU = Scene_Map.prototype.isGameTimeUpdated;
        Scene_Map.prototype.isGameTimeUpdated = function () { return Net.isPlaying() ? true : _isGTU.call(this); };
    }
    if (typeof Game_Time !== 'undefined' && Game_Time.prototype.isUpdated) {
        const _gtUpdated = Game_Time.prototype.isUpdated;
        Game_Time.prototype.isUpdated = function () { return Net.isPlaying() && this === window.$gameTime ? !this.isPaused() : _gtUpdated.call(this); };
    }
    if (typeof Scene_Base !== 'undefined') {
        const _sbUpdate = Scene_Base.prototype.update;
        Scene_Base.prototype.update = function () {
            _sbUpdate.call(this);
            if (!Net.isPlaying() || (typeof Scene_Map !== 'undefined' && this instanceof Scene_Map)) return;
            if (!Clock.gameLoaded() || typeof Game_Time === 'undefined' || typeof Game_Time.update !== 'function') return;
            try { Clock.update(); Game_Time.update(); } catch (e) { Diag.err('clock in menu', e); }
        };
    }

    // Autosaves inside a co-op world go to the host's world file, never to the single-player autosave (decision 24, I-6).
    if (typeof Scene_Base !== 'undefined' && typeof Scene_Base.prototype.executeAutosave === 'function') {
        const _autosave = Scene_Base.prototype.executeAutosave;
        Scene_Base.prototype.executeAutosave = function () {
            if (WorldSave.active()) { WorldSave.autosave(); return; }
            _autosave.call(this);
        };
    }

    // Host or joiner back on the title screen = the session is over (design §10.3: host leaving kicks everyone).
    if (typeof Scene_Title !== 'undefined') {
        const _start = Scene_Title.prototype.start;
        Scene_Title.prototype.start = function () {
            if (Net.state !== S.MENU) { Diag.log('info', 'returned to title: leaving the co-op session'); Net.leave(); }
            _start.call(this);
        };
    }
    // Window closing: say goodbye if we still can. If the process dies first, the OS closes the sockets and joiners see it at once.
    if (hasDOM && typeof window.addEventListener === 'function') {
        const bye = () => { try { if (Net.state !== S.MENU) Net.leave(); } catch (e) { /* closing anyway */ } };
        window.addEventListener('beforeunload', bye);
        window.addEventListener('unload', bye);
    }

    if (typeof Scene_Title !== 'undefined') {
        const _update = Scene_Title.prototype.update;
        Scene_Title.prototype.update = function () {
            _update.call(this);
            if (Input.isTriggered('elderfield_lobby') && !lobbyEl) openLobby('Input');
        };
        if (CFG.titleCommand) {
            const _mk = Window_TitleCommand.prototype.makeCommandList;
            Window_TitleCommand.prototype.makeCommandList = function () { _mk.call(this); this.addCommand('Multiplayer', 'elderfield_mp'); };
            const _cc = Scene_Title.prototype.createCommandWindow;
            Scene_Title.prototype.createCommandWindow = function () {
                _cc.call(this);
                this._commandWindow.setHandler('elderfield_mp', () => openLobby('title command'));
            };
        }
    }

    function nearestPeer() {
        let best = null, bd = 4;
        Net.peers.forEach((p, id) => {
            if (!p.state || p.state.map !== Locator.local()) return;
            const d = Math.abs(p.state.x - $gamePlayer.x) + Math.abs(p.state.y - $gamePlayer.y);
            if (d < bd) { bd = d; best = id; }
        });
        return best;
    }
    function tradeWithNearest() {
        const id = nearestPeer();
        if (id) Net.tradeRequest(id); else $gameMessage.add('No player nearby.');
    }

    if (typeof Scene_Map !== 'undefined') {
        const _update = Scene_Map.prototype.update;
        Scene_Map.prototype.update = function () {
            _update.call(this);
            Net.applyWorld();
            Shared.flush();
            if (Net.ritualActive() || Net.rl || Net.rs) renderRitual(Net);
            Clock.update();
            Rooms.update();
            Net.flushRemoteStates();
            if (Net.sendCharacterWhenIdle && Net.inWorld && !$gameMap.isEventRunning() && !$gameTemp.isCommonEventReserved() && !$gameMessage.isBusy()) {
                Net.sendCharacterWhenIdle = false;                           // customiser/build finished: the host saves my character now
                Net.uploadPlayerData('character');
            }
            Net.peers.forEach(p => { if (p.char) p.char.update(); if (p.ghostChar) p.ghostChar.update(); if (p.bobChar) p.bobChar.update(); });
            Net.tickPlayer(Date.now());
            WorldObjects.tickGhost(Date.now());
            WorldObjects.flushSelf(Date.now());
            Shared.flushLocal(Date.now());
            Night.update();
            Chat.tick();
            Desync.tick(Date.now());
            Duel.tick();
            Marriages.tick(Date.now());
            Fair.tick(Date.now());
            Wedding.tick(Date.now());
            Chores.tick();
            Gates.tick(Date.now());
            Bosses.tick(Date.now());
            Chat.hint();
            Walkers.tick(Date.now());
            Festival.update();
            Story.update();
            Invites.update();
            Reclaims.update();
            Tutorials.update();
            Achievements.update();
            Mobs.update(Date.now());
            Mobs.settle(Date.now());
            Pendulums.update();
            Uses.update(Date.now());
            NightHud.update(this);
            Labels.sweep(this);
            Saves.tick(false);
            if (Date.now() - hudStamp > 500) { hudStamp = Date.now(); updateHud(); }   // keep the corner display current
            if (Net.isPlaying() && Input.isTriggered('elderfield_trade') && !Net.localTrade) tradeWithNearest();
        };

        const _sUpdate = Spriteset_Map.prototype.update;
        Spriteset_Map.prototype.update = function () {
            _sUpdate.call(this);
            const mine = this._elderfieldSprites || (this._elderfieldSprites = new Map());
            const want = new Map();                                       // sprite key -> character: each player, and what they are placing
            Net.peers.forEach((p, id) => { if (p.char) want.set(id, p.char); if (p.ghostChar) want.set(id + '#ghost', p.ghostChar); if (p.bobChar) want.set(id + '#bobber', p.bobChar); });
            want.forEach((ch, key) => {
                if (!mine.has(key)) {
                    const sp = new Sprite_Character(ch);
                    this._characterSprites.push(sp); this._tilemap.addChild(sp); mine.set(key, sp);
                }
            });
            mine.forEach((sp, id) => {
                if (want.get(id) !== sp._character) {
                    this._tilemap.removeChild(sp);
                    const i = this._characterSprites.indexOf(sp); if (i >= 0) this._characterSprites.splice(i, 1);
                    sp.destroy(); mine.delete(id);
                }
            });
        };

        // remote players are drawn with THEIR composite look (KC_CompositeBitmaps), never the viewer's own
        const _setCharBitmap = Sprite_Character.prototype.setCharacterBitmap;
        Sprite_Character.prototype.setCharacterBitmap = function () {
            _setCharBitmap.call(this);
            const c = this._character;
            if (!RemoteChar || !(c instanceof RemoteChar)) return;
            const p = c._coopPeer, layers = p && p.looks && p.looks[this._characterName];
            let bmp = null;
            try { bmp = layers ? Looks.bitmapFor(p.id, this._characterName, layers) : Looks.baseBitmap(this._characterName); } catch (e) { Diag.err('remote look', e); }
            if (!layers && /__PROXY$/.test(this._characterName || '') && this._coopGoodBmp) bmp = this._coopGoodBmp;   // decision 105: not the bare sheet
            else if (layers && bmp) this._coopGoodBmp = bmp;
            if (bmp) this.bitmap = bmp;
            this._coopLookRev = c._lookRev;
        };
        // A character's new picture that finishes loading between two frames would be drawn whole for one frame (Sprite
        // sizes its frame to the bitmap when it loads; the pose is cut only on the next update). KC_CompositeBitmaps
        // gives every character on the sheet a new picture when a plot's layers change: the other players flashed as
        // a whole sheet on the worker's screen (user, 2026-11-03). The pose is cut the moment the picture is there.
        const _onBitmapLoad = Sprite_Character.prototype._onBitmapLoad;
        Sprite_Character.prototype._onBitmapLoad = function (bitmapLoaded) {
            const r = _onBitmapLoad.apply(this, arguments);
            try { if (bitmapLoaded === this.bitmap && this._character && !this._tileId && this._characterName && this.bitmap.isReady()) this.updateFrame(); } catch (e) { /* the next update cuts it */ }
            return r;
        };
        const _updateBitmap = Sprite_Character.prototype.updateBitmap;
        Sprite_Character.prototype.updateBitmap = function () {
            const was = this.bitmap, r = _updateBitmap.apply(this, arguments);
            try { if (this.bitmap !== was && this.bitmap && this.bitmap.isReady() && this._character && !this._tileId && this._characterName) this.updateFrame(); } catch (e) { /* the next update cuts it */ }
            return r;
        };
        const _isImageChanged = Sprite_Character.prototype.isImageChanged;
        Sprite_Character.prototype.isImageChanged = function () {
            return _isImageChanged.call(this) || (!!RemoteChar && this._character instanceof RemoteChar && this._coopLookRev !== this._character._lookRev);
        };

        // name labels over other players (§11.18; Options → "Show player names") and name plates on the room doors
        // Their layer sits inside the map, just under the pictures (a cutscene's or the moon's pictures cover them, and a
        // fade darkens them), scaled back so the text stays crisp at its real size whatever the map zoom.
        const Labels = {
            layer(scene) {
                const ss = scene._spriteset;
                if (!scene._coopLabels || (ss && scene._coopLabels.parent !== ss)) {
                    if (scene._coopLabels && scene._coopLabels.parent) scene._coopLabels.parent.removeChild(scene._coopLabels);
                    scene._coopLabels = new Sprite();
                    if (ss && ss._pictureContainer) ss.addChildAt(scene._coopLabels, ss.children.indexOf(ss._pictureContainer));
                    else scene.addChild(scene._coopLabels);
                }
                const l = scene._coopLabels, p = l.parent;
                if (p && p.scale) { l.scale.x = 1 / (p.scale.x || 1); l.scale.y = 1 / (p.scale.y || 1); }
                return l;
            },
            /** No names while a cutscene, the moon or a fade is on screen (WTE hides its HUD for those). */
            hidden() {
                return Scenes.hideOthers() || !!(window.$gameUltraHUD && $gameUltraHUD.globalVisibility === false) || !!Night.running.midnight || !!Night.running.wake
                    || (window.$gameScreen && $gameScreen.brightness() < 255);
            },
            draw(s, text, size, color, plate, width) {
                const key = text + '|' + width;
                if (s._key === key) return;
                s._key = key;
                if (!s.bitmap || s.bitmap.width !== width) s.bitmap = new Bitmap(width, size + 14);
                const b = s.bitmap; b.clear();
                if (!text) return;
                if (plate) {                                                // a small dark name plate with a wooden edge
                    b.fillRect(0, 0, width, b.height, 'rgba(70,46,28,0.95)');
                    b.fillRect(2, 2, width - 4, b.height - 4, 'rgba(18,10,20,0.92)');
                }
                b.fontFace = $gameSystem.mainFontFace(); b.fontSize = size;
                b.outlineColor = 'rgba(0,0,0,1)'; b.outlineWidth = plate ? 3 : 4; b.textColor = color || '#ffffff';
                b.drawText(text, 2, 1, width - 4, size + 12, 'center');
                s._tw = Math.min(width, b.measureTextWidth(text) + 8);       // the drawn name's width (spacing, decision 94)
            },
            GAP: 4, MAX_LIFT: 2,
            /** Lift a player's name above any name already placed this frame that it would overlap (decision 94). */
            space(layer, lab) {
                if (layer._coopPlacedAt !== Graphics.frameCount) { layer._coopPlacedAt = Graphics.frameCount; layer._coopPlaced = []; }
                const w = (lab._tw || 60) / 2, h = lab.bitmap ? lab.bitmap.height - 6 : 24;
                let y = lab.y;
                for (let lift = 0; lift <= this.MAX_LIFT; lift++) {
                    const hit = layer._coopPlaced.some(r => Math.abs(r.x - lab.x) < r.w + w + this.GAP && Math.abs(r.y - y) < h);
                    if (!hit) break;
                    if (lift < this.MAX_LIFT) y -= h;
                }
                lab.y = y;
                layer._coopPlaced.push({ x: lab.x, y, w });
            },
            namesOn() { return !(typeof ConfigManager !== 'undefined' && ConfigManager.coopNames === false); },
            doorSlot(ev) { const m = ev && ev.event && ev.event() && /^CO-OP: hallway door (\d)$/.exec(ev.event().name || ''); return m ? Number(m[1]) : 0; },
            /** Remove labels whose character sprite no longer updates (left the map, scene changed). */
            sweep(scene) {
                const l = scene && scene._coopLabels;
                if (l) l.children.slice().forEach(s => { if (s._seen !== Graphics.frameCount) { l.removeChild(s); if (s._owner) s._owner._coopLabel = null; } });
            }
        };
        const _sprCharUpdate = Sprite_Character.prototype.update;
        Sprite_Character.prototype.update = function () {
            _sprCharUpdate.call(this);
            try { this.coopUpdateLabel(); } catch (e) { if (this._coopLabel) this._coopLabel.visible = false; }   // a name over a character never stops the game
        };
        Sprite_Character.prototype.coopUpdateLabel = function () {
            const c = this._character;
            let text = null, color, size = 18, plate = false;
            if (RemoteChar && c instanceof RemoteChar) {
                if (Labels.namesOn() && this.visible && !c.isTransparent() && c._coopPeer) text = c._coopPeer.name;
            } else if (c instanceof Game_Event && Mobs.active() && Mobs.fightingName($gameMap.mapId(), c.eventId())) {
                text = 'Fighting ' + Mobs.fightingName($gameMap.mapId(), c.eventId()); color = '#ff8080'; size = 16;   // someone's battle: it hunts nobody else
            } else if (c instanceof Game_Event && Rooms.active() && $gameMap.mapId() === Rooms.MAP) {
                const slot = Labels.doorSlot(c);
                if (slot) { const who = Rooms.ownerName(slot); text = who ? who + (slot === Net.slot && !Net.isHost ? ' (you)' : '') : T.roomFree; color = who ? '#ffe9a8' : '#9a9a9a'; size = 15; plate = true; }
            }
            if (!text || Labels.hidden()) { if (this._coopLabel) this._coopLabel.visible = false; return; }
            const scene = SceneManager._scene;
            if (!(scene instanceof Scene_Map)) return;
            if (!this._coopLabel) { this._coopLabel = new Sprite(); this._coopLabel.anchor.x = 0.5; this._coopLabel.anchor.y = 1; this._coopLabel._owner = this; Labels.layer(scene).addChild(this._coopLabel); }
            const lab = this._coopLabel, zoom = Math.abs(this.worldTransform.a) || 1, tw = $gameMap.tileWidth(), th = $gameMap.tileHeight();
            Labels.draw(lab, text, size, color, plate, plate ? Math.max(40, Math.round(2 * tw * zoom) - 10) : 240);   // a plate is one door wide
            const layer = Labels.layer(scene), g = this.toGlobal(new Point(0, plate ? -Math.round(th * 1.55) : -(this.bitmap && this.bitmap.height && this.patternHeight ? this.patternHeight() : th) - 2));
            const p = layer.parent === scene ? g : layer.toLocal(g);
            lab.x = Math.round(p.x); lab.y = Math.round(p.y);
            lab.visible = this.worldVisible; lab._seen = Graphics.frameCount;
            if (!plate && lab.visible) Labels.space(layer, lab);            // close players: names one above the other, not run together
        };

        const _perfTransfer = Game_Player.prototype.performTransfer;
        Game_Player.prototype.performTransfer = function () {
            const moving = this.isTransferring();
            _perfTransfer.apply(this, arguments);
            if (moving) Scenes.entered();                                  // where I came into this map (a cutscene puts me back here)
        };
        const _canMove = Game_Player.prototype.canMove;
        Game_Player.prototype.canMove = function () { return !Net.localTrade && !Night.frozen() && _canMove.call(this); };

        // Multiplayer state must never leak into ordinary save slots.
        const _saveOk = Game_System.prototype.isSaveEnabled;
        Game_System.prototype.isSaveEnabled = function () { return (Net.state === S.MENU || (Net.state === S.PLAYING && Net.saveSlot > 0)) && _saveOk.call(this); };
        const _saveGame = DataManager.saveGame;
        DataManager.saveGame = function (id) {
            if (Net.state !== S.MENU) return Promise.reject(new Error('Saving is disabled during a multiplayer session.'));
            return _saveGame.call(this, id);
        };
    }

    if (typeof SceneManager !== 'undefined' && typeof SceneManager.push === 'function') {
        const _push = SceneManager.push;
        SceneManager.push = function (sceneClass) {
            try { if (Saves.interceptPush(sceneClass)) return; } catch (e) { Diag.err('save intercept', e); }
            return _push.apply(this, arguments);
        };
    }

    // ---- shared flags: observe the game's own self-switch / variable writes ----
    if (typeof Game_SelfSwitches !== 'undefined') {
        const _ssSet = Game_SelfSwitches.prototype.setValue;
        Game_SelfSwitches.prototype.setValue = function (key, value) {
            const before = this.value(key);
            _ssSet.call(this, key, value);
            if (Net.state === S.PLAYING && !Shared.applying && !WorldObjects.applying && !Spawns.applying && Array.isArray(key) && before !== !!value && !Spawns.objectOnly(key[0], key[1]) && !Spawns.personalEvent(key[0], key[1]) && !FirstTime.personal(key[0], key[1], key[2]))   // a change another player made is never sent back; world objects go as a whole (§7f)
                Shared.local({ k: 's', m: key[0], e: key[1], c: key[2], v: value ? 1 : 0 });
        };
    }
    if (typeof Game_Variables !== 'undefined') {
        const _varSet = Game_Variables.prototype.setValue;
        Game_Variables.prototype.setValue = function (id, value) {
            if (Net.state === S.PLAYING && CFG.sharedVars.has(id) && !Shared.applying && (Death.quiet() || Ritual.restQuiet() || LoadEvent.quiet())) return;   // one player's death or bath never respawns the world's monsters
            const before = (Net.state === S.PLAYING && CFG.sharedVars.has(id)) ? this.value(id) : null;
            _varSet.call(this, id, value);
            if (before !== null && !Shared.applying) {
                const now = this.value(id);
                if (now !== before && Shared.validValue(now)) Shared.local({ k: 'v', i: id, v: now });
            }
        };
    }
    const ONE_WAY = new Set([869, 902]);                                  // world unlocks one player's own story would turn off again (decision 72)
    if (typeof Game_Switches !== 'undefined') {
        const _swSet = Game_Switches.prototype.setValue;
        Game_Switches.prototype.setValue = function (id, value) {
            const world = Net.state === S.PLAYING && CFG.worldSwitches.has(id);
            if (world && !Shared.applying && !value && ONE_WAY.has(id) && this._data[id]) return;   // unlocked by someone: it stays unlocked
            if (world && !Shared.applying && (Death.quiet() || Ritual.restQuiet() || LoadEvent.quiet())) return;   // one player's death or bath never changes the world
            const before = world ? this.value(id) : null;
            _swSet.call(this, id, value);
            if (world && !Shared.applying && before !== this.value(id)) Shared.local({ k: 'g', i: id, v: this.value(id) ? 1 : 0 });
            // the bed turns "Sleeping" OFF at the end of the wake-up sequence: that is my part of the group sleep done
            if (id === CFG.sleepSwitch && !value && Net.rl && Net.rl.kind === 'sleep') Net.ritualDone('sleep');
        };
    }

    // ---- group sleep gate, each player's own bath and shared midnight rolls: wrap the game's own interpreter ----
    if (typeof Game_Interpreter !== 'undefined') {
        const _setup = Game_Interpreter.prototype.setup;
        Game_Interpreter.prototype.setup = function (list, eventId) {
            _setup.call(this, list, eventId);
            this._coopAuto = Spawns.isAutomatic(list, eventId);       // started by the map itself (autorun/parallel), not by a player
            this._coopDeath = Mobs.DEATH_CES.some(id => window.$dataCommonEvents && $dataCommonEvents[id] && $dataCommonEvents[id].list === list);
            if (this._coopDeath) { Mobs.died(); Scenes.noHoldUntil = Date.now() + 60000; }   // dying never waits for anyone
            const iev = eventId > 0 && window.$gameMap && $gameMap.event(eventId), intro = iev && iev._coopIntro && iev._coopIntro.list === list;
            this._coopSelf = intro ? [iev._coopIntro.m, iev._coopIntro.e] : null;   // the introduction's letters live on its own event
            if (intro) iev._coopIntro = null;
            Spawns.onSetup(this, list, eventId);                       // a resource spawner: ask the host first (§7f)
            Story.onSetup(this, list, eventId);                       // a big story moment: everyone together (§7o)
            Scenes.onSetup(this, list);                                // a cutscene: wait for everyone (§7g)
            this._coopRng = null; this._coopBath = false; this._coopGate = null;
            if (Daily.active() && Daily.isMidnightList(list)) this._coopRng = Daily.make('ce' + CFG.midnightCE);
        };
        const _setupChild = Game_Interpreter.prototype.setupChild;
        Game_Interpreter.prototype.setupChild = function (list, eventId) {
            _setupChild.call(this, list, eventId);
            const child = this._childInterpreter;
            if (child) { child._coopSceneTok = this._coopSceneTok || null; child._coopSceneRoot = false; child._coopAuto = !!this._coopAuto; child._coopDeath = child._coopDeath || !!this._coopDeath;
                         child._coopRest = !!this._coopRest || Ritual.isRestList(child._list); child._coopBath = !!this._coopBath; child._coopStory = this._coopStory || null; child._coopRngKeep = !!this._coopRngKeep; }
            if (child && !child._coopRng && Daily.active() && Spawns.SEEDED_CES.some(id => window.$dataCommonEvents && $dataCommonEvents[id] && $dataCommonEvents[id].list === child._list))
                child._coopRng = Daily.make('find|' + (window.$gameMap ? $gameMap.mapId() : 0) + '|' + this._eventId);   // the same roll in every game (decision 53)
            if (child && !child._coopRng && !this._coopRng && Daily.active() && window.$dataCommonEvents && $dataCommonEvents[92] && $dataCommonEvents[92].list === child._list)
                child._coopRng = Daily.make('sleephazard');                // the night's sleep-hazard roll, one for everyone (decision 93)
            if (this._coopRng && child && !child._coopRng) {
                const cmd = this.currentCommand();
                const id = cmd && cmd.code === 117 ? cmd.parameters[0] : 0;
                if (!this._coopKids) this._coopKids = {};
                this._coopKids[id] = (this._coopKids[id] || 0) + 1;      // 2nd call of the same common event gets its own stream
                let path = this._coopRng.path + '>' + id + '#' + this._coopKids[id];
                // the night's luck die (CE36) and what it brings (dice math, luck check, its buffs and debuffs, the Gift
                // Demon's gift): each player's own roll (user, 2026-11-04: "every player gets their own affects during the
                // night after the roll"). Seeded with the character, so a player's roll is still fixed for that night.
                if (id === Daily.LUCK_DIE_CE && path.startsWith('ce' + CFG.midnightCE)) path += '|' + Daily.me();
                child._coopRng = Daily.make(path);
            }
        };
        const _update = Game_Interpreter.prototype.update;
        Game_Interpreter.prototype.update = function () {
            if (this._coopSpawn && !Spawns.canRun(this)) return;
            Spawns.stack.push(this);
            try {
                if (this._coopRng) {
                    const saved = Math.random; Math.random = this._coopRng.fn;
                    try { _update.call(this); } finally { Math.random = saved; }
                } else _update.call(this);
            } finally { Spawns.stack.pop(); }
            if (this._coopSpawn && !this.isRunning()) Spawns.finish(this);
            if (this._coopSceneTok && this._coopSceneRoot && !this.isRunning()) Scenes.finish(this);
        };
        const _exec = Game_Interpreter.prototype.executeCommand;
        Game_Interpreter.prototype.executeCommand = function () {
            if (!Opening.mayRun(this)) return false;                        // the opening movie waits until everyone made their character (§7k)
            if (!Festival.mayRun(this)) return false;                       // the "Egg" Hunt starts when everyone is by the Mayor (§7l)
            if (this._coopStory && !Story.mayRun(this)) return false;       // a big story moment starts when everyone is there (§7o)
            if (this._coopStory && this._coopStory.lead !== Net.selfId) {   // a follower: a question (alone or after its text) waits for the lead's answer
                const c = this.currentCommand(), next = this._list && this._list[this._index + 1];
                if (c && (c.code === 102 || (c.code === 101 && next && next.code === 102)) && !$gameMessage.isBusy() && Story.choice(this) === false) return false;
            }
            if (this._coopSceneTok && !Scenes.mayRun(this)) return false;   // a cutscene's first message waits for everyone (§7g)
            return _exec.apply(this, arguments);
        };
        const _117 = Game_Interpreter.prototype.command117;
        Game_Interpreter.prototype.command117 = function (params) {
            if (params[0] === Night.MISSED_CE && Night.skipMissedSleep()) return true;
            if ((params[0] === CFG.bathCE || params[0] === Home.BED_CE) && !Home.mayUse(this, params[0])) return true;   // someone else's bed/tub (decision 56)
            if (params[0] === CFG.bathCE && Net.isPlaying()) this._coopBath = true;   // each player's own bath: it changes only them (decision 130)
            if (Ritual.WORLD_CES.includes(params[0]) && Ritual.inBath(this)) return true;   // a bath never respawns the world's resources or monsters
            return _117.call(this, params);
        };
        const _301 = Game_Interpreter.prototype.command301;
        Game_Interpreter.prototype.command301 = function (params) {
            if (!$gameParty.inBattle()) {
                if (Duel.isTogether(this)) { if (!Duel.ready(this, params)) return false; }   // a big moment's battle: everyone's (§7o)
                else if (Duel.fieldable() || this._coopDuel) {                  // any other battle: whoever is near joins (decision 62)
                    if (!Duel.fieldReady(this, params)) return false;
                    const d = this._coopDuel; this._coopDuel = null;
                    if (d && $dataTroops[d.tid]) { params = [0, d.tid, params[2], params[3]]; Pack.pending = Pack.clean(d.tx); }   // the troop resolved once, here (+ the monsters that joined)
                }
            }
            return _301.call(this, params);
        };
        const _123 = Game_Interpreter.prototype.command123;
        Game_Interpreter.prototype.command123 = function (params) { if (Mobs.keepAlive(this, 123, params)) return true; return Intros.asIntro(this, () => _123.call(this, params)); };
        const _111i = Game_Interpreter.prototype.command111;
        Game_Interpreter.prototype.command111 = function (params) { return params[0] === 2 ? Intros.asIntro(this, () => _111i.call(this, params)) : _111i.call(this, params); };
        const _214 = Game_Interpreter.prototype.command214;
        Game_Interpreter.prototype.command214 = function (params) { if (Mobs.keepAlive(this, 214, params)) return true; return _214.call(this, params); };
        const _121 = Game_Interpreter.prototype.command121;
        Game_Interpreter.prototype.command121 = function (params) {
            // [startId, endId, 0=ON]: the bed switching "Sleeping" ON, after the player confirmed "Yes"
            if (params[2] === 0 && params[0] <= CFG.sleepSwitch && CFG.sleepSwitch <= params[1]) {
                if (Ritual.gate(this, 'sleep') === false) return false;
            }
            return _121.call(this, params);
        };
        // the shared clock (decisions 14, 16): in a session only the host's night/morning/REST RESET events may pause it; joiners never pause or resume it
        const _357 = Game_Interpreter.prototype.command357;
        Game_Interpreter.prototype.command357 = function (params) {
            if (Duel.on && params[0] === 'VisuMZ_1_BattleCore' && /^ActSeq_/.test(String(params[1])) && params[3] && typeof params[3] === 'object') {
                const subj = BattleManager._subject, to = subj && subj.isActor() && !Duel.ally ? 'user' : 'all targets';
                let changed = false; const args = Object.assign({}, params[3]);
                Object.keys(args).forEach(k => {
                    if (!/^Targets/.test(k)) return;
                    try { const l = JSON.parse(args[k]); if (Array.isArray(l) && l.includes('alive actors')) { args[k] = JSON.stringify(l.map(x => x === 'alive actors' ? to : x)); changed = true; } } catch (e) { /* not a list */ }
                });
                if (changed) params = [params[0], params[1], params[2], args];
            }
            if (Night.active() && !Net.isHost && params[0] === 'DK_Game_Time' && params[1] === 'GameTimeSet' && Night.inPrologue()) return true;   // the forest keeps setting 1:00: the clock is the host's
            if (Night.active() && params[0] === 'DK_Game_Time' && (params[1] === 'PauseGameTime' || params[1] === 'ResumeGameTime')) {
                if (Net.isHost && params[1] === 'ResumeGameTime') { Night.localPaused = false; Night.enforce(); }        // resuming is always fine (WTE resumes after the morning from other events)
                else if (Net.isHost && Night.allowedPause(this)) { Night.localPaused = true; if (Night.inPrologue()) Night.prologuePause = true; Night.enforce(); }
                return true;
            }
            return _357.call(this, params);
        };
        const _122 = Game_Interpreter.prototype.command122;
        Game_Interpreter.prototype.command122 = function (params) {
            if (Net.state === S.PLAYING && params[0] <= CFG.bedCounterVar && CFG.bedCounterVar <= params[1] && window.$gameVariables)
                Ritual.bedCounterBefore = window.$gameVariables.value(CFG.bedCounterVar);   // restored if the player cancels the group-sleep wait
            return _122.call(this, params);
        };
    }

    // ---- shared wallet (decision 11) ----
    const Wallet = {
        applying: false,
        /** The shared total from the host. Written directly (gainGold would count it again in WTE's lifetime-gold
         *  achievements), then WTE's HUD is told, because it only redraws the gold when gainGold signals it. */
        set(g) {
            if (!window.$gameParty) return;
            const v = Math.max(0, Math.min(g, $gameParty.maxGold()));
            if (v === $gameParty._gold) return;
            this.applying = true;
            try { $gameParty._gold = v; } finally { this.applying = false; }
            try { if (typeof UltraTriggerManager !== 'undefined' && UltraTriggerManager.onGoldChange) UltraTriggerManager.onGoldChange(); } catch (e) { /* HUD optional */ }
            const w = SceneManager._scene && SceneManager._scene._goldWindow;   // an open shop/menu gold window
            if (w && w.refresh) w.refresh();
        },
        /** A local change of the wallet: the host tells everyone the new total; a joiner tells the host how much changed. */
        changed(delta) {
            if (this.applying || !delta || !Night.active()) return;
            if (Net.isHost) Net.broadcast({ t: 'GOLD', g: $gameParty.gold() });
            else if (!Night.running.midnight) Net.send(Net.hostId, { t: 'GOLDD', d: delta });   // midnight's money is the host's (it runs everywhere)
        }
    };
    if (typeof Game_Party !== 'undefined') {
        const _gainGold = Game_Party.prototype.gainGold;
        Game_Party.prototype.gainGold = function (amount) {
            const before = this._gold;
            _gainGold.apply(this, arguments);
            if (this === window.$gameParty && Story.followerRun() && !Wallet.applying) { this._gold = before; return; }   // the lead's run gives it (decision 59)
            if (this === window.$gameParty) Wallet.changed(this._gold - before);
        };
    }
    // ---- shared placed objects (§7d) ----
    // PKD's own network mode is NOT switched on: in that mode it turns off object timers, furniture dragging and needs
    // KDCore (not shipped). Placing and picking up are caught here instead, and the receiving side is WorldObjects.
    if (typeof PKD_EPManager !== 'undefined' && typeof PKD_PocketEvents !== 'undefined') {
        const _placeOn = PKD_EPManager.PlaceItemOn;
        PKD_EPManager.PlaceItemOn = function (x, y) {
            const sp = $gameTemp._epSpawned, e = sp ? sp.eventId() : 0, m = $gameMap.mapId(), my = sp ? sp.epMY : 0;
            const r = _placeOn.apply(this, arguments);
            const row = WorldObjects.active() && e && WorldObjects.db(m).find(d => d && d[3] === e);
            if (row && isInt(row[0], 0, 9999)) {
                let u = row.length > 5 ? String(row[row.length - 1]) : null;
                if (!u) { u = WorldObjects.newUid(m); row.push(u); }                 // everyone finds this object by this id
                const ev = $gameMap.event(e), d = ev && [2, 4, 6, 8].includes(ev.direction()) ? ev.direction() : 2;
                WorldObjects.emit('place', { m, e, item: row[0], x: row[1], y: row[2], u, my: isNum(my, -999, 999) ? my : 0, d });
                WorldObjects.lastMove.set(m + ',' + e, row[1] + ',' + row[2] + ',' + row[4]);
            }
            return r;
        };
        const _pickUp = PKD_EPManager.PickUpPlacedItemByEvent;
        PKD_EPManager.PickUpPlacedItemByEvent = function (eventId) {
            const m = $gameMap.mapId(), had = WorldObjects.db(m).some(d => d && d[3] === eventId), u = WorldObjects.uidOf(m, eventId);
            const r = _pickUp.apply(this, arguments);
            if (had && !WorldObjects.db(m).some(d => d && d[3] === eventId)) WorldObjects.emit('remove', { m, e: eventId, u });
            return r;
        };
        // the clock and the world keep running in co-op (decision 16): placing or dragging never pauses the map
        const _epStart = PKD_EPManager.Start;
        PKD_EPManager.Start = function () { const r = _epStart.apply(this, arguments); if (WorldObjects.active()) $gameTemp.pPauseMap = false; return r; };
        if (typeof Scene_Map !== 'undefined') {
            const _loaded = Scene_Map.prototype.onMapLoaded;
            Scene_Map.prototype.onMapLoaded = function () { _loaded.apply(this, arguments); if (WorldObjects.active()) WorldObjects.flushPending(); };
        }
        if (typeof Game_System !== 'undefined' && Game_System.prototype.pRemoveEPItem) {
            const _rem = Game_System.prototype.pRemoveEPItem;
            Game_System.prototype.pRemoveEPItem = function (mapId, eventId) {
                const uid = WorldObjects.uidOf(mapId, eventId);                // PKD loses it here; the remove message needs it
                if (uid) WorldObjects.removedUid.set(mapId + ',' + eventId, uid);
                const r = _rem.apply(this, arguments);
                const converting = window.$gameTemp && ($gameTemp._wtePayload || (Array.isArray($gameTemp._wteConvertQueue) && $gameTemp._wteConvertQueue.length));
                if (converting && uid && Net.isHost && WorldObjects.active() && !WorldObjects.applying) WorldObjects.emit('remove', { m: mapId, e: eventId, u: uid });   // the host's Hard Rebake (decision 90)
                return r;
            };
            if (typeof window.WTE_ExecuteSurrogate === 'function') {        // the stand-in became the furniture: send the finished piece (decision 91)
                const _exec = window.WTE_ExecuteSurrogate;
                window.WTE_ExecuteSurrogate = function (galvEventId) {
                    const r = _exec.apply(this, arguments);
                    try {
                        const m = window.$gameMap ? $gameMap.mapId() : 0, d = m && Spawns.saved(m)[galvEventId];
                        if (d && d.id >= 10000 && Spawns.active() && Net.isHost) Spawns.queueSpawn({ m, e: Number(galvEventId), id: d.id, x: d.x, y: d.y, self: Spawns.selfOf(m, galvEventId) });
                    } catch (e) { Diag.err('converted furniture', e); }
                    return r;
                };
            }
            ['WTE_ConvertAllMap', 'WTE_ConvertRadius'].forEach(name => {   // a joiner's game never converts shared furniture (decision 90)
                const orig = window[name];
                if (typeof orig !== 'function') return;
                window[name] = function () {
                    if (Net.isPlaying() && !Net.isHost) { Diag.log('info', 'furniture conversion (' + name + ') left to the host'); return; }
                    return orig.apply(this, arguments);
                };
            });
            const _upd = Game_System.prototype.pUpdateEPItem;
            Game_System.prototype.pUpdateEPItem = function (mapId, eventId) {
                const r = _upd.apply(this, arguments);
                const row = WorldObjects.db(mapId).find(d => d && d[3] === eventId);
                if (row && WorldObjects.active() && !WorldObjects.applying) {        // furniture dragged to a new spot
                    const key = mapId + ',' + eventId, now = row[1] + ',' + row[2] + ',' + row[4];
                    if (WorldObjects.lastMove.get(key) !== now) {
                        const first = !WorldObjects.lastMove.has(key);
                        WorldObjects.lastMove.set(key, now);
                        if (!first) WorldObjects.emit('move', { m: mapId, e: eventId, u: WorldObjects.uidOf(mapId, eventId), x: row[1], y: row[2], d: [2, 4, 6, 8].includes(row[4]) ? row[4] : 2 });
                    }
                }
                return r;
            };
        }
    }
    // a placed object's self switches / self variables are World (§2.1): a chest must point at the same container everywhere
    if (typeof Game_SelfSwitches !== 'undefined') {
        const placedKey = key => {
            if (!WorldObjects.active() || WorldObjects.applying || Shared.applying || !Array.isArray(key) || !window.$gameMap) return null;
            if (key[0] !== $gameMap.mapId()) return !Spawns.applying && Spawns.farmEvent(key[0], key[1]) ? { m: key[0], e: key[1], u: null } : null;   // farm/ranch work from elsewhere (buying an animal)
            const ev = $gameMap.event(key[1]);
            if (WorldObjects.isPlaced(ev)) return { m: key[0], e: key[1], u: WorldObjects.uidOf(key[0], key[1]) };
            if (Spawns.objectChanged(key[0], key[1])) return null;          // a world object: its final state is sent when its use ends
            return !Spawns.applying && !(Spawns.rolling && ev && ev.isSpawnEvent) && Spawns.sharedEvent(key[0], key[1]) ? { m: key[0], e: key[1], u: null } : null;   // spawned resources, crop plots, world objects (§7f); a roll's own spawns go with the roll

        };
        const _ss = Game_SelfSwitches.prototype.setValue;
        Game_SelfSwitches.prototype.setValue = function (key, value) {
            const before = this.value(key);
            _ss.apply(this, arguments);
            const k = !!value !== !!before && placedKey(key);
            if (k && /^[A-D]$/.test(String(key[2])) && !FirstTime.personal(key[0], key[1], key[2])) WorldObjects.queueSelf(Object.assign(k, { k: 's', c: key[2], v: value ? 1 : 0 }));
        };
        if (Game_Variables.prototype.setSelfValue) {
            const _sv = Game_Variables.prototype.setSelfValue;
            Game_Variables.prototype.setSelfValue = function (key, value) {
                const before = this.selfValue ? this.selfValue(key) : undefined;
                _sv.apply(this, arguments);
                const after = this.selfValue ? this.selfValue(key) : value;
                const named = typeof after === 'string' && after.length <= 40;   // a name: the pets' and ranch animals' names live in their events' self variables (coverage search 2026-11-02)
                const k = after !== before && (typeof (after || 0) === 'number' || named) && placedKey(key);
                if (k && isInt(Number(key[2]), 1, 9999) && !Mysteries.spawnedHere(key[0], key[1]) && !FirstTime.ownSv(key[0], key[1], key[2])) WorldObjects.queueSelf(Object.assign(k, { k: 'v', c: Number(key[2]), v: after || 0 }));
            };
        }
    }
    // events WTE's anti-lag froze keep their old page when a switch changes (they never catch up until the map is
    // entered again). In a session switches change all the time while players stand on a map (another player opens a
    // gate, the hunt starts, a festival begins at midnight): after each map refresh, a frozen event whose page should
    // now be another is woken for one frame and refreshed (decision 53). The map's own refresh never reaches them: the
    // anti-lag hides frozen events from events(). Single player is unchanged.
    if (typeof Game_Map !== 'undefined') {
        const _mapRefresh = Game_Map.prototype.refresh;
        Game_Map.prototype.refresh = function () {
            _mapRefresh.apply(this, arguments);
            if (!Net.isPlaying()) return;
            (this._events || []).forEach(ev => {                           // all of them: the anti-lag hides frozen events from events()
                if (!ev || ev._erased || !ev._wteIsFrozen || !ev.event() || ev.findProperPageIndex() === ev._pageIndex) return;
                ev._wteWakeTimer = Math.max(ev._wteWakeTimer || 0, 1);
                ev.refresh();
            });
        };
    }
    // shared resources and crops (§7f): GALV's spawn/unspawn during play, crop type changes, map entry, crop growth rolls
    if (typeof Game_Map !== 'undefined' && Game_Map.prototype.spawnEvent && Game_Map.prototype.unspawnEvent) {
        const _spawn = Game_Map.prototype.spawnEvent;
        Game_Map.prototype.spawnEvent = function (id, x, y, save) {
            if (save && Spawns.suppressed(this._mapId)) return;              // another player's game makes this map's automatic spawns
            const r = _spawn.apply(this, arguments);
            const e = this._lastSpawnEventId;
            if (save && Spawns.active() && !Spawns.surrogate(id) && this._events[e] && this._savedSpawnedEvents[this._mapId] && this._savedSpawnedEvents[this._mapId][e])
                Spawns.queueSpawn({ m: this._mapId, e, id: Number(id), x: Number(x), y: Number(y) });
            return r;
        };
        const _unspawn = Game_Map.prototype.unspawnEvent;
        Game_Map.prototype.unspawnEvent = function (eId) {
            if (Spawns.suppressed(this._mapId) && this._events[eId] && this._events[eId].isSavedEvent) return;
            const d = this._savedSpawnedEvents && this._savedSpawnedEvents[this._mapId] && this._savedSpawnedEvents[this._mapId][eId];
            const r = _unspawn.apply(this, arguments);
            if (d && Spawns.active()) { Spawns.emit('unsp', { m: this._mapId, e: Number(eId), id: Number(d.id) }); Diag.log('info', 'picked up: map ' + this._mapId + ' event ' + eId + ' (kind ' + d.id + ')'); }
            return r;
        };
    }
    if (typeof Game_Event !== 'undefined') {
        const _erase = Game_Event.prototype.erase;
        Game_Event.prototype.erase = function () {
            const share = !this._erased && !this.isSpawnEvent && Spawns.active() && !Spawns.applying && !Spawns.inAuto()
                && Spawns.onMap(this._mapId) && Spawns.sharedEvent(this._mapId, this._eventId);
            const r = _erase.apply(this, arguments);
            if (share) { Spawns.emit('erase', { m: this._mapId, e: this._eventId }); Diag.log('info', 'taken: map ' + this._mapId + ' event ' + this._eventId); }
            return r;
        };
    }
    if (typeof Sprite_ActionIcon !== 'undefined') {                     // never draw the action icon over an event that is gone
        const _aiUpdate = Sprite_ActionIcon.prototype.update;
        Sprite_ActionIcon.prototype.update = function () {
            const t = window.$gamePlayer && $gamePlayer.actionIconTarget;
            if (t && t.eventId > 0 && window.$gameMap && !$gameMap.event(t.eventId)) { t.eventId = 0; t.iconId = 0; }
            return _aiUpdate.apply(this, arguments);
        };
    }
    if (typeof Game_System !== 'undefined' && Game_System.prototype.cgmzSetDynamicClone) {
        const _setDc = Game_System.prototype.cgmzSetDynamicClone, _clrDc = Game_System.prototype.cgmzClearDynamicClone;
        const dcChanged = (m, e, t) => { if (Spawns.active() && !Spawns.applying && !Spawns.rolling && !Spawns.quiet(m) && Spawns.sharedEvent(m, e)) Spawns.emit('dc', { m, e, tp: t }); };
        Game_System.prototype.cgmzSetDynamicClone = function (mapId, eventId, templateId) {
            const before = this.cgmzGetDynamicClone(mapId, eventId);
            const r = _setDc.apply(this, arguments);
            if (before !== templateId && isInt(Number(templateId), 1, 9999)) dcChanged(mapId, eventId, Number(templateId));
            return r;
        };
        Game_System.prototype.cgmzClearDynamicClone = function (mapId, eventId) {
            const before = this.cgmzGetDynamicClone(mapId, eventId);
            const r = _clrDc.apply(this, arguments);
            if (before) dcChanged(mapId, eventId, 0);
            return r;
        };
    }
    if (typeof Scene_Map !== 'undefined') {
        const _loadedSp = Scene_Map.prototype.onMapLoaded;
        Scene_Map.prototype.onMapLoaded = function () {
            _loadedSp.apply(this, arguments);
            Spawns.cloneCache.clear();
            if (Spawns.active() && !Net.isHost) Net.send(Net.hostId, { t: 'SPQ', m: $gameMap.mapId(), e: 0, roll: 0 });   // this map's resources as the host has them
        };
    }
    if (typeof PluginManager !== 'undefined' && PluginManager._commands && PluginManager._commands['CropGrowthSystem:UpdateCrop']) {
        const _updCrop = PluginManager._commands['CropGrowthSystem:UpdateCrop'];
        PluginManager._commands['CropGrowthSystem:UpdateCrop'] = function (args) {
            if (!Spawns.active()) return _updCrop.call(this, args);
            // an unwatered day grows with a 50% roll: the same roll in every game (this plot, this day)
            const day = window.$gameVariables ? $gameVariables.value(Number(args && args.globalDayVar) || 250) : 0;
            const saved = Math.random; Math.random = mulberry32(hash32('crop|' + this._mapId + '|' + this._eventId + '|' + day));
            try { return _updCrop.call(this, args); } finally { Math.random = saved; }
        };
    }

    // monsters (§7h): only the owner moves a monster and runs its sensors; battles are individual
    if (typeof Game_Event !== 'undefined') {
        const _auto = Game_Event.prototype.checkEventTriggerAuto;
        Game_Event.prototype.checkEventTriggerAuto = function () {
            if (this._trigger === 3 && Scenes.deferStory(this)) return;        // the map's setup first (§7g)
            return _auto.apply(this, arguments);
        };
        const _selfMove = Game_Event.prototype.updateSelfMovement;
        Game_Event.prototype.updateSelfMovement = function () {
            if (Mobs.active() && Mobs.isMob(this) && !Mobs.owns(this._mapId, this._eventId)) return;   // the owner's positions move it here
            return _selfMove.apply(this, arguments);
        };
        if (Game_Event.prototype.wteUpdateProximityTriggers) {
            const _sense = Game_Event.prototype.wteUpdateProximityTriggers;
            Game_Event.prototype.wteUpdateProximityTriggers = function () {
                if (Mobs.active() && Mobs.isMob(this) && !Mobs.owns(this._mapId, this._eventId)) return;   // noticing me happens after the host hands it to me
                return _sense.apply(this, arguments);
            };
        }
        const _evStart = Game_Event.prototype.start;
        Game_Event.prototype.start = function () {
            if (Uses.needs(this) && !Uses.allow(this)) return;              // someone else is using this very object (§7i)
            Spawns.touchObject(this);                                       // what it does now is this player's use of it
            Fx.touch(this);                                                 // and the picture its own page puts on next
            if (Mobs.active() && Mobs.isMob(this) && [0, 1, 2].includes(this._trigger) && !Mobs.owns(this._mapId, this._eventId)) {
                if (Mobs.busy(this._mapId, this._eventId)) return;               // hunting or fighting someone else
                Mobs.owners.set(Mobs.key(this._mapId, this._eventId), { by: Net.selfId, b: '' });   // I walked into it: mine (the host confirms)
                Mobs.claim(this._mapId, this._eventId, 'touch');
            }
            return _evStart.apply(this, arguments);
        };
    }
    if (typeof Game_Interpreter !== 'undefined') {
        const _301 = Game_Interpreter.prototype.command301;
        Game_Interpreter.prototype.command301 = function (params) {
            const ev = window.$gameMap && !$gameParty.inBattle() && $gameMap.event(this._eventId);
            if (ev && Mobs.active()) Mobs.battleStarted(ev);
            return _301.apply(this, arguments);
        };
    }
    if (typeof BattleManager !== 'undefined') {
        const _endBattle = BattleManager.endBattle;
        BattleManager.endBattle = function (result) { Mobs.result = result; return _endBattle.apply(this, arguments); };
    }
    if (typeof Scene_Map !== 'undefined') {
        const _mapStart = Scene_Map.prototype.start;
        Scene_Map.prototype.start = function () { _mapStart.apply(this, arguments); if (Mobs.battle && !$gameParty.inBattle()) Mobs.afterBattle(); };
    }
    // a defeated monster (self switch A) is gone for everyone, on every map
    if (typeof Game_SelfSwitches !== 'undefined') {
        const _ssMob = Game_SelfSwitches.prototype.setValue;
        Game_SelfSwitches.prototype.setValue = function (key, value) {
            const before = this.value(key);
            _ssMob.apply(this, arguments);
            if (Array.isArray(key) && key[2] === 'A' && !!value !== before && Mobs.active() && !Mobs.applying && !Mobs.inDeath() && !WorldObjects.applying && !Shared.applying
                && window.$gameMap && key[0] === $gameMap.mapId() && Mobs.isMob($gameMap.event(key[1])))
                {
                    // its own values first (B = the respawn stamp its fight set): every game's respawn page then decides the same
                    const l = [], pre = key[0] + ',' + key[1] + ',', data = $gameVariables._selfData || {};
                    Object.keys(data).forEach(k => { const v = Number(k.slice(pre.length)); if (k.startsWith(pre) && v !== Mobs.STATE_VAR && isInt(v, 1, 9999) && isNum(data[k], -1e9, 1e9)) l.push({ m: key[0], e: key[1], u: null, k: 'v', c: v, v: data[k] }); });
                    l.push({ m: key[0], e: key[1], u: null, k: 's', c: 'A', v: value ? 1 : 0 });
                    WorldObjects.emit('selfs', { l });   // at once, before the monster is freed
                    Diag.log('info', 'monster ' + (value ? 'defeated' : 'back') + ': map ' + key[0] + ' event ' + key[1] + ' (sent)');
                }
        };
    }
    // the shared clock never stops for the host's battles, menus, shops or messages (only the night's own events hold it)
    if (typeof Scene_Map !== 'undefined' && Scene_Map.prototype.isGameTimeUpdated) {
        const _timeOk = Scene_Map.prototype.isGameTimeUpdated;
        Scene_Map.prototype.isGameTimeUpdated = function () { return (Net.isHost && Net.world && Net.isPlaying()) || _timeOk.apply(this, arguments); };
    }
    if (typeof Scene_Base !== 'undefined' && typeof Game_Time !== 'undefined' && Game_Time.update) {
        const _sceneUpd = Scene_Base.prototype.update;
        Scene_Base.prototype.update = function () {
            _sceneUpd.apply(this, arguments);
            // (the host's off-map clock is the session's "clock in menu" ticker; a second tick here doubled its speed, decision 93)
        };
    }

    // each player's room keeps its own things (user, 2026-11-04: "the house chests should be individual and only contain the
    // items of the players"): WTE's every Storage chest opens the one main Storage (container 1, CE963) and every fridge and
    // stove the one food storage (container 4), so in co-op each room's chest and fridge were the whole house's. A Storage
    // chest in a room opens that room's own storage, and a fridge, cooking pot or oven in a room its own fridge. The farm
    // chest and everything else stay the shared ones, and crafting (CE124) always pulls from the shared main Storage. Anyone
    // may open a room's chest, one player at a time per chest. The host makes the six containers once; the world keeps them.
    const RoomStores = {
        BASES: { 1: 'Storage', 4: 'Fridge' }, STORAGE_CE: 963,
        map() { const m = window.$gameSystem && $gameSystem._coopRoomStores; return m && typeof m === 'object' ? m : null; },
        valid(v) { return !!v && typeof v === 'object' && Object.keys(v).length <= 6 && Object.keys(v).every(k => /^[1-3]:[14]$/.test(k) && isInt(v[k], 1, 9999)); },
        set(v) { if (this.valid(v) && window.$gameSystem) $gameSystem._coopRoomStores = Object.assign({}, v); },
        /** The container a room's chest or fridge stands for, when the event running now is in a player's room; else 0. */
        here(base) {
            const m = this.map(); if (!m || !Rooms.active() || !window.$gameMap || $gameMap.mapId() !== Rooms.MAP) return 0;
            const it = $gameMap._interpreter, ev = it && it.isRunning() && $gameMap.event(it.eventId());
            const slot = ev ? RoomsBuild.slotAt(ev.x, ev.y) : 0;
            if (!slot || (base === 1 && !Night.isRunningCE(this.STORAGE_CE))) return 0;   // a crafting bench in a room: the shared Storage
            return m[slot + ':' + base] || 0;
        },
        redirect(id) { const b = Number(id); return (b === 1 || b === 4) && this.here(b) || id; },
        /** Host, every map frame while the rooms are on: make any room container the world doesn't have yet, then tell everyone. */
        ensure() {
            if (!Net.isHost || !Rooms.active() || !window.$gameContainers || !window.$gameSystem || typeof $gameContainers.createContainer !== 'function') return;
            const m = this.map() || {}; let made = false;
            [1, 2, 3].forEach(slot => Object.keys(this.BASES).forEach(b => {
                const k = slot + ':' + b; if (m[k] && $gameContainers._containers[m[k] - 1]) return;
                $gameContainers.createContainer('\\c[2]' + this.BASES[b], 0, 0, false, 0);
                m[k] = $gameContainers._containers.length; made = true;
            }));
            if (!made) return;
            $gameSystem._coopRoomStores = m;
            Diag.log('info', 'players\' rooms: own storage and fridge made (' + JSON.stringify(m) + ')');
            WorldObjects.emit('rstores', { v: m });
        }
    };

    // chests: one player at a time (interact lock), contents sent when it closes or changes by script
    if (typeof Game_Containers !== 'undefined') {
        const _open = Game_Containers.prototype.openContainer;
        Game_Containers.prototype.openContainer = function (id) {
            id = RoomStores.redirect(id); arguments[0] = id;                   // a room's chest or fridge: that room's own
            const own = FirstTime.personalCont(id), l = !own && WorldObjects.active() && WorldObjects.lockHolder(id);
            if (l) { try { SoundManager.playBuzzer(); } catch (e) { /* optional */ } Diag.toast('In use by ' + (l.name || 'another player') + '.', 2500); return; }
            if (!own) WorldObjects.lock(id, true);
            WorldObjects.openId = own ? 0 : id;
            return _open.apply(this, arguments);
        };
        const _create = Game_Containers.prototype.createContainer;
        Game_Containers.prototype.createContainer = function () {
            const r = _create.apply(this, arguments);
            WorldObjects.sendContainer(this._containers.length);              // a new chest's container exists for everyone
            return r;
        };
        ['addItemToContainer', 'addWeaponToContainer', 'addArmorToContainer'].forEach(fn => {
            const orig = Game_Containers.prototype[fn];
            if (orig) Game_Containers.prototype[fn] = function (containerId) { const r = orig.apply(this, arguments); WorldObjects.sendContainer(Number(containerId)); return r; };
        });
        if (typeof Scene_Container !== 'undefined') {
            const _term = Scene_Container.prototype.terminate;
            Scene_Container.prototype.terminate = function () {
                _term.apply(this, arguments);
                const id = WorldObjects.openId || $gameContainers.tempId;
                WorldObjects.openId = 0;
                if (id) { WorldObjects.sendContainer(id); WorldObjects.lock(id, false); }
            };
        }
    }

    // shops: what one player buys or sells changes the stock for everyone (§7j)
    if (typeof Game_Shop !== 'undefined') {
        ['buyItem', 'sellItem', 'eraseItemEntry'].forEach(fn => {
            const o = Game_Shop.prototype[fn];
            if (o) Game_Shop.prototype[fn] = function (item) {
                if (fn === 'buyItem' && item && this._coreShops[this._tempShopId]) {   // a personal item: the stock it had before is kept for new players
                    const s = this._coreShops[this._tempShopId], n = (s._storedDataContents || []).findIndex(d => d && d.itemId === item.id && d.etypeId === item.etypeId);
                    if (n >= 0) Progress.noteBase(this._tempShopId, s._storedDataContents[n], s._storedContents[n]);
                }
                const r = o.apply(this, arguments); Progress.shopDirty(this._tempShopId); return r;
            };
        });
        ['setItemShopStock', 'addItemToShop', 'setWeaponShopStock', 'addWeaponToShop', 'setArmorShopStock', 'addArmorToShop', 'clearShopContents', 'setPriceForItem', 'setPriceForWeapon', 'setPriceForArmor'].forEach(fn => {
            const o = Game_Shop.prototype[fn];
            if (o) Game_Shop.prototype[fn] = function (shopId) { const r = o.apply(this, arguments); Progress.shopDirty(Number(shopId) - 1); return r; };
        });
        // decision 64: DM removes a sold-out row; a row of my own sold out stays sold out for me
        if (Game_Shop.prototype.eraseItemEntry) {
            const _erase = Game_Shop.prototype.eraseItemEntry;
            Game_Shop.prototype.eraseItemEntry = function () {
                const s = this._coreShops && this._coreShops[this._tempShopId];
                if (s) (s._storedDataContents || []).forEach((d, n) => { const it = (s._storedContents || [])[n]; if (d && d.amount === 0 && it && it.infinite === false && Progress.isPersonalRow(d, it)) Progress.removed.add(this._tempShopId + ':' + d.itemId); });
                return _erase.apply(this, arguments);
            };
        }
        // decision 64: my story taking a row of my own out of a shop (DM: stock 0 = remove), or putting it back
        ['setItemShopStock', 'addItemToShop'].forEach(fn => {
            const o = Game_Shop.prototype[fn];
            if (o) Game_Shop.prototype[fn] = function (shopId, itemId, amount) {
                const i = Number(shopId) - 1, s = this._coreShops && this._coreShops[i], k = i + ':' + Number(itemId);
                if (fn === 'addItemToShop') Progress.removed.delete(k);
                else if (Number(amount) === 0 && s && (s._storedDataContents || []).some((d, n) => d && d.itemId === Number(itemId) && Progress.isPersonalRow(d, (s._storedContents || [])[n]))) Progress.removed.add(k);
                return o.apply(this, arguments);
            };
        });
    }
    // crafting takes everything from the chests and puts the rest back: only chests nobody else is using, held until put back
    if (typeof Game_Containers !== 'undefined' && Game_Containers.prototype.takeAllContainersContents) {
        const _take = Game_Containers.prototype.takeAllContainersContents, _put = Game_Containers.prototype.putBackContainersContents;
        Game_Containers.prototype.takeAllContainersContents = function (containerIds) {
            if (containerIds !== undefined) containerIds = String(containerIds).split(',').map(i => RoomStores.redirect(i)).join(',');   // cooking in a room: from its own fridge
            if (!WorldObjects.active()) return _take.call(this, containerIds);
            const ids = String(containerIds === undefined ? '' : containerIds).split(',').map(Number).filter(i => isInt(i, 1, 9999)), mine = [];
            let busy = '';
            ids.forEach(i => { const l = WorldObjects.lockHolder(i); if (l) busy = busy || l.name || 'another player'; else mine.push(i); });
            if (busy) Diag.toast(busy + ' is using some of the storage: crafting uses the rest.', 3000);
            mine.forEach(i => WorldObjects.lock(i, true));
            Progress.drawn = Progress.drawn.concat(mine);
            if (!mine.length) { this._storedContainerContents = this._storedContainerContents || []; return; }
            return _take.call(this, mine.join(','));
        };
        Game_Containers.prototype.putBackContainersContents = function () {
            const r = _put.apply(this, arguments);
            const ids = Progress.drawn; Progress.drawn = [];
            ids.forEach(i => { WorldObjects.sendContainer(i); WorldObjects.lock(i, false); });   // what was used is gone for everyone
            return r;
        };
    }

    if (typeof PluginManager !== 'undefined' && PluginManager.registerCommand) {
        PluginManager.registerCommand(PLUGIN, 'Trade', () => tradeWithNearest());
        const chestCmd = op => args => {
            if (!Net.chestOp(op, args.chestId, args.kind, Number(args.id), Number(args.amount))) $gameMessage.add('Chest request refused.');
        };
        PluginManager.registerCommand(PLUGIN, 'ChestDeposit', chestCmd('deposit'));
        PluginManager.registerCommand(PLUGIN, 'ChestWithdraw', chestCmd('withdraw'));
    }

    // ---- story bosses: beaten once for the world; nobody who missed it fights it alone (decision 73) ----
    const Bosses = {
        BOSS_CE: 521, MOMENT_CE: 2738, WIN_CE: 27, TROOP_VAR: 22, NOT_BOSS: new Set([117]), MAX_HP: 250, SUM_HP: 450, KEY: /^\d{1,4},\d{1,5},\d{1,4}$/,
        list: {}, lastBroadcast: 0, battles: 0,
        reset() { this.list = {}; this.lastBroadcast = 0; this.battles = 0; },   // a session ended: another world's records never carry over (decision 90)                            // battles: how many battles have started (any)
        world() { const s = window.$gameSystem; if (!s) return {}; if (!s._coopBosses || typeof s._coopBosses !== 'object') s._coopBosses = {}; return s._coopBosses; },
        all() { return Net.isHost ? this.world() : this.list; },
        me() { return Net.isHost ? 'host' : String(Net.playerId || ''); },
        troopOf(params) { return params[0] === 0 ? params[1] : params[0] === 1 ? $gameVariables.value(params[1]) : 0; },
        staged(l) { return Array.isArray(l) && l.some(c => c && c.code === 117 && (c.parameters[0] === this.BOSS_CE || c.parameters[0] === this.MOMENT_CE)); },
        strong(tid) {
            const hp = ($dataTroops[tid].members || []).map(m => (($dataEnemies[m.enemyId] || {}).params || [0])[0] || 0);
            return Math.max(0, ...hp) >= this.MAX_HP || hp.reduce((a, b) => a + b, 0) >= this.SUM_HP;
        },
        /** This battle command is a story boss: on my own story's event, staged as a boss or strong. */
        isBoss(interp, tid) {
            if (!isInt(tid, 1, 9999) || this.NOT_BOSS.has(tid) || !window.$dataTroops || !$dataTroops[tid] || !window.$gameMap) return false;
            const m = interp._mapId, e = interp._eventId;
            if (!(e > 0) || m !== $gameMap.mapId() || Scenes.TUTORIAL_MAPS.includes(m) || Scenes.OPENING.maps.includes(m) || !Spawns.personalEvent(m, e)) return false;
            const ev = $gameMap.event(e), p = ev && ev.page();
            return this.staged(interp._list) || (!!p && this.staged(p.list)) || this.strong(tid);
        },
        key(interp, tid) { return interp._mapId + ',' + interp._eventId + ',' + tid; },
        /** Beaten in the world without me: { names } (else null). */
        missed(k) { const r = this.all()[k]; return r && Array.isArray(r.ids) && !r.ids.includes(this.me()) ? r : null; },
        name(tid) {
            const t = $dataTroops[tid], best = (t.members || []).map(m => $dataEnemies[m.enemyId]).filter(Boolean).sort((a, b) => b.params[0] - a.params[0])[0];
            return best ? best.name : t.name;
        },
        /** I won it: the host writes it down with who was there. */
        won(k) { this.send({ t: 'BOSSWON', k }); },
        send(m) { if (Net.isHost) this.onHost(Net.selfId, m); else Net.send(Net.hostId, m); },
        onHost(from, m) {
            if (typeof m.k !== 'string' || !this.KEY.test(m.k)) return;
            const map = Number(m.k.split(',')[0]), w = this.world(), r = w[m.k] || { ids: [], names: [], day: Gates.today() };
            const add = (id, name) => { if (id && !r.ids.includes(id)) { r.ids.push(id); r.names.push(cleanStr(name, 24) || 'a player'); } };
            if (from === Net.selfId || $gameMap.mapId() === map) add('host', hostName(Net));
            Net.peers.forEach((p, id) => { if (p && (id === from || (!p.loading && p.state && p.state.map === map))) add(p.playerId, p.name); });
            const was = JSON.stringify(w[m.k] || null); w[m.k] = r;
            if (JSON.stringify(r) !== was) { this.lastBroadcast = 0; Diag.log('info', 'boss ' + m.k + ' defeated by ' + r.names.join(', ')); }
        },
        tick(now) { if (Net.isPlaying() && Net.isHost && now - this.lastBroadcast > 10000) { this.lastBroadcast = now; Net.broadcast({ t: 'BOSSES', w: this.world() }); } },
        onList(w) {
            const o = {};
            Object.keys(w).slice(0, 500).forEach(k => { const r = w[k]; if (this.KEY.test(k) && r && Array.isArray(r.ids) && Array.isArray(r.names) && r.ids.length <= 8 && r.ids.every(x => typeof x === 'string' && x.length <= 40)) o[k] = { ids: r.ids, names: r.names.slice(0, 8).map(n => cleanStr(String(n), 24)) }; });
            this.list = o;
        },
        /** Its battle counts as won for me: what the battle itself marks (its "slain" switches, which the story checks after it), and who beat it. */
        skip(k, r, tid) {
            ($dataTroops[tid].pages || []).forEach(p => (p.list || []).forEach(c => {
                if (c.code === 121 && c.parameters[2] === 0) for (let i = c.parameters[0]; i <= c.parameters[1]; i++) if (/slain|beaten/i.test(($dataSystem.switches || [])[i] || '')) $gameSwitches.setValue(i, true);
            }));
            const who = r.names.length > 1 ? r.names.slice(0, -1).join(', ') + ' and ' + r.names[r.names.length - 1] : (r.names[0] || 'Someone');
            Chat.system(who + ' already defeated ' + this.name(tid) + '. It counts as won for you.');
            Diag.log('info', 'boss ' + k + ' already defeated by ' + who + ': counted as won');
        }
    };
    if (typeof Game_Interpreter !== 'undefined') {
        const _301boss = Game_Interpreter.prototype.command301;
        Game_Interpreter.prototype.command301 = function (params) {
            let boss = null;
            if (Net.isPlaying() && !$gameParty.inBattle()) {
                const tid = Bosses.troopOf(params);
                if (Bosses.isBoss(this, tid)) {
                    const k = Bosses.key(this, tid);
                    let d = this._coopBossCall;                                // decided once per battle command (it runs again while the battle gathers everyone)
                    if (!d || d.k !== k || d.at !== this._index) {
                        let r = Bosses.missed(k);
                        const ch = Story.choice(this);                         // a big moment together: the lead decides for everyone in it
                        if (ch === false) return false;                        // (a follower waits for the lead's word)
                        if (ch && ch.lead) { Story.sendChoice(this._coopStory, ch.c, r ? 1 : 0); this._coopChoiceK = undefined; }
                        else if (ch) r = ch.n === 1 ? (r || Bosses.all()[k] || { names: [] }) : null;
                        d = this._coopBossCall = { k, at: this._index, r };
                    }
                    if (d.r) {
                        this._coopBossCall = null; Bosses.skip(k, d.r, tid); this._branch[this._indent] = 0;   // the "if win" branch runs next
                        $gameVariables.setValue(Bosses.TROOP_VAR, tid);                // ...after WTE's own "Battle Win" for this boss: its loot, uniques, quest items and kill counts
                        if ($dataCommonEvents[Bosses.WIN_CE]) this.setupChild($dataCommonEvents[Bosses.WIN_CE].list, this._eventId);
                        return true;
                    }
                    boss = k;
                }
            }
            const done = _301boss.call(this, params);
            if (boss && done) { this._coopBossCall = null; this._coopBossFight = { k: boss, indent: this._indent, branch: !!(params[2] || params[3]), n: Bosses.battles }; Diag.log('info', 'story boss battle ' + boss); }
            return done;
        };
        const _pBattleStart = Game_Party.prototype.onBattleStart;
        Game_Party.prototype.onBattleStart = function () { Bosses.battles++; return _pBattleStart.apply(this, arguments); };
        // after the battle, the event's own "If Win" (or, with no branches, simply going on) says it was won
        const _execBoss = Game_Interpreter.prototype.executeCommand;
        Game_Interpreter.prototype.executeCommand = function () {
            const f = this._coopBossFight;
            if (f && !$gameParty.inBattle() && Bosses.battles > f.n) {          // only once its battle has happened
                const c = this.currentCommand(), at = !!c && [601, 602, 603].includes(c.code) && c.indent === f.indent;
                if (!f.branch || at) { this._coopBossFight = null; if (!f.branch || (c.code === 601 && this._branch[f.indent] === 0)) Bosses.won(f.k); }
            }
            return _execBoss.call(this);
        };
    }

    // ---- the Tax Man's bill is the whole farm's: the farm's storage pays it too (decision 75) ----
    const Tax = {
        CE: 947, STORAGE: '1,3', pooling: false,
        /** A command of the Tax Man's "taxes due" talk that counts or takes the crops. */
        mine(interp) { return !!window.$dataCommonEvents && !!$dataCommonEvents[this.CE] && interp._list === $dataCommonEvents[this.CE].list; },
        /** Run it with the farm's storage in my bag (borrowed like crafting does, then put back for everyone). */
        pooled(fn) {
            if (this.pooling || !WorldObjects.active() || !window.$gameContainers || !$gameContainers.takeAllContainersContents) return fn();
            this.pooling = true;
            try { $gameContainers.takeAllContainersContents(this.STORAGE); return fn(); }
            finally { try { $gameContainers.putBackContainersContents(); } finally { this.pooling = false; } }
        }
    };
    if (typeof Game_Interpreter !== 'undefined') {
        const _111tax = Game_Interpreter.prototype.command111, _355tax = Game_Interpreter.prototype.command355;
        Game_Interpreter.prototype.command111 = function (params) {
            if (params[0] === 12 && /checkItemQuantity/.test(String(params[1])) && Tax.mine(this)) return Tax.pooled(() => _111tax.call(this, params));
            return _111tax.call(this, params);
        };
        Game_Interpreter.prototype.command355 = function () {
            const c = this.currentCommand();
            if (c && /removeMatchingItems/.test(String(c.parameters[0])) && Tax.mine(this)) return Tax.pooled(() => _355tax.apply(this, arguments));
            return _355tax.apply(this, arguments);
        };
    }

    // ---- the catch-speed fishing perk (decision 91): CE78's result goes to the catch speed (V257), in a session ----
    const FishPerk = {
        VAR: 257, BAD: '$gameVariables.setValue($gameVariables.value(257), result);', fixing: false,
        /** This script command (with its continuation lines) holds the faulty line. */
        wrong(interp) {
            const l = interp._list; if (!Net.isPlaying() || !l) return false;
            for (let i = interp._index + 1; i < l.length && l[i] && l[i].code === 655; i++) if (String(l[i].parameters[0]).trim() === this.BAD) return true;
            return false;
        }
    };
    if (typeof Game_Interpreter !== 'undefined' && typeof Game_Variables !== 'undefined') {
        const _355fish = Game_Interpreter.prototype.command355;
        Game_Interpreter.prototype.command355 = function () {
            const c = this.currentCommand();
            if (!c || c.code !== 355 || !FishPerk.wrong(this)) return _355fish.apply(this, arguments);
            FishPerk.fixing = true;
            try { return _355fish.apply(this, arguments); } finally { FishPerk.fixing = false; }
        };
        const _setFish = Game_Variables.prototype.setValue;
        Game_Variables.prototype.setValue = function (id, value) {
            if (FishPerk.fixing) { FishPerk.fixing = false; id = FishPerk.VAR; }   // the script's one write
            return _setFish.call(this, id, value);
        };
    }

    // ---- protected tools in a world with others (decision 91; DM_ProtectedItemsPatch) ----
    //      WTE remembers the best tier of each tool kind a character ever owned and, on every load, gives back a kind that is
    //      in neither the bag nor any chest (into chest 1). Together the chests are everyone's: another player's tool in a
    //      chest raised my "best ever", and a tool I stored that someone else took came back to me as a copy. And an old
    //      world's one-time update (CE2836) moves every tool out of every chest into the host's bag, the others' too.
    const Tools = {
        others: null,                                   // joiner: the tool kinds another player holds a spare of (from the host at join)
        cache: new Map(),                               // host: playerId -> { data, counts } from the roster's player data
        tagOf(item) { const t = item && item.meta && item.meta['Protected Tag']; return t ? String(t).trim() : ''; },
        /** How many tools of each protected kind a bag holds. */
        countsIn(party) {
            const out = {}, add = (db, o) => Object.keys(o || {}).forEach(id => { const n = Number(o[id]) || 0, t = n > 0 && this.tagOf(db && db[id]); if (t) out[t] = (out[t] || 0) + n; });
            if (party) { add(window.$dataItems, party.items); add(window.$dataWeapons, party.weapons); add(window.$dataArmors, party.armors); }
            return out;
        },
        mine() { return this.countsIn({ items: $gameParty._items, weapons: $gameParty._weapons, armors: $gameParty._armors }); },
        /** Host: the kinds a player other than playerId holds two or more of (a spare is most likely someone else's). */
        sparesExcept(playerId) {
            const out = new Set(), add = c => Object.keys(c).forEach(t => { if (c[t] >= 2) out.add(t); });
            if (playerId !== 'host' && window.$gameParty) add(this.mine());
            ((Net.world && Net.world.roster) || []).forEach(r => {
                if (!r || r.playerId === playerId || !r.data) return;
                let c = this.cache.get(r.playerId);
                if (!c || c.data !== r.data) { let counts = {}; try { const d = JsonEx.parse(r.data); counts = this.countsIn(d && d.party); } catch (e) { /* unreadable: nothing */ } c = { data: r.data, counts }; this.cache.set(r.playerId, c); }
                add(c.counts);
            });
            return out;
        },
        spares() { return Net.isHost ? this.sparesExcept('host') : (this.others || new Set()); },
        clean(l) { return Array.isArray(l) ? new Set(l.filter(x => typeof x === 'string' && x.length <= 40).slice(0, 100)) : null; },
        /** Host, after the old-world update took every tool out of the chests: one of each kind stays in my bag (the best),
         *  the rest go back to chest 1, where their owners find them. */
        putBackSpares() {
            const counts = this.mine(), moved = [];
            Object.keys(counts).forEach(tag => {
                if (counts[tag] < 2) return;
                const ids = Object.keys($gameParty._items).map(Number).filter(id => this.tagOf($dataItems[id]) === tag && $gameParty._items[id] > 0);
                const best = ids.reduce((b, id) => (parseInt($dataItems[id].meta['Protected Tier']) || 1) > (parseInt($dataItems[b].meta['Protected Tier']) || 1) ? id : b, ids[0]);
                ids.forEach(id => {
                    const n = $gameParty._items[id] - (id === best ? 1 : 0);
                    if (n <= 0) return;
                    $gameParty.loseItem($dataItems[id], n);
                    $gameContainers.addItemToContainer(1, id, n);
                    moved.push($dataItems[id].name + ' x' + n);
                });
            });
            if (moved.length) Diag.log('info', 'old world update: spare tools back in chest 1 for their owners: ' + moved.join(', '));
        },
        reset() { this.others = null; this.cache.clear(); }
    };
    if (typeof PluginManager !== 'undefined' && PluginManager._commands) {
        const R = 'DM_ProtectedItemsPatch:restoreMissingItems', LG = 'DM_ProtectedItemsPatch:logHighestTiers';
        const restore = PluginManager._commands[R], logTiers = PluginManager._commands[LG];
        if (restore) PluginManager._commands[R] = function () {
            const all = window.$gameSystem && $gameSystem._protectedItemHighestTiers;
            if (!Net.isPlaying() || !all) return restore.apply(this, arguments);
            const spare = Tools.spares(), keep = {}, skipped = [];
            Object.keys(all).forEach(t => { if (spare.has(t)) skipped.push(t); else keep[t] = all[t]; });
            if (skipped.length) Diag.log('info', 'protected tools: not given back, another player holds a spare: ' + skipped.join(', '));
            $gameSystem._protectedItemHighestTiers = keep;
            try { return restore.apply(this, arguments); } finally { $gameSystem._protectedItemHighestTiers = all; }
        };
        if (logTiers) PluginManager._commands[LG] = function () {
            if (!Net.isPlaying() || !window.$gameContainers || !Array.isArray($gameContainers._containers)) return logTiers.apply(this, arguments);
            const c = $gameContainers._containers; $gameContainers._containers = [];     // my bag only: the chests are everyone's
            try { return logTiers.apply(this, arguments); } finally { $gameContainers._containers = c; }
        };
    }
    if (typeof window.withdrawCategoryFromAllContainers === 'function') {
        const _withdraw = window.withdrawCategoryFromAllContainers;
        window.withdrawCategoryFromAllContainers = function (category) {
            if (Net.isPlaying() && !Net.isHost) { Diag.log('info', 'withdrawing "' + category + '" from every chest is left to the host'); return; }   // the chests are everyone's
            if (!Net.isPlaying() || !window.$gameContainers || !Array.isArray($gameContainers._containers)) return _withdraw.apply(this, arguments);
            const before = $gameContainers._containers.map(c => c && Array.isArray(c.itemArray) ? c.itemArray.length : -1);
            const r = _withdraw.apply(this, arguments);
            try {
                $gameContainers._containers.forEach((c, i) => { if (c && Array.isArray(c.itemArray) && c.itemArray.length !== before[i]) WorldObjects.sendContainer(i + 1); });
                if (category === 'tool') Tools.putBackSpares();
            } catch (e) { Diag.err('old world update (tools)', e); }
            return r;
        };
    }

    // ---- equipment upgrades per player (decision 91): see the header of port2-edit ----
    const Upgrades = {
        vanilla: null,                                                  // { weapon: Map(id -> { params, traits, name }), armor: ... } at boot
        snapshot() {
            if (!window.$dataWeapons || !window.$dataArmors) return;
            const take = d => { const m = new Map(); for (let i = 1; i < d.length; i++) if (d[i]) m.set(i, { params: (d[i].params || []).slice(), traits: JSON.parse(JSON.stringify(d[i].traits || [])), name: d[i].name }); return m; };
            this.vanilla = { weapon: take($dataWeapons), armor: take($dataArmors) };
        },
        db(t) { return t === 'weapon' ? window.$dataWeapons : window.$dataArmors; },
        /** WTE's "+N" name. */
        named(base, plus) { if (!(plus > 0)) return base; const m = /(.*)\s[\+-](\d+)$/.exec(base); return m ? m[1] + ' +' + (parseInt(m[2], 10) + plus) : base + ' +' + plus; },
        /** My upgrades as sent to the others: type -> id -> [params, traits, plusLevel]. */
        mine() {
            const s = window.$gameSystem && $gameSystem._customStats, out = { w: {}, a: {} };
            if (!s) return out;
            [['weapon', 'w'], ['armor', 'a']].forEach(([t, k]) => Object.keys(s[t] || {}).forEach(id => { const d = s[t][id]; if (d && Array.isArray(d.params) && typeof d.traits === 'string' && (d.plusLevel > 0 || (d.history || []).length > 1)) out[k][id] = [d.params.slice(0, 8), d.traits, d.plusLevel | 0]; }));
            return out;
        },
        clean(u) {
            if (!u || typeof u !== 'object') return null;
            const out = { w: {}, a: {} };
            for (const k of ['w', 'a']) {
                const o = u[k]; if (!o || typeof o !== 'object') continue;
                for (const id of Object.keys(o)) {
                    const r = o[id];
                    if (!isInt(Number(id), 1, 9999) || !Array.isArray(r) || !Array.isArray(r[0]) || r[0].length !== 8 || !r[0].every(x => isNum(x, -1e7, 1e7)) || typeof r[1] !== 'string' || r[1].length > 4000 || !isInt(r[2], 0, 999)) return null;
                    let traits; try { traits = JSON.parse(r[1]); } catch (e) { return null; }
                    if (!Array.isArray(traits) || !traits.every(x => x && isInt(x.code, 0, 99) && isNum(x.dataId, -1e6, 1e6) && isNum(x.value, -1e7, 1e7))) return null;
                    out[k][id] = [r[0].slice(), r[1], r[2]];
                }
            }
            return out;
        },
        /** After a joiner's own character is applied: the database back to as it shipped, then this player's upgrades. */
        applyMine() {
            if (!this.vanilla) return;
            ['weapon', 'armor'].forEach(t => {
                const d = this.db(t);
                this.vanilla[t].forEach((v, id) => { const it = d[id]; if (!it) return; it.params = v.params.slice(); it.traits = JSON.parse(JSON.stringify(v.traits)); it.name = v.name; });
            });
            const u = this.mine();
            [['weapon', 'w'], ['armor', 'a']].forEach(([t, k]) => Object.keys(u[k]).forEach(id => {
                const it = this.db(t)[id], v = this.vanilla[t].get(Number(id)), r = u[k][id];
                if (!it || !v) return;
                it.params = r[0].slice(); it.traits = JSON.parse(r[1]); it.name = this.named(v.name, r[2]);
            }));
        },
        /** Battle together: an item as another player has it (their upgrades, or as it shipped). */
        cache: new Map(),
        asOwnerHas(owner, item) {
            if (!item || !this.vanilla) return item;
            const t = DataManager.isWeapon(item) ? 'weapon' : DataManager.isArmor(item) ? 'armor' : null;
            if (!t) return item;
            const m = Perks.modsFor(owner), r = m && m.u && m.u[t === 'weapon' ? 'w' : 'a'][item.id], v = this.vanilla[t].get(item.id);
            if (!v) return item;
            const key = owner + '|' + t + '|' + item.id + '|' + (r ? r[1].length + ':' + r[0].join(',') : '-');
            let o = this.cache.get(key);
            if (!o) { o = Object.assign(Object.create(Object.getPrototypeOf(item)), item, { params: r ? r[0].slice() : v.params.slice(), traits: r ? JSON.parse(r[1]) : JSON.parse(JSON.stringify(v.traits)) }); if (this.cache.size > 500) this.cache.clear(); this.cache.set(key, o); }
            return o;
        },
        reset() { this.cache.clear(); }
    };
    if (typeof Scene_Boot !== 'undefined' && Scene_Boot.prototype.onDatabaseLoaded) {
        const _dbLoaded = Scene_Boot.prototype.onDatabaseLoaded;
        Scene_Boot.prototype.onDatabaseLoaded = function () { const r = _dbLoaded.apply(this, arguments); try { Upgrades.snapshot(); } catch (e) { Diag.err('equipment snapshot', e); } return r; };
    }

    // ---- the game's own load event (decision 91): see the header of port2-edit ----
    const LoadEvent = {
        id() { return typeof Galv !== 'undefined' && Galv.ACE && typeof Galv.ACE.exists === 'function' ? Number(Galv.ACE.exists('loadFile')) || 0 : 0; },
        run(why) {
            const id = this.id();
            if (!id || !window.$gameTemp || !window.$dataCommonEvents || !$dataCommonEvents[id]) return;
            Galv.ACE.preventMapStart = true;                                // the load screen's way: no map start event on a load
            $gameTemp.reserveCommonEvent(id);
            Diag.log('info', 'game load event (CE' + id + ') for ' + why);
        },
        /** A joiner's load event is running: its world writes stay the host's. */
        quiet() {
            if (Net.isHost || !Net.isPlaying()) return false;
            const ce = window.$dataCommonEvents && $dataCommonEvents[this.id()];
            return !!ce && Spawns.stack.some(i => i && i._list === ce.list);
        }
    };

    // ---- the game's systems co-op is not made for yet (decision 91) ----
    const Unadapted = {
        PLUGINS: { WTE_NPC_Core: "the villagers' Living World", WTE_NPC_Grapher: "the villagers' Living World", WTE_NPC_Simulator: "the villagers' Living World",
                   WTE_NPC_Spawner: "the villagers' Living World", WTE_NPC_Brain: "the villagers' Living World", WTE_MapInstancing: 'instanced maps' },
        list() { const out = []; (window.$plugins || []).forEach(p => { const n = p && p.status && this.PLUGINS[p.name]; if (n && !out.includes(n)) out.push(n); }); return out; },
        note() { const l = this.list(); return l.length ? 'Co-op note: this version of the game has ' + l.join(' and ') + ' switched on, which co-op is not made for yet. Players may see ' + (l.length > 1 ? 'these' : 'this') + ' differently.' : ''; }
    };
    if (Unadapted.list().length) Diag.log('warn', Unadapted.note());
    if (typeof window.WTE_DungeonGen !== 'undefined' && WTE_DungeonGen && typeof WTE_DungeonGen.generate === 'function') {
        const _gen = WTE_DungeonGen.generate;
        WTE_DungeonGen.generate = function () {
            if (!Net.isPlaying() || !window.$gameMap) return _gen.apply(this, arguments);
            const m = $gameMap.mapId();
            if (!Spawns.authority(m)) { Diag.log('info', 'dungeon on map ' + m + ': laid out by the map\'s authority'); return; }
            if (!Daily.active()) return _gen.apply(this, arguments);
            const saved = Math.random; Math.random = Daily.make('dungeon|' + m).fn;
            try { return _gen.apply(this, arguments); } finally { Math.random = saved; }
        };
    }

    // ---- a crop's day-by-day growth rolls the same on every screen (decision 87) ----
    const Crops = {
        PLUGIN: 'CropGrowthSystem', COMMAND: 'UpdateCrop',
        /** The roll for one plot on one day: the shared seed, so every game gets the same numbers. */
        rng(m, e, day) { return Daily.make('crop|' + m + '|' + e + '|' + day); },
        seeded(m, e, day, fn) {
            if (!Daily.active()) return fn();
            const saved = Math.random; Math.random = this.rng(m, e, day).fn;
            try { return fn(); } finally { Math.random = saved; }
        }
    };
    if (typeof Game_Interpreter !== 'undefined') {
        const _357crop = Game_Interpreter.prototype.command357;
        Game_Interpreter.prototype.command357 = function (params) {
            if (params[0] !== Crops.PLUGIN || params[1] !== Crops.COMMAND || !Net.isPlaying()) return _357crop.call(this, params);
            const a = params[3] || {}, day = $gameVariables.value(Number(a.globalDayVar) || 250);
            return Crops.seeded(this._mapId, this._eventId, day, () => _357crop.call(this, params));
        };
    }

    // ---- background music in step on a map (decision 94): see bgm-edit.js ----
    const BgmSync = {
        TOL: 0.12, GAP_MS: 3000, REFRESH_MS: 10000,
        offset: null,             // joiner: host time - my time (ms), from the pings
        cache: null,              // { key, epoch, at, total }: my track and when it started on the shared clock
        lastAdjust: 0,
        active() { return Net.isPlaying() && (Net.isHost || Net.inWorld) && typeof AudioManager !== 'undefined'; },
        now() { return Date.now() + (Net.isHost ? 0 : (this.offset || 0)); },
        hostTime(ts) {
            const rtt = (Ping.ms && Ping.ms.get(Net.selfId)) || 0;
            const off = ts + rtt / 2 - Date.now();
            this.offset = this.offset === null ? off : Math.round(this.offset * 0.8 + off * 0.2);
        },
        valid(bg) { return bg === undefined || bg === 0 || (Array.isArray(bg) && bg.length === 2 && typeof bg[0] === 'string' && bg[0].length <= 80 && isNum(bg[1], 0, 1e15)); },
        /** The playing BGM buffer, only once it is fully loaded (its length is known). */
        buffer() {
            const b = AudioManager._bgmBuffer, cur = AudioManager._currentBgm;
            if (!b || !cur || !cur.name || !b.isPlaying() || !b.isReady() || !b._isLoaded || !(b._totalTime > 0) || !(b._loopLengthTime > 0)) return null;
            return b;
        },
        key() { const cur = AudioManager._currentBgm; return cur.name + '|' + (cur.pitch || 100); },
        /** Where a track that started at "epoch" (shared clock, ms) is now, looping as WebAudio loops it. */
        expected(epoch, now, pitch, start, len) {
            const el = Math.max(0, (now - epoch) / 1000 * pitch);
            return el < start + len ? el : start + ((el - start) % len);
        },
        /** Signed distance a -> b inside the loop (the shorter way round). */
        diff(a, b, start, len) {
            if (a < start || b < start) return b - a;
            let d = b - a; if (d > len / 2) d -= len; if (d < -len / 2) d += len; return d;
        },
        mine() {
            if (!this.active()) return 0;
            const b = this.buffer();
            if (!b) { this.cache = null; return 0; }
            const key = this.key(), now = this.now();
            if (!this.cache || this.cache.key !== key || this.cache.total !== b._totalTime || now - this.cache.at > this.REFRESH_MS)
                this.cache = { key, epoch: Math.round(now - b.seek() / b._pitch * 1000), at: now, total: b._totalTime };
            return [key, this.cache.epoch];
        },
        /** Everyone on my map playing my track follows the first of us by player id. */
        leader(key, map) {
            let best = null;
            Net.peers.forEach((p, id) => { const s = p.state; if (!p.loading && s && (s.map === map || (!!s.mc && s.mc === OneSound.machine())) && Array.isArray(s.bg) && s.bg[0] === key && (best === null || id < best.id)) best = { id, epoch: s.bg[1] }; });
            return best && best.id < Net.selfId ? best : null;
        },
        update() {
            if (!this.active() || !window.$gameMap) return;
            const mine = this.mine(); if (!mine) return;
            const lead = this.leader(mine[0], Locator.local()); if (!lead) return;
            const b = this.buffer(), now = this.now();
            const want = this.expected(lead.epoch, now, b._pitch, b._loopStartTime, b._loopLengthTime);
            const d = this.diff(b.seek(), want, b._loopStartTime, b._loopLengthTime);
            if (Math.abs(d) <= this.TOL || now - this.lastAdjust < this.GAP_MS) return;
            this.lastAdjust = now;
            b.play(true, want);
            this.cache = { key: mine[0], epoch: lead.epoch, at: now, total: b._totalTime };
            Diag.log('info', 'music: in step with the others on this map (' + mine[0].split('|')[0] + ', ' + (d > 0 ? '+' : '') + d.toFixed(2) + ' s)');
        },
        reset() { this.offset = null; this.cache = null; this.lastAdjust = 0; }
    };
    if (typeof Scene_Base !== 'undefined') {
        const _bgmSceneUpdate = Scene_Base.prototype.update;
        Scene_Base.prototype.update = function () {
            _bgmSceneUpdate.apply(this, arguments);
            if (SceneManager._scene === this && !(typeof Scene_Title !== 'undefined' && this instanceof Scene_Title)) { try { BgmSync.update(); } catch (e) { /* the music plays on as it is */ } }
        };
    }
    // ---- the difficulty screen in co-op (decision 94): see diffinfo-edit.js ----
    const CoopDifficulty = {
        HARD: ['Hard', 'Nightmare'], FLEE: { Hard: -1, Nightmare: -2 },
        pct(x) { return (Math.round(x * 1000) / 10) + '%'; },
        /** WTE's closing line: the last paragraph, or the last line, of its description (what kind of player it suits). */
        flavour(desc) {
            const s = String(desc || '').trim(); if (!s) return '';
            const parts = s.split(/\n\s*\n/); if (parts.length > 1) return parts[parts.length - 1].trim();
            const lines = s.split('\n'); const last = lines[lines.length - 1].trim();
            return /Death Penalty|Flee Chance/i.test(last) ? '' : last;
        },
        /** The co-op description of a CGMZ difficulty (its name, description and enemy stat modifier). */
        text(d) {
            if (!d) return '';
            const name = String(d._name || ''), mod = Number(d._enemyStatModifier) > 0 ? Number(d._enemyStatModifier) : 1;
            const lines = [];
            lines.push('\\C[6]Co-op: \\C[0]the host\'s choice, the same for every player.');
            if (name === 'Custom') { lines.push(String(d._description || '')); return lines.join('\n'); }
            lines.push('\\C[6]Death Penalty: \\C[0]5% of the shared gold is lost and the player who fell goes home' + (this.HARD.includes(name) ? ' (no save is reset in co-op).' : '.'));
            lines.push('\\C[6]Enemies: \\C[0]reset only when every player falls together.');
            lines.push('\\C[6]Bosses together: \\C[0]+' + this.pct(Duel.HP_PER_PLAYER) + ' HP and +' + this.pct(Duel.DMG_PER_PLAYER * mod) + ' damage per extra player.');
            if (this.FLEE[name]) lines.push('\\C[6]Flee Chance: \\C[0]' + this.FLEE[name] + ', and every player must agree.');
            else lines.push('\\C[6]Fleeing: \\C[0]every player must agree (never in a story boss battle).');
            const fl = this.flavour(d._description); if (fl) lines.push(fl);
            return lines.join('\n');
        },
        active() { return Net.isPlaying(); }
    };
    if (typeof CGMZ_Window_Difficulty_Display !== 'undefined' && CGMZ_Window_Difficulty_Display.prototype.drawCurrentDifficulty) {
        const _drawDiff = CGMZ_Window_Difficulty_Display.prototype.drawCurrentDifficulty;
        CGMZ_Window_Difficulty_Display.prototype.drawCurrentDifficulty = function () {
            const d = this._difficulty;
            if (!d || !CoopDifficulty.active()) return _drawDiff.apply(this, arguments);
            const own = d._description;
            d._description = CoopDifficulty.text(d);                       // drawn, never stored: single player keeps WTE's text
            try { return _drawDiff.apply(this, arguments); } finally { d._description = own; }
        };
    }
    // ---- one sleep tip at a time (decision 94): see sleeptip-edit.js ----
    const SleepTip = {
        CMD: 'WTE_FreeToasts:showFreeToast', LIST: 'hints',
        showing() { return !!(window.$gameSystem && Array.isArray($gameSystem._wtePersistToasts) && $gameSystem._wtePersistToasts.some(x => x && x.args && x.args.listName === this.LIST)); },
        skip(args) { return Net.isPlaying() && !!args && args.listName === this.LIST && !String(args.text || '').trim() && this.showing(); }
    };
    if (typeof PluginManager !== 'undefined' && PluginManager._commands && typeof PluginManager._commands[SleepTip.CMD] === 'function') {
        const _showToast = PluginManager._commands[SleepTip.CMD];
        PluginManager._commands[SleepTip.CMD] = function (args) {
            if (SleepTip.skip(args)) { Diag.log('info', 'sleep: a tip is already shown, no second one'); return; }
            return _showToast.apply(this, arguments);
        };
    }
    // ---- one soundtrack per computer (decision 94): see onesound-edit.js ----
    const OneSound = {
        CHANNELS: [{ k: 'bgm', buf: '_bgmBuffer', cur: '_currentBgm', upd: 'updateBgmParameters' },
                   { k: 'bgs', buf: '_bgsBuffer', cur: '_currentBgs', upd: 'updateBgsParameters' },
                   { k: 'bgs2', buf: '_bgs2Buffer', cur: '_currentBgs2', upd: 'updateBgs2Parameters' }],
        id: null, muted: {},
        /** A short id of this computer (its name and user), the same for every game window on it. */
        machine() {
            if (this.id === null) {
                try { const os = require('os'); this.id = (hash32('wte-coop|' + os.hostname() + '|' + (os.userInfo().username || '')) >>> 0).toString(36); }
                catch (e) { this.id = ''; }
            }
            return this.id;
        },
        validMc(mc) { return mc === undefined || mc === '' || (typeof mc === 'string' && /^[0-9a-z]{1,8}$/.test(mc)); },
        validBs(bs) { return bs === undefined || bs === 0 || (Array.isArray(bs) && bs.length === 2 && bs.every(x => typeof x === 'string' && x.length <= 80)); },
        playing(ch) { const b = AudioManager[ch.buf], c = AudioManager[ch.cur]; return !!(b && c && c.name && b.isPlaying()); },
        /** The track a channel plays here ('' for none); the music is named as BgmSync names it (name|pitch). */
        track(ch) { if (typeof AudioManager === 'undefined' || !this.playing(ch)) return ''; const c = AudioManager[ch.cur]; return ch.k === 'bgm' ? c.name + '|' + (c.pitch || 100) : String(c.name).slice(0, 80); },
        sounds() { return Net.isPlaying() && typeof AudioManager !== 'undefined' ? [this.track(this.CHANNELS[1]), this.track(this.CHANNELS[2])] : 0; },
        theirs(s, k) { return k === 'bgm' ? (Array.isArray(s.bg) ? s.bg[0] : '') : (Array.isArray(s.bs) ? s.bs[k === 'bgs' ? 0 : 1] : ''); },
        /** Another window on this computer comes first on this channel: on my map, or playing my very track elsewhere. */
        quiet(ch, map) {
            const me = this.machine(), mine = this.track(ch);
            if (!me) return false;
            let q = false;
            Net.peers.forEach((p, id) => { const s = p.state; if (!p.loading && s && s.mc === me && id < Net.selfId && (s.map === map || (!!mine && this.theirs(s, ch.k) === mine))) q = true; });
            return q;
        },
        update() {
            const on = Net.isPlaying() && (Net.isHost || Net.inWorld) && typeof AudioManager !== 'undefined' && !!window.$gameMap;
            const map = on ? Locator.local() : 0;
            this.CHANNELS.forEach(ch => {
                if (on && this.quiet(ch, map)) {
                    const b = AudioManager[ch.buf]; if (b && b.volume !== 0) b.volume = 0;   // every frame: a new track or volume change sets it again
                    if (!this.muted[ch.k]) { this.muted[ch.k] = true; Diag.log('info', 'music: another window on this computer plays the ' + ch.k + ' here'); }
                } else if (this.muted[ch.k]) this.restore(ch);
            });
        },
        restore(ch) {
            this.muted[ch.k] = false;
            try { const c = AudioManager[ch.cur]; if (c && typeof AudioManager[ch.upd] === 'function') AudioManager[ch.upd](c); } catch (e) { /* the next track sets its own volume */ }
            Diag.log('info', 'music: this window plays its own ' + ch.k + ' again');
        },
        reset() { this.CHANNELS.forEach(ch => { if (this.muted[ch.k]) this.restore(ch); }); }
    };
    if (typeof Scene_Base !== 'undefined') {
        const _oneSoundUpdate = Scene_Base.prototype.update;
        Scene_Base.prototype.update = function () {
            _oneSoundUpdate.apply(this, arguments);
            if (SceneManager._scene === this) { try { OneSound.update(); } catch (e) { /* the sound plays on as it is */ } }
        };
    }
    // ---- the house chest beside the bedside table in co-op (decision 96): see rooms-edit.js ----
    const HouseChest = {
        MAP: 2, FROM: [26, 6], TO: [27, 10], TEMPLATE: 24,
        isChest(e) { return !!e && e.x === this.FROM[0] && e.y === this.FROM[1] && (e.pages || []).some(p => (p.list || []).some(c => c.code === 108 && String(c.parameters[0]) === 'initialPocketEvent:' + this.TEMPLATE)); },
        /** Chests already placed in a world (WTE's placed-furniture table pEPDB: [template, x, y, event, direction]) still at
         *  their first spot: the house's (event found in the map data) and the co-op rooms' (where the room map had them
         *  before decision 96). One a player moved elsewhere keeps its spot. */
        ROOM_MOVES: [[122, 19, 45, 20, 49], [124, 31, 45, 32, 49], [126, 7, 57, 8, 61]],
        migrate(houseId) {
            const db = window.$gameSystem && $gameSystem.pEPDB, recs = db && (db[this.MAP] || db[String(this.MAP)]);
            if (!Array.isArray(recs)) return;
            const moves = this.ROOM_MOVES.slice(); if (houseId) moves.push([houseId, this.FROM[0], this.FROM[1], this.TO[0], this.TO[1]]);
            recs.forEach(r => {
                if (!Array.isArray(r) || r[0] !== this.TEMPLATE) return;
                const m = moves.find(([id, fx, fy]) => r[3] === id && r[1] === fx && r[2] === fy);
                if (m) { r[1] = m[3]; r[2] = m[4]; Diag.log('info', 'rooms: chest ' + m[0] + ' moved beside the side table (' + m[3] + ',' + m[4] + ')'); }
            });
        },
        /** In a session, before the house's events are made: WTE's starter chest goes beside the bedside table. */
        place(mapId) {
            if (mapId !== this.MAP || !Net.isPlaying() || !window.$dataMap || !Array.isArray($dataMap.events)) return;
            const e = $dataMap.events.find(x => this.isChest(x));
            if (e) { e.x = this.TO[0]; e.y = this.TO[1]; }
            this.migrate(e ? e.id : 0);
        }
    };
    if (typeof Game_Map !== 'undefined') {
        const _setupHouse = Game_Map.prototype.setup;
        Game_Map.prototype.setup = function (mapId) {
            try { HouseChest.place(mapId); } catch (e) { /* the chest stays where WTE put it */ }
            return _setupHouse.apply(this, arguments);
        };
    }
    // ---- the emote wheel (decision 25, design §11.16): see emote-edit.js ----
    const Emote = {
        SYMBOL: 'coopemote',
        LIST: [[1, '!'], [2, '?'], [3, 'Music'], [4, 'Love'], [5, 'Angry'], [6, 'Sweat'], [9, 'Idea'], [10, 'Sleepy']],
        win: null,
        /** "Co-op Emote" on WTE's binds page (tools/add-emote-key.js; G by default, rebindable); a copy without it: G. */
        bound() { return typeof Input !== 'undefined' && !!Input.keyMapper && Object.values(Input.keyMapper).includes(this.SYMBOL); },
        pressed() { return this.bound() ? Input.isTriggered(this.SYMBOL) : Input.isTriggered('g'); },
        can(scene) {
            return Net.isPlaying() && (Net.isHost || Net.inWorld) && scene instanceof Scene_Map && !SceneManager.isSceneChanging() && !!window.$gameMap
                && !$gameMap.isEventRunning() && !$gameMessage.isBusy() && !$gamePlayer.isTransferring() && !(Scenes.hideOthers && Scenes.hideOthers());
        },
        /** Show a balloon over me here and on every screen on my map. */
        play(id) {
            if (!isInt(id, 1, 15) || !window.$gamePlayer) return;
            $gameTemp.requestBalloon($gamePlayer, id);
            try { Fx.send({ k: 'b', tg: ['p'], id }); } catch (e) { /* only a balloon */ }
        },
        isOpen() { return !!(this.win && this.win.isOpen() && this.win.active); }
    };
    if (typeof Window_HorzCommand !== 'undefined' && typeof Scene_Map !== 'undefined') {
        class Window_CoopEmote extends Window_HorzCommand {
            maxCols() { return Emote.LIST.length; }
            makeCommandList() { Emote.LIST.forEach(([id, name]) => this.addCommand(name, 'emote', true, id)); }
            itemTextAlign() { return 'center'; }
        }
        const _createEmote = Scene_Map.prototype.createAllWindows;
        Scene_Map.prototype.createAllWindows = function () {
            _createEmote.apply(this, arguments);
            const w = Math.min(Graphics.boxWidth - 40, 760), r = new Rectangle((Graphics.boxWidth - w) / 2, Graphics.boxHeight - 160, w, this.calcWindowHeight ? this.calcWindowHeight(1, true) : 72);
            const win = new Window_CoopEmote(r);
            win.setHandler('emote', () => { const id = win.currentExt(); win.close(); win.deactivate(); Emote.play(id); });
            win.setHandler('cancel', () => { win.close(); win.deactivate(); });
            win.openness = 0; win.deactivate();
            this.addWindow(win); Emote.win = win;
        };
        const _updateEmote = Scene_Map.prototype.update;
        Scene_Map.prototype.update = function () {
            _updateEmote.apply(this, arguments);
            const win = Emote.win;
            if (!win || win.parent == null) return;
            if (Emote.isOpen() && !Emote.can(this)) { win.close(); win.deactivate(); return; }
            if (!Emote.isOpen() && Emote.can(this) && Emote.pressed()) { win.select(0); win.refresh(); win.open(); win.activate(); }
        };
        const _canMoveEmote = Game_Player.prototype.canMove;
        Game_Player.prototype.canMove = function () { return !Emote.isOpen() && _canMoveEmote.call(this); };
        const _menuEmote = Scene_Map.prototype.isMenuCalled;
        if (_menuEmote) Scene_Map.prototype.isMenuCalled = function () { return !Emote.isOpen() && _menuEmote.call(this); };
    }
    // ---- the target arrow in co-op battles (decision 98): see arrow-edit.js ----
    const TargetArrow = {
        IMAGE: 'Arrow', FRAME_DELAY: 8, BOB: 4,
        sprite: null, frame: 0, tick: 0,
        make(scene) {
            const s = new Sprite(); s.bitmap = ImageManager.loadSystem(this.IMAGE);
            s.anchor.x = 0.5; s.anchor.y = 0.5; s.rotation = -Math.PI / 2; s.visible = false;   // the menu cursor points left; turned to point down
            scene.addChild(s); this.sprite = s; this.frame = 0; this.tick = 0; return s;
        },
        /** The chosen ally's card in WTE's battle status window: other players are small cards on the left ("Mira ◀ give to"),
         *  my own hero the big portrait on the right (no arrow needed there). Screen coordinates of the card's top middle.
         *  (The target window itself is parked off-screen by WTE; seen live 2026-10-29.) */
        boxOf(scene) {
            const aw = scene._actorWindow, sw = scene._statusWindow;
            if (!aw || !aw.active || aw.index() < 0 || !sw || !sw.itemRect) return null;
            const i = aw.index(), who = $gameParty.battleMembers()[i];
            if (!who || who === $gameActors.actor(1)) return null;
            const r = sw.itemRect(i), g = sw.parent && sw.parent.toGlobal ? sw.parent.toGlobal(new Point(sw.x, sw.y)) : { x: sw.x, y: sw.y };
            return { x: g.x + sw.padding + r.x + r.width / 2 + 15, y: g.y + sw.padding + r.y + r.height - 58 };
        },
        /** While an ally is chosen: the item / skill list and help box step aside, back as they were afterwards (decision 104). */
        aside(scene, on) {
            const ws = ['_itemWindow', '_skillWindow', '_helpWindow', '_actorCommandWindow'].map(k => scene[k]).filter(Boolean);
            if (on) { ws.forEach(w => { if (w.visible) { w._coopAside = true; w.visible = false; } }); return; }
            const back = ws.filter(w => w._coopAside); if (!back.length) return;
            const list = [scene._itemWindow, scene._skillWindow].find(w => w && w._coopAside && w.active);   // cancelled: that list is in use again
            back.forEach(w => { w._coopAside = false; if ((list && (w === list || w === scene._helpWindow || w === scene._actorCommandWindow)) || (w === scene._actorCommandWindow && w.active)) w.visible = true; });
        },
        update(scene) {
            const s = this.sprite || this.make(scene);
            const box = Duel.on ? this.boxOf(scene) : null;
            this.aside(scene, !!box);
            if (!box || !s.bitmap || !s.bitmap.isReady()) { s.visible = false; return; }
            s.scale.x = s.scale.y = 2;
            if (s.parent === scene && scene.children[scene.children.length - 1] !== s) scene.addChild(s);   // on top of the windows
            const h = s.bitmap.height, frames = Math.max(1, Math.floor(s.bitmap.width / Math.max(1, h)));
            if (++this.tick >= this.FRAME_DELAY) { this.tick = 0; this.frame = (this.frame + 1) % frames; }
            s.setFrame(this.frame * h, 0, h, h);
            s.x = Math.round(box.x); s.y = Math.round(box.y - h - 2 + Math.sin(Graphics.frameCount * 0.08) * this.BOB);
            s.visible = true;
        }
    };
    if (typeof Scene_Battle !== 'undefined') {
        const _battleArrow = Scene_Battle.prototype.update;
        Scene_Battle.prototype.update = function () {
            _battleArrow.apply(this, arguments);
            try { TargetArrow.update(this); } catch (e) { if (TargetArrow.sprite) TargetArrow.sprite.visible = false; }
        };
        const _battleArrowTerm = Scene_Battle.prototype.terminate;
        Scene_Battle.prototype.terminate = function () { TargetArrow.sprite = null; return _battleArrowTerm.apply(this, arguments); };
    }
    // clicking a character whose picture and talk are two events (user, 2026-11-03: "I was unable to just click on hans
    // and talk to him, I had to use the space bar"): Farmer Hans in the farmhouse is a picture only (!$Hans, nothing to
    // run) standing in front of an invisible, wide talk event behind the counter, and the pumpkin on Pumpkin Path is the
    // same. WTE's mouse code only starts what is under the cursor, so a click on the picture did nothing. A click on such a
    // picture (or just above its feet, on its head) from next to it now starts the invisible talk event touching it, as
    // the OK key does from the right spot.
    const ClickTalk = {
        runs: p => !!(p && p.list && p.list.some(c => c.code !== 0 && c.code !== 108 && c.code !== 408)),
        picture(ev) { return ev && !ev._erased && !ev._coopPeer && ev.characterName() && !ev.isTransparent() && !ev.event().pages.some(p => this.runs(p)); },
        talk(ev) { return ev && !ev._erased && !ev._coopPeer && !ev.characterName() && ev._trigger === 0 && this.runs(ev.page()); },
        /** The talk event behind a picture the cursor is on, when the player stands next to that picture. */
        find(mx, my) {
            const p = $gamePlayer;
            for (const [x, y] of [[mx, my], [mx, my + 1]]) {
                const pic = $gameMap.eventsXy(x, y).find(e => this.picture(e));
                if (!pic || Math.max(Math.abs($gameMap.deltaX(pic.x, p.x)), Math.abs($gameMap.deltaY(pic.y, p.y))) > 1) continue;
                for (const [dx, dy] of [[0, -1], [0, 0], [-1, 0], [1, 0], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]]) {
                    const t = $gameMap.eventsXy(pic.x + dx, pic.y + dy).find(e => e !== pic && this.talk(e));
                    if (t) return { pic, t };
                }
            }
            return null;
        }
    };
    if (typeof Scene_Map !== 'undefined') {
        const _updateClickTalk = Scene_Map.prototype.update;
        Scene_Map.prototype.update = function () {
            try {
                if (TouchInput.isTriggered() && $gameTemp._wteMouseActive && $gamePlayer.canMove() && !$gameMap.isEventRunning() && !$gameMessage.isBusy()) {
                    const hit = ClickTalk.find(Math.floor($gameMap.canvasToMapX(TouchInput.x)), Math.floor($gameMap.canvasToMapY(TouchInput.y)));
                    if (hit) {
                        const dx = $gameMap.deltaX(hit.pic.x, $gamePlayer.x), dy = $gameMap.deltaY(hit.pic.y, $gamePlayer.y);
                        if (dx || dy) $gamePlayer.setDirection(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 6 : 4) : (dy > 0 ? 2 : 8));
                        TouchInput._triggered = false; $gameTemp.clearDestination();
                        hit.t.start();
                    }
                }
            } catch (e) { /* the click goes on to WTE's own mouse code */ }
            return _updateClickTalk.apply(this, arguments);
        };
    }
    // reconnecting (see Session.startReconnect): the player stays where they stand until the world is back
    if (typeof Game_Player !== 'undefined') {
        const _canMoveRc = Game_Player.prototype.canMove;
        Game_Player.prototype.canMove = function () { return Net.reconnecting ? false : _canMoveRc.call(this); };
    }
    window.ElderfieldCoop = { Updater, Achievements, Session, RoomStores, TargetArrow, Emote, HouseChest, OneSound, Labels: (typeof Labels !== 'undefined' ? Labels : null), SleepTip, CoopDifficulty, BgmSync, WorldSave, Net, CFG, Items, Lobby, Shared, Daily, Ritual, Locator, Saves, States: S, protocol: CFG.protocol, SteamTransport, SteamFriends, SteamInvites, RelayTransport, P2PTransport, P2PHostTransport, P2PClientTransport, Discovery, Upnp, InternetCode, parseJoinTarget, hostShareText, Clock, Rooms, CoopStore, Identity, PlayerData, Xfer, CoopWorlds, GameBridge, Notice, CoopFlow, Profile, Night, Wallet, WorldObjects, Spawns, Scenes, Mobs, Uses, Progress, Opening, Festival, Invites, Home, Chat, Players, Ping, Desync, Story, Duel, Revive, Marriages, Fair, Wedding, Chores, Mentions, FirstTime, Gates, Walkers, Intros, Mysteries, VoidClock, ONE_WAY, Bosses, Tax, hostShareText, P2P, Crops, Tools, FishPerk, Unadapted, Perks, Upgrades, MoonSync, Death, Fx, Pads, TitlePad, Reclaims, Tutorials, Mods, Floors, Pack, Afflict, Pendulums, SteamFriends, Watch };
    {   // nothing may replace co-op's API (decision 90): an old co-op prototype run by the mod loader did, and every co-op door stopped working
        const api = window.ElderfieldCoop;
        try {
            Object.defineProperty(window, 'ElderfieldCoop', { configurable: false, enumerable: true, get: () => api,
                set: () => Diag.log('warn', 'another script tried to replace ElderfieldCoop (an old co-op mod in the mods folder?): ignored') });
        } catch (e) { /* already locked */ }
    }
    if (typeof Game_Variables !== 'undefined') {
        const _setSaveCounter = Game_Variables.prototype.setValue;
        Game_Variables.prototype.setValue = function (id, value) {
            if (WorldSave.skipCounter(id)) return;
            return _setSaveCounter.apply(this, arguments);
        };
    }
})();

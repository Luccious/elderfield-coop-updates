/*:
 * @target MZ
 * @plugindesc Elderfield Co-op: the CO-OP button on the title. Co-op plays in its own copy of the game (its own saves), made and kept up to date from here.
 * @author Elderfield Co-op
 * @help
 * Put the ElderfieldCoop folder into the game's mods folder. CO-OP on the title screen makes the co-op copy the first time
 * (a copy of this game in its own folder, with co-op added and its own save folder), brings it up to date after the game
 * updates, then starts it and closes this window. This game, its files and its saves are only read, never changed.
 * Mods > Elderfield Co-op: whether co-op connects through Steam or directly.
 */
// The Nexus way of getting co-op (user, 2026-11-05: Nexus holds every .exe; "is there a way it would do it automatically
// when starting a co-op game?"). It makes the same co-op copy as the setup (tools/installer/elderfield-coop.iss) with the
// same steps, so both ways give the same copy: the game's files, co-op's own (copy\files), co-op's parts in the copy's
// plugins.js (every other plugin's line byte for byte), the title frames from the game's own, package.json, steam_appid.txt.
(() => {
    'use strict';
    if (typeof require !== 'function' || window.ElderfieldCoop || window.ElderfieldCoopLauncher) return;      // in a co-op copy co-op itself has the button; once only (by hand and through Vortex)
    const fs = require('fs'), path = require('path');
    const GAME = path.dirname(process.mainModule.filename);
    const COPY_NAME = 'Welcome to Elderfield - Coop', COOP_APP = 'WelcomeToElderfieldCoop', LINK = 'Elderfield Co-op';
    const read = f => { try { return fs.readFileSync(f, 'latin1'); } catch (e) { return ''; } };   // bytes: nothing is re-encoded
    if (read(path.join(GAME, 'package.json')).includes('"' + COOP_APP + '"')) return;
    // co-op's files for the copy: in the mods folder (put there by hand), or in this game's own folder (Vortex: it links
    // every file, which the game's mod loader skips, so Vortex adds this launcher to plugins.js and the rest to the game)
    const FILES = 'ElderfieldCoop-files';
    const MOD = (() => {
        const dir = path.join(GAME, 'mods');
        try {
            for (const n of fs.readdirSync(dir)) if (!/^[!.]/.test(n) && fs.existsSync(path.join(dir, n, FILES, 'coop-plugins.json'))) return { folder: n, root: path.join(dir, n), files: path.join(dir, n, FILES) };
        } catch (e) { /* no mods folder */ }
        if (fs.existsSync(path.join(GAME, FILES, 'coop-plugins.json'))) return { folder: '', root: GAME, files: path.join(GAME, FILES), vortex: true };
        return null;
    })();
    if (!MOD) return;

    // ---- the co-op copy's own plugins.js: co-op's entry before the mod loader, its Options items and keys (the setup's
    //      PatchPlugins, the same steps on the same bytes) ----
    const Json = {
        strEnd(s, q) { for (let i = q + 1; i < s.length; i++) { if (s[i] === '\\') i++; else if (s[i] === '"') return i; } return -1; },
        unescape(s) {        // \uXXXX of a character beyond ASCII stays as it is (the text it goes into is JSON too)
            let o = '';
            for (let i = 0; i < s.length; i++) {
                const c = s[i];
                if (c !== '\\' || i + 1 >= s.length) { o += c; continue; }
                const d = s[i + 1];
                if (d === 'u' && i + 5 < s.length + 0) {
                    const h = s.substr(i + 2, 4), u = /^[0-9a-fA-F]{4}$/.test(h) ? parseInt(h, 16) : -1;
                    o += u >= 0 && u < 128 ? String.fromCharCode(u) : s.substr(i, 6); i += 5; continue;
                }
                o += ({ n: '\n', r: '\r', t: '\t', b: '\b', f: '\f' })[d] || d; i++;
            }
            return o;
        },
        escape(s) {
            return s.replace(/["\\\u0000-\u001f]/g, c => c === '"' || c === '\\' ? '\\' + c : ({ '\n': '\\n', '\r': '\\r', '\t': '\\t', '\b': '\\b', '\f': '\\f' })[c] || '\\u' + c.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0'));
        },
        /** ["..",".."]: each string's content, still escaped */
        split(a) { const out = []; let i = 0; for (;;) { i = a.indexOf('"', i); if (i < 0) break; const e = this.strEnd(a, i); if (e < 0) break; out.push(a.slice(i + 1, e)); i = e + 1; } return out; },
        join(items) { return '[' + items.map(x => '"' + x + '"').join(',') + ']'; },
        fieldAt(obj, key) { const pat = '"' + key + '":"', p = obj.indexOf(pat); if (p < 0) return null; const vs = p + pat.length, ve = this.strEnd(obj, vs - 1); return ve < 0 ? null : [vs, ve]; },
        get(obj, key) { const f = this.fieldAt(obj, key); return f ? this.unescape(obj.slice(f[0], f[1])) : ''; },
        set(obj, key, text) { const f = this.fieldAt(obj, key); return f ? obj.slice(0, f[0]) + this.escape(text) + obj.slice(f[1]) : obj; }
    };
    const lowerAscii = s => s.replace(/[A-Z]/g, c => c.toLowerCase());
    const bytes = s => Buffer.from(String(s), 'utf8').toString('latin1');     // co-op's text as the file's bytes
    const Plugins = {
        /** co-op's old items out, then each of co-op's after the one it follows */
        merge(items, keys, mine, after, adds) {
            const keep = [], kk = [];
            items.forEach((it, i) => { if (!mine.includes(keys[i])) { keep.push(it); kk.push(keys[i]); } });
            adds.forEach((a, j) => {
                let at = -1;
                if (after[j]) kk.forEach((k, i) => { if (k === after[j]) at = i; });
                if (at < 0) at = keep.length - 1;
                keep.splice(at + 1, 0, Json.escape(a)); kk.splice(at + 1, 0, mine[j]);
            });
            return keep;
        },
        options(line, parts) {
            if (!parts.options.length) return line;
            const cats = Json.split(Json.get(line, 'Categories:arraystruct'));
            if (!cats.length) return line;
            let g = 0;
            for (let i = cats.length - 1; i >= 0; i--) if (Json.get(Json.unescape(cats[i]), 'Name:str').includes('General')) g = i;
            let gen = Json.unescape(cats[g]);
            const items = Json.split(Json.get(gen, 'List:arraystruct'));
            const keys = items.map(it => Json.get(Json.unescape(it), 'Symbol:str'));
            const o = parts.options;
            gen = Json.set(gen, 'List:arraystruct', Json.join(this.merge(items, keys, o.map(x => x.symbol), o.map(x => x.after), o.map(x => x.item))));
            cats[g] = Json.escape(gen);
            return Json.set(line, 'Categories:arraystruct', Json.join(cats));
        },
        keys(line, parts) {
            if (!parts.keys.length) return line;
            let l = line;
            if (!Json.fieldAt(l, 'Button Config')) {
                const i = l.indexOf('"parameters":{'); if (i < 0) return line;
                l = l.slice(0, i + 14) + '"Button Config":"[]",' + l.slice(i + 14);
            }
            const items = Json.split(Json.get(l, 'Button Config'));
            const keys = items.map(it => lowerAscii(Json.get(Json.unescape(it), 'From Key')));
            const k = parts.keys;
            return Json.set(l, 'Button Config', Json.join(this.merge(items, keys, k.map(x => x.key), k.map(x => x.after), k.map(x => x.item))));
        },
        /** the copy's js\plugins.js, rewritten with co-op's parts ('' when done, else what is wrong) */
        patch(file, parts) {
            const s = read(file), op = s.indexOf('['), cl = s.lastIndexOf(']');
            if (op < 0 || cl <= op) return 'js\\plugins.js has no plugin list';
            let lines = [];
            for (let seg of s.slice(op + 1, cl).split('\n')) {
                seg = seg.replace(/[\r, \n]+$/, '').replace(/^[ \r]+/, '');
                if (!seg) continue;
                const m = /^\{"name":"([^"]*)"/.exec(seg);
                if (!m) { lines = null; break; }
                lines.push({ name: m[1], text: seg });
            }
            // another tool wrote it (Vortex writes it indented): the same list, one plugin per line as RPG Maker writes it
            if (!lines) {
                let list; try { list = JSON.parse(Buffer.from(s.slice(op, cl + 1), 'latin1').toString('utf8')); } catch (e) { list = null; }
                if (!Array.isArray(list) || list.some(p => !p || typeof p.name !== 'string')) return 'js\\plugins.js is not a plugin list the game can read';
                lines = list.map(p => ({ name: p.name, text: Buffer.from(JSON.stringify(p), 'utf8').toString('latin1') }));
            }
            let at = lines.findIndex(l => l.name === 'ModLoader_Injector');
            if (at < 0) at = lines.findIndex(l => l.name === 'modloader');
            if (at < 0) at = lines.length;
            const out = [];
            lines.forEach((l, i) => {
                if (i === at) out.push(parts.entry);
                if (l.name === 'elderfieldcoop') return;
                out.push(l.name === 'VisuMZ_1_OptionsCore' ? this.options(l.text, parts) : l.name === 'Hendrix_Keyboard_Gamepad' ? this.keys(l.text, parts) : l.text);
            });
            if (at === lines.length) out.push(parts.entry);
            const tmp = file + '.coop-new';
            fs.writeFileSync(tmp, Buffer.from(s.slice(0, op + 1) + '\n' + out.join(',\n') + '\n' + s.slice(cl), 'latin1'));
            fs.renameSync(tmp, file);
            return '';
        },
        /** co-op's parts for this build (ElderfieldCoop-files\coop-plugins.json, made at ship), connecting the chosen way */
        parts(transport) {
            const c = JSON.parse(fs.readFileSync(path.join(MOD.files, 'coop-plugins.json'), 'utf8'));
            const entry = JSON.parse(JSON.stringify(c.entry)); entry.parameters.transport = transport;
            return {
                entry: bytes(JSON.stringify(entry)),
                options: (c.options || []).map(o => ({ symbol: bytes(o.symbol), after: bytes(o.after || ''), item: bytes(o.item) })),
                keys: (c.keys || []).map(k => ({ key: lowerAscii(bytes(k.key)), after: lowerAscii(bytes(k.after || '')), item: bytes(k.item) }))
            };
        },
        /** how an existing copy connects ('' when it has no co-op entry) */
        transportOf(file) {
            const m = /\{"name":"elderfieldcoop".*/.exec(read(file));
            if (!m) return '';
            try { return JSON.parse(m[0].replace(/,\s*$/, '')).parameters.transport || ''; } catch (e) { return ''; }
        }
    };

    // ---- the game, the co-op copy and where it goes ----
    const env = process.env;
    // tests only (never set for players): {copy, memo, args} (the copy's folder, the remembered place, the copy's start
    // arguments), and no steam_appid.txt in a test copy (a test once unlocked a
    // real achievement), no start
    const TEST = (() => { try { return env.ELDERFIELD_COOP_LAUNCHER_TEST ? JSON.parse(env.ELDERFIELD_COOP_LAUNCHER_TEST) : null; } catch (e) { return null; } })();
    const isGame = p => !!p && fs.existsSync(path.join(p, 'Game.exe')) && fs.existsSync(path.join(p, 'data', 'System.json'));
    const isCopy = p => !!p && (read(path.join(p, 'package.json')).includes('"' + COOP_APP + '"') || fs.existsSync(path.join(p, 'js', 'libs', 'node_modules', 'ws')));
    const gameVersion = p => { const m = /"versionId":(\d+)/.exec(read(path.join(p, 'data', 'System.json'))); return m ? m[1] : ''; };
    const under = (p, dir) => !!dir && (path.resolve(p) + '\\').toLowerCase().startsWith((path.resolve(dir) + '\\').toLowerCase());
    const UNFINISHED = 'coop-copy-unfinished.txt';
    const desktops = () => [env.OneDrive, env.OneDriveConsumer, env.USERPROFILE].filter(Boolean).map(d => path.join(d, 'Desktop')).filter(d => fs.existsSync(d));
    /** a shortcut's target (Windows' .lnk: its LinkInfo's local path), to find a copy the setup put somewhere else */
    const linkTarget = f => {
        try {
            const b = fs.readFileSync(f); if (b.length < 0x4c || b.readUInt32LE(0) !== 0x4c) return '';
            const flags = b.readUInt32LE(0x14); let o = 0x4c;
            if (flags & 1) o += 2 + b.readUInt16LE(o);
            if (!(flags & 2)) return '';
            const hs = b.readUInt32LE(o + 4), lf = b.readUInt32LE(o + 8);
            if (!(lf & 1)) return '';
            if (hs >= 0x24) { const u = o + b.readUInt32LE(o + 28); let e = u; while (e + 1 < b.length && b.readUInt16LE(e)) e += 2; return b.toString('utf16le', u, e); }
            const a = o + b.readUInt32LE(o + 16); let e = a; while (e < b.length && b[e]) e++;
            return b.toString('latin1', a, e);
        } catch (e) { return ''; }
    };
    const Place = {
        memo: TEST ? TEST.memo : path.join(env.LOCALAPPDATA || env.APPDATA || GAME, 'Elderfield Co-op', 'launcher.json'),
        remembered() { try { return JSON.parse(fs.readFileSync(this.memo, 'utf8')).copy || ''; } catch (e) { return ''; } },
        remember(t) { try { fs.mkdirSync(path.dirname(this.memo), { recursive: true }); fs.writeFileSync(this.memo, JSON.stringify({ copy: t }, null, 1)); } catch (e) { /* found again next time */ } },
        drive() { return path.parse(GAME).root; },
        /** a copy made before (here, or by the setup: its shortcut says where), else where a new one goes */
        find() {
            if (TEST) return TEST.copy;
            const seen = [this.remembered()];
            const programs = env.APPDATA ? path.join(env.APPDATA, 'Microsoft', 'Windows', 'Start Menu', 'Programs') : '';
            for (const d of desktops().concat(programs ? [programs] : [])) { const t = linkTarget(path.join(d, LINK + '.lnk')); if (t) seen.push(path.dirname(t)); }
            desktops().forEach(d => seen.push(path.join(d, COPY_NAME)));
            seen.push(path.join(this.drive(), 'Games', COPY_NAME), path.join('C:\\', 'Games', COPY_NAME));
            for (const t of seen) if (t && fs.existsSync(t) && (isCopy(t) || fs.existsSync(path.join(t, UNFINISHED))) && !this.bad(t)) return t;
            // a new copy: on the game's drive (outside OneDrive, which would upload it), or C:
            return path.join(this.drive(), 'Games', COPY_NAME);
        },
        bad(t) {
            if (under(t, GAME) || under(GAME, t) || /\\steamapps\\/i.test(path.resolve(t) + '\\')) return "The co-op copy must be its own folder, outside Steam's game folders (" + t + ').';
            if (path.resolve(t).length <= 3) return 'The co-op copy needs its own folder, not a whole drive.';
            return '';
        }
    };
    const running = t => { try { fs.closeSync(fs.openSync(path.join(t, 'Game.exe'), 'r+')); return false; } catch (e) { return e.code === 'EBUSY' || e.code === 'EPERM'; } };

    // ---- making it ----
    // not the game's: its saves and mods, and what Vortex put beside it for co-op (its own records, co-op's files)
    const SKIP_TOP = ['save', 'mods', '~mods', 'steam_appid.txt', FILES.toLowerCase()].concat(MOD.vortex ? ['mod.json', 'config.json', 'how to play together.txt'] : []);
    const VORTEX_TOP = /^vortex\.deployment\..*\.json$|pluginsloadorder\.json$/i;
    const walk = (dir, rel, out, top) => {
        for (const e of fs.readdirSync(path.join(dir, rel), { withFileTypes: true })) {
            const r = rel ? path.join(rel, e.name) : e.name;
            if (top && (SKIP_TOP.includes(e.name.toLowerCase()) || VORTEX_TOP.test(e.name))) continue;
            // a linked file or folder (Vortex links every mod's files) counts as what it points to
            let st = null; if (e.isSymbolicLink()) { try { st = fs.statSync(path.join(dir, r)); } catch (x) { continue; } }
            if (st ? st.isDirectory() : e.isDirectory()) walk(dir, r, out, false);
            else if ((st ? st.isFile() : e.isFile()) && !/\.log$/i.test(e.name)) out.push({ rel: r, size: (st || fs.statSync(path.join(dir, r))).size });
        }
        return out;
    };
    const Copy = {
        log: [],
        say(t) { this.log.push(new Date().toISOString().slice(11, 19) + ' ' + t); },
        gameFiles() { return walk(GAME, '', [], true); },
        free(t) { try { const s = fs.statfsSync(path.parse(t).root); return s.bavail * s.bsize; } catch (e) { return Infinity; } },
        /** how the copy connects: the player's choice in Mods > Elderfield Co-op once made (user_config.json, written by the
         *  mod loader when it is changed); until then an existing copy keeps its own way, and a new one connects through Steam */
        wanted(t) {
            let v; try { v = JSON.parse(fs.readFileSync(path.join(MOD.root, 'user_config.json'), 'utf8').replace(/^﻿/, '')).connect; } catch (e) { v = undefined; }
            if (v === undefined || v === null) return (t && Plugins.transportOf(path.join(t, 'js', 'plugins.js'))) || 'steam';
            return (v === 1 || v === '1' || /direct/i.test(String(v))) ? 'p2p' : 'steam';
        },
        /** what CO-OP has to do first: 'new' (make it), 'game' (the game's files again: another game version, or unfinished
         *  or broken), 'connect' (only how it connects), 'running', or '' (start it) */
        need(t) {
            if (!fs.existsSync(t) || fs.existsSync(path.join(t, UNFINISHED))) return fs.existsSync(path.join(t, 'Game.exe')) && isCopy(t) ? 'game' : 'new';
            if (!isCopy(t)) return 'new';
            if (running(t)) return 'running';
            if (gameVersion(t) !== gameVersion(GAME) || this.missing(t).length) return 'game';
            if (Plugins.transportOf(path.join(t, 'js', 'plugins.js')) !== this.wanted(t)) return 'connect';
            return '';
        },
        missing(t) {
            return ['Game.exe', 'nw.dll', 'index.html', 'data\\System.json', 'data\\Map002.json', 'js\\plugins\\elderfieldcoop.js', 'js\\libs\\node_modules\\ws\\index.js', 'package.json']
                .filter(n => !fs.existsSync(path.join(t, n)));
        },
        /** the game's files, then co-op's, then the copy's own parts; progress(done, total) in bytes */
        async make(t, mode, progress) {
            this.log = []; this.say('co-op copy ' + t + ' (' + mode + '), game ' + GAME + ' version ' + gameVersion(GAME) + ', co-op ' + this.build());
            const why = Place.bad(t); if (why) throw new Error(why);
            if (mode === 'new' && fs.existsSync(t) && fs.readdirSync(t).length && !fs.existsSync(path.join(t, UNFINISHED)))
                throw new Error(t + " already exists and isn't a co-op copy: move or rename that folder, then press CO-OP again.");
            fs.mkdirSync(t, { recursive: true });
            const how = this.wanted(t);              // before the game's own plugins.js comes over the copy's
            if (mode !== 'connect') {
                // co-op's own paths never come from the game (a game can hold an old co-op's plugin): they are the mod's, or
                // kept when the copy's updater already has a newer release (asked before anything is copied)
                const own = Copy.own();
                const ownRel = new Set(own.map(f => f.rel.toLowerCase())), wsDir = path.join('js', 'libs', 'node_modules', 'ws').toLowerCase() + path.sep;
                const newer = mode === 'new' ? '' : this.newerInCopy(t);
                const files = this.gameFiles().filter(f => !ownRel.has(f.rel.toLowerCase()) && !f.rel.toLowerCase().startsWith(wsDir)), total = files.reduce((n, f) => n + f.size, 0);
                if (this.free(t) < total + 200 * 1024 * 1024) throw new Error('Not enough free space on ' + path.parse(t).root + ' for the co-op copy: it needs about ' + Math.ceil(total / 1073741824 + 0.2) + ' GB.');
                fs.writeFileSync(path.join(t, UNFINISHED), 'The co-op copy is being made; pressing CO-OP in the Steam game finishes it.\r\n');
                let done = 0, i = 0;
                const made = new Set();
                const one = async () => {
                    while (i < files.length) {
                        const f = files[i++], d = path.dirname(path.join(t, f.rel));
                        if (!made.has(d)) { fs.mkdirSync(d, { recursive: true }); made.add(d); }
                        await fs.promises.copyFile(path.join(GAME, f.rel), path.join(t, f.rel));
                        done += f.size; progress(done, total);
                    }
                };
                await Promise.all([one(), one(), one(), one()]);
                this.say('game files copied: ' + files.length + ' (' + Math.round(total / 1048576) + ' MB)');
                // co-op's own files: the plugin and its network library, unless the copy's updater already has a newer release
                if (newer) this.say("co-op's files kept: the copy has " + newer + ' from the co-op updates, newer than ' + this.build());
                else {
                    for (const f of own) { fs.mkdirSync(path.dirname(path.join(t, f.rel)), { recursive: true }); fs.copyFileSync(f.from, path.join(t, f.rel)); }
                    const guide = path.join(MOD.root, 'How to play together.txt');
                    if (fs.existsSync(guide)) fs.copyFileSync(guide, path.join(t, 'How to play together.txt'));
                    this.say("co-op's files: " + own.length);
                }
                ['save', 'mods', '~mods'].forEach(d => fs.mkdirSync(path.join(t, d), { recursive: true }));
                ['Start second player.bat', 'Start third player.bat', 'Start second player (testing).bat', 'Start third player (testing).bat']
                    .forEach(n => { try { fs.unlinkSync(path.join(t, n)); this.say('removed ' + n); } catch (e) { /* not there */ } });
                this.titleFrames(t);
                if (!this.packageJson(t)) this.say('package.json not written');
                // every copy talks to Steam (achievements, and the Steam build's connections); with Steam closed it plays on
                if (!TEST) fs.writeFileSync(path.join(t, 'steam_appid.txt'), '3195440');
                this.oldMods(path.join(t, 'mods'));
            }
            const e = Plugins.patch(path.join(t, 'js', 'plugins.js'), Plugins.parts(how));
            if (e) throw new Error(e);
            this.say('plugins.js: co-op added, connects ' + how);
            const bad = this.missing(t);
            if (bad.length) throw new Error('The co-op copy is missing: ' + bad.join(', '));
            try { fs.unlinkSync(path.join(t, UNFINISHED)); } catch (x) { /* not there */ }
            Place.remember(t);
            this.say('checked the co-op copy: everything is in place');
            try { fs.mkdirSync(path.join(t, 'coop-logs'), { recursive: true }); fs.writeFileSync(path.join(t, 'coop-logs', 'install-log.txt'), this.log.join('\r\n') + '\r\n'); } catch (x) { /* a note only */ }
        },
        build() { try { return require('crypto').createHash('sha256').update(fs.readFileSync(path.join(MOD.files, 'elderfieldcoop.js'))).digest('hex').slice(0, 10); } catch (e) { return '?'; } },
        /** co-op's own files and where each goes in the copy: the plugin, and its network library (kept without a "js"
         *  folder in the mod, which Vortex would take for the mod's own) */
        own() {
            const lib = walk(path.join(MOD.files, 'ws'), '', [], false).map(f => ({ from: path.join(MOD.files, 'ws', f.rel), rel: path.join('js', 'libs', 'node_modules', 'ws', f.rel), size: f.size }));
            return [{ from: path.join(MOD.files, 'elderfieldcoop.js'), rel: path.join('js', 'plugins', 'elderfieldcoop.js') }].concat(lib);
        },
        /** the copy's co-op build when its updater brought a release newer than this mod's (so a host and its joiners stay
         *  on the build the updates gave them), else '': the mod knows every release before its own (copy\releases.json) */
        newerInCopy(t) {
            let have; try { have = require('crypto').createHash('sha256').update(fs.readFileSync(path.join(t, 'js', 'plugins', 'elderfieldcoop.js'))).digest('hex').slice(0, 10); } catch (e) { return ''; }
            if (have === this.build()) return '';
            let earlier = []; try { earlier = JSON.parse(read(path.join(MOD.files, 'releases.json'))).earlier || []; } catch (e) { /* none known */ }
            if (earlier.includes(have)) return '';
            let last = {}; try { last = JSON.parse(read(path.join(t, 'coop-update', 'last-update.json'))); } catch (e) { return ''; }
            return last.to === have ? have : '';
        },
        /** the title's flipbooks ask for one frame past each loop's end: made from the copy's own frames where the game has none */
        titleFrames(t) {
            ['Title', 'Pre Title', 'Splash 1', 'Splash 2'].forEach((d, i) => {
                const dir = path.join(GAME, 'img', 'pictures', d);
                let list = []; try { list = fs.readdirSync(dir).filter(n => /\.webp$/i.test(n)); } catch (e) { return; }
                let min = null, max = null;
                for (const n of list) {
                    const m = /^(.*?)(\d+)$/.exec(n.slice(0, -5)); if (!m) continue;
                    const num = parseInt(m[2], 10);
                    if (!min || num < min.num) min = { num, n };
                    if (!max || num > max.num) max = { num, n, pre: m[1], w: m[2].length };
                }
                if (list.filter(n => /\d+\.webp$/i.test(n)).length < 2) return;
                const dst = path.join(t, 'img', 'pictures', d, max.pre + String(max.num + 1).padStart(max.w, '0') + '.webp');
                if (!fs.existsSync(dst)) { fs.copyFileSync(path.join(dir, i === 0 ? min.n : max.n), dst); this.say("title frame made from the game's own: " + dst); }
            });
        },
        /** the game's own package.json with co-op's app name (its settings apart from the Steam game's), title, more windows */
        packageJson(t) {
            let s = read(path.join(GAME, 'package.json')); if (!s) return false;
            let i = s.indexOf('"name"');
            if (i >= 0) { const vs = s.indexOf('"', i + 6) + 1, ve = Json.strEnd(s, vs - 1); if (vs > 0 && ve > 0) s = s.slice(0, vs) + COOP_APP + s.slice(ve); }
            i = s.indexOf('"title"');
            if (i >= 0) { const vs = s.indexOf('"', i + 7) + 1, ve = Json.strEnd(s, vs - 1); if (vs > 0 && ve > 0 && !s.slice(vs, ve).includes('(Co-op)')) s = s.slice(0, ve) + ' (Co-op)' + s.slice(ve); }
            if (!s.includes('"single-instance"')) { i = s.indexOf('{'); if (i >= 0) s = s.slice(0, i + 1) + '\r\n    "single-instance": false,' + s.slice(i + 1); }
            fs.writeFileSync(path.join(t, 'package.json'), Buffer.from(s, 'latin1'));
            return true;
        },
        /** an old co-op prototype in the copy's mods folder would take over co-op: switched off by renaming */
        oldMods(dir) {
            let list = []; try { list = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return; }
            for (const e of list) {
                const p = path.join(dir, e.name);
                if (e.isDirectory()) this.oldMods(p);
                else if (/\.js$/i.test(e.name) && /window\.ElderfieldCoop *=/.test(read(p))) { fs.renameSync(p, p + '.disabled'); this.say('switched off an old co-op mod: ' + p); }
            }
        },
        /** the co-op copy starts in its own folder; this window closes */
        start(t) {
            if (TEST && TEST.noStart) { this.started = t; return Promise.resolve(); }
            return new Promise((res, rej) => {
                const c = require('child_process').spawn(path.join(t, 'Game.exe'), (TEST && TEST.args) || [], { cwd: t, detached: true, stdio: 'ignore' });
                c.on('error', rej);
                setTimeout(() => { c.unref(); res(); try { nw.App.quit(); } catch (e) { window.close(); } }, 1500);
            });
        }
    };

    // ---- the launcher keeps itself up to date (user, 2026-11-06: "it can download the new updates from inside the game and
    //      we wouldn't have to update the vortex mod every time"). CO-OP first looks at the updates repo's launcher release
    //      (launcher/latest.json, tools/publish-launcher.js), signed with co-op's key like every co-op update. A newer one
    //      replaces this mod's own files: the launcher, co-op's files for the copy, and in the mods folder its config,
    //      mod.json and how-to. Every file is checked against its signed fingerprint before anything is written; through
    //      Vortex's links the file in Vortex's staging folder is written, so Vortex sees no change. Then the game reloads and
    //      CO-OP carries on. Off when the co-op copy's updates are turned off ("Don't check for updates"). ----
    const Self = {
        KEY: 'tnHoLy2YjnyjKpOVrPT5pxJGtDb9xzN4Y0NtdeRi2GU=',     // co-op's Ed25519 public key (the co-op updater's Updater.KEY)
        BASE: (TEST && TEST.updates) || 'https://raw.githubusercontent.com/Luccious/elderfield-coop-updates/main/',
        /** the only files it may write: this mod's own (no programs, nothing of the game's) */
        ALLOWED: /^(js\/plugins\/ElderfieldCoopLauncher\.js|ElderfieldCoop-files\/(elderfieldcoop\.js|coop-plugins\.json|releases\.json|launcher\.json|ws\/([\w-]+\/)*[\w.-]+\.(js|mjs|json|md)|ws\/LICENSE)|config\.json|mod\.json|How to play together\.txt)$/,
        MOD_ONLY: ['config.json', 'mod.json', 'How to play together.txt'],      // the mods folder's own, not put into the game folder
        MAX: 20 * 1024 * 1024,
        sha(buf) { return require('crypto').createHash('sha256').update(buf).digest('hex'); },
        url(rel) { return (this.BASE.endsWith('/') ? this.BASE : this.BASE + '/') + rel; },
        stamp() { try { return String(JSON.parse(read(path.join(MOD.files, 'launcher.json'))).stamp || ''); } catch (e) { return ''; } },
        off() {
            if (TEST && TEST.noUpdate) return true;
            try { return !!JSON.parse(read(path.join(Place.find(), 'coop-update', 'prefs.json'))).off; } catch (e) { return false; }
        },
        /** HTTPS GET (http only to this PC, for tests), following GitHub's redirects, capped in size and time */
        get(url, hops) {
            return new Promise((res, rej) => {
                let u; try { u = new URL(url); } catch (e) { return rej(new Error('bad address')); }
                const local = u.hostname === '127.0.0.1' || u.hostname === 'localhost';
                if (u.protocol !== 'https:' && !(u.protocol === 'http:' && local)) return rej(new Error('not https'));
                const r = require(u.protocol === 'https:' ? 'https' : 'http').get(u, { headers: { 'User-Agent': 'ElderfieldCoop-Launcher' } }, rs => {
                    if ([301, 302, 303, 307, 308].includes(rs.statusCode) && rs.headers.location && (hops || 0) < 4) { rs.resume(); return res(this.get(new URL(rs.headers.location, u).href, (hops || 0) + 1)); }
                    if (rs.statusCode !== 200) { rs.resume(); return rej(new Error(rs.statusCode === 404 ? 'not published' : 'the server said ' + rs.statusCode)); }
                    const parts = []; let n = 0;
                    rs.on('data', c => { n += c.length; if (n > this.MAX) { r.destroy(); rej(new Error('too big')); } else parts.push(c); });
                    rs.on('end', () => res(Buffer.concat(parts)));
                    rs.on('error', rej);
                });
                r.setTimeout(8000, () => r.destroy(new Error('no answer')));
                r.on('error', rej);
            });
        },
        verify(data, sig) {
            try {
                const c = require('crypto');
                const key = c.createPublicKey({ key: Buffer.concat([Buffer.from('302a300506032b6570032100', 'hex'), Buffer.from(this.KEY, 'base64')]), format: 'der', type: 'spki' });
                return c.verify(null, data, key, Buffer.from(String(sig).trim(), 'base64'));
            } catch (e) { return false; }
        },
        /** the newest launcher release's signed file list; throws unless it is signed and sound */
        async manifest() {
            const q = '?t=' + Date.now(), data = await this.get(this.url('launcher/latest.json' + q)), sig = await this.get(this.url('launcher/latest.json.sig' + q));
            if (!this.verify(data, sig.toString('utf8'))) throw new Error("it isn't signed with co-op's key");
            const m = JSON.parse(data.toString('utf8'));
            if (!m || m.format !== 1 || m.kind !== 'launcher' || !/^[0-9a-f]{10}$/.test(m.build) || typeof m.stamp !== 'string' || !Array.isArray(m.files)) throw new Error("it isn't a co-op launcher release");
            for (const f of m.files) {
                if (!f || typeof f.path !== 'string' || !this.ALLOWED.test(f.path) || f.path.split('/').includes('..') || !/^[0-9a-f]{64}$/.test(f.sha256) || !(Number.isInteger(f.size) && f.size >= 0 && f.size <= this.MAX))
                    throw new Error('it lists a file the launcher never updates (' + String(f && f.path).slice(0, 60) + ')');
            }
            if (!m.files.some(f => f.path === 'js/plugins/ElderfieldCoopLauncher.js')) throw new Error('it has no launcher');
            return m;
        },
        /** where this mod's files are: the mods folder's copy, and the game folder's (Vortex) when it has them */
        roots() {
            const out = [];
            if (!MOD.vortex) out.push({ dir: MOD.root, mods: true });
            if (fs.existsSync(path.join(GAME, 'js', 'plugins', 'ElderfieldCoopLauncher.js')) || fs.existsSync(path.join(GAME, FILES))) out.push({ dir: GAME, mods: false });
            return out;
        },
        targets(rel) { return this.roots().filter(r => r.mods || !this.MOD_ONLY.includes(rel)).map(r => path.join(r.dir, ...rel.split('/'))); },
        hashOf(f) { try { return this.sha(fs.readFileSync(f)); } catch (e) { return ''; } },
        /** a file, written whole; through a link (Vortex), the file it points to */
        write(dest, buf) {
            let to = dest;
            try { if (fs.lstatSync(dest).isSymbolicLink()) to = fs.realpathSync(dest); } catch (e) { /* a new file */ }
            fs.mkdirSync(path.dirname(to), { recursive: true });
            fs.writeFileSync(to + '.coop-new', buf); fs.renameSync(to + '.coop-new', to);
        },
        /** checks and, when there is a newer release, updates: 'updated' (reload to use it) or '' (carry on as it is) */
        async check(progress) {
            if (this.off()) return '';
            let m; try { m = await this.manifest(); } catch (e) { console.log('[Elderfield Co-op] launcher: no update check (' + e.message + ')'); return ''; }
            const from = this.stamp();
            if (!(m.stamp > from)) return '';                          // the same release or an older one: never back
            const todo = m.files.filter(f => this.targets(f.path).some(t => this.hashOf(t) !== f.sha256));
            const got = [];
            for (let i = 0; i < todo.length; i++) {
                const f = todo[i]; if (progress) progress(i + 1, todo.length);
                const buf = await this.get(this.url('launcher/' + m.build + '/files/' + f.path.split('/').map(encodeURIComponent).join('/')));
                if (buf.length !== f.size || this.sha(buf) !== f.sha256) throw new Error('a download did not match its fingerprint (' + f.path + ')');
                got.push({ f, buf });
            }
            // the old files kept until every new one is in, and put back if anything fails half way
            const done = [];
            try {
                for (const { f, buf } of got) for (const t of this.targets(f.path)) {
                    if (this.hashOf(t) === f.sha256) continue;
                    let old = null; try { old = fs.readFileSync(t); } catch (e) { /* a new file */ }
                    this.write(t, buf); done.push({ t, old });
                }
            } catch (e) {
                done.forEach(d => { try { if (d.old) this.write(d.t, d.old); else fs.unlinkSync(d.t); } catch (x) { /* best effort */ } });
                throw new Error('a file could not be written, so the old ones are back (' + e.message + ')');
            }
            console.log('[Elderfield Co-op] launcher ' + (from || 'before self-updates') + ' -> ' + m.stamp + ': ' + done.length + ' file(s)');
            // only its release note changed (the same files again): nothing to load again
            return done.some(d => !/launcher\.json$/.test(d.t)) ? 'updated' : '';
        },
        /** after an update the game loads its plugins again (the mod loader rebuilds its injector) and CO-OP carries on */
        AGAIN: 'ElderfieldCoopLaunchAgain',
        reload() {
            try { sessionStorage.setItem(this.AGAIN, '1'); } catch (e) { /* CO-OP pressed again by hand */ }
            try { nw.Window.get().reloadIgnoringCache(); } catch (e) { location.reload(); }
        },
        again() { try { const a = sessionStorage.getItem(this.AGAIN); sessionStorage.removeItem(this.AGAIN); return a === '1'; } catch (e) { return false; } }
    };

    // ---- the screens: co-op's own question box (as in the co-op copy's menus) ----
    const T = {
        title: 'Co-op',
        first: ['Co-op plays in its own copy of the game, with its own saves:', '%1', 'About %2 GB. Your Steam game and its saves are not changed.', 'It connects %3 (Mods > Elderfield Co-op to change).'],
        make: 'Make the co-op copy', later: 'Not now', ok: 'OK',
        steam: 'through Steam', direct: 'directly (network, internet code or Hamachi)',
        making: 'Making the co-op copy… %1%', updating: 'The game was updated: bringing the co-op copy up to date… %1%',
        sizes: '%1 of %2 GB.', kept: '%1 of %2 GB. Its co-op worlds are kept.', connect: 'Setting how co-op connects…',
        starting: 'Starting the co-op copy…', startNote: 'This window closes; co-op opens in its own.',
        running: 'The co-op copy is already running.', failed: "Co-op couldn't make its copy", unchanged: 'Your Steam game was not changed.',
        checking: 'Looking for co-op updates…', selfUpdating: 'Updating co-op… %1 of %2 files', selfFailed: "Co-op couldn't update itself", selfOld: 'It carries on as it is.'
    };
    window.ElderfieldCoopLauncher = { Copy, Place, Plugins, Self, need: () => Copy.need(Place.find()), make: (t, mode, p) => Copy.make(t, mode, p || (() => {})) };   // for tests
    const gb = n => (n / 1073741824).toFixed(1);
    if (typeof Window_Command === 'undefined' || typeof Scene_MenuBase === 'undefined') return;
    class Window_CoopLaunch extends Window_Command {
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
    class Scene_CoopLaunch extends Scene_MenuBase {
        create() {
            super.create();
            this._ask = new Window_CoopLaunch(new Rectangle(0, 0, 10, 10));
            this.addWindow(this._ask);
        }
        start() {
            super.start();
            // the launcher's own update first (once: not again right after one)
            if (Scene_CoopLaunch.again) { Scene_CoopLaunch.again = false; return this.begin(); }
            this.say([T.title, T.checking], []);
            Self.check((i, n) => this.say([T.title, T.selfUpdating.replace('%1', i).replace('%2', n)], [])).then(r => {
                if (r === 'updated') return Self.reload();
                this.begin();
            }, e => {
                console.error('[Elderfield Co-op] launcher update', e);
                this.say([T.selfFailed, String(e.message || e).slice(0, 110), T.selfOld], [{ label: T.ok, key: 'go' }], () => { this.begin(); return false; });
            });
        }
        begin() {
            const t = this._target = Place.find(), need = Copy.need(t);
            if (need === 'running') return this.say([T.title, T.running], [{ label: T.ok, key: 'close' }]);
            if (need === 'new') {
                let size = 0; try { size = Copy.gameFiles().reduce((n, f) => n + f.size, 0); } catch (e) { /* shown as 0 */ }
                const how = Copy.wanted(t) === 'steam' ? T.steam : T.direct;
                return this.say([T.title].concat(T.first.map(l => l.replace('%1', t).replace('%2', gb(size)).replace('%3', how))),
                    [{ label: T.make, key: 'go' }, { label: T.later, key: 'close' }], key => key === 'go' ? (this.run(t, 'new'), false) : true);
            }
            if (need) return this.run(t, need);
            this.go(t);
        }
        say(lines, choices, cb) {
            const a = this._ask;
            this._cb = cb; this._busy = !choices.length;
            const w = Math.min(Graphics.boxWidth - 40, 860);
            const h = lines.length * a.lineHeight() + 10 + choices.length * a.itemHeight() + a.padding * 2 + 8;
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
        async run(t, mode) {
            const upd = mode === 'game' && isCopy(t) && gameVersion(t) !== gameVersion(GAME), head = upd ? T.updating : T.making;
            let shown = 0;
            this.say([T.title, mode === 'connect' ? T.connect : head.replace('%1', 0)], []);
            try {
                await Copy.make(t, mode, (d, n) => {
                    if (Date.now() - shown < 250) return; shown = Date.now();
                    this.say([T.title, head.replace('%1', Math.floor(d * 100 / Math.max(1, n))), (isCopy(t) ? T.kept : T.sizes).replace('%1', gb(d)).replace('%2', gb(n))], []);
                });
                this.go(t);
            } catch (e) {
                console.error('[Elderfield Co-op]', e);
                this.say([T.failed, String(e.message || e).slice(0, 110), T.unchanged], [{ label: T.ok, key: 'close' }]);
            }
        }
        go(t) {
            this.say([T.title, T.starting, T.startNote], []);
            Copy.start(t).catch(e => this.say([T.failed, String(e.message || e).slice(0, 110), T.unchanged], [{ label: T.ok, key: 'close' }]));
        }
    }

    // ---- the CO-OP button on the title, where and how the co-op copy shows it ----
    const ART = {
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
    const TitlePad = {   // controller moves on the title with CO-OP in it (the co-op copy's own)
        target(dir, i, list, pics) {
            const c = list.findIndex(x => x && x.symbol === 'coop');
            if (c < 0 || !pics) return null;
            if (!pics[c] || !pics[c]._orgXY) return null;
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
    if (typeof Window_TitleCommand !== 'undefined') {
        const _make = Window_TitleCommand.prototype.makeCommandList;
        Window_TitleCommand.prototype.makeCommandList = function () {
            _make.call(this);
            if (this._list.some(c => c.symbol === 'coop')) return;
            const at = Math.max(0, this._list.findIndex(c => c.symbol === 'newGame')) + 1;
            this._list.splice(at, 0, { name: 'CO-OP', symbol: 'coop', enabled: true, ext: null, mogOriginalIndex: 'coop' });
        };
    }
    if (typeof Moghunter !== 'undefined' && Moghunter.title_com_pos) Moghunter.title_com_pos.coop = '279,545';
    if (typeof Scene_Title !== 'undefined') {
        if (Scene_Title.prototype.moveSpatialIndex) {
            const _move = Scene_Title.prototype.moveSpatialIndex;
            Scene_Title.prototype.moveSpatialIndex = function (dir) {
                const w = this._commandWindow;
                const to = w && w._list ? TitlePad.target(dir, w._index, w._list, this._TpictureCom) : null;
                if (to === null) return _move.apply(this, arguments);
                if (to >= 0 && to !== w._index) { SoundManager.playCursor(); w._index = to; }
            };
        }
        const _cmd = Scene_Title.prototype.createCommandWindow;
        Scene_Title.prototype.createCommandWindow = function () {
            _cmd.call(this);
            this._commandWindow.setHandler('coop', () => { this._commandWindow.close(); SceneManager.push(Scene_CoopLaunch); });
        };
        // reloaded after the launcher updated itself: CO-OP carries on by itself
        const _start = Scene_Title.prototype.start;
        Scene_Title.prototype.start = function () {
            _start.apply(this, arguments);
            if (Self.again()) { Scene_CoopLaunch.again = true; if (this._commandWindow) this._commandWindow.close(); SceneManager.push(Scene_CoopLaunch); }
        };
    }
    if (typeof TpictureCom !== 'undefined') {
        const _prep = TpictureCom.prototype.prepareBitmap;
        TpictureCom.prototype.prepareBitmap = function () {
            if (this._originalIndex === 'coop') { this.bitmap = ART.bitmap(); return; }
            _prep.call(this);
        };
    }
})();

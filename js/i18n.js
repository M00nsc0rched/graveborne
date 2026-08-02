// ---------- Localisation: English (source) / Hungarian ----------
// The game's text reaches the screen through a handful of helpers — U.make, Btn,
// log and shopLine — so translation hooks in there instead of at ~450 call sites.
// A string is looked up exactly, then against a short list of patterns for the
// lines that interpolate a name or a number; anything unknown falls through as
// English. That fallback is the point: a missing entry costs you one English
// line, never a crash and never a raw key on screen.
//
// Content nouns (classes, items, skills, enemies, biomes…) are not looked up at
// all — they are written straight onto the Data tables by setLang(), so every
// existing `en.name` / `it.desc` read site keeps working untouched. Adding more
// Hungarian later is pure data: extend DATA_HU below, no engine changes.
const I18N = (function(){
  'use strict';

  let lang = 'en';

  // ---- exact-match UI and log lines ----
  const UI_HU = {
    // — settings & display —
    'Settings': 'Beállítások',
    'Screen fill': 'Képernyő-kitöltés',
    'How much of the phone the game is allowed to take. Pull it in if the edges of your screen are cutting anything off.':
      'Mekkora részt foglalhat el a játék a telefonon. Húzd beljebb, ha a képernyő széle levág valamit.',
    'Full screen': 'Teljes képernyő',
    'Edge to edge. What the game was drawn for.': 'Széltől szélig. Így tervezték a játékot.',
    'A hair of margin, in case the edges are being eaten.': 'Egy hajszálnyi margó, ha a szélek eltűnnének.',
    'Comfortable inset — everything clears the corners.': 'Kényelmes behúzás — minden elfér a sarkoktól.',
    'Well clear of the notch and the home bar.': 'Jóval a kivágás és a kezdősáv alatt.',
    'Smallest. Nothing can reach the screen edge.': 'A legkisebb. Semmi nem ér a képernyő széléig.',
    'Orientation': 'Tájolás',
    "Phones give web apps no way to ask the system for landscape, so the game turns itself instead. Pick landscape, lock your phone's rotation, and hold it sideways.":
      'A telefonok nem engedik, hogy egy webalkalmazás fekvő tájolást kérjen, ezért a játék forgatja el magát. Válaszd a fekvőt, zárold a telefon forgatását, és tartsd oldalra.',
    'Upright': 'Álló',
    'Follow the phone. Portrait when the phone is portrait.': 'Kövesse a telefont. Álló, ha a telefon is álló.',
    'Landscape': 'Fekvő',
    'Turn the game on its side. Hold the phone sideways to play.': 'Fordítsd oldalra a játékot. Tartsd oldalra a telefont játék közben.',
    'Move: WASD / Arrows &nbsp;·&nbsp; Inventory: I &nbsp;·&nbsp; Wait: Space':
      'Mozgás: WASD / nyilak &nbsp;·&nbsp; Készlet: I &nbsp;·&nbsp; Várakozás: szóköz',
    'Hold to repeat · ● waits': 'Tartsd nyomva az ismétléshez · ● várakozik',
    'HONOR': 'BECSÜLET', 'BOUNTY': 'VÉRDÍJ', 'DEPTH': 'MÉLYSÉG',
    'Skills': 'Képességek', 'Recipes known': 'Ismert receptek',
    'Hungry': 'Éhes', 'STARVING': 'ÉHEZIK', 'STARVED': 'KIÉHEZETT',
    'none': 'nincs', 'empty': 'üres', '(free)': '(ingyenes)',
    '☰ Menu': '☰ Menü', 'Flee': 'Menekülés',
    'Movement': 'Mozgás',
    'Smooth glides the view a step at a time, with a faint trail behind you — easier on the eyes over a long descent. Instant snaps tile to tile, the old way.':
      'A Sima lépésenként gördíti a képet, halvány csíkkal mögötted — hosszú lemerülésen kíméletesebb a szemnek. Az Azonnali mezőről mezőre ugrik, a régi módon.',
    'Smooth': 'Sima',
    'The world slides a step at a time. A little motion sells the walk.': 'A világ lépésenként siklik. A mozgás elhiteti a járást.',
    'Instant': 'Azonnali',
    'Hard snap between tiles. No slide, no trail.': 'Kemény ugrás mezők között. Nincs siklás, nincs csík.',
    'Language': 'Nyelv',
    'The language the game speaks. Names, items and the chronicle follow your choice; anything not yet translated stays in English.':
      'A játék nyelve. A nevek, tárgyak és a krónika követi a választásod; ami még nincs lefordítva, angolul marad.',
    'English': 'English',
    'The original text, as written.': 'Az eredeti szöveg, ahogy megírták.',
    'Magyar': 'Magyar',
    'Magyar nyelvű szöveg. Ami még nincs lefordítva, angolul marad.': 'Magyar nyelvű szöveg. Ami még nincs lefordítva, angolul marad.',
    'Reset to full & upright': 'Vissza teljesre és állóra',
    '· · ·': '· · ·',
    'Playable classes': 'Játszható kasztok',

    // — title & character select —
    'GRAVEBORNE': 'GRAVEBORNE',
    '· A DARK-FANTASY DESCENT ·': '· SÖTÉT FANTASY LEERESZKEDÉS ·',
    'Buriedbornes-style skill combat · roguelike depths · your <b style="color:#c8a24a">HONOR</b> decides what the dark shows you.':
      'Buriedbornes-stílusú képességharc · roguelike mélységek · a <b style="color:#c8a24a">BECSÜLETED</b> dönti el, mit mutat neked a sötét.',
    'Choose Your Doomed': 'Válaszd ki az elkárhozottad',
    'Each begins at a different point on the road of honor — and will meet the depths differently for it.':
      'Mindegyik más pontról indul a becsület útján — és ezért másképp találkozik a mélységgel.',
    '<span style="color:#7fb0d0">Sanctum boons active:</span> ': '<span style="color:#7fb0d0">Aktív szentélyáldások:</span> ',
    'What You Were Before': 'Ami előtte voltál',
    'The Cursed Path': 'Az átkozott ösvény',
    'Pick the discipline you will follow this whole descent. You will only be able to learn spells of the path you choose.':
      'Válaszd ki, melyik irányt követed az egész lemerülés alatt. Csak a választott ösvény varázslatait tanulhatod meg.',
    'The others walk in already shaped. She walks in owing, and takes the difference out of whatever she kills.':
      'A többiek készen érkeznek. Ő adóssággal jön, és abból szedi be a különbséget, amit megöl.',
    '<i>No points to spend. Every fight you win gives her one instead — and she chooses no better than the dark does.</i>':
      '<i>Nincs elkölthető pont. Helyette minden megnyert harc ad neki egyet — és nem választ jobban, mint a sötét.</i>',
    'Spread them evenly': 'Oszd el egyenletesen',
    'Clear': 'Törlés',
    'Begin Descent': 'Lemerülés indítása',
    'Sanctum ◈': 'Szentély ◈',
    'Codex': 'Kódex',
    'Continue': 'Tovább',
    'Descend': 'Leereszkedés',
    'Title': 'Címképernyő',
    'New Descent': 'Új lemerülés',
    'Return to Title': 'Vissza a címképernyőre',
    'Keep Going': 'Folytatás',
    'Rise Again': 'Támadj fel újra',

    // — merchant & sanctum —
    'The Hollow Merchant': 'Az Üreges Kereskedő',
    '“Coin for the road, souls for the deep. Spend before the dark spends you.”':
      '„Érme az útra, lélek a mélynek. Költs, mielőtt a sötét költ el téged.”',
    'Services · Gold': 'Szolgáltatások · Arany',
    'Wares · Gold': 'Áruk · Arany',
    'Reliquary · Souls (kept across death)': 'Ereklyetár · Lelkek (halál után is megmarad)',
    'The Sanctum': 'A Szentély',
    'A candlelit hall between deaths. Souls bound here echo into <i>every</i> future descent — the dark cannot take what the Sanctum keeps.':
      'Gyertyafényes csarnok két halál között. Az ide kötött lelkek <i>minden</i> jövőbeli lemerülésbe áthallatszanak — amit a Szentély őriz, azt a sötét nem veheti el.',
    'Bind a New Skill': 'Új képesség kötése',
    '<i>You have taken everything this descent had to offer.</i>': '<i>Mindent elvettél, amit ez a lemerülés kínálhatott.</i>',
    'Choose the skill it will replace:': 'Válaszd ki, melyik képességet váltsa le:',
    '<i>That slot is empty — anything is an improvement.</i>': '<i>Az a hely üres — bármi javulás.</i>',

    // — hints & headers —
    'Walk into foes to fight · ✦ chests · ! events · stairs descend · glowing tiles are hazards.':
      'Lépj az ellenfélbe a harchoz · ✦ ládák · ! események · a lépcső levisz · a világító mezők veszélyesek.',
    'Chronicle — Depth ': 'Krónika — Mélység ',
    'Followers': 'Kísérők',
    'Someone used to walk with you.': 'Valaki járt melletted.',
    '<i>They followed you down. They did not come back up. Your name has not recovered, and it will not.</i>':
      '<i>Követtek téged lefelé. Nem jöttek vissza. A neved nem heverte ki, és nem is fogja.</i>',
    'Eliza was here, and then she was not.': 'Eliza itt volt, aztán már nem.',
    '<i>She got out through a crack you never found, the way she always does. She is not coming back down this descent — and your name is exactly as clean as it was before.</i>':
      '<i>Kijutott egy résen, amit sosem találtál meg, ahogy mindig. Ezen a lemerülésen nem jön vissza — a neved pedig pontosan olyan tiszta, mint volt.</i>',
    '<i>No one walks with you. The deep is not generous with company — but it offers, sometimes, to those who go looking.</i>':
      '<i>Senki nem jár melletted. A mély nem bőkezű a társasággal — de néha felkínálja annak, aki keresi.</i>',
    'Taking someone on means feeding them, mending them and keeping them standing out of their own pack. If they die, your honor falls to the absolute floor and stays there.':
      'Ha magaddal viszel valakit, etetned, gyógyítanod és talpon tartanod kell a saját csomagjából. Ha meghal, a becsületed a legaljára zuhan, és ott is marad.',
    'Knows: ': 'Tudja: ',
    'Their pack': 'A csomagjuk',
    'Hand over from your pack': 'Átadás a saját csomagodból',
    'Equipment': 'Felszerelés',
    'The Bench': 'A munkapad',
    'Brewed and ready: ': 'Megfőzve és készen: ',
    'Provisions': 'Élelem',
    'The Crafting Bench': 'A főzőpad',
    'The same place wears a different face for a different soul. Discover both by walking two different roads of honor.':
      'Ugyanaz a hely más arcot mutat más léleknek. Fedezd fel mindkettőt a becsület két különböző útján járva.',
    'Inventory & Skills': 'Készlet és képességek',
    'Chronicle — what has happened': 'Krónika — ami történt',
    'Set Down the Descent (save)': 'Lemerülés letétele (mentés)',
    'Codex of Encounters': 'Találkozások kódexe',
    'Settings — screen & orientation': 'Beállítások — képernyő és tájolás',
    'Abandon Run': 'Futam feladása',
    'Back to Menu': 'Vissza a menübe',
    '⚗ Crafting bench': '⚗ Főzőpad',
    'Back to Inventory': 'Vissza a készlethez',
    'Abandon this run?': 'Feladod ezt a futamot?',
    'Your progress this descent will be lost. (Codex discoveries are kept.)':
      'Az ezen a lemerülésen elért haladásod elvész. (A kódex felfedezései megmaradnak.)',
    'YOU DIED': 'MEGHALTÁL',
    'VICTORY': 'GYŐZELEM',
    'The Gloamlord is unmade. You climb back toward a sun you had almost forgotten.':
      'A Gloamlord megsemmisült. Felkapaszkodsz egy nap felé, amit már majdnem elfelejtettél.',
    'Try a darker — or purer — soul to uncover the encounters you did not see.':
      'Próbálj sötétebb — vagy tisztább — lelket, hogy felfedd a találkozásokat, amiket nem láttál.',

    // — buttons —
    'Back': 'Vissza',
    'Apply': 'Alkalmaz',
    'Close': 'Bezár',
    'Leave': 'Távozás',
    'Take the Souls': 'Vidd a lelkeket',
    'Keep looking': 'Keress tovább',
    '“I’ll bring them.”': '„Elhozom őket.”',
    'Not now': 'Most nem',
    'Enough trading — take her hand': 'Elég a kereskedésből — fogd meg a kezét',
    'Leave her to it': 'Hagyd rá',
    'Draw steel': 'Kardot rántani',
    'Step back': 'Hátralépni',
    'Cancel': 'Mégse',
    '−': '−',
    '+': '+',
    '◆ ': '◆ ',
    'v': 'v',
    '<i>': '<i>',
    '<i>Your dishonor colors what you see…</i>': '<i>A becstelenséged színezi, amit látsz…</i>',

    // — shop wares —
    'A hot meal': 'Meleg étel',
    'Eat well — FOOD restored to full': 'Egyél jól — az ÉLELEM teljesen feltöltve',
    'Grave-Bread': 'Sírkenyér',
    'A loaf for the road (+35 FOOD when eaten)': 'Egy cipó az útra (+35 ÉLELEM elfogyasztva)',
    'Tend your wounds': 'Sebek ellátása',
    'Restore HP to full': 'ÉP teljes feltöltése',
    'Meditate': 'Meditáció',
    'Restore SP to full': 'FP teljes feltöltése',
    'Draught of Mending': 'Gyógyító főzet',
    'A healing potion for your pack': 'Gyógyitalt a csomagodba',
    'Draught of Focus': 'Összpontosítás főzete',
    'Restores 5 SP when drunk — carry your reserves with you': 'Megiszva 5 FP-t tölt — vidd magaddal a tartalékod',
    'Rite of Absolution': 'Feloldozás szertartása',
    'Honor +15 — buy back your name': 'Becsület +15 — vásárold vissza a neved',
    'Ember of Vigor': 'Az erő parazsa',
    'Permanently +8 Max HP this run': 'Tartósan +8 Max ÉP ezen a futamon',
    'Drink Draught (+26 HP)': 'Főzet megivása (+26 ÉP)',
    'Drink Focus (+5 SP)': 'Összpontosítás megivása (+5 FP)',
    'Eat Grave-Bread (+35 FOOD)': 'Sírkenyér evése (+35 ÉLELEM)',
    'Eat Strange Meat (+60 FOOD…)': 'Furcsa hús evése (+60 ÉLELEM…)',

    // — potion-maker —
    'The Potion-Maker': 'A Főzetkészítő',
    '“One drink, and the pain goes away. You look better for it already. Mind how you go, down there.”':
      '„Egy korty, és a fájdalom elmúlik. Máris jobban festesz tőle. Vigyázz magadra odalent.”',
    'You empty your gatherings onto the bench. Quick, sure fingers sort them, and something in the mortar starts to glow.':
      'A gyűjtésed a padra borítod. Gyors, biztos ujjak válogatják szét, és valami izzani kezd a mozsárban.',
    '“That’s the three. One drink, and the pain goes away — for a while. Here. You earned it.”':
      '„Megvan mind a három. Egy korty, és a fájdalom elmúlik — egy időre. Tessék. Megérdemelted.”',
    '✦ 15 Souls': '✦ 15 lélek',
    '<span style="color:#7fae3a">✦ Achievement — “One drink and the pain goes away.”</span>':
      '<span style="color:#7fae3a">✦ Teljesítmény — „Egy korty, és a fájdalom elmúlik.”</span>',
    'You have earned the potion-maker’s trade. <b>The Alchemist</b> is now yours to play from the character select.':
      'Megszerezted a főzetkészítő mesterségét. <b>Az Alkimista</b> mostantól választható a karakterválasztónál.',
    '“Still short. I can’t brew with a bare bench.”': '„Még kevés. Üres paddal nem tudok főzni.”',
    'A figure hunched over a portable bench of bottles and burners looks up. “You’ve the look of someone in pain. I can fix that — one drink, and it goes away. But I’m out of what it takes.”':
      'Egy alak felnéz az üvegekkel és égőkkel teli hordozható pad fölül. „Úgy nézel ki, mint aki fájdalmat hordoz. Ezen tudok segíteni — egy korty, és elmúlik. De kifogytam abból, ami kell hozzá.”',
    '“Bring me three things that grow on this floor:”': '„Hozz nekem három dolgot, ami ezen az emeleten nő:”',
    'Eliza Sinclair': 'Eliza Sinclair',
    '“Bread and a little else. I said that already.”': '„Kenyér, meg egy kevés más. Ezt már mondtam.”',
    'Brew potions at the bench (Menu → Inventory). Throw the harmful ones at the foe; pour the good ones on yourself or your follower.':
      'Főzz italokat a padnál (Menü → Készlet). A károsakat dobd az ellenfélre; a jókat öntsd magadra vagy a kísérődre.',
    'Aimed blows harm the limb; some damage bleeds through. Severed limbs stay severed.':
      'A célzott csapások a végtagot sértik; a sebzés egy része átszivárog. A levágott végtag levágva marad.',

    // — log lines —
    'Your HONOR shapes what you find here. The dishonored see threats where the pure see people.':
      'A BECSÜLETED formálja, mit találsz itt. A becstelenek fenyegetést látnak ott, ahol a tiszták embert.',
    'The air turns to grave-cold. The Gloamthrone waits on this floor.':
      'A levegő sírhideggé válik. A Gloamtrón ezen az emeleten vár.',
    'Armored steps echo in the dark. The Gilded Inquisition has your scent.':
      'Páncélos léptek visszhangzanak a sötétben. Az Aranyozott Inkvizíció megérezte a szagod.',
    'The stair is barred while its guardian draws breath.': 'A lépcső zárva, amíg az őrzője lélegzik.',
    'Spores fill your lungs — and find nothing that will take. Iron palate.':
      'Spórák töltik meg a tüdőd — és nem találnak semmit, ami megfogná. Vasból van a szájpadlásod.',
    'Spores fill your lungs — you are poisoned!': 'Spórák töltik meg a tüdőd — megmérgeződtél!',
    'Roots seize your legs — the dark moves around you!': 'Gyökerek ragadják meg a lábad — a sötét megmozdul körülötted!',
    'Inside rests a Draught of Mending.': 'Bent egy Gyógyító főzet pihen.',
    'Inside rests a Draught of Focus — cold, blue and still thinking.':
      'Bent egy Összpontosítás főzete pihen — hideg, kék, és még mindig gondolkodik.',
    'Inside, wrapped in wax cloth: Grave-Bread. Down here, that is treasure.':
      'Bent, viaszos kendőbe csomagolva: Sírkenyér. Idelent ez kincs.',
    'Nothing but dust and a smell you will not place.': 'Semmi, csak por és egy szag, amit nem tudsz hova tenni.',
    'The potion-maker marks three sprigs on a scrap of vellum and presses it into your hand.':
      'A főzetkészítő három hajtást rajzol egy pergamendarabra, és a kezedbe nyomja.',
    '✦ Achievement unlocked — The Alchemist is now a playable class.':
      '✦ Teljesítmény feloldva — Az Alkimista mostantól játszható kaszt.',
    'A golden light kindles in the dark. SAINT CASSIEL, THE GOLDEN BLADE has taken the hunt himself.':
      'Arany fény gyúl a sötétben. SZENT CASSIEL, AZ ARANY PENGE maga vette át a hajszát.',
    'The hunt closes in — Inquisition reinforcements arrive.': 'A hajsza szűkül — inkvizíciós erősítés érkezik.',
    'Your stomach tightens. You should eat soon.': 'Összeszorul a gyomrod. Hamarosan enned kellene.',
    'You are STARVING. Your blows land soft and your focus frays — find food.':
      'ÉHEZEL. A csapásaid puhán érkeznek, az összpontosításod foszlik — keress élelmet.',
    'There is nothing left to burn. Your body begins eating itself.':
      'Nem maradt semmi, amit elégethetne. A tested önmagát kezdi felemészteni.',
    'Hunger finishes what the dark began.': 'Az éhség befejezi, amit a sötét elkezdett.',
    'It fights shrunken and wary — it knows what happened to the keeper of the stair.':
      'Összehúzódva és óvatosan harcol — tudja, mi történt a lépcső őrzőjével.',
    'It has no body to unmake — only the whole of it can be broken.':
      'Nincs teste, amit szét lehetne szedni — csak egészében törhető meg.',
    'You fight starving. Your blows land soft, and no focus will return to you.':
      'Éhesen harcolsz. A csapásaid puhán érkeznek, és az összpontosításod nem tér vissza.',
    '“Pathetic. You call for a fight, and then you hide inside it?”':
      '„Szánalmas. Harcot követelsz, aztán elbújsz benne?”',
    'The rot is drawn back out of you.': 'A rothadást kivonják belőled.',
    'The rot cannot find purchase in you. Iron palate.': 'A rothadás nem talál benned fogást. Vasból van a szájpadlásod.',
    'It needs feeding like anything else that walks — and if it dies, that is on you.':
      'Etetni kell, mint bármi mást, ami jár — és ha meghal, az a te lelkeden szárad.',
    'You are stunned and lose your turn!': 'Kábult vagy, elveszíted a köröd!',
    'You are stunned!': 'Kábult vagy!',
    'You are afflicted!': 'Megfertőződtél!',
    'Your strength wanes.': 'Az erőd fogyatkozik.',
    'You are hunted the harder': 'Annál keményebben hajszolnak',
    "Cutthroat's Luck: the coin says blood. Every cut you land this fight will keep bleeding.":
      'A Gégemetsző Szerencséje: az érme vért mond. Minden vágásod ebben a harcban tovább vérzik majd.',
    "Cutthroat's Luck: the coin says precision. Your critical blows bite deeper this fight.":
      'A Gégemetsző Szerencséje: az érme pontosságot mond. A kritikus csapásaid mélyebbre harapnak ebben a harcban.',
    'The two turns are spent and it is still standing. The light withdraws, and takes you with it.':
      'A két kör letelt, és még mindig áll. A fény visszahúzódik, és magával visz téged is.',
    'Your focus is spent and there is nothing left to reach for — the assault comes anyway.':
      'Az összpontosításod elfogyott, és nincs miért nyúlni — a roham mégis jön.',
    'You flip the stolen coin. It rings, spins — the whole fight holds its breath —':
      'Feldobod a lopott érmét. Cseng, pörög — az egész harc visszafojtja a lélegzetét —',
    'You give ground and catch your breath.': 'Hátrálsz, és levegőt veszel.',
    'It fights back on the way down — and loses. Nothing turns your stomach anymore.':
      'Menet közben még visszaharcol — és veszít. Már semmitől nem fordul fel a gyomrod.',
    'It goes down warm — then turns on you. Whatever it was, it disagrees with being eaten.':
      'Melegen csúszik le — aztán ellened fordul. Bármi is volt, nem ért egyet azzal, hogy megeszik.',
    'It cannot follow on ruined legs. You walk away from it — slowly, to make the point.':
      'Tönkretett lábbal nem tud követni. Elsétálsz tőle — lassan, hogy értse.',
    'You break away into the dark — it loses a moment finding its feet.':
      'Kitörsz a sötétbe — egy pillanatot veszít, míg talpra áll.',
    'You fail to escape!': 'Nem sikerül elmenekülnöd!',
    'You end it inside the vigil. The light lets go, and leaves you the life you are standing in.':
      'A virrasztáson belül fejezed be. A fény elenged, és meghagyja neked az életet, amiben állsz.',
    'From the collapsing ribcage you take the Gloamheart — still beating, to a slower clock.':
      'Az összeomló bordakosárból kiveszed a Gloamszívet — még mindig dobog, csak lassabb órára.',
    'The floor knows. What still crawls here has seen what you did to its keeper — it comes at you smaller now.':
      'Az emelet tudja. Ami még mászik itt, látta, mit tettél az őrzőjével — most kisebbre húzódva jön rád.',
    '✦ Achievement — Omen is unmade. The Necromancer is now a playable class.':
      '✦ Teljesítmény — Omen megsemmisült. A Nekromanta mostantól játszható kaszt.',
    "The elite's cache holds a Draught of Mending.": 'Az elit rejtekében egy Gyógyító főzet lapul.',
    'The hunter carried a Draught of Mending.': 'A vadász egy Gyógyító főzetet hordott magánál.',
    'Slaying the Inquisition pays in blood-gold and souls.': 'Az Inkvizíció megölése véraranyban és lelkekben fizet.',
    'It dropped a Draught of Mending.': 'Elejtett egy Gyógyító főzetet.',
    'You carve what travels well. Down here, no one asks what the meat is.':
      'Kivágod, ami jól bírja az utat. Idelent senki nem kérdezi, miből van a hús.',
    'LAST VIGIL — the blow lands, and the light will not let you go.':
      'UTOLSÓ VIRRASZTÁS — a csapás betalál, és a fény nem enged el.',
    'Two turns to end the thing that felled you. Kill it and you keep the life you are standing in. Fail, and it is over.':
      'Két kör, hogy végezz azzal, ami leterített. Öld meg, és megtartod az életet, amiben állsz. Ha nem, vége.',
    'Darkness takes you. Your bones join the Graveborne.': 'A sötétség elvisz. A csontjaid a Graveborne-hoz csatlakoznak.',
    'The Gloamlord collapses into dust. The depths fall silent.': 'A Gloamlord porrá omlik. A mélység elcsendesedik.',
    'Eliza wraps a loaf and takes your coin without counting it.':
      'Eliza becsomagol egy cipót, és számolás nélkül elveszi az érmédet.',
    '“Don’t ask,” she says, and does not smile this time.': '„Ne kérdezd” — mondja, és ezúttal nem mosolyog.',
    'You are MARKED. The Gilded Inquisition hunts the dishonored — but the spoils of sin run rich.':
      'MEGJELÖLT vagy. Az Aranyozott Inkvizíció vadássza a becsteleneket — de a bűn zsákmánya bőséges.',
    'You are HALLOWED. The dark stays its hand and the kind draw near — though fortune turns modest.':
      'MEGSZENTELT vagy. A sötét visszafogja a kezét, és a jóindulatúak közelednek — bár a szerencse szerényebb lesz.',
    'The Inquisition loses your scent. You are no longer Marked.':
      'Az Inkvizíció elveszíti a szagod. Már nem vagy Megjelölt.',
    'That descent could not be taken up again.': 'Azt a lemerülést nem lehetett újra felvenni.',
    'The merchant ladles out something hot. You do not ask. It is wonderful.':
      'A kereskedő kimer valami forrót. Nem kérdezel. Csodálatos.',
    'You buy a loaf of Grave-Bread.': 'Veszel egy cipó Sírkenyeret.',
    'The merchant tends your wounds.': 'A kereskedő ellátja a sebeidet.',
    'Your reserves return.': 'A tartalékaid visszatérnek.',
    'You buy a Draught of Mending.': 'Veszel egy Gyógyító főzetet.',
    'You buy a Draught of Focus.': 'Veszel egy Összpontosítás főzetét.',
    'You are absolved. Honor +15.': 'Feloldozást nyertél. Becsület +15.',
    'You swallow an Ember of Vigor. +8 Max HP.': 'Lenyeled az Erő parazsát. +8 Max ÉP.',
    'You set the descent down. It will be here when you return.':
      'Leteszed a lemerülést. Itt lesz, amikor visszatérsz.',
    'Something refused the record. Nothing was saved.': 'Valami ellenállt a feljegyzésnek. Semmi nem mentődött el.',
    'There is no one there to catch it.': 'Nincs ott senki, aki elkapná.',
    'The enemy has no belly you care to fill.': 'Az ellenségnek nincs olyan gyomra, amit meg akarnál tölteni.',
    'They followed you here because you let them. Whatever your name was worth, it is worth nothing now.':
      'Azért követtek ide, mert hagytad. Bármit ért is a neved, most semmit sem ér.',
    'No body, no blood, no sound of it happening — only a draught from a crack in the wall you had not noticed. She got out. She always does.':
      'Se test, se vér, se hang — csak egy huzat a falrepedésből, amit nem vettél észre. Kijutott. Mindig kijut.',
  };

  // ---- interpolated lines: matched by shape, rebuilt with the same values ----
  const PATTERNS_HU = [
    [/^You descend into the Graveborne depths as the (.+)\.$/,
      'Leereszkedsz a Graveborne mélyébe, mint $1.'],
    [/^— (.+) —$/, '— $1 —'],
    [/^You take the stairs down\. Depth (\d+)\. The descent yields (\d+) Souls\.$/,
      'Lemész a lépcsőn. Mélység $1. A leereszkedés $2 lelket hoz.'],
    [/^You pry open a chest — (\d+) gold\.$/, 'Felfeszítesz egy ládát — $1 arany.'],
    [/^(.+) falls\. \+(\d+) gold\.$/, '$1 elesik. +$2 arany.'],
    [/^You use (.+) for (\d+) damage\.$/, '$1 — $2 sebzés.'],
    [/^You use (.+) — CRITICAL! for (\d+) damage\.$/, '$1 — KRITIKUS! $2 sebzés.'],
    [/^(.+) use (.+) for (\d+) damage\.$/, '$1: $2 — $3 sebzés.'],
    [/^(.+) use (.+) — CRITICAL! for (\d+) damage\.$/, '$1: $2 — KRITIKUS! $3 sebzés.'],
    [/^You mend (\d+) HP\.$/, 'Gyógyulsz $1 ÉP-t.'],
    [/^(.+) mends (\d+) HP\.$/, '$1 gyógyul $2 ÉP-t.'],
    [/^You brace — shield (\d+)\.$/, 'Felkészülsz — pajzs $1.'],
    [/^(.+) braces — shield (\d+)\.$/, '$1 felkészül — pajzs $2.'],
    [/^You suffer (\d+) from festering wounds\.$/, '$1 sebzést szenvedsz az elfertőződött sebektől.'],
    [/^(.+) suffers (\d+) from festering wounds\.$/, '$1 $2 sebzést szenved az elfertőződött sebektől.'],
    [/^You recover (\d+) HP\.$/, 'Visszanyersz $1 ÉP-t.'],
    [/^(.+) recovers (\d+) HP\.$/, '$1 visszanyer $2 ÉP-t.'],
    [/^You drain (\d+) HP\.$/, 'Elszívsz $1 ÉP-t.'],
    [/^(.+) is stunned!$/, '$1 kábult!'],
    [/^(.+) is afflicted!$/, '$1 megfertőződött!'],
    [/^(.+)'s strength wanes\.$/, '$1 ereje fogyatkozik.'],
    [/^(.+)'s shield absorbs (\d+)\.$/, '$1 pajzsa elnyel $2 sebzést.'],
    [/^Your shield absorbs (\d+)\.$/, 'A pajzsod elnyel $1 sebzést.'],
    [/^— (.+) \(BOSS\) blocks your path! (.*)—$/, '— $1 (BOSS) állja az utad! $2—'],
    [/^— (.+) blocks your path! (.*)—$/, '— $1 állja az utad! $2—'],
    [/^Depth (\d+)\.$/, 'Mélység $1.'],
    [/^You are poisoned!$/, 'Megmérgeződtél!'],
    [/^Level Up! (.+)$/, 'Szintlépés! $1'],
    [/^\+(\d+) Souls\.$/, '+$1 lélek.'],
    [/^A legend falls\. \+(\d+) Souls — and the stair below stands unbarred\.$/,
      'Egy legenda elesik. +$1 lélek — és az alatta lévő lépcső szabaddá vált.'],
    [/^The Gloamlord's death releases (\d+) Souls\.$/, 'A Gloamlord halála $1 lelket szabadít fel.'],
    [/^The guardian's hoard yields a Draught of Mending\.$/, 'Az őrző kincse egy Gyógyító főzetet ad.'],
    [/^You equip (?:the )?(.+)\.$/, 'Felszereled: $1.'],
    [/^You take (.+)\.$/, 'Elveszed: $1.'],
    [/^You eat (.+)\.$/, 'Megeszed: $1.'],
    [/^You drink (.+)\.$/, 'Megiszod: $1.'],
    [/^You gather (.+)\.$/, 'Begyűjtöd: $1.'],
    [/^(\d+) gold\.$/, '$1 arany.'],
    // ---- interpolated UI (sheet headers, skill rows, stat buttons) ----
    [/^(.+) — Depth (\d+)$/, '$1 — Mélység $2'],
    [/^The Reckoning — Level (\d+)$/, 'A Számvetés — $1. szint'],
    [/^Sharpen (.+) → tier (\d+)$/, '$1 élezése → $2. fokozat'],
    [/^Learn (.+) — give up which skill\?$/, '$1 tanulása — melyik képességet adod fel?'],
    [/^Bind a New Skill — ◈ (\d+)$/, 'Új képesség kötése — ◈ $1'],
    [/^Max HP \+(\d+)$/, 'Max ÉP +$1'],
    [/^Max SP \+(\d+)$/, 'Max FP +$1'],
    [/^ATK \+(\d+)$/, 'TÁM +$1'],
    [/^DEF \+(\d+)$/, 'VÉD +$1'],
    [/^MAG \+(\d+)$/, 'MÁG +$1'],
    [/^SPD \+(\d+)$/, 'GYO +$1'],
    [/^Inventory & Skills {2}◈ Level Up ready$/, 'Készlet és képességek  ◈ Szintlépés kész'],
    [/^◆ (.+) — Guardian of the Stair$/, '◆ $1 — A Lépcső Őrzője'],
    // ---- combat lines the sweep found still speaking English ----
    [/^Poison courses through you — (\d+) HP\.$/, 'Méreg járja át a tested — $1 ÉP.'],
    [/^You open a vein — (\d+) HP\.$/, 'Eret nyitsz magadon — $1 ÉP.'],
    [/^(.+) bleeds itself — (\d+) HP\.$/, '$1 megvágja magát — $2 ÉP.'],
    [/^The focus floods back \(\+(\d+) SP\)\.$/, 'Az összpontosítás visszaárad (+$1 FP).'],
    [/^You loose (.+) — (\d+) of (\d+) land for (\d+)\.$/, 'Kilövöd: $1 — $3-ből $2 talál, $4 sebzés.'],
    [/^(.+) looses (.+) — (\d+) of (\d+) land for (\d+)\.$/, '$1 kilövi: $2 — $4-ből $3 talál, $5 sebzés.'],
    [/^(.+) drains (\d+) HP\.$/, '$1 elszív $2 ÉP-t.'],
    [/^Oathbound: the dead are your old business\. You open braced — shield (\d+), and your fury already up\.$/,
      'Esküvel kötve: a holtak a te régi ügyed. Felkészülve kezdesz — pajzs $1, és a dühöd már fent.'],
    [/^(.+) shrugs off the rot\.$/, '$1 lerázza magáról a rothadást.'],
    [/^The wound will not close — (\d+) a turn\.$/, 'A seb nem záródik be — $1 körönként.'],
    // ---- codex screen ----
    [/^Codex of Encounters — (\d+)\/(\d+)$/, 'Találkozások kódexe — $1/$2'],
    [/^<i>Undiscovered\. ([\s\S]+)<\/i>$/, '<i>Felfedezetlen. $1</i>'],
    [/^\?\?\? — a mercy$/, '??? — egy irgalom'],
    [/^\?\?\? — a cruelty$/, '??? — egy kegyetlenség'],
    [/^\?\?\? — a mystery$/, '??? — egy rejtély'],
    [/^\?\?\? — unknown$/, '??? — ismeretlen'],
    [/^(.+) is wracked with rot \((\d+)\/turn\)\.$/, '$1 rothadástól gyötrődik ($2/kör).'],
    [/^You (.+) a (.+) at (.+) — (\d+) damage\.$/, '$1 egy $2-t erre: $3 — $4 sebzés.'],
  ];

  // ---- inline labels inside otherwise-dynamic HTML ----
  // Applied only when nothing else matched, and only to distinctive tagged tokens,
  // so ordinary prose containing the same words is never touched.
  const GLOSS_HU = [
    ['<b>HP</b>', '<b>ÉP</b>'], ['<b>SP</b>', '<b>FP</b>'],
    ['<b>Gold</b>', '<b>Arany</b>'], ['<b>ATK</b>', '<b>TÁM</b>'],
    ['<b>DEF</b>', '<b>VÉD</b>'], ['<b>MAG</b>', '<b>MÁG</b>'],
    ['<b>SPD</b>', '<b>GYO</b>'], ['<b>Honor</b>', '<b>Becsület</b>'],
    ['<b>FOOD</b>', '<b>ÉLELEM</b>'], ['<i>empty</i>', '<i>üres</i>'],
    ['<b>Raise a stat</b>', '<b>Tulajdonság növelése</b>'],
    ['(rises each level):', '(szintenként nő):'],
    ['Souls</span>', 'lélek</span>'],
    ['<i>empty — they have nothing to fall back on</i>', '<i>üres — nincs mire támaszkodniuk</i>'],
    ['<i>none</i>', '<i>nincs</i>'], ['(free)', '(ingyenes)'], [' SP)', ' FP)'],
    ['>weapon</b>', '>fegyver</b>'], ['>armor</b>', '>páncél</b>'], ['>trinket</b>', '>ereklye</b>'],
    ['· borrowed, 40% strength, cannot sharpen', '· kölcsönzött, 40% erő, nem élezhető'],
    [' earned</span>', ' szerzett</span>'],
    ['Draught of Mending ×', 'Gyógyító főzet ×'], ['Draught of Focus ×', 'Összpontosítás főzete ×'],
    ['Grave-Bread ×', 'Sírkenyér ×'], ['Strange Meat ×', 'Furcsa hús ×'],
    ['You hold <span style="color:#7fb0d0">◈ ', 'Nálad van <span style="color:#7fb0d0">◈ '],
    ['. Feed them to your flesh to grow — but they are the same Souls the Sanctum keeps, and the dark takes what you fail to bank. These gains last only this descent.',
     '. Etesd velük a húsod, hogy nőj — de ezek ugyanazok a lelkek, amiket a Szentély őriz, és a sötét elveszi, amit nem teszel félre. Ezek a nyereségek csak erre a lemerülésre szólnak.'],
  ];

  // ---- content written onto the Data tables (see DATA_HU in i18n-data.js) ----
  let DATA_HU = {};                 // filled by I18N.addData()
  let backup = null;                // English originals, keyed the same way

  function isPlainObject(v){ return v && typeof v === 'object'; }

  // copy only the keys the patch mentions, remembering what was there before
  function overlay(target, patch, store){
    if (!isPlainObject(target) || !isPlainObject(patch)) return;
    for (const k in patch){
      const pv = patch[k], tv = target[k];
      if (isPlainObject(pv) && isPlainObject(tv)){
        store[k] = store[k] || {};
        overlay(tv, pv, store[k]);
      } else if (pv !== undefined && tv !== undefined){
        if (!(k in store)) store[k] = tv;
        target[k] = pv;
      }
    }
  }
  // grow the translation table without clobbering sibling keys already in it
  function deepMerge(dst, src){
    for (const k in src){
      const sv = src[k];
      if (isPlainObject(sv)){
        if (!isPlainObject(dst[k])) dst[k] = Array.isArray(sv) ? [] : {};
        deepMerge(dst[k], sv);
      } else dst[k] = sv;
    }
  }
  function restore(target, store){
    if (!isPlainObject(target) || !isPlainObject(store)) return;
    for (const k in store){
      const sv = store[k];
      if (isPlainObject(sv) && isPlainObject(target[k])) restore(target[k], sv);
      else target[k] = sv;
    }
  }

  function applyData(on){
    if (typeof Data === 'undefined') return;
    if (on){
      if (backup) return;                  // already applied
      backup = {};
      overlay(Data, DATA_HU, backup);
    } else {
      if (!backup) return;
      restore(Data, backup);
      backup = null;
    }
  }

  // selection markers the settings rows glue onto a label ("◈ Full screen"), which
  // would otherwise miss the dictionary entry for the label itself
  const MARKERS = ['◈ ', '★ ', '◆ '];

  function lookup(s){
    const hit = UI_HU[s];
    if (hit !== undefined) return hit;
    for (let i = 0; i < PATTERNS_HU.length; i++){
      const [re, out] = PATTERNS_HU[i];
      if (re.test(s)) return s.replace(re, out);
    }
    return undefined;
  }

  function t(s){
    if (lang !== 'hu' || typeof s !== 'string' || !s) return s;
    const direct = lookup(s);
    if (direct !== undefined) return direct;
    for (let i = 0; i < MARKERS.length; i++){
      const m = MARKERS[i];
      if (s.startsWith(m)){
        const inner = lookup(s.slice(m.length));
        if (inner !== undefined) return m + inner;
      }
    }
    // last resort: relabel the tagged fragments inside a dynamic string
    let out = s;
    for (let i = 0; i < GLOSS_HU.length; i++){
      const [from, to] = GLOSS_HU[i];
      if (out.indexOf(from) !== -1) out = out.split(from).join(to);
    }
    return out;                            // untranslated stays English, never a key
  }

  return {
    get lang(){ return lang; },
    t,
    setLang(l){
      const next = (l === 'hu') ? 'hu' : 'en';
      if (next === lang) return lang;
      lang = next;
      applyData(lang === 'hu');
      return lang;
    },
    // merge another block of content translations (called by the i18n-data files).
    // Deep, so a later batch can add moves/dialogue to an enemy an earlier batch
    // already named, instead of replacing it.
    addData(block){
      const wasOn = !!backup;
      if (wasOn) applyData(false);         // lift the old overlay before growing it
      deepMerge(DATA_HU, block);
      if (wasOn) applyData(true);
    },
    addUI(block){ Object.assign(UI_HU, block); },
  };
})();

// the one call site everything else uses
function T(s){ return I18N.t(s); }

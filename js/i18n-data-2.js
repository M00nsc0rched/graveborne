// ---------- Hungarian, part two: everything added after the first pass ----------
// The first file (i18n-data.js) covers the game as it stood when it was written.
// This one carries what came later: the ninety-four Codex stories, the five
// thrones and their keepers, the relics they drop, and the whole city above the
// stair. Same mechanism throughout - I18N.addData merges onto the Data tables,
// I18N.addUI adds exact-match interface strings, and anything omitted here simply
// stays English rather than breaking.
//
// Arrays are keyed by index (moves, CITY_NPCS.lines, CONTRACTS), the way CODEX is
// done in the first file.

// ---- relics: the five that already had names keep them byte for byte; what was
// missing on all nine was the active's own name and description ----
I18N.addData({
  ITEMS: {
    wellspring_stave:{ name:'A Forrás', desc:'Ad és ad, az árát pedig a gyomrodból veszi ki. Passzív: az összpontosításod menet közben töltődik — és az éhség kétszer olyan gyorsan jön.',
      active:{ name:'Túlmerítés', desc:'Felszakítod a kutat — az összpontosításod visszaárad, az árát vérben fizeted.' } },
    skinners_needle:{ name:'A Nyúzó Tűje', desc:'Összevarr, és felvarr. Passzív: minden sebből iszik egy keveset.',
      active:{ name:'Felfejtés', desc:'Felnyitod az ellenfél minden varratát — gyengeség és mély vérzés.' } },
    starveling_crown:{ name:'Az Éhenkórász Koronája', desc:'Összeforrt ujjcsontok koronája. Passzív: nehezebb kiüríteni téged.',
      active:{ name:'Felfalás', desc:'A Király éhségével harapsz — az okozott sebzés mind gyógyít.' } },
    velvet_shroud:{ name:'Bársonyleples', desc:'Meleg, mint egy visszatartott lélegzet. Passzív: a sötét a sajátjának néz.',
      active:{ name:'Elbűvölés', desc:'Egyetlen rajongó pillantás — az ellenfél elfelejt harcolni.' } },
    gloamheart:{ name:'Gloamszív', desc:'A Gloamlord szíve, még mindig lassabb órára dobog. Passzív: régi erő szivárog beléd.',
      active:{ name:'Gloamtűz', desc:'Egyetlen lélegzettel elereszted az Őrző hideg lángját.' } },
    choir_reliquary:{ name:'Az Aranyozott Ítélet Ereklyetartója', desc:'A Kórus Hangjáról vették le. Passzív: a Kórus saját felhatalmazása, visszafordítva.',
      active:{ name:'Az Ítélet', desc:'Kihirdeted a büntetést. Úgy csapódik be, mint egy pöröly.' } },
    garrison_bulwark:{ name:'Az Utolsó Helyőrség', desc:'Vantage nagyúr pajzsa, még mindig megvetve, egy felmentésre várva, amely sosem jött el.',
      active:{ name:'Tartsd a Vonalat', desc:'Megveted magad, ahogy ő tette, és nem mozdulsz.' } },
    thousandth_knife:{ name:'Az Ezredik Kés', desc:'Egy kés ezerből, és az egyetlen, amely valaha kijött a Feketeerdőből.',
      active:{ name:'Hátbaszúrás', desc:'A rés, amelyről mindig is tudta, hogy meghagyod.' } },
    kiln_ember:{ name:'A Fojtatlan Parázs', desc:'Négyszáz év elfojtott tűz egyetlen szénben, amely egyszer sem hűlt ki.',
      active:{ name:'Felszítás', desc:'Engedd fel egyszerre. Régóta várja.' } },
  },
});

// ---- the city and the reworked Codex: exact-match interface strings ----
// U.make, Btn and log all pass their text through T(), so an entry here is the
// whole of it - no call site has to change.
I18N.addUI({
  // — Hollowgate: the roster —
  'Graveborne — Hollowgate': 'Graveborne — Üregkapu',
  '· THE DEEP DARK ·': '· A MÉLYSÖTÉT ·',
  'Your souls': 'A lelkeid',
  'New soul': 'Új lélek',
  'No one is standing in Hollowgate. Someone has to be, before anything can go down the stair.':
    'Senki nem áll Üregkapuban. Valakinek állnia kell, mielőtt bármi lemehet a lépcsőn.',
  'Untouched — the Deep Dark has not met you yet.':
    'Érintetlen — a Mélysötét még nem találkozott veled.',

  // — the city —
  'Hollowgate': 'Üregkapu',
  'The last city above the Deep Dark. It has stopped growing and has not yet agreed to stop existing.':
    'Az utolsó város a Mélysötét felett. Növekedni már abbahagyta, megszűnni még nem hajlandó.',
  'The Rope and Lantern': 'A Kötél és Lámpás',
  'Work, drink, and the only door in Hollowgate that leads down.':
    'Munka, ital, és Üregkapu egyetlen ajtaja, amely lefelé vezet.',
  'The Cold Forge': 'A Hideg Kohó',
  'The fire is banked and the shutters are down.': 'A tűz elfojtva, a spaletták lehúzva.',
  'The Grey Chapel': 'A Szürke Kápolna',
  'The Choir keeps it locked from the inside.': 'A Kórus belülről tartja zárva.',
  'Gallows Market': 'Akasztófa Piac',
  'Stalls, mostly empty. Nobody is buying.': 'Standok, többnyire üresen. Senki nem vásárol.',
  'Inventory': 'Készlet',
  'Leave the city': 'Elhagyod a várost',
  'Visit the city': 'Meglátogatod a várost',
  'Cancel': 'Mégse',

  // — the tavern —
  'Low room, long tables, and a stair in the corner that everyone in here has an opinion about.':
    'Alacsony terem, hosszú asztalok, és a sarokban egy lépcső, amelyről itt mindenkinek van véleménye.',
  'Who is in tonight': 'Ki van ma este',
  'Work in hand': 'Kézben lévő munka',
  'Ask about work': 'Munka felől érdeklődsz',
  'Read the board': 'Elolvasod a táblát',
  'Back': 'Vissza',

  // — the Wanderer's book and the board —
  'The Wanderer\'s Book': 'A Vándor Könyve',
  '"I do not send people down. I write down which ones went. Pick a line and I will put your name on it."':
    '„Nem én küldöm le az embereket. Én azt írom fel, melyikük ment. Válassz egy sort, és ráírom a neved."',
  'The Board': 'A Tábla',
  '"Every notice is priced off what it names. A harder thing pays more because a harder thing costs more. That is the whole of the system."':
    '„Minden hirdetmény ára abból jön, amit megnevez. A nehezebb dolog többet fizet, mert a nehezebb dolog többe kerül. Ennyi az egész rendszer."',

  // — the stair —
  'The stair': 'A lépcső',
  'Down, then.': 'Akkor hát lefelé.',
  'Go down': 'Lemész',
  'Not yet': 'Még nem',
  '<i>You have been down before, and it noticed. Everything you meet this time is heavier than what met you last time.</i>':
    '<i>Voltál már odalent, és ezt észrevette. Amivel most találkozol, mind nehezebb annál, ami legutóbb jött veled szembe.</i>',

  // — the Codex —
  'The same place wears a different face for a different soul. Discover both by walking two different roads of honor. Anything you have found opens.':
    'Ugyanaz a hely más arcot mutat egy másik léleknek. Fedezd fel mindkettőt: járd végig a becsület két különböző útját. Amit megtaláltál, az megnyitható.',
  'A mercy': 'Kegyelem', 'A cruelty': 'Kegyetlenség', 'A mystery': 'Rejtély', 'Recorded': 'Feljegyezve',
  'a mercy': 'egy jó cselekedet', 'a cruelty': 'egy kegyetlenség', 'a mystery': 'egy rejtély',
  'unknown': 'ismeretlen',
  'The Codex holds the deed but has not yet found the words for it.':
    'A Kódex őrzi a tettet, de a szavakat még nem találta meg hozzá.',

  // — death and victory, now that both lead back to the city —
  'Begin again': 'Kezdd elölről',
  'Climb back to Hollowgate': 'Felkapaszkodsz Üregkapuba',
  'Take the road': 'Útnak indulsz',
  'Choose a path first': 'Előbb válassz utat',
});


// ---- lines that carry a name or a number through them ----
// These cannot be matched exactly, so each is a regex and a replacement. The
// capture groups keep the numbers and the already-localised names in place.
I18N.addPatterns([
  [/^You go down into the Deep Dark as the (.+)\.$/,
    'Lemész a Mélysötétbe, mint $1.'],
  [/^It remembers you\. Everything down here comes (\d+)% heavier than it did\.$/,
    'Emlékszik rád. Idelent minden $1%-kal nehezebben jön, mint azelőtt.'],
  [/^Descents survived: (\d+) · the dark comes back (\d+)% heavier$/,
    'Túlélt lemerülések: $1 · a sötét $2%-kal nehezebben tér vissza'],
  [/^The throne empties\. (\d+) Souls come loose with it\.$/,
    'A trón kiürül. $1 lélek szakad le vele.'],
  [/^You take (.+) off what is left of it\.$/,
    'Leveszed róla — $1 —, ami maradt belőle.'],
  [/^(.+) comes apart\. The depths fall silent\.$/,
    '$1 szétesik. A mélység elnémul.'],
  [/^(.+) is unmade\. You climb back toward a sun you had almost forgotten\.$/,
    '$1 megsemmisült. Felkapaszkodsz egy nap felé, amelyet már-már elfelejtettél.'],
  [/^Codex of Encounters — (\d+)\/(\d+)$/,
    'Találkozások Kódexe — $1/$2'],
  [/^Descents: (\d+) · Deepest: (\d+) · Codex: (\d+)\/(\d+)$/,
    'Lemerülések: $1 · Legmélyebb: $2 · Kódex: $3/$4'],
  [/^Undiscovered\. (.+)$/, 'Felfedezetlen. $1'],
  [/^\?\?\? — (.+)$/, '??? — $1'],
  [/^What you came for: (.+)$/, 'Amiért jöttél: $1'],
  [/^(.+) — pays (\d+)✦$/, '$1 — fizet $2✦'],
  [/^(.+) · (\d+) HP · (\d+) ATK \/ (\d+) MAG\. Halloway wants proof, not a story\.$/,
    '$1 · $2 ÉP · $3 TÁM / $4 MÁG. Halloway bizonyítékot akar, nem történetet.'],
  [/^(.+) bars a stair in (.+)\. Bring back the proof\.$/,
    '$1 elzár egy lépcsőt itt: $2. Hozd vissza a bizonyítékot.'],
  [/^You equip (.+)\.$/, 'Felszereled: $1.'],
]);

// ---- the fragments the city assembles its composite lines from ----
// These are concatenated into strings that also carry markup and numbers, so
// each piece is looked up on its own rather than the finished sentence.
I18N.addUI({
  'the one coin that outlives a soul.': 'az egyetlen pénz, amely túléli a lelket.',
  'Lv': 'Szint',
  'new': 'új',
  'pays': 'fizet',
  'What you came for:': 'Amiért jöttél:',
  'Halloway wants proof, not a story.': 'Halloway bizonyítékot akar, nem történetet.',
  'bars a stair in': 'elzár egy lépcsőt itt:',
  'Bring back the proof.': 'Hozd vissza a bizonyítékot.',
  // bounty ranks
  'Throne': 'Trón', 'Legend': 'Legenda', 'Named': 'Nevesített', 'Common': 'Közönséges',
});

// ---- the Codex stories: the well through the envoy ----
I18N.addData({
CODEX_LORE: {
    // -- a kút --
    well_mercy: 'Ordrának hívták, és egy helyőrségnek húzott vizet, amely egy nap nem jött fel érte többé. Attól még húzta tovább; a kötél olyan vájatot koptatott a kút kőperemébe, hogy ma is beleteszed az ujjad. Négyszáz vándornak nyújtotta már oda azt a csészét. A legtöbben acélt rántottak. Azokra emlékszik, akik ittak, és a nevüket a kútaknába mondja, ahol a visszhang megtartja őket.',
    well_lore: 'Már idelent volt, mielőtt a trónra bárki ült volna, és látta, ahogy az első Gloamlordot elviszik a kútja előtt, nyers fából ácsolt ravatalon. Amit elmondott neked, az nem jóslat. Tanúvallomás, négy évszázados késéssel, az első embernek, aki elég sokáig állt csendben ahhoz, hogy végighallgassa.',
    well_truth: 'A víz fényében szürke volt és rossz, és minden ösztönöd azt mondta: öld meg. Nem tetted. Ami lehámlott róla, nem álarc volt, hanem szokás — négyszáz év, amelyben mindig pengével fogadták, megtanítja az arcot, hogy pengére számítson. Alatta: egy fáradt asszony, zavartan, még mindig kinyújtott csészével.',
    well_bloodied: 'A csésze felé nyúlt. Te karmot láttál. A kút körüli kő beitta a foltot, és nem adja vissza, a víznek pedig vasíze lesz mindenkinek, aki utánad jön. Ő már azelőtt is tisztán húzta fel, hogy a nagyanyád nagyanyjának neve lett volna.',

    // -- a ketrec --
    cage_freed: 'A ketrec Kórus-munka volt — vékony rács, jó zár, és egy tábla: A HAMVAS SZENTSZÉK TULAJDONA. Bármit is fogtak az Erdőben, elég régóta ült odabent ahhoz, hogy a saját alakját simára koptassa a sarokban. Nem mondott köszönetet. A következő folyosón melléd szegődött, és azóta sem hagyta el az oldalad, ami köszönet, csak kivették belőle a szavakat.',
    cage_slain: 'Már éhezett, amikor a Kórus felakasztotta a ketrecet. Nem ért el téged. Egy hét próbálkozással sem ért volna el. Nem te vagy az első, aki a rácson át tesz biztosra, és a ketrec alján heverő apró csontok nem mind a sajátjai — az utolsó három irgalom volt, vagy valami, ami hagyta magát annak nevezni.',

    // -- a koldus --
    beg_alms: 'Volt neve, és két téllel ezelőtt elcserélte egy melegebb kabátért; azt mondja, tisztességes alku volt. Amit visszaad, az nem hála, hanem értesülés — számolja, ki megy le és ki jön fel, és a különbség az egyetlen főkönyv, amit idelent bárki vezet. Most már benne vagy te is, a jó oldalon.',
    beg_blood: 'A kéz csakugyan az erszényed felé emelkedett ki a sötétből; ennyiben igazad volt. A többiben nem. Kilencven éves volt, annyit nyomott, mint egy átázott köpeny, és az öklében nem volt más, csak a rézpénz, amit vissza akart adni, mert a lépcsőnél túlfizetted.',

    // -- a szentély --
    shr_rest: 'A rend tizenkét tagját szertartás nélkül fektették ide, mert a pap ment le elsőnek a lépcsőn, és nem jött vissza kimondani a szavakat. Te rosszul mondtad el, emlékezetből, három sor hiányzott. Elég volt. A kő kihűlt, azon a hétköznapi módon, ahogy a kő kihűl, ha már nincs benne semmi.',
    shr_pact: 'Az oltár alatti dolog nem isten, és sosem állította magáról. Hitelező. A feltételei világosak, a kamata türelmes, és még egyszer sem mulasztotta el behajtani — kilencszáz év alatt egyszer sem, senkinél, azt a négyet is beleértve, akik azt hitték, a halállal elintézték.',

    // -- a tükör --
    mir_saint: 'Az üveg nem hízeleg és nem hazudik; csak megszünteti a távolságot aközött, ami vagy, és amit látni tudsz belőle. Korona jelent meg, mert a korona már ott volt. Huszonkét vándor állt meg annál a tükörnél. Hármuknak mutatta ezt.',
    mir_gray: 'Félig megvilágítva, eldöntetlenül, se ez, se az — az üveg nyitott főkönyvet mutat, a végösszeg alatt nincs még vonal. Messze ez a leggyakoribb tükörkép. A legtöbben befejezetlenül mennek be a sötétbe, és ugyanúgy jönnek ki belőle, ha kijönnek.',
    mir_fiend: 'A fogak a tieid. Ezt megemészteni tart a legtovább. Az üveg nem tett hozzá semmit; csak abbahagyta az elvételt, és ami ott állt, az olyasvalami volt, ami már nem fél önmagától. Átnyúlt, és odaadta neked, amit addigra úgyis kiérdemeltél.',
    mir_shatter: 'Van vándor, aki nem hajlandó odanézni. A markolatgombbal esik az üvegnek, mielőtt az végigmutathatná — a szilánkok pedig tovább dolgoznak: a padlón minden darab őriz egy szeletet egy arcból, amely nem engedte, hogy egészben lássák. A tükröt ez nem zavarja. Tizenegyszer törték már össze, és nem szokott le róla.',

    // -- a bitófa --
    hang_rite: 'A láncon lógó ketrecben egy asszony volt, akit olyan bűnért akasztottak fel, amit az iratok ma háromféleképpen írnak. Senki nem vágta le, mert a ketrecre senkinek nem volt szüksége. Megadtad neki, amit a saját városa nem: a földet, a szavakat, és valakinek négy percét egy napjából.',
    hang_robbed: 'A torkánál a medál zarándokjel volt, az olcsó fajta, préselt bádog — olyasvalaki hordta, aki szent helyre készült eljutni, és eddig jutott. Szinte semmit sem ért, és megtartotta a tárgyaláson, az ítéleten és a láncon át. Most nálad van.',

    // -- a gyermek --
    child_kind: 'Nem tévedt el, bármit mond is; régebb óta van idelent, mint amióta a lépcső veszélyes, és pontosan tudja, hol van. Amit elveszített, az a hit, hogy egy kéz kedvesen is nyúlhat felé. Te nyújtottál egyet. A következő dolognak, amelyik felőled kérdez, beszélni fog rólad, és jót fog mondani.',
    child_truth: 'A félelem már kétszeresen szörnyeteget csinált belőle — egyszer a saját fejében, egyszer minden vándorban, aki felemelt pengével fordult be azon a sarkon. Te kétszer néztél oda. A második pillantás alatt egy rémült, maszatos kislány volt, ami mindig is csak volt, és mindössze ennyit kívánt volna bárkitől: a második pillantást.',
    child_blood: 'A Kódex ezt a rossz főkönyve legelejére teszi, és nem szépíti. Hétéves volt. Nagyon hosszú ideig volt hétéves, mielőtt megérkeztél, és hétéves volt, amikor végeztél. Bármit mondtál is magadnak utána a folyosón, a sír kicsi, és pont akkora, amekkora kell, és ennyi az egész érvelés.',

    // -- az eskü --
    oath_kept: 'Hallam lovag, a Kilencedikből, elvérezve annak a falnak dőlve, amelyet még két napig tartott azután is, hogy bármi értelme lett volna. Nem akarta, hogy megmentsék, és nem is kérte. Azt kérte, hogy a penge dolgozzon tovább. Megesküdtél, hát dolgozik — a fogadalom teher, és a teher a lényeg.',
    oath_freely: 'Nem nyúltál érte. Az egész próba ennyi volt, és négyszáz éve állította fel, egy saját vétkéért, amit az iratok már nem őriznek. Mindenki más markolt. Te vártál, ő pedig maga tette a kezedbe, ami többet ér, mint maga az acél.',
    oath_broken: 'Még beszélt, amikor elvetted. A penge könnyen jött — nem maradt szorítása, amivel vitatkozzon —, és a mondat, amit nem fejezett be, alighanem a feltétel volt. A visszautasított ajándékból lopás lesz, és az acél emlékszik rá, melyik történt.',

    // -- a fényhordozó --
    light_blessed: 'A legtöbbeknek meg sem jelenik. Nem rejtőzik; egyszerűen nincs a többségben semmi, amiért érdemes volna odasétálni. A fény, amit hordoz, nem lámpás, és nem fogy el, és ha nyíltan fogadnak vele, az olyan állítás rólad, amit idelent rajta kívül senki nem tesz meg.',
    light_ward: 'Az oltalom, amit rád tett, pontosan addig tart, amíg tiszta marad a kezed; ezt nyíltan meg is mondta, és kedvességnek szánta, nem fenyegetésnek. Ez az egyetlen védelem a mélységben, amelynek erkölcsi kikötése van, és az egyetlen, amit kívülről még sosem törtek át.',

    // -- a követ --
    envoy_bribe: 'A Kórus parancslevelében a te neved áll, és a követ hordja magánál — ahogy egy erszényt is, meg annak tudatát, milyen messze van most a Szentszéktől. A tantétel a felszínre való. Idelent az Inkvizíció egy apró, hideg nő, aki számol, és a számítás a te javadra jött ki.',
    envoy_defiant: 'A Megjelöltekre vonatkozó állandó parancs egyértelmű, és épp azt mondta fel, amikor kardot rántottál. Tizenegyszer csinálta már ezt, és tizenegyszer győzött, és annál a tizenegynél nem volt semmi, ami megérte volna a cipelést visszafelé. Nálad van. A parancslevél még mindig a kabátjában.',
    envoy_scorn: 'Fizethettél volna. Harcolhattál volna. Ehelyett leköpted a Kórust, ami abban a pillanatban semmibe sem kerül, és aznap este bekerül egy főkönyvbe a Szentszéken. A vérdíjad nem a sértés miatt duplázódott meg. Azért, mert a sértéseket iktatják.',
  },
});


// ---- the Codex stories: the sporewife through the wolfmother ----
I18N.addData({
CODEX_LORE: {
    // -- a spóraasszony --
    spore_mercy: 'A Gombamélyben a Mély gondoskodik, és ő az a része, amelyik tölt. A tea olyan dolgokból készül, amelyeknek nem volna szabad kifőniük, és semmi mást nem tesz veled, csak jót — ez a vidék leggyanúsabb ténye. Száz és néhány éve fogad vendégeket, és még egyetlen vendéget sem mérgezett meg, aki illendően ült le.',
    spore_graft: 'Amit beléd ültetett, él, az övé, és mostantól a tiéd is — a papírmunka ebben az ügyben őszintén tisztázatlan. Több vagy, mint voltál. A többletnek egy kis hányada kölcsön, és a Mély nem küld felszólítást, de számon tartja.',
    spore_slain: 'A zümmögés, amit átvágtál, altatódal volt; az indák, amiket levágtál, egy kéz, amely a kanna felé nyúlt. Négyszáz éven át fogadott utazókat egy helyen, ahol semmi kedves nem terem, és az utolsó dolog, amit megértett, az volt, hogy a vendég már kivont pengével lépett be.',
    spore_truth: 'Figyeltél ahelyett, hogy vágtál volna; a Gombamélyben ez olyan túlélési fogás, amit senki nem tanít. A rossz érzés úgy oldódott fel, ahogy az ilyesmi szokta, ha adsz neki egy percet: nem szörnyűség, csak egy öregasszony, szokatlan testtel, kannával a tűzön.',

    // -- a révész --
    ferry_toll: 'Az átkelésnek ára van, az ár egy érme, és már azelőtt is egy érme volt, hogy a csarnokok víz alá kerültek. Nem kapzsi. Az érme nem neki szól. Mindegyiket az ülés alatti pénzesládába teszi, és nem tudná megmondani, kinek gyűjti — csak azt, hogy megköttetett a megállapodás, és ő tartja a maga végét.',
    ferry_robbed: 'A pénzesládában nagyon régről gyűlt viteldíjak feküdtek — mások átkelései, mások adósságai, becsületesen őrizve valamitől, ami már nem emlékszik, miért. Nem állított meg. Végignézte, ahogy elviszed, aztán visszatért a rúdhoz, és a csónak azóta is átvisz bárkit, aki kéri.',
    ferry_truth: 'Mindenki más fizet neki vagy meglopja. Te szóltál hozzá. Valahol a mellkasában, a víz alatt, felszínre bukkant egy név, amelyet nem használtak, mióta a csarnokok szárazak voltak, és ő felelt rá — egy pillanatra a rúd mellett álló lény egy ember volt, akinek munkája van.',

    // -- a kovácsözvegy --
    forge_temper: 'Működő kovácstüzet tart a Parázs-szakadékban, ami vagy a legjobb, vagy a legrosszabb hely erre, attól függően, hogyan érzel a hőség iránt. Elvette az acélod, úgy nézte, ahogy az orvos néz egy végtagot, és jobban adta vissza. Nem kérdezte a neved, és nem is volt rá szüksége.',
    forge_gift: 'Mesterjegyet üt azokra, akik megrakják a kohóját — a régi jegyet, abból az időből, mielőtt a Szentszék szabályozta a mesterséget. Nem dísz. Ami e jegy alatt készül, tovább tartja az élét, mint amennyit a fém megengedne, és a négy kovács, aki tudta, miért, mind halott.',
    forge_blood: 'A padján, mire végeztél: ekevasak, zsanérok, egy fazék megjavított füllel, és egy játékkard gyerekkézre szabva. Kórus-munka semmi. Ereklye semmi. Ok semmi. Idelent hasznos dolgokat készített olyanoknak, akik sosem jöttek vissza értük.',
    forge_truth: 'Biztos voltál benne, aztán ránéztél a padra, és a bizonyosságnak le kellett ülnie. Egy főzőedénytől nehéz félni. Hagyta, hogy annyit nézd, amennyi kell, aztán minden él nélkül megkérdezte, hogy megnézze-e a pengédet.',

    // -- a csontkórus --
    choir_hymn: 'Kilenc kántor ment le az utolsó körmenettel, és kilenc kántor énekel ma is: ez vagy áhítat, vagy a legmélyebb vájat, amit szokás valaha kőbe koptatott. A himnusz nem istennek szól. Ajtó, amelyet hanggal tartanak csukva, és háromszáz éve tartják olyan hangok, amelyeknek már nincs torkuk.',
    choir_smashed: 'A sikoltozás abbamaradt — ez volt a cél. Amit az ének tartott csukva, az nem maradt abba; ezt akkor nem magyarázta el neked senki, és nem is hitted volna el. Van ajtó, amely csak addig marad zárva, amíg valaki énekel neki. Kilencen énekeltek. Most senki.',
    choir_truth: 'Csak akkor sikolt, ha sikolyt várva érkezel. Állj mozdulatlanul nyolc ütemen át, és a zaj kilenc szólamra bomlik, valódi harmóniában: csúnyán kijöttek a gyakorlatból, és tökéletesen elszántak. Helyet csináltak egy tizediknek anélkül, hogy megtört volna a szólam; idelent ennél többet még senki nem ajánlott fel idegennek.',

    // -- a lámpagyújtó --
    lamp_guided: 'Már azelőtt vak volt, hogy az Erdő elsötétült, ezért nem zavarta meg a sötét, és ezért nem hagyta abba az út megvilágítását. Olyanoknak világít, akiket sosem fog látni, olyan útvonalon, amelyet maga már nem tud végigjárni, és még soha nem köszönte meg neki senki, akinek ne kellett volna valami.',
    lamp_snuffed: 'A Feketeerdőben táncoló fény csalétek, ebben mindenki egyetért, és mindenki téved. Valaki tartotta. Meghallotta, hogy jössz, és magasabbra emelte, hogy le ne térj az ösvényről — ebben a tartásban volt, amikor kivetted a kezéből a rudat.',
    lamp_truth: 'Óvatosan követted ahelyett, hogy nekirontottál volna; csak így lehet megtudni. Táncol, mert sántít. Kanyarog, mert tapintással számolja a fákat. Egyáltalán nem csalétek: egy lepkényi ember, aki idegenek előtt megy ki az Erdő egyetlen fényével.',

    // -- a katona --
    sold_pass: 'A Törött Vár elesett, a helyőrség nem távozott, és a legtöbbjük mostanra megszűnt bárminek lenni. Ő nem. Még mindig a kapun áll, még mindig a jelszót várja, és a jelszó nem változott, mert nem maradt senki, akinek jogában állna megváltoztatni.',
    sold_loot: 'Egyszer sem emelte fel a fegyverét. Vigyázzban állt, amikor lefeszítetted a karjáról a pajzsot, mert a vigyázzállás az utolsó, amije maradt, és a szíj már rég a csontjába nőtt, ki kellett dolgozni belőle.',
    sold_truth: 'Egy két háborúval ezelőtti régi menetszót adtál neki, rosszul kiejtve. Félreállt. Pontosan senki más előtt nem állt félre, és egy pillanatra volt egy katona a hüvelyben, aki emlékezett rá, milyen, amikor leváltják a posztról.',

    // -- a menyasszony --
    bride_ring: 'Vékony aranykarika, ott, ahol már nem érsz le, egy kézen, amely régebb óta tartja az iszap fölé, mint amióta a kikötő víz alatt van. Nem kínálja. Mutatja. Van különbség, és minden utazó, aki addig kigázolt, elmulasztotta észrevenni.',
    bride_dowry: 'Érméről érmére, tizenegy éven át, egy esküvőre, amelyhez az árvíz ért oda előbb. Átmentette a ládát a vízen, a sötéten és azon a lassú műveleten, ahogy az ember megszűnik élni, és még mindig őrizte, amikor megtaláltad a zárját.',
    bride_truth: 'A legtöbb utazó elvesz. Egy megszólalt — hangosan megkérdezte tőle, a vízben, hogy kinek szólt a gyűrű. Száznegyven éve várt erre a kérdésre, a válasz összeállítása eltartott egy ideig, és mindkettőtöknek megérte a várakozást.',

    // -- a parázsszerzetes --
    monk_vigil: 'A rend tanítás szerint tartott égve egy tüzet, aztán a rend véget ért, ő nem kapta meg az üzenetet, és a tűz még mindig ég. A tanítást nem magyarázza el. Azt viszont hagyja, hogy vele virrassz — ez az egyetlen beavatás, amely megmaradt.',
    monk_quench: 'A mellkasában a parázsszív meleg kő volt, nagyjából ökölnyi, és háromszáz év alatt egyszer sem használta arra, hogy bármit felgyújtson. Nem védte. Végignézte, ahogy ráömlik a víz, és leginkább bocsánatkérőnek látszott — mintha a kioltásával járó fáradság rád nézve lett volna kellemetlen.',
    monk_truth: 'Vártál a tűzgödörben, míg ő vett egy nagyon hosszú lélegzetet; ennyit vesz idelent a türelem: a széllélegzetet, a régi áldást, amelyet csak azok kapnak meg, akik nem töltötték ki a csendet. Ritka tüzelő. Négyszer adta oda.',

    // -- a szent --
    saint_relics: 'Harmincegy darab, négy vidéken szétszórva olyanok által, akik fejenként egy ujjpercet akartak. Az utolsó a helyére kattant, és valami, ami egyszerre volt harmincegy helyen, végre — rövid időre — egy helyen volt. Amit abban a pillanatban mondott, egyetlen olyan nyelven sem hangzott el, amelyet a Szentszék feljegyzett.',
    saint_theft: 'A gyűjtők nem kérdezik, honnan jött egy ujjperc, és odafent élénk a kereskedés. Kivettél egy csontot egy elrendezésből, amelyből másik harminc ember is kivett egyet, és ez a számtan mindig csak egy irányba tart.',
    saint_truth: 'Nem rítus. Mentés, amelyet valaki elkezdett, aztán nagyjából egy évszázad múlva kifutott az időből, és utána senki nem folytatta, csak te. A megmaradt darabok azért vannak ott, ahol vannak, mert egy ember vitte őket valahová, és eddig jutott.',

    // -- a farkasanya --
    wolf_offer: 'Olyan helyen szoptat, ahol semmi nem terem, és azért jött ki eléd, mert az odúban maradni rosszabb lett volna. Etetted. A falkaszag, amellyel megjelölt, nem szeretet; üzenet, amit a Feketeerdő minden más lakójának hagyott, és így szól: ezt ne.',
    wolf_den: 'A prém egy hónapot ér a felszínen, a mögötte lévő odú viszont senkinek nem ér semmit. Közétek állt, és ott is maradt — ez a munka egésze, és rendesen végezte a legvégéig.',
    wolf_truth: 'Nem cserkészett be. Mérlegelt, távolról, ameddig kellett — hatvan utazóval tette már meg ezt, és ötvenkilenc elől odébbállt. Bármi is a mérték, te megütötted.',
  },
});


// ---- the Codex stories: the red door through Sinclair ----
I18N.addData({
CODEX_LORE: {
  // -- the red door --
  butcher_faced: 'Az ajtón a felirat: FRISS HÚS, és ez nem reklám. Nagyon ért a munkájához, régóta csinálja, és őszintén megörült neked — ahogy a mesterember örül, amikor az anyag a saját lábán sétál be.',
  butcher_freed: 'A kampón lógó ember megtanult nem sikoltani, ami eltart egy darabig, és megtanulta azt is, pontosan hogyan működik az a helyiség. Ez volt a hasznos rész. Lekerült a kampóról, emlékezett a kifelé vezető útra, és végigment rajta előtted anélkül, hogy egyszer is a korábbi vevők falára nézett volna.',
  butcher_meat: 'Meleg volt, jól be volt csomagolva, és úgy csúszott le, mint a megbocsátás. Nem kérdezted. Volt egy kézenfekvő kérdés, és te elvitted mellette a csomagot — és a Kódex éppen a nem-kérdezést jegyezte fel.',

  // -- the coin --
  coin_bless: 'Az érmén nincs arc. Láttad, tehát tudod. Leesett, a túloldalán valamit mulattatott a dolog, és abból az irányból a jókedv nagyjából minden második alkalommal ajándék formájában érkezik — ami jobb arány, mint az imádságé.',
  coin_curse: 'Elvettek valamit. Az istent így is, úgy is mulattatta; ez a megállapodás teljes természete, és soha nem titkolták el előled. Nem büntet. Nem jutalmaz. Dob, és mindkét eredményen nevet, és ezt már azelőtt is csinálta, hogy itt padló lett volna.',
  coin_theft: 'Zsebre tetted ahelyett, hogy feldobtad volna, ami nem pontosan lopás — senkié sem —, de mégiscsak úgy szállsz ki a játékból, hogy a tétet megtartod. Az ilyen adósságot nem behajtják. Növesztik, csendben, és jóval később mutatják be, teljes érésben.',

  // -- the prince --
  prince_truth: 'A kecsesség egykor valódi volt. A felső kápolnában esküdött, négyszáz vendég előtt, és azóta sem tudta abbahagyni, hogy azon az esküvőn legyen. Nézz rá egyenesen, és az egész egyszerre omlik össze — az udvar, a modor, a menyasszony széke —, és ami marad, az egy férfi, aki egyedül áll egy csarnokban.',
  prince_feast: 'Üres kupa, egy százéves esküvőn emelve, az egyetlen vendégtől, aki valaha megjelent. Észrevette. Nagyon régóta senkit sem fogad, és pontosan tudja, hány az a senki — az egyet már nem várta.',
  prince_slain: 'Vőlegény volt a menyasszonya sírjánál, és épp a bemutatkozás közepén tartott. Elengedett volna. Mindenkit elengedett. A csarnok most csendesebb, amit néhány vándor javulásnak nevezett.',

  // -- the parlor --
  seam_refused: 'Végez átalakítást is. Ezt kimondta az ajtóban, világosan, és a feltételek ott hevertek az asztalon, ahol elolvashattad. Megtartottad a bőröd, amit nem vett zokon — van várólistája, és aki kisétál, az csak olyan vevő, aki még nem szánta rá magát.',
  seam_traded: 'Egy tenyérnyi, szépen levéve, és bevarrva, mielőtt végigmondtad volna az igent. Abban a szalonban most tökéletesen áll valakin egy kesztyű, a méreteid pedig egy kártyán vannak, egy fiókban, háromszáz másik mellett.',
  seam_faced: 'A szobában minden tű egyszerre emelkedett fel, és a legtöbben ekkor értik meg, hogyan is működik itt az üzlet. Téli kabátnak nézett ki téged. A szabásminta már ki volt krétázva, és ő a maga módján csalódott, hogy sietnie kell vele.',

  // -- the banquet --
  banq_ate: 'Életed legpompásabb étele, egy csarnokban, ahol az ostrom óta nem szedték le a tányérokat. Sírtál, miközben rágtál, és nem hagytad abba a rágást. Az abbahagyás szóba sem került. Ettől az ő asztala, és nem a tiéd.',
  banq_fed: 'Ételt tettél az Éhenkórász Király elé, amit senki nem tett meg, amióta ott ül — és azóta ül ott, hogy a fenti város elfelejtette a saját nevét. Lassan evett. Királyságokat evett meg gyorsan; ez eltartott neki egy ideig.',
  banq_faced: 'Királyságokat evett meg. Minden különösebb sietség nélkül állt fel, ahogy az ember áll fel egy kis fogásért két nagy között, és az, hogy ezt egyáltalán olvasod, a Kódex legfigyelemreméltóbb sora.',

  // -- the chapel --
  velvet_yielded: 'Két gyertya égett el érted, és kipihenten ébredtél, ami a legritkább dolog a mélyben, és éppen ez lett volna a figyelmeztetés. Könnyebb vagy. Nem tudod megmondani, mivel, és nem tudja megmondani senki más sem, aki jól aludva jött ki abból a kápolnából.',
  velvet_prayed: 'Valamihez imádkoztál, ami régebbi a vigasznál, egy kápolnában, amit az ellenkezőjére építettek, és a hideg bejött, és ott maradt. Nem adtak semmit. El sem vettek semmit, és a Széttört Katedrálisban a semmi tiszta cseréje tekintélyes nyereség.',
  velvet_faced: 'Az nem arc. Nagyon régóta türelmes a fátyol alatt, és a türelem nem ugyanaz, mint a szelídség — csak az a forma, amit a szelídség hagy maga után, amikor elmegy. A fátyol felemelkedett. Ez után nagyon kevés bejegyzés került ebbe a Kódexbe.',

  // -- the larder --
  lard_fed: 'Kenyér és sózott hal, úgy elvéve, ahogy a vendég veszi el, és két érme a polcon hagyva a fáradságért. Bármi tölti is fel azt az éléskamrát, határozott véleménye van a vendég és a tolvaj közti különbségről, és ezt a véleményt nem kell kétszer elmagyaráznia.',
  lard_gorged: 'Addig ettél, amíg bírtad, és valami a lépcsőn végighallgatta, és helyeselte. Az abból az irányból jövő helyeslés a figyelem egy fajtája, a figyelem pedig az, ahogyan a jószágot megszámolják.',
  lard_took: 'Elvitted, amire szükséged volt, a többit ott hagytad, és az ajtó finoman becsukódott mögötted — ahogy az csukja be az ajtót, aki úgy döntött, visszajöhetsz. Ennyi az egész bejegyzés. Apró dolog, és mégsem semmi.',

  // -- butchery, by your own hand --
  sever_first: 'Az első csak technikai teljesítmény, semmi más, és a főkönyvbe is így kerül be. Valami elvesztett egy darabot magából, és jött tovább, ami megtanítja a lecke hasznos felét: a darab nem ugyanaz, mint az egész, és az egész az, ami meg akar ölni.',
  head_taken: 'Van egy csapás, ami minden vitát egyszerre zár le, és ha a karod egyszer megtanulta, újra meg újra fel fogja ajánlani. Ezt a részt érdemes feljegyezni. Nem azt, hogy levetted a fejét — hanem hogy mostantól van egy első ötleted, és ez az.',

  // -- hunger --
  starved_hollow: 'Egy ponton túl a test abbahagyja a kérést, és árulni kezd: előbb a zsírt, aztán az izmot, aztán azokat a részeket, amikkel gondolkodni szokott. A főkönyv valódi, tételesen vezetve, és a mélység már nagyon sok embert nézett végig, ahogy végigolvassa, egészen az aljáig.',
  meat_price: 'Laktató volt. Meleg volt. Ingyen nem volt, és a szó szokásos értelmében nem is hús volt. Mind a három dolgot tudtad akkor, ebben a sorrendben, és mégis ettél — és a Kódexnek éppen ez az adat kellett.',

  // -- the coin, mid-fight --
  coin_war_heads: 'Egy régi istent segítségért kérni, amikor a penge már mozgásban van, nem imádság, hanem döntőbíráskodás, és őszintén ostoba dolog. Fej lett. A döntés melletted szólt. Ne olvass bele semmit; nincs benne mit olvasni.',
  coin_war_tails: 'Csapás közben kérdeztél, a válasz csapás közben érkezett, és az egy nem volt. Az istent mulattatta. Mindig mulattatja. Csak az változik, hogy a jókedv melyik oldalán állsz, amikor az érme leesik.',

  // -- the oathless --
  oath_taken: 'Kijött veled egy cellából, amit az elmúlt négy hónapban bármikor kinyithatott volna magának is — ebből tudod, mire várt valójában. Nem megmentésre. Okra. Úgy döntött, hogy te vagy az, és nem fogja utánaszámolni.',
  oath_sent: 'Felküldted, és elment, mert kérted, és mert a felfelé az az egyetlen utasítás, amit idelent soha senki nem ad. Hogy elérte-e a felszínt, arról nincs feljegyzés. A Kódex csak azt őrzi meg, amit látott, és azt látta, hogy valaki egy esélyt egy másik emberre költött.',
  oath_seen: 'Az egész lemerülést azzal töltötte, hogy várta, mikor költik el — ajtóra, csapdára, figyelemelterelésre, ahogy az előző három tette. Te ehelyett ránéztél, egyszer, emberként. Nem hozta szóba, és nem is fogja, és ez a legfontosabb dolog a Kódex őrá eső felében.',
  follower_lost: 'Oda ment, ahová vezetted. Ez az egész, és nincs olyan olvasata, amiből más jönne ki. A Kódex a becsület legalját abszolútumként jegyzi be, mert a mélység ez egyszer egyetért a felszínnel valamiben.',

  // -- sinclair --
  eliza_taken: 'A feleséged, és kettőtök közül a jobb tolvaj, ami évekkel ezelőtt eldőlt, és nem kerül újra elő. Nem utánad jött le. Ő ért ide előbb, dolgozni, és úgy állt a válladhoz, mintha a közben eltelt idő csak egy hosszú megbízás lett volna, amiről elkéstél.',
  eliza_sent: 'Elküldted, és elment, lépésben, vita nélkül — ami tőle a leghangosabb elérhető válasz. Nem hal meg ilyen lyukakban. Ez volt a megállapodás, a megállapodás az övé, és ő tartja a maga részét, akár tartod te a tiédet, akár nem.',
  eliza_gone: 'Ki a résen, a sötétben, sebesen, miközben az, ami épp ölte, még mindig azt próbálta eldönteni, hová lett. Nem hal meg ilyen lyukakban. Elégszer mondta már neked ahhoz, hogy ne vicc legyen, hanem bevált módszer.',
  eliza_stall: 'Egy láda, egy összehajtott köpeny, kenyér olyan áron, ami az érme nélkülieknek szól, és két kés kéznyújtásnyira a kendő alatt. Boltot nyitott a mélyben, és alákínált az Üreges Kereskedőnek, és a stand nem álca — tényleg kereskedik, és tényleg fegyverben van, és mindkettő egyszerre igaz.',
},
});


// ---- the five thrones, their moves and everything they say ----
I18N.addData({
ENEMIES: {
    boss:{ name:'Gloamlord, a Csont Őrzője',
      moves:{ 0:{name:'Sírhasítás'}, 1:{name:'Nekrotikus Hullám'}, 2:{name:'Lélektépés'},
        3:{name:'Velővihar'}, 4:{name:'Koponyatörő'}, 5:{name:'Bénító Rettegés'},
        6:{name:'Lelkek Lakomája'}, 7:{name:'Csontvédelem'} },
      dialogue:{ defeat:'„A csont... nem emlékszik... semmire...”' } },

    boss_choir:{ name:'Az Aranyozott Sírbolt, a Kórus Hangja',
      moves:{ 0:{name:'Az Egek Ökle'}, 1:{name:'Áldott Pöröly'}, 2:{name:'Sújtás'},
        3:{name:'Meggyőződés'}, 4:{name:'Az Aranyozott Ítélet'}, 5:{name:'Szent Pajzs'},
        6:{name:'Megváltás'}, 7:{name:'Menedék'} },
      dialogue:{
        intro:'„A Kórus énekelt, míg le nem szakadt a tető, aztán a tető alatt énekelt tovább. Én vagyok az, amit az ének hátrahagyott. Térdelj le, és gyors ítéletet hozok.”',
        class:{ knight:'„Hamura esküdött pajzs. A rended egykor nekünk esküdött, mielőtt úgy döntött, hogy a lelkiismerete a sajátja.”',
          rogue:'„Tolvaj a kápolnában. Vigyél, amit akarsz. Minden bizonyíték.”',
          mage:'„Kölcsönvett erő szent helyen. A Szentszéknek van erre egy szava, és egy máglyája hozzá.”',
          warden:'„Lámpás. Ugyanazt a fényt hordozod, mint én, és rosszul hordozod — bárkinek, bárhová, iktatószám nélkül.”',
          necromancer:'„Halott dolgot viselsz névként. Állj nyugton. A liturgiának ez a része a tiéd.”',
          alchemist:'„Főzetkészítő. Minden eretnekség, amit elégettem, azzal kezdődött, hogy valaki eldöntötte, mi kerül a pohárba.”' },
        marked:'„A tinta rajtad a mi tintánk. Megspóroltad nekem a bemutatkozást.”',
        hallowed:'„Tiszta. Valóban tiszta. Az ítéleten ez semmit nem változtat, de neked rendesen elmondom a szavakat.”',
        items:{ aureate_edge:'„Cassiel pengéje. Jobb volt nálad, és nincs itt. Gondold végig, mit jelent ez.”',
          saints_knuckle:'„Azt az ujjpercet katalogizálták. Lopott szentírást hordasz.”' },
        defeat:'„Az ítéletet... sosem én... hozhattam meg...”' } },

    boss_keep:{ name:'Vantage Nagyúr, az Utolsó Helyőrség',
      moves:{ 0:{name:'Pajzsroham'}, 1:{name:'Szeizmikus Csapás'}, 2:{name:'Forgószél'},
        3:{name:'Kivégzés'}, 4:{name:'Bosszú'}, 5:{name:'Harci Kiáltás'},
        6:{name:'Vasbőr'}, 7:{name:'Halhatatlan Düh'} },
      dialogue:{
        intro:'„A felmentő oszlop három napra volt. Ennek száztíz éve. Amíg meg nem érkezik, a kaput tartani kell. Nevezd meg az ügyedet, vagy ellenségként kezellek — ami vagy.”',
        class:{ knight:'„Ismered a gyakorlatot, amit tartok. Jó. Akkor azt is tudod, hogy nem hagyom abba.”',
          rogue:'„Két hónapig másztak át utászok azon a falon. Negyvenet megöltem közülük. Nem vagyok fáradt.”',
          mage:'„Rosszabbal lőttek minket, mint amit te hordozol.”',
          warden:'„Tábori lelkész. Volt egy. A kilencedik napon kisétált, és nem bocsátottam meg neki.”',
          necromancer:'„Te felkelted a holtakat. ÉN vagyok a holt, és még mindig a posztomon állok. Magyarázd el, mit képzelsz, mit ajánlasz.”',
          alchemist:'„Hadtápos mesterség. Ha van bármid a sebesülteknek: nincsenek sebesültek. Csak én vagyok.”' },
        marked:'„A Kórus akar téged. A Kórus a felmentést sem küldte el soha. Rá fogsz jönni, hogy ez itt semmit sem ér.”',
        hallowed:'„Hű maradtál valamihez. Én is. Ez nem ok arra, hogy átengedjelek.”',
        items:{ oathblade:'„Az a penge esküt tett. Én is. Egyikünk mindjárt megtudja, kinek az esküje ért többet.”' },
        defeat:'„Poszt... leváltva...”' } },

    boss_knife:{ name:'Az Ezredik Kés',
      moves:{ 0:{name:'Hátbaszúrás'}, 1:{name:'Késlegyező'}, 2:{name:'Árnycsapás'},
        3:{name:'Mérgezett Penge'}, 4:{name:'Halálvirág'}, 5:{name:'Gyengeség Kihasználása'},
        6:{name:'Éjjeli Vadász'}, 7:{name:'Füstfüggöny'} },
      dialogue:{
        intro:'„Kilencszázkilencvenkilencen mentek be előtted a Feketeerdőbe, és kilencszázkilencvenkilenc kés jött ki belőle. Te kerek szám vagy. Régóta várok egy kerek számra.”',
        class:{ knight:'„Páncél. Jó. Tovább tart, és közben nézhetem, ahogy megérted.”',
          rogue:'„Ó — szakmai udvariasság. A saját nyitásodat használom rajtad, és útközben, lefelé, fel is ismered.”',
          mage:'„Varázsolj valamit. Már mögötted vagyok.”',
          warden:'„Hozd közelebb a fényt. Csak megmutatja nekem, hol van a többi részed.”',
          necromancer:'„Utána megpróbálsz majd felkelteni. Mások is próbálták. Itt nincs mit felkelteni; én felhalmozódás vagyok.”',
          alchemist:'„Méreg. Kedves tőled. Abból vagyok, aki utoljára ezzel próbálkozott.”' },
        marked:'„Hajszolt. Akkor ugyanazt akarjuk ettől a beszélgetéstől — hogy csendes legyen.”',
        hallowed:'„Tiszta kezek, a Feketeerdőben. Ez nem ártatlanság. Ez tapasztalatlanság.”',
        items:{ skinners_needle:'„A Varrónő tűje. Nekünk kettőnknek megállapodásunk van a maradékról.”' },
        defeat:'„Ezer... és... egy...”' } },

    boss_kiln:{ name:'Vyre Hamuanya, a Kibontott Kemence',
      moves:{ 0:{name:'Infernó'}, 1:{name:'Tűzfal'}, 2:{name:'Láncvillám'},
        3:{name:'Statikus Mező'}, 4:{name:'Vasszűz'}, 5:{name:'Ellenállás Csökkentése'},
        6:{name:'A Kibontott Kemence'}, 7:{name:'Energiapajzs'} },
      dialogue:{
        intro:'„Négyszáz évig tartottam parázsban ezt a tüzet, hogy még itt legyen, mire lejön a lépcsőn valaki, akit érdemes elégetni. Ne kérj bocsánatot. Te vagy az első, aki megérte a várakozást.”',
        class:{ knight:'„Az acél vezet. Az acél tartja a hőt. Kemencébe jöttél, és kályhát viselsz.”',
          rogue:'„Ebben a szakadékban nincs hely, ami ne volna már meleg. Nincs mi mögé bújnod, csak a levegő.”',
          mage:'„Kolléga. Gyenge kolléga — adagolod. Az adagolt tűz kialvó tűz.”',
          warden:'„Fény. Nekem rengeteg fényem van. Az enyém csinál is valamit.”',
          necromancer:'„A hamu nem felel neked. Már elégettem mindent, amit hívtál volna.”',
          alchemist:'„Te dolgokat forralsz. Én négy évszázada egyetlen dolgot forralok. Gyere, hasonlítsuk össze a módszereinket.”' },
        marked:'„A Kórus megjelölt, aztán nem tett semmit az ügyben. Jellemző rájuk. Én befejezem a munkát.”',
        hallowed:'„Elégetlen, egyelőre. Minden hasáb elégetlen, egyelőre.”',
        items:{ gloamheart:'„Az Őrző szívét hozod be AZ ÉN szakadékomba. A pimaszsága majdnem megér annyit, hogy megkíméljelek.”' },
        defeat:'„Hadd... aludjon ki...”' } },
  },
});


// ---- the stair-keepers and the named terrors ----
I18N.addData({
ENEMIES: {

    // ---- guardians: the keepers of the stair ----
    turnkey:{ name:'Hesk Porkoláb, a Kulcsár',
      moves:{ 0:{name:'Pajzsdöfés'}, 1:{name:'Kulcskarika'}, 2:{name:'Ajtóretesz'},
        3:{name:'Szeizmikus Csapás'}, 4:{name:'Hosszú Ítélet'}, 5:{name:'Harci Kiáltás'} },
      dialogue:{
        intro:'„Ezen a szinten minden ajtó erre a karikára hallgat, és ezen a szinten minden ajtó zárva van. Nem vagy rajta a listán, akik távoznak. Az utolsó kormányzó óta senki sem volt rajta.”',
        marked:'„Elítélve. Akkor nem látogató vagy, hanem beszállítás.”',
        hallowed:'„Tiszta előélet. Rossz épület.”',
        defeat:'„A karika... vedd el a... karikát...”',
        class:{ knight:'„A páncél nem nyit ajtót. A kulcs nyit ajtót. Nálam vannak a kulcsok.”',
          rogue:'„Egy zárfeltörő. Hatan próbálkoztatok a szerkezettel. Nem szerkezet az, hanem én.”',
          mage:'„Égesd el az ajtót, ha akarod. Mögötte van egy másik. Tizenegy van.”',
          warden:'„Te mindet kiengednéd. Pontosan ez a baj a fajtáddal.”',
          necromancer:'„Ennek a cellasornak a fele felállna érted. Pontosan ezért marad a cellasor zárva.”',
          alchemist:'„Semmi, amit főzni tudsz, nem illik zárba.”' },
        items:{ grave_dagger:'„Csempészáru. Feljegyezve.”' } } },

    thirstpriest:{ name:'A Homokra Esküdött, a Puszta Szomja',
      moves:{ 0:{name:'Súroló Szél'}, 1:{name:'Naphólyag'}, 2:{name:'A Víz Elvétele'},
        3:{name:'Üveg és Homok'}, 4:{name:'Kiszáradás'}, 5:{name:'Homoktorlasz'} },
      dialogue:{
        intro:'„Folyó volt itt. Én voltam a papja. A folyó elment, a hivatal nem, hát maradtam, és felvettem az egyetlen megmaradt szentséget: kiveszem a vizet a dolgokból.”',
        marked:'„A Kórus nem küld embereket a pusztába. Hőséget küldenek, és várnak.”',
        hallowed:'„A tiszták pontosan ugyanolyan ütemben száradnak ki.”',
        defeat:'„Hadd... essen...”',
        class:{ knight:'„Ennyi vas ebben a hőségben. Fősz benne. Én csak azért vagyok itt, hogy összeszedjem, ami elpárolog.”',
          rogue:'„Fuss csak, nyugodtan. A puszta nagyon széles, te pedig javarészt víz vagy.”',
          mage:'„Minden varázslatod verejtékbe kerül. Csak szórd bátran.”',
          warden:'„Lámpás a sivatagban. Fölösleges, és szomjas.”',
          necromancer:'„Itt már minden ki van szárítva és tartósítva. A gyülekezetet érzéketlennek fogod találni.”',
          alchemist:'„Folyadékot hordasz. Ez az első érdekes dolog, ami kilencven éve lejött ezen a lépcsőn.”' },
        items:{ pilgrim_staff:'„Zarándokbot. A zarándokok egykor elértek a folyóig. Kérdezd meg, hányan érik el most.”' } } },

    unrelieved:{ name:'Maud Lovag, a Leváltatlan',
      moves:{ 0:{name:'Védbástya'}, 1:{name:'Alabárdsöprés'}, 2:{name:'Falhoz Szegezés'},
        3:{name:'Kivégzés'}, 4:{name:'A Vonal Tartása'}, 5:{name:'Bosszú'} },
      dialogue:{
        intro:'„Alkonyatkor kértem a leváltásomat. Éjfélkor újra kértem. Százhat éve elmúlt éjfél, és abbahagytam a kérést, de nem hagytam abba az itt állást.”',
        marked:'„Szökevénytinta. Ismerem ezt a színt. Azt akasztottuk.”',
        hallowed:'„Jó tiszt lett volna belőled. Idelent ez nem bók.”',
        defeat:'„Leváltva... végre...”',
        class:{ knight:'„Te vagy a leváltás. Egy évszázadot késtél, és nem a mi színeinket viseled, de te vagy a leváltás, és próbára is teszlek érte.”',
          rogue:'„Az utolsó, aki bejelentés nélkül jött fel ezen a lépcsőn, darabokban ment vissza rajta. Jelentsd be magad.”',
          mage:'„A varázslat két hétig tartotta a keleti falat, aztán a keleti fal mégis leomlott.”',
          warden:'„Mondd el fölöttem a szavakat, ha ennek vége. Csak ennyit akarok, és előbb akkor is megpróbállak megölni.”',
          necromancer:'„Ne támaszd fel a helyőrséget. Kiérdemelték a fekvést.”',
          alchemist:'„Van valamid száz év állásra? Nincs. Gondoltam.”' },
        items:{ garrison_bulwark:'„Az a pajzs a miénk. Honnan sze— nem. Nem, egyszerűen visszaveszem.”' } } },

    silencekeeper:{ name:'Sile Apát, Aki Megtartotta a Csendet',
      moves:{ 0:{name:'Szent Nyíl'}, 1:{name:'A Csend Regulája'}, 2:{name:'Áldott Pöröly'},
        3:{name:'Vezeklés'}, 4:{name:'Óvó Ima'}, 5:{name:'Foltozás'} },
      dialogue:{
        intro:'„Ne szólj. A Regula áll ebben a kolostorban, akár maradt valaki, aki megtartsa, akár nem, és én háromszáz éve tartom egyedül. Harcolhatsz. Beszélned nem szabad.”',
        marked:'„Zajt hoztál magaddal a lépcsőn. Az egész hajszát.”',
        hallowed:'„Régen szívesen láttunk volna. A Regulában már nincs cikkely a vendéglátásra.”',
        defeat:'„...”',
        class:{ knight:'„A te rended kiabálja a fogadalmait. A miénk egyszer elsuttogta, aztán elhallgatott. Találd ki, melyik áll még.”',
          rogue:'„Csendben mozogsz. Egy évszázada ez az egyetlen udvariasság, amit valaki e ház iránt tanúsított.”',
          mage:'„A ráolvasás beszéd. Minden, amihez értesz, szabályszegés.”',
          warden:'„Hangosan imádkozol. Hangosan. Hogy hallják. A mienk sosem azért volt, hogy hallják.”',
          necromancer:'„A testvérek némák, és némák is maradnak. Ne adj szavakat a szájukba.”',
          alchemist:'„A főzőkamra amott van. Régóta vár valakire, aki ért hozzá.”' },
        items:{ ring_of_honor:'„Hiúság, kézen viselve. Mi levettük a magunkét.”' } } },

    // ---- elites: named terrors ----
    ironmonger:{ name:'A Vasműves',
      moves:{ 0:{name:'Üllőejtés'}, 1:{name:'Zúzás'}, 2:{name:'Fogó és Edzés'},
        3:{name:'Vasbőr'}, 4:{name:'Harci Kiáltás'} } },
    thirstjaw:{ name:'Szomjállkapocs',
      moves:{ 0:{name:'Homokkitörés'}, 1:{name:'Lábmarcangolás'}, 2:{name:'Alárántás'},
        3:{name:'Éjjeli Vadász'} } },
    bannerless:{ name:'A Zászlótlan',
      moves:{ 0:{name:'Pajzsroham'}, 1:{name:'Kivégzés'}, 2:{name:'Forgószél'},
        3:{name:'Rendíthetetlen Őrzés'}, 4:{name:'Halhatatlan Düh'} } },
    chandler:{ name:'A Gyertyaöntő',
      moves:{ 0:{name:'Kanóc és Láng'}, 1:{name:'Koppantás'}, 2:{name:'Faggyús Markolás'},
        3:{name:'Két Gyertya'}, 4:{name:'Energiapajzs'} } },
    vellum:{ name:'Vellum Testvér',
      moves:{ 0:{name:'Szent Nyíl'}, 1:{name:'Iniciálé'}, 2:{name:'A Másoló Keze'},
        3:{name:'Óvó Ima'}, 4:{name:'Foltozás'} } },

    // ---- hunter ----
    witch_hunter:{ name:'Boszorkányvadász',
      moves:{ 0:{name:'Számszeríjvessző'}, 1:{name:'Mérgezett Vessző'}, 2:{name:'Bola'} } },
  },
});


// ---- why each class came, and the work the Wanderer offers ----
I18N.addData({
BACKSTORY: {
    knight: {
      title: 'A Hamvas Lovag',
      short: 'Azért jött, hogy kitakarítsa a Mélysötétet.',
      long: 'A rend hamu, a fogadalmak túlélték. Egyedül jött végig az úton, olyan páncélban, amit már senki nem fényesít, abból kiindulva, hogy a Mélysötét egy seb, és a sebeket az zárja be, aki hajlandó belenyúlni. A város kedveli ezért. A város tizenegyet kedvelt már belőle.',
      goal: 'Megtisztítani a Mélysötétet.',
    },
    rogue: {
      title: 'A Sírtolvaj',
      short: 'Azért jött, ami odalent van.',
      long: 'Négy évszázadnyi ember ment le a Mélysötétbe mindenével, amije volt, és szinte semmi nem jött vissza. Ezt nem tragédiának tartja. Leltárnak tartja. Nem hazudik az indokairól, amit a város sértőbbnek talál, mintha hazudna.',
      goal: 'Gazdagabban feljönni.',
    },
    mage: {
      title: 'Az Üreges Boszorkány',
      short: 'Egy elátkozott hatalomért jött, ami legalul van.',
      long: 'Van valami a legmélyebb szinten, amiről a Kórus négy könyvtárat égetett fel, hogy senki ne olvashasson róla — ő pedig mégis olvasott róla. Nem gyógyírt keres, és nem fegyvert. Magát a dolgot keresi, és pontosan senkinek nem mondta el őszintén, mihez kezd vele, ha egyszer a kezében tartja.',
      goal: 'Elérni a legalsó szint elátkozott hatalmát.',
    },
    warden: {
      title: 'A Lámpásőr',
      short: 'Azért jött, hogy megölje a Nekromantát.',
      long: 'A rend megnevezett egy bűnöst és kiadott egy lámpást, ő pedig mindkettőt elfogadta, második kérdés nélkül. A Mélysötét minden szörnyetege a Nekromanta műve; így szól a tanítás. Tiszta magyarázat, és lassan feltűnik neki, hogy a tiszta magyarázatokat utólag szokták megírni. Minél mélyebbre jut, annál kevesebb szörnyeteg néz ki feltámasztottnak.',
      goal: 'Megölni a Nekromantát. Rájönni, hogy rossz az ítélet.',
    },
    necromancer: {
      title: 'A Graveborne',
      short: 'Azért jött, hogy uralja a Mélysötétet.',
      long: 'Nem megszökni előle, nem véget vetni neki, nem túlélni. Van odalent egy trón — egyesek szerint több is —, és a jelenlegi birtokosok kivétel nélkül halottak. Ezt inkább üresedésnek tekinti, mint figyelmeztetésnek. A város tud róla. A város rendkívül udvarias ezzel kapcsolatban.',
      goal: 'Elvenni a Mélysötétet magadnak.',
    },
    alchemist: {
      title: 'A Főzetkészítő',
      short: 'Azért jött, ami odalent terem.',
      long: 'Hét növény terem a Mélysötétben, és sehol máshol a világ felszínén, ő pedig egy évtizedet töltött annak bizonyításával, hogy a mondat második fele igaz. Nem bátor. Fegyvere sincs, különösebben. Azért van itt, mert az alapanyag itt van, és elfogyott a türelme azokhoz, akik agyonrongálva hozzák fel.',
      goal: 'Learatni, ami csak a mélyben terem.',
    },
  },

  CONTRACTS: {
    0:{ name:'Tisztogatás',
        brief:'Két szint le, aztán vissza fel. Hőstettet senki nem kér.' },
    1:{ name:'Rendes lemerülés',
        brief:'Három szint. A Vándor szerint ott szűnik meg sétának lenni.' },
    2:{ name:'Egy őrző feje',
        brief:'Egy a legendák közül, amelyik lépcsőt zár el. Megnevezi, amikor elvállalod a munkát.' },
    3:{ name:'A Trón',
        brief:'Végig le a legaljáig, és bármi is üljön ott.' },
  },
});


// ---- the tavern: who is in tonight and what they say to you ----
I18N.addData({
CITY_NPCS: {
    wanderer: {
      name:'A Sötét Vándor',
      role:'Ő veszi fel a lemerüléseket. A hátsó asztalnál ül. Régebb óta van itt, mint a kocsma.',
      intro:'Nem iszik és nem megy el, a kocsmárosné pedig már a székért sem kér tőle pénzt. Aki lemegy a lépcsőn, előbb nála írja alá. Hogy ki adta neki a jogot, azt senki sem tudja megmondani.',
      lines: {
        0:{ text:'„Még egy a hamuszürkében. Te vagy a tizenkettedik. A negyediket kedveltem — három szintet vitt, ami hárommal több, mint a tizenegyediké. Ülj le.”' },
        1:{ text:'„Nem azért jöttél, hogy bezárd a sebet. Azért jöttél, hogy kiforgasd a zsebeit. Jó. Akik hazudnak nekem erről, sekélyebben halnak meg.”' },
        2:{ text:'„Olvastál valamit, amit nem kellett volna, és most meg akarod nézni a saját szemeddel. Négyet láttam lemenni közületek ezért. Egyet sem láttam feljönni.”' },
        3:{ text:'„A rend egy névvel és egy lámpással küldött. A lámpást tartsd meg. A név a negyedik szint táján fog gondot okozni.”' },
        4:{ text:'„A legalsó széket akarod. Azt akarta az is, ami most ül benne. Ülj le; megmondom, hol van, a többit pedig személyesen megtudod.”' },
        5:{ text:'„Egy gyűjtögető. Tovább bírod majd, mint a kardforgatók, és pontosan tudod, miért, csak itt nem mondod ki hangosan. Ülj le.”' },
        6:{ text:'„A Kórusnál tintával áll a neved. Az nem az én dolgom. Az enyém a lépcsőnél kezdődik.”' },
        7:{ text:'„Tiszta kezek. A Mélysötétet nem érdekli, de én észreveszem. Valakinek illik.”' },
        8:{ text:'„Tudom, mit tettél a lánnyal a harmadik szinten. Nem fogok szólni róla. Egyszerűen csak tudni fogom továbbra is.”' },
        9:{ text:'„Ordra azt mondja, ittál. Úgy mondja, ahogy az ember olyat mond, amit régóta tartogat.”' },
        10:{ text:'„A lépcső ott van, ahol mindig. Ami az alján van, nem mindig az, ami múltkor volt az alján. Ezt vedd komolyan.”' },
      },
    },
    landlord: {
      name:'Aggie Voss, a kocsmárosné',
      role:'A Kötél és Lámpás gazdája. Több törzsvendéget temetett el, mint amennyit kiszolgált.',
      intro:'A pult mögött palatáblát tart, nevekkel. Nagyjából a harmaduk át van húzva. A rendszert nem magyarázza, és senki nem kérdezett rá kétszer.',
      lines: {
        0:{ text:'„Hamuszürke. Ülj oda, ahol látlak, szívem, és ne mondj beszédet. Az előző beszédet mondott.”' },
        1:{ text:'„Tudom, mi vagy. Itt mindenki tudja, mi vagy. Az érméd ugyanolyan színű, mint bárkié, szóval — mi legyen.”' },
        2:{ text:'„A csuklyát le a házamban. Nem érdekel, mi van alatta; az érdekel, hogy lássam.”' },
        3:{ text:'„Lámpáshordozó. Évek óta nem járt itt ilyen. Ülj a tűz mellé; nem számítok fel semmit.”' },
        4:{ text:'„Te. Kifelé, ha bármit elkezdesz. Fizető holtak vannak a pincémben, és szeretném, ha azok is maradnának.”' },
        5:{ text:'„Te vagy az, aki a főzőkamrát kérte. Hátul van, mocskos, és a tiéd, ha a szagot bent tartod.”' },
        6:{ text:'„Elfogatóparancs van rajtad, és ital van előtted. Mindkét tényt elbírom.”' },
        7:{ text:'„Fizettél annak, aki nem tudott. Egy ekkora ivóban egy perc alatt körbeér a szó.”' },
        8:{ text:'„Vén Fen azt mondja, rezet adtál neki a lépcsőn, és meg sem várattad magad a köszönettel. Elmesélte az egész ivónak. Kétszer.”' },
        9:{ text:'„Jóllakottan jöttél fel, pedig odalent nincs mit enni. Nem kérdezek semmit. Csak a tábla végére teszem a nevedet.”' },
        10:{ text:'„Kötél és Lámpás. A kötél a felhúzásra való, a lámpás a megtalálásra. Egyik sem ígéret.”' },
      },
    },
    quartermaster: {
      name:'Halloway őrmester',
      role:'Ő teszi ki a vérdíjakat. Valaha helyőrség volt, mielőtt a helyőrség abbahagyta a válaszolást.',
      intro:'A mellette álló tábla az egyetlen hivatalos dolog, ami Üregkapuban maradt. A hirdetményeket maga írja, olyan kézírással, amelyet igénylőlapokhoz képeztek ki.',
      lines: {
        0:{ text:'„Rendbéli. Akkor el tud olvasni egy hirdetményt anélkül, hogy tartanám. Vigye, amit elbír.”' },
        1:{ text:'„Nem érdekel, ki hozza be a fejet. Már nem érdekel. Olvasd a táblát.”' },
        2:{ text:'„A felülről harmadik hirdetmény kell magának. Az, amelyre a rendje hat éve csendben nem néz rá.”' },
        3:{ text:'„Kötelességem ezeket nyilvánosan kifüggeszteni. Nem kötelességem örülni annak, ki olvassa őket.”' },
        4:{ text:'„Maga is rajta van egy hirdetményen. Más városban ez számítana. Itt csak annyit jelent, hogy ismeri a formanyomtatványt.”' },
        5:{ text:'„Hozza a bizonyítékot, és tisztán kifizetem. Meglepődne, milyen ritka a tiszta rész.”' },
        6:{ text:'„Minden hirdetmény azon a táblán valaki, aki nem jött vissza. A vérdíj az, ami a zsoldjukból maradt.”' },
      },
    },
  },
});

// ---- an active has two names: the one on the button (active.name) and the one
// the combat log prints when it lands (active.action.name). Only the first was
// being translated, so a relic read Hungarian in the pack and English in the fight.
I18N.addData({
  ITEMS: {
    wellspring_stave:{ active:{ action:{ name:'Túlmerítés' } } },
    skinners_needle: { active:{ action:{ name:'Felfejtés' } } },
    starveling_crown:{ active:{ action:{ name:'Felfalás' } } },
    velvet_shroud:   { active:{ action:{ name:'Elbűvölés' } } },
    gloamheart:      { active:{ action:{ name:'Gloamtűz' } } },
    choir_reliquary: { active:{ action:{ name:'Az Ítélet' } } },
    garrison_bulwark:{ active:{ action:{ name:'Tartsd a Vonalat' } } },
    thousandth_knife:{ active:{ action:{ name:'Hátbaszúrás' } } },
    kiln_ember:      { active:{ action:{ name:'Felszítás' } } },
  },
});

// ---- the two set bonuses: the names were translated in the first pass, the
// descriptions were not, so a completed set explained itself in English ----
I18N.addData({
  SETS: {
    pauper: { desc:'Három semmirekellő holmi, amelyeket sosem szántak szétválasztásra. Együtt: +13 TÁM, +11 VÉD, +34 ÉP, +6 MÁG, +3 FP, az ütéseid 20%-ot isznak, és az éhség feleannyira gyorsan jön.' },
    carrion:{ desc:'A horog, a lepel és a harang. Együtt: +15 TÁM, +8 VÉD, +22 ÉP, +3 GYO, +20% kritikus esély, és minden sebzés 15%-kal keményebb.' },
  },
});

// ================= v65: the other buildings, and letting a life go =================
// The Cold Forge, the Grey Chapel and Gallows Market all arrived in English, as
// did the hold-to-delete question and the new reading of what walking out of a
// run means. Stat abbreviations inside item mod strings had never been relabelled
// either, which is why a chapel row read "fegyver — +4 ATK".

const HU_STAT_WORDS = (s) => s
  .replace(/\bATK\b/g, 'TÁM').replace(/\bDEF\b/g, 'VÉD').replace(/\bMAG\b/g, 'MÁG')
  .replace(/\bSPD\b/g, 'GYO').replace(/\bHP\b/g, 'ÉP').replace(/\bSP\b/g, 'FP');

I18N.addUI({
  // ---- what the city says the buildings are, now that they are open ----
  'Steel for coin, and more steel beaten into what you already carry.':
    'Acél pénzért, és még több acél abba verve, amit már hordasz.',
  'The Choir keeps the rail, the ledger, and whatever is behind it.':
    'A Kórus őrzi a korlátot, a könyvet, és azt, ami mögötte van.',
  'Nothing for sale. The people who still come are the point.':
    'Semmi sem eladó. Azok az emberek a lényeg, akik még mindig eljönnek.',

  // ---- The Cold Forge ----
  '"The fire is only cold when nobody is paying. Show me coin and show me what you carry."':
    '„A tűz csak akkor hideg, ha senki nem fizet. Mutass pénzt, és mutasd, mit hordasz.”',
  'The work': 'A munka',
  'Beat the ATK up': 'A TÁM kikalapálása',
  'Beat the DEF up': 'A VÉD kikalapálása',
  'Beat the MAG up': 'A MÁG kikalapálása',
  'Steel': 'Acél',
  'The rack is bare until the next descent.': 'Az állvány üres a következő lemerülésig.',

  // ---- The Grey Chapel ----
  '"The order is ash and you came anyway. Kneel. It costs the Choir nothing to say the words and it is plainly costing you something to hear them."':
    '„A rend hamu, és te mégis eljöttél. Térdelj le. A Kórusnak semmibe nem kerül kimondani a szavakat, és jól látszik, hogy neked valamibe kerül végighallgatni őket.”',
  '"You came in. Everyone in this city knows what you are, and you came in anyway, and you stood at the back where you thought nobody was looking."':
    '„Bejöttél. Ebben a városban mindenki tudja, mi vagy, és te mégis bejöttél, és hátul álltál meg, ahol azt hitted, senki nem néz.”',
  '"Coin buys bread. Souls buy the other thing. Do not confuse the two at this rail."':
    '„A pénz kenyeret vesz. A lélek a másik dolgot veszi. Ennél a korlátnál ne keverd össze a kettőt.”',
  'The offering': 'Az adomány',
  'Ask for coin back': 'Pénzt kérni vissza',
  'The Choir returns 40 gold for 6 Souls': 'A Kórus 40 aranyat ad 6 lélekért',
  'The rail opens and forty gold comes back across it.':
    'A korlát kinyílik, és negyven arany jön vissza rajta.',
  'Behind the rail': 'A korlát mögött',
  'What you carry': 'Amit hordasz',
  'You are carrying nothing the Choir wants.': 'Semmit nem hordasz, ami a Kórusnak kellene.',

  // ---- Gallows Market ----
  'Two rows of stalls with nothing on them and a gallows nobody has taken down, because taking it down would be a decision and nobody here makes those any more.':
    'Két sor stand, semmi rajtuk, és egy akasztófa, amit senki nem bontott le, mert a lebontása döntés lenne, és itt már senki nem hoz döntéseket.',
  'Who is out today': 'Ki van kint ma',
  'The square is empty today.': 'A tér ma üres.',

  // ---- letting a life go, and the new reading of walking out of a run ----
  'Let go of this life?': 'Biztos elhagyod ezt az életet?',
  '<i>There is no undoing it. The roster simply has one fewer name in it.</i>':
    '<i>Nincs visszaút. A névsorban egyszerűen eggyel kevesebb név lesz.</i>',
  'Let it go': 'Elengedem',
  'Keep it': 'Megtartom',
  'The name goes off the slate.': 'A név lekerül a tábláról.',
  'Turning back is not a way out. This soul ends here, and only its Souls climb the stair. (Codex discoveries are kept.)':
    'A visszafordulás nem kijárat. Ez a lélek itt ér véget, és csak a lelkei jutnak fel a lépcsőn. (A kódex-felfedezések megmaradnak.)',
  'End it here': 'Itt vess véget neki',
});

I18N.addPatterns([
  // ---- the forge, which counts its own work ----
  [/^\+1 ATK for good — (\d+) done so far$/, '+1 TÁM véglegesen — eddig $1'],
  [/^\+1 DEF for good — (\d+) done so far$/, '+1 VÉD véglegesen — eddig $1'],
  [/^\+1 MAG for good — (\d+) done so far$/, '+1 MÁG véglegesen — eddig $1'],
  [/^The Cold Forge beats another point of ATK into you\.$/,
    'A Hideg Kohó még egy pont TÁM-ot kalapál beléd.'],
  [/^The Cold Forge beats another point of DEF into you\.$/,
    'A Hideg Kohó még egy pont VÉD-et kalapál beléd.'],
  [/^The Cold Forge beats another point of MAG into you\.$/,
    'A Hideg Kohó még egy pont MÁG-ot kalapál beléd.'],

  // ---- the chapel ledger ----
  [/^Your honor rises by (\d+)\.$/, 'A becsületed nő: +$1.'],
  [/^Give (\d+) gold$/, '$1 arany felajánlása'],
  [/^The ledger records (\d+) Souls$/, 'A könyv $1 lelket ír jóvá'],
  [/^The Choir takes the coin and writes down (\d+) Souls\.$/,
    'A Kórus elveszi a pénzt, és $1 lelket ír be.'],
  [/^Give up (.+)$/, 'Lemondasz erről: $1'],
  [/^The Choir takes (?:the )?(.+) and enters (\d+) Souls against your name\.$/,
    'A Kórus elveszi — $1 —, és $2 lelket ír a nevedhez.'],

  // ---- the question the roster asks when a card is held all the way out ----
  [/^(.+), level (\d+), (\d+) descents survived\. Nothing of this one is kept but the Souls, which were never really its own\.$/,
    '$1, $2. szint, $3 túlélt lemerülés. Ebből semmi nem marad meg, csak a lelkek, amelyek sosem voltak igazán az övéi.'],

  // ---- item mod strings, everywhere they are shown ----
  // "+4 ATK · +10 HP" standing on its own, and the chapel's "<slot> — <mods>" row.
  [/^[+-]\d+ (?:ATK|DEF|MAG|SPD|HP|SP)(?: · [+-]\d+ (?:ATK|DEF|MAG|SPD|HP|SP))*$/,
    (m) => HU_STAT_WORDS(m)],
  [/^(weapon|armor|trinket) — (.+)$/,
    (m, slot, mods) => ({ weapon:'fegyver', armor:'páncél', trinket:'ereklye' })[slot]
      + ' — ' + HU_STAT_WORDS(mods)],

  // ---- the two coin lines the city assembles markup around ----
  [/^<span class="g">✦ (\d+) Gold<\/span>$/, '<span class="g">✦ $1 arany</span>'],
  [/^<span class="g">✦ (\d+) Gold<\/span><span class="s">◈ (\d+) Souls<\/span>$/,
    '<span class="g">✦ $1 arany</span><span class="s">◈ $2 lélek</span>'],
]);

// ---- the three who still come to a market that sells nothing ----
I18N.addData({
  CITY_NPCS: {
    gravedigger: {
      name: 'Vas Mabb, a Sírásó',
      role: 'A városnak ás. A második tél óta nem kapott fizetést.',
      intro: 'A piac túlsó végén dolgozza a földet, ahol a standok elfogynak. Nincs kerítés akörül, amit ás, és sosem volt rá szükség; Hollowgate-ben senkinek nem kell elmagyarázni, mi az a sarok.',
      lines: {
        0: { text:'„Hamuszürke. Kilencet temettem el a fajtádból. Kettőt kétszer ástam ki, mert az első gödör nem volt elég mély ahhoz, ami feljött belőle.”' },
        1: { text:'„Az én földemben végzed, mint a többiek, és te leszel az egyetlen, aki őszinte volt afelől, miért jött. Ezért megkapod a jó sarkot.”' },
        2: { text:'„A te fajtádnak nem ások. Bármit is hordasz, amikor elmész, az fent marad, és megy a tűzbe.”' },
        3: { text:'„Mondd el a szavakat a névteleneknek, jó? Negyedik sor. Tizenegy éve rosszul mondom, és tudom is.”' },
        4: { text:'„Akkor egy szakmában vagyunk. Én lefektetem őket. Maradj távol a soraimtól.”' },
        5: { text:'„Semmi nem nő abban a földben. Semmi. És mindketten tudjuk, hogy ez nem normális.”' },
        6: { text:'„A Kórus nem engedi az elítéltjeit megszentelt földbe. Szerencsédre itt semmi nincs megszentelve.”' },
        7: { text:'„Kapsz követ. Nem mindenki kap követ.”' },
        8: { text:'„Azt beszélik, levágtál egy nőt a bitóról, és elmondtad fölötte a szavakat. Az az én dolgom, és te jobban csináltad.”' },
        9: { text:'„Valaki tizenkettőt a rendből tisztességgel nyugalomra helyezett odalent. Szeretném megszorítani azt a kezet, és gyanítom, épp most szorítom.”' },
        10:{ text:'„Az egyestől a hatosig minden sor tele van. A hetes ezé a télé. A nyolcasra ne lépj rá.”' },
      },
    },
    crier: {
      name: 'Wick, aki a hirdetményeket olvassa',
      role: 'Hangosan olvassa a táblát azoknak, akik nem tudják. Nem kér semmit, és elfogadja, amit adnak.',
      intro: 'Egy felfordított ládán áll ott, ahol régen a tömeg volt, és Halloway hirdetményeit olvassa fel az üres térnek, naponta kétszer, abban az órában, amit mondtak neki. Senki nem szólt neki, hogy hagyja abba.',
      lines: {
        0: { text:'„Egy rendbéli! Állj csak ott egy pillanatra, jó? Jobban hangzik, ha valaki áll előtte.”' },
        1: { text:'„Rám nincs szükséged. Te előbb elolvasod a hirdetményeket, mint hogy Halloway kitűzné őket, és láttam is, ahogy csinálod.”' },
        2: { text:'„Te olvasol. Mindenki, aki olvas, megszűnt rám szorulni, és évről évre kevesebben vagytok, ami vagy jó az üzletnek, vagy nagyon rossz.”' },
        3: { text:'„Régen küldtek egy lámpást, hogy velem álljon a második felolvasáson, hogy a hátul állók is lássák a táblát. Hat éve te vagy az első.”' },
        4: { text:'„Bárkinek felolvasok. Ennyi az egész állás. Nem fogok úgy tenni, mintha mindegyiküknek örülnék.”' },
        5: { text:'„A harmadik hirdetmény hét köteget kér bármiből, ami odalent nő. Másfél éve senki nem jelentkezett érte.”' },
        6: { text:'„A neved fent van a táblán. Délben és alkonyatkor fel kell olvasnom. Halkan olvasom.”' },
        7: { text:'„A jó részbe tettem a nevedet, a vérdíjak után, ahol az emberek még figyelnek.”' },
        8: { text:'„Vén Fen oszt. Nincs semmije, és mégis oszt. Mostanában megemlítem a felolvasásokban. Senki nem állít le.”' },
        9: { text:'„Kilenc hirdetmény ma reggel. Kettő ugyanaz az ember. Egy meg egy ház, ami eldőlt.”' },
      },
    },
    widow: {
      name: 'A Várakozó Özvegy',
      role: 'Standot tart, amin nincs semmi. Minden nap eljön, amikor a piac nyit.',
      intro: 'A stand felsöpörve, a terítő tiszta, és négy éve nincs mit rátenni. Mégis kirakja, mögé ül, és nézi a lépcső száját.',
      lines: {
        0: { text:'„Ő is azt a szürkét viselte. Nem azt a páncélt — azt a szürkét. Ne mondd nekem, hogy közönséges szín, tudom, mit nézek.”' },
        1: { text:'„Hárommal ment le meg egy tolvajjal, és a tolvaj visszajött. Szóval lehetséges. Szóval valaki mégiscsak visszajön.”' },
        2: { text:'„Meg tudod hívni őket? Nem. Ne válaszolj. Egyszer megkérdeztem, és a válasz egy évembe került.”' },
        3: { text:'„Ha megtalálod, ne hozd fel. A hírt hozd. Megszoktam a nem-tudást, és inkább azt, mint a másikat.”' },
        4: { text:'„Nem. Bármit is akarsz ajánlani — nem. Menj el a standomtól.”' },
        5: { text:'„Van valamid alváshoz? Nem az a fajta, ami használ. Az a fajta, ami nem.”' },
        6: { text:'„Azt mondják, üldöznek. Jó. Ebben a városban valakinek keresnie kellene valakit.”' },
        7: { text:'„Te elmondanád. Ha megtalálnád, tényleg visszajönnél és elmondanád. Látom rajtad.”' },
        8: { text:'„Van odalent egy nő a vízben, aki férjhez ment volna. Valaki beszélt vele. Bárki is volt — köszönöm. Köszönöm.”' },
        9: { text:'„A stand nem eladásra van. Azért van, hogy amikor feljön, legyen itt valami a miénkből, amit felismer.”' },
      },
    },
  },
});

// The forge and the chapel both buy through forceEquip, which writes these two
// lines to the log. They had been sitting untranslated behind the Hollow
// Merchant, where they were rarer; two shops in the city put them in front of
// the player on every purchase.
I18N.addPatterns([
  [/^You buy the (.+)\.$/, 'Megveszed: $1.'],
  [/^The merchant takes your old (.+) for (\d+) gold\.$/,
    'A kereskedő elveszi a régi darabodat — $1 —, $2 aranyért.'],
]);

// ================= v66: the point ledger, which the sweep had walked past =================
// "What You Were Before" — the allotment screen between the deck and the city —
// still spoke English in its explanation, its balance line, its six stat rows
// and the Necromancer's two disciplines. The deck now opens straight onto the
// class dossier, which makes this the next thing a new player reads.
I18N.addUI({
  'Twenty points of whoever you used to be, and the dark gets everything after that. No more than ten into any one of them.':
    'Húsz pontnyi abból, aki azelőtt voltál — a többit a sötét kapja. Egyetlen tulajdonságba sem mehet tíznél több.',
  'Nothing. There is no before — she traded it, and the terms were not favourable.':
    'Semmi. Nincs azelőtt — elcserélte, és a feltételek nem voltak kedvezőek.',
  '⚔ Offensive': '⚔ Támadó',
  'bone, poison, curses that kill': 'csont, méreg, átkok, amelyek ölnek',
  '⛨ Defensive': '⛨ Védekező',
  'bone armor, the golem, curses that unstring': 'csontpáncél, a gólem, átkok, amelyek szétzilálnak',
});

I18N.addPatterns([
  // "20 points left of twenty" / "1 point left of twenty", inside its coloured span
  [/^<span class="(g|s)">(\d+) points? left of twenty<\/span>$/,
    '<span class="$1">$2 pont maradt a húszból</span>'],
  // the six rows: "<b>Max HP</b> <span class="dim">+3 each</span>"
  [/^<b>(Max HP|Max SP|ATK|DEF|MAG|SPD)<\/b> <span class="dim">\+(\d+) each<\/span>$/,
    (m, label, n) => `<b>${HU_STAT_WORDS(label)}</b> <span class="dim">+${n} pontonként</span>`],
  // the summary line under the portrait: "<b>Max HP</b> 60 · <b>Max SP</b> 6 · <b>ATK</b> 14 ..."
  // with an optional green "+3" after any of them once points are spent
  [/^<b>Max HP<\/b> \d+(?: <span[^>]*>\+\d+<\/span>)?(?: · <b>(?:Max SP|ATK|DEF|MAG|SPD)<\/b> \d+(?: <span[^>]*>\+\d+<\/span>)?)+$/,
    (m) => HU_STAT_WORDS(m)],
]);

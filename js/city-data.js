// ---------- Hollowgate: the city above, and what it thinks of you ----------
// Everything down the stair is the Deep Dark. This file is the other half: who
// waits in the city, what they say, and how that changes with the soul standing
// in front of them. Nothing here touches combat.

// ---- Why each of them came. Told in pieces, mostly by other people. ----
const BACKSTORY = {
  knight: {
    title: 'The Ashen Knight',
    short: 'Came to clean the Deep Dark out.',
    long: 'The order is ash and the vows outlived it. He came down the road alone, in armour nobody polishes any more, on the theory that the Deep Dark is a wound and wounds are closed by somebody willing to put a hand in. The city likes him for it. The city has liked eleven of him.',
    goal: 'Purge the Deep Dark.',
  },
  rogue: {
    title: 'The Gravethief',
    short: 'Came for what is down there.',
    long: 'Four centuries of people have gone into the Deep Dark carrying everything they owned, and almost none of it has come back out. She does not think this is a tragedy. She thinks it is inventory. She is not lying about her reasons, which the city finds more offensive than if she were.',
    goal: 'Come back up richer.',
  },
  mage: {
    title: 'The Hollow Witch',
    short: 'Came for a cursed power at the bottom.',
    long: 'There is something at the deepest floor that the Choir burned four libraries to stop people reading about, and she has read about it anyway. She is not looking for a cure or a weapon. She is looking for the thing itself, and she has been honest with exactly nobody about what she intends to do once she is holding it.',
    goal: 'Reach the cursed power at the bottom.',
  },
  warden: {
    title: 'The Lantern Warden',
    short: 'Came to kill the Necromancer.',
    long: 'The order named a culprit and issued a lantern, and she took both without asking a second question. Every monster in the Deep Dark is the Necromancer\'s work; that is the teaching. It is a clean explanation and she has begun to notice that clean explanations are the kind people write afterwards. The deeper she goes, the fewer of the monsters look raised.',
    goal: 'Kill the Necromancer. Find out that is the wrong sentence.',
  },
  necromancer: {
    title: 'The Graveborne',
    short: 'Came to rule the Deep Dark.',
    long: 'Not to escape it, not to end it, not to survive it. There is a throne down there — several, by some counts — and the current occupants are, without exception, dead. He considers that a vacancy rather than a warning. The city is aware. The city is being extremely polite about it.',
    goal: 'Take the Deep Dark for yourself.',
  },
  alchemist: {
    title: 'The Potion-Maker',
    short: 'Came for what grows down there.',
    long: 'Seven plants grow in the Deep Dark and nowhere else on the surface of the world, and she has spent a decade proving that the second half of that sentence is true. She is not brave. She is not armed, particularly. She is here because the material is here, and she has run out of patience with people who bring it up badly damaged.',
    goal: 'Harvest what only grows in the deep.',
  },
};

// ---- How the city reads a soul. Honor first, then the specific person. ----
// alignment() only ever returns these three, so these are the only moods there are.
const CITY_MOOD = {
  HALLOWED: 'warm',
  MORTAL:   'wary',
  MARKED:   'hostile',
};

// ---- The Tavern: The Rope and Lantern ----
// Every line may be gated. cls = only that class, tier = only that honor band,
// codex = only once that entry has been discovered, flag = only after a story
// beat. Ungated lines are the fallback so nobody is ever left silent.
const CITY_NPCS = {
  wanderer: {
    id: 'wanderer', name: 'The Dark Wanderer', sprite: 'npc_silhouette', where: 'tavern',
    role: 'Takes the descents. Sits at the back table. Has been here longer than the tavern.',
    intro: 'He does not drink and he does not leave, and the landlord has stopped charging him for the chair. Everyone who goes down the stair signs with him first. Nobody can say who gave him the authority.',
    lines: [
      { cls:'knight',      text:'"Another one in the ash-grey. You are the twelfth. I liked the fourth — he got three floors, which is three more than the eleventh. Sit."' },
      { cls:'rogue',       text:'"You are not here to close the wound. You are here to go through its pockets. Good. The ones who lie to me about it die shallower."' },
      { cls:'mage',        text:'"You have read something you should not have, and now you want to go and look at it. I have watched four of you go down for that. I have watched none come up."' },
      { cls:'warden',      text:'"The order sent you with a name and a lantern. Keep the lantern. The name is going to give you trouble around the fourth floor."' },
      { cls:'necromancer', text:'"You want the chair at the bottom. So did the thing currently in it. Sit down; I will tell you where it is, and you can find out the rest personally."' },
      { cls:'alchemist',   text:'"A picker. You will last longer than the swordsmen and you know exactly why, and you will not say it out loud in here. Sit."' },
      { tier:'MARKED',     text:'"The Choir has your name in ink. That is not my business. Mine starts at the stair."' },
      { tier:'HALLOWED',   text:'"Clean hands. The Deep Dark does not care, but I notice. Somebody should."' },
      { codex:'child_blood', text:'"I know what you did to the girl on the third floor. I am not going to say anything about it. I am simply going to keep knowing it."' },
      { codex:'well_mercy',  text:'"Ordra says you drank. She says it the way people say a thing they have been saving up."' },
      { text:'"The stair is where it always is. What is at the bottom of it is not always what was at the bottom of it last time. Take that seriously."' },
    ],
  },
  landlord: {
    id: 'landlord', name: 'Aggie Voss, the Landlord', sprite: 'npc_woman', where: 'tavern',
    role: 'Owns the Rope and Lantern. Has buried more regulars than she has served.',
    intro: 'She keeps a slate behind the bar with names on it. About a third are crossed out. She does not explain the system and nobody has ever asked twice.',
    lines: [
      { cls:'knight',      text:'"Ash-grey. Sit where I can see you, love, and do not make a speech. The last one made a speech."' },
      { cls:'rogue',       text:'"I know what you are. Everyone in here knows what you are. Your coin is the same colour as anyone\'s, so — what will it be."' },
      { cls:'mage',        text:'"Hood down in my house. I do not care what is under it, I care that I can see it."' },
      { cls:'warden',      text:'"A lantern-carrier. It has been years. Sit by the fire; you will not be charged."' },
      { cls:'necromancer', text:'"You. Outside, if you start anything. I have paying dead in the cellar and I would like them to stay that way."' },
      { cls:'alchemist',   text:'"You are the one who wanted the stillroom. It is through the back and it is filthy and it is yours if you keep the smell in it."' },
      { tier:'MARKED',     text:'"There is a warrant on you and there is a drink in front of you. I am capable of holding both facts."' },
      { tier:'HALLOWED',   text:'"You paid for the fellow who could not. Word gets round a room this size in about a minute."' },
      { codex:'beg_alms',  text:'"Old Fen says you gave him copper on the stair and did not wait to be thanked. He has told the whole bar. Twice."' },
      { codex:'butcher_meat', text:'"You came back up fed, and there was nothing down there to be fed on. I am not asking. I am moving your slate to the end."' },
      { text:'"Rope and Lantern. The rope is for hauling and the lantern is for finding. Neither one is a promise."' },
    ],
  },
  quartermaster: {
    id: 'quartermaster', name: 'Sergeant Halloway', sprite: 'npc_merchant', where: 'tavern',
    role: 'Posts the bounties. Was garrison once, before the garrison stopped answering.',
    intro: 'The board beside him is the only official thing left in Hollowgate. He writes the notices himself, in a hand that was trained for requisition forms.',
    lines: [
      { cls:'knight',      text:'"Order man. Then you can read a posting without me holding it. Take what you can carry."' },
      { cls:'rogue',       text:'"I do not care who brings the head in. I have stopped caring. Read the board."' },
      { cls:'warden',      text:'"You will want the third notice down. It is the one your order has been quietly not looking at for six years."' },
      { cls:'necromancer', text:'"I am required to post these publicly. I am not required to be pleased about who reads them."' },
      { tier:'MARKED',     text:'"You are on a notice yourself. In another city that would matter. Here it just means you know the format."' },
      { tier:'HALLOWED',   text:'"Bring the proof and I will pay it clean. You would be astonished how rare the clean part is."' },
      { text:'"Every notice on that board is somebody who did not come back. The bounty is what is left of their pay."' },
    ],
  },
  // ---- Gallows Market: nobody here sells anything any more. They stayed for
  // other reasons, and each of them will tell you a different one. ----
  gravedigger: {
    id: 'gravedigger', name: 'Iron Mabb, the Gravedigger', sprite: 'npc_gibbet', where: 'market',
    role: 'Digs for the city. Has not been paid since the second winter.',
    intro: 'She works the ground at the far end of the market where the stalls give out. There is no wall around what she digs and there has not needed to be one; nobody in Hollowgate has to be told what that corner is.',
    lines: [
      { cls:'knight',      text:'"Ash-grey. I have put nine of you in. Two of them I dug twice, because the first hole was not deep enough for what came back up."' },
      { cls:'rogue',       text:'"You will end up in my ground like the rest, and you will be the only one who was honest about why you came. I will give you the good corner for that."' },
      { cls:'mage',        text:'"I do not dig for your sort. Whatever you are carrying when you go, it stays above and it goes in the fire."' },
      { cls:'warden',      text:'"Say the words for the ones with no names, would you. Row four. I have been saying them wrong for eleven years and I know it."' },
      { cls:'necromancer', text:'"You and I are in the same trade, then. I put them down. Stay out of my rows."' },
      { cls:'alchemist',   text:'"Nothing grows in that soil. Nothing. And you and I both know that is not normal."' },
      { tier:'MARKED',     text:'"The Choir does not let its condemned into consecrated ground. Lucky for you, none of this is consecrated."' },
      { tier:'HALLOWED',   text:'"You will get a stone. Not everyone gets a stone."' },
      { codex:'hang_rite', text:'"Word is you cut a woman down out of a gibbet and said the words over her. That is my job, and you did it better."' },
      { codex:'shr_rest',  text:'"Somebody laid twelve of the order to rest properly down there. I would like to shake that hand, and I suspect I am shaking it."' },
      { text:'"Rows one through six are full. Seven is for this winter. Do not walk on eight."' },
    ],
  },
  crier: {
    id: 'crier', name: 'Wick, Who Reads the Notices', sprite: 'npc_beggar', where: 'market',
    role: 'Reads the board aloud for those who cannot. Charges nothing and takes what he is given.',
    intro: 'He stands on an upturned crate where the crowd used to be and reads Halloway\'s notices out to an empty square, twice a day, at the hours he was told to. Nobody has told him to stop.',
    lines: [
      { cls:'knight',      text:'"An order man! Stand there a moment, would you. It reads better with somebody in front of it."' },
      { cls:'rogue',       text:'"You do not need me. You read the notices before Halloway pins them, and I have seen you do it."' },
      { cls:'mage',        text:'"You read. Everyone who reads has stopped needing me, and there are fewer of you every year, which is either good for business or very bad."' },
      { cls:'warden',      text:'"They used to send a lantern to stand with me at the second reading, so the ones at the back could see the board. You are the first in six years."' },
      { cls:'necromancer', text:'"I will read to anybody. That is the whole of the position. I am not going to pretend I am pleased about all of them."' },
      { cls:'alchemist',   text:'"Third notice down wants seven bundles of anything that grows below. Nobody has claimed it in a year and a half."' },
      { tier:'MARKED',     text:'"Your name is on the board. I have to read it out at noon and at dusk. I read it quietly."' },
      { tier:'HALLOWED',   text:'"I put your name in the good part, after the bounties, where people are still listening."' },
      { codex:'beg_alms',  text:'"Old Fen shares. He does not have anything, and he shares it. I mention it in the readings now. Nobody stops me."' },
      { text:'"Nine notices this morning. Two are the same man. One is a building that fell over."' },
    ],
  },
  widow: {
    id: 'widow', name: 'The Waiting Widow', sprite: 'npc_bride', where: 'market',
    role: 'Keeps a stall with nothing on it. Comes every day the market opens.',
    intro: 'The stall is swept, the cloth is clean, and there has been nothing to put on it for four years. She sets it out anyway, sits behind it, and watches the mouth of the stair.',
    lines: [
      { cls:'knight',      text:'"He wore that grey. Not that armour — that grey. Do not tell me it is a common colour, I know what I am looking at."' },
      { cls:'rogue',       text:'"He went down with three others and a thief, and the thief came back. So it can be done. So somebody does come back."' },
      { cls:'mage',        text:'"Can you call them? No. Do not answer that. I asked once and the answer cost me a year."' },
      { cls:'warden',      text:'"If you find him, do not bring him. Bring the word. I have got used to the not-knowing and I would rather it than the other."' },
      { cls:'necromancer', text:'"No. Whatever you are about to offer — no. Get away from my stall."' },
      { cls:'alchemist',   text:'"Do you have anything for sleeping? Not the kind that works. The kind that does not."' },
      { tier:'MARKED',     text:'"They say you are hunted. Good. Somebody in this city should be looking for somebody."' },
      { tier:'HALLOWED',   text:'"You would tell me. If you found him, you would actually come back and tell me. I can see it."' },
      { codex:'bride_truth', text:'"There is a woman in the water down there who was going to be married. Somebody spoke to her. Whoever it was — thank you. Thank you."' },
      { text:'"The stall is not for selling. It is so that when he comes up, there is something of ours he will recognise."' },
    ],
  },
};

// ---- Contracts: what the Wanderer sends you down for. The target sets both
// the difficulty and the purse, so a harder name is always worth more. ----
const CONTRACTS = [
  { id:'ct_clear',  name:'A Clearing',        kind:'depth',    target:2,
    brief:'Two floors down and back up. Nobody is asking for heroics.', pay:40 },
  { id:'ct_deeper', name:'A Proper Descent',  kind:'depth',    target:3,
    brief:'Three floors. The Wanderer says that is where it stops being a walk.', pay:80 },
  { id:'ct_keeper', name:'A Keeper\'s Head',  kind:'guardian', target:null,
    brief:'One of the legends that bars a stair. He will name it when you take the work.', pay:120 },
  { id:'ct_throne', name:'The Throne',        kind:'boss',     target:null,
    brief:'All the way to the bottom, and whatever is sitting at it.', pay:250 },
];

// The localisation overlay only ever writes onto Data, so the city tables are
// registered there too. City keeps the same object references, which means a
// language switch reaches the tavern without city.js knowing i18n exists.
if (typeof Data !== 'undefined') Object.assign(Data, { BACKSTORY, CITY_NPCS, CONTRACTS });

if (typeof window !== 'undefined'){
  window.City = { BACKSTORY, CITY_MOOD, CITY_NPCS, CONTRACTS };
}

/**
 * KBot -- Dictionary
 * @author Kali@F-List.net
 */
/// <reference path="../bot.d.ts" />
var KBot;
(function (KBot) {
    var Dictionary;
    (function (Dictionary) {
        var Adlib;
        (function (Adlib) {
            Adlib.adjectives = ["abandoned", "able", "absolute", "adorable", "adventurous", "academic", "acceptable", "acclaimed", "accomplished", "accurate", "aching", "acidic", "acrobatic", "active", "actual", "adept", "admirable", "admired", "adolescent", "adorable", "adored", "advanced", "afraid", "affectionate", "aged", "aggravating", "aggressive", "agile", "agitated", "agonizing", "agreeable", "ajar", "alarmed", "alarming", "alert", "alienated", "alive", "all", "altruistic", "amazing", "ambitious", "ample", "amused", "amusing", "anchored", "ancient", "angelic", "angry", "anguished", "animated", "annual", "another", "antique", "anxious", "any", "apprehensive", "appropriate", "apt", "arctic", "arid", "aromatic", "artistic", "ashamed", "assured", "astonishing", "athletic", "attached", "attentive", "attractive", "austere", "authentic", "authorized", "automatic", "avaricious", "average", "aware", "awesome", "awful", "awkward", "babyish", "bad", "back", "baggy", "bare", "barren", "basic", "beautiful", "belated", "beloved", "beneficial", "better", "best", "bewitched", "big", "big-hearted", "biodegradable", "bite-sized", "bitter", "black", "black-and-white", "bland", "blank", "blaring", "bleak", "blind", "blissful", "blond", "blue", "blushing", "bogus", "boiling", "bold", "bony", "boring", "bossy", "both", "bouncy", "bountiful", "bowed", "brave", "breakable", "brief", "bright", "brilliant", "brisk", "broken", "bronze", "brown", "bruised", "bubbly", "bulky", "bumpy", "buoyant", "burdensome", "burly", "bustling", "busy", "buttery", "buzzing", "calculating", "calm", "candid", "canine", "capital", "carefree", "careful", "careless", "caring", "cautious", "cavernous", "celebrated", "charming", "cheap", "cheerful", "cheery", "chief", "chilly", "chubby", "circular", "classic", "clean", "clear", "clear-cut", "clever", "close", "closed", "cloudy", "clueless", "clumsy", "cluttered", "coarse", "cold", "colorful", "colorless", "colossal", "comfortable", "common", "compassionate", "competent", "complete", "complex", "complicated", "composed", "concerned", "concrete", "confused", "conscious", "considerate", "constant", "content", "conventional", "cooked", "cool", "cooperative", "coordinated", "corny", "corrupt", "costly", "courageous", "courteous", "crafty", "crazy", "creamy", "creative", "creepy", "criminal", "crisp", "critical", "crooked", "crowded", "cruel", "crushing", "cuddly", "cultivated", "cultured", "cumbersome", "curly", "curvy", "cute", "cylindrical", "damaged", "damp", "dangerous", "dapper", "daring", "darling", "dark", "dazzling", "dead", "deadly", "deafening", "dear", "dearest", "decent", "decimal", "decisive", "deep", "defenseless", "defensive", "defiant", "deficient", "definite", "definitive", "delayed", "delectable", "delicious", "delightful", "delirious", "demanding", "dense", "dental", "dependable", "dependent", "descriptive", "deserted", "detailed", "determined", "devoted", "different", "difficult", "digital", "diligent", "dim", "dimpled", "dimwitted", "direct", "disastrous", "discrete", "disfigured", "disgusting", "disloyal", "dismal", "distant", "downright", "dreary", "dirty", "disguised", "dishonest", "dismal", "distant", "distinct", "distorted", "dizzy", "dopey", "doting ", "double", "downright", "drab", "drafty", "dramatic", "dreary", "droopy", "dry", "dual", "dull", "dutiful", "each", "eager", "earnest", "early", "easy", "easy-going", "ecstatic", "edible", "educated", "elaborate", "elastic", "elated", "elderly", "electric", "elegant", "elementary", "elliptical", "embarrassed", "embellished", "eminent", "emotional", "empty", "enchanted", "enchanting", "energetic", "enlightened", "enormous", "enraged", "entire", "envious", "equal", "equatorial", "essential", "esteemed", "ethical", "euphoric", "even", "evergreen", "everlasting", "every", "evil", "exalted", "excellent", "exemplary", "exhausted", "excitable", "excited", "exciting", "exotic", "expensive", "experienced", "expert", "extraneous", "extroverted", "extra-large", "extra-small", "fabulous", "failing", "faint", "fair", "faithful", "fake", "false", "familiar", "famous", "fancy", "fantastic", "far", "faraway", "far-flung", "far-off", "fast", "fat", "fatal", "fatherly", "favorable", "favorite", "fearful", "fearless", "feisty", "feline", "female", "feminine", "few", "fickle", "filthy", "fine", "finished", "firm", "first", "firsthand", "fitting", "fixed", "flaky", "flamboyant", "flashy", "flat", "flawed", "flawless", "flickering", "flimsy", "flippant", "flowery", "fluffy", "fluid", "flustered", "focused", "fond", "foolhardy", "foolish", "forceful", "forked", "formal", "forsaken", "forthright", "fortunate", "fragrant", "frail", "frank", "frayed", "free", "French", "fresh", "frequent", "friendly", "frightened", "frightening", "frigid", "frilly", "frizzy", "frivolous", "front", "frosty", "frozen", "frugal", "fruitful", "full", "fumbling", "functional", "funny", "fussy", "fuzzy", "gargantuan", "gaseous", "general", "generous", "gentle", "genuine", "giant", "giddy", "gigantic", "gifted", "giving", "glamorous", "glaring", "glass", "gleaming", "gleeful", "glistening", "glittering", "gloomy", "glorious", "glossy", "glum", "golden", "good", "good-natured", "gorgeous", "graceful", "gracious", "grand", "grandiose", "granular", "grateful", "grave", "gray", "great", "greedy", "green", "gregarious", "grim", "grimy", "gripping", "grizzled", "gross", "grotesque", "grouchy", "grounded", "growing", "growling", "grown", "grubby", "gruesome", "grumpy", "guilty", "gullible", "gummy", "hairy", "half", "handmade", "handsome", "handy", "happy", "happy-go-lucky", "hard", "hard-to-find", "harmful", "harmless", "harmonious", "harsh", "hasty", "hateful", "haunting", "healthy", "heartfelt", "hearty", "heavenly", "heavy", "hefty", "helpful", "helpless", "hidden", "hideous", "high", "high-level", "hilarious", "hoarse", "hollow", "homely", "honest", "honorable", "honored", "hopeful", "horrible", "hospitable", "hot", "huge", "humble", "humiliating", "humming", "humongous", "hungry", "hurtful", "husky", "icky", "icy", "ideal", "idealistic", "identical", "idle", "idiotic", "idolized", "ignorant", "ill", "illegal", "ill-fated", "ill-informed", "illiterate", "illustrious", "imaginary", "imaginative", "immaculate", "immaterial", "immediate", "immense", "impassioned", "impeccable", "impartial", "imperfect", "imperturbable", "impish", "impolite", "important", "impossible", "impractical", "impressionable", "impressive", "improbable", "impure", "inborn", "incomparable", "incompatible", "incomplete", "inconsequential", "incredible", "indelible", "inexperienced", "indolent", "infamous", "infantile", "infatuated", "inferior", "infinite", "informal", "innocent", "insecure", "insidious", "insignificant", "insistent", "instructive", "insubstantial", "intelligent", "intent", "intentional", "interesting", "internal", "international", "intrepid", "ironclad", "irresponsible", "irritating", "itchy", "jaded", "jagged", "jam-packed", "jaunty", "jealous", "jittery", "joint", "jolly", "jovial", "joyful", "joyous", "jubilant", "judicious", "juicy", "jumbo", "junior", "jumpy", "juvenile", "kaleidoscopic", "keen", "key", "kind", "kindhearted", "kindly", "klutzy", "knobby", "knotty", "knowledgeable", "knowing", "known", "kooky", "kosher", "lame", "lanky", "large", "last", "lasting", "late", "lavish", "lawful", "lazy", "leading", "lean", "leafy", "left", "legal", "legitimate", "light", "lighthearted", "likable", "likely", "limited", "limp", "limping", "linear", "lined", "liquid", "little", "live", "lively", "livid", "loathsome", "lone", "lonely", "long", "long-term", "loose", "lopsided", "lost", "loud", "lovable", "lovely", "loving", "low", "loyal", "lucky", "lumbering", "luminous", "lumpy", "lustrous", "luxurious", "mad", "made-up", "magnificent", "majestic", "major", "male", "mammoth", "married", "marvelous", "masculine", "massive", "mature", "meager", "mealy", "mean", "measly", "meaty", "medical", "mediocre", "medium", "meek", "mellow", "melodic", "memorable", "menacing", "merry", "messy", "metallic", "mild", "milky", "mindless", "miniature", "minor", "minty", "miserable", "miserly", "misguided", "misty", "mixed", "modern", "modest", "moist", "monstrous", "monthly", "monumental", "moral", "mortified", "motherly", "motionless", "mountainous", "muddy", "muffled", "multicolored", "mundane", "murky", "mushy", "musty", "muted", "mysterious", "naive", "narrow", "nasty", "natural", "naughty", "nautical", "near", "neat", "necessary", "needy", "negative", "neglected", "negligible", "neighboring", "nervous", "new", "next", "nice", "nifty", "nimble", "nippy", "nocturnal", "noisy", "nonstop", "normal", "notable", "noted", "noteworthy", "novel", "noxious", "numb", "nutritious", "nutty", "obedient", "obese", "oblong", "oily", "oblong", "obvious", "occasional", "odd", "oddball", "offbeat", "offensive", "official", "old", "old-fashioned", "only", "open", "optimal", "optimistic", "opulent", "orange", "orderly", "organic", "ornate", "ornery", "ordinary", "original", "other", "our", "outlying", "outgoing", "outlandish", "outrageous", "outstanding", "oval", "overcooked", "overdue", "overjoyed", "overlooked", "palatable", "pale", "paltry", "parallel", "parched", "partial", "passionate", "past", "pastel", "peaceful", "peppery", "perfect", "perfumed", "periodic", "perky", "personal", "pertinent", "pesky", "pessimistic", "petty", "phony", "physical", "piercing", "pink", "pitiful", "plain", "plaintive", "plastic", "playful", "pleasant", "pleased", "pleasing", "plump", "plush", "polished", "polite", "political", "pointed", "pointless", "poised", "poor", "popular", "portly", "posh", "positive", "possible", "potable", "powerful", "powerless", "practical", "precious", "present", "prestigious", "pretty", "precious", "previous", "pricey", "prickly", "primary", "prime", "pristine", "private", "prize", "probable", "productive", "profitable", "profuse", "proper", "proud", "prudent", "punctual", "pungent", "puny", "pure", "purple", "pushy", "putrid", "puzzled", "puzzling", "quaint", "qualified", "quarrelsome", "quarterly", "queasy", "querulous", "questionable", "quick", "quick-witted", "quiet", "quintessential", "quirky", "quixotic", "quizzical", "radiant", "ragged", "rapid", "rare", "rash", "raw", "recent", "reckless", "rectangular", "ready", "real", "realistic", "reasonable", "red", "reflecting", "regal", "regular", "reliable", "relieved", "remarkable", "remorseful", "remote", "repentant", "required", "respectful", "responsible", "repulsive", "revolving", "rewarding", "rich", "rigid", "right", "ringed", "ripe", "roasted", "robust", "rosy", "rotating", "rotten", "rough", "round", "rowdy", "royal", "rubbery", "rundown", "ruddy", "rude", "runny", "rural", "rusty", "sad", "safe", "salty", "same", "sandy", "sane", "sarcastic", "sardonic", "satisfied", "scaly", "scarce", "scared", "scary", "scented", "scholarly", "scientific", "scornful", "scratchy", "scrawny", "second", "secondary", "second-hand", "secret", "self-assured", "self-reliant", "selfish", "sentimental", "separate", "serene", "serious", "serpentine", "several", "severe", "shabby", "shadowy", "shady", "shallow", "shameful", "shameless", "sharp", "shimmering", "shiny", "shocked", "shocking", "shoddy", "short", "short-term", "showy", "shrill", "shy", "sick", "silent", "silky", "silly", "silver", "similar", "simple", "simplistic", "sinful", "single", "sizzling", "skeletal", "skinny", "sleepy", "slight", "slim", "slimy", "slippery", "slow", "slushy", "small", "smart", "smoggy", "smooth", "smug", "snappy", "snarling", "sneaky", "sniveling", "snoopy", "sociable", "soft", "soggy", "solid", "somber", "some", "spherical", "sophisticated", "sore", "sorrowful", "soulful", "soupy", "sour", "Spanish", "sparkling", "sparse", "specific", "spectacular", "speedy", "spicy", "spiffy", "spirited", "spiteful", "splendid", "spotless", "spotted", "spry", "square", "squeaky", "squiggly", "stable", "staid", "stained", "stale", "standard", "starchy", "stark", "starry", "steep", "sticky", "stiff", "stimulating", "stingy", "stormy", "straight", "strange", "steel", "strict", "strident", "striking", "striped", "strong", "studious", "stunning", "stupendous", "stupid", "sturdy", "stylish", "subdued", "submissive", "substantial", "subtle", "suburban", "sudden", "sugary", "sunny", "super", "superb", "superficial", "superior", "supportive", "sure-footed", "surprised", "suspicious", "svelte", "sweaty", "sweet", "sweltering", "swift", "sympathetic", "tall", "talkative", "tame", "tan", "tangible", "tart", "tasty", "tattered", "taut", "tedious", "teeming", "tempting", "tender", "tense", "tepid", "terrible", "terrific", "testy", "thankful", "that", "these", "thick", "thin", "third", "thirsty", "this", "thorough", "thorny", "those", "thoughtful", "threadbare", "thrifty", "thunderous", "tidy", "tight", "timely", "tinted", "tiny", "tired", "torn", "total", "tough", "traumatic", "treasured", "tremendous", "tragic", "trained", "tremendous", "triangular", "tricky", "trifling", "trim", "trivial", "troubled", "true", "trusting", "trustworthy", "trusty", "truthful", "tubby", "turbulent", "twin", "ugly", "ultimate", "unacceptable", "unaware", "uncomfortable", "uncommon", "unconscious", "understated", "unequaled", "uneven", "unfinished", "unfit", "unfolded", "unfortunate", "unhappy", "unhealthy", "uniform", "unimportant", "unique", "united", "unkempt", "unknown", "unlawful", "unlined", "unlucky", "unnatural", "unpleasant", "unrealistic", "unripe", "unruly", "unselfish", "unsightly", "unsteady", "unsung", "untidy", "untimely", "untried", "untrue", "unused", "unusual", "unwelcome", "unwieldy", "unwilling", "unwitting", "unwritten", "upbeat", "upright", "upset", "urban", "usable", "used", "useful", "useless", "utilized", "utter", "vacant", "vague", "vain", "valid", "valuable", "vapid", "variable", "vast", "velvety", "venerated", "vengeful", "verifiable", "vibrant", "vicious", "victorious", "vigilant", "vigorous", "villainous", "violet", "violent", "virtual", "virtuous", "visible", "vital", "vivacious", "vivid", "voluminous", "wan", "warlike", "warm", "warmhearted", "warped", "wary", "wasteful", "watchful", "waterlogged", "watery", "wavy", "wealthy", "weak", "weary", "webbed", "wee", "weekly", "weepy", "weighty", "weird", "welcome", "well-documented", "well-groomed", "well-informed", "well-lit", "well-made", "well-off", "well-to-do", "well-worn", "wet", "which", "whimsical", "whirlwind", "whispered", "white", "whole", "whopping", "wicked", "wide", "wide-eyed", "wiggly", "wild", "willing", "wilted", "winding", "windy", "winged", "wiry", "wise", "witty", "wobbly", "woeful", "wonderful", "wooden", "woozy", "wordy", "worldly", "worn", "worried", "worrisome", "worse", "worst", "worthless", "worthwhile", "worthy", "wrathful", "wretched", "writhing", "wrong", "wry", "yawning", "yearly", "yellow", "yellowish", "young", "youthful", "yummy", "zany", "zealous", "zesty", "zigzag"];
            Adlib.verb = ['sex', "fuck", "suck", "lick", "punch", "kick", "flick", "suckle", "lunge", "hump", "dump", "drop", "slap", "hit", "strike", "slice", "twist", "topple", "taint", "tongue", "touch", "stroke", "wank", "thrust", "drink", "dust", "drag", "tug", "roll", "slide", "slip", "nose", "beep", "bust", "break", "bone", "bloat", "swipe", "join", "jail", "juice", "mate", "mourn", "moo", "yip", "yap", "bark", "hwayp", "hook", "clock", "gag", "gloss", "paint", "douse", "drip"];
            Adlib.verbs = ['sexes', "fucks", "sucks", "licks", "punches", "kicks", "flicks", "suckles", "lunges", "humps", "dumps", "drops", "slaps", "hits", "strikes", "slices", "twists", "topples", "taints", "tongues", "touches", "strokes", "wanks", "thrusts", "drinks", "dusts", "drags", "tugs", "rolls", "slides", "slips", "noses", "beeps", "busts", "breaks", "bones", "bloats", "swipes", "joins", "jails", "juices", "mates", "mourns", "moos", "yips", "yaps", "barks", "hwayps", "hooks", "clocks", "gags", "glosses", "paints", "douses", "drips"];
            Adlib.verbing = ['sexing', "fucking", "sucking", "licking", "punching", "kicking", "flicking", "suckling", "lunging", "humping", "dumping", "dropping", "slapping", "hitting", "striking", "slicing", "twisting", "toppling", "tainting", "tonguing", "touching", "stroking", "wanking", "thrusting", "drinking", "dusting", "dragging", "tugging", "rolling", "sliding", "slipping", "nosing", "beeping", "busting", "breaking", "boning", "bloating", "swiping", "joining", "jailing", "juicing", "mating", "mourning", "mooing", "yipping", "yapping", "barking", "hwayping", "hooking", "clocking", "gagging", "glossing", "painting", "dousing", "dripping"];
            Adlib.verbed = ['sexed', "fucked", "sucked", "licked", "punched", "kicked", "flicked", "suckled", "lunged", "humped", "dumped", "dropped", "slapped", "hit", "striked", "sliced", "twisted", "toppled", "tainted", "tongued", "touched", "stroked", "wanked", "thrusted", "drank", "dusted", "dragged", "tugged", "rolled", "slided", "slipped", "nosed", "beeped", "busted", "broke", "boned", "bloated", "swiped", "joined", "jailed", "juiced", "mated", "mourned", "mooed", "yipped", "yapped", "barked", "hwayped", "hooked", "clocked", "gagged", "glossed", "painted", "doused", "dripped"];
            Adlib.noun = ['bucket', 'car', 'cat', 'dog', 'scissor', 'pencil', 'pen', 'journal', 'house', 'hose', 'lawnmower', 'front yard', 'box', 'rabbit', 'hyena', 'pet', 'fox', 'Nintendo', 'xbox', 'table', 'dreidel', 'nazi', 'moon', 'face', 'nose', 'tit', 'homework', 'tumor', 'taco', 'hamburger', 'hotdog', 'foot-long', 'school', 'prison', 'jail', 'boner', 'dildo', 'sex toy', 'clock', 'work', 'paper', 'sketch'];
            Adlib.nouns = ['buckets', 'cars', 'cats', 'dogs', 'scissors', 'pencils', 'pens', 'journals', 'houses', 'hoses', 'lawnmowers', 'front yards', 'boxes', 'rabbits', 'hyenas', 'pets', 'foxes', 'Nintendos', 'xboxs', 'tables', 'dreidels', 'nazis', 'moons', 'faces', 'noses', 'tits', 'homeworks', 'tumors', 'tacos', 'hamburgers', 'hotdogs', 'foot-longs', 'schools', 'prisons', 'jails', 'boners', 'dildos', 'sex toys', 'clocks', 'works', 'papers', 'sketches'];
            Adlib.bodyfluid = ['semen', 'piss', 'pee', 'urine', 'baby-batter', 'spunk', 'spooge', 'blood'];
            Adlib.bodypart = ['dick', 'cock', 'pussy', 'ass', 'pocket rocket', 'red rocket', 'tit', 'nipple', 'asshole', 'butt', 'anus', 'taco', 'penis', 'prick'];
            Adlib.bodyfluids = ['barrels of blood', 'ropes of cum', 'pints of semen', 'cups of piss', 'gallons of pee', 'liters of urine', 'pints of baby-batter', 'gallons of spunk', 'liters of spooge'];
            Adlib.bodyparts = ['balls', 'testicles', 'gonads', 'dicks', 'cocks', 'pussies', 'asses', 'pocket rockets', 'red rockets', 'tits', 'nipples', 'assholes', 'butts', 'anuses', 'tacos', 'penises', 'pricks'];
            Adlib.nouner = [];
            Adlib.people = [];
            Adlib.interjection = [];
        })(Adlib = Dictionary.Adlib || (Dictionary.Adlib = {}));
        var Nicknames;
        (function (Nicknames) {
            Nicknames.nickSuffix = ['Dick', 'Student', 'Nut', 'Nuts', 'Horns', 'Horn', 'Fur', 'Butt', 'Fish', 'Ass', 'Fornicator', 'Moon', 'Sun', 'Terminator', 'Moose', 'Fluffy one', 'Island', 'Unstoppable Force', 'Monkey', 'Monster', 'Lover', 'Fucker', 'Fox', 'Faffer', 'Fapper', 'One', 'Pain', 'Dickbutt', 'Dickhead', 'Doll', 'Dildo', 'Donger', 'Dong', 'Goof', 'Doofus', 'Robot', 'Romper', 'Stomper', 'Agitator', 'Aggressor', 'Apostle', 'Disciple', 'Adept', 'Warlock', 'Wizard', 'Sorceror', 'Saucer', 'Cook', 'Stiff', 'Joe', 'Jane', 'Jug', 'Mug', 'Crook', 'Monster', 'Meat', 'Motherfucker', 'Wanker', 'Rulebreaker', 'Convict', 'Gangster', 'Pothead', 'Poker', 'Prince', 'Princess', 'Banger', 'Bus', 'Blasphemer', 'Heretic', 'Hose', 'Truck', 'Beast', 'Boner', 'Bastard', 'Bimbo', 'Bank', 'Child', 'Guy', 'Girl', 'Man', 'Woman', 'Killer', 'Murderer', 'Knob-polisher', 'Punisher', 'Breaker', 'Badass', 'Meeper', 'Pie', 'Cutie', 'Cutter', 'Drifter', 'Hoser', 'Poser', 'Semen-extractor', 'House', 'Dart', 'Flash', 'Incredible', 'Lonesome', 'Doctor', 'Witch', 'Cock-holster', 'Cancer', 'Tumor', 'Growth', 'Waste', 'Mourner', 'Misfit', 'Mangle', 'Peeper', 'Loner', 'Drifter', 'Dancer', 'Nurse', 'Professor', 'Trooper', 'Tube', 'Rocket', 'Sock', 'Balls', 'Butter', 'Butler', 'Broker', 'Stalker', 'Humper', 'Mange', 'Fist', 'Controller', 'Noise', 'Fart', 'Meme', 'Touch', 'Mistake', 'Condom', 'Foreskin', 'Cunt'];
            Nicknames.nickPrefix = ['the Gay', 'Gay ', 'the ', 'the Major ', 'Major ', 'Sir ', 'the Lazy-', 'the Silly ', 'the Lovely ', 'the Lovable ', 'the Hardcore ', 'the Artistic ', 'the Virtuous ', 'the Scarlet ', 'the Mammoth ', 'the Foxish ', 'the Flamboyant ', 'the Broken ', 'the Pristine ', 'the Brutal ', 'the Childish ', 'the Wanton ', 'the Restless ', 'the Ornry ', 'the Lonely ', 'the Ugly ', 'the Pretty ', 'the Foul ', 'the Hard ', 'the Flaccid ', 'the Good ', 'the Bad ', 'the Tiny ', 'the Tight ', 'the Booty ', 'the Sexy ', 'the Surfing ', 'the Rancid ', 'the Great ', 'the Gross ', 'the Grotesque ', 'the Gored ', 'the Noodly ', 'the Naked ', 'the Nasty ', 'the Noob ', 'the Bulbous ', 'the Batter ', 'the Womanly ', 'Miss ', 'Officer ', 'Doctor ', 'Patient ', 'President ', 'Prime Minister ', 'King ', 'Queen ', 'the Bloated ', 'the Hard ', 'the Rough ', 'the Tough ', 'the Brutish ', 'the Boner ', 'Prince ', 'Princess ', 'Moon ', 'the Carcinogenic ', 'the Moon', 'the Dark ', 'the Dank ', 'Dank ', 'the Prime ', 'Prime ', 'the Swag ', 'the Lover of ', 'the Gangly ', 'the Dumb ', 'the Nutty ', 'Nutty ', 'the Super ', 'Super ', 'the Red ', 'the Black ', 'the Pink ', 'the White ', 'the Brown ', 'the Blue ', 'Power-', 'the Timely ', 'the Narcissistic ', 'the Wet ', 'the Dirty ', 'the Dutiful ', 'the Fishy '];
        })(Nicknames = Dictionary.Nicknames || (Dictionary.Nicknames = {}));
        var Icebreak;
        (function (Icebreak) {
            Icebreak.naughtyAction = ['kiss', 'fuck', 'suck', 'fellate', 'blow', 'rape', 'bone', 'wank', 'jerk', 'molest', 'eat'];
            Icebreak.naughtyActioned = ['kissed', 'fucked', 'sucked', 'fellated', 'raped', 'boned', 'wanked', 'jerked', 'molested', 'ate'];
            Icebreak.naughtyActioning = ['kissing', 'fucking', 'sucking', 'fellating', 'blowing', 'raping', 'boning', 'wanking', 'jerking', 'molesting', 'eating'];
            Icebreak.naughtyThing = ['dick', 'cock', 'pussy', 'ass', 'pocket rocket', 'red rocket', 'tit', 'nipple', 'asshole', 'butt', 'anus', 'vagoo', 'taco', 'penis', 'prick'];
            Icebreak.naughtyThings = ['dicks', 'cocks', 'pussies', 'asses', 'pocket rockets', 'red rockets', 'tits', 'nipples', 'assholes', 'butts', 'anuses', 'vagoos', 'tacos', 'penises', 'pricks'];
            Icebreak.naughty = ['dick', 'cock', 'pussy', 'ass', 'cum', 'semen', 'pocket rocket', 'red rocket', 'tit', 'nipple', 'asshole', 'butt', 'anus', 'piss', 'pee', 'urine', 'baby-batter', 'spunk', 'spooge', 'taco', 'penis', 'prick', 'porn'];
            Icebreak.naughties = ['balls', 'testicles', 'gonads', 'dicks', 'cocks', 'pussies', 'asses', 'ropes of cum', 'pints of semen', 'pocket rockets', 'red rockets', 'tits', 'nipples', 'assholes', 'butts', 'anuses', 'cups of piss', 'gallons of pee', 'liters of urine', 'pints of baby-batter', 'gallons of spunk', 'liters of spooge', 'tacos', 'penises', 'pricks'];
            Icebreak.innocent = ['egg', 'toast', 'cereal', 'bacon', 'breakfast', 'dinner', 'lunch', 'supper', 'brunch', 'dog', 'cat', 'fox', 'deer', 'doctor', 'hotdog', 'mustard', 'ketchup', 'mayo', 'butter', 'pasta', 'sauce', 'wine', 'beer', 'vodka', 'water', 'company', 'pet', 'mouse', 'rodent', 'trap', 'work', 'employment', 'boss', 'break', 'chocolate', 'fondue'];
            Icebreak.innocents = ['eggs', 'toast', 'cereals', 'bacon', 'breakfasts', 'dinners', 'lunches', 'suppers', 'brunches', 'dogs', 'cats', 'foxs', 'deers', 'doctors', 'hotdogs', 'mustards', 'ketchups', 'mayos', 'butters', 'pastas', 'sauces', 'wines', 'beers', 'vodkas', 'companies', 'pets', 'mice', 'rodents', 'traps', 'bosses', 'breaks', 'chocolates', 'fondues'];
        })(Icebreak = Dictionary.Icebreak || (Dictionary.Icebreak = {}));
        var Dice;
        (function (Dice) {
            Dice.dieOne = ['Any', 'Fuck', 'Tongue', 'Lick', 'Fondle', 'Tweek', 'Pinch', 'Finger', 'Slap', 'Bite', 'Nibble', 'Caress', 'Stroke', 'Squeeze', 'Tug'];
            Dice.dieTwo = ['Any', 'Dick', 'Balls', 'Tits', 'Nipples', 'Hair', 'Neck', 'Mouth/Muzzle', 'Taint/Labia', 'Tailbase', 'Butt', 'Vagoo', 'Thighs'];
        })(Dice = Dictionary.Dice || (Dictionary.Dice = {}));
    })(Dictionary = KBot.Dictionary || (KBot.Dictionary = {}));
})(KBot || (KBot = {}));
/**
 * KBot -- Interfaces
 * @author Kali@F-List.net
 */
/**
 * KBot -- Classes
 * @author Kali@F-List.net
 */
/// <reference path="bot.d.ts" />
var HttpRequest = (function () {
    function HttpRequest(url, options) {
        var httpRequest = new XMLHttpRequest();
        var uri = '';
        var key;
        this.atOut = new Date();
        httpRequest.onreadystatechange = (function (self) {
            return function onReadyStateChange(event) {
                self.status = this.status;
                self.state = this.readyState;
                self.response = this.response;
                self.responseText = this.responseText || '';
                self.statusText = this.statusText || '';
                if (self.state === 4) {
                    self.atIn = new Date();
                    self.response = JSON.parse(self.responseText);
                    if (self.status === 200 && !self.response.error) {
                        return self.success({
                            response: self.response,
                            request: self
                        });
                    }
                    if (self.status !== 200) {
                        return self.fail({
                            httpError: true,
                            error: self.statusText,
                            code: self.status,
                            request: self
                        });
                    }
                    return self.fail({
                        serverError: true,
                        error: self.response.error,
                        request: self
                    });
                }
                return;
            };
        })(this);
        if (options && options.data) {
            httpRequest.open('POST', url, true);
            httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            for (key in options.data) {
                if (options.data.hasOwnProperty(key)) {
                    uri += key + '=' + options.data[key] + '&';
                }
            }
            uri = uri.slice(0, uri.length - 1);
        }
        else {
            httpRequest.open('GET', url);
        }
        httpRequest.send(uri);
        this.status = httpRequest.status;
        this.statusText = httpRequest.statusText;
        this.state = httpRequest.readyState;
        this.responseText = httpRequest.responseText;
        this.response = httpRequest.response;
        this.fail = options && options.fail ?
            options.fail : function () { };
        this.success = options && options.success ?
            options.success : function () { };
    }
    return HttpRequest;
})();
/**
 * KBot -- Hook: Interfaces
 * @author Kali@F-List.net
 */
/**
 * KBot -- Hook: Module
 * @author Kali@F-List.net
 */
/// <reference path="../bot.d.ts" />
/// <reference path="interfaces.ts" />
var Local = FList.Chat;
FList.Chat.commands.MSG = function MSG(args) {
    var character = args.character;
    var message = args.message;
    var type = "chat";
    if (Local.ignoreList.indexOf(character.toLowerCase()) !== -1) {
        return;
    }
    if (args.channel.toLowerCase() === 'frontpage') {
        message = message
            .replace(/\[icon\]/g, '[user]')
            .replace(/\[\/icon\]/g, '[/user]');
    }
    if (Local.Roleplay.isRoleplay(message)) {
        message = message.substr(3);
        type = 'rp';
    }
    KBot.read({
        message: message,
        channel: Local.TabBar.getTabFromId('channel', args.channel),
        name: character,
        type: type
    });
    Local.printMessage({
        msg: message,
        to: Local.TabBar.getTabFromId('channel', args.channel),
        from: character,
        type: type
    });
    return;
};
FList.Chat.commands.PRI = function PRI(args) {
    var character = args.character;
    var characterSafe = character.toLowerCase();
    var isIgnored = Local.ignoreList.indexOf(characterSafe) !== -1;
    var message = args.message;
    var type = 'chat';
    var tabObject = Local.TabBar.getTabFromId('user', character);
    if (isIgnored) {
        FList.Connection.send('IGN' + JSON.stringify({
            action: 'notify',
            character: character
        }));
        return;
    }
    if (Local.Roleplay.isRoleplay(message)) {
        message = message.substr(3);
        type = 'rp';
    }
    if (!tabObject) {
        Local.openPrivateChat(characterSafe);
        tabObject = Local.TabBar.getTabFromId('user', character);
    }
    tabObject.tab
        .children('.tpn')
        .removeClass('tpn-paused')
        .hide();
    if (tabObject.closed) {
        tabObject.tab.show();
        tabObject.closed = false;
    }
    Local.Logs.saveLogs(character, {
        msg: message,
        kind: type,
        to: characterSafe
    });
    Local.printMessage({
        msg: message,
        to: tabObject,
        from: character,
        type: type
    });
    KBot.read({
        message: message,
        channel: tabObject,
        name: character,
        type: type
    });
};
FList.Chat.Input = {
    handle: function handle(message) {
        var curTab = Local.TabBar.activeTab;
        var cData = Local.channels.getData(curTab.id);
        var isCommand = message.charAt(0) === '/';
        var isRp = !message.indexOf('/me');
        var isWarn = !message.indexOf('/warn ');
        var type = isRp ? 'rp' : 'chat';
        if (curTab.type === 'console') {
            if (isCommand && !isRp && !isWarn) {
                return this.parse(message);
            }
            return FList.Common_displayError('You cannot chat in the console');
        }
        if (curTab.type === 'channel') {
            if (isCommand && !isRp && !isWarn) {
                return this.parse(message);
            }
            if (cData.mode === 'ads') {
                Local.Roleplay.sendAd(curTab.id, message);
            }
            if (message.trim()) {
                if (Local.Settings.current.html5Audio) {
                    Local.Sound.playSound('chat');
                }
                FList.Connection.send("MSG " + JSON.stringify({
                    channel: curTab.id,
                    message: message
                }));
                if (isRp) {
                    message = message.substr(3);
                }
                KBot.read({
                    message: message,
                    channel: curTab,
                    name: Local.identity,
                    type: type
                });
                message = KBot._sanitizeOwnMessage(message);
                Local.printMessage({
                    msg: message,
                    to: Local.TabBar.getTabFromId('channel', curTab.id),
                    from: Local.identity,
                    type: type
                });
                $('#message-field').val('');
                return;
            }
        }
        if (isCommand && !isRp && !isWarn) {
            return this.parse(message);
        }
        if (cData.mode === 'ads') {
            Local.Roleplay.sendAd(curTab.id, message);
        }
        if (message.trim()) {
            if (Local.Settings.current.html5Audio) {
                Local.Sound.playSound('chat');
            }
            FList.Connection.send("PRI " + JSON.stringify({
                recipient: curTab.id,
                message: message
            }));
            if (isRp) {
                message = message.substr(3);
            }
            KBot.read({
                message: message,
                channel: curTab,
                name: Local.identity,
                type: type
            });
            message = KBot._sanitizeOwnMessage(message);
            Local.Logs.saveLogs(Local.identity, {
                msg: message,
                kind: type,
                to: curTab.id.toLowerCase()
            });
            Local.printMessage({
                msg: message,
                to: Local.TabBar.getTabFromId('user', curTab.id),
                from: Local.identity,
                type: type
            });
            $('#message-field').val('');
            return;
        }
        curTab.metyping = false;
        curTab.mewaiting = false;
        $('#message-field').val('');
        return;
    }
};
/**
 * KBot -- Handler: Interfaces
 * @author Kali@F-List.net
 */
/**
 * KBot -- Handler: Module
 * @author Kali@F-List.net
 */
/// <reference path="../bot.d.ts" />
/// <reference path="interfaces.ts" />
void function () {
    if (KBot && KBot.tick) {
        clearInterval(KBot.tick);
        KBot.responseQueue.length = 0;
    }
    return;
}();
var KBot;
(function (KBot) {
    KBot.responseQueue = [];
    KBot.tick = setInterval(onTick, 750);
    function onTick() {
        if (KBot.responseQueue.length) {
            KBot.responseQueue.shift()();
            return;
        }
        return;
    }
    function parseArguments(data) {
        for (var i = 0, ii = data.command.arguments.length; i < ii; i++) {
            var parameter = data.parameters[i];
            if (parameter === null && !data.command.arguments[i].required) {
                continue;
            }
            if (!parameter && data.command.arguments[i].required) {
                _respond(data.channel, "Missing mandatory argument #" + (i + 1) + ".");
                return null;
            }
            if (data.command.arguments[i].type === Number) {
                parameter = parseFloat(parameter);
                if (!parameter) {
                    _respond(data.channel, "Argument [b]" + (i + 1) + "[/b] is not a valid number.");
                    return null;
                }
            }
            if (parameter.constructor !== data.command.arguments[i].type) {
                _respond(data.channel, "Argument [b]" + (i + 1) + "[/b] is not of type [b]" + _typeToString(data.command.arguments[i].type) + "[/b].");
                return null;
            }
            if (data.command.arguments[i].type === Number) {
                data.parameters[i] = parseFloat(parameter);
            }
        }
        return data.parameters;
    }
    function respondUser() {
        FList.Chat.printMessage({
            msg: _sanitizeOwnMessage(this.message),
            to: this.channel,
            from: FList.Chat.identity,
            type: 'chat',
            log: true
        });
        FList.Connection.send("PRI " + JSON.stringify({
            message: this.message,
            recipient: this.channel.id
        }));
        return;
    }
    function respondChannel() {
        FList.Chat.printMessage({
            msg: _sanitizeOwnMessage(this.message),
            to: this.channel,
            from: FList.Chat.identity,
            type: 'chat',
            log: true
        });
        FList.Connection.send("MSG " + JSON.stringify({
            message: this.message,
            channel: this.channel.id
        }));
        return;
    }
    function _typeToString(type) {
        return type
            .toSource()
            .slice(9, type
            .toSource()
            .indexOf('('))
            .toLowerCase();
    }
    KBot._typeToString = _typeToString;
    function _sanitizeOwnMessage(message) {
        return message.replace(/\</g, '&lt;')
            .replace(/\>/g, '&gt;');
    }
    KBot._sanitizeOwnMessage = _sanitizeOwnMessage;
    function _respond(tab, message, override) {
        var responseFunction;
        var overrideFunction;
        message = '[b]KBot[/b]>> ' + message;
        if (tab.type === 'user') {
            responseFunction = respondUser;
            overrideFunction = respondChannel;
        }
        else {
            responseFunction = respondChannel;
            overrideFunction = respondUser;
        }
        if (override) {
            responseFunction = overrideFunction;
            message += ' [SENT TO PRIVATE]';
        }
        KBot.responseQueue.push(responseFunction.bind({
            channel: tab,
            message: message
        }));
        return;
    }
    KBot._respond = _respond;
    function _getDisplayName(name) {
        var key = KBot.Commands.nickname.nicknamesKey.indexOf(name);
        if (key === -1) {
            return name;
        }
        return KBot.Commands.nickname.nicknames[key];
    }
    KBot._getDisplayName = _getDisplayName;
    function read(data) {
        var end = data.message.indexOf(' ') !== -1 ?
            data.message.indexOf(' ') : data.message.length;
        var command;
        var parameters;
        command = KBot.Commands[data.message.slice(1, end)];
        if (data.message.charAt(0) !== '!' || !command) {
            return;
        }
        if (data.message.indexOf(' ') === -1) {
            parameters = [null];
        }
        else {
            parameters = data.message
                .substr(data.message.indexOf(' ') + 1)
                .replace(/[ ]+/g, ' ')
                .split(' ');
        }
        if (command.arguments) {
            parameters = parseArguments({
                command: command,
                channel: data.channel,
                parameters: parameters
            });
        }
        if (!parameters) {
            return;
        }
        try {
            command.func.call({
                channel: data.channel,
                user: data.name
            }, parameters);
        }
        catch (error) {
            _respond(data.channel, "Whoops! Something bad happened: [b]" + error.message + "[/b]: [i]" + error.stack + "[/i]");
        }
    }
    KBot.read = read;
})(KBot || (KBot = {}));
/**
 * KBot -- Commands: Interfaces
 * @author Kali@F-List.net
 */
/// <reference path="../bot.d.ts" />
/**
 * KBot -- Commands: Module
 * @author Kali@F-List.net
 */
/// <reference path="../bot.d.ts" />
/// <reference path="interfaces.ts" />
var KBot;
(function (KBot) {
    var Commands;
    (function (Commands) {
        Commands.whitelist = [
            'Kali',
            'Kira',
            'Nickie Lavender'
        ];
        Commands.help = {
            arguments: [
                {
                    name: 'command',
                    type: String,
                    required: false
                }
            ],
            help: 'Gives you either a command listing or a command\'s' +
                ' description and syntax.',
            func: function (arguments) {
                var command = arguments[0];
                var output = '';
                var params;
                var param;
                var paramType;
                if (!command) {
                    output += "Commands: [" + KBot.CommandKeys.join(', ') + "]";
                    KBot._respond(this.channel, output);
                    return;
                }
                params = Commands[command].arguments;
                if (!Commands[command]) {
                    KBot._respond(this.channel, 'This command does not exist.');
                    return;
                }
                output += "[b]Syntax[/b]: !" + command + " ";
                if (params) {
                    for (var i = 0, ii = params.length; i < ii; i++) {
                        param = params[i];
                        paramType = KBot._typeToString(param.type);
                        output += " " + param.name + "[" + (paramType + (!param.required ? ':optional' : '')) + "]";
                    }
                }
                output += "\n[b]Description[/b]: [i]" + Commands[command].help + "[/i]";
                KBot._respond(this.channel, output);
            }
        };
        Commands.daysToMinutes = {
            arguments: [
                {
                    name: 'days',
                    type: Number,
                    required: true
                }
            ],
            help: 'Return the sum of minutes for the given number of days.',
            func: function (days) {
                KBot._respond(this.channel, days * 24 * 60 + '');
            }
        };
        Commands.evaljs = {
            arguments: [
                {
                    name: 'expression',
                    type: String,
                    required: true
                }
            ],
            help: 'Evaluates a line of JavaScript.',
            func: function (input) {
                var _input = input.join(' ')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>');
                if (Commands.whitelist.indexOf(this.user) === -1) {
                    KBot._respond(this.channel, 'Must construct additional pylons.');
                    return;
                }
                try {
                    KBot._respond(this.channel, (eval(_input)) + '');
                }
                catch (error) {
                    KBot._respond(this.channel, error);
                }
            }
        };
        Commands.nickname = {
            nicknames: null,
            nicknamesKey: null,
            help: 'Gives you a nickname you will be known as to the bot!',
            func: function (days) {
                var nickPrefix = KBot.Dictionary.Nicknames.nickPrefix;
                var nickSuffix = KBot.Dictionary.Nicknames.nickSuffix;
                var key = Commands.nickname.nicknamesKey.indexOf(this.user);
                var randomKeyOne = ~~(Math.random() * nickPrefix.length);
                var randomKeyTwo = ~~(Math.random() * nickSuffix.length);
                var nick = nickPrefix[randomKeyOne] + nickSuffix[randomKeyTwo];
                KBot._respond(this.channel, KBot._getDisplayName(this.user) + " is now known as: [b]" + nick + "[/b].");
                if (nick.indexOf('the ') === 0) {
                    nick = nick.substr(4);
                }
                if (key !== -1) {
                    Commands.nickname.nicknamesKey.splice(key, 1);
                    Commands.nickname.nicknames.splice(key, 1);
                }
                Commands.nickname.nicknames.push(nick);
                Commands.nickname.nicknamesKey.push(this.user);
                localStorage['nicks'] = JSON.stringify(Commands.nickname.nicknames);
                localStorage['nicksKey'] = JSON.stringify(Commands.nickname.nicknamesKey);
            }
        };
        Commands.porn = {
            help: 'Gives you some random porn from e621. Enjoy.',
            func: function () {
                var max = 736510;
                var out = "[url=https://e621.net/post/show/%s]Enjoy, " + KBot._getDisplayName(this.user) + "[/url]";
                out = out.replace(/\%s/g, '' + ~~(Math.random() * max));
                KBot._respond(this.channel, out);
            }
        };
        Commands.dice = {
            help: 'Rolls some adult dice. The number of faces these things ' +
                'have is crazy.',
            func: function () {
                var dieOne = KBot.Dictionary.Dice.dieOne;
                var dieTwo = KBot.Dictionary.Dice.dieTwo;
                var dieOneResult = ~~(Math.random() * dieOne.length);
                var dieTwoResult = ~~(Math.random() * dieTwo.length);
                var out = ("[b]" + KBot._getDisplayName(this.user) + "[/b] rolls ") +
                    ("[b]" + dieOneResult + "[/b]:([i]" + dieOne[dieOneResult] + "[/i]) and ") +
                    ("[b]" + dieTwoResult + "[/b]:([i]" + dieTwo[dieTwoResult] + "[/i]).");
                KBot._respond(this.channel, out);
            }
        };
        Commands.icebreak = {
            help: 'Gives you a [b][i]good[/i][/b] icebreaker!',
            func: function (days) {
                var templates = [("Hey " + KBot._getDisplayName(this.user) + ", I heard you like some [naughties] with your [innocent]."), 'You\'re not going to believe how many [naughties] the average [innocent] contains.', 'Is it hot in here, or is my [naughty] just completely covered in [naughties]?', 'I can see you\'re not one of those \'[innocent]\' people who are super-concerned about [naughties].', ("Listen " + KBot._getDisplayName(this.user) + " -- my daughter needs [naughties] real bad."), 'Can you see my [naughties] through these jeans? No? How about now?', 'Let\'s talk about [naughties].', 'Your [naughties] are so fucking sexy! They look just like my mom\'s.', ("You know what I like in " + KBot._getDisplayName(this.user) + "? My [naughty]."), 'My friends bet I couldn\'t [naughtyAction] the prettiest girl. Wanna use their money to buy [naughties]?', '[naughties] are my second favourite thing to eat in bed.', 'I don\'t believe in [naughty] at first sight, but I\'m willing to make an exception in your case.', ("Damn " + KBot._getDisplayName(this.user) + " -- your [naughtyThing] is bigger than my future!"), 'Of all your beautiful curves, your [naughtyThing] is my favourite.', ("Damn " + KBot._getDisplayName(this.user) + " -- you're cute! Let me at your [naughties]."), 'I\'m no weatherman, but you can expect a few inches of [naughty] tonight.', ("Well, well, well. If it isn't " + KBot._getDisplayName(this.user) + ", the person who [naughtyActioned] the last [naughty]!"), 'Sit back, relax, and allow me to explain the importance of [naughties].', 'The more you scream, the more it\'s going to [naughtyAction] you.', 'I don\'t really see why we need paint brushes when we have [naughties].', 'What\'s your dream [naughty]?', 'My doctor says I\'m lacking [naughties].', 'I\'m no organ donor but I\'d be happy to give you my [naughty].', 'I\'m not staring at your boobs. I\'m staring at your [naughty].', 'There are people who say Disneyland is the happiest place on Earth. Apparently none of them have ever been in your [naughty].', 'I wanna live in your [naughties] so I can be with you every step of the way.', 'Do you know what my [naughty] is made of? Boyfriend material.', 'Are you a camera? Because every time I look at you, I want to whip out my [naughty].', 'I\'m not a photographer, but I can picture your [naughties] and my [naughty] together.', 'So, I\'m like, \'I\'ll show you who\'s afraid of [naughtyActioning] all the [naughties]\'!', '[naughtyAction] me if I\'m wrong, but [naughties] still exist, right?', 'Excuse me, but does this smell like [naughty] to you?', 'I didn\'t know that [naughties] could fly so low!', ("You know, " + KBot._getDisplayName(this.user) + " says I'm afraid of [naughtyActioning]... want to help prove them wrong?")];
                var naughtyAction = KBot.Dictionary.Icebreak.naughtyAction;
                var naughtyActioned = KBot.Dictionary.Icebreak.naughtyActioned;
                var naughtyActioning = KBot.Dictionary.Icebreak.naughtyActioning;
                var naughtyThing = KBot.Dictionary.Icebreak.naughtyThing;
                var naughtyThings = KBot.Dictionary.Icebreak.naughtyThings;
                var naughty = KBot.Dictionary.Icebreak.naughty;
                var naughties = KBot.Dictionary.Icebreak.naughties;
                var innocent = KBot.Dictionary.Icebreak.innocent;
                var innocents = KBot.Dictionary.Icebreak.innocents;
                var template = templates[~~(Math.random() * templates.length)];
                var output = template;
                var roll;
                function getRandom(template) {
                    var random = ~~(Math.random() * template.length);
                    return template[random];
                }
                while (/\[(naughty|naughties|innocent|innocents|naughtyThing|naughtyAction|naughtyActioning)\]/g.test(output)) {
                    output = output.replace('[naughty]', getRandom(naughty))
                        .replace('[naughties]', getRandom(naughties))
                        .replace('[innocent]', getRandom(innocent))
                        .replace('[innocents]', getRandom(innocents))
                        .replace('[naughtyThing]', getRandom(naughtyThing))
                        .replace('[naughtyAction]', getRandom(naughtyAction))
                        .replace('[naughtyActioning]', getRandom(naughtyActioning))
                        .replace('[naughtyActioned]', getRandom(naughtyActioned));
                }
                output = output.charAt(0).toUpperCase() + output.slice(1, output.length);
                KBot._respond(this.channel, output);
            }
        };
        Commands.adlib = {
            arguments: [
                {
                    name: 'Sub-command',
                    type: String,
                    required: true
                }
            ],
            help: 'Parse an adlib! Note that \'-n\' means [i]naughty versions[/i].' +
                ' Valid adlibs:\n [noun], [nouns], [nouner], [verb], [verbing], ' +
                '[verbs], [verbed], [interjection], [adverb], [adjective]',
            func: function (input) {
                var me = KBot._getDisplayName(this.user);
                var adjectives = KBot.Dictionary.Adlib.adjectives;
                var verb = KBot.Dictionary.Adlib.verb;
                var verbs = KBot.Dictionary.Adlib.verbs;
                var verbing = KBot.Dictionary.Adlib.verbing;
                var verbed = KBot.Dictionary.Adlib.verbed;
                var bodypart = KBot.Dictionary.Adlib.bodypart;
                var bodyparts = KBot.Dictionary.Adlib.bodyparts;
                var bodyfluid = KBot.Dictionary.Adlib.bodyfluid;
                var bodyfluids = KBot.Dictionary.Adlib.bodyfluids;
                var noun = KBot.Dictionary.Adlib.noun;
                var nouns = KBot.Dictionary.Adlib.nouns;
                var userInput = input.join(' ');
                var arrayInput = userInput.split('[');
                var arrayItemArray;
                var arrayItem;
                var identifiers;
                function getRandom(list) {
                    return list[~~(Math.random() * list.length)];
                }
                for (var i = 0, ii = arrayInput.length; i < ii; i++) {
                    arrayItemArray = arrayInput[i].split(']');
                    if (arrayItemArray.length === 1) {
                        continue;
                    }
                    arrayItem = arrayItemArray[0];
                    identifiers = arrayItem.split('|');
                    arrayItemArray[0] = getRandom(identifiers);
                    arrayInput[i] = arrayItemArray.join(']');
                }
                userInput = arrayInput.join('[');
                while (/(\[adjective\]|\[me\]|\[verb\]|\[verbs\]|\[verbed\]|\[verbing\]|\[bodypart\]|\[bodyparts\]|\[bodyfluid\]|\[bodyfluids\]|\[noun\]|\[nouns\])/gi.test(userInput)) {
                    userInput = userInput
                        .replace(/\[adjective\]/, getRandom(adjectives))
                        .replace(/\[verb\]/, getRandom(verb))
                        .replace(/\[verbs\]/, getRandom(verbs))
                        .replace(/\[verbed\]/, getRandom(verbed))
                        .replace(/\[verbing\]/, getRandom(verbing))
                        .replace(/\[bodypart\]/, getRandom(bodypart))
                        .replace(/\[bodyparts\]/, getRandom(bodyparts))
                        .replace(/\[bodyfluid\]/, getRandom(bodyfluid))
                        .replace(/\[bodyfluids\]/, getRandom(bodyfluids))
                        .replace(/\[noun\]/, getRandom(noun))
                        .replace(/\[nouns\]/, getRandom(nouns))
                        .replace(/\[me\]/, me);
                }
                KBot._respond(this.channel, userInput);
            }
        };
    })(Commands = KBot.Commands || (KBot.Commands = {}));
    void function () {
        Commands.nickname.nicknames = JSON.parse(localStorage['nicks'] || '[]');
        Commands.nickname.nicknamesKey = JSON.parse(localStorage['nicksKey'] || '[]');
    }();
    KBot.CommandKeys = (function () {
        var commands = [];
        for (var command in Commands) {
            if (Commands.hasOwnProperty(command)) {
                commands.push(command);
            }
        }
        return commands;
    }());
})(KBot || (KBot = {}));

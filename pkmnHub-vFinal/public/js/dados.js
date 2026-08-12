let sets = [
  {
    nomePt: 'Escarlate e Violeta',
    nomeEn: 'Scarlet & Violet', 
    sigla: 'SV1',
    total: '198',
    apiId: 'sv1',
    cor: '#CB2453'
  },
  {
    nomePt: 'Evoluções em Paldea',
    nomeEn: 'Paldea Evolved',
    sigla: 'PAL',
    total: '193',
    apiId: 'sv2',
    cor: '#4A90D9'
  },
  {
    nomePt: 'Obsidiana em Chamas',
    nomeEn: 'Obsidian Flames',
    sigla: 'OBF',
    total: '197',
    apiId: 'sv3',
    cor: '#8B00FF'
  },
  {
    nomePt: '151',
    nomeEn: '151',
    sigla: 'MEW',
    total: '165',
    apiId: 'sv3pt5',
    cor: '#FF69B4'
  },
  {
    nomePt: 'Fenda Paradoxal',
    nomeEn: 'Paradox Rift',
    sigla: 'PAR',
    total: '182',
    apiId: 'sv4',
    cor: '#FF8C00'
  },
  {
    nomePt: 'Destinos de Paldea',
    nomeEn: 'Paldean Fates',
    sigla: 'PAF',
    total: '091',
    apiId: 'sv4pt5',
    cor: '#FFD700'
  },
  {
    nomePt: 'Forças Temporais',
    nomeEn: 'Temporal Forces',
    sigla: 'TEF',
    total: '162',
    apiId: 'sv5',
    cor: '#00CED1'
  },
  {
    nomePt: 'Máscaras do Crepúsculo',
    nomeEn: 'Twilight Masquerade',
    sigla: 'TWM',
    total: '167',
    apiId: 'sv6',
    cor: '#9B59B6'
  },
  {
    nomePt: 'Fábulas Nebulosas',
    nomeEn: 'Shrouded Fable',
    sigla: 'SFA',
    total: '064',
    apiId: 'sv6pt5',
    cor: '#2ECC71'
  },
  {
    nomePt: 'Coroa Estelar',
    nomeEn: 'Stellar Crown',
    sigla: 'SCR',
    total: '142',
    apiId: 'sv7',
    cor: '#F1C40F'
  },
  {
    nomePt: 'Fagulhas Impetuosas',
    nomeEn: 'Surging Sparks',
    sigla: 'SSP',
    total: '191',
    apiId: 'sv8',
    cor: '#E74C3C'
  },
  {
    nomePt: 'Evoluções Prismáticas',
    nomeEn: 'Prismatic Evolutions',
    sigla: 'PRE',
    total: '131',
    apiId: 'sv8pt5',
    cor: '#1ABC9C'
  },
  {
    nomePt: 'Amigos de Jornada',
    nomeEn: 'Journey Together',
    sigla: 'JTG',
    total: '159',
    apiId: 'sv9',
    cor: '#3498DB'
  },
  {
    nomePt: 'Rivais Predestinados',
    nomeEn: 'Destined Rivals',
    sigla: 'DRI',
    total: '182',
    apiId: 'sv10',
    cor: '#E67E22'
  },
  {
    nomePt: 'Fogo Branco',
    nomeEn: 'White Flare',
    sigla: 'WHT',
    total: '086',
    apiId: 'rsv10pt5',
    cor: '#ECF0F1'
  },
  {
    nomePt: 'Raio Preto',
    nomeEn: 'Black Bolt',
    sigla: 'BLK',
    total: '086',
    apiId: 'zsv10pt5',
    cor: '#2C3E50'
  },
  {
    nomePt: 'Scarlet & Violet Black Star Promos',
    nomeEn: 'Scarlet & Violet Black Star Promos',
    sigla: 'SVP',
    total: '000',
    apiId: 'svp',
    cor: '#C0392B'
  },
  {
    nomePt: 'Megaevolução',
    nomeEn: 'Mega Evolution',
    sigla: 'MEG',
    total: '132',
    apiId: 'me1',
    cor: '#8E44AD'
  },
  {
    nomePt: 'Fogo Fantasmagórico',
    nomeEn: 'Phantasmal Flames',
    sigla: 'PFL',
    total: '094',
    apiId: 'me2',
    cor: '#D35400'
  },
  {
    nomePt: 'Heróis Excelsos',
    nomeEn: 'Ascended Heroes',
    sigla: 'ASC',
    total: '217',
    apiId: 'me2pt5',
    cor: '#27AE60'
  },
  {
    nomePt: 'Equilíbrio Perfeito',
    nomeEn: 'Perfect Order',
    sigla: 'POR',
    total: '088',
    apiId: 'me3',
    cor: '#2980B9'
  },
  {
    nomePt: 'Caos Ascendente',
    nomeEn: 'Chaos Rising',
    sigla: 'CRI',
    total: '086',
    apiId: 'me4',
    cor: '#C0392B'
  },
  {
    nomePt: 'INDISPONIVEL',
    nomeEn: 'Pitch Black',
    sigla: 'INDISPONIVEL',
    total: 'INDISPONIVEL',
    apiId: 'me5',
    cor: '#1C2833'
  },
  {
    nomePt: 'Mega Evolution Black Star Promos',
    nomeEn: 'Mega Evolution Black Star Promos',
    sigla: 'MEP',
    total: '000',
    apiId: 'mep', 
    cor: '#7D3C98'
  }
];

let todosPokemons = ["bulbasaur", "ivysaur", "venusaur", "charmander", "charmeleon", "charizard", "squirtle", "wartortle", "blastoise", "caterpie", "metapod", "butterfree", "weedle", "kakuna", "beedrill", "pidgey", "pidgeotto", "pidgeot", "rattata", "raticate", "spearow", "fearow", "ekans", "arbok", "pikachu", "raichu", "sandshrew", "sandslash", "nidoran", "nidorina", "nidoqueen", "nidorino", "nidoking", "clefairy", "clefable", "vulpix", "ninetales", "jigglypuff", "wigglytuff", "zubat", "golbat", "oddish", "gloom", "vileplume", "paras", "parasect", "venonat", "venomoth", "diglett", "dugtrio", "meowth", "persian", "psyduck", "golduck", "mankey", "primeape", "growlithe", "arcanine", "poliwag", "poliwhirl", "poliwrath", "abra", "kadabra", "alakazam", "machop", "machoke", "machamp", "bellsprout", "weepinbell", "victreebel", "tentacool", "tentacruel", "geodude", "graveler", "golem", "ponyta", "rapidash", "slowpoke", "slowbro", "magnemite", "magneton", "farfetchd", "doduo", "dodrio", "seel", "dewgong", "grimer", "muk", "shellder", "cloyster", "gastly", "haunter", "gengar", "onix", "drowzee", "hypno", "krabby", "kingler", "voltorb", "electrode", "exeggcute", "exeggutor", "cubone", "marowak", "hitmonlee", "hitmonchan", "lickitung", "koffing", "weezing", "rhyhorn", "rhydon", "chansey", "tangela", "kangaskhan", "horsea", "seadra", "goldeen", "seaking", "staryu", "starmie", "mr. mime", "scyther", "jynx", "electabuzz", "magmar", "pinsir", "tauros", "magikarp", "gyarados", "lapras", "ditto", "eevee", "vaporeon", "jolteon", "flareon", "porygon", "omanyte", "omastar", "kabuto", "kabutops", "aerodactyl", "snorlax", "articuno", "zapdos", "moltres", "dratini", "dragonair", "dragonite", "mewtwo", "mew", "chikorita", "bayleef", "meganium", "cyndaquil", "quilava", "typhlosion", "totodile", "croconaw", "feraligatr", "sentret", "furret", "hoothoot", "noctowl", "ledyba", "ledian", "spinarak", "ariados", "crobat", "chinchou", "lanturn", "pichu", "cleffa", "igglybuff", "togepi", "togetic", "natu", "xatu", "mareep", "flaaffy", "ampharos", "bellossom", "marill", "azumarill", "sudowoodo", "politoed", "hoppip", "skiploom", "jumpluff", "aipom", "sunkern", "sunflora", "yanma", "wooper", "quagsire", "espeon", "umbreon", "murkrow", "slowking", "misdreavus", "unown", "wobbuffet", "girafarig", "pineco", "forretress", "dunsparce", "gligar", "steelix", "snubbull", "granbull", "qwilfish", "scizor", "shuckle", "heracross", "sneasel", "teddiursa", "ursaring", "slugma", "magcargo", "swinub", "piloswine", "corsola", "remoraid", "octillery", "delibird", "mantine", "skarmory", "houndour", "houndoom", "kingdra", "phanpy", "donphan", "porygon2", "stantler", "smeargle", "tyrogue", "hitmontop", "smoochum", "elekid", "magby", "miltank", "blissey", "raikou", "entei", "suicune", "larvitar", "pupitar", "tyranitar", "lugia", "ho-oh", "celebi", "treecko", "grovyle", "sceptile", "torchic", "combusken", "blaziken", "mudkip", "marshtomp", "swampert", "poochyena", "mightyena", "zigzagoon", "linoone", "wurmple", "silcoon", "beautifly", "cascoon", "dustox", "lotad", "lombre", "ludicolo", "seedot", "nuzleaf", "shiftry", "taillow", "swellow", "wingull", "pelipper", "ralts", "kirlia", "gardevoir", "surskit", "masquerain", "shroomish", "breloom", "slakoth", "vigoroth", "slaking", "nincada", "ninjask", "shedinja", "whismur", "loudred", "exploud", "makuhita", "hariyama", "azurill", "nosepass", "skitty", "delcatty", "sableye", "mawile", "aron", "lairon", "aggron", "meditite", "medicham", "electrike", "manectric", "plusle", "minun", "volbeat", "illumise", "roselia", "gulpin", "swalot", "carvanha", "sharpedo", "wailmer", "wailord", "numel", "camerupt", "torkoal", "spoink", "grumpig", "spinda", "trapinch", "vibrava", "flygon", "cacnea", "cacturne", "swablu", "altaria", "zangoose", "seviper", "lunatone", "solrock", "barboach", "whiscash", "corphish", "crawdaunt", "baltoy", "claydol", "lileep", "cradily", "anorith", "armaldo", "feebas", "milotic", "castform", "kecleon", "shuppet", "banette", "duskull", "dusclops", "tropius", "chimecho", "absol", "wynaut", "snorunt", "glalie", "spheal", "sealeo", "walrein", "clamperl", "huntail", "gorebyss", "relicanth", "luvdisc", "bagon", "shelgon", "salamence", "beldum", "metang", "metagross", "regirock", "regice", "registeel", "latias", "latios", "kyogre", "groudon", "rayquaza", "jirachi", "deoxys", "turtwig", "grotle", "torterra", "chimchar", "monferno", "infernape", "piplup", "prinplup", "empoleon", "starly", "staravia", "staraptor", "bidoof", "bibarel", "kricketot", "kricketune", "shinx", "luxio", "luxray", "budew", "roserade", "cranidos", "rampardos", "shieldon", "bastiodon", "burmy", "wormadam", "mothim", "combee", "vespiquen", "pachirisu", "buizel", "floatzel", "cherubi", "cherrim", "shellos", "gastrodon", "ambipom", "drifloon", "drifblim", "buneary", "lopunny", "mismagius", "honchkrow", "glameow", "purugly", "chingling", "stunky", "skuntank", "bronzor", "bronzong", "bonsly", "mime jr.", "happiny", "chatot", "spiritomb", "gible", "gabite", "garchomp", "munchlax", "riolu", "lucario", "hippopotas", "hippowdon", "skorupi", "drapion", "croagunk", "toxicroak", "carnivine", "finneon", "lumineon", "mantyke", "snover", "abomasnow", "weavile", "magnezone", "lickilicky", "rhyperior", "tangrowth", "electivire", "magmortar", "togekiss", "yanmega", "leafeon", "glaceon", "gliscor", "mamoswine", "porygon z", "gallade", "probopass", "dusknoir", "froslass", "rotom", "uxie", "mesprit", "azelf", "dialga", "palkia", "heatran", "regigigas", "giratina", "cresselia", "phione", "manaphy", "darkrai", "shaymin", "arceus", "victini", "snivy", "servine", "serperior", "tepig", "pignite", "emboar", "oshawott", "dewott", "samurott", "patrat", "watchog", "lillipup", "herdier", "stoutland", "purrloin", "liepard", "pansage", "simisage", "pansear", "simisear", "panpour", "simipour", "munna", "musharna", "pidove", "tranquill", "unfezant", "blitzle", "zebstrika", "roggenrola", "boldore", "gigalith", "woobat", "swoobat", "drilbur", "excadrill", "audino", "timburr", "gurdurr", "conkeldurr", "tympole", "palpitoad", "seismitoad", "throh", "sawk", "sewaddle", "swadloon", "leavanny", "venipede", "whirlipede", "scolipede", "cottonee", "whimsicott", "petilil", "lilligant", "basculin", "sandile", "krokorok", "krookodile", "darumaka", "darmanitan", "maractus", "dwebble", "crustle", "scraggy", "scrafty", "sigilyph", "yamask", "cofagrigus", "tirtouga", "carracosta", "archen", "archeops", "trubbish", "garbodor", "zorua", "zoroark", "minccino", "cinccino", "gothita", "gothorita", "gothitelle", "solosis", "duosion", "reuniclus", "ducklett", "swanna", "vanillite", "vanillish", "vanilluxe", "deerling", "sawsbuck", "emolga", "karrablast", "escavalier", "foongus", "amoonguss", "frillish", "jellicent", "alomomola", "joltik", "galvantula", "ferroseed", "ferrothorn", "klink", "klang", "klinklang", "tynamo", "eelektrik", "eelektross", "elgyem", "beheeyem", "litwick", "lampent", "chandelure", "axew", "fraxure", "haxorus", "cubchoo", "beartic", "cryogonal", "shelmet", "accelgor", "stunfisk", "mienfoo", "mienshao", "druddigon", "golett", "golurk", "pawniard", "bisharp", "bouffalant", "rufflet", "braviary", "vullaby", "mandibuzz", "heatmor", "durant", "deino", "zweilous", "hydreigon", "larvesta", "volcarona", "cobalion", "terrakion", "virizion", "tornadus", "thundurus", "reshiram", "zekrom", "landorus", "kyurem", "keldeo", "meloetta", "genesect", "chespin", "quilladin", "chesnaught", "fennekin", "braixen", "delphox", "froakie", "frogadier", "greninja", "bunnelby", "diggersby", "fletchling", "fletchinder", "talonflame", "scatterbug", "spewpa", "vivillon", "litleo", "pyroar", "flabebe", "floette", "florges", "skiddo", "gogoat", "pancham", "pangoro", "furfrou", "espurr", "meowstic", "honedge", "doublade", "aegislash", "spritzee", "aromatisse", "swirlix", "slurpuff", "inkay", "malamar", "binacle", "barbaracle", "skrelp", "dragalge", "clauncher", "clawitzer", "helioptile", "heliolisk", "tyrunt", "tyrantrum", "amaura", "aurorus", "sylveon", "hawlucha", "dedenne", "carbink", "goomy", "sliggoo", "goodra", "klefki", "phantump", "trevenant", "pumpkaboo", "gourgeist", "bergmite", "avalugg", "noibat", "noivern", "xerneas", "yveltal", "zygarde", "diancie", "hoopa", "volcanion", "rowlet", "dartrix", "decidueye", "litten", "torracat", "incineroar", "popplio", "brionne", "primarina", "pikipek", "trumbeak", "toucannon", "yungoos", "gumshoos", "grubbin", "charjabug", "vikavolt", "crabrawler", "crabominable", "oricorio", "cutiefly", "ribombee", "rockruff", "lycanroc", "wishiwashi", "mareanie", "toxapex", "mudbray", "mudsdale", "dewpider", "araquanid", "fomantis", "lurantis", "morelull", "shiinotic", "salandit", "salazzle", "stufful", "bewear", "bounsweet", "steenee", "tsareena", "comfey", "oranguru", "passimian", "wimpod", "golisopod", "sandygast", "palossand", "pyukumuku", "type null", "silvally", "minior", "komala", "turtonator", "togedemaru", "mimikyu", "bruxish", "drampa", "dhelmise", "jangmo-o", "hakamo-o", "kommo-o", "tapu koko", "tapu lele", "tapu bulu", "tapu fini", "cosmog", "cosmoem", "solgaleo", "lunala", "nihilego", "buzzwole", "pheromosa", "xurkitree", "celesteela", "kartana", "guzzlord", "necrozma", "magearna", "marshadow", "poipole", "naganadel", "stakataka", "blacephalon", "zeraora", "meltan", "melmetal", "grookey", "thwackey", "rillaboom", "scorbunny", "raboot", "cinderace", "sobble", "drizzile", "inteleon", "skwovet", "greedent", "rookidee", "corvisquire", "corviknight", "blipbug", "dottler", "orbeetle", "nickit", "thievul", "gossifleur", "eldegoss", "wooloo", "dubwool", "chewtle", "drednaw", "yamper", "boltund", "rolycoly", "carkol", "coalossal", "applin", "flapple", "appletun", "silicobra", "sandaconda", "cramorant", "arrokuda", "barraskewda", "toxel", "toxtricity", "sizzlipede", "centiskorch", "clobbopus", "grapploct", "sinistea", "polteageist", "hatenna", "hattrem", "hatterene", "impidimp", "morgrem", "grimmsnarl", "obstagoon", "perrserker", "cursola", "sirfetchd", "mr. rime", "runerigus", "milcery", "alcremie", "falinks", "pincurchin", "snom", "frosmoth", "stonjourner", "eiscue", "indeedee", "morpeko", "cufant", "copperajah", "dracozolt", "arctozolt", "dracovish", "arctovish", "duraludon", "dreepy", "drakloak", "dragapult", "zacian", "zamazenta", "eternatus", "kubfu", "urshifu", "zarude", "regieleki", "regidrago", "glastrier", "spectrier", "calyrex", "wyrdeer", "kleavor", "ursaluna", "basculegion", "sneasler", "overqwil", "enamorus", "sprigatito", "floragato", "meowscarada", "fuecoco", "crocalor", "skeledirge", "quaxly", "quaxwell", "quaquaval", "lechonk", "oinkologne", "tarountula", "spidops", "nymble", "lokix", "pawmi", "pawmo", "pawmot", "tandemaus", "maushold", "fidough", "dachsbun", "smoliv", "dolliv", "arboliva", "squawkabilly", "nacli", "naclstack", "garganacl", "charcadet", "armarouge", "ceruledge", "tadbulb", "bellibolt", "wattrel", "kilowattrel", "maschiff", "mabosstiff", "shroodle", "grafaiai", "bramblin", "brambleghast", "toedscool", "toedscruel", "klawf", "capsakid", "scovillain", "rellor", "rabsca", "flittle", "espathra", "tinkatink", "tinkatuff", "tinkaton", "wiglett", "wugtrio", "bombirdier", "finizen", "palafin", "varoom", "revavroom", "cyclizar", "orthworm", "glimmet", "glimmora", "greavard", "houndstone", "flamigo", "cetoddle", "cetitan", "veluza", "dondozo", "tatsugiri", "annihilape", "clodsire", "farigiraf", "dudunsparce", "kingambit", "great tusk", "scream tail", "brute bonnet", "flutter mane", "slither wing", "sandy shocks", "iron treads", "iron bundle", "iron hands", "iron jugulis", "iron moth", "iron thorns", "frigibax", "arctibax", "baxcalibur", "gimmighoul", "gholdengo", "wo-chien", "chien-pao", "ting-lu", "chi-yu", "roaring moon", "iron valiant", "koraidon", "miraidon", "walking wake", "iron leaves", "dipplin", "poltchageist", "sinistcha", "okidogi", "munkidori", "fezandipiti", "ogerpon", "archaludon", "hydrapple", "gouging fire", "raging bolt", "iron boulder", "iron crown", "terapagos"];

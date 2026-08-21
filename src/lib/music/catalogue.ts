/**
 * Curated Christmas music catalogue — reference content only.
 * Nothing here is stored per user. Tapping "Add to my music" creates an
 * ordinary row in `music_items` from these fields.
 *
 * Factual metadata only: title, artist, era and how a track tends to be used.
 * No lyrics, no copied descriptions, no artwork, no external links. Every
 * one-line note is original copy written for A Complete Christmas.
 */

export type Audience =
  | "young_children"
  | "older_children"
  | "teenagers"
  | "young_adults"
  | "couple"
  | "adults_no_children"
  | "mixed_ages"
  | "extended"
  | "alone";

export type MusicMood =
  | "traditional"
  | "choral"
  | "crooner"
  | "jazzy"
  | "nostalgic"
  | "joyful"
  | "party"
  | "singalong"
  | "romantic"
  | "relaxed"
  | "modern"
  | "children"
  | "comic";

export type MusicType = "song" | "album" | "playlist_idea" | "artist" | "other";
export type Energy = "low" | "mid" | "high";
export type Era = "carol" | "classic" | "retro" | "modern" | "recent";

export interface MusicIdea {
  key: string;
  title: string;
  artist?: string;
  type: MusicType;
  era: Era;
  energy: Energy;
  familySafe: boolean;
  audiences: Audience[];
  moods: MusicMood[];
  moments: string[];
  tags: string[];
  /** One short, original line on where this fits in the day. */
  line: string;
}

const AUD: Record<string, Audience> = {
  yc: "young_children",
  oc: "older_children",
  te: "teenagers",
  ya: "young_adults",
  cp: "couple",
  an: "adults_no_children",
  mx: "mixed_ages",
  ex: "extended",
  al: "alone",
};

const ALL_AUD = "yc oc te ya cp an mx ex al";
const GROWN = "te ya cp an mx ex al";

function e(
  key: string,
  title: string,
  artist: string,
  era: Era,
  energy: Energy,
  moods: string,
  moments: string,
  audiences: string,
  line: string,
  extra: Partial<MusicIdea> = {},
): MusicIdea {
  return {
    key,
    title,
    artist: artist || undefined,
    type: "song",
    era,
    energy,
    familySafe: true,
    audiences: audiences.split(" ").map((a) => AUD[a]),
    moods: moods.split(" ") as MusicMood[],
    moments: moments.split(" "),
    tags: [],
    line,
    ...extra,
  };
}

export const MUSIC_IDEAS: MusicIdea[] = [
  // ── Carols and choral ────────────────────────────────────────────────
  e("silent-night", "Silent Night", "Traditional carol", "carol", "low", "choral traditional relaxed", "christmas_eve cosy_evening background christmas_dinner", ALL_AUD, "The quietest moment of Christmas Eve, in one carol."),
  e("o-holy-night", "O Holy Night", "Traditional carol", "carol", "low", "choral traditional", "christmas_eve background cosy_evening", ALL_AUD, "A soaring carol that suits candlelight and a late evening."),
  e("hark-the-herald", "Hark! The Herald Angels Sing", "Traditional carol", "carol", "mid", "choral traditional singalong", "christmas_morning singalong christmas_eve", ALL_AUD, "A bright carol everybody can join in with."),
  e("o-come-all-ye-faithful", "O Come, All Ye Faithful", "Traditional carol", "carol", "mid", "choral traditional singalong", "christmas_morning singalong christmas_eve", ALL_AUD, "Made for a full room and raised voices."),
  e("ding-dong-merrily", "Ding Dong Merrily on High", "Traditional carol", "carol", "mid", "choral joyful singalong", "singalong decorating christmas_morning", ALL_AUD, "Cheerful, quick and surprisingly fun to attempt."),
  e("god-rest-ye", "God Rest Ye Merry, Gentlemen", "Traditional carol", "carol", "mid", "choral traditional", "christmas_eve background cosy_evening", ALL_AUD, "Old-fashioned in the best possible way."),
  e("in-the-bleak-midwinter", "In the Bleak Midwinter", "Traditional carol", "carol", "low", "choral relaxed traditional", "background cosy_evening christmas_eve", GROWN, "Still and wintry — lovely as background music."),
  e("once-in-royal", "Once in Royal David's City", "Traditional carol", "carol", "low", "choral traditional", "christmas_eve background", ALL_AUD, "The carol that opens Christmas for a lot of families."),
  e("we-three-kings", "We Three Kings", "Traditional carol", "carol", "mid", "choral traditional singalong", "singalong christmas_morning", ALL_AUD, "A carol children pick up quickly."),
  e("the-first-noel", "The First Noel", "Traditional carol", "carol", "low", "choral traditional", "christmas_eve background christmas_dinner", ALL_AUD, "Gentle and familiar — easy dinner-table music."),
  e("joy-to-the-world", "Joy to the World", "Traditional carol", "carol", "high", "choral joyful singalong", "christmas_morning singalong", ALL_AUD, "Big and bright for Christmas morning."),
  e("deck-the-halls", "Deck the Halls", "Traditional carol", "carol", "high", "joyful singalong children", "decorating singalong christmas_morning", ALL_AUD, "The obvious one to put on while the decorations go up."),
  e("we-wish-you", "We Wish You a Merry Christmas", "Traditional carol", "carol", "mid", "singalong children joyful", "singalong travelling christmas_morning", ALL_AUD, "Short, cheerful and everybody knows it."),
  e("jingle-bells", "Jingle Bells", "Traditional", "carol", "high", "children joyful singalong", "travelling singalong decorating", ALL_AUD, "The first Christmas song most children learn."),
  e("twelve-days", "The Twelve Days of Christmas", "Traditional", "carol", "mid", "singalong comic children", "singalong party", ALL_AUD, "Half song, half endurance test — great with a group."),
  e("good-king-wenceslas", "Good King Wenceslas", "Traditional carol", "carol", "mid", "traditional choral", "singalong background", ALL_AUD, "An old story carol with a steady, walking rhythm."),
  e("away-in-a-manger", "Away in a Manger", "Traditional carol", "carol", "low", "children choral relaxed", "christmas_eve background cosy_evening", "yc oc mx ex", "The bedtime carol for little ones on Christmas Eve."),
  e("carol-of-the-bells", "Carol of the Bells", "Traditional carol", "carol", "mid", "choral traditional", "decorating background christmas_eve", GROWN, "Urgent and shimmering — brilliant while you decorate."),
  e("coventry-carol", "Coventry Carol", "Traditional carol", "carol", "low", "choral relaxed", "background cosy_evening", GROWN, "Haunting and quiet, for a calmer corner of the day."),
  e("sussex-carol", "Sussex Carol", "Traditional carol", "carol", "mid", "choral joyful traditional", "christmas_morning singalong background", ALL_AUD, "Bright English carolling without being loud."),

  // ── Classic crooners and standards ───────────────────────────────────
  e("white-christmas", "White Christmas", "Bing Crosby", "classic", "low", "crooner nostalgic relaxed", "christmas_dinner background cosy_evening christmas_morning", ALL_AUD, "The definition of an old-fashioned Christmas."),
  e("winter-wonderland-crosby", "Winter Wonderland", "Bing Crosby", "classic", "mid", "crooner nostalgic joyful", "decorating background travelling", ALL_AUD, "Warm, swinging and endlessly reusable."),
  e("have-yourself-garland", "Have Yourself a Merry Little Christmas", "Judy Garland", "classic", "low", "nostalgic romantic relaxed", "christmas_eve cosy_evening background", GROWN, "Tender and a little bittersweet."),
  e("the-christmas-song", "The Christmas Song", "Nat King Cole", "classic", "low", "crooner jazzy relaxed", "christmas_dinner background cosy_evening", ALL_AUD, "Roasting chestnuts, open fire, the whole picture."),
  e("lets-face-the-music", "Let It Snow! Let It Snow! Let It Snow!", "Dean Martin", "classic", "mid", "crooner jazzy joyful", "party christmas_dinner background", GROWN, "Easy swing that lifts a room without shouting."),
  e("baby-its-cold", "Winter Weather", "Dean Martin", "classic", "mid", "crooner jazzy romantic", "cosy_evening background", "cp an ya al", "Late-night crooning for two."),
  e("sleigh-ride-anderson", "Sleigh Ride", "Leroy Anderson", "classic", "mid", "nostalgic joyful traditional", "travelling decorating background", ALL_AUD, "Instrumental, cheerful and never in the way."),
  e("santa-claus-coming", "Santa Claus Is Comin' to Town", "Bing Crosby & The Andrews Sisters", "classic", "mid", "nostalgic children joyful", "christmas_eve decorating singalong", ALL_AUD, "Fun for the children without irritating the adults."),
  e("rudolph-autry", "Rudolph the Red-Nosed Reindeer", "Gene Autry", "classic", "mid", "children nostalgic singalong", "travelling singalong decorating", "yc oc mx ex", "A children's classic that grandparents know too."),
  e("frosty", "Frosty the Snowman", "Gene Autry", "classic", "mid", "children joyful singalong", "decorating travelling singalong", "yc oc mx ex", "Simple, silly and very singable."),
  e("silver-bells", "Silver Bells", "Bing Crosby", "classic", "low", "crooner nostalgic relaxed", "background christmas_dinner cosy_evening", ALL_AUD, "City pavements and shop windows in song form."),
  e("mele-kalikimaka", "Mele Kalikimaka", "Bing Crosby", "classic", "mid", "nostalgic joyful comic", "party cooking background", GROWN, "A sunny left turn when everything else is snowy."),
  e("jingle-bell-rock", "Jingle Bell Rock", "Bobby Helms", "classic", "high", "nostalgic party singalong", "party decorating cooking", ALL_AUD, "Guaranteed to make somebody dance in the kitchen."),
  e("rockin-around", "Rockin' Around the Christmas Tree", "Brenda Lee", "classic", "high", "nostalgic party singalong", "decorating party cooking", ALL_AUD, "The tree-decorating song, basically."),
  e("run-rudolph-run", "Run Rudolph Run", "Chuck Berry", "classic", "high", "party nostalgic", "party travelling cooking", GROWN, "Rock and roll energy for a busy kitchen."),
  e("blue-christmas", "Blue Christmas", "Elvis Presley", "classic", "mid", "nostalgic crooner romantic", "cosy_evening background", GROWN, "Wistful, warm and instantly recognisable."),
  e("santa-claus-back-in-town", "Santa Claus Is Back in Town", "Elvis Presley", "classic", "mid", "nostalgic party", "party cooking", GROWN, "Bluesy swagger for a grown-up gathering."),
  e("christmas-time-is-here", "Christmas Time Is Here", "Vince Guaraldi Trio", "classic", "low", "jazzy relaxed nostalgic", "background cosy_evening christmas_dinner", ALL_AUD, "The softest, most nostalgic jazz on the list."),
  e("linus-and-lucy", "Linus and Lucy", "Vince Guaraldi Trio", "classic", "mid", "jazzy joyful relaxed", "background wrapping cooking", ALL_AUD, "Bouncy piano jazz — perfect while you wrap."),
  e("what-are-you-doing", "What Are You Doing New Year's Eve?", "Ella Fitzgerald", "classic", "low", "jazzy romantic relaxed", "cosy_evening background", "cp an ya al", "Elegant and quietly romantic."),
  e("sleigh-ride-ella", "Sleigh Ride", "Ella Fitzgerald", "classic", "mid", "jazzy joyful crooner", "christmas_dinner party background", ALL_AUD, "Swinging vocals that keep dinner moving."),
  e("santa-baby", "Santa Baby", "Eartha Kitt", "classic", "mid", "jazzy comic party", "party cooking", "ya cp an", "Playful and grown-up, best after bedtime."),
  e("christmas-waltz", "The Christmas Waltz", "Frank Sinatra", "classic", "low", "crooner romantic relaxed", "christmas_dinner cosy_evening background", GROWN, "Smooth enough to make dinner feel like an occasion."),
  e("mistletoe-and-holy", "Mistletoe and Holly", "Frank Sinatra", "classic", "mid", "crooner nostalgic joyful", "christmas_dinner background party", GROWN, "Old-school festive charm."),
  e("its-beginning-to-look", "It's Beginning to Look a Lot Like Christmas", "Perry Como", "classic", "mid", "crooner nostalgic joyful", "decorating background cooking", ALL_AUD, "The song for the first day the decorations come out."),
  e("home-for-christmas", "(There's No Place Like) Home for the Holidays", "Perry Como", "classic", "mid", "crooner nostalgic", "travelling background christmas_dinner", ALL_AUD, "For the journey home, whoever's driving."),
  e("mary-boy-child", "Mary's Boy Child", "Harry Belafonte", "classic", "mid", "traditional nostalgic relaxed", "background christmas_dinner", ALL_AUD, "Gentle, lilting and a bit different."),
  e("someday-at-christmas", "Someday at Christmas", "Stevie Wonder", "classic", "low", "nostalgic relaxed", "cosy_evening background", GROWN, "Hopeful and soulful for a quieter hour."),
  e("this-christmas", "This Christmas", "Donny Hathaway", "classic", "mid", "jazzy joyful party", "party christmas_dinner cooking", GROWN, "Soul that makes a room feel generous."),
  e("give-love-on-christmas", "Give Love on Christmas Day", "The Jackson 5", "classic", "low", "nostalgic relaxed", "background cosy_evening", ALL_AUD, "Sweet-natured soul for the evening."),
  e("santa-claus-jackson", "Santa Claus Is Coming to Town", "The Jackson 5", "classic", "high", "children joyful party", "decorating party singalong", ALL_AUD, "Bright enough to get everyone moving."),

  // ── British and Irish festive pop ────────────────────────────────────
  e("merry-xmas-everybody", "Merry Xmas Everybody", "Slade", "retro", "high", "party singalong joyful", "party singalong decorating", ALL_AUD, "The moment a British Christmas party officially starts."),
  e("i-wish-it-could-be", "I Wish It Could Be Christmas Everyday", "Wizzard", "retro", "high", "party singalong joyful", "party decorating cooking", ALL_AUD, "Loud, daft and impossible to dislike."),
  e("step-into-christmas", "Step into Christmas", "Elton John", "retro", "high", "party joyful singalong", "party decorating cooking", ALL_AUD, "A proper welcome-to-Christmas opener."),
  e("wonderful-christmastime", "Wonderful Christmastime", "Paul McCartney", "retro", "mid", "joyful nostalgic", "decorating cooking background", ALL_AUD, "Cheerful, synthy and very of its time."),
  e("happy-xmas-war-is-over", "Happy Xmas (War Is Over)", "John Lennon & Yoko Ono", "retro", "mid", "nostalgic singalong", "christmas_eve background singalong", ALL_AUD, "Reflective but still easy to sing along to."),
  e("fairytale-of-new-york", "Fairytale of New York", "The Pogues & Kirsty MacColl", "retro", "mid", "nostalgic singalong", "party cosy_evening", "te ya cp an mx ex al", "The one that means Christmas to a lot of grown-ups.", { familySafe: false }),
  e("last-christmas", "Last Christmas", "Wham!", "retro", "mid", "nostalgic romantic singalong", "party wrapping cooking", ALL_AUD, "Melancholy words, unstoppable chorus."),
  e("do-they-know", "Do They Know It's Christmas?", "Band Aid", "retro", "mid", "nostalgic singalong", "party background", ALL_AUD, "A big eighties singalong with a bit of heart."),
  e("stop-the-cavalry", "Stop the Cavalry", "Jona Lewie", "retro", "mid", "nostalgic singalong comic", "party background travelling", ALL_AUD, "That brass band hook, every single year."),
  e("mistletoe-and-wine", "Mistletoe and Wine", "Cliff Richard", "retro", "mid", "traditional nostalgic singalong", "christmas_dinner background singalong", ALL_AUD, "Unapologetically old-fashioned and much loved."),
  e("driving-home", "Driving Home for Christmas", "Chris Rea", "retro", "mid", "nostalgic relaxed", "travelling background cosy_evening", ALL_AUD, "The only song for the last leg of the journey."),
  e("a-spaceman-came", "A Spaceman Came Travelling", "Chris de Burgh", "retro", "low", "nostalgic relaxed", "background cosy_evening", GROWN, "Odd, gentle and strangely festive."),
  e("2000-miles", "2000 Miles", "The Pretenders", "retro", "low", "nostalgic relaxed romantic", "cosy_evening background", GROWN, "Wintry and quietly sad in a lovely way."),
  e("thank-god-its-christmas", "Thank God It's Christmas", "Queen", "retro", "mid", "nostalgic singalong", "party background", ALL_AUD, "Underrated and made for a big room."),
  e("another-rock-and-roll", "Another Rock and Roll Christmas", "Gary Glitter", "retro", "high", "party", "party", GROWN, "Listed for completeness only — most households now skip it.", { familySafe: false }),
  e("saviours-day", "Saviour's Day", "Cliff Richard", "retro", "mid", "traditional nostalgic", "christmas_morning background", ALL_AUD, "A gentle nineties Christmas number one."),
  e("peace-on-earth-bowie", "Peace on Earth / Little Drummer Boy", "David Bowie & Bing Crosby", "classic", "low", "crooner nostalgic choral", "christmas_eve background christmas_dinner", ALL_AUD, "Two eras of Christmas singing in one duet."),
  e("christmas-wrapping", "Christmas Wrapping", "The Waitresses", "retro", "mid", "nostalgic party modern", "wrapping party cooking", GROWN, "Chatty, clever and great while you wrap."),
  e("i-believe-in-father-christmas", "I Believe in Father Christmas", "Greg Lake", "retro", "mid", "nostalgic traditional", "background cosy_evening", GROWN, "Thoughtful, with a huge orchestral middle."),

  // ── Modern classics and recent releases ──────────────────────────────
  e("all-i-want", "All I Want for Christmas Is You", "Mariah Carey", "modern", "high", "party joyful singalong", "party decorating cooking singalong", ALL_AUD, "The modern anthem — everyone joins in eventually."),
  e("underneath-the-tree", "Underneath the Tree", "Kelly Clarkson", "modern", "high", "party joyful modern", "party cooking decorating", ALL_AUD, "Big, bright and built for a busy kitchen."),
  e("its-beginning-buble", "It's Beginning to Look a Lot Like Christmas", "Michael Bublé", "modern", "mid", "crooner jazzy relaxed", "christmas_dinner background decorating", ALL_AUD, "Crooner polish with modern production."),
  e("holly-jolly-buble", "Holly Jolly Christmas", "Michael Bublé", "modern", "mid", "crooner joyful singalong", "christmas_morning cooking background", ALL_AUD, "Sunny and effortless — good morning music."),
  e("santa-baby-buble", "Santa Claus Is Coming to Town", "Michael Bublé", "modern", "mid", "crooner joyful", "christmas_dinner background party", ALL_AUD, "A safe crowd-pleaser for a mixed room."),
  e("cozy-little-christmas", "Cozy Little Christmas", "Katy Perry", "recent", "mid", "modern relaxed romantic", "cosy_evening wrapping background", GROWN, "Modern, mellow and easy to have on."),
  e("christmas-tree-farm", "Christmas Tree Farm", "Taylor Swift", "recent", "mid", "modern nostalgic joyful", "decorating wrapping travelling", "oc te ya cp mx ex al", "Nostalgic pop for putting the tree up."),
  e("like-its-christmas", "Like It's Christmas", "Jonas Brothers", "recent", "high", "modern party", "party cooking", "te ya cp an mx", "Newer party pop for a younger room."),
  e("mistletoe-bieber", "Mistletoe", "Justin Bieber", "modern", "mid", "modern romantic", "wrapping cosy_evening background", "oc te ya", "A teenage-era favourite that still gets played."),
  e("santa-tell-me", "Santa Tell Me", "Ariana Grande", "modern", "mid", "modern party romantic", "party wrapping cooking", "te ya cp an mx", "Modern, catchy and impossible to ignore."),
  e("one-more-sleep", "One More Sleep", "Leona Lewis", "modern", "mid", "modern joyful singalong", "christmas_eve party cooking", ALL_AUD, "Counting down, in the nicest way."),
  e("wrapped-in-red", "Wrapped in Red", "Kelly Clarkson", "modern", "mid", "modern romantic relaxed", "cosy_evening background", GROWN, "Warm and vocal-led for the evening."),
  e("its-the-most-wonderful", "It's the Most Wonderful Time of the Year", "Andy Williams", "classic", "high", "nostalgic joyful singalong", "decorating christmas_morning party", ALL_AUD, "The reliable start-of-December switch-on."),
  e("happy-holiday-williams", "Happy Holiday / The Holiday Season", "Andy Williams", "classic", "mid", "nostalgic joyful", "cooking background decorating", ALL_AUD, "Retro cheer that suits a busy house."),
  e("christmas-lights", "Christmas Lights", "Coldplay", "modern", "mid", "modern nostalgic relaxed", "cosy_evening background christmas_eve", GROWN, "Quietly emotional and beautifully wintry."),
  e("river", "River", "Joni Mitchell", "classic", "low", "nostalgic relaxed", "cosy_evening background", "ya cp an al", "For the reflective, slightly melancholy hour."),
  e("winter-song", "Winter Song", "Sara Bareilles & Ingrid Michaelson", "modern", "low", "relaxed romantic modern", "cosy_evening background", GROWN, "Two voices, one fireplace."),
  e("oh-santa", "Oh Santa!", "Mariah Carey", "modern", "high", "party joyful modern", "party cooking", "te ya cp an mx", "Full-volume festive pop."),
  e("hallelujah-christmas", "Hallelujah", "Various festive arrangements", "modern", "low", "choral relaxed nostalgic", "christmas_eve background cosy_evening", GROWN, "Often sung at carol services and just as good at home."),
  e("please-come-home", "Please Come Home for Christmas", "Various artists", "classic", "low", "nostalgic romantic relaxed", "cosy_evening background", GROWN, "Bluesy longing for anyone away from home."),

  // ── Children's favourites ────────────────────────────────────────────
  e("must-be-santa", "Must Be Santa", "Traditional / Bob Dylan version", "classic", "high", "children comic singalong", "singalong party decorating", "yc oc mx ex", "A call-and-response romp children adore."),
  e("when-santa-got-stuck", "When Santa Got Stuck up the Chimney", "Traditional", "classic", "mid", "children comic singalong", "singalong travelling", "yc oc mx ex", "Silly enough to get proper giggles."),
  e("i-saw-mommy-kissing", "I Saw Mommy Kissing Santa Claus", "The Ronettes", "classic", "mid", "children nostalgic joyful", "decorating singalong background", ALL_AUD, "A cheeky classic that always raises a smile."),
  e("santa-claus-is-a-busy-man", "Little Donkey", "Traditional", "carol", "low", "children traditional singalong", "singalong christmas_eve background", "yc oc mx ex", "The nativity-play staple, still lovely at home."),
  e("mary-had-a-baby", "Mary Had a Baby", "Traditional", "carol", "low", "children traditional", "background christmas_eve", "yc oc mx ex", "Simple and gentle for the youngest listeners."),
  e("snowman-walking", "Walking in the Air", "From The Snowman", "classic", "low", "children nostalgic relaxed", "christmas_eve cosy_evening background", ALL_AUD, "Instantly transports anyone who grew up with it."),
  e("frozen-let-it-go", "Let It Go", "From Frozen", "modern", "high", "children singalong joyful", "singalong party travelling", "yc oc mx", "Not strictly Christmas, but it will be requested."),
  e("polar-express-believe", "Believe", "From The Polar Express", "modern", "mid", "children nostalgic singalong", "christmas_eve travelling singalong", "yc oc mx ex", "Made for the drive to see the lights."),
  e("hot-chocolate-song", "Hot Chocolate", "From The Polar Express", "modern", "high", "children joyful comic", "cooking singalong travelling", "yc oc mx", "Pure sugar — the children will love it."),
  e("christmas-is-all-around", "Christmas Is All Around", "From Love Actually", "modern", "mid", "comic nostalgic singalong", "party background", GROWN, "Cheerfully ridiculous, exactly as intended."),
  e("all-i-want-glee", "Reindeer songs medley", "Family playlist idea", "modern", "high", "children singalong joyful", "travelling singalong party", "yc oc mx ex", "String the reindeer songs together for the car.", { type: "playlist_idea" }),

  // ── Instrumental, jazz and background ────────────────────────────────
  e("nutcracker-suite", "The Nutcracker Suite", "Tchaikovsky", "classic", "mid", "traditional relaxed choral", "background christmas_dinner cooking", ALL_AUD, "Elegant, wordless and endlessly reusable.", { type: "album" }),
  e("messiah-hallelujah", "Messiah — Hallelujah Chorus", "Handel", "classic", "high", "choral traditional", "christmas_morning background", GROWN, "Ceremonial and thrilling for the big moment."),
  e("christmas-oratorio", "Christmas Oratorio", "J. S. Bach", "classic", "low", "choral traditional relaxed", "background christmas_dinner", GROWN, "Serious, beautiful background music.", { type: "album" }),
  e("charlie-brown-christmas", "A Charlie Brown Christmas", "Vince Guaraldi Trio", "classic", "low", "jazzy relaxed nostalgic", "background wrapping christmas_dinner cosy_evening", ALL_AUD, "The single most useful Christmas album to own.", { type: "album" }),
  e("ella-wishes", "Ella Wishes You a Swinging Christmas", "Ella Fitzgerald", "classic", "mid", "jazzy crooner relaxed", "christmas_dinner party background", GROWN, "Warm jazz vocals from start to finish.", { type: "album" }),
  e("a-christmas-gift-for-you", "A Christmas Gift for You", "Phil Spector's wall-of-sound classic", "classic", "high", "nostalgic party joyful", "decorating party cooking", ALL_AUD, "Retro and enormous — great while you decorate.", { type: "album" }),
  e("kings-college-carols", "Nine Lessons and Carols", "Choir of King's College, Cambridge", "carol", "low", "choral traditional relaxed", "christmas_eve background christmas_morning", ALL_AUD, "Traditional carolling to have on all afternoon.", { type: "album" }),
  e("winter-piano", "Quiet Christmas piano", "Instrumental playlist idea", "modern", "low", "relaxed jazzy", "background christmas_dinner cosy_evening wrapping", ALL_AUD, "Wordless piano for when you want calm.", { type: "playlist_idea" }),
  e("christmas-strings", "Christmas strings and orchestra", "Instrumental playlist idea", "modern", "low", "relaxed traditional", "christmas_dinner background", ALL_AUD, "Keeps dinner conversation front and centre.", { type: "playlist_idea" }),
  e("jazz-fireside", "Fireside Christmas jazz", "Instrumental playlist idea", "modern", "low", "jazzy relaxed romantic", "cosy_evening background christmas_dinner", GROWN, "Low lights, low volume, very good jazz.", { type: "playlist_idea" }),

  // ── Playlist ideas by moment ─────────────────────────────────────────
  e("pl-decorating", "Tree-decorating playlist", "A Complete Christmas idea", "modern", "high", "joyful party singalong nostalgic", "decorating", ALL_AUD, "Big, bright and loud enough to work to.", { type: "playlist_idea" }),
  e("pl-wrapping", "Late-night wrapping playlist", "A Complete Christmas idea", "modern", "low", "relaxed jazzy nostalgic", "wrapping cosy_evening", GROWN, "Calm music for the sellotape-and-scissors hour.", { type: "playlist_idea" }),
  e("pl-cooking", "Christmas kitchen playlist", "A Complete Christmas idea", "modern", "high", "party joyful singalong", "cooking", GROWN, "Keeps you going through the peeling and the roasting.", { type: "playlist_idea" }),
  e("pl-dinner", "Christmas dinner playlist", "A Complete Christmas idea", "modern", "low", "jazzy crooner relaxed", "christmas_dinner", ALL_AUD, "Present but never louder than the conversation.", { type: "playlist_idea" }),
  e("pl-morning", "Christmas morning playlist", "A Complete Christmas idea", "modern", "mid", "joyful children nostalgic", "christmas_morning", ALL_AUD, "Cheerful from the first present to breakfast.", { type: "playlist_idea" }),
  e("pl-eve", "Christmas Eve playlist", "A Complete Christmas idea", "modern", "low", "choral traditional relaxed", "christmas_eve", ALL_AUD, "Winding down towards bedtime and the last jobs.", { type: "playlist_idea" }),
  e("pl-party", "Christmas party playlist", "A Complete Christmas idea", "modern", "high", "party singalong joyful modern", "party", GROWN, "Front-loaded with the songs everyone shouts along to.", { type: "playlist_idea" }),
  e("pl-singalong", "Family singalong playlist", "A Complete Christmas idea", "modern", "mid", "singalong children joyful choral", "singalong", ALL_AUD, "Carols and choruses everybody actually knows.", { type: "playlist_idea" }),
  e("pl-travel", "Car journey playlist", "A Complete Christmas idea", "modern", "mid", "singalong children joyful nostalgic", "travelling", ALL_AUD, "Enough variety to survive the motorway.", { type: "playlist_idea" }),
  e("pl-quiet", "Quiet Christmas playlist", "A Complete Christmas idea", "modern", "low", "relaxed choral nostalgic", "background cosy_evening", "al cp an ya", "Gentle company for a slower Christmas.", { type: "playlist_idea" }),
  e("pl-modern", "Modern Christmas playlist", "A Complete Christmas idea", "recent", "high", "modern party joyful", "party cooking wrapping", "te ya cp an mx", "Nothing older than the people in the room.", { type: "playlist_idea" }),
  e("pl-children", "Little ones' playlist", "A Complete Christmas idea", "modern", "high", "children singalong comic joyful", "singalong travelling decorating", "yc oc mx ex", "Short, silly and repeatable without complaint.", { type: "playlist_idea" }),
  e("pl-boxing-day", "Boxing Day playlist", "A Complete Christmas idea", "modern", "mid", "relaxed jazzy nostalgic", "background cosy_evening cooking", ALL_AUD, "Leftovers, board games and nothing too demanding.", { type: "playlist_idea" }),
  e("pl-carols", "Carols by candlelight", "A Complete Christmas idea", "carol", "low", "choral traditional relaxed", "christmas_eve background", ALL_AUD, "Traditional carols in one continuous run.", { type: "playlist_idea" }),
  e("pl-romantic", "Christmas for two", "A Complete Christmas idea", "modern", "low", "romantic jazzy relaxed crooner", "cosy_evening christmas_dinner", "cp ya an", "Crooners, jazz and slow songs, nothing else.", { type: "playlist_idea" }),
];

export const MUSIC_IDEAS_BY_KEY = new Map(MUSIC_IDEAS.map((i) => [i.key, i]));

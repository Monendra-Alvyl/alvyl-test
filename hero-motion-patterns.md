# Home hero — how the birds and the cursor move

**Scope:** the Home hero only. This explains, first in plain words and then in exact values, how the flock of birds flies and how the cursor (the glowing sun) moves and affects it.
**Source:**
- `src/lib/murmuration.ts`: the flock, the falcon hole, the tap scatter;
- `src/lib/sun.ts`: the sun's random core and rays;
- `src/styles/motion.css`: the sun's halo;
- `src/pages/home/sections/Hero.tsx`: scroll, pointer and clicks.

As built on 28 Sep 2026.
**Pictures:** frame sequences captured from the production build at 1440 × 900, in [`hero-motion/`](hero-motion/).
**Units:** the flock is measured in *flock units*; on a 1440 × 900 screen, **1 unit ≈ 133 px**.

---

## Part 1 — The bird movement pattern

### 1.1 In one paragraph

The birds fly like a real starling murmuration. There's no pre-drawn animation and no fixed shape. An invisible **leader** wanders around the sky on a smooth, never-repeating path, and every bird follows the exact route the leader took a few seconds earlier, each at its own delay. Because the whole flock traces the leader's recent path, every turn the leader makes sweeps through the body of the flock like a wave. That's what makes it look like one living thing made of thousands of individuals.

![The flock over 5 seconds, no cursor](hero-motion/1-flight-over-time.png)

*One second apart, with no cursor on the card. The flock drifts, stretches and folds on its own.*

### 1.2 The layers of the pattern

The movement is built from eight layers, each added on top of the one before:

| # | Layer | What you see | How it works |
|---|---|---|---|
| 1 | **Leader path** | The flock wanders smoothly around the whole card, sometimes past its edges | An invisible point moves along a path made of five slow sine waves (below). Their periods don't line up, so the path never repeats during a visit. |
| 2 | **Body along the path** | A long ribbon of birds following one route | Each bird has a fixed place along the body, from head to tail. It sits where the leader was *place × body length* seconds ago. |
| 3 | **Three flocks** | Several groups at once, so the whole card is alive | Every bird belongs to one of three flocks, which fly the same path 9 s apart. |
| 4 | **Cross-section** | The ribbon has width and depth, not a single line | Birds spread across and into the body. It tapers at both ends and slowly breathes wider and narrower. |
| 5 | **Twist** | The ribbon folds into curling sheets | The cross-section rotates along the body's length and slowly over time. |
| 6 | **Density waves** | Ripples of bunching that run down the flock | A small back-and-forth shift along the body, travelling from head to tail. |
| 7 | **Stragglers** | A few lone birds drift across the sky | 6% of birds ignore the flock and wander slowly over the whole card. |
| 8 | **Flutter and wingbeat** | Each bird twitches and flaps on its own | A small personal jitter, plus a wingbeat of about 1.3–2 flaps per second, different for every bird. |

Colour, size and brightness sit on top of the movement:
- **Colour:** it depends on where a bird is *on the screen*, orange (#CE521D) at the top-left shading to red (#CE1D1E) at the bottom-right. The flock changes colour as it travels.
- **Green corner:** in the far bottom-right, as in the design's original hero art, birds warm back to orange, pass through a golden step, and turn green (`--color-positive` #85C786, up to 90%). The flock carries a touch of green whenever it flies through that corner. This is on the Home hero only; the service pages' flocks stay orange and red.
- **Size and brightness:** nearer birds are drawn larger and brighter, farther birds smaller and fainter.
- **Glow:** where birds overlap, their light adds up, so dense parts glow.
- **Banking:** birds tilt slightly in the direction the flock is turning.

### 1.3 The leader's path

```
x(t) = sin(0.23 t) × 1.00 + sin(0.37 t + 1.3) × 0.45      periods ≈ 27 s and 17 s
y(t) = sin(0.29 t + 0.7) × 0.45 + sin(0.53 t) × 0.20      periods ≈ 22 s and 12 s
z(t) = sin(0.19 t + 2.1) × 0.80                            period  ≈ 33 s   (depth, toward/away from you)
```

- **Horizontal:** the path swings across ±1.45 units. It's slightly wider than the card on desktop, so parts of the flock sweep in from and out past the edges.
- **Vertical:** ±0.65 units.
- **Depth:** ±0.8 units, which is why birds grow and shrink as the flock comes toward you and goes away.
- **Starting point:** the flock starts mid-flight (20 s into its path), so it's already moving naturally on the first frame.

### 1.4 How the body follows the leader

```
      leader now ●
                  ╲___
    birds near the head  ●●●●●╲
                               ●●●●●●●●●╲___            each bird = where the leader was
                                            ●●●●●●●●●●●  "its place × body length" seconds ago
                                              birds near the tail
```

- **Placement:** a bird's place runs from 0 (head) to 1 (tail), and most birds sit in the middle. The body is densest in the middle and along its centre line, and thins out at the ends.
- **Body length** is measured in seconds of the leader's path. A long body (22 s) is a long thin stream; a short one (6 s) is a compact cloud.
- **Turns:** when the leader turns, the head turns first and the turn travels back through the body. This is the signature "wave" of a murmuration.

### 1.5 Scrolling changes how the flock flies

Each of the six hero screens has its own **flight style**. As you scroll, the flock blends smoothly from one style to the next; it never jumps.

![The six flight styles](hero-motion/4-flight-styles.png)

| Screen | Style | Body length | Width | Twist | Special | Speed | Looks like |
|---|---|---|---|---|---|---|---|
| 1 Headline | Long ribbon | 16 s | 0.75 | 5 | — | 1.0× | a flowing ribbon crossing the sky |
| 2 Product Design | Wide folding sheet | 10 s | 1.2 | 9 | — | 0.8× | a broad sheet curling over on itself |
| 3 SRE | Two flocks | 12 s | 0.65 | 5 | split | 1.1× | each flock divides into two groups flying apart |
| 4 Agentic AI | Swirling ball | 6 s | 0.75 | 4 | ball | 0.7× | birds gather into a dense, rotating sphere |
| 5 IoT & ML | Long stream | 22 s | 0.5 | 3 | — | 1.3× | a long, thin, fast stream |
| 6 Invitation | Ribbon again | 14 s | 0.8 | 5 | — | 0.9× | back to a calm ribbon |

What each setting does:
- **Split:** half the birds of each flock fly 6 s behind the other half on the path, so each flock becomes two.
- **Ball:** birds are pulled into a sphere around a point on the leader's path. Each bird circles inside the sphere at its own angle, about 0.9 radians per second.
- **Speed:** how fast the flock moves along its path.

**How the blend works:**
- Each screen **holds** its style for the first and last 30% of its scroll distance and blends in the middle 40%.
- The flock also eases toward the new style over about 0.16 s, so even a fast scroll produces a smooth change.

**Where each style happens.** The hero **starts already pinned**: from the first frame the card fills the screen with the header floating over it, and scrolling doesn't move the card until the story ends. At 1440 × 900 the story takes the first **2,764 px** of scrolling, about **553 px per screen**:

| Screen | Flock holds its style | Flock blends to the next | Text on screen |
|---|---|---|---|
| 1 Headline — long ribbon | 0 → 166 px | 166 → 387 | 0 → 276 |
| 2 Product Design — folding sheet | 387 → 719 | 719 → 940 | 276 → 829 |
| 3 SRE — two flocks | 940 → 1,272 | 1,272 → 1,493 | 829 → 1,382 |
| 4 Agentic AI — swirling ball | 1,493 → 1,825 | 1,825 → 2,046 | 1,382 → 1,935 |
| 5 IoT & ML — long stream | 2,046 → 2,378 | 2,378 → 2,599 | 1,935 → 2,488 |
| 6 Invitation — ribbon again | 2,599 → 2,764 | — | 2,488 → 2,764 |

The text switches halfway through each blend, so new words arrive while the flock is changing formation. After 2,764 px the card un-pins and the next section scrolls up.

### 1.6 When the birds start and stop

- **Start:** the page opens already pinned, on the night sky with the headline. As soon as the flock's first frame has been drawn (it's drawn on a background thread, so the page stays responsive), it **fades in over 1.5 s**, already mid-flight.

The flock only moves while it can be seen:
- **Hero off screen:** it stops, using no power.
- **Browser tab hidden:** it stops.
- **Pause pressed:** it freezes exactly where it is.

---

## Part 2 — The cursor movement pattern

### 2.1 In one paragraph

Over the hero, the mouse pointer becomes a small **glowing sun**: a white-hot centre with a lumpy, shifting core and rays of light that flare up and die away at random, so it never looks the same twice. The sun follows the mouse exactly, with no delay. The flock treats that point as a **falcon**: birds close to it flee outward and leave a hole with a random, ever-changing outline, and birds a little farther away catch the sun's light and turn pale. The flock's sense of where the falcon is lags about a tenth of a second behind the sun. So when you move the mouse, the hole trails just behind the sun like a wake, and it closes up again after the sun has passed.

![Cursor sweeping across the sky](hero-motion/2-cursor-sweep.png)

*Moving right: the hole and the ring of lit birds trail slightly behind the sun. When the cursor stops, the hole catches up and settles around it, though never into a perfect circle.*

### 2.2 The two parts of the cursor

| | **The sun** (what you see) | **The falcon** (what the birds feel) |
|---|---|---|
| What it is | A 130 × 130 px glow, drawn by the page | An invisible point inside the flock |
| Follows the mouse | **Exactly**, every pointer move | **Smoothly**, catching up in about 0.1 s |
| Shown for | Mouse only (not touch or pen) | Any pointer moving over the card |
| Appears / disappears | Fades in when the mouse moves over the card; fades out in 0.3 s when it leaves | Its strength fades in and out over about 0.15 s |
| Shape | **Random, never repeating** (drawn live by `src/lib/sun.ts`). The white-hot centre glow is from the original sun. On top of it is a blob core: 9 edge points, each drifting toward new random radii, with the whole core wandering up to 1.6 px off-centre. 10 rays of light are each born at a random angle, length (14–50), width and strength; each flares up, fades out over 0.7–2.8 s and is replaced by a new random ray. The halo's outline and the sun's size (0.94–1.1×) also drift toward new random targets. | The hole's outline is random too (below) |
| Runs | Only while the sun is showing (mouse over the hero) | — |

Having two parts is deliberate:
- **The sun has no lag,** so it feels precise, like a real cursor.
- **The falcon's small lag** makes the birds look as if they're reacting to it, not glued to it.

### 2.3 What the falcon does to the birds

| Zone (distance from the falcon) | Effect | Size at 1440 × 900 |
|---|---|---|
| **Close:** fades out by about 0.7 units | Birds are pushed straight away from the falcon, up to 0.8 units, and a little toward you | a clear hole about **100–150 px** across its radius |
| **Around it:** fades out by about 2 units | Birds catch the light: colour shifts up to 70% toward pale grey (#D6D6D6), and they become up to twice as bright | a pale glowing ring about **265 px** out |
| **Far** | No effect; the flock flies normally | — |

Both effects fade smoothly with distance, so there's no hard edge. As the falcon moves on, birds return to their places in the flock and the hole closes behind it.

**The hole has no regular shape.** Four things make it random:

| Irregularity | What you see | How |
|---|---|---|
| **Random outline** | Lumps and bays that form, drift and dissolve, never repeating | The hole's size in each direction is read from a smooth random-noise field (two layers, fine and coarse) that keeps drifting over time. The size varies between about 40% and 125%, and the light ring follows the same shape. |
| **Wandering centre** | The hole isn't exactly centred on the sun | Its centre drifts randomly up to about ±0.2 units (~27 px) around the cursor |
| **Ragged edge** | Some birds hold their ground close to the sun while others flee early | Each bird has its own nerve: its fleeing distance is scaled by a random 0.35–1.65 |
| **Teardrop wake** | When the cursor moves, the hole stretches out behind it | The falcon's speed is measured each frame. Birds *behind* it (opposite its direction of travel) flee from farther away, and more so the faster it moves (up to 75% more), so the hole trails like a wake and rounds up again when the cursor stops. |

### 2.4 The cursor's style on the page
- **Over the hero card:** the system cursor is hidden and the sun is the cursor (mouse users only).
- **Everywhere else on the site:** the normal system cursor.
- **Over the CTA and controls:** the normal pointer appears as well (known issue).
- **Touch screens:** there's no sun; a tap scatters the flock instead (next section).

---

## Part 3 — Tap or click: scattering the flock

### 3.1 In one paragraph

A **tap or click on the sky** sends a shockwave through the flock from that point. Birds nearest the tap burst outward first, farther birds a split second later as the wave reaches them. Each bird flies out with a little sideways swirl and some depth, flashing pale as it goes. Then the push fades, and the birds fly back into the flock by themselves within about two seconds.

![Tap-to-scatter over 2.2 seconds](hero-motion/3-tap-scatter.png)

### 3.2 Timing and size

| Property | Value | At 1440 × 900 |
|---|---|---|
| Wave speed | 8 units per second | ≈ **1,060 px/s**, so it crosses the card in under a second |
| Strength over time | Rises quickly, peaks at **0.28 s**, then fades | back in the flock by ~**2 s** |
| Reach | Strongest at the tap, fading out by about 4.2 units | ≈ **560 px** radius |
| Push | Up to 2.2 units outward, with a random sideways swirl and a push toward or away from you | up to ≈ **290 px** |
| Variety | Each bird's push is scaled by a random 0.6–1.4 | — |
| Light | Scattered birds flash toward pale grey | — |

### 3.3 Rules
- **Taps on links or buttons** (the CTA, service names, Skip, Pause) do their normal job and don't scatter.
- **It uses a click, not a touch-down,** so starting a scroll on a phone never triggers it.
- **On phones,** the reach and push shrink with the card's width, so a tap feels the same as on desktop.
- **A new tap** restarts the burst from the new point.
- **While paused,** tapping does nothing.

---

## Part 4 — How the three motions combine

Every frame, for every bird, the motions are applied in this order:

```
1. Flight        → the bird's place in the flock (leader path, body, three flocks, twist, waves,
                   current flight style, stragglers, flutter)
2. Scatter       → pushed out by the last tap's shockwave, if one is still running
3. Falcon        → pushed away from the cursor, and lit by the sun
4. Draw          → size and brightness from depth, colour from screen position, wingbeat
```

The layers simply add together:
- Moving the cursor during a scatter makes a hole inside the burst.
- Scrolling during either changes the flight style underneath.

When every push has faded, each bird is back exactly where the flight pattern puts it. That's why the flock always "heals".

---

## Part 5 — Quick reference

| Motion | Trigger | Feels like | Duration / speed |
|---|---|---|---|
| Flight | always | a living murmuration | continuous; path periods 12–33 s |
| Start | page load | the flock appears, mid-flight | page opens pinned; flock fades in over 1.5 s once drawn |
| Style change | scroll | the flock changes formation | story runs 0 → 2,764 px at 1440 × 900; blends over 40% of each 553 px step, eases over ~0.16 s |
| Sun | mouse move over the card | a glowing cursor with a white-hot centre | follows instantly; random core, rays and size, never repeating |
| Falcon hole | mouse move over the card | birds fleeing a predator | follows with ~0.1 s lag; hole ~100–150 px with a random, ever-changing outline; stretches into a wake when moving |
| Sun light | mouse move over the card | birds catching the light | ring ~265 px |
| Scatter | tap / click on the sky | a clap sending birds flying | peak 0.28 s, regroups by ~2 s, wave 1,060 px/s |
| Stop | hero off screen, tab hidden, or Pause | — | instant |

**Reduced motion:** none of this runs. Visitors see a still night-sky card with the headline.

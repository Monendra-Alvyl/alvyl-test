# Home hero — how the flock and the orb move

**Scope:** the Home hero only: what moves, why each motion exists, its exact values, and the quality
bar it is held to.
**Source:**
- `src/lib/murmuration.ts`: the flock, the influence and the pulse;
- `src/lib/sun.ts`: the orb's drifting core;
- `src/styles/motion.css`: the orb's halo and breathing;
- `src/pages/home/sections/Hero.tsx`: scroll, cursor, taps, pause and calm mode;
- `index.html`: chooses story mode or calm mode before first paint.

As built on 1 Oct 2026. Pixel values are for a 1440 × 900 screen, where the hero card is
1376 × 836 px.

---

## The idea

Alvyl is short for **Alchemy Village**. The village is people: individuals who become something
greater together. Alchemy is the craft of energy, the force that makes the synergy happen. The hero
shows exactly that, with **four parts and nothing else**:

| Part | Stands for | What it does |
|---|---|---|
| **1 The flock** | the village | thousands of birds, each with its own place and its own small wandering, flying as one body |
| **2 The orb** | the alchemy | a quiet point of energy that is the visitor's cursor |
| **3 Influence** | the synergy | near the orb, birds warm in colour and fly more in step; nobody is steered |
| **4 The pulse** | the village answering | a tap sends a soft wave; the birds lean toward it together, then settle |

**Minimalism** is why there are only four parts. Everything that didn't serve the idea was removed:
three separate flocks, the brighter "lead" birds, stragglers, drawn-on density waves, the twisting
sheets, the split, the ball, the green corner and the six named formations.
**Mastery** is the quality bar in Part 6: every target is written down, met in the build and checked.

---

## Part 1 — The flock: the village

### Why it exists
The village is many people, not one mass. Every bird keeps its own place and its own slow wandering,
yet the whole flock flies one course together. Scrolling tells the village's story: individuals at
the headline, one close-knit body by the invitation.

### What you see
One flock covering the card. Its outline is never a clean shape: it bulges, pinches and frays as it
flies. Where its course slows into a turn it bunches up, and where the course speeds up it thins out.
When the course turns, the turn sweeps through the body like a wave. The flock wanders past the
headline, around the card and back, and never repeats during a visit.

### How it works
1. **Its course.** An invisible point wanders on five slow sine waves whose periods never line up:
   ```
   x(t) = sin(0.23 t) × 0.85 + sin(0.37 t + 1.3) × 0.30      ±617 px   periods ≈ 27 s and 17 s
   y(t) = sin(0.29 t + 0.7) × 0.36 + sin(0.53 t) × 0.14      ±268 px   periods ≈ 22 s and 12 s
   z(t) = sin(0.19 t + 2.1) × 0.60                            depth     period  ≈ 33 s
   ```
   It answers to nothing, not the scroll and not the orb, so the village always has a life of its own.
   The flock starts 20 s into this course, already mid-flight.
2. **Its body.** Each bird has a fixed home: a place from head (0) to tail (1), and a spot in a soft,
   round cross-section, denser toward the middle. It sits where the course was *place × body length*
   seconds ago. The cross-section tapers at the head and the tail.
3. **Its outline.** Two scales of slow noise push the cross-section in and out along the body and
   over time. The outline swells to about 1.6× in places and pinches to about ¼ in others: knots and
   necks, never an ellipse.
4. **Each bird's own wandering.** Every bird strays from its home on its own slow, smooth course. It
   strays a lot when the flock is loose and hardly at all once it has gathered.
5. **Depth.** Nearer birds are larger and brighter. Far birds sink into the dark, down to 15% of a
   near bird's brightness.
6. **Colour.** It depends on where a bird is on screen: orange (#CE521D) at the top left, shading to
   red (#CE1D1E) at the bottom right. Orange and red only, everywhere.
7. **Wings.** Each bird flaps 1.3–2 times a second at its own pace and banks slightly into the
   flock's turns.

### The story: scroll changes the mood, not the shape
| | Loose (screen 1, the headline) | Gathered (screen 6, the invitation) |
|---|---|---|
| Body length | 26 s of its course | 18 s |
| Body radius | ≈ 300 px | ≈ 225 px |
| Each bird strays | up to ≈ ±134 px | up to ≈ ±21 px |
| Speed along the course | 0.8× | 0.6× |

The mood follows the scroll position continuously, from 0 to 1 across the six screens. Nothing is
held and nothing switches formation; the flock simply keeps drawing closer together. It also eases
toward the scroll position over about 0.2 s, so a fast scroll or Skip intro never snaps it.

At 1440 × 900 the story takes the first **2,764 px** of scrolling, about 553 px per screen:

| Screen | Text on screen (px) | Mood |
|---|---|---|
| 1 Headline | 0 → 276 | loose |
| 2 Product Design | 276 → 829 | drawing in |
| 3 SRE | 829 → 1,382 | closer |
| 4 Agentic AI | 1,382 → 1,935 | closer still |
| 5 IoT & ML | 1,935 → 2,488 | nearly gathered |
| 6 Invitation | 2,488 → 2,764 | gathered |

### Start and stop
- **Start:** the page opens already pinned. Once the first frame is drawn (on a background thread,
  so the page stays responsive), the flock fades in over 1.5 s, already mid-flight.
- **Stop:** it stops while the hero is off screen or the tab is hidden, and freezes in place when
  Pause is pressed.

---

## Part 2 — The orb: the alchemy

### Why it exists
Alchemy is energy: the force that makes the village more than its people. The orb is that energy,
held deliberately small and quiet. It's felt the way afternoon sun is felt, not watched like a
spotlight. It is the visitor's cursor, so the visitor carries the energy into the village.

### What you see
Over the card, the mouse pointer becomes a small, uneven, glowing core with a very faint warmth
around it. It follows the mouse exactly and **never moves on its own**.

| | Value |
|---|---|
| Core | A soft, uneven blob about 10–14 px across: 9 edge points, each easing toward new random radii (4.8–7.2 px), never a perfect circle |
| Colour | Orange and red only: a warm orange centre through Alchemy orange to Alchemy red at the rim; never white, gold or pale |
| Close glow | A restrained halo inside its 130 px box, breathing between 1× and 1.03× every 7 s; it never flares |
| Far halo | About 900 px across, at 3–6% opacity, fading to nothing well before its edge: light that reaches far without making a bright spot |
| Follows | The mouse, exactly, with no lag (measured: 0 px from the pointer) |
| Appears | Fades in where the pointer is (0.3 s) when the mouse moves over the card, so it never jumps in from somewhere else |
| Over text, links, buttons | Shrinks into the pointer and fades, so the normal cursor (hand, text cursor) works there |
| Leaves | Fades out where it was (0.3 s), and its light fades from the flock |
| Touch and pen | No orb: there is no cursor to become it |

---

## Part 3 — Influence: the synergy

### Why it exists
Synergy is not control. The energy doesn't steer anyone; near it, people simply move more as one and
warm toward each other. So the orb **never moves a bird**: no pull, no orbit, no pushing, no fleeing.

### What it does
| Near the orb | Effect |
|---|---|
| **Light** (within ≈ 66–115 px, a little different for every bird) | The bird deepens toward red and brightens a little: richer, never paler. The lit area has a soft, uneven edge. |
| **In step** (within ≈ 145 px) | Each bird's own wandering settles by up to 60%, so the birds near the orb fly visibly more in unison. |
| **Everywhere** | No change of course or position. Every bird stays exactly where its home and its own wandering put it. |

Earlier versions tried a falcon the flock fled from, a drag toward the cursor, a local lean, and a
pull-and-orbit. All of them read as the orb controlling the flock, and all were turned down. Only
light and unison survived.

---

## Part 4 — The pulse: the village answers

### Why it exists
When someone in a village calls, everyone turns toward them together, then carries on. A tap is that
call. The village answers; it doesn't scatter.

### What you see
A tap or click on the sky sends a soft wave out from that point. As it reaches them, the birds lean
toward the tap together and brighten. Then they ease back into place.

| | Value (1440 × 900) |
|---|---|
| Wave speed | ≈ 1,060 px/s, so near birds answer first |
| Strength | Rises, peaks 0.55 s after the wave reaches a bird, then fades out by about 2 s |
| Reach | Strongest at the tap, fading out by about 560 px |
| Movement | A lean toward the tap of up to ≈ 30 px; each bird answers in its own measure (0.6–1.4×) |
| Light | Answering birds deepen and brighten, the same light the orb gives |
| Several taps | Up to three waves run at once, so a new tap never cuts an earlier one off |

**Rules:**
- Taps on links and buttons do their normal job.
- A click, not a touch-down, triggers it, so starting a scroll on a phone never does.
- On phones the reach scales with the card, so it feels the same as on desktop.
- Nothing happens while paused.
- **No hint is offered.** It's there to be found, not announced.

---

## Part 5 — Calm mode: reduced motion

### Why it exists
Visitors who ask their device for reduced motion still belong in the village. They see the flock,
gently, without the parts of the hero that move a lot.

### What they see
The plain hero card (headline, sub-headline and button, no pinned story) with the same flock behind
it. The flock holds one mood (part-way gathered, so it reads as one body) and flies at **30% speed**,
wings included. There is no orb, no pulse and no scroll story. Pause is shown and stops it. Without
WebGL, every visitor gets the plain card without the flock.

---

## Part 6 — Mastery: the quality targets

| Target | How it's met | How it was checked (1 Oct 2026) |
|---|---|---|
| **Steady 60 fps, including on mid-range phones** | 5,000 birds on phones and tablets, 10,000 on desktop, half that on 4-core machines. Resolution is capped (1.5× on phones, 2× on desktop). Drawing runs off the main thread. A **frame-rate guard** watches the average frame time: past the first 3 s, if frames average over ~18.5 ms, a tenth of the flock fades out over about a second. It acts at most once every 2 s, never goes below 55% of the flock, and never adds birds back, so it can't flicker. | In headless Chromium, which renders on the CPU, the guard thinned the flock exactly as designed. **Not yet checked on a real mid-range phone.** That needs a check on a real device. |
| **No white in dense spots** | Each bird's light is capped, so overlapping birds add up to a richer red, never white. Light near the orb deepens toward red instead of lightening. | A pixel scan of the flock alone at 1440, 800 and 390 px wide: **0 white, 0 pale and 0 green pixels**. The brightest pixel was saturated orange, rgb(255, 135, 61). |
| **Distance fades into the dark** | Far birds drop to 15% of a near bird's brightness, and they're smaller. | Screenshots: the far side of the body visibly sinks into the sky. |
| **Nothing pops or jumps** | The orb fades in at the pointer and fades out where it left, never sliding in from somewhere else. A new tap never cuts off a running wave (three run at once). After a resize or a phone rotation, the flock's size and position ease to the new layout over about 0.5 s. The mood eases with scroll. The flock fades in on start. The frame-rate guard fades birds out instead of dropping them. The flock's clock never jumps after a hidden tab or a pause. | Orb measured at 0 px from the pointer, absent and still with no mouse, gone after the mouse leaves. Screenshots at every stage. |
| **The one deliberate instant** | Pause freezes the flock and the orb's breathing at once. That's the visitor's control (WCAG 2.2.2), so it must not ease. | — |
| **Reduced motion respected** | Calm mode (Part 5). | Checked with reduced motion turned on, desktop and phone: flock present, no orb, no story, Pause shown. |
| **Minimal** | Four parts only (see The idea). | Every line of the shader belongs to one of them. |
| **No errors** | — | No console errors at 1440, 800 and 390 px wide, or in calm mode. |

---

## Part 7 — How the parts combine

Every frame, for every bird, in this order:

```
1. Flock      → its home on the body (course, cross-section, outline noise)
3. Influence  → how near that home is to the orb: settles the bird's own wandering
1. Flock      → the bird's own wandering, scaled by the mood (loose → gathered) and that unison
4. Pulse      → a lean toward each running wave's source
3. Influence  → light near the orb, or from a passing wave: deeper red, never a move
   Draw       → size and brightness from depth, colour from its place on screen, wingbeat, light cap
```

Because the orb never moves a bird, and a wave's lean is small and always fades, the flock is always,
at every moment, almost exactly where its own flight puts it. There's nothing to recover from.

---

## Part 8 — Quick reference

| Motion | Trigger | Feels like | Values |
|---|---|---|---|
| Flock | always | a living village: one body, never a clean shape | course periods 12–33 s; covers the card |
| Mood | scroll | individuals drawing together into one body | loose → gathered over 2,764 px at 1440 × 900; continuous |
| Orb | mouse over the card | a quiet point of energy carried by the visitor | follows exactly; fades in and out in 0.3 s; breathes every 7 s |
| Influence | being near the orb | catching the light, moving in step | light ≈ 66–115 px; unison ≈ 145 px; no position change |
| Pulse | tap or click on the sky | the village answering, together | ≈ 1,060 px/s; peak 0.55 s; gone by ~2 s; lean ≤ 30 px |
| Calm | reduced motion | the same village, gently | 30% speed; no orb, pulse or story |
| Stop | hero off screen, tab hidden, Pause | — | instant |

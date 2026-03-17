---
name: visual-explanations
description: Create generated images or annotated screenshots when a visual artifact would explain a concept, design, flow, comparison, or observed UI state more clearly than prose alone. Use for concept cards, visual summaries, mockups, labeled screenshots, timelines, comparisons, and other explanation-first visuals. Do not use this skill when a simple Mermaid diagram in chat is sufficient.
---

# Visual Explanations

Use this skill when the explanation itself should become a visual artifact.

Mermaid does not need this skill. If a Mermaid diagram in chat is enough, use Mermaid directly and stop here.

## Step 1: Pick The Right Visual

- Use Mermaid directly for flows, architecture, plans, state machines, and other text-native diagrams.
- Use an annotated screenshot when you need to explain a real UI state, call out a specific element, or show evidence from an actual screen.
- Use a generated image when Mermaid is too rigid and the explanation needs custom layout, stronger composition, a side-by-side comparison, a concept card, a rough mockup, or a more designed visual summary.

Do not make an image just because you can. Use the lightest visual that makes the explanation clearer.

## Step 2: Define The Message First

Before drawing anything, write down:

- the one main point the visual should communicate
- which audience it is for
- whether it is evidence, explanation, or a conceptual sketch

One image should usually explain one idea.

## Step 3: Gather Source Material

For annotated screenshots:

- capture the real UI state first
- keep the untouched source screenshot available until the annotated version is verified
- identify the exact element or area that the callout should reference

For generated images:

- list the minimum facts, labels, or comparison points that must appear
- sketch the rough composition in words before building it
- prefer using the repo's existing facts or screenshots over inventing fake details

If the image is conceptual rather than a faithful representation of current UI, label it clearly in the visual or in the accompanying text.

## Step 4: Build With Simple, Deterministic Tools

Prefer straightforward local approaches:

- SVG for cards, timelines, comparisons, and lightweight custom layouts
- HTML/CSS rendered to an image when layout fidelity matters
- image-editing tools such as ImageMagick or Pillow for callouts, arrows, labels, crops, and overlays
- browser screenshots when the source needs to be a real page or app state

Do not over-engineer the rendering path. Favor the most reliable approach available in the current environment.

## Step 5: Design For Clarity

- highlight the exact thing you are explaining
- keep callout text short
- use large, legible type
- use strong contrast
- leave enough whitespace so the image still scans quickly
- prefer one or two callouts over covering the image in labels
- crop or frame the relevant area when the full screen adds noise

Good visuals feel obvious at a glance.

## Step 6: Verify The Output Yourself

Before sending the image:

- open or inspect the rendered result
- confirm it is not blank, clipped, washed out, or too tiny to read
- confirm arrows and labels point at the intended target
- confirm the image still makes sense without a long paragraph underneath it

Do not trust the generation step blindly.

## Step 7: Deliver Cleanly

- show the image directly in chat
- add one to three sentences that explain what the user should notice
- prefer a single strong visual over a pile of mediocre ones

If the artifact is only for the current conversation, store it in a temp or scratch location. If the user wants a durable asset in the repo, place it in the repo's normal docs or asset structure instead of inventing a new convention.

## Gotchas

- Do not make an image when Mermaid or a short paragraph would already explain the point cleanly.
- Do not annotate a screenshot until you have verified the source screenshot actually shows the right state.
- Do not bury the main message under too many callouts or labels. One image should usually explain one thing.
- Do not present a conceptual mockup as if it were a real current UI state. Label it clearly when it is illustrative.
- Do not trust the rendering step blindly; clipped text, tiny labels, and misplaced arrows are common failure modes.

## Keep This Skill Sharp

- Add new gotchas when the same visual clarity problem, screenshot mistake, or rendering failure keeps showing up.
- Tighten the description if the skill fires when Mermaid would have been enough or misses real requests for annotated screenshots and concept cards.
- If the same layout patterns or annotation helpers keep repeating, move them into reusable assets or scripts instead of rebuilding them from scratch.

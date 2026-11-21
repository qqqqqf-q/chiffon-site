---
title: After the Claude Code leak, the source isn't what's worth learning
description: Prompts and tool loops stopped being a moat long ago. From building Arkloop, the real difference in agent interaction is information density and narrative pacing.
date: 2026-03-31
lang: en
tags: [AI Agent, Claude Code, UI/UX, TUI]
categories: [Tech]
keywords: [Claude Code source leak, AI agent UI design, TUI information density, coding agent interaction design, Arkloop]
---

Today a developer at Anthropic forgot to filter out the source map when publishing an NPM package, and the Claude Code source got out. HN blew up immediately. I saw lots of people saying "going to reverse the Claude Code source today," as if it were some enormous event.

I spent an afternoon thinking about it. Here's my take: the source itself carries little new information. What's actually worth learning sits on a different layer.

---

## The prompt was never a secret

Start with the core layer. Claude Code's system prompt has been sitting in various leak repos for a long time. The prompt is the easiest thing to leak in any agent tool — put an LLM proxy in the middle, route every request through it, and everything comes out. No need to wait for a source leak.

If you're actually building something like Claude Code, that's the first thing you'd do. It's basic practice.

So for "understanding Claude Code's prompt design," today's leaked source map adds close to zero new information.

---

## The TUI design was always reversible

Next, the UI layer. Claude Code is a TUI built on the Ink (React for CLI) ecosystem, which is public. An experienced frontend developer can more or less figure out its interaction logic and rendering after a few hours of use. When I built [Arkloop](https://github.com/qqqqqf-q/Arkloop), I had no source to refer to, and I still arrived at everything that mattered.

A TUI isn't a GUI. There isn't much visual "black magic," and the structure is fairly transparent. Want to know how Claude Code's spinner works? It cycles through a few ASCII characters, `['·', '✢', '✳', '∗', '✻', '✽']`. People dug that up long ago.

So "learning TUI design from the source" doesn't mean much either.

---

## The one thing this leak is actually good for

I think there's only one: **checking whether Claude Code is quietly uploading your client information to Anthropic.**

People have worried about this for a while — whether account bans happen because Claude Code passes some environment information upstream. That worry used to be impossible to falsify; you could only guess. With the source in hand, you can now check: see where the telemetry boundary is, and whether there's any data collection not described in the docs.

That's the only question that needs the source to answer. For everything else, there was no need to wait for this leak.

---

## Why people are still excited

Because of the feeling of forbidden knowledge.

A black box turning transparent has a natural pull, even if there's nothing inside once you open it. For many people Claude Code is something mysterious, and suddenly "you can look inside" — so it instinctively feels important. But for anyone who has built something similar, they'd already guessed most of what's in the box. Reading the source just confirms what they know.

Most of the excitement comes from an illusion of information asymmetry — people think there's a secret hidden in there.

---

## What Claude Code is actually great at: controlling information density

This brings me to something more important, something I couldn't articulate before building Arkloop and only understood after.

What Claude Code is really good at isn't its tool design, or auto permission mode, or its implementation of the agentic loop. You can build all of that by referring to Codex and OpenCode — they're open source, the communities are mature, and their exec stability has been proven by lots of real users. That's far more practical than reversing a freshly leaked codebase.

The real thing in Claude Code is **controlling information density**.

When you use Claude Code, your eyes don't get tired. Every line of output is something you need. While a tool call runs, it gives you a line like `let me check the file structure first`. Technically that sentence means nothing, but it helps you build a mental model — where the agent is, what it's doing, and why. You're following along with it, not standing by waiting.

Compare a few similar tools and the difference is obvious:

- **Claude Code**: restrained natural-language transitions between tool calls, quiet collapsed sections by default, and each screen keeps only what you actually need to confirm at the current stage.
- **Droid**: strong agent execution, but almost no assistant narration in between — after the user's input it's a continuous stream of tool calls. The execution is there, the narrative is gone, and it feels like watching a black box run.
- **Copilot**: refined visual details, but progress bars, file paths, status labels, and badges stacked together are noise. Each component makes sense on its own; together on one screen they keep eating your attention.

The root of the problem: designers judge each feature locally as they add it. Nobody, at some point, scans the whole thing through the user's eyes and asks, "Which things on this screen do I actually need right now?"

---

## Why many tool developers don't notice this

Reflecting on it, I can sense this largely because, while building Arkloop, I kept grinding on details like COP rendering and tool call collapsing. I'd already built a set of aesthetic standards in my head, and measured against them, any TUI starts to feel noisy.

But many people who build CLI tools don't notice the problem even after using them a dozen hours a day. Probably because **they're using, not looking**. When you use a tool, your brain filters out the noise automatically. Over time you accept that the noise exists, and even start to think "information-rich" is a good thing.

Only when you're also doing UI design do you break the feeling of "my eyes are tired" down into a problem that can be solved.

---

## If you really want to replicate Claude Code

The path is simple: take the ideas from the public prompts, combine them with the tool design and exec logic of OpenCode or Codex that real users have validated, and write your own rendering layer. Put those three together and you already cover the vast majority of Claude Code's functionality. No need to wait for a source map leak.

Claude Code's real moat is that last bit — aesthetic judgment about information density, design intuition about narrative pacing: when to collapse, when to inline, when to let the agent speak. That can't be assembled, and it can't be copied, because it isn't in any repo. It's in the judgment of the people building it.

What leaked today is the first 90%. That 90% was never a secret.

If you're genuinely interested in agent tool design, rather than spending time reading a freshly leaked codebase, use these tools until your eyes start to feel tired, then ask yourself: what's wrong here? The answer is probably worth more than the source.

---
layout: note
title: "High Output Management"
author: "Rohan R Mallya"
date: 2026-05-22
tags: ["leadership"]
published: true
---

## Why the book?

I was in the initial days of managing a small team, transitioning from an individual contributor who was handed tasks with a rough design, with a singular goal to implement the entire thing and release it. I wanted to understand how to "manage" a team and not just be a senior developer with more meetings, telling people exactly what to do.

I posed this question to ChatGPT, which helped me build an initial checklist to start off and then recommended I read this book to understand how to be a good manager.

These are my notes/learnings.

## Setting up Indicators

My team maintained some very old and some extremely new technical components. The kind of work involved varied from maintaining legacy systems and pushing new features to it, to building greenfield products for newer customers.

The first thing I wanted to set up was a bunch of indicators to measure quality of the deliverables, delivery capacity and delivery efficiency.

| Measurement Area    | Indicators                                       |
| ------------------- | ------------------------------------------------ |
| Delivery Capacity   | Velocity, Throughput                             |
| Delivery Efficiency | Time Spent in Architecture, Development, Testing |
| Quality             | # of Escaped Bugs, # of Incidents                |

While not the best indicators, we stuck to a variant of these indicators to measure our progress.

## Decision Framework

### Why should we do it?

The decision framework adopted by the team would focus on staying in the problem space for as long as we had consensus. The goal was to get everyone on the team aligned to justify why we are picking up some work when presenting to neighboring teams. Rather than jumping into solutions, every member of the team had to spend time questioning "why" we should do something and have a child-like curiosity to learn the intent behind every item picked up.

### How should we do it?

Once we had the consensus that the problem is indeed worth solving, discussions shifted over finding the best possible approaches. The goal was to first think without any constraints ("What would you do if you could do anything?") and then progressively narrow down based on constraints such as time, cost, effort, etc.

A golden rule was that no idea will be shot down. Everybody (irrespective of their title or seniority) gets the same time-share to propose a solution that they deem is right and finish their entire train of thought until they hit a roadblock.

### Architecture & Development

After an approach was finalized, we moved into the Architecture phase. Someone would take ownership of the architecture, break the solution into incremental pieces and propose a design, which they'd implement themselves or with a small cohort.

### Feedback & Demos

Every person that worked on a feature, no matter how small or big, had to present their solution to the team. This helped in cross-pollinating ideas and learnings across the team.

### Veto

Principle Architects and Technical Leads would hold a magic wand of veto, as a last-resort mechanism if the team could not form a consensus after multiple discussions.

## Information Framework

Two questions that I wanted to address in the baby days of the team, **"Who can become a lead?** and **"What should a lead know?"**

A lead does not need to know everything, but nor can they be pure delegators. An ideal candidate for a lead would be someone that understands the products we are offering, is an excellent representative for the product and can step into the technical details when required.

Every lead had to own a part of the component and contribute back to the codebase, in whatever little capacity possible. This ensured that the leads remained technically grounded and did not move into oversight mode.

## Optimizing for Team Output

Learning from Higher Output Management, I wanted to identify high-leverage activities that could multiply the output of the team with minimal effort and negative-leverage activities which could demotivate the team.

### High Leverage Activities

- **Demos**: Boasts confidence and increases ownership of work among team members
- **Delegation**: Give ownership to problems, not just tasks. Builds trust and autonomy.
- **Predictable Dev-Review Cycles**: Eliminates waiting time and anticipation
- **Regular 2-way Feedback Session**: Helps managers and members course-correct as soon as possible

### Negative Leverage Activities

- **Ad-hoc, Unplanned Work**: Leads to context switching and disrupts flow
- **Multi-layer Approval Chains**: Slows down development process and relies on availability of all stakeholders, causing idle time
- **Frequent Design Changes**: Leads to rework and demotivation

## Useful Meetings

Decided what "kind" of meetings the team will have and for how long

1. Intro: Typically every 3 months, to understand scope of work, problem statements, themes that we are focusing on.
2. Retro: Every 3 weeks, understanding how we stand on our goals, what went well, what could be better and changes that will be incorporated for the next cycle
3. One-on-ones: Typically every month, to understand how each member feels about their work, their growth, their challenges, their feedback

## Task-Relevant Maturity

A key concept in Higher Output Management that helps understand what is the level of autonomy a team member can be given for a specific task. TRM is a combination of a person's skill, experience and confidence for a specific task.

| Autonomy   | when to use                                                |
| ---------- | ---------------------------------------------------------- |
| Delegation | when TRM is high and you want to give autonomy             |
| Coaching   | when TRM is medium and you want to develop skills          |
| Direction  | when TRM is low and you want to provide clear instructions |

Understanding TRM helped me in understanding what _kind_ of manager I should be for different team members.

## Closing Notes

For someone that is starting afresh as a manager, High Output Management helped me understand what an organization needs, what a manager needs and what a team needs. While a few concepts that I learned were not applicable for a newbie manager, the perspective itself is a solid foundation to start off!

## Resources

- [High Output Management (Book)](https://www.goodreads.com/en/book/show/324750.High_Output_Management)
- [Amazon](https://amzn.to/4dBiJgh)
- Author: [Andy Grove](https://en.wikipedia.org/wiki/Andy_Grove)

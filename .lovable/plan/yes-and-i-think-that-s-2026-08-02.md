Yes, and I think that's 

&nbsp;

Christmas Magic — consistent foundation (no new features yet)

&nbsp;

This revision does not implement Save, Add to Calendar, AI recommendations, Distance, Near Me or live data.

&nbsp;

It creates one consistent foundation so those features can be added later without redesigning the application.

&nbsp;

Where things stand

&nbsp;

Today there are two related experiences:

&nbsp;

/days-out — the public discovery experience, currently focused on Christmas Days Out.

&nbsp;

/planner/outings — the planner feature where users organise their festive plans.

&nbsp;

&nbsp;

These currently use different terminology and different interaction patterns, making them feel like separate features.

&nbsp;

This plan makes them one coherent experience while keeping the existing architecture.

&nbsp;

&nbsp;

---

&nbsp;

1. One consistent product

&nbsp;

The application is organised into two connected parts.

&nbsp;

Discovery

&nbsp;

Christmas Magic Near Me

&nbsp;

This is where users discover festive ideas.

&nbsp;

Planning

&nbsp;

Christmas Planner

&nbsp;

Within the planner, the section is called:

&nbsp;

Festive Activities

&nbsp;

These are not separate features.

&nbsp;

They are two views of the same journey:

&nbsp;

Discover → Choose → Organise

&nbsp;

&nbsp;

---

&nbsp;

2. Consistent terminology

&nbsp;

User-facing language becomes consistent throughout the application.

&nbsp;

Use:

&nbsp;

Christmas Magic Near Me (discovery)

&nbsp;

Christmas Planner (planner)

&nbsp;

Festive Activities (planner section)

&nbsp;

Activity (individual saved item)

&nbsp;

&nbsp;

Remove inconsistent user-facing terms including:

&nbsp;

Outings

&nbsp;

Events

&nbsp;

Planner Events

&nbsp;

Days Out

&nbsp;

&nbsp;

Internal routes, hooks, database tables and APIs may continue using their existing names where appropriate.

&nbsp;

Only the interface language changes.

&nbsp;

&nbsp;

---

&nbsp;

3. Broader activity scope

&nbsp;

Festive Activities are not limited to "days out".

&nbsp;

The feature supports any festive plan, including:

&nbsp;

Christmas markets

&nbsp;

Santa visits

&nbsp;

Ice skating

&nbsp;

Theatre

&nbsp;

Light trails

&nbsp;

Lapland trips

&nbsp;

Meals out

&nbsp;

Friends' houses

&nbsp;

Family gatherings

&nbsp;

Parties

&nbsp;

Church services

&nbsp;

Community events

&nbsp;

Future festive activities

&nbsp;

&nbsp;

Discovery copy, planner copy, empty states, examples and placeholders should all reflect this broader scope.

&nbsp;

No filter mechanics change.

&nbsp;

Only wording changes.

&nbsp;

&nbsp;

---

&nbsp;

4. One consistent recording style

&nbsp;

Discovery and planner should feel like they belong to the same application.

&nbsp;

Reuse existing planner components and interaction patterns.

&nbsp;

Planner sections should use the same:

&nbsp;

headings

&nbsp;

cards

&nbsp;

rows

&nbsp;

buttons

&nbsp;

spacing

&nbsp;

layouts

&nbsp;

empty states

&nbsp;

status indicators

&nbsp;

&nbsp;

Users should immediately recognise how to:

&nbsp;

add

&nbsp;

edit

&nbsp;

organise

&nbsp;

remove

&nbsp;

&nbsp;

activities because every planner section follows the same recording style.

&nbsp;

Do not introduce bespoke UI patterns.

&nbsp;

&nbsp;

---

&nbsp;

5. Discovery and planner connect naturally

&nbsp;

Discovery should clearly lead into planning.

&nbsp;

Planning should clearly link back to discovery.

&nbsp;

The relationship should always feel like:

&nbsp;

Discover → Choose → Organise

&nbsp;

rather than two independent features.

&nbsp;

Navigation, wording and calls-to-action should reinforce this journey.

&nbsp;

&nbsp;

---

&nbsp;

6. Future-ready foundation

&nbsp;

No future functionality is implemented in this change.

&nbsp;

However, the existing architecture should continue to support future additions including:

&nbsp;

Save

&nbsp;

Add to Calendar

&nbsp;

AI recommendations

&nbsp;

Distance

&nbsp;

Near Me

&nbsp;

Live data

&nbsp;

&nbsp;

These remain outside the scope of this implementation.

&nbsp;

&nbsp;

---

&nbsp;

Technical notes

&nbsp;

Reuse existing planner architecture.

&nbsp;

Reuse existing components.

&nbsp;

Reuse existing data structures.

&nbsp;

Do not duplicate functionality.

&nbsp;

Do not redesign the application.

&nbsp;

Do not change colours, typography, spacing or the approved Design Bible.

&nbsp;

Internal route names and database tables may remain unchanged if only user-facing terminology is affected.

&nbsp;

&nbsp;

&nbsp;
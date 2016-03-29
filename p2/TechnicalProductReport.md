# Technical Product Report

## Summary
During phase P2, we have built a working prototype of the "flashcards" Firefox add-on with the following core features we intended to build from issues [#2](https://github.com/csc302-2016-spring/group1/issues/2) and [#4](https://github.com/csc302-2016-spring/group1/issues/4):

![Context menu](right-click-context.png)

*Right-click context to create Flashcard*

![Creating a new flashcard](create-flashcard.png)

*Create flashcard with front and back fields*

![Plugin dropdown](flashcard-dropdown.png)

*Flashcard plugin menu*

![Test Yourself](test-yourself.png)

*Test random flashcard from flashcard deck with metadata*

![Revealing the answer](test-answer.png)

*Revealing the answer for flashcard*

![Browsing through the deck](flashcard-list.png)

*Browse through deck with update and delete options*

## Challenges
In order to persist flashcards across Firefox restarts, we decided to use the addon's simplestorage which persists to the current Firefox profile. This made sense because flashcards are only relevant for the user currently logged in.

## Strengths & weaknesses of process
- Contact information was shared through the use of a shared Google spreadsheet
- During the initial meeting, the [core features](https://github.com/csc302-2016-spring/group1/blob/master/flashcards.md) were fleshed out and the related issues were made.
- Many of our members were too busy to continue meet in person, but having had a Slack channel, we were able to collaborate and discuss the add-on online.

## Plans for final demo

# # Project Title

**ZenTunes**: Personalized Soundscapes for Relaxation and Focus

## Overview

ZenTunes is a interactive React JS application designed to allow users to create their own personalized ambient soundscapes. By selecting an environment and adding sound elements, users can tailor the ambiance to enhance relaxation or concentration.

### Problem

In today’s fast-paced world, finding the right ambient sounds for relaxation or focus can be a time-consuming task. There is a need for a customizable solution that allows individuals to quickly and easily craft an auditory environment that suits their needs.

### User Profile

The primary users of this application are individuals seeking to enhance their work or relaxation environments. Users can interactively choose and modify sound elements to create a soundscape that fits their personal preference or mood.

### Features

- **Environment Selection:** Users can choose from various ambient environments like rainy outdoor, seaside, forest, and indoors.
- **Hover to preview:** When users hover over the selection button, the preview sound will play, and the website will switch to a dynamic background.
- **Sound Element Customization:** Each environment comes with unique sound elements that users can add to their mix, and each element has variations.
- **Real Time Mixing:** Users have individual control over the base layer ambient sounds and element sounds, allowing real-time mixing to find the best sound they want.
- **Loop Forever if Needed:** Users can leave the page open to continuously hear the sound. They don't need to worry about the soundtrack running out; it's always there for you!

## Implementation

### Tech Stack

- React JS
- Audio Library: howler.js

### APIs

No external data APIs are used currently; all functionalities are implemented using internal logic and the howler.js library.

### Sitemap

1.  Home Page
    - Includes a title, a message suggesting the use of headphones, and a button to start/navigate to the First Selection Page.
2.  First Selection Page
    - Allows users to select their desired ambient environment.
3.  Element Mixing Page
    - Users can interact with element sounds and adjust the volume/occurrence via sliders. Users have total control for adding/removing sounds from the mix. A "Try Again" button allows users to go back to the Home Page.

### Mockups

#### Home Page

![](HomePage.jpeg)

#### First Selection Page

- if user hover on the selection, the preview sound will play and change the background to a dynamic video
  ![](FirstSelectionPage.jpeg)

#### Element Selection Page

- the preview will has the same funcionality as in Firest Selection Page.
- the volume and frequency(intensity) sliders will show up if users click on the each element.
  ![](ElementMixingPage.jpeg)

### Data

- Data structure is stored in environment.json file.

Ambient Sound Categories:

1. Rainy-Outdoors:

- Thunder
- Windchime
- Bamboo fountain
- Traffic

2. Beachside-Waves:

- Seagull
- Ship horn
- Motorboat
- Human activity

3. Among-Trees(Forest):

- Birds
- Bugs
- Foliage
- Frogs

4. Cozy-Lounge:

- Fireplace Crackling
- Pages turning
- Keyboard typing
- Cup clinking

### Endpoints

No external endpoints; all functionalities are managed within the frontend application using React state and context.

### Auth

Currently, the project does not include any user authentication or profiles.

## Roadmap

- Sound Asset Preparation

  - Acquire and edit sound files for consistent volume and format.

- Video Asset Acquisition

  - Source and optimize video clips for dynamic backgrounds.

- Home Page Development

  - Design and implement the main page with interactive elements.

- First Selection Page Development

  - Develop interactive selection functionality with dynamic video backgrounds.

- Element Mixing Page Development

  - Create controls for sound element customization including volume and occurrence adjustments.

- Testing and Bug Fixes

  - Conduct comprehensive testing across all functionalities, addressing any issues identified.

## Nice-to-haves

- **Session Timer**: A timer to alert users to take breaks after a predetermined period of playback.
- **Music Upload and Integration**: Users can upload their music files or integrate with the SoundCloud API to enhance their ambient mix with music.
- **User Profiles**: Allowing users to save and share their custom soundscapes.
- **Responsive**: Now because of the hover, this app is desktop exclusive, may explore on other screen size.

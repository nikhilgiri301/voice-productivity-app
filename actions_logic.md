# Actions Logic Mapping - TestVisualsPage
## Complete End-to-End Logic Flow for Voice-First Productivity Organizer

### Overview
This document maps every interactive element, button, input, and user action within the TestVisualsPage across all three core sections (Schedule, Tasks, Notes). Each action includes detailed logic flow, data operations, UI state changes, and integration points.

---

## 1. GLOBAL NAVIGATION & CORE INTERFACE

### 1.1 Tab Navigation System
**Location**: Top navigation bar with three tabs
**Elements**: Schedule | Tasks | Notes buttons

**Logic Flow**:
- **State Management**: Uses React useState hook [local component state management] to track activeTab
- **Tab Switch Action**: onClick handler calls setActiveTab(tabName)
- **UI Response**: Immediately switches visible content area, updates button styling (active vs inactive)
- **Data Persistence**: Tab state is session-only, resets on page refresh 
- **Animation**: Smooth transition between content areas (0.2s ease)

**Technical Implementation**:
- **State Variable**: `activeTab: 'schedule' | 'tasks' | 'notes'`
- **Default State**: 'schedule' (loads Schedule tab first)
- **Styling Logic**: Active tab gets white background, inactive tabs get transparent background

[I don't know if the tab should be session-only, and it should not reset on page refresh because we might want some, you know, if you add a task or something, you might want the page to refresh. So we should be careful—I’d rather it remains where it was, but we add an option for the user to go back to the home screen or the default opening page, which would happen if they click on their name. Right on top, it says, "Hi Nikhil." If I click there, it should take me back to whatever I set up as my default home screen. So in my case, schedule is most important to me. I can go there for some time; when it would be task for someone, it could be something else. But that's the way we should set this up.

Also from a sort of usability perspective, what I want is that when this is used on the mobile phone, if someone presses Schedule, Tasks, or Notes, then they will obviously go to that section. But what I want is that for the entire upper part, like wherever Schedule, Tasks, and Notes are written, that card or that panel or whatever you call it, for that whole thing up right till the very top, if someone swipes left or right, it should navigate to the next thing. For example, throughout the phone, if someone starts at the very edge in some blank space and then pushes their finger left or right, it should navigate to the subsequent section. So, if they are in Tasks and they swipe left, they should go to Notes, and if they swipe right, they should go to Schedule—or vice versa, depending on the logic. I'm not sure of the exact terminology, but whichever way they swipe, they should be able to navigate to the subsequent screens. So this is over and above the click. But whichever way they swipe, they should be able to navigate to the subsequent screens. So this is over and above the Qlik interface. ]

### 1.2 Voice Input Bar
**Location**: Top of interface, spans full width
**Elements**: Microphone icon + text input field

**Logic Flow**:
- **Input Field**: Currently static placeholder text "Tap to Speak and add or change any item"
- **Microphone Icon**: Visual indicator only, no current functionality
- **Future Integration**: Will connect to Google Speech-to-Text API [cloud-based speech recognition service]
- **AI Processing**: Will send transcribed text to Gemini AI for natural language processing [NLP - converting human language into structured data]
- **Auto-Population**: AI will parse intent and auto-populate relevant forms (calendar events, tasks, notes)

**Technical Implementation**:
- **Input Type**: Text input with transparent background
- **Placeholder**: Guides user on voice functionality
- **API Integration Points**: Google Speech-to-Text → Gemini AI → Form Auto-Population
- **Error Handling**: Will include fallback to manual text input if voice fails

[It's important that we calibrate and design these forms very carefully. I think all of that needs to be done. I'm guessing that might be there in some subsequent section, but the same design language should be there throughout. That is very important.
It also occurs to me that the current voice input bar should be reduced slightly, and space should be made on the right-hand side such that a plus icon can be included. So that is where people can manually enter.

Okay, so instead, what we'll do is, instead of one plus icon, we should have a small icon for notes, then on the left of that, a small icon for tasks, and then a small icon for scheduler or calendar. That way, if the user presses any of these buttons, they can fill out the form manually, but they can always use the voice input feature, which is on the left. Tasks and then a small icon for schedule or calendar, and that way, if the user presses any of these buttons, then they can fill out the form manually, but they can use the voice input feature always, which is on the left, like it, you want to still make the voice bar as big as possible, but it should also be manual form options and some place to click for that. Alternatively, we could have a small plus button on the bottom left and a small voice button on the bottom right, which could be used to trigger either the voice input or manual addition. We'll have to examine which is the best layout and see how to configure things accordingly. Bring this up for discussion. Don't immediately or automatically take any action on either option. ]

<span style="color: green;">**QUESTION FOR NIKHIL**: I like both layout options you've proposed. For the voice input bar layout, would you prefer:
Option A: Voice input (left 70%) + 3 small icons (Calendar, Tasks, Notes) on the right (30%)
Option B: Bottom floating action buttons - Voice button (bottom right) + Plus button (bottom left) that opens a menu with the 3 options
Which feels more intuitive to you for mobile use? Also, should these manual form icons be context-aware (e.g., if you're on Tasks tab, the Tasks icon is highlighted/more prominent)?</span>

[In my experience, some of these questions can only be answered once you test it out, so let's do both for now. Then, once we have a feel for how it looks on the phone and stuff like that, we can determine which one to keep or maybe we even keep both - sometimes redundancy is very helpful. As far as going the extra mile to highlight the tasks icon or any appropriate icon is concerned, let's wait on it until we finalize that. We're going to do that option no matter what. I think investing the effort to do it after that makes more sense than doing it now. ]

### 1.3 Back Button
**Location**: Fixed position, bottom-right corner
**Element**: "← Back to Main App" glass button

**Logic Flow**:
- **Primary Action**: Calls onBack prop function if provided
- **Fallback Action**: Uses window.history.back() [browser navigation API] if no onBack prop
- **Navigation Target**: Returns to main application dashboard
- **State Preservation**: Does not save current TestVisualsPage state
- **Component Unmounting**: Triggers React component cleanup

**Technical Implementation**:
- **Component**: GlassButton with primary variant
- **Event Handler**: `onClick={onBack || (() => window.history.back())}`
- **Positioning**: Fixed positioning outside iPhone container

[No, this makes no sense because what we are trying to build effectively will then replace the main app. So there's nothing to go back to. This button will have to be removed. If someone wants to go back to their default or home screen equivalent, then they just press their name, which takes them back to the default view. Otherwise, they can navigate, but there's no "Back to Main App" button. I don't see why it should exist. ]

---

## 2. SCHEDULE SECTION

### 2.1 Date Navigation System
**Location**: Schedule tab header
**Elements**: Left arrow, date display, right arrow

#### 2.1.1 Left Arrow Button (Previous Date)
**Logic Flow**:
- **Action**: Navigate to previous day
- **Date Calculation**: Subtract 1 day from current displayed date
- **Data Fetching**: Load schedule items for new date from database
- **UI Update**: Update date display, refresh schedule items list
- **Boundary Handling**: No restriction on past dates (can go back indefinitely)

**Technical Implementation**:
- **Date Management**: JavaScript Date object manipulation
- **Database Query**: Filter events by new date
- **State Update**: Update dateContext and trigger re-render

[ ]

#### 2.1.2 Date Display (Center)
**Current Display**: "Today, 28th June"
**Logic Flow**:
- **Static Display**: Currently shows hardcoded date
- **Future Enhancement**: Will show dynamic current date
- **Click Action**: Will open date picker modal [popup calendar interface]
- **Date Selection**: User can jump to any specific date
- **Format**: "Today/Tomorrow/Day Name, DDth Month" format

**Technical Implementation**:
- **Date Formatting**: Custom date formatting function
- **Relative Display**: Shows "Today", "Tomorrow", or day name based on selected date
- **Internationalization**: Will support multiple date formats

[Just noting here that no matter what a date is selected, the way the schedule should load up should be in chronological order. I'm guessing it's obvious, but just putting it out there. ]

#### 2.1.3 Right Arrow Button (Next Date)
**Logic Flow**:
- **Action**: Navigate to next day
- **Date Calculation**: Add 1 day to current displayed date
- **Data Fetching**: Load schedule items for new date from database
- **UI Update**: Update date display, refresh schedule items list
- **Boundary Handling**: No restriction on future dates

**Technical Implementation**:
- **Date Management**: JavaScript Date object manipulation
- **Database Query**: Filter events by new date
- **State Update**: Update dateContext and trigger re-render

[ ]

### 2.2 Schedule Filter System
**Location**: Below date navigation
**Elements**: Work button, Personal button, Settings button

#### 2.2.1 Work Filter Button
**Logic Flow**:
- **Filter Action**: Toggle visibility of work-related calendar events
- **State Management**: Maintains active/inactive state
- **Data Filtering**: Filters events array by type === 'work' or category === 'work'
- **UI Response**: Updates button styling (active = white background, inactive = transparent)
- **Multi-Select**: Can be active simultaneously with Personal filter

**Technical Implementation**:
- **Filter State**: Boolean or array of active filters
- **Data Operation**: Array.filter() on events data
- **Styling Logic**: Conditional CSS based on filter state

[So we should ideally find a system that, in a smart way, ensures all the cards that are work-oriented have one small band or section of a particular color that the user can configure, and all the cards of a personal nature have one small band or section of a particular color that the user can configure. This creates a visual differentiation when you scan through and see how many work and personal tasks you have. 

You know, what is the interplay between that? Either we have a small band or something that's colored, or if it's getting weird, then we just change the background color of these cards. Different for work, different for personal. But some distinction needs to be there in some form. ]

#### 2.2.2 Personal Filter Button
**Logic Flow**:
- **Filter Action**: Toggle visibility of personal calendar events
- **State Management**: Maintains active/inactive state
- **Data Filtering**: Filters events array by type === 'personal' or category === 'personal'
- **UI Response**: Updates button styling
- **Multi-Select**: Can be active simultaneously with Work filter

**Technical Implementation**:
- **Filter State**: Boolean or array of active filters
- **Data Operation**: Array.filter() on events data
- **Styling Logic**: Conditional CSS based on filter state

[ ]

#### 2.2.3 Settings Button (⚙️)
**Logic Flow**:
- **Action**: Opens schedule settings modal
- **Settings Options**: Default view, notification preferences, calendar integrations
- **Modal Display**: Overlay modal with settings form
- **Save Action**: Persists settings to user preferences database
- **Cancel Action**: Closes modal without saving changes

**Technical Implementation**:
- **Modal State**: Boolean for modal visibility
- **Settings Schema**: Structured settings object
- **Database Update**: PATCH request to user preferences endpoint

[I want us to circle back to this at the end because we need to think carefully about all the functionality and all the options that need to come up when the settings button is pressed. I would suggest we first figure out the rest of the app that we have naturally designed and already thought of, and then come back to see what other features should be there that aren't, which can then be handled through your settings—whether it's features, filters, custom tags, notification preferences, or something else. The whole spectrum of things. We need to come back to this after we’ve figured out what we’ve already thought of. Remember this. ]

### 2.3 Schedule Items (Calendar Events)
**Location**: Main content area of Schedule tab
**Elements**: 3 event cards with expand/collapse functionality

[I mean, currently, it's three event cards, but it can be three, 30, or 3000, or however many the user wants to set up—that is their prerogative. So, please don't mention absurd or arbitrary limits anywhere unnecessarily. It's also important to note that the events need to be displayed chronologically for that day, and it should be smart enough to adjust to the time. For example, if it's 3:00 p.m., then it should only show events after 3:00 p.m. However, if someone scrolls up, it should display all the other events, but in a slightly grayed-out color or something of that sort to distinguish that those events have already been completed. So at any given time, the default will show all the events ahead of the actual live time in that day. But if someone scrolls up, it will also show past events of that day, but only of that day. ]

#### 2.3.1 Event Card Structure
Each event card contains:
- **Time Information**: Start time, duration, end time (left column)
- **Event Details**: Title, description (right column)  
- **Expand Arrow**: Down-pointing arrow for additional details

#### 2.3.2 Event Card Expand/Collapse Arrows
**Logic Flow**:
- **Default State**: All cards collapsed (arrow pointing down)
- **Click Action**: Toggles card expansion state
- **Expanded State**: Arrow points up, reveals additional event details
- **Additional Details**: Full description, attendees, location, meeting link, preparation notes
- **Animation**: Smooth expand/collapse transition (0.3s ease)

**Technical Implementation**:
- **State Management**: Individual boolean state for each card or array of expanded card IDs
- **Conditional Rendering**: Show/hide expanded content based on state
- **Arrow Rotation**: CSS transform or different SVG path for up/down states

[We need to see if there is some room to add some cool animations, like subtle ones, where the moment you click on the card to be expanded, then it sort of almost jumps out at you very slightly and then opens up and then settles back in. Like it needs to be very subtle, but if something like that can be done, that would be really cool.]

#### 2.3.3 Event Card Click (Full Card)
**Logic Flow**:
- **Action**: Opens event details modal
- **Modal Content**: Full event information, edit capabilities
- **Edit Mode**: Allows modification of event details
- **Save Changes**: Updates event in database, refreshes UI
- **Delete Option**: Removes event with confirmation dialog

**Technical Implementation**:
- **Modal State**: Boolean + selected event object
- **Form Handling**: Controlled form components for editing
- **API Calls**: PUT for updates, DELETE for removal

[I would like to change this slightly where we need to have event card click and event card double click independently. Event card click just opens up; it's as good as clicking the arrow on the right. It just expands the card. Event card double click is what actually opens what you are talking about over here with edit capabilities. 
    
    So we need to carefully configure this event card because this is essentially a form that has details in a particular order and format. There are quite a few things when it comes to an event. It needs to be scrollable, and also we want to create links. You could have an event that is linked to three tasks that you should complete beforehand. The event can also be linked to notes, so there should be a linked section. My whole point is that this form needs to be very carefully thought of and calibrated. The way the form opens up, the graphics, and everything else needs to be managed very smartly.

We need to have a separate discussion on all these sort of form-like cards that will pop up when we want to edit or add details. 
    
Need to be very careful about error handling over here. Also, ideally, we should at some point find some way to sync this with people's regular calendars, whether it's their Google Calendar or Apple Calendar or whatever they have. At that point, this state syncing across the board and passing on of information to other service providers should be marked for configuration as per the user's desires but we need to enable that from an infrastructure perspective at our end and so this is something that we can come to but maybe at a more advanced stage.]


[Separately, it occurs to me that in the schedule section, if someone double clicks on the free time space in between two meetings, then it should automatically open up a create new event form. I think this is a very intelligent way to intuitively say, "Okay, I have some free time over here, let me add something to my schedule."

Additionally, if the user double clicks in that space which says "free" or that whole section, the so-called empty space, then a form opens up. The way that form should open up should automatically involve the logic that pre-populated time slots are set at 30-minute intervals that begin at the end of the previous meeting and end half an hour before the start of the next meeting.

- Pre-populated time slots:
  - Begin at the end of the previous meeting.
  - End half an hour before the start of the next meeting.
  - Easily appear for the user to select as meeting start times.

We need to build some careful logic in this to make sure not more than 12 or 16 slots appear, depending on how many time options fit in one line. There should not be more than three lines of options to select from, even if it means that a lot of time before the next meeting is left blank. The other option is that when the gap between meetings is longer than normal, the time cards should still be able to show within three lines. Then we build a rule that at that time it switches to a one-hour gap instead of a 30-minute gap, but that's the limit.]

<span style="color: green;">**QUESTION FOR NIKHIL**: This intelligent time slot logic is brilliant! A few clarifications:
1. Should the 30-minute buffer before the next meeting be configurable by users (some might prefer 15 min, others 45 min)?
2. When switching from 30-min to 1-hour intervals for long gaps, should we show a mix (e.g., first few slots at 30-min intervals, then switch to 1-hour) or jump straight to 1-hour intervals?
3. Should we also consider 15-minute intervals for very short gaps (e.g., 1-hour free time = 4 slots of 15 min each)?</span>

[So the answer to question 1 is no. Let's keep it straightforward. If someone wants to edit something, they can do it manually. On question 2, no. If it's a long gap, 1-hour slots. If it's a normal gap, like 30 minutes, slots, and to answer your question 3, if it's a short gap, yes, 15 minutes slots, that makes sense. ]

[For each of the cards in this section, we also need to build in functionality such that if someone holds a card and swipes to the left, an option should open up on the right asking "Cancel." If you press the red "Cancel" button, the event is canceled, and a notification is sent to the other participants of the event. 

If someone instead swipes to the right, it could mean that the event is completed. This is important because sometimes you have a one-hour meeting, but it gets over in half an hour, and you don't want that blocking your calendar view for the next half hour. You need to be able to indicate that, "Yeah, I'm done with this." That's how these swipe features help. We also need to be cognizant that these swiping features need to include some animation where the whole card moves to the left and right so that it looks like it's swiping. It shouldn't disappear, but the point is that it should move—a little bit, not too much. That feeling of the animation or graphic is going to be incredibly important. ]
---

## 3. TASKS SECTION

### 3.1 Task Filter System
**Location**: Top of Tasks tab
**Elements**: Due date filters and Priority filters

#### 3.1.1 Due Date Filter Row
**Elements**: DUE label, All/Today/Tomorrow buttons, Filter icon

[We should change this label to DUE BY]

##### 3.1.1.1 Due Date "All" Button
**Logic Flow**:
- **Default State**: Active (white background)
- **Action**: Shows all tasks regardless of due date
- **Mutual Exclusivity**: Deactivates Today/Tomorrow when selected
- **Data Operation**: No filtering applied to tasks array
- **UI Update**: Updates button styling, refreshes task list

[ ]

##### 3.1.1.2 Due Date "Today" Button  
**Logic Flow**:
- **Action**: Filters tasks due today only
- **Date Comparison**: Compares task.dueDate with current date
- **Mutual Exclusivity**: Deactivates All/Tomorrow when selected
- **Data Operation**: Array.filter() where dueDate equals today
- **Empty State**: Shows "No tasks due today" if no matches

[ ]

##### 3.1.1.3 Due Date "Tomorrow" Button
**Logic Flow**:
- **Action**: Filters tasks due tomorrow only
- **Date Comparison**: Compares task.dueDate with tomorrow's date
- **Mutual Exclusivity**: Deactivates All/Today when selected
- **Data Operation**: Array.filter() where dueDate equals tomorrow
- **Empty State**: Shows "No tasks due tomorrow" if no matches

[]

##### 3.1.1.4 Due Date Filter Icon (Hamburger Menu)
**Logic Flow**:
- **Action**: Opens advanced due date filter options
- **Modal Content**: Date range picker, custom date selection, overdue tasks filter
- **Apply Filters**: Updates task list based on selected criteria
- **Clear Filters**: Resets to "All" state

[This is not a due date filter icon; this is a custom filter icon. So people could filter things based on any criteria that they might have. This needs to be carefully configured. This is a very important section because people might want to do all kinds of things with their tasks. They might put private labels, other custom tags, and maybe colors, and all of that becomes important filtering criteria. We need to have a detailed discussion on this at a later stage. ]

<span style="color: green;">**QUESTION FOR NIKHIL**: For the custom filter system, should we implement:
1. A predefined set of common filters (e.g., "Work", "Personal", "Urgent", "Waiting for others") that users can toggle on/off?
2. A completely custom tag system where users create their own categories and colors?
3. Both - predefined filters + custom tags?
Also, should custom filters be saved as "filter presets" that users can quickly apply (e.g., "Show only high priority work tasks due this week")?</span>
[So, to answer succinctly, I would say we go with option 3, which is both, and we also make sure presets are available. ]

#### 3.1.2 Priority Filter Row
**Elements**: PRIORITY label, All/High/Mid/Low buttons, Collapse icon


##### 3.1.2.1 Priority "All" Button
**Logic Flow**:
- **Default State**: Active (white background)
- **Action**: Shows all tasks regardless of priority level
- **Mutual Exclusivity**: Deactivates High/Mid/Low when selected
- **Data Operation**: No filtering applied to tasks array
- **UI Update**: Updates button styling, refreshes task list

[ ]

##### 3.1.2.2 Priority "High" Button
**Logic Flow**:
- **Action**: Filters tasks with high priority only
- **Data Filtering**: Array.filter() where priority === 'high'
- **Mutual Exclusivity**: Deactivates All/Mid/Low when selected
- **Visual Indicator**: High priority tasks show red priority badge
- **Sorting**: High priority tasks appear first in list

[ ]

##### 3.1.2.3 Priority "Mid" Button
**Logic Flow**:
- **Action**: Filters tasks with medium priority only
- **Data Filtering**: Array.filter() where priority === 'medium'
- **Mutual Exclusivity**: Deactivates All/High/Low when selected
- **Visual Indicator**: Medium priority tasks show orange priority badge
- **Sorting**: Medium priority tasks appear after high priority

[ ]

##### 3.1.2.4 Priority "Low" Button
**Logic Flow**:
- **Action**: Filters tasks with low priority only
- **Data Filtering**: Array.filter() where priority === 'low'
- **Mutual Exclusivity**: Deactivates All/High/Mid when selected
- **Visual Indicator**: Low priority tasks show green priority badge
- **Sorting**: Low priority tasks appear last in list

[ ]

##### 3.1.2.5 Priority Collapse Icon (Up Arrow)
**Logic Flow**:
- **Action**: Collapses priority filter section
- **UI Change**: Hides priority filter buttons, shows only PRIORITY label
- **State Persistence**: Maintains current priority filter selection
- **Toggle Behavior**: Click again to expand section
- **Space Optimization**: Provides more room for task list

[This icon is not to collapse the priority section. It is to collapse the custom filter section when it opens up. The button above this is the custom filter button. If someone presses that, a custom filter panel opens up, and this icon is to collapse that panel.]

### 3.2 Task Items
**Location**: Main content area of Tasks tab
**Elements**: 7 task cards with various states

#### 3.2.1 Task Checkbox Interactions
**Logic Flow**:
- **Unchecked State**: Task is pending/active
- **Check Action**: Marks task as completed
- **Database Update**: Updates task.status to 'completed' in database
- **UI Changes**: Applies strikethrough text, reduces opacity, moves to bottom of list
- **Uncheck Action**: Marks completed task as pending again
- **Timestamp**: Records completion time for analytics

**Technical Implementation**:
- **State Management**: Boolean completed status per task
- **Database Schema**: tasks.completed (boolean), tasks.completedAt (timestamp)
- **Optimistic Updates**: UI updates immediately, syncs with database asynchronously

[We also need to build in swiping features which indicate whether a task is completed or not. If a task card is clicked and then swiped left by the user, that might indicate they are either deferring the task or canceling the task. The moment they swipe left, a small red-colored option should open up on the right to ask: defer? cancel? or just defer and cancel. Depending on what you click, the respective action happens. Instead, if they swipe right, that means they've completed the task. It's important that the graphics visually show the swipe action happening to some extent. The animations need to be there. ]

#### 3.2.2 Task Card Expand/Collapse Arrows
**Logic Flow**:
- **Default State**: All cards collapsed (arrow pointing down)
- **Click Action**: Toggles individual task expansion
- **Expanded Content**: Full description, subtasks, due time, priority details, linked items
- **Independent State**: Each task card expands/collapses independently
- **Animation**: Smooth height transition (0.3s ease)

**Technical Implementation**:
- **State Management**: Array of expanded task IDs or individual boolean states
- **Conditional Rendering**: Show/hide expanded content based on state
- **Height Animation**: CSS max-height transition or React animation library

[ ]

#### 3.2.3 Task Card Click (Full Card)
**Logic Flow**:
- **Action**: Opens task details modal
- **Modal Content**: Full task editing interface
- **Editable Fields**: Title, description, due date, priority, subtasks, linked items
- **Save Changes**: Updates task in database, refreshes task list
- **Delete Option**: Removes task with confirmation dialog
- **Duplicate Option**: Creates copy of task with modified details

**Technical Implementation**:
- **Modal State**: Boolean + selected task object
- **Form Validation**: Required fields, date validation, priority selection
- **API Integration**: PUT for updates, DELETE for removal, POST for duplicates

[Similar to what we're doing for events, the task card needs to have a click and a double click which do two different things. Click will just expand it, same as the arrow. Double click is what opens up what you have written over here. Configuring the form is going to be very important. We need to come back to have a detailed conversation about that later. ]

---

## 4. NOTES SECTION

### 4.1 Note Items
**Location**: Main content area of Notes tab  
**Elements**: 3 note cards with expand/collapse functionality

#### 4.1.1 Note Card Structure
Each note card contains:
- **Header**: Title, timestamp, expand arrow
- **Preview**: Truncated description with ellipsis
- **Tags**: Colored category tags
- **Expand Arrow**: Down-pointing arrow for full content

#### 4.1.2 Note Card Expand/Collapse Arrows
**Logic Flow**:
- **Default State**: All cards collapsed (arrow pointing down)
- **Click Action**: Toggles individual note expansion
- **Expanded Content**: Full note content, all tags, edit options, linked items
- **Independent State**: Each note card expands/collapses independently
- **Content Preview**: Collapsed state shows first 2-3 lines of content

**Technical Implementation**:
- **State Management**: Array of expanded note IDs or individual boolean states
- **Text Truncation**: CSS line-clamp or JavaScript substring with ellipsis
- **Animation**: Smooth height transition for content reveal

[ ]

#### 4.1.3 Note Card Click (Full Card)
**Logic Flow**:
- **Action**: Opens note details modal
- **Modal Content**: Full note editing interface with rich text editor
- **Editable Fields**: Title, content (rich text), tags, linked items
- **Rich Text Features**: Bold, italic, bullet points, links, formatting
- **Save Changes**: Updates note in database, refreshes notes list
- **Delete Option**: Removes note with confirmation dialog
- **Export Options**: Copy to clipboard, export as markdown, share link

**Technical Implementation**:
- **Rich Text Editor**: Integration with editor library (e.g., Quill, TinyMCE)
- **Auto-Save**: Periodic saving of draft content
- **Version History**: Track note revisions for recovery

[Similar to events and tasks, we need to have click and double click as separate. Click results in expansion, and double click results in the form being opened. Again, that form needs to be configured carefully; we need to have that conversation later. ]

#### 4.1.4 Note Tag System
**Logic Flow**:
- **Tag Display**: Colored badges showing note categories
- **Tag Click**: Filters notes by selected tag
- **Tag Management**: Add/remove tags in edit mode
- **Tag Creation**: Create new tags with custom colors
- **Tag Analytics**: Track most used tags for suggestions

**Technical Implementation**:
- **Tag Schema**: tags table with id, name, color, userId
- **Many-to-Many**: note_tags junction table for relationships
- **Color System**: Predefined color palette for consistency

[Yes, this is important. We also need to offer users the ability to make custom tags and custom tag families so that it's easy for them to manage this the way they want. ]

---

## 5. CROSS-SECTION INTEGRATION LOGIC

### 5.1 Linked Items System
**Purpose**: Connect related items across Schedule, Tasks, and Notes

**Logic Flow**:
- **Meeting Preparation**: Link tasks to calendar events for preparation
- **Follow-up Actions**: Link tasks to meetings for post-meeting actions
- **Meeting Notes**: Link notes to calendar events for documentation
- **Project Organization**: Link multiple tasks and notes to project events
- **Dependency Tracking**: Show relationships between items in UI

**Technical Implementation**:
- **Database Schema**: linked_items table with source_id, target_id, link_type
- **UI Indicators**: Visual badges showing linked items count
- **Quick Navigation**: Click linked item badge to jump to related section

[ ]

### 5.2 Voice Command Integration
**Purpose**: Natural language processing for all sections

**Logic Flow**:
- **Voice Input**: User speaks command or request
- **Speech Recognition**: Google Speech-to-Text converts audio to text
- **Intent Recognition**: Gemini AI parses intent and extracts entities
- **Action Routing**: Determines target section (Schedule/Tasks/Notes)
- **Auto-Population**: Pre-fills forms with extracted information
- **Confirmation**: Shows confirmation modal before creating items
- **Error Handling**: Fallback to manual input if parsing fails

**Technical Implementation**:
- **API Chain**: Speech-to-Text → Gemini AI → Form Population
- **Intent Classification**: Meeting, task, note, query, modification intents
- **Entity Extraction**: Dates, times, priorities, people, locations
- **Confidence Scoring**: Only auto-populate if confidence > threshold

[ ]

### 5.3 Search and Filter Integration
**Purpose**: Global search across all sections

**Logic Flow**:
- **Global Search**: Search across events, tasks, and notes simultaneously
- **Filter Persistence**: Maintain filter states across tab switches
- **Advanced Search**: Date ranges, priority levels, tag combinations
- **Search History**: Track and suggest previous search queries
- **Quick Filters**: Predefined filter combinations for common use cases

**Technical Implementation**:
- **Search Index**: Full-text search capability in database
- **Filter State**: Global state management for filter persistence
- **Search API**: Unified search endpoint returning mixed results

[ ]

---

## 6. DATA PERSISTENCE AND SYNC

### 6.1 Database Operations
**Create Operations**:
- **Events**: POST /api/events with event data
- **Tasks**: POST /api/tasks with task data  
- **Notes**: POST /api/notes with note data

**Read Operations**:
- **Events**: GET /api/events?date=YYYY-MM-DD&filters=work,personal
- **Tasks**: GET /api/tasks?status=pending&priority=high&due_date=today
- **Notes**: GET /api/notes?tags=meeting,planning&search=keyword

**Update Operations**:
- **Events**: PUT /api/events/:id with updated data
- **Tasks**: PATCH /api/tasks/:id with partial updates
- **Notes**: PUT /api/notes/:id with updated content

**Delete Operations**:
- **Events**: DELETE /api/events/:id with confirmation
- **Tasks**: DELETE /api/tasks/:id with confirmation
- **Notes**: DELETE /api/notes/:id with confirmation

[ ]

### 6.2 Real-time Sync
**Logic Flow**:
- **WebSocket Connection**: Maintain real-time connection to server
- **Change Broadcasting**: Notify all connected clients of data changes
- **Conflict Resolution**: Handle simultaneous edits with last-write-wins or merge
- **Offline Support**: Queue operations when offline, sync when reconnected
- **Optimistic Updates**: Update UI immediately, rollback if server rejects

[ ]

---

## 7. ERROR HANDLING AND EDGE CASES

### 7.1 Network Failures
**Logic Flow**:
- **Connection Loss**: Detect network disconnection
- **Offline Mode**: Continue functioning with cached data
- **Queue Operations**: Store create/update/delete operations for later sync
- **Retry Logic**: Exponential backoff for failed requests
- **User Notification**: Show connection status in UI

[ ]

### 7.2 Data Validation
**Logic Flow**:
- **Client-Side Validation**: Immediate feedback on form inputs
- **Server-Side Validation**: Authoritative validation before database operations
- **Error Display**: Clear error messages with correction guidance
- **Partial Save**: Save valid portions of forms, highlight invalid fields
- **Recovery Options**: Suggest corrections or alternative actions

[ ]

### 7.3 Performance Optimization
**Logic Flow**:
- **Lazy Loading**: Load data as needed, not all at once
- **Pagination**: Limit initial data load, load more on demand
- **Caching**: Cache frequently accessed data in browser storage
- **Debouncing**: Delay API calls for rapid user inputs (search, filters)
- **Virtual Scrolling**: Handle large lists efficiently

[ ]

---

This comprehensive logic mapping covers every interactive element and system integration point in the TestVisualsPage. Each section includes detailed technical implementation notes and cross-references to related functionality.

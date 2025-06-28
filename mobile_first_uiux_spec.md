# Voice-First Productivity App - Mobile-First UI/UX Transformation Specification

## Overview

This specification transforms the existing broad-based app layout into a premium mobile-first experience with independent, swipeable sections and glassmorphism design. The focus is on upgrading the visual architecture, interaction patterns, and overall user experience to match the demonstrated prototype.

## Critical UI/UX Architecture Changes

### 1. Layout Transformation: From Stacked to Independent Sections

**Current State:** Vertical stacking (Schedule → Tasks → Notes in single scroll)
**Target State:** Three independent, full-screen sections with horizontal navigation

```
BEFORE (Stacked):                    AFTER (Independent):
┌─────────────────┐                  ┌─────────────────┐
│    Schedule     │                  │    [S][T][N]    │ ← Tab selector
│  ┌───────────┐  │                  │                 │
│  │  Event 1  │  │    ═══════>      │    Schedule     │ ← Full screen
│  │  Event 2  │  │                  │   (swipeable)   │
│  └───────────┘  │                  │                 │
│     Tasks       │                  └─────────────────┘
│  ┌───────────┐  │                  
│  │  Task 1   │  │                  Swipe left/right or tap tabs
│  │  Task 2   │  │                  to switch between sections
│  └───────────┘  │
│     Notes       │
│  ┌───────────┐  │
│  │  Note 1   │  │
│  └───────────┘  │
└─────────────────┘
```

### 2. Visual Design System Upgrade

#### Core Design Language: Premium Glassmorphism
```css
/* Primary glass card styling */
.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.24);
}

/* Glass card hover state */
.glass-card:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.32);
}
```

#### Background System
```css
/* App background - applies to entire app */
body {
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  min-height: 100vh;
}

/* Ensure gradient covers all screens */
.screen-container {
  flex: 1;
  background: transparent; /* Let parent gradient show through */
}
```

#### Typography Hierarchy
```css
/* App title - main header */
.app-title {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(45deg, #ffffff, #8b9dc3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin-bottom: 8px;
}

/* Date display - secondary header */
.date-display {
  font-size: 16px;
  color: #8b9dc3;
  font-weight: 500;
  text-align: center;
  margin-bottom: 16px;
}

/* Section titles */
.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
}

/* Card titles */
.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.2;
}

/* Secondary text */
.secondary-text {
  font-size: 14px;
  color: #8b9dc3;
  line-height: 1.4;
}

/* Micro text (timestamps, etc.) */
.micro-text {
  font-size: 12px;
  color: #8b9dc3;
  font-weight: 500;
}
```

## Screen Architecture Specification

### 1. Header Component (Sticky, Global)

**Location:** Top of all screens
**Height:** Auto-sizing based on content
**Behavior:** Sticky scroll, glassmorphism background

```jsx
// Header structure
<Header style={headerStyles}>
  <AppTitle>Personal Organizer</AppTitle>
  <DateDisplay>Friday, June 27, 2025</DateDisplay>
  <VoiceInputBar />
  <TabNavigation />
</Header>

const headerStyles = {
  position: 'sticky',
  top: 0,
  background: 'rgba(15, 15, 35, 0.95)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  zIndex: 100,
  padding: '20px 20px 16px'
}
```

#### Voice Input Bar Specifications
```css
.voice-input-bar {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 12px 16px;
  margin: 0 0 16px 0;
  height: 48px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Voice input text */
.voice-input-text {
  font-size: 14px;
  color: #8b9dc3;
  font-weight: 500;
  flex: 1;
}

/* Specific text content */
.voice-input-text::before {
  content: "Tap to speak, add, edit, or remove anything...";
}

/* Listening state */
.voice-input-bar.listening {
  border-color: #4a90e2;
  background: rgba(74, 144, 226, 0.1);
  animation: pulse-border 2s infinite;
}

/* Pulse animation */
@keyframes pulse-border {
  0%, 100% { 
    border-color: #4a90e2; 
    box-shadow: 0 0 0 0 rgba(74, 144, 226, 0.4); 
  }
  50% { 
    border-color: #4a90e2; 
    box-shadow: 0 0 0 4px rgba(74, 144, 226, 0.1); 
  }
}
```

#### Tab Navigation Specifications
```css
.tab-navigation {
  display: flex;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 4px;
  margin-bottom: 0;
}

.tab-item {
  flex: 1;
  padding: 12px 16px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  min-height: 44px; /* Touch-friendly */
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-item.active {
  background: rgba(74, 144, 226, 0.9);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.tab-item:not(.active) {
  color: #8b9dc3;
}
```

### 2. Schedule Screen Layout

#### Day Navigation & Smart Filters
```css
.schedule-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 0 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.day-navigation {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-arrow {
  width: 44px;  /* Touch-friendly */
  height: 44px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.current-day {
  text-align: center;
  min-width: 80px;
}

.day-name {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.2;
}

.day-date {
  font-size: 14px;
  color: #8b9dc3;
  margin-top: 2px;
}
```

#### Smart Filter Chips
```css
.smart-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-chip {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: #8b9dc3;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-height: 32px;
  display: flex;
  align-items: center;
}

/* Active filter states */
.filter-chip.active {
  background: rgba(74, 144, 226, 0.2);
  border-color: rgba(74, 144, 226, 0.4);
  color: #4a90e2;
}

/* Specific filter types */
.filter-chip.prep.active {
  background: rgba(255, 193, 7, 0.2);
  border-color: rgba(255, 193, 7, 0.4);
  color: #ffc107;
}

.filter-chip.travel.active {
  background: rgba(156, 39, 176, 0.2);
  border-color: rgba(156, 39, 176, 0.4);
  color: #9c27b0;
}
```

#### Schedule Event Cards
```css
.schedule-item {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  margin: 0 20px 16px 20px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  min-height: 80px;
}

.schedule-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

/* Time block - left section */
.time-block {
  flex-shrink: 0;
  text-align: center;
  margin-right: 20px;
  padding: 12px;
  background: rgba(74, 144, 226, 0.15);
  border-radius: 12px;
  border: 1px solid rgba(74, 144, 226, 0.3);
  min-width: 80px;
}

/* Time hierarchy */
.time-start {
  font-size: 18px;        /* LARGEST - primary focus */
  font-weight: 700;
  color: #4a90e2;
  line-height: 1;
}

.time-duration {
  font-size: 11px;        /* SMALLEST - supporting info */
  color: #8b9dc3;
  font-weight: 500;
  margin: 4px 0 2px 0;
}

.time-end {
  font-size: 14px;        /* MEDIUM - secondary focus */
  color: #8b9dc3;
  font-weight: 500;
}

/* Event content - middle section */
.event-content {
  flex: 1;
}

.event-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 6px;
  line-height: 1.3;
}

.event-details {
  font-size: 14px;
  color: #8b9dc3;
  line-height: 1.4;
  margin-bottom: 8px;
}

/* Status indicator - right section */
.event-status {
  display: flex;
  align-items: center;
  margin-left: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  gap: 6px;
}

/* Status types */
.prep-reminder {
  background: rgba(255, 193, 7, 0.15);
  color: #ffc107;
  border: 1px solid rgba(255, 193, 7, 0.2);
}

.next-up {
  background: rgba(74, 144, 226, 0.15);
  color: #4a90e2;
  border: 1px solid rgba(74, 144, 226, 0.2);
}

.travel-time {
  background: rgba(156, 39, 176, 0.15);
  color: #9c27b0;
  border: 1px solid rgba(156, 39, 176, 0.2);
}

/* Status dots */
.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.next-up .status-dot {
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

#### Linked Items Display
```css
.linked-items {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.link-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: rgba(74, 144, 226, 0.1);
  border: 1px solid rgba(74, 144, 226, 0.2);
  border-radius: 8px;
  font-size: 11px;
  color: #4a90e2;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 24px;
}

.link-indicator:hover {
  background: rgba(74, 144, 226, 0.15);
  transform: translateY(-1px);
}

.link-icon {
  width: 12px;
  height: 12px;
  fill: currentColor;
}

.link-count {
  font-weight: 600;
}
```

### 3. Tasks Screen Layout

#### Section Header with Filters
```css
.section-header-with-filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 20px 20px 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.section-title-group {
  display: flex;
  align-items: center;
}

.section-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  opacity: 0.8;
  fill: currentColor;
}
```

#### Task Item Cards with Swipe Actions
```css
.task-item {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  margin: 0 20px 16px 20px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  min-height: 80px;
}

.task-content-wrapper {
  display: flex;
  align-items: flex-start;
  padding: 20px;
  transform: translateX(0);
  transition: transform 0.3s ease;
  background: inherit;
}

/* Swipe states */
.task-item.swiping-left .task-content-wrapper {
  transform: translateX(-80px);
}

.task-item.swiping-right .task-content-wrapper {
  transform: translateX(80px);
}

/* Task checkbox */
.task-checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  margin-right: 16px;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  margin-top: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-checkbox.completed {
  background: #4a90e2;
  border-color: #4a90e2;
}

.task-checkbox.completed::after {
  content: '✓';
  color: white;
  font-size: 14px;
  font-weight: bold;
}

/* Task content */
.task-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 8px;
  line-height: 1.3;
  transition: all 0.3s ease;
}

.task-item.completed .task-title {
  text-decoration: line-through;
  opacity: 0.6;
}

/* Priority badges */
.priority-badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
}

.priority-high {
  background: rgba(255, 99, 99, 0.2);
  color: #ff6363;
  border: 1px solid rgba(255, 99, 99, 0.3);
}

.priority-medium {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.priority-low {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

/* Swipe actions */
.swipe-action {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
}

.swipe-action-left {
  left: 0;
  background: linear-gradient(90deg, #4caf50, rgba(76, 175, 80, 0.8));
}

.swipe-action-right {
  right: 0;
  background: linear-gradient(90deg, rgba(255, 152, 0, 0.8), #ff9800);
}

.task-item.swiping-left .swipe-action-left,
.task-item.swiping-right .swipe-action-right {
  opacity: 1;
}
```

### 4. Notes Screen Layout

#### Note Item Cards
```css
.note-item {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  margin: 0 20px 16px 20px;
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 100px;
}

.note-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.note-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 8px;
  line-height: 1.3;
}

.note-preview {
  font-size: 14px;
  color: #8b9dc3;
  line-height: 1.4;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.note-tag {
  background: rgba(74, 144, 226, 0.15);
  color: #4a90e2;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.note-tag:hover {
  background: rgba(74, 144, 226, 0.2);
}

.note-time {
  font-size: 12px;
  color: #8b9dc3;
  margin-left: auto;
}
```

## Interaction Specifications

### 1. Tab Switching Behavior

#### Touch/Tap Interaction
```javascript
// Tab switching logic
function switchTab(targetTab) {
  const tabs = ['schedule', 'tasks', 'notes'];
  const currentIndex = tabs.indexOf(currentTab);
  const targetIndex = tabs.indexOf(targetTab);
  
  // Update active tab visual state
  updateTabIndicators(targetTab);
  
  // Animate content transition
  if (targetIndex > currentIndex) {
    // Moving right - slide current left, bring new from right
    animateTabTransition('slide-left', 'slide-from-right');
  } else {
    // Moving left - slide current right, bring new from left
    animateTabTransition('slide-right', 'slide-from-left');
  }
}
```

#### Swipe Gesture Implementation
```javascript
// Swipe detection for tab switching
function handleTabSwipe(gestureEvent) {
  const { translationX, velocityX } = gestureEvent;
  const threshold = 100; // pixels
  
  if (Math.abs(translationX) > threshold) {
    if (translationX > 0) {
      // Swipe right - go to previous tab
      switchToPreviousTab();
    } else {
      // Swipe left - go to next tab
      switchToNextTab();
    }
  }
}
```

### 2. Task Swipe Actions

#### Swipe Detection and Visual Feedback
```javascript
function handleTaskSwipe(taskId, gestureEvent) {
  const { translationX } = gestureEvent;
  const leftThreshold = -80;  // Swipe left threshold
  const rightThreshold = 80;  // Swipe right threshold
  
  if (translationX < leftThreshold) {
    // Show complete action
    showSwipeAction(taskId, 'complete');
  } else if (translationX > rightThreshold) {
    // Show edit action
    showSwipeAction(taskId, 'edit');
  }
}

function executeSwipeAction(taskId, action) {
  if (action === 'complete') {
    toggleTaskCompletion(taskId);
    showCompletionAnimation(taskId);
  } else if (action === 'edit') {
    openTaskEditModal(taskId);
  }
}
```

### 3. Voice Input States and Transitions

#### Voice Input Animation States
```css
/* Default state */
.voice-input-bar {
  /* Base styles above */
}

/* Listening state with animated waveform */
.voice-input-bar.listening .voice-waveform {
  display: flex;
  align-items: center;
  gap: 2px;
}

.wave-bar {
  width: 2px;
  background: #4a90e2;
  border-radius: 1px;
  animation: wave 1.5s infinite ease-in-out;
}

.wave-bar:nth-child(1) { height: 8px; animation-delay: 0s; }
.wave-bar:nth-child(2) { height: 12px; animation-delay: 0.1s; }
.wave-bar:nth-child(3) { height: 6px; animation-delay: 0.2s; }
.wave-bar:nth-child(4) { height: 10px; animation-delay: 0.3s; }
.wave-bar:nth-child(5) { height: 8px; animation-delay: 0.4s; }

@keyframes wave {
  0%, 40%, 100% { transform: scaleY(0.4); }
  20% { transform: scaleY(1); }
}

/* Processing state */
.voice-input-bar.processing {
  border-color: #4a90e2;
  background: rgba(74, 144, 226, 0.15);
}

/* Error state */
.voice-input-bar.error {
  border-color: #ff6363;
  background: rgba(255, 99, 99, 0.1);
}
```

### 4. Smart Filter Interactions

#### Filter Selection Logic
```javascript
function handleFilterSelection(filterId, filterType) {
  // Single-select behavior - deactivate all others
  deactivateAllFilters(filterType);
  
  // Activate selected filter
  activateFilter(filterId);
  
  // Apply filter with smooth animation
  applyFilterWithAnimation(filterId);
}

function applyFilterWithAnimation(filterId) {
  // Fade out non-matching items
  const items = getItemsForCurrentTab();
  items.forEach(item => {
    if (shouldShowItem(item, filterId)) {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    } else {
      item.style.opacity = '0';
      item.style.transform = 'translateY(-10px)';
    }
  });
}
```

## Mobile-First Responsive Behavior

### 1. Screen Size Adaptations

#### Breakpoints and Scaling
```css
/* Base mobile design (320px+) */
.container {
  max-width: 100%;
  padding: 16px;
}

/* Small phones (320-374px) */
@media (max-width: 374px) {
  .app-title { font-size: 24px; }
  .schedule-item { padding: 16px; margin: 0 16px 12px 16px; }
  .time-start { font-size: 16px; }
}

/* Standard phones (375-414px) */
@media (min-width: 375px) and (max-width: 414px) {
  .container { padding: 20px; }
  /* Default styles apply */
}

/* Large phones (415px+) */
@media (min-width: 415px) {
  .container { 
    max-width: 420px; 
    margin: 0 auto; 
  }
}

/* Landscape orientation */
@media (orientation: landscape) {
  .header { padding: 12px 20px 8px; }
  .voice-input-bar { height: 40px; }
  .schedule-item { padding: 16px; }
}
```

### 2. Touch-Friendly Interactions

#### Minimum Touch Target Sizes
```css
/* Ensure all interactive elements meet 44px minimum */
.tab-item,
.nav-arrow,
.task-checkbox,
.filter-chip,
.link-indicator {
  min-height: 44px;
  min-width: 44px;
}

/* Increase tap area for small elements */
.task-checkbox::before {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
}
```

## Performance Considerations

### 1. Animation Performance
```css
/* Use transform and opacity for smooth animations */
.schedule-item,
.task-item,
.note-item {
  will-change: transform, opacity;
  transform: translateZ(0); /* Force hardware acceleration */
}

/* Avoid animating expensive properties */
.glass-card {
  /* Use transform instead of changing width/height */
  transition: transform 0.3s ease, opacity 0.3s ease;
}
```

### 2. List Virtualization Triggers
- Implement virtual scrolling when list exceeds 50 items
- Use placeholder cards during loading states
- Implement smooth infinite scroll for large datasets

## Implementation Priority

### Phase 1: Core Layout Transformation
1. ✅ **Header sticky positioning** with glassmorphism background
2. ✅ **Voice input bar** with exact styling and placeholder text
3. ✅ **Tab navigation** with active states and smooth transitions
4. ✅ **Independent screen containers** replacing stacked layout

### Phase 2: Visual Polish
1. ✅ **Glassmorphism cards** for all content items
2. ✅ **Typography hierarchy** with exact font sizes and weights
3. ✅ **Color system** implementation across all components
4. ✅ **Gradient backgrounds** and visual depth

### Phase 3
import React, { useState } from 'react';
import { TabNavigationProvider } from './contexts/TabNavigationContext';
import { ScheduleSection, TasksSection, NotesSection } from './components/sections';
import TabBar from './components/TabBar';
import { GradientBackground } from './components/background';
import { HeaderContainer, AppTitle, DateDisplay, VoiceInputBar } from './components/header';
import { GlassButton } from './components/glass';
import TestVisualsPage from './components/TestVisualsPage';
import { GeminiService } from './lib/gemini';
import { VoiceCommand } from './types';

function App() {
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [showTestVisuals, setShowTestVisuals] = useState(false);

  // Handle voice command processing
  const handleVoiceCommand = async (transcript: string) => {
    console.log('Voice transcript received:', transcript);
    setIsProcessingVoice(true);

    try {
      // Process with Gemini AI
      const command = await GeminiService.processVoiceCommand(transcript);
      console.log('Processed voice command:', command);

      // Here you would execute the command based on its type
      // This connects to your existing command execution logic

    } catch (error) {
      console.error('Voice processing error:', error);
    } finally {
      setIsProcessingVoice(false);
    }
  };

  const handleTextCommand = async (text: string) => {
    // Same processing for text input
    await handleVoiceCommand(text);
  };

  // Show test visuals page if requested
  if (showTestVisuals) {
    return <TestVisualsPage onBack={() => setShowTestVisuals(false)} />;
  }

  return (
    <TabNavigationProvider defaultTab="schedule" persistTab={true}>
      {/* Dynamic gradient background */}
      <GradientBackground 
        timeBasedGradient={true}
        animated={true}
        opacity={0.1}
      />
      
      {/* Main app container */}
      <div style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <HeaderContainer sticky={true} blur={true} safeAreaAware={true}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '24px',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <AppTitle
                title="Personal Organizer"
                size="lg"
                gradient="primary"
                animated={true}
              />
              <DateDisplay
                format="full"
                showTime={false}
                size="md"
                color="secondary"
                animated={true}
              />
            </div>

            <div style={{ flex: 1, maxWidth: '400px' }}>
              <VoiceInputBar
                placeholder="Type or speak your command..."
                showWaveform={true}
                maxRecordingTime={120}
                autoSubmit={false}
                disabled={isProcessingVoice}
                onVoiceInput={handleVoiceCommand}
                onTextInput={handleTextCommand}
              />
            </div>

            {/* Test Visuals Button */}
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={() => setShowTestVisuals(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                whiteSpace: 'nowrap',
              }}
            >
              🎨 Test Visuals
            </GlassButton>
          </div>
        </HeaderContainer>

        {/* Section containers */}
        <ScheduleSection />
        <TasksSection />
        <NotesSection />
        
        {/* Bottom tab navigation */}
        <TabBar 
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '24px',
            right: '24px',
            zIndex: 100,
          }}
        />
      </div>
    </TabNavigationProvider>
  );
}

export default App;

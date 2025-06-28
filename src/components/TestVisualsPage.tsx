import React, { useState } from 'react';
import { GlassCard, GlassButton } from './glass';

// Mock data for visual testing - no functionality
const mockEvents = [
  {
    id: '1',
    title: 'Team Standup',
    time: '9:00 AM',
    duration: '30 min',
    type: 'meeting',
    status: 'upcoming',
    priority: 'medium'
  },
  {
    id: '2',
    title: 'Client Presentation',
    time: '2:00 PM',
    duration: '1 hour',
    type: 'meeting',
    status: 'current',
    priority: 'high'
  },
  {
    id: '3',
    title: 'Code Review',
    time: '4:30 PM',
    duration: '45 min',
    type: 'work',
    status: 'upcoming',
    priority: 'medium'
  }
];

const mockTasks = [
  {
    id: '1',
    title: 'Complete project proposal',
    priority: 'high',
    dueDate: 'Today',
    status: 'pending',
    progress: 75
  },
  {
    id: '2',
    title: 'Review design mockups',
    priority: 'medium',
    dueDate: 'Tomorrow',
    status: 'pending',
    progress: 30
  },
  {
    id: '3',
    title: 'Update documentation',
    priority: 'low',
    dueDate: 'This week',
    status: 'pending',
    progress: 0
  }
];

const mockNotes = [
  {
    id: '1',
    title: 'Meeting Notes - Q4 Planning',
    content: 'Key discussion points from quarterly planning session...',
    tags: ['meeting', 'planning', 'q4'],
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    title: 'Project Ideas',
    content: 'Brainstorming session results for new features...',
    tags: ['ideas', 'features', 'brainstorm'],
    timestamp: '1 day ago'
  },
  {
    id: '3',
    title: 'Research Notes',
    content: 'Findings from user research interviews...',
    tags: ['research', 'users', 'insights'],
    timestamp: '3 days ago'
  }
];

interface TestVisualsPageProps {
  onBack?: () => void;
}

export const TestVisualsPage: React.FC<TestVisualsPageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'tasks' | 'notes'>('schedule');

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a1a2e',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '20px',
    }}>
      {/* iPhone 16 Pro Max Container */}
      <div style={{
        width: '430px',
        height: '932px',
        background: '#1a1a2e',
        borderRadius: '40px',
        border: '8px solid #2a2a3e',
        boxShadow: '0 0 30px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Dynamic Island */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '126px',
          height: '37px',
          background: '#000000',
          borderRadius: '19px',
          zIndex: 1000,
        }}></div>

        {/* App Content Container */}
        <div style={{
          width: '100%',
          height: '100%',
          paddingTop: '60px', // Account for Dynamic Island
          paddingBottom: '34px', // Account for home indicator
          paddingLeft: '16px',
          paddingRight: '16px',
          overflow: 'auto',
          background: '#1a1a2e',
        }}>
          {/* Header */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            padding: '20px 16px',
            marginBottom: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px',
        }}>
          {/* Menu Icon */}
          <div style={{
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginTop: '2px',
          }}>
            <div style={{
              width: '18px',
              height: '14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div style={{ width: '100%', height: '2px', background: '#ffffff', borderRadius: '1px' }}></div>
              <div style={{ width: '100%', height: '2px', background: '#ffffff', borderRadius: '1px' }}></div>
              <div style={{ width: '100%', height: '2px', background: '#ffffff', borderRadius: '1px' }}></div>
            </div>
          </div>

          {/* Center Content */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#ffffff',
              margin: '0 0 4px 0',
              letterSpacing: '-0.5px',
            }}>
              Hi Nikhil
            </h1>
            <p style={{
              color: '#8b8b8b',
              margin: 0,
              fontSize: '14px',
              fontWeight: '400',
            }}>
              Saturday, June 28, 2025
            </p>
          </div>

          {/* Profile Icon */}
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            marginTop: '2px',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="#ffffff" strokeWidth="2"/>
              <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="#ffffff" strokeWidth="2"/>
            </svg>
          </div>
        </div>
          
        {/* Voice Input Bar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '8px',
          padding: '12px 16px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#4CAF50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="#ffffff"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="19" x2="12" y2="23" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
              <line x1="8" y1="23" x2="16" y2="23" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Tap to Speak and add or change any item"
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#b0b0b0',
              fontSize: '14px',
              flex: 1,
              fontWeight: '400',
            }}
          />
        </div>
        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '4px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          padding: '4px',
          marginBottom: '16px',
        }}>
          {(['schedule', 'tasks', 'notes'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === tab ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                color: activeTab === tab ? '#ffffff' : '#8b8b8b',
                fontSize: '14px',
                fontWeight: activeTab === tab ? '500' : '400',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textTransform: 'capitalize',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            flex: 1,
            overflow: 'auto',
          }}>
        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div>
            {/* Date Navigation */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                {/* Left Arrow */}
                <button style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{
                    width: '0',
                    height: '0',
                    borderTop: '6px solid transparent',
                    borderBottom: '6px solid transparent',
                    borderRight: '8px solid #ffffff',
                  }}></div>
                </button>

                {/* Date Section */}
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{
                    color: '#ffffff',
                    fontSize: '18px',
                    fontWeight: '600',
                    margin: '0 0 2px 0',
                  }}>
                    Today
                  </h2>
                  <span style={{
                    color: '#8b8b8b',
                    fontSize: '14px',
                    fontWeight: '400',
                  }}>
                    28th June
                  </span>
                </div>

                {/* Right Arrow */}
                <button style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{
                    width: '0',
                    height: '0',
                    borderTop: '6px solid transparent',
                    borderBottom: '6px solid transparent',
                    borderLeft: '8px solid #ffffff',
                  }}></div>
                </button>
              </div>

              <div style={{
                display: 'flex',
                gap: '8px',
              }}>
                <button style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  color: '#ffffff',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}>Work</button>
                <button style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  color: '#ffffff',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}>Personal</button>
                <button style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  color: '#8b8b8b',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}>⚙️</button>
              </div>
            </div>

            {/* Schedule Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Team Standup Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
              }}>
                <div style={{
                  minWidth: '70px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}>
                  <div style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '600',
                    lineHeight: '1.2',
                  }}>09:00</div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <div style={{
                      width: '0',
                      height: '0',
                      borderLeft: '3px solid transparent',
                      borderRight: '3px solid transparent',
                      borderTop: '5px solid #8b8b8b',
                    }}></div>
                    <span style={{
                      color: '#8b8b8b',
                      fontSize: '12px',
                      fontWeight: '400',
                    }}>1h 30m</span>
                  </div>
                  <div style={{
                    color: '#8b8b8b',
                    fontSize: '16px',
                    fontWeight: '400',
                  }}>10:30</div>
                </div>
                <div style={{
                  flex: 1,
                  minWidth: 0,
                  maxWidth: 'calc(100% - 120px)',
                }}>
                  <h3 style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '600',
                    margin: '0 0 4px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%',
                  }}>
                    Team Standup
                  </h3>
                  <p style={{
                    color: '#8b8b8b',
                    fontSize: '14px',
                    margin: '0 0 8px 0',
                    fontWeight: '400',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%',
                  }}>
                    Weekly team sync and planning session
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    width: '100%',
                    overflow: 'hidden',
                  }}>
                    <span style={{
                      background: '#d4a853',
                      color: '#000000',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                    }}>
                      3 PREP TASKS
                    </span>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '4px',
                  minWidth: '24px',
                  width: '24px',
                  flexShrink: 0,
                  alignSelf: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: '#8b8b8b' }}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Time Gap */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                paddingLeft: '82px',
                margin: '4px 0',
              }}>
                <span style={{
                  color: '#8b8b8b',
                  fontSize: '12px',
                  fontWeight: '400',
                }}>
                  Free
                </span>
                <div style={{
                  width: '2px',
                  height: '20px',
                  background: 'repeating-linear-gradient(to bottom, #8b8b8b 0, #8b8b8b 3px, transparent 3px, transparent 6px)',
                }}></div>
                <span style={{
                  color: '#8b8b8b',
                  fontSize: '12px',
                  fontWeight: '400',
                }}>
                  3 hours 30 minutes
                </span>
              </div>

              {/* Client Presentation Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
              }}>
                <div style={{
                  minWidth: '70px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}>
                  <div style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '600',
                    lineHeight: '1.2',
                  }}>14:00</div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <div style={{
                      width: '0',
                      height: '0',
                      borderLeft: '3px solid transparent',
                      borderRight: '3px solid transparent',
                      borderTop: '5px solid #8b8b8b',
                    }}></div>
                    <span style={{
                      color: '#8b8b8b',
                      fontSize: '12px',
                      fontWeight: '400',
                    }}>1h</span>
                  </div>
                  <div style={{
                    color: '#8b8b8b',
                    fontSize: '16px',
                    fontWeight: '400',
                  }}>15:00</div>
                </div>
                <div style={{
                  flex: 1,
                  minWidth: 0,
                  maxWidth: 'calc(100% - 120px)',
                }}>
                  <h3 style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '600',
                    margin: '0 0 4px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%',
                  }}>
                    Client Presentation
                  </h3>
                  <p style={{
                    color: '#8b8b8b',
                    fontSize: '14px',
                    margin: '0 0 8px 0',
                    fontWeight: '400',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%',
                  }}>
                    Q4 project proposal presentation
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    width: '100%',
                    overflow: 'hidden',
                  }}>
                    <span style={{
                      background: '#d4a853',
                      color: '#000000',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                    }}>
                      2 PREP TASKS
                    </span>
                    <span style={{
                      background: '#8b5cf6',
                      color: '#ffffff',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                    }}>
                      TRAVEL
                    </span>
                    <span style={{
                      color: '#8b8b8b',
                      fontSize: '10px',
                      fontWeight: '500',
                      whiteSpace: 'nowrap',
                    }}>
                      +1
                    </span>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '4px',
                  minWidth: '24px',
                  width: '24px',
                  flexShrink: 0,
                  alignSelf: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: '#8b8b8b' }}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Time Gap */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                paddingLeft: '82px',
                margin: '4px 0',
              }}>
                <span style={{
                  color: '#8b8b8b',
                  fontSize: '12px',
                  fontWeight: '400',
                }}>
                  Free
                </span>
                <div style={{
                  width: '2px',
                  height: '20px',
                  background: 'repeating-linear-gradient(to bottom, #8b8b8b 0, #8b8b8b 3px, transparent 3px, transparent 6px)',
                }}></div>
                <span style={{
                  color: '#8b8b8b',
                  fontSize: '12px',
                  fontWeight: '400',
                }}>
                  1 hour 30 minutes
                </span>
              </div>

              {/* Design Review Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
              }}>
                <div style={{
                  minWidth: '70px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}>
                  <div style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '600',
                    lineHeight: '1.2',
                  }}>16:30</div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <div style={{
                      width: '0',
                      height: '0',
                      borderLeft: '3px solid transparent',
                      borderRight: '3px solid transparent',
                      borderTop: '5px solid #8b8b8b',
                    }}></div>
                    <span style={{
                      color: '#8b8b8b',
                      fontSize: '12px',
                      fontWeight: '400',
                    }}>1h</span>
                  </div>
                  <div style={{
                    color: '#8b8b8b',
                    fontSize: '16px',
                    fontWeight: '400',
                  }}>17:30</div>
                </div>
                <div style={{
                  flex: 1,
                  minWidth: 0,
                  maxWidth: 'calc(100% - 120px)',
                }}>
                  <h3 style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '600',
                    margin: '0 0 4px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%',
                  }}>
                    Design Review
                  </h3>
                  <p style={{
                    color: '#8b8b8b',
                    fontSize: '14px',
                    margin: '0 0 8px 0',
                    fontWeight: '400',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%',
                  }}>
                    Review new interface mockups with design team
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    width: '100%',
                    overflow: 'hidden',
                  }}>
                    <span style={{
                      background: '#ef4444',
                      color: '#ffffff',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                    }}>
                      URGENT
                    </span>
                    <span style={{
                      background: '#10b981',
                      color: '#ffffff',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                    }}>
                      1 POST TASK
                    </span>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '4px',
                  minWidth: '24px',
                  width: '24px',
                  flexShrink: 0,
                  alignSelf: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: '#8b8b8b' }}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div>
            {/* Filter Section - No Panel */}
            <div style={{ marginBottom: '24px' }}>
              {/* Due Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
              }}>
                <span style={{
                  color: '#8b8b8b',
                  fontSize: '12px',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  width: '60px',
                }}>
                  DUE
                </span>
                <button style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '4px 12px',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  minWidth: '40px',
                }}>All</button>
                <button style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '4px 12px',
                  color: '#8b8b8b',
                  fontSize: '12px',
                  fontWeight: '400',
                  cursor: 'pointer',
                }}>Today</button>
                <button style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '4px 12px',
                  color: '#8b8b8b',
                  fontSize: '12px',
                  fontWeight: '400',
                  cursor: 'pointer',
                }}>Tomorrow</button>
                <div style={{ flex: 1 }}></div>
                <button style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '4px 12px',
                  color: '#8b8b8b',
                  fontSize: '12px',
                  fontWeight: '400',
                  cursor: 'pointer',
                  minWidth: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '6px',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M7 12h10m-7 6h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              {/* Priority Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{
                  color: '#8b8b8b',
                  fontSize: '12px',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  width: '60px',
                }}>
                  PRIORITY
                </span>
                <button style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '4px 12px',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  minWidth: '40px',
                }}>All</button>
                <button style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '4px 12px',
                  color: '#8b8b8b',
                  fontSize: '12px',
                  fontWeight: '400',
                  cursor: 'pointer',
                }}>High</button>
                <button style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '4px 12px',
                  color: '#8b8b8b',
                  fontSize: '12px',
                  fontWeight: '400',
                  cursor: 'pointer',
                }}>Mid</button>
                <button style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '4px 12px',
                  color: '#8b8b8b',
                  fontSize: '12px',
                  fontWeight: '400',
                  cursor: 'pointer',
                }}>Low</button>
                <div style={{ flex: 1 }}></div>
                <button style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '4px 12px',
                  color: '#8b8b8b',
                  fontSize: '12px',
                  fontWeight: '400',
                  cursor: 'pointer',
                  minWidth: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '6px',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Task List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Task 1 */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}>
                <input
                  type="checkbox"
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: '#4CAF50',
                    marginTop: '2px',
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '500',
                    margin: '0 0 4px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    Prepare presentation slides
                  </h3>
                  <p style={{
                    color: '#8b8b8b',
                    fontSize: '14px',
                    fontWeight: '400',
                    margin: '0 0 8px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    Create slides for quarterly review meeting with stakeholders
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span style={{
                      background: '#ef4444',
                      color: '#ffffff',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                    }}>
                      HIGH
                    </span>
                    <span style={{
                      color: '#8b8b8b',
                      fontSize: '12px',
                    }}>
                      Due today
                    </span>
                    <span style={{
                      color: '#ef4444',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}>
                      by 14:00
                    </span>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#ef4444',
                    }}></div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '4px',
                  minWidth: '24px',
                  width: '24px',
                  flexShrink: 0,
                  alignSelf: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: '#8b8b8b' }}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Task 2 */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}>
                <input
                  type="checkbox"
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: '#4CAF50',
                    marginTop: '2px',
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '500',
                    margin: '0 0 4px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    Review team standup agenda
                  </h3>
                  <p style={{
                    color: '#8b8b8b',
                    fontSize: '14px',
                    fontWeight: '400',
                    margin: '0 0 8px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    Prepare talking points and review team progress updates
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span style={{
                      background: '#ef4444',
                      color: '#ffffff',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                    }}>
                      HIGH
                    </span>
                    <span style={{
                      color: '#8b8b8b',
                      fontSize: '12px',
                    }}>
                      Due today
                    </span>
                    <span style={{
                      color: '#ef4444',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}>
                      by 09:00
                    </span>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#ef4444',
                    }}></div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '4px',
                  minWidth: '24px',
                  width: '24px',
                  flexShrink: 0,
                  alignSelf: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: '#8b8b8b' }}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Task 3 */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}>
                <input
                  type="checkbox"
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: '#4CAF50',
                    marginTop: '2px',
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '500',
                    margin: '0 0 4px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    Finalize client proposal deck
                  </h3>
                  <p style={{
                    color: '#8b8b8b',
                    fontSize: '14px',
                    fontWeight: '400',
                    margin: '0 0 8px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    Complete final revisions and prepare presentation materials
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span style={{
                      background: '#ef4444',
                      color: '#ffffff',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                    }}>
                      HIGH
                    </span>
                    <span style={{
                      color: '#8b8b8b',
                      fontSize: '12px',
                    }}>
                      Due today
                    </span>
                    <span style={{
                      color: '#ef4444',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}>
                      by 13:30
                    </span>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#ef4444',
                    }}></div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '4px',
                  minWidth: '24px',
                  width: '24px',
                  flexShrink: 0,
                  alignSelf: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: '#8b8b8b' }}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Task 4 - Completed */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                opacity: 0.6,
              }}>
                <input
                  type="checkbox"
                  checked
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: '#4CAF50',
                    marginTop: '2px',
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '500',
                    margin: '0 0 4px 0',
                    textDecoration: 'line-through',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    Send weekly report
                  </h3>
                  <p style={{
                    color: '#8b8b8b',
                    fontSize: '14px',
                    fontWeight: '400',
                    margin: '0 0 8px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textDecoration: 'line-through',
                  }}>
                    Compile team metrics and send to management
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span style={{
                      color: '#8b8b8b',
                      fontSize: '12px',
                    }}>
                      Completed 2h ago
                    </span>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '4px',
                  minWidth: '24px',
                  width: '24px',
                  flexShrink: 0,
                  alignSelf: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: '#8b8b8b' }}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Task 5 */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}>
                <input
                  type="checkbox"
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: '#4CAF50',
                    marginTop: '2px',
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '500',
                    margin: '0 0 4px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    Update project timeline
                  </h3>
                  <p style={{
                    color: '#8b8b8b',
                    fontSize: '14px',
                    fontWeight: '400',
                    margin: '0 0 8px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    Adjust milestones and deadlines based on recent changes
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span style={{
                      background: '#f59e0b',
                      color: '#000000',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                    }}>
                      MEDIUM
                    </span>
                    <span style={{
                      color: '#8b8b8b',
                      fontSize: '12px',
                    }}>
                      Due today
                    </span>
                    <span style={{
                      color: '#f59e0b',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}>
                      by 18:00
                    </span>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#f59e0b',
                    }}></div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '4px',
                  minWidth: '24px',
                  width: '24px',
                  flexShrink: 0,
                  alignSelf: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: '#8b8b8b' }}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Task 6 */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}>
                <input
                  type="checkbox"
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: '#4CAF50',
                    marginTop: '2px',
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '500',
                    margin: '0 0 4px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    Review design mockups
                  </h3>
                  <p style={{
                    color: '#8b8b8b',
                    fontSize: '14px',
                    fontWeight: '400',
                    margin: '0 0 8px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    Provide feedback on new interface designs and wireframes
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span style={{
                      background: '#f59e0b',
                      color: '#000000',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                    }}>
                      MEDIUM
                    </span>
                    <span style={{
                      color: '#8b8b8b',
                      fontSize: '12px',
                    }}>
                      Due tomorrow
                    </span>
                    <span style={{
                      color: '#f59e0b',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}>
                      by 10:00
                    </span>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#10b981',
                    }}></div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '4px',
                  minWidth: '24px',
                  width: '24px',
                  flexShrink: 0,
                  alignSelf: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: '#8b8b8b' }}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Task 7 */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}>
                <input
                  type="checkbox"
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: '#4CAF50',
                    marginTop: '2px',
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '500',
                    margin: '0 0 4px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    Update project documentation
                  </h3>
                  <p style={{
                    color: '#8b8b8b',
                    fontSize: '14px',
                    fontWeight: '400',
                    margin: '0 0 8px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    Revise technical specs and update user guides
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span style={{
                      background: '#10b981',
                      color: '#ffffff',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                    }}>
                      LOW
                    </span>
                    <span style={{
                      color: '#8b8b8b',
                      fontSize: '12px',
                    }}>
                      Due this week
                    </span>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#10b981',
                    }}></div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '4px',
                  minWidth: '24px',
                  width: '24px',
                  flexShrink: 0,
                  alignSelf: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: '#8b8b8b' }}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div>
            {/* Notes List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Note 1 - Q4 Planning Meeting Notes */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '500',
                    margin: '0 0 4px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    Q4 Planning Meeting Notes
                  </h3>
                  <p style={{
                    color: '#8b8b8b',
                    fontSize: '14px',
                    fontWeight: '400',
                    margin: '0 0 8px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    Strategic objectives, budget allocations, team restructuring plans, and quarterly milestone reviews
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                  }}>
                    <span style={{
                      color: '#8b8b8b',
                      fontSize: '12px',
                      fontWeight: '400',
                    }}>
                      2h ago
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '6px',
                  }}>
                    <span style={{
                      background: '#3b82f6',
                      color: '#ffffff',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                    }}>
                      Meeting
                    </span>
                    <span style={{
                      background: '#8b5cf6',
                      color: '#ffffff',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                    }}>
                      Planning
                    </span>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '4px',
                  minWidth: '24px',
                  width: '24px',
                  flexShrink: 0,
                  alignSelf: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: '#8b8b8b' }}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Note 2 - Product Ideas Brainstorm */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '500',
                    margin: '0 0 4px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    Product Ideas Brainstorm
                  </h3>
                  <p style={{
                    color: '#8b8b8b',
                    fontSize: '14px',
                    fontWeight: '400',
                    margin: '0 0 8px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    Voice-first interface concepts, AI integration possibilities, user feedback analysis from recent surveys
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                  }}>
                    <span style={{
                      color: '#8b8b8b',
                      fontSize: '12px',
                      fontWeight: '400',
                    }}>
                      Yesterday
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '6px',
                  }}>
                    <span style={{
                      background: '#10b981',
                      color: '#ffffff',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                    }}>
                      Ideas
                    </span>
                    <span style={{
                      background: '#3b82f6',
                      color: '#ffffff',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                    }}>
                      Product
                    </span>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '4px',
                  minWidth: '24px',
                  width: '24px',
                  flexShrink: 0,
                  alignSelf: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: '#8b8b8b' }}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Note 3 - Research on Competitor Analysis */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '500',
                    margin: '0 0 4px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    Research on Competitor Analysis
                  </h3>
                  <p style={{
                    color: '#8b8b8b',
                    fontSize: '14px',
                    fontWeight: '400',
                    margin: '0 0 8px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    Market positioning studies, feature comparison matrices, pricing analysis, and user experience benchmarks
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                  }}>
                    <span style={{
                      color: '#8b8b8b',
                      fontSize: '12px',
                      fontWeight: '400',
                    }}>
                      3 days ago
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '6px',
                  }}>
                    <span style={{
                      background: '#f59e0b',
                      color: '#000000',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                    }}>
                      Research
                    </span>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '4px',
                  minWidth: '24px',
                  width: '24px',
                  flexShrink: 0,
                  alignSelf: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: '#8b8b8b' }}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
          </div>
        </div>

        {/* Home Indicator */}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '134px',
          height: '5px',
          background: '#ffffff',
          borderRadius: '3px',
          opacity: 0.3,
        }}></div>
      </div>

      {/* Back Button - Outside iPhone Container */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
      }}>
        <GlassButton
          variant="primary"
          onClick={onBack || (() => window.history.back())}
        >
          ← Back to Main App
        </GlassButton>
      </div>
    </div>
  );
};

export default TestVisualsPage;

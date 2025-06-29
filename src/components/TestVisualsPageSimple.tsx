import React, { useState } from 'react';

interface TestVisualsPageProps {
  onBack?: () => void;
}

const TestVisualsPageSimple: React.FC<TestVisualsPageProps> = ({ onBack }) => {
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

        {/* Content Area */}
        <div style={{
          padding: '60px 20px 20px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '20px',
          }}>
            <h1 style={{
              color: '#ffffff',
              fontSize: '24px',
              fontWeight: '600',
              margin: 0,
            }}>
              Hi Nikhil
            </h1>
            <p style={{
              color: '#8b8b8b',
              fontSize: '14px',
              margin: '4px 0 0 0',
            }}>
              Today, June 29
            </p>
          </div>

          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px',
          }}>
            {(['schedule', 'tasks', 'notes'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '8px 16px',
                  margin: '0 4px',
                  background: activeTab === tab ? 'rgba(0, 122, 255, 0.2)' : 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  color: activeTab === tab ? '#007AFF' : '#8b8b8b',
                  fontSize: '14px',
                  fontWeight: activeTab === tab ? '600' : '400',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              textAlign: 'center',
              color: '#8b8b8b',
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '500',
                margin: '0 0 8px 0',
                textTransform: 'capitalize',
              }}>
                {activeTab} Section
              </h2>
              <p style={{
                fontSize: '14px',
                margin: 0,
              }}>
                TestVisualsPage is working!
              </p>
            </div>
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
    </div>
  );
};

export default TestVisualsPageSimple;

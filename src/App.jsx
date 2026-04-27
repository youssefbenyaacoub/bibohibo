import { useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import SceneTown    from './scenes/SceneTown';
import SceneWelcome from './scenes/SceneWelcome';
import SceneGallery from './scenes/SceneGallery';
import SceneGift    from './scenes/SceneGift';
import SceneFinale  from './scenes/SceneFinale';
import AudioManager from './components/AudioManager';

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [inHub, setInHub] = useState(true);

  // Return to hub after completing a scene (or go directly to finale)
  const handleSceneComplete = () => {
    setCompletedSteps(prev => [...new Set([...prev, currentStep])]);
    
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
      setInHub(true); // Always return to hub
    }
  };

  const currentAudioScene = inHub ? 'hub' : 
    (currentStep === 1 ? 'house' : 
     currentStep === 2 ? 'gallery' : 
     currentStep === 3 ? 'gift' : 'finale');

  return (
    <div style={{ position:'relative', width:'100vw', height:'100vh', background:'#000', overflow:'hidden' }}>
      
      <AudioManager sceneType={currentAudioScene} />

      <AnimatePresence mode="wait">
        {inHub ? (
          <Motion.div
            key="hub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ width:'100%', height:'100%' }}
          >
            <SceneTown 
              currentStep={currentStep} 
              completedSteps={completedSteps}
              onEnter={() => setInHub(false)} 
            />
          </Motion.div>
        ) : (
          <Motion.div
            key={`scene-${currentStep}`}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8 }}
            style={{ width:'100%', height:'100%' }}
          >
            {currentStep === 1 && <SceneWelcome onNext={handleSceneComplete} />}
            {currentStep === 2 && <SceneGallery onNext={handleSceneComplete} />}
            {currentStep === 3 && <SceneGift    onNext={handleSceneComplete} />}
            {currentStep === 4 && <SceneFinale />}
          </Motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

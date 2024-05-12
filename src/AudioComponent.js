import React, { useEffect } from 'react';
import AudioPlayer from 'react-audio-player';

const AudioComponent = ({ audioUrl }) => {
  
    useEffect(() => {
        const fetchAudio = async () => {
            try {
                const audioResponse = await fetch(audioUrl);
                if (!audioResponse.ok) {
                    throw new Error('Failed to fetch audio');
                }
            } catch (error) {
                console.error('Error fetching audio:', error.message);
            }
        };

        fetchAudio();

        return () => {
            // Cleanup audio object
        };
    }, [audioUrl]);


    return( 
        <div>
            {audioUrl && (
                <AudioPlayer
                src={audioUrl}
                onPlay={() => console.log('playing')}
                onPause={() => console.log('paused')}
                onEnded={() => console.log('ended')}
                controls
                style={{ marginTop: '10px', width: "100%", color: "black" }}
                />
            )}
      </div>
    );
};

export default AudioComponent;

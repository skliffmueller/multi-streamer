import './Player.scss';
import React, {ReactNode, useEffect, useRef} from 'react';
import videojs from 'video.js';

function Player(props: { src: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if(videoRef.current) {
            videojs(videoRef.current, {
                controls: false,
                playsinline: true,
                autoplay: 'muted',
                children: ['MediaLoader','BigPlayButton','ErrorDisplay'],
            }, function() {
                console.log('player',  this);
                // this.play();
            });
        }
    }, []);
    return (
        <video ref={videoRef} width="230">
            <source src={props.src} type="application/x-mpegURL" />
        </video>
    );
}

export default Player;

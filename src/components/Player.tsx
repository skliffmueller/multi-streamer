import './Player.scss';
import React, {ReactNode, useEffect, useRef} from 'react';
import videojs from 'video.js';

function Player(props: { src: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if(videoRef.current) {
            const checkSrc = () => {
                fetch(props.src)
                    .then((res) => {
                        if(videoRef.current && res.status >= 200 && res.status < 300) {
                            videojs(videoRef.current, {
                                controls: false,
                                playsinline: true,
                                autoplay: 'muted',
                                children: ['MediaLoader','BigPlayButton','ErrorDisplay'],
                            }, function() {
                                console.log('player',  this);
                                this.play();
                            });
                        } else {
                            timeout = setTimeout(() => {
                                checkSrc();
                            }, 2000);
                        }

                    })
                    .catch(() => {
                        timeout = setTimeout(() => {
                            checkSrc();
                        }, 2000);
                    });
            }
            checkSrc();
        }
        return () => {
            clearTimeout(timeout);
        }
    }, [props.src]);
    
    return (
        <video ref={videoRef} width="230">
            <source src={props.src} type="application/x-mpegURL" />
        </video>
    );
}

export default Player;

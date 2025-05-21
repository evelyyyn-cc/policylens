export function setupVideoPlayer() {
    const videoThumbnail = document.getElementById('videoThumbnail');
    const videoPlayer = document.getElementById('videoPlayer');
    const localVideo = document.getElementById('localVideo');

    if (videoThumbnail && videoPlayer && localVideo) {
        videoThumbnail.addEventListener('click', function() {
            videoThumbnail.style.display = 'none';
            videoPlayer.style.display = 'block';
            
            // Start playing the video
            localVideo.play();

            const videoTitle = document.querySelector('.video-title');
            if (videoTitle) {
                videoTitle.style.opacity = '0.3';
            }
        });
    }

    handleVideoResize();
    window.addEventListener('resize', handleVideoResize);
}

function handleVideoResize(){
    const videoContainer = document.querySelector('.video-container');
    if (videoContainer) {
        // Adjust height based on width to maintain aspect ratio if needed
        const containerWidth = videoContainer.offsetWidth;
        const aspectRatio = 16 / 9;

        // Set a minimum height on smaller screens
        if (window.innerWidth <= 576) {
            videoContainer.style.minHeight = '250px';
        } else if (window.innerWidth <= 768) {
            videoContainer.style.minHeight = '300px';
        } else if (window.innerWidth <= 992) {
            videoContainer.style.minHeight = '350px';
        } else {
            videoContainer.style.minHeight = '400px';
        }
    }
}
export function setupVideoPlayer() {
    const videoThumbnail = document.getElementById('videoThumbnail');
    const youtubeIframe = document.getElementById('youtubeIframe');

    if (videoThumbnail && youtubeIframe){
        videoThumbnail.addEventListener('click',function(){
            const iframe = youtubeIframe.querySelector('iframe');
            iframe.src = iframe.getAttribute('data-src');

            videoThumbnail.style.display = 'none';
            youtubeIframe.style.display = 'block';

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
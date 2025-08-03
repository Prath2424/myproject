// Initialize Material Components
const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const topAppBar = new mdc.topAppBar.MDCTopAppBar(topAppBarElement);
const drawer = mdc.drawer.MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
const apiKeyTextField = new mdc.textField.MDCTextField(document.querySelector('.mdc-text-field'));
const saveApiKeyButton = document.querySelector('.mdc-button');

let apiKey = '';

topAppBar.setScrollTarget(document.getElementById('main-content'));
topAppBar.listen('MDCTopAppBar:nav', () => {
  drawer.open = !drawer.open;
});

saveApiKeyButton.addEventListener('click', () => {
    apiKey = apiKeyTextField.value;
    console.log('API key saved.');
});

async function generateContent(prompt, wantsImage = false, imageData = null) {
    if (!apiKey) {
        console.error('API key not set.');
        return;
    }

    const model = wantsImage ? 'gemini-pro-vision' : 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const parts = [{ text: prompt }];
    if (imageData) {
        parts.push({
            inline_data: {
                mime_type: 'image/jpeg',
                data: imageData.split(',')[1]
            }
        });
    }

    const payload = {
        contents: [{ parts: parts }],
        generationConfig: {}
    };

    if (wantsImage) {
        payload.generationConfig.responseMimeType = "image/png";
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        if (wantsImage) {
            return `data:image/png;base64,${data.candidates[0].content.parts[0].inlineData.data}`;
        } else {
            return data.candidates[0].content.parts[0].text;
        }
    } catch (error) {
        console.error('Error calling Gemini API:', error);
    }
}

const videoTopicTextField = new mdc.textField.MDCTextField(document.querySelector('#video-topic').parentElement);
const generateTitlesButton = document.querySelector('#generate-titles-button');
const titleList = document.querySelector('#title-list');

generateTitlesButton.addEventListener('click', async () => {
    const topic = videoTopicTextField.value;
    if (!topic) {
        console.error('Video topic not set.');
        return;
    }

    const prompt = `Generate 5 optimized YouTube titles for a video about "${topic}".`;
    const result = await generateContent(prompt);

    if (result) {
        const titles = result.split('\n').filter(title => title.trim() !== '');
        titleList.innerHTML = '';
        titles.forEach(title => {
            const listItem = document.createElement('li');
            listItem.className = 'mdc-list-item';
            listItem.innerHTML = `<span class="mdc-list-item__text">${title}</span>`;
            titleList.appendChild(listItem);
        });
    }
});

const shortVideoTopicTextField = new mdc.textField.MDCTextField(document.querySelector('#short-video-topic').parentElement);
const generateShortThumbnailButton = document.querySelector('#generate-short-thumbnail-button');
const shortThumbnailPlaceholder = document.querySelector('#short-thumbnail-placeholder');

generateShortThumbnailButton.addEventListener('click', async () => {
    const topic = shortVideoTopicTextField.value;
    if (!topic) {
        console.error('Video topic not set.');
        return;
    }

    const prompt = `Generate a YouTube short video thumbnail for a video about "${topic}".`;
    const result = await generateContent(prompt, true);

    if (result) {
        shortThumbnailPlaceholder.innerHTML = `<img src="${result}" style="width: 100%;">`;
    }
});

const findMusicButton = document.querySelector('#find-music-button');
const musicList = document.querySelector('#music-list');

findMusicButton.addEventListener('click', async () => {
    const prompt = "What are the top 5 trending songs on YouTube right now?";
    const result = await generateContent(prompt);

    if (result) {
        const songs = result.split('\n').filter(song => song.trim() !== '');
        musicList.innerHTML = '';
        songs.forEach(song => {
            const listItem = document.createElement('li');
            listItem.className = 'mdc-list-item';
            listItem.innerHTML = `<span class="mdc-list-item__text">${song}</span>`;
            musicList.appendChild(listItem);
        });
    }
});

const getTimeSuggestionButton = document.querySelector('#get-time-suggestion-button');
const timeSuggestionList = document.querySelector('#time-suggestion-list');

getTimeSuggestionButton.addEventListener('click', async () => {
    const prompt = "What is the best time to post a YouTube video to get the most views?";
    const result = await generateContent(prompt);

    if (result) {
        const suggestions = result.split('\n').filter(suggestion => suggestion.trim() !== '');
        timeSuggestionList.innerHTML = '';
        suggestions.forEach(suggestion => {
            const listItem = document.createElement('li');
            listItem.className = 'mdc-list-item';
            listItem.innerHTML = `<span class="mdc-list-item__text">${suggestion}</span>`;
            timeSuggestionList.appendChild(listItem);
        });
    }
});

const findCopyrightFreeMusicButton = document.querySelector('#find-copyright-free-music-button');
const copyrightFreeMusicList = document.querySelector('#copyright-free-music-list');

findCopyrightFreeMusicButton.addEventListener('click', async () => {
    const prompt = "Where can I find copyright-free music for my YouTube videos?";
    const result = await generateContent(prompt);

    if (result) {
        const musicSources = result.split('\n').filter(source => source.trim() !== '');
        copyrightFreeMusicList.innerHTML = '';
        musicSources.forEach(source => {
            const listItem = document.createElement('li');
            listItem.className = 'mdc-list-item';
            listItem.innerHTML = `<span class="mdc-list-item__text">${source}</span>`;
            copyrightFreeMusicList.appendChild(listItem);
        });
    }
});

const voiceScriptTextArea = new mdc.textField.MDCTextField(document.querySelector('#voice-script').parentElement);
const generateVoiceButton = document.querySelector('#generate-voice-button');
const voicePlayer = document.querySelector('#voice-player');

generateVoiceButton.addEventListener('click', async () => {
    const script = voiceScriptTextArea.value;
    if (!script) {
        console.error('Script not set.');
        return;
    }

    const url = googleTTS.getAudioUrl(script, {
        lang: 'en',
        slow: false,
        host: 'https://translate.google.com',
    });

    voicePlayer.innerHTML = `<audio controls src="${url}"></audio>`;
});

const longVideoInput = document.querySelector('#long-video-input');
const processVideoButton = document.querySelector('#process-video-button');
const shortVideoPlayer = document.querySelector('#short-video-player');

processVideoButton.addEventListener('click', async () => {
    const file = longVideoInput.files[0];
    if (!file) {
        console.error('No video file selected.');
        return;
    }

    console.log(`Processing video: ${file.name}`);
});

const generateReelIdeasButton = document.querySelector('#generate-reel-ideas-button');
const reelIdeasList = document.querySelector('#reel-ideas-list');

generateReelIdeasButton.addEventListener('click', async () => {
    const prompt = "Generate 5 creative Instagram Reel ideas.";
    const result = await generateContent(prompt);

    if (result) {
        const ideas = result.split('\n').filter(idea => idea.trim() !== '');
        reelIdeasList.innerHTML = '';
        ideas.forEach(idea => {
            const listItem = document.createElement('li');
            listItem.className = 'mdc-list-item';
            listItem.innerHTML = `<span class="mdc-list-item__text">${idea}</span>`;
            reelIdeasList.appendChild(listItem);
        });
    }
});

const captionTopicTextField = new mdc.textField.MDCTextField(document.querySelector('#caption-topic').parentElement);
const generateCaptionsButton = document.querySelector('#generate-captions-button');
const captionsList = document.querySelector('#captions-list');

generateCaptionsButton.addEventListener('click', async () => {
    const topic = captionTopicTextField.value;
    if (!topic) {
        console.error('Topic not set.');
        return;
    }

    const prompt = `Generate 5 engaging Instagram captions for a post about "${topic}".`;
    const result = await generateContent(prompt);

    if (result) {
        const captions = result.split('\n').filter(caption => caption.trim() !== '');
        captionsList.innerHTML = '';
        captions.forEach(caption => {
            const listItem = document.createElement('li');
            listItem.className = 'mdc-list-item';
            listItem.innerHTML = `<span class="mdc-list-item__text">${caption}</span>`;
            captionsList.appendChild(listItem);
        });
    }
});

const hashtagTopicTextField = new mdc.textField.MDCTextField(document.querySelector('#hashtag-topic').parentElement);
const generateHashtagsButton = document.querySelector('#generate-hashtags-button');
const hashtagsList = document.querySelector('#hashtags-list');

generateHashtagsButton.addEventListener('click', async () => {
    const topic = hashtagTopicTextField.value;
    if (!topic) {
        console.error('Topic not set.');
        return;
    }

    const prompt = `Generate 10 relevant hashtags for an Instagram post about "${topic}".`;
    const result = await generateContent(prompt);

    if (result) {
        const hashtags = result.split('\n').filter(hashtag => hashtag.trim() !== '');
        hashtagsList.innerHTML = '';
        hashtags.forEach(hashtag => {
            const listItem = document.createElement('li');
            listItem.className = 'mdc-list-item';
            listItem.innerHTML = `<span class="mdc-list-item__text">${hashtag}</span>`;
            hashtagsList.appendChild(listItem);
        });
    }
});

const generateHooksButton = document.querySelector('#generate-hooks-button');
const hooksList = document.querySelector('#hooks-list');

generateHooksButton.addEventListener('click', async () => {
    const prompt = "Generate 5 catchy hooks for an Instagram Reel.";
    const result = await generateContent(prompt);

    if (result) {
        const hooks = result.split('\n').filter(hook => hook.trim() !== '');
        hooksList.innerHTML = '';
        hooks.forEach(hook => {
            const listItem = document.createElement('li');
            listItem.className = 'mdc-list-item';
            listItem.innerHTML = `<span class="mdc-list-item__text">${hook}</span>`;
            hooksList.appendChild(listItem);
        });
    }
});

const generateQuotesButton = document.querySelector('#generate-quotes-button');
const quotesList = document.querySelector('#quotes-list');

generateQuotesButton.addEventListener('click', async () => {
    const prompt = "Generate 5 inspiring quotes for an Instagram Story.";
    const result = await generateContent(prompt);

    if (result) {
        const quotes = result.split('\n').filter(quote => quote.trim() !== '');
        quotesList.innerHTML = '';
        quotes.forEach(quote => {
            const listItem = document.createElement('li');
            listItem.className = 'mdc-list-item';
            listItem.innerHTML = `<span class="mdc-list-item__text">${quote}</span>`;
            quotesList.appendChild(listItem);
        });
    }
});

const photoInput = document.querySelector('#photo-input');
const enhancePhotoButton = document.querySelector('#enhance-photo-button');
const enhancedPhotoPlaceholder = document.querySelector('#enhanced-photo-placeholder');

enhancePhotoButton.addEventListener('click', async () => {
    const file = photoInput.files[0];
    if (!file) {
        console.error('No photo file selected.');
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
        const imageData = reader.result;
        const prompt = "Enhance this photo.";
        const result = await generateContent(prompt, true, imageData);

        if (result) {
            enhancedPhotoPlaceholder.innerHTML = `<img src="${result}" style="width: 100%;">`;
        }
    };
});

const drawerLinks = document.querySelectorAll('.mdc-list-item');
const toolCards = document.querySelectorAll('.mdc-card:not(#api-key-card)');

function showCard(targetId) {
    toolCards.forEach(card => {
        if (card.id === targetId) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

drawerLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        showCard(targetId);
        drawer.open = false;
    });
});

// Show the first card by default
showCard('youtube-title-optimizer');

console.log("App loaded and Material Components initialized.");

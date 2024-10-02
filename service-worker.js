// Downloading story only works if you open a new tab in the story page. Extension limitation

async function reddenStory() {
  const html = window.document.children[0].innerHTML
  const idx = html.search('profilePage_')
  const id = html.slice(idx).match(/profilePage_(\d+)/)[1]
  const uri = `https://www.instagram.com/graphql/query/?query_hash=de8017ee0a7c9c45ec4260733d81ea31&variables=%7B%22reel_ids%22%3A%5B${id}%5D%2C%22tag_names%22%3A%5B%5D%2C%22location_ids%22%3A%5B%5D%2C%22highlight_reel_ids%22%3A%5B%5D%2C%22precomposed_overlay%22%3Afalse%2C%22show_story_viewer_list%22%3Atrue%2C%22story_viewer_fetch_count%22%3A50%2C%22story_viewer_cursor%22%3A%22%22%7D`

  const response = await fetch(uri)
  const json = await response.json()

  const imgSrc = []
  const videoSrc = []
  json.data.reels_media[0].items.forEach((media) => {
    if (media.__typename === 'GraphStoryImage') {
      imgSrc.push(media.display_url)
    } else {
      imgSrc.push(media.display_url)
      videoSrc.push(media.video_resources[0].src)
    }
  })

  imgSrc.forEach((img) => {
    window.open(img, '_blank')
  })
  videoSrc.forEach((video) => {
    window.open(video, '_blank')
  })
}

async function reddenPage() {
  const uri = window.location.protocol + '//' + window.location.host + window.location.pathname

  const response = await fetch(uri + '?__a=1&__d=dis')
  const json = await response.json()

  const imgSrc = []
  const videoSrc = []
  if ('carousel_media' in json.items[0]) {
    json.items[0].carousel_media.forEach((media) => {
      if (media.media_type === 1) {
        imgSrc.push(media.image_versions2.candidates[0].url)
      } else {
        imgSrc.push(media.image_versions2.candidates[0].url)
        videoSrc.push(media.video_versions[0].url)
      }
    })
  } else if (json.items[0].media_type === 1) {
    imgSrc.push(json.items[0].image_versions2.candidates[0].url)
  } else if (json.items[0].media_type === 2) {
    imgSrc.push(json.items[0].image_versions2.candidates[0].url)
    if (json.items[0].image_versions2.additional_candidates) {
      imgSrc.push(json.items[0].image_versions2.additional_candidates.first_frame.url)
      imgSrc.push(json.items[0].image_versions2.additional_candidates.igtv_first_frame.url)
    }
    videoSrc.push(json.items[0].video_versions[0].url)
  }

  imgSrc.forEach((img) => {
    window.open(img, '_blank')
  })
  videoSrc.forEach((video) => {
    window.open(video, '_blank')
  })
}

chrome.action.onClicked.addListener((tab) => {
  if (tab.url.startsWith('https://www.instagram.com/p/')) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: reddenPage,
    })
  } else if (tab.url.includes('https://www.instagram.com/')) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: reddenStory,
    })
  }
})

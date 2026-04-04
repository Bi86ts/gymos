const apiKey = "AIzaSyDNdtoVgEG39NHIfdMH0GKPpKpjd1jvErY";
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

const reqBody = {
  contents: [
    {
      parts: [
        {
          text: "Find a very short, 5-second video URL (YouTube Shorts or exact video URL) demonstrating how to do a Deadlift exercise. Return ONLY the string of the URL."
        }
      ]
    }
  ],
  systemInstruction: {
    parts: [
      { text: "You are a fitness bot. Find short videos of exercises. You must return only a valid YouTube URL." }
    ]
  }
};

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(reqBody)
})
  .then(res => res.json())
  .then(data => {
    console.log(JSON.stringify(data, null, 2));
  })
  .catch(console.error);

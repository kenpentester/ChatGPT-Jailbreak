// Define the waitUntilVisible() function
function waitUntilVisible(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(interval);
        resolve(element);
      } else if (Date.now() - startTime >= timeout) {
        clearInterval(interval);
        reject(`Element ${selector} not found within ${timeout}ms`);
      }
    }, 100);
  });
}

// Load the settings from the extension's manifest file
chrome.runtime.getManifest().then(manifest => {
  const settings = manifest.chatgpt_jailbreak;
  
  // Wait for the text area element to become visible
  waitUntilVisible(settings.selector, settings.timeout).then(textArea => {
    // Wait for an additional 5 seconds before adding input to the textbox
    setTimeout(() => {
      // Set the input value
      textArea.value = settings.inputValue;
      
      // Create and trigger a "keydown" event to simulate pressing the "Enter" key
      const enterEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        which: 13,
        keyCode: 13,
        bubbles: true,
        cancelable: true,
      });
      textArea.dispatchEvent(enterEvent);

      // Clear the textarea's value
      textArea.value = "";

      // Trigger the "input" event to notify OpenAI that the input has changed
      const inputEvent = new Event('input', { bubbles: true });
      textArea.dispatchEvent(inputEvent);
    }, settings.delay);
  }).catch(error => {
    console.log(error);
  });
});

(() => {
  "use strict";
  function protect(video) {
    video.setAttribute("controlsList", "nodownload noremoteplayback");
    video.setAttribute("disablePictureInPicture", "");
    video.setAttribute("disableRemotePlayback", "");
    video.draggable = false;
  }
  function scan(root) {
    if (root instanceof HTMLVideoElement) protect(root);
    if (root.querySelectorAll) root.querySelectorAll("video").forEach(protect);
  }
  scan(document);
  new MutationObserver(records => {
    records.forEach(record => record.addedNodes.forEach(scan));
  }).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("contextmenu", event => {
    if (event.target instanceof HTMLVideoElement) event.preventDefault();
  }, true);
  document.addEventListener("dragstart", event => {
    if (event.target instanceof HTMLVideoElement) event.preventDefault();
  }, true);
})();

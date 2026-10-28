/**
 * Opens the native browser print preview dialog directly in the current browser tab
 * without opening a new tab or window, using an invisible iframe.
 */
export function printHtmlInCurrentTab(html: string): void {
  // Remove any pre-existing print iframe
  const existingFrame = document.getElementById("__pos_print_iframe__");
  if (existingFrame) {
    existingFrame.remove();
  }

  const iframe = document.createElement("iframe");
  iframe.id = "__pos_print_iframe__";
  iframe.style.position = "fixed";
  iframe.style.top = "-9999px";
  iframe.style.left = "-9999px";
  iframe.style.width = "0px";
  iframe.style.height = "0px";
  iframe.style.border = "none";
  iframe.style.opacity = "0";
  iframe.style.pointerEvents = "none";

  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!doc || !iframe.contentWindow) return;

  doc.open();
  doc.write(html);
  doc.close();

  // Allow styling and assets (e.g. base64 logos and fonts) to finish rendering
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (err) {
      console.error("Print error in current tab:", err);
    } finally {
      // Clean up the iframe after the print dialog finishes or is dismissed
      setTimeout(() => {
        const frame = document.getElementById("__pos_print_iframe__");
        if (frame) {
          frame.remove();
        }
      }, 1000);
    }
  }, 250);
}

// Enquiry form -> Google Sheet (via Google Apps Script Web App)
//
// Setup (test sheet):
//   1. Open (or create) the Google Sheet you want enquiries saved to.
//   2. Extensions > Apps Script, paste the doPost() code from the project
//      notes, save.
//   3. Deploy > New deployment > type "Web app".
//        Execute as: Me
//        Who has access: Anyone
//   4. Copy the deployment URL (ends in /exec) and paste it below.
//
// To switch to the client's sheet later: open the Apps Script editor
// bound to the client's sheet, paste the same doPost() code, deploy as a
// Web App the same way, and replace the URL below with the new one.
// Nothing else in this file needs to change.
var ENQUIRY_SHEET_URL = "https://script.google.com/macros/s/AKfycbxkuilTml1rWE28OhB_NGyHTLr2_-Yhh0JrPoFVmcK9KZq4nGhvjvQQC-Wh799KIX2d/exec";

(function () {
	var form = document.getElementById("enquiryForm");
	if (!form) return;

	var statusEl = form.querySelector(".enquiry-form__status");

	function setStatus(message, isError) {
		if (!statusEl) return;
		statusEl.textContent = message;
		statusEl.classList.toggle("enquiry-form__status--error", !!isError);
	}

	form.addEventListener("submit", function (e) {
		e.preventDefault();

		if (!ENQUIRY_SHEET_URL || ENQUIRY_SHEET_URL.indexOf("PASTE_YOUR") === 0) {
			setStatus("Enquiry form isn't connected yet — add the Apps Script URL in assets/js/enquiry.js.", true);
			return;
		}

		var submitBtn = form.querySelector("button[type=submit]");
		var formData = new FormData(form);

		if (submitBtn) {
			submitBtn.disabled = true;
			submitBtn.textContent = "Sending...";
		}
		setStatus("");

		fetch(ENQUIRY_SHEET_URL, {
			method: "POST",
			mode: "no-cors",
			body: formData,
		})
			.then(function () {
				// "no-cors" mode always resolves without giving us the real
				// response, so we treat "no network error" as success.
				setStatus("Thanks! We've received your enquiry and will contact you soon.");
				form.reset();
				form.querySelector('[name="product"]').value = formData.get("product");
			})
			.catch(function () {
				setStatus("Something went wrong sending your enquiry. Please try again.", true);
			})
			.finally(function () {
				if (submitBtn) {
					submitBtn.disabled = false;
					submitBtn.textContent = "Send Enquiry";
				}
			});
	});
})();

const form = document.querySelector('#consultation-form');
const endpoint = window.faineIntegrations?.consultationEndpoint?.trim();

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const status = form.querySelector('.form-status');
  const submitButton = form.querySelector('[type="submit"]');
  const values = Object.fromEntries(new FormData(form).entries());
  const bookingPath = 'booking/';

  status.classList.remove('is-success', 'is-error');
  if (!endpoint) {
    status.innerHTML = 'Online consultation requests are not connected yet. Your information has <strong>not</strong> been sent. You can choose a time on the <a href="' + bookingPath + '">booking page</a>.';
    status.classList.add('is-active', 'is-error');
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = 'Sending request…';
  status.textContent = 'Sending your request securely…';
  status.classList.add('is-active');

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(values)
    });
    if (!response.ok) throw new Error('Submission failed');
    form.reset();
    status.textContent = 'Thanks. Your consultation request has been received. We’ll follow up using the contact details you provided.';
    status.classList.remove('is-error');
    status.classList.add('is-success');
  } catch {
    status.textContent = 'We couldn’t send your request. Please try again later or choose a time on the booking page.';
    status.classList.remove('is-success');
    status.classList.add('is-error');
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Request Consultation <span aria-hidden="true">↗</span>';
  }
});

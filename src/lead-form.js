// Contact form → ClickUp lead: first touch, campaign history, summary, source follow-up (shared by the site and
// the Ghost blog theme, see scripts/ghost-shell.mjs). __DEPLOY_ENV__ is set by vite (site) or by the blog bundle.
// First touch of this visit (sessionStorage, so it survives page-to-page navigation until the tab closes):
// landing page, external referrer and campaign parameters. Added to the lead description on submit.
const FIRST_TOUCH_KEY = 'bxt_first_touch';
const TRACKED_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'];
function readFirstTouch() {
  try { return JSON.parse(sessionStorage.getItem(FIRST_TOUCH_KEY) || 'null'); } catch (e) { return null; }
}
// Campaign history (localStorage, 90 days, last 10): every visit that arrives with a campaign (utm_source, gclid or
// fbclid) is appended, so a lead that comes back days later, from another tab or another campaign, still carries
// every campaign that brought them (owner 2026-09-30: UTMs must always reach the lead, keep the history).
// The same campaign again (same utm_source/medium/campaign/content/term and click id) only refreshes its date.
const CAMPAIGN_KEY = 'bxt_campaigns';
const CAMPAIGN_TTL = 90 * 24 * 3600 * 1000;
const CAMPAIGN_MAX = 10;
function readCampaigns() {
  try {
    const list = JSON.parse(localStorage.getItem(CAMPAIGN_KEY) || '[]');
    return Array.isArray(list) ? list.filter((c) => c && c.utm && Date.now() - c.at < CAMPAIGN_TTL) : [];
  } catch (e) { return []; }
}
(function captureFirstTouch() {
  const params = new URLSearchParams(window.location.search);
  const utm = {};
  TRACKED_PARAMS.forEach((p) => { if (params.has(p)) utm[p] = params.get(p); });
  try {
    if (utm.utm_source || utm.gclid || utm.fbclid) { // utm_content alone on an internal link is not a campaign
      const key = JSON.stringify(utm);
      const list = readCampaigns().filter((c) => JSON.stringify(c.utm) !== key);
      list.push({ utm, landing: window.location.pathname + window.location.search, referrer: document.referrer || '', at: Date.now() });
      localStorage.setItem(CAMPAIGN_KEY, JSON.stringify(list.slice(-CAMPAIGN_MAX)));
    }
  } catch (e) { /* storage blocked */ }
  try {
    if (sessionStorage.getItem(FIRST_TOUCH_KEY)) return;
    sessionStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify({
      landing: window.location.pathname + window.location.search,
      referrer: document.referrer || '',
      utm,
    }));
  } catch (e) { /* storage blocked (private mode, cookies off): the lead still sends without first-touch data */ }
})();

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('task-form');
  const successMsg = document.getElementById('success-msg');
  const errorMsg = document.getElementById('error-msg'); // design-v2 modal only
  const sourceForm = document.getElementById('source-form'); // design-v2 success state: "How did you find us?"
  if (!form) return;
  let lastLead = null; // for the follow-up source task

  // GA4: first interaction with the form (form_open is sent from src/v2.js).
  let started = false;
  form.addEventListener('focusin', () => {
      if (started) return;
      started = true;
      if (typeof gtag === 'function') gtag('event', 'form_start', { page_path: window.location.pathname });
  });

  // Owner 2026-09-30: the source question is a second, separate ClickUp task sent after the lead
  // ("Source: … - <email>"), matched to the lead by email and time. Later: write it into the lead itself.
  sourceForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const value = e.submitter?.value;
      if (!value) return;
      sourceForm.querySelectorAll('button').forEach((b) => { b.disabled = true; b.classList.toggle('is-picked', b === e.submitter); });
      const thanks = sourceForm.querySelector('.v2-source__thanks');
      if (thanks) thanks.hidden = false;
      if (typeof gtag === 'function') gtag('event', 'lead_source', { source: value });
      const lead = lastLead || {};
      const taskData = {
          name: `${getCurrentDateTime()} - ${lead.email || 'No Email'} - Source: ${value}`,
          description: [
              `Source (answer after the lead): ${value}`,
              formatToDescription('Lead email', lead.email),
              formatToDescription('Lead name', lead.name),
              formatToDescription('Lead sent', lead.time),
              formatToDescription('Lead UTM', lead.utm),
              formatToDescription('Page', window.location.pathname),
          ].filter(Boolean).join('\n'),
      };
      if (__DEPLOY_ENV__ === 'dev') { console.info('[dev] source answer not sent', taskData); return; }
      try {
          await fetch('https://clickup.base-xtech.com', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(taskData) });
      } catch (err) { console.error('Source answer not sent:', err); }
  });

  document.querySelector('[data-form-retry]')?.addEventListener('click', () => {
      errorMsg.classList.remove('error');
      form.classList.remove('hide');
  });

  function getUrlParams() {
      const params = new URLSearchParams(window.location.search);
      const trackedParams = [
          'gclid',
          'fbclid',
          'utm_source',
          'utm_medium',
          'utm_campaign',
          'utm_content',
          'utm_term'
      ];

      const result = {};
      trackedParams.forEach(param => {
          if (params.has(param)) {
              result[param] = params.get(param);
          }
      });
      return result;
  }

  function formatToDescription(label, value) {
      return value ? `${label}: ${value}` : '';
  }

  function formatUrlParamsToDescription(params) {
      const entries = Object.entries(params);
      if (entries.length === 0) return '';
      return '\n\nURL Parameters:\n' + entries.map(([key, value]) => `${key}: ${value}`).join('\n');
  }

  // Approximate location for the lead (contact-form review 2026-09-30): country from Cloudflare's /cdn-cgi/trace
  // (same origin on prod and dev, derived from the IP address, no browser prompt) plus the browser time zone.
  // Never blocks the send: 1.5 s timeout, empty on localhost or any error.
  async function getApproxLocation() {
      let tz = '';
      try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { /* old browser */ }
      let country = '';
      try {
          const ctrl = new AbortController();
          const timer = setTimeout(() => ctrl.abort(), 1500);
          const res = await fetch('/cdn-cgi/trace', { signal: ctrl.signal, cache: 'no-store' });
          clearTimeout(timer);
          const code = res.ok ? ((await res.text()).match(/^loc=([A-Z]{2})$/m) || [])[1] : '';
          if (code && code !== 'XX' && code !== 'T1') {
              try { country = new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code; } catch (e) { country = code; }
          }
      } catch (e) { /* not behind Cloudflare (localhost) or blocked */ }
      return { country, tz };
  }

  function getCurrentDateTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  form.addEventListener('submit', async (e) => {
      e.preventDefault();
      form.classList.add('unactive');

      const formData = new FormData(form);
      const name = formData.get('name');
      const email = formData.get('email');
      const phone = formData.get('phone');
      const company = formData.get('company');
      // v2 options carry the English label in data-lead (DE page shows German text); legacy drawers use the text.
      const serviceOption = form.querySelector('.form-select')?.selectedOptions[0];
      const service = serviceOption ? (serviceOption.dataset.lead || serviceOption.text) : '';
      const budget = formData.get('budget');
      const source = formData.get('source'); // "How did you find us?" (v2 modal only)
      const tellUsMore = formData.get('tell_us_more') || '';
      const firstTouch = readFirstTouch();
      const firstUtm = firstTouch && firstTouch.utm ? Object.entries(firstTouch.utm).map(([k, v]) => `${k}=${v}`).join(', ') : '';
      const utmText = (u) => Object.entries(u).map(([k, v]) => `${k}=${v}`).join(', ');
      const campaigns = readCampaigns();
      const campaign = campaigns[campaigns.length - 1] || null; // the latest campaign
      const campaignUtm = campaign ? utmText(campaign.utm) : '';
      const campaignHistory = campaigns.length > 1 || (campaign && campaignUtm !== firstUtm)
          ? 'Campaign history (oldest first):\n' + campaigns.map((c) => `- ${new Date(c.at).toISOString().slice(0, 16).replace('T', ' ')} UTC · ${utmText(c.utm)} · landed ${c.landing}${c.referrer ? ' · from ' + c.referrer : ''}`).join('\n')
          : '';
      let sent = false;

      const currentDateTime = getCurrentDateTime();
      const siteLang = (document.documentElement.lang || document.body.lang || 'en').slice(0, 2).toUpperCase();
      const loc = await getApproxLocation();
      const locationText = [loc.country, loc.tz].filter(Boolean).join(', ');
      // One-line summary for sales triage, also appended to the task name: DE · service · budget · website · country
      const anyUtm = { ...(campaign ? campaign.utm : {}), ...getUrlParams(), ...(firstTouch && firstTouch.utm ? firstTouch.utm : {}) };
      const utmTag = anyUtm.utm_source ? `utm: ${anyUtm.utm_source}${anyUtm.utm_campaign ? '/' + anyUtm.utm_campaign : ''}` : (anyUtm.gclid ? 'utm: google ads (gclid)' : '');
      const summary = [siteLang, service, budget, company, loc.country, utmTag].filter(Boolean).join(' · ');
      const taskName = `${currentDateTime} - ${email || 'No Email'} - ${name || 'No Name'}` + (summary ? ` · ${summary}` : '');

      const browserLanguage = navigator.language || navigator.languages[0] || 'unknown';

      const descriptionParts = [
          summary,
          '',
          formatToDescription('Name', name),
          formatToDescription('Email', email),
          formatToDescription('Phone', phone),
          formatToDescription(sourceForm ? 'Website / company' : 'Company', company),
          formatToDescription('Service required', service),
          formatToDescription('Budget', budget),
          formatToDescription('Source', source),
          formatToDescription('Site language', siteLang),
          formatToDescription('Location (approx.)', locationText),
          formatToDescription('Browser language', browserLanguage),
          formatToDescription('Page', window.location.pathname),
          firstTouch ? formatToDescription('First landing page', firstTouch.landing) : '',
          firstTouch ? formatToDescription('First referrer', firstTouch.referrer || '(direct)') : '',
          formatToDescription('First-touch UTM', firstUtm),
          campaign && campaignUtm !== firstUtm ? formatToDescription('Last campaign UTM', campaignUtm) : '',
          campaignHistory,
          tellUsMore ? `Tell us more:\n${tellUsMore}` : ''
      ].filter((part, i) => part || (i === 1 && summary));

      let description = descriptionParts.join('\n');

      const urlParams = getUrlParams();
      const paramsDescription = formatUrlParamsToDescription(urlParams);
      if (paramsDescription) {
          description += paramsDescription;
      }

      const taskData = {
          name: taskName,
          description: description
      };

      lastLead = { email, name, time: currentDateTime, utm: firstUtm || campaignUtm };

      if (!email || !name) {
          console.error('Error: Email and Name are required');
          form.classList.remove('unactive');
          return;
      }

      try {
          // Dev/preview builds never send real leads (spec REQ-025); the success state still shows.
          if (__DEPLOY_ENV__ === 'dev') {
              console.info('[dev] contact form not sent', taskData);
              form.reset();
              sent = true;
              return;
          }
          const response = await fetch('https://clickup.base-xtech.com', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(taskData)
          });

          const responseText = await response.text();

          if (!response.ok) {
              throw new Error(`Server error: ${response.status} - ${responseText}`);
          }

          const result = responseText ? JSON.parse(responseText) : {};


          if (result.success) {
              sent = true;
              form.reset();
              form.classList.add('unactive');
              if (typeof gtag === 'function') {
                  gtag('event', 'generate_lead');
              }
          } else {
              console.error('Server error:', result.error || 'Unknown error');
          }
      } catch (error) {
          console.error('Error:', error);
      } finally {
          form.classList.remove('unactive');
          form.classList.add('hide');
          // Legacy drawers have no error panel and keep showing the thank-you state.
          if (!sent && errorMsg) errorMsg.classList.add('error');
          else successMsg.classList.add('success');
      }
  });
});

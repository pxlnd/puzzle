(function () {
  const selectors = {
    subtitle: '[data-i18n="subtitle"]',
    trialHeadline: '[data-i18n="trial.headline"]',
    trialDescription: '[data-i18n="trial.description"]',
    subscribeButton: '[data-i18n="subscribeButton"]',
    restorePurchases: '[data-i18n="footer.restorePurchases"]',
    termsOfUse: '[data-i18n="footer.termsOfUse"]',
    privacyPolicy: '[data-i18n="footer.privacyPolicy"]',
    note: '[data-i18n="note"]',
  };

  function setText(selector, value) {
    if (typeof value !== 'string') {
      return;
    }

    const element = document.querySelector(selector);
    if (element) {
      element.textContent = value;
    }
  }

  function setHtml(selector, html) {
    if (typeof html !== 'string') {
      return;
    }

    const element = document.querySelector(selector);
    if (element) {
      element.innerHTML = html;
    }
  }

  function convertUnityRichTextToHtml(value) {
    if (typeof value !== 'string') {
      return '';
    }

    return value.replace(/<color=([^>]+)>(.*?)<\/color>/gi, function (_, color, content) {
      const safeColor = String(color).replace(/['"]/g, '');
      return '<span style="color:' + safeColor + '">' + content + '</span>';
    });
  }

  function setFeatureTexts(features) {
    if (!Array.isArray(features)) {
      return;
    }

    const featureElements = document.querySelectorAll('[data-feature-key]');
    features.forEach(function (value, index) {
      if (typeof value === 'string' && featureElements[index]) {
        featureElements[index].textContent = value;
      }
    });
  }

  function applyTexts(texts) {
    if (!texts || typeof texts !== 'object') {
      return;
    }

    setText(selectors.subtitle, texts.subtitle);
    setText(selectors.trialHeadline, texts.trialHeadline ?? texts.trial?.headline);
    setHtml(
      selectors.trialDescription,
      convertUnityRichTextToHtml(texts.trialDescription ?? texts.trial?.description)
    );
    setText(selectors.subscribeButton, texts.subscribeButton);
    setText(selectors.restorePurchases, texts.restorePurchases ?? texts.footer?.restorePurchases);
    setText(selectors.termsOfUse, texts.termsOfUse ?? texts.footer?.termsOfUse);
    setText(selectors.privacyPolicy, texts.privacyPolicy ?? texts.footer?.privacyPolicy);
    setText(selectors.note, texts.note);

    setFeatureTexts(texts.features);
  }

  function normalizeTextsPayload(payload) {
    if (!payload) {
      return null;
    }

    if (typeof payload === 'object') {
      return payload;
    }

    if (typeof payload === 'string') {
      try {
        return JSON.parse(payload);
      } catch (error) {
        console.error('setOfferTexts: invalid JSON string', error);
        return null;
      }
    }

    return null;
  }

  function closePopup() {
    window.location.href = 'uniwebview://close';
  }

  function bindEvents() {
    const closeButton = document.querySelector('[data-action="close"]');
    if (closeButton) {
      closeButton.addEventListener('click', closePopup);
    }
  }

  window.setOfferTexts = function setOfferTexts(payload) {
    const texts = normalizeTextsPayload(payload);
    applyTexts(texts);
  };

  document.addEventListener('DOMContentLoaded', bindEvents);
})();

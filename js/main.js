/*
  MOBILE MENU TOGGLE

  Shows/hides the navigation links on small screens when the menu
  button is tapped. There is nothing here that needs to change when
  editing page content.
*/
document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
});

/*
  SCROLL-REVEAL ANIMATION

  The client's original Wix site fades each section's headline/text in
  (some with a slight blur-to-sharp effect) as the page loads or as you
  scroll to them. This recreates that same effect with plain CSS
  transitions - see the "SCROLL-REVEAL ANIMATION" block in
  css/styles.css for the actual transition/timing values.

  This is progressive enhancement: elements are only ever hidden by a
  class that THIS script adds, so if JavaScript doesn't run (or the
  visitor has "reduce motion" turned on), everything just displays
  normally with no animation - nothing depends on this to be visible.
*/
document.addEventListener("DOMContentLoaded", function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  // Each entry: which elements to animate, whether they get the blur
  // effect, whether multiple elements should cascade in with a delay
  // between each one, and whether they reveal immediately (for
  // above-the-fold hero content) instead of waiting to scroll into view.
  var groups = [
    { selector: ".hero-logo, .hero h1, .hero-lede, .hero-tagline", stagger: true, immediate: true },
    { selector: ".section-intro", blur: true },
    { selector: ".service-card", stagger: true },
    { selector: ".flyer-group", stagger: true },
    { selector: ".review-card", stagger: true },
    { selector: ".contact-layout > *", stagger: true },
    { selector: ".testimonial-original, .testimonial-layout", blur: true },
    { selector: ".reviews-image", blur: true },
    { selector: ".intro-graphic img, .about-graphic img", blur: true }
  ];

  var immediateEls = [];
  var observedEls = [];

  groups.forEach(function (group) {
    document.querySelectorAll(group.selector).forEach(function (el, i) {
      el.classList.add("reveal-init");
      if (group.blur) {
        el.classList.add("reveal-blur");
      }
      if (group.stagger) {
        el.classList.add("reveal-delay-" + ((i % 3) + 1));
      }
      (group.immediate ? immediateEls : observedEls).push(el);
    });
  });

  // Hero content reveals shortly after the page loads, cascading in.
  immediateEls.forEach(function (el, i) {
    window.setTimeout(function () {
      el.classList.add("reveal-visible");
    }, 50 + i * 90);
  });

  if (!("IntersectionObserver" in window)) {
    observedEls.forEach(function (el) {
      el.classList.add("reveal-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  observedEls.forEach(function (el) {
    observer.observe(el);
  });
});

/*
  CONTACT FORM SUBMISSION

  The form's action/method (see index.html) already work as a plain
  HTML POST to /api/submit-inquiry, so the form still works with
  JavaScript off. When JS is available, this intercepts the submit to
  send it via fetch instead, so visitors get an inline success/error
  message without leaving the page.

  It also handles the ?sent=1 / ?sent=0 redirect the API sends back
  for that plain-HTML fallback path, showing the same status message
  after the page reloads.
*/
document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector(".contact-form");
  if (!form) {
    return;
  }

  var status = form.querySelector(".form-status");
  var submitButton = form.querySelector("button[type='submit']");

  function showStatus(message, isError) {
    if (!status) {
      return;
    }
    status.textContent = message;
    status.classList.toggle("form-status-error", Boolean(isError));
    status.classList.toggle("form-status-success", !isError);
  }

  var params = new URLSearchParams(window.location.search);
  if (params.has("sent")) {
    showStatus(
      params.get("sent") === "1"
        ? "Thanks! Your message has been sent - we'll be in touch soon."
        : "Something went wrong sending your message. Please email or call/text us directly.",
      params.get("sent") !== "1"
    );
    params.delete("sent");
    var cleanQuery = params.toString();
    window.history.replaceState(
      {},
      "",
      window.location.pathname + (cleanQuery ? "?" + cleanQuery : "") + window.location.hash
    );
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var data = {
      firstName: form.elements["firstName"].value,
      lastName: form.elements["lastName"].value,
      email: form.elements["email"].value,
      phone: form.elements["phone"].value,
      message: form.elements["message"].value,
    };

    if (submitButton) {
      submitButton.disabled = true;
    }
    showStatus("Sending your message...", false);

    fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Request failed");
        }
        showStatus("Thanks! Your message has been sent - we'll be in touch soon.", false);
        form.reset();
      })
      .catch(function () {
        showStatus(
          "Something went wrong sending your message. Please email or call/text us directly.",
          true
        );
      })
      .finally(function () {
        if (submitButton) {
          submitButton.disabled = false;
        }
      });
  });
});

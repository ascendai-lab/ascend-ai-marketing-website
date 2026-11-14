/*
  Missed-call quiz, shared by the three homepage mockups.
  Each [data-quiz] element gets the same steps; each mockup styles them its own way.
  Mockup only: "Show my results" does not send anything yet. In the real build the
  form posts with fetch to /api/contact (see CLAUDE.md) before the results show.
*/
(function () {
  var QUESTIONS = [
    { q: 'In a busy week, how many calls come in?', a: ['Under 20', '20 to 50', '50 to 100', 'Over 100'] },
    { q: "When you can't pick up, what happens?", a: ['It goes to voicemail', 'Someone in the office answers', 'An answering service takes it', 'Not sure'] },
    { q: 'About how many calls do you miss?', a: ['Almost none', '1 in 10', '1 in 5', '1 in 3 or more'] },
    { q: "What's your average job worth?", a: ['Under $300', '$300 to $1,000', '$1,000 to $5,000', 'Over $5,000'] },
    { q: 'How fast do you call back a missed call or web lead?', a: ['Within 5 minutes', 'Within an hour', 'Same day', 'Next day or later'] }
  ];
  var CALLS = [12, 35, 75, 120];
  var LOST_SHARE = [0.8, 0.3, 0.45, 0.6];
  var LOST_POINTS = [3, 0, 1, 2];
  var MISS = [0.03, 0.1, 0.2, 0.33];
  var VALUE = [220, 600, 2200, 6500];
  var SPEED = [0.55, 0.8, 1, 1.15];
  var GRADES = [
    ['A', 'You catch almost every call. A few small fixes can still add jobs.'],
    ['B', 'You catch almost every call. A few small fixes can still add jobs.'],
    ['C', 'You catch most calls. The leak is in follow-up speed.'],
    ['D', 'Jobs are slipping through every week. A few changes can stop the leak.'],
    ['F', 'The phone is costing you real money. The good news: you can fix this.']
  ];
  var FIXES = [
    ['Text back every missed call in seconds.', 'A quick text keeps the homeowner talking to you, not the next shop.'],
    ['Call back web leads within 5 minutes.', 'A homeowner with no heat wants an answer now.'],
    ['Ask for a review after every job.', 'Reviews help homeowners pick you over the next shop.']
  ];
  var ARROW = '<svg class="i" aria-hidden="true"><use href="#i-arrow"/></svg>';

  function money(n) {
    var step = n < 1000 ? 50 : n < 10000 ? 100 : 500;
    return '$' + (Math.round(n / step) * step).toLocaleString('en-US');
  }

  function build(root) {
    var id = root.id;
    var html = '<div class="quiz-top"><p class="quiz-count" aria-live="polite"></p><ol class="quiz-bar" aria-hidden="true">';
    for (var s = 0; s < QUESTIONS.length; s++) html += '<li></li>';
    html += '</ol></div>';
    QUESTIONS.forEach(function (item, i) {
      html += '<fieldset class="quiz-step" data-step="' + i + '" hidden><legend class="quiz-q">' + item.q + '</legend><div class="quiz-options">';
      item.a.forEach(function (label, j) {
        html += '<button type="button" class="quiz-option" data-answer="' + j + '"><span class="quiz-key">' + String.fromCharCode(65 + j) + '</span><span>' + label + '</span></button>';
      });
      html += '</div></fieldset>';
    });
    html += '<form class="quiz-step quiz-form" data-step="5" hidden novalidate>' +
      '<p class="quiz-ready">Your results are ready.</p>' +
      '<p class="quiz-q">Where should we send your full report?</p>' +
      '<div class="quiz-fields">' +
      field(id, 'first', 'First name', 'text', 'given-name', true) +
      field(id, 'shop', 'Shop name', 'text', 'organization', true) +
      field(id, 'email', 'Email', 'email', 'email', true) +
      field(id, 'mobile', 'Mobile (optional)', 'tel', 'tel', false) +
      '</div><button type="submit" class="quiz-submit">Show my results ' + ARROW + '</button>' +
      '<p class="quiz-small">You\'ll get your report and a few short emails from our team.</p></form>';
    html += '<div class="quiz-step quiz-result" data-step="6" hidden tabindex="-1">' +
      '<p class="quiz-headline"></p>' +
      '<div class="quiz-score"><span class="quiz-grade"></span><span><strong>Your call handling score</strong><span class="quiz-grade-line"></span></span></div>' +
      '<p class="quiz-fix-title">Your 3 fixes</p><ol class="quiz-fixes">';
    FIXES.forEach(function (f) { html += '<li><strong>' + f[0] + '</strong> ' + f[1] + '</li>'; });
    html += '</ol><a class="quiz-submit" href="#book">Book a 15-minute call ' + ARROW + '</a></div>';
    html += '<button type="button" class="quiz-back" hidden>Back</button>';
    root.innerHTML = html;
    root.answers = [];
    show(root, 0);

    root.addEventListener('click', function (e) {
      var opt = e.target.closest('.quiz-option');
      if (opt) {
        var step = Number(opt.closest('.quiz-step').dataset.step);
        root.answers[step] = Number(opt.dataset.answer);
        opt.parentNode.querySelectorAll('.quiz-option').forEach(function (b) { b.setAttribute('aria-pressed', b === opt ? 'true' : 'false'); });
        show(root, step + 1);
      }
      if (e.target.closest('.quiz-back')) show(root, Math.max(0, root.current - 1));
    });
    root.querySelector('.quiz-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      this.querySelectorAll('input[required]').forEach(function (inp) {
        var bad = !inp.value.trim() || (inp.type === 'email' && !/^\S+@\S+\.\S+$/.test(inp.value));
        inp.setAttribute('aria-invalid', bad ? 'true' : 'false');
        if (bad && ok) { inp.focus(); ok = false; }
      });
      if (!ok) return;
      result(root, this.elements.first.value.trim(), this.elements.shop.value.trim());
      show(root, 6);
    });
  }

  function field(id, name, label, type, auto, req) {
    return '<label class="quiz-field"><span>' + label + '</span><input name="' + name + '" type="' + type + '" autocomplete="' + auto + '"' + (req ? ' required' : '') + ' id="' + id + '-' + name + '"></label>';
  }

  function result(root, first, shop) {
    var a = root.answers;
    var missed = CALLS[a[0]] * 4.33 * MISS[a[2]];
    var lost = missed * LOST_SHARE[a[1]] * SPEED[a[4]];
    var low = Math.max(150, lost * 0.3 * VALUE[a[3]]);
    var high = Math.max(400, lost * 0.55 * VALUE[a[3]]);
    var points = a[2] + LOST_POINTS[a[1]] + a[4];
    var g = GRADES[Math.min(4, Math.floor(points / 2))];
    root.querySelector('.quiz-headline').textContent = first + ', missed calls may be costing ' + shop + ' about ' + money(low) + ' to ' + money(high) + ' a month.';
    root.querySelector('.quiz-grade').textContent = g[0];
    root.querySelector('.quiz-grade-line').textContent = g[1];
  }

  function show(root, step) {
    root.current = step;
    root.querySelectorAll('.quiz-step').forEach(function (el) { el.hidden = Number(el.dataset.step) !== step; });
    root.querySelectorAll('.quiz-bar li').forEach(function (li, i) { li.className = i < step ? 'done' : i === step ? 'now' : ''; });
    root.querySelector('.quiz-count').textContent = step < 5 ? 'Question ' + (step + 1) + ' of 5' : step === 5 ? 'Last step' : 'Your results';
    root.querySelector('.quiz-back').hidden = step === 0 || step === 6;
    root.dataset.step = step;
  }

  document.querySelectorAll('[data-quiz]').forEach(build);

  /* A Q1 answer clicked outside the quiz (a hero card) starts the quiz with it. */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-quiz-start]');
    if (!b) return;
    var root = document.getElementById(b.dataset.quizStart);
    if (!root) return;
    e.preventDefault();
    root.answers[0] = Number(b.dataset.answer);
    show(root, 1);
    root.scrollIntoView({ block: 'center' });
    var first = root.querySelector('[data-step="1"] .quiz-option');
    if (first) first.focus({ preventScroll: true });
  });

  /* FAQ: one open at a time inside a group */
  document.querySelectorAll('[data-one-open]').forEach(function (group) {
    group.addEventListener('toggle', function (e) {
      if (!e.target.open) return;
      group.querySelectorAll('details[open]').forEach(function (d) { if (d !== e.target) d.open = false; });
    }, true);
  });
})();

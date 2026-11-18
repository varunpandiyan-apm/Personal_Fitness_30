/* ==========================================================================
   Ember — 30-Day Fitness Challenge
   Single-page dashboard. Vanilla JS, no build step, localStorage persistence.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------- content ------------------------------- */
  const STAGES = [
    { name: 'The Beginner',  at: 0,  blurb: 'Every legend starts with one shaky rep.' },
    { name: 'The Starter',   at: 5,  blurb: 'The habit is starting to take hold.' },
    { name: 'The Builder',   at: 10, blurb: 'Momentum looks good on you.' },
    { name: 'The Grinder',   at: 15, blurb: 'You do the work even when it is boring.' },
    { name: 'The Strong One', at: 20, blurb: 'Strength is quietly becoming your default.' },
    { name: 'The Champion',  at: 25, blurb: 'You have earned every line.' },
    { name: 'Legend Mode',   at: 30, blurb: 'Thirty honest workouts. Legend status.' }
  ];

  const REWARDS = [
    {
      at: 5,
      title: 'Progressive Overload, Explained',
      category: 'Training principle',
      minutes: 3,
      lede: 'Your body only changes when the demand changes. Progressive overload is the name for that demand.',
      sections: [
        { h: 'The idea in one line', p: ['You adapt to what you repeatedly ask of your body. Do the exact same workout forever and your body has no reason to build anything new.'] },
        { h: 'Four dials you can turn', list: [
          '<strong>Reps</strong> — add one or two clean reps at the same weight.',
          '<strong>Load</strong> — add 2.5 kg (or one plate step) once you reach the top of your rep range.',
          '<strong>Sets</strong> — add a set before adding weight, if the last set still felt strong.',
          '<strong>Tempo</strong> — slow the lowering phase to three seconds to make the same rep harder.'
        ] },
        { h: 'The 2-for-2 rule', p: ['Beat your rep target two workouts in a row? Add a little weight. Fall short two sessions in a row? Back off about 10% and rebuild. Simple, honest, repeatable.'] }
      ],
      takeaway: 'Write down sets, reps and load every session. You cannot progress what you do not measure.'
    },
    {
      at: 10,
      title: 'Form Cues That Actually Work',
      category: 'Technique',
      minutes: 4,
      lede: 'Good form is not about looking perfect. It is about putting the load where you want it and keeping your joints happy.',
      sections: [
        { h: 'Squat', list: [
          'Brace your trunk like you are about to be poked in the stomach.',
          'Push the floor away and keep your knees tracking over your toes.',
          'Keep pressure through the middle of the foot — not the toes, not the heels.'
        ] },
        { h: 'Hinge and deadlift', list: [
          'Hips back, chest proud, weight close to the legs.',
          'Keep a neutral spine — no craning the neck up to find the mirror.',
          'Think “push the floor away” rather than “pull with the back”.'
        ] },
        { h: 'Pushing and pulling', p: ['Set the shoulder blades down and back before a press or a row. A stable shoulder produces force more safely than a loose one.'] },
        { h: 'The rule above all cues', p: ['Sharp joint pain means stop and adjust. Muscle burn is normal; joint pain is information.'] }
      ],
      takeaway: 'Film one working set from the side each week. Your phone is a better coach than your memory.'
    },
    {
      at: 15,
      title: 'Recovery Is Training',
      category: 'Recovery',
      minutes: 3,
      lede: 'You do not grow during the workout. You grow in the hours after it — if you let yourself.',
      sections: [
        { h: 'Why recovery counts', p: ['Training creates the stimulus; recovery creates the adaptation. Skip recovery and you accumulate fatigue instead of strength.'] },
        { h: 'The big three', list: [
          '<strong>Sleep</strong> — 7 to 9 hours. The biggest recovery lever most people ignore.',
          '<strong>Protein</strong> — roughly 1.6–2.2 g per kg of bodyweight per day, spread across meals.',
          '<strong>Easy movement</strong> — a 10–20 minute walk on rest days improves blood flow and reduces stiffness.'
        ] },
        { h: 'Soreness is not damage', p: ['Delayed onset muscle soreness peaks 24–48 hours after new or hard work, and fades as the body adapts. Sharp, localised or joint pain that gets worse is different — rest it and get it looked at.'] }
      ],
      takeaway: 'Plan rest days as deliberately as training days. They are part of the program, not a break from it.'
    },
    {
      at: 20,
      title: 'Fuel the Work',
      category: 'Nutrition basics',
      minutes: 4,
      lede: 'You do not need a perfect diet. You need enough fuel to train well and enough protein to rebuild.',
      sections: [
        { h: 'The plate, simplified', p: ['At most meals: a palm of protein, a fist of vegetables, a cupped handful of carbohydrates, a thumb of fats. Adjust the portions to your goal, not your mood.'] },
        { h: 'Around training', list: [
          '<strong>Before</strong> a hard session — a banana, oats, rice or toast gives you something to burn.',
          '<strong>After</strong> — a real meal within a couple of hours is plenty. The “anabolic window” is wider than supplement ads suggest.',
          '<strong>Hydration</strong> — pale straw urine is a decent daily gauge. Add electrolytes for long or hot sessions.'
        ] },
        { h: 'What actually moves the needle', p: ['Total calories and total protein, consistently, over weeks. Supplements are a rounding error next to those two.'] }
      ],
      takeaway: 'Get one solid protein source into every meal before you optimise anything else.'
    },
    {
      at: 25,
      title: 'Consistency Beats Intensity',
      category: 'Habits & mindset',
      minutes: 4,
      lede: 'The people who get results are not the ones who never miss. They are the ones who never miss twice.',
      sections: [
        { h: 'The minimum viable session', p: ['On a terrible day, do ten minutes. One set of something. The goal is not the stimulus — it is protecting the identity of a person who trains.'] },
        { h: 'Never miss twice', p: ['One missed day is an accident. Two is the beginning of a new pattern. The day after a miss matters more than the miss itself.'] },
        { h: 'Make it easy to start', list: [
          'Lay your kit out the night before.',
          'Decide the time, not just the intention.',
          'Shrink the first step — shoes on, then decide the rest.'
        ] },
        { h: 'Track honestly', p: ['A Cross on the record is not failure — it is data. The streak counter exists to show you the pattern, not to shame you.'] }
      ],
      takeaway: 'Aim for “boringly repeatable” rather than “brutally hard”. Intensity is a tool; consistency is the engine.'
    },
    {
      at: 30,
      title: 'What Comes After Day 30',
      category: 'Programming',
      minutes: 4,
      lede: 'Thirty workouts is a foundation, not a finish line. Here is how to build on it without losing the habit.',
      sections: [
        { h: 'Pick one goal', p: ['Strength, muscle, endurance — or simply “keep showing up”. Pick one for the next block. A single clear goal makes every other decision easier.'] },
        { h: 'A simple next block', list: [
          '3–4 sessions a week, full body or an upper/lower split.',
          '2–4 sets of 5–12 reps for the main lifts, leaving 1–2 reps in reserve.',
          'Add a little weight or a rep when you hit the top of the range.',
          'Deload (roughly halve the volume) every 6–8 weeks, or when motivation and performance dip together.'
        ] },
        { h: 'Keep the ritual', p: ['The dashboard habit is the real prize: show up, log honestly, review weekly. Keep a simple record of what you did — future you will thank present you.'] }
      ],
      takeaway: 'Retest something you struggled with on Day 1 — then write down the next 30 days before the motivation fades.'
    }
  ];

  const QUOTES = [
    'Small sessions, repeated, beat perfect sessions, abandoned.',
    'You do not need motivation. You need a start time.',
    'The workout you did is worth more than the one you planned.',
    'Consistency is a skill. Today is practice.',
    'Show up tired. Leave proud.',
    'Discipline is choosing what you want most over what you want right now.',
    'Your only real competition is yesterday.',
    'Ten honest minutes beat a perfect plan you skip.',
    'Strength is built in the boring middle.',
    'Rest is part of the program, not a break from it.',
    'Motivation starts the habit. The habit carries you.',
    'Progress hides in the days you almost skipped.',
    'You will never regret the session you finished.',
    'One more rep is a decision, not a feeling.',
    'The plan does not have to be impressive. It has to be repeatable.',
    'Keep the promise you made to yourself.'
  ];

  /* -------------------------------- icons -------------------------------- */
  const ICON = {
    check: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 12.5 9.5 17.5 19.5 6.5"/></svg>',
    cross: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    lock: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>',
    back: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>',
    info: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><circle cx="12" cy="7.8" r="0.6" fill="currentColor" stroke="none"/></svg>',
    book: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v16H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H19"/></svg>',
    flame: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 5H5.5a2.5 2.5 0 0 0 0 5H8M16 5h2.5a2.5 2.5 0 0 1 0 5H16"/><path d="M12 13v4M9 21h6"/></svg>'
  };

  /* -------------------------------- state -------------------------------- */
  const STORAGE_KEY = 'ember30.challenge.v1';
  const MAX_DAY = 30;

  let state = loadState();
  let derived = derive(state.events);
  let memoryFallback = false;
  let activeReward = 0;
  let lastFocus = null;
  let modalOpen = false;

  function blankState() {
    return { v: 1, startedAt: null, events: [] };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return blankState();
      const parsed = JSON.parse(raw);
      return sanitize(parsed);
    } catch (err) {
      memoryFallback = true;
      return blankState();
    }
  }

  function sanitize(raw) {
    const s = blankState();
    if (!raw || typeof raw !== 'object' || !Array.isArray(raw.events)) return s;
    s.startedAt = typeof raw.startedAt === 'string' ? raw.startedAt : null;
    let completed = 0;
    for (const ev of raw.events) {
      if (!ev || (ev.r !== 'tick' && ev.r !== 'cross')) continue;
      if (typeof ev.d !== 'number' || ev.d < 1 || ev.d > MAX_DAY) continue;
      if (completed >= MAX_DAY) break;
      const okDay = ev.r === 'tick' ? completed + 1 : completed + 1;
      if (ev.d !== okDay) continue;
      s.events.push({ d: ev.d, r: ev.r, t: typeof ev.t === 'string' ? ev.t : new Date().toISOString() });
      if (ev.r === 'tick') completed += 1;
    }
    return s;
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      if (!memoryFallback) {
        memoryFallback = true;
        toast('This browser is blocking storage — progress will last only for this tab.', 'warn');
      }
    }
  }

  function derive(events) {
    const out = {
      completed: 0,
      streak: 0,
      best: 0,
      misses: 0,
      dayMisses: {},
      milestones: {},
      dayDoneAt: {}
    };
    for (const ev of events) {
      if (ev.r === 'tick') {
        out.completed += 1;
        out.streak += 1;
        if (out.streak > out.best) out.best = out.streak;
        if (out.completed % 5 === 0) out.milestones[out.completed] = ev.t;
        out.dayDoneAt[out.completed] = ev.t;
      } else {
        out.misses += 1;
        const day = out.completed + 1;
        out.dayMisses[day] = (out.dayMisses[day] || 0) + 1;
        out.streak = 0;
      }
    }
    out.day = Math.min(MAX_DAY, out.completed + 1);
    out.done = out.completed >= MAX_DAY;
    out.stage = Math.min(6, Math.floor(out.completed / 5));
    out.stageProgress = out.done ? 1 : (out.completed % 5) / 5;
    out.nextMilestone = out.done ? null : Math.min(MAX_DAY, (Math.floor(out.completed / 5) + 1) * 5);
    return out;
  }

  /* -------------------------------- utils -------------------------------- */
  const $ = (sel) => document.querySelector(sel);
  const pad = (n) => String(n).padStart(2, '0');

  function esc(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  const shortDate = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' });
  const longDate = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'long', year: 'numeric' });

  function fmtShort(iso) {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? '' : shortDate.format(d);
  }

  function stageOf(index) { return STAGES[Math.max(0, Math.min(6, index))]; }
  function rewardOf(milestone) { return REWARDS.find((r) => r.at === milestone) || null; }
  function isRewardUnlocked(milestone) { return derived.completed >= milestone; }

  /* ------------------------------- render -------------------------------- */
  function render() {
    derived = derive(state.events);
    renderHeader();
    renderHero();
    renderDetails();
    renderProgress();
    renderGrid();
    renderRewards();
    renderMotivation();
    renderFooter();
  }

  function renderHeader() {
    $('#headerDayValue').textContent = derived.done ? '30' : derived.day;
    $('#headerStreakValue').textContent = derived.streak;

    const streakPill = $('#headerStreak');
    streakPill.title = derived.streak > 0
      ? `Current streak: ${derived.streak} ${derived.streak === 1 ? 'day' : 'days'}`
      : 'No active streak — log a workout to start one';

    const dayPill = $('#headerDay');
    dayPill.title = derived.done ? 'Challenge complete' : `Day ${derived.day} of 30`;
  }

  function renderHero() {
    const stage = stageOf(derived.stage);
    const hero = $('#hero');
    hero.classList.toggle('legend', derived.done);

    $('#stageTag').textContent = `Stage ${derived.stage + 1} of 7`;
    $('#levelChip').textContent = `${derived.completed} / 30`;
    $('#stageName').textContent = stage.name;
    $('#stageBlurb').textContent = stage.blurb;

    // progress within the current five-workout block
    const into = derived.done ? 5 : derived.completed % 5;
    const dots = document.querySelectorAll('#stageMeter .meter-dots i');
    dots.forEach((d, i) => d.classList.toggle('on', i < into));
    const meter = $('#stageMeter');
    if (derived.done) {
      $('#meterLabel').textContent = 'Every stage unlocked';
      meter.classList.add('complete');
    } else {
      const toGo = 5 - into;
      $('#meterLabel').textContent = `${toGo} more workout${toGo === 1 ? '' : 's'} to ${stageOf(derived.stage + 1).name}`;
      meter.classList.remove('complete');
    }

    let kicker;
    if (derived.done) kicker = 'Day 30 · Challenge complete';
    else if (derived.completed === 0) kicker = 'Day 0 · Where it begins';
    else kicker = `Unlocked at ${stage.at} workout${stage.at === 1 ? '' : 's'}`;
    $('#stageKicker').textContent = kicker;

    const img = $('#heroImg');
    if (img.dataset.stage !== String(derived.stage)) {
      img.dataset.stage = String(derived.stage);
      img.src = `assets/characters/stage-${derived.stage}.png`;
      img.alt = `${stage.name} — current character stage`;
      img.style.animation = 'none';
      void img.offsetWidth;
      img.style.animation = '';
    }

    const btn = $('#logBtn');
    const label = $('#logBtnLabel');
    if (derived.done) {
      btn.disabled = true;
      label.textContent = 'Challenge complete';
      btn.setAttribute('aria-label', 'Challenge complete — all 30 days logged');
    } else {
      btn.disabled = false;
      label.textContent = `Log Day ${derived.day}`;
      btn.removeAttribute('aria-label');
    }
  }

  function renderDetails() {
    $('#statDay').textContent = derived.done ? '30' : derived.day;
    $('#statDaySub').textContent = derived.done ? 'all done' : 'of 30';
    $('#statStreak').textContent = derived.streak;
    $('#statStreakSub').textContent = derived.streak === 1 ? 'day in a row' : 'days in a row';
    $('#statBest').textContent = derived.best;
    $('#statBestSub').textContent = derived.best === 1 ? 'personal best' : 'personal best';

    let foot;
    if (derived.done) {
      foot = 'Thirty workouts finished. Every stage unlocked, every reward earned.';
    } else if (derived.dayMisses[derived.day]) {
      const n = derived.dayMisses[derived.day];
      foot = `Day ${derived.day} stays open after ${n === 1 ? 'a missed attempt' : `${n} missed attempts`}. Log it whenever you are ready.`;
    } else if (derived.completed === 0) {
      foot = 'No workouts logged yet. Day 1 is yours to take.';
    } else if (derived.streak >= 2) {
      foot = `${derived.streak} in a row. Do not break the chain.`;
    } else {
      foot = `${MAX_DAY - derived.completed} workout${MAX_DAY - derived.completed === 1 ? '' : 's'} between you and Legend Mode.`;
    }
    $('#detailsFoot').textContent = foot;
  }

  function renderProgress() {
    const pct = Math.round((derived.completed / MAX_DAY) * 100);
    $('#progressDone').textContent = derived.completed;
    $('#progressPct').textContent = `${pct}%`;

    const segs = [];
    for (let i = 1; i <= MAX_DAY; i++) {
      const cls = ['seg'];
      if (i <= derived.completed) cls.push('filled');
      if (i % 5 === 0) cls.push('milestone');
      segs.push(`<span class="${cls.join(' ')}"></span>`);
    }
    const el = $('#progressSegments');
    el.innerHTML = segs.join('');
    el.setAttribute('aria-label', `${derived.completed} of ${MAX_DAY} workouts completed`);

    if (derived.done) {
      $('#progressLeft').textContent = 'All 30 workouts complete';
      $('#progressHint').textContent = 'Legend Mode';
    } else {
      const left = MAX_DAY - derived.completed;
      $('#progressLeft').textContent = `${left} workout${left === 1 ? '' : 's'} to go`;
      $('#progressHint').textContent = `Next reward at ${derived.nextMilestone}`;
    }
  }

  function dayStatus(day) {
    if (day <= derived.completed) return 'done';
    if (derived.done) return 'upcoming';
    if (day === derived.day) return derived.dayMisses[day] ? 'missed' : 'current';
    return 'upcoming';
  }

  function renderGrid() {
    const cells = [];
    for (let i = 1; i <= MAX_DAY; i++) {
      const status = dayStatus(i);
      const cls = ['day', status];
      if (i % 5 === 0) cls.push('milestone');
      if (status === 'done' && derived.dayMisses[i]) cls.push('had-miss');

      let aria;
      if (status === 'done') aria = `Day ${i}, completed${derived.dayDoneAt[i] ? ' on ' + fmtShort(derived.dayDoneAt[i]) : ''}`;
      else if (status === 'current') aria = `Day ${i}, today, tap to log`;
      else if (status === 'missed') aria = `Day ${i}, logged as missed, tap to try again`;
      else aria = `Day ${i}, upcoming, locked`;

      let inner = `<span class="day-num">${i}</span>`;
      if (status === 'done') inner += `<span class="day-ico">${ICON.check}</span>`;
      else if (status === 'missed') inner += `<span class="day-ico">${ICON.cross}</span>`;

      const misses = derived.dayMisses[i];
      if (misses > 1) inner += `<span class="miss-count" title="${misses} missed attempts">${misses}</span>`;

      cells.push(`<button type="button" class="${cls.join(' ')}" data-day="${i}" aria-label="${aria}">${inner}</button>`);
    }
    $('#dayGrid').innerHTML = cells.join('');

    let foot;
    if (derived.done) foot = 'All 30 days complete. The challenge is finished — enjoy the view.';
    else if (derived.dayMisses[derived.day]) foot = `Day ${derived.day} is still open after a miss. Tap it to log your next attempt.`;
    else foot = `Tap Day ${derived.day} to log your workout. Days unlock in order.`;
    $('#challengeFoot').innerHTML = `${ICON.flame}<span>${esc(foot)}</span>`;
  }

  function renderRewards() {
    const strip = REWARDS.map((r, i) => {
      const unlocked = isRewardUnlocked(r.at);
      const fresh = unlocked && derived.milestones[r.at] &&
        Date.now() - new Date(derived.milestones[r.at]).getTime() < 1000 * 60 * 60 * 24 * 2;
      const cls = ['reward-chip'];
      if (unlocked) cls.push('unlocked');
      if (fresh) cls.push('fresh');
      const inner = unlocked
        ? `<span class="rc-badge" aria-hidden="true">${r.at}</span><span class="rc-title">${esc(r.title)}</span>`
        : `<span class="rc-badge" aria-hidden="true">${ICON.lock}</span><span class="rc-title">${esc(r.title)}</span><span class="rc-lock"><span class="sr-only">Locked — </span>${r.at} workouts</span>`;
      return `<button type="button" class="${cls.join(' ')}" data-reward="${i}" ${unlocked ? '' : 'aria-disabled="true"'}>${inner}</button>`;
    });
    $('#rewardStrip').innerHTML = strip.join('');

    const locked = REWARDS.filter((r) => !isRewardUnlocked(r.at));
    const unlockedCount = REWARDS.length - locked.length;
    const next = locked[0];
    const nextEl = $('#rewardNext');
    if (next) {
      nextEl.hidden = false;
      $('#rnName').textContent = next.title;
      const from = next.at - 5;
      const into = Math.max(0, Math.min(5, derived.completed - from));
      $('#rnBar').style.width = `${(into / 5) * 100}%`;
      $('#rnCount').textContent = `${into} / 5`;
    } else {
      nextEl.hidden = true;
    }

    if (derived.done) {
      $('#rewardsFoot').textContent = 'All six lessons unlocked. Revisit any of them any time.';
    } else {
      $('#rewardsFoot').textContent = `${unlockedCount} of ${REWARDS.length} lessons unlocked.`;
    }
  }

  function renderMotivation() {
    const dayIndex = Math.floor(Date.now() / 86400000);
    const q = QUOTES[dayIndex % QUOTES.length];
    $('#quoteText').textContent = q;
    $('#quoteBy').textContent = derived.done ? 'Challenge complete' : `Day ${derived.day} of 30`;
  }

  function renderFooter() {
    const note = document.querySelector('.save-note');
    if (!note) return;
    note.lastChild.textContent = memoryFallback
      ? ' Storage is blocked — this tab will not remember progress.'
      : ' Progress saves automatically in this browser';
  }

  /* -------------------------------- toasts ------------------------------- */
  function toast(message, kind) {
    const root = $('#toastRoot');
    const el = document.createElement('div');
    el.className = `toast ${kind === 'warn' ? 'warn' : 'ok'}`;
    el.innerHTML = `${kind === 'warn' ? ICON.info : ICON.check}<span>${esc(message)}</span>`;
    root.appendChild(el);
    while (root.children.length > 3) root.removeChild(root.firstChild);
    setTimeout(() => {
      el.classList.add('out');
      setTimeout(() => el.remove(), 260);
    }, 3200);
  }

  /* -------------------------------- modal -------------------------------- */
  const modalRoot = $('#modalRoot');
  const modalEl = $('#modal');
  const modalBody = $('#modalBody');

  function openModal(html, opts) {
    const options = opts || {};
    modalBody.innerHTML = html;
    modalEl.classList.toggle('wide', !!options.wide);
    modalRoot.hidden = false;
    modalEl.scrollTop = 0;
    document.body.style.overflow = 'hidden';

    if (!modalOpen) {
      lastFocus = document.activeElement;
      modalOpen = true;
    }

    // Move focus into the dialog without stealing the first action.
    const focusTarget = modalBody.querySelector('[autofocus]') || modalEl;
    focusTarget.focus({ preventScroll: true });

    const title = modalBody.querySelector('.m-title, .rd-title');
    if (title && !title.id) title.id = 'modalTitle';
  }

  function closeModal() {
    if (!modalOpen) return;
    modalOpen = false;
    modalRoot.hidden = true;
    document.body.style.overflow = '';
    modalBody.innerHTML = '';
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus({ preventScroll: true });
    lastFocus = null;
  }

  function logModal() {
    const day = derived.day;
    const stage = stageOf(derived.stage);
    const missNote = derived.dayMisses[day]
      ? `You have logged ${derived.dayMisses[day] === 1 ? 'a missed attempt' : derived.dayMisses[day] + ' missed attempts'} on this day already. A Tick still completes it.`
      : 'Missing a day never moves you backwards. The same day stays open until you complete it.';

    openModal(`
      <p class="m-eyebrow">Day ${day} · ${esc(stage.name)}</p>
      <h2 class="m-title" id="modalTitle">Did you show up?</h2>
      <p class="m-sub">One honest tap. No one is checking but you.</p>
      <div class="choice-grid">
        <button type="button" class="choice choice-tick" data-action="tick">
          <span class="cir">${ICON.check}</span>
          <span class="choice-label">Yes, I trained</span>
          <span class="choice-sub">Marks Day ${day} complete and opens Day ${Math.min(MAX_DAY, day + 1)}</span>
        </button>
        <button type="button" class="choice choice-cross" data-action="cross">
          <span class="cir">${ICON.cross}</span>
          <span class="choice-label">Not today</span>
          <span class="choice-sub">Keeps Day ${day} open and resets your streak</span>
        </button>
      </div>
      <div class="log-note">${ICON.info}<span>${esc(missNote)}</span></div>
    `);
  }

  function crossConfirmModal() {
    const day = derived.day;
    const streakLine = derived.streak > 0
      ? `Your current streak of ${derived.streak} ${derived.streak === 1 ? 'day' : 'days'} will reset to zero.`
      : 'Your streak is already at zero.';
    openModal(`
      <p class="m-eyebrow">Day ${day} · Missed attempt</p>
      <h2 class="m-title" id="modalTitle">Log this as a miss?</h2>
      <p class="m-sub">${esc(streakLine)} Day ${day} will stay open for another attempt.</p>
      <div class="confirm-card">
        <p class="confirm-title">This is not a step backwards</p>
        <p class="confirm-body">The challenge does not skip forward and nothing you have already completed is erased. Log Day ${day} again as soon as you are ready.</p>
      </div>
      <div class="modal-actions">
        <button type="button" class="btn btn-soft" data-action="back">Go back</button>
        <button type="button" class="btn btn-clay" data-action="confirmCross">Log the miss</button>
      </div>
    `);
  }

  function successModal(before, after) {
    const newStage = after.stage > before.stage;
    const newMilestone = Math.floor(after.completed / 5) * 5;
    const earnedReward = before.completed < newMilestone && after.completed >= newMilestone && newMilestone > 0;
    const reward = earnedReward ? rewardOf(newMilestone) : null;
    const stage = stageOf(after.stage);

    let title, sub;
    if (after.done) {
      title = 'Challenge complete.';
      sub = 'Thirty honest workouts. You built something that was not there thirty sessions ago.';
    } else {
      title = 'Day ' + after.completed + ' is in the books.';
      sub = after.streak > 1
        ? `${after.streak} in a row. Day ${after.day} is waiting whenever you are ready.`
        : `Streak at ${after.streak}. Day ${after.day} is waiting whenever you are ready.`;
    }

    const unlockStage = newStage ? `
      <div class="unlock">
        <img src="assets/characters/stage-${after.stage}.png" class="chr" alt="${esc(stage.name)}">
        <div class="u-text">
          <span class="u-tag">${ICON.trophy} New stage unlocked</span>
          <p class="u-title">${esc(stage.name)}</p>
          <p class="u-sub">Stage ${after.stage + 1} of 7 · ${after.completed} workouts complete</p>
        </div>
      </div>` : '';

    const unlockReward = reward ? `
      <div class="unlock reward-unlock">
        <div class="u-text">
          <span class="u-tag">${ICON.book} Reward unlocked</span>
          <p class="u-title">${esc(reward.title)}</p>
          <p class="u-sub">${esc(reward.category)} · ${reward.minutes} min read</p>
        </div>
        <button type="button" class="u-btn" data-action="openReward" data-index="${REWARDS.indexOf(reward)}">Read it</button>
      </div>` : '';

    openModal(`
      <div class="m-success">
        <div class="success-ring">${ICON.check}</div>
        <p class="m-eyebrow">Day ${after.completed} logged</p>
        <h2 class="m-title" id="modalTitle">${esc(title)}</h2>
        <p class="m-sub">${esc(sub)}</p>
        <div class="s-stats">
          <div class="s-stat"><span>Streak</span><strong>${after.streak}</strong></div>
          <div class="s-stat"><span>Workouts</span><strong>${after.completed}</strong></div>
          <div class="s-stat">${after.done
            ? '<span>Stage</span><strong>7 / 7</strong>'
            : `<span>To Legend</span><strong>${MAX_DAY - after.completed}</strong>`}</div>
        </div>
        ${unlockStage}
        ${unlockReward}
        <div class="modal-actions">
          <button type="button" class="btn btn-primary" data-action="close">${after.done ? 'Close' : 'Back to the dashboard'}</button>
        </div>
      </div>
    `);

    burstSparks();
  }

  function rewardsModal() {
    const rows = REWARDS.map((r, i) => {
      const unlocked = isRewardUnlocked(r.at);
      if (!unlocked) {
        return `
          <div class="reward-row locked">
            <span class="rr-badge">${ICON.lock}</span>
            <span class="rr-main">
              <span class="rr-title">${esc(r.title)}</span>
              <span class="rr-meta">${esc(r.category)} · unlocks at ${r.at} workouts</span>
            </span>
            <span class="rr-cta">${ICON.lock}</span>
          </div>`;
      }
      return `
        <button type="button" class="reward-row unlocked" data-action="reward" data-index="${i}">
          <span class="rr-badge">${r.at}</span>
          <span class="rr-main">
            <span class="rr-title">${esc(r.title)}</span>
            <span class="rr-meta">${esc(r.category)} · ${r.minutes} min read</span>
          </span>
          <span class="rr-cta">${ICON.chevron}</span>
        </button>`;
    }).join('');

    const unlockedCount = REWARDS.filter((r) => isRewardUnlocked(r.at)).length;

    openModal(`
      <p class="m-eyebrow">Reward shelf · ${unlockedCount} of 6 unlocked</p>
      <h2 class="m-title" id="modalTitle">Six lessons worth earning.</h2>
      <p class="m-sub">One real piece of training knowledge every five workouts — no filler badges.</p>
      <div class="reward-list">${rows}</div>
    `, { wide: true });
  }

  function rewardDetailModal(index) {
    const r = REWARDS[index];
    if (!r) return;
    activeReward = index;

    const body = r.sections.map((s) => {
      let html = `<h3>${esc(s.h)}</h3>`;
      if (s.p) html += s.p.map((p) => `<p>${esc(p)}</p>`).join('');
      if (s.list) html += `<ul>${s.list.map((li) => `<li>${li}</li>`).join('')}</ul>`;
      return html;
    }).join('');

    const prev = index > 0 && isRewardUnlocked(REWARDS[index - 1].at);
    const next = index < REWARDS.length - 1 && isRewardUnlocked(REWARDS[index + 1].at);

    openModal(`
      <div class="reward-detail">
        <div class="rd-top">
          <button type="button" class="back-btn" data-action="rewards">${ICON.back} All rewards</button>
        </div>
        <div class="rd-band">
          <span class="rd-cat">${esc(r.category)}</span>
          <h2 class="rd-title" id="modalTitle">${esc(r.title)}</h2>
          <p class="rd-meta">
            <span>Day ${r.at} milestone</span>
            <span>${r.minutes} min read</span>
          </p>
        </div>
        <p class="rd-lede">${esc(r.lede)}</p>
        <div class="rd-body">${body}</div>
        <div class="takeaway">
          <p class="t-label">Takeaway</p>
          <p>${esc(r.takeaway)}</p>
        </div>
        <div class="rd-foot">
          <button type="button" class="back-btn" data-action="prevReward" data-index="${index}" ${prev ? '' : 'disabled style="opacity:.4"'}>${ICON.back} Previous</button>
          <button type="button" class="back-btn" data-action="nextReward" data-index="${index}" ${next ? '' : 'disabled style="opacity:.4"'}>Next lesson ${ICON.chevron}</button>
        </div>
      </div>
    `, { wide: true });
  }

  function journeyModal() {
    const items = STAGES.map((s, i) => {
      const state = i < derived.stage ? 'unlocked' : i === derived.stage ? 'current' : 'locked';
      const label = state === 'current' ? 'You are here' : state === 'unlocked' ? 'Unlocked' : 'Locked';
      const stateCls = state === 'current' ? 'now' : state === 'unlocked' ? 'on' : '';
      return `
        <div class="j-item ${state === 'locked' ? 'locked' : ''} ${state === 'current' ? 'current' : ''}">
          <div class="j-art"><img src="assets/characters/stage-${i}.png" class="chr" alt="${esc(s.name)}"></div>
          <div>
            <p class="j-name">${esc(s.name)}</p>
            <p class="j-meta">${s.at === 0 ? 'Starting state' : `${s.at} workouts`}</p>
            <p class="j-blurb">${esc(s.blurb)}</p>
          </div>
          <span class="j-state ${stateCls}">${label}</span>
        </div>`;
    }).join('');

    openModal(`
      <p class="m-eyebrow">Character journey</p>
      <h2 class="m-title" id="modalTitle">Seven versions of you.</h2>
      <p class="m-sub">A new character unlocks every five completed workouts — based on total workouts done, not calendar days or streaks.</p>
      <div class="journey">${items}</div>
    `, { wide: true });
  }

  function settingsModal() {
    const canUndo = state.events.length > 0;
    const started = state.startedAt ? `Started ${esc(longDate.format(new Date(state.startedAt)))}` : 'Not started yet';
    const entries = `${state.events.length} recorded ${state.events.length === 1 ? 'entry' : 'entries'}`;
    openModal(`
      <p class="m-eyebrow">Settings</p>
      <h2 class="m-title" id="modalTitle">Your challenge, your data.</h2>
      <p class="m-sub">${started} · ${entries}.</p>

      <div class="set-block">
        <p class="set-title">Data</p>
        <div class="set-row">
          <div>
            <p class="set-name">Stored in this browser</p>
            <p class="set-sub">Progress lives in localStorage on this device. Clearing browser data will erase it, so keep a backup.</p>
          </div>
          <button type="button" class="btn btn-soft" data-action="export" style="height:38px;font-size:12px">Export</button>
        </div>
        <div class="set-row">
          <div>
            <p class="set-name">Undo last entry</p>
            <p class="set-sub">Removes the most recent Tick or Cross and recalculates streaks, days and rewards.</p>
          </div>
          <button type="button" class="btn-danger" data-action="undo" ${canUndo ? '' : 'disabled style="opacity:.45;cursor:default"'}>Undo</button>
        </div>
        <div class="set-row">
          <div>
            <p class="set-name">Reset the challenge</p>
            <p class="set-sub">Erases all 30 days, streaks, character unlocks and rewards.</p>
          </div>
          <button type="button" class="btn-danger" data-action="resetAsk">Reset</button>
        </div>
      </div>

      <div class="set-block">
        <p class="set-title">Shortcuts</p>
        <div class="set-row" style="gap:12px;flex-wrap:wrap;justify-content:flex-start">
          <span class="kbd-row"><kbd>L</kbd> log workout</span>
          <span class="kbd-row"><kbd>R</kbd> rewards</span>
          <span class="kbd-row"><kbd>J</kbd> journey</span>
          <span class="kbd-row"><kbd>Esc</kbd> close</span>
        </div>
      </div>

      <div class="set-block">
        <p class="set-title">About</p>
        <p class="about-note">Ember is a personal 30-day fitness challenge built around 30 sequential workouts, not calendar days. Each day unlocks only when the previous one is completed — a missed attempt keeps the same day open and resets the streak, but never erases progress. Every five workouts unlocks a new character stage and a genuinely useful training lesson.</p>
      </div>
    `);
  }

  function resetConfirmModal() {
    openModal(`
      <p class="m-eyebrow">Reset challenge</p>
      <h2 class="m-title" id="modalTitle">Start over from Day 1?</h2>
      <p class="m-sub">This erases every logged day, your ${derived.completed === 1 ? '1 completed workout' : derived.completed + ' completed workouts'}, streaks and all unlocked rewards. It cannot be undone.</p>
      <div class="confirm-card">
        <p class="confirm-title">Export first if you want a record</p>
        <p class="confirm-body">Close this dialog and use Export in settings to save a JSON backup of your log.</p>
      </div>
      <div class="modal-actions">
        <button type="button" class="btn btn-soft" data-action="settings">Keep my progress</button>
        <button type="button" class="btn btn-danger solid" data-action="resetConfirm">Reset everything</button>
      </div>
    `);
  }

  /* ------------------------------- actions ------------------------------- */
  function logTick() {
    const before = derived;
    if (before.done) return;
    state.events.push({ d: before.day, r: 'tick', t: new Date().toISOString() });
    if (!state.startedAt) state.startedAt = new Date().toISOString();
    saveState();
    render();
    successModal(before, derived);
  }

  function logCross() {
    if (derived.done) return;
    state.events.push({ d: derived.day, r: 'cross', t: new Date().toISOString() });
    if (!state.startedAt) state.startedAt = new Date().toISOString();
    saveState();
    render();
    closeModal();
    toast(`Missed attempt logged for Day ${derived.day}. Same day, clean slate.`, 'warn');
  }

  function undoLast() {
    if (!state.events.length) return;
    const removed = state.events.pop();
    saveState();
    render();
    settingsModal();
    toast(`Removed the last entry (Day ${removed.d} ${removed.r === 'tick' ? 'completed' : 'missed'}).`);
  }

  function exportData() {
    const payload = {
      app: 'ember-30-day-challenge',
      exportedAt: new Date().toISOString(),
      state: state,
      summary: {
        completedWorkouts: derived.completed,
        currentStreak: derived.streak,
        bestStreak: derived.best,
        missedAttempts: derived.misses,
        stage: stageOf(derived.stage).name,
        rewardsUnlocked: REWARDS.filter((r) => isRewardUnlocked(r.at)).map((r) => r.title)
      }
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ember-30-challenge-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Backup downloaded.');
  }

  function burstSparks() {
    const host = $('#heroSparks');
    if (!host) return;
    host.innerHTML = '';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    for (let i = 0; i < 12; i++) {
      const s = document.createElement('span');
      s.className = 'spark';
      const left = 26 + Math.random() * 48;
      const top = 28 + Math.random() * 36;
      s.style.left = left + '%';
      s.style.top = top + '%';
      s.style.setProperty('--dx', `${(Math.random() - 0.5) * 90}px`);
      s.style.setProperty('--dy', `${-50 - Math.random() * 90}px`);
      s.style.animationDelay = `${Math.random() * 0.25}s`;
      s.style.background = Math.random() > 0.55 ? '#c4622d' : '#e9a72c';
      host.appendChild(s);
    }
    setTimeout(() => { host.innerHTML = ''; }, 1600);
  }

  /* ------------------------------- events -------------------------------- */
  $('#logBtn').addEventListener('click', () => {
    if (derived.done) return;
    logModal();
  });

  $('#viewRewardsBtn').addEventListener('click', rewardsModal);
  $('#journeyBtn').addEventListener('click', journeyModal);
  $('#menuBtn').addEventListener('click', settingsModal);
  $('#modalClose').addEventListener('click', closeModal);

  modalRoot.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) closeModal();
  });

  $('#dayGrid').addEventListener('click', (e) => {
    const cell = e.target.closest('[data-day]');
    if (!cell) return;
    const day = Number(cell.dataset.day);
    const status = dayStatus(day);
    if (status === 'current' || status === 'missed') {
      logModal();
    } else if (status === 'done') {
      const when = derived.dayDoneAt[day];
      toast(`Day ${day} completed${when ? ' on ' + fmtShort(when) : ''}.`);
    } else {
      toast(`Day ${derived.day} comes first — the challenge moves in order.`, 'warn');
    }
  });

  $('#rewardStrip').addEventListener('click', (e) => {
    const chip = e.target.closest('[data-reward]');
    if (!chip) return;
    const index = Number(chip.dataset.reward);
    const reward = REWARDS[index];
    if (!reward) return;
    if (!isRewardUnlocked(reward.at)) {
      toast(`Unlocks at ${reward.at} completed workouts — you are at ${derived.completed}.`, 'warn');
      return;
    }
    rewardDetailModal(index);
  });

  modalBody.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;

    switch (action) {
      case 'tick':
        logTick();
        break;
      case 'cross':
        crossConfirmModal();
        break;
      case 'back':
        logModal();
        break;
      case 'confirmCross':
        logCross();
        break;
      case 'close':
        closeModal();
        break;
      case 'rewards':
        rewardsModal();
        break;
      case 'reward':
      case 'openReward':
        rewardDetailModal(Number(target.dataset.index));
        break;
      case 'prevReward':
        rewardDetailModal(Number(target.dataset.index) - 1);
        break;
      case 'nextReward':
        rewardDetailModal(Number(target.dataset.index) + 1);
        break;
      case 'export':
        exportData();
        break;
      case 'undo':
        undoLast();
        break;
      case 'resetAsk':
        resetConfirmModal();
        break;
      case 'settings':
        settingsModal();
        break;
      case 'resetConfirm':
        state = blankState();
        saveState();
        render();
        closeModal();
        toast('Challenge reset. Day 1 is waiting.');
        break;
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOpen) {
      closeModal();
      return;
    }

    if (modalOpen && e.key === 'Tab') {
      const focusables = modalEl.querySelectorAll('button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
      return;
    }

    if (modalOpen) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = (document.activeElement && document.activeElement.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    const key = e.key.toLowerCase();
    if (key === 'l' && !derived.done) { e.preventDefault(); logModal(); }
    else if (key === 'r') { e.preventDefault(); rewardsModal(); }
    else if (key === 'j') { e.preventDefault(); journeyModal(); }
  });

  /* -------------------------------- boot --------------------------------- */
  // A gentle nudge for returning users who left a day hanging.
  render();

  if (derived.misses > 0 && !derived.done && derived.streak === 0 && derived.dayMisses[derived.day]) {
    setTimeout(() => toast(`Day ${derived.day} is still open. Pick it back up when you are ready.`, 'warn'), 900);
  }
})();

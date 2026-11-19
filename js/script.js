/* ==========================================================================
   UB IT Study Hub — Master Captology, Microsuasion & Timely UX Script
   Author: Maria Concepcion M. Sapanlay
   Covers: Home, CMPTRB Experiment 1, and INTRCS Quizzes 1.1 through 3.2
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const state = {
    streak: parseInt(localStorage.getItem("ub_study_streak") || "3", 10),
    progress: parseInt(localStorage.getItem("ub_study_progress") || "35", 10),
    studentName: localStorage.getItem("ub_student_name") || "Maria"
  };

  const streakEl = document.getElementById("streak-count");
  const progressFill = document.getElementById("progress-fill");
  const progressText = document.getElementById("progress-text");
  const personalMsg = document.getElementById("personal-message");

  function renderNudges() {
    if (streakEl) streakEl.textContent = `${state.streak}-day study streak`;
    if (progressFill) progressFill.style.width = `${state.progress}%`;
    if (progressText) progressText.textContent = `Course Progress: ${state.progress}%`;
    if (personalMsg) {
      personalMsg.textContent = `Welcome back, ${state.studentName}! You're ${100 - state.progress}% away from completing your IT reviewer goal.`;
    }
  }
  renderNudges();

  // Pop-up Prompt Modal Handler
  const popupModal = document.getElementById("study-popup-modal");
  const popupTitle = document.getElementById("popup-title");
  const popupBody = document.getElementById("popup-body");
  const closePopupBtn = document.getElementById("close-popup-btn");

  function openPopup(title, message) {
    if (!popupModal) return;
    if (popupTitle) popupTitle.textContent = title;
    if (popupBody) popupBody.textContent = message;
    popupModal.classList.add("open");
  }

  if (closePopupBtn && popupModal) {
    closePopupBtn.addEventListener("click", () => {
      popupModal.classList.remove("open");
    });
  }

  // Friendly Pop-up Prompt when clicking any upcoming/locked links
  document.querySelectorAll(".unit-link.locked, .upcoming-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const itemName = link.dataset.itemTitle || "This module";
      openPopup(
        "Upcoming Module — Complete Active Lessons First!",
        `${itemName} is scheduled next in your syllabus. Complete your active INTRCS Units 1–3 lessons and quizzes first to build your study streak!`
      );
    });
  });

  // Gentle auto pop-up nudge once per session on pages with data-auto-prompt="true"
  if (popupModal && popupModal.dataset.autoPrompt === "true" && !sessionStorage.getItem("ub_study_prompt_shown")) {
    setTimeout(() => {
      openPopup(
        `Keep Your ${state.streak}-Day Streak Going, ${state.studentName}!`,
        "Complete one active lesson or quiz today to push your progress bar higher and keep your UB IT review momentum!"
      );
      sessionStorage.setItem("ub_study_prompt_shown", "true");
    }, 3000);
  }

  // ========================================================================
  // CMPTRB EXPERIMENT 1 SELF-CHECK HANDLER (experiment1.html)
  // ========================================================================
  const labForm = document.getElementById("lab-self-check-form");
  const labPraiseBanner = document.getElementById("praise-banner");

  if (labForm) {
    const rj45Input = document.getElementById("rj45-speed");
    const rj45Info = document.getElementById("rj45-info");
    const rj45Tip = document.getElementById("rj45-tip");

    if (rj45Input && rj45Info && rj45Tip) {
      rj45Input.addEventListener("input", () => {
        const val = rj45Input.value.trim();
        if (val.length > 0 && !/^(10|100|1000|10000|1\s*gbps|10\s*gbps|100\s*mbps)$/i.test(val)) {
          rj45Input.classList.add("input-error");
          rj45Info.classList.add("has-error");
          rj45Tip.textContent = "Suggestion: Enter a standard Ethernet bandwidth (e.g., 100 Mbps, 1000 Mbps, or 1 Gbps for Cat5e/Cat6).";
        } else {
          rj45Input.classList.remove("input-error");
          rj45Info.classList.remove("has-error");
          rj45Tip.textContent = "Suggestion: Standard Cat5e/Cat6 RJ45 Ethernet cables operate at 1000 Mbps (1 Gbps).";
        }
      });
    }

    labForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let score = 0;

      const q1 = labForm.querySelector('input[name="cable-q1"]:checked');
      const q1Info = document.getElementById("q1-info");
      const q1Tip = document.getElementById("q1-tip");
      if (q1 && q1.value === "B") {
        score++;
        if (q1Info) q1Info.classList.remove("has-error");
        if (q1Tip) q1Tip.textContent = "Correct! HDMI carries uncompressed digital video and multi-channel audio.";
      } else {
        if (q1Info) q1Info.classList.add("has-error");
        if (q1Tip) q1Tip.textContent = "Suggestion: Select HDMI — VGA only carries analog video signals without audio.";
      }

      const speedVal = rj45Input ? rj45Input.value.trim().toLowerCase() : "";
      if (["1000", "1000 mbps", "1 gbps", "1gbps"].includes(speedVal)) {
        score++;
        if (rj45Input) rj45Input.classList.remove("input-error");
        if (rj45Info) rj45Info.classList.remove("has-error");
      } else {
        if (rj45Input) rj45Input.classList.add("input-error");
        if (rj45Info) rj45Info.classList.add("has-error");
      }

      if (labPraiseBanner) {
        labPraiseBanner.style.display = "block";
        if (score === 2) {
          labPraiseBanner.classList.remove("partial");
          state.progress = Math.min(100, state.progress + 10);
          state.streak += 1;
          localStorage.setItem("ub_study_progress", state.progress);
          localStorage.setItem("ub_study_streak", state.streak);
          renderNudges();
          labPraiseBanner.textContent = `Great job, ${state.studentName}! You scored 2/2 on Experiment 1, earned +10% course progress (now ${state.progress}%), and extended your streak to ${state.streak} days!`;
        } else {
          labPraiseBanner.classList.add("partial");
          labPraiseBanner.textContent = `Nice try, ${state.studentName}! You got ${score}/2. Hover over any red (i) icon for a suggestion and try again.`;
        }
      }
    });
  }

  // ========================================================================
  // UNIVERSAL INTRCS QUIZ EVALUATION ENGINE (Quizzes 1.1 through 3.2)
  // ========================================================================
  const QUIZ_CONFIGS = {
    "1-1": {
      title: "Quiz 1.1",
      progressGain: 8,
      radios: [
        { name: "q1", expected: "B", infoId: "q1-info", tipId: "q1-tip", hint: "Suggestion: Recall UB's Core Values equation in Section 1.1.1: COMPETENCE + INTEGRITY = SERVICE." },
        { name: "q2", expected: "D", infoId: "q2-info", tipId: "q2-tip", hint: "Suggestion: Under UB CARES (Section 1.1.1.B), 'S' stands for Service-Driven Citizen." },
        { name: "q3", expected: "C", infoId: "q3-info", tipId: "q3-tip", hint: "Suggestion: Check Section 1.1.3 — Information Technology (IT) focuses on organizational application and systems management." },
        { name: "q4", expected: "A", infoId: "q4-info", tipId: "q4-tip", hint: "Suggestion: Check Section 1.1.3 — Computer Engineering (CpE) bridges CS and electrical engineering for embedded systems." },
        { name: "q6", expected: "B", infoId: "q6-info", tipId: "q6-tip", hint: "Suggestion: Check Section 1.1.4.B — Asset Integrity requires respecting intellectual property and avoiding code piracy." }
      ],
      text: {
        inputId: "q5-input",
        infoId: "q5-info",
        tipId: "q5-tip",
        accepted: ["processing"],
        validSet: ["input", "processing", "output", "storage"],
        liveInvalidHint: "Suggestion: Enter one of the four IPC stages (Input, Processing, Output, or Storage).",
        liveDefaultHint: "Suggestion: Type the exact IPC stage where the CPU executes instructions.",
        submitFailHint: "Suggestion: Check Section 1.1.2 — the stage where the CPU transforms raw data into information is 'Processing'.",
        submitPassMsg: "Correct! Processing is where the CPU executes instructions."
      }
    },
    "1-2": {
      title: "Quiz 1.2",
      progressGain: 8,
      radios: [
        { name: "q1", expected: "B", infoId: "q1-info", tipId: "q1-tip", hint: "Suggestion: Review Section 1.2.1.A — the ALU (Arithmetic Logic Unit) handles math and logical comparisons." },
        { name: "q2", expected: "C", infoId: "q2-info", tipId: "q2-tip", hint: "Suggestion: Check the Fetch-Execute Cycle order in Section 1.2.1.A: Fetch -> Decode -> Execute -> Store." },
        { name: "q3", expected: "A", infoId: "q3-info", tipId: "q3-tip", hint: "Suggestion: Review Section 1.2.1.C — RAM is volatile primary memory, whereas ROM is non-volatile firmware storage." },
        { name: "q4", expected: "D", infoId: "q4-info", tipId: "q4-tip", hint: "Suggestion: Check Section 1.2.4.B — SSDs use flash memory with no moving mechanical parts." },
        { name: "q6", expected: "B", infoId: "q6-info", tipId: "q6-tip", hint: "Suggestion: Review the storage hierarchy in Section 1.2.4 — CPU Registers are the fastest internal memory cells." }
      ],
      text: {
        inputId: "q5-input",
        infoId: "q5-info",
        tipId: "q5-tip",
        accepted: ["motherboard", "mainboard", "pcb"],
        validSet: ["motherboard", "cpu", "ram", "rom", "ssd", "hdd", "chipset"],
        liveInvalidHint: "Suggestion: Enter a core System Unit component (e.g., Motherboard, CPU, RAM, ROM).",
        liveDefaultHint: "Suggestion: Name the main printed circuit board ('the spine') that connects all internal components.",
        submitFailHint: "Suggestion: Check Section 1.2.1.B — the Motherboard is the main printed circuit board connecting all components.",
        submitPassMsg: "Correct! The Motherboard acts as the central spine connecting all components."
      }
    },
    "1-3": {
      title: "Quiz 1.3",
      progressGain: 8,
      radios: [
        { name: "q1", expected: "B", infoId: "q1-info", tipId: "q1-tip", hint: "Suggestion: Check Section 1.3.1 — the Operating System (OS) is the 'grand conductor' of system software." },
        { name: "q2", expected: "D", infoId: "q2-info", tipId: "q2-tip", hint: "Suggestion: Review Section 1.3.1.b — Device Drivers translate between the OS and specific hardware like printers." },
        { name: "q3", expected: "C", infoId: "q3-info", tipId: "q3-tip", hint: "Suggestion: Review Section 1.3.2 — Middleware acts as the 'software glue' connecting disparate apps and databases." },
        { name: "q4", expected: "A", infoId: "q4-info", tipId: "q4-tip", hint: "Suggestion: Check Section 1.3.3 — Freeware is closed-source proprietary software distributed at zero cost." },
        { name: "q6", expected: "C", infoId: "q6-info", tipId: "q6-tip", hint: "Suggestion: Check Section 1.3.3 — Public Domain software (like SQLite) has no copyright or IP restrictions." }
      ],
      text: {
        inputId: "q5-input",
        infoId: "q5-info",
        tipId: "q5-tip",
        accepted: ["shareware"],
        validSet: ["proprietary", "commercial", "open source", "freeware", "shareware", "public domain"],
        liveInvalidHint: "Suggestion: Enter one of the 6 licensing categories (Proprietary, Commercial, Open Source, Freeware, Shareware, Public Domain).",
        liveDefaultHint: "Suggestion: Name the 'try before you buy' trial licensing category (e.g., WinRAR).",
        submitFailHint: "Suggestion: Check Section 1.3.3 (5) — Shareware allows users to 'try before they buy' on a trial basis.",
        submitPassMsg: "Correct! Shareware distributes trial versions before requiring payment."
      }
    },
    "2-1": {
      title: "Quiz 2.1",
      progressGain: 8,
      radios: [
        { name: "q1", expected: "C", infoId: "q1-info", tipId: "q1-tip", hint: "Suggestion: Check Section 2.1 — 1 byte universally equals 8 bits." },
        { name: "q2", expected: "B", infoId: "q2-info", tipId: "q2-tip", hint: "Suggestion: Check Section 2.1.1.B — 1101_2 = (1×8) + (1×4) + (0×2) + (1×1) = 13." },
        { name: "q3", expected: "A", infoId: "q3-info", tipId: "q3-tip", hint: "Suggestion: Check Section 2.1.2 — Octal (Base-8) only uses digits 0 through 7." },
        { name: "q4", expected: "D", infoId: "q4-info", tipId: "q4-tip", hint: "Suggestion: Check Section 2.1.2.D — in Hexadecimal, A=10, B=11, C=12, D=13, E=14, F=15." },
        { name: "q6", expected: "C", infoId: "q6-info", tipId: "q6-tip", hint: "Suggestion: Group 1101 0110 in 4-bit nibbles: 1101 = 13 (D) and 0110 = 6 -> D6." }
      ],
      text: {
        inputId: "q5-input",
        infoId: "q5-info",
        tipId: "q5-tip",
        accepted: ["11001", "11001_2", "110012"],
        validSet: null,
        liveInvalidHint: "Suggestion: Binary numbers only contain 0s and 1s (divide 25 repeatedly by 2 and read remainders bottom-up).",
        liveDefaultHint: "Suggestion: Convert decimal 25 to binary (16 + 8 + 1).",
        submitFailHint: "Suggestion: Check Section 2.1.3.A Example 2 — 25 in decimal equals 11001 in binary.",
        submitPassMsg: "Correct! 25_10 = 16 + 8 + 1 = 11001_2."
      }
    },
    "2-2": {
      title: "Quiz 2.2",
      progressGain: 8,
      radios: [
        { name: "q1", expected: "B", infoId: "q1-info", tipId: "q1-tip", hint: "Suggestion: Check Section 2.2.1 — 8 bits per channel × 3 channels (Red, Green, Blue) = 24 bits (3 bytes)." },
        { name: "q2", expected: "A", infoId: "q2-info", tipId: "q2-tip", hint: "Suggestion: Check Section 2.2.1 (2) — Sampling takes discrete snapshots of amplitude at regular intervals." },
        { name: "q3", expected: "C", infoId: "q3-info", tipId: "q3-tip", hint: "Suggestion: Check Section 2.2.2 — Original ASCII used 7 bits to represent 2^7 = 128 characters." },
        { name: "q4", expected: "D", infoId: "q4-info", tipId: "q4-tip", hint: "Suggestion: Check Section 2.2.2 — ASCII 'A' is decimal 65 (01000001_2), while 'a' is 97." },
        { name: "q6", expected: "B", infoId: "q6-info", tipId: "q6-tip", hint: "Suggestion: Check Section 2.2.2 — UTF-8 uses 1 byte for ASCII characters and 2–4 bytes for global scripts/emojis." }
      ],
      text: {
        inputId: "q5-input",
        infoId: "q5-info",
        tipId: "q5-tip",
        accepted: ["unicode", "utf-8", "utf8"],
        validSet: ["ascii", "extended ascii", "unicode", "utf-8", "utf-16", "utf-32", "rgb"],
        liveInvalidHint: "Suggestion: Enter a character encoding standard from Lesson 2.2 (e.g., ASCII or Unicode).",
        liveDefaultHint: "Suggestion: Name the universal character encoding standard designed to represent all world languages and emojis.",
        submitFailHint: "Suggestion: Check Section 2.2.2 — Unicode was created to represent every language and emoji worldwide.",
        submitPassMsg: "Correct! Unicode solves the global language barrier while remaining backward-compatible with ASCII."
      }
    },
    "2-3": {
      title: "Quiz 2.3",
      progressGain: 8,
      radios: [
        { name: "q1", expected: "A", infoId: "q1-info", tipId: "q1-tip", hint: "Suggestion: Check Section 2.3.1 — Conjunction (AND, Y = A * B) outputs 1 only when ALL inputs are 1." },
        { name: "q2", expected: "C", infoId: "q2-info", tipId: "q2-tip", hint: "Suggestion: Check Section 2.3.1 — Disjunction (OR, Y = A + B) outputs 1 if AT LEAST ONE input is 1." },
        { name: "q3", expected: "B", infoId: "q3-info", tipId: "q3-tip", hint: "Suggestion: Check Section 2.3.1 — Inversion (NOT) flips input 1 to 0 and input 0 to 1." },
        { name: "q4", expected: "D", infoId: "q4-info", tipId: "q4-tip", hint: "Suggestion: Check the Universal Gate Principle in Section 2.3.1 — NAND and NOR are universal gates." },
        { name: "q6", expected: "A", infoId: "q6-info", tipId: "q6-tip", hint: "Suggestion: If A=1 and B=0, then A AND B = 0, so NOT(A AND B) [NAND] = 1." }
      ],
      text: {
        inputId: "q5-input",
        infoId: "q5-info",
        tipId: "q5-tip",
        accepted: ["0", "false"],
        validSet: ["0", "1", "true", "false"],
        liveInvalidHint: "Suggestion: In Boolean algebra, enter 1 (True) or 0 (False).",
        liveDefaultHint: "Suggestion: Evaluate Y = A * B when A = 1 and B = 0.",
        submitFailHint: "Suggestion: Check Section 2.3.1 — for an AND gate (1 * 0), both inputs must be 1 to output 1, so the output is 0.",
        submitPassMsg: "Correct! 1 AND 0 evaluates to 0 (False)."
      }
    },
    "3-1": {
      title: "Quiz 3.1",
      progressGain: 8,
      radios: [
        { name: "q1", expected: "B", infoId: "q1-info", tipId: "q1-tip", hint: "Suggestion: Check Section 3.1 — Packet switching splits data into small packets routed independently across networks." },
        { name: "q2", expected: "A", infoId: "q2-info", tipId: "q2-tip", hint: "Suggestion: Check Section 3.1.1 — A LAN connects devices within a limited area like a single building or campus." },
        { name: "q3", expected: "D", infoId: "q3-info", tipId: "q3-tip", hint: "Suggestion: Check Section 3.1.2 — Mesh topology connects nodes redundantly so traffic reroutes if one link breaks." },
        { name: "q4", expected: "C", infoId: "q4-info", tipId: "q4-tip", hint: "Suggestion: Check Section 3.1.3 — The Network Layer (Layer 3) manages logical IP addressing and packet routing." },
        { name: "q6", expected: "B", infoId: "q6-info", tipId: "q6-tip", hint: "Suggestion: Check Section 3.1.3 — HTTPS encrypts web traffic between your browser and the web server." }
      ],
      text: {
        inputId: "q5-input",
        infoId: "q5-info",
        tipId: "q5-tip",
        accepted: ["dns", "domain name system"],
        validSet: ["dns", "domain name system", "tcp", "ip", "http", "https", "ftp", "smtp"],
        liveInvalidHint: "Suggestion: Enter a network protocol acronym from Section 3.1.3 (e.g., DNS, TCP, IP, HTTP).",
        liveDefaultHint: "Suggestion: Name the protocol ('phone book of the Internet') that translates domain names into IP addresses.",
        submitFailHint: "Suggestion: Check Section 3.1.3 — DNS (Domain Name System) translates domain names into numerical IP addresses.",
        submitPassMsg: "Correct! DNS resolves human-readable domain names into IP addresses."
      }
    },
    "3-2": {
      title: "Quiz 3.2",
      progressGain: 9,
      radios: [
        { name: "q1", expected: "C", infoId: "q1-info", tipId: "q1-tip", hint: "Suggestion: Check Section 3.2.1 — Network Worms self-replicate across networks automatically without human action." },
        { name: "q2", expected: "B", infoId: "q2-info", tipId: "q2-tip", hint: "Suggestion: Check Section 3.2.1 — Trojan Horses disguise themselves as legitimate software to open backdoors." },
        { name: "q3", expected: "D", infoId: "q3-info", tipId: "q3-tip", hint: "Suggestion: Check Section 3.2.1 — Ransomware encrypts a victim's files and demands payment for the decryption key." },
        { name: "q4", expected: "A", infoId: "q4-info", tipId: "q4-tip", hint: "Suggestion: Check Section 3.2.2 — Network Firewalls monitor and filter incoming/outgoing traffic using security rules." },
        { name: "q6", expected: "C", infoId: "q6-info", tipId: "q6-tip", hint: "Suggestion: Check Section 3.2.3 — The Principle of Least Privilege restricts users to only the minimum access needed." }
      ],
      text: {
        inputId: "q5-input",
        infoId: "q5-info",
        tipId: "q5-tip",
        accepted: ["encryption", "cryptographic encryption", "cryptography"],
        validSet: ["firewall", "antivirus", "encryption", "cryptographic encryption", "backup", "mfa"],
        liveInvalidHint: "Suggestion: Enter a defensive measure from Section 3.2.2 (Firewall, Antivirus, Encryption, or Backup).",
        liveDefaultHint: "Suggestion: Name the defensive process that scrambles plaintext into unreadable ciphertext using a key.",
        submitFailHint: "Suggestion: Check Section 3.2.2 — Cryptographic Encryption scrambles plaintext into unreadable ciphertext.",
        submitPassMsg: "Correct! Cryptographic Encryption protects confidentiality with a decryption key."
      }
    }
  };

  const intrcsQuizForm = document.getElementById("intrcs-quiz-form");
  const intrcsPraiseBanner = document.getElementById("intrcs-praise-banner");

  if (intrcsQuizForm) {
    const quizId = intrcsQuizForm.dataset.quizId || "1-1";
    const cfg = QUIZ_CONFIGS[quizId] || QUIZ_CONFIGS["1-1"];
    const textCfg = cfg.text;
    const textInput = textCfg ? document.getElementById(textCfg.inputId) : null;
    const textInfo = textCfg ? document.getElementById(textCfg.infoId) : null;
    const textTip = textCfg ? document.getElementById(textCfg.tipId) : null;

    if (textInput && textInfo && textTip) {
      textInput.addEventListener("input", () => {
        const val = textInput.value.trim().toLowerCase();
        if (val.length === 0) {
          textInput.classList.remove("input-error");
          textInfo.classList.remove("has-error");
          textTip.textContent = textCfg.liveDefaultHint;
          return;
        }
        let isPlausible = true;
        if (quizId === "2-1") {
          isPlausible = /^[01]+$/.test(val);
        } else if (textCfg.validSet) {
          isPlausible = textCfg.validSet.includes(val);
        }
        if (!isPlausible) {
          textInput.classList.add("input-error");
          textInfo.classList.add("has-error");
          textTip.textContent = textCfg.liveInvalidHint;
        } else {
          textInput.classList.remove("input-error");
          textInfo.classList.remove("has-error");
          textTip.textContent = textCfg.liveDefaultHint;
        }
      });
    }

    intrcsQuizForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let score = 0;
      const total = cfg.radios.length + (textCfg ? 1 : 0);

      cfg.radios.forEach((item) => {
        const selected = intrcsQuizForm.querySelector(`input[name="${item.name}"]:checked`);
        const infoBtn = document.getElementById(item.infoId);
        const tipSpan = document.getElementById(item.tipId);

        if (selected && selected.value === item.expected) {
          score++;
          if (infoBtn) infoBtn.classList.remove("has-error");
          if (tipSpan) tipSpan.textContent = `Correct! Great recall from ${cfg.title}.`;
        } else {
          if (infoBtn) infoBtn.classList.add("has-error");
          if (tipSpan) tipSpan.textContent = item.hint;
        }
      });

      if (textCfg && textInput && textInfo && textTip) {
        const userVal = textInput.value.trim().toLowerCase();
        if (textCfg.accepted.includes(userVal)) {
          score++;
          textInput.classList.remove("input-error");
          textInfo.classList.remove("has-error");
          textTip.textContent = textCfg.submitPassMsg;
        } else {
          textInput.classList.add("input-error");
          textInfo.classList.add("has-error");
          textTip.textContent = textCfg.submitFailHint;
        }
      }

      if (intrcsPraiseBanner) {
        intrcsPraiseBanner.style.display = "block";
        if (score === total) {
          intrcsPraiseBanner.classList.remove("partial");
          state.progress = Math.min(100, state.progress + cfg.progressGain);
          state.streak += 1;
          localStorage.setItem("ub_study_progress", state.progress);
          localStorage.setItem("ub_study_streak", state.streak);
          renderNudges();
          intrcsPraiseBanner.textContent = `Great job, ${state.studentName}! Perfect score (${score}/${total}) on ${cfg.title}! You earned +${cfg.progressGain}% course progress (now ${state.progress}%) and extended your streak to ${state.streak} days!`;
        } else {
          intrcsPraiseBanner.classList.add("partial");
          intrcsPraiseBanner.textContent = `Good effort, ${state.studentName}! You scored ${score}/${total} on ${cfg.title}. Hover over any red (i) icon next to a missed question for a timely suggestion!`;
        }
      }
    });
  }
});

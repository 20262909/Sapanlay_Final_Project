/* ==========================================================================
   UB IT Study Hub — Master Captology, Microsuasion & Timely UX Script
   Author: Maria Concepcion M. Sapanlay
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

  // Friendly Pop-up Prompt when clicking upcoming/locked lessons or quizzes
  document.querySelectorAll(".unit-link.locked, .upcoming-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const itemName = link.dataset.itemTitle || "This module";
      openPopup(
        "Upcoming Module — Complete Active Lessons First!",
        `${itemName} is scheduled next in your syllabus. Complete your active INTRCS Lesson 1.1, Quiz 1.1, or CMPTRB Experiment 1 first to build your study streak!`
      );
    });
  });

  // Gentle auto pop-up nudge once per session on pages with data-auto-prompt="true"
  if (popupModal && popupModal.dataset.autoPrompt === "true" && !sessionStorage.getItem("ub_study_prompt_shown")) {
    setTimeout(() => {
      openPopup(
        `Keep Your ${state.streak}-Day Streak Going, ${state.studentName}!`,
        "Complete one active lesson or quiz today to push your progress bar past 50% and keep your UB IT review momentum!"
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
          state.progress = Math.min(100, state.progress + 15);
          state.streak += 1;
          localStorage.setItem("ub_study_progress", state.progress);
          localStorage.setItem("ub_study_streak", state.streak);
          renderNudges();
          labPraiseBanner.textContent = `Great job, ${state.studentName}! You scored 2/2 on Experiment 1, earned +15% course progress (now ${state.progress}%), and extended your streak to ${state.streak} days!`;
        } else {
          labPraiseBanner.classList.add("partial");
          labPraiseBanner.textContent = `Nice try, ${state.studentName}! You got ${score}/2. Hover over any red (i) icon for a suggestion and try again.`;
        }
      }
    });
  }

  // ========================================================================
  // INTRCS QUIZ 1.1 EVALUATION HANDLER (intrcs-quiz1-1.html)
  // ========================================================================
  const intrcsQuizForm = document.getElementById("intrcs-quiz-form");
  const intrcsPraiseBanner = document.getElementById("intrcs-praise-banner");

  if (intrcsQuizForm) {
    const q5Input = document.getElementById("q5-input");
    const q5Info = document.getElementById("q5-info");
    const q5Tip = document.getElementById("q5-tip");

    if (q5Input && q5Info && q5Tip) {
      q5Input.addEventListener("input", () => {
        const val = q5Input.value.trim().toLowerCase();
        if (val.length > 0 && !["input", "processing", "output", "storage"].includes(val)) {
          q5Input.classList.add("input-error");
          q5Info.classList.add("has-error");
          q5Tip.textContent = "Suggestion: Enter one of the four IPC stages (Input, Processing, Output, or Storage) where the CPU executes instructions.";
        } else {
          q5Input.classList.remove("input-error");
          q5Info.classList.remove("has-error");
          q5Tip.textContent = "Suggestion: Type the exact name of the IPC stage where the CPU transforms raw data into meaningful information.";
        }
      });
    }

    intrcsQuizForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let score = 0;
      const total = 6;

      const radioChecks = [
        {
          name: "q1",
          expected: "B",
          infoId: "q1-info",
          tipId: "q1-tip",
          hint: "Suggestion: Remember UB's Core Values anchor formula from Section 1.1.1: COMPETENCE + INTEGRITY = SERVICE."
        },
        {
          name: "q2",
          expected: "D",
          infoId: "q2-info",
          tipId: "q2-tip",
          hint: "Suggestion: Under UB CARES (Section 1.1.1.B), 'S' stands for Service-Driven Citizen — building inclusive tools and following local digital laws."
        },
        {
          name: "q3",
          expected: "C",
          infoId: "q3-info",
          tipId: "q3-tip",
          hint: "Suggestion: Check Section 1.1.3 — Information Technology (IT) focuses on organizational application, systems administration, and deployment."
        },
        {
          name: "q4",
          expected: "A",
          infoId: "q4-info",
          tipId: "q4-tip",
          hint: "Suggestion: Check Section 1.1.3 — Computer Engineering (CpE) bridges CS and electrical engineering for embedded systems and microprocessors."
        },
        {
          name: "q6",
          expected: "B",
          infoId: "q6-info",
          tipId: "q6-tip",
          hint: "Suggestion: Check Section 1.1.4.B — Asset Integrity requires respecting intellectual property, avoiding unauthorized code duplication, and reporting bugs."
        }
      ];

      radioChecks.forEach((item) => {
        const selected = intrcsQuizForm.querySelector(`input[name="${item.name}"]:checked`);
        const infoBtn = document.getElementById(item.infoId);
        const tipSpan = document.getElementById(item.tipId);

        if (selected && selected.value === item.expected) {
          score++;
          if (infoBtn) infoBtn.classList.remove("has-error");
          if (tipSpan) tipSpan.textContent = "Correct! Great recall from Lesson 1.1.";
        } else {
          if (infoBtn) infoBtn.classList.add("has-error");
          if (tipSpan) tipSpan.textContent = item.hint;
        }
      });

      if (q5Input && q5Info && q5Tip) {
        const q5Val = q5Input.value.trim().toLowerCase();
        if (q5Val === "processing") {
          score++;
          q5Input.classList.remove("input-error");
          q5Info.classList.remove("has-error");
          q5Tip.textContent = "Correct! Processing is where the CPU executes instructions.";
        } else {
          q5Input.classList.add("input-error");
          q5Info.classList.add("has-error");
          q5Tip.textContent = "Suggestion: Check Section 1.1.2.B — the stage where the CPU transforms raw data into information is 'Processing'.";
        }
      }

      if (intrcsPraiseBanner) {
        intrcsPraiseBanner.style.display = "block";
        if (score === total) {
          intrcsPraiseBanner.classList.remove("partial");
          state.progress = Math.min(100, state.progress + 20);
          state.streak += 1;
          localStorage.setItem("ub_study_progress", state.progress);
          localStorage.setItem("ub_study_streak", state.streak);
          renderNudges();
          intrcsPraiseBanner.textContent = `Great job, ${state.studentName}! Perfect score (${score}/${total}) on Quiz 1.1! You earned +20% course progress (now ${state.progress}%) and extended your streak to ${state.streak} days!`;
        } else {
          intrcsPraiseBanner.classList.add("partial");
          intrcsPraiseBanner.textContent = `Good effort, ${state.studentName}! You scored ${score}/${total}. Hover over any red (i) icon next to a missed question for a timely suggestion from Lesson 1.1!`;
        }
      }
    });
  }
});

const TOTAL = 10;

    const OBJECTS = [
      { name: "Banana Peel", emoji: "🍌", isWaste: true,
        putIn: "Mmm, finally something I can't reject! Slippery, but accepted. 🍌✨",
        keptOut: "Too slippery for you too? That was 100% garbage! 💀" },
      { name: "Plastic Bottle", emoji: "🧴", isWaste: true,
        putIn: "Finally, plastic I can fully agree with. Accepted! 🧴✨",
        keptOut: "That bottle was trash and you know it. 💀" },
      { name: "Paper", emoji: "📄", isWaste: true,
        putIn: "For once, paperwork is welcome around here. Accepted! 📄✨",
        keptOut: "Tsk. That paper's destiny was me. Now it's roaming free. 💀" },
      { name: "Can", emoji: "🥫", isWaste: true,
        putIn: "Crushed it... and the win! Accepted! 🥫✨",
        keptOut: "Can you please not miss the can? 😤💀" },
      { name: "Apple", emoji: "🍎", isWaste: true,
        putIn: "An apple THIS day keeps the bin happy. Accepted! 🍎✨",
        keptOut: "That core had my name on... my lid. 💀" },
      { name: "Phone", emoji: "📱", isWaste: false,
        putIn: "I'm full of no signal — especially not phones! 📱💀",
        keptOut: "Wrong drawer, correct choice. Very smart! ✨" },
      { name: "Book", emoji: "📚", isWaste: false,
        putIn: "I only accept blank pages, sorry. 📚💀",
        keptOut: "Good call. That book has chapters left to live. ✨" },
      { name: "Shoe", emoji: "👟", isWaste: false,
        putIn: "Shoes don't belong in a bin that does nothing. 👟💀",
        keptOut: "You just saved somebody's sole. 👟✨" },
      { name: "Toy", emoji: "🧸", isWaste: false,
        putIn: "Not broken, just unloved! Donate, don't dump. 🧸💀",
        keptOut: "The toy squeaks in gratitude. You spared it. ✨" },
      { name: "Clothes", emoji: "👕", isWaste: false,
        putIn: "This bin is not a donation box! 👕💀",
        keptOut: "Style saved! That shirt had another decade in it. ✨" }
    ];

    let objects = [];
    let index = 0;
    let aura = 0;
    let busy = false;

    const auraValue = document.getElementById("auraValue");
    const roundLine = document.getElementById("roundLine");
    const dots = document.getElementById("dots");
    const item = document.getElementById("item");
    const itemEmoji = document.getElementById("itemEmoji");
    const itemName = document.getElementById("itemName");
    const basket = document.getElementById("basket");
    const badge = document.getElementById("badge");
    const putBtn = document.getElementById("putBtn");
    const keepBtn = document.getElementById("keepBtn");
    const resultMsg = document.getElementById("resultMsg");
    const scoreDelta = document.getElementById("scoreDelta");
    const overlay = document.getElementById("overlay");
    const finalScore = document.getElementById("finalScore");
    const finalMsg = document.getElementById("finalMsg");

    function shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    function startGame() {
      objects = shuffle(OBJECTS);
      index = 0;
      aura = 0;
      busy = false;
      overlay.classList.add("hidden");
      updateAura();
      renderDots();
      showObject();
      setButtons(false);
    }

    function showObject() {
      const obj = objects[index];
      itemEmoji.textContent = obj.emoji;
      itemName.textContent = obj.name;
      item.classList.remove("throw", "sink", "return", "nope");
      void item.offsetWidth;
      item.classList.add("enter");
      roundLine.textContent = (index + 1) + " / " + TOTAL;
      renderDots();
      hideFeedback();
    }

    function updateAura() {
      auraValue.textContent = aura;
      auraValue.classList.toggle("bad", aura < 0);
      auraValue.classList.remove("pop");
      void auraValue.offsetWidth;
      auraValue.classList.add("pop");
    }

    function renderDots() {
      dots.innerHTML = "";
      for (let i = 0; i < TOTAL; i++) {
        const dot = document.createElement("span");
        dot.className = "dot";
        if (i < index) dot.classList.add("done");
        if (i === index) dot.classList.add("current");
        dots.appendChild(dot);
      }
    }

    function setButtons(disabled) {
      putBtn.disabled = disabled;
      keepBtn.disabled = disabled;
    }

    function choose(put) {
      if (busy) return;
      const obj = objects[index];
      busy = true;
      setButtons(true);

      const correct = put === obj.isWaste;
      aura += correct ? 10 : -10;
      updateAura();

      resultMsg.textContent = "“" + (put ? obj.putIn : obj.keptOut) + "”";
      resultMsg.className = "result-msg visible " + (correct ? "good" : "bad");
      scoreDelta.textContent = correct ? "+10 Aura ✨" : "−10 Aura 💀";
      scoreDelta.className = "score-delta visible " + (correct ? "good" : "bad");

      badge.textContent = correct ? "✨" : "💀";
      badge.classList.remove("pop");
      void badge.offsetWidth;
      badge.classList.add("pop");

      if (put) {
        item.classList.add("throw");
        setTimeout(function () {
          item.classList.remove("throw");
          item.classList.add(correct ? "sink" : "return");
          basket.classList.add(correct ? "happy" : "shake");
        }, 320);
      } else {
        item.classList.add("nope");
        basket.classList.add(correct ? "happy" : "sad");
      }

      setTimeout(function () {
        index++;
        basket.classList.remove("happy", "shake", "sad");
        badge.classList.remove("pop");
        hideFeedback();
        if (index >= objects.length) {
          finishGame();
        } else {
          showObject();
          setButtons(false);
          busy = false;
        }
      }, 1600);
    }

    function hideFeedback() {
      resultMsg.classList.add("hidden");
      scoreDelta.classList.add("hidden");
    }

    function finishGame() {
      finalScore.textContent = aura;
      finalScore.className = "final-score " + (aura < 0 ? "bad" : "good");
      finalMsg.textContent = finalMessage(aura);
      overlay.classList.remove("hidden");
    }

    function finalMessage(score) {
      if (score >= 100) return "🏆 FLAWLESS! You ARE the Trash Lord. The bin bows to you.";
      if (score >= 70) return "Amazing! Practically a waste-sorting prodigy. 🤩";
      if (score >= 40) return "Pretty solid. The bin is mildly impressed. 👍";
      if (score >= 10) return "You're getting there... slowly. 😅";
      if (score >= 0) return "Perfectly balanced, as all things should be. ⚖️";
      if (score >= -30) return "The bin now questions your childhood. 🙃";
      if (score >= -60) return "You and the bin have a... rocky relationship. 💀";
      if (score >= -90) return "Concerning. Please take a walk outside. 🚶";
      return "You are a fire hazard in a recycling plant. 🚒🔥";
    }

    putBtn.addEventListener("click", function () { choose(true); });
    keepBtn.addEventListener("click", function () { choose(false); });
    document.getElementById("playAgainBtn").addEventListener("click", startGame);

    startGame();
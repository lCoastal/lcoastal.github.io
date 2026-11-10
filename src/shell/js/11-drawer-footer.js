ptInstallMeta(window);
(function () {
  const n = document.createElement("p");
  n.className = "dfix";
  n.innerHTML = "Spotted something wrong or out of date? Message <b>@__coastal</b> on Discord.";
  drawer.appendChild(n);
  const wrap = document.createElement("div");
  wrap.className = "resetall";
  drawer.appendChild(wrap);
})();
(function () {
  const wrap = document.querySelector(".resetall");
  const b = document.createElement("button");
  b.type = "button";
  b.className = "nav danger";
  wrap.appendChild(b);
  drawer.appendChild(wrap);
  let st = "idle",
    t1 = null,
    t2 = null;
  const idle = () => {
    st = "idle";
    clearInterval(t1);
    clearTimeout(t2);
    b.disabled = false;
    b.classList.remove("armed");
    b.innerHTML = "<b>Reset everything</b><span>Clear every input, build, checklist and setting</span>";
  };
  b.onclick = () => {
    if (st === "idle") {
      st = "wait";
      let n = 5;
      b.disabled = true;
      const draw = () => {
        b.innerHTML = `<b>Wait ${n}…</b><span>Then click again to confirm</span>`;
      };
      draw();
      t1 = setInterval(() => {
        n--;
        if (n > 0) {
          draw();
          return;
        }
        clearInterval(t1);
        st = "armed";
        b.disabled = false;
        b.classList.add("armed");
        b.innerHTML = "<b>Click again to reset</b><span>Deletes your builds, boards and settings</span>";
        b.focus();
        t2 = setTimeout(idle, 10000);
      }, 1000);
    } else if (st === "armed") {
      clearTimeout(t2);
      try {
        localStorage.clear();
      } catch (e) {}
      try {
        sessionStorage.clear();
      } catch (e) {}
      b.innerHTML = "<b>Reset done</b><span>Reloading…</span>";
      b.disabled = true;
      setTimeout(() => location.reload(), 400);
    }
  };
  idle();
})();

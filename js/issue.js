gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

let sections = gsap.utils.toArray(".panel");

sections.forEach((eachPanel, index) => {
  ScrollTrigger.create({
    trigger: eachPanel,
    start: "top top",

  });
});

document.querySelectorAll("nav button").forEach((btn, index) => {
    btn.addEventListener("click", () => {
      gsap.to(window, {duration: 1, scrollTo:{y:"#section" + (index + 1), offsetY:70}});
    });
  });

  document.querySelectorAll(".intro").forEach((btn, index) => {
      btn.addEventListener("click", () => {
        gsap.to(window, {duration: 1, scrollTo:{y:"#section" + (index + 1), offsetY:70}});
      });
    });

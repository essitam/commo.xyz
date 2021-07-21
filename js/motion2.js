gsap.registerPlugin(MotionPathPlugin);

gsap.to("#rect", {
  duration: 5,
  repeat: 12,
  repeatDelay: 1,
  yoyo: true,
  ease: "power1.inOut",
  motionPath:{
    path: "#path",
    align: "#path",
    autoRotate: true,
    alignOrigin: [0.5, 0.5]
  }
});
// gsap.to("#rect", {duration: 1, rotation: 360, transformOrigin: "50% 50%"});
// gsap.to("#rect", {
//   duration: 5,
//   repeat: 12,
//   repeatDelay: 1,
//   yoyo: true,
//   ease: "power1.inOut",
//   rotation: 360,
//   transformOrigin: "50% 50%"
//   // motionPath:{
//   //   path: "#path",
//   //   align: "#path",
//   //   autoRotate: true,
//   //   alignOrigin: [0.5, 0.5]
//   // }
// });

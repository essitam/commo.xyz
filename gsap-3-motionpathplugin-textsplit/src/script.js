console.clear();

gsap.registerPlugin(MotionPathPlugin);
gsap.registerPlugin(SplitText);

select = e => document.querySelector(e);
selectAll = e => document.querySelectorAll(e);

let txt = select('.txt'),
	tContent = txt.textContent,
	tl = gsap.timeline(),
	ntContent = '',
	chars,
	mySplitText;
	
function duplicateContent() {
	for (i=0; i< 26; i++) {
		ntContent = ntContent + tContent;
	}
}

function reverseString(str) {
    return str.split("").reverse().join("");
}

function initLongText() {
	txt.textContent = reverseString(ntContent);
	mySplitText = new SplitText(txt, {type:"chars", charsClass:"char", position: "relative" }); 
	chars = gsap.utils.toArray(".char");
	gsap.set(chars, { xPercent: -50, yPercent: -50, transformOrigin: "50% 50%" });
	gsap.set('.container', { autoAlpha: 1 });
}

function animateText() {
	tl.to(chars, {
		motionPath: {
			path: ".svg-char__path",
			align: ".svg-char__path",
			autoRotate: true,
			start: 0.37, // reposition starting point to the bottom left
			end: 1.37
		},
		stagger: {
			each: 0.12,
			repeat: -1
		},
		duration: 15,
		ease: "none"
	});
	// tl.seek(18);
}

duplicateContent();
initLongText();
animateText();





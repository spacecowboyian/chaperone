var chaperoneModule = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
  var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

  // src/chaperone.js
  var chaperone_exports = {};
  __export(chaperone_exports, {
    Chaperone: () => Chaperone,
    default: () => chaperone_default
  });
  var DEFAULT_OPTIONS = {
    breakpoints: {
      mobile: 420,
      mobileLandscape: 740,
      tablet: 1024
    },
    throbberHTML: '<span class="throbber"><span class="dot"></span></span>',
    chaperoneHTML: '<div class="chaperone"><div class="chaperone__header"><div class="chaperone__title" data-hook="chaperone-title"></div><div class="chaperone__progress" data-hook="chaperone-progress">X of X</div></div><div class="chaperone__body" data-hook="chaperone-text"></div><div class="chaperone__controls"><div class="chaperone__controls__wrapper"><a class="close-chaperone" data-hook="close-chaperone"><span class="close thick"></span></a><a class="chaperone-btn" data-hook="chaperone-back">Back</a><a class="chaperone-btn chaperone-btn--next" data-hook="chaperone-next">Next</a><a class="chaperone-btn chaperone-btn--finish hide" data-hook="chaperone-finish">Finish</a></div></div></div>',
    pageContainerSelector: "",
    progressSelector: '[data-hook="chaperone-progress"]',
    textSelector: '[data-hook="chaperone-text"]',
    backSelector: '[data-hook="chaperone-back"]',
    nextSelector: '[data-hook="chaperone-next"]',
    finishSelector: '[data-hook="chaperone-finish"]',
    finishCallback: () => {
    },
    animationTime: 300,
    cycle: false,
    autoStart: true,
    zIndex: 9999,
    steps: [
      {
        position: "fixed",
        location: "windowMiddle",
        title: "Welcome to Chaperone.",
        message: "Add some more steps already!"
      }
    ]
  };
  function mergeOptions(defaults, overrides) {
    const merged = { ...defaults, breakpoints: { ...defaults.breakpoints } };
    if (!(overrides instanceof Object)) {
      return merged;
    }
    for (const key of Object.keys(overrides)) {
      if (!Object.prototype.hasOwnProperty.call(merged, key)) {
        continue;
      }
      const value = overrides[key];
      if (value && typeof value === "object" && !Array.isArray(value)) {
        merged[key] = { ...merged[key], ...value };
      } else {
        merged[key] = value;
      }
    }
    return merged;
  }
  var _Chaperone_instances, handleClick_fn, handleWindowChange_fn, createDOMElement_fn, getOffset_fn, getZindex_fn, scrollTo_fn;
  var Chaperone = class {
    /**
     * @param {object} [tour] - initial tour configuration (same shape as init()).
     */
    constructor(tour) {
      __privateAdd(this, _Chaperone_instances);
      this.options = mergeOptions(DEFAULT_OPTIONS, null);
      this.shownSteps = null;
      this.currentStep = null;
      this.currentTrigger = null;
      if (tour) {
        this.init(tour);
      }
    }
    /**
     * init - initialize a tour: merge config, place steps on the page, and bind events.
     * @param {object} tour - configuration object that overwrites the defaults in this.options.
     * @return {Chaperone} this, for chaining.
     */
    init(tour) {
      if (!(tour instanceof Object)) {
        throw new TypeError("chaperone.init() requires a tour configuration object");
      }
      this.options = mergeOptions(DEFAULT_OPTIONS, tour);
      this.clickHandler = (evt) => __privateMethod(this, _Chaperone_instances, handleClick_fn).call(this, evt);
      this.windowChangeHandler = () => __privateMethod(this, _Chaperone_instances, handleWindowChange_fn).call(this);
      this.placeSteps(this.options.steps);
      document.body.addEventListener("click", this.clickHandler);
      window.addEventListener("resize", this.windowChangeHandler);
      return this;
    }
    /**
     * placeSteps - create the throbbers on the page appropriate to the current screen size.
     * @param {Array<object>} steps - all of the steps passed in to init() via (tour).
     */
    placeSteps(steps) {
      const currentSize = this.getCurrentScreenSize();
      this.shownSteps = steps.filter((step) => {
        return step.shownOn ? step.shownOn.includes(currentSize) : true;
      });
      this.shownSteps.forEach((step, i) => {
        const throbber = __privateMethod(this, _Chaperone_instances, createDOMElement_fn).call(this, this.options.throbberHTML);
        const target = step.target ? document.body.querySelector(step.target) : document.body;
        const location = step.location;
        const isFixed = step.position === "fixed";
        const targetRect = target.getBoundingClientRect();
        const targetPosLeft = isFixed ? targetRect.left : __privateMethod(this, _Chaperone_instances, getOffset_fn).call(this, target).left;
        const targetPosTop = isFixed ? targetRect.top : __privateMethod(this, _Chaperone_instances, getOffset_fn).call(this, target).top;
        const targetPosBottom = targetPosTop + targetRect.height;
        const targetPosVertMiddle = targetPosTop + targetRect.height / 2;
        const targetPosCenter = targetPosLeft + targetRect.width / 2;
        const computedZindex = parseInt(__privateMethod(this, _Chaperone_instances, getZindex_fn).call(this, target), 10);
        const targetZindex = step.zIndex || (Number.isNaN(computedZindex) ? this.options.zIndex : computedZindex + 1);
        const windowPosVertMiddle = window.innerHeight / 2;
        const windowPosCenter = window.innerWidth / 2;
        const container = this.options.pageContainerSelector ? document.body.querySelector(this.options.pageContainerSelector) : document.body;
        container.classList.add("chaperone-active");
        throbber.setAttribute("data-stepid", String(i));
        if (step.position === "locked") {
          throbber.style.position = "absolute";
          throbber.style.marginTop = `${step.lockedTop}px`;
          throbber.style.marginLeft = `${step.lockedLeft}px`;
        } else {
          throbber.style.position = step.position || "absolute";
        }
        throbber.style.zIndex = String(targetZindex);
        switch (location) {
          case "bottomMiddle":
            throbber.style.left = `${targetPosCenter}px`;
            throbber.style.top = `${targetPosBottom}px`;
            break;
          case "centerMiddle":
            throbber.style.left = `${targetPosCenter}px`;
            throbber.style.top = `${targetPosVertMiddle}px`;
            break;
          case "windowMiddle":
            throbber.style.zIndex = "1000";
            throbber.style.left = `${windowPosCenter}px`;
            throbber.style.top = `${windowPosVertMiddle}px`;
            break;
          default:
            break;
        }
        if (step.position === "locked") {
          target.insertAdjacentHTML("afterend", throbber.outerHTML);
        } else {
          document.body.appendChild(throbber);
        }
      });
      if (this.options.autoStart) {
        this.open(0);
      }
    }
    /**
     * open - open a specific step by index.
     * @param {number|string} stepId - the index of the step to open.
     */
    open(stepId) {
      const stepIndex = parseInt(stepId, 10);
      const step = this.shownSteps[stepIndex];
      const stepTitle = step.title;
      const stepText = step.message;
      const stepNumber = stepIndex + 1;
      const stepsTotal = this.shownSteps.length;
      const currentThrobber = document.body.querySelector(`[data-stepid="${stepId}"]`);
      const chaperone2 = __privateMethod(this, _Chaperone_instances, createDOMElement_fn).call(this, this.options.chaperoneHTML);
      let targetPosTop;
      if (step.target) {
        const currentElement = document.body.querySelector(step.target);
        targetPosTop = Math.round(__privateMethod(this, _Chaperone_instances, getOffset_fn).call(this, currentElement).top) - 150;
      }
      if (step.position !== "fixed") {
        const scrollingElement = document.scrollingElement || document.documentElement;
        __privateMethod(this, _Chaperone_instances, scrollTo_fn).call(this, scrollingElement, targetPosTop, this.options.animationTime);
      }
      if (currentThrobber) {
        currentThrobber.classList.add("active");
      }
      document.body.appendChild(chaperone2);
      setTimeout(() => {
        const progressContainer = document.body.querySelector(this.options.progressSelector);
        const stepTextContainer = document.body.querySelector(this.options.textSelector);
        const chaperoneActive = document.querySelector(".chaperone-active");
        const titleContainer = document.body.querySelector('[data-hook="chaperone-title"]');
        const nextBtn = document.body.querySelector(this.options.nextSelector);
        const backBtn = document.body.querySelector(this.options.backSelector);
        const finishBtn = document.body.querySelector(this.options.finishSelector);
        progressContainer.textContent = `${stepNumber} of ${stepsTotal}`;
        if (stepTitle) {
          titleContainer.textContent = stepTitle;
        }
        stepTextContainer.textContent = stepText;
        nextBtn.setAttribute("data-stepid", String(stepIndex + 1));
        backBtn.setAttribute("data-stepid", String(stepIndex - 1));
        chaperone2.classList.add("active");
        if (stepNumber === 1) {
          backBtn.classList.add("chaperone-disabled");
        }
        if (stepNumber === stepsTotal) {
          nextBtn.classList.add("hide");
          finishBtn.classList.remove("hide");
        }
        if (step.openEvent) {
          step.openEvent();
        }
        if (this.getCurrentScreenSize() === "mobileLandscape") {
          stepTextContainer.textContent = "This tour does not fit mobile landscape screens. Please turn your phone vertical and refresh the page then, if needed, relaunch the tour.";
          if (chaperoneActive) {
            chaperoneActive.classList.add("message");
          }
        }
      }, 10);
      this.currentStep = stepNumber;
    }
    /**
     * close - close the currently open step's chaperone bubble and throbber.
     */
    close() {
      const currentChaperone = document.body.querySelector(".chaperone");
      const activeThrobber = document.body.querySelector(".throbber.active");
      const activeIndex = activeThrobber?.getAttribute("data-stepid");
      if (activeThrobber) {
        activeThrobber.classList.remove("active");
      }
      if (activeIndex != null && this.shownSteps[activeIndex]?.closeEvent) {
        this.shownSteps[activeIndex].closeEvent();
      }
      if (currentChaperone) {
        currentChaperone.classList.remove("active");
        setTimeout(() => {
          currentChaperone.parentNode?.removeChild(currentChaperone);
        }, this.options.animationTime);
      }
      this.currentStep = null;
    }
    /**
     * endTour - close the tour entirely, removing all throbbers and event listeners.
     */
    endTour() {
      const throbbers = Array.from(document.body.querySelectorAll(".throbber"));
      this.close();
      throbbers.forEach((throbber) => throbber.parentNode?.removeChild(throbber));
      const container = this.options.pageContainerSelector ? document.body.querySelector(this.options.pageContainerSelector) : document.body;
      container.classList.remove("chaperone-active");
      document.body.removeEventListener("click", this.clickHandler);
      window.removeEventListener("resize", this.windowChangeHandler);
      this.shownSteps = null;
      this.options.finishCallback();
    }
    /**
     * getCurrentScreenSize - get the named breakpoint ('mobile' | 'mobileLandscape' | 'tablet' | 'desktop')
     * for the current viewport, based on options.breakpoints.
     */
    getCurrentScreenSize() {
      const width = document.documentElement.clientWidth;
      const { mobile, mobileLandscape, tablet } = this.options.breakpoints;
      if (width < mobile) {
        return "mobile";
      }
      if (width < mobileLandscape && window.innerHeight < window.innerWidth) {
        return "mobileLandscape";
      }
      if (width < tablet) {
        return "tablet";
      }
      return "desktop";
    }
  };
  _Chaperone_instances = new WeakSet();
  handleClick_fn = function(evt) {
    let trigger = evt.target;
    if (trigger.classList.contains("dot") || trigger.classList.contains("close")) {
      trigger = trigger.parentNode;
    }
    const stepId = trigger.getAttribute("data-stepid");
    const finishClose = trigger.matches(this.options.finishSelector) || trigger.matches('[data-hook="close-chaperone"]');
    if (stepId) {
      if (this.currentStep) {
        if (trigger === this.currentStep || trigger === this.currentTrigger) {
          return;
        }
        this.close();
      }
      this.currentTrigger = trigger;
      setTimeout(() => this.open(stepId), this.options.animationTime);
    }
    if (finishClose) {
      this.endTour();
    }
  };
  handleWindowChange_fn = function() {
    const stepTextContainer = document.body.querySelector(this.options.textSelector);
    const chaperoneActive = document.querySelector(".chaperone-active");
    if (stepTextContainer) {
      stepTextContainer.textContent = "Your window has been resized. The tour is variable based on your screen size, please refresh your browser then, if necessary, restart the tour.";
    }
    if (chaperoneActive) {
      chaperoneActive.classList.add("message");
    }
  };
  createDOMElement_fn = function(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.firstElementChild;
  };
  getOffset_fn = function(el) {
    const rect = el.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft
    };
  };
  getZindex_fn = function(el) {
    return window.getComputedStyle(el).getPropertyValue("z-index");
  };
  /**
   * #scrollTo - animate an element's scrollTop toward a target position.
   * Uses a fixed start position + elapsed-time progress ratio (rather than
   * recursively re-deriving a per-tick delta) so it can't blow up toward
   * Infinity when the target is clamped by the page's max scroll extent
   * (e.g. a target near the very bottom of a short page).
   */
  scrollTo_fn = function(element, to, duration) {
    if (Number.isNaN(to)) {
      return;
    }
    if (duration <= 0) {
      element.scrollTop = to;
      return;
    }
    const start = element.scrollTop;
    const change = to - start;
    const startTime = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      element.scrollTop = start + change * progress;
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  };
  var chaperone = new Chaperone();
  var chaperone_default = chaperone;
  return __toCommonJS(chaperone_exports);
})();
var chaperone = chaperoneModule.default;

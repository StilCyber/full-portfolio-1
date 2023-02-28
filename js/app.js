



(() => {
   "use strict";
   class t {
      constructor(t) {
         let e = {
            logging: !0,
            init: !0,
            attributeOpenButton: "data-popup",
            attributeCloseButton: "data-close",
            fixElementSelector: "[data-lp]",
            youtubeAttribute: "data-youtube",
            youtubePlaceAttribute: "data-youtube-place",
            setAutoplayYoutube: !0,
            classes: {
               popup: "popup",
               popupContent: "popup__content",
               popupActive: "popup_show",
               bodyActive: "popup-show",
            },
            focusCatch: !0,
            closeEsc: !0,
            bodyLock: !0,
            bodyLockDelay: 500,
            hashSettings: { location: !0, goHash: !0 },
            on: {
               beforeOpen: function () { },
               afterOpen: function () { },
               beforeClose: function () { },
               afterClose: function () { },
            },
         };
         (this.isOpen = !1),
            (this.targetOpen = { selector: !1, element: !1 }),
            (this.previousOpen = { selector: !1, element: !1 }),
            (this.lastClosed = { selector: !1, element: !1 }),
            (this._dataValue = !1),
            (this.hash = !1),
            (this._reopen = !1),
            (this._selectorOpen = !1),
            (this.lastFocusEl = !1),
            (this._focusEl = [
               "a[href]",
               'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
               "button:not([disabled]):not([aria-hidden])",
               "select:not([disabled]):not([aria-hidden])",
               "textarea:not([disabled]):not([aria-hidden])",
               "area[href]",
               "iframe",
               "object",
               "embed",
               "[contenteditable]",
               '[tabindex]:not([tabindex^="-"])',
            ]),
            (this.options = {
               ...e,
               ...t,
               classes: { ...e.classes, ...t?.classes },
               hashSettings: { ...e.hashSettings, ...t?.hashSettings },
               on: { ...e.on, ...t?.on },
            }),
            this.options.init && this.initPopups();
      }
      initPopups() {
         this.popupLogging("Проснулся"), this.eventsPopup();
      }
      eventsPopup() {
         document.addEventListener(
            "click",
            function (t) {
               const e = t.target.closest(`[${this.options.attributeOpenButton}]`);
               if (e)
                  return (
                     t.preventDefault(),
                     (this._dataValue = e.getAttribute(
                        this.options.attributeOpenButton
                     )
                        ? e.getAttribute(this.options.attributeOpenButton)
                        : "error"),
                     "error" !== this._dataValue
                        ? (this.isOpen || (this.lastFocusEl = e),
                           (this.targetOpen.selector = `${this._dataValue}`),
                           (this._selectorOpen = !0),
                           void this.open())
                        : void this.popupLogging(
                           `Ой ой, не заполнен атрибут у ${e.classList}`
                        )
                  );
               return t.target.closest(`[${this.options.attributeCloseButton}]`) ||
                  (!t.target.closest(`.${this.options.classes.popupContent}`) &&
                     this.isOpen)
                  ? (t.preventDefault(), void this.close())
                  : void 0;
            }.bind(this)
         ),
            document.addEventListener(
               "keydown",
               function (t) {
                  if (
                     this.options.closeEsc &&
                     27 == t.which &&
                     "Escape" === t.code &&
                     this.isOpen
                  )
                     return t.preventDefault(), void this.close();
                  this.options.focusCatch &&
                     9 == t.which &&
                     this.isOpen &&
                     this._focusCatch(t);
               }.bind(this)
            ),
            document.querySelector("form[data-ajax],form[data-dev]") &&
            document.addEventListener(
               "formSent",
               function (t) {
                  const e = t.detail.form.dataset.popupMessage;
                  e && this.open(e);
               }.bind(this)
            ),
            this.options.hashSettings.goHash &&
            (window.addEventListener(
               "hashchange",
               function () {
                  window.location.hash
                     ? this._openToHash()
                     : this.close(this.targetOpen.selector);
               }.bind(this)
            ),
               window.addEventListener(
                  "load",
                  function () {
                     window.location.hash && this._openToHash();
                  }.bind(this)
               ));
      }
      open(t) {
         if (
            (t &&
               "string" == typeof t &&
               "" !== t.trim() &&
               ((this.targetOpen.selector = t), (this._selectorOpen = !0)),
               this.isOpen && ((this._reopen = !0), this.close()),
               this._selectorOpen ||
               (this.targetOpen.selector = this.lastClosed.selector),
               this._reopen || (this.previousActiveElement = document.activeElement),
               (this.targetOpen.element = document.querySelector(
                  this.targetOpen.selector
               )),
               this.targetOpen.element)
         ) {
            if (
               this.targetOpen.element.hasAttribute(this.options.youtubeAttribute)
            ) {
               const t = `https://www.youtube.com/embed/${this.targetOpen.element.getAttribute(
                  this.options.youtubeAttribute
               )}?rel=0&showinfo=0&autoplay=1`,
                  e = document.createElement("iframe");
               e.setAttribute("allowfullscreen", "");
               const o = this.options.setAutoplayYoutube ? "autoplay;" : "";
               e.setAttribute("allow", `${o}; encrypted-media`),
                  e.setAttribute("src", t),
                  this.targetOpen.element.querySelector(
                     `[${this.options.youtubePlaceAttribute}]`
                  ) &&
                  this.targetOpen.element
                     .querySelector(`[${this.options.youtubePlaceAttribute}]`)
                     .appendChild(e);
            }
            this.options.hashSettings.location &&
               (this._getHash(), this._setHash()),
               this.options.on.beforeOpen(this),
               this.targetOpen.element.classList.add(
                  this.options.classes.popupActive
               ),
               document.body.classList.add(this.options.classes.bodyActive),
               this._reopen ? (this._reopen = !1) : o(),
               this.targetOpen.element.setAttribute("aria-hidden", "false"),
               (this.previousOpen.selector = this.targetOpen.selector),
               (this.previousOpen.element = this.targetOpen.element),
               (this._selectorOpen = !1),
               (this.isOpen = !0),
               setTimeout(() => {
                  this._focusTrap();
               }, 50),
               document.dispatchEvent(
                  new CustomEvent("afterPopupOpen", { detail: { popup: this } })
               ),
               this.popupLogging("Открыл попап");
         } else
            this.popupLogging(
               "Ой ой, такого попапа нет. Проверьте корректность ввода. "
            );
      }
      close(t) {
         t &&
            "string" == typeof t &&
            "" !== t.trim() &&
            (this.previousOpen.selector = t),
            this.isOpen &&
            e &&
            (this.options.on.beforeClose(this),
               this.targetOpen.element.hasAttribute(this.options.youtubeAttribute) &&
               this.targetOpen.element.querySelector(
                  `[${this.options.youtubePlaceAttribute}]`
               ) &&
               (this.targetOpen.element.querySelector(
                  `[${this.options.youtubePlaceAttribute}]`
               ).innerHTML = ""),
               this.previousOpen.element.classList.remove(
                  this.options.classes.popupActive
               ),
               this.previousOpen.element.setAttribute("aria-hidden", "true"),
               this._reopen ||
               (document.body.classList.remove(this.options.classes.bodyActive),
                  o(),
                  (this.isOpen = !1)),
               this._removeHash(),
               this._selectorOpen &&
               ((this.lastClosed.selector = this.previousOpen.selector),
                  (this.lastClosed.element = this.previousOpen.element)),
               this.options.on.afterClose(this),
               setTimeout(() => {
                  this._focusTrap();
               }, 50),
               this.popupLogging("Закрыл попап"));
      }
      _getHash() {
         this.options.hashSettings.location &&
            (this.hash = this.targetOpen.selector.includes("#")
               ? this.targetOpen.selector
               : this.targetOpen.selector.replace(".", "#"));
      }
      _openToHash() {
         let t = document.querySelector(
            `.${window.location.hash.replace("#", "")}`
         )
            ? `.${window.location.hash.replace("#", "")}`
            : document.querySelector(`${window.location.hash}`)
               ? `${window.location.hash}`
               : null;
         document.querySelector(`[${this.options.attributeOpenButton}="${t}"]`) &&
            t &&
            this.open(t);
      }
      _setHash() {
         history.pushState("", "", this.hash);
      }
      _removeHash() {
         history.pushState("", "", window.location.href.split("#")[0]);
      }
      _focusCatch(t) {
         const e = this.targetOpen.element.querySelectorAll(this._focusEl),
            o = Array.prototype.slice.call(e),
            s = o.indexOf(document.activeElement);
         t.shiftKey && 0 === s && (o[o.length - 1].focus(), t.preventDefault()),
            t.shiftKey || s !== o.length - 1 || (o[0].focus(), t.preventDefault());
      }
      _focusTrap() {
         const t = this.previousOpen.element.querySelectorAll(this._focusEl);
         !this.isOpen && this.lastFocusEl
            ? this.lastFocusEl.focus()
            : t[0].focus();
      }
      popupLogging(t) {
         this.options.logging && i(`[Попапос]: ${t}`);
      }
   }
   let e = !0,
      o = (t = 500) => {
         document.documentElement.classList.contains("lock") ? s(t) : n(t);
      },
      s = (t = 500) => {
         let o = document.querySelector("body");
         if (e) {
            let s = document.querySelectorAll("[data-lp]");
            setTimeout(() => {
               for (let t = 0; t < s.length; t++) {
                  s[t].style.paddingRight = "0px";
               }
               (o.style.paddingRight = "0px"),
                  document.documentElement.classList.remove("lock");
            }, t),
               (e = !1),
               setTimeout(function () {
                  e = !0;
               }, t);
         }
      },
      n = (t = 500) => {
         let o = document.querySelector("body");
         if (e) {
            let s = document.querySelectorAll("[data-lp]");
            for (let t = 0; t < s.length; t++) {
               s[t].style.paddingRight =
                  window.innerWidth -
                  document.querySelector(".wrapper").offsetWidth +
                  "px";
            }
            (o.style.paddingRight =
               window.innerWidth -
               document.querySelector(".wrapper").offsetWidth +
               "px"),
               document.documentElement.classList.add("lock"),
               (e = !1),
               setTimeout(function () {
                  e = !0;
               }, t);
         }
      };
   function i(t) {
      setTimeout(() => {
         window.FLS && console.log(t);
      }, 0);
   }
   const a = document.querySelectorAll("._anim-items");
   if (a.length > 0) {
      function p(t) {
         for (let t = 0; t < a.length; t++) {
            const e = a[t],
               o = e.offsetHeight,
               s = g(e).top,
               n = 4;
            let i = window.innerHeight - o / n;
            o > window.innerHeight &&
               (i = window.innerHeight - window.innerHeight / n),
               pageYOffset > s - i && pageYOffset < s + o
                  ? e.classList.add("_activeAnim")
                  : e.classList.contains("_anim-no-hide") ||
                  e.classList.remove("_activeAnim");
         }
      }
      function g(t) {
         const e = t.getBoundingClientRect(),
            o = window.pageXOffset || document.documentElement.scrollLeft,
            s = window.pageYOffset || document.documentElement.scrollTop;
         return { top: e.top + s, left: e.left + o };
      }
      window.addEventListener("scroll", p),
         setTimeout(() => {
            p();
         }, 300);
   }
   let l = (t, e = !1, o = 500, n = 0) => {
      const a = document.querySelector(t);
      if (a) {
         let l = "",
            r = document.querySelector("header").offsetHeight;
         e &&
            ((l = "header.header"), (r = document.querySelector(l).offsetHeight));
         let c = {
            speedAsDuration: !0,
            speed: o,
            header: l,
            offset: n,
            easing: "easeOutQuad",
         };
         if (
            (document.documentElement.classList.contains("menu-open") &&
               (s(), document.documentElement.classList.remove("menu-open")),
               "undefined" != typeof SmoothScroll)
         )
            new SmoothScroll().animateScroll(a, "", c);
         else {
            let t = a.getBoundingClientRect().top + scrollY;
            window.scrollTo({ top: r ? t - r : t, behavior: "smooth" });
         }
         i(`[gotoBlock]: Юхуу...едем к ${t}`);
      } else i(`[gotoBlock]: Ой ой..Такого блока нет на странице: ${t}`);
   },
      r = !1;
   setTimeout(() => {
      if (r) {
         let t = new Event("windowScroll");
         window.addEventListener("scroll", function (e) {
            document.dispatchEvent(t);
         });
      }
   }, 0);
   const c = document.querySelector(".bar");
   let u;
   c && (u = c.offsetHeight), (u = 0.82 * u + "px");
   const d = document.querySelector(".impact__container");
   d && d.style.setProperty("padding-bottom", u);
   const h = document.querySelector(".footer__container");
   h && h.style.setProperty("padding-top", u),
      document.addEventListener("DOMContentLoaded", function () {
         var t = document.querySelectorAll("input[data-tel-input]"),
            e = function (t) {
               return t.value.replace(/\D/g, "");
            },
            o = function (t) {
               var o = t.target,
                  s = e(o),
                  n = t.clipboardData || window.clipboardData;
               if (n) {
                  var i = n.getData("Text");
                  if (/\D/g.test(i)) return void (o.value = s);
               }
            },
            s = function (t) {
               var o = t.target,
                  s = e(o),
                  n = o.selectionStart,
                  i = "";
               if (!s) return (o.value = "");
               if (o.value.length == n) {
                  if (["7", "8", "9"].indexOf(s[0]) > -1) {
                     "9" == s[0] && (s = "7" + s);
                     var a = "8" == s[0] ? "8" : "+7";
                     (i = o.value = a + " "),
                        s.length > 1 && (i += "(" + s.substring(1, 4)),
                        s.length >= 5 && (i += ") " + s.substring(4, 7)),
                        s.length >= 8 && (i += "-" + s.substring(7, 9)),
                        s.length >= 10 && (i += "-" + s.substring(9, 11));
                  } else i = "+" + s.substring(0, 16);
                  o.value = i;
               } else t.data && /\D/g.test(t.data) && (o.value = s);
            },
            n = function (t) {
               var e = t.target.value.replace(/\D/g, "");
               8 == t.keyCode && 1 == e.length && (t.target.value = "");
            };
         for (var i of t)
            i.addEventListener("keydown", n),
               i.addEventListener("input", s, !1),
               i.addEventListener("paste", o, !1);
      }),
      (window.FLS = !0),
      (function (t) {
         let e = new Image();
         (e.onload = e.onerror =
            function () {
               t(2 == e.height);
            }),
            (e.src =
               "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA");
      })(function (t) {
         let e = !0 === t ? "webp" : "no-webp";
         document.documentElement.classList.add(e);
      }),
      (function () {
         let t = document.querySelector(".icon-menu");
         t &&
            t.addEventListener("click", function (t) {
               e && (o(), document.documentElement.classList.toggle("menu-open"));
            });
      })(),
      new t({}),
      (function () {
         function t(t) {
            if ("click" === t.type) {
               const e = t.target;
               if (e.closest("[data-goto]")) {
                  const o = e.closest("[data-goto]"),
                     s = o.dataset.goto ? o.dataset.goto : "",
                     n = !!o.hasAttribute("data-goto-header"),
                     i = o.dataset.gotoSpeed ? o.dataset.gotoSpeed : "500";
                  l(s, n, i), t.preventDefault();
               }
            } else if ("watcherCallback" === t.type && t.detail) {
               const e = t.detail.entry,
                  o = e.target;
               if ("navigator" === o.dataset.watch) {
                  const t = o.id,
                     s =
                        (document.querySelector("[data-goto]._navigator-active"),
                           document.querySelector(`[data-goto="${t}"]`));
                  e.isIntersecting
                     ? s && s.classList.add("_navigator-active")
                     : s && s.classList.remove("_navigator-active");
               }
            }
         }
         document.addEventListener("click", t),
            document.addEventListener("watcherCallback", t);
      })(),
      (function () {
         r = !0;
         const t = document.querySelector("header.header"),
            e = t.hasAttribute("data-scroll-show"),
            o = t.dataset.scrollShow ? t.dataset.scrollShow : 500,
            s = t.dataset.scroll ? t.dataset.scroll : 1;
         let n,
            i = 0;
         document.addEventListener("windowScroll", function (a) {
            const l = window.scrollY;
            clearTimeout(n),
               l >= s
                  ? (!t.classList.contains("_header-scroll") &&
                     t.classList.add("_header-scroll"),
                     e &&
                     (l > i
                        ? t.classList.contains("_header-show") &&
                        t.classList.remove("_header-show")
                        : !t.classList.contains("_header-show") &&
                        t.classList.add("_header-show"),
                        (n = setTimeout(() => {
                           !t.classList.contains("_header-show") &&
                              t.classList.add("_header-show");
                        }, o))))
                  : (t.classList.contains("_header-scroll") &&
                     t.classList.remove("_header-scroll"),
                     e &&
                     t.classList.contains("_header-show") &&
                     t.classList.remove("_header-show")),
               (i = l <= 0 ? 0 : l);
         });
      })();
})();


// Валидация форм



document.addEventListener('DOMContentLoaded', function () {
   const form = document.getElementById('form');

   form.addEventListener('submit', formSend);



   async function formSend(e) {
      
      e.preventDefault();
      

      let error = formValidate(form);


/*

      if (error === 0) {
         form.classList.add('_sending');
         let response = await fetch('/fetchRouter', {
            method: 'POST',
            body: FormData
         });
         if (response.ok) {
            let result = await response.json();
            alert(result.message);
            formPreview.innerHTML = '';
            form.reset();
            form.classList.remove('_sending');
         } else {
            alert('Ошибка');
            form.classList.remove('_sending');
         }
         
      }

*/


      if (error === 0) {
         const TOKEN = '5774545506:AAE9-lrkA9R88H5mPYpkblqxVueIqVrIk2g';
         const CHAT_ID = '-1001863589748';
         const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

         let message = `<b>Заявка с сайта</b>\n`;
         message += `<b>Телефон: </b> ${ this.phone.value}\n`;
         message += `<b>Коммент: </b> ${ this.comment.value}`;
      
         axios.post(URI_API, {
            chat_id: CHAT_ID,
            parse_mode: 'html',
            text: message
         })
         .then((res) => {

            form.reset();
 
            alert('Заявка отправлена!');
            window.location.href = '/';

         })
         .catch((err) => {
            console.log(err);

         })

      }



   };

   function formValidate(form) {
      let error = 0;

      let formReq = document.querySelectorAll('._req');

      for (let index = 0; index < formReq.length; index++) {
         const input = formReq[index];
         formRemoveError(input);

         if (input.getAttribute('type') === "checkbox" && input.checked === false) {
            formAddError(input);
            error++;

         } else {
            if (input.value === "") {
               formAddError(input);
               error++;

            }
         }
      }
      return error;
   };



   function formAddError(input) {
      // input.parentElement.classList.add('_error');
      input.classList.add('_error');
   };

   function formRemoveError(input) {
      // input.parentElement.classList.remove('_error');
      input.classList.remove('_error');
   };


});

//

/*
document.getElementById('form').onsubmit = function() {
   setTimeout(function() {

      window.location.href = '/';
      //location.reload(true);
      
      let closeForm = document.getElementById('popup');
      if (closeForm) {
         this.close(closeForm);
      }
      
      

      
   }, 1000);

}
*/

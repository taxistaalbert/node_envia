// MAIN ENTRYPOINT
function initwebchat(obj, onWebChatReady, onClickWebChatButton) {
  if (window.navigator.userAgent.indexOf("Trident") == -1) {
    integrawebchat();
  } else {
    noSupport();
  }

  // EVENT CONSTANTS
  const CLICKBAR_EVENT = "CLICKBAR";
  const APP_READY_EVENT = "APP_READY";
  const OPEN_NEW_WINDOW_EVENT = "OPEN_NEW_WINDOW";
  const MINIMIZE_EVENT = "MINIMIZE";
  const NEWMESSAGE_EVENT = "NEWMESSAGE";
  const SET_COLOR_EVENT = "SET_COLOR";
  const MAKE_CALL_EVENT = "MAKE_CALL";
  const HANGUP_CALL_EVENT = "HANGUP_CALL";
  const CLOSING_EXTERNAL_EVENT = "CLOSING_EXTERNAL";
  const ISMOBILE_EVENT = "ISMOBILE";
  const ISLOWRES_EVENT = "ISLOWRES";
  const ONLOAD_EVENT = "ONLOAD";
  const CURRENT_URL = "CURRENT_URL";
  const ISIOS_EVENT = "ISIOS";
  const RELOAD_EVENT = "RELOAD";
  const FINISH_EVENT = "FINISH";
  const REQUEST_PERMISSION = "REQUEST_NOTIFICATION_PERMISSION";
  const WEBCHAT_READY = "WEBCHAT_READY";
  const WEBCHAT_EVENT = "WEBCHAT_EVENT";
  const WEBCHAT_SIZE = "WEBCHAT_SIZE";
  let isChatOpen = false;
  let appColor = "#fff";
  let messageQuant = 0;
  let webchatIframe;

  function integrawebchat() {
    init();
  }

  /**
   * @name INIT
   * @desc Initialices main css ands loads Webchat Iframe
   */
  function init() {
    loadCSS();
  }

  /**
   * @name LOAD_CSS
   * @desc Loads main css depending on enviroment
   */
  function loadCSS() {
    try {
      fetch(getCssUrl()).then((response) => {
        response.text().then((css) => {
          let webchatCss = document.createElement("style");
          webchatCss.innerHTML = css;

          // Loading Css async
          document.body.appendChild(webchatCss);
          // Once the styles are loaded, we load the iframe
          loadIframe();
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @name GET_CSS_URL
   * @desc Resolves css url based on env
   */
  function getCssUrl() {
    // Returns url based on enviroment
    if (obj.debug) {
      return "http://" + document.domain + ":8080/styles.css";
    } else {
      return "https://" + obj.ip + "/webchatclient/styles.css";
    }
  }

  /**
   * @name GET_IFRAME_URL
   * @desc Resolves iframe url based on env
   */
  function getIframeUrl() {
    // Returns url based on enviroment
    if (obj.debug) {
      return "http://" + document.domain + ":8080/#/" + makeURLExtension();
    } else {
      return "https://" + obj.ip + "/webchatclient/#/" + makeURLExtension();
    }
  }

  /**
   * @name MAKE_URL_EXTENSION
   * @desc Returns string with params for URL formation
   */
  function makeURLExtension() {
    return `?ip=${obj.ip}&campaign=${obj.campaign}`;
  }

  function makeInteractionParameters(name, email, message, number) {
    return `&name=${name}&mail=${email}&number=${number}&initialMessage=${
      message || ""
    }`;
  }

  /**
   * @name LOAD_IFRAME
   * @desc Injects Iframe html
   */
  function loadIframe() {
    let mainDiv = document.createElement("div");
    webchatIframe = document.createElement("iframe");
    let mainButton = document.createElement("button");
    let messageBadge = document.createElement("div");
    let messageHolder = document.createElement("div");
    let buttonMessage = document.createElement("div");
    let buttonCloseMessage = document.createElement("button");

    //webchat Iframe
    webchatIframe.allowFullscreen = true;
    webchatIframe.id = "iframeWebChat";
    webchatIframe.src = getIframeUrl(obj);
    webchatIframe.allow = "microphone; camera; display-capture";

    // Main div, iframe holder
    mainDiv.id = "integrawebchatmaindivcontent";

    mainDiv.style.zoom = zoom();
    function zoom() {
      if (localStorage.vuex) {
        let vuex = JSON.parse(localStorage.vuex);
        if (Array.isArray(vuex)) {
          let webchat =
            vuex[
              vuex.findIndex(
                (e) =>
                  e.configuration.campaign ===
                  window.location.href
                    .substring(window.location.href.indexOf("campaign="))
                    .split("=")[1]
              )
            ];
          return `1.${webchat ? webchat.client.accessibility.fontSize : 0}`;
        }
        return "1.0";
      }
      return "1.0";
    }

    // Chat toggler button
    mainButton.id = "startChat";
    mainButton.onclick = function () {
      toggleChat();
      if (typeof onClickWebChatButton === "function") onClickWebChatButton();
      if (typeof objReturn.onClickButton === "function")
        objReturn.onClickButton();
    };
    mainButton.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 510 510" style="enable-background:new 0 0 510 510;" xml:space="preserve">
                     <g id="chaticon">
                       <path d="M484.5,102h-51v229.5H102v51c0,15.3,10.2,25.5,25.5,25.5H408l102,102V127.5C510,112.2,499.8,102,484.5,102z M382.5,255    V25.5C382.5,10.2,372.3,0,357,0H25.5C10.2,0,0,10.2,0,25.5v357l102-102h255C372.3,280.5,382.5,270.3,382.5,255z"/>
                     </g>
                   </svg>`;

    // Button badge for new unread messages
    messageBadge.classList.add("badgeCounter");
    messageBadge.id = "BadgeCounter";
    messageBadge.innerHTML += "1";

    messageHolder.classList.add("unread-messages-holder");

    // Button Message
    buttonMessage.id = "buttonMessage";
    buttonMessage.classList.add("button-message");
    buttonMessage.style.display = "none";
    buttonMessage.innerHTML += `<div class="button-message-p">${obj.buttonMessage}</div>`;

    buttonCloseMessage.classList.add("button-message-close");
    buttonCloseMessage.innerHTML += `<div class="">
        <svg width="1em" height="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs>
        <path d="M2.276.39L12 10.115 21.724.391c.486-.486 1.254-.519 1.777-.098l.108.098c.521.52.521 1.364 0 1.885L13.886 12l9.723 9.724c.521.52.521 1.365 0 1.885-.52.521-1.364.521-1.885 0L12 13.886l-9.724 9.723c-.486.486-1.254.519-1.777.098l-.108-.098c-.521-.52-.521-1.364 0-1.885L10.114 12 .391 2.276C-.13 1.756-.13.911.39.391.91-.13 1.755-.13 2.276.39z" id="close__a">
        </path></defs><use xlink:href="#close__a" fill-rule="evenodd"></use></svg></div>`;

    buttonCloseMessage.onclick = function () {
      if (document.getElementById("buttonMessage"))
        document.getElementById("buttonMessage").remove();
    };

    if (obj.buttonMessage) {
      buttonMessage.appendChild(buttonCloseMessage);
      document.body.appendChild(buttonMessage);
    }

    document.body.appendChild(mainButton);
    document.body.appendChild(messageBadge);
    document.body.appendChild(mainDiv);
    document.body.appendChild(messageHolder);
    mainDiv.appendChild(webchatIframe);

    registerProxy();

    webchatIframe.onload = () => {
      if (sessionStorage.getItem("isWebchatOpen") === "true") openChat();
    };
  }

  /**
   * @name REGISTER_PROXY
   * @desc Registers event listener for iframe events
   */
  function registerProxy() {
    window.addEventListener(
      "message",
      (event) => {
        switch (event.data.action) {
          // Trying to minimize in mobile
          case MINIMIZE_EVENT:
            toggleChat();
            break;
          // iframe sending us app color
          case SET_COLOR_EVENT:
            // Setting button color
            appColor = event.data.color;
            setButtonColor();

            // Sending resolution to main App
            document
              .getElementById("iframeWebChat")
              .contentWindow.postMessage(
                { action: ISLOWRES_EVENT, state: lowRes() },
                "*"
              );
            window.onresize = () => {
              // Creating eventHandler on resize so main app always knows current resolution
              document
                .getElementById("iframeWebChat")
                .contentWindow.postMessage(
                  { action: ISLOWRES_EVENT, state: lowRes() },
                  "*"
                );
            };

            //Show Button Message
            if (obj.buttonMessage)
              document.getElementById("buttonMessage").style.display = "";

            // Checking last webchat state (opened,closed)
            // Timeout is needed so animation shows in time
            break;
          case CURRENT_URL:
            // Sends current url to webchat's vue app
            updateCurrentURL();
            break;
          case NEWMESSAGE_EVENT:
            if (!event.data.message.self)
              injectNewMessage(
                event.data.message.message,
                event.data.message.bot
              );
            break;
          case REQUEST_PERMISSION:
            Notification.requestPermission();
            break;
          case WEBCHAT_READY:
            if (typeof onWebChatReady === "function") onWebChatReady();
            if (typeof objReturn.onWebChatReady === "function")
              objReturn.onWebChatReady();
            break;
          case WEBCHAT_EVENT:
            if (typeof objReturn.onWebChatEvent === "function")
              objReturn.onWebChatEvent(event.data.data);
            break;
          case WEBCHAT_SIZE:
            document.getElementById(
              "integrawebchatmaindivcontent"
            ).style.zoom = `1.${event.data.size}`;
            break;
        }
      },
      false
    );
  }

  function updateCurrentURL() {
    webchatIframe.contentWindow.postMessage(
      {
        action: CURRENT_URL,
        state: JSON.stringify({
          URL: webchatTraceUserPath(),
          title: getPageTitle(),
        }),
      },
      "*"
    );
  }

  /**
   * @name  SET_BUTTON_COLOR
   * @desc  Sets main button color
   * @param color
   */
  function setButtonColor() {
    let button = document.getElementById("startChat");
    let chaticon = document.getElementById("chaticon").children[0];

    chaticon.style.fill = invertColor(appColor);
    button.style = "background-color:" + appColor;
    button.classList.add("buttonReady");
  }

  /**
   * @name INJECT_NEW_MESSAGE
   * @desc Injects div with new message when the chat is closed
   */
  function injectNewMessage(message_text, bot) {
    if (!isChatOpen) {
      messageQuant++;
      // Creating a div with the new received message and showing to client
      if (!bot) {
        let message = document.createElement("div");
        message.classList.add("wc-new-message");
        message.innerHTML += message_text;

        // Appending message to holder and resizing it
        let holder = document.querySelector(".unread-messages-holder");
        holder.classList.add("show");
        holder.appendChild(message);

        // Resizing holder, accounting for padding and margin per message
        holder.style.height =
          holder.clientHeight + message.clientHeight + 8 + "px";

        // We wait a few seconds to show the element so the animation is shown properly
        setTimeout(() => {
          message.classList.add("show");
        }, 200);

        //We hide the message after a 6 sec timeout
        setTimeout(() => {
          message.classList.remove("show");
        }, 6000);
      }

      // Since a new message was received, we show the badge with the corresponding messages number
      let badge = document.getElementById("BadgeCounter");
      badge.innerHTML = messageQuant;
      badge.classList.add("show");
    }
  }

  /**
   * @name INVERT_COLOR
   * @desc Takes a color && returns the oposit
   * @returns {string}
   */
  invertColor = (hex = "#FFFFFF", bw = true) => {
    function padZero(str, len) {
      len = len || 2;
      var zeros = new Array(len).join("0");
      return (zeros + str).slice(-len);
    }
    //https://stackoverflow.com/questions/35969656
    if (hex.indexOf("#") === 0) {
      hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
      throw new Error("Invalid HEX color.");
    }
    var r = parseInt(hex.slice(0, 2), 16),
      g = parseInt(hex.slice(2, 4), 16),
      b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
      // http://stackoverflow.com/a/3943023/112731
      return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#0F120F" : "#F1F2EB";
    }
  };

  /**
   * @name  TOGGLE_CHAT
   * @desc  toggles the chat open/close
   */
  function toggleChat(toggle) {
    isChatOpen = !isChatOpen;
    sessionStorage.setItem("isWebchatOpen", isChatOpen);

    // Hiding message badge since the client is opening the chat
    let badge = document.getElementById("BadgeCounter");
    badge.innerHTML = messageQuant;
    badge.classList.remove("show");
    messageQuant = 0;

    // Hinding floating messages since the client is opening the chat
    document.querySelector(".unread-messages-holder").classList.remove("show");

    if (obj.buttonMessage) {
      if (document.getElementById("buttonMessage"))
        document.getElementById("buttonMessage").remove();
    }

    // Toggling iframe classes to hide/show respectibly
    document.getElementById("iframeWebChat").classList.toggle("showIframe");
    document
      .getElementById("integrawebchatmaindivcontent")
      .classList.toggle("isWebchatOpen");
    if (checkMobile()) {
      document.getElementById("startChat").classList.toggle("hide");
    }
  }

  function openChat() {
    if (!isChatOpen) {
      isChatOpen = true;
      sessionStorage.setItem("isWebchatOpen", "true");

      // Hiding message badge since the client is opening the chat
      let badge = document.getElementById("BadgeCounter");
      badge.innerHTML = messageQuant;
      badge.classList.remove("show");
      messageQuant = 0;

      // Hinding floating messages since the client is opening the chat
      document
        .querySelector(".unread-messages-holder")
        .classList.remove("show");

      // Toggling iframe classes to hide/show respectibly
      document.getElementById("iframeWebChat").classList.add("showIframe");
      document
        .getElementById("integrawebchatmaindivcontent")
        .classList.add("isWebchatOpen");
      if (checkMobile()) {
        document.getElementById("startChat").classList.add("hide");
      }
    }
  }

  /**
   * @name  NO_SUPPORT
   * @desc  Lets user know the device he/she is using
   *        is not supported by the app
   */
  function noSupport() {
    let text = {
      en: "Browser not supported",
      es: "Navegador no soportado",
      pt: "navegador não suportado",
    };

    document.body.innerHTML +=
      '<div style="width: 300px;height: 50px;background-color: #fff;color: #8888;position: fixed;text-transform: uppercase;text-align: center;font-family: sans-serif;bottom: -1px;right: 10px;border: 1px solid #b7b7b7;border-top-left-radius: 4px;border-top-right-radius: 4px;"><span style="position: relative;top: 16px;">' +
      text[navigator.language.split("-")[0]] +
      "</span></div>";
  }

  function checkMobile() {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
        navigator.userAgent
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        navigator.userAgent.substr(0, 4)
      )
    ) {
      return true;
    }
    return false;
  }

  function lowRes() {
    return window.innerWidth < 769;
  }

  /**
   * @name  TRACE_USER_PATH
   * @desc  Lets agents know the current url of a costumer
   */
  function webchatTraceUserPath() {
    return window.location.href;
  }
  function getPageTitle() {
    return document.head.getElementsByTagName("title")[0].innerText;
  }

  function startInteraction(name, email, message, number) {
    webchatIframe.src =
      getIframeUrl() + makeInteractionParameters(name, email, message, number);
    //webchatIframe.contentWindow.location.reload();
    webchatIframe.contentWindow.postMessage({ action: RELOAD_EVENT }, "*");
  }

  function endInteraction() {
    webchatIframe.contentWindow.postMessage({ action: FINISH_EVENT }, "*");
  }
  let objReturn = {
    toggleChat,
    badgeMessage: injectNewMessage,
    startInteraction,
    updateCurrentURL,
    endInteraction,
  };

  return objReturn;
}

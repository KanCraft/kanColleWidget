/// <reference types="chrome" />

import MessageListener from "../Applications/Background/Routers/Message";
chrome.runtime.onMessage.addListener(MessageListener);

import Config from "../Applications/Models/Config";

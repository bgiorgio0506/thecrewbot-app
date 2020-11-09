const { openStreamDeck, listStreamDecks, }  = require('elgato-stream-deck',);
const path = require('path',);

/**
 * @description get streamDeck and return a streamdec typeof
 */
exports.getStreamDeckInfo = () => {
    return openStreamDeck();
};

/**
 * @description get streamdeck list
 */
exports.getStreamDeckList = () => {
    return listStreamDecks();
};

/**
 * @description clear a specifided key on your streamDeck
 * @param {object} streamDeck
 * @param {number} keyIndex
 */
exports.clearStreamDeckKey = (streamDeck ,keyIndex,) => {
    return streamDeck.clearKey(keyIndex,);
};

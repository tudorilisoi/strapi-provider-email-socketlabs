"use strict"

/**
 * Module dependencies
 */

/* eslint-disable import/no-unresolved */
/* eslint-disable prefer-template */

const { SocketLabsClient } = require('@socketlabs/email')
const htmlToText = require('html-to-text');
const { removeUndefined } = require('strapi-utils')

function extractEmail(senderField) {
    const m = senderField.match(/<([^>]*)>/)
    return m ? m[1] : senderField
}

/* eslint-disable no-unused-vars */
module.exports = {
    init: (providerOptions = {}, settings = {}) => {

        const { serverId, injectionApiKey } = providerOptions
        console.log(`injectionApiKey`, injectionApiKey)
        console.log(`serverId`, serverId)

        const client = new SocketLabsClient(+serverId, injectionApiKey)

        return {
            send: async options => {

                try {
                    let { from, to, cc, bcc, replyTo, subject, text, html, ...rest } = options

                    html = html || text
                    text = text || html
                    text = htmlToText.fromString(text, {
                        wordwrap: null
                    });

                    // cannot format sendaer as name <email>

                    const message = {
                        to,
                        from: extractEmail(from || settings.defaultFrom),
                        subject,
                        textBody: text,
                        htmlBody: html,
                        cc,
                        bcc: bcc || settings.bcc,
                        messageType: 'basic',
                        // replyTo: replyTo || settings.defaultReplyTo,
                    }
                    console.log(`message`, message)

                    const res = await client.send(message)
                    console.log(`MAIL SENT`, res)

                } catch (error) {
                    console.log(`MAIL ERROR`, error)
                    throw error
                }

            },
        }
    },

}

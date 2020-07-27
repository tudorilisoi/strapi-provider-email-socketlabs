"use strict"

/**
 * Module dependencies
 */

/* eslint-disable import/no-unresolved */
/* eslint-disable prefer-template */

const { SocketLabsClient } = require('@socketlabs/email')
const { removeUndefined } = require('strapi-utils')

/* eslint-disable no-unused-vars */
module.exports = {
    init: (providerOptions = {}, settings = {}) => {
        /* const auth = {
          type: "oauth2",
          user: providerOptions.username,
          clientId: providerOptions.clientId,
          clientSecret: providerOptions.clientSecret,
          refreshToken: providerOptions.refreshToken,
          // accessToken: providerOptions.accessToken,
          // expires: 1484314697598
        } */
        const { serverId, injectionApiKey } = providerOptions
        const client = new SocketLabsClient(serverId, injectionApiKey)

        return {
            send: options => {

                const { from, to, cc, bcc, replyTo, subject, text, html, ...rest } = options

                const message = {
                    to,
                    from: from || settings.defaultFrom,
                    subject,
                    textBody: text,
                    // htmlBody: "<html>This message was sent using the SocketLabs Node.js library!</html>",
                    messageType: 'basic',
                    cc,
                    bcc: bcc || settings.bcc,
                    replyTo: replyTo || settings.defaultReplyTo,
                }

                client.send(message).then(
                    (res) => {
                        //Handle successful API call
                        console.log('MAIL SENT!', message)
                        console.log(res)
                    },
                    (err) => {
                        //Handle error making API call
                        console.log(err)
                        throw err
                    })
                // console.log(`sending mail....`, removeUndefined(msg))

            },
        }
    },
}

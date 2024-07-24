import {SanityAssetDocument} from '@sanity/client'

export default {
  name: 'chat',
  title: 'Chat',
  type: 'document',
  fields: [
    {
      name: 'message',
      title: 'Message',
      type: 'string',
      validation: (Rule: SanityAssetDocument) => Rule.required(),
    },
    {
      name: 'conversation',
      title: 'Conversation',
      type: 'reference',
      to: [{type: 'conversation'}],
    },
    {
      name: 'sender',
      title: 'Sender',
      type: 'reference',
      to: [{type: 'user'}],
      weak: true,
      validation: (Rule: SanityAssetDocument) => Rule.required(),
    },
    {
      name: 'sentStatus',
      title: 'SentStatus',
      type: 'boolean',
      initaialValue: true,
    },
    {
      name: 'receiveStatus',
      title: 'receiveStatus',
      type: 'boolean',
      initaialValue: false,
    },
  ],
}

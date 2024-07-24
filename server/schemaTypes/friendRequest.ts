import {SanityAssetDocument} from '@sanity/client'

export default {
  name: 'friendRequest',
  title: 'Friend Request',
  type: 'document',
  fields: [
    {
      name: 'sentBy',
      title: 'SentBy',
      type: 'reference',
      weak: true,
      to: [{type: 'user'}],
      validation: (Rule: SanityAssetDocument) => Rule.required(),
    },
    {
      name: 'recieveBy',
      title: 'RecieveBy',
      type: 'reference',
      weak: true,
      to: [{type: 'user'}],
      validation: (Rule: SanityAssetDocument) => Rule.required(),
    },
    {
      name: 'status',
      title: 'status',
      type: 'string',
      initialValue: 'pending',
      options: {
        list: ['pending', 'accepted', 'rejected'],
      },
    },
  ],
}

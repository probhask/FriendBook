import {SanityAssetDocument} from '@sanity/client'

export default {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: SanityAssetDocument) => Rule.required(),
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
    },
    {
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule: SanityAssetDocument) => Rule.required(),
    },
    {
      // Stores a bcrypt hash only. Written exclusively by the auth backend
      // (netlify/functions) — never a plaintext password.
      name: 'password',
      title: 'Password Hash',
      type: 'string',
      readOnly: true,
      hidden: true,
    },
    {
      name: 'city',
      title: 'City',
      type: 'string',
    },
    {
      name: 'isLoggedIn',
      title: 'IsLoggedIn',
      type: 'boolean',
      initialValue: false,
    },
  ],
  preview: {
    select: {title: 'name', subtitle: 'email', media: 'profileImage'},
  },
}

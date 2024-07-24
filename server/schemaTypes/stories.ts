export default {
  name: 'stories',
  title: 'Stories',
  type: 'document',
  fields: [
    {
      name: 'media',
      title: 'media',
      type: 'image',
    },
    {
      name: 'postedBy',
      title: 'PostedBy',
      type: 'reference',
      to: [{type: 'user'}],
    },
  ],
}

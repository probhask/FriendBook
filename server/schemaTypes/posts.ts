export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    {
      name: 'postDesc',
      title: 'Post Description',
      type: 'string',
    },
    {
      name: 'image',
      title: 'image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'tagUser',
      title: 'Tag User',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'user'}]}],
    },
    {
      name: 'postedBy',
      title: 'PostedBy',
      type: 'reference',
      to: [{type: 'user'}],
    },
  ],
}
